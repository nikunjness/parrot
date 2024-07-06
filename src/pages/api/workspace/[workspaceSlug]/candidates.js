import { validateSession } from '@/config/api-validation';
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '@/prisma/services/candidates';

const handler = async (req, res) => {
  const { method } = req;
  const session = await validateSession(req, res);
  const { workspaceSlug } = req.query;

  switch (method) {
    case 'GET':
      try {
        const candidates = await getCandidates(workspaceSlug, session.user.email);
        res.status(200).json({ data: { candidates } });
      } catch (error) {
        res.status(404).json({ errors: { error: { msg: error.message } } });
      }
      break;

    case 'POST':
      try {
        const candidate = await createCandidate(workspaceSlug, req.body);
        res.status(201).json({ data: { candidate } });
      } catch (error) {
        res.status(400).json({ errors: { error: { msg: error.message } } });
      }
      break;

    case 'PUT':
      try {
        const { id, ...data } = req.body;
        const candidate = await updateCandidate(id, data);
        res.status(200).json({ data: { candidate } });
      } catch (error) {
        res.status(400).json({ errors: { error: { msg: error.message } } });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await deleteCandidate(id);
        res.status(204).end();
      } catch (error) {
        res.status(400).json({ errors: { error: { msg: error.message } } });
      }
      break;

    default:
      res.status(405).json({ errors: { error: { msg: `${method} method unsupported` } } });
      break;
  }
};

export default handler;
