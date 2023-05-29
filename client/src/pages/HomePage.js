import { useState, useEffect } from 'react';
import { getJobs } from '../lib/graphql/queries';
import JobList from '../components/JobList';

function HomePage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then((jobs) => setJobs(jobs));
  }, []);

  return (
    <div>
      <h1 className='title'>Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
