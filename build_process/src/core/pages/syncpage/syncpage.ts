import { Component, OnInit } from '@angular/core';
import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { ToastController, AlertController, NavController, LoadingController, Platform } from '@ionic/angular';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { appUtility } from 'src/core/utils/appUtility';
import { dbProvider } from 'src/core/db/dbProvider';
import { dbConfiguration } from 'src/core/db/dbConfiguration';
import { metaDbValidation } from 'src/core/utils/metaDbValidation';
import { metaDataDbProvider } from 'src/core/db/metaDataDbProvider';
import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
import { appConfiguration } from 'src/core/utils/appConfiguration';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { Router } from '@angular/router';
import { attachmentDbConfiguration } from 'src/core/db/attachmentDbConfiguration';
import { attachmentDbProvider } from 'src/core/db/attachmentDbProvider';
import { offlineDbIndexCreation } from 'src/core/utils/offlineDbIndexCreation';
import { couchdbProvider } from 'src/core/db/couchdbProvider';
import { attachmentCouchDbProvider } from 'src/core/db/attachmentCouchDbProvider';
import { cspfmExecutionPouchDbProvider } from 'src/core/db/cspfmExecutionPouchDbProvider';
import { cspfmExecutionPouchDbConfiguration } from 'src/core/db/cspfmExecutionPouchDbConfiguration';
import { cspfmAuditDbProvider } from 'src/core/db/cspfmAuditDbProvider';
import { appConstant } from 'src/core/utils/appConstant';
import { Title } from "@angular/platform-browser";
import { formulaDbProvider } from 'src/core/db/formulaDbProvider';
import { formulaDbConfiguration } from 'src/core/db/formulaDbConfiguration'
import { onlineDbIndexCreation } from
    'src/core/utils/onlineDbIndexCreation';
import { formulaCouchDbProvider } from 'src/core/db/formulaCouchDbProvider';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
import { networkHandler } from 'src/core/utils/networkHandler';

@Component({
    selector: 'app-syncpage',
    templateUrl: './syncpage.html',
    styleUrls: ['./syncpage.scss'],
})

export class syncpage implements OnInit {

    appFilterArray;
    isSyncFailed = false;
    syncCompletedStatus = false;
    syncFailureMessage = 'Sync failed';
    metaDbfilterParams = {};
    metaValidationResponse = '';
    syncStatusArray: Array<any> = [];
    isAuditDBAvailable = false;
    applicationDetail;
    private aplicationAssignmentObjectHierarchyJSON = {
        "objectId": this.metaDbConfigurationObj.applicationAssignmentObject,
        "objectName": this.metaDbConfigurationObj.applicationAssignmentObject,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [

        ]
    };
    public isGetStartedCalled = false;
    public isSyncPageHide = false;

    constructor(private broadcaster: Broadcaster,public metaCouchDbProvider: cspfmMetaCouchDbProvider,
        public onlineIndxCreation: onlineDbIndexCreation,
        public emailComposer: EmailComposer, public indexObj: offlineDbIndexCreation,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        private apputilityObject: appUtility, public dbprovider: dbProvider,
        public navCtrl: NavController, public loadingCtrl: LoadingController,
        public dbConfigurationObj: dbConfiguration,
        public metaDbValidation: metaDbValidation, public attachmentConfig: attachmentDbConfiguration,
        public metaDbProvider: metaDataDbProvider, public attachdbprovider: attachmentDbProvider,
        public metaDbConfigurationObj: metaDbConfiguration,
        private appConfig: appConfiguration,
        private appPreferences: AppPreferences,
        public platform: Platform, public router: Router, public observableListenerUtils: cspfmObservableListenerUtils,
        public couchdbprovider: couchdbProvider,
        public attachementCouchDBProvider: attachmentCouchDbProvider,
        public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider,
        public cspfmExecutionDBConfigurationObject: cspfmExecutionPouchDbConfiguration,
        public auditDBProvider: cspfmAuditDbProvider,
        public title: Title,
        public formulaDbProvider: formulaDbProvider,public formulacouchDbProviderObj: formulaCouchDbProvider,
        public formulaDbConfiguration: formulaDbConfiguration, public networkHandler: networkHandler) {

        if (this.apputilityObject.isMobile) {
            this.appPreferences.fetch('login_response').then((res) => {
                const assignedAppsDetail = JSON.parse(res);
                const currentAppId = this.appConfig.configuration.appId;
                this.applicationDetail = assignedAppsDetail.filter(app => app.appId === currentAppId);
            });
        } else {
            if (this.apputilityObject.assignedApps) {
                const assignedAppsDetail = this.apputilityObject.assignedApps;
                const currentAppId = this.appConfig.configuration.appId;
                this.applicationDetail = assignedAppsDetail.filter(app => app.appId === currentAppId);
                this.title.setTitle(this.applicationDetail[0]['appDisplayName']);
            }
        }
        this.networkHandler.networkHandlerForSync();
    }
    ionViewDidEnter() {
        setTimeout(() => {
            document.querySelector('.cs-l-main').classList.remove('cs-l-start');
            document.querySelector('.cs-l-main').classList.add('cs-l-load');
        }, 1000);
        this.isAuditDBAvailable = false;
        // meta data sync with mobile platform sync
        this.startMetaDataSync()
        // Each app SyncCompted Status - First Set as False.In navigationMenuPage(), set status as True.
        const syncCompletedStatus = this.appConfig.configuration.appId + "synCompletedStatus";
        if (this.apputilityObject.isMobile) {
            this.appPreferences.store("", syncCompletedStatus, false);
        } else {
            localStorage.setItem(syncCompletedStatus, "false");
        }
        this.syncCompletedStatus = false;
        // While Network Change, this subscribe is called
        this.observableListenerUtils.subscribe('startFullSync', (oneTimeSync) => {
            const networkAvailable = oneTimeSync["network"]
            if (networkAvailable) {
                this.startSync()
            } else {
                this.stopSync()
            }
        });
    }
    // Stop Sync - Show Internet Alert		
    stopSync() {
        this.isSyncFailed = true;
        this.syncFailureMessage =
            "No internet connection. You should have network connectivity for initial sync";
        this.showInfoAlert("No internet connection. You should have network connectivity for initial sync");
    }
    // Start Sync - Restart Sync Process		
    startSync() {
        this.alertCtrl.dismiss();
        this.isSyncFailed = false;
        this.syncFailureMessage = "";
        this.statusWFConfigIdArray = []
        this.reStartSync();
    }

