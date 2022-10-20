import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/core/utils/shared.module';
import { cspfmGlobalSearchMoreActionPage } from './cspfmGlobalSearchMoreActionPage';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { FlatpickrModule } from 'angularx-flatpickr';

const routes: Routes = [
  {
    path: '',
    component: cspfmGlobalSearchMoreActionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    cspfmamdModule,
    FlatpickrModule
  ],
  declarations: [cspfmGlobalSearchMoreActionPage]
})
export class cspfmGlobalSearchMoreActionPagemodule { }
