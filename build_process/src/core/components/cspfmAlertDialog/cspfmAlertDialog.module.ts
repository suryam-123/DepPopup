/* 
 *   File: cspfmAlertDialog.module.ts 
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

import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

@NgModule({
  declarations: [cspfmAlertDialog],
  imports: [
    CommonModule,
    cspfmamdModule,
    PdfJsViewerModule
  ],
  exports: [
    cspfmAlertDialog
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmAlertDialogmodule {

}