    async startSyncOperation(querySelector?, objectPresentInCurrentObjectSet?) {
        // Live replication using couch server
        const stage2 = this.syncStatusArray[1]
        stage2.status = "running"

        var finalSelector;
        if (querySelector && querySelector.length > 0) {
            finalSelector = querySelector
        } else {
            finalSelector = this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors;
        }
        this.dbprovider.oneTimeReplicationFromServer(finalSelector).then(res => {
            
            if (res === "Success") {
                if (objectPresentInCurrentObjectSet !== undefined && objectPresentInCurrentObjectSet.length > 0) {
                    this.dbprovider.oneTimeReplicationFromServerWithSpecificObject(objectPresentInCurrentObjectSet).then(result => {
                        this.pfmObjectSyncStarted(stage2);
                    }).catch(err => {
                        this.pfmObjectSyncStarted(stage2);
                    });
                } else {
                    this.pfmObjectSyncStarted(stage2);
                }
            } else {
                this.syncFailureMessage = "Sync Failed";
                this.isSyncFailed = true;
            }
        }).catch(error => {
            this.syncFailureMessage = error.message;
            this.isSyncFailed = true;
        });
    }

    pfmObjectSyncStarted(stage2) {
        var liveSelector = { '$or': this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors };
        this.dbprovider.setCurrentObjectSetInLocalStorage();
        this.appFilterArray = this.dbConfigurationObj.configuration.dataFilters;
        for (let i = 0; i < this.appFilterArray.length; i++) {
            const filterDetails = this.appFilterArray[i];
            if (filterDetails.filterType === 'liveSync') {
                this.dbprovider.liveSyncWithSelector(liveSelector);
            } else if (filterDetails.filterType === 'replicateFromServer') {
                this.dbprovider.liveReplicateFromServerWithSelector(liveSelector);
            } else if (filterDetails.filterType === 'replicateToServer') {
                this.dbprovider.liveReplicateToServerWithSelector(liveSelector);
            }
        }

        this.isSyncFailed = false;
      
        stage2.synctime = this.syncRunningCount
        stage2.status = "completed"
        this.startSyncCount()
        if (this.attachmentConfig.configuration.pouchDBSyncEnabledObjectSelectors.length > 0) {
            this.syncattachmentDB()
        } else {
            const stage3 = this.syncStatusArray[2]
            stage3.synctime = "0s"
            stage3.status = "completed"
            this.syncExecutionDB();
        }
    }

    // Live sync with couch server
    liveDataSyncWithCouch() {
        const finalSelector = { '$or': this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors };
        return this.dbprovider.oneTimeReplicationFromServerWithSelector(finalSelector).then(res => {
            
            if (res['ok']) {
                this.dbprovider.liveSyncWithSelector(finalSelector);
                return Promise.resolve('Success');
            } else {
                return Promise.resolve('Failed');
            }
        }).catch(error => {
            return Promise.resolve(error.message);
        });
    }

    // Live replication to couch server
    liveDataReplicationToServer(dataFilter, params) {
        
        return this.dbprovider.oneTimeReplicationToServerWithFilter(dataFilter, params).then(res => {
            
            if (res.status === 'complete') {
                this.dbprovider.liveReplicationToServerWithFilter(dataFilter, params);
                return Promise.resolve('Success');
            } else {
                return Promise.resolve('Failed');
            }
        }).catch(error => {
            return Promise.resolve(error.message);
        });
    }

    // Live replication from couch server
    liveDataReplicationFromServer(dataFilter, params) {
        
        return this.dbprovider.oneTimeReplicationFromServerWithFilter(dataFilter, params).then(res => {
            
            if (res.status === 'complete') {
                this.dbprovider.liveReplicationFromServerWithFilter(dataFilter, params);
                return Promise.resolve('Success');
            } else {
                return Promise.resolve('Failed');
            }
        }).catch(error => {
            return Promise.resolve(error.message);
        });
    }

