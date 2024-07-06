import prisma from '@/prisma/index';

export const getCandidates = async (workspaceSlug, email) => {
  const workspace = await prisma.workspace.findFirst({
    where: { slug: workspaceSlug, deletedAt: null },
    select: { id: true },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  return await prisma.candidate.findMany({
    where: { job: { workspaceId: workspace.id } },
    include: { job: true },
  });
};

export const createCandidate = async (workspaceSlug, data) => {
  const { name, email, jobId, resumeLink } = data;
  if (!name || !email || !jobId) {
    throw new Error('All fields are required');
  }

  const job = await prisma.job.findFirst({
    where: { id: jobId, workspace: { slug: workspaceSlug, deletedAt: null } },
    select: { id: true, title: true },
  });

  if (!job) {
    throw new Error('Job not found');
  }

  return await prisma.candidate.create({
    data: {
      name,
      email,
      jobId: job.id,
      resumeLink,
      activities: {
        create: {
          type: 'Candidate Created',
          description: `Candidate ${name} created for job ${job.title}`,
        },
      },
    },
    include: { job: true },
  });
};

export const updateCandidate = async (id, data) => {
  return await prisma.candidate.update({
    where: { id },
    data,
    include: { job: true },
  });
};

export const deleteCandidate = async (id) => {
  return await prisma.candidate.delete({
    where: { id },
  });
};
