import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IChannel } from 'app/shared/model/channel.model';
import { getEntities } from './channel.reducer';

export const Channel = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const channelList = useAppSelector(state => state.channel.entities);
  const loading = useAppSelector(state => state.channel.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="channel-heading" data-cy="ChannelHeading">
        <Translate contentKey="klassChatApp.channel.home.title">Channels</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="klassChatApp.channel.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/channel/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="klassChatApp.channel.home.createLabel">Create new Channel</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {channelList && channelList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="klassChatApp.channel.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="klassChatApp.channel.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="klassChatApp.channel.description">Description</Translate>
                </th>
                <th>
                  <Translate contentKey="klassChatApp.channel.workspace">Workspace</Translate>
                </th>
                <th>
                  <Translate contentKey="klassChatApp.channel.user">User</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {channelList.map((channel, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/channel/${channel.id}`} color="link" size="sm">
                      {channel.id}
                    </Button>
                  </td>
                  <td>{channel.name}</td>
                  <td>{channel.description}</td>
                  <td>{channel.workspace ? <Link to={`/workspace/${channel.workspace.id}`}>{channel.workspace.id}</Link> : ''}</td>
                  <td>
                    {channel.users
                      ? channel.users.map((val, j) => (
                          <span key={j}>
                            {val.id}
                            {j === channel.users.length - 1 ? '' : ', '}
                          </span>
                        ))
                      : null}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/channel/${channel.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/channel/${channel.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/channel/${channel.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
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
              <Translate contentKey="klassChatApp.channel.home.notFound">No Channels found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Channel;
