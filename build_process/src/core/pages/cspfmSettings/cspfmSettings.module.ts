import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';
import {
  Routes,
  RouterModule
} from '@angular/router';

import {
  IonicModule
} from '@ionic/angular';

import {
  authGuard
} from 'src/authentication/authGuard';

const routes: Routes = [
  // {
  //   path: '',
  //   component: cspfmSettings
  // },
  // {
  //   path: 'themepage',
  //   loadChildren: '../themepage/themepage.module#themepageModule',
  //   canActivate: [authGuard]
  // },
  // {
  //   path: 'languagepage',
  //   loadChildren: '../languagepage/languagepage.module#languagepageModule',
  //   canActivate: [authGuard]
  // },
  // {
  //   path: 'settingpage',
  //   loadChildren: '../settingpage/settingpage.module#settingpageModule',
  //   canActivate: [authGuard]
  // }
];

@NgModule({
  imports: [
    // CommonModule,
    // FormsModule,
    // IonicModule,
    // RouterModule.forChild(routes)
  ],
  declarations: []
})
export class cspfmSettingsModule {}