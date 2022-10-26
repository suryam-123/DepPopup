import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { appConfiguration } from './appConfiguration';
import { metaDbConfiguration } from '../db/metaDbConfiguration';
import { appUtility } from "./appUtility";
@Injectable({
    providedIn: 'root'
})

export class metaDbValidation {

    response = {};
    private warningMessageList = [];
    appNameList = [];
    metaDbProvider;



    public corUsersObjectHierarchyJSON = {
        "objectId": this.metaDbConfig.corUsersObject,
        "objectName": this.metaDbConfig.corUsersObject,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [

        ]
    };
    public aplicationAssignmentObjectHierarchyJSON = {
        "objectId": this.metaDbConfig.applicationAssignmentObject,
        "objectName": this.metaDbConfig.applicationAssignmentObject,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [

        ]
    };
    public applicationPublishInfoObjectHierarchyJSON = {
        "objectId": this.metaDbConfig.applicationPublishInfoObject,
        "objectName": this.metaDbConfig.applicationPublishInfoObject,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [

        ]
    };
    public corMenuGroupObjectHierarchyJSON = {
        "objectId": this.metaDbConfig.corMenuGroup,
        "objectName": this.metaDbConfig.corMenuGroup,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [

        ]
    };
    public corUserMenuGroupAssignmentObjectHierarchyJSON = {
        "objectId": this.metaDbConfig.corUSerMenuGroupAssignemt,
        "objectName": this.metaDbConfig.corUSerMenuGroupAssignemt,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [

        ]
    };
    public corRoleMenuGroupAssignmentObjectHierarchyJSON = {
        "objectId": this.metaDbConfig.corRoleMenuGroupAssignemt,
        "objectName": this.metaDbConfig.corRoleMenuGroupAssignemt,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [

        ]
    };
    private corMobileAppsHierarchyJSON = {
        "objectId": this.metaDbConfig.corMobileApps,
        "objectName": this.metaDbConfig.corMobileApps,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [
        ]
    };
    private corApplicationHierarchyJSON = {
        "objectId": this.metaDbConfig.corApplications,
        "objectName": this.metaDbConfig.corApplications,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [
        ]
    };
    private warningType = [];

    constructor(
        public platform: Platform, private appPreferences: AppPreferences, public appConfig: appConfiguration,
        public metaDbConfig: metaDbConfiguration, private apputilityObject: appUtility) {
    }

    private makeResultJson(status, message, extras?) {
        this.response['status'] = status;
        this.response['message'] = message;
        this.response['errorType'] = ''
        if (extras && extras['fetchError']){
            this.response["errorType"] = extras[this.metaDbConfig.fetchError]
        }

    }

    async metaValidations(metaDataDbProvider, isIntialSync, changesType?) {
        this.metaDbProvider = metaDataDbProvider;
        this.warningMessageList = [];
        this.response = {};
        this.warningType = [];
        var assignedAppsDetail = await this.getAssighedAppDetail()
        if (isIntialSync) {

            return this.fullValidationProcess(assignedAppsDetail, isIntialSync).then(validationProcessResult => {
                if (this.warningMessageList.length !== 0) {
                    this.response["warningSet"] = this.warningMessageList;
                    this.response["warningTypes"] = this.warningType;
                }
                return Promise.resolve(this.response);
            })


        }else {
            //undefined
            if (!changesType) {
                this.makeResultJson(this.metaDbConfig.SUCCESS, "");
                return Promise.resolve(true);
            }
            

            if (changesType === this.metaDbConfig.corUsersObject) {
                return this.userValidation().then(res => {

                    return Promise.resolve(this.response);
                })
            }else if (changesType === this.metaDbConfig.corApplications) {
                return this.appBaseValidation().then(res => {

                    return Promise.resolve(this.response);
                })
            }else if (changesType === this.metaDbConfig.applicationAssignmentObject + "true") {
                return this.fetchAndInsertNewAppRecords(assignedAppsDetail, isIntialSync).then(result => {
                    if (!result) {
                        return Promise.resolve(this.response);
                    }
                    return this.appAssignmentValidation().then(res => {
                        return this.warningMessageListWarningType(this.response);
                    })
                })

            }else if (changesType === this.metaDbConfig.applicationAssignmentObject + "false") {
                return this.appAssignmentValidation().then(res => {
                    return this.warningMessageListWarningType(this.response);
                })
            }else if (changesType === this.metaDbConfig.applicationPublishInfoObject) {
                return this.checkAppNewVersionAvailable(assignedAppsDetail, isIntialSync).then(res => {
                    return this.warningMessageListWarningType(this.response);
                })
            }else if (changesType === this.metaDbConfig.corMenuGroup) {
                return this.menuGroupValidation(assignedAppsDetail).then(res => {

                    return Promise.resolve(this.response);
                })
            }else if (changesType === this.metaDbConfig.corMobileApps) {
                return this.checkAppNewVersionAvailable(assignedAppsDetail, isIntialSync).then(res => {
                    if (!res) {

                        return Promise.resolve(this.response);
                    }
                    return this.appAssignmentValidation().then(res => {

                        if (!res) {

                            return Promise.resolve(this.response);
                        }
                        return this.menuGroupValidation(assignedAppsDetail).then(res => {
                            return this.warningMessageListWarningType(this.response);
                        })
                    })

                })
            }else {
                this.makeResultJson(this.metaDbConfig.SUCCESS, "");
                return true;
            }

        }
    }

