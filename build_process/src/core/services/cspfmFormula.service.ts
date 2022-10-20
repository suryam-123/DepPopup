import { Injectable } from '@angular/core';
import { create, all } from 'mathjs'
import { FormulaConfig, FieldType } from '../models/cspfmFormulaConfig.type';
import * as moment from 'moment';
import { appUtility } from '../utils/appUtility';
import { appConstant } from '../utils/appConstant';
import { appConfiguration } from '../utils/appConfiguration';
@Injectable({
  providedIn: 'root'
})
export class cspfmFormulaService {

  private math = create(all, {});

  constructor(private appUtilityObject: appUtility, private appConfiguration : appConfiguration) {
    this.overrideMathFunctions();

    this.math.import({ 'today': this.today }, {})
    this.math.import({ 'now': this.now }, {})
    this.math.import({ 'day': this.day }, {})
    this.math.import({ 'month': this.month }, {})
    this.math.import({ 'year': this.year }, {})
    this.math.import({ 'hour': this.hour }, {})
    this.math.import({ 'minute': this.minute }, {})
    this.math.import({ 'second': this.second }, {})
    this.math.import({ 'millisecond': this.millisecond }, {})
    this.math.import({ 'weekday': this.weekday }, {})
    this.math.import({ 'datediff': this.datediff }, {})
    this.math.import({ 'avg': this.average }, {})
    this.math.import({ 'join': this.join }, {})
    this.math.import({ 'concatenate': this.concatenate }, {})
    this.math.import({ 'includes': this.includes }, {})
    this.math.import({ 'lowerCase': this.lowerCase }, {})
    this.math.import({ 'upperCase': this.upperCase }, {})
    this.math.import({ 'replace': this.replace }, {})
    this.math.import({ 'trim': this.trim }, {})
    this.math.import({ 'charAt': this.charAt }, {})
    this.math.import({ 'IsNull': this.isNull }, {})
    this.math.import({ 'startsWith': this.startsWith }, {})
    this.math.import({ 'endsWith': this.endsWith }, {})
    this.math.import({ 'ifCondition': this.ifCondition }, {})
    this.math.import({ 'nullString': this.stringConvert }, {})
    this.math.import({ 'nullNumber': this.numberConvert }, {})
    this.math.import({ 'addDate': this.addDate }, {})
    this.math.import({ 'subDate': this.subDate }, {})
    this.math.import({ 'addDatetime': this.addDatetime }, {})
    this.math.import({ 'subDatetime': this.subDatetime }, {})
    this.math.import({ 'dateOnly': this.dateOnly }, {})
    this.math.import({ 'constant': this.constant }, {})
    this.math.import({ 'length': this.length }, {})
    this.math.import({ 'left': this.left }, {})
    this.math.import({ 'right': this.right }, {})
    this.math.import({ 'arrayIncludes': this.arrayIncludes }, {})
  }

  public evaluateExpression(expression: string, data: any) {
    return this.math.evaluate(expression, data)
  }

