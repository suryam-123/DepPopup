import { Injectable } from '@angular/core';
import { dbConfiguration } from './dbConfiguration';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import PouchRelation from 'relational-pouch';
import { appUtility } from '../utils/appUtility';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import pouchdbValidation from 'pouchdb-validation';
// import update from 'pouchdb-update'
import { v4 as uuid} from 'uuid';
import * as lodash from 'lodash';
import { formulaCouchDbProvider } from './formulaCouchDbProvider';
import { appConstant } from '../utils/appConstant';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
import { cspfmExecutionCouchDbProvider } from 'src/core/db/cspfmExecutionCouchDbProvider';
import { ObjectHierarchy } from '../models/cspfmObjectHierarchy.type';
import { objectTableMapping } from '../pfmmapping/objectTableMapping';
import { appConfiguration } from '../utils/appConfiguration';
import { formulaDbConfiguration } from './formulaDbConfiguration';
import { HttpClient } from '@angular/common/http';
import { cspfmObservableListenerUtils } from '../dynapageutils/cspfmObservableListenerUtils';
import { attachmentCouchDbProvider } from './attachmentCouchDbProvider';

export interface AttachmentInfo {
    filename: string;
    data: any;
    content_type: string;
}
export interface AdditionalInfo {
    parentInfo?: {
        parentType: any;
        parentId: any;
    }
    id?: any;
    bookmark?: string;
    response?: Array<any>;
}

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

/* export interface QueryBatchInfo {
    skip: number;
} */

export interface QueryBatchInfo {
    userId?: number;
    type: string;
    docId: any;
    key?: string;
}

PouchDB.plugin(PouchFind);
PouchDB.plugin(PouchRelation); // Change pouch utils class in relational npm first time after install npm
PouchDB.plugin(pouchdbValidation);
// PouchDB.plugin(update);
@Injectable()
export class couchdbProvider {
    private db;
    public keysToSchema = {};
    public tableStructure = {};
    public remote = '';
    private last_seq = 'now';
    private dbChanges;
    private response = { 'status': '', 'message': '', 'records': [] };
    private responseForBatch = { 'status': '', 'message': '', 'records': [], bookmark: '' };

    private failed = 'FAILED';
    private success = 'SUCCESS';
    private partialSuccess = 'PARTIAL SUCCESS'
    private internetErrorMessage = 'No internet';

    private childreference = 'childreference';
    private masterandlookupreference = 'masterandlookupreference';
    private batchLimit = 2000;
    private queryBatchLimit = 200;
    public batchIdLimit = 1000;

    constructor(private appUtilityObj: appUtility, private network: Network, private appPreferences: AppPreferences,private httpClient :HttpClient,
        public metaCouchDbProvider: cspfmMetaCouchDbProvider, public executionCouchDbProvider: cspfmExecutionCouchDbProvider, public dbConfiguration: dbConfiguration, public formulaCouchDbProvider: formulaCouchDbProvider,
        public objTableMapping: objectTableMapping, public appConfig: appConfiguration, public formulaDbConfig: formulaDbConfiguration, private observableListenerUtils: cspfmObservableListenerUtils,public attachmentCouchDbObject: attachmentCouchDbProvider) {
        this.initializePouchDb();
    }

    networkWithConnectivity() {
        if (this.dbConfiguration.configuration.couchDBSyncEnabledObjectSelectors.length > 0) {
            if (this.dbChanges) {
                this.dbChanges.cancel();
            }
            this.startChangeListner(this.last_seq);
        }
    }

    networkWithOutConnectivity() {
        if (this.dbConfiguration.configuration.couchDBSyncEnabledObjectSelectors.length > 0) {
            if (this.dbChanges) {
                this.dbChanges.cancel();
            }
        }
    }
    /****************************************************
       Initialize pouchdb and setup db schema
  *****************************************************/
    initializePouchDb() {
        //  if (navigator.onLine) {
        this.remote = this.dbConfiguration.remoteDbUrl + this.dbConfiguration.configuration.databaseName;
        // couch authentication
        this.db = new PouchDB(this.remote, {
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.dbConfiguration)
        });

