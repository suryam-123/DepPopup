import { Injectable } from '@angular/core';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
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
import { cspfmExecutionPouchDbConfiguration } from './cspfmExecutionPouchDbConfiguration';
import { appConstant } from '../utils/appConstant';
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
PouchDB.plugin(PouchFind);
PouchDB.plugin(PouchRelation); // Change pouch utils class in relational npm first time after install npm
PouchDB.plugin(cordovaSqlitePlugin);
PouchDB.plugin(pouchdbValidation);

@Injectable()
export class cspfmExecutionPouchDbProvider {
    private db;
    private dbChanges;
    private liveReplicationDbObject;
    public keysToSchema = {};
    public tableStructure = {};
    public remote = '';
    private response = { 'status': '', 'message': '', 'records': [] };
    private failed = "FAILED"
    private success = 'SUCCESS';
    private childreference = 'childreference';
    private masterandlookupreference = 'masterandlookupreference';
    private batchLimit = 2000;


    constructor(private initialProcess: initialSyncProcess, private appUtilityObj: appUtility, private appconfig: appConfiguration,
        public observableListenerUtils: cspfmObservableListenerUtils, public executionPouchDbConfiguration: cspfmExecutionPouchDbConfiguration,private httpClient:HttpClient) {

    }


    /****************************************************
         Initialize pouchdb and setup db schema
    *****************************************************/
    // Initialize pouchdb
    initializePouchDb() {
        if (this.db === undefined) {
            this.remote = this.executionPouchDbConfiguration.remoteDbUrl + this.executionPouchDbConfiguration.configuration.databaseName;
            const localdatabseName = 'pfm' + '_' + this.appUtilityObj.orgId + '_' + 'executions';
            if (this.appUtilityObj.isMobile) {
                this.db = new PouchDB(localdatabseName + '.db', { adapter: 'cordova-sqlite', location: 'default' });
            } else {
                this.db = new PouchDB(localdatabseName, { size: 50 });
            }
            this.setSchema();
            this.db.setMaxListeners(50);
        }
    }

