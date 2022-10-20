import { Injectable } from "@angular/core";
import { DatePipe, CurrencyPipe } from '@angular/common';
import { appUtility } from '../utils/appUtility';
import * as lodash from 'lodash';
import { DataFieldTraversal, ObjectRootPath } from '../models/cspfmDataFieldTraversal.type';
import { cspfmLayoutConfiguration } from "../pfmmapping/cspfmLayoutConfiguration";
import { objectTableMapping } from "../pfmmapping/objectTableMapping";
@Injectable({
  providedIn: "root"
})
export class cspfmDataTraversalUtils {
  constructor(private datePipe: DatePipe, private currencyPipe: CurrencyPipe, private appUtilityObject: appUtility,
    private cspfmLayoutConfig: cspfmLayoutConfiguration, public objectMapping: objectTableMapping) {

  }

  public parse(mainData: any, dataFieldTraversal: DataFieldTraversal, fieldKey: string, mode: 'display' | 'value' | 'object') {
    let fieldInfo = dataFieldTraversal['fields'][fieldKey];
    let traversal = dataFieldTraversal['traversalPath'][fieldInfo['traversalPath']];
    let fieldDataObject = this.getDataObject(mainData, traversal);
    if (mode === 'object') {
      return fieldDataObject;
    } else {
      let fieldValue = fieldDataObject[fieldInfo['fieldName']];
      if (mode === 'value') {
        return fieldValue;
      } else {
        if (fieldInfo['fieldType'] === 'CURRENCY' || (fieldInfo["fieldType"] === "ROLLUPSUMMARY" && fieldInfo["rollupType"] === "CURRENCY") || (fieldInfo["fieldType"] === "FORMULA" && fieldInfo["formulaType"] === "CURRENCY")) {
          if (fieldValue) {
            return this.currencyPipe.transform(fieldValue, fieldInfo["displayInfo"]["currency"]['currencyCode'], fieldInfo["displayInfo"]["currency"]['display'], fieldInfo["displayInfo"]["currency"]['digitsInfo'], fieldInfo["displayInfo"]["currency"]['locale']);
          } else {
            return this.currencyPipe.transform(0, fieldInfo["displayInfo"]["currency"]['currencyCode'], fieldInfo["displayInfo"]["currency"]['display'], fieldInfo["displayInfo"]["currency"]['digitsInfo'], fieldInfo["displayInfo"]["currency"]['locale']);
          }
        } else if (fieldInfo['fieldType'] === 'DATE' || (fieldInfo["fieldType"] === "ROLLUPSUMMARY" && fieldInfo["rollupType"] === "DATE") || (fieldInfo["fieldType"] === "FORMULA" && fieldInfo["formulaType"] === "DATE")) {
          if (fieldValue) {
            return this.datePipe.transform(new Date(fieldValue), this.appUtilityObject.userDateFormat, this.appUtilityObject.orgZoneOffsetValue);
          } else {
            return "";
          }
        } else if (fieldInfo['fieldType'] === 'TIMESTAMP' || (fieldInfo["fieldType"] === "ROLLUPSUMMARY" && fieldInfo["rollupType"] === "TIMESTAMP") || (fieldInfo["fieldType"] === "FORMULA" && fieldInfo["formulaType"] === "TIMESTAMP")) {
          if (fieldValue) {
            return this.datePipe.transform(new Date(fieldValue), this.appUtilityObject.userDateTimeFormat, this.appUtilityObject.userZoneOffsetValue);
          } else {
            return "";
          }
        } else if (fieldInfo['fieldType'] === 'NUMBER' || fieldInfo['fieldType'] === 'DECIMAL') {
          if (fieldValue) {
            return fieldValue;
          } else {
            return 0;
          }
        } else if ((fieldInfo["fieldType"] === "ROLLUPSUMMARY" && fieldInfo["rollupType"] === "NUMBER") || (fieldInfo["fieldType"] === "FORMULA" && fieldInfo["formulaType"] === "NUMBER")) {
          if (fieldValue) {
            return Math.round(fieldValue * 1000) / 1000
          } else {
            return 0;
          }
        } else if (fieldInfo["fieldType"] === "BOOLEAN" || (fieldInfo["fieldType"] === "ROLLUPSUMMARY" && fieldInfo["rollupType"] === "BOOLEAN") || (fieldInfo["fieldType"] === "FORMULA" && fieldInfo["formulaType"] === "BOOLEAN")) {
          if (fieldValue) {
            return fieldValue;
          } else {
            return false;
          }
        } else if (fieldInfo["fieldType"] === "MULTISELECT" || fieldInfo["fieldType"] === "CHECKBOX") {
          var displayValue = [];
          if (fieldValue) {
            if (typeof (fieldValue) === 'string') {
              let modifiedValue;
              modifiedValue = fieldValue.split(',');
              for (const element of modifiedValue) {
                displayValue.push(fieldInfo["displayInfo"]["mapper"][element.trim()]);
              }
            } else {
              for (const element of fieldValue) {
                displayValue.push(fieldInfo["displayInfo"]["mapper"][element]);
              }
            }
          }
          if (displayValue.length > 0) {
            return displayValue.join(", ");
          } else {
            return "";
          }
        } else if (fieldInfo["fieldType"] === "RADIO" || fieldInfo["fieldType"] === "DROPDOWN" || fieldInfo["fieldType"] === "STATUSWORKFLOW") {
          if (fieldValue) {
            return fieldInfo["displayInfo"]["mapper"][fieldValue];
          } else {
            return "";
          }
        } else {
          if (fieldValue) {
            return fieldValue;
          } else {
            return "";
          }
        }
      }
    }
  }

