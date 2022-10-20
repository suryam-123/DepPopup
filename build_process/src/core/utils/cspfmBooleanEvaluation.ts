import { Injectable } from "@angular/core";
import { cspfmNumberEvaluation } from 'src/core/utils/cspfmNumberEvaluation';
import { lookupFieldMapping } from '../pfmmapping/lookupFieldMapping';

@Injectable({
    providedIn: "root"
}) 

export class cspfmBooleanEvaluation{

    constructor(public lookupFieldMappingObj: lookupFieldMapping){
      console.log("cspfmBooleanEvaluation called")
    }
    booleanEvaluateFunction(configObject, formulaObject) {
        let result = this.evaluateExpression(configObject, formulaObject)
        console.log("this.booleanFormulaResult", result)
        return result;
      }
    
      evaluateConditionalBlocks(conditionalBlocks, formulaObject) {
        let finalResult;
        conditionalBlocks.some(conditionalBlock => {
          if (conditionalBlock['conditionalStatement'] !== "") {
            let result = this.evaluateExpression(conditionalBlock['conditionalStatement'], formulaObject)
            if (result === true) {
              finalResult = this.evaluateExpression(conditionalBlock['executionStatement'], formulaObject)
              console.log("Final result :", finalResult)
              return true;
            } else {
              return false;
            }
          } else {
            finalResult = this.evaluateExpression(conditionalBlock['executionStatement'], formulaObject)
            return true;
          }
        });
        return finalResult;
      }
    
      evaluateExpression(operand, formulaObject) {
        if (operand['isOperandsAvailable']) {
          return this.evaluateIfOperandAvailable(operand, formulaObject)
        } else {
          return this.evaluateIfOperandNotAvailable(operand, formulaObject)
        }
      }
    
      evaluateIfOperandNotAvailable(operand, formulaObject) {
        console.log("evaluateIfOperandNotAvailable : ", JSON.stringify(operand))
        if (operand['valueType'] === 'dynamic') {
          let objectId = ""
          if (operand['objectType'] === 'LOOKUP') {
            objectId = "pfm" + operand['objectId'] + "_" + operand['fieldId']
          } else {
            objectId = "pfm" + operand['objectId']
          }
    
          if (!this.isValid(formulaObject[objectId])) {
            return null;
          }
          if (operand['fieldType'] === 'FORMULA') {
            if (operand['formulaFieldType'] === 'NUMBER') {
              let result = cspfmNumberEvaluation.prototype.formulaOperandCalculation(operand['configuration'], formulaObject, [], {})
              return cspfmNumberEvaluation.prototype.formulaResultCalculation(result);
            } else {
              return this.evaluateExpression(operand['configuration'], formulaObject)
            }
          } else {
            return formulaObject[objectId][operand['fieldName']]
          }
        } else if (operand['valueType'] === 'constant') {
          return operand['constantValue']
        } else if (operand['valueType'] === 'jsfunction') {
          return this.evaluateJSFunctionAction(operand, formulaObject)
        } else if (operand['valueType'] === 'date') {
          return this.getDateFunctionValue(operand, formulaObject)
        } else if (operand['valueType'] === 'arithmeticexp') {
          let result = cspfmNumberEvaluation.prototype.formulaOperandCalculation(operand['configuration'], formulaObject, [], {})
          return cspfmNumberEvaluation.prototype.formulaResultCalculation(result);
        }
      }
    
      evaluateIfOperandAvailable(operand, formulaObject) {
        console.log("evaluateIfOperandAvailable : ", JSON.stringify(operand))
        if (operand['actionType'] === 'condition') {
          return this.evaluateConditionalBlocks(operand['conditionalBlocks'], formulaObject)
        } else if (operand['actionType'] === 'operator') {
          return this.evaluateOpertorAction(operand['operator'], operand['operands'], formulaObject)
        } else {
          return this.evaluateExpression(operand, formulaObject)
        }
      }
    
      evaluateOpertorAction(operator, operands, formulaObject) {
        console.log("evaluateOpertorAction : ", operator + "---" + JSON.stringify(operands))
        let eachOperandResultArray = []
        operands.forEach(operand => {
          eachOperandResultArray.push(this.evaluateExpression(operand, formulaObject))
        });
        return this.evaluateByOperands(operator, eachOperandResultArray);
      }
    
