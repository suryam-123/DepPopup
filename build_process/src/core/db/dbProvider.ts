import { Injectable } from '@angular/core';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { dbConfiguration } from './dbConfiguration';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import PouchRelation from 'relational-pouch';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import { appUtility } from '../utils/appUtility';
import { appConfiguration } from '../utils/appConfiguration';
import pouchdbValidation from 'pouchdb-validation';
import { v4 as uuid} from 'uuid';
import * as lodash from 'lodash';
import { initialSyncProcess } from './initialSyncProcess';
import { cspfmAuditDbProvider } from './cspfmAuditDbProvider';
import { appConstant } from 'src/core/utils/appConstant';
import { formulaDbProvider } from './formulaDbProvider';
import { HttpClient } from '@angular/common/http';

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
    batchId?: string;
}

export interface ReferenceDetail {
    objectName: string;
    objectType: string;
    relationShipType: string;
    fieldId: string;
    objectId: string;
    childObject: Array<ReferenceDetail>;
    options?: any;
    queryBatch?: QueryBatchInfo;
    formulaField?: Array<{ fieldName: string }>;
}

export interface QueryBatchInfo {
    userId?: number;
    type: string;
    docId: any;
    key?: string;
}

PouchDB.plugin(PouchFind);
PouchDB.plugin(PouchRelation); // Change pouch utils class in relational npm first time after install npm
PouchDB.plugin(cordovaSqlitePlugin);
PouchDB.plugin(pouchdbValidation);

@Injectable()
export class dbProvider {
    private db;
    private dbChanges;
    private dbConfiguration;
    private liveReplicationDbObject;
    public keysToSchema = {};
    public tableStructure = {};
    public remote = '';
    private response = { 'status': '', 'message': '', 'records': [] };
    private failed = "FAILED"
    private success = 'SUCCESS';
    private partialSuccess = 'PARTIAL SUCCESS'
    private childreference = 'childreference';
    private masterandlookupreference = 'masterandlookupreference';
    private batchLimit = 2000;
    private queryBatchLimit = 100;


    constructor(private initialProcess: initialSyncProcess, private appUtilityObj: appUtility, private appconfig: appConfiguration,
        public observableListenerUtils: cspfmObservableListenerUtils, public dbConfigurationObj: dbConfiguration, public auditDBProvider: cspfmAuditDbProvider,private httpClient:HttpClient,
        public formulaDbProvider: formulaDbProvider) {

    }


    /****************************************************
         Initialize pouchdb and setup db schema
    *****************************************************/
    // Initialize pouchdb
    initializePouchDb() {
        if (this.db === undefined) {
            this.dbConfiguration = this.dbConfigurationObj.configuration
            this.remote = this.dbConfigurationObj.remoteDbUrl + this.dbConfiguration.databaseName;
            const localdatabseName = this.dbConfiguration.databaseName + '_' + this.appUtilityObj.orgId + '_' +
                this.appUtilityObj.userId + '_' + this.appconfig.configuration.appId;
            if (this.appUtilityObj.isMobile) {
                this.db = new PouchDB(localdatabseName + '.db', { adapter: 'cordova-sqlite', location: 'default' });
            } else {
                this.db = new PouchDB(localdatabseName, { size: 50 });
            }
            this.setSchema();
            this.db.setMaxListeners(50);
        }
    }

    // Set relationship schema
    private setSchema() {
        this.db.setSchema(this.dbConfiguration.schema);
        this.dbConfiguration.schema.forEach(type => {
            this.keysToSchema[type.singular] = type;
        });
        // Table structure for initialize object
        this.tableStructure = this.dbConfiguration.tableStructure;
    }

    // Get plural form of table name
    getPluralName(type) {
        const schema = this.keysToSchema[type];
        return schema.plural;
    }

    // Get relation detail for particular table
    private getSchemaRelations(type) {
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


    /****************************************************
                  Pouchdb change listener
    *****************************************************/


    // Start pouchdb change listener
    startChangeListener() {
        if (this.dbChanges) {
            this.dbChanges.cancel();
        }
        this.dbChanges = this.db.changes({ live: true, since: 'now', include_docs: true, attachments: true })
            .on('change', this.onDatabaseChange);
    }

    // Pouch Database change listener callback
    private onDatabaseChange = (change) => {
        const parsedId = this.db.rel.parseDocID(change.id);
        change['dataProvider'] = 'PouchDB';
        let publishLayaoutIds = this.appUtilityObj.getEventSubscriptionlayoutIds("PouchDB", parsedId.type)
        this.eventsPublish(change, publishLayaoutIds)
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
                  Pouchdb sync
    *****************************************************/

    // Get sync option (Live or Onetime)
    private getSyncOption(live, filtername, params) {
        const parameters = params ? params : '';
        if (live) {
            return {
                live: true,
                retry: true,
                filter: filtername,
                query_params: parameters,
                include_docs: true,
                auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.dbConfigurationObj)
            };
        } else {
            return {
                live: false,
                retry: true,
                filter: filtername,
                query_params: parameters,
                include_docs: true,
                auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.dbConfigurationObj)
            };
        }
    }

    // Initialize db sync
    destroyAndOneTimeSync(filtername, params?) {

        return this.destroyDb().then(res => {
            if (res) {
                if (res['ok']) {
                    this.initializePouchDb();
                    this.startChangeListener();
                    return this.oneTimeSyncWithFilter(filtername, params);
                } else {
                    return Promise.resolve('Sync failed');
                }
            } else {
                return Promise.resolve('Sync failed');
            }
        });
    }

