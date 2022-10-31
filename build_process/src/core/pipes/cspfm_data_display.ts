import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe, CurrencyPipe } from "@angular/common";
import { cspfmSlickGridFormatter } from "../dynapageutils/cspfmSlickGridFormatter";
import {
  Formatter, EditorValidator, EditorArgs, Column,
  ColumnEditor, Editor, EditorValidatorOutput, KeyCode, GridOption, EditorArguments, HtmlElementPosition, getHtmlElementOffset, Grouping
} from 'angular-slickgrid';
import { appUtility } from '../utils/appUtility';
import { FormulaType } from '../models/cspfmFormulaConfig.type';
import * as _ from "underscore";
import { TranslateService } from "@ngx-translate/core";
import { appConstant } from '../utils/appConstant';
import { BaseFieldInfo } from '../models/cspfmFieldInfo.type';
// using external non-typed js libraries
declare const $: any;
import * as moment from "moment";

export interface cspfmDataGrouping extends Grouping {
  params?: any;
}

export class cspfmCustomEditor implements Editor {
  private _$textarea: any;
  private _$wrapper: any;
  defaultValue: any;

  /** SlickGrid Grid object */
  grid: any;

  /** Grid options */
  gridOptions: GridOption;

  constructor(private args: EditorArguments) {
    if (!args) {
      throw new Error('[Angular-SlickGrid] Something is wrong with this grid, an Editor must always have valid arguments.');
    }
    this.grid = args.grid;
    this.gridOptions = args.grid && args.grid.getOptions() as GridOption;
    this.init();
  }

  /** Get Column Definition object */
  get columnDef(): Column | undefined {
    return this.args && this.args.column;
  }

  /** Get Column Editor object */
  get columnEditor(): ColumnEditor {
    return this.columnDef && this.columnDef.internalColumnEditor || {};
  }
  /** Get the Editor DOM Element */
  get editorDomElement(): any {
    return this._$textarea;
  }

  get hasAutoCommitEdit() {
    return this.args.grid.getOptions().autoCommitEdit;
  }

  /** Get the Validator function, can be passed in Editor property or Column Definition */
  get validator(): EditorValidator | undefined {
    return (this.columnEditor && this.columnEditor.validator) || (this.columnDef && this.columnDef.validator);
  }

  init(): void {
    const cancelText = 'Cancel';
    const saveText = 'Save';

    const columnId = this.columnDef && this.columnDef.id;
    const placeholder = this.columnEditor && this.columnEditor.placeholder || '';
    const title = this.columnEditor && this.columnEditor.title || '';
    const $container = $('body');

    this._$wrapper = $(`<div class="slick-large-editor-text editor-${columnId}" />`).appendTo($container);
    this._$textarea = $(`<textarea hidefocus rows="5" placeholder="${placeholder}" title="${title}">`).appendTo(this._$wrapper);

    $(`<div class="editor-footer"><button 
    class="btn btn-save btn-primary btn-xs">${saveText}</button><button class="btn btn-cancel btn-default btn-xs">${cancelText}</button> </div>`).appendTo(this._$wrapper);

    this._$wrapper.find('.btn-save').on('click', () => this.save());
    this._$wrapper.find('.btn-cancel').on('click', () => this.cancel());
    this._$textarea.on('keydown', this.handleKeyDown.bind(this));

    this.position(this.args && this.args.position);
    this._$textarea.focus().select();
  }
  cancel() {
    this._$textarea.val(this.defaultValue);
    if (this.args && this.args.cancelChanges) {
      this.args.cancelChanges();
    }
  }

  hide() {
    this._$wrapper.hide();
  }

  show() {
    this._$wrapper.show();
  }
  destroy() {
    this._$wrapper.remove();
  }

  focus() {
    this._$textarea.focus();
  }

  getValue(): string {
    return this._$textarea.val();
  }

  setValue(val: string) {
    this._$textarea.val(val);
  }

  loadValue(item: any) {
    if (this.args.column.params.fieldInfo['fieldType'] === 'MASTERDETAIL') {
      const fieldAry = this.args.column.field.split('.')
      if (item[fieldAry[0]] && item[fieldAry[0]][fieldAry[1]] && item[fieldAry[0]][fieldAry[1]][fieldAry[2]]) {
        this.defaultValue = item[fieldAry[0]][fieldAry[1]][fieldAry[2]] || '';
      } else {
        this.defaultValue = item[this.args.column.field] || '';
      }
    } else if (this.args.column.params.fieldInfo['fieldType'] === 'LOOKUP') {
      const fieldAry = this.args.column.field.split('.')
      if (item[fieldAry[0]] && item[fieldAry[0]][fieldAry[1]]) {
        this.defaultValue = item[fieldAry[0]][fieldAry[1]] || '';
      } else {
        this.defaultValue = item[this.args.column.field] || '';
      }
    } else {
      this.defaultValue = item[this.args.column.field] || '';
    }
    this._$textarea.val(this.defaultValue);
    this._$textarea[0].defaultValue = this.defaultValue;
    this._$textarea.select();
  }
  position(parentPosition: HtmlElementPosition) {
    const containerOffset = getHtmlElementOffset(this.args.container);

    this._$wrapper
      .css('top', (containerOffset.top || parentPosition.top || 0))
      .css('left', (containerOffset.left || parentPosition.left || 0));
  }
  serializeValue() {
    return this._$textarea.val();
  }

  applyValue(item: any, state: any) {
    const validation = this.validate(state);
    if (this.args.column.params.fieldInfo['fieldType'] === 'NUMBER') {
      item[this.args.column.field] = (validation && validation.valid) ? Number(state) : 0;
    } else if (this.args.column.params.fieldInfo['fieldType'] === 'DECIMAL') {
      item[this.args.column.field] = (validation && validation.valid) ? parseFloat(state) : 0;
    } else if (this.args.column.params.fieldInfo['fieldType'] === 'MASTERDETAIL') {
      const fieldAry = this.args.column.field.split('.')
      if (item[fieldAry[0]] && item[fieldAry[0]][fieldAry[1]] && item[fieldAry[0]][fieldAry[1]][fieldAry[2]]) {
        if (this.args.column.params.fieldInfo['child']['fieldType'] === 'NUMBER') {
          item[fieldAry[0]][fieldAry[1]][fieldAry[2]] = (validation && validation.valid) ? Number(state) : 0;
        } else if (this.args.column.params.fieldInfo['child']['fieldType'] === 'DECIMAL') {
          item[fieldAry[0]][fieldAry[1]][fieldAry[2]] = (validation && validation.valid) ? parseFloat(state) : 0;
        } else {
          item[fieldAry[0]][fieldAry[1]][fieldAry[2]] = (validation && validation.valid) ? state : '';
        }
      }
    } else if (this.args.column.params.fieldInfo['fieldType'] === 'LOOKUP') {
      const fieldAry = this.args.column.field.split('.')
      if (item[fieldAry[0]] && item[fieldAry[0]][fieldAry[1]]) {
        if (this.args.column.params.fieldInfo['child']['fieldType'] === 'NUMBER') {
          item[fieldAry[0]][fieldAry[1]] = (validation && validation.valid) ? Number(state) : 0;
        } else if (this.args.column.params.fieldInfo['child']['fieldType'] === 'DECIMAL') {
          item[fieldAry[0]][fieldAry[1]] = (validation && validation.valid) ? parseFloat(state) : 0;
        } else {
          item[fieldAry[0]][fieldAry[1]] = (validation && validation.valid) ? state : '';
        }
      }
    } else {
      item[this.args.column.field] = (validation && validation.valid) ? state : '';
    }
  }

  isValueChanged() {
    return (!(this._$textarea.val() === '' && this.defaultValue === null)) && (this._$textarea.val() !== this.defaultValue);
  }

  save() {
    const validation = this.validate();
    if (validation && validation.valid) {
      if (this.hasAutoCommitEdit) {
        this.args.grid.getEditorLock().commitCurrentEdit();
      } else {
        this.args.commitChanges();
      }
    }
  }

  validate(inputValue?: any): EditorValidatorOutput {
    if (this.validator) {
      const value = (inputValue !== undefined) ? inputValue : this._$textarea && this._$textarea.val && this._$textarea.val();
      return this.validator(value, this.args);
    }

    return {
      valid: true,
      msg: null
    };
  }
  // --
  // private functions
  // ------------------

