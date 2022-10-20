import { appUtility } from './../utils/appUtility';
import { Injectable } from '@angular/core';
import { appConfiguration } from '../utils/appConfiguration';
import { AlertController, ToastController } from '@ionic/angular';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { metaDbConfiguration } from './metaDbConfiguration';
import { metaDbValidation } from '../utils/metaDbValidation';
import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
import { dbProvider } from './dbProvider';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import PouchRelation from 'relational-pouch';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import pouchdbValidation from 'pouchdb-validation';
import * as lodash from 'lodash';
import { initialSyncProcess } from './initialSyncProcess';
import { HttpClient } from '@angular/common/http';
import { objectTableMapping } from 'src/core/pfmmapping/objectTableMapping';

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
@Injectable({
    providedIn: 'root'
})
export class metaDataDbProvider {
    private db;
    private dbChanges;
    private liveReplicationDbObject;
    public keysToSchema = {};
    public tableStructure = {};
    public remote = '';
    private response = { 'status': '', 'message': '', 'records': [] };
    private failed = 'FAILED';
    private success = 'SUCCESS';
    private childreference = 'childreference';
    private masterandlookupreference = 'masterandlookupreference';
    private batchLimit = 2000;
    public static isValidationRunnig = false;

    constructor(public objectTableMapping: objectTableMapping,private appUtilityObj: appUtility, private appconfig: appConfiguration,
        public observableListenerUtils: cspfmObservableListenerUtils, public metaDataConfigObj: metaDbConfiguration, public toastCtrl: ToastController, 
        public metaDbValidation: metaDbValidation,public initialProcess: initialSyncProcess,private httpClient:HttpClient,
        private broadcaster: Broadcaster, public mobileDb: dbProvider, public alertCtrl: AlertController) {

    }

    /****************************************************
            Initialize pouchdb and setup db schema
       *****************************************************/
    // Initialize pouchdb
    initializePouchDb() {
        if (this.db === undefined) {
            this.remote = this.metaDataConfigObj.remoteDbUrl + this.metaDataConfigObj.configuration.databaseName;
            if (this.appUtilityObj.isMobile) {
                const localdatabseName = this.metaDataConfigObj.configuration.databaseName + '_' + this.appUtilityObj.userId;
                this.db = new PouchDB(localdatabseName + '.db', { adapter: 'cordova-sqlite', location: 'default' });
            } else {
                const localdatabseName = this.metaDataConfigObj.configuration.databaseName;
                this.db = new PouchDB(localdatabseName, { size: 50 });
            }
            this.setSchema();
            this.db.setMaxListeners(50);
        }
    }

    // Set relationship schema
    private setSchema() {
        this.db.setSchema(this.metaDataConfigObj.configuration.schema);
        this.metaDataConfigObj.configuration.schema.forEach(type => {
            this.keysToSchema[type.singular] = type;
        });
        // Table structure for initialize object
        this.tableStructure = this.metaDataConfigObj.configuration.tableStructure;
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
        if (this.dbChanges === undefined) {
            this.dbChanges = this.db.changes({ live: true, since: 'now', include_docs: true, attachments: true })
                .on('change', this.onDatabaseChange);
        }
    }

    stopMetaDataDbChangeListner() {
        if (this.dbChanges) {
            this.dbChanges.cancel();
        }
    }
    private dataChangesTypes = {};
    