  public getDataObject(data, traversal: '' | ObjectRootPath) {
    if (traversal === '') {
      if (data) {
        return data;
      } else {
        return {};
      }
    } else {
      if (traversal['relationship'] === 'ONE_TO_ONE') {
        if (data[traversal['prop']] && Array.isArray(data[traversal['prop']]) && data[traversal['prop']].length > 0) {
          return this.getDataObject(data[traversal['prop']][0], traversal['child'])
        } else {
          return {};
        }
      } else if (traversal['relationship'] === 'LOOKUP' || traversal['relationship'] === 'HEADER') {
        if (data[traversal['prop']] && typeof data[traversal['prop']] == 'object') {
          return this.getDataObject(data[traversal['prop']], traversal['child'])
        } else {
          return {};
        }
      } else if (traversal['relationship'] === 'PRIMARY') {
        if (data) {
          return this.getDataObject(data, traversal['child'])
        } else {
          return {};
        }
      } else {
        return {};
      }
    }

  }

  public traversalParse(data, dataTraversal, traversalPath) {
    const traversal = dataTraversal[traversalPath]
    const dataObject = this.getDataObject(data, traversal)
    return dataObject
  }

  public setLayoutData(mainData: any, primaryTraversalPath: string, traversalPath: string, fieldName: string, data: any, layoutId: string) {
    let objectRoot = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['objectTraversal'][traversalPath];
    let updateData = this.getDataObject(mainData[primaryTraversalPath], objectRoot);
    mainData[traversalPath] = lodash.extend({}, updateData, mainData[traversalPath]);
    if (mainData[traversalPath] && Object.keys(mainData[traversalPath]).length > 0) {
      mainData[traversalPath][fieldName] = data;
    }
    this.updateDataInnerLevel(mainData[primaryTraversalPath], objectRoot, mainData[traversalPath])
  }

  private updateDataInnerLevel(data, traversal: '' | ObjectRootPath, updateData) {
    if (traversal === '') {
      data = updateData;
    } else {
      if (traversal['relationship'] === 'ONE_TO_ONE') {
        if (data[traversal['prop']] && Array.isArray(data[traversal['prop']]) && data[traversal['prop']].length > 0) {
          if (traversal['child'] === '') {
            data[traversal['prop']][0] = updateData;
          } else {
            this.updateDataInnerLevel(data[traversal['prop']][0], traversal['child'], updateData)
          }

        } else {
          data[traversal['prop']].push(updateData);
        }
      } else if (traversal['relationship'] === 'LOOKUP' || traversal['relationship'] === 'HEADER') {
        if (data[traversal['prop']] && typeof data[traversal['prop']] == 'object') {
          if (traversal['child'] === '') {
            data[traversal['prop']] = updateData;
          } else {
            this.updateDataInnerLevel(data[traversal['prop']], traversal['child'], updateData)
          }
        } else {
          data[traversal['prop']] = updateData;
        }
      } else if (traversal['relationship'] === 'PRIMARY') {
        if (data) {
          if (traversal['child'] === '') {
            data = updateData;
          } else {
            this.updateDataInnerLevel(data, traversal['child'], updateData)
          }
        } else {
          data = updateData;
        }
      } else {
        data = updateData;
      }
    }
  }

