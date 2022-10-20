import {
    Injectable
} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class cspfmObjectConfiguration {

    public objectConfiguration = {
        "pfm5": {
            "compositeValidation": [],
            "uniqueValidation": [{
                "fieldName": "username",
                "displayName": "USERNAME",
                "fieldType": "TEXT",
                "isDependentCheckRequired": false,
                "dependentObjectID": "pfm5"
            }],
            "requiredFieldsValidation": [{
                "fieldName": "username",
                "displayName": "USERNAME",
                "fieldType": "TEXT"
            }]
        },
        "pfm71655": {
            "compositeValidation": [],
            "selectionFieldsMapping": {
                "location": {
                    "CHE": "depemployee.location.Option.Chennai",
                    "MDU": "depemployee.location.Option.Madurai",
                    "CMB": "depemployee.location.Option.Kovai"
                },
                "team": {
                    "IS": "depemployee.team.Option.Innovation Squad",
                    "AC": "depemployee.team.Option.appConnect",
                    "TE": "depemployee.team.Option.Testing"
                },
                "depcheckbox": {
                    "COption1": "depemployee.depcheckbox.Option.COption1",
                    "COption2": "depemployee.depcheckbox.Option.COption2",
                    "COption3": "depemployee.depcheckbox.Option.COption3"
                },
                "depdropdownn": {
                    "1": "depemployee.depdropdownn.Option.One",
                    "2": "depemployee.depdropdownn.Option.Two",
                    "3": "depemployee.depdropdownn.Option.Three",
                    "4": "depemployee.depdropdownn.Option.Four"
                },
                "depmultiselect": {
                    "MSelect1": "depemployee.depmultiselect.Option.MSelect1",
                    "MSelect2": "depemployee.depmultiselect.Option.MSelect2",
                    "MSelect3": "depemployee.depmultiselect.Option.MSelect3"
                }
            },
            "selectionFieldsMappingForEntry": {
                "location": [{
                    "title": "depemployee.location.Option.Chennai",
                    "value": "CHE"
                }, {
                    "title": "depemployee.location.Option.Madurai",
                    "value": "MDU"
                }, {
                    "title": "depemployee.location.Option.Kovai",
                    "value": "CMB"
                }],
                "team": [{
                    "title": "depemployee.team.Option.Innovation Squad",
                    "value": "IS"
                }, {
                    "title": "depemployee.team.Option.appConnect",
                    "value": "AC"
                }, {
                    "title": "depemployee.team.Option.Testing",
                    "value": "TE"
                }],
                "depcheckbox": [{
                    "title": "depemployee.depcheckbox.Option.COption1",
                    "value": "COption1"
                }, {
                    "title": "depemployee.depcheckbox.Option.COption2",
                    "value": "COption2"
                }, {
                    "title": "depemployee.depcheckbox.Option.COption3",
                    "value": "COption3"
                }],
                "depdropdownn": [{
                    "title": "depemployee.depdropdownn.Option.One",
                    "value": "1"
                }, {
                    "title": "depemployee.depdropdownn.Option.Two",
                    "value": "2"
                }, {
                    "title": "depemployee.depdropdownn.Option.Three",
                    "value": "3"
                }, {
                    "title": "depemployee.depdropdownn.Option.Four",
                    "value": "4"
                }],
                "depmultiselect": [{
                    "title": "depemployee.depmultiselect.Option.MSelect1",
                    "value": "MSelect1"
                }, {
                    "title": "depemployee.depmultiselect.Option.MSelect2",
                    "value": "MSelect2"
                }, {
                    "title": "depemployee.depmultiselect.Option.MSelect3",
                    "value": "MSelect3"
                }]
            },
            "uniqueValidation": [{
                "fieldName": "employeeid",
                "displayName": "Employee ID",
                "fieldType": "TEXT",
                "isDependentCheckRequired": false,
                "dependentObjectID": "pfm71655"
            }],
            "requiredFieldsValidation": [{
                "fieldName": "employeeid",
                "displayName": "Employee ID",
                "fieldType": "TEXT"
            }]
        },
        "pfm71658": {
            "compositeValidation": [],
            "selectionFieldsMapping": {
                "depcheckbox": {
                    "COption1": "deppersonalinfo.depcheckbox.Option.COption1",
                    "COption2": "deppersonalinfo.depcheckbox.Option.COption2",
                    "COption3": "deppersonalinfo.depcheckbox.Option.COption3"
                },
                "depmultiselect": {
                    "MSelect1": "deppersonalinfo.depmultiselect.Option.MSelect1",
                    "MSelect2": "deppersonalinfo.depmultiselect.Option.MSelect2",
                    "MSelect3": "deppersonalinfo.depmultiselect.Option.MSelect3"
                },
                "location": {
                    "CHE": "deppersonalinfo.location.Option.Chennai",
                    "MDU": "deppersonalinfo.location.Option.Madurai",
                    "CMB": "deppersonalinfo.location.Option.Kovai"
                },
                "team": {
                    "IS": "deppersonalinfo.team.Option.Innovation Squad",
                    "AC": "deppersonalinfo.team.Option.appConnect",
                    "TE": "deppersonalinfo.team.Option.Testing"
                }
            },
            "selectionFieldsMappingForEntry": {
                "depcheckbox": [{
                    "title": "deppersonalinfo.depcheckbox.Option.COption1",
                    "value": "COption1"
                }, {
                    "title": "deppersonalinfo.depcheckbox.Option.COption2",
                    "value": "COption2"
                }, {
                    "title": "deppersonalinfo.depcheckbox.Option.COption3",
                    "value": "COption3"
                }],
                "depmultiselect": [{
                    "title": "deppersonalinfo.depmultiselect.Option.MSelect1",
                    "value": "MSelect1"
                }, {
                    "title": "deppersonalinfo.depmultiselect.Option.MSelect2",
                    "value": "MSelect2"
                }, {
                    "title": "deppersonalinfo.depmultiselect.Option.MSelect3",
                    "value": "MSelect3"
                }],
                "location": [{
                    "title": "deppersonalinfo.location.Option.Chennai",
                    "value": "CHE"
                }, {
                    "title": "deppersonalinfo.location.Option.Madurai",
                    "value": "MDU"
                }, {
                    "title": "deppersonalinfo.location.Option.Kovai",
                    "value": "CMB"
                }],
                "team": [{
                    "title": "deppersonalinfo.team.Option.Innovation Squad",
                    "value": "IS"
                }, {
                    "title": "deppersonalinfo.team.Option.appConnect",
                    "value": "AC"
                }, {
                    "title": "deppersonalinfo.team.Option.Testing",
                    "value": "TE"
                }]
            },
            "uniqueValidation": [{
                "fieldName": "name",
                "displayName": "name",
                "fieldType": "TEXT",
                "isDependentCheckRequired": false,
                "dependentObjectID": "pfm71658"
            }],
            "requiredFieldsValidation": [{
                "fieldName": "name",
                "displayName": "name",
                "fieldType": "TEXT"
            }]
        },
        "pfm74408": {
            "compositeValidation": [],
            "selectionFieldsMapping": {
                "depdropdownn": {
                    "1": "depchildinfo.depdropdownn.Option.One",
                    "2": "depchildinfo.depdropdownn.Option.Two",
                    "3": "depchildinfo.depdropdownn.Option.Three",
                    "4": "depchildinfo.depdropdownn.Option.Four"
                }
            },
            "selectionFieldsMappingForEntry": {
                "depdropdownn": [{
                    "title": "depchildinfo.depdropdownn.Option.One",
                    "value": "1"
                }, {
                    "title": "depchildinfo.depdropdownn.Option.Two",
                    "value": "2"
                }, {
                    "title": "depchildinfo.depdropdownn.Option.Three",
                    "value": "3"
                }, {
                    "title": "depchildinfo.depdropdownn.Option.Four",
                    "value": "4"
                }]
            },
            "uniqueValidation": [{
                "fieldName": "depcname",
                "displayName": "depCname",
                "fieldType": "TEXT",
                "isDependentCheckRequired": false,
                "dependentObjectID": "pfm74408"
            }],
            "requiredFieldsValidation": [{
                "fieldName": "depcname",
                "displayName": "depCname",
                "fieldType": "TEXT"
            }, {
                "fieldName": "depcmaster",
                "displayName": "DepC Master",
                "fieldType": "MASTERDETAIL"
            }]
        }
    };
}