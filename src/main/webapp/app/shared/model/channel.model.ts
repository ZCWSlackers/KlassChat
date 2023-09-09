import { IWorkspace } from 'app/shared/model/workspace.model';
import { IUser } from 'app/shared/model/user.model';
import { IMessage } from 'app/shared/model/message.model';

export interface IChannel {
  id?: number;
  name?: string;
  description?: string | null;
  workspace?: IWorkspace | null;
  users?: IUser[] | null;
  messages?: IMessage[] | null;
}

export const defaultValue: Readonly<IChannel> = {};
