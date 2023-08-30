import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { openFile, byteSize, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUserProfile } from 'app/shared/model/user-profile.model';
import { getEntities } from './user-profile.reducer';

export const UserProfile = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const userProfileList = useAppSelector(state => state.userProfile.entities);
  const loading = useAppSelector(state => state.userProfile.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="user-profile-heading" data-cy="UserProfileHeading">
        <Translate contentKey="klassChatApp.userProfile.home.title">User Profiles</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="klassChatApp.userProfile.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/user-profile/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="klassChatApp.userProfile.home.createLabel">Create new User Profile</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {userProfileList && userProfileList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="klassChatApp.userProfile.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="klassChatApp.userProfile.profilePicture">Profile Picture</Translate>
                </th>
                <th>
                  <Translate contentKey="klassChatApp.userProfile.user">User</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {userProfileList.map((userProfile, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/user-profile/${userProfile.id}`} color="link" size="sm">
                      {userProfile.id}
                    </Button>
                  </td>
                  <td>
                    {userProfile.profilePicture ? (
                      <div>
                        {userProfile.profilePictureContentType ? (
                          <a onClick={openFile(userProfile.profilePictureContentType, userProfile.profilePicture)}>
                            <img
                              src={`data:${userProfile.profilePictureContentType};base64,${userProfile.profilePicture}`}
                              style={{ maxHeight: '30px' }}
                            />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {userProfile.profilePictureContentType}, {byteSize(userProfile.profilePicture)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{userProfile.user ? userProfile.user.id : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/user-profile/${userProfile.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/user-profile/${userProfile.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/user-profile/${userProfile.id}/delete`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
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
              <Translate contentKey="klassChatApp.userProfile.home.notFound">No User Profiles found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserProfile;
