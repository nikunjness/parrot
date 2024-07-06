// src/components/AddCandidateForm/index.js
import { useState, useEffect } from 'react';

const AddCandidateForm = ({ onAddCandidate, jobs, candidate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobId, setJobId] = useState('');
  const [resumeLink, setResumeLink] = useState('');

  useEffect(() => {
    if (candidate) {
      setName(candidate.name);
      setEmail(candidate.email);
      setJobId(candidate.jobId);
      setResumeLink(candidate.resumeLink);
    }
  }, [candidate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCandidate({ name, email, jobId, resumeLink, id: candidate?.id });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Job</label>
        <select
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          required
        >
          <option value="" disabled>Select Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Resume Link</label>
        <input
          type="url"
          value={resumeLink}
          onChange={(e) => setResumeLink(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {candidate ? 'Update' : 'Add'} Candidate
      </button>
      <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
        }
        div {
          margin-bottom: 10px;
        }
        label {
          margin-bottom: 5px;
        }
        input,
        textarea,
        select {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
        }
        button {
          align-self: flex-end;
        }
        .btn {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </form>
  );
};

export default AddCandidateForm;
