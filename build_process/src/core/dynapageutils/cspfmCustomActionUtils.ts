import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { appUtility } from 'src/core/utils/appUtility';
import { cspfmExecutionCouchDbProvider } from 'src/core/db/cspfmExecutionCouchDbProvider';
import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
import { dataProvider } from 'src/core/utils/dataProvider';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { cspfmAlertDialog } from '../components/cspfmAlertDialog/cspfmAlertDialog';
import { SlickgridPopoverService } from '../services/slickgridPopover.service';
import { cspfmCustomActionPopover } from '../components/cspfmCustomActionPopover/cspfmCustomActionPopover';
import { Subject } from 'rxjs';
declare var window: any;
declare var $: any;
@Injectable({
    providedIn: "root"
})

export class cspfmCustomActionUtils {

    public isCustomActionInitiated = new Subject();
    constructor(private datePipe: DatePipe,
        private appUtilityConfig: appUtility,
        private metaDbConfigurationObj: metaDbConfiguration,
        private dataProviderObj: dataProvider,
        private cspfmExecutionCouchDbProviderObj: cspfmExecutionCouchDbProvider,
        public slickgridPopoverService: SlickgridPopoverService,
        private cspfmMetaCouchDbProviderObj: cspfmMetaCouchDbProvider,
        public dialog: MatDialog, private dialogRef: MatDialogRef<cspfmAlertDialog>) {
            $(document).on('click', (event) => {
                if($(event.target) && !$(event.target).parent().hasClass("cs-clicked-inp-dropdown")) {
                    $(document).find(".cs-clicked-inp-dropdown").removeAttr("data-cs-dropdown");
                    $('.cs-clicked-inp-dropdown').removeClass('cs-clicked-inp-dropdown');
                }
            })
    }

