import {
    Injectable
} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class cspfmExecutionPouchDbConfiguration {
    public workFlowUserApprovalStatusObject = 'WorkFlowUserApprovalStatus';
    public workFlowHistoryObject = 'WorkFlowHistory';
    // Note : After the session_id handled in jwt. We need to remove databaseName,remoteDbUrl,user name ,user password keys.
    public configuration = {
        databaseName: "pfm_15_executions",
        schema: [{
            "singular": "WorkFlowUserApprovalStatus",
            "plural": "WorkFlowUserApprovalStatuss"
        }, {
            "singular": "WorkFlowUserApprovalStatus_only",
            "plural": "WorkFlowUserApprovalStatuss",
            "documentType": "WorkFlowUserApprovalStatus"
        }],
        tableStructure: {}
    }

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
}