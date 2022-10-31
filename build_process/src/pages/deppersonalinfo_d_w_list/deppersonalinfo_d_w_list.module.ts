

/* 
        *   File: deppersonalinfo_d_w_list.module.ts
        *   Copyright(c) 2022 Chain-Sys Corporation Inc.
        *   Duplication or distribution of this code in part or in whole by any media
        *   without the express written permission of Chain-Sys Corporation or its agents is
        *   strictly prohibited.
        */
        import { NgModule } from '@angular/core';
        import { CommonModule } from '@angular/common';
        import { FormsModule } from '@angular/forms';
        import { Routes, RouterModule } from '@angular/router';
        import { IonicModule } from '@ionic/angular';
        import {deppersonalinfo_d_w_list} from './deppersonalinfo_d_w_list';           
        import { SharedModule } from 'src/core/utils/shared.module';
           
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
            component: deppersonalinfo_d_w_list
            }
        ];
        
            @NgModule({ 
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                               
                SharedModule,
                cspfmactionwebmodule,
                cspfmamdModule,
                TabModule,
                FlatpickrModule.forRoot(),
                cs_conditionalvalidation_consolidatemodule,
                cspfmBalloonComponentmodule,
                cspfmCustomActionModule
            ],
                declarations:[deppersonalinfo_d_w_list]
                })
                export class deppersonalinfo_d_w_listmodule{}