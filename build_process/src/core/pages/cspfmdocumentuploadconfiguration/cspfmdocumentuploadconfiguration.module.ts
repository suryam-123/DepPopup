import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { cspfmdocumentuploadconfiguration } from './cspfmdocumentuploadconfiguration';
import { cspfmamdModule } from 'src/app/cspfmamd.module';

const routes: Routes = [
  {
    path: '',
    component: cspfmdocumentuploadconfiguration
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    cspfmamdModule
  ],
  declarations: [cspfmdocumentuploadconfiguration]
})
export class cspfmdocumentuploadconfigurationModule { }
