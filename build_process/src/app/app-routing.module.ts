import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from 'src/core/menu/menu.component';
import { authGuard } from 'src/authentication/authGuard';
import { cspfmSettings } from 'src/core/pages/cspfmSettings/cspfmSettings';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'approotpage',
    pathMatch: 'full'
    },
  {
    path: 'menu',
    component: MenuComponent,
    children: [
      { path: 'homepage', loadChildren: () => import('../core/pages/homepage/homepage.module').then(m => m.homepageModule),canActivate: [ authGuard ] },
      { path: 'embedded', loadChildren: () => import('../core/pages/embedded/embedded.module').then(m => m.EmbeddedModule),canActivate: [ authGuard ]},
      { path: 'attachmentlist', loadChildren: () => import('../core/pages/attachmentlist/attachmentlist.module').then(m => m.attachmentlistModule), canActivate: [ authGuard ]},
      { path: 'cspfmCalendarPage',loadChildren: () => import('../core/pages/cspfmCalendarPage/cspfmCalendarPage.module').then(m => m.cspfmCalendarPageModule), canActivate: [ authGuard ] },
      { path: 'cspfmSettings',
       component: cspfmSettings,
        canActivate: [ authGuard ],
        children: [
          { path: 'themepage', loadChildren: () => import('../core/pages/themepage/themepage.module').then(m => m.themepageModule), canActivate: [ authGuard ] },
          { path: 'languagepage', loadChildren: () => import('../core/pages/languagepage/languagepage.module').then(m => m.languagepageModule), canActivate: [ authGuard ] },
          { path: 'settingpage', loadChildren: () => import('../core/pages/settingpage/settingpage.module').then(m => m.settingpageModule), canActivate: [ authGuard ] },
          { path: '', loadChildren: () => import('../core/pages/settingpage/settingpage.module').then(m => m.settingpageModule), canActivate: [ authGuard ] }
        ]
       },
       { path: 'cspfmAttachmentUpload', loadChildren: () => import('../core/pages/cspfmAttachmentUpload/cspfmAttachmentUpload.module').then(m => m.cspfmAttachmentUploadModule), canActivate: [ authGuard ]},
       { path: 'cspfmdocumentuploadconfiguration', loadChildren: () => import('../core/pages/cspfmdocumentuploadconfiguration/cspfmdocumentuploadconfiguration.module').then(m => m.cspfmdocumentuploadconfigurationModule), canActivate: [ authGuard ]},
       { path: 'cspfmGlobalSearchMoreActionPage', loadChildren: () => import('../core/pages/cspfmGlobalSearchMoreActionPage/cspfmGlobalSearchMoreActionPage.module').then(m => m.cspfmGlobalSearchMoreActionPagemodule), canActivate: [authGuard]}
    ]
  },
  { path: 'lookuppage', loadChildren: () => import('../core/pages/lookuppage/lookuppage.module').then(m => m.lookuppageModule), canActivate: [ authGuard ] },
  { path: 'cspfmCalendarEventInfo', loadChildren: () => import('../core/pages/cspfmCalendarEventInfo/cspfmCalendarEventInfo.module').then(m => m.cspfmCalendarEventInfoModule), canActivate: [ authGuard ] },
  { path: 'metadatafailure', loadChildren: () => import('../core/pages/metadatafailure/metadatafailure.module').then(m => m.metadatafailureModule) },
  { path: 'syncpage', loadChildren: () => import('../core/pages/syncpage/syncpage.module').then(m => m.syncpageModule), canActivate: [ authGuard ] },
  { path: 'approotpage', loadChildren: () => import('../core/pages/approotpage/approotpage.module').then(m => m.approotpageModule) },
  { path: 'cspfmThirdPartyAppLandingPage', loadChildren: () => import('../core/pages/cspfmThirdPartyAppLandingPage/cspfmThirdPartyAppLandingPage.module').then(m => m.cspfmThirdPartyAppLandingPageModule) },
];



@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class appRoutingModule {}
