/* 
 *   File: cspfmWebPopoverAction.module.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { cspfmWebPopoverAction } from './cspfmWebPopoverAction';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: cspfmWebPopoverAction
  }
];

@NgModule({
  declarations: [cspfmWebPopoverAction],
  imports: [
    CommonModule,
    cspfmamdModule,
    FormsModule
  ],
  exports: [
    cspfmWebPopoverAction
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class cspfmWebPopoverActionmodule { }