    warningMessageListWarningType(response) {
        if (this.warningMessageList.length !== 0) {
            response["warningSet"] = this.warningMessageList;
            response["warningTypes"] = this.warningType;
        }
        return Promise.resolve(this.response);
    }

    fullValidationProcess(assignedAppsDetail, isIntialSync) {
        return this.fetchAndInsertNewAppRecords(assignedAppsDetail, isIntialSync).then(newAppResponse => {

            if (!newAppResponse) {
                this.makeResultJson(this.metaDbConfig.FAILURE, "Application bulk insert failed", { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false)
            }
            return this.userValidation().then(userValidationSuccess => {
                if (!userValidationSuccess){
                    return Promise.resolve(false)
                }

                return this.appBaseValidation().then(appValidationSuccess => {
                    if (!appValidationSuccess){
                        return Promise.resolve(false)
                    }

                    return this.appAssignmentValidation().then(appAssignementvaldiationSuccess => {
                        if (!appAssignementvaldiationSuccess){
                            return Promise.resolve(false)
                        }

                        return this.checkAppNewVersionAvailable(assignedAppsDetail, isIntialSync).then(versionValdiationSuccess => {
                            if (!versionValdiationSuccess){
                                return Promise.resolve(false)
                            }

                            return this.menuGroupValidation(assignedAppsDetail)
                        })



                    })
                })
            })

        }).catch(err => {
            this.makeResultJson(this.metaDbConfig.FAILURE, "Application bulk insert failed", { "fetchError": this.metaDbConfig.fetchError });
            return Promise.resolve(false)
        });
    }

    userValidation() {

       
        if (navigator.onLine) {
            var query = "type:" + this.metaDbConfig.corUsersObject + " AND " + "user_id:" + Number(this.apputilityObject.userId)
            return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corUsersObject).then(res => {
                this.apputilityObject.loggedUserCorObject = res['records'][0];
                return this.handleCorUserReponse(res)
            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, "Meta data user fetch failure", { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false)
            });
        }else {
            const options = {};
            const selector = {}
            selector['data.type'] = this.metaDbConfig.corUsersObject;
            selector['data.user_id'] = Number(this.apputilityObject.userId);
            options['selector'] = selector;
            this.corUsersObjectHierarchyJSON['options'] = options;
            return this.metaDbProvider.fetchDataWithReference(this.corUsersObjectHierarchyJSON).then(corUserResult => {

                return this.handleCorUserReponse(corUserResult)
            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, "Meta data user fetch failure", { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false)
            });
        }


    }
    handleCorUserReponse(corUserResult) {
        if (corUserResult.status !== 'SUCCESS') {
            this.makeResultJson(this.metaDbConfig.FAILURE, "Meta data user fetch failure", { "fetchError": this.metaDbConfig.fetchError });
            return false
        }
        if (corUserResult['records'].length === 0) {
            this.makeResultJson(this.metaDbConfig.FAILURE, "Meta data user detail not available", { "fetchError": this.metaDbConfig.fetchError });
            return false
        }

        const userInfo = JSON.parse(JSON.stringify(corUserResult['records']))
        this.setLoggedUserName(corUserResult)
        let userDetail = userInfo[0];

        if (!(userDetail.is_active === null || userDetail.is_active === 'Y')) {
            this.makeResultJson(this.metaDbConfig.FAILURE, this.metaDbConfig.userInActive);
            return false;

        } else if (!(userDetail.is_locked === null || userDetail.is_locked === 'N')) {
            this.makeResultJson(this.metaDbConfig.FAILURE, this.metaDbConfig.userLocked);
            return false

        }else {
            this.makeResultJson(this.metaDbConfig.SUCCESS, "");
            return true;
        }
    }
    appBaseValidation() {
        const currentAppId = this.appConfig.configuration.appId;

        

        if (navigator.onLine) {
            var query = "type:" + this.metaDbConfig.corApplications + " AND " + "application_id:" + currentAppId + " AND " + "is_active:_y"
            return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corApplications).then(res => {
                return this.handleApplicationActiveResponse(res)
            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, 'Meta cor application info fetching failure', { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false)
            });
        }else {
            const options = {};
            const selector = {};
            selector['data.type'] = this.metaDbConfig.corApplications
            selector['data.application_id'] = currentAppId
            selector['data.is_active'] = "Y"
            options['selector'] = selector
            this.corApplicationHierarchyJSON['options'] = options
            return this.metaDbProvider.fetchDataWithReference(this.corApplicationHierarchyJSON).then(result => {
                return this.handleApplicationActiveResponse(result)
            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, 'Meta cor application info fetching failure', { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false);
            });
        }


    }
    handleApplicationActiveResponse(result) {
        if (result && result.status === 'SUCCESS') {
            if (result.records.length === 0) {
                this.makeResultJson(this.metaDbConfig.FAILURE, this.metaDbConfig.applicationInActive);
                return Promise.resolve(false);
            }else {
                this.makeResultJson(this.metaDbConfig.SUCCESS, "");
                return Promise.resolve(true);
            }
        }else {
            this.makeResultJson(this.metaDbConfig.FAILURE, 'Meta cor application info fetching failure', { "fetchError": this.metaDbConfig.fetchError });
            return Promise.resolve(false);
        }
    }
    async appAssignmentValidation() {

        var assignedAppsDetail = await this.getAssighedAppDetail()
        if (navigator.onLine) {
            var query = "type:" + this.metaDbConfig.applicationAssignmentObject + " AND " + "user_id_p:" + Number(this.apputilityObject.userId) + " AND " + "is_active:true"
            return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.applicationAssignmentObject).then(res => {
                return this.isAssignedAppsAreChanged(assignedAppsDetail, res)
            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, 'Meta data Application assignment fetching failure', { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false)
            });
        }else {
            const options = {};
            const selector = {}

            selector['data.type'] = this.metaDbConfig.applicationAssignmentObject;
            selector['data.is_active'] = true;
            selector['data.user_id_p'] = Number(this.apputilityObject.userId);
            options['selector'] = selector;
            this.aplicationAssignmentObjectHierarchyJSON['options'] = options;
          
            return this.metaDbProvider.fetchDataWithReference(this.aplicationAssignmentObjectHierarchyJSON).then(appAssignmentFetchResult => {

                return this.isAssignedAppsAreChanged(assignedAppsDetail, appAssignmentFetchResult)

            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, 'Meta data Application assignment fetching failure', { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false)
            });
        }

    }

    private getAssighedAppDetail() {
        let assignedAppsDetail
        if (this.apputilityObject.isMobile) {
            return this.appPreferences.fetch('login_response').then((response) => {
                return JSON.parse(response);
            })
        }else {
            assignedAppsDetail = this.apputilityObject.assignedApps
            return assignedAppsDetail;
        }

    }
    private setLoggedUserName(result) {
        try {
            this.apputilityObject.loggedUserName = result['records'][0]['username']
        } catch (err) {
            console.log(err);
        }
    }

    fetchAndInsertNewAppRecords(assignedAppsDetail, isIntialSync) {
        const assignedAppIdListInLocal = [];
        assignedAppsDetail.map(obj => assignedAppIdListInLocal.push(obj.appId));
        if (navigator.onLine) {
            var query = "type:" + this.metaDbConfig.applicationAssignmentObject + " AND " + "user_id_p:" + Number(this.apputilityObject.userId) + " AND " + "is_active:true"
            return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.applicationAssignmentObject).then(assignedAppResult => {


                return this.handleFetchAndInserRecordsResponse(assignedAppResult, assignedAppIdListInLocal, isIntialSync)

            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, "Application bulk insert failed", { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false)
            });
        }else {
            const options = {};
            const selector = {}
            selector['data.type'] = this.metaDbConfig.applicationAssignmentObject;
            selector['data.is_active'] = true;
            selector['data.user_id_p'] = Number(this.apputilityObject.userId);

            options['selector'] = selector;
            this.aplicationAssignmentObjectHierarchyJSON['options'] = options;

            return this.metaDbProvider.fetchDataWithReference(this.aplicationAssignmentObjectHierarchyJSON).then(result => {
                return this.handleFetchAndInserRecordsResponse(result, assignedAppIdListInLocal, isIntialSync)
            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, "Application bulk insert failed", { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false)
            });

        }


    }


    handleFetchAndInserRecordsResponse(assignedAppResult, assignedAppIdListInLocal, isIntialSync) {
        if (assignedAppResult && assignedAppResult.status === ! 'SUCCESS') {
            return Promise.resolve(false)
        }
        const assignedAppIdListInServer = assignedAppResult.records.map(obj => obj.application_id_s);
        var newAssignedAppIdList = [];

        for (var j = 0; j < assignedAppIdListInServer.length; j++) {
            if (assignedAppIdListInLocal.indexOf(assignedAppIdListInServer[j]) === -1) {
                newAssignedAppIdList.push(assignedAppIdListInServer[j]);
            }
        }

        if (newAssignedAppIdList.length === 0) {
            return Promise.resolve(true)
        }
        var selectorList = this.metaDbProvider.makeSelectorForMetaDataSyncArray(newAssignedAppIdList, false);
    
        return this.metaDbProvider.fetchMetaDataObjects(selectorList).then(response => {
            if (response) {
                var appIdList = newAssignedAppIdList.concat(assignedAppIdListInLocal)
                var selectorNameList = this.metaDbProvider.makeSelectorForMetaDataSyncArray(appIdList, true);
                if (isIntialSync){
                    this.response["metaLiveSyncSelector"] = selectorNameList;
                }
                if (!isIntialSync){
                    this.stopAndStartMetaliveListenerAndModifySelector(selectorNameList)
                }
                return Promise.resolve(true)
            }else {
                return Promise.resolve(false)
            }

        }).catch(err => {
            return Promise.resolve(false)
        });
    }



    /*****************************************
Validate the assigned app ,unassigned app info
***********************************************/

    isAssignedAppsAreChanged(assignedAppsDetail, fetchedResult) {
        var assignedAppIdsListInLocal = [];
        assignedAppsDetail.map(obj => assignedAppIdsListInLocal.push(obj.appId));
        if (fetchedResult.status !== 'SUCCESS') {
            this.makeResultJson(this.metaDbConfig.FAILURE, 'Application info fetching failure', { "fetchError": this.metaDbConfig.fetchError });
            return Promise.resolve(false);

        } else if (fetchedResult.records.length === 0) {

            this.makeResultJson(this.metaDbConfig.FAILURE, this.metaDbConfig.currentlyNoAppsAreAssigned);
            return Promise.resolve(false);
        }

        const assignedAppIdListInServer = fetchedResult.records.map(obj => obj.application_id_s);

        const currentAppId = this.appConfig.configuration.appId;
        if (assignedAppIdListInServer.indexOf(currentAppId) === -1) {
            this.makeResultJson(this.metaDbConfig.FAILURE, this.metaDbConfig.appUnassigned);

            return Promise.resolve(false);
        }
        var newAssignedAppIdList = [];
        for (var j = 0; j < assignedAppIdListInServer.length; j++) {
            if (assignedAppIdsListInLocal.indexOf(assignedAppIdListInServer[j]) === -1) {
                newAssignedAppIdList.push(assignedAppIdListInServer[j]);
            }
        }
        if (newAssignedAppIdList.length > 0) {
            return this.newAppsAreAssigned(newAssignedAppIdList).then(result => {
                if (!result) {
                    this.makeResultJson(this.metaDbConfig.FAILURE, 'Meta new apps fetch failure', { "fetchError": this.metaDbConfig.fetchError });
                    return Promise.resolve(false);
                }
                this.makeResultJson(this.metaDbConfig.SUCCESS, '');
                return Promise.resolve(true);
            })
        }else {
            this.makeResultJson(this.metaDbConfig.SUCCESS, '');
            return Promise.resolve(true);
        }



    }

    stopAndStartMetaliveListenerAndModifySelector(finalSelector) {

        this.metaDbProvider.cancelLivereplicationFromServerWithSelector()
        this.metaDbProvider.liveReplicationFromServerWithSelector({ "$or": finalSelector });

    }

    async newAppsAreAssigned(newAssignedAppIdList) {

        if (navigator.onLine) {

            var query = this.makeInQuery(newAssignedAppIdList, this.metaDbConfig.corMobileApps, 'application_id')

            return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corMobileApps).then(res => {
                var result = this.getPublishedStatusAppIds(res)
                if (result && result['status'] === 'SUCCESS') {
                    if (result['records'].length === 0) {
                        return Promise.resolve(true)
                    }

                    return this.getAppName(result['records'].map(obj => obj.application_id)).then(res => {
                        return res;
                    })
                }else {
                    return Promise.resolve(false)
                }


            }).catch(err => {
                return Promise.resolve(false)
            })

        }else {
            const options = {};
            const selector = {};
            selector['data.type'] = this.metaDbConfig.corMobileApps
            selector['data.application_id'] = {}
            selector['data.application_id']["$in"] = newAssignedAppIdList
            options['selector'] = selector
            this.corMobileAppsHierarchyJSON['options'] = options
            return this.metaDbProvider.fetchDataWithReference(this.corMobileAppsHierarchyJSON).then(res => {
                var result = this.getPublishedStatusAppIds(res)
                if (result && result['status'] === 'SUCCESS') {
                    if (result['records'].length === 0) {
                        return Promise.resolve(true)
                    }

                    return this.getAppName(result['records'].map(obj => obj.application_id)).then(res => {
                        return res;
                    })


                }else {
                    return Promise.resolve(false)
                }
            }).catch(err => {
                return Promise.resolve(false)
            })

        }
    }
    makeInQuery(appIdList, objectName, fieldName) {
        var selectedValue = ''
        appIdList.forEach(element => {
            if (selectedValue){
                selectedValue = selectedValue + " " + element
            }else{
                selectedValue = element
            }
        });
        return "type:" + objectName + " AND " + fieldName + ":" + "(" + selectedValue + ")"
    }
    private getAppName(appIdList) {
        if (navigator.onLine) {
            var query = this.makeInQuery(appIdList, this.metaDbConfig.corApplications, 'application_id')
            return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corApplications).then(result => {

                return this.handleApplicationResponse(result)
            }).catch(err => {
                return Promise.resolve(false)

            })
        }else {
            const options = {};
            const selector = {};
            selector['data.type'] = this.metaDbConfig.corApplications
            selector['data.application_id'] = {}
            selector['data.application_id']["$in"] = appIdList


            options['selector'] = selector
            this.corMobileAppsHierarchyJSON['options'] = options
            return this.metaDbProvider.fetchDataWithReference(this.corMobileAppsHierarchyJSON).then(res => {
                return this.handleApplicationResponse(res)
            }).catch(err => {
                return Promise.resolve(false)
            })
        }

    }
    handleApplicationResponse(result) {
        if (result && result.status === 'SUCCESS') {
            if (result['records'].length === 0) {
                return Promise.resolve(false)
            }
            for (let i = 0; i < result['records'].length; i++) {
                var data = this.makeAnnoucementData(result.records[i].display_name, "", "", result['records'][i]['application_id'], "newApp")
                if (this.warningType.indexOf("newApp") === -1)
                    this.warningType.push("newApp");
                this.warningMessageList.push(data)

            }
            this.makeResultJson(this.metaDbConfig.SUCCESS, '');
            return Promise.resolve(true)

        }else {
            return Promise.resolve(false)
        }
    }

    /*****************************************
      Validate the new app version,force update details
      ***********************************************/

    private checkAppNewVersionAvailable(assignedAppsDetail, isIntialSync) {
        const currentAppId = this.appConfig.configuration.appId;
        return this.checkCorMobileAppIsPublishedStatus(currentAppId).then(async response => {
            if (response['fetchStatus'] === this.metaDbConfig.SUCCESS && response['status'] === 'PUB') {
                return this.getAvailableVersions(assignedAppsDetail).then(result => {
                    if (result){
                        return Promise.resolve(true);
                    }else{
                        return Promise.resolve(false)
                    }

                })
            }else {
                if (response['fetchStatus'] === this.metaDbConfig.FAILURE) {
                    this.makeResultJson(this.metaDbConfig.FAILURE, 'Meta cor mobile apps fetching failure', { "fetchError": this.metaDbConfig.fetchError });
                    return Promise.resolve(false);
                }
                this.makeResultJson(this.metaDbConfig.SUCCESS, '');
                return Promise.resolve(true);
            }
        })
    }

    private getAvailableVersions(assignedAppsDetailList) {
        const currentAppId = this.appConfig.configuration.appId;
        let appObj = assignedAppsDetailList.filter(app => app.appId === currentAppId);
        if (navigator.onLine) {
            var query = "type:" + this.metaDbConfig.applicationPublishInfoObject + " AND " + "application_id:" + currentAppId + " AND " + "major_version:[" + Number(appObj[0]['majorVersion']) + " TO Infinity]"
            return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.applicationPublishInfoObject).then(res => {
                return this.handleNewVersionResponse(res, appObj)
            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, 'Application  publish info fetching failure', { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false)
            });
        }else {

            const options = {};
            const selector = {};
            selector['data.type'] = this.metaDbConfig.applicationPublishInfoObject
            selector['data.application_id'] = currentAppId
            selector['data.major_version'] = { "$gte": Number(appObj[0]['majorVersion']) }
            options['selector'] = selector
            this.applicationPublishInfoObjectHierarchyJSON['options'] = options
            return this.metaDbProvider.fetchDataWithReference(this.applicationPublishInfoObjectHierarchyJSON).then(result => {
                return this.handleNewVersionResponse(result, appObj)

            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, 'Application  publish info fetching failure', { "fetchError": this.metaDbConfig.fetchError });
                return false
            });
        }
    }
    handleNewVersionResponse(result, appObj) {
        var latestVersionObject;
        if (result && result.status === 'SUCCESS') {

            if (result.records.length === 0) {
                return Promise.resolve(true);
            }
            if (result.records.length === 1) {
                latestVersionObject = result.records[0]
            }else {
                var latestMajorVersionObject = this.getLatestMajorVersion(result.records)

                latestVersionObject = this.getMaxMinorVersion(result.records, latestMajorVersionObject)
            }

            for (let i = 0; i < result.records.length; i++) {
                if (result.records[i].force_update === 'Y' && (
                    result.records[i]['major_version'] > Number(appObj[0]['majorVersion'])
                    || (result.records[i]['minor_version'] > Number(appObj[0]['minorVersion'])))) {
                    this.makeResultJson(this.metaDbConfig.FAILURE, this.metaDbConfig.newVersionWithForceUpdate
                        + " V " + result.records[i]['major_version'] + "." + result.records[i]['minor_version'] + " " + appObj[0]['appDisplayName']);
                    return false
                }
            }

            if (latestVersionObject['major_version'] > Number(appObj[0]['majorVersion'])
                || latestVersionObject['minor_version'] > Number(appObj[0]['minorVersion'])) {
                var data = this.makeAnnoucementData(appObj[0]['appDisplayName'], appObj[0]['majorVersion'] + "." + appObj[0]['minorVersion'], latestVersionObject['major_version'] + "." +
                    latestVersionObject['minor_version'], appObj[0]['appId'], "newVersion")
                if (this.warningType.indexOf("newVersion") === -1)
                    this.warningType.push("newVersion");
                this.warningMessageList.push(data)
            }
            this.makeResultJson(this.metaDbConfig.SUCCESS, '');
            return Promise.resolve(true);
        }else {
            this.makeResultJson(this.metaDbConfig.FAILURE, 'Application  publish info fetching failure', { "fetchError": this.metaDbConfig.fetchError });
            return false
        }
    }
    getMaxMinorVersion(dataObject, majorVersion) {

        var max = majorVersion;
        for (var i = 0; i < dataObject.length; i++) {
            if (dataObject[i]['major_version'] >= majorVersion['major_version'] &&
                dataObject[i]['minor_version'] > max['minor_version'])
                max = dataObject[i];
        }

        return max;
    }
    getLatestMajorVersion(newVersionAppDataList) {
        return newVersionAppDataList.reduce((prev, current) =>
            (prev.major_version > current.major_version) ? prev : current)


    }

    menuGroupValidation(assignedAppsDetailList) {

        let assignedMenuGroupListInLocal = [];
        var currentAppId = this.appConfig.configuration.appId;

        return this.checkCorMobileAppIsPublishedStatus(currentAppId).then(result => {
            if (result['fetchStatus'] === this.metaDbConfig.SUCCESS && result['status'] === 'PUB') {
                assignedAppsDetailList.forEach(app => {
                    if (app['appId'] === currentAppId) {
                        assignedMenuGroupListInLocal = app["assignedMenuGroups"];
                    }
                });
                return this.isMenuGroupActive(assignedMenuGroupListInLocal).then(result => {
                    if (result) {
                        this.makeResultJson(this.metaDbConfig.SUCCESS, '');
                        return Promise.resolve(true);

                    }else {
                        return Promise.resolve(false);
                    }
                })

            }else {
                if (result['fetchStatus'] === this.metaDbConfig.FAILURE) {
                    this.makeResultJson(this.metaDbConfig.FAILURE, 'Meta cor mobile apps fetch failure', { "fetchError": this.metaDbConfig.fetchError });
                    return Promise.resolve(false);
                }
                this.makeResultJson(this.metaDbConfig.SUCCESS, '');
                return Promise.resolve(true);
            }
        }).catch(error => {
            this.makeResultJson(this.metaDbConfig.FAILURE, "Meta data menugroup fetching failure", { "fetchError": this.metaDbConfig.fetchError });
            return false
        })

    }


    isMenuGroupActive(assignedMenuGroupListInLocal) {
        var currentAppId = this.appConfig.configuration.appId;
        if (navigator.onLine) {
            var query = this.makeInQuery(assignedMenuGroupListInLocal, this.metaDbConfig.corMenuGroup, 'menu_group_id')
            return this.metaDbProvider.fetchDocsUsingSearchApi(query + "application_id:" + currentAppId + " AND " + "is_active:_y", this.metaDbConfig.corMenuGroup).then(result => {
                return this.handleMenuGroupResponse(result, assignedMenuGroupListInLocal)
         }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, "Meta data menugroup fetching failure", { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false);
            })
        }else {
            let options = {}
            let selector = {}
            selector['data.type'] = this.metaDbConfig.corMenuGroup
            selector['data.application_id'] = currentAppId
            selector['data.menu_group_id'] = {}
            selector['data.menu_group_id']["$in"] = assignedMenuGroupListInLocal
            selector['data.is_active'] = "Y"
            options['selector'] = selector
            this.corMobileAppsHierarchyJSON['options'] = options
            return this.metaDbProvider.fetchDataWithReference(this.corMobileAppsHierarchyJSON).then(res => {
                return this.handleMenuGroupResponse(res, assignedMenuGroupListInLocal)
            }).catch(err => {
                this.makeResultJson(this.metaDbConfig.FAILURE, "Meta data menugroup fetching failure", { "fetchError": this.metaDbConfig.fetchError });
                return Promise.resolve(false);
            })
        }

    }
    handleMenuGroupResponse(result, assignedMenuGroupListInLocal) {
        if (result && result.status === 'SUCCESS') {
            if (result.records.length === 0) {

                this.makeResultJson(this.metaDbConfig.FAILURE, this.metaDbConfig.menuGroupUnAssigned);
                return Promise.resolve(false);
            }
            var menGroupIdList = result['records'].map(obj => obj.menu_group_id);
            for (let i = 0; i < assignedMenuGroupListInLocal.length; i++) {
                if (menGroupIdList.indexOf(assignedMenuGroupListInLocal[i]) === -1) {
                    this.makeResultJson(this.metaDbConfig.FAILURE, this.metaDbConfig.menuGroupUnAssigned);

                    return Promise.resolve(false);
                }
            }
            return Promise.resolve(true);
        }else {
            this.makeResultJson(this.metaDbConfig.FAILURE, "Meta data menugroup fetching failure", { "fetchError": this.metaDbConfig.fetchError });
            return Promise.resolve(false);
        }
    }

   
    makeCorMobileAppResultSet(status, records) {
        var resultSet = {};
        resultSet['status'] = status
        resultSet['records'] = records
        return resultSet;
    }
    getPublishedStatusAppIds(res) {
        if (res && res.status === 'SUCCESS') {
            if (res['records'].length > 0) {
                var filteredResult = []
                var filterResult = res['records']
                filterResult.forEach(element => {
                    if (element['device_type'] !== null) {
                        if (element.status === 'PUB' &&
                        (!this.apputilityObject.isMobile &&
                         element['device_type'].split("$$").indexOf('BROWSER') !== -1) ||
                        (this.apputilityObject.isMobile &&
                        element['device_type'].split("$$").indexOf(this.apputilityObject.osType.toUpperCase()) !== -1)) {
                            filteredResult.push(element)
                            }
                        } 
                });
                return this.makeCorMobileAppResultSet(res.status, filteredResult);
            }else {
                return this.makeCorMobileAppResultSet(res.status, []);
            }


        }else {
            return this.makeCorMobileAppResultSet(this.metaDbConfig.FAILURE, []);
        }
    }
    checkCorMobileAppIsPublishedStatus(appId) {

        if (navigator.onLine) {
            var query = "type:" + this.metaDbConfig.corMobileApps + " AND " + "application_id:" + appId
            return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corMobileApps).then(res => {
                return this.handleCoreMobileAppsResponse(res)
            }).catch(err => {

                return this.handledCorMobileAppFailedResponse()
            });
        }else {
            const options = {};
            const selector = {};
            selector['data.type'] = this.metaDbConfig.corMobileApps
            selector['data.application_id'] = appId


            options['selector'] = selector
            this.corMobileAppsHierarchyJSON['options'] = options
            return this.metaDbProvider.fetchDataWithReference(this.corMobileAppsHierarchyJSON).then(result => {
                return this.handleCoreMobileAppsResponse(result)

            }).catch(err => {

                return this.handledCorMobileAppFailedResponse()

            });
        }


    }
    handledCorMobileAppFailedResponse() {
        var resultSet
        resultSet['fetchStatus'] = this.metaDbConfig.FAILURE
            resultSet['status'] = ''
        return resultSet
    }
    handleCoreMobileAppsResponse(result) {
        if (result && result.status === 'SUCCESS') {
            var resultSet = {}
            resultSet['fetchStatus'] = this.metaDbConfig.SUCCESS;
            if (result.records.length === 0) {
                resultSet['status'] = ''

                return resultSet;
            }
            var mobileAppsData = result.records[0]

            if (mobileAppsData.status !== 'PUB') {
                resultSet['status'] = ''

                return resultSet;
            }

            var supportedDevieTypes = result.records[0]['device_type'].split("$$");
            if ((!this.apputilityObject.isMobile
                && supportedDevieTypes.indexOf('BROWSER') !== -1) || (this.apputilityObject.isMobile
                    && supportedDevieTypes.indexOf(this.apputilityObject.osType.toUpperCase()) !== -1)) {
                resultSet['status'] = 'PUB'

                return resultSet;
            }else {
                resultSet['status'] = ''

                return resultSet;
            }

        }else {

            resultSet['fetchStatus'] = this.metaDbConfig.FAILURE
                resultSet['status'] = ''
            return resultSet

        }
    }
 


    makeAnnoucementData(appName, oldVersion, newVersion, appId, annoucementType) {
        var annoucemnetDataObject = {}
        annoucemnetDataObject['appName'] = appName;
        annoucemnetDataObject['oldVersion'] = oldVersion;
        annoucemnetDataObject['newVersion'] = newVersion;
        annoucemnetDataObject['appId'] = appId;
        annoucemnetDataObject['annoucementType'] = annoucementType;
        return annoucemnetDataObject;
    }





}
