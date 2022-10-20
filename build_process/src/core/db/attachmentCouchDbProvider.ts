import { Injectable } from '@angular/core';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import PouchRelation from 'relational-pouch';
import { appUtility } from '../utils/appUtility';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import pouchdbValidation from 'pouchdb-validation';
// import update from 'pouchdb-update'
import { v4 as uuid} from 'uuid';
import { attachmentDbConfiguration } from './attachmentDbConfiguration';
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
}
PouchDB.plugin(PouchFind);
PouchDB.plugin(PouchRelation); // Change pouch utils class in relational npm first time after install npm
PouchDB.plugin(pouchdbValidation);
// PouchDB.plugin(update);
@Injectable()
export class attachmentCouchDbProvider {
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
    private internetErrorMessage = 'No internet';

    private childreference = 'childreference';
    private masterandlookupreference = 'masterandlookupreference';
    private batchLimit = 2000;


    constructor(private appUtilityObj: appUtility, private network: Network, private appPreferences: AppPreferences,private httpClient:HttpClient,
        public observableListenerUtils: cspfmObservableListenerUtils, public attachmentDbConfiguration: attachmentDbConfiguration) {
        this.initializePouchDb();
    }

    networkWithConnectivity() {
        if (this.attachmentDbConfiguration.configuration.couchDBSyncEnabledObjectSelectors.length > 0) {
            if (this.dbChanges) {
                this.dbChanges.cancel();
            }
            this.startChangeListner(this.attachmentDbConfiguration.configuration.dataFilters['filterName'],
                this.attachmentDbConfiguration.configuration.dataFilters['params'], this.last_seq);
        }
    }

    networkWithOutConnectivity() {
        if (this.attachmentDbConfiguration.configuration.couchDBSyncEnabledObjectSelectors.length > 0) {
            if (this.dbChanges) {
                this.dbChanges.cancel();
            }
        }
    }

    /****************************************************
       Initialize pouchdb and setup db schema
  *****************************************************/



    initializePouchDb() {
        // if (navigator.onLine) {  
        this.remote = this.attachmentDbConfiguration.remoteDbUrl + this.attachmentDbConfiguration.configuration.databaseName;
        this.db = new PouchDB(this.remote, {
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.attachmentDbConfiguration)
        });