    // Set relationship schemacs
    private setSchema() {
        this.db.setSchema(this.executionPouchDbConfiguration.configuration.schema);
        this.executionPouchDbConfiguration.configuration.schema.forEach(type => {
            this.keysToSchema[type.singular] = type;
        });
        // Table structure for initialize object
        this.tableStructure = this.executionPouchDbConfiguration.configuration.tableStructure;
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
        this.observableListenerUtils.emit(parsedId.type, change);
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
                auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.executionPouchDbConfiguration)
            };
        } else {
            return {
                live: false,
                retry: true,
                filter: filtername,
                query_params: parameters,
                include_docs: true,
                auth:  this.appUtilityObj.addCredentialforMobile('AUTH', this.executionPouchDbConfiguration)
            };
        }
    }
    // Start fulldata without filter live sync
    fulldataWithoutFilterLiveSync() {
        const options = {
            live: true,
            retry: true,
            include_docs: true,
            auth:  this.appUtilityObj.addCredentialforMobile('AUTH', this.executionPouchDbConfiguration)
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
            auth:  this.appUtilityObj.addCredentialforMobile('AUTH', this.executionPouchDbConfiguration)
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
            auth:  this.appUtilityObj.addCredentialforMobile('AUTH', this.executionPouchDbConfiguration)
        };
        this.liveReplicationDbObject = this.db.sync(this.remote, options);

        /* const sequenceId = appConstant.statusWFPouchLatestSeqence
        this.db.get(sequenceId).then(doc => {
            if (doc['last_seq']) {
                // If id exist one time sync from server using since option
                const options = {
                    live: true,
                    retry: true,
                    filter: '_selector',
                    selector: selector,
                    since: doc['last_seq'],
                    auth: { "username": this.dbConfigurationObj.configuration.user.name, "password": this.dbConfigurationObj.configuration.user.password }
                };
                this.liveReplicationDbObject = this.db.sync(this.remote, options);
            } else {
                const options = {
                    live: true,
                    retry: true,
                    filter: '_selector',
                    selector: selector,
                    auth: { "username": this.dbConfigurationObj.configuration.user.name, "password": this.dbConfigurationObj.configuration.user.password }
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
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.executionPouchDbConfiguration)
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
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.executionPouchDbConfiguration)
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
        return this.initialProcess.startProcess(this.db, this.remote, this.executionPouchDbConfiguration, oneTimeSyncSelector).then(res => {
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
        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.executionPouchDbConfiguration)

        return new Promise(resolve => {
            // Update lastmodifiedon and lastmodifiedby
            const date = new Date();
            const timestamp = date.getTime();
            query = query + 'lastmodifiedon=' + timestamp + '&';
            query = query + 'lastmodifiedby=' + userid + '&';


            const url = this.remote + '/' + path + '/' + id + query + 'rev=' + rev;
            this.httpClient.post(url, '', headerstring).toPromise()
                .then(res => {
                    const resBody = res
                    if (resBody['Status'] === 'Conflict') {
                        this.httpCallUsingUpdateDesignDoc(path, id, query, resBody['newRev'], userid).then(innerRes => {
                            resolve(innerRes);
                        });
                    } else {
                        // return resolve(res);
                        return resolve(resBody)
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
                return ({ status: this.failed, message: 'Invalid user id', "docs": [] });
            }
        }
        return this.db.validatingBulkDocs(bulkDoc).then(res => {
            return ({ status: this.success, "response": JSON.parse(JSON.stringify(res)) });
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
        });
    }


    // Save single document
    save(type, doc) {
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
                                        return this.checkLookupObjectsForFetch(type, res, referencedetail).then(result => {
                                            this.response = { status: this.success, message: '', records: result };
                                            return this.response;
                                        });
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
            return this.db.rel.find(type + '_only').then(res => {
                if (withchild) {
                    return this.checkChildObjectsForFetch(type, res, referencedetail).then(childObjectRes => {
                        return this.checkLookupObjectsForFetch(type, childObjectRes, referencedetail).then(result => {
                            this.response = { status: this.success, message: '', records: result };
                            return this.response;
                        });
                    });
                } else {
                    return this.checkLookupObjectsForFetch(type, res, referencedetail).then(result => {
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

        const objectList = Object.keys(this.executionPouchDbConfiguration.configuration.tableStructure);
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

        const objectList = Object.keys(this.executionPouchDbConfiguration.configuration.tableStructure);
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




    // Fetch single doc by doc id with relationship
    fetchDocWithRelationshipByTypeAndId(type, id, withchild: boolean, referencedetail?) {
        const validateStatus = this.validateReferenceDetails(referencedetail);
        if (validateStatus.status === this.success) {
            if (withchild) {
                return this.db.rel.find(type, id).then(res => {
                    return this.checkChildObjectsForFetch(type, res, referencedetail).then(fetchres => {
                        return this.checkLookupObjectsForFetch(type, fetchres, referencedetail).then(result => {
                            this.response = { status: this.success, message: '', records: result };
                            return this.response;
                        });
                    });
                }).catch(error => {
                    this.response = { status: this.failed, message: error.message, records: [] };
                    return Promise.resolve(this.response);
                });
            } else {
                return this.db.rel.find(type + '_only', id).then(dbres => {
                    return this.checkLookupObjectsForFetch(type, dbres, referencedetail).then(result => {
                        this.response = { status: this.success, message: '', records: result };
                        return this.response;
                    });
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
                    Object.keys(element).forEach(reskey => {
                        if (reskey.startsWith(objectType + '_') || reskey === objectType) {
                            lookupFetchingTaskList.push(
                                this.fetchLookupDocByTypeAndId(objectType, element[reskey]).then(doc => {
                                    element[reskey] = doc;
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
            console.log(options.fields.indexOf('_id'));
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
            return this.indexCreation(['data.type']).then(indexres => {
                options['use_index'] = indexres['id'];

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
            const objectList = Object.keys(this.executionPouchDbConfiguration.configuration.tableStructure);
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
            return this.fetchDataWithReferenceCatchBlock(error);
           
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
                return this.recursiveFetchCatchBlock(error);
               
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

    fetchTest() {

        //  let option1 = {
        //     'selector': {
        //         'data.type': 'employee'
        //     }
        // }

        // let option = {
        //     'selector': {
        //         'data.type': 'employee',
        //         '$and': [
        //             {
        //                 'data.name': { '$eq': 'prabu' }
        //             }
        //         ]
        //     }
        // }

        // this.fetchDocsWithRelationshipUsingFindOption(option, true,{'childreference':['address'],'masterandlookupreference':['department']}).then(res => {
        //     console.log(JSON.stringify(res))
        // })

        // this.fetchDocsWithoutRelationshipUsingFindOption(option).then(res => {
        //     console.log(JSON.stringify(res))
        // })

        // this.fetchDocsWithRelationshipByType('employee', true, { 'childreference': ['address'] }).then(res => {
        //     console.log(JSON.stringify(res))
        // })

        // this.fetchChildDocsWithRelationshipByParentTypeAndId('address', 'employee', '0C4C2938-F924-0AB6-96CA-C1D47513F579', true).then(res => {
        //     console.log(JSON.stringify(res))
        // })

        // this.fetchDocsWithoutRelationshipByType('attachementtest').then(res => {
        //     console.log(JSON.stringify(res))
        // })

        // this.fetchDocsWithoutRelationshipByParentTypeAndId('address', 'employee', '0C4C2938-F924-0AB6-96CA-C1D47513F579').then(res => {
        //     console.log(JSON.stringify(res))
        // })

        // this.fetchDocWithRelationshipByTypeAndId('employee', '0C4C2938-F924-0AB6-96CA-C1D47513F579', true,{'childreference':['address'],'masterandlookupreference':['department']}).then(res => {
        //     console.log(JSON.stringify(res))
        // })

        // this.fetchDocWithoutRelationshipByTypeAndId('employee', '0C4C2938-F924-0AB6-96CA-C1D47513F579').then(res => {
        //     console.log(JSON.stringify(res))
        // })




        // this.fetchDocWithoutRelationshipByTypeAndId('attachementtest', 'E746B060-C5E1-9AD1-A9E5-406509789A7F').then(res => {
        //     if (res.status == this.success) {
        //         this.fetchAttachmentsForThisDoc('attachementtest',res.records[0]).then(res=>{
        //             console.log(JSON.stringify(res))
        //         })

        //     }
        // })

        // this.fetchDocsWithoutRelationshipByType('attachementtest').then(res => {
        //     if (res.status == this.success) {
        //         this.fetchAttachmentsForThisDocs('attachementtest',res.records).then(res=>{
        //             console.log(JSON.stringify(res))
        //         })

        //     }
        // })


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
        return this.recursiveFetch(referenceDetail, layoutDataRestrictionSet, additionalInfo1).then(res => {
            const response = {
                status: this.success,
                message: '',
                records: res['docs'],
                batchId: res['batchId']
            };
            return Promise.resolve(response)
        }).catch(error => {
           return this.fetchDataWithReferenceCatchBlock(error);
        });
    }

    private fetchDataWithReferenceCatchBlock(error){
        console.log("Error", error);
        return Promise.resolve({
            status: this.failed,
            message: error.message, records: [],
            batchId: ''
        })
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
        let options = {}
        let optionsFieldsArray = [];
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
            let indexFieldsArray = Object.keys(options['selector']);

            if (indexFieldsArray.indexOf("$and") > -1 || indexFieldsArray.indexOf("$or") > -1) {
                optionsFieldsArray.push('data.type');
            } else {
                optionsFieldsArray = indexFieldsArray;
            }
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

                const lookupObjects = this.getLookups(referenceDetail['childObject']);
                const parentDataIndex = {};

                const resultArray = [];
                const idArray = [];
                const lookupTypes = []
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
               return this.recursiveFetchCatchBlock(error);
            });
        });
    }


    private recursiveFetchCatchBlock(error){
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

    getLookups(childJsonArray) {
        const lookupObjects = [];
        childJsonArray.forEach(element => {
            if (element['objectType'] === 'LOOKUP') {
                lookupObjects.push(element)
            }
        })
        return lookupObjects;
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

}
