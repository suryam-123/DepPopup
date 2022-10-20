/* 
 *   File: cs_whocolumn_icon.module.ts 
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
import { cs_whocolumn_icon } from 'src/core/components/cs_whocolumn_icon/cs_whocolumn_icon';
import { cs_whocolumn_popover } from 'src/core/components/cs_whocolumn_popover/cs_whocolumn_popover';
import { cs_whocolumn_popovermodule } from 'src/core/components/cs_whocolumn_popover/cs_whocolumn_popover.module';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { cspfmAlertDialogmodule } from '../cspfmAlertDialog/cspfmAlertDialog.module';

@NgModule({
  declarations: [cs_whocolumn_icon],
  imports: [
    CommonModule,
    cs_whocolumn_popovermodule,
    cspfmamdModule,
    cspfmAlertDialogmodule
  ],
  exports: [
    cs_whocolumn_icon,
    cs_whocolumn_popover
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cs_whocolumn_iconmodule {

}