  public evaluate(formulaConfig: FormulaConfig, data: any, isFormula?) {
    try {
      let processData = JSON.parse(JSON.stringify(data));
      //For formula conversion and calculation, it occurs based on utc. Slight changes in builder code and appM code.
      processData['config'] = {
        "dateFormat": formulaConfig['configuredDateFormat'] ? formulaConfig['configuredDateFormat'] : undefined,
        "appBuilderServerZone": this.appConfiguration.configuration.appBuilderTimeZone,
        "classContext" : this.appUtilityObject
      }
      if(isFormula) {
        processData['config']['isFormula'] = true;
      }
      if (formulaConfig.isReturnBlankEnable === 'N') {
        let isNullExists = false;
        formulaConfig.involvedFields.forEach(involvedField => {
          let key = '';
          let associateData = "";
          key = involvedField['traversalPath']
          if (processData[key] === undefined || processData[key] === null) {
            processData[key] = {}
          }
          if (involvedField.fieldType === 'ROLLUPSUMMARY') {
            processData[key][involvedField.fieldName] = processData[key][involvedField.fieldName + appConstant.customFieldSuffix.rollup_summary];
          }
          if (involvedField.fieldType === 'RECORDASSOCIATION' && processData[key]) {
            if (!processData[key][involvedField.associationFieldName] || processData[key][involvedField.associationFieldName].length === 0) {
              processData[key][involvedField.associationFieldName] = [{}]
              processData[key][involvedField.associationFieldName][0][involvedField.fieldName] = null
            } else {
              if(involvedField.fieldName.indexOf('.') > 0) {
                associateData = this.complexFieldSplit(involvedField.fieldName,processData[key][involvedField.associationFieldName][0]);
                if(associateData  === "" || associateData === undefined) {
                  processData[key][involvedField.associationFieldName][0][involvedField.fieldName] = null
                }
              } else {
                if (processData[key][involvedField.associationFieldName][0][involvedField.fieldName] === "" || processData[key][involvedField.associationFieldName][0][involvedField.fieldName] === undefined) {
                  processData[key][involvedField.associationFieldName][0][involvedField.fieldName] = null
                }
              }
            }
          } else if (processData[key] && (processData[key][involvedField.fieldName] === "" || processData[key][involvedField.fieldName] === undefined)) {
            processData[key][involvedField.fieldName] = null
          }
          if ((involvedField.fieldType === 'DATE' || (involvedField.fieldType === 'FORMULA' && involvedField.formulaType === 'DATE') || (involvedField.fieldType === 'ROLLUPSUMMARY' && involvedField.rollupType === 'DATE')) && processData[key][involvedField.fieldName]) {
            if (typeof processData[key][involvedField.fieldName] === 'string') {
              processData[key][involvedField.fieldName] =this.appUtilityObject.getUtcMillisecondsFromDateString(processData[key][involvedField.fieldName],false);
            }
          } else if ((involvedField.fieldType === 'TIMESTAMP' || (involvedField.fieldType === 'FORMULA' && involvedField.formulaType === 'TIMESTAMP') || (involvedField.fieldType === 'ROLLUPSUMMARY' && involvedField.rollupType === 'TIMESTAMP')) && processData[key][involvedField.fieldName]) {
            if (typeof processData[key][involvedField.fieldName] === 'string') {
              processData[key][involvedField.fieldName] = this.appUtilityObject.getUtcTimeZoneMillsecondsFromDateTimeString(processData[key][involvedField.fieldName],'user')
            }
          } else if (involvedField.fieldType === 'LOOKUP' && processData[key][involvedField.fieldName]) {
            if (typeof processData[key][involvedField.fieldName] === 'object') {
              processData[key][involvedField.fieldName] = processData[key][involvedField.fieldName]['id']
            }
          } else if (involvedField.fieldType === 'RECORDASSOCIATION' && processData[key][involvedField.associationFieldName]
            && processData[key][involvedField.associationFieldName].length > 0) {
            let splittedFieldName = involvedField.associationFieldName.split("-")
            processData[key][splittedFieldName[0] + '_' + splittedFieldName[1]] = processData[key][involvedField.associationFieldName]
          }
          if (involvedField.fieldType === 'RECORDASSOCIATION') {
            if (processData[key][involvedField.associationFieldName] && processData[key][involvedField.associationFieldName].length > 0) {
              if(involvedField.fieldName.indexOf('.') > 0) {
                if(associateData  === "" || associateData === undefined) {
                  isNullExists = true;
                }
              } else {
                  if(processData[key][involvedField.associationFieldName][0][involvedField.fieldName] === null
                    || processData[key][involvedField.associationFieldName][0][involvedField.fieldName] === undefined) {
                  isNullExists = true;
                }
              }
            }
          } else if (processData[key] === undefined || processData[key][involvedField.fieldName] === null || processData[key][involvedField.fieldName] === undefined) {
            isNullExists = true;
          }
        })
        if (isNullExists) {
          return null;
        }
      } else {
        formulaConfig.involvedFields.forEach(involvedField => {
          let key = '';
          let associateData = '';
          key = involvedField['traversalPath']
          if (processData[key] === undefined || processData[key] === null) {
            processData[key] = {}
          }
          if (involvedField.fieldType === 'ROLLUPSUMMARY') {
            processData[key][involvedField.fieldName] = processData[key][involvedField.fieldName + appConstant.customFieldSuffix.rollup_summary];
          }
          if (involvedField.fieldType === 'RECORDASSOCIATION' && processData[key]) {
            if (!processData[key][involvedField.associationFieldName] || processData[key][involvedField.associationFieldName].length === 0) {
              processData[key][involvedField.associationFieldName] = [{}]
              if(involvedField.fieldName.indexOf('.') > 0) {
                this.dataJSON(involvedField.fieldName ,processData[key][involvedField.associationFieldName][0])
              } else {
                processData[key][involvedField.associationFieldName][0][involvedField.fieldName] = null
              }
            } else {
              if(involvedField.fieldName.indexOf('.') > 0) {
                associateData = this.complexFieldSplit(involvedField.fieldName,processData[key][involvedField.associationFieldName][0]);
                if(associateData  === "" || associateData === undefined) {
                  this.dataJSON(involvedField.fieldName ,processData[key][involvedField.associationFieldName][0])
                }
              } else {
                if (processData[key][involvedField.associationFieldName][0][involvedField.fieldName] === "" || processData[key][involvedField.associationFieldName][0][involvedField.fieldName] === undefined) {
                  processData[key][involvedField.associationFieldName][0][involvedField.fieldName] = null
                }
              }
            }
          } else if (processData[key] && (processData[key][involvedField.fieldName] === "" || processData[key][involvedField.fieldName] === undefined)) {
            processData[key][involvedField.fieldName] = null
          }
          if ((involvedField.fieldType === 'DATE' || (involvedField.fieldType === 'FORMULA' && involvedField.formulaType === 'DATE') || (involvedField.fieldType === 'ROLLUPSUMMARY' && involvedField.rollupType === 'DATE')) && processData[key][involvedField.fieldName]) {
            if (typeof processData[key][involvedField.fieldName] === 'string') {
              processData[key][involvedField.fieldName] = this.appUtilityObject.getUtcMillisecondsFromDateString(processData[key][involvedField.fieldName],false);
            }
          } else if ((involvedField.fieldType === 'TIMESTAMP' || (involvedField.fieldType === 'FORMULA' && involvedField.formulaType === 'TIMESTAMP') || (involvedField.fieldType === 'ROLLUPSUMMARY' && involvedField.rollupType === 'TIMESTAMP')) && processData[key][involvedField.fieldName]) {
            if (typeof processData[key][involvedField.fieldName] === 'string') {
              processData[key][involvedField.fieldName] = this.appUtilityObject.getUtcTimeZoneMillsecondsFromDateTimeString(processData[key][involvedField.fieldName],'user')
            }
          } else if (involvedField.fieldType === 'LOOKUP' && processData[key][involvedField.fieldName]) {
            if (typeof processData[key][involvedField.fieldName] === 'object') {
              processData[key][involvedField.fieldName] = processData[key][involvedField.fieldName]['id']
            }
          } else if (involvedField.fieldType === 'RECORDASSOCIATION' && processData[key][involvedField.associationFieldName]
            && processData[key][involvedField.associationFieldName].length > 0) {
            let splittedFieldName = involvedField.associationFieldName.split("-")
            processData[key][splittedFieldName[0] + '_' + splittedFieldName[1]] = processData[key][involvedField.associationFieldName]
          }
        })
      }

      return this.math.evaluate(formulaConfig.formula, processData);
    } catch (error) {
      console.log("error", error);
      return '';
    }

  }

