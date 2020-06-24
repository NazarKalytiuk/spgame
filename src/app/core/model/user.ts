export enum USER_STATUS {
  DEFAULT = 'Default',
  WON = 'Won',
  LOSS = 'Loss'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: USER_STATUS;
}
