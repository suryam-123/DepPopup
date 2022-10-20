import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from 'src/core/utils/shared.module';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { IonicModule } from '@ionic/angular';
import { cspfmCloneMappingInfo } from './cspfmCloneMappingInfo';


const routes: Routes = [
  {
    path: '',
    component: cspfmCloneMappingInfo
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    cspfmamdModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [cspfmCloneMappingInfo],
})
export class cspfmCloneMappingInfoModule { }
