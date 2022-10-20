import { Injectable } from "@angular/core";
import { appUtility } from '../utils/appUtility';
import { appConfiguration } from '../utils/appConfiguration';
import PouchDB from 'pouchdb';
import { appConstant } from 'src/core/utils/appConstant';
import { formulaDbConfiguration } from './formulaDbConfiguration';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import * as lodash from 'lodash';
import { v4 as uuid} from 'uuid';
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class formulaCouchDbProvider {

    private db;
    private dbChanges;
    public keysToSchema = {};
    public tableStructure = {};
    public remote = '';
    private response = { 'status': '', 'message': '', 'records': [] };
    private failed = "FAILED"
    private success = 'SUCCESS';
    private partialSuccess = 'PARTIAL SUCCESS'
    private internetErrorMessage = 'No internet';
    private batchLimit = 2000;
    public queryBatchLimit = 200;
    public batchIdLimit = 1000;

    constructor(public formulaDbConfiguration: formulaDbConfiguration, public appUtilityObj: appUtility, public appconfig: appConfiguration,
        public observableListenerUtils: cspfmObservableListenerUtils,private httpClient:HttpClient) {
        this.initializePouchDb()
    }


    networkWithConnectivity() {
        if (this.formulaDbConfiguration.configuration.formulaCouchDBSyncEnabledObjectSelectors.length > 0) {
            if (this.dbChanges) {
                this.dbChanges.cancel();
            }
            this.startChangeListner();
        }
    }

    networkWithOutConnectivity() {
        if (this.formulaDbConfiguration.configuration.formulaCouchDBSyncEnabledObjectSelectors.length > 0) {
            if (this.dbChanges) {
                this.dbChanges.cancel();
            }
        }
    }


    public startChangeListner() {
        const finalSelector = { '$or': this.formulaDbConfiguration.configuration.formulaCouchDBSyncEnabledObjectSelectors };
        this.dbChanges = this.db.changes({ live: true, continuous: true, since: 'now', timeout: 30000, selector: finalSelector, include_docs: true, attachments: false })
            .on('change', this.onDatabaseChange)
            .on('error', (err) => {
                console.log("formula couchdb change listener error :", err);
                this.appUtilityObj.couchListenerStopped('formulaCouchdb', this)
            });
    }

    // Pouch Database change listener callback
    private onDatabaseChange = (change) => {
        try {
            let type = ""
            if (change['doc']["data"]['type'].indexOf('rollup') > -1) {
                type = change['doc']["data"]['type'].slice(0, change['doc']["data"]['type'].indexOf('rollup'))
            } else if (change['doc']["data"]['type'].indexOf('formula') > -1) {
                type = change['doc']["data"]['type'].slice(0, change['doc']["data"]['type'].indexOf('formula'))
            }
            if (type !== "") {
                change['doc']["data"]['type'] = type;
                change['id'] = change['doc']['data']['type'] + '_2_' + change['doc']['data']['reference_id']
                change['dataProvider'] = 'CouchDB';
                change['providerType'] = 'formula';
                let publishLayaoutIds = this.appUtilityObj.getEventSubscriptionlayoutIds("CouchDB", change['doc']["data"]['type'])
                this.eventsPublish(change, publishLayaoutIds)
            }
            if (change['doc']["data"]['type'].includes('userAssignment')) {
                const publishLayaoutIds = this.appUtilityObj.getEventSubscriptionlayoutIds("CouchDB", change['doc']["data"]['type'])
                this.eventsPublish(change, publishLayaoutIds)           
            }
        } catch (error) {
            console.log(error);
        }
    }

    eventsPublish(change, publishLayaoutIds) {
        if (publishLayaoutIds === undefined || publishLayaoutIds === null || publishLayaoutIds === "") {
            return
        }
        publishLayaoutIds.forEach(element => {
            this.observableListenerUtils.emit(element, change);
        });
    }

    /****************************************************
        Initialize pouchdb and setup db schema
   *****************************************************/
    // Initialize pouchdb
    initializePouchDb() {
        if (this.db === undefined) {
            this.remote = this.formulaDbConfiguration.remoteDbUrl + this.formulaDbConfiguration.configuration.databaseName;
            this.db = new PouchDB(this.remote, {
                auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.formulaDbConfiguration)
            });
            // this.setSchema();
            this.db.setMaxListeners(50);
        }
        // this.startChangeListener()
    }

    /****************************************************
                   Destroy the pouchdb
    *****************************************************/


    // Destroy pouchdb
    destroyDb() {
        if (this.db) {
            return this.db.destroy().then(res => {
                this.db = undefined;
                return res;
            }).catch(err => {
                // error occurred
                return err;
            });
        } else {
            return Promise.resolve({ 'ok': true });
        }
    }


    // Live replication from server with selector
    liveReplicateFromServerWithSelector(selector) {
        const options = {
            live: true,
            retry: true,
            filter: '_selector',
            selector: selector,
            include_docs: true,
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.formulaDbConfiguration)
        };
        this.db.replicate.from(this.remote, options);
    }

    setCurrentObjectSetInLocalStorage() {

        let syncEnabledObjectSelectors = []
        this.formulaDbConfiguration.configuration.formulaCouchDBSyncEnabledObjectSelectors.forEach(element => {
            if (element['data.type']) {
                syncEnabledObjectSelectors.push(element['data.type']);
            }
        });
        this.getDocumentFromLocalStorage(appConstant.syncEnabledFormulaObjectDocName).then(document => {
            let doc;
            if (document) {
                doc = {
                    _id: appConstant.syncEnabledFormulaObjectDocName,
                    _rev: document._rev,
                    object_set: syncEnabledObjectSelectors
                }
            } else {
                doc = {
                    _id: appConstant.syncEnabledFormulaObjectDocName,
                    object_set: syncEnabledObjectSelectors
                }
            }
            return this.db.put(doc).then(response => {
                if (response['ok']) {
                    return Promise.resolve(true);
                } else {
                    console.log('Attachment object set insert failed');
                    return Promise.resolve(false);
                }
            }).catch(err => {
                console.log(err);
                return Promise.resolve(false);
            });
        });
    }

    getDocumentFromLocalStorage(docName) {
        return this.db.get(docName).then(doc => {
            if (doc) {
                // If id exist one time sync from server using since option
                return Promise.resolve(doc)
            } else {
                return Promise.resolve(undefined);
            }
        }).catch(err => {
            console.log(err)
            return Promise.resolve(undefined);
        });
    }


    fetchRollUpValue(keysArray) {
        return this.fetchMethod('rollupView', keysArray)
    }


    fetchformulaValue(keysArray) {
        return this.fetchMethod('formulaView', keysArray)

    }



    fetchMethod(viewDocument, keysArray) {
        var queryOptions = {
            keys: keysArray,
            include_docs: true
        };

        return this.db.query(viewDocument, queryOptions)
            .then(result => {
                if (result['rows'] && result['rows'].length > 0) {
                    this.response['status'] = this.success
                    this.response['message'] = "Data Fetched"
                    this.response['records'] = result['rows']
                    return Promise.resolve(this.response);
                } else {
                    this.response['status'] = this.success
                    this.response['message'] = "No Data Fetched"
                    this.response['records'] = []
                    return Promise.resolve(this.response);
                }
            }).catch(err => {
                this.response['status'] = this.failed
                this.response['message'] = "No Data Fetched"
                this.response['records'] = []
                return Promise.resolve(this.response);
            })

    }

    makeDocIdArrayToString(idArray: string[], objectName?: string) {
        let parentIdJson = "";
        if (objectName) {
            idArray = idArray.map(item => { return item.replace(objectName + "_2_", "") });
        }
        parentIdJson = idArray.join(" OR ")
        if (parentIdJson !== "") {
            parentIdJson = "( " + parentIdJson + " )";
        }
        return parentIdJson
    }

    fetchFormulaAndRollup(query: string, objectName: string, primaryObjectIds, fieldType: 'formula' | 'rollup') {
        let taskList = [];
        let bacthWiseIdArray = [];
        let designDocName = objectName + fieldType + "_search";
        let sort = "createdon<number>";
        if (primaryObjectIds && primaryObjectIds.length > 0) {
            bacthWiseIdArray = lodash.chunk(primaryObjectIds, this.batchIdLimit);
            bacthWiseIdArray.forEach(idArray => {
                query = query + " AND reference_id : " + this.makeDocIdArrayToString(idArray, objectName);
                taskList.push(this.callSearchDesignDocs(query, designDocName, sort).then(result => {
                    if (result && result['rows'] && result['rows'].length > 0) {
                        let formulaOrRollupDocId = [];
                        result['rows'].forEach(element => {
                            element = element['doc']['data']
                            const makePrimaryObjectDocId = objectName + "_2_" + element['reference_id'];
                            formulaOrRollupDocId.push(makePrimaryObjectDocId);
                        });
                        return formulaOrRollupDocId
                    } else {
                        return []
                    }
                }))
            })
        } else {
            taskList.push(this.callSearchDesignDocs(query, designDocName, sort).then(result => {
                if (result && result['rows'] && result['rows'].length > 0) {
                    let formulaOrRollupDocId = [];
                    result['rows'].forEach(element => {
                        element = element['doc']['data']
                        const makePrimaryObjectDocId = objectName + "_2_" + element['reference_id'];
                        formulaOrRollupDocId.push(makePrimaryObjectDocId);
                    });
                    return formulaOrRollupDocId
                } else {
                    return []
                }
            }))
        }
        return Promise.all(taskList).then(result => {
            return Promise.resolve(lodash.flattenDeep(result));
        }).catch(error => {
            // return this.catchBlockError(error);
            return Promise.resolve([]);
        });
    }

    private catchBlockError(error) {
        console.log("Error", error);
        return Promise.resolve({
            status: this.failed,
            message: error.message,
            docs: []
        })
    }

    callSearchDesignDocs(query: string, designDocName: string, sort: string, response?) {
        let postParam = {}
        let responseInfo = {
            "rows": [],
            "bookmark": ""
        }
        if (response) {
            postParam = {
                "q": query,
                "include_docs": true,
                "limit": this.queryBatchLimit,
                "bookmark": response['bookmark'],
                "sort": sort
            }
            responseInfo['rows'] = response['rows']
        } else {
            postParam = {
                "q": query,
                "include_docs": true,
                "limit": this.queryBatchLimit,
                "sort": sort
            }
        }
        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.formulaDbConfiguration)
      
        return new Promise(resolve => {
            const url = this.formulaDbConfiguration.remoteDbUrl + this.formulaDbConfiguration.configuration.databaseName
                + "/_design/" + designDocName + "/_search/" + designDocName;
            this.httpClient.post(url, postParam, headerstring).toPromise()
                .then(res => {
                    const jsonObj = res
                    if (responseInfo['rows'].length === jsonObj['total_rows']) {
                        Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                        return resolve(responseInfo)
                    } else {
                        Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                        responseInfo['bookmark'] = jsonObj['bookmark']
                        return resolve(this.callSearchDesignDocs(query, designDocName, sort, responseInfo));
                    }
                }, error => {
                    console.log('error==>' + error)
                    return resolve({ 'status': this.failed, 'message': 'Server error. Please contact admin.' })
                })
        })
    }
    private setDocDefaultValuesInSysAttributes(doc, type) {
        const date = new Date();
        const timestamp = date.getTime();

     
          
            if (!doc.id) {
                doc['sys_attributes'] = {}
                doc['sys_attributes'].createdby = this.appUtilityObj.userId;
                doc['sys_attributes'].createdon = timestamp;
                doc.type = type;
                const guid = this.guidGenerate(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                doc['sys_attributes'].guid = guid;

                // Default column value insert
                if (!doc['sys_attributes']['display_name'] || doc['sys_attributes']['display_name'] === '') {
                    doc['sys_attributes'].display_name = type;
                }
            }
            doc['sys_attributes'].lastmodifiedon = timestamp;
            // doc['sync_flag'] = 'C';
            doc['sys_attributes'].lastmodifiedby = this.appUtilityObj.userId;
            doc['sys_attributes'].org_id = this.appUtilityObj.orgId;
        

        return doc;
    }
    // Record association bulk docs save
 saveUserAssignmentDocs(doc) {

    var resultJSON = {
        "status": "",
        "message": "",
        "successRecords": [],
        "failureRecords": []
    }

    if (!navigator.onLine) {
        resultJSON['status'] = this.failed
        resultJSON['message'] = this.internetErrorMessage
        return resultJSON
    }
    var bulkDoc = [];

    // let associateFieldKeys = Object.keys(doc)
    // associateFieldKeys.forEach(associateFieldKey => {
        for (var i = 0; i < doc.length; i++) {
            const copieddoc = JSON.parse(JSON.stringify(doc[i]));
            const updatedDoc = this.setDocDefaultValuesInSysAttributes(copieddoc, copieddoc['type']);
            if (updatedDoc['sys_attributes'].createdby && updatedDoc['sys_attributes'].lastmodifiedby) {
                const reldoc = {};
                const id = updatedDoc.id || uuid().toUpperCase();
                delete updatedDoc.id;
               // const relid = this.db.rel.makeDocID({ 'type': copieddoc['type'], 'id': id });
               const relid = copieddoc['type'] + '_2_' + id
                reldoc['_id'] = relid;
                if (updatedDoc['rev']) {
                    reldoc['_rev'] = updatedDoc['rev'];
                    delete updatedDoc['rev'];
                }
                reldoc['data'] = updatedDoc;
                bulkDoc.push(reldoc);
            } else {
                resultJSON['status'] = this.failed
                resultJSON['message'] = 'Invalid user id'
                return resultJSON
            }
        }
//     })


    return this.db.validatingBulkDocs(bulkDoc).then(res => {
       

        if (res && res.constructor === Array && res.length > 0) {
            var successRecordsArray = [];
            var failureRecordsArray = [];

            res.forEach(element => {
                if (element['ok']) {
                    successRecordsArray.push(element)
                } else {
                    failureRecordsArray.push(element)
                }
            });


            resultJSON['successRecords'] = successRecordsArray
            resultJSON['failureRecords'] = failureRecordsArray

            if (successRecordsArray.length > 0 && failureRecordsArray.length > 0) {
                resultJSON['status'] = this.partialSuccess
                resultJSON['message'] = "Records saved partially"
            } else if (successRecordsArray.length > 0) {
                resultJSON['status'] = this.success
                resultJSON['message'] = "Records saved successfully"
            } else {
                resultJSON['status'] = this.failed
                resultJSON['message'] = "Failed to save records"
            }

            return resultJSON

        } else {
            resultJSON['status'] = this.failed
            resultJSON['message'] = "Failed to save records"
            return resultJSON
        }

        // [
        //  Success Response    
        //     {
        //         "ok": true,
        //         "id": "pfm139273_2_A12E5877-F544-4C1A-930E-0D06EB62CEA9",
        //         "rev": "1-06df5e9168567e01a9565552039d8f8f"
        //     },
        //  Failure Response
        //     {
        //         error: true
        //         id: "pfm139273_2_042D74F6-7BCB-432F-82A6-24F051DFB562"
        //         message: "Document update conflict"
        //         name: "conflict"
        //         status: 409
        //     }
        // ]
    }).catch(error => {
        resultJSON['status'] = this.failed
        resultJSON['message'] = error.message
        return resultJSON
    });
}
    // Record association bulk docs save
    saveBulkAssociationDocs(doc) {

        var resultJSON = {
            "status": "",
            "message": "",
            "successRecords": [],
            "failureRecords": []
        }

        if (!navigator.onLine) {
            resultJSON['status'] = this.failed
            resultJSON['message'] = this.internetErrorMessage
            return resultJSON
        }
        var bulkDoc = [];

        let associateFieldKeys = Object.keys(doc)
        associateFieldKeys.forEach(associateFieldKey => {
            for (var i = 0; i < doc[associateFieldKey].length; i++) {
                const copieddoc = JSON.parse(JSON.stringify(doc[associateFieldKey][i]));
                const updatedDoc = this.setDocDefaultValues(copieddoc, copieddoc['type']);
                if (updatedDoc['sys_attributes'].createdby && updatedDoc['sys_attributes'].lastmodifiedby) {
                    const reldoc = {};
                    const id = updatedDoc.id || uuid().toUpperCase();
                    delete updatedDoc.id;
                    // const relid = this.db.rel.makeDocID({ 'type': copieddoc['type'], 'id': id });
                    const relid = copieddoc['type'] + '_2_' + id
                    reldoc['_id'] = relid;
                    if (updatedDoc['rev']) {
                        reldoc['_rev'] = updatedDoc['rev'];
                        delete updatedDoc['rev'];
                    }
                    reldoc['data'] = updatedDoc;
                    bulkDoc.push(reldoc);
                }else {
                    resultJSON['status'] = this.failed
                    resultJSON['message'] = 'Invalid user id'
                    return resultJSON
                }
            }
        })


        return this.db.validatingBulkDocs(bulkDoc).then(res => {
          

            if (res && res.constructor === Array && res.length > 0) {
                var successRecordsArray = [];
                var failureRecordsArray = [];

                res.forEach(element => {
                    if (element['ok']) {
                        successRecordsArray.push(element)
                    } else {
                        failureRecordsArray.push(element)
                    }
                });

                resultJSON['successRecords'] = successRecordsArray
                resultJSON['failureRecords'] = failureRecordsArray

                if (successRecordsArray.length > 0 && failureRecordsArray.length > 0) {
                    resultJSON['status'] = this.partialSuccess
                    resultJSON['message'] = "Records saved partially"
                } else if (successRecordsArray.length > 0) {
                    resultJSON['status'] = this.success
                    resultJSON['message'] = "Records saved successfully"
                } else {
                    resultJSON['status'] = this.failed
                    resultJSON['message'] = "Failed to save records"
                }

                return resultJSON

            } else {
                resultJSON['status'] = this.failed
                resultJSON['message'] = "Failed to save records"
                return resultJSON
            }

            // [
            //  Success Response    
            //     {
            //         "ok": true,
            //         "id": "pfm139273_2_A12E5877-F544-4C1A-930E-0D06EB62CEA9",
            //         "rev": "1-06df5e9168567e01a9565552039d8f8f"
            //     },
            //  Failure Response
            //     {
            //         error: true
            //         id: "pfm139273_2_042D74F6-7BCB-432F-82A6-24F051DFB562"
            //         message: "Document update conflict"
            //         name: "conflict"
            //         status: 409
            //     }
            // ]this
        }).catch(error => {
            resultJSON['status'] = this.failed
            resultJSON['message'] = error.message
            return resultJSON
        });
    }

    // Set default info in doc
    private setDocDefaultValues(doc, type) {
        const date = new Date();
        const timestamp = date.getTime();

        if (doc.hasOwnProperty('association_id') && doc.hasOwnProperty('association_object_id') && doc.hasOwnProperty('reference_id')
            && doc.hasOwnProperty('reference_object_id')) {
            if (!doc.id) {
                doc['sys_attributes'] = {}
                doc['sys_attributes'].createdby = this.appUtilityObj.userId;
                doc['sys_attributes'].createdon = timestamp;
                doc.type = type;
                const guid = this.guidGenerate(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                doc['sys_attributes'].guid = guid;

                // Default column value insert
                if (!doc['sys_attributes']['display_name'] || doc['sys_attributes']['display_name'] === '') {
                    doc['sys_attributes'].display_name = type;
                }
            }
            doc['sys_attributes'].lastmodifiedon = timestamp;
            // doc['sync_flag'] = 'C';
            doc['sys_attributes'].lastmodifiedby = this.appUtilityObj.userId;
            doc['sys_attributes'].org_id = this.appUtilityObj.orgId;
        }

        return doc;
    }

    // Generate GUID
    private guidGenerate(length, chars) {
        let result = '';
        for (let i = length; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    fetchAssociation(viewDocument, queryOptions) {

        return this.db.query(viewDocument, queryOptions)
            .then(result => {
                if (result['rows'] && result['rows'].length > 0) {
                    this.response['status'] = this.success
                    this.response['message'] = "Data Fetched"
                    this.response['records'] = result['rows']
                    return Promise.resolve(this.response);
                } else {
                    this.response['status'] = this.success
                    this.response['message'] = "No Data Fetched"
                    this.response['records'] = []
                    return Promise.resolve(this.response);
                }
            }).catch(err => {
                this.response['status'] = this.failed
                this.response['message'] = "No Data Fetched"
                this.response['records'] = []
                return Promise.resolve(this.response);
            })
    }
    fetchUserAssignment(viewDocument, queryOptions) {

        return this.db.query(viewDocument, queryOptions)
            .then(result => {
                if (result['rows'] && result['rows'].length > 0) {
                    this.response['status'] = this.success
                    this.response['message'] = "Data Fetched"
                    this.response['records'] = result['rows']
                    return Promise.resolve(this.response);
                } else {
                    this.response['status'] = this.success
                    this.response['message'] = "No Data Fetched"
                    this.response['records'] = []
                    return Promise.resolve(this.response);
                }
            }).catch(err => {
                this.response['status'] = this.failed
                this.response['message'] = "No Data Fetched"
                this.response['records'] = []
                return Promise.resolve(this.response);
            })
    }
    fetchRelationshipDataOfAssociation(recordId) {
        return this.db.allDocs({ include_docs: true, keys: recordId }).then(res => {
            return res
        }).catch(err => {
            console.log("Error", err)
        })
    }
}