  private datediff(dateOperand1: Date, dateOperand2: Date, returnValue: 'DAY' | 'MONTH' | 'YEAR' | 'HOUR' | 'MINUTE' | 'SECOND' | 'MILLISECOND') {
    if (dateOperand1 === null || dateOperand1 === undefined || dateOperand2 === null || dateOperand2 === undefined) {
      return;
    }
    let dateOperandOne = new Date(dateOperand1);
    let dateOperandTwo = new Date(dateOperand2);
    let result = 0;
    if (returnValue === 'YEAR') {
      let diffYear = (dateOperandTwo.getTime() - dateOperandOne.getTime()) / 1000;
      diffYear /= (60 * 60 * 24);
      result = diffYear / 365.25;
    } else if (returnValue === 'MONTH') {
      result = dateOperandTwo.getMonth() - dateOperandOne.getMonth() + (12 * (dateOperandTwo.getFullYear() - dateOperandOne.getFullYear()));
    } else if (returnValue === 'DAY') {
      let diffTime = (dateOperandTwo.getTime() - dateOperandOne.getTime());
      result = diffTime / (1000 * 3600 * 24);
    } else if (returnValue === 'HOUR') {
      let diffHour = (dateOperandTwo.getTime() - dateOperandOne.getTime()) / 1000;
      result = diffHour / (60 * 60);
    } else if (returnValue === 'MINUTE') {
      result = (dateOperandTwo.getTime() - dateOperandOne.getTime());
    } else if (returnValue === 'SECOND') {
      result = (dateOperandTwo.getTime() - dateOperandOne.getTime()) / 1000;
    } else if (returnValue === 'MILLISECOND') {
      result = dateOperandTwo.getTime() - dateOperandOne.getTime();
    }
    return result;
  }