    // Navigate to menu page
    navigationMenuPage() {
        this.initiateMetaDataDbLiveSync()
        if (navigator.onLine) {
            this.getLoggedUserDetail()
            /**********Handle Stage 7 Index Creation *******/

          
            const finalStage = this.syncStatusArray[this.syncStatusArray.length - 1]
            if (this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.length > 0) {
                finalStage.status = "running"

                this.indexObj.indexCreationProcessingMsg = finalStage.stagename + 'process is running...'
                this.indexObj.createIndex()
            } else {
                if (this.onlineIndxCreation.
                    isAllSearchIndexCompleted || this.dbConfigurationObj.configuration.
                        couchDBSyncEnabledObjectSelectors.length === 0) {
                    finalStage.synctime = "0s"
                    finalStage.status = "completed"
                }

            }

            if (this.dbConfigurationObj.configuration.
                couchDBSyncEnabledObjectSelectors.length > 0) {
                finalStage.status = "running"
                //this.onlineIndxCreation.callBuilderForIndexingApi();
				this.onlineIndxCreation.isAllSearchIndexCompleted = true;
				this.onlineIndxCreation.isGlobalSearchIndexCompleted = true;//This method commented for guide running purpose
            } else {
                if (this.indexObj.isIndexCreated || this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.length === 0) {
                    finalStage.synctime = "0s"
                    finalStage.status = "completed"
                }

            }

            const syncCompletedStatus = this.appConfig.configuration.appId + "synCompletedStatus";

            if (this.apputilityObject.isMobile) {
                this.appPreferences.store("", syncCompletedStatus, true);
            } else {
                localStorage.setItem(syncCompletedStatus, "true");
            }
            this.observableListenerUtils.remove("startFullSync","==")
            this.syncCompletedStatus = true;

            document.querySelector('.cs-l-main').classList.remove('cs-l-load');
            document.querySelector('.cs-l-main').classList.add('cs-l-end');
        } else {
            this.getStartedAction()
        }
        this.isGetStartedCalled = false;
    }
    getStartedAction() {

        this.isGetStartedCalled = true
        //Here final stage means index running for pouch and couch db
        const finalStage = this.syncStatusArray[this.syncStatusArray.length - 1]
        if (this.syncRunningCount && !this.syncRunningCount.toString().includes("s")) {
            this.syncRunningCount = this.syncRunningCount + "s"
        }
        if ((this.onlineIndxCreation.isAllSearchIndexCompleted && this.indexObj.isIndexCreated) ||
            (this.onlineIndxCreation.isAllSearchIndexCompleted &&
                this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.length === 0)||(this.dbConfigurationObj.configuration.couchDBSyncEnabledObjectSelectors.length === 0 &&
                    this.indexObj.isIndexCreated)) {
            finalStage.synctime = this.syncRunningCount
            finalStage.status = "completed"
        }else if (this.dbConfigurationObj.configuration.couchDBSyncEnabledObjectSelectors.length === 0 &&
            this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.length === 0 && this.syncCompletedStatus) {
            finalStage.synctime = "0s"
            finalStage.status = "completed"
        }
  
        this.apputilityObject.isAppSyncCompleted = true;
        this.metaDbProvider.startChangeListener();
        if (this.statusWFConfigIdArray.length > 0){
            this.cspfmexecutionPouchDbProvider.startChangeListener();
        }
        if (this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.length > 0) {
            this.dbprovider.startChangeListener();
        }
        if (this.attachmentConfig.configuration.pouchDBSyncEnabledObjectSelectors.length > 0) {
            this.attachdbprovider.startChangeListener()
        }

        if (this.metaValidationResponse) {
            this.handlewarningMsg(this.metaValidationResponse);
        }
        this.couchdbprovider.networkWithConnectivity();
        this.metaCouchDbProvider.networkWithConnectivity();        
        this.formulacouchDbProviderObj.networkWithConnectivity();
        this.router.navigate(['menu'], { skipLocationChange: true });
        if (this.intervalId) {
            clearInterval(this.intervalId)
           

        }
    }

