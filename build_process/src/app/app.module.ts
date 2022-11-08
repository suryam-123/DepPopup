import {
    depemployee_d_w_viewmodule
} from 'src/pages/depemployee_d_w_view/depemployee_d_w_view.module';
import {
    depemployee_Entry_Webmodule
} from 'src/pages/depemployee_Entry_Web/depemployee_Entry_Web.module';
import {
    depemployee_d_w_listmodule
} from 'src/pages/depemployee_d_w_list/depemployee_d_w_list.module';
import {
    deppersonalinfo_d_w_hl_listmodule
} from 'src/pages/deppersonalinfo_d_w_hl_list/deppersonalinfo_d_w_hl_list.module';
import {
    deppersonalinfo_Entry_Webmodule
} from 'src/pages/deppersonalinfo_Entry_Web/deppersonalinfo_Entry_Web.module';
import {
    deppersonalinfo_d_w_listmodule
} from 'src/pages/deppersonalinfo_d_w_list/deppersonalinfo_d_w_list.module';
import {
    depchildinfo_d_w_hl_detail_viewmodule
} from 'src/pages/depchildinfo_d_w_hl_detail_view/depchildinfo_d_w_hl_detail_view.module';
import {
    depchildinfo_Entry_Webmodule
} from 'src/pages/depchildinfo_Entry_Web/depchildinfo_Entry_Web.module';
import {
    depchildinfo_d_w_listmodule
} from 'src/pages/depchildinfo_d_w_list/depchildinfo_d_w_list.module';
import {
    DepPerson_MultiLine_Entry_WEB_Grid_with_Listmodule
} from 'src/pages/DepPerson_MultiLine_Entry_WEB_Grid_with_List/DepPerson_MultiLine_Entry_WEB_Grid_with_List.module';
import {
    DepPersonInfoList_WEB_Listmodule
} from 'src/pages/DepPersonInfoList_WEB_List/DepPersonInfoList_WEB_List.module';
import {
    depmultiinfo_d_w_hl_detail_viewmodule
} from 'src/pages/depmultiinfo_d_w_hl_detail_view/depmultiinfo_d_w_hl_detail_view.module';
import {
    depmultiinfo_Entry_Webmodule
} from 'src/pages/depmultiinfo_Entry_Web/depmultiinfo_Entry_Web.module';
import {
    depmultiinfo_d_w_listmodule
} from 'src/pages/depmultiinfo_d_w_list/depmultiinfo_d_w_list.module';
import {
    NgModule
} from '@angular/core';
import {
    BrowserModule
} from '@angular/platform-browser';
import {
    RouteReuseStrategy
} from '@angular/router';
import {
    IonicModule,
    IonicRouteStrategy
} from '@ionic/angular';
import {
    SplashScreen
} from '@awesome-cordova-plugins/splash-screen/ngx';
import {
    StatusBar
} from '@awesome-cordova-plugins/status-bar/ngx';
import {
    CallNumber
} from '@awesome-cordova-plugins/call-number/ngx';
import {
    EmailComposer
} from '@awesome-cordova-plugins/email-composer/ngx';
import {
    Broadcaster
} from '@awesome-cordova-plugins/broadcaster/ngx';
import {
    SMS
} from '@awesome-cordova-plugins/sms/ngx';
import {
    File
} from '@awesome-cordova-plugins/file/ngx';
import {
    Network
} from '@awesome-cordova-plugins/network/ngx';
import {
    SocialSharing
} from '@awesome-cordova-plugins/social-sharing/ngx';
import {
    AppPreferences
} from '@awesome-cordova-plugins/app-preferences/ngx';
import {
    AppComponent
} from './app.component';
import {
    appRoutingModule
} from './app-routing.module';
import {
    dbConfiguration
} from '../core/db/dbConfiguration';
import {
    dbProvider
} from '../core/db/dbProvider';
import {
    couchdbProvider
} from '../core/db/couchdbProvider';
import {
    MenuComponent
} from 'src/core/menu/menu.component';
import {
    HttpClient,
    HttpClientModule,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
    TranslateModule,
    TranslateLoader
} from '@ngx-translate/core';
import {
    TranslateHttpLoader
} from '@ngx-translate/http-loader';
import {
    ScreenOrientation
} from '@awesome-cordova-plugins/screen-orientation/ngx';
import {
    FileOpener
} from '@awesome-cordova-plugins/file-opener/ngx';
import {
    Zip
} from '@awesome-cordova-plugins/zip/ngx';
import {
    LocalNotifications
} from '@awesome-cordova-plugins/local-notifications/ngx';
import {
    cspfmInterceptor
} from 'src/core/utils/cspfmInterceptor';

