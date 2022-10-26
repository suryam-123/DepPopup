import {
    Injectable
} from "@angular/core";
import {
    Validators
} from "@angular/forms";
import {
    appUtility
} from "../utils/appUtility";
import {
    cspfmObjectConfiguration
} from "./cspfmObjectConfiguration";

@Injectable({
    providedIn: "root"
})
export class cspfmLayoutConfiguration {

    constructor(public appUtilityObj: appUtility, public pfmObjectConfig: cspfmObjectConfiguration) {}
    public layoutConfiguration = {
        '203846': {


            'objectTraversal': {
                'depemployee_DUMMY': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
                'depemployee_DUMMY$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm5_967501"
                    }
                },
            }


            ,
            'associationConfiguration': {

            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {

            },

        },
        '203848': {
            'formgroupValidation': {
                'pfm71655': {
                    'save_1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'ACTION'
                    },
                    'list_1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'ACTION'
                    },
                    'employeeid': {
                        'validator': [Validators.required],
                        'isRequired': true,
                        'fieldType': 'TEXT'
                    },
                    'employeename': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'TEXT'
                    },
                    'team': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DROPDOWN'
                    },
                    'location': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DROPDOWN'
                    },
                    'depboolean': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'BOOLEAN'
                    },
                    'depformulan': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'FORMULA'
                    },
                    'depdate': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DATE'
                    },
                    'deptimestamp': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'TIMESTAMP'
                    },
                    'depnumber': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'NUMBER'
                    },
                    'depdecimal': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DECIMAL'
                    },
                    'depcurrency': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'CURRENCY'
                    },
                    'depmultiselect': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'MULTISELECT'
                    },
                    'depcheckbox': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'CHECKBOX'
                    },
                    'pfm5_967501_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'depdropdownn': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DROPDOWN'
                    }
                },
            },
            'objectTraversal': {
                "depemployee_DUMMY": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
                "depemployee_DUMMY$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm5_967501"
                    }
                }
            },
            'associationConfiguration': {


            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {
                'pfm5_967501': {
                    'lookupColumns': [{
                        "id": "username",
                        "label": "USERNAME",
                        "fieldName": "username",
                        "prop": "username",
                        "fieldType": "TEXT",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$username",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "email_id",
                        "label": "EMAIL ID",
                        "fieldName": "email_id",
                        "prop": "email_id",
                        "fieldType": "EMAIL",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$email_id",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "COR_USERS",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 967501,
                        "objectId": "5",
                        "childObject": [],
                        "isStandardObject": "Y",
                        "rootPath": "COR_USERS_DUMMY",
                        "fieldName": "depcoruser"
                    },

                    'objectRootPath': 'depemployee_DUMMY$$COR_USERS_depcoruser',
                    'label': 'COR_USERS',
                    'lookupFieldDisplayName': "depcoruser",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'primaryRootPath': 'depemployee_DUMMY',
                    'isOnlySubordinates': false,
                    'isStandardObject': true,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71655'
                }
            },


        },
        '203850': {
            "itemsPerPageConfigured": 50,

            'objectTraversal': {
                'depemployee_DUMMY': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
                'depemployee_DUMMY$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm5_967501"
                    }
                },
            }


            ,
            'associationConfiguration': {

            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {

            },

        },
        '203868': {
            "itemsPerPageConfigured": 50,

            'objectTraversal': {
                'deppersonalinfo_DUMMY$$depemployee_deplookup': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_930602"
                    }
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup3': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967505"
                    }
                },
                'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_965870"
                        },
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                'deppersonalinfo_DUMMY$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm5_967712"
                    }
                },
                'deppersonalinfo_DUMMY$$depchildinfo_depcmaster': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967510"
                        },
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup2': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_964453"
                    }
                },
                'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup4': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_967516"
                        },
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_965872"
                        },
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup4': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967507"
                    }
                },
                'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup3': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_967514"
                        },
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                'deppersonalinfo_DUMMY': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
            }


            ,
            'associationConfiguration': {

            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {

            },

        },
        '203870': {
            'formgroupValidation': {
                'pfm71658': {
                    'save_1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'ACTION'
                    },
                    'list_1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'ACTION'
                    },
                    'name': {
                        'validator': [Validators.required],
                        'isRequired': true,
                        'fieldType': 'TEXT'
                    },
                    'employeename': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'TEXT'
                    },
                    'team': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DROPDOWN'
                    },
                    'location': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DROPDOWN'
                    },
                    'depcurrency': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'CURRENCY'
                    },
                    'deptimestamp': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'TIMESTAMP'
                    },
                    'depdate': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DATE'
                    },
                    'depboolean': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'BOOLEAN'
                    },
                    'depnumber': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'NUMBER'
                    },
                    'depdecimal': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DECIMAL'
                    },
                    'pfm71655_930602_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'depformulan': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'FORMULA'
                    },
                    'pfm71655_964453_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'depmultiselect': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'MULTISELECT'
                    },
                    'depcheckbox': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'CHECKBOX'
                    },
                    'pfm71655_967505_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm5_967712_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm71655_967507_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    }
                },
            },
            'objectTraversal': {
                "deppersonalinfo_DUMMY$$depemployee_deplookup2$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_964453"
                    }
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_930602"
                    }
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup3$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967505"
                    }
                },
                "deppersonalinfo_DUMMY": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup3": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967505"
                    }
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup4": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967507"
                    }
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup4$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967507"
                    }
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_930602"
                    }
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup2": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_964453"
                    }
                },
                "deppersonalinfo_DUMMY$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm5_967712"
                    }
                }
            },
            'associationConfiguration': {


            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {
                'pfm71655_930602': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depnumber",
                        "targetColumn": "depnumber",
                        "sourceColumnFieldType": "NUMBER",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "depformulan",
                        "targetColumn": "depformulan",
                        "sourceColumnFieldType": "FORMULA",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "location",
                        "targetColumn": "location",
                        "sourceColumnFieldType": "DROPDOWN",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }],
                    'objectRootPath': 'deppersonalinfo_DUMMY$$depemployee_deplookup',
                    'label': 'depemployee',
                    'lookupFieldDisplayName': "DepLookup",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'primaryRootPath': 'deppersonalinfo_DUMMY',
                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm71655_964453': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup2",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },
                    'argumentColumns': [{
                        "sourceColumn": "team",
                        "targetColumn": "team",
                        "sourceColumnFieldType": "DROPDOWN",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "depformulan",
                        "targetColumn": "depformulan",
                        "sourceColumnFieldType": "FORMULA",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "depnumber",
                        "targetColumn": "depnumber",
                        "sourceColumnFieldType": "NUMBER",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }],
                    'objectRootPath': 'deppersonalinfo_DUMMY$$depemployee_deplookup2',
                    'label': 'depemployee',
                    'primaryRootPath': 'deppersonalinfo_DUMMY',
                    'lookupFieldDisplayName': "DepLookup2",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm71655_967505': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup3",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depcheckbox",
                        "targetColumn": "depcheckbox",
                        "sourceColumnFieldType": "CHECKBOX",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "depmultiselect",
                        "targetColumn": "depmultiselect",
                        "sourceColumnFieldType": "MULTISELECT",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "depcurrency",
                        "targetColumn": "depcurrency",
                        "sourceColumnFieldType": "CURRENCY",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }],
                    'objectRootPath': 'deppersonalinfo_DUMMY$$depemployee_deplookup3',
                    'label': 'depemployee',
                    'primaryRootPath': 'deppersonalinfo_DUMMY',
                    'lookupFieldDisplayName': "DepLookup3",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm5_967712': {
                    'lookupColumns': [{
                        "id": "username",
                        "label": "USERNAME",
                        "fieldName": "username",
                        "prop": "username",
                        "fieldType": "TEXT",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$username",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "email_id",
                        "label": "EMAIL ID",
                        "fieldName": "email_id",
                        "prop": "email_id",
                        "fieldType": "EMAIL",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$email_id",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "COR_USERS",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 967712,
                        "objectId": "5",
                        "childObject": [],
                        "isStandardObject": "Y",
                        "rootPath": "COR_USERS_DUMMY",
                        "fieldName": "depcoruser"
                    },

                    'objectRootPath': 'deppersonalinfo_DUMMY$$COR_USERS_depcoruser',
                    'label': 'COR_USERS',
                    'primaryRootPath': 'deppersonalinfo_DUMMY',
                    'lookupFieldDisplayName': "depcoruser",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': true,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm71655_967507': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup4",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },

                    'objectRootPath': 'deppersonalinfo_DUMMY$$depemployee_deplookup4',
                    'label': 'depemployee',
                    'primaryRootPath': 'deppersonalinfo_DUMMY',
                    'lookupFieldDisplayName': "DepLookup4",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                }
            },


        },
        '203871': {
            "itemsPerPageConfigured": 50,

            'objectTraversal': {
                'deppersonalinfo_DUMMY$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm5_967712"
                    }
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup4': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967507"
                    }
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup2$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_964453"
                    }
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup4$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967507"
                    }
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup3': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967505"
                    }
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup3$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967505"
                    }
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_930602"
                    }
                },
                'deppersonalinfo_DUMMY': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup2': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_964453"
                    }
                },
                'deppersonalinfo_DUMMY$$depemployee_deplookup$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_930602"
                    }
                },
            }


            ,
            'associationConfiguration': {

            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {

            },

        },
        '213011': {


            'objectTraversal': {
                'depchildinfo_DUMMY$$depemployee_depclookup4': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967516"
                    }
                },
                'depchildinfo_DUMMY$$deppersonalinfo_depcmaster': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
                'depchildinfo_DUMMY$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm5_967510"
                    }
                },
                'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_930602"
                        },
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
                'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_964453"
                        },
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
                'depchildinfo_DUMMY$$depemployee_depclookup1': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_965870"
                    }
                },
                'depchildinfo_DUMMY': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
                'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_967505"
                        },
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
                'depchildinfo_DUMMY$$depemployee_depclookup3': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967514"
                    }
                },
                'depchildinfo_DUMMY$$depemployee_depclookup2': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_965872"
                    }
                },
                'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_967507"
                        },
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
                'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967712"
                        },
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
            }


            ,
            'associationConfiguration': {

            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {

            },

        },
        '213014': {
            'formgroupValidation': {
                'pfm74408': {
                    'save_1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'ACTION'
                    },
                    'list_1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'ACTION'
                    },
                    'depcname': {
                        'validator': [Validators.required],
                        'isRequired': true,
                        'fieldType': 'TEXT'
                    },
                    'depcname1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'TEXT'
                    },
                    'depcdate1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DATE'
                    },
                    'depcnum1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'NUMBER'
                    },
                    'depccurrency1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'CURRENCY'
                    },
                    'depboolean': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'BOOLEAN'
                    },
                    'depnumber': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'NUMBER'
                    },
                    'depcformula1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'FORMULA'
                    },
                    'depdate': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DATE'
                    },
                    'pfm71655_965870_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm71655_965872_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm5_967510_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'deptimestamp': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'TIMESTAMP'
                    },
                    'depdecimal': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DECIMAL'
                    },
                    'pfm71655_967514_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm71655_967516_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'depdropdownn': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DROPDOWN'
                    }
                },
            },
            'objectTraversal': {
                "depchildinfo_DUMMY$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm5_967510"
                    }
                },
                "depchildinfo_DUMMY$$depemployee_depclookup4$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967516"
                    }
                },
                "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967712"
                        },
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
                "depchildinfo_DUMMY$$depemployee_depclookup1$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_965870"
                    }
                },
                "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_967507"
                        },
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
                "depchildinfo_DUMMY$$depemployee_depclookup4": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967516"
                    }
                },
                "depchildinfo_DUMMY": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
                "depchildinfo_DUMMY$$depemployee_depclookup3$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967514"
                    }
                },
                "depchildinfo_DUMMY$$deppersonalinfo_depcmaster": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
                "depchildinfo_DUMMY$$depemployee_depclookup3": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967514"
                    }
                },
                "depchildinfo_DUMMY$$depemployee_depclookup1": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_965870"
                    }
                },
                "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_964453"
                        },
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
                "depchildinfo_DUMMY$$depemployee_depclookup2": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_965872"
                    }
                },
                "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_967505"
                        },
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                },
                "depchildinfo_DUMMY$$depemployee_depclookup2$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_965872"
                    }
                },
                "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_930602"
                        },
                        "relationship": "HEADER",
                        "prop": "pfm71658"
                    }
                }
            },
            'associationConfiguration': {


            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {
                'pfm71655_930602': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depnumber",
                        "targetColumn": "depnumber",
                        "sourceColumnFieldType": "NUMBER",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }, {
                        "sourceColumn": "depformulan",
                        "targetColumn": "depformulan",
                        "sourceColumnFieldType": "FORMULA",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }, {
                        "sourceColumn": "location",
                        "targetColumn": "location",
                        "sourceColumnFieldType": "DROPDOWN",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }],
                    'objectRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup',
                    'label': 'depemployee',
                    'lookupFieldDisplayName': "DepLookup",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'primaryRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                },
                'pfm71655_964453': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup2",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },
                    'argumentColumns': [{
                        "sourceColumn": "team",
                        "targetColumn": "team",
                        "sourceColumnFieldType": "DROPDOWN",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }, {
                        "sourceColumn": "depformulan",
                        "targetColumn": "depformulan",
                        "sourceColumnFieldType": "FORMULA",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }, {
                        "sourceColumn": "depnumber",
                        "targetColumn": "depnumber",
                        "sourceColumnFieldType": "NUMBER",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }],
                    'objectRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2',
                    'label': 'depemployee',
                    'primaryRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
                    'lookupFieldDisplayName': "DepLookup2",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                },
                'pfm5_967712': {
                    'lookupColumns': [{
                        "id": "username",
                        "label": "USERNAME",
                        "fieldName": "username",
                        "prop": "username",
                        "fieldType": "TEXT",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$username",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "email_id",
                        "label": "EMAIL ID",
                        "fieldName": "email_id",
                        "prop": "email_id",
                        "fieldType": "EMAIL",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$email_id",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "COR_USERS",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 967712,
                        "objectId": "5",
                        "childObject": [],
                        "isStandardObject": "Y",
                        "rootPath": "COR_USERS_DUMMY",
                        "fieldName": "depcoruser"
                    },

                    'objectRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser',
                    'label': 'COR_USERS',
                    'primaryRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
                    'lookupFieldDisplayName': "depcoruser",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': true,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                },
                'pfm71655_967505': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup3",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depcheckbox",
                        "targetColumn": "depcheckbox",
                        "sourceColumnFieldType": "CHECKBOX",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }, {
                        "sourceColumn": "depmultiselect",
                        "targetColumn": "depmultiselect",
                        "sourceColumnFieldType": "MULTISELECT",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }, {
                        "sourceColumn": "depcurrency",
                        "targetColumn": "depcurrency",
                        "sourceColumnFieldType": "CURRENCY",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }],
                    'objectRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3',
                    'label': 'depemployee',
                    'primaryRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
                    'lookupFieldDisplayName': "DepLookup3",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                },
                'pfm71655_967507': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup4",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },

                    'objectRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4',
                    'label': 'depemployee',
                    'primaryRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
                    'lookupFieldDisplayName': "DepLookup4",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                },
                'pfm71658_965874': {
                    'lookupColumns': [{
                        "id": "name",
                        "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$name.name",
                        "fieldName": "name",
                        "prop": "name",
                        "fieldType": "TEXT",
                        "objectName": "deppersonalinfo",
                        "elementid": 7775052,
                        "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$name",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$employeename.employeename",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "deppersonalinfo",
                        "elementid": 7775061,
                        "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$team.team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "deppersonalinfo",
                        "elementid": 7775067,
                        "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectId": "71658",
                        "fieldId": "965874",
                        "objectName": "deppersonalinfo",
                        "objectType": "PRIMARY",
                        "referenceObjectId": 0,
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster",
                        "isStandardObject": "N",
                        "relationShipType": "one_to_many",
                        "includeFields": true,
                        "formulaField": [{
                            "fieldName": "depformulan"
                        }],
                        "childObject": [{
                            "objectId": "5",
                            "fieldId": "967712",
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "referenceObjectId": 71658,
                            "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "relationShipType": "",
                            "includeFields": true,
                            "childObject": []
                        }, {
                            "objectId": "71655",
                            "fieldId": "967507",
                            "objectName": "depemployee",
                            "objectType": "LOOKUP",
                            "referenceObjectId": 71658,
                            "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4",
                            "isStandardObject": "N",
                            "relationShipType": "",
                            "includeFields": true,
                            "formulaField": [{
                                "fieldName": "depformulan"
                            }],
                            "childObject": []
                        }, {
                            "objectId": "71655",
                            "fieldId": "964453",
                            "objectName": "depemployee",
                            "objectType": "LOOKUP",
                            "referenceObjectId": 71658,
                            "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2",
                            "isStandardObject": "N",
                            "relationShipType": "",
                            "includeFields": true,
                            "formulaField": [{
                                "fieldName": "depformulan"
                            }],
                            "childObject": []
                        }, {
                            "objectId": "71655",
                            "fieldId": "967505",
                            "objectName": "depemployee",
                            "objectType": "LOOKUP",
                            "referenceObjectId": 71658,
                            "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3",
                            "isStandardObject": "N",
                            "relationShipType": "",
                            "includeFields": true,
                            "formulaField": [{
                                "fieldName": "depformulan"
                            }],
                            "childObject": []
                        }, {
                            "objectId": "71655",
                            "fieldId": "930602",
                            "objectName": "depemployee",
                            "objectType": "LOOKUP",
                            "referenceObjectId": 71658,
                            "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup",
                            "isStandardObject": "N",
                            "relationShipType": "",
                            "includeFields": true,
                            "formulaField": [{
                                "fieldName": "depformulan"
                            }],
                            "childObject": []
                        }]
                    },
                    'objectRootPath': 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
                    'label': 'Please select deppersonalinfo',
                    'lookupFieldDisplayName': 'Please select deppersonalinfo',
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'primaryRootPath': 'depchildinfo_DUMMY',
                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                },
                'pfm71655_965870': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "depclookup1",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },
                    'argumentColumns': [{
                        "sourceColumn": "team",
                        "targetColumn": "team",
                        "sourceColumnFieldType": "DROPDOWN",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }, {
                        "sourceColumn": "depdate",
                        "targetColumn": "depdate",
                        "sourceColumnFieldType": "DATE",
                        "rootPath": "depchildinfo_DUMMY"
                    }, {
                        "sourceColumn": "depcurrency",
                        "targetColumn": "depcurrency",
                        "sourceColumnFieldType": "CURRENCY",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }],
                    'objectRootPath': 'depchildinfo_DUMMY$$depemployee_depclookup1',
                    'label': 'depemployee',
                    'primaryRootPath': 'depchildinfo_DUMMY',
                    'lookupFieldDisplayName': "DepC Lookup1",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                },
                'pfm71655_965872': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "depclookup2",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depnumber",
                        "targetColumn": "depnumber",
                        "sourceColumnFieldType": "NUMBER",
                        "rootPath": "depchildinfo_DUMMY"
                    }, {
                        "sourceColumn": "depboolean",
                        "targetColumn": "depboolean",
                        "sourceColumnFieldType": "BOOLEAN",
                        "rootPath": "depchildinfo_DUMMY"
                    }, {
                        "sourceColumn": "depdate",
                        "targetColumn": "depdate",
                        "sourceColumnFieldType": "DATE",
                        "rootPath": "depchildinfo_DUMMY"
                    }],
                    'objectRootPath': 'depchildinfo_DUMMY$$depemployee_depclookup2',
                    'label': 'depemployee',
                    'primaryRootPath': 'depchildinfo_DUMMY',
                    'lookupFieldDisplayName': "DepC Lookup2",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                },
                'pfm5_967510': {
                    'lookupColumns': [{
                        "id": "username",
                        "label": "USERNAME",
                        "fieldName": "username",
                        "prop": "username",
                        "fieldType": "TEXT",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$username",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "email_id",
                        "label": "EMAIL ID",
                        "fieldName": "email_id",
                        "prop": "email_id",
                        "fieldType": "EMAIL",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$email_id",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "COR_USERS",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 967510,
                        "objectId": "5",
                        "childObject": [],
                        "isStandardObject": "Y",
                        "rootPath": "COR_USERS_DUMMY",
                        "fieldName": "depcoruser"
                    },

                    'objectRootPath': 'depchildinfo_DUMMY$$COR_USERS_depcoruser',
                    'label': 'COR_USERS',
                    'primaryRootPath': 'depchildinfo_DUMMY',
                    'lookupFieldDisplayName': "depcoruser",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': true,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                },
                'pfm71655_967514': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "depclookup3",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depdecimal",
                        "targetColumn": "depdecimal",
                        "sourceColumnFieldType": "DECIMAL",
                        "rootPath": "depchildinfo_DUMMY"
                    }, {
                        "sourceColumn": "depdropdownn",
                        "targetColumn": "depdropdownn",
                        "sourceColumnFieldType": "DROPDOWN",
                        "rootPath": "depchildinfo_DUMMY"
                    }, {
                        "sourceColumn": "depboolean",
                        "targetColumn": "depboolean",
                        "sourceColumnFieldType": "BOOLEAN",
                        "rootPath": "depchildinfo_DUMMY"
                    }, {
                        "sourceColumn": "depcheckbox",
                        "targetColumn": "depcheckbox",
                        "sourceColumnFieldType": "CHECKBOX",
                        "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster"
                    }],
                    'objectRootPath': 'depchildinfo_DUMMY$$depemployee_depclookup3',
                    'label': 'depemployee',
                    'primaryRootPath': 'depchildinfo_DUMMY',
                    'lookupFieldDisplayName': "DepC Lookup3",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                },
                'pfm71655_967516': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "team",
                        "label": "Team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": "",
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "depclookup4",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": [{
                            "objectName": "COR_USERS",
                            "objectType": "LOOKUP",
                            "fieldId": "967501",
                            "objectId": "5",
                            "fieldName": "depcoruser",
                            "referenceObjectId": 71655,
                            "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
                            "isStandardObject": "Y",
                            "childObject": []
                        }]
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depdate",
                        "targetColumn": "depdate",
                        "sourceColumnFieldType": "DATE",
                        "rootPath": "depchildinfo_DUMMY"
                    }],
                    'objectRootPath': 'depchildinfo_DUMMY$$depemployee_depclookup4',
                    'label': 'depemployee',
                    'primaryRootPath': 'depchildinfo_DUMMY',
                    'lookupFieldDisplayName': "DepC Lookup4",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm74408'
                }
            },


        },
        '213015': {
            "itemsPerPageConfigured": 50,

            'objectTraversal': {
                'depchildinfo_DUMMY$$depemployee_depclookup2$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_965872"
                    }
                },
                'depchildinfo_DUMMY$$depemployee_depclookup3': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967514"
                    }
                },
                'depchildinfo_DUMMY$$depemployee_depclookup2': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_965872"
                    }
                },
                'depchildinfo_DUMMY$$depemployee_depclookup1$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_965870"
                    }
                },
                'depchildinfo_DUMMY$$depemployee_depclookup1': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_965870"
                    }
                },
                'depchildinfo_DUMMY': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
                'depchildinfo_DUMMY$$depemployee_depclookup4$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967516"
                    }
                },
                'depchildinfo_DUMMY$$depemployee_depclookup3$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967501"
                        },
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967514"
                    }
                },
                'depchildinfo_DUMMY$$depemployee_depclookup4': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967516"
                    }
                },
                'depchildinfo_DUMMY$$COR_USERS_depcoruser': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm5_967510"
                    }
                },
            }


            ,
            'associationConfiguration': {

            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {

            },

        },
        '219815': {
            'formgroupValidation': {
                'pfm71658': {
                    'save_1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'ACTION'
                    },
                    'edit_1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'ACTION'
                    },
                    'name': {
                        'validator': [Validators.required],
                        'isRequired': true,
                        'fieldType': 'TEXT'
                    },
                    'employeename': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'TEXT'
                    },
                    'team': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DROPDOWN'
                    },
                    'location': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DROPDOWN'
                    },
                    'depcurrency': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'CURRENCY'
                    },
                    'deptimestamp': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'TIMESTAMP'
                    },
                    'depdate': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DATE'
                    },
                    'depboolean': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'BOOLEAN'
                    },
                    'depnumber': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'NUMBER'
                    },
                    'depdecimal': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DECIMAL'
                    },
                    'depmultiselect': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'MULTISELECT'
                    },
                    'depcheckbox': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'CHECKBOX'
                    },
                    'pfm71655_930602_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm71655_964453_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm71655_967505_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm71655_967507_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm5_967712_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'depformulan': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'FORMULA'
                    }
                },
                'pfm74408': {
                    'depcname': {
                        'validator': [Validators.required],
                        'isRequired': true,
                        'fieldType': 'TEXT'
                    },
                    'depcname1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'TEXT'
                    },
                    'depcdate1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DATE'
                    },
                    'depcnum1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'NUMBER'
                    },
                    'depccurrency1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'CURRENCY'
                    },
                    'depboolean': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'BOOLEAN'
                    },
                    'depnumber': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'NUMBER'
                    },
                    'depdate': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DATE'
                    },
                    'deptimestamp': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'TIMESTAMP'
                    },
                    'depdropdownn': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DROPDOWN'
                    },
                    'depdecimal': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'DECIMAL'
                    },
                    'pfm71655_965870_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm71655_965872_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm71655_967514_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm71655_967516_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'pfm5_967510_searchKey': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'LOOKUP',

                    },
                    'depcformula1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'FORMULA'
                    }
                },
                'pfm0': {
                    'add line_1': {
                        'validator': [],
                        'isRequired': false,
                        'fieldType': 'ACTION'
                    }
                },
            },
            'objectTraversal': {
                "deppersonalinfo_DUMMY$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm5_967712"
                    }
                },
                "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_965872"
                        },
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                "deppersonalinfo_DUMMY": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
                "deppersonalinfo_DUMMY$$depchildinfo_depcmaster": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_930602"
                    }
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup3": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967505"
                    }
                },
                "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$COR_USERS_depcoruser": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm5_967510"
                        },
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup3": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_967514"
                        },
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_965870"
                        },
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup2": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_964453"
                    }
                },
                "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup4": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": {
                            "child": "",
                            "relationship": "LOOKUP",
                            "prop": "pfm71655_967516"
                        },
                        "relationship": "ONE_TO_MANY",
                        "prop": "pfm74408s"
                    }
                },
                "deppersonalinfo_DUMMY$$depemployee_deplookup4": {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": {
                        "child": "",
                        "relationship": "LOOKUP",
                        "prop": "pfm71655_967507"
                    }
                }
            },
            'associationConfiguration': {


            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {
                'pfm71655_930602': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": null,
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": []
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depformulan",
                        "targetColumn": "depformulan",
                        "sourceColumnFieldType": "FORMULA",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "depnumber",
                        "targetColumn": "depnumber",
                        "sourceColumnFieldType": "NUMBER",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "location",
                        "targetColumn": "location",
                        "sourceColumnFieldType": "DROPDOWN",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }],
                    'objectRootPath': 'deppersonalinfo_DUMMY$$depemployee_deplookup',
                    'label': 'depemployee',
                    'lookupFieldDisplayName': "DepLookup",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'primaryRootPath': 'deppersonalinfo_DUMMY',
                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm71655_964453': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": null,
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup2",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": []
                    },
                    'argumentColumns': [{
                        "sourceColumn": "team",
                        "targetColumn": "team",
                        "sourceColumnFieldType": "DROPDOWN",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "depformulan",
                        "targetColumn": "depformulan",
                        "sourceColumnFieldType": "FORMULA",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "depnumber",
                        "targetColumn": "depnumber",
                        "sourceColumnFieldType": "NUMBER",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }],
                    'objectRootPath': 'deppersonalinfo_DUMMY$$depemployee_deplookup2',
                    'label': 'depemployee',
                    'primaryRootPath': 'deppersonalinfo_DUMMY',
                    'lookupFieldDisplayName': "DepLookup2",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm71655_967505': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": null,
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup3",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": []
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depmultiselect",
                        "targetColumn": "depmultiselect",
                        "sourceColumnFieldType": "MULTISELECT",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "depcheckbox",
                        "targetColumn": "depcheckbox",
                        "sourceColumnFieldType": "CHECKBOX",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }, {
                        "sourceColumn": "depcurrency",
                        "targetColumn": "depcurrency",
                        "sourceColumnFieldType": "CURRENCY",
                        "rootPath": "deppersonalinfo_DUMMY"
                    }],
                    'objectRootPath': 'deppersonalinfo_DUMMY$$depemployee_deplookup3',
                    'label': 'depemployee',
                    'primaryRootPath': 'deppersonalinfo_DUMMY',
                    'lookupFieldDisplayName': "DepLookup3",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm71655_967507': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": null,
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "deplookup4",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": []
                    },

                    'objectRootPath': 'deppersonalinfo_DUMMY$$depemployee_deplookup4',
                    'label': 'depemployee',
                    'primaryRootPath': 'deppersonalinfo_DUMMY',
                    'lookupFieldDisplayName': "DepLookup4",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm5_967712': {
                    'lookupColumns': [{
                        "id": "username",
                        "label": "USERNAME",
                        "fieldName": "username",
                        "prop": "username",
                        "fieldType": "TEXT",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$username",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "first_name",
                        "label": "FIRST NAME",
                        "fieldName": "first_name",
                        "prop": "first_name",
                        "fieldType": "TEXT",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$first_name",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "COR_USERS",
                        "objectType": "PRIMARY",
                        "relationShipType": null,
                        "fieldId": 0,
                        "objectId": "5",
                        "rootPath": "COR_USERS_DUMMY",
                        "fieldName": "depcoruser",
                        "referenceObjectId": 0,
                        "isStandardObject": "Y",
                        "childObject": []
                    },

                    'objectRootPath': 'deppersonalinfo_DUMMY$$COR_USERS_depcoruser',
                    'label': 'COR_USERS',
                    'primaryRootPath': 'deppersonalinfo_DUMMY',
                    'lookupFieldDisplayName': "DepCorUser",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': true,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm71655_965870': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": null,
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "depclookup1",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": []
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depdate",
                        "targetColumn": "depdate",
                        "sourceColumnFieldType": "DATE",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }, {
                        "sourceColumn": "depcurrency",
                        "targetColumn": "depcurrency",
                        "sourceColumnFieldType": "CURRENCY",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }, {
                        "sourceColumn": "team",
                        "targetColumn": "team",
                        "sourceColumnFieldType": "DROPDOWN",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }],
                    'objectRootPath': 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1',
                    'label': 'depemployee',
                    'primaryRootPath': 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster',
                    'lookupFieldDisplayName': "DepCLookup1",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm71655_965872': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": null,
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "depclookup2",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": []
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depdate",
                        "targetColumn": "depdate",
                        "sourceColumnFieldType": "DATE",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }, {
                        "sourceColumn": "depboolean",
                        "targetColumn": "depboolean",
                        "sourceColumnFieldType": "BOOLEAN",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }, {
                        "sourceColumn": "depnumber",
                        "targetColumn": "depnumber",
                        "sourceColumnFieldType": "NUMBER",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }],
                    'objectRootPath': 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2',
                    'label': 'depemployee',
                    'primaryRootPath': 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster',
                    'lookupFieldDisplayName': "DepCLookup2",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm71655_967514': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": null,
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "depclookup3",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": []
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depboolean",
                        "targetColumn": "depboolean",
                        "sourceColumnFieldType": "BOOLEAN",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }, {
                        "sourceColumn": "depcheckbox",
                        "targetColumn": "depcheckbox",
                        "sourceColumnFieldType": "CHECKBOX",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }, {
                        "sourceColumn": "depdecimal",
                        "targetColumn": "depdecimal",
                        "sourceColumnFieldType": "DECIMAL",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }, {
                        "sourceColumn": "depdropdownn",
                        "targetColumn": "depdropdownn",
                        "sourceColumnFieldType": "DROPDOWN",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }],
                    'objectRootPath': 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup3',
                    'label': 'depemployee',
                    'primaryRootPath': 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster',
                    'lookupFieldDisplayName': "DepCLookup3",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm71655_967516': {
                    'lookupColumns': [{
                        "id": "employeeid",
                        "label": "Employee ID",
                        "fieldName": "employeeid",
                        "prop": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeeid",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "employeename",
                        "label": "Employee Name",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "traversalpath": "depemployee_DUMMY$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "depemployee",
                        "objectType": "PRIMARY",
                        "relationShipType": null,
                        "fieldId": 0,
                        "objectId": "71655",
                        "rootPath": "depemployee_DUMMY",
                        "fieldName": "depclookup4",
                        "referenceObjectId": 0,
                        "isStandardObject": "N",
                        "childObject": []
                    },
                    'argumentColumns': [{
                        "sourceColumn": "depdate",
                        "targetColumn": "depdate",
                        "sourceColumnFieldType": "DATE",
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                    }],
                    'objectRootPath': 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup4',
                    'label': 'depemployee',
                    'primaryRootPath': 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster',
                    'lookupFieldDisplayName': "DepCLookup4",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': false,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                },
                'pfm5_967510': {
                    'lookupColumns': [{
                        "id": "username",
                        "label": "USERNAME",
                        "fieldName": "username",
                        "prop": "username",
                        "fieldType": "TEXT",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$username",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }, {
                        "id": "first_name",
                        "label": "FIRST NAME",
                        "fieldName": "first_name",
                        "prop": "first_name",
                        "fieldType": "TEXT",
                        "objectName": "COR_USERS",
                        "traversalpath": "COR_USERS_DUMMY$$first_name",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    }],
                    'lookupHierarchyJson': {
                        "objectName": "COR_USERS",
                        "objectType": "PRIMARY",
                        "relationShipType": null,
                        "fieldId": 0,
                        "objectId": "5",
                        "rootPath": "COR_USERS_DUMMY",
                        "fieldName": "depcoruser",
                        "referenceObjectId": 0,
                        "isStandardObject": "Y",
                        "childObject": []
                    },

                    'objectRootPath': 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$COR_USERS_depcoruser',
                    'label': 'COR_USERS',
                    'primaryRootPath': 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster',
                    'lookupFieldDisplayName': "DepcCorUser",
                    'isSearchFilterEnabled': false,
                    'onLoadFetchEnabled': false,
                    'filterConfig': {},

                    'isOnlySubordinates': false,
                    'isStandardObject': true,
                    'additionalDataHierarchyJson': undefined,
                    'objectId': 'pfm71658'
                }
            },

            'columnFieldInfo': {
                "pfm74408": [{
                    "id": "depcname",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcname.depcname",
                    "fieldName": "depcname",
                    "prop": "depcname",
                    "fieldType": "TEXT",
                    "objectName": "depchildinfo",
                    "elementid": 7897349,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcname",
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "depcname1",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcname1.depcname1",
                    "fieldName": "depcname1",
                    "prop": "depcname1",
                    "fieldType": "TEXT",
                    "objectName": "depchildinfo",
                    "elementid": 7897350,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcname1",
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "depcdate1",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcdate1.depcdate1",
                    "fieldName": "depcdate1",
                    "prop": "depcdate1",
                    "fieldType": "DATE",
                    "objectName": "depchildinfo",
                    "elementid": 7897351,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcdate1",
                    "child": "",
                    "dateFormat": this.appUtilityObj.userDateFormat,
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "depcnum1",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcnum1.depcnum1",
                    "fieldName": "depcnum1",
                    "prop": "depcnum1",
                    "fieldType": "NUMBER",
                    "objectName": "depchildinfo",
                    "elementid": 7897352,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcnum1",
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "depccurrency1",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depccurrency1.depccurrency1",
                    "fieldName": "depccurrency1",
                    "prop": "depccurrency1",
                    "fieldType": "CURRENCY",
                    "objectName": "depchildinfo",
                    "elementid": 7897353,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depccurrency1",
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": {
                        "currencyCode": "₹",
                        "display": true,
                        "digitsInfo": "1.2-2",
                        "locale": "en-IN"
                    },
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "depboolean",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depboolean.depboolean",
                    "fieldName": "depboolean",
                    "prop": "depboolean",
                    "fieldType": "BOOLEAN",
                    "objectName": "depchildinfo",
                    "elementid": 7897354,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depboolean",
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "depnumber",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depnumber.depnumber",
                    "fieldName": "depnumber",
                    "prop": "depnumber",
                    "fieldType": "NUMBER",
                    "objectName": "depchildinfo",
                    "elementid": 7897355,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depnumber",
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "depdate",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdate.depdate",
                    "fieldName": "depdate",
                    "prop": "depdate",
                    "fieldType": "DATE",
                    "objectName": "depchildinfo",
                    "elementid": 7897356,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdate",
                    "child": "",
                    "dateFormat": this.appUtilityObj.userDateFormat,
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "deptimestamp",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$deptimestamp.deptimestamp",
                    "fieldName": "deptimestamp",
                    "prop": "deptimestamp",
                    "fieldType": "TIMESTAMP",
                    "objectName": "depchildinfo",
                    "elementid": 7897357,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$deptimestamp",
                    "child": "",
                    "dateFormat": this.appUtilityObj.userDateTimeFormat,
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "depdropdownn",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdropdownn.depdropdownn",
                    "fieldName": "depdropdownn",
                    "prop": "depdropdownn",
                    "fieldType": "DROPDOWN",
                    "objectName": "depchildinfo",
                    "elementid": 7897358,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdropdownn",
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": {
                        "1": "One",
                        "2": "Two",
                        "3": "Three",
                        "4": "Four"
                    },
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "depdecimal",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdecimal.depdecimal",
                    "fieldName": "depdecimal",
                    "prop": "depdecimal",
                    "fieldType": "DECIMAL",
                    "objectName": "depchildinfo",
                    "elementid": 7897359,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdecimal",
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "id": "pfm71655_965870_employeeid",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup1.depclookup1",
                    "prop": "pfm71655_965870.employeeid",
                    "fieldName": "pfm71655_965870",
                    "fieldType": "LOOKUP",
                    "objectName": "depchildinfo",
                    "elementid": 7897360,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup1",
                    "child": {
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": "",
                        "id": "employeeid",
                        "label": "employeeid",
                        "prop": "employeeid",
                        "fieldName": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depchildinfo"
                    },
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "child": {
                        "id": "employeename",
                        "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$employeename.employeename",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "elementid": 7897361,
                        "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    },
                    "id": "pfm71655_965870_employeename",
                    "prop": "pfm71655_965870.employeename",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$employeename.employeename",
                    "elementid": 7897361,
                    "mappingDetails": "",
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$employeename",
                    "dateFormat": "",
                    "currencyDetails": "",
                    "fieldName": "pfm71655_965870",
                    "fieldType": "LOOKUP",
                    "objectName": "depemployee",
                    "isEditable": false,
                    "conditionalValidationEnable": false
                }, {
                    "child": {
                        "id": "team",
                        "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$team.team",
                        "fieldName": "team",
                        "prop": "team",
                        "fieldType": "DROPDOWN",
                        "objectName": "depemployee",
                        "elementid": 7897362,
                        "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$team",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": {
                            "IS": "Innovation Squad",
                            "AC": "appConnect",
                            "TE": "Testing"
                        },
                        "currencyDetails": ""
                    },
                    "id": "pfm71655_965870_team",
                    "prop": "pfm71655_965870.team",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$team.team",
                    "elementid": 7897362,
                    "mappingDetails": {
                        "IS": "Innovation Squad",
                        "AC": "appConnect",
                        "TE": "Testing"
                    },
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$team",
                    "dateFormat": "",
                    "currencyDetails": "",
                    "fieldName": "pfm71655_965870",
                    "fieldType": "LOOKUP",
                    "objectName": "depemployee",
                    "isEditable": false,
                    "conditionalValidationEnable": false
                }, {
                    "id": "pfm71655_965872_employeeid",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup2.depclookup2",
                    "prop": "pfm71655_965872.employeeid",
                    "fieldName": "pfm71655_965872",
                    "fieldType": "LOOKUP",
                    "objectName": "depchildinfo",
                    "elementid": 7897363,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup2",
                    "child": {
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": "",
                        "id": "employeeid",
                        "label": "employeeid",
                        "prop": "employeeid",
                        "fieldName": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depchildinfo"
                    },
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "child": {
                        "id": "employeename",
                        "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2$$employeename.employeename",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "elementid": 7897364,
                        "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    },
                    "id": "pfm71655_965872_employeename",
                    "prop": "pfm71655_965872.employeename",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2$$employeename.employeename",
                    "elementid": 7897364,
                    "mappingDetails": "",
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2$$employeename",
                    "dateFormat": "",
                    "currencyDetails": "",
                    "fieldName": "pfm71655_965872",
                    "fieldType": "LOOKUP",
                    "objectName": "depemployee",
                    "isEditable": false,
                    "conditionalValidationEnable": false
                }, {
                    "id": "pfm71655_967514_employeeid",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup3.depclookup3",
                    "prop": "pfm71655_967514.employeeid",
                    "fieldName": "pfm71655_967514",
                    "fieldType": "LOOKUP",
                    "objectName": "depchildinfo",
                    "elementid": 7897365,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup3",
                    "child": {
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": "",
                        "id": "employeeid",
                        "label": "employeeid",
                        "prop": "employeeid",
                        "fieldName": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depchildinfo"
                    },
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "child": {
                        "id": "employeename",
                        "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup3$$employeename.employeename",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "elementid": 7897366,
                        "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup3$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    },
                    "id": "pfm71655_967514_employeename",
                    "prop": "pfm71655_967514.employeename",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup3$$employeename.employeename",
                    "elementid": 7897366,
                    "mappingDetails": "",
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup3$$employeename",
                    "dateFormat": "",
                    "currencyDetails": "",
                    "fieldName": "pfm71655_967514",
                    "fieldType": "LOOKUP",
                    "objectName": "depemployee",
                    "isEditable": false,
                    "conditionalValidationEnable": false
                }, {
                    "id": "pfm71655_967516_employeeid",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup4.depclookup4",
                    "prop": "pfm71655_967516.employeeid",
                    "fieldName": "pfm71655_967516",
                    "fieldType": "LOOKUP",
                    "objectName": "depchildinfo",
                    "elementid": 7897367,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup4",
                    "child": {
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": "",
                        "id": "employeeid",
                        "label": "employeeid",
                        "prop": "employeeid",
                        "fieldName": "employeeid",
                        "fieldType": "TEXT",
                        "objectName": "depchildinfo"
                    },
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "child": {
                        "id": "employeename",
                        "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup4$$employeename.employeename",
                        "fieldName": "employeename",
                        "prop": "employeename",
                        "fieldType": "TEXT",
                        "objectName": "depemployee",
                        "elementid": 7897368,
                        "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup4$$employeename",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    },
                    "id": "pfm71655_967516_employeename",
                    "prop": "pfm71655_967516.employeename",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup4$$employeename.employeename",
                    "elementid": 7897368,
                    "mappingDetails": "",
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup4$$employeename",
                    "dateFormat": "",
                    "currencyDetails": "",
                    "fieldName": "pfm71655_967516",
                    "fieldType": "LOOKUP",
                    "objectName": "depemployee",
                    "isEditable": false,
                    "conditionalValidationEnable": false
                }, {
                    "id": "pfm5_967510_username",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcoruser.depcoruser",
                    "prop": "pfm5_967510.username",
                    "fieldName": "pfm5_967510",
                    "fieldType": "LOOKUP",
                    "objectName": "depchildinfo",
                    "elementid": 7897369,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcoruser",
                    "child": {
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": "",
                        "id": "username",
                        "label": "username",
                        "prop": "username",
                        "fieldName": "username",
                        "fieldType": "TEXT",
                        "objectName": "depchildinfo"
                    },
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }, {
                    "child": {
                        "id": "first_name",
                        "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$COR_USERS_depcoruser$$first_name.first_name",
                        "fieldName": "first_name",
                        "prop": "first_name",
                        "fieldType": "TEXT",
                        "objectName": "COR_USERS",
                        "elementid": 7897370,
                        "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$COR_USERS_depcoruser$$first_name",
                        "child": "",
                        "dateFormat": "",
                        "mappingDetails": "",
                        "currencyDetails": ""
                    },
                    "id": "pfm5_967510_first_name",
                    "prop": "pfm5_967510.first_name",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$COR_USERS_depcoruser$$first_name.first_name",
                    "elementid": 7897370,
                    "mappingDetails": "",
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$COR_USERS_depcoruser$$first_name",
                    "dateFormat": "",
                    "currencyDetails": "",
                    "fieldName": "pfm5_967510",
                    "fieldType": "LOOKUP",
                    "objectName": "COR_USERS",
                    "isEditable": false,
                    "conditionalValidationEnable": false
                }, {
                    "id": "depcformula1__f",
                    "label": "DepPerson_MultiLine_Entry_WEB_Grid_with_List.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcformula1.depcformula1",
                    "fieldName": "depcformula1__f",
                    "prop": "depcformula1__f",
                    "fieldType": "FORMULA",
                    "formulaType": "NUMBER",
                    "objectName": "depchildinfo",
                    "elementid": 7897371,
                    "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcformula1",
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": "",
                    "isEditable": true,
                    "conditionalValidationEnable": false
                }]
            },
            'objectDisplayMapping': {
                "pfm0s": "DepPersonalInfo Entry",
                "pfm74408s": "DepChild Entry"
            },
            'paginationConfig': {
                "pfm74408": {
                    "currentPageWithRecord": "true",
                    "itemPerPage": "true",
                    "numberOfPages": "true",
                    "paginationPosition": "TOP",
                    "noOfItemsPerPage": "50"
                }
            },
            'relationShip': {
                "pfm74408": "one_to_many"
            },
            'sectionObjectDetail': {
                "pfm74408": {
                    "groupingColumns": [],
                    "isRowClickDisabled": false,
                    "dataFetchMode": "Batch",
                    "isExpanded": "C",
                    "isMatrixEnabled": false,
                    "sectionElementId": "SEC_DepPerson_MultiLine_Entry_WEB_Grid_with_List_depchild_entry",
                    "sortByColumns": [],
                    "matrixConfig": {},
                    "criteriaQueryConfig": {
                        "queryConfig": {},
                        "junctionDataObjects": {},
                        "relationalObjectIds": [],
                        "criteriaQuery": ""
                    },
                    "sectionUserDataRestrictionSet": []
                }
            },
            'sectionObjects': ["pfm74408"],
            'sectionObjectHierarchy': {
                "pfm74408": {
                    "objectId": "74408",
                    "fieldId": "965874",
                    "objectName": "depchildinfo",
                    "objectType": "MASTERDETAIL",
                    "referenceObjectId": 71658,
                    "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster",
                    "isStandardObject": "N",
                    "relationShipType": "one_to_many",
                    "includeFields": true,
                    "formulaField": [{
                        "fieldName": "depcformula1"
                    }],
                    "childObject": [{
                        "objectId": "71655",
                        "fieldId": "965872",
                        "objectName": "depemployee",
                        "objectType": "LOOKUP",
                        "referenceObjectId": 74408,
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2",
                        "isStandardObject": "N",
                        "relationShipType": "",
                        "includeFields": true,
                        "formulaField": [{
                            "fieldName": "depformulan"
                        }],
                        "childObject": []
                    }, {
                        "objectId": "5",
                        "fieldId": "967510",
                        "objectName": "COR_USERS",
                        "objectType": "LOOKUP",
                        "referenceObjectId": 74408,
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$COR_USERS_depcoruser",
                        "isStandardObject": "Y",
                        "relationShipType": "",
                        "includeFields": true,
                        "childObject": []
                    }, {
                        "objectId": "71655",
                        "fieldId": "967514",
                        "objectName": "depemployee",
                        "objectType": "LOOKUP",
                        "referenceObjectId": 74408,
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup3",
                        "isStandardObject": "N",
                        "relationShipType": "",
                        "includeFields": true,
                        "formulaField": [{
                            "fieldName": "depformulan"
                        }],
                        "childObject": []
                    }, {
                        "objectId": "71655",
                        "fieldId": "965870",
                        "objectName": "depemployee",
                        "objectType": "LOOKUP",
                        "referenceObjectId": 74408,
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1",
                        "isStandardObject": "N",
                        "relationShipType": "",
                        "includeFields": true,
                        "formulaField": [{
                            "fieldName": "depformulan"
                        }],
                        "childObject": []
                    }, {
                        "objectId": "71655",
                        "fieldId": "967516",
                        "objectName": "depemployee",
                        "objectType": "LOOKUP",
                        "referenceObjectId": 74408,
                        "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup4",
                        "isStandardObject": "N",
                        "relationShipType": "",
                        "includeFields": true,
                        "formulaField": [{
                            "fieldName": "depformulan"
                        }],
                        "childObject": []
                    }]
                }
            },
            'conditionalValidation': {
                "pfm74408": null
            },
            'primaryRecordId': '',
            'primaryObjectName': 'pfm71658',
            'formulaConfig': {
                "pfm74408": {
                    "pfm74408_depcformula1_7897371": {
                        "isReturnBlankEnable": "N",
                        "fieldName": "depcformula1",
                        "formulaType": "NUMBER",
                        "configuredTimezone": "Asia/Calcutta",
                        "involvedFields": [{
                            "fieldName": "depcname1",
                            "fieldType": "TEXT",
                            "objectId": 74408,
                            "fieldId": 965866,
                            "objectType": "PRIMARY",
                            "traversalPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster"
                        }],
                        "isRollupEnabled": "N",
                        "configuredDateFormat": "MM/DD/YYYY",
                        "formula": "length(deppersonalinfo_DUMMY$$depchildinfo_depcmaster.depcname1)",
                        "isOldRecordUpdateEnable": "N",
                        "objectId": 74408,
                        "displayFormula": "depchildinfo.DepC Name1.length()"
                    }
                }
            },
            'sectionDependentObjectList': {
                "219815_pfm74408": {
                    "relationalObjects": {
                        "pfm74408": []
                    },
                    "lookupObjects": {
                        "pfm71655": {
                            "pfm74408": ["pfm71655_965870", "pfm71655_965872", "pfm71655_967514", "pfm71655_967516"]
                        },
                        "pfm5": {
                            "pfm74408": ["pfm5_967510"]
                        }
                    }
                }
            },
            'sectionObjectTraversal': {
                "pfm71658": {
                    "objectTraversal": {
                        "deppersonalinfo_DUMMY": {
                            "prop": "",
                            "relationship": "PRIMARY",
                            "child": ""
                        }
                    }
                }
            },
            'multiLineResultLookupConfiguration': {},

        },
        '221659': {
            "itemsPerPageConfigured": 50,

            'objectTraversal': {
                'deppersonalinfo_DUMMY': {
                    "prop": "",
                    "relationship": "PRIMARY",
                    "child": ""
                },
            }


            ,
            'associationConfiguration': {

            },
            'dataCloningInfo': {

            },
            'fileManageInfo': {

            },
            'userAssignment': {

            },
            'lookupFieldInfo': {

            },

        },
    };
    public conditionalValidationJsonSet = {};
}