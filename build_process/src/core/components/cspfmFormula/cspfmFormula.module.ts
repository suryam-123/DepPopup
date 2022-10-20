/* 
 *   File: cspfmFormula.module.ts 
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
import { cspfmFormula } from './cspfmFormula';
import { cspfmamdModule } from '../../../app/cspfmamd.module';

@NgModule({
  declarations: [cspfmFormula],
  imports: [
    CommonModule,
    cspfmamdModule
  ],
  exports: [
    cspfmFormula
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmFormulamodule {

}
