import {
  validateSession,
} from '@/config/api-validation/index';
import {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
} from '@/prisma/services/jobs';

const handler = async (req, res) => {
  const { method } = req;

  try {
    const session = await validateSession(req, res);
    const { workspaceSlug } = req.query;
    const userId = session.user.userId;

    switch (method) {
      case 'GET':
        const jobs = await getJobs(workspaceSlug);
        res.status(200).json({ data: { jobs } });
        break;
      case 'POST':
        const newJob = await createJob(workspaceSlug, userId, req.body);
        res.status(201).json({ data: { job: newJob } });
        break;
      case 'PUT':
        const updatedJob = await updateJob(req.body.jobId, req.body);
        res.status(200).json({ data: { job: updatedJob } });
        break;
      case 'DELETE':
        await deleteJob(req.body.jobId);
        res.status(204).end();
        break;
      default:
        res.status(405).json({ errors: { error: { msg: `${method} method unsupported` } } });
    }
  } catch (error) {
    res.status(500).json({ errors: { error: { msg: error.message } } });
  }
};

export default handler;
