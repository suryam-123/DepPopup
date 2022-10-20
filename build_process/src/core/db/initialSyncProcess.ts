import { Injectable } from '@angular/core';
import { appConstant } from 'src/core/utils/appConstant';
import PouchDB from 'pouchdb';
import { metaDbConfiguration } from './metaDbConfiguration';
import { cspfmExecutionPouchDbConfiguration } from './cspfmExecutionPouchDbConfiguration';
import { attachmentDbConfiguration } from './attachmentDbConfiguration';
import { dbConfiguration } from './dbConfiguration';
import { formulaDbConfiguration } from './formulaDbConfiguration';
import { appUtility } from '../utils/appUtility';
import { HttpClient } from '@angular/common/http';
export interface Response {
  status: string;
  message: any;
}

@Injectable()

export class initialSyncProcess {

  private isDebugEnabled = false;
  private firstTimeSyncStatus = "_local/first_time_sync_status";

  constructor(public metaDataConfigObj: metaDbConfiguration, public appUtilityObj: appUtility,private httpClient:HttpClient) {
  }

  enableDebug(enableDebug: boolean) {
    this.isDebugEnabled = enableDebug;
  }

  startProcess(db, remote, dbConfigObj, dataSyncSelector) {
    return db.get(this.firstTimeSyncStatus).then(res => {
      if (res['sync_status'] === 'started') {
        return this.fullDataSync(db, remote, dataSyncSelector, dbConfigObj);
      } else {
        return this.incrementalDataSync(db, remote, dataSyncSelector, dbConfigObj);
      }
    }).catch(error => {
      if (error['status'] && error['status'] === 404) {
        this.writeConsole('Warn', this.firstTimeSyncStatus + " fetch error ", error)
        return this.upsertFullSyncStartus(db, 'started').then(syncUpsertRes => {
          if (syncUpsertRes && syncUpsertRes === true) {
            return this.fullDataSync(db, remote, dataSyncSelector, dbConfigObj);
          } else {
            return Promise.resolve(false);
          }
        })
      } else {
        this.writeConsole('Error', this.firstTimeSyncStatus + " fetch error ", error)
        return Promise.resolve(false)
      }
    });
  }