  private handleKeyDown(event: KeyboardEvent) {
    const keyCode = event.keyCode || event.code;
    if (keyCode === KeyCode.ENTER && event.ctrlKey) {
      this.save();
    } else if (keyCode === KeyCode.ESCAPE) {
      event.preventDefault();
      this.cancel();
    } else if (keyCode === KeyCode.TAB && event.shiftKey) {
      event.preventDefault();
      if (this.args && this.grid) {
        this.grid.navigatePrev();
      }
    } else if (keyCode === KeyCode.TAB) {
      event.preventDefault();
      if (this.args && this.grid) {
        this.grid.navigateNext();
      }
    }
  }
}

export const CspfmDataExportFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any, grid: any) => {
  if (columnDef['params'] && columnDef['params']['pipe'] && columnDef['params']['fieldInfo']) {
    var columnValue = columnDef['params']['pipe'].transform(dataContext, columnDef['params']['fieldInfo']);
    let getFieldInfo = (fieldInfo: FieldInfo | '') => {
      if (fieldInfo["fieldType"] === "LOOKUP" ||
        fieldInfo["fieldType"] === "MASTERDETAIL" ||
        fieldInfo["fieldType"] === "HEADER") {
        return getFieldInfo(fieldInfo["child"]);
      } else {
        return fieldInfo;
      }
    }
    let fieldInfo = getFieldInfo(columnDef["params"]["fieldInfo"])
    fieldInfo['actionInfo'] = fieldInfo['actionInfo'] || [];  
    if (fieldInfo["fieldType"] === "URL") {
      columnValue = (columnValue.url || '').replace(/,/g, ", ");
    }
    return columnValue;
  } else {
    return "";
  }
};

export const CspfmExportDataMaskingFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any, grid: any) => {
  if (columnDef['params'] && columnDef['params']['pipe'] && columnDef['params']['fieldInfo']) {
    var columnValue = columnDef['params']['pipe'].transform(dataContext, columnDef['params']['fieldInfo']);
    let getFieldInfo = (fieldInfo: FieldInfo | '') => {
      if (fieldInfo["fieldType"] === "LOOKUP" ||
        fieldInfo["fieldType"] === "MASTERDETAIL" ||
        fieldInfo["fieldType"] === "HEADER") {
        return getFieldInfo(fieldInfo["child"]);
      } else {
        return fieldInfo;
      }
    }
    let fieldInfo = getFieldInfo(columnDef["params"]["fieldInfo"])
    fieldInfo['actionInfo'] = fieldInfo['actionInfo'] || [];  
    columnValue = columnDef['params']['context']['formatMaskingField'](columnValue, columnDef['params']['maskingAttributes'], fieldInfo['fieldType'], true);
    if (fieldInfo["fieldType"] === "URL") {
      columnValue = (columnValue.url || '').replace(/,/g, ", ");
    }
    return columnValue;
  } else {
    return "";
  }
 };
 
export const cspfmAssociationDataFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any, grid: any) => {
 if (columnDef['params'] && columnDef['params']['pipe'] && columnDef['params']['fieldInfo']) {
   const columnValue = columnDef['params']['pipe'].transform(dataContext, columnDef['params']['fieldInfo']);
   let isDataFetching = grid['isDataFetching'];
   let isFirstBatch = grid['isFirstBatch'];
   let isLazyLoading = columnDef['params']['pipe'].getFieldValueFetchingStatus(dataContext, columnDef['params']['fieldInfo'])
   if (isFirstBatch || isLazyLoading && isDataFetching) {
     return cspfmSlickGridFormatter.SkeletonFormatter(row, cell, value, columnDef, dataContext, grid)
   }
   if (columnValue) {
     let layoutId = columnDef['params']['layoutId']
      let layoutName = columnDef['params']['layoutName'];
     let fieldInfo = columnValue['fieldInfo']
     let data = columnValue['dataObject']
     let associationObjectInfo = fieldInfo['associationInfo']['associationObjectInfo']
     let associationFieldName = fieldInfo['associationInfo']['fieldName']
     if (associationObjectInfo && data[associationFieldName]) {
     let associationObjFieldKeys = Object.keys(associationObjectInfo)
       for (let associationObjField of associationObjFieldKeys) {
         if (Array.isArray(data[associationFieldName])) {
           if (!data[associationFieldName].includes(associationObjectInfo[associationObjField]['objectName'])) {
             continue;
           }
         } else {
           if (data[associationFieldName] !== associationObjectInfo[associationObjField]['objectName']) {
             continue;
           }
         }

         if (data[associationObjField] && data[associationObjField].length > 0) {
           if ((data[associationObjField].length > 1 && fieldInfo['associationInfo']['style'] === 'SingleFromMultipleWithMultipleChip')
             || fieldInfo['associationInfo']['style'] === 'SingleFromMultipleWithMultipleList' || fieldInfo['associationInfo']['style'] === 'MultipleFromMultipleWithMultipleList'
             || fieldInfo['associationInfo']['style'] === 'MultipleFromMultipleWithSingleList' || fieldInfo['associationInfo']['style'] === 'MultipleFromMultipleWithSingleTab'
             || fieldInfo['associationInfo']['style'] === 'MultipleFromMultipleWithMultipleTab' || fieldInfo['associationInfo']['style'] === 'MultipleFromMultipleWithMultipleChip'
             || fieldInfo['associationInfo']['style'] === 'MultipleFromMultipleWithSingleChip' || fieldInfo['associationInfo']['style'] === 'MultipleFromMultipleWithMultipleWaterfall') {

             let layoutId = columnDef['params']['layoutId'] || ''
             return columnDef['params']['pipe'].actionButtonTagGeneration(fieldInfo['actionInfo'], layoutId, row)
           } else {
             var outputTag = `<div class="cs-slickgeid-mat-chip-listhead"><div class="cs-slickgeid-mat-chip-list cs-slick-flex-chip cs-overflow-chip">`
             var additionalChipValues = []

             var extraPaddingWidth = 35
             let fieldWidth = columnDef['width']
             let moreButtonWidth = 35
             var valueWidth = 0 + moreButtonWidth

             data[associationObjField].forEach((element, index) => {
              let associationValue =columnDef['params']['pipe'].htmlElementToString( element[associationObjectInfo[associationObjField]['resultColumn'][0]])
               if (fieldInfo['associationInfo']['style'] === 'SingleFromMultipleWithSingle' || fieldInfo['associationInfo']['style'] === 'SingleFromMultipleWithMultipleChip') {
                 outputTag += `<div class="cs-mat-custom-theme cs-fullmaxwidth cs-vpad-4"><div class="cs-slickgeid-mat-chip cs-singleobj-viewchip" title="${associationValue}"><div 
                 id="${'ACT_' + layoutName + '$$' + fieldInfo.traversalpath +'_chip_'+ index +'_' + row}" class="cs-ra-chip-parent cs-overflowhidden"><div 
                 id="${'ACT_' + layoutName + '$$' + fieldInfo.traversalpath +'_chip_'+ index +'_value_' + row}"class="cs-ra-chip-mainlabel cs-truncate"><span class="cs-singleobj-viewlabelhead">${associationObjectInfo[associationObjField]['objectName']} : </span><span class="cs-singleobj-viewlabelsub">${associationValue}</span></div></div></div></div>`
               } else {
                 let selectedFieldValue = associationValue
                 if (!selectedFieldValue) {
                   valueWidth = valueWidth + 8 + extraPaddingWidth
                 } else {
                   valueWidth = valueWidth + (selectedFieldValue.length * 8) + extraPaddingWidth
                 }

                 if (valueWidth < fieldWidth || index === 0) {
                   outputTag += `<div class="cs-fullmaxwidth cs-vpad-4"><div id="${'ACT_' + layoutName + '$$' + fieldInfo.traversalpath +'_chip_'+ index +'_' + row}" 
                   class="cs-slickgeid-mat-chip" title="${associationValue}"><div class="cs-ra-chip-parent cs-overflowhidden"><div id="${'ACT_' + layoutName + '$$' + fieldInfo.traversalpath +'_chip_'+ index +'_value_' + row}" 
                   class="cs-ra-chip-mainlabel cs-truncate">${associationValue}</div></div></div></div>`
                 } else {
                   additionalChipValues.push(associationValue)
                 }
               }

             });

             outputTag += `</div>`
             if (additionalChipValues.length > 0) {
               outputTag += `<div id="${'ACT_' + layoutName + '$$' + fieldInfo.traversalpath +'_more_div_' + row}" class="cs-recordassociation-count cs-lmar-7" data-cs-dropdown="#cs-dropdown-${layoutId}"
                 additionalChipValues='${JSON.stringify(additionalChipValues)}' action-info='${JSON.stringify(fieldInfo['actionInfo'][0])}'
                 action-view='button'><span id="${'ACT_' + layoutName + '$$' + fieldInfo.traversalpath +'_more_' + row}" class="cs-chipmore-btn cs-ts-12">+${additionalChipValues.length}</span></div>`;
             }

             outputTag += `</div>`;
             return outputTag;
           }
         }
       }
     }
   }
 }
 return ""
};

