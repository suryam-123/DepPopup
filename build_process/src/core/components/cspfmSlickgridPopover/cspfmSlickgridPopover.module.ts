/* 
 *   File: cspfmSlickgridPopover.module.ts 
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

import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { cspfmSlickgridPopover } from 'src/core/components/cspfmSlickgridPopover/cspfmSlickgridPopover';
import { cspfmweblookuppageModule } from 'src/core/pages/cspfmweblookuppage/cspfmweblookuppage.module';
import { SharedModule } from 'src/core/utils/shared.module';
@NgModule({
  declarations: [cspfmSlickgridPopover],
  imports: [
    CommonModule,
    cspfmamdModule,
    cspfmweblookuppageModule,
    SharedModule
  ],
  exports: [
    cspfmSlickgridPopover
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmSlickgridPopovermodule {

}