// import { DatetimePickerModule } from 'ion-datetime-picker';
import {
    objectTableMapping
} from 'src/core/pfmmapping/objectTableMapping';
import {
    lookupFieldMapping
} from 'src/core/pfmmapping/lookupFieldMapping';
import {
    themeChanger
} from 'src/theme/themeChanger';
import {
    appConfiguration
} from 'src/core/utils/appConfiguration';
import {
    metaDataDbProvider
} from 'src/core/db/metaDataDbProvider';
import {
    metaDbConfiguration
} from 'src/core/db/metaDbConfiguration';
import {
    metaDbValidation
} from 'src/core/utils/metaDbValidation';
import {
    appUtility
} from 'src/core/utils/appUtility';
import {
    DatePipe,
    CurrencyPipe,
    DecimalPipe
} from '@angular/common';
import {
    calendarBridge
} from 'src/core/nativebridges/calendarBridge';
import {
    mapBridge
} from 'src/core/nativebridges/mapBridge';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    approotpageModule
} from 'src/core/pages/approotpage/approotpage.module';
import {
    syncpageModule
} from 'src/core/pages/syncpage/syncpage.module';
import {
    homepageModule
} from 'src/core/pages/homepage/homepage.module';
import {
    lookuppageModule
} from 'src/core/pages/lookuppage/lookuppage.module';
import {
    jsondbProvider
} from 'src/core/db/jsondbProvider';
import {
    Camera
} from '@awesome-cordova-plugins/camera/ngx';
import {
    attachmentlistModule
} from 'src/core/pages/attachmentlist/attachmentlist.module';
import {
    attachmentCouchDbProvider
} from 'src/core/db/attachmentCouchDbProvider';
import {
    attachmentDbConfiguration
} from 'src/core/db/attachmentDbConfiguration';
import {
    attachmentDbProvider
} from 'src/core/db/attachmentDbProvider';
import {
    popoverpageModule
} from 'src/core/pages/popoverpage/popoverpage.module';
import {
    IonicStorageModule
} from '@ionic/storage-angular';
import {
    themepageModule
} from 'src/core/pages/themepage/themepage.module';
import {
    authGuard
} from 'src/authentication/authGuard';
import {
    sessionValidator
} from 'src/authentication/sessionValidator';
import {
    cs_status_workflowmodule
} from 'src/core/components/cs_status_workflow/cs_status_workflow.module';
import {
    cs_status_workflow_popovermodule
} from 'src/core/components/cs_status_workflow_popover/cs_status_workflow_popover.module';
import {
    initialSyncProcess
} from 'src/core/db/initialSyncProcess';
import {
    cs_whocolumn_popovermodule
} from 'src/core/components/cs_whocolumn_popover/cs_whocolumn_popover.module';
import {
    cs_whocolumn_iconmodule
} from 'src/core/components/cs_whocolumn_icon/cs_whocolumn_icon.module';
import {
    networkHandler
} from 'src/core/utils/networkHandler';
import {
    cspfmExecutionPouchDbConfiguration
} from 'src/core/db/cspfmExecutionPouchDbConfiguration';
import {
    cspfmExecutionPouchDbProvider
} from 'src/core/db/cspfmExecutionPouchDbProvider';
import {
    cspfmAuditDbProvider
} from 'src/core/db/cspfmAuditDbProvider';
import {
    cspfmFieldTrackingMapping
} from 'src/core/pfmmapping/cspfmFieldTrackingMapping';
import {
    cspfmAttachmentUploadModule
} from 'src/core/pages/cspfmAttachmentUpload/cspfmAttachmentUpload.module';
import {
    cspfmAttachementUploadDbProvider
} from 'src/core/db/cspfmAttachementUploadDbProvider';
import {
    cspfmFormulamodule
} from 'src/core/components/cspfmFormula/cspfmFormula.module';
import {
    NgxDatatableModule
} from '@swimlane/ngx-datatable';
import {
    cspfmamdModule
} from 'src/app/cspfmamd.module';
import {
    cspfmActionDataServices
} from 'src/core/utils/cspfmActionDataServices';
import {
    AngularSlickgridModule
} from 'angular-slickgrid';
import {
    cspfm_data_display
} from 'src/core/pipes/cspfm_data_display';
import {
    cspfmSettings
} from 'src/core/pages/cspfmSettings/cspfmSettings';
import {
    CalendarModule,
    DateAdapter
} from 'angular-calendar';
import {
    adapterFactory
} from 'angular-calendar/date-adapters/date-fns';
import {
    BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
    cspfmCustomFieldProvider
} from 'src/core/utils/cspfmCustomFieldProvider';
import {
    cspfmCalendarEventInfoModule
} from 'src/core/pages/cspfmCalendarEventInfo/cspfmCalendarEventInfo.module';
import {
    cspfmCalendarPageModule
} from 'src/core/pages/cspfmCalendarPage/cspfmCalendarPage.module';
import {
    cspfmdocumentuploadconfigurationModule
} from 'src/core/pages/cspfmdocumentuploadconfiguration/cspfmdocumentuploadconfiguration.module';
import {
    cspfmweblookuppageModule
} from 'src/core/pages/cspfmweblookuppage/cspfmweblookuppage.module';
import {
    cspfmSlickgridPopovermodule
} from 'src/core/components/cspfmSlickgridPopover/cspfmSlickgridPopover.module';
import {
    SlickgridPopoverService
} from 'src/core/services/slickgridPopover.service';
import {
    cspfmactionwebmodule
} from 'src/core/components/cspfmactionweb/cspfmactionweb.module';
import {
    FlatpickrModule
} from 'angularx-flatpickr';
import {
    EmbeddedModule
} from 'src/core/pages/embedded/embedded.module';
import {
    cspfmMetaCouchDbProvider
} from 'src/core/db/cspfmMetaCouchDbProvider';
import {
    cspfmExecutionCouchDbProvider
} from '../core/db/cspfmExecutionCouchDbProvider';
import {
    cs_status_workflow_historymodule
} from 'src/core/components/cs_status_workflow_history/cs_status_workflow_history.module';
import {
    cs_global_searchmodule
} from 'src/core/components/cs_global_search/cs_global_search.module';
import {
    cspfmGlobalSearchMoreActionPagemodule
} from 'src/core/pages/cspfmGlobalSearchMoreActionPage/cspfmGlobalSearchMoreActionPage.module';
import {
    CarouselModule
} from 'ng-carousel-cdk';
import {
    cspfmUrlPopovermodule
} from 'src/core/components/cspfmUrlPopover/cspfmUrlPopover.module';
import {
    ServiceWorkerModule
} from '@angular/service-worker';
import {
    environment
} from '../environments/environment';
import {
    NgxWaterfallModule
} from 'ngx-waterfall';
import {
    cspfmUrlmodule
} from 'src/core/components/cspfmUrl/cspfmUrl.module';
import {
    cspfmUrl
} from 'src/core/components/cspfmUrl/cspfmUrl';
import {
    cspfmWebActionmodule
} from 'src/core/components/cspfmWebAction/cspfmWebAction.module';
import {
    cspfmWebPopoverActionmodule
} from 'src/core/components/cspfmWebPopoverAction/cspfmWebPopoverAction.module';
import {
    cspfmRecordAssociationmodule
} from 'src/core/components/cspfmRecordAssociation/cspfmRecordAssociation.module';
import {
    cspfmWebAssociationPageModule
} from 'src/core/pages/cspfmWebAssociationPage/cspfmWebAssociationPage.module';
import {
    cspfmRecordAssociationDisplaymodule
} from 'src/core/components/cspfmRecordAssociationDisplay/cspfmRecordAssociationDisplay.module';
import {
    cs_conditionalvalidation_consolidatemodule
} from 'src/core/components/cs_conditionalvalidation_consolidate/cs_conditionalvalidation_consolidate.module';
import {
    cs_conditionalvalidation_toastmodule
} from 'src/core/components/cs_conditionalvalidation_toast/cs_conditionalvalidation_toast.module';
import {
    cs_conditionalvalidation_toast
} from 'src/core/components/cs_conditionalvalidation_toast/cs_conditionalvalidation_toast';
import {
    cs_conditionalvalidation_consolidate
} from './../core/components/cs_conditionalvalidation_consolidate/cs_conditionalvalidation_consolidate';
import {
    SignaturePadModule
} from 'angular2-signaturepad';
import {
    cspfmMoreActionPopovermodule
} from 'src/core/components/cspfmMoreActionPopover/cspfmMoreActionPopover.module';
import {
    cspfmMoreActionmodule
} from 'src/core/components/cspfmMoreAction/cspfmMoreAction.module';
import {
    cs_status_workflow_bulkapprovalmodule
} from 'src/core/components/cs_status_workflow_bulkapproval/cs_status_workflow_bulkapproval.module';
import {
    cs_status_workflow_bulkapproval
} from 'src/core/components/cs_status_workflow_bulkapproval/cs_status_workflow_bulkapproval';
import {
    NgxMasonryModule
} from 'ngx-masonry';
import {
    BarcodeScanner
} from '@awesome-cordova-plugins/barcode-scanner/ngx';
import {
    cspfmUserAssignmentmodule
} from 'src/core/components/cspfmUserAssignment/cspfmUserAssignment.module';
import {
    cspfmUserAssignmentPopovermodule
} from 'src/core/components/cspfmUserAssignmentPopover/cspfmUserAssignmentPopover.module';
import {
    cspfmCloneMappingInfoModule
} from '../core/pages/cspfmCloneMappingInfo/cspfmCloneMappingInfo.module';
import {
    cspfmBalloonComponentmodule
} from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent.module';
import {
    cspfmCustomActionModule
} from 'src/core/components/cspfmCustomAction/cspfmCustomAction.module';
import {
    cspfmCustomActionPopoverModule
} from 'src/core/components/cspfmCustomActionPopover/cspfmCustomActionPopover.module';
import {
    cspfmWebworker
} from 'src/core/services/cspfmWebworker.service';
import {
    cspfmHeaderLineUtils
} from 'src/core/dynapageutils/cspfmHeaderLineUtils';
import {
    cspfmRecordAssignmentUtils
} from 'src/core/dynapageutils/cspfmRecordAssignmentUtils';
import {
    cspfmSettingsModule
} from 'src/core/pages/cspfmSettings/cspfmSettings.module'
import {
    cspfmOnDemandFeature
} from 'src/core/utils/cspfmOnDemandFeature';
import {
    cspfmAlertDialogmodule
} from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog.module';
import {
    UserAssignSearchFilter
} from 'src/core/pipes/cspfmUserAssignmentpipe';
export function createTranslateLoader(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

// Fix for the issue of ModuleWithProviders<T> requires 1 type argument(s) While upgrading angular
declare module "@angular/core" {
    interface ModuleWithProviders < T = any > {
        ngModule: Type < T > ;
        providers ? : Provider[];
    }
}
@NgModule({
    declarations: [AppComponent, MenuComponent, cspfmSettings],
    imports: [
        // DatetimePickerModule,
        BrowserModule, BrowserAnimationsModule, SignaturePadModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        IonicModule.forRoot({
            scrollAssist: false
        }),
        NgxDatatableModule.forRoot({
            messages: {
                emptyMessage: 'No data to display', // Message to show when array is presented, but contains no values
                totalMessage: 'total', // Footer total message
                selectedMessage: 'selected' // Footer selected message
            }
        }),
        AngularSlickgridModule.forRoot(),
        IonicStorageModule.forRoot(),
        FlatpickrModule.forRoot(),
        cspfmamdModule,
        HttpClientModule,
        appRoutingModule,
        approotpageModule,
        cspfmAlertDialogmodule,
        popoverpageModule,
        syncpageModule,
        homepageModule,
        lookuppageModule, depemployee_d_w_viewmodule,
        depemployee_Entry_Webmodule,
        depemployee_d_w_listmodule,
        deppersonalinfo_d_w_hl_listmodule,
        deppersonalinfo_Entry_Webmodule,
        deppersonalinfo_d_w_listmodule,
        depchildinfo_d_w_hl_detail_viewmodule,
        depchildinfo_Entry_Webmodule,
        depchildinfo_d_w_listmodule,
        DepPerson_MultiLine_Entry_WEB_Grid_with_Listmodule,
        DepPersonInfoList_WEB_Listmodule,
        depmultiinfo_d_w_hl_detail_viewmodule,
        depmultiinfo_Entry_Webmodule,
        depmultiinfo_d_w_listmodule,

        cspfmweblookuppageModule,
        cspfmCalendarEventInfoModule,
        cspfmCalendarPageModule,
        FormsModule, attachmentlistModule, cspfmAttachmentUploadModule, cspfmdocumentuploadconfigurationModule,
        EmbeddedModule,
        ReactiveFormsModule,
        themepageModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        cs_status_workflowmodule,
        cs_status_workflow_popovermodule,
        cs_whocolumn_popovermodule,
        cs_whocolumn_iconmodule,
        cspfmFormulamodule,
        cspfmactionwebmodule,
        cspfmSlickgridPopovermodule,
        cs_status_workflow_historymodule,
        cs_status_workflow_bulkapprovalmodule,
        cspfmRecordAssociationmodule,
        cspfmWebAssociationPageModule,
        cspfmRecordAssociationDisplaymodule,
        cs_global_searchmodule,
        cspfmGlobalSearchMoreActionPagemodule,
        cspfmUrlPopovermodule,
        CarouselModule,
        NgxWaterfallModule,
        cspfmUrlmodule,
        cspfmWebActionmodule,
        cspfmWebPopoverActionmodule,
        cspfmMoreActionPopovermodule,
        cspfmMoreActionmodule,
        NgxMasonryModule,
        cspfmCloneMappingInfoModule,
        cspfmUserAssignmentmodule,
        cspfmUserAssignmentPopovermodule,
        cs_conditionalvalidation_consolidatemodule,
        cs_conditionalvalidation_toastmodule,
        cspfmBalloonComponentmodule,
        cspfmCustomActionModule,
        cspfmCustomActionPopoverModule,
        ServiceWorkerModule.register('/apps/ngsw-worker.js', {
            enabled: environment.production,
            registrationStrategy: 'registerImmediately'
        })
    ],
    providers: [
        CallNumber, cspfmExecutionCouchDbProvider, cspfmOnDemandFeature, UserAssignSearchFilter,
        EmailComposer, Camera, authGuard, sessionValidator, initialSyncProcess, cspfmMetaCouchDbProvider,
        StatusBar, ScreenOrientation, attachmentCouchDbProvider, attachmentDbProvider, attachmentDbConfiguration,
        SplashScreen, AppPreferences, objectTableMapping, lookupFieldMapping, Broadcaster,
        dbConfiguration, themeChanger, appConfiguration, metaDataDbProvider, metaDbConfiguration, metaDbValidation, SMS, File,
        FileOpener, Zip, LocalNotifications, cspfmActionDataServices,
        appUtility, DatePipe, Network, SocialSharing, jsondbProvider,
        dbProvider, couchdbProvider, calendarBridge, mapBridge, networkHandler, cspfmExecutionPouchDbConfiguration, cspfmExecutionPouchDbProvider, cspfmAuditDbProvider,
        cspfmFieldTrackingMapping, cspfmAttachementUploadDbProvider, CurrencyPipe, cspfm_data_display, SlickgridPopoverService, cspfmCustomFieldProvider, DecimalPipe, BarcodeScanner, cspfmWebworker, cspfmHeaderLineUtils, cspfmRecordAssignmentUtils, cspfmSettingsModule,
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: cspfmInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}