    private onDatabaseChange = (change) => {

        if (!change['doc']['data'] || !change['doc']['data']['type']){
            return
        }
            

        if (!this.isValidationNeedToThisObject(change)) {
            return
        }

        if (!this.isVaidationNeedToThisRecord(change)) {
            return;
        }


        var objectType = change['doc']['data']['type'];
        if(objectType === this.metaDataConfigObj.corUserHierarchy || objectType ===  this.objectTableMapping.mappingDetail['COR_USERS']){
            this.registerListenerforCorUserHierarchy(change)
        }
        if (metaDataDbProvider.isValidationRunnig) {
            var valueList = []
            if (Object.values(this.dataChangesTypes).length > 0){
                valueList = Object.values(this.dataChangesTypes)
            }
            if (objectType === this.metaDataConfigObj.applicationAssignmentObject) {
                if (change['doc']['data']['is_active']) {
                    if (valueList.indexOf(objectType + "true") === -1){
                        this.dataChangesTypes[new Date().getMilliseconds()] = objectType + "true"
                    }

                }else {
                    if (valueList.indexOf(objectType + "false") === -1){
                        this.dataChangesTypes[new Date().getMilliseconds()] = objectType + "false"
                    }
                }
            }else {
                if (valueList.indexOf(objectType) === -1){
                    this.dataChangesTypes[new Date().getMilliseconds()] = objectType
                }

            }

            return;
        }

        if (objectType === this.metaDataConfigObj.applicationAssignmentObject) {
            if (change['doc']['data']['is_active']) {
                this.metaValidation(objectType + "true");
            }else {
                this.metaValidation(objectType + "false");
            }
        }else{
            this.metaValidation(objectType);

        }
    }