export const CspfmDataFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: any,
  dataContext: any,
  grid: any
) => {
  if (
    columnDef["params"] &&
    columnDef["params"]["pipe"] &&
    columnDef["params"]["fieldInfo"]
  ) {
    let layoutId = columnDef['params']['layoutId'];
    let columnValue = columnDef["params"]["pipe"].transform(
      dataContext,
      columnDef["params"]["fieldInfo"]
    );
    columnValue = columnDef["params"]["pipe"].htmlElementToString(columnValue);
    let isDataFetching = grid["isDataFetching"];
    let isFirstBatch = grid["isFirstBatch"];
    let cspfmSlickGridMode = grid['cspfmSlickGridMode'];
    let cspfmCellCss = grid['cspfmCellCss'];
    let isRecordEditable = false;
    if (grid['cspfmEditableRecordIds'] && grid['cspfmEditableRecordIds'].includes(dataContext['id'])) {
      isRecordEditable = true
    }
    let isLazyLoading = columnDef['params']['pipe'].getFieldValueFetchingStatus(dataContext, columnDef['params']['fieldInfo'])
    if (isFirstBatch || isLazyLoading && isDataFetching) {
      return cspfmSlickGridFormatter.SkeletonFormatter(
        row,
        cell,
        value,
        columnDef,
        dataContext,
        grid
      );
    }
    let getFieldInfo = (fieldInfo: FieldInfo | "") => {
      if (
        fieldInfo["fieldType"] === "LOOKUP" ||
        fieldInfo["fieldType"] === "MASTERDETAIL" ||
        fieldInfo["fieldType"] === "HEADER"
      ) {
        return getFieldInfo(fieldInfo["child"]);
      } else {
        return fieldInfo;
      }
    };
    let fieldInfo = getFieldInfo(columnDef["params"]["fieldInfo"]);
 let styleFromJson = fieldInfo["boxStyle"] + fieldInfo["valueStyle"];
      let editorStyle = `cs-editorStyle`

      let cellCss = ''

      if (cspfmSlickGridMode !== 'Edit' && !isRecordEditable) {
        editorStyle = ''
      }

      let positionKey=`r${dataContext['id']}_c${columnDef['id']}`;

      if (cspfmCellCss && cspfmCellCss[positionKey]) {
        cellCss = cspfmCellCss[positionKey];
      }
    if (fieldInfo["fieldType"] === "STATUSWORKFLOW") {
      let getValue = (data, fieldInfo: FieldInfo | "") => {
        if (
          data[fieldInfo["fieldName"]] &&
          data[fieldInfo["fieldName"]] !== "" &&
          data[fieldInfo["fieldName"]].length !== 0 &&
          fieldInfo["child"]
        ) {
          if (fieldInfo["fieldType"] === "MASTERDETAIL") {
            return getValue(
              data[fieldInfo["fieldName"]][0],
              fieldInfo["child"]
            );
          } else {
            return getValue(data[fieldInfo["fieldName"]], fieldInfo["child"]);
          }
        } else {
          return data[fieldInfo["fieldName"]];
        }
      };
      let fieldValue = getValue(dataContext, columnDef["params"]["fieldInfo"]);
      let layoutId = columnDef["params"]["layoutId"];
      let objectConfig = fieldInfo["statusWorkflow"]["objectConfig"];
      let objectId = fieldInfo["statusWorkflow"]["objectId"];
      let fieldName = fieldInfo["statusWorkflow"]["fieldName"];
      let objectName = fieldInfo["objectName"] || "";
      let traversalpath = fieldInfo["traversalpath"]
        ? fieldInfo["traversalpath"]
        : "";
      let fieldId = objectConfig[objectId]["workflow"][fieldName]["fieldId"];
      let swList = objectConfig[objectId]["workflow"][fieldName]["configJson"];
      let enableHistory = columnDef["params"]["fieldInfo"]['enableHistory'];
      value = fieldValue;
      if (!swList[value]) {
        return "";
      }
      let pointerClass: string = "";
      if (columnDef["params"]["inlineEditEnabled"]) {
        pointerClass = "pointer";
      }
      let selectedStatus = swList[value].filter(
        (item) => item["statusValue"] === value
      );
      let outputTag = `<div style = "${styleFromJson}" class="cs-status-head dropdown" action-view="button" data-cs-dropdown="#cs-dropdown-${layoutId}" id="r${row}_${traversalpath}" >`;
      let disableClass: string = "";
      if (
        dataContext["systemAttributes"] &&
        dataContext["systemAttributes"]["fieldId"] !== fieldId
      ) {
        disableClass = "cs-statuspopover-disable";
      }
      if (
        selectedStatus &&
        selectedStatus[0]["isApproveInitiateEnabled"] === "Y"
      ) {
        outputTag += `<span action-view='workflowStatus' class="${pointerClass} cs-status-request ${disableClass}">${columnValue}</span>`;
        if(enableHistory){
          outputTag+=`<em action-view='workflowHistory' class="icon-mat-update cs-entry-status-update-icon pointer"></em>`;
        }
      } else if (
        selectedStatus &&
        selectedStatus[0]["statusType"] === "Approved"
      ) {
        outputTag += `<span action-view='workflowStatus' class="${pointerClass} cs-status-approved ${disableClass}">${columnValue}</span>`;
        if(enableHistory){
          outputTag+=`<em action-view='workflowHistory' class="icon-mat-update cs-entry-status-update-icon pointer"></em>`;
        }
      } else if (
        selectedStatus &&
        selectedStatus[0]["statusType"] === "Reject"
      ) {
        outputTag += `<span action-view='workflowStatus' class="${pointerClass} cs-status-rejected ${disableClass}">${columnValue}</span>`;
        if(enableHistory){
          outputTag+=`<em action-view='workflowHistory' class="icon-mat-update cs-entry-status-update-icon pointer"></em>`;
        }
      } else {
        outputTag += `<span action-view='workflowStatus' class="${pointerClass} cs-status-open ${disableClass}">${columnValue}</span>`;
        if(enableHistory){
          outputTag+=`<em action-view='workflowHistory' class="icon-mat-update cs-entry-status-update-icon pointer"></em>`;
        }
      }
      outputTag += `</div>`;
      return outputTag;
    } else if (columnDef["params"]["cspfmEditorType"] === "LOOKUP") {
      let outputTag = `<div class="dropdown pointer ${editorStyle} ${cellCss}"  id="r${row}_c${cell}_${columnDef['params']['fieldInfo']['traversalpath']}" >`;
      //  let outputTag = `<div style = "${styleFromJson}" class="cs-status-head dropdown pointer" id="r${row}_c${cell}_${columnDef['params']['fieldInfo']['traversalpath']}" >`
      if (columnValue) {
        // style="justify-content: start; background: transparent; color: #0f50fe; text-decoration: underline;"
        outputTag += `<span style = "color: #0f50fe; text-decoration: underline; display: inline-block;width: 100%; ${styleFromJson}" >${columnValue}</span>`;
        if (cspfmSlickGridMode === 'Edit' || isRecordEditable) {
          outputTag += `<span lookup-click-action="clear" style="float:right;"><em style="font-size: medium;" class="icon-mat-clear"></em></span>`;
        }
      } else {

        if (cspfmSlickGridMode === 'Edit' || isRecordEditable) {
          outputTag += `<span lookup-click-action="search" style="float:right;"><em style="font-size: medium;" class="icon-mat-search"></em></span>`;
        }
      }
      outputTag += `</div>`;
      return outputTag;
    } else if(fieldInfo["fieldType"] === "BOOLEAN"){
      let outputTag = '';
      if (columnDef['params']['cspfmEditorType'] === 'BALLOONUI') {
        outputTag += `<div class="cs-balloon-position" data-cs-dropdown="#cs-dropdown-${layoutId}">`
      }
      outputTag += `<div style = "${styleFromJson}" id="r${row}_c${cell}_${columnDef["params"]["fieldInfo"]["traversalpath"]}"> ${columnValue}`;
      if (columnDef['params']['cspfmEditorType'] === 'BALLOONUI') {
        outputTag += `</div>`
      }
      outputTag += `</div>`;
      return outputTag;
    } else {
      let outputTag = "";
      if (columnDef['params']['cspfmEditorType'] === 'BALLOONUI') {
        outputTag += `<div class="cs-balloon-position" data-cs-dropdown="#cs-dropdown-${layoutId}">`
      }
      if (columnValue) {
        outputTag += `<div style= "${styleFromJson}"  class="${cellCss} ${columnDef['params']['editable'] ? editorStyle : ''}"  id="r${row}_c${cell}_${columnDef['params']['fieldInfo']['traversalpath']}"> ${columnValue}`
      } else {
        outputTag += `<div  class="${cellCss} ${columnDef['params']['editable'] ? editorStyle : ''}"  id="r${row}_c${cell}_${columnDef['params']['fieldInfo']['traversalpath']}"> ${columnValue}`
      }
      if (columnDef['params']['cspfmEditorType'] === 'BALLOONUI') {
        outputTag += `</div>`
      }
      outputTag += `</div>`;
      return outputTag;
    }
  } else {
    return "";
  }
};