  // first time data sync process
  fullDataSync(db, remote, dataSyncSelector, dbConfigObj) {
    this.writeConsole('Info', "Sync process name :", dbConfigObj.constructor.name)
    return this.oneTimeReplicationToServerWithSelector(db, remote, dataSyncSelector, dbConfigObj).then(replicateToServerResponse => {
      if (replicateToServerResponse['ok']) {
        this.writeConsole('Success', "One Time Replication to server response :", replicateToServerResponse)

        return this.getCouchLastSequence(dbConfigObj).then(couchLastSequenceResponse => {
          if (couchLastSequenceResponse['last_seq']) {
            this.writeConsole('Success', "Couch last sequence response :", couchLastSequenceResponse)

            const couchLastSequenceBody = couchLastSequenceResponse

            return this.replicateValidationDocmentFromServer(db, remote, dbConfigObj).then(replicateFromServerResponse => {
              if (replicateFromServerResponse['ok']) {
                this.writeConsole('Success', "replicate validation docment from server :", replicateFromServerResponse)

                return this.retrieveDataFromCouch(db, remote, dbConfigObj, dataSyncSelector).then(dataRetrieveResponse => {

                  if (dataRetrieveResponse) {
                    this.writeConsole('Success', "Retrieve data response :", dataRetrieveResponse)
                    return this.oneTimeReplicationFromServerWithSelector(db, remote, dbConfigObj,
                      dataSyncSelector, couchLastSequenceBody['last_seq']).then(replicateSinceFromServerResponse => {

                        if (replicateSinceFromServerResponse['ok']) {
                          this.writeConsole('Success', "One Time Replication since from server response :", replicateSinceFromServerResponse)

                          return this.oneTimeReplicationToServerWithSelector(db, remote, dataSyncSelector, dbConfigObj, true).then(replicateSinceToServerResponse => {

                            if (replicateSinceToServerResponse['ok']) {

                              this.writeConsole('Success', "One Time Replication since to server response :", replicateSinceToServerResponse)
                              return db.get(this.firstTimeSyncStatus).then(localDocGetResponse => {


                                if (localDocGetResponse) {
                                  this.writeConsole('Success', "db get response :", localDocGetResponse)
                                  return this.upsertFullSyncStartus(db, 'completed', localDocGetResponse['_rev']).then(localDocUpsertResponse => {
                                    this.writeConsole('Success', "db upsert response :", localDocUpsertResponse)

                                    return localDocUpsertResponse;
                                  });
                                } else {
                                  this.writeConsole('Failure', "db get response :", localDocGetResponse)
                                  return Promise.resolve(false);
                                }
                              });
                            } else {
                              this.writeConsole('Failure', "One Time Replication since to server response :", replicateSinceToServerResponse)
                              return Promise.resolve(false);
                            }
                          })
                        } else {
                          this.writeConsole('Failure', "One Time Replication since from server response :", replicateSinceFromServerResponse)
                          return Promise.resolve(false);
                        }
                      })
                  }else {
                    this.writeConsole('Failure', "Retrieve data response :", dataRetrieveResponse)
                    return Promise.resolve(false);
                  }
                });
              } else {
                this.writeConsole('Failure', "replicate validation docment from server :", replicateFromServerResponse)
                return Promise.resolve(false);
              }

            });
          } else {
            this.writeConsole('Failure', "Couch last sequence response :", couchLastSequenceResponse)
            return Promise.resolve(false);
          }
        })
      } else {
        this.writeConsole('Failure', "One Time Replication to server response :", replicateToServerResponse)
        return Promise.resolve(false);
      }
    })
  }

  // except first time data sync process
  incrementalDataSync(db, remote, dataSyncSelector, dbConfigObj) {
    return this.oneTimeReplicationToServerWithSelector(db, remote, dataSyncSelector, dbConfigObj).then(replicateToServerResponse => {
      if (replicateToServerResponse['ok']) {
        this.writeConsole('Success', "One Time Replication to server response :", replicateToServerResponse)

        return this.oneTimeReplicationFromServerWithSelector(db, remote, dbConfigObj,
          dataSyncSelector).then(replicateSinceFromServerResponse => {

            if (replicateSinceFromServerResponse['ok']) {
              this.writeConsole('Success', "One Time Replication since from server response :", replicateSinceFromServerResponse)
              return this.oneTimeReplicationToServerWithSelector(db, remote, dataSyncSelector, dbConfigObj, true).then(replicateSinceToServerResponse => {

                if (replicateSinceToServerResponse['ok']) {
                  this.writeConsole('Success', "One Time Replication since to server response :", replicateSinceToServerResponse)
                  return Promise.resolve(true);
                } else {
                  this.writeConsole('Failure', "One Time Replication since to server response :", replicateSinceToServerResponse)
                  return Promise.resolve(false);
                }
              });
            } else {
              this.writeConsole('Failure', "One Time Replication since from server response :", replicateSinceFromServerResponse)
              return Promise.resolve(false);
            }
          });
      } else {
        this.writeConsole('Failure', "One Time Replication to server response :", replicateToServerResponse)
        return Promise.resolve(false);
      }
    })
  }

  private upsertFullSyncStartus(db, syncStatus: 'started' | 'completed' | 'idle', rev?) {

    let doc = {
      _id: this.firstTimeSyncStatus,
      sync_status: syncStatus
    }

    if (rev !== undefined) {
      doc['_rev'] = rev;
    }

    return db.put(doc).then(response => {
      if (response['ok']) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    }).catch(err => {
      this.writeConsole('Error', db['name'] + ' #  ' + this.firstTimeSyncStatus + ' upsert error', err)
      return Promise.resolve(false);
    });
  }

