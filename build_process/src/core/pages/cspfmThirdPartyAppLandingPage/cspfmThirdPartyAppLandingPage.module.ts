import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { cspfmThirdPartyAppLandingPage } from './cspfmThirdPartyAppLandingPage';


const routes: Routes = [
  {
    path: '',
    component: cspfmThirdPartyAppLandingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [cspfmThirdPartyAppLandingPage]
 
})
export class cspfmThirdPartyAppLandingPageModule {}
