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
                "team": {
                    "IS": "depemployee.team.Option.Innovation Squad",
                    "AC": "depemployee.team.Option.appConnect",
                    "TE": "depemployee.team.Option.Testing"
                },
                "location": {
                    "CHE": "depemployee.location.Option.Chennai",
                    "MDU": "depemployee.location.Option.Madurai",
                    "CMB": "depemployee.location.Option.Kovai"
                },
                "depmultiselect": {
                    "MSelect1": "depemployee.depmultiselect.Option.MSelect1",
                    "MSelect2": "depemployee.depmultiselect.Option.MSelect2",
                    "MSelect3": "depemployee.depmultiselect.Option.MSelect3"
                }
            },
            "selectionFieldsMappingForEntry": {
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
            "compositeValidation": [{
                "compositekey": "pfm_csp_71658_2_ck",
                "compositeName": "Composite Group-2",
                "compositeFields": [{
                    "fieldName": "depdate",
                    "fieldDisplayName": "DepDate",
                    "fieldType": "DATE"
                }, {
                    "fieldName": "depnumber",
                    "fieldDisplayName": "DepNumber",
                    "fieldType": "NUMBER"
                }]
            }, {
                "compositekey": "pfm_csp_71658_1_ck",
                "compositeName": "Composite Group-1",
                "compositeFields": [{
                    "fieldName": "depdecimal",
                    "fieldDisplayName": "DepDecimal",
                    "fieldType": "DECIMAL"
                }, {
                    "fieldName": "pfm5_967712",
                    "fieldDisplayName": "DepCorUser",
                    "fieldType": "LOOKUP"
                }]
            }],
            "requiredFieldsValidation": [{
                "fieldName": "depcurrency",
                "displayName": "DepCurrency",
                "fieldType": "CURRENCY"
            }, {
                "fieldName": "team",
                "displayName": "Team",
                "fieldType": "DROPDOWN"
            }, {
                "fieldName": "depdecimal",
                "displayName": "DepDecimal",
                "fieldType": "DECIMAL"
            }, {
                "fieldName": "name",
                "displayName": "name",
                "fieldType": "TEXT"
            }, {
                "fieldName": "employeename",
                "displayName": "Employee Name",
                "fieldType": "TEXT"
            }, {
                "fieldName": "depdate",
                "displayName": "DepDate",
                "fieldType": "DATE"
            }],
            "selectionFieldsMapping": {
                "location": {
                    "CHE": "deppersonalinfo.location.Option.Chennai",
                    "MDU": "deppersonalinfo.location.Option.Madurai",
                    "CMB": "deppersonalinfo.location.Option.Kovai"
                },
                "team": {
                    "IS": "deppersonalinfo.team.Option.Innovation Squad",
                    "AC": "deppersonalinfo.team.Option.appConnect",
                    "TE": "deppersonalinfo.team.Option.Testing"
                },
                "depmultiselect": {
                    "MSelect1": "deppersonalinfo.depmultiselect.Option.MSelect1",
                    "MSelect2": "deppersonalinfo.depmultiselect.Option.MSelect2",
                    "MSelect3": "deppersonalinfo.depmultiselect.Option.MSelect3"
                },
                "depcheckbox": {
                    "COption1": "deppersonalinfo.depcheckbox.Option.COption1",
                    "COption2": "deppersonalinfo.depcheckbox.Option.COption2",
                    "COption3": "deppersonalinfo.depcheckbox.Option.COption3"
                }
            },
            "selectionFieldsMappingForEntry": {
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
                "depcheckbox": [{
                    "title": "deppersonalinfo.depcheckbox.Option.COption1",
                    "value": "COption1"
                }, {
                    "title": "deppersonalinfo.depcheckbox.Option.COption2",
                    "value": "COption2"
                }, {
                    "title": "deppersonalinfo.depcheckbox.Option.COption3",
                    "value": "COption3"
                }]
            },
            "uniqueValidation": [{
                "fieldName": "team",
                "displayName": "Team",
                "fieldType": "DROPDOWN"
            }, {
                "fieldName": "depdecimal",
                "displayName": "DepDecimal",
                "fieldType": "DECIMAL",
                "isDependentCheckRequired": false,
                "dependentObjectID": "pfm71658"
            }, {
                "fieldName": "name",
                "displayName": "name",
                "fieldType": "TEXT",
                "isDependentCheckRequired": false,
                "dependentObjectID": "pfm71658"
            }, {
                "fieldName": "employeename",
                "displayName": "Employee Name",
                "fieldType": "TEXT"
            }]
        },
        "pfm74408": {
            "compositeValidation": [{
                "compositekey": "pfm_csp_74408_1_ck",
                "compositeName": "Composite Group-1",
                "compositeFields": [{
                    "fieldName": "depcname1",
                    "fieldDisplayName": "DepC Name1",
                    "fieldType": "TEXT"
                }, {
                    "fieldName": "depnumber",
                    "fieldDisplayName": "DepNumber",
                    "fieldType": "NUMBER"
                }]
            }],
            "uniqueValidation": [{
                "fieldName": "depcname",
                "displayName": "depCname",
                "fieldType": "TEXT",
                "isDependentCheckRequired": false,
                "dependentObjectID": "pfm74408"
            }, {
                "fieldName": "depccurrency1",
                "displayName": "DepC Currency1",
                "fieldType": "CURRENCY"
            }, {
                "fieldName": "depcname1",
                "displayName": "DepC Name1",
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
            }, {
                "fieldName": "depccurrency1",
                "displayName": "DepC Currency1",
                "fieldType": "CURRENCY"
            }, {
                "fieldName": "depcname1",
                "displayName": "DepC Name1",
                "fieldType": "TEXT"
            }],
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
            }
        },
        "pfm77370": {
            "compositeValidation": [],
            "uniqueValidation": [{
                "fieldName": "mno",
                "displayName": "M No",
                "fieldType": "AUTONUMBER",
                "isDependentCheckRequired": false,
                "dependentObjectID": "pfm77370"
            }],
            "requiredFieldsValidation": [{
                "fieldName": "depmmaster",
                "displayName": "DepM Master",
                "fieldType": "MASTERDETAIL"
            }],
            "selectionFieldsMapping": {
                "cities": {
                    "CHN": "depmultiinfo.cities.Option.Chennai",
                    "MDU": "depmultiinfo.cities.Option.Madurai",
                    "KCI": "depmultiinfo.cities.Option.Kochi",
                    "TVN": "depmultiinfo.cities.Option.Trivandrum",
                    "TRI": "depmultiinfo.cities.Option.Tripathi",
                    "CHT": "depmultiinfo.cities.Option.Chithoor",
                    "BAN": "depmultiinfo.cities.Option.Bangalore",
                    "MYS": "depmultiinfo.cities.Option.Mysore"
                },
                "state": {
                    "TN": "depmultiinfo.state.Option.TamilNadu",
                    "KL": "depmultiinfo.state.Option.Kerala",
                    "KAR": "depmultiinfo.state.Option.Karnataka",
                    "AP": "depmultiinfo.state.Option.Andhra"
                }
            },
            "selectionFieldsMappingForEntry": {
                "cities": [{
                    "title": "depmultiinfo.cities.Option.Chennai",
                    "value": "CHN"
                }, {
                    "title": "depmultiinfo.cities.Option.Madurai",
                    "value": "MDU"
                }, {
                    "title": "depmultiinfo.cities.Option.Kochi",
                    "value": "KCI"
                }, {
                    "title": "depmultiinfo.cities.Option.Trivandrum",
                    "value": "TVN"
                }, {
                    "title": "depmultiinfo.cities.Option.Tripathi",
                    "value": "TRI"
                }, {
                    "title": "depmultiinfo.cities.Option.Chithoor",
                    "value": "CHT"
                }, {
                    "title": "depmultiinfo.cities.Option.Bangalore",
                    "value": "BAN"
                }, {
                    "title": "depmultiinfo.cities.Option.Mysore",
                    "value": "MYS"
                }],
                "state": [{
                    "title": "depmultiinfo.state.Option.TamilNadu",
                    "value": "TN"
                }, {
                    "title": "depmultiinfo.state.Option.Kerala",
                    "value": "KL"
                }, {
                    "title": "depmultiinfo.state.Option.Karnataka",
                    "value": "KAR"
                }, {
                    "title": "depmultiinfo.state.Option.Andhra",
                    "value": "AP"
                }]
            }
        }
    };
}