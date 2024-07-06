const menu = (workspaceId) => [
  {
    name: 'Workspace',
    menuItems: [
      {
        name: 'common.label.home',
        path: `/account/${workspaceId}`,
      },
      {
        name: 'common.label.jobs',
        path: `/account/${workspaceId}/jobs`,
      },
      {
        name: 'common.label.candidates',
        path: `/account/${workspaceId}/candidates`,
      },
    ],
  },
  {
    name: 'Settings',
    menuItems: [
      {
        name: 'settings.workspace.information',
        path: `/account/${workspaceId}/settings/general`,
      },
      {
        name: 'settings.domain.configuration',
        path: `/account/${workspaceId}/settings/domain`,
      },
      {
        name: 'settings.team.management',
        path: `/account/${workspaceId}/settings/team`,
      },
      {
        name: 'settings.advanced',
        path: `/account/${workspaceId}/settings/advanced`,
      },
    ],
  },
];

export default menu;