        this.setSchema()
        // } else {
        //     console.log('Pouchdb initialize failure!! Network not available.');
        // }
    }

    //Http call for search data in direct couch
    public httpCallSearchDocument(searchText) {
        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.dbConfiguration)
        return new Promise(resolve => {
            const postParam = {
                "queries": [
                    {
                        "start_key": searchText,
                        "end_key": searchText + "\uFFFF",
                        "update": "true"
                    }
                ]
            };
            const url = this.dbConfiguration.remoteDbUrl + this.dbConfiguration.configuration.databaseName + "_search/_design/gettitlewisedocs/_view/ttitlewisedocs";
            this.httpClient.post(url, postParam, headerstring).toPromise()
                .then(res => {
                    const jsonObj = res
                    const response = jsonObj['results'][0]['rows']
                    return resolve({ 'status': 'Success', 'Message': '', 'records': response })
                }, error => {
                    console.log('error==>' + error)
                    return resolve({ 'status': 'Error', 'Message': 'Server error. Please contact admin.' })
                })
        })
    }

    // Set relationship schema
    setSchema() {
        this.db.setSchema(this.dbConfiguration.configuration.schema);
        this.dbConfiguration.configuration.schema.forEach(type => {
            this.keysToSchema[type.singular] = type;
        });
        // Table structure for initialize object
        this.tableStructure = this.dbConfiguration.configuration.tableStructure;
    }


    // Get plural form of table name
    getPluralName(type) {
        const schema = this.keysToSchema[type];
        return schema.plural;
    }

    // Get relation detail for particular table
    getSchemaRelations(type) {
        const schema = this.keysToSchema[type];
        if (schema.relations) {
            if (Object.keys(schema.relations).length) {
                return schema.relations;
            }
        } else {
            return null;
        }
    }

    /****************************************************
                      change listener
   *****************************************************/
    public startChangeListner(last_seq) {
        const finalSelector = { '$or': this.dbConfiguration.configuration.couchDBSyncEnabledObjectSelectors };
        this.dbChanges = this.db.changes({ live: true, continuous: true, since: last_seq, timeout: 30000, selector: finalSelector, include_docs: true, attachments: true })
            .on('change', this.onDatabaseChange)
            .on('error', (err) => {
                console.log("mobile platform couchdb change listener error :", err);
                this.appUtilityObj.couchListenerStopped('mobilePlatformCouchdb', this)
            });
    }

    private onDatabaseChange = (change) => {
        const parsedId = this.db.rel.parseDocID(change.id);
        change['dataProvider'] = 'CouchDB';
        if (change['deleted']) {
            if (change['doc']['data']) {
                change['doc']['data']['type'] = parsedId.type;
            } else {
                change['doc']['data'] = { 'type': parsedId.type }
            }
        }
        if(parsedId.type === 'pfmstaticreport'){
            this.eventsPublish(change, [""+change['doc']['data']['layoutId']])
        } else if(parsedId.type.includes('userAssignment')){
            this.observableListenerUtils.emit(parsedId['type']+change['doc']["data"]['reference_id'], change)
        }else{
            let publishLayaoutIds = this.appUtilityObj.getEventSubscriptionlayoutIds("CouchDB", parsedId.type)
            this.eventsPublish(change, publishLayaoutIds)
        }
    }

    eventsPublish(change, publishLayaoutIds) {
        if (publishLayaoutIds == undefined || publishLayaoutIds == null || publishLayaoutIds == "") {
            return
        }
        publishLayaoutIds.forEach(element => {
            this.observableListenerUtils.emit(element, change);
        });
    }

    /****************************************************
    Document update in direct couch via design document
   *****************************************************/

    // Update documents

    docUpdateViaDesignDoc(designDocName: string, updateName: string, id: string, queryJson: Object, rev: string) {
        let query = '?' + this.queryMaking(queryJson);
        const date = new Date();
        const timestamp = date.getTime();
        query = query + 'lastmodifiedon=' + timestamp + '&';
        query = query + 'lastmodifiedby=' + this.appUtilityObj.userId + '&';
        const path = designDocName + '/' + updateName + '/' + id + query + 'rev=' + rev;
        return this.db.update(path).then(res => {
            const response = JSON.parse(res['body']);
            if (response['Status'] === 'Conflict') {
                return this.docUpdateViaDesignDoc(designDocName, updateName, id, queryJson, response['newRev']).then(result => {
                    return result;
                });
            } else {
                return JSON.parse(res['body']);
            }

        }).catch(error => {
            console.log('error==>' + error);
            return { 'Status': 'Error', 'Message': 'Server error. Please contact admin.' };
        });
    }

    // Query making for Update design doc
    private queryMaking(queryJson) {
        let query = '';
        const keys = Object.keys(queryJson);
        keys.forEach(element => {
            query = query + element + '=' + queryJson[element] + '&';
        });
        return query;
    }

    /****************************************************
              Public API for save document
    *****************************************************/

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
                if (updatedDoc.createdby && updatedDoc.lastmodifiedby) {
                    const reldoc = {};
                    const id = updatedDoc.id || uuid().toUpperCase();
                    delete updatedDoc.id;
                    const relid = this.db.rel.makeDocID({ 'type': copieddoc['type'], 'id': id });
                    reldoc['_id'] = relid;
                    if (updatedDoc['rev']) {
                        reldoc['_rev'] = updatedDoc['rev'];
                        delete updatedDoc['rev'];
                    }
                    reldoc['data'] = updatedDoc;
                    bulkDoc.push(reldoc);
                }
                else {
                    resultJSON['status'] = this.failed
                    resultJSON['message'] = 'Invalid user id'
                    return resultJSON
                }
            }
        })


        return this.db.validatingBulkDocs(bulkDoc).then(res => {
            
            if (res && res.constructor == Array && res.length > 0) {
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
    fetchUserAssignment(viewDocument, keysArray) {
        var queryOptions = {
            keys: keysArray,
            include_docs: true
        };

        if (this.appConfig.configuration.userAssignmentDbConfigInfo['userAssignmentConfigDbName'] == this.formulaDbConfig.configuration.databaseName) {
            return this.formulaCouchDbProvider.fetchUserAssignment(viewDocument, queryOptions)
        } else {
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
                    const relid = this.db.rel.makeDocID({ 'type': copieddoc['type'], 'id': id });
                    reldoc['_id'] = relid;
                    if (updatedDoc['rev']) {
                        reldoc['_rev'] = updatedDoc['rev'];
                        delete updatedDoc['rev'];
                    }
                    reldoc['data'] = updatedDoc;
                    bulkDoc.push(reldoc);
                }
                else {
                    resultJSON['status'] = this.failed
                    resultJSON['message'] = 'Invalid user id'
                    return resultJSON
                }
            }
   //     })


        return this.db.validatingBulkDocs(bulkDoc).then(res => {
       

            if (res && res.constructor == Array && res.length > 0) {
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

    // Save Multiple document
    saveBulkDocs(type, docs, saveSuccessRecords, saveFailedRecords) {
        
        var resultJSON = {
            "status": "",
            "message": "",
            "successRecords": [],
            "failureRecords": []
        }
        var conflictRecords = []
        var revChangedRecords = []
        if (!navigator.onLine) {
            resultJSON['status'] = this.failed
            resultJSON['message'] = this.internetErrorMessage
            return resultJSON
        }
        var bulkDoc = [];
        for (var i = 0; i < docs.length; i++) {
            const copieddoc = JSON.parse(JSON.stringify(docs[i]));
            const relRemovedDoc = this.removeRelationshipDocs(copieddoc, type);
            const updatedDoc = this.setDocDefaultValues(relRemovedDoc, type);
            if (updatedDoc.createdby && updatedDoc.lastmodifiedby) {
                const reldoc = {};
                const id = updatedDoc.id || uuid().toUpperCase();
                delete updatedDoc.id;
                const relid = this.db.rel.makeDocID({ 'type': type, 'id': id });
                reldoc['_id'] = relid;
                if (updatedDoc['rev']) {
                    reldoc['_rev'] = updatedDoc['rev'];
                    delete updatedDoc['rev'];
                }
                reldoc['data'] = updatedDoc;
                bulkDoc.push(reldoc);
            }
            else {
                resultJSON['status'] = this.failed
                resultJSON['message'] = 'Invalid user id'
                return resultJSON
            }
        }
        return this.db.validatingBulkDocs(bulkDoc).then(res => {
            if (res && res.constructor == Array && res.length > 0) {

                res.forEach(async element => {
                    if(element['ok']) {
                        saveSuccessRecords.push(element)
                    } else if(element['status'] == 409){
                        conflictRecords.push(element['id'])
                    }
                    else {
                        saveFailedRecords.push(element)
                    }
                });

                if(conflictRecords.length > 0){
                    return this.fetchDocsWithDocIdsForConflictRecords(conflictRecords).then(res =>{
                        if(res['status'] === 'SUCCESS'){
                            res['records'].forEach(element => {
                                const id = element['id']
                                const record = lodash.filter(docs, document => document.id === id);
                                revChangedRecords.push(this.replaceResponseWithUpdatedObject(record[0], element));
                            });
                            return this.saveBulkDocs(type, revChangedRecords, saveSuccessRecords, saveFailedRecords)
                        }
                    })
                }
                resultJSON['successRecords'] = saveSuccessRecords
                resultJSON['failureRecords'] = saveFailedRecords
                
                if (saveSuccessRecords.length > 0 && saveFailedRecords.length > 0) {
                    resultJSON['status'] = this.partialSuccess
                    resultJSON['message'] = "Records saved partially"
                } else if (saveSuccessRecords.length > 0) {
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

    // Save single document
    save(type, doc) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] };
            return Promise.resolve(this.response);
        }

        const copieddoc = JSON.parse(JSON.stringify(doc));
        const relRemovedDoc = this.removeRelationshipDocs(copieddoc, type);
        const updatedDoc = this.setDocDefaultValues(relRemovedDoc, type);
        if (updatedDoc.createdby && updatedDoc.lastmodifiedby) {
            const reldoc = {};
            const id = updatedDoc.id || uuid().toUpperCase();
            delete updatedDoc.id;
            const relid = this.db.rel.makeDocID({ 'type': type, 'id': id });
            reldoc['_id'] = relid;
            if (updatedDoc['rev']) {
                reldoc['_rev'] = updatedDoc['rev'];
                delete updatedDoc['rev'];
            }
            reldoc['data'] = updatedDoc;
            return this.db.validatingPut(reldoc).then(res => {
                if (res['ok']) {
                    const idVal = this.convertRelIdToDocId(res.id);
                    const rev = res['rev'];
                    return { status: this.success, id: idVal, rev: rev };
                }
                return { status: this.failed, message: 'Save failed' };
            }).catch(error => {
                if (error.status === 409) {
                    console.log('Conflict');
                    return this.fetchDocWithoutRelationshipByTypeAndId(updatedDoc.type, id).then(response => {
                        if (response.status === 'SUCCESS') {
                            const document = this.replaceResponseWithUpdatedObject(updatedDoc, response.records[0]);
                            return this.save(updatedDoc.type, document);
                        } else {
                            return Promise.resolve({ status: this.failed, message: error.message });
                        }
                    });
                } else {
                    if(error.message.validationFailureSet){
                        return Promise.resolve({ status: this.failed, message: error.message, validationFailureSet: error.message.validationFailureSet, objectId: type, validationFailure : "couchdbValidationFailure" });
                    }else{
                        return Promise.resolve({ status: this.failed, message: error.message});
                    }
                }
            });
        } else {
            return Promise.resolve({ status: this.failed, message: 'Invalid user id' });
        }
    }
    replaceResponseWithUpdatedObject(updatedDoc, response) {
        const doc = updatedDoc;
        doc.id = response.id;
        doc.rev = response.rev;
        return doc;
    }


    // Save doc with attachments
    saveDocWithAttachments(type, doc, attachments: [AttachmentInfo]) {
        const updatedDoc = this.setDocDefaultValues(doc, type);
        const dependentFetching = [];
        attachments.forEach(element => {
            dependentFetching.push(this.db.rel.putAttachment(type, updatedDoc, element.filename,
                element.data, element.content_type).then(res => {
                    return res;
                }));
        });
        return Promise.all(dependentFetching).then(allresult => {
            return { status: this.success, message: '', records: allresult };
        }).catch(error => {
            return { status: this.failed, message: error.message };
        });

    }


    /****************************************************
              Supporting methods for save document
   *****************************************************/

    // Remove relationship docs
    private removeRelationshipDocs(doc, type) {
        const relations = this.getSchemaRelations(type);
        if (relations) {
            Object.keys(relations).forEach(field => {
                const relationDef = relations[field];
                const relationType = Object.keys(relationDef)[0];
                if (relationType === 'belongsTo') {
                    const objectType = relationDef[relationType].type;
                    Object.keys(doc).forEach(key => {
                        if (key.startsWith(objectType + '_') || key === objectType) {
                            if (doc[key] && typeof doc[key].id !== 'undefined') {
                                doc[key] = doc[key].id;
                            }
                        }
                    });
                } else {
                    const relatedType = relationDef[relationType];
                    if (relatedType.options && relatedType.options.queryInverse && doc[field]) {
                        delete doc[field];
                    }
                }
            });
        }

        let relRemoveddoc = {};
        if (doc['attachments']) {
            relRemoveddoc['_attachments'] = doc.attachments;
            delete doc.attachments;
        }
        relRemoveddoc = doc;
        return relRemoveddoc;
    }

    // Set default info in doc
    private setDocDefaultValues(doc, type) {
        const date = new Date();
        const timestamp = date.getTime();
        if (!doc.rev) {
            doc.createdby = this.appUtilityObj.userId;
            doc.createdon = timestamp;
            doc.type = type;
            const guid = this.guidGenerate(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            doc.guid = guid;

            // Default column value insert
            if (!doc['display_name'] || doc['display_name'] === '') {
                doc.display_name = type;
            }
        }
        doc.lastmodifiedon = timestamp;
        doc['sync_flag'] = 'C';
        doc.lastmodifiedby = this.appUtilityObj.userId;
        doc.org_id = this.appUtilityObj.orgId;
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

    // Fetch single table docs without relationship
    fetchDocsWithoutRelationshipByType(type, referencedetail?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] };
            return Promise.resolve(this.response);
        }

        if (referencedetail !== undefined) {
            return this.fetchDataWithReference(referencedetail);
        }

        const options = {};
        const selector = {};

        selector['data.type'] = type;
        options['selector'] = selector;
        options['limit'] = this.batchLimit;

        // if (bookmark != undefined && bookmark != '') {
        //     options['bookmark'] = bookmark
        // }

        const isSingleBatchFetch = false;
        return this.findAPIforBatch(options, isSingleBatchFetch).then(res => {
            this.responseForBatch = {
                status: this.success,
                message: '',
                records: res['docs'],
                bookmark: res['bookmark']
            };
            return this.responseForBatch;
        }).catch(error => {
            this.response = { status: this.failed, message: error.message, records: [] };
            return Promise.resolve(this.response);
        });
    }

    private fetch(options, isSingleBatchFetch, arrayList?) {
        return this.db.find(options).then(result => {
            const resultArray = [];
            result['docs'].forEach(element => {
                resultArray.push(this.convertRelDocToNormalDoc(element));
            });

            if (arrayList !== undefined) {
                Array.prototype.push.apply(arrayList, resultArray);
                result['docs'] = arrayList;
            } else {
                result['docs'] = resultArray;
            }

            if (!isSingleBatchFetch && resultArray.length > 0 && result['bookmark'] && result['bookmark'] !== '') {
                options['bookmark'] = result['bookmark'];
                return this.findAPIforBatch(options, isSingleBatchFetch, result['docs']);
            } else {
                return Promise.resolve(result);
            }

        }).catch(error => {
            return Promise.resolve(error.message);
        });

    }


    private findAPIforBatch(options, isSingleBatchFetch, arrayList?) {
        return this.fetch(options, isSingleBatchFetch, arrayList);
    }


    // Fetch single table docs with relationship
    fetchDocsWithRelationshipByType(type, withchild: boolean, referencedetail?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] };
            return Promise.resolve(this.response);
        }


        if (referencedetail !== undefined) {
            return this.fetchDataWithReference(referencedetail);
        }

        const options = {};
        const selector = {};

        selector['data.type'] = type;
        options['selector'] = selector;
        options['limit'] = this.batchLimit;

        const isSingleBatchFetch = false;

        const validateStatus = this.validateReferenceDetails(referencedetail);
        if (validateStatus.status === this.success) {
            return this.findAPIforBatch(options, isSingleBatchFetch).then(res => {

                const pluralName = this.getPluralName(type);

                const response = { status: this.success, message: '', [pluralName]: res['docs'], bookmark: res['bookmark'] };
                return this.getChildObject(type, response, withchild, null, res['bookmark']);

            }).catch(error => {
                this.response = { status: this.failed, message: error.message, records: [] };
                return Promise.resolve(this.response);
            });
        } else {
            return Promise.resolve(validateStatus);
        }
    }



    // Fetch single table docs by parent doc id with relationship
    fetchChildDocsWithRelationshipByParentTypeAndId
        (child_type, parent_type, parent_id, withchild: boolean, referencedetail?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] };
            return Promise.resolve(this.response);
        }

        // if (isSingleBatchFetch == undefined) {
        //     isSingleBatchFetch = false;
        // }


        if (referencedetail !== undefined) {
            const additionalInfo = {};
            additionalInfo['parentType'] = parent_type;
            additionalInfo['parentId'] = parent_id;
            return this.fetchDataWithReference(referencedetail, additionalInfo);
        }


        const options = {};
        const selector = {};

        selector['data.type'] = child_type;
        selector['data.' + parent_type] = parent_id;
        options['selector'] = selector;
        options['limit'] = this.batchLimit;

        // if (bookmark != undefined && bookmark != '') {
        //     options['bookmark'] = bookmark
        // }

        const isSingleBatchFetch = false;
        const objectList = Object.keys(this.dbConfiguration.configuration.tableStructure);
        if (objectList.indexOf(parent_type) < 0) {
            this.response = { status: this.failed, message: 'Invalid parent type', records: [] };
            return Promise.resolve(this.response);
        } else {
            const validateStatus = this.validateReferenceDetails(referencedetail);
            if (validateStatus.status === this.success) {

                return this.findAPIforBatch(options, isSingleBatchFetch).then(res => {

                    const pluralName = this.getPluralName(child_type);
                    const response = { status: this.success, message: '', [pluralName]: res['docs'], bookmark: res['bookmark'] };
                    return this.getChildObject(child_type, response, withchild, referencedetail, res['bookmark']);

                }).catch(error => {
                    this.response = { status: this.failed, message: error.message, records: [] };
                    return Promise.resolve(this.response);
                });

            } else {
                return Promise.resolve(validateStatus);
            }
        }
    }

    findAPIwithOptions(options) {

        return this.db.find(options).then(result => {
            let resultArray = [];
            result['docs'].forEach(element => {
                resultArray.push(this.convertRelDocToNormalDoc(element))
            });
            return resultArray
        }).catch(err => {
            console.log("find err" + err)
            return "Find error"
        });
    }

    // Fetch single table docs by parent doc id without relationship
    fetchDocsWithoutRelationshipByParentTypeAndId(childtype, parent_type, parent_id, referencedetail?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] };
            return Promise.resolve(this.response);
        }

        if (referencedetail !== undefined) {
            const additionalInfo = {};
            additionalInfo['parentType'] = parent_type;
            additionalInfo['parentId'] = parent_id;
            this.fetchDataWithReference(referencedetail, additionalInfo);
        }

        const options = {};
        const selector = {};

        selector['data.type'] = childtype;
        selector['data.' + parent_type] = parent_id;
        options['selector'] = selector;
        options['limit'] = this.batchLimit;

        // if (bookmark != undefined && bookmark != '') {
        //     options['bookmark'] = bookmark
        // }

        const isSingleBatchFetch = false;
        const objectList = Object.keys(this.dbConfiguration.configuration.tableStructure);
        if (objectList.indexOf(parent_type) < 0) {
            this.response = { status: this.failed, message: 'Invalid parent type', records: [] };
            return Promise.resolve(this.response);
        } else {
            return this.findAPIforBatch(options, isSingleBatchFetch).then(resAPI => {
                this.responseForBatch = {
                    status: this.success,
                    message: '',
                    records: resAPI['docs'],
                    bookmark: resAPI['bookmark']
                };
                return this.responseForBatch;
            }).catch(error => {
                this.response = { status: this.failed, message: error.message, records: [] };
                return Promise.resolve(this.response);
            });
        }
    }


    // Find docs using find options plugin with relationship (If you get selected fields, you must pass _id field )
    fetchDocsWithRelationshipUsingFindOption
        (options, withchild: boolean, referencedetail?, isSingleBatchFetch?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] };
            return Promise.resolve(this.response);
        }

        if (isSingleBatchFetch === undefined) {
            isSingleBatchFetch = false;
        }

        const validateStatus = this.validateReferenceDetails(referencedetail);
        if (validateStatus.status === this.success) {
            if (options.selector) {
                let selector;
                try {
                    selector = JSON.parse(JSON.stringify(options.selector));
                    if (Object.keys(selector).indexOf('data.type') > -1) {
                        return this.findDocsWithSelector(options, isSingleBatchFetch).then(res => {
                            // if (res.constructor === [].constructor) {
                            if (res !== undefined) {
                                const resultJson = {};
                                const type = selector['data.type'];
                                const pluralNameForParent = this.getPluralName(type);
                                // resultJson[pluralNameForParent] = res

                                const response = {
                                    status: this.success, message: '', [pluralNameForParent]: res['docs'],
                                    bookmark: res['bookmark']
                                };
                                return this.getChildObject(type, response, withchild, referencedetail, res['bookmark']);
                                // return this.checkChildObjectsForFetch(type, res, referencedetail).then(res => {
                                // if (withchild) {
                                //     return this.checkChildObjectsForFetch(type, resultJson, referencedetail).then(res => {
                                //         return this.checkLookupObjectsForFetch(type, res, referencedetail).then(result => {
                                //             this.response = { status: this.success, message: '', records: result }
                                //             return this.response
                                //         })
                                //     })
                                // }
                                // else {
                                //     return this. (type, resultJson, referencedetail).then(result => {
                                //         this.response = { status: this.success, message: '', records: result }
                                //         return this.response
                                //     })
                                // }
                            } else {
                                this.response = {
                                    status: this.failed, message: typeof res === 'string' ? res : 'Fetching failed',
                                    records: []
                                };
                                return Promise.resolve(this.response);
                            }

                        }).catch(error => {
                            this.response = { status: this.failed, message: error.message, records: [] };
                            return Promise.resolve(this.response);
                        });
                    } else {

                        this.response = { status: this.failed, message: 'data.type is missing!!', records: [] };
                        return Promise.resolve(this.response);

                    }

                } catch (error) {
                    this.response = { status: this.failed, message: error.message, records: [] };
                    return Promise.resolve(this.response);
                }

            } else {
                this.response = { status: this.failed, message: 'Invalid selector', records: [] };
                return Promise.resolve(this.response);
            }

        } else {
            return Promise.resolve(validateStatus);
        }

    }


    fetchDocsWithoutRelationshipUsingFindOption(options, isSingleBatchFetch?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] };
            return Promise.resolve(this.response);
        }


        if (isSingleBatchFetch === undefined) {
            isSingleBatchFetch = false;
        }

        if (options.selector) {
            let selector;
            try {
                selector = JSON.parse(JSON.stringify(options.selector));
                if (Object.keys(selector).indexOf('data.type') > -1) {
                    return this.findAPI(options, isSingleBatchFetch).then(result => {
                        this.responseForBatch = {
                            status: this.success,
                            message: '',
                            records: result['docs'],
                            bookmark: result['bookmark']
                        };
                        return this.responseForBatch;
                    }).catch(error => {
                        console.log('find err' + JSON.stringify(error));
                    });
                } else {
                    return Promise.resolve('data.type is missing!!');

                }

            } catch (error) {
                return Promise.resolve('Invalid selector');
            }
        } else {
            return Promise.resolve('Invalid selector');
        }
    }

    private getChildObject(type, res, withchild, referencedetail?, bookmark?) {
        if (withchild) {
            return this.checkChildObjectsForFetch(type, res, referencedetail).then(response => {
                return this.checkLookupObjectsForFetch(type, response, referencedetail).then(result => {
                    this.responseForBatch = { status: this.success, message: '', records: result, bookmark: bookmark };
                    return Promise.resolve(this.responseForBatch);
                });
            });
        } else {
            return this.checkLookupObjectsForFetch(type, res, referencedetail).then(result => {
                // this.response = { status: this.success, message: '', records: result }
                this.responseForBatch = { status: this.success, message: '', records: result, bookmark: bookmark };

                return Promise.resolve(this.responseForBatch);
            });
        }
    }


    // Fetch single doc by doc id without relationship
    fetchDocWithoutRelationshipByTypeAndId(type, id, referencedetail?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] };
            return Promise.resolve(this.response);
        }

        if (referencedetail !== undefined) {
            const additionalInfo = {};
            additionalInfo['id'] = id;
            return this.fetchDataWithReference(referencedetail);
        }

        const options = {};
        const selector = {};

        selector['data.type'] = type;
        selector['_id'] = type + '_2_' + id;
        options['selector'] = selector;
        options['limit'] = this.batchLimit;

        // if (bookmark != undefined && bookmark != '') {
        // options['bookmark'] = bookmark
        // }

        const isSingleBatchFetch = false;
        return this.findAPIforBatch(options, isSingleBatchFetch).then(batchResponse => {
            this.responseForBatch = {
                status: this.success,
                message: '',
                records: batchResponse['docs'],
                bookmark: batchResponse['bookmark']
            };
            return this.responseForBatch;
        }).catch(error => {
            this.response = { status: this.failed, message: error.message, records: [] };
            return Promise.resolve(this.response);
        });
    }

    /****************************************************
           Supporting methods for data fetching
   *****************************************************/

    // Convert attachment to base64
    private convertAttachmentToBase64(res) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onloadend = function () {
                resolve(reader.result);
            };
        });

    }

    // Check depentent docs for particular table
    private checkChildObjectsForFetch(type, res, referencedetail?) {
        const relations = this.getSchemaRelations(type);
        if (relations) {
            return this.fetchChildDocForMultipleDocs(res, type, referencedetail).then(result => {
                const response = {};
                const pluralName = this.getPluralName(type);
                response[pluralName] = result;
                return response;
            });
        } else {
            return Promise.resolve(res);
        }
    }

    // Create list with all fetched child objects
    private fetchChildDocForMultipleDocs(res, type, referencedetail?) {
        const pluralName = this.getPluralName(type);
        const dependentFetching = [];
        res[pluralName].forEach(element => {
            dependentFetching.push(this.fetchAllChildDocsForSingleDoc(type, element, referencedetail).then(doc => {
                return doc;
            }));
        });
        return Promise.all(dependentFetching).then(allresult => {
            return allresult;
        });
    }


    // Fetch all lookup objects
    private fetchAllChildDocsForSingleDoc(type, element, referencedetail?) {
        const relations = this.getSchemaRelations(type);
        const childFetchingTaskList = [];
        Object.keys(relations).forEach(field => {
            const relationDef = relations[field];
            const relationType = Object.keys(relationDef)[0];
            if (relationType === 'hasMany') {
                const objectType = relationDef[relationType].type;
                const selector = {};
                selector['data.type'] = objectType;
                selector['data.' + type] = element.id;
                if (referencedetail) {
                    if (referencedetail[this.childreference] && referencedetail[this.childreference].includes(objectType)) {
                        childFetchingTaskList.push(
                            this.fetchChildDocs(objectType, type, element.id).then(doc => {
                                Object.assign(element, doc);
                            }));
                    }
                } else {
                    childFetchingTaskList.push(
                        this.fetchChildDocs(objectType, type, element.id).then(doc => {
                            Object.assign(element, doc);
                        }));
                }
            }
        });

        return Promise.all(childFetchingTaskList).then(result => {
            return element;
        });
    }

    // Fetch child docs
    private fetchChildDocs(childtype, parent_type, parent_id) {
        return this.db.rel.findHasMany(childtype + '_only', parent_type, parent_id).then(res => {
            // let options = {}
            // let selector = {}

            // selector['data.type'] = childtype
            // selector['data.' + parent_type] = parent_id
            // options['selector'] = selector
            // options['limit'] = this.batchLimit

            // return this.findDocsWithSelector(options, false).then(res => {

            // var pluralNameForParent = this.getPluralName(childtype)
            // resultJson[pluralNameForParent] = res
            // let response = { status: this.success, message: '', [pluralNameForParent]: res['docs'], bookmark: res['bookmark'] }
            const relations = this.getSchemaRelations(childtype);
            const lookupFetchingList = [];
            Object.keys(relations).forEach(field => {
                const relationDef = relations[field];
                const relationType = Object.keys(relationDef)[0];
                if (relationType === 'belongsTo') {
                    const objectType = relationDef[relationType].type;
                    if (objectType !== parent_type) {
                        lookupFetchingList.push(objectType);
                    }
                }
            });
            if (lookupFetchingList.length > 0) {
                let lookUpReferenceDetail = {};
                lookUpReferenceDetail = { 'masterandlookupreference': lookupFetchingList };
                return this.checkLookupObjectsForFetch(childtype, res, lookUpReferenceDetail).then(result => {
                    const response = {};
                    const pluralName = this.getPluralName(childtype);
                    response[pluralName] = result;
                    return response;
                });
            } else {
                return res;
            }
        });
    }


    // Check depentent docs for particular table
    private checkLookupObjectsForFetch(type, res, referencedetail?) {
        const relations = this.getSchemaRelations(type);
        if (relations) {
            return this.fetchLookupDocForMultipleDocs(res, type, referencedetail).then(result => {
                return result;
            });
        } else {
            const pluralName = this.getPluralName(type);
            const result = res[pluralName];
            return Promise.resolve(result);
        }
    }

    // Create list with all fetched lookup objects
    private fetchLookupDocForMultipleDocs(res, type, referencedetail?) {
        const pluralName = this.getPluralName(type);
        const dependentFetching = [];
        res[pluralName].forEach(element => {
            dependentFetching.push(this.fetchAllLookupDocForSingleDoc(type, element, referencedetail).then(doc => {
                return doc;
            }));
        });
        return Promise.all(dependentFetching).then(allresult => {
            return allresult;
        });
    }
    // Fetch all lookup objects
    private fetchAllLookupDocForSingleDoc(type, element, referencedetail?) {
        const relations = this.getSchemaRelations(type);
        const lookupFetchingTaskList = [];
        Object.keys(relations).forEach(field => {
            const relationDef = relations[field];
            const relationType = Object.keys(relationDef)[0];
            if (relationType === 'belongsTo') {
                const objectType = relationDef[relationType].type;

                if (referencedetail) {
                    if (referencedetail[this.masterandlookupreference] &&
                        referencedetail[this.masterandlookupreference].includes(objectType)) {
                        Object.keys(element).forEach(key => {
                            if (key.startsWith(objectType + '_') || key === objectType) {
                                lookupFetchingTaskList.push(
                                    this.fetchLookupDocByTypeAndId(objectType, element[key]).then(doc => {
                                        element[key] = doc;
                                    }).catch(error => {
                                        return this.fetchAllLookupDocForSingleDocCatchBlock(element, error);

                                    }));
                            }
                        });
                    }
                } else {
                    Object.keys(element).forEach(Objectkey => {
                        if (Objectkey.startsWith(objectType + '_') || Objectkey === objectType) {
                            lookupFetchingTaskList.push(
                                this.fetchLookupDocByTypeAndId(objectType, element[Objectkey]).then(doc => {
                                    element[Objectkey] = doc;
                                }).catch(error => {
                                    return this.fetchAllLookupDocForSingleDocCatchBlock(element, error);
                                }));
                        }
                    });
                }
            }
        });

        return Promise.all(lookupFetchingTaskList).then(result => {
            return element;
        });
    }
    // Fetch Data usign Record Ids
    fetchDocsWithDocIds(recordId) {
        return this.db.allDocs({ include_docs: true, keys: recordId }).then(res => {
            if (res["rows"].length > 0) {
                const data = this.convertRelDocToNormalDoc(res["rows"][0]["doc"]);
                return Promise.resolve({
                    response: data,
                    status: "SUCCESS"
                });
            } else {
                return Promise.resolve({
                    response: {},
                    status: "Failed"
                });
            }
        });
    }

    // Fetch Data usign Record Ids For Conflict Records in Bulk Document save
    fetchDocsWithDocIdsForConflictRecords(recordId) {
        let resultArray = [];
        return this.db.allDocs({ include_docs: true, keys: recordId }).then(res => { 
            if (res["rows"].length > 0) {
                for(let i = 0; i < res["rows"].length; i++){
                    resultArray.push(this.convertRelDocToNormalDoc(res["rows"][i]["doc"]))
                }
                return Promise.resolve({
                    records: resultArray,
                    status: "SUCCESS"
                });
            } else {
                return Promise.resolve({
                    records: [],
                    status: "Failed"
                });
            }
        });
    }

    private fetchAllLookupDocForSingleDocCatchBlock(element, error) {
        console.log('Lookup fetching failed for this doc ' + element['type']
            + '_2_' + element['id'] + '  Error:' + JSON.stringify(error));
        return Promise.resolve(element);

    }

    // Fetch lookup doc
    private fetchLookupDocByTypeAndId(type, id) {
        const rel_id = this.db.rel.makeDocID({ 'type': type, 'id': id });
        return this.db.get(rel_id).then(doc => {
            return this.convertRelDocToNormalDoc(doc);
        });
    }

    // Find docs by selector
    private findDocsWithSelector(options, isSingleBatchFetch, arrayList?) {
        if (options.fields) {

            if (options.fields.indexOf('_id') > -1) {
                return this.checkSortFields(options, isSingleBatchFetch, arrayList).then(res => {
                    return res;
                });
            } else {
                return Promise.resolve('Fields must contains _id');
            }
        } else {
            return this.checkSortFields(options, isSingleBatchFetch, arrayList).then(res => {
                return res;
            });
        }
    }

    // Check sort by fields
    private checkSortFields(options, isSingleBatchFetch, arrayList?) {
        if (options.sort) {
            const sortFields = options.sort;
            const indexfields = [];
            sortFields.forEach(element => {
                indexfields.push(this.isJson(JSON.stringify(element)));
            });
            return this.indexCreation(indexfields).then(res => {
                return this.findAPI(options, isSingleBatchFetch, arrayList);
            });
        } else {
            return this.indexCreation(['data.type']).then(res => {
                return this.findAPI(options, isSingleBatchFetch, arrayList);
            });
        }
    }

    // Fetch docs using find query
    private findAPI(options, isSingleBatchFetch, arrayList?) {
        return this.fetch(options, isSingleBatchFetch, arrayList);

    }

    // Index creation
    private indexCreation(fields) {
        return this.db.createIndex({
            index: {
                fields: fields
            }
        }).then(result => {
            return result;
            // yo, a result
        }).catch(error => {
            // ouch, an error
            return Promise.resolve(error.message);
        });
    }

    private isJson(str) {
        const obj = JSON.parse(str);
        const objectConstructor = {}.constructor;
        const stringConstructor = 'test'.constructor;
        if (obj.constructor === stringConstructor) {
            return obj;
        }
        if (obj.constructor === objectConstructor) {
            return Object.keys(obj)[0];
        }

    }

    // Convert relationship id to normal doc id
    private convertRelIdToDocId(relid) {
        const parsedId = this.db.rel.parseDocID(relid);
        return parsedId.id;
    }

    // Convert reldoc to normal doc
    convertRelDocToNormalDoc(doc) {
        const parsedId = this.db.rel.parseDocID(doc._id);
        doc.data.id = parsedId.id;
        doc.data.rev = doc._rev;
        if (doc._attachments) {
            doc.data.attachments = doc._attachments;
        }
        return doc.data;
    }

    // Validate requested refernce detail
    private validateReferenceDetails(referencedetail) {

        if (!referencedetail) {
            return { status: this.success, message: '', records: [] };
        }

        const referenceKeys = Object.keys(referencedetail);
        let referenceStatus = 'Valid';

        // Check valid reference details added or not
        referenceKeys.forEach(element => {
            if (element !== this.masterandlookupreference && element !== this.childreference) {
                referenceStatus = 'Invalid';
            }
        });

        // Check valid reference tables added or not
        if (referenceStatus === 'Valid') {
            const objectList = Object.keys(this.dbConfiguration.configuration.tableStructure);
            let childRefStatus, masterandlookupRefStatus;
            if (referencedetail[this.childreference]) {
                childRefStatus = referencedetail[this.childreference].length > 0 ? 'Valid' : 'Invalid';
                referencedetail[this.childreference].forEach(element => {
                    if (objectList.indexOf(element) < 0) {
                        childRefStatus = 'Invalid';

                    }
                });
                if (childRefStatus === 'Invalid') {
                    return { status: this.failed, message: 'Invalid child reference', records: [] };
                }
            }
            if (referencedetail[this.masterandlookupreference]) {
                masterandlookupRefStatus = referencedetail[this.masterandlookupreference].length > 0 ? 'Valid' : 'Invalid';
                referencedetail[this.masterandlookupreference].forEach(element => {
                    if (objectList.indexOf(element) < 0) {
                        masterandlookupRefStatus = 'Invalid';
                    }
                });
                if (masterandlookupRefStatus === 'Invalid') {
                    return { status: this.failed, message: 'Invalid master and lookup reference', records: [] };
                }
            }
            return { status: this.success, message: '', records: [] };
        } else {
            return { status: this.failed, message: 'Invalid reference', records: [] };
        }

    }

    ///////////////////// Sugumar ////////////////////////

    // Fetch single doc by doc id with relationship
    fetchDocWithRelationshipByTypeAndId(type, id, withchild: boolean, referencedetail?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] };
            return Promise.resolve(this.response);
        }



        if (referencedetail !== undefined) {
            const additionalInfo = {};
            additionalInfo['id'] = id;
            return this.fetchDataWithReference(referencedetail, additionalInfo);
        }

        const options = {};
        const selector = {};

        selector['data.type'] = type;
        selector['_id'] = type + '_2_' + id;
        options['selector'] = selector;
        options['limit'] = this.batchLimit;

        const isSingleBatchFetch = false;
        return this.findAPIforBatch(options, isSingleBatchFetch).then(res => {

            const pluralName = this.getPluralName(type);
            const response = { status: this.success, message: '', [pluralName]: res['docs'], bookmark: res['bookmark'] };
            return this.getChildObject(type, response, withchild, referencedetail, res['bookmark']);

        }).catch(error => {
            this.response = { status: this.failed, message: error.message, records: [] };
            return Promise.resolve(this.response);
        });


    }

    public fetchDataWithReference(referenceDetail, layoutDataRestrictionSet?, additionalInfo?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] }
            return Promise.resolve(this.response)
        }

        const additionalInfo1 = {
            parentInfo: {
                parentType: undefined,
                parentId: undefined
            }, id: "",
            bookmark: "",
            response: []
        };
        if (additionalInfo !== undefined) {
            additionalInfo1.parentInfo.parentType = additionalInfo['parentType'];
            additionalInfo1.parentInfo.parentId = additionalInfo['parentId'];
            if (additionalInfo['id'] !== undefined && additionalInfo['id'] !== '') {
                additionalInfo1.id = additionalInfo['id'];
            }
        }
        return this.recursiveFetch(referenceDetail, layoutDataRestrictionSet, additionalInfo1).then(res => {
            const response = {
                status: this.success,
                message: '',
                records: res['docs'],
                bookmark: res['bookmark']
            };
            return Promise.resolve(response)
        }).catch(error => {
            return this.errorBlock(error);
        });
    }

    private errorBlock(error) {
        console.log("Error", error);
        return Promise.resolve({
            status: this.failed,
            message: error.message, records: [],
            bookmark: ''
        })

    }



    private recursiveFetch(referenceDetail, layoutDataRestrictionSet, additionalInfo?: AdditionalInfo) {
        // const objectName = "pfm" + referenceDetail['objectId']
        let objectName = ""
        if (referenceDetail['objectId'].includes('pfm')) {
            objectName = referenceDetail['objectId']
        } else {
            objectName = "pfm" + referenceDetail['objectId']
        }

        const objectOptions = referenceDetail['options']
        const formulaObject = referenceDetail['formulaField']
        let options = {}
        const optionsFieldsArray = [];
        if (objectOptions === undefined) {
            const selector = {}

            selector['data.type'] = objectName
            options['selector'] = selector
            optionsFieldsArray.push('data.type')
            if (additionalInfo !== undefined) {
                if (additionalInfo.id !== undefined && additionalInfo.id !== '') {
                    const stringConstructor = "test".constructor;
                    const objectConstructor = {}.constructor;
                    if (additionalInfo.id.constructor === stringConstructor) {
                        selector['_id'] = objectName + "_2_" + additionalInfo.id;
                        optionsFieldsArray.push('_id')
                    }
                    else if (additionalInfo.id.constructor === objectConstructor) {
                        selector['_id'] = additionalInfo.id;
                        optionsFieldsArray.push('_id');
                    }
                }

                if (additionalInfo.parentInfo !== undefined
                    && additionalInfo.parentInfo.parentType !== undefined
                    && additionalInfo.parentInfo.parentId !== undefined
                    && additionalInfo.parentInfo.parentType !== ""
                    && additionalInfo.parentInfo.parentId !== "") {

                    selector['data.' + additionalInfo.parentInfo.parentType] = additionalInfo.parentInfo.parentId
                    optionsFieldsArray.push('data.' + additionalInfo.parentInfo.parentType)
                }
            }
        } else {
            options = objectOptions;
            optionsFieldsArray.push('data.type')
        }

        if (layoutDataRestrictionSet !== undefined && layoutDataRestrictionSet.length > 0) {
            // if (this.appUtilityObj.setDataRestrictionByUsers(layoutDataRestrictionSet, referenceDetail) !== undefined) {
            this.appUtilityObj.setDataRestrictionByRestrictionType(referenceDetail, options, layoutDataRestrictionSet);
        }

        options['limit'] = this.batchLimit
        if (additionalInfo.bookmark !== undefined || additionalInfo.bookmark !== "") {
            options['bookmark'] = additionalInfo.bookmark;
        }

        return this.indexCreation(optionsFieldsArray).then(indexRes => {
            options['use_index'] = indexRes['id'];

            return this.fetchData(options).then(parentRes => {
                const lookupObjects = this.getChild(referenceDetail['childObject'], "LOOKUP");
                const parentDataIndex = {};

                const resultArray = [];
                const idArray = [];
                const lookupIds = [];
                const lookupTypes = []
                const formulaQuery = [];
                const lookupIdWithType = {};
                const lookupIdDataMapping = {};
                for (let i = 0; i < parentRes['docs'].length; i++) {
                    const data = this.convertRelDocToNormalDoc(parentRes['docs'][i]);
                    parentDataIndex[data['id']] = i
                    lookupObjects.forEach(element => {
                        // const lookupObjectName = "pfm" + element['objectId'];
                        // const fieldId = lookupObjectName + "_" + element['fieldId'];
                        let fieldId = ""
                        let lookupObjectName = ""
                        if (isNaN(element['fieldId'])) {
                            lookupObjectName = element['objectId'];
                            fieldId = element['fieldId'];
                        } else {
                            lookupObjectName = "pfm" + element['objectId'];
                            fieldId = lookupObjectName + "_" + element['fieldId'];
                        }
                        const lookupId = data[fieldId];
                        if (lookupId !== undefined && lookupId !== '') {
                            if (lookupTypes.indexOf(lookupObjectName) === -1) {
                                lookupTypes.push(lookupObjectName)
                            }
                            if (lookupIdWithType[lookupObjectName] === undefined) {
                                lookupIdWithType[lookupObjectName] = []
                            }
                            if (lookupIdWithType[lookupObjectName].indexOf(lookupObjectName + "_2_" + lookupId) === -1) {
                                lookupIdWithType[lookupObjectName].push(lookupObjectName + "_2_" + lookupId)
                            }

                            if (lookupIdDataMapping[lookupId] === undefined) {
                                lookupIdDataMapping[lookupId] = []
                            }
                            lookupIdDataMapping[lookupId].push({ index: i, lookupField: fieldId })
                        }
                    })
                    if (formulaObject) {
                        formulaQuery.push(objectName + 'formula' + data["id"])
                    }
                    if (referenceDetail['childObject'] !== undefined && referenceDetail['childObject'].length > 0) {
                        referenceDetail['childObject'].forEach(element => {
                            if (element['objectType'] !== 'LOOKUP') {
                                // data[this.getPluralName("pfm" + element['objectId'])] = []
                                if (element['objectId'].includes('pfm')) {
                                    data[this.getPluralName(element['objectId'])] = []
                                } else {
                                    data[this.getPluralName("pfm" + element['objectId'])] = []
                                }
                            }
                        })
                    }
                    resultArray.push(data)
                    idArray.push(data['id'])
                }


                parentRes['docs'] = resultArray;
                const parentIdJson = {
                    "$in": idArray
                }


                const childJsonArray = referenceDetail['childObject'];
                const taskList = [];

                if (lookupTypes.length > 0) {
                    for (let i = 0; i < lookupTypes.length; i++) {
                        taskList.push(this.fetchLookups(lookupTypes[i], { "$in": lookupIdWithType[lookupTypes[i]] }, lookupIdWithType[lookupTypes[i]].length));
                    }
                }

                for (let i = 0; i < childJsonArray.length; i++) {
                    if (childJsonArray[i]['objectType'] !== 'LOOKUP') {
                        taskList.push(this.getChildObjectData(childJsonArray[i], objectName, parentIdJson, parentRes, parentDataIndex, layoutDataRestrictionSet));
                    }
                }

                //Fetches formula values from formula DB
                if (formulaQuery.length > 0) {
                    taskList.push(this.formulaCouchDbProvider.fetchformulaValue(formulaQuery).then(result => {
                        if (result && result['status'] && result['records'] && result['status'] == this.success && result['records'].length > 0) {
                            result = result['records']
                            result.forEach(element => {
                                element = element['doc']['data']
                                var index = parentDataIndex[element['reference_id']];
                                formulaObject.forEach(fieldName => {
                                    resultArray[index][fieldName['fieldName'] + appConstant['customFieldSuffix']['formula']] = element[fieldName['fieldName']]
                                })
                            });
                            return result
                        } else {
                            return
                        }
                    }))
                }

                return Promise.all(taskList).then(allRes => {

                    if (lookupTypes.length > 0) {
                        for (let i = 0; i < lookupTypes.length; i++) {
                            allRes[i]['docs'].forEach(element => {
                                const data = this.convertRelDocToNormalDoc(element);
                                const indexArray = lookupIdDataMapping[data['id']];
                                indexArray.forEach(indexJson => {
                                    parentRes['docs'][indexJson['index']][indexJson['lookupField']] = data;
                                });
                            });
                        }
                    }

                    if (parentRes['docs'].length < this.batchLimit) {
                        Array.prototype.push.apply(parentRes['docs'], additionalInfo['response'])
                        return Promise.resolve(parentRes)
                    } else {
                        const additionalInfoNextBatch = {
                            parentInfo: {
                                parentType: undefined,
                                parentId: undefined
                            }, id: "",
                            bookmark: "",
                            response: []
                        };
                        if (additionalInfo !== undefined) {
                            if (additionalInfo.parentInfo !== undefined) {
                                additionalInfoNextBatch.parentInfo.parentId = additionalInfo.parentInfo.parentId;
                                additionalInfoNextBatch.parentInfo.parentType = additionalInfo.parentInfo.parentType;
                            }
                            if (additionalInfo['response'] !== undefined) {
                                Array.prototype.push.apply(additionalInfoNextBatch['response'], additionalInfo['response'])
                            }
                        }

                        if (parentRes !== undefined) {
                            additionalInfoNextBatch.bookmark = parentRes['bookmark']
                            Array.prototype.push.apply(additionalInfoNextBatch['response'], parentRes['docs'])
                        }

                        return this.recursiveFetch(referenceDetail, layoutDataRestrictionSet, additionalInfoNextBatch).then(res => {
                            return res;
                        });
                    }
                })
            }).catch(error => {
                return this.catchBlockError(error);
            });
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



    fetchLookups(lookupType, lookupId, batchLimit: number) {
        const options = {};
        const selector = {};
        const optionsFieldsArray = [];
        selector['data.type'] = lookupType;
        selector['_id'] = lookupId;
        options['selector'] = selector;
        options['limit'] = batchLimit
        optionsFieldsArray.push('data.type');
        optionsFieldsArray.push('_id');
        return this.indexCreation(optionsFieldsArray).then(res => {
            options['use_index'] = res['id'];
            return this.fetchData(options).then(res => {
                return res;
            })
        })
    }

    getParentObjectRecords(dataObject, parentObjectReference: ReferenceDetail, parentObjectType,isLazyLoadEnabled: boolean = false , listenerName: string = '' ,mainResult: Array<any> = []) {


        var queryOptions = {
            key: this.getDocId(parentObjectType, dataObject[parentObjectType]),
            include_docs: true
        };
        return this.executeAllDocs(queryOptions, parentObjectReference,isLazyLoadEnabled, listenerName,mainResult).then(res => {
            if (res && res.constructor == Array) {
                dataObject[this.getPluralName(parentObjectType)] = res;
                return dataObject;
            } else {
                dataObject[this.getPluralName(parentObjectType)] = [];
                return dataObject;
            }
        }).catch(err => {
            console.log("err ====>", err);
            return Promise.resolve({
                status: "Error",
                Message: "Server error. Please contact admin."
            });
        });

    }

    queryHeadersData(headerObjectReferenceDetails, keys, isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = []){
        if (headerObjectReferenceDetails['includeFields'] || headerObjectReferenceDetails['includeFields'] === undefined ) {
            var queryOptions = {
                keys: keys,
                include_docs: true
            };
            return this.executeAllDocs(queryOptions, headerObjectReferenceDetails,isLazyLoadEnabled, listenerName,mainResult);
        } else {
            return  this.fetchRequiredFieldsOnly(headerObjectReferenceDetails,keys,[],  '_id',isLazyLoadEnabled, listenerName,mainResult);                     
        }
    }

    queryHeaderData(headerObjectReferenceDetails, keys, headerDataMapping, dataArray, isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = []) {
            const uniqueKeys = lodash.uniq(keys);   
            return this.queryHeadersData(headerObjectReferenceDetails, uniqueKeys,isLazyLoadEnabled, listenerName,mainResult).then(res => {
            var objectType = this.getObjectType(headerObjectReferenceDetails);
            res.forEach(element => {
                const headerMappingIndex = headerDataMapping[element['id']]
                headerMappingIndex.forEach(headerMappingIndexValue => {
                    dataArray[headerMappingIndexValue][objectType] = element;
                })
            });
            this.emitFetchedData(isLazyLoadEnabled, listenerName, mainResult, 'updated')
            return dataArray;
        });  
    }

    getChildObjectData(childObjectReference, objectName, parentIdJson, parentRes, parentDataIndex, layoutDataRestrictionSet) {
        // const childObjectName = "pfm" + childObjectReference['objectId']
        let childObjectName = ""
        if (childObjectReference['objectId'].includes('pfm')) {
            childObjectName = childObjectReference['objectId']
        } else {
            childObjectName = "pfm" + childObjectReference['objectId']
        }
        const additionalInfo = {
            parentInfo: {
                parentType: undefined,
                parentId: undefined
            }, id: "",
            bookmark: "",
            response: []
        };
        additionalInfo.parentInfo.parentType = objectName;
        additionalInfo.parentInfo.parentId = parentIdJson;
        return this.recursiveFetch(childObjectReference, layoutDataRestrictionSet, additionalInfo).then(childRes => {
            if (childRes !== undefined && childRes['docs'] !== undefined) {
                childRes['docs'].forEach(element => {
                    if (parentRes['docs'][parentDataIndex[element[objectName]]][this.getPluralName(childObjectName)] === undefined) {
                        parentRes['docs'][parentDataIndex[element[objectName]]][this.getPluralName(childObjectName)] = []
                    }
                    parentRes['docs'][parentDataIndex[element[objectName]]][this.getPluralName(childObjectName)].push(element)
                });
            }
            return Promise.resolve(parentRes)
        });
    }

    private fetchData(options) {
        return this.db.find(options).then(result => {
            return Promise.resolve(result)
        }).catch(error => {
            return Promise.resolve({
                status: this.failed,
                message: error.message,
                docs: []
            })
        });
    }

    public fetchDataWithReferenceReverse(referenceDetail, queryJson, additionalInfo?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] }
            return Promise.resolve(this.response)
        }

        const additionalInfo1 = {
            parentInfo: {
                parentType: undefined,
                parentId: undefined
            }, id: "",
            bookmark: "",
            response: []
        };
        if (additionalInfo !== undefined) {
            additionalInfo1.parentInfo.parentType = additionalInfo['parentType'];
            additionalInfo1.parentInfo.parentId = additionalInfo['parentId'];
            if (additionalInfo['id'] !== undefined && additionalInfo['id'] !== '') {
                additionalInfo1.id = additionalInfo['id'];
            }
        }
        var finalArray = [];
        return this.recursiveFetchReverse(referenceDetail, queryJson, finalArray, additionalInfo1).then(res => {
            const response = {
                status: this.success,
                message: '',
                ids: finalArray,
                records: res['docs'],
                bookmark: res['bookmark']
            };
            return Promise.resolve(response)
        }).catch(error => {
            return this.errorBlock(error);

        });
    }

    private recursiveFetchReverse(referenceDetail, queryJson, finalArray, additionalInfo?: AdditionalInfo) {
        // const objectName = "pfm" + referenceDetail['objectId']
        let objectName = ""
        if (referenceDetail['objectId'].includes('pfm')) {
            objectName = referenceDetail['objectId']
        } else {
            objectName = "pfm" + referenceDetail['objectId']
        }
        referenceDetail['options'] = queryJson[objectName]

        const objectOptions = referenceDetail['options']
        let options = {}
        const optionsFieldsArray = [];
        if (objectOptions === undefined) {
            const selector = {}

            selector['data.type'] = objectName
            options['selector'] = selector
            optionsFieldsArray.push('data.type')
            if (additionalInfo !== undefined) {
                if (additionalInfo.id !== undefined && additionalInfo.id !== '') {
                    const stringConstructor = "test".constructor;
                    const objectConstructor = {}.constructor;
                    if (additionalInfo.id.constructor === stringConstructor) {
                        selector['_id'] = objectName + "_2_" + additionalInfo.id;
                        optionsFieldsArray.push('_id')
                    }
                    else if (additionalInfo.id.constructor === objectConstructor) {
                        selector['_id'] = additionalInfo.id;
                        optionsFieldsArray.push('_id');
                    }
                }

                if (additionalInfo.parentInfo !== undefined
                    && additionalInfo.parentInfo.parentType !== undefined
                    && additionalInfo.parentInfo.parentId !== undefined
                    && additionalInfo.parentInfo.parentType !== ""
                    && additionalInfo.parentInfo.parentId !== "") {

                    selector['data.' + additionalInfo.parentInfo.parentType] = additionalInfo.parentInfo.parentId
                    optionsFieldsArray.push('data.' + additionalInfo.parentInfo.parentType)
                }
            }
        } else {
            options = objectOptions;
            optionsFieldsArray.push('data.type')
            if (additionalInfo !== undefined) {
                if (additionalInfo.id !== undefined && additionalInfo.id !== '') {
                    const stringConstructor = "test".constructor;
                    const objectConstructor = {}.constructor;
                    if (additionalInfo.id.constructor === stringConstructor) {
                        options['selector']['_id'] = objectName + "_2_" + additionalInfo.id;
                    }
                    else if (additionalInfo.id.constructor === objectConstructor) {
                        options['selector']['_id'] = additionalInfo.id;
                    }
                }

                if (additionalInfo.parentInfo !== undefined
                    && additionalInfo.parentInfo.parentType !== undefined
                    && additionalInfo.parentInfo.parentId !== undefined
                    && additionalInfo.parentInfo.parentType !== ""
                    && additionalInfo.parentInfo.parentId !== "") {

                    options['selector']['data.' + additionalInfo.parentInfo.parentType] = additionalInfo.parentInfo.parentId
                }
            }
        }

        options['limit'] = this.batchLimit
        if (additionalInfo.bookmark !== undefined || additionalInfo.bookmark !== "") {
            options['bookmark'] = additionalInfo.bookmark;
        }

        return this.indexCreation(optionsFieldsArray).then(indexRes => {
            options['use_index'] = indexRes['id'];
            return this.fetchData(options).then(parentRes => {
                const resultArray = [];
                const idArray = [];
                for (let i = 0; i < parentRes['docs'].length; i++) {
                    const data = this.convertRelDocToNormalDoc(parentRes['docs'][i]);
                    resultArray.push(data)
                    if (referenceDetail['objectType'] && referenceDetail['objectType'].toUpperCase() == "LOOKUP") {
                        idArray.push(data['id'])
                    } else if (referenceDetail['relationShipType']
                        && (referenceDetail['relationShipType'].toUpperCase() == "ONE_TO_ONE"
                            || referenceDetail['relationShipType'].toUpperCase() == "ONE_TO_MANY")) {
                        // var key = "pfm" + referenceDetail['childObject'][0]['objectId'];
                        let key = "";
                        if (referenceDetail['childObject'][0]['objectId'].includes('pfm')) {
                            key = referenceDetail['childObject'][0]['objectId']
                        } else {
                            key = "pfm" + referenceDetail['childObject'][0]['objectId'];
                        }
                        if (data[key]) {
                            idArray.push(key + "_2_" + data[key])
                        } else {
                            console.log("Couch objectName :", objectName, "key :", key, "Id : ", objectName + "_2_" + data['id']);
                        }
                        // taskList.push(this.getChildObjectDataReverse(childJsonArray[0], objectName, parentIdJson, parentRes));
                    }
                }
                const parentIdJson = {
                    "$in": idArray
                }
                parentRes['docs'] = resultArray;

                const childJsonArray = referenceDetail['childObject'];
                const taskList = [];

                if (childJsonArray.length > 0) {
                    if (referenceDetail['objectType'] && referenceDetail['objectType'].toUpperCase() == "LOOKUP") {
                        taskList.push(this.getChildObjectDataReverse(childJsonArray[0], objectName + "_" + referenceDetail['fieldId'], parentIdJson, parentRes, queryJson, finalArray));
                    } else if (referenceDetail['relationShipType']
                        && (referenceDetail['relationShipType'].toUpperCase() == "ONE_TO_ONE"
                            || referenceDetail['relationShipType'].toUpperCase() == "ONE_TO_MANY")) {
                        const additionalInfo = {
                            parentInfo: {
                                parentType: undefined,
                                parentId: undefined
                            }, id: {},
                            bookmark: "",
                            response: []
                        };
                        // additionalInfo.parentInfo.parentType = objectName;
                        // additionalInfo.parentInfo.parentId = parentIdJson;
                        additionalInfo.id = parentIdJson
                        taskList.push(this.recursiveFetchReverse(childJsonArray[0], queryJson, finalArray, additionalInfo).then(childRes => {
                            return Promise.resolve(childRes)
                        }));
                        // taskList.push(this.getChildObjectDataReverse(childJsonArray[0], objectName, parentIdJson, parentRes));
                    }
                    /* Pick before of primary object */
                    // if (childJsonArray[0]['childObject'].length > 0
                    //     && childJsonArray[0]['childObject'][0]['objectType']
                    //     && childJsonArray[0]['childObject'][0]['objectType'].toUpperCase() == 'PRIMARY') {
                    //     Array.prototype.push.apply(finalArray, resultArray)
                    // }

                    if (childJsonArray[0]['childObject'].length == 0) {
                        Array.prototype.push.apply(finalArray, resultArray)
                    }
                }

                // for (let i = 0; i < childJsonArray.length; i++) {
                //     if (childJsonArray[i]['objectType'] !== 'LOOKUP') {
                //         taskList.push(this.getChildObjectDataReverse(childJsonArray[i], objectName, parentIdJson, parentRes));
                //     }
                // }

                return Promise.all(taskList).then(allRes => {
                    if (parentRes['docs'].length < this.batchLimit) {

                        if (additionalInfo != undefined) {
                            Array.prototype.push.apply(parentRes['docs'], additionalInfo['response'])
                        }
                        // console.log("Object : ",objectName," flattenDeep : ",lodash.flattenDeep(allRes));

                        return Promise.resolve(parentRes)
                    } else {
                        const additionalInfoNextBatch = {
                            parentInfo: {
                                parentType: undefined,
                                parentId: undefined
                            }, id: "",
                            bookmark: "",
                            response: []
                        };
                        if (additionalInfo !== undefined) {
                            if (additionalInfo.parentInfo !== undefined) {
                                additionalInfoNextBatch.parentInfo.parentId = additionalInfo.parentInfo.parentId;
                                additionalInfoNextBatch.parentInfo.parentType = additionalInfo.parentInfo.parentType;
                            }
                            if (additionalInfo['response'] !== undefined) {
                                Array.prototype.push.apply(additionalInfoNextBatch['response'], additionalInfo['response'])
                            }
                        }

                        if (parentRes !== undefined) {
                            additionalInfoNextBatch.bookmark = parentRes['bookmark']
                            Array.prototype.push.apply(additionalInfoNextBatch['response'], parentRes['docs'])
                        }

                        return this.recursiveFetchReverse(referenceDetail, queryJson, finalArray, additionalInfoNextBatch).then(res => {
                            return res;
                        });
                    }
                })
            }).catch(error => {
                return this.catchBlockError(error);

            });
        });
    }

    // Fetch Primary record using search API
    public fetchDataWithReferenceUsingSearchAPI(referenceDetail, queryJson,isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = [], additionalInfo?) {

        if (!navigator.onLine) {
            this.response = { status: this.failed, message: this.internetErrorMessage, records: [] }
            return Promise.resolve(this.response)
        }

        const nextBachInfo = {
            parentInfo: {
                parentType: undefined,
                parentId: undefined
            }, id: "",
            response: []
        };
        if (additionalInfo !== undefined) {
            nextBachInfo.parentInfo.parentType = additionalInfo['parentType'];
            nextBachInfo.parentInfo.parentId = additionalInfo['parentId'];
            if (additionalInfo['id'] !== undefined && additionalInfo['id'] !== '') {
                nextBachInfo.id = additionalInfo['id'];
            }
        }
        var finalArray = [];
        return this.recursiveFetchUsingSearchAPI(referenceDetail, queryJson, finalArray,isLazyLoadEnabled, listenerName,mainResult, nextBachInfo).then(res => {
            const response = {
                status: this.success,
                message: '',
                ids: finalArray,
                records: res['records']
            };
            return Promise.resolve(response)
        }).catch(error => {
            console.log("Error", error);
            return Promise.resolve({
                status: this.failed,
                message: error.message,
                records: [],
            })
        });
    }

    private recursiveFetchUsingSearchAPI(referenceDetail, queryJson, finalArray,isLazyLoadEnabled: boolean = false, listenerName: string = '' ,mainResult: Array<any> = [], additionalInfo?: AdditionalInfo) {
        // const objectName = "pfm" + referenceDetail['objectId']
        let objectName = ""
        if (referenceDetail['objectId'].includes('pfm')) {
            objectName = referenceDetail['objectId']
        } else {
            objectName = "pfm" + referenceDetail['objectId']
        }
        const selectorCouchQuery = queryJson[objectName]

        let searchQuery = '';
        if (selectorCouchQuery === undefined) {

            searchQuery = "type : " + objectName
            if (additionalInfo !== undefined) {
                if (additionalInfo.id !== undefined && additionalInfo.id !== '') {
                    const stringConstructor = "test".constructor;
                    const objectConstructor = {}.constructor;
                    if (additionalInfo.id.constructor === stringConstructor) {
                        searchQuery = searchQuery + " AND _id : " + additionalInfo.id
                    }
                    else if (additionalInfo.id.constructor === objectConstructor) {
                        searchQuery = searchQuery + " AND _id : " + additionalInfo.id
                    }
                }

                if (additionalInfo.parentInfo !== undefined
                    && additionalInfo.parentInfo.parentType !== undefined
                    && additionalInfo.parentInfo.parentId !== undefined
                    && additionalInfo.parentInfo.parentType !== ""
                    && additionalInfo.parentInfo.parentId !== "") {
                    searchQuery = searchQuery + " AND " + additionalInfo.parentInfo.parentType + ":" + additionalInfo.parentInfo.parentId
                }
            }
        } else {
            searchQuery = selectorCouchQuery;
            if (additionalInfo !== undefined) {
                if (additionalInfo.id !== undefined && additionalInfo.id !== '') {
                    const stringConstructor = "test".constructor;
                    const objectConstructor = {}.constructor;
                    if (additionalInfo.id.constructor === stringConstructor) {
                        searchQuery = searchQuery + " AND _id : " + additionalInfo.id;
                    }
                    else if (additionalInfo.id.constructor === objectConstructor) {
                        searchQuery = searchQuery + " AND _id : " + additionalInfo.id;
                    }
                }

                if (additionalInfo.parentInfo !== undefined
                    && additionalInfo.parentInfo.parentType !== undefined
                    && additionalInfo.parentInfo.parentId !== undefined
                    && additionalInfo.parentInfo.parentType !== ""
                    && additionalInfo.parentInfo.parentId !== "") {
                    searchQuery = searchQuery + " AND " + additionalInfo.parentInfo.parentType + " : " + additionalInfo.parentInfo.parentId;
                }
            }
        }
        return this.fetchRecordsBySearchFilterPhrases(searchQuery, referenceDetail,isLazyLoadEnabled, listenerName,mainResult).then(parentRes => {
            const resultArray = [];
            const idArray = [];
            for (let i = 0; i < parentRes['records'].length; i++) {
                const data = parentRes['records'][i];
                resultArray.push(parentRes['records'][i])
                if (referenceDetail['objectType'] && referenceDetail['objectType'].toUpperCase() == "LOOKUP") {
                    idArray.push(data['id'])
                } else if (referenceDetail['relationShipType']
                    && (referenceDetail['relationShipType'].toUpperCase() == "ONE_TO_ONE"
                        || referenceDetail['relationShipType'].toUpperCase() == "ONE_TO_MANY")) {
                    // var key = "pfm" + referenceDetail['childObject'][0]['objectId'];
                    let key = "";
                    if (referenceDetail['childObject'][0]['objectId'].includes('pfm')) {
                        key = referenceDetail['childObject'][0]['objectId']
                    } else {
                        key = "pfm" + referenceDetail['childObject'][0]['objectId'];
                    }
                    if (data[key]) {
                        idArray.push(key + "_2_" + data[key])
                    } else {
                        console.log("Couch objectName :", objectName, "key :", key, "Id : ", objectName + "_2_" + data['id']);
                    }
                }
            }
            let parentIdJson = ''
            if (idArray.length > 0) {
                if (idArray.length === 1) {
                    parentIdJson = idArray[0]
                } else {
                    idArray.forEach(element => {
                        if (parentIdJson !== '') {
                            parentIdJson = parentIdJson + " OR " + element;
                        } else {
                            parentIdJson = parentIdJson + element;
                        }
                    })
                    parentIdJson = "( " + parentIdJson + " )"
                }
            }
            parentRes['records'] = resultArray;
            const childJsonArray = referenceDetail['childObject'];
            const taskList = [];
            if (childJsonArray.length > 0) {
                if (referenceDetail['objectType'] && referenceDetail['objectType'].toUpperCase() == "LOOKUP") {
                    taskList.push(this.getChildObjectDataReverse(childJsonArray[0], objectName + "_" + referenceDetail['fieldId'], parentIdJson, parentRes, queryJson, finalArray));
                } else if (referenceDetail['relationShipType']
                    && (referenceDetail['relationShipType'].toUpperCase() == "ONE_TO_ONE"
                        || referenceDetail['relationShipType'].toUpperCase() == "ONE_TO_MANY")) {
                    const additionalInfo = {
                        parentInfo: {
                            parentType: undefined,
                            parentId: undefined
                        }, id: {},
                        bookmark: "",
                        response: []
                    };
                    additionalInfo.id = parentIdJson
                    taskList.push(this.recursiveFetchUsingSearchAPI(childJsonArray[0], queryJson, finalArray,isLazyLoadEnabled, listenerName,mainResult, additionalInfo).then(childRes => {
                        return Promise.resolve(childRes)
                    }));
                }
                if (childJsonArray[0]['childObject'].length === 0) {
                    Array.prototype.push.apply(finalArray, resultArray)
                }
            }

            return Promise.all(taskList).then(allRes => {
                if (additionalInfo != undefined) {
                    Array.prototype.push.apply(parentRes['records'], additionalInfo['response'])
                }
                return Promise.resolve(parentRes)
            })
        }).catch(error => {
            return this.catchBlockError(error);
        });


    }

    private getChildObjectDataReverse(childObjectReference, objectName, parentIdJson, parentRes, queryJson, finalArray) {
        const additionalInfo = {
            parentInfo: {
                parentType: undefined,
                parentId: undefined
            }, id: "",
            bookmark: "",
            response: []
        };
        additionalInfo.parentInfo.parentType = objectName;
        additionalInfo.parentInfo.parentId = parentIdJson;
        return this.recursiveFetchReverse(childObjectReference, queryJson, finalArray, additionalInfo).then(childRes => {
            return Promise.resolve(childRes)
        });
    }



    // method to query list page data
    queryListDataWithBatch(referenceDetail: ReferenceDetail, createdby?: Array<number>,isLazyLoadEnabled: boolean = false , listenerName: string = '' ,mainResult: Array<any> = []) {
        var queryOptions = {};
        var type = this.getObjectType(referenceDetail);
        if (createdby !== undefined && createdby.length > 0) {
            var resultArray = [];
            var index = 0;
            if (referenceDetail["queryBatch"] !== undefined &&
                referenceDetail["queryBatch"]["type"] === type &&
                referenceDetail["queryBatch"]["userId"] !== undefined) {
                index = createdby.indexOf(referenceDetail["queryBatch"]["userId"]);
            }
            return this.queryUserWiseData(referenceDetail, createdby, index, this.queryBatchLimit, resultArray,isLazyLoadEnabled, listenerName,mainResult).then(res => {
                return this.successBlock(resultArray);
            });
        } else {
            queryOptions = {
                startkey: type,
                endkey: type + "\ufff0",
                limit: this.queryBatchLimit,
                include_docs: true
            };
            if (referenceDetail["queryBatch"] !== undefined &&
                referenceDetail["queryBatch"]["type"] === type) {
                queryOptions["startkey"] = this.db.rel.makeDocID({
                    type: type, id: referenceDetail["queryBatch"]["docId"]
                });
                queryOptions["skip"] = 1;
            }

            return this.executeAllDocs(queryOptions, referenceDetail,isLazyLoadEnabled, listenerName,mainResult).then(res => {
                if (res && res.constructor == Array) {
                    if (referenceDetail["queryBatch"] === undefined) {
                        referenceDetail["queryBatch"] = {
                            docId: "",
                            type: type
                        };
                    }
                    if (res.length > 0) {
                        referenceDetail["queryBatch"]["docId"] = res[res.length - 1]["id"];
                    }

                    return Promise.resolve({
                        status: this.success,
                        message: "",
                        records: res
                    });
                } else {
                    return Promise.resolve({
                        status: this.failed,
                        message: "Error",
                        records: []
                    });
                }
            });
        }
    }

    queryUserWiseData(referenceDetail: ReferenceDetail, createdby: Array<number>, index: number, limit: number, resultArray: Array<any>,isLazyLoadEnabled: boolean = false , listenerName: string = '' ,mainResult: Array<any> = []) {
        var type = this.getObjectType(referenceDetail);
        var queryOptions = {
            startkey: type + createdby[index],
            endkey: type + createdby[index] + "\ufff0",
            limit: limit,
            include_docs: true
        };
        if (referenceDetail["queryBatch"] !== undefined &&
            referenceDetail["queryBatch"]["type"] === type &&
            referenceDetail["queryBatch"]["userId"] === createdby[index]) {
            queryOptions["startkey"] =
                type + createdby[index] + this.db.rel.makeDocID({
                    type: type, id: referenceDetail["queryBatch"]["docId"]
                });
            queryOptions["skip"] = 1;
        }

        return this.executeQuery("type_createdby_docid_view", queryOptions, referenceDetail,isLazyLoadEnabled, listenerName,mainResult).then(res => {
            if (res && res.constructor == Array) {
                if (referenceDetail["queryBatch"] === undefined) {
                    referenceDetail["queryBatch"] = {
                        docId: "",
                        type: type
                    };
                }
                referenceDetail["queryBatch"]["userId"] = createdby[index];
                if (res.length > 0) {
                    referenceDetail["queryBatch"]["docId"] = res[res.length - 1]["id"];
                }
                Array.prototype.push.apply(resultArray, res);
                if (res.length === limit) {
                    return res;
                } else {
                    var nextIndex = index + 1;
                    if (nextIndex < createdby.length) {
                        return this.queryUserWiseData(referenceDetail, createdby, nextIndex, limit - res.length, resultArray,isLazyLoadEnabled, listenerName,mainResult);
                    } else {
                        return res;
                    }
                }
            } else {
                return Promise.resolve({
                    status: this.failed,
                    message: "Error",
                    records: []
                });
            }
        });
    }
    executeQuery(viewName, queryOptions, referenceDetail: ReferenceDetail,isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = []) {
        return this.db.query(viewName, queryOptions)
            .then(result => {
                return this.handleResponse(result, referenceDetail,isLazyLoadEnabled, listenerName, mainResult);
            })
            .catch(err => {
                return this.executeAllDocsCatchBlock(err);
            });
    }

    executeAllDocs(queryOptions, referenceDetail: ReferenceDetail,isLazyLoadEnabled: boolean = false, listenerName: string = '',mainResult: Array<any> = []) {
        return this.db.allDocs(queryOptions)
            .then(result => {
                return this.handleResponse(result, referenceDetail,isLazyLoadEnabled, listenerName,mainResult);
            })
            .catch(err => {
                return this.executeAllDocsCatchBlock(err);
            });
    }

    private executeAllDocsCatchBlock(err) {
        console.log("online query err====>", err);
        return Promise.resolve({
            status: this.failed,
            message: "Server error. Please contact admin."
        });

    }

    queryBulkDoc(referenceDetail: ReferenceDetail, docIds: Array<string>,isLazyLoadEnabled: boolean = false , listenerName: string = '' ,mainResult: Array<any> = []) {
        var queryOptions = {};
        var type = this.getObjectType(referenceDetail);
        var ids = docIds.map(docId => {
            return this.getDocId(type, docId)
        })
        queryOptions = {
            keys: ids,
            include_docs: true
        };
        return this.executeAllDocs(queryOptions, referenceDetail,isLazyLoadEnabled, listenerName,mainResult).then(res => {
            if (res && res.constructor == Array) {
                return Promise.resolve({
                    status: this.success,
                    message: "",
                    records: res
                });
            } else {
                return Promise.resolve({
                    status: this.failed,
                    message: "Error",
                    records: []
                });
            }
        });
    }
    getLookUpCustomObjChild(childJsonArray: Array<ReferenceDetail>, objectType) {
        const childObjects = [];
        childJsonArray.forEach(element => {
            if (element["objectType"].toUpperCase() === objectType &&
                (!element.hasOwnProperty('isStandardObject') ||
                    element["isStandardObject"] == 'N')) {
                childObjects.push(element);
            }
        });
        return childObjects;
    }
    getLookUpStandaredObjChild(childJsonArray: Array<ReferenceDetail>, objectType) {
        const childObjects = [];
        childJsonArray.forEach(element => {


            if (element["objectType"].toUpperCase() === objectType &&
                element["isStandardObject"] == 'Y') {
                childObjects.push(element);
            }
        });
        return childObjects;
    }
    makeInQuery(idList, objectName, fieldName) {
        var selectedValue = ''
        idList.forEach(element => {
            if (selectedValue)
                selectedValue = selectedValue + " " + element
            else
                selectedValue = element
        });
        return "type:" + objectName + " AND " + fieldName + ":" + "(" + selectedValue + ")"
    }
    handleResponse(result, referenceDetail: ReferenceDetail,isLazyLoadEnabled: boolean = false, listenerName: string = '',mainResult: Array<any> = []) {
        if (result["rows"]) {
            const lookupHierarchyJSONArray = this.getLookUpCustomObjChild(referenceDetail["childObject"], "LOOKUP");
            const lookupHierarchyJSONArrayStd = this.getLookUpStandaredObjChild(referenceDetail["childObject"], "LOOKUP");
            const childObjects = this.getChild(referenceDetail["childObject"], "MASTERDETAIL");
            const parentObject = this.getChild(referenceDetail["childObject"], "HEADER");
            const commonLookUpObjects = this.getChild(referenceDetail["childObject"], "COMMONLOOKUP");
            const objectType = this.getObjectType(referenceDetail);
            const formulaObject = referenceDetail["formulaField"]
            const rollUpObject = referenceDetail["rollupField"]
            const workflowObject = referenceDetail["workflowField"]
            const associationObjectsHierarchyJSONArray = referenceDetail["associationObject"]
            const fileManageObject = referenceDetail["fileManage"];

            const lookupIdDataMapping = {};
            const stdlookupIdDataMapping = {};
            const commonLookupIdDataMapping = {};
            const dataArray = [];
            let fileManageQuery = [];
            const formulaQuery = [];
            const rollUpQuery = [];
            const associationQuery = []
            var workFlowRefernceIdList = []
            var workflowQuery;
            const parentDataMapping = {};
            const childQueryKeys = {};

            var taskList = [];
            const lookUpIdInfo = {}
            const stdlookUpIdInfo = {}
            const commonLookUpIdInfo = {}
            const headerDataMapping = {}
            const headerQueryKeys = {};

            for (let i = 0; i < result["rows"].length; i++) {
                if (result["rows"][i]["doc"] ||  result["rows"][i]['fields']) {
                    let data = {};
                    if(result["rows"][i]["doc"]){
                        data = this.convertRelDocToNormalDoc(result["rows"][i]["doc"]);
                      }else if(result["rows"][i]['fields']){
                        const parsedId = this.db.rel.parseDocID(result["rows"][i].id);
                        data =  result["rows"][i]['fields'];
                        data['id'] = parsedId.id
                      }
                    parentDataMapping[data["id"]] = i;
                    const headerObjectType = parentObject && parentObject[0] && this.getObjectType(parentObject[0]) || "";
                    if (headerObjectType) {
                        if (headerDataMapping[data[headerObjectType]] === undefined) {
                            headerDataMapping[data[headerObjectType]] = []
                        }
                        headerDataMapping[data[headerObjectType]].push(i)
                    }

                    lookupHierarchyJSONArray.forEach(element => {
                        let fieldId = "";
                        let lookupObjectName = "";
                        if (isNaN(element["fieldId"])) {
                            lookupObjectName = element["objectId"];
                            fieldId = element["fieldId"];
                        } else {
                            lookupObjectName = "pfm" + element["objectId"];
                            fieldId = lookupObjectName + "_" + element["fieldId"];
                        }
                        const lookupId = data[fieldId];
                        if (lookupId && lookupId !== null && lookupId !== undefined && lookupId !== "") {
                            var lookupRecordId = this.db.rel.makeDocID({
                                type: lookupObjectName,
                                id: lookupId
                            });
                            if (lookUpIdInfo[fieldId] === undefined) {
                                lookUpIdInfo[fieldId] = []
                            }
                            if (lookUpIdInfo[fieldId].indexOf(lookupRecordId) === -1) {
                                lookUpIdInfo[fieldId].push(lookupRecordId);
                            }
                            if (lookupIdDataMapping[fieldId] === undefined) {
                                lookupIdDataMapping[fieldId] = {};
                            }
                            if (lookupIdDataMapping[fieldId][lookupId] === undefined) {
                                lookupIdDataMapping[fieldId][lookupId] = [];
                            }
                            lookupIdDataMapping[fieldId][lookupId].push(i);
                        }
                    });

                    if (associationObjectsHierarchyJSONArray && associationObjectsHierarchyJSONArray.length > 0 && !referenceDetail['isLazyLoadingEnabled']) {
                        associationObjectsHierarchyJSONArray.forEach(associationObjHierarchy => {
                            associationObjHierarchy['associationField'].forEach(associationField => {
                                associationQuery.push('start' + objectType + data['id'] + associationField)
                            });
                        });
                    }

                    lookupHierarchyJSONArrayStd.forEach(stdElement => {
                        let fieldId = "";
                        let lookupObjectName = "";
                        if (isNaN(stdElement["fieldId"])) {
                            lookupObjectName = stdElement["objectId"];
                            fieldId = stdElement["fieldId"];
                        } else {
                            lookupObjectName = "pfm" + stdElement["objectId"];
                            fieldId = lookupObjectName + "_" + stdElement["fieldId"];
                        }
                        const stdlookupId = data[fieldId];
                        if (stdlookupId && stdlookupId !== null && stdlookupId !== undefined && stdlookupId !== "") {
                            var lookupRecordId = this.db.rel.makeDocID({
                                type: lookupObjectName,
                                id: stdlookupId
                            });
                            if (stdlookUpIdInfo[fieldId] === undefined) {
                                stdlookUpIdInfo[fieldId] = []
                            }
                            if (stdlookUpIdInfo[fieldId].indexOf(lookupRecordId) === -1) {
                                stdlookUpIdInfo[fieldId].push(lookupRecordId);
                            }
                            if (stdlookupIdDataMapping[fieldId] === undefined) {
                                stdlookupIdDataMapping[fieldId] = {};
                            }
                            if (stdlookupIdDataMapping[fieldId][stdlookupId] === undefined) {
                                stdlookupIdDataMapping[fieldId][stdlookupId] = [];
                            }
                            stdlookupIdDataMapping[fieldId][stdlookupId].push(i);
                        }
                    });

                    commonLookUpObjects.forEach(element => {

                        const fieldName = element["fieldName"];
                        const commonLookupRecordId = data[fieldName]
                        if (commonLookupRecordId && commonLookupRecordId !== null &&
                            commonLookupRecordId !== undefined && commonLookupRecordId !== "") {
                            const fieldId = commonLookupRecordId.split("_2_")
                            const commonLookupId = fieldId[1];
                            if (commonLookUpIdInfo[fieldName] === undefined) {
                                commonLookUpIdInfo[fieldName] = []
                            }
                            if (commonLookUpIdInfo[fieldName].indexOf(commonLookupRecordId) === -1) {
                                commonLookUpIdInfo[fieldName].push(commonLookupRecordId);
                            }
                            if (commonLookupIdDataMapping[fieldName] === undefined) {
                                commonLookupIdDataMapping[fieldName] = {};
                            }
                            if (commonLookupIdDataMapping[fieldName][commonLookupId] === undefined) {
                                commonLookupIdDataMapping[fieldName][commonLookupId] = [];
                            }
                            commonLookupIdDataMapping[fieldName][commonLookupId].push(i);
                        }
                    });

                    childObjects.forEach(element => {
                        var childObjectType = this.getObjectType(element);
                        data[this.getPluralName(childObjectType)] = [];
                        if (childQueryKeys[childObjectType] === undefined) {
                            childQueryKeys[childObjectType] = [];
                        }
                        if(element['includeFields'] || element['includeFields'] === undefined){
                            childQueryKeys[childObjectType].push(childObjectType + data["id"]);
                        } else{
                            childQueryKeys[childObjectType].push(data["id"]);
                        }
                    });
                    parentObject.forEach(element => {
                        var parentObjectType = this.getObjectType(element);
                        // data[this.getPluralName(parentObjectType)] = [];
                        if (headerQueryKeys[parentObjectType] === undefined) {
                            headerQueryKeys[parentObjectType] = [];
                        }                        
                        headerQueryKeys[parentObjectType].push(this.getDocId(parentObjectType, data[parentObjectType]));                     
                   });

                    if (formulaObject) {
                        formulaQuery.push(objectType + 'formula' + data["id"])
                    }

                    if (fileManageObject) {
                        fileManageQuery = this.attachementAndDocumentQueryMaking(referenceDetail, objectType, data)
                    }

                    if (rollUpObject) {
                        rollUpQuery.push(objectType + 'rollup' + data["id"])
                    }

                    if (workflowObject && workflowObject.length > 0)
                    {
                        workFlowRefernceIdList.push(data["id"])
                        if(i==result["rows"].length-1)
                        {
                            workflowQuery =   this.makeInQuery(workFlowRefernceIdList,data['type']+ "_WorkFlowHistory",'referenceid')
                        }
                    }
                    dataArray.push(data);
                    if (referenceDetail['queryBatch'] === undefined) {
                        referenceDetail['queryBatch'] = {
                            docId: data['id'],
                            type: objectType
                        }
                    }
                    referenceDetail['queryBatch']['key'] = result["rows"][i]['key']
                }
            }

            if (workFlowRefernceIdList.length>0) {
                //  workFlowQuery =  "type:" +  + " AND " + "referenceid:"+data['id']
                // this.makeInQuery(workFlowIdList,data['type'] + "_WorkFlowHistory",'referenceid')
                const pfmApproveUserStatusHierarchyJSON = {
                    "objectId":  "WorkFlowHistory" ,
                    "objectName": "WorkFlowHistory" ,
                    "fieldId": 0,
                    "objectType": "PRIMARY",
                    "relationShipType": null,
                    "childObject": []
                };

                taskList.push(this.executionCouchDbProvider.fetchRecordsBySearchFilterPhrases(workflowQuery,pfmApproveUserStatusHierarchyJSON).then(result => {
                  if (result && result['status'] && result['records'] && result['status'] == this.success && result['records'].length > 0) {
                        // result = result['records']
                        result['records'].forEach(element => {
                            // element = element['doc']
                            //   const data = this.convertRelDocToNormalDoc(element['doc']);
                            var index = parentDataMapping[element['referenceid']];
                            workflowObject.forEach(fieldName => {
                               
                                if(element['fieldName']==fieldName['fieldName'])
                                    dataArray[index][fieldName['fieldName']+"_WorkFlowHistory"] = element
                            })
                        });
                        this.emitFetchedData(isLazyLoadEnabled, listenerName, mainResult, 'updated')
                        return result
                    } else {
                        return
                    }
                }))
            }
            if (fileManageQuery.length > 0) {
                fileManageQuery.forEach(query => {
                    const queryFlags = { include_docs: true, include_fields: false };
                    taskList.push(this.attachmentCouchDbObject.callSearchDesignDocs(query, 'filemanage_search', '', queryFlags).then(res => {
                        if (res['rows'] && res['rows'].length > 0) {
                            const convertToRecords = this.handleGlobalSearchResponse(res['rows']);
                            const finalResponse = this.splitAttachmentAndDocumentFileSize(convertToRecords);
                            let index = parentDataMapping[convertToRecords[0][convertToRecords[0]['type'].slice(0, -3)]];
                            if (finalResponse['typeOfFile'] === 'att') {
                                let fileSizeOfAttachment = lodash.sumBy(convertToRecords, 'file_size');
                                let sizeOfAttachemntToMb = parseFloat((fileSizeOfAttachment / 1024).toFixed(2));
                                dataArray[index]['cspfm_countOfAttachment'] = convertToRecords.length;
                                dataArray[index]['cspfm_fileSizeOfAttachment'] = sizeOfAttachemntToMb;
                            }
                            if (finalResponse['typeOfFile'] === 'doc' && fileManageObject['isFormulaForDocumentEnable'] === true) {
                                if (fileManageObject['involvedDocumentIds'].length > 0) {
                                    fileManageObject['involvedDocumentIds'].forEach(documentId => {
                                        const countOfDoucment = 'cspfm_countOfDocument_' + documentId;
                                        const sizeOfDocument = 'cspfm_fileSizeOfDocument_' + documentId;
                                        if (finalResponse["documentDetails"][documentId] && finalResponse['documentDetails'][documentId].length > 0) {
                                            let fileSizeOfDocument = lodash.sumBy(finalResponse['documentDetails'][documentId], 'file_size');
                                            let sizeOfDocumentToMb = parseFloat((fileSizeOfDocument / 1024).toFixed(2))
                                            dataArray[index][countOfDoucment] = finalResponse['documentDetails'][documentId].length;
                                            dataArray[index][sizeOfDocument] = sizeOfDocumentToMb;
                                        } else {
                                            dataArray[index][countOfDoucment] = 0;
                                            dataArray[index][sizeOfDocument] = 0;
                                        }
                                    })
                                } else {
                                    let fileSizeOfDocument = lodash.sumBy(convertToRecords, 'file_size');
                                    let sizeOfDocumentToMb = parseFloat((fileSizeOfDocument / 1024).toFixed(2));
                                    dataArray[index]['cspfm_countOfDocument'] = convertToRecords.length;
                                    dataArray[index]['cspfm_fileSizeOfDocument'] = sizeOfDocumentToMb;
                                }
                            }
                            return result
                        } else {
                            if (fileManageObject['isFormulaForAttachmentEnable'] === true) {
                                dataArray[0]['cspfm_countOfAttachment'] = 0;
                                dataArray[0]['cspfm_fileSizeOfAttachment'] = 0;
                            } if (fileManageObject['isFormulaForDocumentEnable'] === true) {
                                if (fileManageObject['involvedDocumentIds'].length > 0) {
                                    fileManageObject['involvedDocumentIds'].forEach(documentId => {
                                        const countOfDoucment = 'cspfm_countOfDocument_' + documentId;
                                        const sizeOfDocument = 'cspfm_fileSizeOfDocument_' + documentId;
                                        dataArray[0][countOfDoucment] = 0;
                                        dataArray[0][sizeOfDocument] = 0;
                                    })
                                } else {
                                    dataArray[0]['cspfm_countOfDocument'] = 0;
                                    dataArray[0]['cspfm_fileSizeOfDocument'] = 0;
                                }
                            }
                            return result
                        }   
                    }
                    ))
                })
            }
            if (formulaQuery.length > 0) {
                taskList.push(this.formulaCouchDbProvider.fetchformulaValue(formulaQuery).then(result => {
                    if (result && result['status'] && result['records'] && result['status'] == this.success && result['records'].length > 0) {
                        result = result['records']
                        result.forEach(element => {
                            element = element['doc']['data']
                            var index = parentDataMapping[element['reference_id']];
                            formulaObject.forEach(fieldName => {
                                dataArray[index][fieldName['fieldName'] + appConstant['customFieldSuffix']['formula']] = element[fieldName['fieldName']]
                            })
                        });
                        if(isLazyLoadEnabled){
                            dataArray.forEach(dataObj=>{
                                dataObj['cspfm_formula_fetch_status'+appConstant['customFieldSuffix']['slickgrid']] = "completed";                   
                            })
                        }
                        this.emitFetchedData(isLazyLoadEnabled, listenerName, mainResult, 'updated')
                        return result
                    } else {
                        return
                    }
                }))
            }
            if (rollUpQuery.length > 0) {
                taskList.push(this.formulaCouchDbProvider.fetchRollUpValue(rollUpQuery).then(result => {
                    if (result['status'] == this.success && result['records'].length > 0) {
                        result = result['records']
                        result.forEach(element => {
                            element = element['doc']['data']
                            const index = parentDataMapping[element['reference_id']];
                            rollUpObject.forEach(fieldName => {
                                dataArray[index][fieldName['fieldName'] + appConstant.customFieldSuffix.rollup_summary] = element[fieldName['fieldName']]
                            })
                        });
                        if(isLazyLoadEnabled){
                            dataArray.forEach(dataObj=>{
                                dataObj['cspfm_rollup_fetch_status'+appConstant['customFieldSuffix']['slickgrid']] = "completed";                   
                            })
                        }
                        this.emitFetchedData(isLazyLoadEnabled, listenerName, mainResult, 'updated')
                        return result
                    } else {
                        return
                    }
                }))
            }

            if (associationQuery.length > 0) {
                taskList.push(this.fetchAssociation("associationView", associationQuery).then(result => {
                    if (result['status'] == this.success && result['records'].length > 0) {
                        var associationTaskList = []
                        associationObjectsHierarchyJSONArray.forEach(associationObjHierarchy => {
                            associationTaskList.push(this.fetchAssociationRecords(result['records'], associationObjHierarchy, parentDataMapping, dataArray,isLazyLoadEnabled, listenerName,mainResult).then(result => {
                                return result
                            }));
                        });

                        return Promise.all(associationTaskList).then(res => {
                            return Promise.resolve(res);
                        });
                    }
                    return result;
                }))
            }

            if (isLazyLoadEnabled) {
                if (!mainResult || mainResult.length == 0) {
                    mainResult = dataArray;
                }
                this.emitFetchedData(isLazyLoadEnabled, listenerName, mainResult, 'updated')
            }

            if (dataArray.length > 0) {
                childObjects.forEach(childObject => {
                    const childObjectType = this.getObjectType(childObject);
                    taskList.push(this.queryChildData(childObject, childQueryKeys[childObjectType], parentDataMapping, dataArray, objectType, isLazyLoadEnabled, listenerName, mainResult));
                });

                parentObject.forEach(parent => {
                    const headerObjectType = this.getObjectType(parent);
                    taskList.push(this.queryHeaderData(parent, headerQueryKeys[headerObjectType], headerDataMapping, dataArray, isLazyLoadEnabled, listenerName, mainResult));
                });
                if (lookupHierarchyJSONArray.length > 0) {
                    lookupHierarchyJSONArray.forEach(lookUpObject => {
                        // let fieldId = "pfm" + lookUpObject["objectId"] + "_" + lookUpObject["fieldId"]
                        let fieldId = ""
                        if (isNaN(lookUpObject["fieldId"])) {
                            fieldId = lookUpObject["fieldId"]
                        } else {
                            fieldId = "pfm" + lookUpObject["objectId"] + "_" + lookUpObject["fieldId"]
                        }
                        if (lookUpIdInfo[fieldId] && lookUpIdInfo[fieldId].length > 0) {
                            taskList.push(this.queryLookupData(lookUpObject, lookUpIdInfo[fieldId], lookupIdDataMapping, dataArray, isLazyLoadEnabled, listenerName, mainResult));
                        }
                    })
                }
                if (lookupHierarchyJSONArrayStd.length > 0) {
                    lookupHierarchyJSONArrayStd.forEach(stdlookUpObject => {
                        // let fieldId = "pfm" + lookUpObject["objectId"] + "_" + lookUpObject["fieldId"]
                        let fieldId = ""
                        if (isNaN(stdlookUpObject["fieldId"])) {
                            fieldId = stdlookUpObject["fieldId"]
                        } else {
                            fieldId = "pfm" + stdlookUpObject["objectId"] + "_" + stdlookUpObject["fieldId"]
                        }
                        if (stdlookUpIdInfo[fieldId] && stdlookUpIdInfo[fieldId].length > 0) {
                            taskList.push(this.queryStdLookupData(stdlookUpObject, stdlookUpIdInfo[fieldId], stdlookupIdDataMapping, dataArray, isLazyLoadEnabled, listenerName, mainResult));
                        }
                    })
                }
                if (commonLookUpObjects.length > 0) {
                    commonLookUpObjects.forEach(commonLookUpObject => {
                        const fieldId = commonLookUpObject["fieldName"];
                        if (commonLookUpIdInfo[fieldId] && commonLookUpIdInfo[fieldId].length > 0) {
                            taskList.push(this.queryCommonLookupData(commonLookUpObject,
                                commonLookUpIdInfo[fieldId], commonLookupIdDataMapping, dataArray, isLazyLoadEnabled, listenerName, mainResult));
                        }
                    })
                }
                return Promise.all(taskList).then(res => {
                    return Promise.resolve(dataArray);
                });
            } else {
                return Promise.resolve(dataArray);
            }
        } else {
            return Promise.resolve([]);
        }
    }
    getChild(childJsonArray: Array<ReferenceDetail>, objectType) {
        const childObjects = [];
        childJsonArray.forEach(element => {
            if (element["objectType"].toUpperCase() === objectType) {
                childObjects.push(element);
            }
        });
        return childObjects;
    }

    fetchAssociation(viewDocument, keysArray) {
        var queryOptions = {
            keys: keysArray,
            include_docs: true
        };

        if (this.appConfig.configuration.associationDbConfigInfo['associationConfigDbName'] && this.appConfig.configuration.associationDbConfigInfo['associationConfigDbName'] == this.formulaDbConfig.configuration.databaseName) {
            return this.formulaCouchDbProvider.fetchAssociation(viewDocument, queryOptions)
        } else {
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


    }
    attachementAndDocumentQueryMaking(referenceDetail, objectId, data) {
        const searchQuery = [];
        const involvedDocumentIds = referenceDetail['fileManage']['involvedDocumentIds']
        if (referenceDetail['fileManage']['isFormulaForAttachmentEnable'] === true) {
            let query = {}
            query = 'type:' + objectId + 'att' + ' AND ' + objectId + ':' + data['id'] + ' AND ' + 'status:finished' + ' AND ' + 'isRemoved:' + false;
            searchQuery.push(query)
        } if (referenceDetail['fileManage']['isFormulaForDocumentEnable'] === true) {
            if (involvedDocumentIds.length > 0) {
                let query = {}
                query = 'type:' + objectId + 'doc' + ' AND ' + objectId + ':' + data['id'] + ' AND ' + 'document_config_id:(' + involvedDocumentIds.join(' ') + ')' + ' AND ' + 'status:finished' + ' AND ' + 'isRemoved:' + false;
                searchQuery.push(query)
            } else {
                let query = {}
                query = 'type:' + objectId + 'doc' + ' AND ' + objectId + ':' + data['id'] + ' AND ' + 'status:finished' + ' AND ' + 'isRemoved:' + false;
                searchQuery.push(query)
            }
        }
        return searchQuery
    }

    splitAttachmentAndDocumentFileSize(records) {
        const typeOfFile = records[0]['type'].slice(-3)
        if (typeOfFile === 'doc') {
            const finalData = {}
            finalData['documentDetails'] = lodash.groupBy(records, function (arrayObj) { return arrayObj.obj_document_config_id });
            finalData['typeOfFile'] = typeOfFile;
            return finalData
        } else if (typeOfFile === 'att') {
            const finalData = {}
            const fileSize = lodash.sumBy(records, 'file_size');
            finalData['fileSize'] = fileSize;
            finalData['typeOfFile'] = typeOfFile;
            return finalData
        }
    }
    fetchAssociationRecords(result, associationObjHierarchy, parentDataMapping, dataArray,isLazyLoadEnabled: boolean = false, listenerName: string = '',mainResult: Array<any> = []) {
        let taskList = []

        let tempResult = result.filter( x => x.value === this.getObjectType(associationObjHierarchy) )
        let groupedResultObj = lodash.groupBy(tempResult, 'key')
        let groupedObjKeys = Object.keys(groupedResultObj)

        groupedObjKeys.forEach(groupedKey => {
            let recordId = [];

            if (groupedResultObj[groupedKey].length > 0) {
                let firstRecord = groupedResultObj[groupedKey][0]['doc']['data']
                const index = parentDataMapping[firstRecord['reference_id']];
                let associationFieldSplit = firstRecord['type'].split("-");
                let associationObjectId = this.objTableMapping.mappingDetail[associationFieldSplit[1]]

                groupedResultObj[groupedKey].forEach(element => {
                    element = element['doc']['data']
                    recordId.push(associationObjectId + '_2_' + element['association_id'])
                });

                taskList.push(this.fetchAssociationByViewDoc(recordId, dataArray, index, firstRecord['type'], associationObjHierarchy,isLazyLoadEnabled, listenerName,mainResult).then(res => {
                    return res;
                }));
            }

        })

        return Promise.all(taskList).then(response => {
            return response;
        }).catch(err => {
            console.log("Error", err)
        });
    }

    fetchAssociationByViewDoc(recordId, dataArray, index, associationField, associationObjHierarchy,isLazyLoadEnabled: boolean = false, listenerName: string = '',mainResult: Array<any> = []) {
        return this.fetchRelationshipDataOfAssociation(recordId, associationObjHierarchy,isLazyLoadEnabled, listenerName,mainResult).then(res => {
            if (res.length > 0) {
                dataArray[index][associationField] = res;
            }
            return Promise.resolve(res);

        }).catch(err => {
            console.log("Error", err)
        })
    }

    fetchRelationshipDataOfAssociation(recordId, associationObjHierarchy, isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = []) {
        return this.db.allDocs({ include_docs: true, keys: recordId }).then(res => {
            return this.handleResponse(res, associationObjHierarchy,isLazyLoadEnabled,listenerName,mainResult);
        }).catch(err => {
            console.log("Error", err)
        })
    }

    queryChildsData(childObjectReferenceDetails, keys, parentObjectName,isLazyLoadEnabled: boolean = false, listenerName: string = '',mainResult: Array<any> = []) {
        if (childObjectReferenceDetails['includeFields'] || childObjectReferenceDetails['includeFields'] === undefined ) {
            var queryOptions = {
                keys: keys,
                include_docs: true
            };
            return this.executeQuery("masterdetailview", queryOptions, childObjectReferenceDetails,isLazyLoadEnabled, listenerName,mainResult);
        } else {
            const include_fields = [parentObjectName];
            return  this.fetchRequiredFieldsOnly(childObjectReferenceDetails,keys,include_fields, parentObjectName,isLazyLoadEnabled , listenerName ,mainResult);                     
        }
    }

    fetchRequiredFieldsOnly(referenceDetail, keys, includefields, searchKey, isLazyLoadEnabled: boolean = false , listenerName: string = '',mainResult: Array<any> = []){
        const include_fields = includefields; // includefields for dataarray mapping purpose
        const designDocName = this.getObjectType(referenceDetail) + '_search';      
        referenceDetail['childObject'].filter(element=> {
            if (element['objectId'] && element['objectType'] == 'LOOKUP') {
                       let fieldId = "";
                        if (isNaN(element["fieldId"])) {
                            fieldId = element["fieldId"];
                        } else {
                            fieldId = this.getObjectType(element) + "_" + element["fieldId"];
                        }
                include_fields.push(fieldId)
            } 
            if (element['objectId'] && element['objectType'] == 'HEADER') {
                include_fields.push(this.getObjectType(element)) 
            } 
        })
        let taskList = []
        const batchkeys = lodash.chunk(keys, this.batchIdLimit);
           batchkeys.forEach(element => {              
            const query = searchKey + ': (' + element.join(' OR ') + ')'
            const queryFlags = {include_docs:false,include_fields:include_fields};
             taskList.push(this.callSearchDesignDocsForFilter(query, designDocName, "", queryFlags).then(result=>{
                return this.handleResponse(result, referenceDetail, isLazyLoadEnabled, listenerName,mainResult)
            }));
        });
        return Promise.all(taskList).then(result => {
            const res =  lodash.flattenDeep(result);
            return res;
        })
    }

    queryChildData(childObjectReferenceDetails, keys, parentDataMapping, dataArray, parentObjectName, isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = []) {
        return this.queryChildsData(childObjectReferenceDetails, keys, parentObjectName,isLazyLoadEnabled, listenerName, mainResult).then(res => {
            var objectType = this.getObjectType(childObjectReferenceDetails);
            res.forEach(element => {
                if (dataArray[parentDataMapping[element[parentObjectName]]][this.getPluralName(objectType)] === undefined) {
                    dataArray[parentDataMapping[element[parentObjectName]]][
                        this.getPluralName(objectType)
                    ] = [];
                }
                dataArray[parentDataMapping[element[parentObjectName]]][
                    this.getPluralName(objectType)
                ].push(element);
            });
            if(isLazyLoadEnabled){
                dataArray.forEach(res=>{
                        res[`cspfm_${objectType}s_fetch_status`+appConstant['customFieldSuffix']['slickgrid']] = 'completed';                   
                })
            }
            this.emitFetchedData(isLazyLoadEnabled, listenerName, mainResult, 'updated')
            return dataArray;
        });
    }

    queryLookupData(lookupObject, lookupIds, lookupIdDataMapping, dataArray, isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = []) {
        return this.queryLookups(lookupIds, lookupObject,isLazyLoadEnabled, listenerName ,mainResult).then(res => {
            res.forEach(resObj => {
                // let fieldId = "pfm" + lookUpObject["objectId"] + "_" + lookUpObject["fieldId"]
                let fieldId = ""
                if (isNaN(lookupObject["fieldId"])) {
                    fieldId = lookupObject["fieldId"]
                } else {
                    fieldId = "pfm" + lookupObject["objectId"] + "_" + lookupObject["fieldId"]
                }
                const indexArray = lookupIdDataMapping[fieldId][resObj["id"]];
                indexArray.forEach(i => {
                    dataArray[i][fieldId] = resObj;
                });
            });
            this.emitFetchedData(isLazyLoadEnabled, listenerName, mainResult, 'updated')
            return dataArray;
        });
    }
    queryStdLookupData(lookupObject, lookupIds, lookupIdDataMapping, dataArray, isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = []) {
        return this.queryStdlookupObject(lookupIds, lookupObject,isLazyLoadEnabled, listenerName,mainResult).then(response => {

            response.forEach(result => {
                // let fieldId = "pfm" + lookUpObject["objectId"] + "_" + lookUpObject["fieldId"]
                let fieldId = ""
                if (isNaN(lookupObject["fieldId"])) {
                    fieldId = lookupObject["fieldId"]
                } else {
                    fieldId = "pfm" + lookupObject["objectId"] + "_" + lookupObject["fieldId"]
                }
                const indexArray = lookupIdDataMapping[fieldId][result["id"]];
                indexArray.forEach(i => {
                    dataArray[i][fieldId] = result;
                });
            });
            this.emitFetchedData(isLazyLoadEnabled, listenerName, mainResult, 'updated')
            return dataArray;
        });
    }
    queryStdlookupObject(lookupIds, referenceDetail,isLazyLoadEnabled: boolean = false,listenerName: string = '',mainResult: Array<any> = []) {
        return this.metaCouchDbProvider.queryStdObjects(lookupIds).then(res => {
            return this.handleResponse(res, referenceDetail,isLazyLoadEnabled, listenerName,mainResult);
        });
    }
    queryCommonLookupData(commonLookupObject, commonLookupIds, commonLookupIdDataMapping, dataArray, isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = []) {
        return this.queryLookups(commonLookupIds, commonLookupObject,isLazyLoadEnabled,listenerName,mainResult).then(res => {
            res.forEach(resObj => {
                const fieldId = commonLookupObject["fieldName"];
                const indexArray = commonLookupIdDataMapping[fieldId][resObj["id"]];
                indexArray.forEach(i => {
                    dataArray[i][fieldId] = resObj;
                });
            });
            this.emitFetchedData(isLazyLoadEnabled, listenerName, mainResult, 'updated')
            return dataArray;
        });
    }

    queryLookups(lookupId, referenceDetail,isLazyLoadEnabled: boolean = false,listenerName: string = '',mainResult: Array<any> = []) {
        if (referenceDetail['includeFields']  || referenceDetail['includeFields'] === undefined) {
            return this.db.allDocs({ include_docs: true, keys: lookupId }).then(res => {
                return this.handleResponse(res, referenceDetail,isLazyLoadEnabled,listenerName ,mainResult);
            });
        } else {
            return  this.fetchRequiredFieldsOnly(referenceDetail,lookupId,[], '_id',isLazyLoadEnabled , listenerName ,mainResult);  
        }
    }

    getObjectType(objectDetails: ReferenceDetail) {
        var objectType = "";
        if (objectDetails["objectId"].includes("pfm")) {
            objectType = objectDetails["objectId"];
        } else {
            objectType = "pfm" + objectDetails["objectId"];
        }
        return objectType;
    }

    querySingleDoc(referenceDetail: ReferenceDetail, docId: string,isLazyLoadEnabled: boolean = false , listenerName: string = '' ,mainResult: Array<any> = []) {
        var queryOptions = {};
        var type = this.getObjectType(referenceDetail);
        queryOptions = {
            key: this.getDocId(type, docId),
            include_docs: true
        };
        return this.executeAllDocs(queryOptions, referenceDetail,isLazyLoadEnabled, listenerName ,mainResult).then(executeAllDocsRes => {
            if (executeAllDocsRes && executeAllDocsRes.constructor == Array) {
                return Promise.resolve({
                    status: this.success,
                    message: "",
                    records: executeAllDocsRes
                });
            } else {
                return Promise.resolve({
                    status: this.failed,
                    message: "Error",
                    records: []
                });
            }
        });
    }

    getDocId(type: string, id: string) {
        var docId = "";
        if (id.includes("pfm")) {
            docId = id;
        } else {
            docId = this.db.rel.makeDocID({ 'type': type, 'id': id });
        }
        return docId;
    }

    parseDocId(id: string) {
        var docId = "";
        if (id.includes("pfm")) {
            docId = this.db.rel.parseDocID(docId);
        } else {
            docId = id;
        }
        return docId;
    }


    getChildCount(referenceDetail: ReferenceDetail, parentDocId: string, createdby: Array<number>) {
        var queryOptions = {};
        var type = this.getObjectType(referenceDetail);
        if (createdby !== undefined && createdby.length > 0) {
            var keys = []
            createdby.forEach(element => {
                keys.push(type + element + this.parseDocId(parentDocId))
            })
            queryOptions = {
                keys: keys,
                include_docs: false
            };
            return this.db.query("masterdetail_createdby_view", queryOptions)
                .then(result => {
                    // return this.handleResponse(result, referenceDetail);


                    return Promise.resolve({
                        status: this.success,
                        message: "",
                        records: result['rows']
                    });
                })
                .catch(err => {
                    return this.executeAllDocsCatchBlock(err);
                });
        } else {
            queryOptions = {
                key: type + this.parseDocId(parentDocId),
                include_docs: false
            };
            return this.db.query("masterdetailview", queryOptions)
                .then(queryresult => {
                    // return this.handleResponse(result, referenceDetail);
                    

                    return Promise.resolve({
                        status: this.success,
                        message: "",
                        records: queryresult['rows']
                    });
                })
                .catch(err => {
                    return this.executeAllDocsCatchBlock(err);

                });
        }
    }

    private successBlock(resultArray) {
        return Promise.resolve({
            status: this.success,
            message: "",
            records: resultArray
        });

    }

    queryChildListDataWithBatch(referenceDetail: ReferenceDetail, parentDocId: string, createdby?: Array<number>,isLazyLoadEnabled: boolean = false, listenerName: string = '',mainResult: Array<any> = []) {
        var queryOptions = {};
        var type = this.getObjectType(referenceDetail);
        if (createdby !== undefined && createdby.length > 0) {
            var resultArray = [];
            var index = 0;
            if (referenceDetail["queryBatch"] !== undefined &&
                referenceDetail["queryBatch"]["type"] === type &&
                referenceDetail["queryBatch"]["userId"] !== undefined) {
                index = createdby.indexOf(referenceDetail["queryBatch"]["userId"]);
            }

            return this.queryUserWiseChildData(referenceDetail, parentDocId, createdby, index, this.queryBatchLimit, resultArray,isLazyLoadEnabled, listenerName,mainResult).then(res => {
                return this.successBlock(resultArray);
            });
        } else {
            queryOptions = {
                startkey: type + parentDocId,
                endkey: type + parentDocId + "\ufff0",
                limit: this.queryBatchLimit,
                include_docs: true
            };
            if (referenceDetail["queryBatch"] !== undefined &&
                referenceDetail["queryBatch"]["type"] === type &&
                referenceDetail["queryBatch"]["key"]) {
                queryOptions["startkey"] = referenceDetail["queryBatch"]["key"];
                queryOptions["skip"] = 1;
            }

            return this.executeQuery("masterdetail_createdby_docid_view", queryOptions, referenceDetail,isLazyLoadEnabled, listenerName,mainResult).then(queryRes => {
                if (queryRes && queryRes.constructor == Array) {
                    if (referenceDetail["queryBatch"] === undefined) {
                        referenceDetail["queryBatch"] = {
                            docId: "",
                            type: type
                        };
                    }
                    if (queryRes.length > 0) {
                        referenceDetail["queryBatch"]["docId"] = queryRes[queryRes.length - 1]["id"];
                    }

                    return Promise.resolve({
                        status: this.success,
                        message: "",
                        records: queryRes
                    });
                } else {
                    return Promise.resolve({
                        status: this.failed,
                        message: "Error",
                        records: []
                    });
                }
            });
        }
    }



    queryUserWiseChildData(referenceDetail: ReferenceDetail, parentDocId: string, createdby: Array<number>, index: number, limit: number, resultArray: Array<any>,isLazyLoadEnabled: boolean = false,listenerName: string = '',mainResult: Array<any> = []) {
        var type = this.getObjectType(referenceDetail);
        var parentId = this.parseDocId(parentDocId)
        var queryOptions = {
            startkey: type + parentId + createdby[index],
            endkey: type + parentId + createdby[index] + "\ufff0",
            limit: limit,
            include_docs: true
        };
        if (referenceDetail["queryBatch"] !== undefined &&
            referenceDetail["queryBatch"]["type"] === type &&
            referenceDetail["queryBatch"]["userId"] === createdby[index] &&
            referenceDetail["queryBatch"]["key"]) {
            queryOptions["startkey"] = referenceDetail["queryBatch"]["key"];
            queryOptions["skip"] = 1;
        }
       

        return this.executeQuery("masterdetail_createdby_docid_view", queryOptions, referenceDetail,isLazyLoadEnabled, listenerName,mainResult).then(res => {
            if (res && res.constructor == Array) {
                if (referenceDetail["queryBatch"] === undefined) {
                    referenceDetail["queryBatch"] = {
                        docId: "",
                        type: type
                    };
                }
                referenceDetail["queryBatch"]["userId"] = createdby[index];
                if (res.length > 0) {
                    referenceDetail["queryBatch"]["docId"] = res[res.length - 1]["id"];
                }
                Array.prototype.push.apply(resultArray, res);
                if (res.length === limit) {
                    return res;
                } else {
                    var nextIndex = index + 1;
                    if (nextIndex < createdby.length) {
                        return this.queryUserWiseChildData(referenceDetail, parentDocId, createdby, nextIndex, limit - res.length, resultArray,isLazyLoadEnabled, listenerName,mainResult);
                    } else {
                        return res;
                    }
                }
            } else {
                return Promise.resolve({
                    status: this.failed,
                    message: "Error",
                    records: []
                });
            }
        });
    }

    compositeKeyValidation(type, doc, fieldsToBeChecked, action){
        var resultArray = []
        const keys = []
        var taskList = []

         fieldsToBeChecked.forEach(singleCombination => {
             if(singleCombination['compositekey']){
                let keyValue = "";
                var key = "";
                var viewDocName = "CompositeUniqueViewDoc";
                let value = "";
                 singleCombination['compositeFields'].forEach(singlefield => {
                   if(doc[singlefield['fieldName']]!==null){
                    if(singlefield['fieldType'] == "TEXT" || singlefield['fieldType'] == "TEXTAREA" ||  
                    singlefield['fieldType'] == "EMAIL"){
                    value = value+'|'+ doc[singlefield['fieldName']].toLowerCase().trim();
                    }else{
                        value = value+'|'+ doc[singlefield['fieldName']];
                    }
                         } else {
                             value = value + '|' + null
                   }

                });

                keyValue = type + singleCombination['compositekey'] + value


                var queryOptions = {
                    key: keyValue,
                    include_docs: true
                };

                return taskList.push(this.db.query(viewDocName, queryOptions)
                    .then(result => {
                        var resultObject = {}
                        resultObject['fieldName'] = singleCombination['compositeFields'];
                        resultObject['compositeName'] = singleCombination['compositeName'];
                        resultObject['queryResult'] = result;
                        return resultObject;
                    }).catch(err => {
                        console.log(err);
                        return {}
                    }));
            }

        });

        return Promise.all(taskList).then(result => {
            result.forEach(element => {
                if (element['queryResult']['rows'].length > 0) {
                    if (action == 'Add') {
                        resultArray.push(element);
                    } else if (action == 'Edit') {
                        if (doc['type'] + '_2_' + doc['id'] !== element['queryResult']['rows'][0]['id']) {
                            resultArray.push(element);
                        }
                    }
                }
            });
            return Promise.resolve(resultArray);
        }).catch(error => {
            console.log(error)
            return Promise.resolve(resultArray);
        });

    }

    vaidateUniqueField(type, doc, uniqueFields, action) {
        var resultArray = []
        const keys = []
        var taskList = []
        uniqueFields.forEach(element => {
            if (doc[element['fieldName']]) {
                const viewDocName = 'UniqueFieldViewDoc'
                let keyValue = "";
                var key = "";
                if(element['fieldType']){
                    if(element['fieldType'] == "TEXT" || element['fieldType'] == "TEXTAREA" ||  
                    element['fieldType'] == "EMAIL" ||  element['fieldType'] == "URL"){
                    key = type + element['fieldName'] + doc[element['fieldName']].toLowerCase()
                    }else{
                        key = type + element['fieldName'] + doc[element['fieldName']]

                    }

                }  
                if(element['isDependentCheckRequired'] && element['isDependentCheckRequired'] == true){
                    keyValue =  doc[element['dependentObjectID']]+ key
                }else{
                    keyValue =  key
                }
                var queryOptions = {
                    key: keyValue,
                    include_docs: true
                };

                return taskList.push(this.db.query(viewDocName, queryOptions)
                    .then(result => {
                        var resultObject = {}
                        resultObject['fieldName'] = element['fieldName'];
                        resultObject['queryResult'] = result;
                        resultObject['status'] = this.success;
                        return resultObject;
                    }).catch(err => {
                        console.log(err);
                        return {'status' : this.failed}
                    }));
            }
        });

        return Promise.all(taskList).then(result => {
            let isViewDocDbCallFailed = false
            result.forEach(element => {
                if(element['status'] === 'FAILED'){
                    isViewDocDbCallFailed = true;

                }else if (element['queryResult']['rows'].length > 0 && element['status'] === 'SUCCESS') {
                    if (action == 'Add') {
                        resultArray.push(element);
                    } else if (action == 'Edit') {
                        if (doc['type'] + '_2_' + doc['id'] !== element['queryResult']['rows'][0]['id']) {
                            resultArray.push(element);
                        }
                    }
                }
            });
            if(isViewDocDbCallFailed){
                return Promise.resolve({
                    status : this.failed,
                    message : 'Something went to wrong, please try again',
                    records : []
                })
            }else{
                return Promise.resolve({
                    status : this.success,
                    message : '',
                    records : resultArray
                });
            }
        }).catch(error => {
            console.log(error)
            return Promise.resolve({
                status : this.failed,
                message : 'Something went to wrong, please try again',
                records : []
            })
        });

    }

    validateUniqueMasterId(isAddEditAction, type, dataObject, uniqueId) {
        var resultArray = []
        const parentDocId = dataObject[uniqueId]
        const viewDocName = "masterdetailview"

        const queryOptions = {

            key: type + this.parseDocId(parentDocId),
            include_docs: true
        };
        return this.db.query(viewDocName, queryOptions).then(result => {
            const resultObject = {}
            resultObject['fieldName'] = uniqueId;
            resultObject['queryResult'] = result;
            if (resultObject['queryResult']['rows'].length > 0) {
                if (isAddEditAction === 'Add') {
                    resultArray.push(resultObject);
                } else if (isAddEditAction === 'Edit') {
                    if (dataObject['type'] + '_2_' + dataObject['id'] !== resultObject['queryResult']['rows'][0]['id']) {
                        resultArray.push(resultObject);
                    }
                }
            }
            return Promise.resolve(resultArray);
        }).catch(err => {
            console.log(err);
            return Promise.resolve(resultArray);
        });
    }

    /* Formula Data Object Fetch Method */

    querySingleFormulaDoc(referenceDetail: ReferenceDetail, docId: string) {
        const finalRes = {}
        return this.makeQueryForSingleFormulaDoc(referenceDetail, docId, finalRes).then(result => {
            
            if (result["status"] === this.success) {
                return Promise.resolve({
                    status: this.success,
                    message: "",
                    records: result["records"]
                });
            } else {
                return Promise.resolve({
                    status: this.failed,
                    message: "Server error. Please contact admin."
                });
            }
        }).catch(err => {
            return this.executeAllDocsCatchBlock(err);

        });

    }
    makeQueryForSingleFormulaDoc(referenceDetail: ReferenceDetail, docId: string, finalRes) {
        let queryOptions = {};
        const type = this.getObjectType(referenceDetail);
        queryOptions = {
            key: this.getDocId(type, docId),
            include_docs: true
        };
        return this.db.allDocs(queryOptions)
            .then(result => {
                if (result["rows"].length > 0) {
                    const data = this.convertRelDocToNormalDoc(result["rows"][0]["doc"]);
                    const type1 = data["type"]
                    if(referenceDetail['formulaField'] || referenceDetail['rollupField']){
                        return this.setFormulaAndRollupField(referenceDetail, data).then(formulaRollupRes => {
                            
                            finalRes[type1] = formulaRollupRes
                            return this.formulaDataObjectRecursiveFetch(result, referenceDetail, finalRes);
                        })
                    }else{
                        finalRes[type1] = data
                        return this.formulaDataObjectRecursiveFetch(result, referenceDetail, finalRes);
                    }
                }
                return this.formulaDataObjectRecursiveFetch(result, referenceDetail, finalRes);
            })
            .catch(err => {
                return this.executeAllDocsCatchBlock(err);

            });
    }

    setFormulaAndRollupField(referenceDetail, data) {
        const formulaObject = referenceDetail["formulaField"]
        const rollUpObject = referenceDetail["rollupField"]
        const formulaQuery = [];
        const rollUpQuery = [];
        const objectType = this.getObjectType(referenceDetail);
        if (formulaObject) {
            formulaQuery.push(objectType + 'formula' + data["id"])
        }
        if (rollUpObject) {
            rollUpQuery.push(objectType + 'rollup' + data["id"])
        }
        if (formulaQuery.length > 0) {
            return this.formulaCouchDbProvider.fetchformulaValue(formulaQuery).then(result => {
                if (result && result['status'] && result['records'] && result['status'] == this.success && result['records'].length > 0) {
                    result = result['records']
                    result.forEach(element => {
                        element = element['doc']['data']
                        formulaObject.forEach(fieldName => {
                            data[fieldName['fieldName'] + appConstant['customFieldSuffix']['formula']] = element[fieldName['fieldName']]
                        })
                    });
                    return data
                } else {
                    return data
                }
            })
        }
        if (rollUpQuery.length > 0) {
            return this.formulaCouchDbProvider.fetchRollUpValue(rollUpQuery).then(result => {
                if (result['status'] == this.success && result['records'].length > 0) {
                    result = result['records']
                    result.forEach(element => {
                        element = element['doc']['data']
                        rollUpObject.forEach(fieldName => {
                            data[fieldName['fieldName'] + appConstant.customFieldSuffix.rollup_summary] = element[fieldName['fieldName']]
                        })
                    });
                    return data
                } else {
                    return data
                }
            })
        }
        return data
    }

    formulaDataObjectRecursiveFetch(result, referenceDetail, finalRes) {
        const childJsonArray = referenceDetail['childObject'];


        const taskList = [];
        for (let i = 0; i < result["rows"].length; i++) {
            if (result["rows"][i]["doc"]) {

                const data = this.convertRelDocToNormalDoc(result["rows"][i]["doc"]);

                if (referenceDetail['objectType'] && referenceDetail['objectType'].toUpperCase() === "LOOKUP") {
                    const idArray = []
                    taskList.push(this.queryFormulaLookups(idArray, referenceDetail['objectId'], referenceDetail['fieldId']).then(res => {

                        if (res["response"]["rows"].length > 0) {
                            const data1 = this.convertRelDocToNormalDoc(res["response"]["rows"][0]["doc"]);
                            const type = "pfm" + res["objectId"] + "_" + res["fieldId"]
                            finalRes[type] = data1
                        }
                    }));

                } else if (referenceDetail['relationShipType']
                    && (referenceDetail['relationShipType'].toUpperCase() === "ONE_TO_ONE"
                        || referenceDetail['relationShipType'].toUpperCase() === "ONE_TO_MANY")) {
                    for (let j = 0; j < childJsonArray.length; j++) {
                        const idArray = []
                        if (childJsonArray[j]["objectType"].toUpperCase() === "LOOKUP") {
                            let fieldId = ""
                            let lookupObjectName = ""
                            if (isNaN(childJsonArray[j]['fieldId'])) {
                                lookupObjectName = childJsonArray[j]['objectId'];
                                fieldId = childJsonArray[j]['fieldId'];
                            } else {
                                lookupObjectName = "pfm" + childJsonArray[j]['objectId'];
                                fieldId = lookupObjectName + "_" + childJsonArray[j]['fieldId'];
                            }
                            if (data[fieldId]) {
                                idArray.push(lookupObjectName + "_2_" + data[fieldId])
                                taskList.push(this.queryFormulaLookups(idArray,
                                    lookupObjectName, fieldId).then(res => {
                                        if (res["response"]["rows"].length > 0) {
                                            const data1 = this.convertRelDocToNormalDoc(res["response"]["rows"][0]["doc"]);
                                            const type = res["fieldId"]
                                            finalRes[type] = data1
                                        }
                                    }));
                            }
                        } else {
                            let key = "";
                            if (childJsonArray[j]['objectId'].includes('pfm')) {
                                key = childJsonArray[j]['objectId']
                            } else {
                                key = "pfm" + childJsonArray[j]['objectId'];
                            }
                            if (data[key]) {
                                idArray.push(key + "_2_" + data[key])
                                const idValue = key + "_2_" + data[key]
                                taskList.push(this.makeQueryForSingleFormulaDoc(childJsonArray[i], idValue, finalRes))
                            }
                        }
                    }
                }
            }
        }
        return Promise.all(taskList).then(allRes => {
            return this.taskListResponse(finalRes);
        });
    }

    private taskListResponse(finalRes) {
        return Promise.resolve({
            status: this.success,
            message: "",
            records: finalRes
        });
    }

    queryFormulaLookups(lookupId, objectId, fieldId) {
        return this.db.allDocs({ include_docs: true, keys: lookupId }).then(res => {
            return Promise.resolve({
                response: res,
                objectId: objectId,
                fieldId: fieldId
            });
        });
    }


    /* Formula Data Object Fetch Method */
    fetchFormulaDataObject(formulaReverseObjectHierarchyJSON: ReferenceDetail,
        objectHierarchyJSON: ReferenceDetail, dataObject: any, finalRes) {
        const docId = dataObject["id"]
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
                    if (formulaReverseObjectHierarchyJSON['objectId'].includes('pfm')) {
                        objectkey = formulaReverseObjectHierarchyJSON['objectId']
                    } else {
                        objectkey = "pfm" + formulaReverseObjectHierarchyJSON['objectId'];
                    }
                    const formulaObjectAvailable = formulaInvolvedObjectArray.includes(objectkey)
                    if (formulaObjectAvailable) {
                        finalRes[objectkey] = dataObject
                    }
                    const childJsonArray = formulaReverseObjectHierarchyJSON['childObject'];
                    // Get Formula Object from DataObject using Hierarchy JSON
                    return this.fetchRecursiveFormulaObjectUsingHierarchy(formulaInvolvedObjectArray,
                        dataObject, childJsonArray, finalRes).then(resultObject => {
                            if (resultObject["status"] === this.success) {
                                const resultObjectValue = resultObject["records"]
                                const dataObjectKeys = Object.keys(resultObjectValue);
                                // Get Formula Object using Formula Reverse Hierarchy JSON
                                return this.fetchFormulaObjectUsingReverseHierarchy(dataObjectKeys,
                                    formulaReverseObjectHierarchyJSON, finalRes, docId).
                                    then(finalResult => {
                                        // Final Return Response
                                        if (finalResult["status"] === this.success) {
                                            return Promise.resolve({
                                                status: this.success,
                                                message: "",
                                                records: finalResult["records"]
                                            });
                                        } else {
                                            return this.serverErrorBlock();
                                        }
                                    }).catch(err => {
                                        return this.serverErrorBlock();
                                    });
                            } else {
                                return this.serverErrorBlock();
                            }
                        }).catch(err => {
                            return this.serverErrorBlock();
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
                return this.serverErrorBlock();
            }
        }).catch(err => {
            return this.serverErrorBlock();
        });
    }

    private serverErrorBlock() {
        return Promise.resolve({
            status: this.failed,
            message: "Server error. Please contact admin."
        });
    }



    /* Get Formula Involved Objects */
    getFormulaInvolvedObjects(childObjects, objectArray) {
        const taskList = []
        if(childObjects.length > 0){
            for (let j = 0; j < childObjects.length; j++) {
                if (childObjects[j]["objectType"].toUpperCase() === "LOOKUP") {
                    let fieldId = ""
                    let lookupObjectName = ""
                    if (childObjects[j]['objectId'].includes('pfm')) {

                        fieldId = childObjects[j]['fieldId'];
                    } else {
                        lookupObjectName = "pfm" + childObjects[j]['objectId'];
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
                // if (objectArray.length > 0) {
                return Promise.resolve({
                    status: this.success,
                    message: "",
                    records: objectArray
                });
                // } else {
                //     return Promise.resolve({
                //         status: this.failed,
                //         message: "Server error. Please contact admin.",
                //     });
                // }
            });
        } else {
            return Promise.resolve({
                status: this.success,
                message: "",
                records: []
            });

        }
    }

    // Get Formula Object from DataObject using Hierarchy JSON
    fetchRecursiveFormulaObjectUsingHierarchy(formulaObjectArray, resultObject: any, childObjects, finalRes) {
        const taskList = [];
        if (childObjects.length > 0) {
            for (let j = 0; j < childObjects.length; j++) {
                if (childObjects[j]["objectType"].toUpperCase() === "LOOKUP") {
                    let fieldId = ""
                    let lookupObjectName = ""
                    if (childObjects[j]['objectId'].includes('pfm')) {

                        fieldId = childObjects[j]['fieldId'];
                    } else {
                        lookupObjectName = "pfm" + childObjects[j]['objectId'];
                        fieldId = lookupObjectName + "_" + childObjects[j]['fieldId'];
                    }
                    const formulaObjectAvailable = formulaObjectArray.includes(fieldId)
                    if (formulaObjectAvailable) {
                        const lookupObject = resultObject[fieldId]
                        finalRes[fieldId] = lookupObject
                        if(typeof lookupObject === 'string'){
                            let objectType = this.getObjectType(childObjects[j]);
                            let dataId = [this.db.rel.makeDocID({ 'type': objectType, 'id': lookupObject })];
                            taskList.push(this.fetchDocsWithDocIds(dataId).then(data=>{
                                if(data.status === 'SUCCESS'){
                                    finalRes[fieldId] =data['response'];
                                }
                            }))
                        }
                    }
                    // const childJsonArray = childObjects[j]['childObject'];
                    // if (childJsonArray.length > 0) {
                    //     taskList.push(this.fetchRecursiveFormulaObjectUsingHierarchy
                    //         (formulaObjectArray, lookupObject, childJsonArray, finalRes))
                    // }
                } else {
                    let key = "";
                    if (childObjects[j]['objectId'].includes('pfm')) {
                        key = childObjects[j]['objectId']
                    } else {
                        key = "pfm" + childObjects[j]['objectId'];
                    }

                    const dataObject = resultObject[key]
                    const formulaObjectAvailable = formulaObjectArray.includes(key)
                    if (formulaObjectAvailable) {
                        finalRes[key] = dataObject
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
        } else {
            return Promise.resolve({
                status: this.success,
                message: "",
                records: []
            });
        }
    }

    // Get Formula Object using Formula Reverse Hierarchy JSON
    fetchFormulaObjectUsingReverseHierarchy(dataObjectKeys, objectReverseHierarchyJSON, finalRes, docId) {
        let key = "";
        if (objectReverseHierarchyJSON['objectId'].includes('pfm')) {
            key = objectReverseHierarchyJSON['objectId']
        } else {
            key = "pfm" + objectReverseHierarchyJSON['objectId'];
        }
        const taskList = []
        const valueAvailable = dataObjectKeys.includes(key)
        if (valueAvailable) {
            return this.fetchFormulaRecursiveUsingReverseHierarchy(objectReverseHierarchyJSON, finalRes).then(result => {
                if (result["status"] === this.success) {
                    return Promise.resolve({
                        status: this.success,
                        message: "",
                        records: finalRes
                    });
                } else {
                    return Promise.resolve({
                        status: this.failed,
                        message: ""
                    });
                }
            })
        } else {
            let queryOptions = {};
            const type = this.getObjectType(objectReverseHierarchyJSON);
            queryOptions = {
                key: this.getDocId(type, docId),
                include_docs: true
            };
            this.db.allDocs(queryOptions).then(result => {
                if (result["rows"].length > 0) {
                    const data = this.convertRelDocToNormalDoc(result["rows"][0]["doc"]);
                    const type1 = data["type"]
                    finalRes[type1] = data
                    // taskList.push()
                    return this.fetchFormulaRecursiveUsingReverseHierarchy(objectReverseHierarchyJSON, finalRes).then(fetchResult => {
                        if (fetchResult["status"] === this.success) {
                            return Promise.resolve({
                                status: this.success,
                                message: "",
                                records: finalRes
                            });
                        } else {
                            return Promise.resolve({
                                status: this.failed,
                                message: ""
                            });
                        }
                    })
                }
            })
        }
    }

    fetchFormulaRecursiveUsingReverseHierarchy(objectReverseHierarchyJSON, finalRes) {
        const dataObjectKeys = Object.keys(finalRes);
        const childObjects = objectReverseHierarchyJSON["childObject"]
        let data = {}
        if (objectReverseHierarchyJSON["objectType"].toUpperCase() === "LOOKUP") {
            let fieldId = ""
            let lookupObjectName = ""
            if (objectReverseHierarchyJSON['objectId'].includes('pfm')) {

                fieldId = objectReverseHierarchyJSON['fieldId'];
            } else {
                lookupObjectName = "pfm" + objectReverseHierarchyJSON['objectId'];
                fieldId = lookupObjectName + "_" + objectReverseHierarchyJSON['fieldId'];
            }
            data = finalRes[fieldId]
        } else {
            let key = "";
            if (objectReverseHierarchyJSON['objectId'].includes('pfm')) {
                key = objectReverseHierarchyJSON['objectId']
            } else {
                key = "pfm" + objectReverseHierarchyJSON['objectId'];
            }
            data = finalRes[key]
        }
        const taskList = []
        for (let j = 0; j < childObjects.length; j++) {
            const idArray = []
            let objectName;
            if (childObjects[j]["objectType"].toUpperCase() === "LOOKUP") {
                let fieldId = ""
                let lookupObjectName = ""
                if (childObjects[j]['objectId'].includes('pfm')) {

                    fieldId = childObjects[j]['fieldId'];
                } else {
                    lookupObjectName = "pfm" + childObjects[j]['objectId'];
                    fieldId = lookupObjectName + "_" + childObjects[j]['fieldId'];
                }
                objectName = fieldId
            } else {
                let objectKey = "";
                if (childObjects[j]['objectId'].includes('pfm')) {
                    objectKey = childObjects[j]['objectId']
                } else {
                    objectKey = "pfm" + childObjects[j]['objectId'];
                }
                objectName = objectKey
            }
            const valueAvailable = dataObjectKeys.includes(objectName)
            if (valueAvailable) {
                taskList.push(this.fetchFormulaRecursiveUsingReverseHierarchy(childObjects[j], finalRes))
            } else {
                if (data[objectName] !== undefined && data[objectName] !== null && data[objectName] !== "") {
                    const idValue = objectName + "_2_" + data[objectName]
                    let queryOptions = {};
                    const type = this.getObjectType(childObjects[j]);
                    queryOptions = {
                        key: this.getDocId(type, idValue),
                        include_docs: true
                    };
                    taskList.push(this.db.allDocs(queryOptions).then(result => {
                        if (result["rows"].length > 0) {
                            const dataValue = this.convertRelDocToNormalDoc(result["rows"][0]["doc"]);
                            const type1 = dataValue["type"]
                            finalRes[type1] = dataValue
                            taskList.push(this.fetchFormulaRecursiveUsingReverseHierarchy(childObjects[j], finalRes))
                        }
                    }))
                }

            }
        }

        return Promise.all(taskList).then(allRes => {
            return this.taskListResponse(finalRes);
        });
    }

    private finalResult(finalResult) {
        return Promise.resolve({
            status: this.success,
            message: "",
            records: finalResult["records"]
        });

    }



    private failedResult() {
        return Promise.resolve({
            status: this.failed,
            message: "Server error. Please contact admin.",
        });
    }

    /* For Entry Page */
    fetchFormulaObjectForParent(formulaReverseHierarchyJSON, parentName, parentId, finalRes) {
        let objectKey = "";
        if (formulaReverseHierarchyJSON['objectId'].includes('pfm')) {
            objectKey = formulaReverseHierarchyJSON['objectId']
        } else {
            objectKey = "pfm" + formulaReverseHierarchyJSON['objectId'];
        }
        const childObjects = formulaReverseHierarchyJSON["childObject"]
        const taskList = []
        if (objectKey === parentName) {
            return this.querySingleFormulaDoc(formulaReverseHierarchyJSON, parentId).
                then(finalResult => {
                    if (finalResult["status"] === this.success) {
                        return this.finalResult(finalResult);

                    } else {
                        return this.failedResult();
                    }
                })
        } else {
            return this.recursiveFetchFormulaObjectForParent(childObjects, finalRes, parentName, parentId).then(finalResult => {
                if (finalResult["status"] === this.success) {
                    return this.finalResult(finalResult);
                } else {
                    return this.failedResult();
                }
            })
        }
    }

    recursiveFetchFormulaObjectForParent(childObjects, finalRes, parentName, parentId) {
        const taskList = [];
        if(childObjects.length >0){
            for (let j = 0; j < childObjects.length; j++) {
                if (childObjects[j]["objectType"].toUpperCase() === "LOOKUP") {
                    let fieldId = ""
                    let lookupObjectName = ""
                    if (childObjects[j]['objectId'].includes('pfm')) {
                        fieldId = childObjects[j]['fieldId'];
                    } else {
                        lookupObjectName = "pfm" + childObjects[j]['objectId'];
                        fieldId = lookupObjectName + "_" + childObjects[j]['fieldId'];
                    }
                    if (parentName === fieldId) {
                        return this.querySingleFormulaDoc(childObjects[j], parentId).
                            then(finalResult => {
                                if (finalResult["status"] === this.success) {
                                    return Promise.resolve({
                                        status: this.success,
                                        message: "",
                                        records: finalResult["records"]
                                    });
                                } else {
                                    return this.failedResult();
                                }
                            })
                    } else {

                        const childJSONObjects = childObjects[j]["childObject"]
                        taskList.push(this.recursiveFetchFormulaObjectForParent(childJSONObjects, parentId, parentName, parentId))
                    }

                } else {
                    let objectKey = "";
                    if (childObjects[j]['objectId'].includes('pfm')) {
                        objectKey = childObjects[j]['objectId']
                    } else {
                        objectKey = "pfm" + childObjects[j]['objectId'];
                    }
                    if (parentName === objectKey) {
                        return this.querySingleFormulaDoc(childObjects[j], parentId).
                            then(finalResult => {
                                if (finalResult["status"] === this.success) {
                                    return this.finalResult(finalResult);

                                } else {
                                    return Promise.resolve({
                                        status: this.failed,
                                        message: "Server error. Please contact admin.",
                                    });
                                }
                            })
                    } else {
                        const childJSONObjects = childObjects[j]["childObject"]
                        taskList.push(this.recursiveFetchFormulaObjectForParent(childJSONObjects, parentId, parentName, parentId))
                    }
                }
            }
        } else   {
            return Promise.resolve({
                status: this.success,
                message: "",
                records: []
            })
        }
    }
    fetchRecordsBySearchFilterPhrases(query, hierarchyJson, isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = []) {
        return this.fetchRecordsUsingSearchDesignDocs(query, hierarchyJson,isLazyLoadEnabled, listenerName,mainResult).then(result => {
            return { "status": this.success, "records": result }
        }).catch(error => {
            console.log('error==>' + error);
            return { "status": this.failed, "message": "Server error. Please contact admin." };
        });
    }

    fetchRecordsUsingSearchDesignDocs(query, hierarchyJson, isLazyLoadEnabled: boolean = false, listenerName: string = '', mainResult: Array<any> = []) {
        let objectName = ""
        if (isNaN(hierarchyJson['objectId'])) {
            objectName = hierarchyJson['objectId']
        } else {
            objectName = "pfm" + hierarchyJson['objectId']
        }
        const designDocName = objectName + "_search";
        return this.callSearchDesignDocs(query, designDocName).then(response => {

            return this.handleResponse(response, hierarchyJson, isLazyLoadEnabled, listenerName,mainResult);
        })
            .catch(error => {
                console.log('error==>' + error);
                return { "status": this.failed, "message": "Server error. Please contact admin." };
            });
    }

    fetchGlobalSearchRecords(query, designDocName, searchKey) {
        return this.callSearchDesignDocs(query, designDocName).then(response => {

            if (response['rows'] && response['rows'].length > 0) {
                return Promise.resolve({ "status": this.success, "records": this.handleGlobalSearchResponse(response['rows']), "searchKey": searchKey })
            }

            return Promise.resolve({ "status": this.success, "records": [], "message": "No records found", "searchKey": searchKey })
        })
            .catch(error => {
                console.log('error==>' + error);
                return Promise.resolve({ "status": this.failed, "message": "Server error. Please contact admin.", "searchKey": searchKey });
            });
    }

    handleGlobalSearchResponse(responseArray) {
        let resultArray = []
        responseArray.forEach(element => {
            resultArray.push(this.convertRelDocToNormalDoc(element['doc']))
        });
        return resultArray
    }
    callSearchDesignDocsForFilter(query, designDocName, response?, queryFlags?: { include_docs: boolean, include_fields: Array<string> }) {
        let postParam = {}
        let responseInfo = {
            "rows": [],
            "bookmark": ""
        }
        if (response) {
            postParam = {
                "q": query,
                "include_docs": true,
                "limit": this.batchLimit,
                "bookmark": response['bookmark']
            }
            responseInfo['rows'] = response['rows']
        } else {
            postParam = {
                "q": query,
                "include_docs": true,
                "limit": this.batchLimit
            }
        }
        if (queryFlags) {
            if (queryFlags['include_docs'] !== undefined && queryFlags['include_docs'] === false) {
                postParam['include_docs'] = false;
            }
            if (queryFlags['include_fields'] !== undefined && queryFlags['include_fields'].length > 0) {
                postParam['include_fields'] = queryFlags['include_fields'];
            }else{
                postParam['include_fields'] = []
            }
        }

        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.dbConfiguration)
        
        return new Promise(resolve => {
            const url = this.dbConfiguration.remoteDbUrl + this.dbConfiguration.configuration.databaseName
                + "/_design/" + designDocName + "/_search/" + designDocName;
            this.httpClient.post(url, postParam, headerstring).toPromise()
                .then(res => {
                    const jsonObj = res

                    if (jsonObj['rows'].length < this.batchLimit) {
                        Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                        return resolve(responseInfo)
                    } else {
                        Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                        responseInfo['bookmark'] = jsonObj['bookmark']
                        if (queryFlags) {
                            return resolve(this.callSearchDesignDocsForFilter(query, designDocName, responseInfo, queryFlags));
                        } else {
                            return resolve(this.callSearchDesignDocsForFilter(query, designDocName, responseInfo));
                        }
                    }
                }, error => {
                    console.log('error==>' + error)
                    return resolve({ 'status': this.failed, 'message': 'Server error. Please contact admin.' })
                })
        })
    }
    callSearchDesignDocs(query, designDocName, response?, queryFlags?: { include_docs: boolean, include_fields: boolean }) {
        let postParam = {}
        let responseInfo = {
            "rows": [],
            "bookmark": ""
        }
        if (response) {
            postParam = {
                "q": query,
                "include_docs": true,
                "limit": this.batchLimit,
                "bookmark": response['bookmark']
            }
            responseInfo['rows'] = response['rows']
        } else {
            postParam = {
                "q": query,
                "include_docs": true,
                "limit": this.batchLimit
            }
        }
        if (queryFlags) {
            if (queryFlags['include_docs'] !== undefined && queryFlags['include_docs'] === false) {
                postParam['include_docs'] = false;
            }
            if (queryFlags['include_fields'] !== undefined && queryFlags['include_fields'] === false) {
                postParam['include_fields'] = [];
            }
        }

        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.dbConfiguration)
        
        return new Promise(resolve => {
            const url = this.dbConfiguration.remoteDbUrl + this.dbConfiguration.configuration.databaseName
                + "/_design/" + designDocName + "/_search/" + designDocName;
            this.httpClient.post(url, postParam, headerstring).toPromise()
                .then(res => {
                    
                    const jsonObj = res

                    if (jsonObj['rows'].length < this.batchLimit) {
                        Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                        return resolve(responseInfo)
                    } else {
                        Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                        responseInfo['bookmark'] = jsonObj['bookmark']
                                                  return resolve(this.callSearchDesignDocs(query, designDocName, responseInfo));
                        }
                }, error => {
                    console.log('error==>' + error)
                    return resolve({ 'status': this.failed, 'message': 'Server error. Please contact admin.' })
                })
        })
    }

    // Method used to fetch record for online table with pagination
    searchRecordsWithPagination(query, hierarchyJson, sort, pagination: { limit: number, offset: number, bookmark: string }, isLazyLoadEnabled: boolean = false, listenerName: string = '') {
        const designDocName = this.getObjectType(hierarchyJson) + "_search";
        return this.callSearchDesignDocsWithPagination(query, designDocName, pagination.limit, sort, pagination.bookmark).then(response => {
            return this.handleResponse(response, hierarchyJson, isLazyLoadEnabled, listenerName, []).then(result => {
                return Promise.resolve({ "status": this.success, "records": result, bookmark: response['bookmark'], total_rows: response['total_rows'] })
            });
        }).catch(error => {
            console.log('error==>' + error);
            return { "status": this.failed, "message": "Server error. Please contact admin." };
        });
    }
        /**
     * This method used to update the fetched data to respective layouts
     * @param isLazyLoadEnabled boolean value to update required to layout
     * @param listenerName identifier of listener
     * @param updatedData modified data need to be update in layout
     */
         emitFetchedData(isLazyLoadEnabled: boolean = false, listenerName: string = '', updatedData: Array<any> = [], status: 'started' | 'finished' | 'updated' | '' = '') {
            if (isLazyLoadEnabled) {
                let emitData = {
                    data: updatedData
                }
                if (status) {
                    emitData['status'] = status
                }
                setTimeout(() => {
                    this.observableListenerUtils.emit(listenerName, emitData)
                }, 0);
            }
        }

    callSearchDesignDocsWithPagination(query, designDocName, limit, sort , bookmark?) {
        const postParam = {
            "q": query,
            "include_docs": true,
            "include_fields": [],
            limit: limit,
            sort : sort
        }

        if (bookmark) {
            postParam["bookmark"] = bookmark
        }

       

        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.dbConfiguration)
        
        return new Promise(resolve => {
            const url = this.dbConfiguration.remoteDbUrl + this.dbConfiguration.configuration.databaseName
                + "/_design/" + designDocName + "/_search/" + designDocName;
            this.httpClient.post(url, postParam, headerstring).toPromise()
                .then(res => {
                    const jsonObj = res
                    return resolve(jsonObj)
                }, error => {
                    console.log('error==>' + error)
                    return resolve({ 'status': this.failed, 'message': 'Server error. Please contact admin.' })
                })
        })
    }

    fetchObjectIdsBasedOnFilterQuery(reverseHierarchyJsonArray, queryJson, objectName) {
        let taskList = [];
        let childFetchResult: any = [];
        let lookupFetchResult: any = [];
        let headerFetchResult: any = [];
        if (reverseHierarchyJsonArray && reverseHierarchyJsonArray.length > 0) {
            reverseHierarchyJsonArray.forEach(reverseHierarchyJson => {
                taskList.push(this.recursiveFetchForFilterQuery(reverseHierarchyJson, queryJson).then(childResult => {
                    if (childResult && childResult['lookupFetchResult']) {
                        lookupFetchResult.push(childResult);
                    } else if (childResult && childResult['headerFetchResult']) {
                        headerFetchResult.push(childResult);
                    } else {
                        childFetchResult.push(childResult);
                    }
                }));
            });
        }
        return Promise.all(taskList).then(async result => {
            if (childFetchResult && childFetchResult.length > 0) {
                if (childFetchResult.length > 1) {
                    childFetchResult = this.getCommonIdsFromIdArray(lodash.flatten(childFetchResult), childFetchResult.length);
                } else {
                    childFetchResult = lodash.flatten(childFetchResult);
                }
            }
            if (queryJson[objectName + "formula"] || queryJson[objectName + "rollup"]) {
                childFetchResult = await this.fetchReferenceIdsBasedOnFormulaQuery(queryJson, objectName, childFetchResult);
                if (childFetchResult.length === 0) {
                    childFetchResult.push([]);
                }
            }
            if (lookupFetchResult && lookupFetchResult.length > 0) {
                let tempLookupFetchResult = await this.fetchLookupAndHeaderObjectFromPrimaryObject(lookupFetchResult, objectName, 'lookup');
                if (childFetchResult && childFetchResult.length > 0) {
                    childFetchResult = lodash.intersection(childFetchResult, tempLookupFetchResult);
                } else {
                    childFetchResult = [...tempLookupFetchResult]
                }
            }
            if (headerFetchResult && headerFetchResult.length > 0) {
                let tempHeaderFetchResult = await this.fetchLookupAndHeaderObjectFromPrimaryObject(headerFetchResult, objectName, 'header');
                if (childFetchResult && childFetchResult.length > 0) {
                    childFetchResult = lodash.intersection(childFetchResult, tempHeaderFetchResult);
                } else {
                    childFetchResult = [...tempHeaderFetchResult]
                }
            }
            if (childFetchResult && childFetchResult.length > 0) {
                return Promise.resolve(lodash.flattenDeep(childFetchResult));
            } else {
                return Promise.resolve();
            }
        }).catch(error => {
            return this.catchBlockError(error);
        });
    }

    getObjectIdsBasedOnFilterQuery(reverseHierarchyJson: { [path: string]: ObjectHierarchy }, objectName) {
        let taskList = [];
        let childFetchResult: any = [];
        let lookupFetchResult: any = [];
        let headerFetchResult: any = [];
        let primaryRootKey = "";
        Object.keys(reverseHierarchyJson).forEach(reverseJsonKey => {
            if (reverseJsonKey.includes("$$")) {
                taskList.push(this.recursiveFetchForFilterQueryUsingHierarchy(reverseHierarchyJson[reverseJsonKey]).then(childResult => {
                    if (childResult && childResult['lookupFetchResult']) {
                        lookupFetchResult.push(childResult);
                    } else if (childResult && childResult['headerFetchResult']) {
                        headerFetchResult.push(childResult);
                    } else {
                        childFetchResult.push(childResult);
                    }
                }));
            }else{
                primaryRootKey=reverseJsonKey;
            }
        })
        return Promise.all(taskList).then(async result => {
            if (childFetchResult && childFetchResult.length > 0) {
                if (childFetchResult.length > 1) {
                    childFetchResult = this.getCommonIdsFromIdArray(lodash.flatten(childFetchResult), childFetchResult.length);
                } else {
                    childFetchResult = lodash.flatten(childFetchResult);
                }
            }
            if (primaryRootKey && reverseHierarchyJson[primaryRootKey] && (reverseHierarchyJson[primaryRootKey]["options_formula"] || reverseHierarchyJson[primaryRootKey]["options_rollup"])) {
                childFetchResult = await this.fetchReferenceIdsBasedOnFormulaQueryUsingObjectHierarchy(reverseHierarchyJson[primaryRootKey], objectName, childFetchResult);
                if (childFetchResult.length === 0) {
                    childFetchResult.push([]);
                }
            }
            if (lookupFetchResult && lookupFetchResult.length > 0) {
                let tempLookupFetchResult = await this.fetchLookupAndHeaderObjectFromPrimaryObject(lookupFetchResult, objectName, 'lookup');
                if (childFetchResult && childFetchResult.length > 0) {
                    childFetchResult = lodash.intersection(childFetchResult, tempLookupFetchResult);
                } else {
                    childFetchResult = [...tempLookupFetchResult]
                }
            }
            if (headerFetchResult && headerFetchResult.length > 0) {
                let tempHeaderFetchResult = await this.fetchLookupAndHeaderObjectFromPrimaryObject(headerFetchResult, objectName, 'header');
                if (childFetchResult && childFetchResult.length > 0) {
                    childFetchResult = lodash.intersection(childFetchResult, tempHeaderFetchResult);
                } else {
                    childFetchResult = [...tempHeaderFetchResult]
                }
            }
            if (childFetchResult && childFetchResult.length > 0) {
                return Promise.resolve(lodash.flattenDeep(childFetchResult));
            } else {
                return Promise.resolve();
            }
        }).catch(error => {
            return this.catchBlockError(error);
        });
    }

    fetchLookupAndHeaderObjectFromPrimaryObject(fetchResult: Array<any>, objectName: string, objectType: 'lookup' | 'header') {
        let taskList = [];
        let tempResult = [];
        const queryFlags = {
            "include_docs": false,
            "include_fields": []
        }
        fetchResult.forEach(item => {
            if (item[objectType + 'FetchResult'] && item[objectType + 'FetchResult']['fieldName'] && item[objectType + 'FetchResult']['ids'] && item[objectType + 'FetchResult']['ids'].length > 0) {
                let query = "";
                let designDocName = objectName + "_search"
                let batchwiseLookupIdArray = lodash.chunk(item[objectType + 'FetchResult']['ids'], this.batchIdLimit);
                batchwiseLookupIdArray.forEach(lookupIdArray => {
                    query = "type : " + objectName + " AND " + item[objectType + 'FetchResult']['fieldName'] + " : " + this.makeDocIdArrayToString(lodash.uniq(lookupIdArray));
                    // taskList.push(this.callSearchDesignDocs(query, designDocName).then(lookupResult => {
                    taskList.push(this.callSearchDesignDocsForFilter(query, designDocName, '', queryFlags).then(lookupResult => {
                        if (lookupResult && lookupResult['rows'] && lookupResult['rows'].length > 0) {
                            lookupResult['rows'].forEach(row => {
                                // if (row['doc'] && row['doc']['_id']) {
                                //     tempResult.push(row['doc']['_id']);
                                // }
                                if (row && row['id']) {
                                    tempResult.push(row['id']);
                                }
                            })
                        } else {
                            return []
                        }
                    }))
                })
            }
        })
        return Promise.all(taskList).then(result => {
            if (fetchResult && fetchResult.length === 1) {
                return lodash.uniq(tempResult);
            } else {
                tempResult = this.getCommonIdsFromIdArray(tempResult, fetchResult.length)
                return lodash.uniq(tempResult);
            }
        }).catch(error => {
            return this.catchBlockError(error);
        });
    }

    getCommonIdsFromIdArray(idArray: Array<any>, objectCount: number) {
        let groupedResult = lodash.groupBy(idArray);
        let groupedResultKeys = Object.keys(groupedResult);
        idArray = groupedResultKeys.filter(key => {
            if (groupedResult[key].length >= objectCount) {
                return key
            }
        })
        return idArray
    }

    recursiveFetchForFilterQuery(reverseHierarchyJson, queryJson, parentIds?: string[], lookupFieldName?: string, lookupIds?: string[]) {
        let objectName = ""
        if (reverseHierarchyJson['objectId'].includes('pfm')) {
            objectName = reverseHierarchyJson['objectId']
        } else {
            objectName = "pfm" + reverseHierarchyJson['objectId']
        }
        queryJson['isCorUser'] = (reverseHierarchyJson['objectName'] === "COR_USERS" || reverseHierarchyJson['objectName'] === "LOGGEDUSER"  || reverseHierarchyJson['objectName'] === "COR_APPLICATIONS" );
        return this.queryAndFetch(queryJson, objectName, parentIds, lookupFieldName, lookupIds).then(parentRes => {
            let idArray = [];
            let lookupIdArray = [];
            let lookupFieldKey: string;
            if (parentRes && parentRes.length > 0) {
                parentRes.forEach(result => {
                    if (reverseHierarchyJson['relationShipType'] && (reverseHierarchyJson['relationShipType'].toUpperCase() === "ONE_TO_ONE"
                        || reverseHierarchyJson['relationShipType'].toUpperCase() === "ONE_TO_MANY")) {
                        let key = "";
                        if (reverseHierarchyJson['childObject'][0]['objectId'].includes('pfm')) {
                            key = reverseHierarchyJson['childObject'][0]['objectId']
                        } else {
                            key = "pfm" + reverseHierarchyJson['childObject'][0]['objectId'];
                        }
                        if (result && result['doc'] && result['doc']['data'] && result['doc']['data'][key]) {
                            idArray.push(key + "_2_" + result['doc']['data'][key])
                        }
                    } else if (reverseHierarchyJson['objectType'] && (reverseHierarchyJson['objectType'].toUpperCase() == "LOOKUP"
                        || reverseHierarchyJson['objectType'].toUpperCase() == "HEADER")) {
                        let key = "";
                        if (reverseHierarchyJson['objectId'].includes('pfm')) {
                            key = reverseHierarchyJson['objectId']
                        } else {
                            key = "pfm" + reverseHierarchyJson['objectId'];
                        }
                        if (result && result['doc'] && result['doc']['_id']) {
                            lookupIdArray.push(result['doc']['_id'].replace(key + "_2_", ""))
                        }
                        if (key) {
                            if (reverseHierarchyJson['objectType'].toUpperCase() == "LOOKUP" && reverseHierarchyJson['fieldId']) {
                                lookupFieldKey = key + "_" + reverseHierarchyJson['fieldId'];
                            } else if (reverseHierarchyJson['objectType'].toUpperCase() == "HEADER") {
                                lookupFieldKey = key;
                            }
                        }
                    }
                });
                const childJsonArray = reverseHierarchyJson['childObject'];
                if (reverseHierarchyJson['objectType'] && reverseHierarchyJson['objectType'].toUpperCase() == "LOOKUP" && childJsonArray.length > 0 &&
                    childJsonArray[0]['childObject'].length === 0) {
                    return { "lookupFetchResult": { "fieldName": lookupFieldKey, "ids": lodash.uniq(lookupIdArray) } }
                } else if (reverseHierarchyJson['objectType'] && reverseHierarchyJson['objectType'].toUpperCase() == "HEADER" &&
                    (reverseHierarchyJson['childObject'].length === 0 || (childJsonArray.length > 0 && childJsonArray[0]['childObject'].length === 0))) {
                    return { "headerFetchResult": { "fieldName": lookupFieldKey, "ids": lodash.uniq(lookupIdArray) } }
                } else if (childJsonArray.length > 0 && childJsonArray[0]['objectType'] && childJsonArray[0]['objectType'].toUpperCase() !== "PRIMARY") {
                    if (idArray && idArray.length > 0) {
                        idArray = lodash.uniq(idArray);
                    }
                    if (lookupIdArray && lookupIdArray.length > 0) {
                        lookupIdArray = lodash.uniq(lookupIdArray);
                    }
                    return this.recursiveFetchForFilterQuery(childJsonArray[0], queryJson, idArray, lookupFieldKey, lookupIdArray).then(childRes => {
                        return childRes;
                    })
                } else if (childJsonArray.length > 0 && childJsonArray[0]['childObject'].length === 0) {
                    return lodash.uniq(idArray);
                }
            } else {
                return [];
            }
        });
    }

    recursiveFetchForFilterQueryUsingHierarchy(objectHierarchy: ObjectHierarchy, parentIds?: string[], lookupFieldName?: string, lookupIds?: string[]) {
        return this.queryAndFetchUsingHierarchy(objectHierarchy, parentIds, lookupFieldName, lookupIds).then(parentRes => {
            let idArray = [];
            let lookupIdArray = [];
            let lookupFieldKey: string;
            if (parentRes && parentRes.length > 0) {
                parentRes.forEach(result => {
                    if (objectHierarchy['relationShipType'] && (objectHierarchy['relationShipType'].toUpperCase() === "ONE_TO_ONE"
                        || objectHierarchy['relationShipType'].toUpperCase() === "ONE_TO_MANY")) {
                        let key = "";
                        if (objectHierarchy['childObject'][0]['objectId'].includes('pfm')) {
                            key = objectHierarchy['childObject'][0]['objectId']
                        } else {
                            key = "pfm" + objectHierarchy['childObject'][0]['objectId'];
                        }
                        // if (result && result['doc'] && result['doc']['data'] && result['doc']['data'][key]) {
                        //     idArray.push(key + "_2_" + result['doc']['data'][key])
                        // }
                        if (result && result['fields'] && result['fields'][key]) {
                            idArray.push(key + "_2_" + result['fields'][key])
                        }
                    } else if (objectHierarchy['objectType'] && (objectHierarchy['objectType'].toUpperCase() == "LOOKUP"
                        || objectHierarchy['objectType'].toUpperCase() == "HEADER")) {
                        let key = "";
                        if (objectHierarchy['objectId'].includes('pfm')) {
                            key = objectHierarchy['objectId']
                        } else {
                            key = "pfm" + objectHierarchy['objectId'];
                        }
                        // if (result && result['doc'] && result['doc']['_id']) {
                        //     lookupIdArray.push(result['doc']['_id'].replace(key + "_2_", ""))
                        // }
                        if (result && result['id']) {
                            lookupIdArray.push(result['id'].replace(key + "_2_", ""))
                        }
                        if (key) {
                            if (objectHierarchy['objectType'].toUpperCase() == "LOOKUP" && objectHierarchy['fieldId']) {
                                lookupFieldKey = key + "_" + objectHierarchy['fieldId'];
                            } else if (objectHierarchy['objectType'].toUpperCase() == "HEADER") {
                                lookupFieldKey = key;
                            }
                        }
                    }
                });
                const childJsonArray = objectHierarchy['childObject'];
                if (objectHierarchy['objectType'] && objectHierarchy['objectType'].toUpperCase() == "LOOKUP" && childJsonArray.length > 0 &&
                    (childJsonArray[0]['childObject'].length === 0 || childJsonArray[0]['objectType'].toUpperCase() === 'PRIMARY')) {
                    return { "lookupFetchResult": { "fieldName": lookupFieldKey, "ids": lodash.uniq(lookupIdArray) } }
                } else if (objectHierarchy['objectType'] && objectHierarchy['objectType'].toUpperCase() == "HEADER" &&
                    (objectHierarchy['childObject'].length === 0 || childJsonArray[0]['objectType'].toUpperCase() === 'PRIMARY' || (childJsonArray.length > 0 && childJsonArray[0]['childObject'].length === 0))) {
                    return { "headerFetchResult": { "fieldName": lookupFieldKey, "ids": lodash.uniq(lookupIdArray) } }
                } else if (childJsonArray.length > 0 && childJsonArray[0]['objectType'] && childJsonArray[0]['objectType'].toUpperCase() !== "PRIMARY") {
                    if (idArray && idArray.length > 0) {
                        idArray = lodash.uniq(idArray);
                    }
                    if (lookupIdArray && lookupIdArray.length > 0) {
                        lookupIdArray = lodash.uniq(lookupIdArray);
                    }
                    return this.recursiveFetchForFilterQueryUsingHierarchy(childJsonArray[0], idArray, lookupFieldKey, lookupIdArray).then(childRes => {
                        return childRes;
                    })
                } else if (childJsonArray.length > 0 && childJsonArray[0]['childObject'].length === 0 || childJsonArray[0]['objectType'].toUpperCase() === 'PRIMARY') {
                    return lodash.uniq(idArray);
                }
            } else {
                return [];
            }
        });
    }

    async queryAndFetch(queryJson, objectName: string, parentIds?: string[], lookupFieldName?: string, lookupIds?: string[]) {
        let taskList = [];
        let searchQuery = '';
        let bacthWiseIdArray = [];
        let additionalInfo: AdditionalInfo = {
            parentInfo: {
                parentType: undefined,
                parentId: undefined
            }, id: "",
            bookmark: "",
            response: []
        }
        const designDocName = objectName + "_search";
        //Rajkumar change
        if (queryJson[objectName + "formula"] || queryJson[objectName + "rollup"]) {
            parentIds = await this.fetchReferenceIdsBasedOnFormulaQuery(queryJson, objectName, parentIds);
            if (parentIds && parentIds.length == 0) {
                return [];
            }
        }
        if ((parentIds && parentIds.length > 0) && (lookupIds && lookupIds.length > 0)) {
            let bacthWiseParentIdArray = lodash.chunk(parentIds, this.batchIdLimit);
            let bacthWiseLookupIdArray = lodash.chunk(lookupIds, this.batchIdLimit);
            if (bacthWiseParentIdArray.length > 0 && bacthWiseLookupIdArray.length > 0) {
                bacthWiseLookupIdArray.forEach(LookupIds => {
                    if (lookupFieldName && LookupIds && LookupIds.length > 0) {
                        additionalInfo['parentInfo']['parentType'] = lookupFieldName;
                        additionalInfo['parentInfo']['parentId'] = this.makeDocIdArrayToString(LookupIds);
                    }
                    bacthWiseParentIdArray.forEach(parentIds => {
                        if (parentIds && parentIds.length > 0) {
                            additionalInfo.id = this.makeDocIdArrayToString(parentIds);
                        }
                        var params = {
                            queryJson: queryJson,
                            objectName: objectName,
                            designDocName: designDocName,
                            additionalInfo: additionalInfo
                        }
                        taskList.push(this.decideDBAndCallSearchDesignDocs(params));
                    });
                });
            } else {
                return [];
            }
        } else if (parentIds && parentIds.length > 0 || lookupIds && lookupIds.length > 0) {
            if (lookupIds && lookupIds.length > 0) {
                bacthWiseIdArray = lodash.chunk(lookupIds, this.batchIdLimit);
            } else if (parentIds && parentIds.length > 0) {
                bacthWiseIdArray = lodash.chunk(parentIds, this.batchIdLimit);
            }
            if (bacthWiseIdArray.length > 0) {
                bacthWiseIdArray.forEach(idArray => {
                    if (lookupFieldName && idArray && idArray.length > 0) {
                        additionalInfo['parentInfo']['parentType'] = lookupFieldName;
                        additionalInfo['parentInfo']['parentId'] = this.makeDocIdArrayToString(idArray);
                    } else if (idArray && idArray.length > 0) {
                        additionalInfo.id = this.makeDocIdArrayToString(idArray);
                    }
                    var params = {
                        queryJson: queryJson,
                        objectName: objectName,
                        designDocName: designDocName,
                        additionalInfo: additionalInfo
                    }
                    taskList.push(this.decideDBAndCallSearchDesignDocs(params));
                })
            } else {
                return [];
            }
        }
        else {
            var params = {
                queryJson: queryJson,
                objectName: objectName,
                designDocName: designDocName,
                additionalInfo: additionalInfo
            }
            taskList.push(this.decideDBAndCallSearchDesignDocs(params));
        }
        return Promise.all(taskList).then(result => {
            return Promise.resolve(lodash.flattenDeep(result));
        }).catch(error => {
            // return this.catchBlockError(error);
            return [];
        });
    }

    decideDBAndCallSearchDesignDocs(params: { queryJson: any, objectName: string, designDocName: string, additionalInfo: AdditionalInfo }) {
        let searchQuery = this.makingQueryForFetch(params.queryJson, params.objectName, params.additionalInfo);
        if (params.queryJson && params.queryJson['isCorUser']) {
            return this.metaCouchDbProvider.callSearchDesignDocs(searchQuery, params.designDocName).then(fetchResult => {
                if (fetchResult && fetchResult['rows'] && fetchResult['rows'].length > 0) {
                    return fetchResult['rows']
                } else {
                    return []
                }
            })
        } else {
            return this.callSearchDesignDocs(searchQuery, params.designDocName).then(fetchResult => {
                if (fetchResult && fetchResult['rows'] && fetchResult['rows'].length > 0) {
                    return fetchResult['rows']
                } else {
                    return []
                }
            })
        }
    }

    async queryAndFetchUsingHierarchy(objectHierarchy: ObjectHierarchy, parentIds?: string[], lookupFieldName?: string, lookupIds?: string[]) {
        let taskList = [];
        let searchQuery = '';
        let bacthWiseIdArray = [];
        let additionalInfo: AdditionalInfo = {
            parentInfo: {
                parentType: undefined,
                parentId: undefined
            }, id: "",
            bookmark: "",
            response: []
        }
        let objectName = this.getObjectType(objectHierarchy)
        const designDocName = objectName + "_search";
        const queryFlags = {
            "include_docs": false,
            "include_fields": []
        }
        if (objectHierarchy['objectType'] && (objectHierarchy['objectType'].toUpperCase() == "LOOKUP"
            || objectHierarchy['objectType'].toUpperCase() == "HEADER")) {
                queryFlags["include_fields"] = [];
        }else {
            if(objectHierarchy['childObject'].length>0){
                let parentObjectType = this.getObjectType(objectHierarchy['childObject'][0]);
                queryFlags["include_fields"].push(parentObjectType)
            }
        }
        if (objectHierarchy["options_formula"] || objectHierarchy["options_rollup"]) {
            parentIds = await this.fetchReferenceIdsBasedOnFormulaQueryUsingObjectHierarchy(objectHierarchy, objectName, parentIds);
            if (parentIds && parentIds.length == 0) {
                return [];
            }
        }
        if ((parentIds && parentIds.length > 0) && (lookupIds && lookupIds.length > 0)) {
            let bacthWiseParentIdArray = lodash.chunk(parentIds, this.batchIdLimit);
            let bacthWiseLookupIdArray = lodash.chunk(lookupIds, this.batchIdLimit);
            if (bacthWiseParentIdArray.length > 0 && bacthWiseLookupIdArray.length > 0) {
                bacthWiseLookupIdArray.forEach(LookupIds => {
                    if (lookupFieldName && LookupIds && LookupIds.length > 0) {
                        additionalInfo['parentInfo']['parentType'] = lookupFieldName;
                        additionalInfo['parentInfo']['parentId'] = this.makeDocIdArrayToString(LookupIds);
                    }
                    bacthWiseParentIdArray.forEach(parentIds => {
                        if (parentIds && parentIds.length > 0) {
                            additionalInfo.id = this.makeDocIdArrayToString(parentIds);
                        }
                        searchQuery = this.makingQueryForFetchUsingHierarchy(objectHierarchy, additionalInfo);
                        taskList.push(this.callSearchDesignDocsForFilter(searchQuery, designDocName, '', queryFlags).then(fetchResult => {
                            if (fetchResult && fetchResult['rows'] && fetchResult['rows'].length > 0) {
                                return fetchResult['rows']
                            } else {
                                return []
                            }
                        }))
                    });
                });
            } else {
                return [];
            }
        } else if (parentIds && parentIds.length > 0 || lookupIds && lookupIds.length > 0) {
            if (lookupIds && lookupIds.length > 0) {
                bacthWiseIdArray = lodash.chunk(lookupIds, this.batchIdLimit);
            } else if (parentIds && parentIds.length > 0) {
                bacthWiseIdArray = lodash.chunk(parentIds, this.batchIdLimit);
            }
            if (bacthWiseIdArray.length > 0) {
                bacthWiseIdArray.forEach(idArray => {
                    if (lookupFieldName && idArray && idArray.length > 0) {
                        additionalInfo['parentInfo']['parentType'] = lookupFieldName;
                        additionalInfo['parentInfo']['parentId'] = this.makeDocIdArrayToString(idArray);
                    } else if (idArray && idArray.length > 0) {
                        additionalInfo.id = this.makeDocIdArrayToString(idArray);
                    }
                    searchQuery = this.makingQueryForFetchUsingHierarchy(objectHierarchy, additionalInfo);
                    taskList.push(this.callSearchDesignDocsForFilter(searchQuery, designDocName, '', queryFlags).then(fetchResult => {
                        if (fetchResult && fetchResult['rows'] && fetchResult['rows'].length > 0) {
                            return fetchResult['rows']
                        } else {
                            return []
                        }
                    }))
                })
            } else {
                return [];
            }
        } else {
            searchQuery = this.makingQueryForFetchUsingHierarchy(objectHierarchy);
            taskList.push(this.callSearchDesignDocsForFilter(searchQuery, designDocName, '', queryFlags).then(fetchResult => {
                if (fetchResult && fetchResult['rows'] && fetchResult['rows'].length > 0) {
                    return fetchResult['rows']
                } else {
                    return []
                }
            }))
        }
        return Promise.all(taskList).then(result => {
            return Promise.resolve(lodash.flattenDeep(result));
        }).catch(error => {
            // return this.catchBlockError(error);
            return [];
        });
    }

    makingQueryForFetch(queryJson, objectName: string, additionalInfo?: AdditionalInfo) {
        const selectorCouchQuery = queryJson[objectName]
        let searchQuery = '';
        if (selectorCouchQuery === undefined) {
            searchQuery = "type : " + objectName
        } else {
            searchQuery = selectorCouchQuery;
        }
        if (additionalInfo !== undefined) {
            if (additionalInfo.id !== undefined && additionalInfo.id !== '') {
                const stringConstructor = "test".constructor;
                const objectConstructor = {}.constructor;
                if ((additionalInfo.id.constructor === stringConstructor) || (additionalInfo.id.constructor === objectConstructor)) {
                    searchQuery = searchQuery + " AND _id : " + additionalInfo.id;
                }
            }
            if (additionalInfo.parentInfo !== undefined
                && additionalInfo.parentInfo.parentType !== undefined
                && additionalInfo.parentInfo.parentId !== undefined
                && additionalInfo.parentInfo.parentType !== ""
                && additionalInfo.parentInfo.parentId !== "") {
                searchQuery = searchQuery + " AND " + additionalInfo.parentInfo.parentType + " : " + additionalInfo.parentInfo.parentId;
            }
        }
        return searchQuery
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

    makingQueryForFetchUsingHierarchy(objectHierarchy: ObjectHierarchy, additionalInfo?: AdditionalInfo) {
        let searchQuery = '';
        if (objectHierarchy['options']) {
            searchQuery = objectHierarchy['options'];
            if(objectHierarchy['modifiedId']){
                searchQuery = searchQuery + ' AND id:'+ objectHierarchy['modifiedId'];
            }
        } else {
            searchQuery = "type : " + this.getObjectType(objectHierarchy)
        }
        if (additionalInfo !== undefined) {
            if (additionalInfo.id !== undefined && additionalInfo.id !== '') {
                const stringConstructor = "test".constructor;
                const objectConstructor = {}.constructor;
                if ((additionalInfo.id.constructor === stringConstructor) || (additionalInfo.id.constructor === objectConstructor)) {
                    searchQuery = searchQuery + " AND _id : " + additionalInfo.id;
                }
            }
            if (additionalInfo.parentInfo !== undefined
                && additionalInfo.parentInfo.parentType !== undefined
                && additionalInfo.parentInfo.parentId !== undefined
                && additionalInfo.parentInfo.parentType !== ""
                && additionalInfo.parentInfo.parentId !== "") {
                searchQuery = searchQuery + " AND " + additionalInfo.parentInfo.parentType + " : " + additionalInfo.parentInfo.parentId;
            }
        }
        return searchQuery
    }

    async fetchReferenceIdsBasedOnFormulaQuery(queryJson, objectName, idArray?) {
        let taskList = [];
        let referenceIdArray = [];
        if (queryJson[objectName + "formula"]) {
            taskList.push(this.formulaCouchDbProvider.fetchFormulaAndRollup(queryJson[objectName + "formula"], objectName, idArray, 'formula'));
        }
        if (queryJson[objectName + "rollup"]) {
            taskList.push(this.formulaCouchDbProvider.fetchFormulaAndRollup(queryJson[objectName + "rollup"], objectName, idArray, 'rollup'));
        }
        return Promise.all(taskList).then(result => {
            if (result && result.length === 2) {
                referenceIdArray = lodash.intersection(result[0], result[1]);
            } else if (result && result.length === 1) {
                referenceIdArray = [...result[0]];
            }
            if (referenceIdArray.length > 0) {
                return Promise.resolve(referenceIdArray);
            } else {
                return Promise.resolve([]);
            }
        }).catch(error => {
            // return this.catchBlockError(error);
            return [];
        });
    }

    async fetchReferenceIdsBasedOnFormulaQueryUsingObjectHierarchy(objectHierarchy: ObjectHierarchy, objectName, idArray?) {
        let taskList = [];
        let referenceIdArray = [];
        if (objectHierarchy["options_formula"]) {
            taskList.push(this.formulaCouchDbProvider.fetchFormulaAndRollup(objectHierarchy["options_formula"], objectName, idArray, 'formula'));
        }
        if (objectHierarchy["options_rollup"]) {
            taskList.push(this.formulaCouchDbProvider.fetchFormulaAndRollup(objectHierarchy["options_rollup"], objectName, idArray, 'rollup'));
        }
        return Promise.all(taskList).then(result => {
            if (result && result.length === 2) {
                referenceIdArray = lodash.intersection(result[0], result[1]);
            } else if (result && result.length === 1) {
                referenceIdArray = [...result[0]];
            }
            if (referenceIdArray.length > 0) {
                return Promise.resolve(referenceIdArray);
            } else {
                return Promise.resolve([]);
            }
        }).catch(error => {
            // return this.catchBlockError(error);
            return [];
        });
    }
    /* private getChildData(singleRecord, parenttype, childJsonArray, additionalInfo) {
        var taskList = []
        for (var i = 0; i < childJsonArray.length; i++) {
            var singleJsonChildObj = childJsonArray[i]
            taskList.push(this.fetchChildData(singleRecord, parenttype, singleJsonChildObj, additionalInfo).then((res) => {
                return Promise.resolve(singleRecord)
            }))
        }

        return Promise.all(taskList).then(res => {
            return Promise.resolve(singleRecord)
        })

    }

    private fetchChildData(singleRecordMain, parenttype, singleJsonChildObj, additionalInfo) {

        let options = {}
        let selector = {}

        var objectName = "pfm" + singleJsonChildObj['objectId']

        selector['data.type'] = objectName

        if (singleJsonChildObj['objectType'] == 'LOOKUP') {
            var fieldId = "pfm" + singleJsonChildObj['objectId'] + "_" + singleJsonChildObj['fieldId'];
            var lookupObjRecId = singleRecordMain[fieldId];
            if (lookupObjRecId != undefined && lookupObjRecId != '') {
                options['limit'] = this.batchLimit
                selector['_id'] = objectName + "_2_" + lookupObjRecId;
            } else {
                return Promise.resolve(singleRecordMain)
            }
        } else {
            selector['data.' + parenttype] = singleRecordMain['id']
        }

        options['selector'] = selector
        options['limit'] = this.batchLimit

        let optionsFieldSet = Object.keys(options['selector'])
        var optionsFieldsArray = []
        optionsFieldSet.forEach(element => {
            optionsFieldsArray.push(this.isJson(JSON.stringify(element)))
        });

        return this.indexCreation(optionsFieldsArray).then(res => {
            return this.findAPIforBatch(options, false).then(res => {

                if (singleJsonChildObj['objectType'] == 'LOOKUP') {
                    var fieldId = "pfm" + singleJsonChildObj['objectId'] + "_" + singleJsonChildObj['fieldId'];
                    singleRecordMain[fieldId] = res['docs'][0]
                } else {
                    var objectPluralName = this.getPluralName(objectName);
                    singleRecordMain[objectPluralName] = res['docs']
                }

                if ((additionalInfo != undefined && additionalInfo['isFirstLevelFetchNeed'] && additionalInfo['isFirstLevelFetchNeed'] == true)) {
                    return Promise.resolve(singleRecordMain)
                }
                if (singleJsonChildObj['childObject'] == undefined || singleJsonChildObj['childObject'].length == 0) {
                    return Promise.resolve(singleRecordMain)
                }

                let childJsonArray = singleJsonChildObj['childObject'];
                var taskList = []
                for (var i = 0; i < res['docs'].length; i++) {
                    var singleRecord = res['docs'][i]
                    taskList.push(this.getChildData(singleRecord, objectName, childJsonArray, additionalInfo).then((res) => {
                        return Promise.resolve(singleRecordMain)
                    }))
                }

                return Promise.all(taskList).then(res => {
                    return Promise.resolve(singleRecordMain)
                })

            }).catch(error => {
                this.response = { status: this.failed, message: error.message, records: [] }
                return Promise.resolve(this.response)
            })
        })
    } */


    /****************************************************
                  Public API for data fetching
      *****************************************************/

    //Find docs using find plugin without relationship(If you get selected fields, you must pass _id field )
    //  fetchDocsWithoutRelationshipUsingFindOption(options) {
    //     if (options.selector) {
    //         var selector;
    //         try {
    //             selector = JSON.parse(JSON.stringify(options.selector))
    //             if (Object.keys(selector).indexOf('data.type') > -1) {
    //                 return this.findDocsWithSelector(options).then(res => {
    //                     if (res.constructor === [].constructor) {
    //                         this.response = { status: this.success, message: '', records: res }
    //                         return this.response
    //                     }
    //                     else {
    //                         this.response = { status: this.failed, message: typeof res == "string" ? res : "Fetching failed", records: [] }
    //                         return this.response
    //                     }

    //                 }).catch(error => {
    //                     this.response = { status: this.failed, message: error.message, records: [] }
    //                     return Promise.resolve(this.response)
    //                 })
    //             }
    //             else {
    //                 this.response = { status: this.failed, message: 'data.type is missing!!', records: [] }
    //                 return Promise.resolve(this.response)

    //             }

    //         } catch (error) {
    //             this.response = { status: this.failed, message: error.message, records: [] }
    //             return Promise.resolve(this.response)
    //         }
    //     }
    //     else {
    //         this.response = { status: this.failed, message: 'Invalid selector', records: [] }
    //         return Promise.resolve(this.response)
    //     }
    // }


    // //Fetch single table docs with relationship
    // fetchDocsWithRelationshipByType(type, withchild: Boolean, referencedetail?) {
    //     let validateStatus = this.validateReferenceDetails(referencedetail)
    //     if (validateStatus.status == this.success) {
    //         return this.db.rel.find(type + '_only').then(res => {
    //             if (withchild) {
    //                 return this.checkChildObjectsForFetch(type, res, referencedetail).then(res => {
    //                     return this.checkLookupObjectsForFetch(type, res, referencedetail).then(result => {
    //                         this.response = { status: this.success, message: '', records: result }
    //                         return this.response
    //                     })
    //                 })
    //             }
    //             else {
    //                 return this.checkLookupObjectsForFetch(type, res, referencedetail).then(result => {
    //                     this.response = { status: this.success, message: '', records: result }
    //                     return this.response
    //                 })
    //             }
    //         }).catch(error => {
    //             this.response = { status: this.failed, message: error.message, records: [] }
    //             return Promise.resolve(this.response)
    //         })
    //     }
    //     else {
    //         return Promise.resolve(validateStatus)
    //     }
    // }

    // fetchDocsWithRelationshipByType(type, referencedetail?, withchild?) {
    //     if (!navigator.onLine) {
    //         this.response = { status: this.failed, message: this.internetErrorMessage, records: [] }
    //         return Promise.resolve(this.response)
    //     }

    //     let validateStatus = this.validateReferenceDetails(referencedetail)
    //     if (validateStatus.status == this.success) {
    //         return this.db.rel.find(type + '_only').then(res => {
    //             if (withchild) {
    //                 return this.checkChildObjectsForFetch(type, res, referencedetail).then(res => {
    //                     return this.checkLookupObjectsForFetch(type, res, referencedetail).then(result => {
    //                         this.response = { status: this.success, message: '', records: result }
    //                         return this.response
    //                     })
    //                 })
    //             }
    //             else {
    //                 return this.checkLookupObjectsForFetch(type, res, referencedetail).then(result => {
    //                     this.response = { status: this.success, message: '', records: result }
    //                     return this.response
    //                 })
    //             }
    //         }).catch(error => {
    //             this.response = { status: this.failed, message: error.message, records: [] }
    //             return Promise.resolve(this.response)
    //         })
    //     }
    //     else {
    //         return Promise.resolve(validateStatus)
    //     }
    // }

    // //Fetch single table docs by parent doc id with relationship
    // fetchChildDocsWithRelationshipByParentTypeAndId(child_type, parent_type, parent_id, withchild: Boolean, referencedetail?) {

    //     let objectList = Object.keys(this.dbConfigurationDetail.tableStructure);
    //     if (objectList.indexOf(parent_type) < 0) {
    //         this.response = { status: this.failed, message: "Invalid parent type", records: [] }
    //         return Promise.resolve(this.response)
    //     }
    //     else {
    //         let validateStatus = this.validateReferenceDetails(referencedetail)
    //         if (validateStatus.status == this.success) {
    //             return this.db.rel.findHasMany(child_type + '_only', parent_type, parent_id).then(res => {
    //                 if (withchild) {
    //                     return this.checkChildObjectsForFetch(child_type, res, referencedetail).then(res => {
    //                         return this.checkLookupObjectsForFetch(child_type, res, referencedetail).then(result => {
    //                             this.response = { status: this.success, message: '', records: result }
    //                             return this.response
    //                         })
    //                     })
    //                 }
    //                 else {
    //                     return this.checkLookupObjectsForFetch(child_type, res, referencedetail).then(result => {
    //                         this.response = { status: this.success, message: '', records: result }
    //                         return this.response
    //                     })
    //                 }
    //             }).catch(error => {
    //                 this.response = { status: this.failed, message: error.message, records: [] }
    //                 return Promise.resolve(this.response)
    //             })
    //         }
    //         else {
    //             return Promise.resolve(validateStatus)
    //         }
    //     }
    // }


    // private findAPIforBatch(options, isSingleBatchFetch, arrayList?) {
    //     return this.db.find(options).then(result => {
    //         let resultArray = [];
    //         result['docs'].forEach(element => {
    //             resultArray.push(this.convertRelDocToNormalDoc(element))
    //         });

    //         if (arrayList != undefined) {
    //             Array.prototype.push.apply(arrayList, resultArray);
    //             result['docs'] = arrayList;
    //         } else {
    //             result['docs'] = resultArray;
    //         }

    //         if (!isSingleBatchFetch && resultArray.length > 0 && result['bookmark'] && result['bookmark'] != '') {
    //             options['bookmark'] = result['bookmark']
    //             return this.findAPIforBatch(options, isSingleBatchFetch, result['docs'])
    //         } else {
    //             return Promise.resolve(result)
    //         }

    //     }).catch(error => {
    //         return Promise.resolve(error.message)
    //     });
    // }


    //     /****************************************************
    //            Supporting methods for data fetching
    //    *****************************************************/

    //     //Convert reldoc to normal doc
    //     convertRelDocToNormalDoc(doc) {
    //         var parsedId = this.db.rel.parseDocID(doc._id);
    //         doc.data.id = parsedId.id;
    //         doc.data.rev = doc._rev;
    //         if (doc._attachments) {
    //             doc.data.attachments = doc._attachments
    //         }
    //         return doc.data
    //     }

    //     //Find docs using find plugin without relationship(If you get selected fields, you must pass _id field )


    //     //Find docs using find options plugin with relationship (If you get selected fields, you must pass _id field )
    //     fetchDocsWithRelationshipUsingFindOption(options, withchild: Boolean) {
    //         if (options.selector) {
    //             var selector;
    //             try {
    //                 selector = JSON.parse(JSON.stringify(options.selector))
    //                 if (Object.keys(selector).indexOf('data.type') > -1) {
    //                     var type = selector['data.type']
    //                     return this.findAPI(options).then(res => {
    //                         if (res.constructor === [].constructor) {
    //                             var resultJson = {}
    //                             var type = selector['data.type']
    //                             var pluralNameForParent = this.getPluralName(type)
    //                             resultJson[pluralNameForParent] = res
    //                             if (withchild) {
    //                                 return this.checkChildObjectsForFetch(type, resultJson).then(res => {
    //                                     return this.checkLookupObjectsForFetch(type, res)
    //                                 })
    //                             }
    //                             else {
    //                                 return this.checkLookupObjectsForFetch(type, resultJson).then(result => {
    //                                     return result
    //                                 })
    //                             }
    //                         }
    //                         else {
    //                             return res
    //                         }

    //                     }).catch(error => {
    //                         console.log("find err" + JSON.stringify(error))
    //                     })
    //                 }
    //                 else {
    //                     return Promise.resolve('data.type is missing!!')

    //                 }

    //             } catch (error) {
    //                 return Promise.resolve('Invalid selector')
    //             }

    //         }
    //         else {
    //             return Promise.resolve('Invalid selector')
    //         }




    //     }

    //     //Check depentent docs for particular table
    //     checkChildObjectsForFetch(type, res) {
    //         var relations = this.getSchemaRelations(type)
    //         if (relations) {
    //             return this.fetchChildDocForMultipleDocs(res, type).then(result => {
    //                 var response = {}
    //                 var pluralName = this.getPluralName(type)
    //                 response[pluralName] = result
    //                 return response
    //             })
    //         }
    //         else {
    //             return Promise.resolve(res)
    //         }
    //     }

    //     //Create list with all fetched child objects
    //     fetchChildDocForMultipleDocs(res, type) {
    //         var pluralName = this.getPluralName(type)
    //         var List = []
    //         let dependentFetching = []
    //         res[pluralName].forEach(element => {
    //             dependentFetching.push(this.fetchAllChildDocsForSingleDoc(type, element).then(doc => {
    //                 List.push(doc)
    //             }))
    //         })
    //         return Promise.all(dependentFetching).then(allresult => {
    //             return List
    //         })
    //     }


    //     //Fetch all lookup objects
    //     fetchAllChildDocsForSingleDoc(type, element) {
    //         var relations = this.getSchemaRelations(type)
    //         let childFetchingTaskList = []
    //         Object.keys(relations).forEach(function (field) {
    //             var relationDef = relations[field]
    //             var relationType = Object.keys(relationDef)[0];
    //             if (relationType == 'hasMany') {
    //                 var objectType = relationDef[relationType].type
    //                 var selector = {}
    //                 selector['data.type'] = objectType
    //                 selector['data.' + type] = element.id
    //                 childFetchingTaskList.push(
    //                     this.fetchDocsWithoutRelationshipUsingFindOption({ selector: selector }).then(doc => {
    //                         var pluralNameForChild = this.getPluralName(objectType)
    //                         element[pluralNameForChild] = doc
    //                     }))
    //             }
    //         }, this)

    //         return Promise.all(childFetchingTaskList).then(function () {
    //             return element
    //         })
    //     }

    //     //Check depentent docs for particular table
    //     checkLookupObjectsForFetch(type, res) {
    //         var relations = this.getSchemaRelations(type)
    //         if (relations) {
    //             return this.fetchLookupDocForMultipleDocs(res, type).then(result => {
    //                 return result
    //             }).catch(error => {
    //                 console.log("find err" + JSON.stringify(error))
    //             })
    //         }
    //         else {
    //             var pluralName = this.getPluralName(type)
    //             var result = res[pluralName]
    //             return Promise.resolve(result)
    //         }
    //     }

    //     //Create list with all fetched lookup objects
    //     fetchLookupDocForMultipleDocs(res, type) {
    //         var pluralName = this.getPluralName(type)
    //         var List = []
    //         let dependentFetching = []
    //         res[pluralName].forEach(element => {
    //             dependentFetching.push(this.fetchAllLookupDocForSingleDoc(type, element).then(doc => {
    //                 List.push(doc)
    //             }).catch(error => {
    //                 console.log("find err" + JSON.stringify(error))
    //             })
    //             )
    //         })
    //         return Promise.all(dependentFetching).then(allresult => {
    //             return List
    //         })
    //     }
    //     //Fetch all lookup objects
    //     fetchAllLookupDocForSingleDoc(type, element) {
    //         var relations = this.getSchemaRelations(type)
    //         let lookupFetchingTaskList = []
    //         Object.keys(relations).forEach(field => {
    //             var relationDef = relations[field]
    //             var relationType = Object.keys(relationDef)[0];
    //             if (relationType == 'belongsTo') {
    //                 var objectType = relationDef[relationType].type
    //                 Object.keys(element).forEach(key => {
    //                     if (key.startsWith(objectType + '_') || key == objectType) {
    //                         lookupFetchingTaskList.push(
    //                             this.fetchDocWithoutRelationshipByTypeAndId(objectType, element[key]).then(doc => {
    //                                 element[key] = doc
    //                             }))
    //                     }
    //                 })
    //             }
    //         })

    //         return Promise.all(lookupFetchingTaskList).then(function () {
    //             return element
    //         })
    //     }

    //     //Fetch single doc by doc id without relationship
    //     fetchDocWithoutRelationshipByTypeAndId(type, id) {
    //         var rel_id = this.db.rel.makeDocID({ "type": type, "id": id })
    //         return this.db.get(rel_id).then(doc => {
    //             return this.convertRelDocToNormalDoc(doc)
    //         })
    //     }

    //     //Fetch single doc by doc id with relationship
    //     fetchDocWithRelationshipByTypeAndId(type, id, withchild: Boolean) {
    //         if (withchild) {
    //             return this.db.rel.find(type + '_only', id).then(res => {
    //                 return this.checkChildObjectsForFetch(type, res).then(res => {
    //                     return this.checkLookupObjectsForFetch(type, res)
    //                 })
    //             })
    //         }
    //         else {
    //             return this.db.rel.find(type + '_only', id).then(res => {
    //                 return this.checkLookupObjectsForFetch(type, res)
    //             })
    //         }
    //     }

    //     findAPI(options) {
    //         return this.db.find(options).then(result => {
    //             let resultArray = [];
    //             result['docs'].forEach(element => {
    //                 resultArray.push(this.convertRelDocToNormalDoc(element))
    //             });
    //             return resultArray
    //         }).catch(err => {
    //             console.log("find err" + err)
    //             return "Find error"
    //         });
    //     }

    //     //Fetch login session info
    //     fetchUserIdAndOrgIdFromPreference(doc, type) {
    //         var date = new Date();
    //         var timestamp = date.getTime();
    //         if (!doc.id) {
    //             doc.createdon = timestamp
    //             doc.type = type
    //             let guid = this.guidGenerate(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    //             doc.guid = guid

    //             //Default column value insert
    //             if (!doc.display_name) {
    //                 doc.display_name = type
    //             }
    //             else if (doc.display_name == "") {
    //                 doc.display_name = type
    //             }

    //         }
    //         doc.lastmodifiedon = timestamp
    //         doc._pfmModified = true


    //         if (window.location.protocol == "file:") {
    //             var taskList = []
    //             taskList.push(this.appPreferences.fetch('userId').then((res) => {
    //                 if (!doc.id) {
    //                     doc.createdby = res
    //                 }
    //                 doc.lastmodifiedby = res
    //             }))

    //             if (!doc.id) {
    //                 taskList.push(this.appPreferences.fetch('orgId').then((res) => {
    //                     doc.org_id = res
    //                 }))
    //             }
    //             return Promise.all(taskList).then(res => {
    //                 return doc
    //             })
    //         } else {
    //             if (!doc.id) {
    //                 doc.createdby = JSON.parse(sessionStorage['userId'])
    //                 doc.org_id = JSON.parse(sessionStorage['orgId'])
    //             }
    //             doc.lastmodifiedby = JSON.parse(sessionStorage['userId'])
    //             return Promise.resolve(doc)
    //         }

    //     }



    // //Save single document
    // save(type, doc) {
    //     var copieddoc = JSON.parse(JSON.stringify(doc))
    //     var relRemovedDoc = this.removeRelationshipDocs(copieddoc, type)
    //     return this.fetchUserIdAndOrgIdFromPreference(relRemovedDoc, type).then(updatedDoc => {
    //         if (updatedDoc.createdby && updatedDoc.lastmodifiedby) {
    //             return this.db.rel.save(type, updatedDoc).then(res => {
    //                 if (res) {
    //                     var pluralName = this.getPluralName(type)
    //                     var filteredDoc = res[pluralName][0]
    //                     var response = { status: 'Success', id: filteredDoc.id, rev: filteredDoc.rev }
    //                     return response
    //                 }
    //                 return { status: 'Failed' }
    //             })

    //         }
    //         else {
    //             return { status: 'Failed', reason: "Invalid user id" }
    //         }

    //     })
    // }

    //Remove relationship docs
    // private removeRelationshipDocs(doc, type) {
    //     var relations = this.getSchemaRelations(type)
    //     if (relations) {
    //         Object.keys(relations).forEach(field => {
    //             var relationDef = relations[field]
    //             var relationType = Object.keys(relationDef)[0];
    //             if (relationType === 'belongsTo') {
    //                 var objectType = relationDef[relationType].type
    //                 Object.keys(doc).forEach(key => {
    //                     if (key.startsWith(objectType + '_') || key == objectType) {
    //                         if (doc[key] && typeof doc[key].id !== 'undefined') {
    //                             doc[key] = doc[key].id;
    //                         }
    //                     }
    //                 })
    //             }
    //             else {
    //                 var relatedType = relationDef[relationType]
    //                 if (relatedType.options && relatedType.options.queryInverse && doc[field]) {
    //                     delete doc[field];
    //                 }
    //             }
    //         })
    //     }

    //     let relRemoveddoc = {}
    //     if (doc['attachments']) {
    //         relRemoveddoc['_attachments'] = doc.attachments;
    //         delete doc.attachments;
    //     }
    //     relRemoveddoc = doc
    //     return relRemoveddoc
    // }

    // //Generate GUID 
    // guidGenerate(length, chars) {
    //     var result = '';
    //     for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    //     return result;
    // }

    // method to query list page data
    /* queryListDataWithBatch(referenceDetail: ReferenceDetail, createdby?: Array<number>) {
        var queryOptions = {};
        var type = this.getObjectType(referenceDetail);
        if (referenceDetail['queryBatch'] === undefined) {
            referenceDetail['queryBatch'] = { skip: 0 };
        }
        if (createdby !== undefined && createdby.length > 0) {
            var keys = []
            createdby.forEach(element => {
                keys.push(type + element);
            })
            queryOptions = {
                keys: keys,
                limit: this.queryLimit,
                skip: referenceDetail['queryBatch']['skip'],
                include_docs: true
            }
        } else {
            queryOptions = {
                startkey: type,
                endkey: type + '\ufff0',
                limit: this.queryLimit,
                skip: referenceDetail['queryBatch']['skip'],
                include_docs: true
            }
        }

        return this.executeQuery('typeandcreatedby', queryOptions, referenceDetail).then(res => {
            if (res && res.constructor == Array) {
                referenceDetail['queryBatch']['skip'] = referenceDetail['queryBatch']['skip'] + res.length;
                return Promise.resolve({ 'status': 'Success', 'Message': '', 'records': res })
            } else {
                return Promise.resolve({ 'status': 'Failure', 'Message': 'Error', 'records': [] })
            }
        })
    }

    executeQuery(viewName, queryOptions, referenceDetail: ReferenceDetail) {
        return this.db.query(viewName, queryOptions).then(result => {
            return this.handleResponse(result, referenceDetail);
        }).catch(err => {
            console.log("offline query err====>", err);
            return Promise.resolve({ 'status': 'Error', 'Message': 'Server error. Please contact admin.' })
        });
    }

    handleResponse(result, referenceDetail: ReferenceDetail) {
        if (result['rows']) {
            const lookupObjects = this.getLookups(referenceDetail['childObject']);
            const childObjects = this.getChilds(referenceDetail['childObject']);
            const objectType = this.getObjectType(referenceDetail);

            const lookupIdDataMapping = {};
            const lookupIds = [];
            const dataArray = [];

            const parentDataMapping = {}
            const childQueryKeys = {}

            var taskList = [];


            for (let i = 0; i < result['rows'].length; i++) {
                if (result['rows'][i]['doc']) {
                    const data = this.convertRelDocToNormalDoc(result['rows'][i]['doc']);
                    parentDataMapping[data['id']] = i
                    lookupObjects.forEach(element => {
                        let fieldId = ""
                        let lookupObjectName = ""
                        if (isNaN(element['fieldId'])) {
                            lookupObjectName = element['objectId'];
                            fieldId = element['fieldId'];
                        } else {
                            lookupObjectName = "pfm" + element['objectId'];
                            fieldId = lookupObjectName + "_" + element['fieldId'];
                        }
                        const lookupId = data[fieldId];
                        if (lookupId !== undefined && lookupId !== '') {
                            var lookupRecordId = this.db.rel.makeDocID({ 'type': lookupObjectName, 'id': lookupId })
                            if (lookupIds.indexOf(lookupRecordId) === -1) {
                                lookupIds.push(lookupRecordId)
                            }

                            if (lookupIdDataMapping[lookupId] === undefined) {
                                lookupIdDataMapping[lookupId] = []
                            }
                            lookupIdDataMapping[lookupId].push({ index: i, lookupField: fieldId })
                        }
                    })

                    childObjects.forEach(element => {
                        var childObjectType = this.getObjectType(element);
                        data[this.getPluralName(childObjectType)] = []
                        if (childQueryKeys[childObjectType] === undefined) {
                            childQueryKeys[childObjectType] = [];
                        }
                        childQueryKeys[childObjectType].push(childObjectType + data['id'])
                    })
                    dataArray.push(data)
                }
            }

            if (dataArray.length > 0) {
                childObjects.forEach(childObject => {
                    const childObjectType = this.getObjectType(childObject);
                    taskList.push(this.queryChildData(childObject, childQueryKeys[childObjectType], parentDataMapping, dataArray, objectType));
                })

                taskList.push(this.queryLookupData(lookupObjects, lookupIds, lookupIdDataMapping, dataArray));
                return Promise.all(taskList).then(res => {
                    return dataArray;
                })
            } else {
                return dataArray;
            }

        } else {
            return [];
        }
    }

    getChilds(childJsonArray: Array<ReferenceDetail>) {
        const childObjects = [];
        childJsonArray.forEach(element => {
            if (element['objectType'] !== 'LOOKUP') {
                childObjects.push(element)
            }
        })
        return childObjects;
    }


    queryChildData(childObjectReferenceDetails, keys, parentDataMapping, dataArray, parentObjectName) {
        var queryOptions = {
            keys: keys,
            include_docs: true
        }
        return this.executeQuery('masterdetailview', queryOptions, childObjectReferenceDetails).then(res => {
            var objectType = this.getObjectType(childObjectReferenceDetails);
            res.forEach(element => {

                if (dataArray[parentDataMapping[element[parentObjectName]]][this.getPluralName(objectType)] === undefined) {
                    dataArray[parentDataMapping[element[parentObjectName]]][this.getPluralName(objectType)] = []
                }
                dataArray[parentDataMapping[element[parentObjectName]]][this.getPluralName(objectType)].push(element)
            });
            return dataArray;
        })
    }

    queryLookupData(lookupObjects, lookupIds, lookupIdDataMapping, dataArray) {
        if (lookupObjects.length > 0) {
            return this.queryLookups(lookupIds).then(res => {
                res['rows'].forEach(element => {
                    if (element['doc']) {
                        const data = this.convertRelDocToNormalDoc(element['doc']);
                        const indexArray = lookupIdDataMapping[data['id']];
                        indexArray.forEach(indexJson => {
                            dataArray[indexJson['index']][indexJson['lookupField']] = data;
                        });
                    }
                });

                return dataArray;
            });
        }
    }

    queryLookups(lookupId) {
        return this.db.allDocs({ include_docs: true, keys: lookupId }).then(res => {
            return res;
        })
    }

    getObjectType(objectDetails: ReferenceDetail) {
        var objectType = "";
        if (objectDetails['objectId'].includes('pfm')) {
            objectType = objectDetails['objectId']
        } else {
            objectType = "pfm" + objectDetails['objectId']
        }
        return objectType;
    } */


    // method to query list page data
    /* queryListDataWithBatch(referenceDetail: ReferenceDetail, createdby?: Array<number>) {
        var queryOptions = {};
        var type = this.getObjectType(referenceDetail);
        if (createdby !== undefined && createdby.length > 0) {
            var resultArray = [];
            var index = 0;
            if (referenceDetail["queryBatch"] !== undefined &&
                referenceDetail["queryBatch"]["type"] === type &&
                referenceDetail["queryBatch"]["userId"] !== undefined) {
                index = createdby.indexOf(referenceDetail["queryBatch"]["userId"]);
            }
            return this.queryUserWiseData(referenceDetail, createdby, index, this.queryLimit, resultArray).then(res => {
                return Promise.resolve({
                    status: "Success",
                    Message: "",
                    records: resultArray
                });
            });
        } else {
            queryOptions = {
                startkey: type,
                endkey: type + "\ufff0",
                limit: this.queryLimit,
                include_docs: true
            };
            if (referenceDetail["queryBatch"] !== undefined &&
                referenceDetail["queryBatch"]["type"] === type) {
                queryOptions["startkey"] = this.db.rel.makeDocID({
                    type: type, id: referenceDetail["queryBatch"]["docId"]
                });
                queryOptions["skip"] = 1;
            }

            return this.executeAllDocs(queryOptions, referenceDetail).then(res => {
                if (res && res.constructor == Array) {
                    if (referenceDetail["queryBatch"] === undefined) {
                        referenceDetail["queryBatch"] = {
                            docId: "",
                            type: type
                        };
                    }
                    if (res.length > 0) {
                        referenceDetail["queryBatch"]["docId"] = res[res.length - 1]["id"];
                    }

                    return Promise.resolve({
                        status: "Success",
                        Message: "",
                        records: res
                    });
                } else {
                    return Promise.resolve({
                        status: "Failure",
                        Message: "Error",
                        records: []
                    });
                }
            });
        }
    }
    queryUserWiseData(referenceDetail: ReferenceDetail, createdby: Array<number>, index: number, limit: number, resultArray: Array<any>) {
        var type = this.getObjectType(referenceDetail);
        var queryOptions = {
            startkey: type + createdby[index],
            endkey: type + createdby[index] + "\ufff0",
            limit: limit,
            include_docs: true
        };
        if (referenceDetail["queryBatch"] !== undefined &&
            referenceDetail["queryBatch"]["type"] === type &&
            referenceDetail["queryBatch"]["userId"] === createdby[index]) {
            queryOptions["startkey"] =
                type + createdby[index] + this.db.rel.makeDocID({
                    type: type, id: referenceDetail["queryBatch"]["docId"]
                });
            queryOptions["skip"] = 1;
        }

        return this.executeQuery("type_createdby_docid", queryOptions, referenceDetail).then(res => {
            if (res && res.constructor == Array) {
                if (referenceDetail["queryBatch"] === undefined) {
                    referenceDetail["queryBatch"] = {
                        docId: "",
                        type: type
                    };
                }
                referenceDetail["queryBatch"]["userId"] = createdby[index];
                if (res.length > 0) {
                    referenceDetail["queryBatch"]["docId"] = res[res.length - 1]["id"];
                }
                Array.prototype.push.apply(resultArray, res);
                if (res.length === limit) {
                    return res;
                } else {
                    var nextIndex = index + 1;
                    if (nextIndex < createdby.length) {
                        return this.queryUserWiseData(referenceDetail, createdby, nextIndex, limit - res.length, resultArray);
                    } else {
                        return res;
                    }
                }
            } else {
                return Promise.resolve({
                    status: "Failure",
                    Message: "Error",
                    records: []
                });
            }
        });
    }
    executeQuery(viewName, queryOptions, referenceDetail: ReferenceDetail) {
        return this.db.query(viewName, queryOptions)
            .then(result => {
                return this.handleResponse(result, referenceDetail);
            })
            .catch(err => {
                console.log("offline query err====>", err);
                return Promise.resolve({
                    status: "Error",
                    Message: "Server error. Please contact admin."
                });
            });
    }

    executeAllDocs(queryOptions, referenceDetail: ReferenceDetail) {
        return this.db.allDocs(queryOptions)
            .then(result => {
                return this.handleResponse(result, referenceDetail);
            })
            .catch(err => {
                console.log("offline query err====>", err);
                return Promise.resolve({
                    status: "Error",
                    Message: "Server error. Please contact admin."
                });
            });
    }

    handleResponse(result, referenceDetail: ReferenceDetail) {
        if (result["rows"]) {
            const lookupObjects = this.getLookups(referenceDetail["childObject"]);
            const childObjects = this.getChilds(referenceDetail["childObject"]);
            const objectType = this.getObjectType(referenceDetail);

            const lookupIdDataMapping = {};
            const lookupIds = [];
            const dataArray = [];

            const parentDataMapping = {};
            const childQueryKeys = {};

            var taskList = [];

            for (let i = 0; i < result["rows"].length; i++) {
                if (result["rows"][i]["doc"]) {
                    const data = this.convertRelDocToNormalDoc(result["rows"][i]["doc"]);
                    parentDataMapping[data["id"]] = i;
                    lookupObjects.forEach(element => {
                        let fieldId = "";
                        let lookupObjectName = "";
                        if (isNaN(element["fieldId"])) {
                            lookupObjectName = element["objectId"];
                            fieldId = element["fieldId"];
                        } else {
                            lookupObjectName = "pfm" + element["objectId"];
                            fieldId = lookupObjectName + "_" + element["fieldId"];
                        }
                        const lookupId = data[fieldId];
                        if (lookupId !== undefined && lookupId !== "") {
                            var lookupRecordId = this.db.rel.makeDocID({
                                type: lookupObjectName,
                                id: lookupId
                            });
                            if (lookupIds.indexOf(lookupRecordId) === -1) {
                                lookupIds.push(lookupRecordId);
                            }

                            if (lookupIdDataMapping[lookupId] === undefined) {
                                lookupIdDataMapping[lookupId] = [];
                            }
                            lookupIdDataMapping[lookupId].push({
                                index: i,
                                lookupField: fieldId
                            });
                        }
                    });

                    childObjects.forEach(element => {
                        var childObjectType = this.getObjectType(element);
                        data[this.getPluralName(childObjectType)] = [];
                        if (childQueryKeys[childObjectType] === undefined) {
                            childQueryKeys[childObjectType] = [];
                        }
                        childQueryKeys[childObjectType].push(childObjectType + data["id"]);
                    });
                    dataArray.push(data);
                }
            }

            if (dataArray.length > 0) {
                childObjects.forEach(childObject => {
                    const childObjectType = this.getObjectType(childObject);
                    taskList.push(this.queryChildData(childObject, childQueryKeys[childObjectType], parentDataMapping, dataArray, objectType));
                });

                taskList.push(this.queryLookupData(lookupObjects, lookupIds, lookupIdDataMapping, dataArray));
                return Promise.all(taskList).then(res => {
                    return dataArray;
                });
            } else {
                return dataArray;
            }
        } else {
            return [];
        }
    }

    getChilds(childJsonArray: Array<ReferenceDetail>) {
        const childObjects = [];
        childJsonArray.forEach(element => {
            if (element["objectType"] !== "LOOKUP") {
                childObjects.push(element);
            }
        });
        return childObjects;
    }

    queryChildData(childObjectReferenceDetails, keys, parentDataMapping, dataArray, parentObjectName) {
        var queryOptions = {
            keys: keys,
            include_docs: true
        };
        return this.executeQuery("masterdetailview", queryOptions, childObjectReferenceDetails).then(res => {
            var objectType = this.getObjectType(childObjectReferenceDetails);
            res.forEach(element => {
                if (dataArray[parentDataMapping[element[parentObjectName]]][this.getPluralName(objectType)] === undefined) {
                    dataArray[parentDataMapping[element[parentObjectName]]][
                        this.getPluralName(objectType)
                    ] = [];
                }
                dataArray[parentDataMapping[element[parentObjectName]]][
                    this.getPluralName(objectType)
                ].push(element);
            });
            return dataArray;
        });
    }

    queryLookupData(lookupObjects, lookupIds, lookupIdDataMapping, dataArray) {
        if (lookupObjects.length > 0) {
            return this.queryLookups(lookupIds).then(res => {
                res["rows"].forEach(element => {
                    if (element["doc"]) {
                        const data = this.convertRelDocToNormalDoc(element["doc"]);
                        const indexArray = lookupIdDataMapping[data["id"]];
                        indexArray.forEach(indexJson => {
                            dataArray[indexJson["index"]][indexJson["lookupField"]] = data;
                        });
                    }
                });

                return dataArray;
            });
        }
    }

    queryLookups(lookupId) {
        return this.db.allDocs({ include_docs: true, keys: lookupId }).then(res => {
            return res;
        });
    }

    getObjectType(objectDetails: ReferenceDetail) {
        var objectType = "";
        if (objectDetails["objectId"].includes("pfm")) {
            objectType = objectDetails["objectId"];
        } else {
            objectType = "pfm" + objectDetails["objectId"];
        }
        return objectType;
    }

    startQuery(viewName) {
        return this.db.query(viewName, {
            include_docs: false,
            limit: 1
        })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.log("offline query err====>", err);
                return Promise.resolve({
                    status: "Error",
                    Message: "Server error. Please contact admin."
                });
            });
    }

    createViewDocument(viewName: string, mapFunction: string) {
        var ddoc = {
            _id: "_design/" + viewName,
            views: {}
        };
        ddoc["views"][viewName] = {
            map: mapFunction
        };
        // save the design doc
        return this.db.put(ddoc)
            .catch(err => {
                if (err.name !== "conflict") {
                    throw err;
                }
                // ignore if doc already exists
            })
            .then(res => {
                return res;
            });
    } */ 
}
