import { getSession } from 'next-auth/react';
import { validateSession } from '@/config/api-validation';
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  createScreeningLink,
  getScreeningLink,
  deleteScreeningLink,
  updateScreeningDetails,
} from '@/prisma/services/candidates';
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
          const { jobId, candidateId, action } = req.query;
          if (action === 'getScreeningLink') {
            const screeningLink = await getScreeningLink(candidateId);
            res.status(200).json({ data: screeningLink });
          } else {
            const candidates = await getCandidates(jobId);
            res.status(200).json({ data: { candidates: candidates || [] } });
          }
        } catch (error) {
          console.error('Error fetching candidates:', error);
          res.status(500).json({ errors: { error: { msg: 'Failed to fetch candidates' } } });
        }
        break;
      case 'POST':
        try {
          const {
            jobId,
            name,
            email,
            resumeLink,
            linkExpiration,
            candidateId,
            screeningLink,
            screeningDetails,
            action,
          } = req.body;
          if (action === 'createScreeningLink') {
            const newScreeningLink = await createScreeningLink(candidateId, screeningLink, linkExpiration);
            res.status(201).json({ data: { screeningLink: newScreeningLink } });
          } else if (action === 'updateScreeningDetails') {
            const updatedScreeningDetails = await updateScreeningDetails(candidateId, screeningDetails);
            res.status(200).json({ data: { screeningDetails: updatedScreeningDetails } });
          } else {
            const newCandidate = await createCandidate(jobId, name, email, resumeLink, linkExpiration);
            res.status(201).json({ data: { candidate: newCandidate } });
          }
        } catch (error) {
          console.error('Error creating candidate:', error);
          res.status(500).json({ errors: { error: { msg: 'Failed to create candidate' } } });
        }
        break;
      case 'PUT':
        try {
          const { id, name, email, resumeLink, linkExpiration } = req.body;
          const updatedCandidate = await updateCandidate(id, name, email, resumeLink, linkExpiration);
          res.status(200).json({ data: { candidate: updatedCandidate } });
        } catch (error) {
          console.error('Error updating candidate:', error);
          res.status(500).json({ errors: { error: { msg: 'Failed to update candidate' } } });
        }
        break;
      case 'DELETE':
        try {
          const { id, action, candidateId } = req.body;
          if (action === 'deleteScreeningLink') {
            await deleteScreeningLink(candidateId);
            res.status(204).end();
          } else {
            await deleteCandidate(id);
            res.status(204).end();
          }
        } catch (error) {
          console.error('Error deleting candidate:', error);
          res.status(500).json({ errors: { error: { msg: 'Failed to delete candidate' } } });
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
