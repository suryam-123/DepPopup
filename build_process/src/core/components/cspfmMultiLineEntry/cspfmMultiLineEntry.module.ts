import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabModule } from 'angular-tabs-component';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { SharedModule } from 'src/core/utils/shared.module';
import { cspfmMultiLineEntry } from './cspfmMultiLineEntry';
import { NgxMasonryModule } from 'ngx-masonry';
// 08Jun2022#sudalaiyandi.a 
import { cs_conditionalvalidation_consolidatemodule } from 'src/core/components/cs_conditionalvalidation_consolidate/cs_conditionalvalidation_consolidate.module';


@NgModule({
  declarations: [cspfmMultiLineEntry],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    cspfmamdModule,
    TabModule,
    NgxMasonryModule,
    cs_conditionalvalidation_consolidatemodule
  ],
  exports: [
    cspfmMultiLineEntry
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmMultiLineEntrymodule {

}