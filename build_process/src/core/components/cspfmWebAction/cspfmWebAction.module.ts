/* 
 *   File: cspfmWebAction.module.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { cspfmWebAction } from './cspfmWebAction';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { FormsModule } from '@angular/forms';
import { cspfmWebPopoverActionmodule } from '../cspfmWebPopoverAction/cspfmWebPopoverAction.module';


const routes: Routes = [
  {
    path: '',
    component: cspfmWebAction
  }
];

@NgModule({
  declarations: [cspfmWebAction],
  imports: [
    CommonModule,
    cspfmamdModule,
    FormsModule,
    cspfmWebPopoverActionmodule
  ],
  exports: [
    cspfmWebAction
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class cspfmWebActionmodule { }
