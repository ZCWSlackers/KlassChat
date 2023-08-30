import userProfile from 'app/entities/user-profile/user-profile.reducer';
import workspace from 'app/entities/workspace/workspace.reducer';
import channel from 'app/entities/channel/channel.reducer';
import message from 'app/entities/message/message.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  userProfile,
  workspace,
  channel,
  message,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
