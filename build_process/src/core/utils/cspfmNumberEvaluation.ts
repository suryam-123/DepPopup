import * as math from 'mathjs'
import * as lodash from 'lodash';
import { Injectable } from "@angular/core";
import { appConstant } from './appConstant';

@Injectable({
    providedIn: "root"
})

export class cspfmNumberEvaluation{

    precisionValue = 0
    formulaResult = 0
    public nullAsZero;

    formulaCalculation(formulaConfig, dataObject,precision) {
        this.precisionValue = precision
        const formulaArray = []
        const formulaValueJson = {}
        this.nullAsZero = formulaConfig['isReturnBlankEnable']
        let res = this.formulaOperandCalculation(formulaConfig, dataObject, formulaArray, formulaValueJson);
        return this.formulaResultCalculation(res)
      }
    
      formulaOperandCalculation(formulaConfigObject, dataObject, formulaArray, formulaValueJson) {
        const formulaExpression = formulaConfigObject["formula"]
        console.log("formulaExpression => ", formulaExpression);
        const fieldArray = []
        const formulaObject = {
          "fieldName": formulaConfigObject["fieldName"],
          "formula": formulaConfigObject["formula"],
          "objectId": formulaConfigObject["objectId"],
          "fields": fieldArray
        }
        const operands = formulaConfigObject["operands"]
        console.log("formulaOperandCalculation => ", operands);
    
        /* Get ObjectID and FieldName from Operands, add this ObjectID_FieldName in Formula Object */
        const fieldNames = lodash.map(operands, 'fieldName');
        const objectIds = lodash.map(operands, 'objectId');
        for (let i = 0; i < fieldNames.length; i++) {
          const fields = formulaObject["fields"]
          const fieldName = fieldNames[i]
          const objectId = objectIds[i]
          let objectWithFieldName = ""
          if (isNaN(objectId)) {// ObjectId is not a number
            objectWithFieldName = objectId + "_" + fieldName
          } else {
            objectWithFieldName = "pfm" + objectId + "_" + fieldName
          }
          const fieldArrayValue = lodash.concat(fields, objectWithFieldName);
          formulaObject["fields"] = fieldArrayValue
        }
        formulaArray.push(formulaObject)
    
        operands.forEach(formulaOperand => {
          const fieldName = formulaOperand["fieldName"]
          const objectType = formulaOperand["objectType"]
          const fieldId = formulaOperand["fieldId"]
          const objectId = formulaOperand["objectId"]
          let objectIdValue = ""
          if (isNaN(objectId)) {// ObjectId is not a number
            objectIdValue = objectId
          } else {
            objectIdValue = "pfm" + objectId
          }
          const objectkey = objectIdValue + "_" + fieldName
          if (formulaOperand["fieldType"] === "formula") {
            const formulaInnerObject = formulaOperand
            this.formulaOperandCalculation(formulaInnerObject, dataObject, formulaArray, formulaValueJson)
          } else if (formulaOperand["fieldType"] === "rollupsummary") {
            const selectedObject = dataObject[objectIdValue]
            if (selectedObject !== undefined && selectedObject !== null) {
              const selectedValue = selectedObject[fieldName + appConstant.customFieldSuffix.rollup_summary]
              formulaValueJson[objectkey] = selectedValue
            }
          } else {
            if (objectType === "LOOKUP") {
              const objectId_FieldId = objectIdValue + '_' + fieldId
              const selectedObject = dataObject[objectId_FieldId]
              if (selectedObject !== undefined && selectedObject !== null) {
                const selectedValue = selectedObject[fieldName]
                formulaValueJson[objectkey] = selectedValue
              }
            } else {
              const selectedObject = dataObject[objectIdValue]
              if (selectedObject !== undefined && selectedObject !== null) {
                const selectedValue = selectedObject[fieldName]
                formulaValueJson[objectkey] = selectedValue
              }
            }
          }
        })
        console.log("formulaValueJson = ", formulaValueJson);
        console.log("formula Array = ", formulaArray);
        const result = {
          "formulaValueJson": formulaValueJson,
          "formulaArray": formulaArray
        }
        return result;
      }
    
      formulaResultCalculation(response) {
        const formulaValueJson = response["formulaValueJson"]
        const formulaArray = response["formulaArray"]
        for (let i = formulaArray.length - 1; i >= 0; i--) {
          const formulaObject = formulaArray[i]
          let isNullAvailable = false;
          
          // Check Null value is available in Formula Value Json
          if (this.nullAsZero === 'Y') {
            Object.keys(formulaValueJson).forEach(key => {
                if(formulaValueJson[key] === null) {
                    formulaValueJson[key] = 0;
                }
            })
          } else {
              isNullAvailable = lodash.values(formulaValueJson).some(nullValue => nullValue === null || nullValue === undefined || nullValue === "");
          }
          if (isNullAvailable) {
            // Get nul values from Formula Value Json
            const nullValues = lodash.pickBy(formulaValueJson, lodash.isNull);
            const undefinedValue = Object.assign(nullValues, lodash.pickBy(formulaValueJson, lodash.isUndefined));
            const emptyValues = Object.assign(undefinedValue, lodash.pickBy(formulaValueJson, lodash.isUndefined));
            const nullValueKeys = lodash.keysIn(emptyValues);
            const fields = formulaObject["fields"]
    
            // Compare null values with formula involved fields
            const resultValue = lodash.filter(fields, function (fieldObject) {
              return lodash.some(nullValueKeys, function (nullValueObject) {
                return nullValueObject === fieldObject;
              });
            });
    
            if (resultValue.length > 0) {
              // this.showErrorValue = true;
              // this.errorMessage = "Please enter ";
              // resultValue.forEach(element => {
              //   const splitValue = lodash.split(element, '_');
              //   const fieldNameValue = splitValue[1]
              //   this.errorMessage = this.errorMessage + fieldNameValue + ','
              //   const fieldName = formulaObject["fieldName"]
              //   const objectId = formulaObject["objectId"]
              //   let objectWithFieldName = ""
              //   if (isNaN(objectId)) {// ObjectId is not a number
              //     objectWithFieldName = objectId + "_" + fieldName
              //   } else {
              //     objectWithFieldName = "pfm" + objectId + "_" + fieldName
              //   }
              //   formulaValueJson[objectWithFieldName] = null
              // });
              // this.errorMessage = this.errorMessage.slice(0, -1);
              this.formulaResult = 0
            } else {
              this.formulaExpressionEvalution(formulaObject, formulaValueJson)
            }
          } else {
             this.formulaExpressionEvalution(formulaObject, formulaValueJson)
          }
        }
        return this.formulaResult
      }
    
      formulaExpressionEvalution(formulaObject, formulaValueJson) {
        // this.showErrorValue = false;
        // this.errorMessage = ""
        try {
          const expr = formulaObject["formula"]
          const result = math.evaluate(expr, formulaValueJson)
          const fieldName = formulaObject["fieldName"]
          const objectId = formulaObject["objectId"]
          let objectWithFieldName = ""
          if (isNaN(objectId)) {// ObjectId is not a number
            objectWithFieldName = objectId + "_" + fieldName
          } else {
            objectWithFieldName = "pfm" + objectId + "_" + fieldName
          }
          formulaValueJson[objectWithFieldName] = result
          this.formulaResult = result.toFixed(this.precisionValue)
          return this.formulaResult
        } catch (err) {
          console.log(err.message);
          this.formulaResult = 0
          return this.formulaResult
          // this.showErrorValue = true
        }
      }
}