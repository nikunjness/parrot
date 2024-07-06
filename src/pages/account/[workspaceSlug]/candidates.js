// src/pages/account/[workspaceSlug]/candidates.js
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import Content from '@/components/Content';
import Meta from '@/components/Meta';
import { AccountLayout } from '@/layouts/index';
import Modal from '@/components/Modal';
import AddCandidateForm from '@/components/AddCandidateForm';
import { useWorkspace } from '@/providers/workspace';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import prisma from '@/prisma/index';

const Candidates = ({ isTeamOwner, workspace, jobs }) => {
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCandidate, setEditCandidate] = useState(null);

  useEffect(() => {
    if (workspace?.slug) {
      // Fetch candidates from the API
      fetch(`/api/workspace/${workspace.slug}/candidates`)
        .then((res) => res.json())
        .then((data) => setCandidates(data.data.candidates))
        .catch((error) => console.error('Error fetching candidates:', error));
    }
  }, [workspace]);

  const handleAddCandidate = async (candidate) => {
    if (workspace?.slug) {
      try {
        const response = await fetch(`/api/workspace/${workspace.slug}/candidates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(candidate),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          throw new Error(`Error: ${response.statusText}`);
        }

        const newCandidate = await response.json();
        setCandidates([...candidates, newCandidate.data.candidate]);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error adding candidate:', error);
      }
    } else {
      console.error('Workspace slug is not available');
    }
  };

  const handleEditCandidate = async (candidate) => {
    if (workspace?.slug) {
      try {
        const response = await fetch(`/api/workspace/${workspace.slug}/candidates`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(candidate),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          throw new Error(`Error: ${response.statusText}`);
        }

        const updatedCandidate = await response.json();
        setCandidates(candidates.map((c) => (c.id === updatedCandidate.data.candidate.id ? updatedCandidate.data.candidate : c)));
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error editing candidate:', error);
      }
    } else {
      console.error('Workspace slug is not available');
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (workspace?.slug) {
      try {
        const response = await fetch(`/api/workspace/${workspace.slug}/candidates`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          throw new Error(`Error: ${response.statusText}`);
        }

        setCandidates(candidates.filter((c) => c.id !== id));
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    } else {
      console.error('Workspace slug is not available');
    }
  };

const toggleModal = () => {
  setEditCandidate(null); // Reset the form state for adding a new candidate
  setIsModalOpen(!isModalOpen);
};

  const handleEditClick = (candidate) => {
    setEditCandidate(candidate);
    setIsModalOpen(true);
  };

  return (
    workspace && (
      <AccountLayout>
        <Meta title={`Intrvyu - ${workspace.name} | Candidates`} />
        <div className="title-bar">
          <Content.Title title="Candidates" subtitle="Manage your candidates here" />
          <button onClick={toggleModal} className="btn btn-primary">
            Add Candidate
          </button>
        </div>
        <Content.Divider />
        <Content.Container>
          <table className="table-fixed w-full">
            <thead className="text-gray-400 border-b">
              <tr>
                <th className="py-3 text-left">S.No</th>
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Email</th>
                <th className="py-3 text-left">Job</th>
                <th className="py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {candidates.map((candidate, index) => (
                <tr key={candidate.id}>
                  <td className="py-3">{index + 1}</td>
                  <td className="py-3">{candidate.name}</td>
                  <td className="py-3">{candidate.email}</td>
                  <td className="py-3">{candidate.job?.title}</td>
                  <td className="py-3">
                    <button className="text-blue-600 hover:underline" onClick={() => handleEditClick(candidate)}>
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline ml-2" onClick={() => handleDeleteCandidate(candidate.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Content.Container>
        <Modal show={isModalOpen} toggle={toggleModal} title={editCandidate ? 'Edit Candidate' : 'Add Candidate'}>
          <AddCandidateForm
            onAddCandidate={editCandidate ? handleEditCandidate : handleAddCandidate}
            jobs={jobs}
            candidate={editCandidate}
          />
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
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 10px;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f4f4f4;
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
  let jobs = [];

  if (session) {
    workspace = await getWorkspace(
      session.user.userId,
      session.user.email,
      context.params.workspaceSlug
    );

    if (workspace) {
      isTeamOwner = isWorkspaceOwner(session.user.email, workspace);
      jobs = await prisma.job.findMany({
        where: { workspaceId: workspace.id },
        select: { id: true, title: true },
      });
    }
  }

  return {
    props: {
      isTeamOwner,
      workspace,
      jobs,
    },
  };
};

export default Candidates;
