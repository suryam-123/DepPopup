import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { cspfmCalendarEventInfo } from './cspfmCalendarEventInfo';
import { SharedModule } from 'src/core/utils/shared.module';

const routes: Routes = [
  {
    path: '',
    component: cspfmCalendarEventInfo
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [cspfmCalendarEventInfo]
})
export class cspfmCalendarEventInfoModule {}
