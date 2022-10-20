import { Injectable } from '@angular/core';
import { dbConfiguration } from './dbConfiguration';
import { HttpClient } from '@angular/common/http';
import { appUtility } from '../utils/appUtility';
import * as lodash from 'lodash';
import { objectTableMapping } from '../pfmmapping/objectTableMapping';

export interface ReferenceDetail {
    objectName: string,
    objectType: string,
    relationShipType: string,
    fieldId: string,
    objectId: string,
    childObject: Array<ReferenceDetail>,
    options?: any,
    queryBatch?: QueryBatchInfo
}
export interface QueryBatchInfo {
    userId?: number;
    type: string;
    docId: any;
    key?: string;
}
/*
  Generated class for the ServicehelperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class jsondbProvider {

    // hostname = 'http://192.168.53.95:2021';

    private failed = 'FAILED';
    private success = 'SUCCESS';
    constructor(public dbConfigurationObj: dbConfiguration, public http: HttpClient, public apputility: appUtility,
        public objectTableMapObject: objectTableMapping) {
    }

    /*********************************************************
     Making Request Parameter & web service calling
     *********************************************************/
    fetchByProcessInfo(actionInfo, layoutId, actionParams?, ) {
        const serviceUrl = this.makeWebServiceURL('fetchByProcessInfo');

        actionInfo['orgId'] = this.apputility.orgId
        actionInfo['userId'] = this.apputility.userId

        const params = {
            "inputparams": {
                "processInfo": actionInfo,
                "dataParams": {
                    "recordId": actionParams || ""
                },
                "layoutId": layoutId
            }
        }

        if (this.apputility.isMobile) {
            params.inputparams['sessionToken'] = this.apputility.accessToken
            params.inputparams['sessionType'] = "OAUTH"
        } else {
            params.inputparams['sessionToken'] = this.apputility.sessionId
            params.inputparams['sessionType'] = "NODEJS"
        }

        return this.postHttpCallout(serviceUrl, params).then(res => {
            var isStreamLimitExceeded = false
            var limitExceededMsg = ""
            if(res.hasOwnProperty('isStreamLimitExceeded')) {
                isStreamLimitExceeded = res['isStreamLimitExceeded']
                limitExceededMsg = res['limitExceededMsg']
            }

            if (res['status'] === "success") {
                const response = { 
                    status: this.success, 
                    message: 'Record fetching completed', 
                    records: res['records'],
                    isStreamLimitExceeded: isStreamLimitExceeded,
                    limitExceededMsg: limitExceededMsg
                };
                return response;
            } else if (res['status'] === 502) {
                const response = { 
                    status: this.failed, 
                    message: "Request Timeout", 
                    records: [],
                    isStreamLimitExceeded: isStreamLimitExceeded,
                    limitExceededMsg: limitExceededMsg
                };
                return response;
            } else {
                const response = { 
                    status: this.failed, 
                    message: res['message'], 
                    records: [],
                    isStreamLimitExceeded: isStreamLimitExceeded,
                    limitExceededMsg: limitExceededMsg
                };
                return response;
            }
        });

    }

    upsertByProcessInfo(actionInfo, dataParams) {
        const serviceUrl = this.makeWebServiceURL('upsertByProcessInfo');
        const sessionId = this.apputility.sessionId

        actionInfo['orgId'] = this.apputility.orgId
        actionInfo['userId'] = this.apputility.userId

        const params = {
            "webserviceInput": {
                "sessionId": sessionId,
                "processInfo": actionInfo,
                "dataParams": dataParams
            }
        }

        if (this.apputility.isMobile) {
            params.webserviceInput['sessionToken'] = this.apputility.accessToken
            params.webserviceInput['sessionType'] = "OAUTH"
        } else {
            params.webserviceInput['sessionToken'] = this.apputility.sessionId
            params.webserviceInput['sessionType'] = "NODEJS"
        }

        return this.postHttpCallout(serviceUrl, params).then(res => {
            if (res['status'] === "success") {
                const statusInfo = res["statusInfo"]
                const reponseJSON: any = {}
                reponseJSON["dataResult"] = statusInfo;
                reponseJSON["status"] = this.success;
                reponseJSON["message"] = 'Data Saved Successfully'
                return Promise.resolve(reponseJSON);
            } else {
                const statusInfo = res["statusInfo"]
                if (typeof statusInfo === 'object') {
                    const reponseJSON: any = {}
                    reponseJSON["dataResult"] = statusInfo;
                    reponseJSON["status"] = "Partial Success";
                    const statusInfoArray = this.makeResponseStatus(statusInfo);
                    reponseJSON["statusInfoArray"] = statusInfoArray
                    return Promise.resolve(reponseJSON);
                } else { // Error
                    const reponseJSON: any = {}
                    reponseJSON["status"] = this.failed
                    reponseJSON["message"] = res["statusInfo"]
                    return Promise.resolve(reponseJSON);
                }
            }
        }).catch(err => {
            const reponseJSON: any = {}
            reponseJSON["status"] = this.failed
            reponseJSON["message"] = "Data Inserted Failed"
            return Promise.resolve(reponseJSON);
        });


        // Testing Response
        // const response = {
        //     "status": "Error",
        //     "statusInfo": {
        //       "employee1appm": [
        //         {
        //           "employeeCode" : "123",
        //           "yearlysalary": 5,
        //           "email": "test@gmail.com",
        //           "objSystemAttributes": {
        //             "Status": "Success",
        //             "SuccessMessage": "Data Saved Successfully"
        //           }
        //         }
        //       ],
        //       "addlinfo1appm": [
        //         {
        //           "addInfoCode": "456",
        //           "experience": 5,
        //           "startedfrom": "943856798",
        //           "objSystemAttributes": {
        //             "Status": "Success",
        //             "SuccessMessage": "Data Saved Successfully"
        //           }
        //         },
        //         {
        //           "addInfoCode": "",
        //           "experience": 10,
        //           "startedfrom": "943856798",
        //           "objSystemAttributes": {
        //             "Status": "Error",
        //             "ErrorMessage": "Data is too long for column"
        //           }
        //         }
        //       ]
        //     },
        //   }
        //  Error Response
        //   const response = {
        //     "status": "Error",
        //     "statusInfo": "orgId not found or value is zero"
        //   }

    }

    makeResponseStatus(statusInfo) {
        const statusInfoArray : any = [];
        const objectKeys = Object.keys(statusInfo)
        objectKeys.forEach(objectName => {
            const dataObjects = statusInfo[objectName]
            dataObjects.forEach(dataObject => {
                const statusObject: any = {}
                const objectId = this.objectTableMapObject.mappingDetail[objectName]
                statusObject["objectId"] = objectId;
                if (dataObject["objSystemAttributes"]["Status"] === "Success") {
                    statusObject["status"] = this.success
                    statusObject["message"] = dataObject["objSystemAttributes"]["SuccessMessage"]
                } else {
                    statusObject["status"] = this.failed
                    statusObject["message"] = dataObject["objSystemAttributes"]["ErrorMessage"]
                }
                statusInfoArray.push(statusObject)
            });
        })
        return statusInfoArray;
    }

    /*********************************************************
    Making Web Service URL
    *********************************************************/
    makeWebServiceURL(params) {
        const hostName = this.apputility.appBuilderURL        
        if(params === 'fetchByProcessInfo'){
            if(this.apputility.isMobile) {
                let serviceUrl = hostName + '/dataprovider/fetchbyLayoutData'
                return serviceUrl
            }
            return hostName + '/dataprovider/fetchbyLayoutData';

        }else{
            return hostName + '/dataprovider/upsertByProcessInfo';
        }

    }

    /*********************************************************
    Call Web request
    *********************************************************/
    postHttpCallout(urlStr, params) {
        if (navigator.onLine) {
            return this.http.post(urlStr, params)
                .toPromise()
                .then(res => {
                    return res;
                }, error => {
                    console.log('error==>' + error);
                    return error;
                });
        } else {
            return Promise.resolve({ "status": this.failed, "message": "No network connection" })
        }
    }


    // Get plural form of table name
    getPluralName(type) {
        let keysToSchema = {}
        this.dbConfigurationObj.configuration.schema.forEach(type => {
            keysToSchema[type.singular] = type;
        });
        var schema = keysToSchema[type]
        return schema.plural
    }

    /* Formula Data Object Fetch Method */
    fetchFormulaDataObject(formulaReverseObjectHierarchyJSON: ReferenceDetail,
        objectHierarchyJSON: ReferenceDetail, dataObject: any, finalRes) {
        let formulakey = "";
        if (formulaReverseObjectHierarchyJSON['objectId'].includes('pfm')) {
            formulakey = formulaReverseObjectHierarchyJSON['objectId']
        } else {
            formulakey = "pfm" + formulaReverseObjectHierarchyJSON['objectId'];
        }
        const formulaReverseChildJsonArray = formulaReverseObjectHierarchyJSON["childObject"]
        let formulaObjectArray = []
        formulaObjectArray = lodash.concat(formulaObjectArray, formulakey);
        // Get Formula Involved Objects
        return this.getFormulaInvolvedObjects(formulaReverseChildJsonArray, formulaObjectArray).then(formulaInvolvedObject => {
            if (formulaInvolvedObject["status"] === this.success) {
                const formulaInvolvedObjectArray = formulaInvolvedObject["records"]
                if (formulaInvolvedObjectArray.length > 0) {
                    let objectkey = "";
                    if (objectHierarchyJSON['objectId'].includes('pfm')) {
                        objectkey = objectHierarchyJSON['objectId']
                    } else {
                        objectkey = "pfm" + objectHierarchyJSON['objectId'];
                    }
                    const formulaObjectAvailable = formulaInvolvedObjectArray.includes(objectkey)
                    if (formulaObjectAvailable) {
                        finalRes[objectkey] = dataObject
                    }
                    const childJsonArray = objectHierarchyJSON['childObject'];
                    // Get Formula Object from DataObject using Hierarchy JSON
                    return this.fetchRecursiveFormulaObjectUsingHierarchy(formulaInvolvedObjectArray,
                        dataObject, childJsonArray, finalRes).then(resultObject => {
                            if (resultObject["status"] === this.success) {
                                return Promise.resolve({
                                    status: this.success,
                                    message: "",
                                    records: resultObject["records"]
                                })
                            } else {
                                return this.promiseAction();
                            }
                        }).catch(err => {
                            return this.promiseAction();
                        });
                } else {
                    const type = dataObject["type"]
                    finalRes[type] = dataObject
                    return Promise.resolve({
                        status: this.success,
                        message: "",
                        records: finalRes
                    });
                }
            } else {
                return this.promiseAction();
            }
        }).catch(err => {
            return this.promiseAction();
           
        });
    }

    promiseAction(){
        return Promise.resolve({
            status: this.failed,
            message: "Server error. Please contact admin."
        });
    }

    /* Get Formula Involved Objects */
    getFormulaInvolvedObjects(childObjects, objectArray) {
        const taskList = []
        for (let j = 0; j < childObjects.length; j++) {
            if (childObjects[j]["objectType"].toUpperCase() === "LOOKUP") {
                let fieldId = ""
                if (childObjects[j]['objectId'].includes('pfm')) {
                    fieldId = childObjects[j]['fieldId'];
                } else {
                    let lookupObjectName = "pfm" + childObjects[j]['objectId'];
                    fieldId = lookupObjectName + "_" + childObjects[j]['fieldId'];
                }
                objectArray = lodash.concat(objectArray, fieldId);
                const childJsonArray = childObjects[j]['childObject'];
                if (childJsonArray.length > 0) {
                    taskList.push(this.getFormulaInvolvedObjects(childJsonArray, objectArray))
                }
            } else {
                let key = "";
                if (childObjects[j]['objectId'].includes('pfm')) {
                    key = childObjects[j]['objectId']
                } else {
                    key = "pfm" + childObjects[j]['objectId'];
                }
                objectArray = lodash.concat(objectArray, key);
                const childJsonArray = childObjects[j]['childObject'];
                if (childJsonArray.length > 0) {
                    taskList.push(this.getFormulaInvolvedObjects(childJsonArray, objectArray))
                }
            }
        }

        return Promise.all(taskList).then(allRes => {
            return Promise.resolve({
                status: this.success,
                message: "",
                records: objectArray
            });
        });
    }

    // Get Formula Object from DataObject using Hierarchy JSON
    fetchRecursiveFormulaObjectUsingHierarchy(formulaObjectArray, resultObject: any, childObjects, finalRes) {
        const taskList = [];
        for (let j = 0; j < childObjects.length; j++) {
            if (childObjects[j]["objectType"].toUpperCase() === "LOOKUP") {
                let fieldId = ""
                
                if (childObjects[j]['objectId'].includes('pfm')) {
                    fieldId = childObjects[j]['fieldId'];
                } else {
                   let lookupObjectName = "pfm" + childObjects[j]['objectId'];
                    fieldId = lookupObjectName + "_" + childObjects[j]['fieldId'];
                }
                const formulaObjectAvailable = formulaObjectArray.includes(fieldId)
                if (formulaObjectAvailable) {
                    const lookupObject = resultObject[fieldId]
                    finalRes[fieldId] = lookupObject
                }
            } else {
                let key = "";
                if (childObjects[j]['objectId'].includes('pfm')) {
                    key = childObjects[j]['objectId']
                } else {
                    key = "pfm" + childObjects[j]['objectId'];
                }
                const pluralKey = this.getPluralName(key)
                const dataObject = resultObject[pluralKey]
                const formulaObjectAvailable = formulaObjectArray.includes(key)
                if (formulaObjectAvailable) {
                    finalRes[key] = dataObject[0]
                }
                const childJsonArray = childObjects[j]['childObject'];
                if (childJsonArray.length > 0) {
                    taskList.push(this.fetchRecursiveFormulaObjectUsingHierarchy(formulaObjectArray, dataObject, childJsonArray, finalRes))
                }
            }
        }

        return Promise.all(taskList).then(allRes => {
            if (Object.entries(finalRes).length > 0 && finalRes.constructor === Object) {
                return Promise.resolve({
                    status: this.success,
                    message: "",
                    records: finalRes
                });
            } else {
                return Promise.resolve({
                    status: this.failed,
                    message: "Server error. Please contact admin.",
                });
            }
        });
    }
}
