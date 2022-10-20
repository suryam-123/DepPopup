/* 
 *   File: cspfmWebFilter.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { OnInit, Component, OnChanges, Input, Output, EventEmitter } from "@angular/core";
import { cspfmListFilterUtils } from "src/core/dynapageutils/cspfmListFilterUtils";
import { cspfmListSearchListUtils } from "src/core/dynapageutils/cspfmListSearchListUtils";
import { FilterFieldInfo, LookupFilterField } from "src/core/models/cspfmFilterFieldInfo.type";
import { appUtility } from "src/core/utils/appUtility";
import * as filterConfig from "../../../assets/filterConfig/filter_based_conditional_operator_setting.json";
import * as moment from "moment";
import { FilterSectionDetail } from "src/core/models/cspfmFilterDetails.type";
import { cspfmLayoutConfiguration } from "src/core/pfmmapping/cspfmLayoutConfiguration";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { appConstant } from "src/core/utils/appConstant";
import { cspfmweblookuppage } from "src/core/pages/cspfmweblookuppage/cspfmweblookuppage";
import { dataProvider } from "src/core/utils/dataProvider";

@Component({
    selector: "cspfmWebFilter",
    templateUrl: "./cspfmWebFilter.html",
    styleUrls: ["./cspfmWebFilter.scss"],
})
export class cspfmWebFilter implements OnInit {
    public objectKeys = Object.keys;
    public selectedCurrentEvent: Event;

    @Input() filterSectionDetail: FilterSectionDetail;
    @Output() onFilterChange: EventEmitter<any> = new EventEmitter();
    @Input() columnPerRow: 1 | 2 | 3 | 4 = 2;
    @Input() selectable = true;
    @Input() removable = true;

    public flatpickerInstances = {};
    public flatpickrInstance;
    public filterFieldTypeAndOperator;

    constructor(public appUtilityObject: appUtility, public listFilterUtils: cspfmListFilterUtils, public listServiceUtils: cspfmListSearchListUtils,
        public layoutConfiguration: cspfmLayoutConfiguration, public dialog: MatDialog, private dataProvider: dataProvider) {
        this.filterFieldTypeAndOperator = filterConfig["default"]["filterFieldTypeAndOperator"];
    }

    public flexColumnNormalField = "50%";
    public flexColumnBetweenField = "100%";
    ngOnInit() {
        let singleColumnSize = 100 / this.columnPerRow;
        this.flexColumnNormalField = singleColumnSize + "%";
        if (singleColumnSize < 100) {
            this.flexColumnBetweenField = 2 * singleColumnSize + "%";
        }
    }

    ngOnChanges() { }

    writeLog(test?) {
        console.log("filterSectionDetail", this.filterSectionDetail);
        console.log("test", test);
    }

    valueChange(fieldKey, event: Event, betweenKey?: "from" | "to", indexForBool?) {
        if (event && event["target"] && event["target"]["value"] && (this.filterSectionDetail["filterFields"][fieldKey]["fieldType"] === "NUMBER" || this.filterSectionDetail["filterFields"][fieldKey]["fieldType"] === "DECIMAL"
            || this.filterSectionDetail["filterFields"][fieldKey]["fieldType"] === "CURRENCY"
            || (this.filterSectionDetail["filterFields"][fieldKey]["fieldType"] === "FORMULA" && (this.filterSectionDetail["filterFields"][fieldKey]["formulaType"] === "NUMBER"
                || this.filterSectionDetail["filterFields"][fieldKey]["formulaType"] === "CURRENCY"))
            || (this.filterSectionDetail["filterFields"][fieldKey]["fieldType"] === "ROLLUPSUMMARY" && (this.filterSectionDetail["filterFields"][fieldKey]["rollupType"] === "NUMBER"
                || this.filterSectionDetail["filterFields"][fieldKey]["rollupType"] === "CURRENCY")))) {
            if (betweenKey) {
                this.filterSectionDetail["filterFields"][fieldKey]["fieldValue"][betweenKey] = Number(event["target"]["value"]);
            } else {
                this.filterSectionDetail["filterFields"][fieldKey]["fieldValue"] = Number(event["target"]["value"]);
            }
        } else if (this.filterSectionDetail["filterFields"][fieldKey]["fieldType"] === "BOOLEAN"
            || (this.filterSectionDetail["filterFields"][fieldKey]["fieldType"] === "FORMULA" && this.filterSectionDetail["filterFields"][fieldKey]["formulaType"] === "BOOLEAN")
            || (this.filterSectionDetail["filterFields"][fieldKey]["fieldType"] === "ROLLUPSUMMARY" && this.filterSectionDetail["filterFields"][fieldKey]["rollupType"] === "BOOLEAN")) {
            this.filterSectionDetail['filterFields'][fieldKey]['fieldValue'][indexForBool] = event['checked']
        } else {
            if (betweenKey) {
                this.filterSectionDetail["filterFields"][fieldKey]["fieldValue"][betweenKey] = event["target"]["value"];
            } else {
                this.filterSectionDetail["filterFields"][fieldKey]["fieldValue"] = event["target"]["value"];
            }
        }
    }

    toggleBetweenFields(fieldKey) {
        if (this.filterSectionDetail["filterFields"][fieldKey]["betweenflag"] === 'Y') {
            this.filterSectionDetail["filterFields"][fieldKey]["betweenflag"] = 'N'
            this.filterSectionDetail["filterFields"][fieldKey]["fieldValue"] = ""
        } else {
            this.filterSectionDetail["filterFields"][fieldKey]["betweenflag"] = 'Y'
            this.filterSectionDetail["filterFields"][fieldKey]["fieldValue"] = { "from": "", "to": "" }
        }
    }

    flatpickrOnReady(filterFieldInfo: FilterFieldInfo, event, index?) {
        var format;
        this.flatpickerInstances[
            this.listServiceUtils.getFlatpickrInstanceKeyName(filterFieldInfo, index)
        ] = event.instance;
        event.instance["params"] = {
            field: index
                ? filterFieldInfo["objectName"] +
                "_" +
                filterFieldInfo["fieldName"] +
                "_" +
                index
                : filterFieldInfo["objectName"] + "_" + filterFieldInfo["fieldName"],
        };
        event.instance.config.formatDate = this.appUtilityObject.formatDate;
        event.instance.config.parseDate = this.appUtilityObject.parseDate;
        event.instance.config.altInput = true;
        if (event.instance.config.enableTime) {
            format = this.appUtilityObject.userDateTimePickerFormat;
            event.instance.now = new Date(
                new Date().toLocaleString("en-US", {
                    timeZone: this.appUtilityObject.userTimeZone,
                })
            );
        } else {
            format = this.appUtilityObject.userDatePickerFormat;
            event.instance.now = new Date(
                new Date().toLocaleString("en-US", {
                    timeZone: this.appUtilityObject.orgTimeZone,
                })
            );
        }
        event.instance.config.dateFormat = format;
        event.instance.config.altFormat = format;
        event.instance.config.allowInput = true;
        var ngModelValue = filterFieldInfo["fieldValue"];
        var params = event.instance.params;
        if (ngModelValue !== "") {
            if (index) {
                event.instance.setDate(moment(ngModelValue[index], format).toDate());
            } else {
                event.instance.setDate(
                    moment(ngModelValue["fieldValue"], format).toDate()
                );
            }
        } else {
            params["initialValue"] = "";
            event.instance.clear();
        }
        event.instance.redraw();
    }
    flatpickrOnOpen(filterFieldInfo: FilterFieldInfo, event, index?) {
        var ngModelValue;
        this.flatpickrInstance =
            this.flatpickerInstances[
            this.listServiceUtils.getFlatpickrInstanceKeyName(
                filterFieldInfo,
                index
            )
            ];
        if (index) {
            ngModelValue = filterFieldInfo["fieldValue"][index];
        } else {
            ngModelValue = filterFieldInfo["fieldValue"];
        }
        if (ngModelValue !== "") {
            var format = event.instance.config.enableTime
                ? this.appUtilityObject.userDateTimePickerFormat
                : this.appUtilityObject.userDatePickerFormat;
            var date = moment(ngModelValue, format).toDate();
            event.instance.setDate(date);
            event.instance.params["initialValue"] = moment(date).format(format);
        } else {
            event.instance.params["initialValue"] = "";
            event.instance.clear();
        }
    }
    flatpickrOnClose(filterFieldInfo: FilterFieldInfo, event, index?) {
        if (
            event.instance["params"]["field"] ===
            this.flatpickrInstance["params"]["field"]
        ) {
            this.flatpickrInstance = undefined;
        }
    }
    flatpickrOnChange(filterFieldInfo: FilterFieldInfo, event, index?) {
        if (index) {
            filterFieldInfo["fieldValue"][index] = event.dateString;
        } else {
            filterFieldInfo["fieldValue"] = event.dateString;
        }
    }
    closeClick(filterFieldInfo: FilterFieldInfo, index?) {
        if (index) {
            filterFieldInfo["fieldValue"][index] = "";
        } else {
            filterFieldInfo["fieldValue"] = "";
        }
    }
    flatpickrInputElementEvents(event, filterFieldInfo: FilterFieldInfo, index?) {
        var type = event.type;
        const flatpickerInstance =
            this.flatpickerInstances[
            this.listServiceUtils.getFlatpickrInstanceKeyName(
                filterFieldInfo,
                index
            )
            ];
        if (type === "click" || type === "focus") {
            setTimeout(() => {
                flatpickerInstance.open();
            }, 0);
        } else if (type === "keyup" && event.key && event.key !== "Tab") {
            flatpickerInstance.close();
        }
    }

    lookupClearAction(fieldKey) {
        if (this.filterSectionDetail["filterFields"][fieldKey]) {
            this.filterSectionDetail["filterFields"][fieldKey]["fieldValue"] = "";
            this.filterSectionDetail["filterFields"][fieldKey]["displayInfo"][
                "searchKey"
            ] = "";
            this.filterSectionDetail["filterFields"][fieldKey]["displayInfo"][
                "data"
            ] = {};
            this.filterSectionDetail["filterFields"][fieldKey]["displayInfo"][
                "label"
            ] = "";
        }
    }

    showLookup(event, fieldKey: string) {
        this.selectedCurrentEvent = event;
        let lookupFilterField: LookupFilterField = this.filterSectionDetail["filterFields"][fieldKey] as LookupFilterField;
        console.log("lookupFilterField", lookupFilterField);
        if (!lookupFilterField["displayInfo"]["layoutId"]) {
            this.appUtilityObject.showAlert(this, "Lookup configuration not available");
            return;
        }

        const lookupInput = {};
        let regexQuery = "";

        if (lookupFilterField["displayInfo"]["label"]) {
            let conditionalOperatorValue = lookupFilterField["conditionalOperator"];

            if (typeof lookupFilterField["displayInfo"]["label"] === "string") {
                const conditionalFieldValue = this.appUtilityObject.makeRegexQuery(
                    lookupFilterField["displayInfo"]["label"]
                );
                if (conditionalOperatorValue === "") {
                    regexQuery = "orgname" + ":" + "_*" + conditionalFieldValue;
                } else if (conditionalOperatorValue === "a*") {
                    regexQuery = "orgname" + ":" + "_" + conditionalFieldValue;
                } else if (conditionalOperatorValue === "*z") {
                    regexQuery =
                        "orgname" + ":" + "_*" + conditionalFieldValue.replace("*", "");
                } else if (conditionalOperatorValue === "=") {
                    regexQuery =
                        "orgname" +
                        ":" +
                        "_" +
                        this.listFilterUtils.makeFieldValueBasedOnDataType(
                            conditionalFieldValue.replace("*", ""),
                            conditionalOperatorValue
                        );
                }
            } else if (
                typeof lookupFilterField["displayInfo"]["label"] === "number"
            ) {
                if (
                    conditionalOperatorValue === "" ||
                    conditionalOperatorValue === "="
                ) {
                    regexQuery =
                        "orgname" + ":" + lookupFilterField["displayInfo"]["label"];
                } else if (conditionalOperatorValue === "<>") {
                    regexQuery =
                        "-orgname" + ":" + lookupFilterField["displayInfo"]["label"];
                } else {
                    regexQuery =
                        "orgname" +
                        ":" +
                        this.listFilterUtils.makeFieldValueBasedOnDataType(
                            lookupFilterField["displayInfo"]["label"],
                            conditionalOperatorValue
                        );
                }
            }
        }

        let queryString = "";
        let lookupFieldInfo =
            this.layoutConfiguration["layoutConfiguration"][
            lookupFilterField["displayInfo"]["layoutId"]
            ]["lookupFieldInfo"][lookupFilterField["displayInfo"]["field"]];

        let lookupHierarchyJson = lookupFieldInfo["lookupHierarchyJson"];
        queryString = "type:" + "pfm" + lookupHierarchyJson["objectId"];
        const argumentColumnStr = "";
        if (argumentColumnStr !== "" && regexQuery !== "") {
            lookupHierarchyJson["query"] =
                queryString + argumentColumnStr + " AND " + regexQuery;
        } else if (regexQuery !== "") {
            lookupHierarchyJson["query"] = queryString + " AND " + regexQuery;
        } else if (argumentColumnStr !== "") {
            lookupHierarchyJson["query"] = queryString + argumentColumnStr;
        } else {
            lookupHierarchyJson["query"] = queryString;
        }
        lookupInput["lookupColumnDetails"] = lookupFieldInfo["lookupColumns"];
        lookupInput["objectHierarchy"] = lookupHierarchyJson;
        lookupInput["title"] = lookupFilterField["fieldDisplayName"];
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = {
            serviceObject: null,
            parentPage: this,
            dataSource: appConstant.couchDBStaticName,
            lookupColumnName: fieldKey,
            lookupInput: lookupInput,
            objectName: "Organisation",
        };
        let isStandardObject = lookupInput["objectHierarchy"]["isStandardObject"];

        if (isStandardObject === "Y") {
            dialogConfig.data["serviceObject"] =
                this.dataProvider.getMetaDbServiceProvider(
                    appConstant.couchDBStaticName
                );
        } else {
            dialogConfig.data["serviceObject"] =
                this.dataProvider.getDbServiceProvider(appConstant.couchDBStaticName);
        }
        dialogConfig.panelClass = "custom-dialog-container";
        this.dialog.open(cspfmweblookuppage, dialogConfig);
    }

    applyAction() {
        this.onFilterChange.emit(true);
        this.writeLog(true);
    }

    clearAction() {
        this.writeLog(true);
        this.onFilterChange.emit(false);
    }
    lookupResponse(objectname, selectedValue) {
        if (this.filterSectionDetail["filterFields"][objectname]) {
            this.filterSectionDetail["filterFields"][objectname]["fieldValue"] =
                selectedValue["id"];
            this.filterSectionDetail["filterFields"][objectname]["displayInfo"][
                "searchKey"
            ] = "";
            this.filterSectionDetail["filterFields"][objectname]["displayInfo"][
                "data"
            ] = selectedValue;
            this.filterSectionDetail["filterFields"][objectname]["displayInfo"][
                "label"
            ] =
                selectedValue[
                this.filterSectionDetail["filterFields"][objectname]["displayInfo"][
                "displayField"
                ]
                ];
        }
        const nextInput = this.selectedCurrentEvent.srcElement;
        (nextInput as HTMLElement).focus();
    }
}
