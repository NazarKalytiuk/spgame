import { Injectable } from '@angular/core';
import { Chance } from 'chance';
import { of, interval, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { USER_STATUS } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  getUsers() {
    return interval(1).pipe(switchMap(val => of({
      name: Chance().name(),
      id: uuidv4(),
      avatar: 'https://www.w3schools.com/howto/img_avatar2.png',
      status: USER_STATUS.DEFAULT
    })));
  }

  getStatus(usersIds: string[], p: number) {
    return from(usersIds).pipe(switchMap(val => of({
      id: val,
      status: Math.random() * 100 <= p
    })));
  }
}
