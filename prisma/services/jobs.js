import prisma from '@/prisma/index';

export const getJobs = async (workspaceSlug) => {
  if (!workspaceSlug) throw new Error('Workspace slug is required');
  
  const workspace = await prisma.workspace.findFirst({
    where: { slug: workspaceSlug, deletedAt: null },
  });

  if (!workspace) throw new Error('Workspace not found');

  return await prisma.job.findMany({
    where: {
      workspaceId: workspace.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const createJob = async (workspaceSlug, userId, jobData) => {
  if (!workspaceSlug) throw new Error('Workspace slug is required');
  
  const workspace = await prisma.workspace.findFirst({
    where: { slug: workspaceSlug, deletedAt: null },
  });

  if (!workspace) throw new Error('Workspace not found');

  return await prisma.job.create({
    data: {
      ...jobData,
      userId,
      workspaceId: workspace.id,
    },
  });
};

export const deleteJob = async (jobId) => {
  return await prisma.job.delete({
    where: { id: jobId },
  });
};

export const updateJob = async (jobId, jobData) => {
  return await prisma.job.update({
    where: { id: jobId },
    data: jobData,
  });
};