export const CspfmActionsFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any, grid: any) => {
  let isDataFetching = grid['isDataFetching'];
   if (isDataFetching) {
     return cspfmSlickGridFormatter.SkeletonFormatter(row, cell, value, columnDef, dataContext, grid)
   }
  var actionInfos = columnDef['params']['actionInfo'] && columnDef['params']['actionInfo'] || []
  var outputTag = `<div action-view='container'>`;
  var layoutId = columnDef['params']['layoutId'] || ''
  var stopDropDownClose = columnDef['params']['stopDropDownClose'] || false
  var isFab ;
  var userInfoIndicater = columnDef['params']['userInfoIndicater'] || ''
  actionInfos.forEach(actionInfo => {
    isFab = actionInfo && actionInfo['isFab'] || false;
    var actionDisplayType = actionInfo && actionInfo['actionDisplayType'] || 'Icon';
    var actionIcon = actionInfo && actionInfo['actionIcon'] || '';
    var boxStyle = actionInfo && actionInfo['boxStyle'] || '';
    var valueStyle = actionInfo && actionInfo['valueStyle'] || '';
    var labelStyle = actionInfo && actionInfo['labelStyle'] || '';
    var actionLabel = actionInfo && actionInfo['actionLabel'] || '';
    const objectName = actionInfo && actionInfo['objectName'] || '';
    var buttonColor = actionInfo && actionInfo['buttonColor'] || 'var(--ion-color-primary)';
    var buttonText = actionInfo && actionInfo['buttonText'] || 'white';
    var buttonCss = actionInfo && actionInfo['buttonCss'] || '';
    var elementId = actionInfo.elementid || '';
    let traversalpath = actionInfo['traversalpath'] ? actionInfo['traversalpath'] : ""
    var isHiddenEnabled = actionInfo && actionInfo['isHiddenEnabled'] || 'N';
    if (isHiddenEnabled === "N") {
      if (actionInfo['actionType'] === "USERASSIGNMENT") {
        // useraction true
        let ua_data = {
          "userData": [],
          "groupData": [],
          "roleData": [],
          "data":{
             "id":dataContext['id'],
             "type":dataContext['type']
           }
        }
        if (userInfoIndicater) {
          outputTag += `<div class="clearfix cs-slick-user-list-assign"><div class="clearfix cs-userassign-click  cs-user-added" user-assignment='${JSON.stringify(ua_data)}'  title="User Assignment"><div class="cs-pu cs-pr cs-click-position">`
             if (actionDisplayType === 'IconandButton') {
 
               outputTag += `<button style="${boxStyle}" action-view='button'  action-info='${JSON.stringify(actionInfo)}' id="r${row}_c${cell}_${traversalpath}_${actionLabel}" title="${actionLabel}" ng-reflect-color="primary" mat-stroked-button 
               class="cs-mat-iconandlabelonly cs-nomargin mat-stroked-button mat-primary dropdown pointer"><em style="${valueStyle}" class="${actionIcon}"></em><span style="${labelStyle}" class="cs-mat-btnlabel"> ${actionLabel} </span></button>`
             }else if (actionDisplayType === 'Button') {
             outputTag += `<button style="${boxStyle}" action-view='button' action-info='${JSON.stringify(actionInfo)}' id="r${row}_c${cell}_${traversalpath}_${actionLabel}" title="${actionLabel}" ng-reflect-color="primary" mat-stroked-button 
             class="cs-mat-labelonly cs-nomargin mat-stroked-button mat-primary dropdown pointer"><span style="${labelStyle}" class="cs-mat-btnlabel">${actionLabel}</span></button>`
             }else if (actionDisplayType === 'Icon') {
               outputTag +=   ` <button style="${boxStyle}" action-view='button' action-info='${JSON.stringify(actionInfo)}' id="r${row}_c${cell}_${traversalpath}_${actionLabel}" title="${actionLabel}" 
               class="userassignments cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true"><em style="${valueStyle}" class="${actionIcon}"></em></button>`
             }
               
               
             outputTag +=  `<div class="cs-userinfoblock cs-ra-esc-t"><div class="cs-ra-assignmentpartmain cs-ra-esc-t"><div class="cs-ua-loader"><span 
             class="cs-loader"></span><span class="cs-loader-text">No Assignment</span></div><span class="cs-ra-userassignedmain cs-ra-ua-assignedlist" 
             userdetails="user" title="User"><span class="cs-eachassignedmain cs-assigned-user"><i class="icon-cs-individual cs-ts-18"></i><span 
             class="cs-assignedcount">0</span></span></span><span class="cs-ra-usergroupassignedmain cs-ra-ua-assignedlist" userdetails="usergroup" title="User Group"><span 
             class="cs-eachassignedmain cs-assigned-usergroup"><i class="icon-cs-group-o cs-ts-18"></i><span class="cs-assignedcount">0</span></span></span><span 
             class="cs-ra-roleassignedmain cs-ra-ua-assignedlist" userdetails="role" title="Role"><span class="cs-eachassignedmain cs-assigned-role"><i class="icon-cs-responsibility cs-ts-18"></i><span 
             class="cs-assignedcount">0</span></span></span><span class="cs-ra-responseassignedmain cs-ra-ua-assignedlist" userdetails="responsibility" title="Responsibility"><span class="cs-eachassignedmain cs-assigned-responsibility"><i 
             class="icon-cs-responsibility cs-ts-18"></i><span class="cs-assignedcount">0</span></span></span></div></div></div></div></div>`
        }else {
          outputTag += `<button style="${boxStyle}" action-view='button' action-info='${JSON.stringify(actionInfo)}' id="r${row}_c${cell}_${traversalpath}_${actionLabel}" title="${actionLabel}" class="userassignments cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" 
          ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true"><em style="${valueStyle}" class="${actionIcon}"></em></button>`;
        }
      }else {
     
      if (actionDisplayType === 'IconandButton') {
         outputTag += `<button style="${boxStyle}" action-view='button' stopdropdownclose=${stopDropDownClose} data-cs-dropdown="#cs-dropdown-${layoutId}" action-info='${JSON.stringify(actionInfo)}' 
         id="r${row}_c${cell}_${traversalpath}_${actionLabel}" title="${actionLabel}" ng-reflect-color="primary" mat-stroked-button class="cs-mat-iconandlabelonly cs-nomargin mat-stroked-button mat-primary dropdown pointer"><em style="${valueStyle}" class="${actionIcon}"></em><span style="${labelStyle}" 
         class="cs-mat-btnlabel"> ${actionLabel} </span></button>`;
       } else if (actionDisplayType === 'Button') {
         outputTag += `<button style="${boxStyle}" action-view='button' stopdropdownclose=${stopDropDownClose} data-cs-dropdown="#cs-dropdown-${layoutId}"  action-info='${JSON.stringify(actionInfo)}' 
         id="r${row}_c${cell}_${traversalpath}_${actionLabel}" title="${actionLabel}" ng-reflect-color="primary" mat-stroked-button class="cs-mat-labelonly cs-nomargin mat-stroked-button mat-primary dropdown pointer"><span style="${labelStyle}" class="cs-mat-btnlabel">${actionLabel}</span></button>`;
       }else {
       outputTag += `<button style="${boxStyle}" action-view='button'isfab=${isFab} stopdropdownclose=${stopDropDownClose} data-cs-dropdown="#cs-dropdown-${layoutId}" action-info='${JSON.stringify(actionInfo)}' id="r${row}_c${cell}_${traversalpath}_${actionLabel}" title="${actionLabel}" class="cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true"><em style="${valueStyle}" class="${actionIcon}"></em></button>`;
     }
    }
  }
})


outputTag += `</div>`
return outputTag;
};


