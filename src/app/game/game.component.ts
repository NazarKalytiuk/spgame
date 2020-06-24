import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../core/services/user.service';
import { take, tap, delay, concatMap, bufferCount, switchMap, takeUntil } from 'rxjs/operators';
import { timer, of, Subject } from 'rxjs';
import { USER_STATUS, User } from '../core/model/user';
import { OrderedMap } from 'immutable';

enum STATUS {
  NONE = '',
  FILLING = 'Filling',
  RUNNING = 'Running',
  FINISH = 'Finish'
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {

  settingsForm: FormGroup;
  users: OrderedMap<string, User>;
  time = 0;
  status: STATUS = STATUS.NONE;
  destroyed$: Subject<boolean> = new Subject();

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      fillingTime: [, [Validators.min(1), Validators.required, Validators.pattern('^[0-9]*$')]],
      runningTime: [, [Validators.min(1), Validators.required, Validators.pattern('^[0-9]*$')]],
      userCount: [, [Validators.min(1), Validators.required, Validators.pattern('^[0-9]*$')]],
      wonPercentage: [, [Validators.min(0), Validators.required, Validators.pattern('^[0-9]*$')]],
    });

  }

  submitForm() {
    if (this.settingsForm.valid) {
      this.status = STATUS.FILLING;
      this.users = OrderedMap();
      this.time = 0;
      const delay1 = Math.floor(this.settingsForm.value.fillingTime / this.settingsForm.value.userCount);
      const delay2 = Math.floor(this.settingsForm.value.runningTime / this.settingsForm.value.userCount);

      const timer$ = timer(0, 1000).subscribe(v => this.time = v);

      this.userService.getUsers().pipe(
        take(this.settingsForm.value.userCount),
        concatMap(v => of(v).pipe(delay(delay1))),
        tap(user => this.users = this.users.set(user.id, user)),
        bufferCount(this.settingsForm.value.userCount),
        switchMap(u => this.userService.getStatus(u.map(user => user.id), this.settingsForm.value.wonPercentage)),
        concatMap(v => of(v).pipe(delay(delay2))),
        takeUntil(this.destroyed$),
      ).subscribe(v => {
        this.status = STATUS.RUNNING;
        this.users = this.users.update(v.id, updater => {
          updater.status = v.status ? USER_STATUS.WON : USER_STATUS.LOSS;
          return { ...updater };
        });
      }, err => console.error(err), () => {
        this.status = STATUS.FINISH;
        timer$.unsubscribe();
      });
    }
  }

  trackUser(index, user) {
    return user ? user[0] : undefined;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
