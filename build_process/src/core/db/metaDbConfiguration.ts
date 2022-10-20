import { Injectable } from '@angular/core';
import { dbConfiguration } from 'src/core/db/dbConfiguration';

@Injectable({
    providedIn: 'root'
})
export class metaDbConfiguration {
    public SUCCESS = "success";
    public FAILURE = "failure";

    public corUsersObject = '';
    public applicationAssignmentObject = 'CORUSERAPPA';
    public applicationPublishInfoObject = 'PFMAPPPUBLISHINFO';
    public corMenuGroup = '';
    public corUSerMenuGroupAssignemt = 'CORUSRMENUGRPA';
    public corRoleMenuGroupAssignemt = 'CORROLEMENUGROUPA';
    public corApplications = '';
    public corLoginDetails = 'CORLOGINDETAILS';
    public corMobileApps = 'CORMOBILEAPPS'
    public pfmApproveValueUserObject = 'PFMAPPROVALUSERA';
    public corRoles = ''
    public userGroup = 'CORUSERGROUPS'
    public corUserGroupAssignment = 'CORUSERUSERGROUPA'
    public userResponsibility = 'CORRESPONSIBILITIES'
    public userResponsibilityAssignment = 'CORUSERRESPA'

    public userLocked = 'User locked';
    public userInActive = 'User disabled';
    public userSessionExpired = 'Session expired';
    public appUnassigned = "was unassigned to you";
    public currentlyNoAppsAreAssigned = "No apps are assigned";
    public newVersionWithForceUpdate = "Force update";
    public newVersionWithoutForceUpdate = "New version for ";
    public newAppAssigned = "new app's are assigned";
    public menuGroupInActive = "Menu group inactive";
    public menuGroupUnAssigned = "Menu group unassigned";
    public metaPageTitle = "Chainsys Mobile Device Management"
    public fetchError = "fetchError";
    public applicationInActive = "Application InActive";
    public corUserHierarchy  = 'CORUSERSHIERARCHY';
    constructor(public dbConfigurationObj: dbConfiguration) {

    }
    public configuration = {
        databaseName: '',
        schema: [{
            "singular": "CORUSERS",
            "plural": "CORUSERSS",

            "relations": {
                "CORLOGINDETAILSs": {
                    "hasMany": {
                        "type": "CORLOGINDETAILS",
                        "options": {
                            "queryInverse": "CORUSERS"
                        }
                    }
                }

            }
        },
        {
            "singular": "CORUSERS_only",
            "plural": "CORUSERSS",
            "documentType": "CORUSERS"
        },
        {
            "singular": "CORLOGINDETAILS",
            "plural": "CORLOGINDETAILSs",
            "relations": {
                "corusers": {
                    "belongsTo": {
                        "type": "CORUSERS",
                        "options": {
                            "async": true
                        }
                    }
                }

            }
        },
        {
            "singular": "CORLOGINDETAILS_only",
            "plural": "CORLOGINDETAILSs",
            "documentType": "CORLOGINDETAILS"
        },
        {
            "singular": "CORAPPLICATIONS",
            "plural": "CORAPPLICATIONSs",
            "relations": {
                "PFMAPPPUBLISHINFOs": {
                    "hasMany": {
                        "type": "PFMAPPPUBLISHINFO",
                        "options": {
                            "queryInverse": "CORAPPLICATIONS"
                        }
                    }
                }

            }

        },
        {
            "singular": "CORAPPLICATIONS_only",
            "plural": "CORAPPLICATIONSs",
            "documentType": "CORAPPLICATIONS"

        },
        {
            "singular": "PFMAPPPUBLISHINFO",
            "plural": "PFMAPPPUBLISHINFOs",
            "CORAPPLICATIONS": {
                "belongsTo": {
                    "type": "CORAPPLICATIONS",
                    "options": {
                        "async": true
                    }
                }
            }
        },
        {
            "singular": "PFMAPPPUBLISHINFO_only",
            "plural": "PFMAPPPUBLISHINFOs",
            "documentType": "PFMAPPPUBLISHINFO"
        },
        {
            "singular": "CORUSERAPPA",
            "plural": "CORUSERAPPAs",
            "relations": {
                "CORUSERS": {
                    "belongsTo": {
                        "type": "CORUSERS",
                        "options": {
                            "async": true
                        }
                    }
                },
                "CORAPPLICATIONS": {
                    "belongsTo": {
                        "type": "CORAPPLICATIONS",
                        "options": {
                            "async": true
                        }
                    }
                }


            }


        },
        {
            "singular": "CORUSERAPPA_only",
            "plural": "CORUSERAPPAs",
            "documentType": "CORUSERAPPA"
        },
        {

            "singular": "CORMENUGROUPS",
            "plural": "CORMENUGROUPSs",
            "relations": {
                "CORAPPLICATIONS": {
                    "belongsTo": {
                        "type": "CORAPPLICATIONS",
                        "options": {
                            "async": true
                        }
                    }
                }

            }
        },
        {
            "singular": "CORMENUGROUPS_only",
            "plural": "CORMENUGROUPSs",
            "documentType": "CORMENUGROUPS"
        },
        {

            "singular": "CORUSRMENUGRPA",
            "plural": "CORUSRMENUGRPAs",
            "relations": {
                "CORUSERS": {
                    "belongsTo": {
                        "type": "CORUSERS",
                        "options": {
                            "async": true
                        }
                    }
                },
                "CORMENUGROUPS": {
                    "belongsTo": {
                        "type": "CORMENUGROUPS",
                        "options": {
                            "async": true
                        }
                    }
                }


            }
        },

        {
            "singular": "CORUSRMENUGRPA_only",
            "plural": "CORUSRMENUGRPAs",
            "documentType": "CORUSRMENUGRPA"
        },
        {
            "singular": "CORROLEMENUGROUPA",
            "plural": "CORROLEMENUGROUPAs",
            "relations": {
                "CORUSERS": {
                    "belongsTo": {
                        "type": "CORUSERS",
                        "options": {
                            "async": true
                        }
                    }
                },
                "CORMENUGROUPS": {
                    "belongsTo": {
                        "type": "CORMENUGROUPS",
                        "options": {
                            "async": true
                        }
                    }
                }


            }
        },
        {
            "singular": "CORROLEMENUGROUPA_only",
            "plural": "CORROLEMENUGROUPAs",
            "documentType": "CORROLEMENUGROUPA"
        }

        ],
        tableStructure: {}
    }

    private _proxyPassURL: string;
    private _credentials: string;

    get credentials(): string {
        return this._credentials;
    }
    set credentials(credentials: string) {
        this._credentials = credentials;
    }
    get remoteDbUrl(): string {
        return this._proxyPassURL;
    }
    set remoteDbUrl(proxyPass: string) {
        this._proxyPassURL = proxyPass;
    }
}

