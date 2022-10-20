import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // This import for builder dynamic code generation

@Injectable({
  providedIn: 'root'
})
export class dbConfiguration {

  constructor(private httpClient:HttpClient){
    this.getPlatform();
  }

  getPlatform() {}

  // Note : After the session_id handled in jwt. We need to remove databaseName,remoteDbUrl,user name ,user password keys.
  public configuration = {
    databaseName: '',
    schema: [],
    tableStructure: {},
    dataFilters: [],
    pouchDBSyncEnabledObjectSelectorsMobile: [],
    couchDBSyncEnabledObjectSelectorsMobile: [],
    pouchDBSyncEnabledObjectSelectorsWeb: [],
    couchDBSyncEnabledObjectSelectorsWeb: [],
    pouchDBSyncEnabledObjectSelectors: [],
    couchDBSyncEnabledObjectSelectors: [],
    onlineStandardObjectSyncEnabledelectors: [],
    offlineStandardObjectSyncEnabledelectors:[],
    predefinedDesignDocuments: [
      {
        "_id": '_design/validation'
      },
      {
        "_id": '_design/type_createdby_docid_view'
      },
      {
        "_id": '_design/masterdetailview'
      },
      {
        "_id": '_design/masterdetail_createdby_view'
      },
      {
        "_id": '_design/masterdetail_createdby_docid_view'
      }
    ],
    indexingObject:[]
  };

  private _proxyPassURL: string;
  private _credentials: string;

  get remoteDbUrl(): string {
    return this._proxyPassURL;
  }
  set remoteDbUrl(proxyPass: string) {
    this._proxyPassURL = proxyPass;
  }
  get credentials(): string {
    return this._credentials;
  }
  set credentials(credentials: string) {
    this._credentials = credentials;
  }

  pouchDBSyncEnabledObjectSelectors(isMobile){
    console.log("pouchDBSyncEnabledObjectSelectors - isMobile : ",isMobile);
    if(isMobile){
      if(this.configuration.pouchDBSyncEnabledObjectSelectorsMobile.length > 0){
        return [...this.configuration.pouchDBSyncEnabledObjectSelectorsMobile,...this.configuration.predefinedDesignDocuments]
      }
      return this.configuration.pouchDBSyncEnabledObjectSelectorsMobile
    }else{
      if(this.configuration.pouchDBSyncEnabledObjectSelectorsWeb.length > 0){
        return [...this.configuration.pouchDBSyncEnabledObjectSelectorsWeb,...this.configuration.predefinedDesignDocuments]
      }
      return this.configuration.pouchDBSyncEnabledObjectSelectorsWeb
    }
  }

  couchDBSyncEnabledObjectSelectors(isMobile){
    console.log("couchDBSyncEnabledObjectSelectors - isMobile : ",isMobile);
    if(isMobile){
      return this.configuration.couchDBSyncEnabledObjectSelectorsMobile
    }else{
      return this.configuration.couchDBSyncEnabledObjectSelectorsWeb
    }
  }
}