    isValidationNeedToThisObject(change) {

        var statusWorkFlowObjectList = [this.metaDataConfigObj.pfmApproveValueUserObject];
        if (change['doc']['data']['type'] && statusWorkFlowObjectList.indexOf(change['doc']['data']['type']) === -1) {
            return true;
        }else {
            return false
        }
    }
    isVaidationNeedToThisRecord(change) {
        if (change['doc']['data']['type'] === this.metaDataConfigObj.corMobileApps
            && change['doc']['data']['status'] !== 'PUB') {
            return false
        }else if (change['doc']['data']['type'] === this.metaDataConfigObj.corApplications
            && change['doc']['data']['application_id'] !== this.appconfig.configuration.appId) {
            return false
        }else if (change['doc']['data']['type'] === this.metaDataConfigObj.corApplications
            && change['doc']['data']['application_id'] === this.appconfig.configuration.appId
            && change['doc']['data']['is_active'] === 'Y') {
            return false
        }else if (change['doc']['data']['type'] === this.metaDataConfigObj.corMenuGroup
            && change['doc']['data']['application_id'] !== this.appconfig.configuration.appId) {
            return false
        }else if (change['doc']['data']['type'] === this.metaDataConfigObj.corUsersObject
            && change['doc']['data']['user_id'] !== this.appUtilityObj.userId) {
            return false
        }else {
            return true;
        }
    }
    public metaValidation(changesType) {
        metaDataDbProvider.isValidationRunnig = true;
        console.log("meta validation triggered");

        this.metaDbValidation.metaValidations(this, false, changesType).then(result => {
            metaDataDbProvider.isValidationRunnig = false;

            if (result) {
                status = result.status;
                const displaymessage = '';
                if (status === 'success') {

                    this.handlewarningMsg(result);
                    if (Object.keys(this.dataChangesTypes).length > 0) {

                        var keys = Object.keys(this.dataChangesTypes).sort();


                        this.metaValidation(this.dataChangesTypes[keys[0]])
                        delete this.dataChangesTypes[keys[0]];
                        return;
                    }



                } else if (status === 'failure') {

                    if (result.errorType && result.errorType === this.metaDataConfigObj.fetchError) {
                        return
                    }

                    this.observableListenerUtils.emit('events', result);
                    this.stopMetaDataDbChangeListner();

                }

            }
        });
    }
    private handlewarningMsg(response) {

        if (!response['warningSet']) {
            return;
        }
        this.observableListenerUtils.emit('metaValidationAnnouncement', response);
       
    }

   
    oneTimeReplicationFromServer(oneTimeSyncSelector) {
        return this.initialProcess.startProcess(this.db, this.remote, this.metaDataConfigObj, oneTimeSyncSelector).then(res => {
            if (res) {
                return Promise.resolve('Success');
            } else {
                return Promise.resolve('Failed');
            }
        }).catch(err => {
            return Promise.resolve('Failed');
        })
    }
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
                        this.navigateNativePage()
                    }
                }
            ]
        });
        alert.present();


    }
    navigateNativePage() {

        this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'forceSync' });


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
                ajax: this.appUtilityObj.addCredentialforMobile('AJAX', this.metaDataConfigObj)
            };
        } else {
            return {
                live: false,
                retry: true,
                filter: filtername,
                query_params: parameters,
                include_docs: true,
                ajax: this.appUtilityObj.addCredentialforMobile('AJAX', this.metaDataConfigObj)
            };
        }
    }


    // One time replication from server
    oneTimeReplicationFromServerWithFilter(filtername, params?) {
        const options = this.getSyncOption(false, filtername, params);
        return this.db.replicate.from(this.remote, options);
    }
    // Live replication from couch server
    liveDataReplicationFromServer(dataFilter, params) {
        console.log('DBReplicationFromServer started');
        return this.oneTimeReplicationFromServerWithFilter(dataFilter, params).then(res => {
            
            if (res.status === 'complete') {
                // this.liveReplicationFromServerWithFilter(dataFilter, params)
                return Promise.resolve('Success');
            } else {
                return Promise.resolve('Failed');
            }
        }).catch(error => {
            return Promise.resolve(error.message);
        });
    }

    // One time replication from server with selector
    oneTimeReplicationFromServerWithSelector(selector) {
        const options = {
            live: false,
            retry: true,
            filter: '_selector',
            selector: selector,
            include_docs: true,
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.metaDataConfigObj)
        };
        return this.db.replicate.from(this.remote, options);
    }
    // Live replication from server with selector
    liveReplicationFromServerWithSelector(selector) {
        this.cancelLivereplicationFromServerWithSelector();
        const options = {
            live: true,
            retry: true,
            filter: '_selector',
            selector: selector,
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.metaDataConfigObj)
        };
        this.liveReplicationDbObject = this.db.replicate.from(this.remote, options);

       
    }
    cancelLivereplicationFromServerWithSelector() {
        if (this.liveReplicationDbObject) {
            this.liveReplicationDbObject.cancel();
        }
    }

    // Live replication from server
    liveReplicationFromServerWithFilter(filtername, params?) {
        const options = this.getSyncOption(true, filtername, params);
        this.db.replicate.from(this.remote, options);
    }

    // Find docs using find plugin without relationship(If you get selected fields, you must pass _id field )
    fetchDocsWithoutRelationshipUsingFindOption(options) {
        if (options.selector) {
            let selector = {};
            try {
                selector = JSON.parse(JSON.stringify(options.selector));
                if (Object.keys(selector).indexOf('data.type') > -1) {
                    return this.findDocsWithSelector(options).then(res => {
                        if (res.constructor === [].constructor) {
                            this.response = { status: this.success, message: '', records: res };
                            return this.response;
                        } else {
                            this.response = { status: this.failed, message: typeof res === 'string' ? res : 'Fetching failed', records: [] };
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
                    return this.checkChildObjectsForFetch(type, res, referencedetail).then(response => {
                        return this.checkLookupObjectsForFetch(type, response, referencedetail).then(resultValue => {
                            this.response = { status: this.success, message: '', records: resultValue };
                            return this.response;
                        });
                    });
                } else {
                    return this.checkLookupObjectsForFetch(type, res, referencedetail).then(resultValue => {
                        this.response = { status: this.success, message: '', records: resultValue };
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
            const pluralNameValue = this.getPluralName(type);
            this.response = { status: this.success, message: '', records: res[pluralNameValue] };
            return this.response;
        }).catch(error => {
            this.response = { status: this.failed, message: error.message, records: [] };
            return Promise.resolve(this.response);
        });
    }

    // Fetch single table docs by parent doc id without relationship
    fetchDocsWithoutRelationshipByParentTypeAndId(childtype, parent_type, parent_id) {

        const objectList = Object.keys(this.metaDataConfigObj.configuration.tableStructure);
        if (objectList.indexOf(parent_type) < 0) {
            this.response = { status: this.failed, message: 'Invalid parent type', records: [] };
            return Promise.resolve(this.response);
        } else {
            return this.db.rel.findHasMany(childtype + '_only', parent_type, parent_id).then(res => {
                const pluralNameValue = this.getPluralName(childtype);
                this.response = { status: this.success, message: '', records: res[pluralNameValue] };
                return this.response;
            }).catch(error => {
                this.response = { status: this.failed, message: error.message, records: [] };
                return Promise.resolve(this.response);
            });
        }
    }

    // Fetch single doc by doc id without relationship
    fetchDocWithoutRelationshipByTypeAndId(type, id) {
        const rel_id_value = this.db.rel.makeDocID({ 'type': type, 'id': id });
        return this.db.get(rel_id_value).then(doc => {
            this.response = { status: this.success, message: '', records: [this.convertRelDocToNormalDoc(doc)] };
            return this.response;
        }).catch(error => {
            this.response = { status: this.failed, message: error.message, records: [] };
            return Promise.resolve(this.response);
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
            return this.fetchLookupDocForMultipleDocs(res, type, referencedetail).then(resultValue => {
                return resultValue;
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
                    if (referencedetail[this.masterandlookupreference] && referencedetail[this.masterandlookupreference].includes(objectType)) {
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
                    Object.keys(element).forEach(keys => {
                        if (keys.startsWith(objectType + '_') || keys === objectType) {
                            lookupFetchingTaskList.push(
                                this.fetchLookupDocByTypeAndId(objectType, element[keys]).then(doc => {
                                    element[keys] = doc;
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
        console.log('Lookup fetching failed for this doc '
            + element['type'] + '_2_' + element['id'] + '  Error:' + JSON.stringify(error));
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
                return this.findAPI(options);
            });
        } else {
            return this.indexCreation(['data.type']).then(res => {
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

    // Convert reldoc to normal doc
    private convertRelDocToNormalDoc(doc) {
        const parsedId = this.db.rel.parseDocID(doc._id);
        doc.data.id = parsedId.id;
        doc.data.rev = doc._rev;
        if (doc._attachments) {
            doc.data.attachments = doc._attachments;
        }
        return doc.data;
    }

    // //Validate requested refernce detail
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
            const objectList = Object.keys(this.metaDataConfigObj.configuration.tableStructure);
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


    public fetchDataWithReference(referenceDetail, additionalInfo?) {

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
        return this.recursiveFetch(referenceDetail, additionalInfo1).then(res => {
            const response = {
                status: this.success,
                message: '',
                records: res['docs'],
                batchId: res['batchId']
            };
            return Promise.resolve(response)
        }).catch(error => {
            console.log("Error", error);
            return Promise.resolve({
                status: this.failed,
                message: error.message, records: [],
                batchId: ''
            })
        });
    }

    private recursiveFetch(referenceDetail, additionalInfo?: AdditionalInfo) {
        const objectName = referenceDetail['objectId']

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
                        const lookupObjectName = element['objectId'];
                        const fieldId = lookupObjectName + "_" + element['fieldId'];
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
                                data[this.getPluralName(element['objectId'])] = []
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
        const childObjectName = childObjectReference['objectId']
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
    fetchMetaDataObjects(metaOneTimeSelector) {
        console.log("fetchMetaDataObjects started=========>");

        const couchdb = new PouchDB(this.remote, {
            auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.metaDataConfigObj)
        });
        const taskList = []
        if (metaOneTimeSelector.length > 0) {
            metaOneTimeSelector.forEach(element => {
                if (element['data.type'] === this.metaDataConfigObj.corMobileApps || element['data.type'] === this.metaDataConfigObj.applicationPublishInfoObject || element['data.type'] === this.metaDataConfigObj.corApplications || element['data.type'] === 
                this.metaDataConfigObj.corMenuGroup) {
                    const keys = []
                    element["data.application_id"]["$in"].forEach(key => {
                        keys.push(element['data.type'] + key)
                    });

                    const viewDocName = 'type_applicationid_view'
                    var queryOptions = {
                        keys: keys,
                        include_docs: true
                    };
                    taskList.push(this.fetchRecordsByView(viewDocName, couchdb, queryOptions).then(result => {
                        if (queryOptions && queryOptions['keys']){
                            return result;
                        }

                      
                    }));
                }
            })
            return Promise.all(taskList).then(response => {
                if (response.length === taskList.length) {
                    if (response) {
                        return Promise.resolve(true);
                    } else {
                        return Promise.resolve(false);
                    }
                } else {
                    return Promise.resolve(false);
                }
            }).catch(error => {
                console.log(error);
                return Promise.resolve(false);
            })
        } else {
            return Promise.resolve(false);
        }
    }


    fetchRecordsByView(viewDocName, couchdb, queryOptions) {
        console.log("queryOptions...." + new Date().toLocaleTimeString() + "   ", JSON.stringify(queryOptions))
        console.log("viewDocName............", viewDocName);

        return couchdb.query(viewDocName, queryOptions)
            .then(result => {
                return this.handleResponseOfFetchRecordsByView(result);
            })
            .catch(err => {
                console.log("fetchRecordsByView error.." + new Date().toLocaleTimeString() + "   ", err);
                console.log("fetchRecordsByView ", err);
                return false
            });
    }

    handleResponseOfFetchRecordsByView(result) {
        if (result['rows']) {
            var records = result['rows'].map((record) => {
                return record['doc'];
            })

            return this.db.bulkDocs(records, {
                'new_edits': false
            }).then(result => {
                return Promise.resolve(true)
            }).catch(err => {
                console.log(err);
                return Promise.resolve(false);
            });
        }
    }
    public corUsersObjectHierarchyJSON = {
        "objectId": this.metaDataConfigObj.corUsersObject,
        "objectName": this.metaDataConfigObj.corUsersObject,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [

        ]
    };
    getUserNameAgainstUserId(userid) {
        const options = {};
        const selector = {};
        selector['data.type'] = this.metaDataConfigObj.corUsersObject;
        selector['data.user_id'] = userid;
        options['selector'] = selector;
        this.corUsersObjectHierarchyJSON['options'] = options;
        return this.fetchDataWithReference(this.corUsersObjectHierarchyJSON).then(result => {
            return Promise.resolve(result);
        }).catch(error => {
            return Promise.resolve({
                status: this.failed,
                message: error.message, records: [],
                batchId: ''
            })
        });
    }



    makeSelectorForMetaDataSyncArray(appIdList, isCallFromSync) {
        if (appIdList.length !== 0) {

            const selectorList = []
            if (isCallFromSync) {
                selectorList.push(this.getSelectorObj(this.metaDataConfigObj.corUserHierarchy, 'data.user_id', this.appUtilityObj.userId))
                selectorList.push(this.getSelectorObj(this.metaDataConfigObj.corUsersObject, 'data.organization_id', this.appUtilityObj.orgId))
                selectorList.push({'data.type':this.metaDataConfigObj.corRoles})
                selectorList.push(this.getSelectorObj(this.metaDataConfigObj.applicationAssignmentObject, 'data.user_id_p', this.appUtilityObj.userId))
                selectorList.push(this.getSelectorObj(this.metaDataConfigObj.corUSerMenuGroupAssignemt, 'data.user_id_p', this.appUtilityObj.userId))
                selectorList.push(this.getSelectorObj(this.metaDataConfigObj.corRoleMenuGroupAssignemt, 'data.role_id_p', this.appUtilityObj.roleId))
                selectorList.push(this.getSelectorObj(this.metaDataConfigObj.pfmApproveValueUserObject, 'data.user_id', this.appUtilityObj.userId))
            }
            selectorList.push(this.getSelectorObj(this.metaDataConfigObj.corMenuGroup, 'data.application_id', appIdList))
            selectorList.push(this.getSelectorObj(this.metaDataConfigObj.corApplications, 'data.application_id', appIdList))
            selectorList.push(this.getSelectorObj(this.metaDataConfigObj.applicationPublishInfoObject, 'data.application_id', appIdList))
            selectorList.push(this.getSelectorObj(this.metaDataConfigObj.corMobileApps, 'data.application_id', appIdList))


            return selectorList
        }
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
    userIdList = [];
    getUserIdListAgainstFieldId(fieldId, isRecursiveFetch: boolean, bookmark?) {
        if (!isRecursiveFetch){
            this.userIdList = [];
        }
           

        var query = "type:" + this.metaDataConfigObj.pfmApproveValueUserObject + " AND " + "field_id:" + fieldId
        let designDocName = this.metaDataConfigObj.pfmApproveValueUserObject + "_search";
        return this.callSearchDesignDocs(query, designDocName).then(response => {
           

            if (response["rows"]) {
                for (let i = 0; i < response["rows"].length; i++) {
                    const data = this.convertRelDocToNormalDoc(response["rows"][i]["doc"]);

                    if (this.userIdList.indexOf(data['user_id']) === -1){
                        this.userIdList.push(data['user_id'])
                    }

                }
            }

                return { "status": this.success, "userIdList": this.userIdList }
            


        }).catch(error => {
            console.log('error==>' + error);
            return { "status": this.failed, "message": "Server error. Please contact admin." };
        });
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

        const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.metaDataConfigObj)

        return new Promise(resolve => {
            const url = this.metaDataConfigObj.remoteDbUrl + this.metaDataConfigObj.configuration.databaseName
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
    
    fetchDocsUsingSearchApi(query, designDocName) {
        var dataArray = []
        let designDoc = designDocName + "_search";
        return this.callSearchDesignDocs(query, designDoc).then(response => {
            if (response["rows"]) {
                for (let i = 0; i < response["rows"].length; i++) {
                    const data = this.convertRelDocToNormalDoc(response["rows"][i]["doc"]);
                    dataArray.push(data)
                }
                return { "status": this.success, "records": dataArray };
            }else {
                return { "status": this.failed, "message": "Server error. Please contact admin." };
            }
        }).catch(error => {
            console.log('error==>' + error);
            return { "status": this.failed, "message": "Server error. Please contact admin." };
        });
    }

    async presentToast(message) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 5000,
            position: 'bottom'
        });
        toast.dismiss(() => {
            console.log('Dismissed toast');
        });
        toast.present();
    } 

        // user assignment user group & responsibility fetch
        fetchHierarchyRecord() {
            let query = "type:" + this.metaDataConfigObj.corUserHierarchy + " AND " + "user_id:" + this.appUtilityObj.userId 
            return this.fetchDocsUsingSearchApi(query, this.metaDataConfigObj.corUserHierarchy).then(res => {
              if (res['status'] === 'SUCCESS' && res['records'].length > 0) { 
                this.appUtilityObj.userGroups = res['records'][0]['userGroupsId']
                this.appUtilityObj.userResponsibilities = res['records'][0]['ResponsibilitiesId']  
              }
            })
          }
        // user assignment user group & responsibility 
          registerListenerforCorUserHierarchy(changedRecValue){
              if(changedRecValue && changedRecValue['doc'] && changedRecValue['doc']['data'] && Number(changedRecValue['doc']['data']['user_id']) === this.appUtilityObj.userId){
                let localStorageValue = this.appUtilityObj.simpleCrypto.decryptObject(localStorage.getItem("localStore"));
                if(changedRecValue['doc']['data']['type'] === this.metaDataConfigObj.corUserHierarchy){
                    this.appUtilityObj.userGroups = changedRecValue['doc']['data']['userGroupsId']
                    this.appUtilityObj.userResponsibilities =  changedRecValue['doc']['data']['ResponsibilitiesId']
                    localStorageValue['userGroupsId'] = changedRecValue['records'][0]['userGroupsId'];
                    localStorageValue['userResponsibilitiesId'] = changedRecValue['records'][0]['ResponsibilitiesId'];
                }else if(changedRecValue['doc']['data']['type'] ===  this.objectTableMapping.mappingDetail['COR_USERS']){
                    this.appUtilityObj.roleId = changedRecValue['doc']['data']['role_id']
                    localStorageValue['roleId'] = changedRecValue['doc']['data']['role_id'];
                } 
                localStorage.setItem('localStore', this.appUtilityObj.simpleCrypto.encryptObject(localStorageValue));
              } else{
                return
              }   
            }
    
}
