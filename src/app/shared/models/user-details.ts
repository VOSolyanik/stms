export interface UserDetails {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  picturePosition: {x: number, y: number};
  namePosition: {x: number, y: number};
}
