import { Injectable, NgZone, Injector } from '@angular/core';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { dbConfiguration } from '../db/dbConfiguration';
import { appConfiguration } from './appConfiguration';
import { ToastController, PopoverController, NavController, ToastOptions } from '@ionic/angular';
import * as moment from 'moment';
import * as lodash from 'lodash';
import 'moment-timezone';
import { popoverpage } from '../pages/popoverpage/popoverpage';
import { DatePipe } from '@angular/common';
import { themeChanger } from "../../theme/themeChanger";
import { StatusBar } from "@awesome-cordova-plugins/status-bar/ngx";
import { metaDataDbProvider } from '../db/metaDataDbProvider';
import { metaDbConfiguration } from '../db/metaDbConfiguration';
import { attachmentDbConfiguration } from '../db/attachmentDbConfiguration';
import { formulaDbConfiguration } from '../db/formulaDbConfiguration';
import { cspfmExecutionPouchDbConfiguration } from '../db/cspfmExecutionPouchDbConfiguration';
import { Router, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { cspfmNotificationService } from 'src/core/services/cspfmnotification.service';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

import { cspfmAlertDialog } from '../components/cspfmAlertDialog/cspfmAlertDialog';
import { DependentObjectListType } from '../models/cspfmLiveListenerConfig.type';
import { SlickgridPopoverService } from 'src/core/services/slickgridPopover.service';
import SimpleCrypto from "simple-crypto-js";
import { appConstant } from './appConstant';
import { HttpClient } from '@angular/common/http';
import { LayoutMode } from '../models/cspfmLayoutMode';
import { AngularGridInstance, SlickGrid } from 'angular-slickgrid';

export type DynamicImportFormat = {
    baseType: 'basefile';
    fileName: string;
    fileType: string;
} | {
    baseType: 'basepage';
    fileName: string;
    fileType: string;
} | {
    baseType: 'layout';
    fileName: string;
}

@Injectable({
    providedIn: 'root'
})
export class appUtility {

    public loggedUserCorObject: any;
    private _userGroups: any
    private _userResponsibilities: any
    public _loggedUserInfo: any;
    private _orgTimeZone = '';
    private _isMobile = true;
    private _isEmbeddingEnabled = false;
    private _osType: string = 'android';
    private _userId: number;
    private _roleId: number;
    private _accessToken: string;
    private _orgId: number;
    private _chainsysSessionId;
    private _platformWebNodeHostName;
    private _designerNodeHostName;
    private _contextName: string;
    private _assignedApps: any;
    // private _versionNumber: Number;
    private platformJsonPath = './platform.json';
    private _sessionId;
    private _appBuilderURL;
    private _socketServerURL;
    private _userTimeZone = '';
    private _userDateFormat = '';
    public hoursFormat = 'hh:mm a'; // hour format
    public hoursFormatForPlaceholder = 'hh:mm am/pm';
    public utcOffsetValue = '+0000';
    public userZoneOffsetValue = ''; // user timezone offset value. For eg: +0530, -0400
    public orgZoneOffsetValue = ''; // user timezone offset value. For eg: +0530, -0400
    public userDateTimeFormat = '';  // user profile datetime format
    public userZoneOffsetValueWithFormat = ''; // user timezone offset value. For eg: +05:30, -04:00
    public orgZoneOffsetValueWithFormat = ''; // user timezone offset value. For eg: +05:30, -04:00
    public userDatePickerFormat = ''; // Date picker format of user profile with uppercase
    public userDateTimePickerFormat = ''; // DateTime picker format of user profile
    public userDateTimePickerFormatForPlaceholder = '';
    public metaDataDbProvider: metaDataDbProvider
    public isAppSyncCompleted = false;
    public applicationName = '';
    private _isMobileResolution = true;
    public simpleCrypto = new SimpleCrypto("$mrT@pP-6!dr");
    public landingPageInfo = {
        path: "/menu/homepage",
        selector: "app-homepage"
    }

    // Will be set in Meta Validation class
    public loggedUserName = "";
    private homePageNodeFlag = true;
    homePageNode = {
        "homePageNodeName": "",
        "homePageNodepath": ""
    }
    eventSubscriptionObject = {}
    public notifications = []
    private _isTopHorizonatalMenu = false;
    private couchDbListenerStopped = false;
    private couchDbProviderList = {}
    private couchServerCheckedCount = 0;
    private maxCouchServerCheckCount = 3;
    public profilePicSrc;

    constructor(public notificationObj: cspfmNotificationService, public attachmentdbConfiguration: attachmentDbConfiguration, public formuladbConfiguration: formulaDbConfiguration, public cspfmexecutionPouchdbConfiguration: cspfmExecutionPouchDbConfiguration, public appPreferences: AppPreferences,
        public popoverController: PopoverController, private dbConfiguration: dbConfiguration, private appConfig: appConfiguration, private httpClient: HttpClient,
        public toastCtrl: ToastController, public datePipe: DatePipe, public theme: themeChanger, public statusBar: StatusBar, public metaDbConfig: metaDbConfiguration, public navCtrl: NavController,
        public router: Router, public translateService: TranslateService, public matDialog: MatDialog, public snackBar: MatSnackBar, private zone: NgZone,
        private dialog: MatDialog, private slickgridPopoverService: SlickgridPopoverService, public injector: Injector,) {

    }

    get orgTimeZone(): string {
        return this._orgTimeZone;
    }

    set orgTimeZone(orgTimezone: string) {
        this._orgTimeZone = orgTimezone;
    }
    get chainsysSessionId(): string {
        return this._chainsysSessionId;
    }

    set chainsysSessionId(chainsysSessionId: string) {
        this._chainsysSessionId = chainsysSessionId;
    }
    get platformWebNodeHostName(): string {
        return this._platformWebNodeHostName;
    }

    set platformWebNodeHostName(platformWebNodeHostName: string) {
        this._platformWebNodeHostName = platformWebNodeHostName;
    }
    get designerNodeHostName(): string {
        return this._designerNodeHostName;
    }

    set designerNodeHostName(designerNodeHostName: string) {
        this._designerNodeHostName = designerNodeHostName;
    }
    get contextName(): string {
        return this._contextName;
    }

    set contextName(contextName: string) {
        this._contextName = contextName;
    }
    get assignedApps(): any {
        return this._assignedApps;
    }

    set assignedApps(assignedApps: any) {
        this._assignedApps = assignedApps;
    }


    // getter setter for user timezone
    get userTimeZone(): string {
        return this._userTimeZone;
    }
    set userTimeZone(userTimezone: string) {
        this._userTimeZone = userTimezone;
    }

    // getter setter for user dateformat
    get userDateFormat(): string {
        return this._userDateFormat;
    }
    set userDateFormat(userDateformat: string) {
        this._userDateFormat = userDateformat;
    }

    // getter setter for isMobile flag
    get isEmbeddingEnabled(): boolean {
        return this._isEmbeddingEnabled;
    }
    set isEmbeddingEnabled(isEmbeddingEnabled: boolean) {
        this._isEmbeddingEnabled = isEmbeddingEnabled;
    }

    // getter setter for isMobile flag
    get isMobile(): boolean {
        return this._isMobile;
    }
    set isMobile(ismobile: boolean) {
        this._isMobile = ismobile;
    }

    get osType(): string {
        return this._osType;
    }
    set osType(value: string) {
        this._osType = value;
    }
    // getter setter for userId flag
    get userId(): number {
        return this._userId;
    }
    set userId(userid: number) {
        this._userId = userid;
    }

    // getter setter for roleId flag
    get roleId(): number {
        return this._roleId;
    }
    set roleId(roleId: number) {
        this._roleId = roleId;
    }
    get accessToken(): string {
        return this._accessToken;
    }
    set accessToken(accessToken: string) {
        this._accessToken = accessToken;
    }
    // // getter setter for version number
    // get versionNumber(): Number {
    //     return this._versionNumber;
    // }
    // set versionNumber(versionNumber: Number) {
    //     this._versionNumber = versionNumber;
    // }

    // getter setter for userId flag
    get orgId(): number {
        return this._orgId;
    }
    set orgId(orgid: number) {
        this._orgId = orgid;
    }

    get sessionId(): string {
        return this._sessionId;
    }
    set sessionId(sessionId: string) {
        this._sessionId = sessionId;
    }
    get appBuilderURL(): string {
        return this._appBuilderURL;
    }
    set appBuilderURL(couchUrl: string) {
        this._appBuilderURL = couchUrl;
    }
    get isMobileResolution(): boolean {
        return this._isMobileResolution;
    }
    set isMobileResolution(isMobileResolution: boolean) {
        this._isMobileResolution = isMobileResolution;
    }
    //Socket server url
    get socketServerURL(): string {
        return this._socketServerURL;
    }
    set socketServerURL(Url: string) {
        this._socketServerURL = Url;
    }

    get userGroups(): any {
        return this._userGroups;
    }

    set userGroups(userGroupsInfo) {
        this._userGroups = userGroupsInfo;
    }

    get userResponsibilities(): any {
        return this._userResponsibilities;
    }

    set userResponsibilities(userResponsibilitiesInfo) {
        this._userResponsibilities = userResponsibilitiesInfo;
    }

    get loggedUserInfo(): any {
        return this._loggedUserInfo;
    }

    set loggedUserInfo(loggedUserInfo) {
        this._loggedUserInfo = loggedUserInfo;
    }

    // getter setter for isTopHorizonatalMenu flag
    get isTopHorizonatalMenu(): boolean {
        return this._isTopHorizonatalMenu;
    }
    set isTopHorizonatalMenu(isTopHorizonatalMenu: boolean) {
        this._isTopHorizonatalMenu = isTopHorizonatalMenu;
    }

    // Date conversion
    displayDateConversionForList(dateFields, dataArray) {
        return dataArray.map((row) => {
            return this.displayDateConversionForSingleObject(dateFields, row);
        });
    }
    dbDateConversionForSingleObject(dateFields, object) {
        dateFields.forEach(element => {
            object[element] = object[element].substring(0, 4) + object[element].substring(5, 7) + object[element].substring(8, 10);
        });
        return object;
    }
    displayDateConversionForSingleObject(dateFields, object) {
        dateFields.forEach(element => {
            object[element] = object[element].substring(0, 4) + '-' + object[element].substring(4, 6) + '-' + object[element].substring(6, 8);
        });
        return object;
    }

    // isMobile checking using platform.json file
            initialSetup() {
            this.isMobile = false;
            this.getDeviceResolution()
            const taskList = [];
            taskList.push(this.fetchUserIdAndOrgIdFromPreference().then(userIdOrgIdRes => {
                return Promise.resolve(userIdOrgIdRes);
            }));

            const routes: Routes = this.router.config;
            taskList.push(this.setLandingPage(routes).then(res => {
                return res;
            }));
            return Promise.all(taskList).then(allRes => {
                return Promise.resolve(allRes[0]);
            })
            }
            
            /*initialSetup() {
        return this.httpClient.get(this.platformJsonPath).toPromise()
            .then((response) => {
                const resValue = response;
                if (resValue['platform'] === 'web') {
                    this.isMobile = false;
                    this.isMobileResolution = false
                } else {
                    this.isMobile = true;
                    this.osType = resValue['os_type'];
                    this.isMobileResolution = true
                }
                // this.getDeviceResolution();
                const taskList = [];
                taskList.push(this.fetchUserIdAndOrgIdFromPreference().then(userIdOrgIdRes => {
                    return Promise.resolve(userIdOrgIdRes);
                }));

                const routes: Routes = this.router.config;
                taskList.push(this.setLandingPage(routes).then(res => {
                    return res;
                }));
                return Promise.all(taskList).then(allRes => {
                    return Promise.resolve(allRes[0]);
                })
            }).catch((err) => {
                console.log(err);
                return Promise.resolve('Invalid session');
            });
    }
    */ //isMobileResolution checking for list refresh for web using change listener
    getDeviceResolution() {
        const mediaQuery = window.matchMedia("(max-device-width: 480px)");
        if (mediaQuery.matches) {
            this.isMobileResolution = true
        } else {
            this.isMobileResolution = false
        }
    }

    setLandingPage(routes: Routes) {
        if (this.isMobile) {
            return this.appPreferences.fetch('login_response').then(res => {
                const assignedApps = JSON.parse(res);
                return this.assignLandingPage(assignedApps, routes);
            })
        } else {
            const assignedApps = this.assignedApps;
            return this.assignLandingPage(assignedApps, routes);
        }
    }

    assignLandingPage(assignedApps, routes: Routes) {
        const currentApp = assignedApps.filter(assignedApp => {
            return assignedApp['appId'] === this.appConfig.configuration.appId;
        });
        if (currentApp && currentApp.length > 0) {
            if (currentApp[0]['landingPage'] && currentApp[0]['landingPage'] !== 'cspfm_default_landing_page') {
                this.landingPageInfo.selector = currentApp[0]['landingPage'];
                this.landingPageInfo.path = "/menu/" + currentApp[0]['landingPage'];
            }
        }
        return Promise.resolve('Success');
    }

    fetchSelectedTheme() {
        if (this.isMobile) {
            this.appPreferences.fetch('selectedTheme').then((PreferenceFetchRes) => {

                if (PreferenceFetchRes) {
                    const theme = JSON.parse(PreferenceFetchRes)
                    const primary = theme['primary'];
                    this.statusBar.backgroundColorByHexString(primary);
                    this.theme.changeTheme(PreferenceFetchRes);
                } else {
                    const defaultTheme = { "primary": "#ffdd67", "secondary": "#4d4d4d", "secondarylow": "#fde79a", "barbg": "#fbf8ec" };
                    this.statusBar.backgroundColorByHexString('#dabc56');
                    this.theme.changeTheme(JSON.stringify(defaultTheme));
                    this.appPreferences.store('selectedTheme', JSON.stringify(defaultTheme)).then(PreferenceStoreRes => {
                        
                    })
                }

            });
        } else {
            const selectedTheme = localStorage.getItem('selectedTheme');
            if (selectedTheme) {
                this.theme.changeTheme(selectedTheme);
            } else {
                const defaultTheme = { "primary": "#ffdd67", "secondary": "#4d4d4d", "secondarylow": "#fde79a", "barbg": "#fbf8ec" };
                this.theme.changeTheme(JSON.stringify(defaultTheme));
                localStorage.setItem('selectedTheme', JSON.stringify(defaultTheme))
            }
        }
    }

    fetchUserIdAndOrgIdFromPreference() {
        if (this.isMobile) {
            const taskList = [];
            taskList.push(this.appPreferences.fetch('userId').then((UserIdRes) => {
                return UserIdRes;
            }));

            taskList.push(this.appPreferences.fetch('orgId').then((OrgIdRes) => {
                return OrgIdRes;
            }));

            taskList.push(this.appPreferences.fetch('SessionId').then((SessionIdRes) => {
                return SessionIdRes;
            }));

            taskList.push(this.appPreferences.fetch('appBuilderURL').then((appBuilderRes) => {
                return appBuilderRes;
            }));

            taskList.push(this.appPreferences.fetch('userTimeZone').then((userTimeZoneRes) => {
                return userTimeZoneRes;
            }));

            taskList.push(this.appPreferences.fetch('userDateFormat').then((userDateFormatRes) => {
                return userDateFormatRes;
            }));

            taskList.push(this.appPreferences.fetch('dbname').then((dbNameRes) => {
                return dbNameRes;
            }));
            taskList.push(this.appPreferences.fetch('proxy_pass').then((proxypassRes) => {
                return proxypassRes;
            }));

            taskList.push(this.appPreferences.fetch('user_name').then((userNameRes) => {
                return userNameRes;
            }));

            taskList.push(this.appPreferences.fetch('password').then((passwordRes) => {
                return passwordRes;
            }));

            taskList.push(this.appPreferences.fetch('roleId').then((roleIdRes) => {
                return roleIdRes;
            }));
            taskList.push(this.appPreferences.fetch('accessToken').then((accessTokenRes) => {
                return accessTokenRes;
            }));
         
            taskList.push(this.appPreferences.fetch('orgTimeZone').then((orgTimeZone) => {
                return orgTimeZone;
            }));


            return Promise.all(taskList).then(res => {
                this.userId = res[0];
                this.orgId = res[1];
                this.sessionId = res[2];
                this.appBuilderURL = res[3];
                this.userTimeZone = res[4]; // assigning user profile timezone
                this.userDateFormat = res[5]; // assigning user profile date format
                let credentials = btoa(res[8] + ":" + res[9]);
                //dbconfiguration assignment
                this.dbConfiguration.remoteDbUrl = res[7];
                this.dbConfiguration["credentials"] = credentials;

                //attachment dbconfiguration assignment
                this.attachmentdbConfiguration.remoteDbUrl = res[7];
                this.attachmentdbConfiguration["credentials"] = credentials;

                //cspfm execution dbconfiguration assigment
                this.cspfmexecutionPouchdbConfiguration.remoteDbUrl = res[7];
                this.cspfmexecutionPouchdbConfiguration["credentials"] = credentials;

                //formula dbconfiguration assignment
                this.formuladbConfiguration.remoteDbUrl = res[7];
                this.formuladbConfiguration["credentials"] = credentials;

                //metadata dbconfiguration assigment
                this.metaDbConfig.remoteDbUrl = res[7];
                this.metaDbConfig["credentials"] = credentials;

                this.roleId = res[10];
                this.accessToken = res[11];
                this.orgTimeZone = res[12];

                this.profilePicSrc = this.getUserImageURL(this.userId)

                this.makeDateTimePickerFormatAndZoneValues();

                this.appPreferences.fetch('login_response').then(res => {
                    const assignedApps = JSON.parse(res);
                    if (assignedApps.length > 0) {
                        const currentAppId = this.appConfig.configuration.appId;
                        let currentObject = assignedApps.filter(app => app.appId === currentAppId);
                        this.applicationName = currentObject[0]['appDisplayName'];
                    }
                })

                return Promise.resolve('Success');
            });
        } else {
            this.userId = JSON.parse(this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['userId']);
            this.roleId = JSON.parse(this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['roleId']);
            this.orgId = JSON.parse(this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['orgId']);
            this.appBuilderURL = this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['appBuilderURL'];
            this.sessionId = this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['sessionId'];
            this.designerNodeHostName = this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['designerNodeHostName'];
            this.profilePicSrc = this.getUserImageURL(this.userId)
            this.userTimeZone = this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['userTimeZone'];
            this.userDateFormat = this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['userDateFormat'];
            this.orgTimeZone = this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['orgTimeZone'];
            this.chainsysSessionId = this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['chainsysSessionId'];
            this.platformWebNodeHostName = this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['platformWebNodeHostName'];
            this.contextName = this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['contextName'];
            this.makeDateTimePickerFormatAndZoneValues();

            this.assignedApps = this.simpleCrypto.decryptObject(localStorage.getItem("assignedAppArray"))['assignedApps'];
             this.assignedApps = Array.isArray(this.assignedApps) ? this.assignedApps : JSON.parse(this.assignedApps);
            if (this.assignedApps.length > 0) {
                const currentAppId = this.appConfig.configuration.appId;
                let currentObject = this.assignedApps.filter(app => app.appId === currentAppId);
                this.applicationName = currentObject[0]['appDisplayName'];
            }
            //Need to assign the same to mobile flow also
            this.userGroups = JSON.parse(this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['userGroupsId']);
            this.userResponsibilities = JSON.parse(this.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['userResponsibilitiesId']);
            if (this.sessionId) {
                return Promise.resolve(this.getAdditionalInfo(this.orgId, this.userId, this.sessionId));
            }
            // Note : Do not remove the below mentioned commentted line, used in builder source.
            
            else {
                this.dbConfiguration.remoteDbUrl = 'http://172.26.3.88:5984/';
                this.dbConfiguration["credentials"] = 'YXBwZGF0YXVzZXI6NGdLclFOQUhMNXVZMkRrRmQ2SEQ=';
                
                //attachment dbconfiguration assignment
                this.attachmentdbConfiguration.remoteDbUrl = 'http://172.26.3.88:5984/';
                this.attachmentdbConfiguration["credentials"] = 'YXBwZGF0YXVzZXI6NGdLclFOQUhMNXVZMkRrRmQ2SEQ=';

                //cspfm execution dbconfiguration assignment
                this.cspfmexecutionPouchdbConfiguration.remoteDbUrl = 'http://172.26.3.88:5984/';
                this.cspfmexecutionPouchdbConfiguration["credentials"] = 'YXBwZGF0YXVzZXI6NGdLclFOQUhMNXVZMkRrRmQ2SEQ=';

                //formula dbconfiguration assignment
                this.formuladbConfiguration.remoteDbUrl = 'http://172.26.3.88:5984/';
                this.formuladbConfiguration["credentials"] = 'YXBwZGF0YXVzZXI6NGdLclFOQUhMNXVZMkRrRmQ2SEQ=';

                //metadata dbconfiguration assignment
                this.metaDbConfig.remoteDbUrl = 'http://172.26.3.88:5984/';
                this.metaDbConfig["credentials"] = 'YXBwZGF0YXVzZXI6NGdLclFOQUhMNXVZMkRrRmQ2SEQ=';
                return Promise.resolve(this.checkAppId(this.isMobile));
            }
            
           //     // Note : If sessionid is there for all the platform(CSPFM,JWT). Need to remove this else part and if condition.
            //     this.dbConfiguration.databaseName = this.dbConfiguration.configuration.databaseName;
            //     this.dbConfiguration.remoteDbUrl = this.dbConfiguration.configuration.remoteDbUrl;
            //     this.dbConfiguration["credentials"] = this.dbConfiguration.configuration["credentials"];
            //     return Promise.resolve(this.checkAppId(this.isMobile));
            // }
        
        }
    }

    makeDateTimePickerFormatAndZoneValues() {
        this.userDateTimeFormat = this.userDateFormat + ' ' + this.hoursFormat; // assigning user profile date time format
        this.userDatePickerFormat = this.userDateFormat.toUpperCase(); // assigning user profile date format with uppercase for date picker
        this.userDateTimePickerFormat = this.userDatePickerFormat + ' ' +
            this.hoursFormat; // assigning user profile date time format for date time picker
        this.userDateTimePickerFormatForPlaceholder = this.userDatePickerFormat + ' ' +
        this.hoursFormatForPlaceholder;


        this.userZoneOffsetValue = this.convertUserProfileOffsetToZoneNumber(this._userTimeZone); // Method calling to get user timezone offset value. For eg: +0530, -0400
        this.userZoneOffsetValueWithFormat = this.convertUserProfileOffsetToZoneNumberWithFormat(this._userTimeZone); // Method calling to get user timezone offset value. For eg: +05:30, -04:00

        this.orgZoneOffsetValue = this.convertUserProfileOffsetToZoneNumber(this._orgTimeZone); // Method calling to get user timezone offset value. For eg: +0530, -0400
        this.orgZoneOffsetValueWithFormat = this.convertUserProfileOffsetToZoneNumberWithFormat(this._orgTimeZone); // Method calling to get user timezone offset value. For eg: +05:30, -04:00
    }


    getAdditionalInfo(orgId, userId, sessionId) {
        const postData = {
            "inputparams": {
                "userId": userId,
                "orgId": orgId,
                "appname": "appM",
                "isEncryptRequired": true,
                // "isNewApplication": true, // This key has been added to use in the old app without any problems. Commited Taskname - Couch cookie authentication..!
                "processInfo": [{
                    "isCouchInfoRequired": "Y",
                    "isPushNotificationInfoRequired": "N"
                }]
            }
        }

        if (this.isMobile) {
            postData.inputparams['sessionToken'] = this.accessToken
            postData.inputparams['sessionType'] = "OAUTH"
        } else {
            postData.inputparams['sessionToken'] = sessionId
            postData.inputparams['sessionType'] = "NODEJS"
        }

        const serviceURl = '/apps/additionalInfoService';
        return this.httpClient
            .post(serviceURl, postData).toPromise()
            .then(res => {
                const response = res;
                if (response['status'] === 'SUCCESS') {
                    const simpleCrypto = new SimpleCrypto(postData.inputparams['sessionToken']);
                    let credentials_proxy: any = simpleCrypto.decrypt(response["couchInfo"]);
                    credentials_proxy = JSON.parse(credentials_proxy);
                    //Socket server url
                    this.socketServerURL = response['socketServerUrl']
                    this.dbConfiguration["credentials"] = credentials_proxy["credentials"];
                    this.dbConfiguration.remoteDbUrl = credentials_proxy['proxy_pass'] + '/';

                    //attachment dbconfiguration assignment
                    this.attachmentdbConfiguration.remoteDbUrl = credentials_proxy['proxy_pass'] + '/';
                    this.attachmentdbConfiguration["credentials"] = credentials_proxy["credentials"];

                    //cspfm execution dbconfiguration assigment
                    this.cspfmexecutionPouchdbConfiguration.remoteDbUrl = credentials_proxy['proxy_pass'] + '/';
                    this.cspfmexecutionPouchdbConfiguration["credentials"] = credentials_proxy["credentials"]

                    //formula dbconfiguration assignment
                    this.formuladbConfiguration.remoteDbUrl = credentials_proxy['proxy_pass'] + '/';
                    this.formuladbConfiguration["credentials"] = credentials_proxy["credentials"]

                    //metadata dbconfiguration assigment
                    this.metaDbConfig.remoteDbUrl = credentials_proxy['proxy_pass'] + '/';
                    this.metaDbConfig["credentials"] = credentials_proxy["credentials"]
                    this.initNotification();
                    return Promise.resolve(this.checkAppId(this.isMobile));
                } else {
                    if (response['status'] === 'Upgrade Required') {
                        let buttonInfo = [{
                            "name": "OK",
                            handler: () => {
                                window.location.replace('/apps');
                            }
                        }];
                        this.showInfoAlert(response["message"], buttonInfo, true);
                        return Promise.resolve(response['status'])
                    } else if (response === "Session Expired") {
                        this.presentToast("Session Expired");
                        setTimeout(() => {
                            window.location.replace('/apps');
                        }, 1500);
                        return Promise.resolve(response);
                    } else {
                        return Promise.resolve('Server error');
                    }
                }


            })
            .catch(error => {
                console.log('An error occurred', error);
                return Promise.resolve(error.message || 'Server connection failed');
            });
    }

    convertUserProfileOffsetToZoneNumber(timeZone) {
        const offsetValue = moment.tz(timeZone).utcOffset();
        let zoneString = '';
        let positiveNegativeValue = '';

        if (offsetValue >= 0) {
            positiveNegativeValue = '+';
        } else {
            positiveNegativeValue = '-';
        }

        const zoneOffset = Math.abs(offsetValue) / 60;

        const zoneValue = zoneOffset.toString();
        if (zoneValue.length === 1) {
            zoneString = positiveNegativeValue + '0' + zoneValue + '00';
        } else if (zoneValue.length === 2) {
            zoneString = positiveNegativeValue + zoneValue + '00';
        } else {
            const zoneValueSplitArray = zoneValue.split('.');
            const firstIndex = zoneValueSplitArray[0];
            const secondIndex = zoneValueSplitArray[1];

            const percentToHour = (Number(secondIndex) * 60 / 100).toString();

            let hourValue = '';
            if (percentToHour.length === 1) {
                hourValue = percentToHour + '0';
            } else {
                hourValue = percentToHour;
            }

            if (firstIndex.length === 1) {
                zoneString = positiveNegativeValue + '0' + firstIndex + hourValue;
            } else {
                zoneString = positiveNegativeValue + firstIndex + hourValue;
            }
        }
        return zoneString;
    }

    convertUserProfileOffsetToZoneNumberWithFormat(timeZone) {
        const offsetValue = moment.tz(timeZone).utcOffset();
        let zoneString = '';
        let positiveNegativeValue = '';

        if (offsetValue >= 0) {
            positiveNegativeValue = '+';
        } else {
            positiveNegativeValue = '-';
        }

        const zoneOffset = Math.abs(offsetValue) / 60;

        const zoneValue = zoneOffset.toString();
        if (zoneValue.length === 1) {
            zoneString = positiveNegativeValue + '0' + zoneValue + ':00';
        } else if (zoneValue.length === 2) {
            zoneString = positiveNegativeValue + zoneValue + ':00';
        } else {
            const zoneValueSplitArray = zoneValue.split('.');
            const firstIndex = zoneValueSplitArray[0];
            const secondIndex = zoneValueSplitArray[1];

            const percentToHour = (Number(secondIndex) * 60 / 100).toString();

            let hourValue = '';
            if (percentToHour.length === 1) {
                hourValue = percentToHour + '0';
            } else {
                hourValue = percentToHour;
            }

            if (firstIndex.length === 1) {
                zoneString = positiveNegativeValue + '0' + firstIndex + ':' + hourValue;
            } else {
                zoneString = positiveNegativeValue + firstIndex + ':' + hourValue;
            }
        }
        return zoneString;
    }

    checkAppId(isMobile) {
        if (!isMobile) {
            if (this.assignedApps) {
                const assignedApps = this.assignedApps;

                const assignedAppIds = assignedApps.map(obj => obj.appId);

                if (assignedAppIds.indexOf(this.appConfig.configuration.appId) < 0) {
                    return Promise.resolve('This app not assigned to you!!!');
                } else {
                    return Promise.resolve('Success');
                }

            } else {
                return Promise.resolve('This app not assigned to you!!!');
            }
        } else {
            return Promise.resolve('Success');
        }
    }
    getMultiAndSinglePickerDisplayName(couchValue, jsonValue) {
        const result = [];
        let displayValue: string = '';
        for (const data of couchValue) {
            jsonValue.filter((item) => {
                const value = item[data];
                if (value !== undefined) {
                    result.push(value);
                }
            });
            displayValue = result.toString();
        }
        return displayValue;
    }
    validateWebUrl(weburl) {
        const regexp = new RegExp('^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$');
        if (!regexp.test(weburl)) {
            this.presentToast('URL is not valid');
        } else {
            window.open(weburl, '_system');
        }
    }
    presentToast(message, toastDuration?: number): MatSnackBarRef<SimpleSnackBar> {
       
        return this.zone.run(() => {
            if (toastDuration) {
                return this.snackBar.open(message, '', { duration: toastDuration });
            } else {
                return this.snackBar.open(message, '', { duration: 2000 });
            }
        
        });
    }    

    async presentPopover(myEvent, items) {
        const popover = await this.popoverController.create({
            component: popoverpage,
            componentProps: { message: 'passed message', popoverController: items },
            event: myEvent,
            translucent: true
        });
        return await popover.present();
    }

    getApplicationName() {
        let appName = '';
        let assignedAppsInfo = this.assignedApps;
        if (assignedAppsInfo.length === 0) {
            return appName;
        }

        assignedAppsInfo.forEach(assignedApp => {
            if (assignedApp['appId'] === this.appConfig.configuration.appId) {
                appName = assignedApp['appName'];
            }
        });

        return appName;
    }

    makeLogObjectWithRequiredValues(logContent, type) {
        if (this._isMobile) {
            return;
        }
        let messageObject = {}
        messageObject['user_id'] = this.userId;
        messageObject['app_id'] = this.appConfig.configuration.appId;
        messageObject['org_id'] = this.orgId;
        messageObject['app_name'] = this.getApplicationName();
        messageObject['system_time'] = this.datePipe.transform(new Date(), 'dd-MM-yyyy HH:mm:ss.SSS');
        messageObject['log_content'] = logContent;
        this.writeLogToServer(messageObject, type);
    }

    writeLogToServer(messageObject, type) {
        var url = window.location.href
        var arr = url.split("/");
        var result = arr[0] + "//" + arr[2]
        var path = result.concat('/apps/api/write_log')

        let postParams = { 'type': type, 'message': messageObject };

        this.httpClient.post(path, postParams).toPromise()
            .then(data => {
                let responseBody = data;
                let status = responseBody['status'];

            }, error => {
                console.log("Error : " + JSON.stringify(error));
            });
    }

    setDataRestrictionByRestrictionType(referenceDetail, options, layoutDataRestrictionSet) {

        if (referenceDetail['objectType'].toUpperCase() !== 'PRIMARY') {
            return;
        }

        var userIDs = [];
        layoutDataRestrictionSet.forEach(element => {
            userIDs = userIDs.concat(element['restrictedDataUserIds'])
        })
        if (userIDs !== undefined && userIDs.length !== 0) {
            if (userIDs.length > 1) {
                options['selector']['data.createdby'] = {
                    $in: userIDs
                }
            } else {
                options['selector']['data.createdby'] = userIDs[0]
                
            }
        } else {
            console.log("User Id restriction is not set and objectType is : ", referenceDetail['objectType'].toUpperCase());
        }
    }

    setDataRestrictionByUsers(layoutDataRestrictionSet, objectHierarchyJSON) {
        if (layoutDataRestrictionSet.length > 0) {
            layoutDataRestrictionSet.forEach(dataRestriction => {
                if (dataRestriction['restrictionType'] === 'Owner') {//If the layout data restriction level is "Owner"
                    if (objectHierarchyJSON['options']) {
                        if (objectHierarchyJSON['options']['selector']) {
                            objectHierarchyJSON['options']['selector']['data.type'] = "pfm" + objectHierarchyJSON['objectId']
                            objectHierarchyJSON['options']['selector']['data.createdby'] = this.userId
                        }
                    } else {
                        objectHierarchyJSON['options'] = {
                            "selector": {
                                "data.type": "pfm" + objectHierarchyJSON['objectId'],
                                "data.createdby": this.userId
                            }
                        }
                    }
                }
            });
        }
        return objectHierarchyJSON;
    }
    setHomePageNode() {
        if (this.homePageNodeFlag && this.isMobile) {
            setTimeout(() => {
                // this.homePageNode['homePageNodeName'] = document.getElementsByTagName('ion-router-outlet')[1].childNodes[0].childNodes[0].textContent
                this.homePageNode['homePageNodeName'] = "Home"
                this.homePageNode['homePageNodepath'] = document.getElementsByTagName('ion-router-outlet')[1].children[0].tagName.toLowerCase()
                this.homePageNodeFlag = false
            }, 1000);
        }
    }
    getHomePageNode() {
        if (!this.homePageNodeFlag) {                               //this.homePageNodeFlag tells us if the setHomePageNode() is called or not.
            if (this.homePageNode.homePageNodeName === "") {
                this.homePageNode.homePageNodeName = "Home";
                return this.homePageNode
            }
            return this.homePageNode
        }
    }
    navigateToHomepage() {
        const queryParamsRouting = { "isFromMenu": true }
        this.navCtrl.navigateBack([this.landingPageInfo.path], { skipLocationChange: true, queryParams: queryParamsRouting })
    }
    setEventSubscriptionlayoutIds(tableName, layoutId, dataSource?) {
        if (this.eventSubscriptionObject[dataSource]) {
            if (this.eventSubscriptionObject[dataSource][tableName]) {
                this.eventSubscriptionObject[dataSource][tableName][layoutId] = "";
            } else {
                this.eventSubscriptionObject[dataSource][tableName] = {};
                this.eventSubscriptionObject[dataSource][tableName][layoutId] = "";
            }
        } else {
            this.eventSubscriptionObject[dataSource] = {};
            this.eventSubscriptionObject[dataSource][tableName] = {};
            this.eventSubscriptionObject[dataSource][tableName][layoutId] = "";
        }
        
    }
    getEventSubscriptionlayoutIds(dataSource, tableName) {
        if (this.eventSubscriptionObject[dataSource]) {
            if (this.eventSubscriptionObject[dataSource][tableName]) {
                return Object.keys(this.eventSubscriptionObject[dataSource][tableName])
            } else {
                return
            }
        } else {
            return
        }
    }
    checkPageAlreadyInStack(redirectUrl) {
        var stackArray = document.getElementsByTagName('ion-router-outlet')[1].children
        for (let i = 0; i < stackArray.length; i++) {
            if ("/menu/" + stackArray[i].tagName.toLowerCase() === redirectUrl.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
    innerDependentObjectIdCheck(currentObject, pathArray, type, modified, providerType?, formulaAndRollupFieldInfo?, modifiedRecordWithConversion?) {
        var tempObject = currentObject;
        for (let i = 0; i < pathArray.length; i++) {
            tempObject = this.getObject(tempObject, pathArray[i], modifiedRecordWithConversion)            
            if (tempObject) {
                if (i === pathArray.length - 1) {
                    if (providerType) {
                        let isValueChanged = this.checkFormulaOrRollupColumnValuesChanged(modified, tempObject, formulaAndRollupFieldInfo)
                        return type + "_2_" + tempObject['id'] === modified['id'] && isValueChanged
                    } else {
                        return type + "_2_" + tempObject['id'] === modified['id']
                    }
                }
            } else {
                return false
            }
        }
    }
    getObject(object, key, modifiedRecordWithConversion?) {
        // Chcek for right key
        key = this.getCorrectKey(object, key)
        if (!key) {
            return false
        }
        // Check whether object is JSON or Array and return the inner object
        if (object[key]) {                                //if object is an object
            if (object[key][0]) {
                if (Object.keys(object[key][0]).length > 0) {
                    return object[key][0]
                } else {
                    return false
                }
            } else {
                if (Object.keys(object[key]).length > 0) {
                    return object[key]
                } else if (modifiedRecordWithConversion != null && modifiedRecordWithConversion[object['type']] === object['id']) {
                    return modifiedRecordWithConversion
                } else {
                    return false
                }
            }
        } else if (object[0]) {                      //if object is an array
            if (object[0][key]) {
                if (object[0][key][0]) {
                    if (Object.keys(object[0][key][0]).length > 0) {
                        return object[0][key][0]
                    } else {
                        return false
                    }
                } else {
                    if (Object.keys(object[0][key]).length > 0) {
                        return object[0][key]
                    } else {
                        return false
                    }
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
    getCorrectKey(object, key) {
        // Chcek for right key
        if (object[key + "s"]) {
            return key + "s"
        } else if (object[key]) {
            return key
        } else if (object[0]) {
            if (object[0][key + "s"]) {
                return key + "s"
            }
            if (object[0][key]) {
                return key
            } else {
                return false
            }
        } else {
            return false
        }
    }
    getUserImageURL(userId) {
        return this.designerNodeHostName + "/fscontroller/downloadfile?fileName=/dynaImages/" +
        this.orgId + "/user/" + userId + "_L_img.png&nodeGUID=" + this.appConfig.configuration['nodeGUID'];
    }

    makeRegexQuery(queryValue: string) {
        return queryValue.replace(/[!-/:-@[-`{-~]/g, '?').toLowerCase().split(' ').join('?') + "*";
    }

    makeRegexQueryMultiSelect(queryValue: string) {
        return queryValue.replace(/[!-/:-@[-`{-~]/g, '?').toLowerCase().split(' ').join('?');
    }

    checkFormulaOrRollupColumnValuesChanged(modified, object, formulaAndRollupFieldInfo) {
        let isChangesOccurred = false;
        let objectType = modified['doc']['data']['type']
        if (formulaAndRollupFieldInfo[objectType] && formulaAndRollupFieldInfo[objectType].length > 0) {
            formulaAndRollupFieldInfo[objectType].forEach(element => {
                let splittedField = element.split("__")
                let finalField = splittedField[0]
                if (modified['doc']['data'][finalField]) {
                    if (object[element] !== modified['doc']['data'][finalField]) {
                        isChangesOccurred = true;
                    }
                }
            });
        }
        return isChangesOccurred;
    }

    webServiceCallForFieldTracking(data, fields?) {
        const serviceUrl = this.appBuilderURL + '/appmBuilderMapping'

        const params = {
            "session_id": this.sessionId,
            "user_id": this.userId,
            "org_id": this.orgId,
            "object_id": data['type'].replace('pfm', ''),
            "_id": data['type'] + '_' + 2 + '_' + data['id'],
            "contextName": this.contextName,
            "userProfileZone": this.userTimeZone,
            "userDateTimeFormat": this.userDatePickerFormat,
            "field_name": fields
        }


        var dialogData;
        if (navigator.onLine) {
            return this.httpClient.post(serviceUrl, params).toPromise()
                .then(response => {
                    let res = response
                    if (res['status'] === 'Success') {
                        res['message'] = res['message'].replace(/'\'/g, '')

                        dialogData = {
                            url: res['message'],
                            type: "Audit",
                            parentContext: this
                        };
                        return dialogData;
                    } else {
                        dialogData = {
                            title: "Failed",
                            description: res['message'],
                            buttonInfo: [
                                {
                                    "name": "OK"
                                }
                            ],
                            type: "Alert",
                            parentContext: this
                        };
                        return dialogData;
                    }
                }).catch(error => {
                    console.log('error==>' + JSON.stringify(error));
                    dialogData = {
                        title: "Error",
                        description: "Service Unavailable please retry after sometime",
                        buttonInfo: [
                            {
                                "name": "OK"
                            }
                        ],
                        type: "Alert",
                        parentContext: this
                    };
                    return dialogData
                });
        } else {
            dialogData = {
                title: "Failed",
                description: "No network connection",
                buttonInfo: [
                    {
                        "name": "OK"
                    }
                ],
                type: "Alert",
                parentContext: this
            };
            return Promise.resolve(dialogData)
        }
    }
    setColumnWidth(columnDefinitions) {
        const maxWidth = 250;
        const minWidth = 80;
        columnDefinitions.forEach(columnDef => {
            var widthsArray = []
            widthsArray.push(columnDef['params']['columnWidth'] * 11)
            if (columnDef['params']['actionInfo']) {
                widthsArray.push(this.calculateButtonWidth(columnDef))
            }
            widthsArray.push(this.calculateNameKeyWidth(columnDef))
            let maxVal = Math.max(...widthsArray)
            columnDef['width'] = maxVal > maxWidth ? maxWidth : (maxVal < minWidth ? minWidth : maxVal)
        })
    }
    calculateButtonWidth(columnDef) {
        const padding = 12;
        var width = 0;
        if (columnDef['params']['actionInfo'].length > 0) {
            columnDef['params']['actionInfo'].forEach(actionInfo => {
                width += this.getButtonWidth(actionInfo)
            })
        }
        return width + padding;
    }
    getButtonWidth(actionInfo) {
        switch (actionInfo['actionDisplayType']) {
            case "Button":
                return this.calculateButtonLength(actionInfo)
            case "IconandButton":
                return this.calculateButtonLength(actionInfo) + 50
            case "Icon":
                return 50
            default:
                return 80
        }
    }
    calculateButtonLength(actionInfo) {
        return (actionInfo['actionLabel'].length * 11)
    }

    calculateNameKeyWidth(columnDef) {
        var title = "";
        if (columnDef['nameKey'].includes('.')) {
            title = this.translateService.instant(columnDef['nameKey'])
        } else {
            title = columnDef['nameKey']
        }
        return title.length * 11
    }

      initNotification() {
        if (!this.isEmbeddingEnabled) {
            this.notificationObj.initsocket(this.socketServerURL, {
                transports: ['websocket', 'xhr-polling'],
                'reconnection delay': 2000,
                'force new connection': true,
                query: 'idtfr=' + this.userId + '&orgId=' + this.orgId
            })
            this.subscribeNotifications()
            this.notificationObj.notificationRequest()
        }
    }
    subscribeNotifications() {
        this.notificationObj
            .getMessages()
            .subscribe((notification: string) => {
                if (notification) {
                    var notifyArray = JSON.parse(notification);
                    if (notifyArray.constructor === Array && notifyArray.length > 0) {
                        notifyArray.forEach(element => {
                            if (element['notificationRecipients']) {
                                var notificationRecipients = element['notificationRecipients']
                                var loggeduserNotifyDetail = notificationRecipients.find(recipient => {
                                    return recipient.userId === this.userId
                                })
                                if (loggeduserNotifyDetail && loggeduserNotifyDetail['isSeen'] === 'N') {
                                    this.notifications.push(element)
                                }
                            }
                        });
                    }
                }
            });
    }

    public datetimeValidation(fieldValue) {
        if (fieldValue && !moment(fieldValue, this.userDateTimePickerFormat, true).isValid()) {
            return false;
        }
        return true;
    }
    public dateValidation(fieldValue) {
        if (fieldValue && !moment(fieldValue, this.userDatePickerFormat, true).isValid()) {
            return false;
        }
        return true;
    }

    couchListenerStopped(providerName: string, providerObject) {
        this.couchDbProviderList[providerName] = providerObject;
        providerObject.networkWithOutConnectivity()

        if (this.couchDbListenerStopped === false) {
            this.couchDbListenerStopped = true;
            this.couchServerCheckedCount = 0;
            this.checkCouchConnection();
        }
    }

    showListenerStopAlert(message) {
        const dialogConfig = new MatDialogConfig()

        dialogConfig.data = {
            title: message,
            buttonInfo: [
                {
                    "name": "OK",
                    "handler": () => {
                        let appId = this.appConfig.configuration.appId;
                        let appUrl = 'apps/pfm_apps/' + this.orgId + '/' + appId + '/index.html'
                        if (location.protocol === "http:") {
                            window.location.href = `http://${location.hostname}:${location.port}/${appUrl}`;
                        } else {
                            window.location.href = `https://${location.hostname}/${appUrl}`;
                        }

                        this.couchDbListenerStopped = false;
                    }
                }
            ],
            parentContext: this,
            type: "Alert"
        };
        dialogConfig.autoFocus = false

        this.matDialog.open(cspfmAlertDialog, dialogConfig);
    }

    startCouchListener() {
        Object.keys(this.couchDbProviderList).forEach(providerName => {
            let providerObject = this.couchDbProviderList[providerName];
            providerObject.networkWithConnectivity()
        })
    }

    checkCouchConnection() {
        const header = this.addCredentialforMobile('AJAX', this.dbConfiguration)
        let url = this.dbConfiguration.remoteDbUrl + '_up'

        this.httpClient.get(url, header).toPromise()
        .then(res => {
            const jsonObj = res
                if (jsonObj['status'] === 'ok') {
                    this.couchDbListenerStopped = false;
                    this.couchServerCheckedCount = 0;
                    this.startCouchListener();
                } else {
                    this.couchServerCheckedCount += 1;
                    if (this.couchServerCheckedCount < this.maxCouchServerCheckCount) {
                        this.checkCouchConnection()
                    } else {
                        this.couchServerCheckedCount = 0;
                        this.couchDbListenerStopped = false;
                        this.showListenerStopAlert('Database connection interrupted due to some technical issue. Application needs to reload')
                    }
                }
            }, error => {
                this.couchServerCheckedCount += 1;
                console.log("couch connection up check error :", error);
                if (this.couchServerCheckedCount < this.maxCouchServerCheckCount) {
                    this.checkCouchConnection()
                } else {
                    this.couchServerCheckedCount = 0;
                    this.couchDbListenerStopped = false;
                    this.showListenerStopAlert('Database connection interrupted due to some technical issue. Application needs to reload')
                }
            })
    }
    balloonCloseAction() {
        if ($(document).find('cs-balloon-popup-style')) {
            if ($('.cs-balloon-popup-style:visible')) {
                $('.cs-balloon-popup-style').remove();
                $(".cs-popup-arrow-left").remove();
                $(".cs-popup-arrow-right").remove();
            }
        }
    }
    getDependentObjectId(data, relationalObjectInfo) {
        if (relationalObjectInfo['fieldType'] === "MASTERDETAIL") {
            if (data[relationalObjectInfo['relationalObjectId']] && data[relationalObjectInfo['relationalObjectId']].length > 0) {
                if (relationalObjectInfo['child'] === "") {
                    return data[relationalObjectInfo["relationalObjectId"]][0]['id'];
                } else {
                    return this.getDependentObjectId(data[relationalObjectInfo["relationalObjectId"]][0], relationalObjectInfo["child"]);
                }
            }
        } else if (relationalObjectInfo['fieldType'] === "HEADER" || relationalObjectInfo['fieldType'] === "LOOKUP") {
            if (data[relationalObjectInfo['relationalObjectId']]) {
                if (relationalObjectInfo['child'] === "") {
                    return data[relationalObjectInfo["relationalObjectId"]]['id'] ? data[relationalObjectInfo["relationalObjectId"]]['id'] : data[relationalObjectInfo["relationalObjectId"]];                
                }
            } else {
                return this.getDependentObjectId(data[relationalObjectInfo["relationalObjectId"]], relationalObjectInfo["child"]);
            }
        }
    }
    async showInfoAlert(info: string, buttonInfo?: Array<any>, disableClose?: boolean) {
        const dialogConfig = new MatDialogConfig()
        if (!buttonInfo) {
            buttonInfo = [
                {
                    "name": "OK"
                }
            ]
        }
        if (disableClose) {
            disableClose = disableClose;
        } else {
            disableClose = false;
        }

        dialogConfig.data = {
            title: info,
            buttonInfo: buttonInfo,
            parentContext: this,
            type: "Alert"
        };
        dialogConfig.disableClose = disableClose
        dialogConfig.autoFocus = false

        this.matDialog.open(cspfmAlertDialog, dialogConfig);
    }
    showInfoAlertForErrorHandling(title, info) {
        const dialogConfig = new MatDialogConfig()

        dialogConfig.data = {
            title: title,
            description: info,
            buttonInfo: [{
                "name": "OK"
            }],
            parentContext: this,
            type: "Alert"

        };
        dialogConfig.autoFocus = false

         this.dialog.open(cspfmAlertDialog, dialogConfig);
    }
    navigationToComponent(actionInfo, dependantObjectId, redirectUrlForNav?) {
        let action = actionInfo['actionType'].toLowerCase() === "edit" ? "Edit" : "View";
        redirectUrlForNav = redirectUrlForNav ? redirectUrlForNav : '/menu/' + actionInfo['navigationInfo']['redirectUrl'];
        let navigationParameters = {
            action: action,
            id: dependantObjectId
        };
        if (!this.checkPageAlreadyInStack('/menu/' + actionInfo['navigationInfo']['navigationUrl'])) {
            navigationParameters['redirectUrl'] = redirectUrlForNav;
        }
        this.router.navigate(['/menu/' + actionInfo['navigationInfo']['navigationUrl']], {
            queryParams: navigationParameters,
            skipLocationChange: true
        });
    }
    checkRecordInitiatedOrNot(dataObject, navigationParameters, objectConfiguration, cspfmMetaCouchDbProvider) {
        let checkRecordNotInitiated: boolean = true
        let type
        let workFlowFields
        let workFlowMapping = {}
        let fieldId
        Object.keys(dataObject).forEach(element => {
            let data = dataObject[element]
            if (data["id"] === navigationParameters['id']) {
                if (navigationParameters['action'] === "Edit" && data && data['systemAttributes'] && data["systemAttributes"]["lockedDate"] && workFlowMapping && cspfmMetaCouchDbProvider) {
                    type = data["type"]
                    fieldId = data['systemAttributes']['fieldId']
                    workFlowFields = objectConfiguration[type]["workflow"]
                    Object.keys(workFlowFields).forEach(workFlowField => { 
                        if (workFlowFields[workFlowField]["fieldId"] === fieldId) {
                            workFlowMapping[fieldId] = workFlowFields[workFlowField]["fieldLabel"]
                        }
                    })
                    this.fetchLockedUserDetail(data, workFlowMapping, cspfmMetaCouchDbProvider)
                    checkRecordNotInitiated = false
                }
            }
        })
        return checkRecordNotInitiated
    }
    fetchLockedUserDetail(dataObject, workFlowMapping, cspfmMetaCouchDbProvider) {
        var systemAttributes = dataObject["systemAttributes"];
        var userId = systemAttributes["lockedBy"];
        var utcMilliseconds = systemAttributes["lockedDate"];
        const query = "type: " + this.metaDbConfig.corUsersObject + " AND " + "user_id: " + userId
        const corUsersObjectHierarchyJSON = {
            "objectId": this.metaDbConfig.corUsersObject,
            "objectName": this.metaDbConfig.corUsersObject,
            "fieldId": 0,
            "objectType": "PRIMARY",
            "relationShipType": null,
            "childObject": [
            ]
        };
        return cspfmMetaCouchDbProvider.fetchRecordsBySearchFilterPhrases(query,
            corUsersObjectHierarchyJSON).then(corUserResult => {
                if (corUserResult.status !== "SUCCESS" || (corUserResult.status === "SUCCESS" && corUserResult["records"].length === 0)) {
                    this.showInfoAlert(userId + "  has locked for " + workFlowMapping[dataObject["systemAttributes"]["fieldId"]] + " on " +
                        this.datePipe.transform(utcMilliseconds, this.userDateTimeFormat, this.userZoneOffsetValue));
                    return;
                }
                this.showInfoAlert(corUserResult["records"][0]["first_name"] + "  has locked for " +
                    workFlowMapping[dataObject["systemAttributes"]["fieldId"]] + " on " +
                    this.datePipe.transform(utcMilliseconds, this.userDateTimeFormat, this.userZoneOffsetValue));
            }).catch(err => {
                this.showInfoAlert(userId + "  has locked for " + workFlowMapping[dataObject
                ["systemAttributes"]["fieldId"]] + " on " + this.datePipe.transform(utcMilliseconds, this.userDateTimeFormat, this.userZoneOffsetValue));
            });
    }   

    /* Need to remove this method after moving all the layout's common codes to util file. Replace this method with 
        "deleteEventSubscriptionlayoutIds" method in all the layouts */
    removeEventSubscriptionlayoutIds(tableName: string, layoutId: string, dataSource?: string) {
        delete this.eventSubscriptionObject[dataSource][tableName][layoutId]
    }

    addEventSubscriptionlayoutIds(dependentObjectList: DependentObjectListType, layoutId: string, dataSource: string) {
        if (dependentObjectList['relationalObjects']) {
            Object.keys(dependentObjectList['relationalObjects']).forEach(dependentObjectName => {
                this.setEventSubscriptionlayoutIds(dependentObjectName, layoutId, dataSource)
            })
        }
        if (dependentObjectList['lookupObjects']) {
            Object.keys(dependentObjectList['lookupObjects']).forEach(dependentObjectName => {
                this.setEventSubscriptionlayoutIds(dependentObjectName, layoutId, dataSource)
            })
        }
        if (dependentObjectList['dataRestrictionInvolvedObjects']) {
            Object.keys(dependentObjectList['dataRestrictionInvolvedObjects']).forEach(dependentObjectName => {
                this.setEventSubscriptionlayoutIds(dependentObjectName, layoutId, dataSource)
            })
        }
    }

    deleteEventSubscriptionlayoutIds(dependentObjectList: DependentObjectListType, layoutId: string, dataSource: string) {
        if (dependentObjectList['relationalObjects']) {
            Object.keys(dependentObjectList['relationalObjects']).forEach(dependentObjectName => {
                delete this.eventSubscriptionObject[dataSource][dependentObjectName][layoutId];
            })
        }
        if (dependentObjectList['lookupObjects']) {
            Object.keys(dependentObjectList['lookupObjects']).forEach(dependentObjectName => {
                delete this.eventSubscriptionObject[dataSource][dependentObjectName][layoutId];
            })
        }
    }

    presentNoInternetToast(parent: object) {
        this.zone.run(() => {
            const snackBar = this.presentToast("No internet connection. Please check your internet connection and try again.");
            snackBar.afterDismissed().subscribe(observer => {
                if (parent['refreshData']) {
                    parent['refreshData']();
                }
            });
        });
    }

    backButtonOnclick(classContext: object, layoutType?: LayoutMode, from?: string, to?: string) {
        if (classContext["isPopUpEnabled"] && layoutType !== "Entry" && layoutType !== "DrawerEntry") {
            classContext["dialogRef"].close();
        }
        if ((layoutType === "Entry" || layoutType === "DrawerEntry") && classContext["isFormValueChanged"]) {
            let buttonInfo = [
                {
                    "name": "Cancel",
                    "handler": () => {
                        classContext["customAlert"] = null;
                    }
                },
                {
                    "name": "Yes",
                    "handler": () => {
                        this.navigatePopUpAction(classContext, from, to, classContext["id"]);
                    }
                }
            ]
            this.showInfoAlert("Are you sure want to leave this page?", buttonInfo)
        } else if (layoutType === "Entry" || layoutType === "DrawerEntry") {
            this.navigatePopUpAction(classContext, from, to, classContext["id"]);
        } else {
            this.router.navigate([classContext["redirectUrl"]], { skipLocationChange: true });
        }
    }

    navigatePopUpAction(classContext: object, from: string, to: string, id: string) {
        if (classContext["isPopUpEnabled"]) {
            classContext["dialogRef"].close();
        }
        const stackArray = document.getElementsByTagName('ion-router-outlet')[1].children
        const layoutToRedirect = classContext["redirectUrl"].replace('/menu/', '');
        if (stackArray[stackArray.length - 1].tagName.toLowerCase() !== layoutToRedirect) {
            if (classContext["redirectUrl"] === "/") {
                const itemSaveNavigationParams = {
                    id: id,
                    redirectUrl: from
                };
                this.router.navigate([to], { queryParams: itemSaveNavigationParams, skipLocationChange: true });
            } else if (!this.checkPageAlreadyInStack(classContext["redirectUrl"])) {
                const itemSaveNavigationParams = {
                    id: id,
                    redirectUrl: from
                };
                this.router.navigate([classContext["redirectUrl"]], { queryParams: itemSaveNavigationParams, skipLocationChange: true });
            } else {
                this.router.navigateByUrl(classContext["redirectUrl"], { skipLocationChange: true });
            }
        }
    }

    closeDialog(isPopUpEnabled: boolean, dialogRef: MatDialogRef<any, any>) {
        if (isPopUpEnabled) {
            dialogRef.close();
        }
    }

    setRedirectUrl(isPopUpEnabled: boolean, urlObject: { redirectUrl: string, currentPageUrl: string, navPageUrl: string }): string | undefined {
        if (isPopUpEnabled) {
            return urlObject.redirectUrl;
        } else {
            return (!this.checkPageAlreadyInStack(urlObject.navPageUrl)) ? urlObject.currentPageUrl : undefined;
        }
    }

    showAlert(parent: object, message: string): MatDialogRef<cspfmAlertDialog, any> {
        const dialogConfig = new MatDialogConfig()
        dialogConfig.data = {
            title: message,
            buttonInfo: [{
                "name": "OK"
            }],
            parentContext: parent,
            type: "Alert"
        };
        dialogConfig.autoFocus = false
        return this.dialog.open(cspfmAlertDialog, dialogConfig);
    }
    getValueInfoforWebservice(relationalObjectInfo, data, element) {
        if (relationalObjectInfo['fieldType'] === "MASTERDETAIL") {
            if (data[relationalObjectInfo['relationalObjectId']] && data[relationalObjectInfo['relationalObjectId']].length > 0) {
                if (relationalObjectInfo['child'] === "") {
                    return data[relationalObjectInfo["relationalObjectId"]][0][element['fieldName']];
                } else {
                    return this.getValueInfoforWebservice(relationalObjectInfo["child"], data[relationalObjectInfo['relationalObjectId']][0], element);
                }
            } else {
                return data[element['fieldName']];
            }
        } else if (relationalObjectInfo['fieldType'] === "HEADER") {
            if (data[relationalObjectInfo['relationalObjectId']]) {
                if (relationalObjectInfo['child'] === "") {
                    return data[relationalObjectInfo["relationalObjectId"]]['id'] ? data[relationalObjectInfo["relationalObjectId"]]['id'] : data[relationalObjectInfo["relationalObjectId"]];             
                   }
            }
        }
    }
    navigationToComponentWebservice(actionInfo, data, actionInfo_View, redirectUrlForNav) {
        let action = actionInfo['actionType'] === "EDIT" ? "Edit" : "View";        
        let navigationParameters = {
            action: action,
            id: data["id"],
            viewFetchActionInfo: JSON.stringify(actionInfo_View),
            enablePopUp: actionInfo['navigationInfo']['enablePopUp']
        };
        if (!this.checkPageAlreadyInStack('/menu/' + actionInfo['navigationInfo']['navigationUrl'])) {
            navigationParameters['redirectUrl'] = redirectUrlForNav;
        }
        this.router.navigate(['/menu/' + actionInfo['navigationInfo']['navigationUrl']], {
            queryParams: navigationParameters,
            skipLocationChange: true
        });
    }
    initialHiddenColumns(columnDefintions: any, selectedObjectName: string) {
        if (typeof (columnDefintions) !== 'undefined' && 
        Object.keys(columnDefintions).length !== 0 && selectedObjectName) {
            let visibleColumnDefinitions = columnDefintions[selectedObjectName].
                filter(columnDef => (columnDef["params"] && columnDef["params"]["isHiddenEnabled"] &&
                    columnDef["params"]["isHiddenEnabled"] !== "Y"))
            columnDefintions[selectedObjectName] = [...visibleColumnDefinitions];
            return columnDefintions[selectedObjectName]
        }
    }
    isValidJson(str) {
        let value = '';
        try {
            value = JSON.parse(str);
        } catch (e) {
            return str;
        }
        return value;
    }
    displayPopover(outputResponse, cspfmDataDisplay, layoutId, objectName, urlConfig) {
        urlConfig['fieldInfo'] = urlConfig['fieldInfo'] || [];
        outputResponse['records'] = outputResponse['records'] || [];
        let urlData: any = "";
        let displayFieldName, urlFieldName, displayFieldValue, urlFieldValue, objectId, childObject;
        if (outputResponse['records'].length === 0) {
            this.presentToast('No record found');
            return;
        }
        if (outputResponse['records'].length && urlConfig['fieldInfo'].length) {
            if (urlConfig['type'] === "SINGLE_URL") {
                let data = [], urlType = '';
                let fieldConfig = {
                    "fieldName": urlConfig['fieldInfo'][0]["fieldName"],
                    "fieldType": "URL",
                    "from": "webService"
                }
                let record = this.getRecordInfo(outputResponse['records'], urlConfig['fieldInfo'][0]);
                displayFieldName = fieldConfig['fieldName'];
                if (!Array.isArray(record)) {
                    let tempRecord = record;
                    record = [];
                    record.push(tempRecord);
                }
                for (let object of record) {
                    let value = cspfmDataDisplay.transform(object, fieldConfig);
                    const displayTempArray = (value.display || '').split(',');
                    const urlTempArray = (value.url || '').split(',');
                    let index: number = 0;
                    while (index < urlTempArray.length) {
                        if (urlTempArray[index]) {
                            data.push({
                                displayValue: displayTempArray[index],
                                urlValue: urlTempArray[index]
                            });
                        }
                        index++;
                    }
                }
                if (data.length) {
                    urlType = (data.length === 1) ? 'single' : 'multiple'
                    urlData = {
                        urlType: urlType,
                        urlDBValue: data
                    }
                }
            } else if (urlConfig['type'] === "TWO_STRING") {
                displayFieldName = '';
                 urlFieldName = '';
                let displayrecord = [];
                let valueRecord = [];
                for (let object of urlConfig['fieldInfo']) {
                    if (object['urlFieldType'] === 'D') {
                        displayrecord = this.getRecordInfo(outputResponse['records'], object);
                        if (!Array.isArray(displayrecord)) {
                            let tempRecord = displayrecord;
                            displayrecord = [];
                            displayrecord.push(tempRecord);
                        }
                        displayFieldName = object["fieldName"];
                    }
                    if (object['urlFieldType'] === 'V') {
                        valueRecord = this.getRecordInfo(outputResponse['records'], object);
                        if (!Array.isArray(valueRecord)) {
                            let tempRecord = valueRecord;
                            valueRecord = [];
                            valueRecord.push(tempRecord);
                        }
                        urlFieldName = object["fieldName"];
                    }
                }
                if (displayFieldName && urlFieldName && displayrecord.length === valueRecord.length) {
                    let data = [], urlType = '';
                    for (let i = 0; i < displayrecord.length; i++) {
                        data.push({
                            displayValue: displayrecord[i][displayFieldName],
                            urlValue: valueRecord[i][urlFieldName]
                        })
                    }
                    if (data.length) {
                        urlType = data.length === 1 ? 'single' : 'multiple'
                        urlData = {
                            urlType: urlType,
                            urlDBValue: data
                        }
                    }
                }
            }
        }
        let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + layoutId);
        let fieldId, actionId;
        fieldId = 'FLD' + objectName + '$$' + displayFieldName + '_input_';
        actionId = 'ACT' + objectName + '$$' + displayFieldName + '_input_';
        if (htmlElement) {
            htmlElement.innerHTML = "";
        }
        const urlPopoverClassName = 'cspfmUrlPopover';
        import(`../components/cspfmUrlPopover/${urlPopoverClassName}.ts`).then(urlPopoverInstance => {
            if (urlPopoverInstance && urlPopoverInstance[urlPopoverClassName]) {
                this.slickgridPopoverService.appendComponentToElement_View('cs-dropdown-' + layoutId, urlPopoverInstance[urlPopoverClassName], {
                    isMultipleUrlField: false,
                    fieldName: displayFieldName,
                    inputType: "slickgrid-view",
                    selectedRecordIndex: 0,
                    label: displayFieldName,
                    fieldId: fieldId,
                    actionId: actionId,
                    enableCloseButton: true,
                    urlArray: urlData['urlDBValue'] || "",
                    layoutId: layoutId,
                    isTooltipVisible: urlConfig['isTooltipVisible']
                })
            } else {
                console.error('cspfmurlPopover component file is missing')
            }
        }).catch(error => {
            console.error('cspfmurlPopover component file is missing', error)

        })
    }
    getRecordInfo(objectArray, fieldInfo) {
        if (fieldInfo['child']) {
            let childArray = [];
            for (let obj of objectArray) {
                let tempArray = obj[fieldInfo['child']['objectId'] + 's'] || obj[fieldInfo['child']['objectId']] || [];
                if (Array.isArray(tempArray)) {
                    childArray = childArray.concat(tempArray);
                } else {
                    childArray.push(tempArray);
                }
                if (childArray) {
                    this.getRecordInfo(childArray, fieldInfo['child'])
                }
            }
            if (childArray.length === 0) {
                return objectArray
            }
            return childArray
        } else {
            return objectArray
        }
    }
    prepareFetchActionInfo(webserviceinfo, dataObject) {
        let actionInfo_View = [];
        webserviceinfo.forEach(element => {
            var record = dataObject[element["traversalPath"]] && dataObject[element["traversalPath"]][element['fieldName']] || '';
            var webservice_Info = {
                "fieldName": element['fieldName'],
                "value": record,
                "fieldId": element['fieldId']
            }
            actionInfo_View.push(webservice_Info);
        })
        return actionInfo_View;
    }
    async presentToastController(message: string, showCloseButton?: boolean, closeButtonText?: string) {
        let options: ToastOptions = {
            message: message,
            duration: 2000
        }
        if (showCloseButton) {
           options['buttons'] = [
               {
                 side: 'end',
                 text: closeButtonText ? closeButtonText : '',
                 handler: () => {
                   toast.dismiss();
                 }
               }
             ]
        }
        const toast = await this.toastCtrl.create(options);
        toast.onDidDismiss().then(() => {
            toast.dismiss();
        });
        toast.present();
    }
    //The below mehtod used in approotpage browser check case
    getPlatform() {
        return this.httpClient.get(this.platformJsonPath).toPromise()
            .then((response) => {
                const resValue = response;
                this.isMobile = false;
                if (resValue['platform'] === 'web') {
                    this.isMobile = false;
                } else {
                    this.isMobile = true;
                }
            }).catch((err) => {
                console.log(err);
                this.isMobile = false;
            });
    }
    showFileManagementPopUp(actionInfo, primaryObjects, objectIds, prominetDataMapping, fileAttachmentInfo, dataProviderObject, dataObject, cspfmDataDisplay) {
        const prominentFieldArray = []
        objectIds.forEach(objectId => {
            let tempObjectId;
            tempObjectId = objectId.includes('_') ? objectId.split('_')[0] : objectId
            let primaryObject = primaryObjects[objectId]
            var columnvalue1;
            var columnvalue2;
            if (primaryObject && primaryObject['id']) {
                if (prominetDataMapping[tempObjectId][0]) {
                    if (prominetDataMapping[tempObjectId][0]["fieldType"] === 'URL') {
                        columnvalue1 = {
                            "columnname": prominetDataMapping[tempObjectId][0]["fieldName"],
                            "columnvalue": cspfmDataDisplay.transform(dataObject, prominetDataMapping[tempObjectId][0])['display']
                        }
                    } else {
                        columnvalue1 = {
                            "columnname": prominetDataMapping[tempObjectId][0]["fieldName"],
                            "columnvalue": cspfmDataDisplay.transform(dataObject, prominetDataMapping[tempObjectId][0])
                        }
                    }
                } else {
                    columnvalue1 = ""
                }
                if (prominetDataMapping[tempObjectId][1]) {
                    if (prominetDataMapping[tempObjectId][1]["fieldType"] === 'URL') {
                        columnvalue2 = {
                            "columnname": prominetDataMapping[tempObjectId][1]["fieldName"],
                            "columnvalue": cspfmDataDisplay.transform(dataObject, prominetDataMapping[tempObjectId][1])['display']
                        }
                    } else {
                        columnvalue2 = {
                            "columnname": prominetDataMapping[tempObjectId][1]["fieldName"],
                            "columnvalue": cspfmDataDisplay.transform(dataObject, prominetDataMapping[tempObjectId][1])
                        }
                    }
                } else {
                    columnvalue2 = ""
                }   
            }        
            if (primaryObject !== undefined && Object.keys(primaryObject).length > 0 && Object.keys(prominetDataMapping).length > 0 && prominetDataMapping[tempObjectId] && primaryObject['id']) {                  
                prominentFieldArray.push({
                    "prominentFieldDetails": [
                        columnvalue1, columnvalue2
                    ],
                    "parentId": primaryObject['id'],
                    "parentType": tempObjectId,
                    "parentDisplayName": fileAttachmentInfo[tempObjectId].objectDisplayName,
                    "attachmentType": fileAttachmentInfo[tempObjectId].attachmentObjectName,
                    "documentType": fileAttachmentInfo[tempObjectId].documentObjectName,
                    "isAttachmentShow": actionInfo['fileManageInfo'][objectId]['isAttachmentShow'],
                    "isDocumentShow": actionInfo['fileManageInfo'][objectId]['isDocumentShow'],
                    "serviceObjectAttachment": appConstant.couchDBStaticName,
                    "serviceObjectDocument": appConstant.couchDBStaticName,
                    "documentInfo": actionInfo['fileManageInfo'][objectId]['documentInfo'],
                    "attachmentInfo": actionInfo['fileManageInfo'][objectId]['attachmentInfo'],
                    "isRecordAvailable": true,
                    "recordId": primaryObject[tempObjectId.replace("pfm", "pfm_") + "_id"]
                })
            } else {
                prominentFieldArray.push({
                    "parentDisplayName": fileAttachmentInfo[tempObjectId]['objectDisplayName'],
                    "isRecordAvailable": false
                })
            }
        })
        


        var recordAvailableList = prominentFieldArray.filter(item => item.isRecordAvailable === true);
        if (recordAvailableList.length === 0) {
            this.presentToast("Records not available for this object. So you can't able to access file manage")
            return
        }
        var recordNotAvailableList = prominentFieldArray.filter(item => item.isRecordAvailable === false);
        if (prominentFieldArray.length > 0) {
            const navigationParams = JSON.stringify(recordAvailableList.concat(recordNotAvailableList))
            const parameteres = {
                "params": navigationParams
            }
            const dialogConfig = new MatDialogConfig()
            dialogConfig.data = {
                serviceObject: dataProviderObject.getDbServiceProvider(appConstant.couchDBStaticName),
                parentPage: this,
                dataSource: appConstant.couchDBStaticName,
                queryParams: parameteres,
                objectName: actionInfo['objectName']
            };
            dialogConfig.panelClass = 'cs-attachment-dialog'
            return dialogConfig
        } else {
            this.presentToast("Records not available for this object. So you can't able to access file manage")
        }
    }
    addCredentialforMobile(request, provider) {
        let returnAuthValue = undefined;
        let mobile = true;
        if (request === 'AJAX' && mobile) {
            returnAuthValue = {
                headers: {
                    Authorization: 'Basic ' + provider["credentials"]
                }
            }
        } else if (request === 'AUTH' && mobile) {
            returnAuthValue = {
                "username": window.atob(provider["credentials"]).split(":")[0], 
                "password": window.atob(provider["credentials"]).split(":")[1]
            }
        } else if (request === 'HEADER' && mobile) {
            returnAuthValue = new Headers();
            returnAuthValue.append('Authorization', 'Basic ' + provider["credentials"]);
        }
        return returnAuthValue
    }
    getUtcTimeZoneMillsecondsFromDateTimeString(dateString: string, givenTimeZone: 'user' | 'system', format?) {
        let dateFormat = format ? format + ' ' + this.hoursFormat : this.userDateTimePickerFormat
        let offSetValue
        let givenTimeZoneMilliSeconds
        let utcTimeZoneMilliSeconds
        let systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let systemOffSetValue = moment.tz(systemTimeZone).utcOffset()
        let givenTimeZoneValue = givenTimeZone === 'user' ? this.userTimeZone : systemTimeZone 
        offSetValue = givenTimeZoneValue && moment.tz(givenTimeZoneValue).utcOffset()
        givenTimeZoneMilliSeconds = dateString && (moment(dateString, dateFormat).toDate()).getTime()
        utcTimeZoneMilliSeconds = givenTimeZoneMilliSeconds && givenTimeZoneMilliSeconds - (offSetValue * 60 * 1000) + (systemOffSetValue * 60 * 1000)
        return utcTimeZoneMilliSeconds
    }
    getDateTimeStringFromUtcMilliseconds(utcTimeZoneMilliseconds: number, requiredTimeZone: 'user' | 'system') {
        let offSetValue
        let requiredTimeZoneMilliSeconds
        let requiredTimeZoneDateString = 'No Date Found'
        let systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let systemOffSetValue = moment.tz(systemTimeZone).utcOffset()
        let requiredTimeZoneValue = requiredTimeZone === 'user' ? this.userTimeZone : systemTimeZone 
        offSetValue = requiredTimeZoneValue && moment.tz(requiredTimeZoneValue).utcOffset()
        requiredTimeZoneMilliSeconds = utcTimeZoneMilliseconds && utcTimeZoneMilliseconds + (offSetValue * 60 * 1000) - (systemOffSetValue * 60 * 1000)
        requiredTimeZoneDateString = requiredTimeZoneMilliSeconds && moment(requiredTimeZoneMilliSeconds).format(this.userDateTimePickerFormat)
        return requiredTimeZoneDateString
    }  
    getUtcMillisecondsFromGivenTimeZoneMilliSeconds(givenTimeZoneMilliSeconds: number, requiredTimeZone: 'user' | 'system') {
        let systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let systemOffSetValue = moment.tz(systemTimeZone).utcOffset()
        let requiredTimeZoneValue = requiredTimeZone === 'user' ? this.userTimeZone : systemTimeZone
        let offSetValue = requiredTimeZoneValue && moment.tz(requiredTimeZoneValue).utcOffset()
        const utcTimeZoneMilliseconds = givenTimeZoneMilliSeconds - (offSetValue * 60 * 1000) + (systemOffSetValue * 60 * 1000)
        return utcTimeZoneMilliseconds
    }
    getUserTimeZoneMillisecondsFromUtcTimeZoneMilliSeconds(utcTimeZoneMilliSeconds: number, requiredTimeZone: 'user' | 'system') {
        let systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let systemOffSetValue = moment.tz(systemTimeZone).utcOffset()
        let requiredTimeZoneValue = requiredTimeZone === 'user' ? this.userTimeZone : systemTimeZone
        let offSetValue = requiredTimeZoneValue && moment.tz(requiredTimeZoneValue).utcOffset()
        const userTimeZoneMilliseconds = utcTimeZoneMilliSeconds + (offSetValue * 60 * 1000) - (systemOffSetValue * 60 * 1000)
        return userTimeZoneMilliseconds
    }

    getDateStringFromUtcTimeZoneMilliseconds(utcTimeZoneMilliSeconds: number, isDateConversionNeeded?: boolean) {
        let requiredTimeZoneMilliSeconds
        let requiredTimeZoneDateString = 'No Date Found'
        let systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let systemOffSetValue = moment.tz(systemTimeZone).utcOffset()
        if (isDateConversionNeeded) {
            let offSetValue = this.userTimeZone && moment.tz(this.userTimeZone).utcOffset()
            requiredTimeZoneMilliSeconds = utcTimeZoneMilliSeconds && utcTimeZoneMilliSeconds + (offSetValue * 60 * 1000) - (systemOffSetValue * 60 * 1000)
            requiredTimeZoneDateString = requiredTimeZoneMilliSeconds && moment(requiredTimeZoneMilliSeconds).format(this.userDatePickerFormat)
            return requiredTimeZoneDateString
        } else {
            requiredTimeZoneMilliSeconds = utcTimeZoneMilliSeconds && utcTimeZoneMilliSeconds - (systemOffSetValue * 60 * 1000)
            requiredTimeZoneDateString = requiredTimeZoneMilliSeconds && moment(requiredTimeZoneMilliSeconds).format(this.userDatePickerFormat)
            return requiredTimeZoneDateString
        }
    }
    getUtcMillisecondsFromDateString(dateString: string, isDateConversionNeeded?: boolean, format?) {
        let dateFormat = format ? format : this.userDatePickerFormat
        let givenTimeZoneMilliSeconds
        let utcTimeZoneMilliSeconds
        let systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let systemOffSetValue = moment.tz(systemTimeZone).utcOffset()
        if (isDateConversionNeeded) {
            let offSetValue = this.userTimeZone && moment.tz(this.userTimeZone).utcOffset()
            givenTimeZoneMilliSeconds = dateString && (moment(dateString, dateFormat).toDate()).getTime()
            utcTimeZoneMilliSeconds = givenTimeZoneMilliSeconds && givenTimeZoneMilliSeconds - (offSetValue * 60 * 1000) + (systemOffSetValue * 60 * 1000)
            return utcTimeZoneMilliSeconds
        } else {
            givenTimeZoneMilliSeconds = dateString && (moment(dateString, dateFormat).toDate()).getTime()
            utcTimeZoneMilliSeconds = givenTimeZoneMilliSeconds && givenTimeZoneMilliSeconds + (systemOffSetValue * 60 * 1000)
            return utcTimeZoneMilliSeconds
        }
    }
    public formatDate = (date: object, format: string) => {
        if (format === this.userDatePickerFormat || format === this.userDateTimePickerFormat) {
            return moment(date).format(format);
        }
    }
    public parseDate = (date: object, format: string) => {
        return moment(date, format, true).toDate();
    }
    matrixGridReady(angularGridInstance: AngularGridInstance, classContextORChildObject: object) {
        classContextORChildObject["matrixAngularGridInstance"] = angularGridInstance;
        classContextORChildObject["matrixAngularGridInstance"]["resizerService"].resizeGrid();
    }
    
    restrictNonNumbers(event: any) {
        if (event.keyCode !== 8 &&
            event.keyCode !== 9 &&
            event.keyCode !== 46 &&
            event.keyCode !== 37 &&
            event.keyCode !== 39 &&
            !event.ctrlKey &&
            event.keyCode !== 190 &&
            event.keyCode !== 173 &&
            !(event.keyCode >= 48 && event.keyCode <= 57) &&
            (event.code !== "Numpad" + event.key)) {
            return false
        } else if (event.shiftKey) {
            return false
        }


        if (
            event.key === 'Backspace' ||
            event.key === 'Delete' ||
            event.key === "ArrowLeft" ||
            event.key === 'ArrowRight'
        ) {
            return true;
        }
        let value: any = Number(event.target.value);
        if (value) {
            if (event.target.value && event.target.value.length > 18 && !event.target.value.includes(".")) {
                this.presentToast("Maximum value should not exceed 18 digits", 5000)
            } else {
                let splittedValue = event.target.value.split(".");
                if (splittedValue[0] && splittedValue[0].length >= 18) {
                    this.presentToast("Maximum value should not exceed 18 digits", 5000)
                }
            }
            return /^((\d{1,17})|(\d{1,17})(\.{1}\d{1,15}))$/.test(value);
        }
    }
pasteCallback(event: any) {
        let numberRegex = /[^\-?(\d+\.?\d*|\d*\.?\d+)$]/; // it allows integer & decimal
        let textContent;
        if (event.type === 'paste') {
            textContent = event.clipboardData.getData('text');
        }
        if (event.clipboardData.getData('Text').match(numberRegex)) {
            event.preventDefault();
        } else if (textContent.length > 18 && !textContent.includes('.')) {
            event.preventDefault();
            this.presentToast("Maximum value should not exceed 18 digits", 5000)
        } else {
            let splittedValue = textContent.split('.');
            if (splittedValue[0].length > 18) {
                event.preventDefault();
                this.presentToast("Maximum value should not exceed 18 digits", 5000)
            }
        }

    }
    updateValidation(event: object, classContext: object) {
        if (classContext.hasOwnProperty('skipValidation')) {// For Action Validation
            classContext["skipValidation"].push(event);
        }
        const actionId = event.hasOwnProperty('actionId') ? event["actionId"] : []; // For Action Validation
        const messageType = event["messageType"]
        const messageObject = event["message"]
        if (actionId.length > 0) { // For update Action Validation
            const validationObject = classContext["onClickConsolidateMsg"][actionId]
            const validationArray = validationObject[messageType]
            validationArray.forEach(validateObject => {
                if (validateObject["formula"] === messageObject["formula"]) {
                    const index = validationArray.findIndex((x: any) => x['formula'] === validateObject["formula"])
                    validationArray.splice(index, 1)
                }
            });
        } else { // For Update Field Validation
            const validationArray = classContext["onChangeConsolidateMsg"][messageType]
            validationArray.forEach(validateObject => {
                if (validateObject["formula"] === messageObject["formula"]) {
                    const index = validationArray.findIndex((x: any) => x['formula'] === validateObject["formula"])
                    validationArray.splice(index, 1)
                }
            });
        }
    }
    updateFormulaData(classContext: object) {
        classContext["formulaObject"] = lodash.extend({}, classContext["formulaObject"], classContext["dataObject"]);
    }
    updateGeoLocationFlag(objectName: string, dataObj: object, existingDataObj: object, geoLocationdependentField: object, action: "Edit" | "Add") {
        Object.keys(geoLocationdependentField[objectName]).forEach(element => {
            const depFlds = geoLocationdependentField[objectName][element]['dependentFields'];
            depFlds.forEach(fieldName => {
                if (action === 'Edit') {
                    if (existingDataObj[fieldName] !== dataObj[fieldName]) {
                        dataObj[geoLocationdependentField[objectName][element]['dependentFieldName']] = 'Y';
                        return;
                    }
                } else {
                    if (dataObj[fieldName] !== '') {
                        dataObj[geoLocationdependentField[objectName][element]['dependentFieldName']] = 'Y';
                        return;
                    }
                }
            })
        });
    }
    selectedRows(args: object, classContextORchildObject: object) {
        classContextORchildObject["selectedRows"] = [];
        if (args.hasOwnProperty("rows") && Array.isArray(args["rows"])) {
            classContextORchildObject["selectedRows"] = args["rows"].map(res => {
                const item = classContextORchildObject["gridObj"].getDataItem(res);
                return item;
            });
        }
    }
    makeAsHeaderAction(classContext: object, objectTraversalPath: string, navigateFrom: string, navigateTo: string) {
        if (classContext["isSkeletonLoading"]) {
            this.presentToast("Another process is running, please wait");
            return
        }
        if (classContext["isPopUpEnabled"]) {
            classContext["dialogRef"].close();
        }
        const navigationParameters = {
            id: classContext["dataObject"][objectTraversalPath]['id'],
        };
        if (!this.checkPageAlreadyInStack(navigateTo)) {
            if (classContext["isPopUpEnabled"]) {
                navigationParameters['redirectUrl'] = classContext["redirectUrl"];
            } else {
                navigationParameters['redirectUrl'] = navigateFrom;
            }
        }
        this.router.navigate([navigateTo], { queryParams: navigationParameters, skipLocationChange: true });
    }
    getDateWithoutTime(dateTimestamp: string | number | Date) {
        let dateObject = new Date(dateTimestamp);
        dateObject.setHours(0, 0, 0, 0);
        return dateObject;
    }
    appendHttpToURL() {
        document.querySelectorAll('a').forEach((anchor) => {
            if (anchor.getAttribute('href') && !anchor.getAttribute('href').startsWith('http')) {
                anchor.href = `http://${anchor.getAttribute('href')}`;
            }
        });
    }
    expandAndCollapseParentObjectData(classContext: object) {
        if (classContext["expandParentObjectData"] === 'C' || classContext["expandParentObjectData"] === 'FO') {
            classContext["previousGridState"] = classContext["expandParentObjectData"];
            classContext["expandParentObjectData"] = "HO";
        } else {
            if (classContext["previousGridState"]) {
                classContext["expandParentObjectData"] = classContext["previousGridState"] === 'C' ? 'FO' : (classContext["previousGridState"] === 'HO' ? 'FO' : 'C');
            } else {
                classContext["expandParentObjectData"] = 'FO';
            }
        }
    }
    take_position(e: any, isLoading: boolean) {
        if (isLoading) {
            this.presentToast("Another process is running, please wait");
            return
        }
        var offsetLeft = e.srcElement.parentElement.offsetLeft;
        var offsetTop = e.srcElement.parentElement.offsetTop;
        setTimeout(() => {
            document.getElementsByClassName('popover-content')[0].setAttribute("style", `top: ${offsetTop + 40}px; left: ${offsetLeft}px`);
        }, 100)
        document.getElementsByClassName("cdk-overlay-pane")[0].getElementsByClassName("mat-select-panel-wrap")[0].getElementsByClassName("mat-select-panel")[0].classList.add("cs-custom-scroll");
        document.getElementsByClassName('cdk-overlay-container')[0].classList.add('cs-userassign-overlay');
        e.stopPropagation();
    }
    navigationDiscardConfirmAlert(navigationPage: any, navigatonParams: object, popUpAction: boolean, classContext: object) {
        this.showInfoAlert('Are you sure want to leave this page?', [
            {
                "name": "Cancel",
                "handler": () => { classContext["customAlert"] = null; }
            },
            {
                "name": "Yes",
                "handler": () => { classContext["listActionAfterConfirmation"](navigationPage, navigatonParams, popUpAction) }
            }
        ]);
    }   

    initializeClonedFieldsForEntry(clonedDataFieldDetails, objectMapping) {
        let clonedFields = {}
        clonedDataFieldDetails.forEach(element => {
            let objectId = objectMapping[element['destinationObjectName']]
            if (clonedFields[objectId]) {
                clonedFields[objectId][element['destinationFieldName']] = element['destinationFieldValue']
            } else {
                clonedFields[objectId] = {}
                clonedFields[objectId][element['destinationFieldName']] = element['destinationFieldValue']
            }
        })
        return clonedFields
    }
    showDataCloningMappingDetails(dataCloningInfo, fieldName, objectName, isLookup?) {
        const dialogConfig = new MatDialogConfig()
        dialogConfig.data = {
            fieldName: fieldName,
            objectName: objectName,
            dataCloningInfo: dataCloningInfo,
            isLookup: isLookup ? true : false
        };
        dialogConfig.panelClass = 'custom-dialog-container'
        const cloneActionClassName = 'cspfmCloneMappingInfo';
         import(`../pages/cspfmCloneMappingInfo/${cloneActionClassName}.ts`).then(cloneActionInstance => {
            if (cloneActionInstance[cloneActionClassName]) {
                this.dialog.open(cloneActionInstance[cloneActionClassName], dialogConfig);
            } else {
                console.error('cspfmCloneMappingInfo component file is missing')
            }
        }).catch(error => {
            console.error('cspfmCloneMappingInfo component file is missing', error)
        })

    }
    decidePopUpOrNavigationForDataClone(actionInfo, parentObj?) {
        actionInfo['dataCloningInfo'] = this.clonedFieldsDataConvertor(actionInfo['dataCloningInfo'])
        const navigationParameters = {
            dataCloningInfo: JSON.stringify(actionInfo['dataCloningInfo'])
        }
        if (parentObj) {
            navigationParameters['parentId'] = parentObj['id']
            navigationParameters['parentObj'] = JSON.stringify(parentObj)
        }
        if (!actionInfo['navigationInfo']['enablePopUp'] && !this.checkPageAlreadyInStack('/menu/' + actionInfo['navigationInfo']['navigationUrl'])) {
            navigationParameters['redirectUrl'] = '/menu/' + actionInfo['navigationInfo']['redirectUrl']
        } else if (actionInfo['navigationInfo']['enablePopUp']) {
            navigationParameters["redirectUrl"] = '/menu/' + actionInfo['navigationInfo']['redirectUrl']
        }
        if (actionInfo['navigationInfo']['enablePopUp']) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                params: navigationParameters
            };
            dialogConfig.panelClass = 'cs-dialoguecontainer-large'
            return dialogConfig
        } else {
            this.navigationByRouter('/menu/' + actionInfo['navigationInfo']['navigationUrl'], navigationParameters)
        }
    }
    getUpdatedClonedFieldValues(dataObject, dataCloningInfo) {
        dataCloningInfo.forEach(element => {
            let inputType = element['inputType']
            let sourceFieldPath = element['sourceFieldInfo']['sourceFieldPath']
            let sourceFieldName = element['sourceFieldInfo']['sourceFieldName']
            if (inputType === "FIELD") {
                element['destinationFieldInfo']['destinationFieldValue'] = dataObject[sourceFieldPath][sourceFieldName]
            }
        })
        return this.clonedFieldsDataConvertor(dataCloningInfo)
    }
    clonedFieldsDataConvertor(dataCloningInfo) {
        dataCloningInfo.forEach(element => {
            let fieldType = element['fieldType']
            if (fieldType === "TIMESTAMP") {
                element['destinationFieldInfo']['destinationFieldValue'] = this.getDateTimeStringFromUtcMilliseconds(element['destinationFieldInfo']['destinationFieldValue'], 'user')
            } else if (fieldType === "DATE") {
                element['destinationFieldInfo']['destinationFieldValue'] = this.getDateStringFromUtcTimeZoneMilliseconds(element['destinationFieldInfo']['destinationFieldValue'], false)
            } else if (fieldType === "RICHTEXT") {
                element['destinationFieldInfo']['destinationFieldValue'] = lodash.unescape(element['destinationFieldInfo']['destinationFieldValue'])
            }
        })
        return dataCloningInfo
    }
    updateChildListForMultiLineEntry(selectedFieldJSON: object, userSelectedValues: string | Array<string>, flag: boolean, objectName: string, objectTraversalPath: string, classContext: object, userInteractedField?: string, dataObject?,slickgrid?:SlickGrid) {
        classContext["dependentNumberCount"] = {};
        if (userInteractedField == undefined) {
            userInteractedField = '';
        }

        if (typeof userSelectedValues == 'string') {
            userSelectedValues = [userSelectedValues];
        }
        var myObjStr = JSON.stringify(selectedFieldJSON);
        var tempJson = JSON.parse(myObjStr);

        if (selectedFieldJSON) {
            classContext["clearExistingDataInPickList"](selectedFieldJSON, flag, objectName, dataObject,slickgrid);
        }

        if (userSelectedValues.length < 0 || !selectedFieldJSON) {
            return;
        }

        let targetName = "";
        userSelectedValues.forEach(userSelectedValue => {
            let pickListJSONList: any = [];
            Array.prototype.push.apply(pickListJSONList, tempJson['pickListJson']);
            pickListJSONList.forEach(elementCondition => {
                let conditionList: any = [];
                Array.prototype.push.apply(conditionList, elementCondition['condition']);
                conditionList.forEach(element => {
                    if (elementCondition['targettype'] == 'CHECKBOX') {
                        if (userSelectedValue == element.value) {
                            targetName = elementCondition['targetName'];
                            let checkBoxList = element['pickList'];
                            let checkBoxListWithDefaultValue: any = [];
                            checkBoxList.forEach(elementCheckbox => {
                                let object = {};
                                object['val'] = elementCheckbox.value;
                                object['displayName'] = elementCheckbox.label;
                                object['isChecked'] = false;
                                checkBoxListWithDefaultValue.push(object);
                            });
                            if (slickgrid["pickListValues"][objectName][targetName]) {
                                let targetNameList = slickgrid["pickListValues"][objectName][targetName];
                                Array.prototype.push.apply(targetNameList, checkBoxListWithDefaultValue);
                                slickgrid["pickListValues"][objectName][targetName] = lodash.uniqBy(targetNameList, 'val'); //duplicate records removed

                            } else {
                                slickgrid["pickListValues"][objectName][targetName] = [];
                                slickgrid["pickListValues"][objectName][targetName] = checkBoxListWithDefaultValue;

                            }
                            // For Edit action
                            if (flag) {
                                this.loadCheckboxEditValues(targetName, slickgrid["pickListValues"][objectName][targetName], slickgrid["dataObject"], objectTraversalPath);
                            }

                        }
                    }
                    else {
                        if (userSelectedValue == element.value) {
                            targetName = elementCondition['targetName'];
                            if (slickgrid["pickListValues"][objectName][targetName]) {
                                let targetNameList = slickgrid["pickListValues"][objectName][targetName];
                                Array.prototype.push.apply(targetNameList, element['pickList']);
                                slickgrid["pickListValues"][objectName][targetName] = lodash.uniqBy(targetNameList, 'label'); //duplicate records removed
                            }
                            else {
                                slickgrid["pickListValues"][objectName][targetName] = [];
                                slickgrid["pickListValues"][objectName][targetName] = lodash.uniqBy(element['pickList'], 'label');
                            }
                        }
                    }

                });
            });

        });

        console.log("slickgrid[pickListValues] ==> ", slickgrid["pickListValues"]);
        
    
    }
    navigationByRouter(navigationUrl, queryParamsRouting) {
        this.router.navigate([navigationUrl], {
            queryParams: queryParamsRouting,
            skipLocationChange: true
        });
    }
    loadCheckboxEditValues(fieldName: string, values: Array<any>, dataObject: object, path: string) {
        if (dataObject[path][fieldName] !== undefined && dataObject[path][fieldName] !== null && values.length > 0) {
            for (let item of values) {
                for (let itemVal of dataObject[path][fieldName]) {
                    if (item.val === itemVal) {
                        item.isChecked = true
                    }
                }
            }
        }
    }
    focusAgainstConditionalValidationFields(validationFields, conditionalValidationJson?) {
        return new Promise(async (resolve, reject) => {
            setTimeout(() => {
                validationFields['involvedFields'].forEach(validateField => {
                    let validationFieldFieldname
                    let objectId 
                    if (validateField['objectType'] === 'LOOKUP') {
                        validationFieldFieldname = 'pfm' + validateField['objectId'] + '_' + validateField['referenceFieldId'] + "_searchKey";
                        objectId = 'pfm' + conditionalValidationJson['objectHierarchy']['objectId'];

                    } else {
                        validationFieldFieldname = validateField["fieldType"] === "LOOKUP" ? validateField["fieldName"] + "_searchKey" : validateField["fieldName"];
                        objectId = "pfm" + validateField['objectId']
                    } 
                    let validationFieldId = objectId + '_' + validationFieldFieldname;
                    let focusField = validateField["fieldType"] === "RADIO" ? document.getElementById(validationFieldId).querySelector("mat-radio-button") 
                    : validateField["fieldType"] === "CHECKBOX" ? document.getElementById(validationFieldId).querySelector("mat-checkbox") 
                    : validateField["fieldType"] === "DROPDOWN" ? document.getElementById(validationFieldId).querySelector("mat-select") 
                    : document.getElementById(validationFieldId).querySelector("[formControlName='" + validationFieldFieldname + "']");
                    const focusFieldId = focusField.id;
                    const textfocus = document.getElementById(focusFieldId);
                    const fieldNameScroll = document.getElementById(validationFieldId)
                    if (validateField["fieldType"] === "RADIO" 
                        || validateField["fieldType"] === "CHECKBOX" 
                        || validateField["fieldType"] === "DROPDOWN" 
                        || validateField["fieldType"] === "BOOLEAN") {
                        if (textfocus != null) {
                            textfocus.focus();
                            textfocus.classList.add("cdk-keyboard-focused");
                            fieldNameScroll.scrollIntoView();
                        }
                    } else {
                        if (textfocus != null) {
                            textfocus.focus();
                        }
                    }
                   return Promise.resolve()
                })
            }, 500);
        })   
    }

    async dynamicImport(params: DynamicImportFormat) {
        let viewRef;
        switch (params['baseType']) {
            case 'basefile':
                if (params['fileType'] === 'db') {
                    viewRef = await import(`src/core/db/${params['fileName']}.ts`);
                } else if (params['fileType'] === 'dynapageutils') {
                    if (params['fileName'] !== 'cspfmAssignmentSelection') {
                        viewRef = await import(`src/core/dynapageutils/${params['fileName']}.ts`);
                    }
                } else if (params['fileType'] === 'pfmmapping') {
                    viewRef = await import(`src/core/pfmmapping/${params['fileName']}.ts`);
                } else if (params['fileType'] === 'pipes') {
                    viewRef = await import(`src/core/pipes/${params['fileName']}.ts`);
                } else if (params['fileType'] === 'services') {
                    viewRef = await import(`src/core/services/${params['fileName']}.service.ts`);
                } else if (params['fileType'] === 'utils') {
                    viewRef = await import(`src/core/utils/${params['fileName']}.ts`);
                }
                break;
            case 'basepage':
                if (params['fileType'] === 'components') {
                    viewRef = await import(`src/core/components/${params['fileName']}/${params['fileName']}.ts`).then(instance => instance[params['fileName']]);
                } else if (params['fileType'] === 'pages') {
                    viewRef = await import(`src/core/pages/${params['fileName']}/${params['fileName']}.ts`).then(instance => instance[params['fileName']]);
                }
                break;
            case 'layout':
                viewRef = await import(`src/pages/${params['fileName']}/${params['fileName']}.ts`).then(instance => instance[params['fileName']]);
                break;
            default:
                break;
        }
        if (viewRef && params['baseType'] === 'basefile') {
            const className = (params['fileType'] === 'pipes' && params['fileName'] === 'highlight_search') ? 'HighlightSearch' : params['fileName'];
            return this.injector.get(viewRef[className]);
        } else if (viewRef && ['basepage', 'layout'].includes(params['baseType'])) {
            return viewRef;
        } else {
            return undefined;
        }
    }
       
    // This method for verfiy the logged user in user assignment change listener
    verifyUser(modified) {
        switch (modified['id_type']) {
            case 'User':
                if (this.userId === modified['user_id']) {
                    return true;
                }
                return false;
            case 'Role':
                if (this.roleId === modified['role_id']) {
                    return true;
                }
                return false;
            case 'Group':
                if (lodash.includes(this.userGroups, modified['user_group_id'])) {
                    return true;
                }
                return false;
            case 'Responsibilities':
                if (lodash.includes(this.userResponsibilities, modified['responsibility_id'])) {
                    return true;
                }
                return false;
        }
    }
}
