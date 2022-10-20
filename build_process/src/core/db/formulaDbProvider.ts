import { Injectable } from "@angular/core";
import { appUtility } from '../utils/appUtility';
import { appConfiguration } from '../utils/appConfiguration';
import PouchDB from 'pouchdb';
import { appConstant } from 'src/core/utils/appConstant';
import { initialSyncProcess } from './initialSyncProcess';
import { formulaDbConfiguration } from './formulaDbConfiguration';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { dbConfiguration } from './dbConfiguration';

@Injectable({
    providedIn: "root"
})
export class formulaDbProvider {

    private db;
    private dbChanges;
    public keysToSchema = {};
    public tableStructure = {};
    public remote = '';
    private response = { 'status': '', 'message': '', 'records': [] };
    private failed = "FAILED"
    private success = 'SUCCESS';
    private batchLimit = 2000;

    constructor(public formulaDbConfiguration: formulaDbConfiguration, public appUtilityObj: appUtility, public appconfig: appConfiguration,
        public initialProcess: initialSyncProcess, public observableListenerUtils: cspfmObservableListenerUtils,) { }



    startChangeListener() {
        if (this.dbChanges) {
            this.dbChanges.cancel();
        }
        this.dbChanges = this.db.changes({ live: true, since: 'now', include_docs: true, attachments: true })
            .on('change', this.onDatabaseChange);
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
                change['dataProvider'] = 'PouchDB';
                change['providerType'] = 'formula';
                let publishLayaoutIds = this.appUtilityObj.getEventSubscriptionlayoutIds("PouchDB", change['doc']["data"]['type'])
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
            const localdatabseName = 'pfm_' + this.appUtilityObj.orgId + '_formula';
            if (this.appUtilityObj.isMobile) {
                this.db = new PouchDB(localdatabseName + '.db', { adapter: 'cordova-sqlite', location: 'default' });
            } else {
                this.db = new PouchDB(localdatabseName, { size: 50 });
            }
            // this.setSchema();
            this.db.setMaxListeners(50);
        }
        this.startChangeListener()
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
    // Req
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

    // Req
    setCurrentObjectSetInLocalStorage() {

        let syncEnabledObjectSelectors = []
        this.formulaDbConfiguration.configuration.formulaPouchDBSyncEnabledObjectSelectors.forEach(element => {
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

    // Req
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

    // Req
    oneTimeReplicationFromServer(oneTimeSyncSelector) {
        return this.initialProcess.startProcess(this.db, this.remote, this.formulaDbConfiguration, oneTimeSyncSelector).then(res => {
            if (res) {
                return Promise.resolve('Success');
            } else {
                return Promise.resolve('Failed');
            }
        }).catch(err => {
            return Promise.resolve('Failed');
        })
    }

    // Req
    oneTimeReplicationFromServerWithSpecificObject(selector) {
        return this.initialProcess.fetchAndInsertBulkDocsWithSpecificObjects(this.db, this.remote, this.formulaDbConfiguration, selector).then(bulkDocRes => {
            if (bulkDocRes) {
                return Promise.resolve('Success');
            } else {
                return Promise.resolve('Failed');
            }
        }).catch(err => {
            return Promise.resolve('Failed');
        })
    }

    fetchRollUpValue(keysArray) {
        return this.fetchMethod('rollupView',keysArray)
    }


    fetchformulaValue(keysArray) {
        return this.fetchMethod('formulaView',keysArray)

    }



    fetchMethod(viewDocument,keysArray){
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
                return Promise.resolve({
                    status: "Error",
                    Message: "Server error. Please contact admin."
                });
            });
    }
}