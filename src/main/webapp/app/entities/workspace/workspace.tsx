import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IWorkspace } from 'app/shared/model/workspace.model';
import { getEntities } from './workspace.reducer';

export const Workspace = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const workspaceList = useAppSelector(state => state.workspace.entities);
  const loading = useAppSelector(state => state.workspace.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="workspace-heading" data-cy="WorkspaceHeading">
        <Translate contentKey="klassChatApp.workspace.home.title">Workspaces</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="klassChatApp.workspace.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/workspace/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="klassChatApp.workspace.home.createLabel">Create new Workspace</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {workspaceList && workspaceList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="klassChatApp.workspace.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="klassChatApp.workspace.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="klassChatApp.workspace.description">Description</Translate>
                </th>
                <th>
                  <Translate contentKey="klassChatApp.workspace.user">User</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {workspaceList.map((workspace, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/workspace/${workspace.id}`} color="link" size="sm">
                      {workspace.id}
                    </Button>
                  </td>
                  <td>{workspace.name}</td>
                  <td>{workspace.description}</td>
                  <td>
                    {workspace.users
                      ? workspace.users.map((val, j) => (
                          <span key={j}>
                            {val.id}
                            {j === workspace.users.length - 1 ? '' : ', '}
                          </span>
                        ))
                      : null}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/workspace/${workspace.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/workspace/${workspace.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/workspace/${workspace.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="klassChatApp.workspace.home.notFound">No Workspaces found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Workspace;
