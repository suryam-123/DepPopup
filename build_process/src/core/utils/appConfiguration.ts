import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class appConfiguration {

  public configuration = {
    "appId": "",
    "languageList": [],
    "defaultLanguage": "",
    "defaultMenu": {
      "isMapEnable": false,
      "isCalendarEnable": false,
      "isI18Enable": false
    },
    "layoutLevelDataFetching": "",
    "isGridMenuEnabled": false,
    "nodeGUID": "",
    "isGlobalSearchEnabled": false,
    "associationDbConfigInfo" : {},
    "userAssignmentDbConfigInfo" : {},
    "globalSearchConfigInfo":[],
    "appBuilderTimeZone": "",
  };
}
