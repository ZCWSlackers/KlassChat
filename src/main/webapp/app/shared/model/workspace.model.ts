import { IUser } from 'app/shared/model/user.model';
import { IChannel } from 'app/shared/model/channel.model';

export interface IWorkspace {
  id?: number;
  name?: string;
  description?: string | null;
  users?: IUser[] | null;
  channels?: IChannel[] | null;
}

export const defaultValue: Readonly<IWorkspace> = {};
