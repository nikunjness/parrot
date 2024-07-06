import prisma from '@/prisma/index';

export const getCandidates = async (jobId) => {
  if (!jobId) {
    return [];
  }
  return await prisma.candidate.findMany({
    where: { jobId },
    orderBy: { createdAt: 'desc' },
  });
};

export const createCandidate = async (jobId, name, email, resumeLink, linkExpiration) => {
  if (!jobId || !name || !email) {
    throw new Error('Job ID, name, and email are required');
  }
  const newCandidate = await prisma.candidate.create({
    data: {
      jobId,
      name,
      email,
      resumeLink,
      linkExpiration,
    },
  });
  await prisma.activity.create({
    data: {
      type: 'create_candidate',
      description: `Candidate ${name} created for job ${jobId}`,
      candidateId: newCandidate.id,
      jobId: jobId,
    },
  });
  return newCandidate;
};

export const updateCandidate = async (id, name, email, resumeLink, linkExpiration) => {
  const updatedCandidate = await prisma.candidate.update({
    where: { id },
    data: { name, email, resumeLink, linkExpiration },
  });
  await prisma.activity.create({
    data: {
      type: 'update_candidate',
      description: `Candidate ${name} updated`,
      candidateId: updatedCandidate.id,
    },
  });
  return updatedCandidate;
};

export const deleteCandidate = async (id) => {
  const deletedCandidate = await prisma.candidate.delete({
    where: { id },
  });
  await prisma.activity.create({
    data: {
      type: 'delete_candidate',
      description: `Candidate ${deletedCandidate.name} deleted`,
      candidateId: deletedCandidate.id,
    },
  });
  return deletedCandidate;
};

export const createScreeningLink = async (candidateId, screeningLink, linkExpiration) => {
  const updatedCandidate = await prisma.candidate.update({
    where: { id: candidateId },
    data: {
      screeningLink,
      linkExpiration,
      screeningStatus: 'pending',
    },
  });
  await prisma.activity.create({
    data: {
      type: 'create_screening_link',
      description: `Screening link created for candidate ${updatedCandidate.name}`,
      candidateId: updatedCandidate.id,
    },
  });
  return updatedCandidate;
};

export const getScreeningLink = async (candidateId) => {
  return await prisma.candidate.findUnique({
    where: { id: candidateId },
    select: {
      screeningLink: true,
      linkExpiration: true,
    },
  });
};

export const deleteScreeningLink = async (candidateId) => {
  const updatedCandidate = await prisma.candidate.update({
    where: { id: candidateId },
    data: {
      screeningLink: null,
      linkExpiration: null,
      screeningStatus: 'none',
    },
  });
  await prisma.activity.create({
    data: {
      type: 'delete_screening_link',
      description: `Screening link deleted for candidate ${updatedCandidate.name}`,
      candidateId: updatedCandidate.id,
    },
  });
  return updatedCandidate;
};

export const updateScreeningDetails = async (candidateId, screeningDetails) => {
  const updatedCandidate = await prisma.candidate.update({
    where: { id: candidateId },
    data: {
      screeningDetails,
      screeningStatus: 'completed',
    },
  });
  await prisma.activity.create({
    data: {
      type: 'complete_screening',
      description: `Screening completed for candidate ${updatedCandidate.name}`,
      candidateId: updatedCandidate.id,
    },
  });
  return updatedCandidate;
};
