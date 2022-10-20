import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { lookuppage } from './lookuppage';
import { SharedModule } from 'src/core/utils/shared.module';

const routes: Routes = [
  {
    path: '',
    component: lookuppage
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
  declarations: [lookuppage]
})
export class lookuppageModule {}
