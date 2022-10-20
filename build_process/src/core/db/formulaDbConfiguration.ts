import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';   // This import for builder dynamic code generation
@Injectable({
    providedIn: 'root'
})
export class formulaDbConfiguration {

    constructor(private httpClient:HttpClient){
      this.getPlatform();
    }

    getPlatform() {}

    // Note : After the session_id handled in jwt. We need to remove databaseName,remoteDbUrl,user name ,user password keys.
    public configuration = {
        databaseName: '',
        formulaPouchDBSyncEnabledObjectSelectors: [],
        formulaCouchDBSyncEnabledObjectSelectors: [],
        pouchDBSyncEnabledObjectSelectorsMobile: [],
        pouchDBSyncEnabledObjectSelectorsWeb: [],
        couchDBSyncEnabledObjectSelectorsMobile: [],
        couchDBSyncEnabledObjectSelectorsWeb: []
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

    pouchDBSyncEnabledObjectSelectors(isMobile) {
      if (isMobile) {
        if (this.configuration.pouchDBSyncEnabledObjectSelectorsMobile.length > 0) {
          return this.makePouchSelector(this.configuration.pouchDBSyncEnabledObjectSelectorsMobile);
        }
        return this.configuration.pouchDBSyncEnabledObjectSelectorsMobile;
      } else {
        if (this.configuration.pouchDBSyncEnabledObjectSelectorsWeb.length > 0) {
          return this.makePouchSelector(this.configuration.pouchDBSyncEnabledObjectSelectorsWeb);
        }
        return this.configuration.pouchDBSyncEnabledObjectSelectorsWeb;
      }
    }

    makePouchSelector(selector) {
      let isFormulaViewRequired = false;
      let isRollupViewRequired = false;
      for (let index = 0; index < selector.length; index++) {
        if (selector[index]["data.type"].endsWith("formula")) {
          isFormulaViewRequired = true;
        }
        if (selector[index]["data.type"].endsWith("rollip")) {
          isRollupViewRequired = true;
        }
      }
      if (isFormulaViewRequired) {
        selector.push({ "_id": "_design/formulaView" })
      }
      if (isRollupViewRequired) {
        selector.push({ "_id": "_design/rollupView" })
      }
      return selector;
    }

    couchDBSyncEnabledObjectSelectors(isMobile) {
      if (isMobile) {
        return this.configuration.couchDBSyncEnabledObjectSelectorsMobile
      } else {
        return this.configuration.couchDBSyncEnabledObjectSelectorsWeb
      }
    }
}