    // Exit from app
    gotoApplist() {
        if (this.apputilityObject.isMobile) {
            this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'Exit' })
                .then(() => console.log('Success'))
                .catch(() => console.log('Error'));
        } else {
            window.location.replace('/apps/applist');
        }
    }

    /********SYNC AUDIT/FIELD TRACKING DB ********/
    startSyncAuditDB() {
        const stage6 = this.syncStatusArray[5]

        stage6.status = "running"
        

        this.auditDBProvider.startSyncOperation().then(response => {
            if (response["records"].includes("FAILED") || response["status"] === "FAILED") {
                console.log("Audit DB sync failed response = ", response);
            } else {
                console.log("Audit DB sync success");
            }


            this.isAuditDBAvailable = false
            stage6.synctime = this.syncRunningCount
            stage6.status = "completed"
            this.startSyncCount()
            this.navigationMenuPage()
        });
    }

    makeSyncStatusObject() {
        this.syncStatusArray = [
            {
                "stagename": "1",
                "status": "running",
                "synctime": ""
            },
            {
                "stagename": "2",
                "status": "waiting",
                "synctime": ""
            },
            {
                "stagename": "3",
                "status": "waiting",
                "synctime": ""
            },
            {
                "stagename": "4",
                "status": "waiting",
                "synctime": ""
            },
            {
                "stagename": "5",
                "status": "waiting",
                "synctime": ""
            },
            {
                "stagename": "6",
                "status": "waiting",
                "synctime": ""
            },
            {
                "stagename": "7",
                "status": "waiting",
                "synctime": ""
            }
        ]
        //Validate Audit DB is availble.If available add Stage 6 in sync flow.
        this.auditDBProvider.getAuditIsAvailable().then(res => {
            
            if (res) {
                this.isAuditDBAvailable = true;
                const stage6 = {
                    "stagename": "6",
                    "status": "waiting",
                    "synctime": ""
                }
                this.syncStatusArray.push(stage6);
            }
        })
    }

    /****************************************************
     Meta db initialization and assignedApp fetch
  *****************************************************/
    async startMetaDataSync() {
        if (!navigator.onLine) {
            if (this.platform.is('mobile')) {
                this.appPreferences.fetch('', 'isMetaDBSyncSuccess').then((res) => {
                    const isMetaDbSyncSuccess = res;
                    if (isMetaDbSyncSuccess) {
                        // Initialize POuchDB for Meta, Data, Attachment
                        this.metaDbProvider.initializePouchDb()
                        this.dbprovider.initializePouchDb()
                        this.attachdbprovider.initializePouchDb()
                        this.cspfmexecutionPouchDbProvider.initializePouchDb()
                        this.navigationMenuPage();
                        return;
                    } else {
                        this.showInfoAlert('No internet connection. You should have network connectivity for initial sync')
                        return;
                    }
                })
            }
        } else {
            this.makeSyncStatusObject()
            this.metaDbProvider.initializePouchDb();
            if (this.apputilityObject.isMobile) {

                this.appPreferences.fetch('login_response').then((res) => {
                    const assignedAppsDetail = JSON.parse(res);

                    this.oneTimeMetaDataSync(assignedAppsDetail);
                });
            } else {
                if (this.apputilityObject.assignedApps) {
                    const assignedAppsDetail = this.apputilityObject.assignedApps;
                    this.oneTimeMetaDataSync(assignedAppsDetail);
                }
            }
        }
    }

    /****************************************************
             One time meta data filter base sync
    *****************************************************/

    private oneTimeMetaDataSync(assignedAppsDetail) {
    if (this.apputilityObject.isMobile) {
        this.fetchAssignmentObjectForMetaValidation().then(assigenmenfetcResult => {
            this.startSyncCount()
            if (!assigenmenfetcResult) {
                this.syncFailureMessage = 'meta data initial sync failure';
                this.isSyncFailed = true;
                return
            }

            this.viewDocsInsertFoeMetaValidation(assigenmenfetcResult).then(result => {
                if (!result) {
                    this.syncFailureMessage = 'meta data initial sync failure';
                    this.isSyncFailed = true;
                    return;
                }

                var appIdListToFetch = assignedAppsDetail.map(obj => obj.appId);
                var finalSelector = this.metaDbProvider.makeSelectorForMetaDataSyncArray(appIdListToFetch, true);
                this.metaDataReplicateFromServerWithSelector(finalSelector).then(response => {
                    if (response && response === 'Success') {
                        
                        this.metaDbValidation.metaValidations(this.metaDbProvider, true).then(res => {
                            if (res) {
                                // check all meta validation success
                                if (res.status === 'success') {
                                    
                                    const stage1 = this.syncStatusArray[0]
                                    stage1.synctime = this.syncRunningCount
                                    stage1.status = "completed"
                                    this.startSyncCount()
                                    if (this.platform.is('mobile')) {
                                        this.appPreferences.store('', 'isMetaDBSyncSuccess', true)
                                    }
                                    this.metaValidationResponse = res;

                                    if (this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.length > 0) {
                                        //this.startSyncOperation()
                                        this.getPreviousAndCurrentSyncObjects(appConstant.syncEnabledObjectDocName);
                                    } else if (this.attachmentConfig.configuration.pouchDBSyncEnabledObjectSelectors.length > 0) {
                                        const stage2 = this.syncStatusArray[1]
                                        stage2.synctime = "0s"
                                        stage2.status = "completed"
                                        this.syncattachmentDB()
                                    } else {
                                        const stage2 = this.syncStatusArray[1]
                                        stage2.synctime = "0s"
                                        stage2.status = "completed"
                                        const stage3 = this.syncStatusArray[2]
                                        stage3.synctime = "0s"
                                        stage3.status = "completed"
                                        this.syncExecutionDB();
                                    }
                                } else if (res.status === 'failure') { // Handle meta validation failure


                                    if (res.errorType && res.errorType === this.metaDbConfigurationObj.fetchError) {
                                        this.syncFailureMessage = res.message;
                                        this.isSyncFailed = true;
                                        return
                                    }
                                    this.observableListenerUtils.emit('events', res);
                                }
                            } else {
                                this.syncFailureMessage = 'meta data initial sync failure';
                                this.isSyncFailed = true;
                            }
                        });
                    } else {
                        this.syncFailureMessage = 'meta data initial sync failure';
                        this.isSyncFailed = true;
                    }
                })

            })

            
        })
    } else {
        this.startSyncCount()
        this.metaDbValidation.metaValidations(this.metaDbProvider, true).then(res => {
            if (res) {
                // check all meta validation success
                if (res.status === 'success') {
                   
                    const stage1 = this.syncStatusArray[0]
                    stage1.synctime = this.syncRunningCount
                    stage1.status = "completed"
                    this.startSyncCount()
                    if (this.platform.is('mobile')) {
                        this.appPreferences.store('', 'isMetaDBSyncSuccess', true)
                    }
                    this.metaValidationResponse = res;
                    if (this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.length > 0) {
                        //  this.startSyncOperation()
                        this.getPreviousAndCurrentSyncObjects(appConstant.syncEnabledObjectDocName);
                    } else if (this.attachmentConfig.configuration.pouchDBSyncEnabledObjectSelectors.length > 0) {
                        const stage2 = this.syncStatusArray[1]
                        stage2.synctime = "0s"
                        stage2.status = "completed"
                        this.syncattachmentDB()
                    } else {
                        const stage2 = this.syncStatusArray[1]
                        stage2.synctime = "0s"
                        stage2.status = "completed"
                        const stage3 = this.syncStatusArray[2]
                        stage3.synctime = "0s"
                        stage3.status = "completed"
                        this.syncExecutionDB();
                    }
                } else if (res.status === 'failure') { // Handle meta validation failure
                    if (res.errorType && res.errorType === this.metaDbConfigurationObj.fetchError) {
                        this.syncFailureMessage = res.message;
                        this.isSyncFailed = true;
                        return
                    }
                    this.observableListenerUtils.emit('events', res);
                }
            } else {
                this.syncFailureMessage = 'meta data initial sync failure';
                this.isSyncFailed = true;
            }
        });
    }
}



    metaDataReplicateFromServerWithSelector(finalSelector) {
        return this.metaDbProvider.oneTimeReplicationFromServer(finalSelector).then(res => {
           
            if (res === "Success") {
                return Promise.resolve("Success")
            } else {
                return Promise.resolve("Failed")
            }
        }).catch(error => {
            return Promise.resolve(error.message)
        });
    }

    getSelectorObj(tableName, fieldName, fieldValue) {
        var selector = {}
        selector['data.type'] = tableName

        if (Array.isArray(fieldValue)) {
            selector[fieldName] = {}
            selector[fieldName]['$in'] = fieldValue
        } else {
            selector[fieldName] = parseInt(fieldValue)
        }



        return selector
    }

    /****************************************************
               Handle meta data warning message
    *****************************************************/
    private handlewarningMsg(response) {
        this.metaValidationResponse = ''
        if (!response['warningSet']) {

            return;
        }
        this.observableListenerUtils.emit('metaValidationAnnouncement', response);

    }

    /****************************************************
               Toast for meta validation warning
      *****************************************************/
    async displayToast(message) {
        //   setTimeout(() => {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 2500,
            position: 'top',
            cssClass: 'cs-customToast cs-sucessToast small zoomIn animated'
        });
        setTimeout(() => {
            document.querySelector('.cs-sucessToast').classList.add('zoomOut');
        }, 1500);
        toast.present();
        //   }, 200);
    }

    /****************************************************
             Toast for meta validation warning
    *****************************************************/
    async displayCustomAlert(message) {
        const alert = await this.alertCtrl.create({
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Sync',
                    handler: () => {
                        this.callNativePage()
                    }
                }
            ]
        });
        alert.present();
    }

    callNativePage() {
        this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'forceSync' });

    }

    /****************************************************
             One time meta live sync
    *****************************************************/

    initiateMetaDataDbLiveSync() {
        if (this.metaValidationResponse) {
            if (this.metaValidationResponse['metaLiveSyncSelector']) {
                this.callMetaLiveSync(this.metaValidationResponse['metaLiveSyncSelector'])
            } else {
                this.startMetaLiveSync();
            }
        }

    }

    startMetaLiveSync() {
        if (this.apputilityObject.isMobile) {
            this.appPreferences.fetch('login_response').then((res) => {
                const assignedAppsDetail = JSON.parse(res);
                var appIdListToFetch = assignedAppsDetail.map(obj => obj.appId);
                var finalSelector = this.metaDbProvider.makeSelectorForMetaDataSyncArray(appIdListToFetch, true);
                this.callMetaLiveSync(finalSelector)
            });
        } else {
            if (this.apputilityObject.assignedApps) {
                const assignedAppsDetail = this.apputilityObject.assignedApps;
                var appIdListToFetch = assignedAppsDetail.map(obj => obj.appId);
                var finalSelector = this.metaDbProvider.makeSelectorForMetaDataSyncArray(appIdListToFetch, true);
                this.callMetaLiveSync(finalSelector)
            }
        }
    }
    callMetaLiveSync(finalSelector) {
        this.metaDbProvider.liveReplicationFromServerWithSelector({ "$or": finalSelector });
    }

    reStartSync() {
        if (!navigator.onLine) {
            this.showInfoAlert("No internet connection. You should have network connectivity for initial sync");
            return;
        } else {
            this.startMetaDataSync()
        }
    }

    syncattachmentDB(querySelector?, objectPresentInCurrentObjectSet?) {
        const stage3 = this.syncStatusArray[2]
        stage3.status = "running"
        this.attachdbprovider.initializePouchDb();
        var finalSelector;
        if (querySelector && querySelector.length > 0) {
            finalSelector = querySelector;
        } else {
            finalSelector = this.attachmentConfig.configuration.pouchDBSyncEnabledObjectSelectors;
        }

        this.attachdbprovider.oneTimeReplicationFromServer(finalSelector).then(res => {
            
            if (res === "Success") {
                if (objectPresentInCurrentObjectSet !== undefined && objectPresentInCurrentObjectSet.length > 0) {
                    this.attachdbprovider.oneTimeReplicationFromServerWithSpecificObject(objectPresentInCurrentObjectSet).then(result => {
                        this.attachmentObjectSyncStarted(stage3);
                    }).catch(err => {
                        this.attachmentObjectSyncStarted(stage3);
                    });
                } else {
                    this.attachmentObjectSyncStarted(stage3);
                }
            } else {
                this.syncFailureMessage = "Sync Failed";
                this.isSyncFailed = true;
            }
        }).catch(error => {
            this.syncFailureMessage = error.message;
            this.isSyncFailed = true;
        });
    }
    attachmentObjectSyncStarted(stage3) {
        var liveSelector = { '$or': this.attachmentConfig.configuration.pouchDBSyncEnabledObjectSelectors };
        this.attachdbprovider.setCurrentObjectSetInLocalStorage();
        this.attachdbprovider.scheduledReplicationFromServerWithSelector(liveSelector);
        stage3.synctime = this.syncRunningCount
        stage3.status = "completed"
        this.startSyncCount()
        this.syncExecutionDB();
    }

    syncformulaDB(querySelector?, objectPresentInCurrentObjectSet?) {
        const stage5 = this.syncStatusArray[4]
        stage5.status = "running"
        this.formulaDbProvider.initializePouchDb();
        var finalSelector;
        if (querySelector && querySelector.length > 0) {
            finalSelector = querySelector;
        } else {
            finalSelector = this.formulaDbConfiguration.configuration.formulaPouchDBSyncEnabledObjectSelectors;
        }
        if (this.formulaDbConfiguration.configuration.formulaPouchDBSyncEnabledObjectSelectors.length === 0) {
            stage5.synctime = "0s"
            stage5.status = "completed"
            this.startSyncCount()
            if (this.isAuditDBAvailable) {

                this.startSyncAuditDB()
            } else {
                const stage6 = this.syncStatusArray[5]
                stage6.synctime = "0s"
                stage6.status = "completed"
                this.navigationMenuPage();
            }
        } else {
            this.formulaDbProvider.oneTimeReplicationFromServer(finalSelector).then(res => {
                
                if (res === "Success") {
                    if (objectPresentInCurrentObjectSet !== undefined && objectPresentInCurrentObjectSet.length > 0) {
                        this.formulaDbProvider.oneTimeReplicationFromServerWithSpecificObject(objectPresentInCurrentObjectSet).then(result => {
                            this.formulaObjectSyncStarted(stage5);
                        }).catch(err => {
                            this.formulaObjectSyncStarted(stage5);
                        });
                    } else {
                        this.formulaObjectSyncStarted(stage5);
                    }
                } else {
                    this.syncFailureMessage = "Sync Failed";
                    this.isSyncFailed = true;
                }
            }).catch(error => {
                this.syncFailureMessage = error.message;
                this.isSyncFailed = true;
            });
        }
    }

    formulaObjectSyncStarted(stage5) {
        var liveSelector = { '$or': this.formulaDbConfiguration.configuration.formulaPouchDBSyncEnabledObjectSelectors };
        this.formulaDbProvider.setCurrentObjectSetInLocalStorage();
        this.formulaDbProvider.liveReplicateFromServerWithSelector(liveSelector);

        stage5.synctime = this.syncRunningCount
        stage5.status = "completed"
        this.startSyncCount()
        if (this.isAuditDBAvailable) {
            this.startSyncAuditDB()
        } else {
            const stage6 = this.syncStatusArray[5]
            stage6.synctime = "0s"
            stage6.status = "completed"
            this.navigationMenuPage();
        }

    }
     statusWFConfigIdArray = []
    /********SYNC STATUS WORK FLOW EXECUTION DB ********/
    syncExecutionDB() {
        const stage4 = this.syncStatusArray[3];

        if (this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.length === 0) {

            stage4.synctime = "0s"
            stage4.status = "completed"
            this.startSyncCount()
            this.getPreviousAndCurrentSyncObjects(appConstant.syncEnabledFormulaObjectDocName)
        } else {

            stage4.status = "running"
            this.cspfmexecutionPouchDbProvider.initializePouchDb();
            const pfmApproveUserHierarchyJSON = {
                "objectId": this.metaDbConfigurationObj.pfmApproveValueUserObject,
                "objectName": this.metaDbConfigurationObj.pfmApproveValueUserObject,
                "fieldId": 0,
                "objectType": "PRIMARY",
                "relationShipType": null,
                "childObject": []
            };
            const options = {};
            const selector = {}
            selector['data.type'] = this.metaDbConfigurationObj.pfmApproveValueUserObject
            selector['data.user_id'] = Number(this.apputilityObject.userId);
            options['selector'] = selector;
            pfmApproveUserHierarchyJSON['options'] = options;
            this.metaDbProvider.fetchDataWithReference(pfmApproveUserHierarchyJSON).then(result => {
                if (result && result.status === 'SUCCESS') {
                    
                    // Need to hanlde Execution DB Name in Execution DBConfiguration
                    if (result.records.length > 0 && this.cspfmExecutionDBConfigurationObject.configuration.databaseName) {
                     
                        var assignedObjectListInPouch = []
                        this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.map(obj => assignedObjectListInPouch.push(obj['data.type']));


                        for (let i = 0; i < result.records.length; i++) {
                            const statusWFConfigId = result.records[i]["status_wf_config_id"]
                            
                            
                            if (assignedObjectListInPouch.indexOf("pfm" + result.records[i]["object_id"]) > -1){
                                this.statusWFConfigIdArray.push(statusWFConfigId)
                            }
                        }
                        if (this.statusWFConfigIdArray.length > 0) {
                            const statusWFSelector = this.getSelectorObj
                                (this.cspfmExecutionDBConfigurationObject.workFlowUserApprovalStatusObject, 'data.statusWFConfigId',
                                this.statusWFConfigIdArray)
                            this.statusWorkFlowDBReplicateFromServerWithSelector(statusWFSelector).then(response => {
                                if (response && response === 'Success') {
                                    this.cspfmexecutionPouchDbProvider.liveSyncWithSelector(statusWFSelector);
                                    stage4.synctime = this.syncRunningCount
                                    stage4.status = "completed"
                                    this.startSyncCount()
                                    this.getPreviousAndCurrentSyncObjects(appConstant.syncEnabledFormulaObjectDocName)
                                } else {
                                    this.syncFailureMessage = "Sync Failed";
                                    this.isSyncFailed = true;
                                }
                            }).catch(error => {
                                this.syncFailureMessage = error.message;
                                this.isSyncFailed = true;
                            })
                        }else {
                            stage4.synctime = this.syncRunningCount
                            stage4.status = "completed"
                            this.startSyncCount()
                            this.getPreviousAndCurrentSyncObjects(appConstant.syncEnabledFormulaObjectDocName)
                        }

                    } else {
                        stage4.synctime = "0s"
                        stage4.status = "completed"
                        this.startSyncCount()
                        this.getPreviousAndCurrentSyncObjects(appConstant.syncEnabledFormulaObjectDocName)
                    }
                } else {
                    this.syncFailureMessage = "Sync Failed";
                    this.isSyncFailed = true;
                }
            }).catch(error => {
                this.syncFailureMessage = error.message;
                this.isSyncFailed = true;
            });
        }
    }
    statusWorkFlowDBReplicateFromServerWithSelector(finalSelector) {
        return this.cspfmexecutionPouchDbProvider.oneTimeReplicationFromServer(finalSelector).then(oneTimeReplicationResponse => {
            
            if (oneTimeReplicationResponse === "Success") {
                return Promise.resolve("Success")
            } else {
                return Promise.resolve("Failed")
            }
        }).catch(error => {
            return Promise.resolve(error.message)
        });
    }

    //  Method to custom alert
    async showInfoAlert(info) {
        this.alertCtrl.create({
            message: info, subHeader: "",
            buttons: [
                {
                    text: 'Retry',
                    handler: () => {
                        this.reStartSync();
                        console.log('Retry clicked');
                    }
                },
                {
                    text: 'Exit',
                    handler: () => {
                        console.log('Exit clicked');
                        this.gotoApplist();
                    }
                }
            ],
            backdropDismiss: false
        }).then(alert =>
            alert.present());
    }

    ngOnInit() {
    }

    getPreviousAndCurrentSyncObjects(syncType) {

        let currentSyncEnabledObjects = []

        if (syncType === appConstant.syncEnabledObjectDocName) {
            const stage2 = this.syncStatusArray[1]
            stage2.status = "running"
            this.dbprovider.initializePouchDb();
            this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.forEach(element => {
                if (element['data.type']) {
                    currentSyncEnabledObjects.push(element['data.type']);
                }
            });

            let existingSyncEnabledObjects = []
            this.dbprovider.getDocumentFromLocalStorage(appConstant.syncEnabledObjectDocName).then(doc => {
                if (doc) {
                    existingSyncEnabledObjects = doc['object_set'];
                }

                if (existingSyncEnabledObjects.length > 0) {
                    existingSyncEnabledObjects.sort()
                }

                if (currentSyncEnabledObjects.length > 0) {
                    currentSyncEnabledObjects.sort()
                }

                this.comparePreviousAndCurrentSyncObjects(syncType, existingSyncEnabledObjects, currentSyncEnabledObjects);
            }).catch(err => {
                console.log(err)
            });
        } else if (syncType === appConstant.syncEnabledFormulaObjectDocName) {
            this.formulaDbProvider.initializePouchDb();
            this.formulaDbConfiguration.configuration.formulaPouchDBSyncEnabledObjectSelectors.forEach(elements => {
                if (elements['data.type']) {
                    currentSyncEnabledObjects.push(elements['data.type']);
                }
            });
            let existingSyncEnabledObjects = []
            this.formulaDbProvider.getDocumentFromLocalStorage(appConstant.syncEnabledFormulaObjectDocName).then(document => {
                if (document) {
                    existingSyncEnabledObjects = document['object_set'];
                }

                if (existingSyncEnabledObjects.length>0){
                    existingSyncEnabledObjects.sort()
                }

                if (currentSyncEnabledObjects.length>0){
                    currentSyncEnabledObjects.sort()
                }


                this.comparePreviousAndCurrentSyncObjects(syncType, existingSyncEnabledObjects, currentSyncEnabledObjects);
            }).catch(err => {
                console.log(err)
            });
        } else {
            this.attachdbprovider.initializePouchDb();
            this.attachmentConfig.configuration.pouchDBSyncEnabledObjectSelectors.forEach(dataTypeRes => {
                if (dataTypeRes['data.type']) {
                    currentSyncEnabledObjects.push(dataTypeRes['data.type']);
                }
            });

            let existingSyncEnabledObjects = []
            this.attachdbprovider.getDocumentFromLocalStorage(appConstant.syncEnabledObjectDocName).then(docfromlocal => {
                if (docfromlocal) {
                    existingSyncEnabledObjects = docfromlocal['object_set'];
                }

                if (existingSyncEnabledObjects.length>0){
                    existingSyncEnabledObjects.sort()
                }

                if (currentSyncEnabledObjects.length>0){
                    currentSyncEnabledObjects.sort()
                }

                this.comparePreviousAndCurrentSyncObjects(syncType, existingSyncEnabledObjects, currentSyncEnabledObjects);
            }).catch(err => {
                console.log(err)
            });
        }

    }

    comparePreviousAndCurrentSyncObjects(syncType, existingSyncEnabledObjects, currentSyncEnabledObject) {
        if (currentSyncEnabledObject.length < existingSyncEnabledObjects.length) {
            this.destroyAndSyncBasedOnSyncType(syncType);
        } else if (currentSyncEnabledObject.length === existingSyncEnabledObjects.length) {
            if (currentSyncEnabledObject.join() === existingSyncEnabledObjects.join()) {
                if (syncType === appConstant.syncEnabledObjectDocName) {
                    this.startSyncOperation();
                } else if (syncType === appConstant.syncEnabledFormulaObjectDocName) {
                    this.syncformulaDB()
                } else {
                    this.syncattachmentDB();
                }
            } else {
                this.destroyAndSyncBasedOnSyncType(syncType);
            }
        } else if (currentSyncEnabledObject.length > existingSyncEnabledObjects.length) {

            if (existingSyncEnabledObjects.length === 0) {
                if (syncType === appConstant.syncEnabledObjectDocName) {
                    this.startSyncOperation();
                } else if (syncType === appConstant.syncEnabledFormulaObjectDocName) {
                    this.syncformulaDB()
                } else {
                    this.syncattachmentDB();
                }
                return;
            }

            let objectNotPresentInCurrentObjectSet = []
            objectNotPresentInCurrentObjectSet = existingSyncEnabledObjects.filter(value =>
                !currentSyncEnabledObject.includes(value));

            if (objectNotPresentInCurrentObjectSet.length > 0) {
                this.destroyAndSyncBasedOnSyncType(syncType);
                return;
            }

            let objectPresentInCurrentObjectSet = []
            objectPresentInCurrentObjectSet = currentSyncEnabledObject.filter(value =>
                !existingSyncEnabledObjects.includes(value));

            if (objectPresentInCurrentObjectSet.length > 0) {
                var querySelector = []
                if (syncType === appConstant.syncEnabledObjectDocName) {

                    var offlineObjects = this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors;
                    querySelector = offlineObjects.filter(function (item) {
                        if (item['data.type']) {
                            return !objectPresentInCurrentObjectSet.includes(item['data.type']);
                        } else {
                            return true;
                        }
                    })
                    this.startSyncOperation(querySelector, objectPresentInCurrentObjectSet);
                } else if (syncType === appConstant.syncEnabledFormulaObjectDocName) {
                    var offlineFormulaObjects = this.formulaDbConfiguration.configuration.formulaPouchDBSyncEnabledObjectSelectors;
                    querySelector = offlineFormulaObjects.filter( dataTypeResponse => {
                        if (dataTypeResponse['data.type']) {
                            return !objectPresentInCurrentObjectSet.includes(dataTypeResponse['data.type']);
                        } else {
                            return true;
                        }
                    })
                    this.syncformulaDB(querySelector);
                } else {
                    var offlineAttachmentObjects = this.attachmentConfig.configuration.pouchDBSyncEnabledObjectSelectors;
                    querySelector = offlineAttachmentObjects.filter(offlineDataTypeRes => {
                        if (offlineDataTypeRes['data.type']) {
                            return !objectPresentInCurrentObjectSet.includes(offlineDataTypeRes['data.type']);
                        } else {
                            return true;
                        }
                    })
                    this.syncattachmentDB(querySelector);
                }
            }
        }
    }

    destroyAndSyncBasedOnSyncType(syncType) {
        if (syncType === appConstant.syncEnabledObjectDocName) {
            this.dbprovider.destroyDb().then(result => {
                this.dbprovider.initializePouchDb();
                this.startSyncOperation();
            });
        } else if (syncType === appConstant.syncEnabledFormulaObjectDocName) {
            this.formulaDbProvider.destroyDb().then(result => {
                this.formulaDbProvider.initializePouchDb();
                this.syncformulaDB();
            });
        } else {
            this.attachdbprovider.destroyDb().then(result => {
                this.attachdbprovider.initializePouchDb();
                this.syncattachmentDB();
            });
        }
    }
    async  fetchAssignmentObjectForMetaValidation() {
        const options = {};
        const selector = {}

        selector['data.type'] = this.metaDbConfigurationObj.applicationAssignmentObject;
        selector['data.is_active'] = true;
        selector['data.user_id_p'] = Number(this.apputilityObject.userId);
        options['selector'] = selector;
        this.aplicationAssignmentObjectHierarchyJSON['options'] = options;


        return this.metaDbProvider.fetchDataWithReference(this.aplicationAssignmentObjectHierarchyJSON).then(fetchedResult => {
            if (fetchedResult.status !== 'SUCCESS') {

                return Promise.resolve(false)

            }

            return Promise.resolve(fetchedResult.records)

        }).catch(err => {

            return Promise.resolve(false)
        });

    }
    private getAssighedAppDetail() {
        let assignedAppsDetail
        if (this.apputilityObject.isMobile) {
            return this.appPreferences.fetch('login_response').then((response) => {
                return JSON.parse(response);
            })
        } else {
            assignedAppsDetail = this.apputilityObject.assignedApps
            return assignedAppsDetail;
        }

    }
    getLoggedUserDetail() {
        const corUsersObjectHierarchyJSON = {
            "objectId": this.metaDbConfigurationObj.corUsersObject,
            "objectName": this.metaDbConfigurationObj.corUsersObject,
            "fieldId": 0,
            "objectType": "PRIMARY",
            "relationShipType": null,
            "childObject": [
        
            ]
          };
        const query = "type: " + this.metaDbConfigurationObj.corUsersObject + " AND " + "user_id: " + Number(this.apputilityObject.userId)
        return this.metaCouchDbProvider.fetchRecordsBySearchFilterPhrases(query, corUsersObjectHierarchyJSON).then(corUserResult => {
          if (corUserResult.status === 'SUCCESS') {
              const userInfo = JSON.parse(JSON.stringify(corUserResult['records']))
              this.apputilityObject.loggedUserInfo = userInfo[0];
          }
        }).catch(err => {
          console.log('Menu Componenet - Exception Received in core user fetching method')
        //   return undefined
        });
    
      }

    async viewDocsInsertFoeMetaValidation(assigenmenfetcResult) {
        var assignedAppIdListInPochDb = [];
        var localAppIdListToBulkInsert = [];
        if (assigenmenfetcResult && assigenmenfetcResult.length > 0){
            assignedAppIdListInPochDb = assigenmenfetcResult.map(obj => obj.application_id_s);
        }
        var assignedAppsDetail = await this.getAssighedAppDetail()
        var assignedAppIdsListInLocal = [];
        assignedAppsDetail.map(obj => assignedAppIdsListInLocal.push(obj.appId));
        if (assignedAppIdListInPochDb.length > 0) {



            for (var i = 0; i < assignedAppIdsListInLocal.length; i++) {
                if (assignedAppIdListInPochDb.indexOf(assignedAppIdsListInLocal[i]) === -1) {
                    localAppIdListToBulkInsert.push(assignedAppIdsListInLocal[i]);
                }
            }

        } else {
            localAppIdListToBulkInsert = assignedAppIdsListInLocal;
        }
        if (localAppIdListToBulkInsert.length === 0) {

            return Promise.resolve(true)
        }

        var selectorList = this.metaDbProvider.makeSelectorForMetaDataSyncArray(localAppIdListToBulkInsert, false)

        return this.metaDbProvider.fetchMetaDataObjects(selectorList).then(response => {
            if (response) {

                return Promise.resolve(true)
            } else {

                return Promise.resolve(false)
            }
        }).catch(err => {
            return Promise.resolve(false)
        });


    }

    public intervalId = null;
    public syncRunningCount;
    public hour = 0;
    public minute = 0;
    public seconds = 0;
    public totalSeconds = 0;
    public startSyncCount() {
        this.syncRunningCount = 0;
        this.totalSeconds = 0
        this.hour = 0;
        this.minute = 0;
        this.seconds = 0;

        if (!this.intervalId){
            this.intervalId =
                setInterval(() => { this.startTimer(); }, 1000);
        }
    }
    public startTimer() {

        ++this.totalSeconds;

        this.hour = Math.floor(this.totalSeconds / 3600);
        this.minute = Math.floor((this.totalSeconds -
            this.hour * 3600) / 60);
        this.seconds = this.totalSeconds - (this.hour * 3600 + this.minute * 60);
        if (this.minute >= 1){
            this.syncRunningCount = this.minute + "m " + this.seconds + "s"
        } else{
            this.syncRunningCount = this.seconds + "s"
        }
    }
    syncPageHide(){
        this.isSyncPageHide = true;
    }
}
