
import {
    Injectable
} from '@angular/core';
import {
    appUtility
} from '../utils/appUtility';
import * as lodash from 'lodash';
import {
    dataProvider
} from "src/core/utils/dataProvider";
import {
    cspfmExecutionPouchDbConfiguration
} from "src/core/db/cspfmExecutionPouchDbConfiguration";
import {
    cspfmSlickgridUtils
} from './cspfmSlickgridUtils';
import {
    AngularGridInstance
} from 'angular-slickgrid';

@Injectable({
    providedIn: 'root'
})
export class cspfmHeaderLineUtils {

    constructor(private appUtilityConfig: appUtility,
        public dataProvider: dataProvider,
        public slickgridUtils: cspfmSlickgridUtils,
        public executionDbConfigObject: cspfmExecutionPouchDbConfiguration) {}
    showinfobtn(e?) {
        // document.getElementsByClassName("cdk-overlay-pane")[0].classList.add("cs-info-popover");
        let addInfoPopoverClass = document.getElementsByClassName("cdk-overlay-pane");
        for (let i = 0; i < addInfoPopoverClass.length; i++) {
            addInfoPopoverClass[i].classList.add('cs-info-popover');
        }
        let infoPopoverCheck = document.getElementsByClassName('cs-info-popover')[0];
        if (infoPopoverCheck) {
            while (!infoPopoverCheck.classList.contains('cdk-overlay-container')) {
                infoPopoverCheck = infoPopoverCheck.parentElement;
            }
            infoPopoverCheck.classList.add('cs-userassign-overlay');
            if (e) {
                e.stopPropagation();
            }
        }
    }
    // Webservice Provider Class
    handleResult(childObject, result, errorMessageToDisplay,listenerName,sectionObjectDetails?) {
        this.dataProvider.finishLazyLoading(listenerName[childObject['objectName']],result['records'])
        if (result && result['status'] && result['records'] && (result['status'] === 'SUCCESS' || result['records'].length > 0)) {
            childObject['isLoading'] = false;
            childObject['paginationInfo']['nextBadgeDisabled'] = true;
            if (result['paginationAction'] && childObject['paginationInfo']['currentPageIndex'] > 0) {
                    childObject['paginationInfo']['currentPageIndex'] = childObject['paginationInfo']['currentPageIndex'] - 1;
                
            }
            errorMessageToDisplay = 'No Records';
            childObject['childDocsArray'] = lodash.uniq([...childObject['childDocsArray'], ...result['records']])
            if (childObject["additionalInfo"]["dataFetchMode"] === "Batch") {
                childObject['paginationInfo']['pagination']['view']['itemCount'] = "50";
            }
            let angularGridInstance: AngularGridInstance = childObject['angularGridInstance'];
            if(sectionObjectDetails){
                angularGridInstance['slickGrid']['isAutoFitEnable'] = sectionObjectDetails.isAutoFitEnable
            }
            angularGridInstance.paginationService.goToFirstPage();
            setTimeout(()=>{
                this.slickgridUtils.resizeColumnsByCellContent(angularGridInstance)
            },100)
            return Promise.resolve([true]);
        } else {
            childObject['isLoading'] = false;
            errorMessageToDisplay = result['message'];
            if (errorMessageToDisplay === "No internet") {
                this.appUtilityConfig.presentNoInternetToast(this);
            }
            return Promise.resolve([false]);
        }
    }
    updateChildWithReference(dataFetchInfoObj, sourceObj, resultObj, fieldName) {
        if (dataFetchInfoObj["child"] === "") {
            sourceObj[fieldName] = resultObj[fieldName];
        } else {
            this.updateChildWithReference(dataFetchInfoObj["child"], sourceObj[dataFetchInfoObj["fieldName"]][0], resultObj, fieldName)
        }
    }
    isRequireToUpdateData(upsertFields, resultObj, sourceData) {
        let isRequireToUpdate = false;
        for (var i = 0; i < upsertFields.length; i++) {
            if (upsertFields[i]['isUnique'] === 'Y') {
                if (resultObj[upsertFields[i]['fieldName']] === sourceData[upsertFields[i]['fieldName']]) {
                    isRequireToUpdate = true;
                } else {
                    isRequireToUpdate = false;
                    break;
                }
            }
        }
        return isRequireToUpdate;
    }
    getFormattedUniqueData(objectId, resultObj, webserviceUniqueColumnObj) {
        let formattedData = ""
        if (webserviceUniqueColumnObj[objectId] && webserviceUniqueColumnObj[objectId].length > 0) {
            webserviceUniqueColumnObj[objectId].forEach(element => {
                if (formattedData === "") {
                    formattedData = resultObj[element];
                } else {
                    formattedData = formattedData + "|" + resultObj[element];
                }
            });
        }
        return formattedData;
    }
    getValueFromChildObject(dataFetchInfoObj, data) {
        if (dataFetchInfoObj["child"] === "") {
            return data[dataFetchInfoObj["fieldName"]][0]
        } else {
            return this.getValueFromChildObject(dataFetchInfoObj["child"], data[dataFetchInfoObj["fieldName"]][0])
        }
    }
    makeUniqueObjectMapping(dataArray, objectId, selectedRowMappingInfo, webserviceUniqueColumnObj) {
        selectedRowMappingInfo[objectId] = {}
        dataArray.forEach(data => {
            let formattedDate = "";
            webserviceUniqueColumnObj[objectId].forEach(column => {
                if (formattedDate === "") {
                    formattedDate = data[column];
                } else {
                    formattedDate = formattedDate + "|" + data[column];
                }
            });
            selectedRowMappingInfo[objectId][formattedDate] = data;
        });
    }
    fetchChildModifiedRecords(angularGridInstance: AngularGridInstance, objectName: string, addNewIds: Array<string>, objectHierarchyJSON: object, classContext: object) {
        const additionalObjectdata = {};

        additionalObjectdata['id'] = addNewIds.length === 1 ? addNewIds[0] : addNewIds;
        if (objectHierarchyJSON.hasOwnProperty('options') && objectHierarchyJSON['options']) {
            delete objectHierarchyJSON['options']
        }
        const fetchParams = {
            'objectHierarchyJSON': objectHierarchyJSON,
            'dataSource': classContext["dataSource"],
            'additionalInfo': additionalObjectdata
        }

        let callingMethodName = addNewIds.length === 1 ? 'querySingleDoc' : 'queryBulkDoc';
        classContext["dataProvider"][callingMethodName](fetchParams).then(result => {
            if (result["status"] !== "SUCCESS") {
                classContext["errorMessageToDisplay"] = result["message"];
                return;
            }
            this.upsertModifiedData(angularGridInstance, objectName, result['records'], classContext);
        }).catch(error => {
            console.log(error);
            classContext["errorMessageToDisplay"] = error;
            return;
        });
    }
    upsertModifiedData(angularGridInstance: AngularGridInstance, objectName: string, data: Array<any>, classContext: object) {
        data = classContext["cspfmCustomFieldProviderObject"].makeSlickGridCustomFields(data, (classContext["columnDefinitions"].hasOwnProperty(objectName) ? classContext["columnDefinitions"][objectName] : classContext["columnDefinitions"]));
        if (angularGridInstance && data && data.length > 0) {
            angularGridInstance.dataView.beginUpdate();
            data.forEach(element => {
                var value = angularGridInstance.dataView.getItemById(element['id'])
                if (value) {
                    angularGridInstance.dataView.updateItem(element['id'], element);
                } else {
                    angularGridInstance.dataView.addItem(element);
                }
            });
            angularGridInstance.dataView.endUpdate();
            angularGridInstance.dataView.reSort();
            const indexOfSelectedChildObj = classContext['childObjectsInfo'].findIndex((childObj) => childObj['objectName'] === objectName)
            if(indexOfSelectedChildObj > -1) {
                classContext['childObjectsInfo'][indexOfSelectedChildObj]['isLoading'] = false
            }
            if (classContext["sectionObjectDetails"][objectName]['matrixConfig']['displayInfo']['currentMode'] === 'matrix') {
                this.slickgridUtils.changeMatrixLayout(classContext["isSkeletonLoading"], angularGridInstance, classContext["sectionObjectDetails"], objectName, classContext["dataSource"]);
            }
        }
        this.slickgridUtils.resizeColumnsByCellContent(angularGridInstance)
    }
    toggleGrid(childObjectName: string, classContext: object) {
        classContext["sectionObjectDetails"][childObjectName]['isExpanded'] = classContext["sectionObjectDetails"][childObjectName]['isExpanded'] === 'C' ? 'E' : 'C';
        let resizeSlickGrid = this.slickgridUtils.getChildObject(childObjectName, classContext['childObjectsInfo']);
        if(resizeSlickGrid['angularGridInstance']){
            resizeSlickGrid['angularGridInstance']['resizerService'].resizeGrid();
        }
    }
    scrollToSection(sectionObject: object, classContext: object) {
        classContext["sectionPopover"]['_results'].filter(popover => popover['popoverOpen'])[0].closePopover()
        let scrollToChildSection = this.slickgridUtils.getChildObject(sectionObject['objectName'], classContext['childObjectsInfo']);
        scrollToChildSection['isExpanded'] = 'C';
        classContext["sectionObjectDetails"][sectionObject['objectName']]['isExpanded'] = 'C';
        this.toggleGrid(sectionObject['objectName'], classContext);
        setTimeout(() => {
            document.getElementById(sectionObject['objectName'] + '_section').scrollIntoView({ behavior: "smooth" });
        }, 5)
    }
}
