import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import Content from '@/components/Content';
import Meta from '@/components/Meta';
import { AccountLayout } from '@/layouts/index';
import Modal from '@/components/Modal';
import AddJobForm from '@/components/AddJobForm';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';

const Jobs = ({ isTeamOwner, workspace }) => {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (workspace?.slug) {
      fetch(`/api/workspace/${workspace.slug}/jobs`)
        .then((res) => res.json())
        .then((data) => {
          if (data.data.jobs) setJobs(data.data.jobs);
        })
        .catch((error) => console.error('Error fetching jobs:', error));
    }
  }, [workspace]);

  const handleAddJob = async (job) => {
    if (workspace?.slug) {
      try {
        const response = await fetch(`/api/workspace/${workspace.slug}/jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(job),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          throw new Error(`Error: ${response.statusText}`);
        }
        const newJob = await response.json();
        setJobs([...jobs, newJob.data.job]);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error adding job:', error);
      }
    } else {
      console.error('Workspace slug is not available');
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    workspace && (
      <AccountLayout>
        <Meta title={`Intrvyu - ${workspace.name} | Jobs`} />
        <div className="title-bar">
          <Content.Title title="Jobs" subtitle="Manage your jobs here" />
          <button onClick={toggleModal} className="btn btn-primary">
            Add Job
          </button>
        </div>
        <Content.Divider />
        <Content.Container>
          <ul>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <li key={job.id}>{job.title}</li>
              ))
            ) : (
              <p>No jobs found</p>
            )}
          </ul>
        </Content.Container>
        <Modal show={isModalOpen} toggle={toggleModal} title="Add Job">
          <AddJobForm onAddJob={handleAddJob} />
        </Modal>
        <style jsx>{`
          .title-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .btn {
            padding: 10px 20px;
            background-color: #0070f3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          .btn-primary {
            background-color: #0070f3;
          }
        `}</style>
      </AccountLayout>
    )
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  let isTeamOwner = false;
  let workspace = null;

  if (session) {
    workspace = await getWorkspace(
      session.user.userId,
      session.user.email,
      context.params.workspaceSlug
    );

    if (workspace) {
      const { host } = new URL(process.env.APP_URL);
      isTeamOwner = isWorkspaceOwner(session.user.email, workspace);
      workspace.host = host;
      workspace.hostname = `${workspace.slug}.${host}`;
    }
  }

  return {
    props: {
      isTeamOwner,
      workspace,
    },
  };
};

export default Jobs;
