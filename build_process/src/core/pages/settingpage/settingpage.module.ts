import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicPullupModule } from 'ionic-pullup';
import { settingpage } from './settingpage';

const routes: Routes = [
  {
    path: '',
    component: settingpage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicPullupModule
  ],
  declarations: [settingpage]
})
export class settingpageModule {}
