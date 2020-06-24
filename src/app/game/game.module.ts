import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { UserChipComponent } from './user-chip/user-chip.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [GameComponent, UserChipComponent],
  entryComponents: [UserChipComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule
  ],
  exports: [GameComponent]
})
export class GameModule { }