    // Start fulldata without filter live sync
    fulldataWithoutFilterLiveSync() {
        const options = {
            live: true,
            retry: true,
            include_docs: true,
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.dbConfigurationObj)
        };
        this.startChangeListener();
        this.db.sync(this.remote, options);
    }

    // One time sync
    oneTimeSyncWithFilter(filtername, params?) {
        const options = this.getSyncOption(false, filtername, params);
        return this.db.sync(this.remote, options);
    }

    // One time replication to server
    oneTimeReplicationToServerWithFilter(filtername, params?) {
        const options = this.getSyncOption(false, filtername, params);
        return this.db.replicate.to(this.remote, options);
    }

    // One time replication from server
    oneTimeReplicationFromServerWithFilter(filtername, params?) {
        const options = this.getSyncOption(false, filtername, params);
        return this.db.replicate.from(this.remote, options);
    }

    // One time replication from server by selector
    oneTimeReplicationFromServerWithSelector(selector) {
        const options = {
            live: false,
            retry: true,
            filter: '_selector',
            selector: selector,
            include_docs: true,
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.dbConfigurationObj)
        };
        return this.db.replicate.from(this.remote, options);
    }

    // Live sync
    liveSyncWithFilter(filtername, params?) {
        const options = this.getSyncOption(true, filtername, params);
        this.db.sync(this.remote, options);
    }

    // Live sync with selector
    liveSyncWithSelector(selector) {
        this.cancelLivereplicationFromServerWithSelector();
        const options = {
            live: true,
            retry: true,
            filter: '_selector',
            selector: selector,
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.dbConfigurationObj)
        };
        this.liveReplicationDbObject = this.db.sync(this.remote, options);

        /* const sequenceId = appConstant.pfmPouchLatestSeqence
        this.db.get(sequenceId).then(doc => {
            if (doc['last_seq']) {
                // If id exist one time sync from server using since option
                const options = {
                    live: true,
                    retry: true,
                    filter: '_selector',
                    selector: selector,
                    since: doc['last_seq'],
                auth: {"username": window.atob(this.dbConfigurationObj["credentials"]).split(":")[0], "password": window.atob(this.dbConfigurationObj["credentials"]).split(":")[1]}
                };
                this.liveReplicationDbObject = this.db.sync(this.remote, options);
            } else {
                const options = {
                    live: true,
                    retry: true,
                    filter: '_selector',
                    selector: selector,
                auth: {"username": window.atob(this.dbConfigurationObj["credentials"]).split(":")[0], "password": window.atob(this.dbConfigurationObj["credentials"]).split(":")[1]}
                };
                this.liveReplicationDbObject = this.db.sync(this.remote, options);
            }
        }); */
    }
    cancelLivereplicationFromServerWithSelector() {
        if (this.liveReplicationDbObject) {
            this.liveReplicationDbObject.cancel();
        }
    }

    // Live replication to server with selector
    liveReplicateToServerWithSelector(selector) {
        const options = {
            live: true,
            retry: true,
            filter: '_selector',
            selector: selector,
            include_docs: true,
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.dbConfigurationObj)
        };
        this.db.replicate.to(this.remote, options);
    }

    // Live replication from server with selector
    liveReplicateFromServerWithSelector(selector) {
        const options = {
            live: true,
            retry: true,
            filter: '_selector',
            selector: selector,
            include_docs: true,
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.dbConfigurationObj)
        };
        this.db.replicate.from(this.remote, options);
    }

    // Live replication to server
    liveReplicationToServerWithFilter(filtername, params?) {
        const options = this.getSyncOption(true, filtername, params);
        this.db.replicate.to(this.remote, options);
    }

    // Live replication from server
    liveReplicationFromServerWithFilter(filtername, params?) {
        const options = this.getSyncOption(true, filtername, params);
        this.db.replicate.from(this.remote, options);
    }


    /****************************************************
     Document update in direct couch via design document
    *****************************************************/


    // Update documents
    docUpdateViaDesignDoc(designDocId: string, updateName: string, id: string, queryJson: Object, rev: string) {
        const path = designDocId + '/_update/' + updateName;
        const query = '?' + this.queryMaking(queryJson);
        return this.httpCallUsingUpdateDesignDoc(path, id, query, rev, this.appUtilityObj.userId).then(res => {
            return res;
        });
    }

    // Query making for Update design doc 
    private queryMaking(queryJson) {
        let query = '';
        const keys = Object.keys(queryJson);
        keys.forEach(element => {
            query = query + element + '=' + queryJson[element] + '&'
        });
        return query;
    }
    oneTimeReplicationFromServer(oneTimeSyncSelector) {
        return this.initialProcess.startProcess(this.db, this.remote, this.dbConfigurationObj, oneTimeSyncSelector).then(res => {
            if (res) {
                return Promise.resolve('Success');
            } else {
                return Promise.resolve('Failed');
            }
        }).catch(err => {
            return Promise.resolve('Failed');
        })
    }

    // Http call for using update design doc
    private httpCallUsingUpdateDesignDoc(path, id, query, rev, userid) {
        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.dbConfigurationObj)

        return new Promise(resolve => {
            // Update lastmodifiedon and lastmodifiedby
            const date = new Date();
            const timestamp = date.getTime();
            query = query + 'lastmodifiedon=' + timestamp + '&';
            query = query + 'lastmodifiedby=' + userid + '&';


            const url = this.remote + '/' + path + '/' + id + query + 'rev=' + rev;
            this.httpClient.post(url, '', headerstring).toPromise()
                .then(res => {
                    const response = res;
                    if (response['Status'] === 'Conflict') {
                        this.httpCallUsingUpdateDesignDoc(path, id, query, response['newRev'], userid).then(innerRes => {
                            resolve(innerRes);
                        });
                    } else {
                        return resolve(res);
                    }
                }, error => {
                    console.log('error==>' + error);
                    return resolve({ 'Status': 'Error', 'Message': 'Server error. Please contact admin.' });
                });
        });
    }

    /****************************************************
              Public API for save document
    *****************************************************/

    // Save Multiple document
    saveBulkDocs(type, doc) {

        var resultJSON = {
            "status": "",
            "message": "",
            "successRecords": [],
            "failureRecords": []
        }
        
        var bulkDoc = [];
        for (var i = 0; i < doc.length; i++) {
            const copieddoc = JSON.parse(JSON.stringify(doc[i]));
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
                var successRecordsArray = [];
                var failureRecordsArray = [];

                res.forEach(element => {
                    if(element['ok']) {
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
            //         id: "pfm139273_2_B087CCFF-DAA2-4BD4-A541-9F23AC316589"
            //         ok: true
            //         rev: "1-c2b2eb616ec81c2a4078e4d0c598e1b8"
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
    save(type, doc, previousDoc?, fieldTrackAvailable?) {
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

                    /* Check Field Tracking is enable for object*/
                    if (!navigator.onLine && fieldTrackAvailable) {
                        return this.auditDBProvider.initializeAuditDB(type, doc, previousDoc, idVal, rev).then(response => {
                            
                            if (response === this.success) {
                                console.log("audit db save success");
                            } else {
                                console.log("audit db save failed", response);
                            }
                            return { status: this.success, id: idVal, rev: rev };
                        });
                    } else {
                        return { status: this.success, id: idVal, rev: rev };
                    }
                }
                return { status: this.failed, message: 'Save failed' };
            }).catch(error => {
                if (error.message === 'Document update conflict') {
                    return this.fetchDocWithoutRelationshipByTypeAndId(updatedDoc.type, id).then(response => {
                        if (response.status === 'SUCCESS') {
                            const dataDoc = this.replaceResponseWithUpdatedObject(updatedDoc, response.records[0]);
                            return this.save(updatedDoc.type, dataDoc);
                        } else {
                            return Promise.resolve({ status: this.failed, message: error.message });
                        }
                    });
                } else {
                    return Promise.resolve({ status: this.failed, message: error.message });
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
            dependentFetching.push(this.db.rel.putAttachment(
                type, updatedDoc, element.filename, element.data, element.content_type).then(res => {
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
        if (!doc.id) {
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



    /****************************************************
                Public API for data fetching
    *****************************************************/

    // Find docs using find options plugin with relationship (If you get selected fields, you must pass _id field )
    fetchDocsWithRelationshipUsingFindOption(options, withchild: boolean, referencedetail?) {
        const validateStatus = this.validateReferenceDetails(referencedetail);
        if (validateStatus.status === this.success) {
            if (options.selector) {
                let selector;
                try {
                    selector = JSON.parse(JSON.stringify(options.selector));
                    if (Object.keys(selector).indexOf('data.type') > -1) {
                        return this.findDocsWithSelector(options).then(res => {
                            if (res.constructor === [].constructor) {
                                const resultJson = {};
                                const type = selector['data.type'];
                                const pluralNameForParent = this.getPluralName(type);
                                resultJson[pluralNameForParent] = res;
                                if (withchild) {
                                    return this.checkChildObjectsForFetch(type, resultJson, referencedetail).then(res => {
                                       return this.checkLookupObjectFetchMethod(type, res, referencedetail);
                                       
                                    });
                                } else {
                                    return this.checkLookupObjectsForFetch(type, resultJson, referencedetail).then(result => {
                                        this.response = { status: this.success, message: '', records: result };
                                        return this.response;
                                    });
                                }
                            } else {
                                this.response = {
                                    status: this.failed, message: typeof res === 'string' ? res : 'Fetching failed',
                                    records: []
                                };
                                return this.response;
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
                    response: res,
                    status: "Failed"
               });
            }
        });
    }
    // Find docs using find plugin without relationship(If you get selected fields, you must pass _id field )
    fetchDocsWithoutRelationshipUsingFindOption(options) {
        if (options.selector) {
            let selector;
            try {
                selector = JSON.parse(JSON.stringify(options.selector));
                if (Object.keys(selector).indexOf('data.type') > -1) {
                    return this.findDocsWithSelector(options).then(res => {
                        if (res.constructor === [].constructor) {
                            this.response = { status: this.success, message: '', records: res };
                            return this.response;
                        } else {
                            this.response = {
                                status: this.failed, message: typeof res === 'string' ?
                                    res : 'Fetching failed', records: []
                            };
                            return this.response;
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
    }

    // Fetch single table docs with relationship
    fetchDocsWithRelationshipByType(type, withchild: boolean, referencedetail?) {
        const validateStatus = this.validateReferenceDetails(referencedetail);
        if (validateStatus.status === this.success) {
            return this.db.rel.find(type + '_only').then(result => {
                if (withchild) {
                    return this.checkChildObjectsForFetch(type, result, referencedetail).then(res => {
                        return this.checkLookupObjectFetchMethod(type, res, referencedetail);
});
                } else {
                    return this.checkLookupObjectsForFetch(type, result, referencedetail).then(result => {
                        this.response = { status: this.success, message: '', records: result };
                        return this.response;
                    });
                }
            }).catch(error => {
                this.response = { status: this.failed, message: error.message, records: [] };
                return Promise.resolve(this.response);
            });
        } else {
            return Promise.resolve(validateStatus);
        }
    }

    // Fetch single table docs without relationship
    fetchDocsWithoutRelationshipByType(type) {
        return this.db.rel.find(type + '_only').then(res => {
            const pluralName = this.getPluralName(type);
            this.response = { status: this.success, message: '', records: res[pluralName] };
            return this.response;
        }).catch(error => {
            this.response = { status: this.failed, message: error.message, records: [] };
            return Promise.resolve(this.response);
        });
    }

    // Fetch single table docs by parent doc id with relationship
    fetchChildDocsWithRelationshipByParentTypeAndId(child_type, parent_type, parent_id, withchild: boolean, referencedetail?) {

        const objectList = Object.keys(this.dbConfiguration.tableStructure);
        if (objectList.indexOf(parent_type) < 0) {
            this.response = { status: this.failed, message: 'Invalid parent type', records: [] };
            return Promise.resolve(this.response);
        } else {
            const validateStatus = this.validateReferenceDetails(referencedetail);
            if (validateStatus.status === this.success) {
                return this.db.rel.findHasMany(child_type + '_only', parent_type, parent_id).then(res => {
                    if (withchild) {
                        return this.checkChildObjectsForFetch(child_type, res, referencedetail).then(res => {
                            return this.checkLookupObjectsForFetch(child_type, res, referencedetail).then(result => {
                                this.response = { status: this.success, message: '', records: result };
                                return this.response;
                            });
                        });
                    } else {
                        return this.checkLookupObjectsForFetch(child_type, res, referencedetail).then(result => {
                            this.response = { status: this.success, message: '', records: result };
                            return this.response;
                        });
                    }
                }).catch(error => {
                    this.response = { status: this.failed, message: error.message, records: [] };
                    return Promise.resolve(this.response);
                });
            } else {
                return Promise.resolve(validateStatus);
            }
        }
    }

    // Fetch single table docs by parent doc id without relationship
    fetchDocsWithoutRelationshipByParentTypeAndId(childtype, parent_type, parent_id) {

        const objectList = Object.keys(this.dbConfiguration.tableStructure);
        if (objectList.indexOf(parent_type) < 0) {
            this.response = { status: this.failed, message: 'Invalid parent type', records: [] };
            return Promise.resolve(this.response);
        } else {
            return this.db.rel.findHasMany(childtype + '_only', parent_type, parent_id).then(res => {
                const pluralName = this.getPluralName(childtype);
                this.response = { status: this.success, message: '', records: res[pluralName] };
                return this.response;
            }).catch(error => {
                this.response = { status: this.failed, message: error.message, records: [] };
                return Promise.resolve(this.response);
            });
        }
    }

    checkLookupObjectFetchMethod(type, res, referencedetail){
    return this.checkLookupObjectsForFetch(type, res, referencedetail).then(result => {
        this.response = { status: this.success, message: '', records: result };
        return this.response;
    });}

  



    // Fetch single doc by doc id with relationship
    fetchDocWithRelationshipByTypeAndId(type, id, withchild: boolean, referencedetail?) {
        const validateStatus = this.validateReferenceDetails(referencedetail);
        if (validateStatus.status === this.success) {
            if (withchild) {
                return this.db.rel.find(type, id).then(res => {
                    return this.checkChildObjectsForFetch(type, res, referencedetail).then(res => {
                       return this.checkLookupObjectFetchMethod(type, res, referencedetail);
                    });
                }).catch(error => {
                    this.response = { status: this.failed, message: error.message, records: [] };
                    return Promise.resolve(this.response);
                });
            } else {
                return this.db.rel.find(type + '_only', id).then(res => {
                    return this.checkLookupObjectFetchMethod(type, res, referencedetail);
                }).catch(error => {
                    this.response = { status: this.failed, message: error.message, records: [] };
                    return Promise.resolve(this.response);
                });
            }
        } else {
            return Promise.resolve(validateStatus);
        }
    }

    // Fetch single doc by doc id without relationship
    fetchDocWithoutRelationshipByTypeAndId(type, id) {
        const rel_id = this.db.rel.makeDocID({ 'type': type, 'id': id });
        return this.db.get(rel_id).then(doc => {
            this.response = { status: this.success, message: '', records: [this.convertRelDocToNormalDoc(doc)] };
            return this.response;
        }).catch(error => {
            this.response = { status: this.failed, message: error.message, records: [] };
            return Promise.resolve(this.response);
        });
    }


    // Fetch attachements for given docs
    fetchAttachmentsForThisDocs(type, docs) {
        const taskList = [];
        docs.forEach(element => {
            if (element.attachments) {
                taskList.push(this.fetchAttachmentsForThisDoc(type, element).then(res => {
                    return element;
                }));
            }
        });

        return Promise.all(taskList).then(res => {
            this.response = { status: this.success, message: '', records: res };
            return this.response;
        })
    }
    // Fetch attachements for given doc
    fetchAttachmentsForThisDoc(type, doc) {
        const subTaskList = [];
        Object.keys(doc.attachments).forEach(element => {
            subTaskList.push(this.db.rel.getAttachment(type, doc.id, element).then(res => {
                return this.convertAttachmentToBase64(res).then(result => {
                    doc.attachments[element] = result;
                });
            }));
        });

        return Promise.all(subTaskList).then(res => {
            this.response = { status: this.success, message: '', records: [doc] };
            return this.response;
        }).catch(error => {
            this.response = { status: this.failed, message: error.message, records: [] };
            return Promise.resolve(this.response);
        });
    }


    /****************************************************
            Supporting methods for data fetching
    *****************************************************/


    //Convert attachment to base64
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
                                        return this.fetchAllLookupDocForSingleDocCatchBlock(element,error);

                                    }));
                            }
                        });
                    }
                } else {
                    Object.keys(element).forEach(keys => {
                        if (keys.startsWith(objectType + '_') || keys === objectType) {
                            lookupFetchingTaskList.push(
                                this.fetchLookupDocByTypeAndId(objectType, element[keys]).then(doc => {
                                    element[keys] = doc;
                                }).catch(error => {
                                  return this.fetchAllLookupDocForSingleDocCatchBlock(element,error);
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

    private fetchAllLookupDocForSingleDocCatchBlock(element,error){
        console.log('Lookup fetching failed for this doc ' + element['type'] +
        '_2_' + element['id'] + '  Error:' + JSON.stringify(error));
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
    private findDocsWithSelector(options) {
        if (options.fields) {
          
            if (options.fields.indexOf('_id') > -1) {
                return this.checkSortFields(options).then(res => {
                    return res;
                });
            } else {
                return Promise.resolve('Fields must contains _id');
            }
        } else {
            return this.checkSortFields(options).then(res => {
                return res;
            });
        }
    }

    // Check sort by fields
    private checkSortFields(options) {
        if (options.sort) {
            const sortFields = options.sort;
            const indexfields = [];
            sortFields.forEach(element => {
                indexfields.push(this.isJson(JSON.stringify(element)));
            });
            return this.indexCreation(indexfields).then(res => {
                options['use_index'] = res['id'];

                return this.findAPI(options);
            });
        } else {
            return this.indexCreation(['data.type']).then(datatyperes => {
                options['use_index'] = datatyperes['id'];

                return this.findAPI(options);
            });
        }
    }

    // Fetch docs using find query
    private findAPI(options) {
        return this.db.find(options).then(result => {
            const resultArray = [];
            result['docs'].forEach(element => {
                resultArray.push(this.convertRelDocToNormalDoc(element));
            });
            return resultArray;
        }).catch(error => {
            return Promise.resolve(error.message);
        });
    }

    // Index creation
    public indexCreation(fields) {
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
            return {
                status: this.success, message: '', records: []
            };
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
            const objectList = Object.keys(this.dbConfiguration.tableStructure);
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
    public fetchDataWithReferenceReverse(referenceDetail, queryJson, additionalInfo?) {

        const additionalInfo1 = {
            parentInfo: {
                parentType: undefined,
                parentId: undefined
            }, id: "",
            bookmark: "",
            response: [],
            batchId: ""
        };
        if (additionalInfo !== undefined) {
            additionalInfo1.parentInfo.parentType = additionalInfo['parentType'];
            additionalInfo1.parentInfo.parentId = additionalInfo['parentId'];
            if (additionalInfo['id'] !== undefined && additionalInfo['id'] !== '') {
                additionalInfo1.id = additionalInfo['id'];
            }
            if (additionalInfo['batchId'] !== undefined && additionalInfo['batchId'] !== '') {
                additionalInfo1.batchId = additionalInfo['batchId'];
            }
        }
        var finalArray = [];
        return this.recursiveFetchReverse(referenceDetail, queryJson, finalArray, additionalInfo1).then(res => {
            const response = {
                status: this.success,
                message: '',
                ids: finalArray,
                records: res['docs'],
                batchId: res['batchId']
            };
            return Promise.resolve(response)
        }).catch(error => {
            return this.fetchdatawithRelationshipCatchBlock(error);
           
        });
    }

    private recursiveFetchReverse(referenceDetail, queryJson, finalArray, additionalInfo?: AdditionalInfo) {
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
                    /* selector['_id'] = objectName + "_2_" + additionalInfo.id;
                    optionsFieldsArray.push('_id') */
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
                } else if (additionalInfo.batchId !== undefined && additionalInfo.batchId !== "") {
                    selector['_id'] = {
                        "$gt": additionalInfo.batchId
                    }
                    optionsFieldsArray.push('_id')
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
                    /* selector['_id'] = objectName + "_2_" + additionalInfo.id;
                    optionsFieldsArray.push('_id') */
                    const stringConstructor = "test".constructor;
                    const objectConstructor = {}.constructor;
                    if (additionalInfo.id.constructor === stringConstructor) {
                        options['selector']['_id'] = objectName + "_2_" + additionalInfo.id;
                    }
                    else if (additionalInfo.id.constructor === objectConstructor) {
                        options['selector']['_id'] = additionalInfo.id;
                    }
                } else if (additionalInfo.batchId !== undefined && additionalInfo.batchId !== "") {
                    options['selector']['_id'] = {
                        "$gt": additionalInfo.batchId
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

        options['limit'] = this.batchLimit + 1


        return this.indexCreation(optionsFieldsArray).then(indexRes => {
            options['use_index'] = indexRes['id'];
            // console.log("Pouch objectName :", objectName, "Options : ", options);
            return this.fetchData(options).then(parentRes => {
                parentRes['docs'] = lodash.sortBy(parentRes['docs'], doc => {
                    return doc['_id'];
                })

                const parentDataIndex = {};

                const resultArray = [];
                const idArray = [];
                for (let i = 0; i < parentRes['docs'].length; i++) {
                    const data = this.convertRelDocToNormalDoc(parentRes['docs'][i]);
                    resultArray.push(data)

                    // console.log("objectName :", objectName,
                    //     "objectType : ", referenceDetail['objectType'],
                    //     " relationShipType: ", referenceDetail['relationShipType']);

                    if (referenceDetail['objectType'] && referenceDetail['objectType'].toUpperCase() == "LOOKUP") {
                        idArray.push(data['id'])
                    } else if (referenceDetail['relationShipType']
                        && (referenceDetail['relationShipType'].toUpperCase() == "ONE_TO_ONE"
                            || referenceDetail['relationShipType'].toUpperCase() == "ONE_TO_MANY")) {
                        // var key = "pfm" + referenceDetail['childObject'][0]['objectId']
                        let key = "";
                        if (referenceDetail['childObject'][0]['objectId'].includes('pfm')) {
                            key = referenceDetail['childObject'][0]['objectId']
                        } else {
                            key = "pfm" + referenceDetail['childObject'][0]['objectId'];
                        }
                        if (data[key]) {
                            idArray.push(key + "_2_" + data[key])
                        } else {
                            console.log("Pouch objectName :", objectName, "Id : ", objectName + "_2_" + data['id']);
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
                        taskList.push(this.getChildObjectDataReverse(childJsonArray[0], objectName + "_" + referenceDetail['fieldId'], parentIdJson, queryJson, finalArray));
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
                    // if (childJsonArray[0]['childObject'].legth > 0
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
                    // console.log("objectName :", objectName, "allRes : ", allRes);

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
                            response: [],
                            batchId: ""
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
                            const parentData = JSON.parse(JSON.stringify(parentRes['docs']))
                            additionalInfoNextBatch.batchId = objectName + "_2_" + parentData[parentData.length - 1]['id']
                            parentRes['docs'].splice(parentRes['docs'].length - 1, 1);
                            Array.prototype.push.apply(additionalInfoNextBatch['response'], parentRes['docs'])
                        }

                        return this.recursiveFetchReverse(referenceDetail, queryJson, finalArray, additionalInfoNextBatch).then(res => {
                            return res;
                        });
                    }
                })
            }).catch(error => {
                return this.fetchRecursiveCatchBlock(error);
                
            });
        });
    }

    getChildObjectDataReverse(childObjectReference, objectName, parentIdJson, queryJson, finalArray) {
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


    /****************************************************
        Development tesing
    *****************************************************/


    saveTest() {

        /* let doc = { 'name': 'ganesan' }
        this.save('attachementtest', doc).then(res => {
            console.log(res) //id:D0567E42-E8C9-9221-9710-005C94F07F12
        })*/

        // this.fetchDocWithoutRelationshipByTypeAndId('attachementtest', 'E746B060-C5E1-9AD1-A9E5-406509789A7F').then(res => {
        //     if (res.status == this.success) {
        //         let attachement = {
        //             'content_type': 'image/png',
        //             'data': 'iVBORw0KGgoAAAANSUhEUgAAAHwAAAB8CAIAAAAkfEPpAAACCUlEQVR42u3dQQ6DMAwEQP7/6fYLRdl1Ah0fKwphguTaRur1EeNxIYAOXQygX4X4aRE3j797zrtraztAhw4d+jR66oZ33djKOtsO0KFDh74T/XaiuHmeVJJMraHuAB06dOgvQF9JYo1iZ2Vt0KFDh/7v6O0GWarYgQ4dOvQ3o5/QSJosyl7VZYQOHTr01kD2gZ8//m0A6NCh/y36yTH5ENTvBTp06NCH0U8YRLQbVe3vQocOHfpO9NTwN9VISjXIVhAbQ3Do0KFDn0BPDSImB9m7HpTYYBo6dOjQN6K3G0apRLfyMlPqAYIOHTr0U9BTRc0JTa67KI0HCDp06NCn0VMNnVSSTBUskxsJHTp06KegT+KmirITGluVihQ6dOjQBwbTqRtuFC/tDYs10aBDhw59AL0xkG0PGRqNufo5oUOHDn0AvQE0mYQb1029LAUdOnTo0+iTQ4Ndm9dI2tChQ4f+VPRGUppM1JNJFTp06NB3osea9OXG0yRopbiDDh069AH0dqQKk8ZQJVUkQocOHfop6Fch2ptRKV4KQ2ro0KFD34neTpip4W+q8Bkt4qBDhw59I3r75ZtGAbLrB8JPx0CHDh36C9BXrpVKdKnNhg4dOnToeaxdRdljiiPo0KFDv/p/7N1IpCvngQ4dOvQ3o08Opic3uD1AXyqOoEOHDj2ILmYCOnToohRfzHZATL6tjdsAAAAASUVORK5CYII=',
        //             'filename': 'testimage12'
        //         }
        //         this.saveDocWithAttachments('attachementtest', res.records[0], [attachement]).then(res => {
        //             console.log(res)
        //         })
        //     }
        // })


    }

   



    // Fetch Primary using find option and fetch relation ship docs using view document
    public fetchdatawithRelationship(referenceDetail, layoutDataRestrictionSet?, additionalInfo?) {
        const additionalInfo1 = {
            parentInfo: {
                parentType: undefined,
                parentId: undefined
            }, id: "",
            bookmark: "",
            response: [],
            batchId: ""
        };
        if (additionalInfo !== undefined) {
            additionalInfo1.parentInfo.parentType = additionalInfo['parentType'];
            additionalInfo1.parentInfo.parentId = additionalInfo['parentId'];
            if (additionalInfo['id'] !== undefined && additionalInfo['id'] !== '') {
                additionalInfo1.id = additionalInfo['id'];
            }
            if (additionalInfo['batchId'] !== undefined && additionalInfo['batchId'] !== '') {
                additionalInfo1.batchId = additionalInfo['batchId'];
            }
        }
        return this.fetchRecursive(referenceDetail, layoutDataRestrictionSet, additionalInfo1).then(res => {
            const response = {
                status: this.success,
                message: '',
                records: res['docs'],
                batchId: res['batchId']
            };
            return Promise.resolve(response)
        }).catch(error => {
           return this.fetchdatawithRelationshipCatchBlock(error);
        });
    }

    private fetchdatawithRelationshipCatchBlock(error)
    {
        
        return Promise.resolve({
            status: this.failed,
            message: error.message, records: [],
            batchId: ''
        })
    }

     private fetchRecursive(referenceDetail, layoutDataRestrictionSet?, additionalInfo?: AdditionalInfo) {
          // const objectName = "pfm" + referenceDetail['objectId']
          let objectName = ""
          if (referenceDetail['objectId'].includes('pfm')) {
              objectName = referenceDetail['objectId']
          } else {
              objectName = "pfm" + referenceDetail['objectId']
          }
  
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
                      selector['_id'] = objectName + "_2_" + additionalInfo.id;
                      optionsFieldsArray.push('_id')
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
  
          options['limit'] = this.batchLimit + 1
          if (additionalInfo.batchId !== undefined && additionalInfo.batchId !== "") {
              options['selector']['_id'] = {
                  "$gt": additionalInfo.batchId
              }
          }
  
          return this.indexCreation(optionsFieldsArray).then(indexRes => {
              options['use_index'] = indexRes['id'];
              return this.fetchData(options).then(parentRes => {
                parentRes['docs'] = lodash.sortBy(parentRes['docs'], doc => {
                    return doc['_id'];
                })
                const resultArray = [];
                const responseStruct = {
                    "rows": []
                }
                const rowSobj = []
                for (let i = 0; i < parentRes['docs'].length; i++) {
                    const data = this.convertRelDocToNormalDoc(parentRes['docs'][i]);
                    resultArray.push(data)
                        const resultObject = {
                            "doc": parentRes['docs'][i]
                        }
                        rowSobj.push(resultObject)
                }
                parentRes['docs'] = resultArray;
                responseStruct['rows'] = rowSobj;
                const taskList = [];
               taskList.push(this.handleResponse(responseStruct, referenceDetail))
                  return Promise.all(taskList).then(allRes => {
                    
                      
                    if (parentRes['docs'].length < this.batchLimit) {
                        Array.prototype.push.apply(allRes[0], additionalInfo['response'])
                        parentRes['batchId'] = additionalInfo['batchId']
                    } else {
                        const additionalInfoNextBatch = {
                            parentInfo: {
                                parentType: undefined,
                                parentId: undefined
                            }, id: "",
                            bookmark: "",
                            response: [],
                            batchId: ""
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
                            const parentData = JSON.parse(JSON.stringify(allRes[0]))
                            additionalInfoNextBatch.batchId = objectName + "_2_" + parentData[parentData.length - 1]['id']
                            allRes.splice(allRes[0].length - 1, 1);
                            Array.prototype.push.apply(additionalInfoNextBatch['response'], allRes[0])
                        }

                        return this.recursiveFetch(referenceDetail, layoutDataRestrictionSet, additionalInfoNextBatch).then(res => {
                            return res;
                        });
                    }
                      return Promise.resolve({
                        status: this.success,
                        message: "",
                        docs: allRes[0]
                    });
                  })
              }).catch(error => {
               return this.fetchRecursiveCatchBlock(error);
              });
          });
    }

    private fetchRecursiveCatchBlock(error){
        
        return Promise.resolve({
            status: this.failed,
            message: error.message,
            docs: []
        })
    }

  

 
    public fetchDataWithReference(referenceDetail, layoutDataRestrictionSet?, additionalInfo?) {

        const additionalInfo1 = {
            parentInfo: {
                parentType: undefined,
                parentId: undefined
            }, id: "",
            bookmark: "",
            response: [],
            batchId: ""
        };
        if (additionalInfo !== undefined) {
            additionalInfo1.parentInfo.parentType = additionalInfo['parentType'];
            additionalInfo1.parentInfo.parentId = additionalInfo['parentId'];
            if (additionalInfo['id'] !== undefined && additionalInfo['id'] !== '') {
                additionalInfo1.id = additionalInfo['id'];
            }
            if (additionalInfo['batchId'] !== undefined && additionalInfo['batchId'] !== '') {
                additionalInfo1.batchId = additionalInfo['batchId'];
            }
        }
        return this.recursiveFetch(referenceDetail, layoutDataRestrictionSet, additionalInfo1).then(recursiveres => {
            const response = {
                status: this.success,
                message: '',
                records: recursiveres['docs'],
                batchId: recursiveres['batchId']
            };
            return Promise.resolve(response)
        }).catch(error => {
           return this.fetchdatawithRelationshipCatchBlock(error);
        });
    }

   

    private recursiveFetch(referenceDetail, layoutDataRestrictionSet?, additionalInfo?: AdditionalInfo) {
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
                    selector['_id'] = objectName + "_2_" + additionalInfo.id;
                    optionsFieldsArray.push('_id')
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

        options['limit'] = this.batchLimit + 1
        if (additionalInfo.batchId !== undefined && additionalInfo.batchId !== "") {
            options['selector']['_id'] = {
                "$gt": additionalInfo.batchId
            }
        }

        return this.indexCreation(optionsFieldsArray).then(indexRes => {
            options['use_index'] = indexRes['id'];
            return this.fetchData(options).then(parentRes => {
                parentRes['docs'] = lodash.sortBy(parentRes['docs'], doc => {
                    return doc['_id'];
                })

                const lookupObjects = this.getChild(referenceDetail['childObject'], "LOOKUP");
                const parentDataIndex = {};

                const resultArray = [];
                const idArray = [];
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
        taskList.push(this.formulaDbProvider.fetchformulaValue(formulaQuery).then(result => {
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
                        parentRes['batchId'] = additionalInfo['batchId']
                        return Promise.resolve(parentRes)
                    } else {
                        const additionalInfoNextBatch = {
                            parentInfo: {
                                parentType: undefined,
                                parentId: undefined
                            }, id: "",
                            bookmark: "",
                            response: [],
                            batchId: ""
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
                            const parentData = JSON.parse(JSON.stringify(parentRes['docs']))
                            additionalInfoNextBatch.batchId = objectName + "_2_" + parentData[parentData.length - 1]['id']
                            parentRes['docs'].splice(parentRes['docs'].length - 1, 1);
                            Array.prototype.push.apply(additionalInfoNextBatch['response'], parentRes['docs'])
                        }

                        return this.recursiveFetch(referenceDetail, layoutDataRestrictionSet, additionalInfoNextBatch).then(res => {
                            return res;
                        });
                    }
                })
            }).catch(error => {
                return this.fetchRecursiveCatchBlock(error);
               
            });
        });
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


    // method to query list page data
    queryListDataWithBatch(referenceDetail: ReferenceDetail, createdby?: Array<number>) {
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
            return this.queryUserWiseData(referenceDetail, createdby, index, this.queryBatchLimit, resultArray).then(res => {
                return Promise.resolve({
                    status: this.success,
                    message: "",
                    records: resultArray
                });
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

        return this.executeQuery("type_createdby_docid_view", queryOptions, referenceDetail).then(res => {
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
                    status: this.failed,
                    message: "Error",
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
                return this.statusFailedAndServerError();

            });
    }

    executeAllDocs(queryOptions, referenceDetail: ReferenceDetail) {
        return this.db.allDocs(queryOptions)
            .then(result => {
                return this.handleResponse(result, referenceDetail);
            })
            .catch(err => {
                return this.statusFailedAndServerError();

            });
    }

    queryBulkDoc(referenceDetail: ReferenceDetail, docIds: Array<string>) {
        var queryOptions = {};
        var type = this.getObjectType(referenceDetail);
        var ids = docIds.map(docId => {
            return this.getDocId(type, docId)
        })
        queryOptions = {
            keys: ids,
            include_docs: true
        };
        return this.executeAllDocs(queryOptions, referenceDetail).then(res => {
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

    handleResponse(result, referenceDetail: ReferenceDetail) {
        if (result["rows"]) {
            const lookupHierarchyJSONArray = this.getChild(referenceDetail["childObject"], "LOOKUP");
            const childObjects = this.getChild(referenceDetail["childObject"], "MASTERDETAIL");
            const parentObject = this.getChild(referenceDetail["childObject"], "HEADER");
            const commonLookUpObjects = this.getChild(referenceDetail["childObject"], "COMMONLOOKUP");
            const objectType = this.getObjectType(referenceDetail);
            const formulaObject = referenceDetail["formulaField"]
            const rollUpObject = referenceDetail["rollupField"]

            const lookupIdDataMapping = {};
            const commonLookupIdDataMapping = {};
            const dataArray = [];
            const formulaQuery = [];
            const rollUpQuery = [];

            const parentDataMapping = {};
            const childQueryKeys = {};

            var taskList = [];
            const lookUpIdInfo = {}
            const commonLookUpIdInfo = {}

            for (let i = 0; i < result["rows"].length; i++) {
                if (result["rows"][i]["doc"]) {
                    const data = this.convertRelDocToNormalDoc(result["rows"][i]["doc"]);
                    parentDataMapping[data["id"]] = i;
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
                        childQueryKeys[childObjectType].push(childObjectType + data["id"]);
                    });

                    if (formulaObject) {
                        formulaQuery.push(objectType + 'formula' + data["id"])
                    }

                    if (rollUpObject) {
                        rollUpQuery.push(objectType + 'rollup' + data["id"])
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

            if (formulaQuery.length > 0) {
                taskList.push(this.formulaDbProvider.fetchformulaValue(formulaQuery).then(result => {
                    if (result && result['status'] && result['records'] && result['status'] == this.success && result['records'].length > 0) {
                        result = result['records']
                        result.forEach(element => {
                            element = element['doc']['data']
                            var index = parentDataMapping[element['reference_id']];
                            formulaObject.forEach(fieldName => {
                                dataArray[index][fieldName['fieldName'] + appConstant['customFieldSuffix']['formula']] = element[fieldName['fieldName']]
                            })
                        });
                        return result
                    } else {
                        return
                    }
                }))
            }
            if (rollUpQuery.length > 0) {
                taskList.push(this.formulaDbProvider.fetchRollUpValue(rollUpQuery).then(result => {
                    if (result['status'] == this.success && result['records'].length > 0) {
                        result = result['records']
                        result.forEach(element => {
                            element = element['doc']['data']
                            const index = parentDataMapping[element['reference_id']];
                            rollUpObject.forEach(fieldName => {
                                dataArray[index][fieldName['fieldName'] + appConstant.customFieldSuffix.rollup_summary] = element[fieldName['fieldName']]
                            })
                        });
                        return result
                    } else {
                        return
                    }
                }))
            }
            if (dataArray.length > 0) {
                childObjects.forEach(childObject => {
                    const childObjectType = this.getObjectType(childObject);
                    taskList.push(this.queryChildData(childObject, childQueryKeys[childObjectType], parentDataMapping, dataArray, objectType));
                });

                if (parentObject.length > 0) {
                    const parentObjectType = this.getObjectType(parentObject[0]);
                    for (let i = 0; i < dataArray.length; i++) {
                        taskList.push(this.getParentObjectRecords(dataArray[i], parentObject[0], parentObjectType));
                        // taskList.push(this.getParentObjectData(childJsonArray[objectTypeList.indexOf("PARENT")], parentRes['docs'][i], layoutDataRestrictionSet))
                    }
                }
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
                            taskList.push(this.queryLookupData(lookUpObject, lookUpIdInfo[fieldId], lookupIdDataMapping, dataArray));
                        }
                    })
                }
                if (commonLookUpObjects.length > 0) {
                    commonLookUpObjects.forEach(commonLookUpObject => {
                        const fieldId = commonLookUpObject["fieldName"];
                        if (commonLookUpIdInfo[fieldId] && commonLookUpIdInfo[fieldId].length > 0) {
                            taskList.push(this.queryCommonLookupData(commonLookUpObject,
                                commonLookUpIdInfo[fieldId], commonLookupIdDataMapping, dataArray));
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
    getParentObjectRecords(dataObject, parentObjectReference: ReferenceDetail, parentObjectType) {


        var queryOptions = {
            key: this.getDocId(parentObjectType, dataObject[parentObjectType]),
            include_docs: true
        };
        return this.executeAllDocs(queryOptions, parentObjectReference).then(res => {
            if (res && res.constructor == Array) {
                dataObject[this.getPluralName(parentObjectType)] = res;
                return dataObject;
            } else {
                dataObject[this.getPluralName(parentObjectType)] = [];
                return dataObject;
            }
        }).catch(err => {
            console.log("err ====>", err);
            return this.statusFailedAndServerError();

        });

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

    queryLookupData(lookupObject, lookupIds, lookupIdDataMapping, dataArray) {
        return this.queryLookups(lookupIds, lookupObject).then(res => {
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
            return dataArray;
        });
    }

    queryCommonLookupData(commonLookupObject, commonLookupIds, commonLookupIdDataMapping, dataArray) {
        return this.queryLookups(commonLookupIds, commonLookupObject).then(res => {
            res.forEach(resObj => {
                const fieldId = commonLookupObject["fieldName"];
                const indexArray = commonLookupIdDataMapping[fieldId][resObj["id"]];
                indexArray.forEach(i => {
                    dataArray[i][fieldId] = resObj;
                });
            });
            return dataArray;
        });
    }

    queryLookups(lookupId, referenceDetail) {
        return this.db.allDocs({ include_docs: true, keys: lookupId }).then(res => {
            return this.handleResponse(res, referenceDetail);
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
                console.log("offline startQuery err ====>", err);
                return this.statusFailedAndServerError();

            });
    }

    querySingleDoc(referenceDetail: ReferenceDetail, docId: string) {
        var queryOptions = {};
        var type = this.getObjectType(referenceDetail);
        queryOptions = {
            key: this.getDocId(type, docId),
            include_docs: true
        };
        return this.executeAllDocs(queryOptions, referenceDetail).then(res => {
            if (res && res.constructor == Array) {
              return this.querySingleDocSuccessResponse(res);
            } else {
               return this.querySingleDocFailureResponse();
            }
        });
    }

    querySingleDocSuccessResponse(res){
        return Promise.resolve({
            status: this.success,
            message: "",
            records: res
        });
    }

    querySingleDocFailureResponse(){
        return Promise.resolve({
            status: this.failed,
            message: "Error",
            records: []
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
                    return this.statusFailedAndServerError();

                });
        } else {
            queryOptions = {
                key: type + this.parseDocId(parentDocId),
                include_docs: false
            };
            return this.db.query("masterdetailview", queryOptions)
                .then(getChildCountResult => {
                    // return this.handleResponse(result, referenceDetail);
                    

                    return Promise.resolve({
                        status: this.success,
                        message: "",
                        records: getChildCountResult['rows']
                    });
                })
                .catch(err => {
                    return this.statusFailedAndServerError();

                });
        }
    }

    queryChildListDataWithBatch(referenceDetail: ReferenceDetail, parentDocId: string, createdby?: Array<number>) {
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
            return this.queryUserWiseChildData(referenceDetail, parentDocId, createdby, index, this.queryBatchLimit, resultArray).then(res => {
                return Promise.resolve({
                    status: this.success,
                    message: "",
                    records: resultArray
                });
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

            return this.executeQuery("masterdetail_createdby_docid_view", queryOptions, referenceDetail).then(res => {
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

    queryUserWiseChildData(referenceDetail: ReferenceDetail, parentDocId: string, createdby: Array<number>, index: number, limit: number, resultArray: Array<any>) {
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

        return this.executeQuery("masterdetail_createdby_docid_view", queryOptions, referenceDetail).then(res => {
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
                        return this.queryUserWiseChildData(referenceDetail, parentDocId, createdby, nextIndex, limit - res.length, resultArray);
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


    private findAPIforBatch(options, isSingleBatchFetch, arrayList?) {
        return this.db.find(options).then(result => {
            const resultArray = [];
            result['docs'].forEach(element => {
                resultArray.push(this.convertRelDocToNormalDoc(element))
            });

            if (arrayList !== undefined) {
                Array.prototype.push.apply(arrayList, resultArray);
                result['docs'] = arrayList;
            } else {
                result['docs'] = resultArray;
            }

            if (!isSingleBatchFetch && resultArray.length > 0 && result['bookmark'] && result['bookmark'] !== '') {
                options['bookmark'] = result['bookmark']
                return this.findAPIforBatch(options, isSingleBatchFetch, result['docs'])
            } else {
                return Promise.resolve(result)
            }

        }).catch(error => {
            return Promise.resolve(error.message)
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

    oneTimeReplicationFromServerWithSpecificObject(selector) {
        return this.initialProcess.fetchAndInsertBulkDocsWithSpecificObjects(this.db, this.remote, this.dbConfigurationObj, selector).then(bulkDocRes => {
            if (bulkDocRes) {
                return Promise.resolve('Success');
            } else {
                return Promise.resolve('Failed');
            }
        }).catch(err => {
            return Promise.resolve('Failed');
        })
    }

    setCurrentObjectSetInLocalStorage() {

        let syncEnabledObjectSelectors = []
        this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors.forEach(element => {
            if (element['data.type']) {
                syncEnabledObjectSelectors.push(element['data.type']);
            }
        });
        this.getDocumentFromLocalStorage(appConstant.syncEnabledObjectDocName).then(document => {
            let doc;
            if (document) {
                doc = {
                    _id: appConstant.syncEnabledObjectDocName,
                    _rev: document._rev,
                    object_set: syncEnabledObjectSelectors
                }
            } else {
                doc = {
                    _id: appConstant.syncEnabledObjectDocName,
                    object_set: syncEnabledObjectSelectors
                }
            }
            return this.db.put(doc).then(response => {
                if (response['ok']) {
                    return Promise.resolve(true);
                } else {
                    
                    return Promise.resolve(false);
                }
            }).catch(err => {
                console.log(err);
                return Promise.resolve(false);
            });
        });
    }

    validateUniqueMasterId(isAddEditAction, type, dataObject, uniqueId) {
        var resultArray = []
        const key = type + uniqueId + dataObject[uniqueId]
        const viewDocName = 'masterdetailview'
        const queryOptions = {
            key: key,
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
                return this.statusFailedAndServerError();

            }
        }).catch(err => {
            return this.statusFailedAndServerError();
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
                    if (referenceDetail['formulaField'] || referenceDetail['rollupField']) {
                        return this.setFormulaAndRollupField(referenceDetail, data).then(formulaRollupRes => {
                            
                            finalRes[type1] = formulaRollupRes
                            return this.formulaDataObjectRecursiveFetch(result, referenceDetail, finalRes);
                        })
                    } else {
                        finalRes[type1] = data
                        return this.formulaDataObjectRecursiveFetch(result, referenceDetail, finalRes);
                    }
                }
                return this.formulaDataObjectRecursiveFetch(result, referenceDetail, finalRes);
            })
            .catch(err => {
                return this.statusFailedAndServerError();

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
            return this.formulaDbProvider.fetchformulaValue(formulaQuery).then(result => {
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
            return this.formulaDbProvider.fetchRollUpValue(rollUpQuery).then(result => {
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
        return data;
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
           return this.formulaDataObjectRecursiveFetchSuccessBlock(finalRes)
        });
    }

    private formulaDataObjectRecursiveFetchSuccessBlock(finalRes){
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
                                            return this.statusFailedAndServerError();

                                        }
                                    }).catch(err => {
                                        return this.statusFailedAndServerError();

                                    });
                            } else {
                                return this.statusFailedAndServerError();

                            }
                        }).catch(err => {
                            return this.statusFailedAndServerError();

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
                return this.statusFailedAndServerError();

            }
        }).catch(err => {
            return this.statusFailedAndServerError();
        });
    }

    statusFailedAndServerError(){
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
    }

    // Get Formula Object from DataObject using Hierarchy JSON
    fetchRecursiveFormulaObjectUsingHierarchy(formulaObjectArray, resultObject: any, childObjects, finalRes) {
        const taskList = [];
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
                return this.statusFailedAndServerError();

            }
        });
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
            return this.successBlock(finalRes);
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
                        return this.successBlock(finalResult);
                    } else {
                        return this.statusFailedAndServerError();

                    }
                })
        } else {
            return this.recursiveFetchFormulaObjectForParent(childObjects, finalRes, parentName, parentId).then(finalResult => {
                if (finalResult["status"] === this.success) {
                   return this.successBlock(finalResult);
                } else {
                    return this.statusFailedAndServerError();

                }
            })
        }
    }

    successBlock(finalResult){
        return Promise.resolve({
            status: this.success,
            message: "",
            records: finalResult["records"]
        });
    }

    fetchRecordsUsingSearchDesignDocs(query, hierarchyJson) {
        let objectName = ""
        if (isNaN(hierarchyJson['objectId'])) {
            objectName = hierarchyJson['objectId']
        } else {
            objectName = "pfm" + hierarchyJson['objectId']
        }
        const designDocName = objectName + "_search";
        return this.callSearchDesignDocs(query, designDocName).then(response => {
            
            return this.handleResponse(response, hierarchyJson);
        })
        .catch(error => {
            console.log('error==>' + error);
            return { "status": this.failed, "message": "Server error. Please contact admin." };
        });
    }


    callSearchDesignDocs(query, designDocName, response?) {
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
                "bookmark": response['bookmark']
            }
            responseInfo['rows'] = response['rows']
        } else {
            postParam = {
                "q": query,
                "include_docs": true,
                "limit": this.queryBatchLimit
            }
        }

        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.dbConfiguration)
        
        return new Promise(resolve => {
            const url = this.dbConfiguration.remoteDbUrl + this.dbConfiguration.configuration.databaseName
                + "/_design/" + designDocName + "/_search/" + designDocName;
            this.httpClient.post(url, postParam, headerstring).toPromise()
                .then(res => {
                   
                    const jsonObj = res

                    if (jsonObj['rows'].length < this.queryBatchLimit) {
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



    recursiveFetchFormulaObjectForParent(childObjects, finalRes, parentName, parentId) {
        const taskList = []
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
                        then(result => {
                            if (result["status"] === this.success) {
                                return this.successBlock(result);
                            } else {
                                return this.statusFailedAndServerError();

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
                        then(finalRes => {
                            if (finalRes["status"] === this.success) {
                                return this.successBlock(finalRes);
                               
                            } else {
                                return this.statusFailedAndServerError();

                            }
                        })
                } else {
                    const childJSONObjects = childObjects[j]["childObject"]
                    taskList.push(this.recursiveFetchFormulaObjectForParent(childJSONObjects, parentId, parentName, parentId))
                }
            }
        }
    }
}