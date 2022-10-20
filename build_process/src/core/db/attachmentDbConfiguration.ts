import {
    Injectable
} from '@angular/core';
import {
    HttpClient
} from '@angular/common/http'; // This import for builder dynamic code generation

@Injectable({
    providedIn: 'root'
})
export class attachmentDbConfiguration {

    constructor(private httpClient: HttpClient) {
        this.getPlatform();
    }

    getPlatform() {
        const mediaQuery = window.matchMedia("(max-device-width: 480px)");
        var isMobileResolution = false;
        if (mediaQuery.matches) {
            isMobileResolution = true
        } else {
            isMobileResolution = false
        }
        this.configuration['pouchDBSyncEnabledObjectSelectors'] = this.pouchDBSyncEnabledObjectSelectors(isMobileResolution);
        this.configuration['couchDBSyncEnabledObjectSelectors'] = this.couchDBSyncEnabledObjectSelectors(isMobileResolution);
    }


    // Note : After the session_id handled in jwt. We need to remove databaseName,remoteDbUrl,user name ,user password keys.
    public configuration = {
        databaseName: '',
        schema: [],
        dataFilters: [],
        tableStructure: {},
        pouchDBSyncEnabledObjectSelectors: [],
        couchDBSyncEnabledObjectSelectors: [],
        pouchDBSyncEnabledObjectSelectorsWeb: [],
        pouchDBSyncEnabledObjectSelectorsMobile: [],
        couchDBSyncEnabledObjectSelectorsWeb: [],
        couchDBSyncEnabledObjectSelectorsMobile: [],
        attachmentIndexingObject: []
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
            return this.configuration.pouchDBSyncEnabledObjectSelectorsMobile
        } else {
            return this.configuration.pouchDBSyncEnabledObjectSelectorsWeb
        }
    }

    couchDBSyncEnabledObjectSelectors(isMobile) {
        if (isMobile) {
            return this.configuration.couchDBSyncEnabledObjectSelectorsMobile
        } else {
            return this.configuration.couchDBSyncEnabledObjectSelectorsWeb
        }
    }
}