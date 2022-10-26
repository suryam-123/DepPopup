import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class appConfiguration {

  public configuration = {
    "appId": 14477,
    "languageList": [{"code":"en","displayName":"English"}],
    "defaultLanguage": {"code":"en","displayName":"English"},
    "defaultMenu": {
      "isMapEnable": false,
      "isCalendarEnable": false,
      "isI18Enable": false
    },
    "layoutLevelDataFetching": "",
    "isGridMenuEnabled": false,
    "nodeGUID": "FUqUKRGhWTyKeGK",
    "isGlobalSearchEnabled": false,
    "associationDbConfigInfo" : {"associationConfigDbName" :"pfm_15_formula"},
    "userAssignmentDbConfigInfo" : {"userAssignmentConfigDbName" :"pfm_15_formula"},
    "globalSearchConfigInfo":[],
    "appBuilderTimeZone": "Asia/Calcutta",
  };
}
