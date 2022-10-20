import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicPullupModule } from 'ionic-pullup';
import { languagepage } from './languagepage';

const routes: Routes = [
  {
    path: '',
    component: languagepage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicPullupModule,
    RouterModule.forChild(routes)
  ],
  declarations: [languagepage]
})
export class languagepageModule {}