  httpCall(apiMethod: 'GET' | 'POST', url: string, options) {
    if (apiMethod === 'GET') {
      return this.httpClient.get(url, options).toPromise().then(res => {
        return res;
      })
    } else {
      return this.httpClient.post(url, options).toPromise().then(res => {
        return res;
      })
    }
  }

  oneTimeReplicationToServerWithSelector(db, remote, dataSyncSelector, dbConfigObj, sinceNowFlag?: boolean) {

    if (dbConfigObj instanceof metaDbConfiguration || dbConfigObj instanceof formulaDbConfiguration) {
      return Promise.resolve({ ok: true })
    }

    var inputSelector = {};
    if (dbConfigObj instanceof cspfmExecutionPouchDbConfiguration) {
      inputSelector = dataSyncSelector
    } else {
      inputSelector = { "$or": dataSyncSelector }
    }
    const options = {
      live: false,
      retry: true,
      filter: '_selector',
      selector: inputSelector,
      auth: this.appUtilityObj.addCredentialforMobile('AUTH', dbConfigObj)
    };
    if (sinceNowFlag !== undefined && sinceNowFlag === true) {
      options['since'] = "now";
    }
    return db.replicate.to(remote, options);
  }

  getCouchLastSequence(dbConfigObj) {
    let url = dbConfigObj.remoteDbUrl + dbConfigObj.configuration.databaseName + '/_changes?descending=true&limit=1';

    const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', dbConfigObj)
    return this.httpCall('GET', url, headerstring).then(res => {
      return res;
    }).catch(err => {
      this.writeConsole('Error', "Couch last sequence fetch issue ", err);
      return Promise.resolve(false);
    });
  }


  oneTimeReplicationFromServerWithSelector(db, remote, dbConfigObj, dataSyncSelector, couchLastSequence?) {
    var inputSelector = {};
    if (dbConfigObj instanceof cspfmExecutionPouchDbConfiguration) {
      inputSelector = dataSyncSelector
    } else {
      inputSelector = { "$or": dataSyncSelector }
    }
    const options = {
      live: false,
      retry: true,
      filter: '_selector',
      selector: inputSelector,
      auth: this.appUtilityObj.addCredentialforMobile('AUTH', dbConfigObj)
    };
    if (couchLastSequence !== undefined) {
      options['since'] = couchLastSequence;
    }
    return db.replicate.from(remote, options);
  }


  retrieveDataFromCouch(db, remote, dbConfigObj, dataSyncSelector) {
    const couchdb = new PouchDB(remote, {
      auth: this.appUtilityObj.addCredentialforMobile('AUTH', dbConfigObj)
    });
    const taskList = []
    if (dbConfigObj instanceof attachmentDbConfiguration || dbConfigObj instanceof dbConfiguration) {
      if (dataSyncSelector.length > 0) {
        dataSyncSelector.forEach(element => {
          const selector = {}
          selector["selector"] = element;
          selector["limit"] = 50000;
          taskList.push(this.findCouchData(couchdb, db, selector).then(result => {
            return result;
          }));
        })
      } else {
        return Promise.resolve(false);
      }
    } else if (dbConfigObj instanceof cspfmExecutionPouchDbConfiguration) {
      const keys = []
      dataSyncSelector["data.statusWFConfigId"]["$in"].forEach(key => {
        keys.push(dataSyncSelector['data.type'] + key)
      });

      const viewDocName = 'type_statusWFConfigId_view'
      var queryOptions = {
        keys: keys,
        include_docs: true
      };
      taskList.push(this.fetchRecordsByView(viewDocName, couchdb, db, queryOptions).then(result => {
        return result;
      }));
    } else {
      if (dataSyncSelector.length > 0) {
        dataSyncSelector.forEach(element => {
          if (element['data.type'] === this.metaDataConfigObj.corMobileApps || element['data.type'] === this.metaDataConfigObj.applicationPublishInfoObject ||
            element['data.type'] === this.metaDataConfigObj.corApplications ||
            element['data.type'] === this.metaDataConfigObj.corMenuGroup) {
            const keys = []
            element["data.application_id"]["$in"].forEach(key => {
              keys.push(element['data.type'] + key)
            });

            const viewDocName = 'type_applicationid_view'
            var queryOptions = {
              keys: keys,
              include_docs: true
            };
            taskList.push(this.fetchRecordsByView(viewDocName, couchdb, db, queryOptions).then(result => {
              return result;
            }));
          } else {
            const selector = {}
            selector["selector"] = element;
            selector["limit"] = 50000;
            taskList.push(this.findCouchData(couchdb, db, selector).then(result => {
              return result;
            }));
          }
        })
      } else {
        return Promise.resolve(false);
      }
    }
    return Promise.all(taskList).then(response => {
      if (response.length === taskList.length) {
        if (response.indexOf(false) > -1) {
          return Promise.resolve(false);
        } else {
          return Promise.resolve(true);
        }
      } else {
        return Promise.resolve(false);
      }
    }).catch(error => {
      console.log(error);
      return Promise.resolve(false);
    })
  }

