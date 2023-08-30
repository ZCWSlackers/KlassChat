import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Workspace from './workspace';
import WorkspaceDetail from './workspace-detail';
import WorkspaceUpdate from './workspace-update';
import WorkspaceDeleteDialog from './workspace-delete-dialog';

const WorkspaceRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Workspace />} />
    <Route path="new" element={<WorkspaceUpdate />} />
    <Route path=":id">
      <Route index element={<WorkspaceDetail />} />
      <Route path="edit" element={<WorkspaceUpdate />} />
      <Route path="delete" element={<WorkspaceDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default WorkspaceRoutes;
