import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { cspfmAttachmentUpload } from './cspfmAttachmentUpload';


const routes: Routes = [
  {
    path: '',
    component: cspfmAttachmentUpload
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [cspfmAttachmentUpload]
})
export class cspfmAttachmentUploadModule {}