  private today() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime() + moment.tz(moment.tz.guess()).utcOffset() * 60 * 1000;
  }

  private now() {
    return new Date().setSeconds(0,0);
  }
  private day(dateOperand: Date, config, type) {
    if (dateOperand == null || dateOperand == undefined) {
      return;
    }
    let dayString = type === 'DATE' ? config.classContext.getDateStringFromUtcTimeZoneMilliseconds(dateOperand) : config.classContext.getDateTimeStringFromUtcMilliseconds(dateOperand, 'user');
    let dateFormat = type === 'DATE' ? config.classContext.userDatePickerFormat : config.classContext.userDateTimePickerFormat;
    let date = moment(dayString, dateFormat).toDate();
    return date.getDate();
  }
  private month(dateOperand: Date, config, type) {
    if (dateOperand == null || dateOperand == undefined) {
      return;
    }
    let dayString = type === 'DATE' ? config.classContext.getDateStringFromUtcTimeZoneMilliseconds(dateOperand) : config.classContext.getDateTimeStringFromUtcMilliseconds(dateOperand, 'user');
    let dateFormat = type === 'DATE' ? config.classContext.userDatePickerFormat : config.classContext.userDateTimePickerFormat;
    let date = moment(dayString, dateFormat).toDate();
    return date.getMonth() + 1;
  }
  private year(dateOperand: Date, config, type) {
    if (dateOperand == null || dateOperand == undefined) {
      return;
    }
    let dayString = type === 'DATE' ? config.classContext.getDateStringFromUtcTimeZoneMilliseconds(dateOperand) : config.classContext.getDateTimeStringFromUtcMilliseconds(dateOperand, 'user');
    let dateFormat = type === 'DATE' ? config.classContext.userDatePickerFormat : config.classContext.userDateTimePickerFormat;
    let date = moment(dayString, dateFormat).toDate();
    return date.getFullYear();
  }
  private hour(dateOperand: Date, config, type) {
    if (dateOperand == null || dateOperand == undefined) {
      return;
    }
    let dayString = type === 'DATE' ? config.classContext.getDateStringFromUtcTimeZoneMilliseconds(dateOperand) : config.classContext.getDateTimeStringFromUtcMilliseconds(dateOperand, 'user');
    let dateFormat = type === 'DATE' ? config.classContext.userDatePickerFormat : config.classContext.userDateTimePickerFormat;
    let date = moment(dayString, dateFormat).toDate();
    return date.getHours();
  }
  private minute(dateOperand: Date, config, type) {
    if (dateOperand == null || dateOperand == undefined) {
      return;
    }
    let dayString = type === 'DATE' ? config.classContext.getDateStringFromUtcTimeZoneMilliseconds(dateOperand) : config.classContext.getDateTimeStringFromUtcMilliseconds(dateOperand, 'user');
    let dateFormat = type === 'DATE' ? config.classContext.userDatePickerFormat : config.classContext.userDateTimePickerFormat;
    let date = moment(dayString, dateFormat).toDate();
    return date.getMinutes();
  }
  private second(dateOperand: Date) {
    if (dateOperand === null || dateOperand === undefined) {
      return;
    }
    let date = new Date(dateOperand);
    return date.getSeconds();
  }
  private millisecond(dateOperand: Date) {
    if (dateOperand === null || dateOperand === undefined) {
      return;
    }
    let date = new Date(dateOperand);
    return date.getMilliseconds();
  }

  private weekday(dateOperand: Date, config, type) {
    if (dateOperand == null || dateOperand == undefined) {
      return;
    }
    let day = '';
    let dayString = type === 'DATE' ? config.classContext.getDateStringFromUtcTimeZoneMilliseconds(dateOperand) : config.classContext.getDateTimeStringFromUtcMilliseconds(dateOperand, 'user');
    let dateFormat = type === 'DATE' ? config.classContext.userDatePickerFormat : config.classContext.userDateTimePickerFormat;
    let date = moment(dayString, dateFormat).toDate();
    day = date.toLocaleDateString('en-US', { weekday: 'long' });
    return day;
  }

  private constant(input, fieldType: FieldType,config?) {
    let constantValue;
    if(fieldType === 'TEXT'){
      input = input.replaceAll('&#39;', '\'');
      input = input.replaceAll('&#quotD;', '\"');
      input = input.replaceAll('&#BS76;', '\\');
    }
    if (fieldType === 'DATE') {
      constantValue = config.classContext.getUtcMillisecondsFromDateString(input,false, config['dateFormat'])
    }else if (fieldType === 'TIMESTAMP') {
      if(config && config['isFormula'] && config['appBuilderServerZone'] && config['classContext'] && config['classContext']['userTimeZone']){  
        let serverTimeZone = moment.tz(config['appBuilderServerZone']).utcOffset() * 60 * 1000  
        let userTimeZone = moment.tz(config['classContext']['userTimeZone']).utcOffset() * 60 * 1000
        constantValue = config.classContext.getUtcTimeZoneMillsecondsFromDateTimeString(input, "user", config['dateFormat']) - serverTimeZone + userTimeZone
      } else {
        constantValue = config.classContext.getUtcTimeZoneMillsecondsFromDateTimeString(input, "user", config['dateFormat'])
      }
    } else if (fieldType === 'TEXT' || fieldType === 'TEXTAREA' || fieldType === 'EMAIL' || fieldType === 'PASSWORD' || fieldType === 'URL' || fieldType === 'DROPDOWN' || fieldType === 'RADIO') {
      constantValue = input && input.toString() || '';
    } else if (fieldType === 'NUMBER' || fieldType === 'CURRENCY' || fieldType === 'DECIMAL') {
      constantValue = Number(input);
    } else if (fieldType === 'CHECKBOX' || fieldType === 'MULTISELECT') {
      constantValue = input && input.toString().split('|') || [];
    } else if (fieldType === 'BOOLEAN') {
      constantValue = Boolean(input);
    } else {
      constantValue = null;
    }
    return constantValue;
  }

  private addDate(dateOperand: Date, count: number, category: 'DAY' | 'MONTH' | 'YEAR' | 'HOUR' | 'MINUTE' | 'SECOND' | 'MILLISECOND') {
    if (dateOperand === null || dateOperand === undefined) {
      return;
    }
    count = Number(count) || 0;
    let date = new Date(dateOperand);
    if (category === 'YEAR') {
      date.setFullYear(date.getFullYear() + count);
    } else if (category === 'MONTH') {
      date.setMonth(date.getMonth() + count);
    } else if (category === 'DAY') {
      date.setDate(date.getDate() + count);
    } else if (category === 'HOUR') {
      date.setHours(date.getHours() + count);
    } else if (category === 'MINUTE') {
      date.setMinutes(date.getMinutes() + count);
    } else if (category === 'SECOND') {
      date.setSeconds(date.getSeconds() + count);
    } else if (category === 'MILLISECOND') {
      date.setMilliseconds(date.getMilliseconds() + count);
    }
    return date.getTime();
  }
  private subDate(dateOperand: Date, count: number, category: 'DAY' | 'MONTH' | 'YEAR' | 'HOUR' | 'MINUTE' | 'SECOND' | 'MILLISECOND', returnValue: 'DATE' | 'TIMESTAMP') {
    if (dateOperand === null || dateOperand === undefined) {
      return;
    }
    count = Number(count) || 0;
    let date = new Date(dateOperand);
    if (category === 'YEAR') {
      date.setFullYear(date.getFullYear() - count);
    } else if (category === 'MONTH') {
      date.setMonth(date.getMonth() - count);
    } else if (category === 'DAY') {
      date.setDate(date.getDate() - count);
    } else if (category === 'HOUR') {
      date.setHours(date.getHours() - count);
    } else if (category === 'MINUTE') {
      date.setMinutes(date.getMinutes() - count);
    } else if (category === 'SECOND') {
      date.setSeconds(date.getSeconds() - count);
    } else if (category === 'MILLISECOND') {
      date.setMilliseconds(date.getMilliseconds() - count);
    }
    return date.getTime();
  }
  private addDatetime(dateOperand: Date, count: number, category: 'DAY' | 'MONTH' | 'YEAR' | 'HOUR' | 'MINUTE' | 'SECOND' | 'MILLISECOND') {
    if (dateOperand === null || dateOperand === undefined) {
      return;
    }
    count = Number(count) || 0;
    let date = new Date(dateOperand);
    if (category === 'YEAR') {
      date.setFullYear(date.getFullYear() + count);
    } else if (category === 'MONTH') {
      date.setMonth(date.getMonth() + count);
    } else if (category === 'DAY') {
      date.setDate(date.getDate() + count);
    } else if (category === 'HOUR') {
      date.setHours(date.getHours() + count);
    } else if (category === 'MINUTE') {
      date.setMinutes(date.getMinutes() + count);
    } else if (category === 'SECOND') {
      date.setSeconds(date.getSeconds() + count);
    } else if (category === 'MILLISECOND') {
      date.setMilliseconds(date.getMilliseconds() + count);
    }
    return date.getTime();
  }
  private subDatetime(dateOperand: Date, count: number, category: 'DAY' | 'MONTH' | 'YEAR' | 'HOUR' | 'MINUTE' | 'SECOND' | 'MILLISECOND') {
    if (dateOperand === null || dateOperand === undefined) {
      return;
    }
    count = Number(count) || 0;
    let date = new Date(dateOperand);
    if (category === 'YEAR') {
      date.setFullYear(date.getFullYear() - count);
    } else if (category === 'MONTH') {
      date.setMonth(date.getMonth() - count);
    } else if (category === 'DAY') {
      date.setDate(date.getDate() - count);
    } else if (category === 'HOUR') {
      date.setHours(date.getHours() - count);
    } else if (category === 'MINUTE') {
      date.setMinutes(date.getMinutes() - count);
    } else if (category === 'SECOND') {
      date.setSeconds(date.getSeconds() - count);
    } else if (category === 'MILLISECOND') {
      date.setMilliseconds(date.getMilliseconds() - count);
    }
    return date.getTime();
  }
  private dateOnly(dateOperand: Date) {
    if (dateOperand === null || dateOperand === undefined) {
      return;
    }
    let date = new Date(dateOperand);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }
  private average(...operands) {
    let sum = operands.reduce((a, b) => a + b, 0)
    return sum / operands.length;
  }
  private join(delimiter: string, ...operands) {
    return operands.join(delimiter);
  }
  private concatenate(...operands) {
    return operands.join('');
  }
  private includes(input, searchTerm) {
    return input && input.includes(searchTerm) || false;
  }
  private startsWith(input, searchTerm) {
    return input && input.toString().startsWith(searchTerm) || false;
  }
  private endsWith(input, searchTerm) {
    return input && input.toString().endsWith(searchTerm) || false;
  }
  private lowerCase(input: string) {
    return input && input.toString().toLowerCase() || '';
  }
  private upperCase(input: string) {
    return input && input.toString().toUpperCase() || '';
  }
  private trim(input: string) {
    return input && input.toString().trim() || '';
  }
  private charAt(input: string, position: number) {
    position = Number(position) || 0;
    return input && input.toString().charAt(position);
  }
  private replace(input: string, searchTerm: string, replaceTerm: string) {
    searchTerm = searchTerm || ''
    replaceTerm = replaceTerm || ''
    return input && input.toString().replace(searchTerm, replaceTerm) || '';
  }
  private isNull(input: string) {
    return input == null;
  }
  private stringConvert(input) {
    return input == null ? '' : input;
  }
  private numberConvert(input) {
    return input == null ? 0 : input;
  }
  private length(input) {
    return input && input.length || 0;
  }
  private ifCondition(condition, trueStatement, falseStatement) {
    return condition ? trueStatement : falseStatement;
  }
  private right(input, count) {
    count = Number(count) || 0;
    return input && input.substring(input.length - count, input.length) || '';
  }
  private left(input, count) {
    count = Number(count) || 0;
    return input && input.substring(0, count) || '';
  }

  private arrayIncludes(input, searchTerms) {
    if (searchTerms && Array.isArray(searchTerms)) {
      let filteredTerms = searchTerms.filter(searchTerm => {
        return input && input.includes(searchTerm) || false;
      })
      if (filteredTerms.length === searchTerms.length) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  overrideMathFunctions() {
    this.arithmetic();
    this.logical();
    this.relational();
    this.statistics();
    this.trigonometry();
  }

  arithmetic() {
    this.math.import({ 'add': this.add }, { override: true })
    this.math.import({ 'subtract': this.subtract }, { override: true })
    this.math.import({ 'multiply': this.multiply }, { override: true })
    this.math.import({ 'divide': this.divide }, { override: true })
    this.math.import({ 'mod': this.mod }, { override: true })
    this.math.import({ 'pow': this.pow }, { override: true })
    this.math.import({ 'exp': this.exp }, { override: true })
    this.math.import({ 'round': this.round }, { override: true })
    this.math.import({ 'floor': this.floor }, { override: true })
    this.math.import({ 'log2': this.log2 }, { override: true })
    this.math.import({ 'log10': this.log10 }, { override: true })
    this.math.import({ 'sqrt': this.sqrt }, { override: true })
    this.math.import({ 'cbrt': this.cbrt }, { override: true })
    this.math.import({ 'nthRoot': this.nthRoot }, { override: true })
    this.math.import({ 'abs': this.abs }, { override: true })
    this.math.import({ 'sign': this.sign }, { override: true })
    this.math.import({ 'square': this.square }, { override: true })
    this.math.import({ 'cube': this.cube }, { override: true })
    this.math.import({ 'ceil': this.ceil }, { override: true })
    this.math.import({ 'fix': this.fix }, { override: true })
    this.math.import({ 'number': this.number }, { override: true })
  }

  logical() {
    this.math.import({ 'and': this.and }, { override: true })
    this.math.import({ 'not': this.not }, { override: true })
    this.math.import({ 'or': this.or }, { override: true })
    this.math.import({ 'xor': this.xor }, { override: true })
  }

  relational() {
    this.math.import({ 'larger': this.larger }, { override: true })
    this.math.import({ 'largerEq': this.largerEq }, { override: true })
    this.math.import({ 'smaller': this.smaller }, { override: true })
    this.math.import({ 'smallerEq': this.smallerEq }, { override: true })
    this.math.import({ 'unequal': this.unequal }, { override: true })
    this.math.import({ 'equal': this.equal }, { override: true })
    this.math.import({ 'compareText': this.compareText }, { override: true })
  }

  statistics() {
    this.math.import({ 'sum': this.add }, { override: true })
    this.math.import({ 'max': this.max }, { override: true })
    this.math.import({ 'min': this.min }, { override: true })
  }

  trigonometry() {
    this.math.import({ 'sin': this.sin }, { override: true })
    this.math.import({ 'cos': this.cos }, { override: true })
    this.math.import({ 'tan': this.tan }, { override: true })
    this.math.import({ 'asin': this.asin }, { override: true })
    this.math.import({ 'acos': this.acos }, { override: true })
    this.math.import({ 'atan': this.atan }, { override: true })
  }

  larger(operand1, operand2) {
    return operand1 > operand2;
  }
  largerEq(operand1, operand2) {
    return operand1 >= operand2;
  }
  smaller(operand1, operand2) {
    return operand1 < operand2;
  }
  smallerEq(operand1, operand2) {
    return operand1 <= operand2;
  }
  equal(operand1, operand2) {
    return operand1 === operand2;
  }
  unequal(operand1, operand2) {
    return operand1 !== operand2;
  }
  compareText(operand1, operand2) {
    let elseBlock = operand1 > operand2 ? 1 : -1;
    return (operand1 === operand2) ? 0 : elseBlock;
  }


  and(operand1, operand2) {
    return operand1 && operand2;
  }

  or(operand1, operand2) {
    return operand1 || operand2;
  }

  xor(operand1, operand2) {
    return operand1 ^ operand2;
  }

  not(operand) {
    return !operand;
  }


  add(...operands) {
    let result = 0;
    operands.forEach((value) => result += (Number(value) || 0))
    return result;
  }

  multiply(...operands) {
    let result = 1;
    operands.forEach((value) => result *= (Number(value) || 0))
    return result;
  }

  subtract(operand1, operand2) {
    return (Number(operand1) || 0) - (Number(operand2) || 0);
  }

  divide(operand1, operand2) {
    return (Number(operand1) || 0) / (Number(operand2) || 0);
  }

  mod(operand1, operand2) {
    return (Number(operand1) || 0) % (Number(operand2) || 0);
  }

  pow(operand1, operand2) {
    let value = Math.pow(operand1, operand2);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }

  exp(operand) {
    let value = Math.exp(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }

  max(...operands) {
    return Math.max(...operands);
  }
  min(...operands) {
    return Math.min(...operands);
  }

  round(operand, precision) {
    if(!precision){
      precision = 0;
    }
    let decimalPrecision = Math.pow(10, precision)
    let value = Math.round(operand * decimalPrecision) / decimalPrecision;
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }

  floor(operand, precision) {
    if(!precision){
      precision = 0;
    }
    let decimalPrecision = Math.pow(10, precision)
    let value = Math.floor(operand * decimalPrecision) / decimalPrecision;
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }

  log2(operand) {
    let value = Math.log2(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  log10(operand) {
    let value = Math.log10(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  sin(operand) {
    let value = Math.sin(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  cos(operand) {
    let value = Math.cos(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  tan(operand) {
    let value = Math.tan(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  asin(operand) {
    let value = Math.asin(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  acos(operand) {
    let value = Math.acos(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  atan(operand) {
    let value = Math.atan(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }

  sqrt(operand) {
    let value = Math.sqrt(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  cbrt(operand) {
    let value = Math.cbrt(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  nthRoot(operand, root) {
    let value = Math.pow(operand, 1 / root);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  abs(operand) {
    let value = Math.abs(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  sign(operand) {
    let value = Math.sign(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  square(operand) {
    let value = Math.pow(operand, 2);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }

  ceil(operand) {
    let value = Math.ceil(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }

  fix(operand) {
    let value = Math.floor(operand);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  cube(operand) {
    let value = Math.pow(operand, 3);
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  number(operand) {
    let value = Number(operand)
    if (isNaN(value)) {
      return ""
    } else {
      return value
    }
  }
  complexFieldSplit(complexField,dataContext) {
    if (typeof complexField === 'string' && complexField.indexOf('.') > 0) {

      let outputValue = complexField.split('.').reduce((obj, i) => (obj?.hasOwnProperty(i) ? obj[i] : ''), dataContext);
  
      if (outputValue === undefined || outputValue === null || (typeof outputValue === 'object' && Object.entries(outputValue).length === 0 && !(outputValue instanceof Date))) {
  
        outputValue = ''; // return empty string when value ends up being an empty object
  
      }
  
      return outputValue;
  
    }
  }
  dataJSON(str, data) {
    let before = str.slice(0, str.indexOf('.'));
    data[before] = {};
    let after = str.slice(str.indexOf('.') + 1);
    if (after.indexOf('.') > 0) {
      return this.dataJSON(after, data[before]);
    } else {
      data[before][after] = null;
      return data;
    }
  }
}
