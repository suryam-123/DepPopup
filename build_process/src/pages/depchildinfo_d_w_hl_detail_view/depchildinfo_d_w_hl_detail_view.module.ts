import { NgModule } from '@angular/core';
        import { CommonModule } from '@angular/common';
        import { FormsModule } from '@angular/forms';
        import { Routes, RouterModule } from '@angular/router';
        import { IonicModule } from '@ionic/angular';
        import {depchildinfo_d_w_hl_detail_view} from './depchildinfo_d_w_hl_detail_view';           
        import { SharedModule } from 'src/core/utils/shared.module';
           import { cspfmFormulamodule } from 'src/core/components/cspfmFormula/cspfmFormula.module';
           import { cspfmactionwebmodule } from 'src/core/components/cspfmactionweb/cspfmactionweb.module';
           import { cspfmamdModule } from 'src/app/cspfmamd.module';
           import { FlatpickrModule } from 'angularx-flatpickr';
           import { TabModule } from 'angular-tabs-component';
        import { cs_conditionalvalidation_consolidatemodule } from '../../core/components/cs_conditionalvalidation_consolidate/cs_conditionalvalidation_consolidate.module';
        import { cspfmBalloonComponentmodule } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent.module';
        import { cspfmCustomActionModule } from 'src/core/components/cspfmCustomAction/cspfmCustomAction.module';
        
        const routes: Routes = [
            {
            path: '',
            component: depchildinfo_d_w_hl_detail_view
            }
        ];
        
            @NgModule({ 
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                cspfmFormulamodule,               
                SharedModule,
                cspfmactionwebmodule,
                cspfmamdModule,
                TabModule,
                FlatpickrModule.forRoot(),
                cs_conditionalvalidation_consolidatemodule,
                cspfmBalloonComponentmodule,
                cspfmCustomActionModule
            ],
                declarations:[depchildinfo_d_w_hl_detail_view]
                })
                export class depchildinfo_d_w_hl_detail_viewmodule{}