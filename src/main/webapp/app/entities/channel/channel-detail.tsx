import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './channel.reducer';

export const ChannelDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const channelEntity = useAppSelector(state => state.channel.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="channelDetailsHeading">
          <Translate contentKey="klassChatApp.channel.detail.title">Channel</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{channelEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="klassChatApp.channel.name">Name</Translate>
            </span>
          </dt>
          <dd>{channelEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="klassChatApp.channel.description">Description</Translate>
            </span>
          </dt>
          <dd>{channelEntity.description}</dd>
          <dt>
            <Translate contentKey="klassChatApp.channel.workspace">Workspace</Translate>
          </dt>
          <dd>{channelEntity.workspace ? channelEntity.workspace.id : ''}</dd>
          <dt>
            <Translate contentKey="klassChatApp.channel.user">User</Translate>
          </dt>
          <dd>
            {channelEntity.users
              ? channelEntity.users.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {channelEntity.users && i === channelEntity.users.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/channel" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/channel/${channelEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChannelDetail;
