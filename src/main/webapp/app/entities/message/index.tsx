import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Message from './message';
import MessageDetail from './message-detail';
import MessageUpdate from './message-update';
import MessageDeleteDialog from './message-delete-dialog';

const MessageRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Message />} />
    <Route path="new" element={<MessageUpdate />} />
    <Route path=":id">
      <Route index element={<MessageDetail />} />
      <Route path="edit" element={<MessageUpdate />} />
      <Route path="delete" element={<MessageDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default MessageRoutes;