export const CspfmDataValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
  const translate = gridOptions.i18n;

  const columnDefinition = args && args.column;
  // Need to add the editor Params
  if ((value === null || value === undefined ||value === "" ||  (Array.isArray(value) && value.length === 0)) && columnDefinition.params.required) {
    return { valid: false, msg: 'This is a required field' };
  }else if(((Array.isArray(value) && value.length === 0) || value === null || value === undefined) && !columnDefinition.params.required ){
    return { valid: true, msg: '' };
  }
  if (columnDefinition.params.fieldInfo['fieldType'] === "MASTERDETAIL" ||
    columnDefinition.params.fieldInfo['fieldType'] === "LOOKUP" ||
    columnDefinition.params.fieldInfo['fieldType'] === 'URL' ||
    columnDefinition.params.fieldInfo['fieldType'] === 'EMAIL' ||
    columnDefinition.params.fieldInfo['fieldType'] === 'TEXT' ||
    columnDefinition.params.fieldInfo['fieldType'] === 'NUMBER' ||
    columnDefinition.params.fieldInfo['fieldType'] === "DECIMAL" ||
    columnDefinition.params.fieldInfo['fieldType'] === 'CHECKBOX' ||
    columnDefinition.params.fieldInfo['fieldType'] === "MULTISELECT"||
    columnDefinition.params.fieldInfo['fieldType'] === 'CURRENCY') {
    let fieldType = columnDefinition.params.fieldInfo['fieldType'];
    if (columnDefinition.params.fieldInfo['fieldType'] === "MASTERDETAIL" ||
      columnDefinition.params.fieldInfo['fieldType'] === "LOOKUP") {
      fieldType = columnDefinition.params.fieldInfo['child']['fieldType']
    } else {
      fieldType = columnDefinition.params.fieldInfo['fieldType']
    }
    if (fieldType === 'URL') {
      const urlFormatter = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$/;
      if (urlFormatter.test(value)) {
        if (columnDefinition.params.fieldlength) {
          if (value.length <= columnDefinition.params.fieldlength) {
            return { valid: true, msg: '' };
          } else {
            return { valid: false, msg: 'Enter Valid URL' };
          }
        } else {
          return { valid: true, msg: '' };
        }
      } else {
        return { valid: false, msg: 'Enter Valid URL' };
      }
    } else if (fieldType === 'EMAIL') {
      const emailFormatter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (emailFormatter.test(value)) {
        if (columnDefinition.params.fieldlength) {
          if (value.length <= columnDefinition.params.fieldlength) {
            return { valid: true, msg: '' };
          } else {
            return { valid: false, msg: 'Enter Valid Mail' };
          }
        } else {
          return { valid: true, msg: '' };
        }
      } else {
        return { valid: false, msg: 'Enter Valid Mail' };
      }
    } else if (fieldType === 'TEXT') {
      if (columnDefinition.params.fieldlength) {
        if (value.length <= columnDefinition.params.fieldlength) {
          return { valid: true, msg: '' };
        } else {
          return { valid: false, msg: 'Enter Valid String' };
        }
      } else {
        return { valid: true, msg: '' };
      }
    } else if (fieldType === 'NUMBER') {
      const numberValidatorPatter = /^((\d{1,18})|(\d{1,18})(\.{1}\d{1,15}))$/;
      if (numberValidatorPatter.test(value)) {
        return { valid: true, msg: '' };
      } else {
        return { valid: false, msg: 'Maximum value should not exceed 18 digits' };
      }
    } else if (fieldType === "DECIMAL" || fieldType === 'CURRENCY') {
      let decimalFieldValidation;
      let precisionValue;
      decimalFieldValidation = /^((\d{1,18})|(\d{1,18})(\.{1}\d{1,15}))$/.test(value);
      if (columnDefinition.params.precision && decimalFieldValidation) {
        if (columnDefinition.params.precision === 1) {
          precisionValue = /^\d+(\.\d{1,1})?$/.test(value);
        } else if (columnDefinition.params.precision === 2) {
          precisionValue = /^\d+(\.\d{1,2})?$/.test(value);
        } else if (columnDefinition.params.precision === 3) {
          precisionValue = /^\d+(\.\d{1,3})?$/.test(value);
        } else if (columnDefinition.params.precision === 4) {
          precisionValue = /^\d+(\.\d{1,4})?$/.test(value);
        } else if (columnDefinition.params.precision === 5) {
          precisionValue = /^\d+(\.\d{1,5})?$/.test(value);
        }
        if (precisionValue) {
          return { valid: true, msg: '' };
        }
        else {
          return { valid: false, msg: `Precison value should not exceed ${columnDefinition.params.precision} digits` };
        }
      }
      if (decimalFieldValidation) {
        return { valid: true, msg: '' };
      } else {
        return { valid: false, msg: 'Maximum value should not exceed 18 digits' };
      }

    } else if (fieldType === 'CHECKBOX' || fieldType === 'MULTISELECT') {
      if (value.length > 0) {
        return { valid: true, msg: '' };
      } else {
        return { valid: false, msg: 'Select atleast one value' };
      }
    }
  } else {
    return { valid: true, msg: '' };
  }
};

