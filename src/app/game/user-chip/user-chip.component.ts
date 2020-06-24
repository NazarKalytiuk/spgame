import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { User } from 'src/app/core/model/user';

@Component({
  selector: 'app-user-chip',
  templateUrl: './user-chip.component.html',
  styleUrls: ['./user-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserChipComponent {
  @Input() user: User;
}
