import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import { cs_conditionalvalidation_consolidate } from './cs_conditionalvalidation_consolidate';
import { FormsModule } from '@angular/forms';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { SharedModule } from 'src/core/utils/shared.module';
@NgModule({
  declarations: [cs_conditionalvalidation_consolidate],
  imports: [
    CommonModule,
    FormsModule,
    cspfmamdModule,
    SharedModule
  ],
  exports: [
    cs_conditionalvalidation_consolidate
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cs_conditionalvalidation_consolidatemodule {

}
