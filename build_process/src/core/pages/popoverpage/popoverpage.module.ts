import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule, PopoverController } from '@ionic/angular';

import { popoverpage } from './popoverpage';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { SharedModule } from 'src/core/utils/shared.module';
import { cspfmBalloonComponentmodule } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent.module';

const routes: Routes = [
  {
    path: '',
    component: popoverpage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    cspfmamdModule,
    SharedModule,
    cspfmBalloonComponentmodule,
    RouterModule.forChild(routes)
  ],
  declarations: [popoverpage]
})
export class popoverpageModule {
  constructor(public popoverController: PopoverController) { }
}
