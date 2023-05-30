import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCreateJob } from '../lib/graphql/hooks';

function CreateJobPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createJob, loading, error } = useCreateJob();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const {
        data: { job },
      } = await createJob({ title, description });
      navigate(`/jobs/${job.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className='title'>New Job</h1>
      <div className='box'>
        <form>
          <div className='field'>
            <label className='label'>Title</label>
            <div className='control'>
              <input
                className='input'
                type='text'
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className='field'>
            <label className='label'>Description</label>
            <div className='control'>
              <textarea
                className='textarea'
                rows={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className='field has-text-danger'>{error.message}</div>
          )}
          <div className='field'>
            <div className='control'>
              <button
                className='button is-link'
                onClick={handleSubmit}
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
