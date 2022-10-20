import { Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { appUtility } from "../utils/appUtility";
import { cspfmObjectConfiguration } from "./cspfmObjectConfiguration";

@Injectable({
  providedIn: "root"
})
export class cspfmLayoutConfiguration {
  
  constructor(public appUtilityObj: appUtility, public pfmObjectConfig: cspfmObjectConfiguration) {}
  public layoutConfiguration = {};
  public conditionalValidationJsonSet = {};
}