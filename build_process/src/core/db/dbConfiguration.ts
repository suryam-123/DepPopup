import {
    Injectable
} from '@angular/core';
import {
    HttpClient
} from '@angular/common/http'; // This import for builder dynamic code generation

@Injectable({
    providedIn: 'root'
})
export class dbConfiguration {

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
        databaseName: 'pfm_15_mobile_platform',
        schema: [{
            "singular": "pfm5_only",
            "plural": "pfm5s",
            "documentType": "pfm5"
        }, {
            "singular": "pfm5",
            "plural": "pfm5s"
        }, {
            "singular": "pfm71655_only",
            "plural": "pfm71655s",
            "documentType": "pfm71655"
        }, {
            "singular": "pfm71655",
            "plural": "pfm71655s",
            "relations": {
                "pfm5": {
                    "belongsTo": {
                        "type": "pfm5",
                        "options": {
                            "async": true
                        }
                    }
                }
            }
        }, {
            "singular": "pfm71658_only",
            "plural": "pfm71658s",
            "documentType": "pfm71658"
        }, {
            "singular": "pfm71658",
            "plural": "pfm71658s",
            "relations": {
                "pfm5": {
                    "belongsTo": {
                        "type": "pfm5",
                        "options": {
                            "async": true
                        }
                    }
                },
                "pfm71655": {
                    "belongsTo": {
                        "type": "pfm71655",
                        "options": {
                            "async": true
                        }
                    }
                },
                "pfm77370s": {
                    "hasMany": {
                        "type": "pfm77370",
                        "options": {
                            "queryInverse": "pfm71658"
                        }
                    }
                },
                "pfm74408s": {
                    "hasMany": {
                        "type": "pfm74408",
                        "options": {
                            "queryInverse": "pfm71658"
                        }
                    }
                }
            }
        }, {
            "singular": "pfm74408_only",
            "plural": "pfm74408s",
            "documentType": "pfm74408"
        }, {
            "singular": "pfm74408",
            "plural": "pfm74408s",
            "relations": {
                "pfm71658": {
                    "belongsTo": {
                        "type": "pfm71658",
                        "options": {
                            "async": true
                        }
                    }
                },
                "pfm5": {
                    "belongsTo": {
                        "type": "pfm5",
                        "options": {
                            "async": true
                        }
                    }
                },
                "pfm71655": {
                    "belongsTo": {
                        "type": "pfm71655",
                        "options": {
                            "async": true
                        }
                    }
                }
            }
        }, {
            "singular": "pfm77370_only",
            "plural": "pfm77370s",
            "documentType": "pfm77370"
        }, {
            "singular": "pfm77370",
            "plural": "pfm77370s",
            "relations": {
                "pfm71658": {
                    "belongsTo": {
                        "type": "pfm71658",
                        "options": {
                            "async": true
                        }
                    }
                },
                "pfm5": {
                    "belongsTo": {
                        "type": "pfm5",
                        "options": {
                            "async": true
                        }
                    }
                }
            }
        }, {
            "singular": "pfmstaticreport_only",
            "plural": "pfmstaticreports",
            "documentType": "pfmstaticreport"
        }, {
            "singular": "pfmstaticreport",
            "plural": "pfmstaticreports"
        }],
        tableStructure: {
            "pfm71655": {
                "depcurrency": null,
                "depdecimal": null,
                "depcheckbox": null,
                "pfm5_967501": null,
                "pfm_5_967501_id": null,
                "depdropdownn": null,
                "employeename": null,
                "team": null,
                "location": null,
                "depboolean": true,
                "depformulan": null,
                "pfm_71655_id": null,
                "createdby": null,
                "createdon": null,
                "lastmodifiedby": null,
                "lastmodifiedon": null,
                "guid": null,
                "employeeid": null,
                "display_name": null,
                "couch_id": null,
                "couch_rev_id": null,
                "depdate": null,
                "deptimestamp": null,
                "depnumber": null,
                "depmultiselect": null
            },
            "pfm71658": {
                "depnumber": null,
                "depboolean": true,
                "deptimestamp": null,
                "depcurrency": null,
                "location": null,
                "team": null,
                "depdecimal": null,
                "pfm71655_930602": null,
                "pfm_71655_930602_id": null,
                "depformulan": null,
                "pfm_71658_id": null,
                "createdby": null,
                "createdon": null,
                "lastmodifiedby": null,
                "lastmodifiedon": null,
                "guid": null,
                "name": null,
                "display_name": null,
                "couch_id": null,
                "couch_rev_id": null,
                "depmultiselect": null,
                "depcheckbox": null,
                "pfm71655_967505": null,
                "pfm_71655_967505_id": null,
                "pfm71655_967507": null,
                "pfm5_967712": null,
                "pfm_71655_964453_id": null,
                "employeename": null,
                "depdate": null,
                "pfm_5_967712_id": null,
                "pfm_71655_967507_id": null,
                "pfm71655_964453": null
            },
            "pfm74408": {
                "createdby": null,
                "depnumber": null,
                "depdate": null,
                "depboolean": false,
                "depcname": null,
                "guid": null,
                "lastmodifiedon": null,
                "lastmodifiedby": null,
                "createdon": null,
                "pfm_74408_id": null,
                "depcformula1": null,
                "pfm_71658_id": null,
                "pfm71658": null,
                "pfm_71655_965872_id": null,
                "pfm71655_965872": null,
                "pfm_71655_965870_id": null,
                "pfm71655_965870": null,
                "depccurrency1": null,
                "depcnum1": null,
                "depcdate1": null,
                "depcname1": null,
                "couch_rev_id": null,
                "couch_id": null,
                "display_name": null,
                "pfm71655_967516": null,
                "pfm_71655_967514_id": null,
                "pfm71655_967514": null,
                "depdecimal": null,
                "deptimestamp": null,
                "pfm_5_967510_id": null,
                "pfm5_967510": null,
                "pfm_71655_967516_id": null,
                "depdropdownn": null
            },
            "pfm77370": {
                "couch_rev_id": null,
                "depmname1": null,
                "display_name": null,
                "mno": null,
                "guid": null,
                "lastmodifiedon": null,
                "lastmodifiedby": null,
                "createdon": null,
                "createdby": null,
                "pfm_77370_id": null,
                "pfm_71658_id": null,
                "pfm71658": null,
                "pfm_5_1003748_id": null,
                "pfm5_1003748": null,
                "cities": null,
                "state": null,
                "depmaddress1": null,
                "couch_id": null
            },
            "pfmstaticreport": {
                "reportId": null,
                "recordId": null,
                "reportFormat": null,
                "reportPath": null,
                "reportStatus": null,
                "statusMessage": null,
                "elementId": null,
                "layoutId": null,
                "createdby": null,
                "lastmodifiedby": null,
                "createdon": null,
                "userId": null,
                "lastmodifiedon": null
            },
            "workflowhistory": {
                "fieldName": "",
                "lastmodifiedby": "",
                "referenceid": "",
                "createdon": "",
                "workFlowHistory": [],
                "type": "",
                "createdby": "",
                "objectName": "",
                "userName": "",
                "lastmodifiedon": ""
            },
            "userAssignment": {
                "type": null,
                "reference_id": null,
                "id_type": null,
                "user_id": null,
                "role_id": null,
                "user_group_id": null,
                "responsiblity_id": null,
                "isActive": true,
                "manual": true
            }
        },
        dataFilters: [{
            "filterName": "",
            "filterType": "liveSync",
            "params": ""
        }],
        pouchDBSyncEnabledObjectSelectorsMobile: [{
            "data.type": "pfm71655"
        }, {
            "data.type": "pfm74408"
        }, {
            "data.type": "pfm77370"
        }, {
            "data.type": "pfm71658"
        }],
        couchDBSyncEnabledObjectSelectorsMobile: [],
        pouchDBSyncEnabledObjectSelectorsWeb: [],
        couchDBSyncEnabledObjectSelectorsWeb: [{
            "data.type": "pfm71655"
        }, {
            "data.type": "pfm74408"
        }, {
            "data.type": "pfm71658"
        }, {
            "data.type": "pfm77370"
        }, {
            "data.type": "pfmstaticreport"
        }, {
            "_deleted": true
        }],
        pouchDBSyncEnabledObjectSelectors: [],
        couchDBSyncEnabledObjectSelectors: [],
        onlineStandardObjectSyncEnabledelectors: [{
            "data.type": "pfm5"
        }],
        offlineStandardObjectSyncEnabledelectors: [],
        predefinedDesignDocuments: [{
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
        indexingObject: ["pfm71655_967507", "pfm71655_967505", "pfm71655_967516", "pfm71655_967514", "pfm71655_965872", "pfm71655_964453", "pfm5_1003748", "pfm71655_930602", "pfm77370", "pfm71655_965870", "pfm71655", "pfm5_967712", "pfm5_967501", "pfm5_967510", "pfm71658", "pfm74408"]
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
                return [...this.configuration.pouchDBSyncEnabledObjectSelectorsMobile, ...this.configuration.predefinedDesignDocuments]
            }
            return this.configuration.pouchDBSyncEnabledObjectSelectorsMobile
        } else {
            if (this.configuration.pouchDBSyncEnabledObjectSelectorsWeb.length > 0) {
                return [...this.configuration.pouchDBSyncEnabledObjectSelectorsWeb, ...this.configuration.predefinedDesignDocuments]
            }
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