  findCouchData(couchdb, pouchdb, options) {
    var indexArray = Object.keys(options['selector']);
    return this.indexCreation(indexArray, couchdb).then(res => {
      return couchdb.find(options).then(result => {
        if (result['docs'] && result['docs'].length > 0) {
          options['bookmark'] = result['bookmark']
          return pouchdb.bulkDocs(result['docs'], {
            'new_edits': false
          }).then(result => {
            return this.findCouchData(couchdb, pouchdb, options)
          }).catch(err => {
            this.writeConsole('Error', "Pouch DB bulk doc api error", err)
            return Promise.resolve(false);
          });
        } else {
          return Promise.resolve(true);
        }
      }).catch(error => {
        this.writeConsole('Error', "Couch DB find api error", error)
        return Promise.resolve(false);
      })
    }).catch(error => {
      this.writeConsole('Error', "Couch DB index creation api error", error)
      return Promise.resolve(false);
    })
  }

  replicateValidationDocmentFromServer(pouchDB, remote, dbConfigObj) {
    if (dbConfigObj instanceof dbConfiguration || dbConfigObj instanceof formulaDbConfiguration) {
      var docIds = ['_design/validation','_design/validation1','_design/validation2','_design/validation3','_design/validation4','_design/validation5','_design/validation6','_design/validation7','_design/validation8','_design/validation9', '_design/type_createdby_docid_view', '_design/masterdetailview', '_design/masterdetail_createdby_view', '_design/masterdetail_createdby_docid_view', '_design/formulaView', '_design/rollupView']

      const options = {
        live: false,
        retry: true,
        doc_ids: docIds,
        include_docs: true,
        auth: this.appUtilityObj.addCredentialforMobile('AUTH', dbConfigObj)
      };
      return pouchDB.replicate.from(remote, options);
    } else {
      return Promise.resolve({ ok: true });
    }
  }

  fetchRecordsByView(viewDocName, couchdb, pouchdb, queryOptions) {
    return couchdb.query(viewDocName, queryOptions)
      .then(result => {
        return this.handleResponseOfFetchRecordsByView(result, pouchdb);
      })
      .catch(err => {
        console.log("fetchRecordsByView error", err);
        return false
      });
  }

  handleResponseOfFetchRecordsByView(result, pouchdb) {
    if (result['rows']) {
      var records = result['rows'].map((record) => {
        return record['doc'];
      })

      return pouchdb.bulkDocs(records, {
        'new_edits': false
      }).then(result => {
        return Promise.resolve(true)
      }).catch(err => {
        console.log(err);
        return Promise.resolve(false);
      });
    }
  }

