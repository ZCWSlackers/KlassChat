import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/user-profile">
        <Translate contentKey="global.menu.entities.userProfile" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/workspace">
        <Translate contentKey="global.menu.entities.workspace" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/channel">
        <Translate contentKey="global.menu.entities.channel" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/message">
        <Translate contentKey="global.menu.entities.message" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
