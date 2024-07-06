import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Content from '@/components/Content';
import Meta from '@/components/Meta';
import { AccountLayout } from '@/layouts/index';
import Modal from '@/components/Modal';
import AddJobForm from '@/components/AddJobForm';
import { useWorkspace } from '@/providers/workspace';

const Jobs = () => {
  const { workspace } = useWorkspace();
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (workspace?.slug) {
      fetch(`/api/workspace/${workspace.slug}/jobs`)
        .then((res) => res.json())
        .then((data) => setJobs(data?.data?.jobs || []))
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
          {jobs.length > 0 ? (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Candidates Applied</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr key={job.id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{job.title}</td>
                    <td className="border px-4 py-2">{job.candidates.length}</td>
                    <td className="border px-4 py-2">
                      <button className="text-blue-500">View</button>
                      <button className="text-green-500 ml-2">Edit</button>
                      <button className="text-red-500 ml-2">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No jobs found.</p>
          )}
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
          .table-auto {
            width: 100%;
            border-collapse: collapse;
          }
          .border {
            border: 1px solid #ddd;
          }
          .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
          .text-blue-500 {
            color: #0070f3;
          }
          .text-green-500 {
            color: #10b981;
          }
          .text-red-500 {
            color: #ef4444;
          }
        `}</style>
      </AccountLayout>
    )
  );
};

export default Jobs;
