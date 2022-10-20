/* 
 *   File: cspfmMoreAction.module.ts 
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
import { cspfmMoreAction } from './cspfmMoreAction';
import { cspfmamdModule } from '../../../app/cspfmamd.module';
import { cspfmMoreActionPopovermodule } from 'src/core/components/cspfmMoreActionPopover/cspfmMoreActionPopover.module';
import { cspfmMoreActionPopover } from 'src/core/components/cspfmMoreActionPopover/cspfmMoreActionPopover';

@NgModule({
  declarations: [cspfmMoreAction],
  imports: [
    CommonModule,
    cspfmamdModule,
    cspfmMoreActionPopovermodule
  ],
  exports: [
    cspfmMoreAction,cspfmMoreActionPopover
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmMoreActionmodule {

}
