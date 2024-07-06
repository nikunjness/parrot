import { getSession } from 'next-auth/react';
import { validateSession } from '@/config/api-validation';
import { getJobs, createJob, updateJob, deleteJob } from '@/prisma/services/jobs';
import { getWorkspace } from '@/prisma/services/workspace';

const handler = async (req, res) => {
  const { method } = req;
  const { workspaceSlug } = req.query;

  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ errors: { error: { msg: 'Unauthorized' } } });
    }

    const email = session.user.email;
    const userId = session.user.id;
    const workspace = await getWorkspace(userId, email, workspaceSlug);

    if (!workspace) {
      return res.status(404).json({ errors: { error: { msg: 'Workspace not found' } } });
    }

    switch (method) {
      case 'GET':
        try {
          const jobs = await getJobs(workspaceSlug);
          res.status(200).json({ data: { jobs: jobs || [] } });
        } catch (error) {
          console.error('Error fetching jobs:', error);
          res.status(500).json({ errors: { error: { msg: 'Failed to fetch jobs' } } });
        }
        break;
      case 'POST':
        try {
          const { title, description } = req.body;
          const newJob = await createJob(workspaceSlug, userId, title, description);
          res.status(201).json({ data: { job: newJob } });
        } catch (error) {
          console.error('Error creating job:', error);
          res.status(500).json({ errors: { error: { msg: 'Failed to create job' } } });
        }
        break;
      case 'PUT':
        try {
          const { id, title, description } = req.body;
          const updatedJob = await updateJob(id, title, description);
          res.status(200).json({ data: { job: updatedJob } });
        } catch (error) {
          console.error('Error updating job:', error);
          res.status(500).json({ errors: { error: { msg: 'Failed to update job' } } });
        }
        break;
      case 'DELETE':
        try {
          const { id } = req.body;
          await deleteJob(id);
          res.status(204).end();
        } catch (error) {
          console.error('Error deleting job:', error);
          res.status(500).json({ errors: { error: { msg: 'Failed to delete job' } } });
        }
        break;
      default:
        res.status(405).json({ errors: { error: { msg: `${method} method unsupported` } } });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ errors: { error: { msg: 'Unexpected error occurred' } } });
  }
};

export default handler;
