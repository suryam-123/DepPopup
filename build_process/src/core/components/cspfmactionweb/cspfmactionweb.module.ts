

/* 
 *   File: cspfmactionweb.module.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { cspfmactionweb } from './cspfmactionweb';
// import { cs_whocolumn_iconmodule } from '../cs_whocolumn_icon/cs_whocolumn_icon.module';



const routes: Routes = [
  {
    path: '',
    component: cspfmactionweb
  }
];

@NgModule({
  declarations: [cspfmactionweb],
  imports: [
    CommonModule
    // ,cs_whocolumn_iconmodule
  ],
  exports: [
    cspfmactionweb
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class cspfmactionwebmodule { }
