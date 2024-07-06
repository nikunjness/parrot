import { useState } from 'react'

const AddJobForm = ({ onAddJob }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Submitted', { title, description })
    onAddJob({ title, description })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Job Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Job Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Add Job
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
        textarea {
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
  )
}

export default AddJobForm
