import { useEffect, useState } from 'react';
import Content from '@/components/Content';
import Meta from '@/components/Meta';
import { AccountLayout } from '@/layouts/index';
import Modal from '@/components/Modal';
import AddCandidateForm from '@/components/AddCandidateForm';
import { useWorkspace } from '@/providers/workspace';

const Candidates = () => {
  const { workspace } = useWorkspace();
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    if (workspace?.slug) {
      fetch(`/api/workspace/${workspace.slug}/candidates`)
        .then((res) => res.json())
        .then((data) => setCandidates(data?.data?.candidates || []))
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

  const handleCreateScreeningLink = async (candidateId) => {
    if (workspace?.slug) {
      try {
        const response = await fetch(`/api/workspace/${workspace.slug}/candidates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'createScreeningLink',
            candidateId,
            screeningLink: `https://interview-platform.com/screening/${candidateId}`,
            linkExpiration: new Date(Date.now() + 24 * 60 * 60 * 1000),
          }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          throw new Error(`Error: ${response.statusText}`);
        }
        const newScreeningLink = await response.json();
        const updatedCandidates = candidates.map((candidate) =>
          candidate.id === candidateId ? { ...candidate, ...newScreeningLink.data.screeningLink } : candidate
        );
        setCandidates(updatedCandidates);
      } catch (error) {
        console.error('Error creating screening link:', error);
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
        <Meta title={`Intrvyu - ${workspace.name} | Candidates`} />
        <div className="title-bar">
          <Content.Title title="Candidates" subtitle="Manage your candidates here" />
          <button onClick={toggleModal} className="btn btn-primary">
            Add Candidate
          </button>
        </div>
        <Content.Divider />
        <Content.Container>
          {candidates.length > 0 ? (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Screening Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{candidate.name}</td>
                    <td className="border px-4 py-2">{candidate.email}</td>
                    <td className="border px-4 py-2">{candidate.screeningStatus || 'N/A'}</td>
                    <td className="border px-4 py-2">
                      {candidate.screeningStatus === 'completed' ? (
                        <button className="text-blue-500" onClick={() => viewScreeningDetails(candidate.id)}>View Screening Details</button>
                      ) : (
                        <button className="text-blue-500" onClick={() => handleCreateScreeningLink(candidate.id)}>Create Screening Link</button>
                      )}
                      <button className="text-green-500 ml-2">Edit</button>
                      <button className="text-red-500 ml-2">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No candidates found.</p>
          )}
        </Content.Container>
        <Modal show={isModalOpen} toggle={toggleModal} title="Add Candidate">
          <AddCandidateForm onAddCandidate={handleAddCandidate} />
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

export default Candidates;