  // Index creation
  private indexCreation(fields, db) {
    return db.createIndex({
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

  // Insert and update local store sequence
  insertAndUpdateLocalStorageDocument(params, pouchDB, sequenceId, latestSequence, document?) {
    let doc;
    if (params) {
      doc = {
        _id: sequenceId,
        _rev: document._rev,
        last_seq: latestSequence
      }
    } else {
      doc = {
        _id: sequenceId,
        last_seq: latestSequence
      }
    }
    return pouchDB.put(doc).then(response => {
      if (response['ok']) {
        return Promise.resolve(true);
      } else {
        console.log('last sequence insert failed');
        return Promise.resolve(false);
      }
    }).catch(err => {
      console.log(err);
      return Promise.resolve(false);
    });
  }

  fetchAndInsertBulkDocsWithSpecificObjects(pouchDB, remote, dbConfigObj, objectSet) {
    const couchdb = new PouchDB(remote, {
      auth: this.appUtilityObj.addCredentialforMobile('AUTH', dbConfigObj)
    });
    const taskList = []
    if (dbConfigObj instanceof attachmentDbConfiguration || dbConfigObj instanceof dbConfiguration) {
      if (objectSet.length > 0) {
        objectSet.forEach(element => {

          const selector = {}
          selector["selector"] = { 'data.type': element };
          selector["limit"] = 50000;
          taskList.push(this.findCouchData(couchdb, pouchDB, selector).then(result => {
            return result;
          }));
        })
      } else {
        return Promise.resolve(false);
      }
    }
    return Promise.all(taskList).then(response => {
      if (response.length === taskList.length) {
        if (response.indexOf(false) > -1) {
          return Promise.resolve(false);
        } else {
          return this.oneTimeReplicationToServerWithSelector(pouchDB, remote, objectSet, dbConfigObj, true).then(res => {
            if (res['ok']) {
              return Promise.resolve(true);
            } else {
              return Promise.resolve(false);
            }
          })
        }
      } else {
        return Promise.resolve(false);
      }
    }).catch(error => {
      console.log(error);
      return Promise.resolve(false);
    })
  }

  private writeConsole(type: 'Info' | 'Error' | 'Warn' | 'Success' | 'Failure', ...message) {
    if (!this.isDebugEnabled){
      return;
    }

    if (type === 'Info') {
      console.info("%c%s", "background: #3493eb; padding-left: 10px; padding-right: 10px; padding-top: 5px; padding-bottom: 5px; border-radius: 20px; color: white;", this.constructor.name, ...message)
    } else if (type === 'Error') {
      console.error("%c%s", "background: #eb4034; padding-left: 10px; padding-right: 10px; padding-top: 5px; padding-bottom: 5px; border-radius: 20px; color: white;", this.constructor.name, ...message)
    } else if (type === 'Warn') {
      console.warn("%c%s", "background: #eb8c34; padding-left: 10px; padding-right: 10px; padding-top: 5px; padding-bottom: 5px; border-radius: 20px; color: white;", this.constructor.name, ...message)
    } else if (type === 'Success') {
      console.info("%c%s%c%s", "background: #3493eb; padding-left: 10px; padding-right: 10px; padding-top: 5px; padding-bottom: 5px; border-radius: 20px; color: white;", this.constructor.name, "padding-left: 10px; padding-right: 10px; padding-top: 5px; padding-bottom: 5px; border-radius: 20px; color: green;", "success", ...message)
    } else if (type === 'Failure') {
      console.info("%c%s%c%s", "background: #eb4034; padding-left: 10px; padding-right: 10px; padding-top: 5px; padding-bottom: 5px; border-radius: 20px; color: white;", this.constructor.name, "padding-left: 10px; padding-right: 10px; padding-top: 5px; padding-bottom: 5px; border-radius: 20px; color: red;", "failure", ...message)
    } else {
      console.log("%c%s", "background: #3493eb; padding-left: 10px; padding-right: 10px; padding-top: 5px; padding-bottom: 5px; border-radius: 20px; color: white;", this.constructor.name, ...message)
    }
  }
}
