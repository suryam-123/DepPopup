/* 
 *   File: cspfmActions.module.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import { cspfmActions } from './cspfmActions';

@NgModule({
  declarations: [cspfmActions],
  imports: [
    CommonModule
  ],
  exports: [
    cspfmActions
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmActionsmodule {

} 