      getDateFunctionValue(operand, formulaObject) {
        if (operand['function'] === 'TODAY') {
          if (operand['returnValue'] === 'YEAR') {
            console.log("today year:", new Date().getFullYear())
            return new Date().getFullYear();
          } else if (operand['returnValue'] === 'MONTH') {
            return new Date().getMonth();
          } else if (operand['returnValue'] === 'DAY') {
            return new Date().getDay();
          } else if (operand['returnValue'] === 'HOUR') {
            return new Date().getHours();
          } else if (operand['returnValue'] === 'MINUTE') {
            return new Date().getMinutes();
          } else if (operand['returnValue'] === 'SECOND') {
            return new Date().getSeconds();
          } else {
            return new Date().getTime();
          }
        } else if (operand['function'] === 'DATEDIFF') {
          let objectIdOne = ""
          let objectIdTwo = ""
          if (operand['dateParams']['param1']['objectType'] === 'LOOKUP') {
            objectIdOne = "pfm" + operand['dateParams']['param1']['objectId'] + "_" + operand['fieldId']
          } else {
            objectIdOne = "pfm" + operand['dateParams']['param1']['objectId']
          }
    
          if (operand['dateParams']['param2']['objectType'] === 'LOOKUP') {
            objectIdTwo = "pfm" + operand['dateParams']['param2']['objectId'] + "_" + operand['fieldId']
          } else {
            objectIdTwo = "pfm" + operand['dateParams']['param2']['objectId']
          }
          let dateObjectOne = formulaObject[operand['dateParams']['param1'][objectIdOne]];
          let dateObjectTwo = formulaObject[operand['dateParams']['param2'][objectIdTwo]];
          if (!this.isValid(dateObjectOne) || !this.isValid(dateObjectTwo)) {
            return null;
          }
          let dateOperandOne = new Date(dateObjectOne[operand['dateParams']['param1']['fieldName']]);
          let dateOperandTwo = new Date(dateObjectTwo[operand['dateParams']['param2']['fieldName']]);
          if (!this.isValid(dateOperandOne) || !this.isValid(dateOperandTwo)){
            return null;
          }
          if (operand['returnValue'] === 'YEAR') {
            var diffYear = (dateOperandTwo.getTime() - dateOperandOne.getTime()) / 1000;
            diffYear /= (60 * 60 * 24);
            console.log("datediff year : ", Math.abs(Math.round(diffYear / 365.25)))
            return Math.abs(Math.round(diffYear / 365.25));
          } else if (operand['returnValue'] === 'MONTH') {
            console.log("datediff month : ", Math.abs(dateOperandTwo.getMonth() - dateOperandOne.getMonth() +
              (12 * (dateOperandTwo.getFullYear() - dateOperandOne.getFullYear()))))
            return Math.abs(dateOperandTwo.getMonth() - dateOperandOne.getMonth() +
              (12 * (dateOperandTwo.getFullYear() - dateOperandOne.getFullYear())))
          } else if (operand['returnValue'] === 'DAY') {
            var diffTime = (dateOperandTwo.getTime() - dateOperandOne.getTime());
            var daysDiff = diffTime / (1000 * 3600 * 24);
            console.log("datediff day : ", daysDiff)
            return daysDiff;
          } else if (operand['returnValue'] === 'HOUR') {
            var diffHour = (dateOperandTwo.getTime() - dateOperandOne.getTime()) / 1000;
            diffHour /= (60 * 60);
            console.log("datediff hour : ", Math.abs(Math.round(diffHour)))
            return Math.abs(Math.round(diffHour));
          } else if (operand['returnValue'] === 'MINUTE') {
            var diffMinute = (dateOperandTwo.getTime() - dateOperandOne.getTime());
            console.log("datediff minute : ", Math.round((diffMinute / (1000 * 60))))
            return Math.round((diffMinute / (1000 * 60)));
          } else if (operand['returnValue'] === 'SECOND') {
            console.log("datediff second : ", Math.abs(dateOperandTwo.getTime() - dateOperandOne.getTime()) / 1000)
            return Math.abs(dateOperandTwo.getTime() - dateOperandOne.getTime()) / 1000;
          }
        } else if (operand['fieldName']) {
          let objectId = ""
          if (operand['objectType'] === 'LOOKUP') {
            objectId = "pfm" + operand['objectId'] + "_" + operand['fieldId']
          } else {
            objectId = "pfm" + operand['objectId']
          }
          let dataObject = formulaObject[operand[objectId]]
          if (!this.isValid(dataObject)) {
            return null;
          }
          let fieldValue = dataObject[operand['fieldName']]
          if (!this.isValid(fieldValue)) {
            return null;
          }
          if (operand['returnValue'] === 'YEAR') {
            console.log("field data year:", new Date(fieldValue).getFullYear())
            return new Date(fieldValue).getFullYear();
          } else if (operand['returnValue'] === 'MONTH') {
            return new Date(fieldValue).getMonth() + 1;
          } else if (operand['returnValue'] === 'DAY') {
            return new Date(fieldValue).getDay();
          } else if (operand['returnValue'] === 'HOUR') {
            return new Date(fieldValue).getHours();
          } else if (operand['returnValue'] === 'MINUTE') {
            return new Date(fieldValue).getMinutes();
          } else if (operand['returnValue'] === 'SECOND') {
            return new Date(fieldValue).getMinutes();
          } else {
            return new Date(fieldValue).getTime();
          }
        }
      }
    
    
      evaluateByOperands(operator, operands) {
        console.log("evaluateByOperands : ", operator + "---" + JSON.stringify(operands))
        if (operator === '+') {
          return operands[0] + operands[1];
        } else if (operator === '-') {
          return operands[0] - operands[1];
        } else if (operator === '*') {
          return operands[0] * operands[1];
        } else if (operator === '/') {
          return operands[0] / operands[1];
        } else if (operator === '^') {
          return operands[0] ^ operands[1];
        } else if (operator === '==') {
          return operands[0] === operands[1];
        } else if (operator === '!=') {
          return operands[0] !== operands[1];
        } else if (operator === '>') {
          return operands[0] > operands[1];
        } else if (operator === '<') {
          return operands[0] < operands[1];
        } else if (operator === '>=') {
          return operands[0] >= operands[1];
        } else if (operator === '<=') {
          return operands[0] <= operands[1];
        } else if (operator === '&&') {
          let andArray;
          operands.forEach(operand => {
            if (andArray === undefined) {
              andArray = `${operand}`
            } else {
              andArray = `${andArray} && ${operand}`
            }
          });
          return (new Function('return ' + andArray))();
        } else if (operator === '||') {
          let orArray;
          operands.forEach(operand => {
            if (orArray === undefined) {
              orArray = `${operand}`
            } else {
              orArray = `${orArray} || ${operand}`
            }
          });
          return (new Function('return ' + orArray))();
        } else if (operator === '!') {
          return !operands[0]
        }
      }
    