        this.setSchema()
        // } else {
        //     console.log('Pouchdb initialize failure!! Network not available.');
        // }

    }
    oneTimeReplicationToServerWithSelector(selector) {
        const options = {
            live: false,
            retry: true,
            filter: '_selector',
            selector: selector,
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.attachmentDbConfiguration)
        };
        return this.db.replicate.to(this.remote, options);
    }
    //Http call for search data in direct couch
    public httpCallSearchDocument(searchText) {
        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.attachmentDbConfiguration)
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
            const url = this.attachmentDbConfiguration.remoteDbUrl + this.attachmentDbConfiguration.configuration.databaseName + "_search/_design/gettitlewisedocs/_view/ttitlewisedocs";
            this.httpClient.post(url, postParam, headerstring).toPromise()
                .then(res => {
                    const resBody = res
                    const response = resBody['results'][0]['rows']
                    return resolve({ 'status': 'Success', 'Message': '', 'records': response })
                }, error => {
                    console.log('error==>' + error)
                    return resolve({ 'status': 'Error', 'Message': 'Server error. Please contact admin.' })
                })
        })
    }

    // Set relationship schema
    setSchema() {
        this.db.setSchema(this.attachmentDbConfiguration.configuration.schema);
        this.attachmentDbConfiguration.configuration.schema.forEach(type => {
            this.keysToSchema[type.singular] = type;
        });
        // Table structure for initialize object
        this.tableStructure = this.attachmentDbConfiguration.configuration.tableStructure;
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
    public startChangeListner(filtername, params, last_seq) {
        this.dbChanges = this.db.changes({
            live: true, continuous: true, since: last_seq, timeout: 30000, filter: filtername,
            query_params: params, include_docs: true, attachments: true
        })
            .on('change', this.onDatabaseChange)
            .on('error', (err) => {
                console.log("attachment couchdb change listener error :", err);
                this.appUtilityObj.couchListenerStopped('attachmentCouchdb', this)
            });
    }

    private onDatabaseChange = (change) => {
        console.log('change', change);
        const parsedId = this.db.rel.parseDocID(change.id);
        change['dataProvider'] = 'CouchDB';
        this.observableListenerUtils.emit(parsedId.type, change);
        this.last_seq = change['seq'];
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


    private findAPIforBatch(options, isSingleBatchFetch, arrayList?) {
        return this.fetch(options, isSingleBatchFetch, arrayList)
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
        const objectList = Object.keys(this.attachmentDbConfiguration.configuration.tableStructure);
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
        const objectList = Object.keys(this.attachmentDbConfiguration.configuration.tableStructure);
        if (objectList.indexOf(parent_type) < 0) {
            this.response = { status: this.failed, message: 'Invalid parent type', records: [] };
            return Promise.resolve(this.response);
        } else {
            return this.findAPIforBatch(options, isSingleBatchFetch).then(findAPIforBatchRes => {
                this.responseForBatch = {
                    status: this.success,
                    message: '',
                    records: findAPIforBatchRes['docs'],
                    bookmark: findAPIforBatchRes['bookmark']
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
                    return this.findAPI(options, isSingleBatchFetch).then(findAPIRes => {
                        this.responseForBatch = {
                            status: this.success,
                            message: '',
                            records: findAPIRes['docs'],
                            bookmark: findAPIRes['bookmark']
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
                    Object.keys(element).forEach(keyResult => {
                        if (keyResult.startsWith(objectType + '_') || keyResult === objectType) {
                            lookupFetchingTaskList.push(
                                this.fetchLookupDocByTypeAndId(objectType, element[keyResult]).then(doc => {
                                    element[keyResult] = doc;
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
            console.log(options.fields.indexOf('_id'));
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

            if (!isSingleBatchFetch && resultArray.length > 0
                && result['bookmark'] && result['bookmark'] !== '') {
                options['bookmark'] = result['bookmark'];
                return this.findAPIforBatch(options, isSingleBatchFetch, result['docs']);
            } else {
                return Promise.resolve(result);
            }

        }).catch(error => {
            return Promise.resolve(error.message);
        });

    }


    // Fetch docs using find query
    private findAPI(options, isSingleBatchFetch, arrayList?) {
        return this.fetch(options, isSingleBatchFetch, arrayList)
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
            const objectList = Object.keys(this.attachmentDbConfiguration.configuration.tableStructure);
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

    public fetchDataWithReference(referenceDetail, additionalInfo?) {

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
        return this.recursiveFetch(referenceDetail, additionalInfo1).then(res => {
            const response = {
                status: this.success,
                message: '',
                records: res['docs'],
                bookmark: res['bookmark']
            };
            return Promise.resolve(response)
        }).catch(error => {
            console.log("Error", error);
            return Promise.resolve({
                status: this.failed,
                message: error.message, records: [],
                bookmark: ''
            })
        });
    }

    private recursiveFetch(referenceDetail, additionalInfo?: AdditionalInfo) {
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

        options['limit'] = this.batchLimit
        if (additionalInfo.bookmark !== undefined || additionalInfo.bookmark !== "") {
            options['bookmark'] = additionalInfo.bookmark;
        }

        return this.indexCreation(optionsFieldsArray).then(indexRes => {
            options['use_index'] = indexRes['id'];

            return this.fetchData(options).then(parentRes => {
                const lookupObjects = this.getLookups(referenceDetail['childObject']);
                const parentDataIndex = {};

                const resultArray = [];
                const idArray = [];
                const lookupIds = [];
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
                        taskList.push(this.getChildObjectData(childJsonArray[i], objectName, parentIdJson, parentRes, parentDataIndex));
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

                        return this.recursiveFetch(referenceDetail, additionalInfoNextBatch).then(res => {
                            return res;
                        });
                    }
                })
            }).catch(error => {
                console.log("Error", error);
                return Promise.resolve({
                    status: this.failed,
                    message: error.message,
                    docs: []
                })
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

    getLookups(childJsonArray) {
        const lookupObjects = [];
        childJsonArray.forEach(element => {
            if (element['objectType'] === 'LOOKUP') {
                lookupObjects.push(element)
            }
        })
        return lookupObjects;
    }

    getChildObjectData(childObjectReference, objectName, parentIdJson, parentRes, parentDataIndex) {
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
        return this.recursiveFetch(childObjectReference, additionalInfo).then(childRes => {
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
    callSearchDesignDocs(query, designDocName, response?, queryFlags?: { include_docs: boolean, include_fields: boolean }) {
        let postParam = {}
        let responseInfo = {
            'rows': [],
            'bookmark': ''
        }
        if (response) {
            postParam = {
                'q': query,
                'include_docs': true,
                'limit': this.batchLimit,
                'bookmark': response['bookmark']
            }
            responseInfo['rows'] = response['rows']
        } else {
            postParam = {
                'q': query,
                'include_docs': true,
                'limit': this.batchLimit
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
        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.attachmentDbConfiguration)
        return new Promise(resolve => {
            const url = this.attachmentDbConfiguration.remoteDbUrl + this.attachmentDbConfiguration.configuration.databaseName
                + '/_design/' + designDocName + '/_search/' + designDocName;
            this.httpClient.post(url, postParam, headerstring).toPromise()
                .then(res => {
                    const jsonObj = res
                    if (jsonObj['rows'].length < this.batchLimit) {
                        Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                        return resolve(responseInfo)
                    } else {
                        Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                        responseInfo['bookmark'] = jsonObj['bookmark']
                        return resolve(this.callSearchDesignDocs(query, designDocName, responseInfo,queryFlags));
                        }
                }, error => {
                    console.log('error==>' + error)
                    return resolve({ 'status': this.failed, 'message': 'Server error. Please contact admin.' })
                })
        })
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
 
}
