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
          width: 500px;
          margin: 0 auto;
        }
        div {
          margin-bottom: 20px;
        }
        label {
          margin-bottom: 5px;
          font-weight: bold;
        }
        input,
        textarea {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          border: 1px solid #dcdcdc;
          border-radius: 4px;
        }
        textarea {
          height: 150px;
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