  public updateLayoutData(dataPaths: Array<{ traversalPath: string; requiredTemp: boolean }>, mainData: any, layoutData: any, layoutId: string, mergeExisting?: boolean) {
    if (layoutId.includes('_preview')) {
      layoutId = layoutId.split('_preview')[0];
    }
    dataPaths.forEach(dataPath => {
      let objectRoot = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['objectTraversal'][dataPath['traversalPath']];
      let result = {};
      if (mergeExisting) {
        result = lodash.extend({}, layoutData[dataPath['traversalPath']], this.getDataObject(JSON.parse(JSON.stringify(mainData)), objectRoot));
      } else {
        result = this.getDataObject(JSON.parse(JSON.stringify(mainData)), objectRoot);
      }

      layoutData[dataPath['traversalPath']] = JSON.parse(JSON.stringify(result))
      if (dataPath['requiredTemp']) {
        layoutData[dataPath['traversalPath'] + '_Temp'] = JSON.parse(JSON.stringify(result))
      }
    })
  }
  public getDestinationFieldValue(mainData: any, traversalPath: string, fieldName: string, layoutId: string) {
    let objectRoot = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['objectTraversal'][traversalPath];
    let result = this.getDataObject(mainData, objectRoot);
    return result[fieldName]
  }
  updateAndGetClonedData(dataCloningInfo, dataPaths, lookupPaths, dataObject: any, pickListValues, primaryTraversalPath: string, layoutId: string) {
    let clonedDataFieldDetails = []
    dataCloningInfo.forEach(element => {
      clonedDataFieldDetails.push(element['destinationFieldInfo']);
      if (element["fieldType"] === "LOOKUP") {
        this.setLayoutData(dataObject, primaryTraversalPath, element['destinationFieldInfo']['destinationFieldPath'], element['destinationFieldInfo']['destinationFieldName'], element['destinationFieldInfo']['destinationFieldValue'], layoutId);
        this.updateLayoutData(lookupPaths[element['destinationFieldInfo']['destinationFieldName']], dataObject[primaryTraversalPath], dataObject, layoutId);
        if ((JSON.stringify(dataObject[element['destinationFieldInfo']['lookUpFieldPath']]) === '{}')) {
          dataObject[primaryTraversalPath][element['destinationFieldInfo']['destinationFieldName']] = null;
        } else {
          dataObject[primaryTraversalPath][element['destinationFieldInfo']['destinationFieldName']] = dataObject[element['destinationFieldInfo']['lookUpFieldPath']];
        }
      } else if (element["fieldType"] === "CHECKBOX") {
        this.setLayoutData(dataObject, primaryTraversalPath, element['destinationFieldInfo']['destinationFieldPath'], element['destinationFieldInfo']['destinationFieldName'], element['destinationFieldInfo']['destinationFieldValue'], layoutId);
        this.updateLayoutData(dataPaths, dataObject[primaryTraversalPath], dataObject, layoutId);
        this.appUtilityObject.loadCheckboxEditValues(element['destinationFieldInfo']['destinationFieldName'], pickListValues[this.objectMapping.mappingDetail[element['destinationFieldInfo']['destinationObjectName']]][element['destinationFieldInfo']['destinationFieldName']], dataObject, element['destinationFieldInfo']['destinationFieldPath']);
      } else {
        this.setLayoutData(dataObject, primaryTraversalPath, element['destinationFieldInfo']['destinationFieldPath'], element['destinationFieldInfo']['destinationFieldName'], element['destinationFieldInfo']['destinationFieldValue'], layoutId);
        this.updateLayoutData(dataPaths, dataObject[primaryTraversalPath], dataObject, layoutId);
      }
    })
    return clonedDataFieldDetails
  }
  setDestinationFieldValue(actionInfo: object, data: object, layoutId: string, classContext: object, objectTraversalPath?: string) {
    if (classContext["isPopUpEnabled"]) {
      classContext["dialogRef"].close();
    }
    actionInfo['dataCloningInfo'].forEach(element => {
      if (element['inputType'] === 'FIELD') {
        if (objectTraversalPath !== undefined && element['sourceFieldInfo']['sourceFieldPath'] === objectTraversalPath) {
          element['destinationFieldInfo']['destinationFieldValue'] =
            this.getDestinationFieldValue(
              classContext["dataObject"][objectTraversalPath],
              element['sourceFieldInfo']['sourceFieldPath'], element['sourceFieldInfo']['sourceFieldName'], layoutId)
        }else {
          element['destinationFieldInfo']['destinationFieldValue'] =
            this.getDestinationFieldValue(
              data, element['sourceFieldInfo']['sourceFieldPath'], element['sourceFieldInfo']['sourceFieldName'], layoutId)
        }

      }
    });
    let dialogConfig = (objectTraversalPath === "" || objectTraversalPath === undefined) ? this.appUtilityObject.decidePopUpOrNavigationForDataClone(actionInfo) : this.appUtilityObject.decidePopUpOrNavigationForDataClone(actionInfo, classContext["dataObject"][objectTraversalPath]);
    if (actionInfo['navigationInfo']['enablePopUp']) {
      classContext["dialogOpenComponentForDataClone"](actionInfo['navigationInfo']['navigationUrl'], dialogConfig);
    }
  }
  public seperateRelatioshipObjectsFromPrimaryDataSet(mainData: any, conditionalValidationJSON, layoutId: string, objectId?) {
    if (conditionalValidationJSON['layoutType'] === "HeaderLineList") {
      let dataPaths = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['sectionObjectTraversal'][objectId]['objectTraversal'];
      Object.keys(dataPaths).forEach(dataPath => {
        let objectRoot = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['sectionObjectTraversal'][objectId]['objectTraversal'][dataPath];
        let result = {};
        result = this.getDataObject(JSON.parse(JSON.stringify(mainData)), objectRoot);
        conditionalValidationJSON.dataObject[dataPath] = JSON.parse(JSON.stringify(result))
      })
    } else if (conditionalValidationJSON['layoutType'] === "MultiLineEntry") {
      let dataPaths = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['sectionObjectTraversal'][objectId]['objectTraversal'];
      console.log("datapaths", dataPaths)
      Object.keys(dataPaths).forEach(dataPath => {
        let objectRoot = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['sectionObjectTraversal'][objectId]['objectTraversal'][dataPath];
        let result = {};
        result = this.getDataObject(JSON.parse(JSON.stringify(mainData)), objectRoot);
        console.log(result)
        conditionalValidationJSON.dataObject[dataPath] = JSON.parse(JSON.stringify(result))
      })
    }
    else {
      let dataPaths = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['objectTraversal'];
      Object.keys(dataPaths).forEach(dataPath => {
        let objectRoot = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['objectTraversal'][dataPath];
        let result = {};
        result = this.getDataObject(JSON.parse(JSON.stringify(mainData)), objectRoot);
        conditionalValidationJSON.dataObject[dataPath] = JSON.parse(JSON.stringify(result))
      })
    }
  }
  public setSlickGridData(mainData: any, traversalPath: string, fieldName: string, data: any, layoutId: string) {
    let objectRoot = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['objectTraversal'][traversalPath];
    let updateData = this.getDataObject(mainData, objectRoot);
    console.log("updateData", updateData);
    console.log("mainData", mainData);
    if (updateData) {
      updateData[fieldName] = data;
    }
  }

  public getRelationshipObjectsFromPrimaryDataSet(mainData: any, layoutId: string, objectId) {
    let dataPaths = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['sectionObjectTraversal'][objectId]['objectTraversal'];
    console.log("datapaths", dataPaths)
    let resultObject = {}
    Object.keys(dataPaths).forEach(dataPath => {
      let objectRoot = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['sectionObjectTraversal'][objectId]['objectTraversal'][dataPath];
      resultObject[dataPath] = this.getDataObject(JSON.parse(JSON.stringify(mainData)), objectRoot);
      console.log("resultObject inner ==> ", resultObject)
    })
    console.log("resultObject ==> ", resultObject);
    return JSON.parse(JSON.stringify(resultObject))
  }
}