export const cspfmUrlDataFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: any,
  dataContext: any,
  grid: any
) => {
  if (
    columnDef["params"] &&
    columnDef["params"]["pipe"] &&
    columnDef["params"]["fieldInfo"]
  ) {
    const columnValue = columnDef["params"]["pipe"].transform(
      dataContext,
      columnDef["params"]["fieldInfo"]
    );
    let isDataFetching = grid["isDataFetching"];
    let isFirstBatch = grid["isFirstBatch"];
    let isLazyLoading = columnDef['params']['pipe'].getFieldValueFetchingStatus(dataContext, columnDef['params']['fieldInfo'])
   if (isFirstBatch || isLazyLoading && isDataFetching) {
      return cspfmSlickGridFormatter.SkeletonFormatter(
        row,
        cell,
        value,
        columnDef,
        dataContext,
        grid
      );
    }
    let layoutId = columnDef["params"]["layoutId"];
    let getFieldInfo = (fieldInfo: FieldInfo | "") => {
      if (
        fieldInfo["fieldType"] === "LOOKUP" ||
        fieldInfo["fieldType"] === "MASTERDETAIL" ||
        fieldInfo["fieldType"] === "HEADER"
      ) {
        return getFieldInfo(fieldInfo["child"]);
      } else {
        return fieldInfo;
      }
    };
    let fieldInfo = getFieldInfo(columnDef["params"]["fieldInfo"]);
    // let styleFromJson = fieldInfo["boxStyle"] + fieldInfo["valueStyle"];
    fieldInfo["actionInfo"] = fieldInfo["actionInfo"] || [];
    let layoutName = columnDef["params"]["layoutName"];
    let isInlineEditable = columnDef["params"]["isInlineEditable"];
    var outputTag = "";
    if (columnValue) {
      let displayValueArray = (columnValue["display"] || "").split(",");
      let urlValueArray = (columnValue["url"] || "").split(",");
      if (urlValueArray.length && urlValueArray !== "") {
        outputTag = `<div class="cs-slickgeid-mat-chip-listhead"><div class="cs-slickgeid-mat-chip-list cs-slick-flex-chip cs-overflow-chip cs-overflow-chiplist">`;
        var additionalChipValues = [];
        var extraPaddingWidth = 60;
        let fieldWidth = columnDef["width"];
        let moreButtonWidth = 35;
        var valueWidth = 0 + moreButtonWidth;
        let primaryChipCount = 0;

        urlValueArray.forEach((element, index) => {
          urlValueArray[index] = urlValueArray[index].trim();
          displayValueArray[index] = columnDef["params"][
            "pipe"
          ].htmlElementToString(displayValueArray[index]);
          urlValueArray[index] = columnDef["params"][
            "pipe"
          ].htmlElementToString(urlValueArray[index]);
          let selectedFieldLength = displayValueArray[index].length;
          valueWidth = valueWidth + selectedFieldLength * 8 + extraPaddingWidth;
          if (valueWidth < fieldWidth || index === 0) {
            outputTag += `<div class="cs-fullmaxwidth cs-vpad-4" id="url-data-formatter"><div style = "${fieldInfo["boxStyle"]}" class="cs-slickgeid-mat-chip cs-recordassociation-chip cs-url-chip cs-pr" title="${
                 displayValueArray[index] + ": " + urlValueArray[index]
               }"><div class="cs-ra-chip-parent cs-overflowhidden"><div class="cs-ra-chip-mainlabel cs-truncate" action-view='button'
                       action-info='${JSON.stringify(
                         fieldInfo["actionInfo"][0]
                       )}' isPageRedirectionDisabled=${true}><a style = "${fieldInfo["valueStyle"]}"  class="cs-url-link" id="${
                         "ACT_" +
                         layoutName +
                         "$$" +
                         fieldInfo.traversalpath +
                         "_chip" +
                         "_" +
                         row +
                         "_" +
                         cell +
                         "_" +
                         index
                       }" href="${urlValueArray[index]}" target="_blank"
                         data-title="${
                           displayValueArray[index] +
                           ": " +
                           urlValueArray[index]
                         }">${displayValueArray[index]}</a></div></div>`;
            if (isInlineEditable) {
              outputTag += `<div class="cs-gradient-chip"><button  id="${
                           "ACT_" +
                           layoutName +
                           "$$" +
                           fieldInfo.traversalpath +
                           "_edit_" +
                           row +
                           "_" +
                           cell +
                           "_" +
                           index
                         }" data-cs-dropdown="#cs-dropdown-${layoutId}" isMultiUrlField='${
                fieldInfo["isMultiUrlField"]
              }'
                         inputType="edit" fieldName='${
                           fieldInfo["fieldName"]
                         }' additionalChipValues='${JSON.stringify([
                {
                  displayValue: displayValueArray[index],
                  urlValue: urlValueArray[index],
                },
              ])}'
                         action-info='${JSON.stringify(
                           fieldInfo["actionInfo"][0]
                         )}' action-view='button' class="cs-display-none"
                         editRecordIndex=${index}><em class="icon-mat-edit"></em></button><button id="${
                           "ACT_" +
                           layoutName +
                           "$$" +
                           fieldInfo.traversalpath +
                           "_delete_" +
                           row +
                           "_" +
                           cell +
                           "_" +
                           index
                         }" data-cs-dropdown="#cs-dropdown-${layoutId}" isMultiUrlField='${
                fieldInfo["isMultiUrlField"]
              }'
                         inputType="delete" fieldName='${
                           fieldInfo["fieldName"]
                         }' additionalChipValues='${JSON.stringify([
                {
                  displayValue: displayValueArray[index],
                  urlValue: urlValueArray[index],
                },
              ])}'
                         action-info='${JSON.stringify(
                           fieldInfo["actionInfo"][0]
                         )}' action-view='button' class="cs-display-none"
                         editRecordIndex=${index}><em class="icon-mat-clear"></em></button></div>`;
            }
            outputTag += `</div></div>`;
            primaryChipCount = index;
          } else {
            additionalChipValues.push({
              displayValue: displayValueArray[index],
              urlValue: element.trim(),
            });
          }
        });
        outputTag += `</div>`;
        if (additionalChipValues.length > 0) {
          outputTag += `<div id="${
            "ACT_" +
            layoutName +
            "$$" +
            fieldInfo.traversalpath +
            "_additional_" +
            row
          }" class="cs-recordassociation-count cs-lmar-7" data-cs-dropdown="#cs-dropdown-${layoutId}"
             isMultiUrlField='${fieldInfo["isMultiUrlField"]}' inputType="${
            isInlineEditable ? "view" : "slickgrid-view"
          }"
             additionalChipValues='${JSON.stringify(
               additionalChipValues
             )}' fieldName='${fieldInfo["fieldName"]}'
             action-info='${JSON.stringify(
               fieldInfo["actionInfo"][0]
             )}' action-view='button' primaryChipCount=${primaryChipCount}><span class="cs-chipmore-btn cs-ts-12">+${
                 additionalChipValues.length
               }</span></div>`;
        }
        if (isInlineEditable && fieldInfo["isMultiUrlField"]) {
          outputTag += `<button hidden id="${
            "ACT_" + layoutName + "$$" + fieldInfo.traversalpath + "_add_" + row
          }" title="URL"class="cs-recordassociation-addbtn cs-url-list-addbtn"
             data-cs-dropdown="#cs-dropdown-${layoutId}" isMultiUrlField='${
            fieldInfo["isMultiUrlField"]
          }' inputType="add-entry"
             fieldName='${
               fieldInfo["fieldName"]
             }' action-info='${JSON.stringify(
            fieldInfo["actionInfo"][0]
          )}' action-view='button'><em class="icon-mat-add"></em></button>`;
          // `<div id="${'url_add_'+row}" class="cs-recordassociation-count cs-lmar-7"
          //   data-cs-dropdown="#cs-dropdown-${layoutId}" isMultiUrlField='${fieldInfo['isMultiUrlField']}' inputType="add-entry"
          //   fieldName='${fieldInfo['fieldName']}' action-info='${JSON.stringify(fieldInfo['actionInfo'][0])}' action-view='button'>
          //     <span class="cs-chipmore-btn cs-ts-12">+</span>
          // </div>`;
          // <button  id="${'url_add_'+row}" title="URL"class="cs-recordassociation-addbtn cs-pa"
          //   data-cs-dropdown="#cs-dropdown-${layoutId}" isMultiUrlField='${fieldInfo['isMultiUrlField']}' inputType="add-entry"
          //   fieldName='${fieldInfo['fieldName']}' action-info='${JSON.stringify(fieldInfo['actionInfo'][0])}' action-view='button'>
          //   <em class="icon-mat-add"></em>
          // </button>
        }
        outputTag += `</div>`;
        return outputTag;
      }
    } else {
      if (isInlineEditable) {
        outputTag += `<button hidden id="${
          "ACT_" + layoutName + "$$" + fieldInfo.traversalpath + "_add_" + row
        }" title="URL"class="cs-recordassociation-addbtn cs-url-list-addbtn"
         data-cs-dropdown="#cs-dropdown-${layoutId}" isMultiUrlField='${
          fieldInfo["isMultiUrlField"]
        }' inputType="add-entry"
         fieldName='${fieldInfo["fieldName"]}' action-info='${JSON.stringify(
          fieldInfo["actionInfo"][0]
        )}' action-view='button'><em class="icon-mat-add"></em></button>`;
        return outputTag;
      }
    }
  }
  return "";
};

export const CspfmDataMaskingFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any, grid: any) => {
 if (columnDef['params'] && columnDef['params']['pipe'] && columnDef['params']['fieldInfo']) {
   let layoutId = columnDef['params']['layoutId'];
   let columnValue = columnDef['params']['pipe'].transform(dataContext, columnDef['params']['fieldInfo']);
   columnValue = columnDef['params']['pipe'].htmlElementToString(columnValue)
   let getFieldInfo = (fieldInfo: FieldInfo | '') => {
     if (fieldInfo["fieldType"] === "LOOKUP" ||
       fieldInfo["fieldType"] === "MASTERDETAIL" ||
       fieldInfo["fieldType"] === "HEADER") {
       return getFieldInfo(fieldInfo["child"]);
     } else {
       return fieldInfo;
     }
   }
   let fieldInfo = getFieldInfo(columnDef["params"]["fieldInfo"]);
   columnValue = columnDef['params']['context']['formatMaskingField'](columnValue, columnDef['params']['maskingAttributes'], fieldInfo['fieldType']);
   let isDataFetching = grid['isDataFetching'];
   let isFirstBatch = grid['isFirstBatch'];
   let isLazyLoading = columnDef['params']['pipe'].getFieldValueFetchingStatus(dataContext, columnDef['params']['fieldInfo'])
   if (isFirstBatch || isLazyLoading && isDataFetching) {
      return cspfmSlickGridFormatter.SkeletonFormatter(row, cell, value, columnDef, dataContext, grid)
    }
    var styleFromJson='';
    if(columnValue){
      styleFromJson =fieldInfo["boxStyle"] +fieldInfo["valueStyle"];
    }
    let outputTag = '';
    if (columnDef['params']['cspfmEditorType'] === 'BALLOONUI') {
      outputTag += `<div class="cs-balloon-position" data-cs-dropdown="#cs-dropdown-${layoutId}">`
    }
    outputTag += `<div style = "${styleFromJson}" id="r${row}_${columnDef['params']['fieldInfo']['traversalpath']}"> ${columnValue} </div>`;
    if (columnDef['params']['cspfmEditorType'] === 'BALLOONUI') {
      outputTag += `</div>`
    }
    return outputTag;
 } else {
   return "";
 }
};
export interface StatusWorkflowOptions {
  defaultStatus: string;
  label: string;
  objectId:string;
  fieldName:string;
  objectConfig:any;
}

export type FieldInfo = BaseFieldInfo;

@Pipe({
  name: "cspfm_data_display"
})
export class cspfm_data_display implements PipeTransform {
  constructor(private datePipe: DatePipe, private currencyPipe: CurrencyPipe, private appUtilityObj: appUtility,private translate: TranslateService) { }

