import prisma from '@/prisma/index';

export const getJobs = async (workspaceSlug) => {
  if (!workspaceSlug) {
    throw new Error('Workspace slug is required');
  }
  return await prisma.job.findMany({
    where: { workspace: { slug: workspaceSlug } },
    orderBy: { createdAt: 'desc' },
  });
};

export const createJob = async (workspaceSlug, userId, title, description) => {
  if (!workspaceSlug) {
    throw new Error('Workspace slug is required');
  }
  const workspace = await prisma.workspace.findFirst({
    where: { slug: workspaceSlug },
    select: { id: true },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  return await prisma.job.create({
    data: {
      title,
      description,
      userId,
      workspaceId: workspace.id,
    },
  });
};

export const updateJob = async (id, title, description) => {
  return await prisma.job.update({
    where: { id },
    data: { title, description },
  });
};

export const deleteJob = async (id) => {
  return await prisma.job.delete({
    where: { id },
  });
};
