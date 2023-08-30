import { IUser } from 'app/shared/model/user.model';

export interface IUserProfile {
  id?: number;
  profilePictureContentType?: string | null;
  profilePicture?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IUserProfile> = {};
