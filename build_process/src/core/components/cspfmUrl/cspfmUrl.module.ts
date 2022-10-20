/* 
 *   File: cspfmUrl.module.ts 
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
import { cspfmUrl } from 'src/core/components/cspfmUrl/cspfmUrl';
import { cspfmUrlPopover } from 'src/core/components/cspfmUrlPopover/cspfmUrlPopover';
import { cspfmUrlPopovermodule } from 'src/core/components/cspfmUrlPopover/cspfmUrlPopover.module';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/core/utils/shared.module';

@NgModule({
  declarations: [cspfmUrl],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    cspfmUrlPopovermodule,
    cspfmamdModule
  ],
  exports: [
    cspfmUrl
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmUrlmodule {

}