  transform(data: any, fieldInfo?: FieldInfo): any {
    if (fieldInfo) {
      return this.getFieldValue(data, fieldInfo);
    } else {
      return data;
    }
  }
 getFieldValueFetchingStatus(data, fieldInfo: FieldInfo | ""): boolean {
    if (fieldInfo === "" || !data) {
      return false;
    } else if (fieldInfo["fieldType"] === "LOOKUP" || fieldInfo['fieldType'] === "HEADER") {
      if (fieldInfo['child'] === "") {
        return false
      } else if (data[fieldInfo["fieldName"]] && typeof (data[fieldInfo["fieldName"]]) === 'object') {
        return this.getFieldValueFetchingStatus(data[fieldInfo["fieldName"]], fieldInfo['child'])
      } else if (data[fieldInfo["fieldName"]] && typeof (data[fieldInfo["fieldName"]]) === 'string') {
        return true
      }
    } else if (fieldInfo["fieldType"] === "MASTERDETAIL") {
      if (data[`cspfm_${fieldInfo["fieldName"]}_fetch_status` + appConstant['customFieldSuffix']['slickgrid']] === 'completed' && data[fieldInfo["fieldName"]] &&
        data[fieldInfo["fieldName"]].length > 0) {
        return this.getFieldValueFetchingStatus(
          data[fieldInfo["fieldName"]][0],
          fieldInfo["child"]
        );
      } else if (data[`cspfm_${fieldInfo["fieldName"]}_fetch_status` + appConstant['customFieldSuffix']['slickgrid']] === 'completed' && data[fieldInfo["fieldName"]] &&
        data[fieldInfo["fieldName"]].length === 0) {
        return false
      } else {
        return true
      }
    } else if (fieldInfo["fieldType"] === "RECORDASSOCIATION") {
      if (data[fieldInfo["fieldName"]]) {
        let value
        if (typeof (data[fieldInfo["fieldName"]]) === "string") {
          value = fieldInfo["fieldName"] + "-" + data[fieldInfo["fieldName"]]
          if (data[value]) {
            return false
          } else {
            return true
          }
        } else {
          let isRecordAssociationDatafetching = false
          data[fieldInfo["fieldName"]].forEach(recordAssociationObj => {
            value = fieldInfo["fieldName"] + "-" + recordAssociationObj
            if (!data[value]) {
              isRecordAssociationDatafetching = true
            }
          })
          return isRecordAssociationDatafetching
        }
      } else {
        return false
      }
    } else if (fieldInfo['fieldType'] === 'FORMULA') {
      if (data['cspfm_formula_fetch_status' + appConstant['customFieldSuffix']['slickgrid']] && data['cspfm_formula_fetch_status' + appConstant['customFieldSuffix']['slickgrid']] === 'completed') {
        return false
      } else {
        return true
      }
    } else if (fieldInfo['fieldType'] === 'ROLLUPSUMMARY') {
      if (data['cspfm_rollup_fetch_status' + appConstant['customFieldSuffix']['slickgrid']] && data['cspfm_rollup_fetch_status' + appConstant['customFieldSuffix']['slickgrid']] === 'completed') {
        return false
      } else {
        return true
      }
    }else {
      return false
    }
  }
  getFieldValue(data, fieldInfo: FieldInfo | "") {
    if (fieldInfo === "" || !data) {
      return "";
    }
    if (data[fieldInfo["fieldName"]] === null || !fieldInfo["fieldType"]) {
      return "";
    }
    if (
      fieldInfo["fieldType"] === "NUMBER" ||
      fieldInfo["fieldType"] === "DECIMAL") {
      if (data[fieldInfo["fieldName"]]) {
        return data[fieldInfo["fieldName"]];
      } else {
        return 0;
      }
    } else if ((fieldInfo["fieldType"] === "ROLLUPSUMMARY" && (fieldInfo["rollupResultType"] === "DECIMAL" || fieldInfo["rollupResultType"] === "NUMBER"))
      || (fieldInfo["fieldType"] === "FORMULA" && (fieldInfo["formulaType"] === "NUMBER"))) {
      if (data[fieldInfo["fieldName"]]) {
        if (fieldInfo['fileSizeMeasurment'] && fieldInfo['fileSizeMeasurment'] !== null && fieldInfo['fileSizeMeasurment'] !== '') {
          return Math.round(data[fieldInfo['fieldName']] * 1000) / 1000 + ' ' + fieldInfo['fileSizeMeasurment'];
        }else {
          return Math.round(data[fieldInfo['fieldName']] * 1000) / 1000;
        }
      }else if (data[fieldInfo['fieldName']] === undefined && fieldInfo['fileSizeMeasurment']) {
        return 0 + ' ' + fieldInfo['fileSizeMeasurment'];
      }else {
        return 0;
      }
    }else if (fieldInfo["fieldType"] === "CURRENCY" || (fieldInfo["fieldType"] === "ROLLUPSUMMARY" && fieldInfo["rollupResultType"] === "CURRENCY")
      || (fieldInfo["fieldType"] === "FORMULA" && fieldInfo["formulaType"] === "CURRENCY")) {
      if (data[fieldInfo["fieldName"]]) {
        return this.currencyPipe.transform(
          data[fieldInfo["fieldName"]], fieldInfo["currencyDetails"]['currencyCode'], fieldInfo["currencyDetails"]['display'], fieldInfo["currencyDetails"]['digitsInfo'], fieldInfo["currencyDetails"]['locale']);
      } else {
        return this.currencyPipe.transform(0, fieldInfo["currencyDetails"]['currencyCode'], fieldInfo["currencyDetails"]['display'], fieldInfo["currencyDetails"]['digitsInfo'], fieldInfo["currencyDetails"]['locale']);
      }
    } else if (
      fieldInfo["fieldType"] === "DATE" ||
      fieldInfo["fieldType"] === "TIMESTAMP" || (fieldInfo["fieldType"] === "ROLLUPSUMMARY" && (fieldInfo["rollupResultType"] === "DATE" || fieldInfo["rollupResultType"] === "DATETIME" || fieldInfo["rollupResultType"] === "TIMESTAMP"))
      || (fieldInfo["fieldType"] === "FORMULA" && (fieldInfo["formulaType"] === "DATE" || fieldInfo["formulaType"] === "TIMESTAMP"))
    ) {
      if (data[fieldInfo["fieldName"]]) {
        if (fieldInfo["fieldType"] === "TIMESTAMP" || fieldInfo["formulaType"] === "TIMESTAMP" || fieldInfo["rollupResultType"] === "TIMESTAMP") {
          let timeStampFieldValue = data[fieldInfo["fieldName"]]
          if (timeStampFieldValue instanceof Date) {
            timeStampFieldValue = timeStampFieldValue.getTime()
          }
          if (typeof timeStampFieldValue === "string") {
            timeStampFieldValue = this.appUtilityObj.getUtcTimeZoneMillsecondsFromDateTimeString(timeStampFieldValue,'user')
          }
          if (typeof timeStampFieldValue === "number") {
            return this.appUtilityObj.getDateTimeStringFromUtcMilliseconds(timeStampFieldValue, 'user')
          }
        } else {
          let dateFieldValue = data[fieldInfo["fieldName"]]
          if (dateFieldValue instanceof Date) {
            dateFieldValue = dateFieldValue.getTime() + moment.tz(Intl.DateTimeFormat().resolvedOptions().timeZone).utcOffset() * 60 * 1000
          }
          if (typeof dateFieldValue === "string") {
            dateFieldValue = this.appUtilityObj.getUtcMillisecondsFromDateString(dateFieldValue)
          }
          if (typeof dateFieldValue === "number") {
            return this.appUtilityObj.getDateStringFromUtcTimeZoneMilliseconds(dateFieldValue, fieldInfo["isDateConversionNeeded"])
          }
        }
      } else {
        return "";
      }
    } else if (fieldInfo["fieldType"] === "BOOLEAN" || (fieldInfo["fieldType"] === "ROLLUPSUMMARY" && fieldInfo["rollupResultType"] === "BOOLEAN")
      || (fieldInfo["fieldType"] === "FORMULA" && fieldInfo["formulaType"] === "BOOLEAN")) {
      if (data[fieldInfo["fieldName"]]!==null && data[fieldInfo["fieldName"]]!==undefined) {
        return data[fieldInfo["fieldName"]];
      } else {
        if (fieldInfo["fieldType"] === "ROLLUPSUMMARY" && fieldInfo["rollupResultType"] ==="BOOLEAN") {
          return fieldInfo["rollupDefaultValue"];
        } else {
          return false;
        }
      }
    } else if(fieldInfo["fieldType"] === "RICHTEXT"){
     if(data[fieldInfo["fieldName"]]){
    return  _.unescape(data[fieldInfo["fieldName"]])
     }else{
       return ""
     }
  
   }else if (
      fieldInfo["fieldType"] === "TEXT" ||
      fieldInfo["fieldType"] === "TEXTAREA" ||
      fieldInfo["fieldType"] === "EMAIL" ||
      fieldInfo["fieldType"] === "AUTONUMBER" ||
     (fieldInfo["fieldType"] === "ROLLUPSUMMARY" && (fieldInfo["rollupResultType"] ==="TEXT" || fieldInfo["rollupResultType"] ==="AUTONUMBER")) ||
      (fieldInfo["fieldType"] === "FORMULA" && fieldInfo["formulaType"] === "TEXT")
    ) {
      if (data[fieldInfo["fieldName"]]) {
        return data[fieldInfo["fieldName"]];
      } else {
        if (fieldInfo["fieldType"] === "ROLLUPSUMMARY" && (fieldInfo["rollupResultType"] === "TEXT")) {
          return fieldInfo["rollupDefaultValue"];
        } else {
          return "";
        }
      }
    } else if (fieldInfo["fieldType"] === "URL") {
      if (data[fieldInfo["fieldName"]]) {
        let type = '', display, url, value = data[fieldInfo["fieldName"]] || '';
        value = this.appUtilityObj.isValidJson(value);
        display = url = value;
        if (typeof value === 'object') {
          type = value['urlType'];
          data = value['urlDBValue'];
          if (type === 'single') {
            display = ((data.displayValue || '') === '') ? data.urlValue : data.displayValue;
            url = data.urlValue;
          } else if (type === 'multiple') {
            display = data.map(a => a.displayValue || a.urlValue);
            url = data.map(a => a.urlValue);
            display = display.toString();
            url = url.toString();
          }
        }
        if (fieldInfo["from"] === 'slickgrid') {
          return {
            actionInfo: fieldInfo["actionInfo"],
            display: display,
            url: url
          }
        }
        return {
          display: display,
          url: url
        }
      } else {
        return {
          display: '',
          url: ''
        };
      }
    } else if (fieldInfo["fieldType"] === "PASSWORD") {

      if (data[fieldInfo["fieldName"]]) {
        return data[fieldInfo["fieldName"]].replace(new RegExp("[^ ]", "g"), "*");
      } else {
        return '';
      }
    } else if (
      fieldInfo["fieldType"] === "MULTISELECT" ||
      fieldInfo["fieldType"] === "CHECKBOX"
    ) {
      var displayValue = [];
      if (data[fieldInfo["fieldName"]]) {
        const values = data[fieldInfo["fieldName"]];
        if (typeof (values) === 'string') {
          let modifiedValue;
          modifiedValue = values.split(',');
          for (const element of modifiedValue) {
            if (fieldInfo["mappingDetails"][element.trim()]) {
              displayValue.push(this.translate.instant(fieldInfo["mappingDetails"][element.trim()]));
            } else {
              displayValue = [];
              break;
            }
          }
        } else {
          for (const element of values) {
            if (fieldInfo["mappingDetails"][element]) {
              displayValue.push(this.translate.instant(fieldInfo["mappingDetails"][element.trim()]));
            } else {
              displayValue = [];
              break;
            }
          }
        }
      }
      if (displayValue.length > 0) {
        return displayValue.join(", ");
      } else {
        return "";
      }
    } else if (fieldInfo["fieldType"] === "LOOKUP" || fieldInfo['fieldType'] === "HEADER") {
      if (data[fieldInfo["fieldName"]]) {
        return this.getFieldValue(
          data[fieldInfo["fieldName"]],
          fieldInfo["child"]
        );
      } else {
        return "";
      }
    } else if (fieldInfo["fieldType"] === "COMMONLOOKUP") {
      if (data[fieldInfo["fieldName"]] && data[fieldInfo["fieldName"]] !== null) {
        const commonLookUpDropDownKeyValue = data[fieldInfo["commonLookupDropDownKey"]];
        const commonLookUpResultColumn = fieldInfo["commonLookUpMappingDetail"][commonLookUpDropDownKeyValue];
        const commonLookupObject = data[fieldInfo["fieldName"]]
        return commonLookupObject[commonLookUpResultColumn["field"]]
      } else {
        return "";
      }
    } else if (fieldInfo["fieldType"] === "MASTERDETAIL") {
      if (
        data[fieldInfo["fieldName"]] &&
        data[fieldInfo["fieldName"]].length > 0
      ) {
        return this.getFieldValue(
          data[fieldInfo["fieldName"]][0],
          fieldInfo["child"]
        );
      } else {
        return "";
      }
    } else if (
      fieldInfo["fieldType"] === "RADIO" ||
      fieldInfo["fieldType"] === "DROPDOWN" ||
      fieldInfo["fieldType"] === "STATUSWORKFLOW"
    ) {
      if (data[fieldInfo["fieldName"]] && data[fieldInfo["fieldName"]] !== "" && fieldInfo["mappingDetails"][data[fieldInfo["fieldName"]]]) {
        return this.translate.instant(fieldInfo["mappingDetails"][data[fieldInfo["fieldName"]]]);
      } else {
        return "";
      }
    } else if (fieldInfo["fieldType"] === "RECORDASSOCIATION") {

      var resultValuesArray = []

      if (fieldInfo && fieldInfo['associationInfo']) {
        let associationResultObject = {
          'fieldInfo': fieldInfo,
          'dataObject': data
        }
        return associationResultObject

      } else {
        if (data[fieldInfo["fieldName"]] && Array.isArray(data[fieldInfo["fieldName"]])) {
          data[fieldInfo["fieldName"]].forEach(element => {
            resultValuesArray.push(element)
          });
        }

        return resultValuesArray
      }
    }
  }