    async showBallonUIForInprogress(actionConfig, parentPage, recentTrackingDocument, recordInfo, parentElement) {
        let userInfo = await this.getUserInfo(recentTrackingDocument['createdby'])
        let duration = this.convertMillisecondToTime(new Date().getTime() - recentTrackingDocument['lastmodifiedon']);
        let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + parentPage.layoutId);
        let additionalInfo = {
            infoDetails: {
                actionName: actionConfig['actionName'],
                duration: duration,
                initiatedDate: this.datePipe.transform(recentTrackingDocument['createdon'], 'dd MMM yyyy'),
                initiatedTime: this.datePipe.transform(recentTrackingDocument['createdon'], 'hh:mm a'),
                initiatedDateTime: this.datePipe.transform(recentTrackingDocument['createdon'], 'MMM d, y, hh:mm:ss a'),
                userName: userInfo['username'],
                profileImage: userInfo['profileImage']
            },
            actionType: actionConfig['actionType'],
            processMode: actionConfig['processMode'],
            layoutId: parentPage.layoutId
        }
        actionConfig['customActionInprogresInfo'] = additionalInfo;
        actionConfig['menuVisible'] = true;
        actionConfig['actionStatus'] = 'inprogress';
        if (actionConfig['callingFrom'] === 'slickgrid') {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                parentContext: parentPage,
                type: "CUSTOM_ACTION",
                actionConfig
            };
            dialogConfig.autoFocus = false;
            setTimeout(()=>{
                console.log('im in progress')
                if($(parentElement).hasClass('cs-clicked-inp-dropdown')){
                    this.secondHideDropdownHide();
                } else {
                    $(parentElement).addClass('cs-clicked-inp-dropdown');
                    console.log('parentElement',parentElement)
                    $(document).find('.cs-clicked-inp-dropdown').attr('data-cs-dropdown',`#cs-dropdown-${parentPage.layoutId}`)
                    this.slickgridPopoverService.appendComponentToElement(`cs-dropdown-${parentPage.layoutId}`, cspfmCustomActionPopover,recordInfo, actionConfig);
                    window.$(".cs-clicked-inp-dropdown").jqDropdown("show", [".cs-dropdown"]);
                }
               
            })
        }
    }
    secondHideDropdownHide() {
        $(document).find('.cs-clicked-inp-dropdown').removeAttr('data-cs-dropdown')
        $('.cs-clicked-inp-dropdown').removeClass('cs-clicked-inp-dropdown')
        window.$(".cs-clicked-inp-dropdown").jqDropdown("hide", [".cs-dropdown"]);
        window.$(".cs-clicked-inp-dropdown").jqDropdown("detach", [".cs-dropdown"]);
        $('.cs-dropdown-open').removeClass('cs-dropdown-open')
        $('.cs-dropdown').empty();
   }
   
    async checkAnyProcessRunning(actionConfig, parentPage, recordInfo, parentElement) {
        actionConfig['status'] = '';
        let recentTrackingDocument = await this.isCustomActionProcessing(actionConfig, this.cspfmExecutionCouchDbProviderObj)
        let isAnyProcessRunning = false;
        if (recentTrackingDocument) {
          isAnyProcessRunning = (recentTrackingDocument['status'] === 'processing');
        }
        actionConfig['isAnyProcessRunning'] = isAnyProcessRunning;
        actionConfig['processMode'] = isAnyProcessRunning ? 'backgroundProcessInprogress' : recentTrackingDocument ? 'backgroundProcessCompleted' : '';

        if (actionConfig['processMode'] === 'backgroundProcessInprogress') {
            if (actionConfig['processType'] === 'foreground') {
                parentPage.isCustomActionProcessing = false;
            }
            await this.showBallonUIForInprogress(actionConfig, parentPage, recentTrackingDocument, recordInfo, parentElement);
        }
        return actionConfig['isAnyProcessRunning'];
    }

    detectBrowerClose(parentPage) {
        window.addEventListener('beforeunload', event => {
            let isAllBackgroundProcessRunning = false;
            let inProgressActionDocs = [];
            for (let actionConfiguration of Object.values(parentPage.customActionConfiguration || {})) {
                let trackingInfo = {};
                if (actionConfiguration['isProcessInitiated']) {
                    isAllBackgroundProcessRunning = true;
                    trackingInfo['actionid'] = actionConfiguration['actionId']
                    trackingInfo['actionname'] = actionConfiguration['actionName']
                    trackingInfo['actionmode'] = actionConfiguration['actionMode']
                    trackingInfo['processtype'] = actionConfiguration['processType']
                    trackingInfo['layoutid'] = actionConfiguration['layoutId']
                    trackingInfo['recordid'] = actionConfiguration['recordId']
                    trackingInfo['status'] = 'completed';
                    inProgressActionDocs.push(trackingInfo);
                }
            }
            console.log('*************** CLOSE ***************')
            let bulkDoc = this.cspfmExecutionCouchDbProviderObj.prepareBulkDoc('cspfmactiontracking', inProgressActionDocs)
            console.log('bulkDoc: ', JSON.stringify(bulkDoc))
            if (isAllBackgroundProcessRunning) {
                event.preventDefault();
                event.returnValue = '';
            }
            this.endAction(isAllBackgroundProcessRunning, bulkDoc)
        });
    }

    endAction(isAllBackgroundProcessRunning, bulkDoc) {
        console.log('*************** endAction *************** ' + isAllBackgroundProcessRunning + ' ***************')
        if (isAllBackgroundProcessRunning) {
            /* Browser window/tab close */
            window.addEventListener('unload', () => {
                console.log('*************** unload ', JSON.stringify(bulkDoc), ' ***************')
                this.cspfmExecutionCouchDbProviderObj.updateBulkDoc(bulkDoc);
            });
            /* Browser reload */
            window.addEventListener('load', () => {
                console.log('*************** load ', JSON.stringify(bulkDoc), ' ***************')
                this.cspfmExecutionCouchDbProviderObj.updateBulkDoc(bulkDoc);
            });
            /* Browser back button */
            window.addEventListener('hashchange', () => {
                console.log('*************** hashchange ', JSON.stringify(bulkDoc), ' ***************')
                this.cspfmExecutionCouchDbProviderObj.updateBulkDoc(bulkDoc);
            })
        } else {
            window.removeEventListener('unload', () => {});
            window.removeEventListener('load', () => {});
            window.removeEventListener('pagehide', () => {})
        }
    }

    removeBrowserEvent(parentPage) {
        let isAllBackgroundProcessCompleted = true;
        for (let actionConfiguration of Object.values(parentPage.customActionConfiguration || {})) {
            if (actionConfiguration['isProcessInitiated']) {
                isAllBackgroundProcessCompleted = false;
                break;
            }
        }
        if (isAllBackgroundProcessCompleted) {
            window.removeEventListener('beforeunload', () => { });
        }
    }
    
    async getUserInfo(userId) {
        const corUserObjectHierarchyJSON = {
            objectId: this.metaDbConfigurationObj.corUsersObject,
            objectName: this.metaDbConfigurationObj.corUsersObject,
            fieldId: 0,
            objectType: 'PRIMARY',
            relationShipType: null,
            childObject: []
        };
        const query = 'type: ' + this.metaDbConfigurationObj.corUsersObject + 'AND user_id:' + userId;
        let result = [{
            userName: '',
            profileImage: ''
        }];
        await this.cspfmMetaCouchDbProviderObj.fetchRecordsUsingSearchDesignDocs(query, corUserObjectHierarchyJSON).then((res: []) => {
            result = res;
            result.forEach(element => {
                element['profileImage'] = this.appUtilityConfig.getUserImageURL(element['user_id'])
            })
        })
        return result[0];
    }

    isCustomActionProcessing(actionInfo, provider) {
        let searchQuery = 'type: cspfmactiontracking';
        if (actionInfo['recordId']) {
            searchQuery = searchQuery + ' AND recordid: ' + actionInfo['recordId']
        }
        if (actionInfo['layoutId']) {
            searchQuery = searchQuery + ' AND layoutid: ' + actionInfo['layoutId']
        }
        if (actionInfo['actionId']) {
            searchQuery = searchQuery + ' AND actionid: ' + actionInfo['actionId']
        }
        if (actionInfo['status']) {
            searchQuery = searchQuery + ' AND status: ' + actionInfo['status']
        }
        if (actionInfo['userId']) {
            searchQuery = searchQuery + ' AND createdby: ' + actionInfo['userId']
        }

        let sort = '-createdon<number>'
        return provider.callSearchDesignDocsWithPagination(searchQuery, 'cspfmactiontracking_search', 1, sort).then(result => {
            if (result) {
                if (result['rows'] && result['rows'].length > 0) {
                    return result['rows'][0]['doc']['data'];
                }
                return;
            }
            return;
        })
    }

    async checkProcessStatus(actionConfig) {
        actionConfig['status'] = '';
        let recentTrackingDocument = await this.isCustomActionProcessing(actionConfig, this.cspfmExecutionCouchDbProviderObj)
        let timelimit = 300000;    // 5mins
        let duration = 0;
        if (recentTrackingDocument && recentTrackingDocument['status'] === 'processing') {
            duration = new Date().getTime() - recentTrackingDocument['lastmodifiedon'];
        }
        if (duration > timelimit) {
            await this.dataProviderObj.insertTrackingDocument(actionConfig, 'end');
        }
    }

    convertMillisecondToTime(duration) {
        let seconds: number | string = Math.floor((duration / 1000) % 60);
        let minutes: number | string = Math.floor((duration / (1000 * 60)) % 60);
        let hours: number | string = Math.floor((duration / (1000 * 60 * 60)) % 24);
        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        if (hours === '00') {
            return minutes + ' Mins : ' + seconds + ' Secs';
        } else if (minutes === '00' || seconds === '00') {
            return seconds + ' Secs';
        } else {
            return hours + ' Hrs : ' + minutes + ' Mins : ' + seconds + ' Secs';
        }
    }

    async initialMethod(parentPage, actionName, trackingType, recordInfo?, parentElement?) {
        let actionConfig = parentPage.customActionConfiguration[actionName];
        actionConfig['menuVisible'] = false;
        actionConfig['actionStatus'] = '';
        if (actionConfig['processType'] === 'foreground') {
            parentPage.isCustomActionProcessing = true;
        }
        await this.checkProcessStatus(actionConfig);
        let isRunning = false;
        if (actionConfig['trackingType'] === trackingType) {
            if (trackingType === 'org') {
                actionConfig['recordId'] = '';
            } else if (recordInfo) {
                actionConfig['callingFrom'] = 'slickgrid';
                actionConfig['recordId'] = recordInfo['dataContext'] ? recordInfo['dataContext']['id'] : '';
            } else {
                actionConfig['recordId'] = parentPage.dataObject[actionConfig['traversalPath']]['id'];
            }
            isRunning = await this.checkAnyProcessRunning(actionConfig, parentPage, recordInfo, parentElement);
            if (isRunning) {
                return { isProcessToTerminate: true };
            }
        }
        actionConfig['userId'] = this.appUtilityConfig.userId;
        isRunning = await this.checkAnyProcessRunning(actionConfig, parentPage, recordInfo, parentElement);
        actionConfig['userId'] = '';
        if (isRunning) {
            return { isProcessToTerminate: true };
        }
        if (actionConfig['processType'] === 'background') {
            this.appUtilityConfig.presentToast('Background process initiated');
        }
        actionConfig['outputResponse'] = [];
        if (recordInfo) {
            actionConfig['slickgridArgs'] = {};
            actionConfig['recordId'] = recordInfo['dataContext'] ? recordInfo['dataContext']['id'] : '';
        } else {
            actionConfig['recordId'] = parentPage.dataObject[actionConfig['traversalPath']]['id'];
        }
        if (parentPage.dataProvider) {
            await parentPage.dataProvider.insertTrackingDocument(actionConfig, 'start');
        } else {
            await parentPage.dataProviderObject.insertTrackingDocument(actionConfig, 'start');
        }
        this.isCustomActionInitiated.next({ isProcessInitiated: true, actionId: actionConfig['actionId'] });
        return { isProcessToTerminate: false, actionConfig };
    }

    async endMethod(parentPage, actionName, trackingType, recordInfo?) {
        let actionConfig = parentPage.customActionConfiguration[actionName];
        if (actionConfig['processType'] === 'foreground') {
            parentPage.isCustomActionProcessing = false;
        }
        actionConfig['isProcessInitiated'] = false;
        actionConfig['menuVisible'] = false;
        actionConfig['customActionInprogresInfo'] = {};
        actionConfig['actionStatus'] = '';
        if (recordInfo) {
            actionConfig['callingFrom'] = 'slickgrid';
            actionConfig['slickgridArgs'] = recordInfo;
            actionConfig['recordId'] = recordInfo['dataContext'] ? recordInfo['dataContext']['id'] : '';
        } else {
            actionConfig['recordId'] = trackingType === 'org' ? '' : parentPage.dataObject[actionConfig['traversalPath']]['id'];
        }
        if (parentPage.dataProvider) {
            await parentPage.dataProvider.insertTrackingDocument(actionConfig, 'end');
        } else {
            await parentPage.dataProviderObject.insertTrackingDocument(actionConfig, 'end');
        }
        this.isCustomActionInitiated.next({ isProcessInitiated: false, actionId: actionConfig['actionId'] });
        this.removeBrowserEvent(this);
    }
    
    openPopover(component, dialogConfig) {
        this.closePopver();
        this.dialogRef = this.dialog.open(component, dialogConfig);
    }
    
    closePopver() {
        if (this.dialogRef['id']) {
            this.dialogRef.close();
        }
    }
}