      evaluateJSFunctionAction(operand, formulaObject) {
        console.log("evaluateJSFunctionAction : ", JSON.stringify(operand))
        let functionName = operand['function'];
        let sourceValueObject = operand['sourceValue'];
        let params = operand['params'];
        let objectId = ""
        let sourceValue;
        if(sourceValueObject){
      
          if (!this.isValid(sourceValue) && (functionName === 'INCLUDES' || functionName === 'BEGINS' || functionName === 'ENDS')){
            return false;
          }           
          if (sourceValueObject['conversionFunction'].length > 0) {
            sourceValueObject['conversionFunction'].forEach(element => {
              if (element['function'] === 'LOWERCASE')
                sourceValue = sourceValue.toLowerCase()
              else if (element['function'] === 'UPPERCASE') {
                sourceValue = sourceValue.toUpperCase()
              } else if (element['function'] === 'TRIM') {
                sourceValue = sourceValue.trim()
              }
            });
          }
      
          if (functionName === 'INCLUDES') {
            if (params[0]['valueType'] === 'constant') {
              return sourceValue.includes(params[0]['constantValue'])
            } else {
              return sourceValue.includes(formulaObject[params[0]['objectId']][params[0]['fieldName']])
            }
          } else if (functionName === 'BEGINS') {
            if (params[0]['valueType'] === 'constant') {
              return sourceValue.startsWith(params[0]['constantValue'])
            } else {
              return sourceValue.startsWith(formulaObject[params[0]['objectId']][params[0]['fieldName']])
            }
          } else if (functionName === 'ENDS') {
            if (params[0]['valueType'] === 'constant') {
              return sourceValue.endsWith(params[0]['constantValue'])
            } else {
              return sourceValue.endsWith(formulaObject[params[0]['objectId']][params[0]['fieldName']])
            }
          }
        } else {
          if (params[0]['objectType'] === 'LOOKUP') {
            objectId = "pfm" + params[0]['objectId'] + "_" + params[0]['fieldId']
          } else {
            if(params[0]['fieldType'] === 'LOOKUP'){
              let inst = new lookupFieldMapping();
              let lookupMappingInfo = inst.mappingDetail["pfm" + params[0]['objectId']]
              let mappingKeys = Object.keys(lookupMappingInfo);
              for (let i = 0; i < mappingKeys.length; i++) {
                if (params[0]['fieldName'] === mappingKeys[i]) {
                  params[0]['fieldName'] = lookupMappingInfo[mappingKeys[i]]
                }
              }
            }
            objectId = "pfm" + params[0]['objectId']
          }
          
          if (params[0]['valueType']) {
            if (!this.isValid(formulaObject[objectId]))
              return false;
            sourceValue = formulaObject[objectId][params[0]['fieldName']];
          } else {
            sourceValue = params[0]['constantValue']
          }

          if (functionName === 'ISNUMBER') {
            return isNaN(sourceValue)
          } else if (functionName === 'ISNULL') {
            return sourceValue === null || sourceValue === "" 
          }
        }
      }
    
      isValid(value) {
        if (value !== null && value !== undefined)
          return true;
        return false;
      }
}