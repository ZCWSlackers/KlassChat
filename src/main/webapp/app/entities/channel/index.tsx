import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Channel from './channel';
import ChannelDetail from './channel-detail';
import ChannelUpdate from './channel-update';
import ChannelDeleteDialog from './channel-delete-dialog';

const ChannelRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Channel />} />
    <Route path="new" element={<ChannelUpdate />} />
    <Route path=":id">
      <Route index element={<ChannelDetail />} />
      <Route path="edit" element={<ChannelUpdate />} />
      <Route path="delete" element={<ChannelDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChannelRoutes;