  actionButtonTagGeneration(actionInfos, layoutId, row) {
    var outputTag = `<div action-view='container'>`;
    actionInfos.forEach(actionInfo => {
      var actionDisplayType = actionInfo && actionInfo['actionDisplayType'] || 'Icon';
      var actionIcon = actionInfo && actionInfo['actionIcon'] || '';
      var actionLabel = actionInfo && actionInfo['actionLabel'] || '';
      const objectName = actionInfo && actionInfo['objectName'] || '';
      var buttonColor = actionInfo && actionInfo['buttonColor'] || 'var(--ion-color-primary)';
      var buttonText = actionInfo && actionInfo['buttonText'] || 'white';
      var buttonCss = actionInfo && actionInfo['buttonCss'] || '';
      var elementId = actionInfo.elementid || '';
      let traversalpath = actionInfo['traversalpath'] ? actionInfo['traversalpath'] : ""
      var isHiddenEnabled = actionInfo && actionInfo['isHiddenEnabled'] || 'N';
      if (isHiddenEnabled === "N") {
        if (actionDisplayType === 'IconandButton') {
          outputTag += `<button action-view='button' data-cs-dropdown="#cs-dropdown-${layoutId}" action-info='${JSON.stringify(actionInfo)}' id="r${row}_${traversalpath}_${actionLabel}" 
          title="${actionLabel}" ng-reflect-color="primary" mat-stroked-button class="cs-mat-iconandlabelonly cs-nomargin mat-stroked-button mat-primary dropdown pointer"><em class="${actionIcon}"></em><span class="cs-mat-btnlabel"> ${actionLabel} </span> </button>`;
        } else if (actionDisplayType === 'Button') {
          outputTag += `<button action-view='button' data-cs-dropdown="#cs-dropdown-${layoutId}"  action-info='${JSON.stringify(actionInfo)}' id="r${row}_${traversalpath}_${actionLabel}" 
          title="${actionLabel}" ng-reflect-color="primary" mat-stroked-button class="cs-mat-labelonly cs-nomargin mat-stroked-button mat-primary dropdown pointer"><span class="cs-mat-btnlabel">${actionLabel}</span></button>`;
        } else {
          outputTag += `<button action-view='button' data-cs-dropdown="#cs-dropdown-${layoutId}" action-info='${JSON.stringify(actionInfo)}' 
          id="r${row}_${traversalpath}_${actionLabel}" title="${actionLabel}" class="cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" 
          color="primary" mat-icon-button ng-reflect-disable-ripple="true"><em class="${actionIcon}"></em></button>`;
        }
      }
    })

    outputTag += `</div>`
    return outputTag
  }
  htmlElementToString(text:String):String{  
    const  format = /[&\[\]'"\\<>\/]+/;
    let value = text
    if(text && format.test(text.toString())){
     value = value.toString().
     replace(/&/g, '&amp;').
     replace(/</g, '&lt;').
     replace(/>/g, '&gt;').
     replace(/"/g, '&quot;').
     replace(/'/g, '&#039;');
    }

   return value;
 }

}
