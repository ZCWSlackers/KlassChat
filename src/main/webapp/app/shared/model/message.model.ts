import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { IChannel } from 'app/shared/model/channel.model';

export interface IMessage {
  id?: number;
  content?: string;
  timestamp?: string;
  user?: IUser | null;
  channel?: IChannel | null;
}

export const defaultValue: Readonly<IMessage> = {};
