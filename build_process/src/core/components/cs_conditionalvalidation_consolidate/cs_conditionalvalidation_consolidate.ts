/* 
 *   File: cs_conditionalvalidation_consolidate.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

 import { Component, OnInit,  Input, Output, EventEmitter, Inject,OnChanges } from '@angular/core';
 import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
 import { appUtility } from 'src/core/utils/appUtility';
 

@Component({
  selector: 'cs_conditionalvalidation_consolidate',
  templateUrl: './cs_conditionalvalidation_consolidate.html',
  styleUrls: ['./cs_conditionalvalidation_consolidate.scss'],
})
export class cs_conditionalvalidation_consolidate implements OnInit, OnChanges {

  // Consolidate
  @Input() messageType = '';
  @Input() errorSet = {};
  @Input() viewMode = '';
  @Input() row = '';
  @Input() sectionName = '';
  @Input() actionLookupCriteria = {};
  @Input() set actionConsolidateMessage(name) {
    this.actionConsolidateMessageType = (name !== undefined && name !== null) ? name : "";
    this.sectionType = this.actionConsolidateMessageType['sectionType'] || 'GRID';
    this.dataContext = this.actionConsolidateMessageType['dataContext'] || {};
    if ((this.messageType !== "Information") && (this.messageType !== "Warning") && (this.messageType !== "Error")) {
     setTimeout(() => {
       this.consolidatePositionSet();
     }, 100);
   }
   
 }
  @Input() fieldConsolidateMessage = {};
  @Input() actionId = '';
  @Output() skipValidation: EventEmitter<{ actionId: string, messageType: string,
    message: any}> = new EventEmitter();
  @Output() showValidationField: EventEmitter<{ messageType: string,
      message: any, fieldname: any}> = new EventEmitter();
  messageObject;  
  private sectionType: 'LIST' | 'GRID' = 'GRID';
  private dataContext;
  actionConsolidateMessageType;
  i;
  checked;
  index;
  IndexObj;
  fieldSet;
  errorRecords;
  displayName;
  indexPositionNumber
  objectId;
  validationtype;
  successObjectMesg;
  errorObjectMesg;
  // Alert, Confirmation
  title: string;
  description: string;
  buttonInfo: any;
  parentContext: any;
  displayType: string;
  validationObject: any;
  public showConsolidate = false;
  public errorCount = 0;
  constructor(public appUtilityConfig : appUtility,
    @Inject(MAT_DIALOG_DATA) data, private readonly dialogRef: MatDialogRef<cs_conditionalvalidation_consolidate>) {

      // Alert, Confirmation
    this.title = data['title'];
    this.description = data['description'];
    this.buttonInfo = data['buttonInfo'];
    this.parentContext = data['parentContext'];
    this.messageType = data['messageType'];
    this.displayType = data['displayType'];
    this.validationObject = data['validationObject'];

    if (this.messageType !== 'Consolidate') {
      dialogRef.disableClose = true;
    }
    if ((this.messageType !== 'Information') && (this.messageType !== 'Warning') && (this.messageType !== 'Error')) {
      setTimeout(() => {
        this.consolidatePositionSet();
      }, 100);
    }
  }
  toggleConsolidate() {
    this.showConsolidate = !this.showConsolidate;
    this.consolidateHeightSet();
  }
  consolidatePositionSet() {
    // General
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const matToolBarHeight = 50;
    // Find is it a popup_page are normal_page
    if (document.getElementsByTagName('mat-dialog-container')[0]) {
      // popup_Page
      const popupHeight = document.getElementsByTagName('mat-dialog-container')[0]['offsetHeight'];
      const popupWidth = document.getElementsByTagName('mat-dialog-container')[0]['offsetWidth'];
      const actualTop = (windowHeight - popupHeight) / 2 + matToolBarHeight + 12;
      const actualRight = (windowWidth - popupWidth) / 2 + 27;
      let position = document.getElementsByClassName('cs-consolidate-view');
      Array.from(position as HTMLCollectionOf<HTMLElement>)[0].style.top = actualTop + 'px';
      Array.from(position as HTMLCollectionOf<HTMLElement>)[0].style.right = actualRight + 'px';
    } else {
      // Normal Page
      let position = document.getElementsByClassName('cs-consolidate-view');
      //Noted
      // Array.from(position as HTMLCollectionOf<HTMLElement>)[0].style.top = 70 + 'px';
      // Array.from(position as HTMLCollectionOf<HTMLElement>)[0].style.right = 7 + 'px';
    }
  }
  consolidateHeightSet() {
    let toggleWidthAdjust = document.getElementsByClassName('cs-consolidate-view-indicater');
    let consolidateViewbg=document.getElementsByClassName('cs-consolidate-view');
    let contentBody=document.getElementsByClassName('cs-scroll-body');
    const matToolBarHeight = 50;
    const headerHeight = 65;
    const windowHeight = window.innerHeight;

    if (this.showConsolidate) {
      contentBody[0].classList.add("cs-consolidate-append-width");
      consolidateViewbg[0].classList.add("cs-consolidate-view-bg");
      toggleWidthAdjust[0].classList.add("cs-consolidate-view-indicater-viewmode");
      Array.from(toggleWidthAdjust as HTMLCollectionOf<HTMLElement>)[0].style.width = 25 + 'px';
      if (document.getElementsByTagName('mat-dialog-container')[0] !== undefined) {
        const popupHeight = document.getElementsByTagName('mat-dialog-container')[0]['offsetHeight'];
        setTimeout(() => {
          const setHeight = document.getElementsByClassName('cs-con-mat-tab-group');
          Array.from(setHeight as HTMLCollectionOf<HTMLElement>)[0].style.height = popupHeight - matToolBarHeight - 30 + 'px';
        });
      } else {
        setTimeout(() => {
          const setHeight = document.getElementsByClassName('cs-con-mat-tab-group');
          Array.from(setHeight as HTMLCollectionOf<HTMLElement>)[0].style.height = windowHeight
           - matToolBarHeight - headerHeight + 'px';//Noted
        }, 100);
      }
    } else {
      contentBody[0].classList.remove("cs-consolidate-append-width");
      consolidateViewbg[0].classList.remove("cs-consolidate-view-bg");
      toggleWidthAdjust[0].classList.remove("cs-consolidate-view-indicater-viewmode")
      Array.from(toggleWidthAdjust as HTMLCollectionOf<HTMLElement>)[0].style.width = 45 + 'px';
    }
  }

  ngOnInit() {
   this.commonValidation();
  }

  ngOnChanges() {  
    this.commonValidation();    
}
commonValidation(){
  if (this.messageType === 'Consolidate') {
    this.showValidationMessage();
  }
  else if (this.viewMode === 'fullViewMode'){
    this.fullviewMode();
  }
  else if (this.viewMode === 'sectionViewMode'){
    this.sectionviewMode();
  }
  else if (this.viewMode === 'RecordViewMode'){
    this.RecordViewMode();
  }
  else if (this.actionConsolidateMessageType['messageType'] === 'UniqueError' || this.actionConsolidateMessageType['messageType'] === 'CompositeError' || 
  this.actionConsolidateMessageType['messageType'] === 'CouchdbError' || this.actionConsolidateMessageType['messageType'] === 'LookupCriteriaError'
  || this.actionConsolidateMessageType['messageType'] === 'AssociationCriteriaError'){
    this.showUniqueAndCompositeErrorMessage();        
  }
  else if (this.actionConsolidateMessageType['messageType'] === 'parentAndChaildObjectError'){
    this.showParentAndChaildObjectErrorMessage();
  }
}

  showUniqueAndCompositeErrorMessage(){    
    this.messageObject = this.actionConsolidateMessageType['validationFailureSet'];
    this.objectId = this.actionConsolidateMessageType['objectId'];
    this.messageType = this.actionConsolidateMessageType['messageType'];
    this.validationFieldCount();
    setTimeout(() => { 
      this.showConsolidate = false;           
      this.toggleConsolidate();
    }, 100);
    
  }
  fullviewMode(){
    this.IndexObj = {};
    this.checked = false;
    this.actionConsolidateMessageType.forEach(section => {
      this.IndexObj[section['sectionName']] = 0;
    })
    console.log('index', this.IndexObj)
    this.messageObject = this.actionConsolidateMessageType;   
    setTimeout(() => { 
      this.showConsolidate = false;           
      this.toggleConsolidate();
    }, 100);
    
  }

  sectionviewMode(){
    this. i = 0;
    this.checked = true;
    if (this.row){
      this.i = this.row;
    }else{
      this.i = 0;
    }    
    let errorSections = this.actionConsolidateMessageType;
    let indexNumber = Number
    errorSections.forEach(section => {
      if (section['sectionName'] === this.sectionName){
        indexNumber = errorSections.indexOf(section)
        this.messageObject = section;
      }
    })
    this.index = indexNumber;
    // this.messageObject = this.actionConsolidateMessageType;
    setTimeout(() => { 
      this.showConsolidate = false;           
      this.toggleConsolidate();
    }, 100);
  }

  RecordViewMode(){
    this.messageObject = this.actionConsolidateMessageType['validationFailureSet'];
    setTimeout(() => { 
      this.showConsolidate = false;           
      this.toggleConsolidate();
    }, 100);
  }

  indexPosition(){    
    let id = this.actionConsolidateMessageType['dataContext']['id']
    for (let i = 0; i < this.errorRecords.length; i++) {
      let singleSet = this.errorRecords[i];
      if (singleSet['id'] == id){
        this.indexPositionNumber = i;
      }
    }
    console.log('this.indexPositionNumber', this.indexPositionNumber);
  }
  nextRecordClickInFullView(data, index, sectionName){
    index = index + 1; 
    index = index % data.length; 
    this.IndexObj[sectionName] = index;
    
  }
  previousRecordClickInFullView(data, index, sectionName){    
    if (index === 0) { 
      index = data.length; 
    }
    index = index - 1; 
    this.IndexObj[sectionName] = index;
    console.log('index',this.IndexObj);
    // this.fieldSet = data[index];
  }
  checkboxClick(values:any):void{ 
    console.log(values.checked);
    if(values.checked){
      this.viewMode = 'sectionViewMode';
      this.sectionName = this.actionConsolidateMessageType[0]['sectionName']
      this. i = 0;
      let errorSections = this.actionConsolidateMessageType;
      let indexNumber = Number
      errorSections.forEach(section => {
      if (section['sectionName'] === this.sectionName){
        indexNumber = errorSections.indexOf(section)
        this.messageObject = section;
      }
    })
    this.index = indexNumber;
    }else{
      this.viewMode = 'fullViewMode';     
      this.fullviewMode()
    }    
  }
  previousRecordClick(){
    if (this.i === 0) { 
      this.i = this.actionConsolidateMessageType[this.index]['errorRecords'].length; 
    }
    this.i = this.i - 1; 
  }
  nextRecordClick(){
    this.i = this.i + 1; 
    this.i = this.i % this.actionConsolidateMessageType[this.index]['errorRecords'].length; 
    setTimeout(() => { 
      this.showConsolidate = false;           
      this.toggleConsolidate();
    }, 100);    
  }
  previousButtonClick(){
    if (this.index === 0) { 
      this.index = this.actionConsolidateMessageType.length; 
    }
    this.index = this.index - 1; 
    this.messageObject = this.actionConsolidateMessageType[this.index];
    setTimeout(() => { 
      this.showConsolidate = false;           
      this.toggleConsolidate();
    }, 100);   
  }
  nextButtonClick(){
    this.index = this.index + 1; 
    this.index = this.index % this.actionConsolidateMessageType.length; 
    this.index = this.index;
    this.messageObject = this.actionConsolidateMessageType[this.index];
    setTimeout(() => { 
      this.showConsolidate = false;           
      this.toggleConsolidate();
    }, 100);
   
  }

  validationFieldCount(){
    if (this.messageObject && this.messageObject !== null &&
  this.messageObject.length !== undefined) {
    this.errorCount =  this.messageObject.length;
  }
  }

  selectFailureField(failureField){
    if (this.sectionType === 'LIST') {
      this.rowButtonOnclick(failureField,'LIST_ERROR')
      return;
    }
    setTimeout(() => {         
        if(failureField['fieldType'] === 'LOOKUP')  {
            const validationFieldFieldname = failureField['fieldName'];
            const validationFieldId = this.objectId+'_'+validationFieldFieldname;

            const focusField = document.getElementById(validationFieldId).querySelector("[formControlName='" + validationFieldFieldname +"_searchKey']")
            const focusFieldId = focusField.id;  
            const textfocus = document.getElementById(focusFieldId);
            if (textfocus != null) {
                textfocus.focus();
            }

          }else if(failureField['fieldType'] === 'CHECKBOX'){

            const validationFieldFieldname = failureField['fieldName'];        
            const validationFieldId = this.objectId+'_'+validationFieldFieldname;

            const focusField = document.getElementById(validationFieldId).querySelector('mat-checkbox');
            const focusFieldId = focusField.id;  

            const textfocus = document.getElementById(focusFieldId);
            
            if (textfocus !== null) {

              textfocus.focus();
              textfocus.classList.add('cdk-keyboard-focused');
              textfocus.scrollIntoView();
            }

        }else if(failureField['fieldType'] === 'RADIO'){

          let validationFieldFieldname = failureField['fieldName'];        
          let validationFieldId = this.objectId+'_'+validationFieldFieldname;

          let focusField = document.getElementById(validationFieldId).querySelector('mat-radio-button')
          const focusFieldId = focusField.id;  

          const textfocus = document.getElementById(focusFieldId);
          
          if (textfocus !== null) {

            textfocus.focus();
            textfocus.classList.add('cdk-keyboard-focused');
            textfocus.scrollIntoView();
          }
        }else{
            let validationFieldFieldname = failureField['fieldName'];        
            let validationFieldId = this.objectId+'_'+validationFieldFieldname;

            let focusField = document.getElementById(validationFieldId).querySelector("[formControlName='" + validationFieldFieldname + "']");
            const focusFieldId = focusField.id;   

            const textfocus = document.getElementById(focusFieldId);
            
            
            if (textfocus !== null) {
              
                textfocus.focus();                
            }
        }


    }, 500);

  }

  multilineEntryFailureField(failureField, fieldname?){
    if (failureField['sectionType'] === 'LIST') {
      this.rowButtonOnclick(failureField,'LIST_ERROR', fieldname)
      return;
    }
    setTimeout(() => {
      if (failureField['fieldType'] == 'LOOKUP') {
        const validationFieldFieldname = failureField['fieldName'];
        let objectId = '';
        let object = failureField['objectId']
        let string = object.toString()
        let objectStructure = string.slice(0, 3)
        if (objectStructure == 'pfm') {
          objectId = failureField['objectId'];
        } else {
          objectId = 'pfm' + failureField['objectId'];
        }

        const validationFieldId = objectId + '_' + validationFieldFieldname;

        const focusField = document.getElementById(validationFieldId).querySelector("[formControlName='" + validationFieldFieldname + "_searchKey']");
        const focusFieldId = focusField.id;
        const textfocus = document.getElementById(focusFieldId);
        if (textfocus != null) {
          textfocus.focus();
        }

      } else if (failureField['fieldType'] == 'CHECKBOX') {

        const validationFieldFieldname = failureField['fieldName'];
        let objectId = '';
        let object = failureField['objectId']
        let string = object.toString()
        let objectStructure = string.slice(0, 3)
        if (objectStructure == 'pfm') {
          objectId = failureField['objectId'];
        } else {
          objectId = 'pfm' + failureField['objectId'];
        }

        const validationFieldId = objectId + '_' + validationFieldFieldname;

        const focusField = document.getElementById(validationFieldId).querySelector('mat-checkbox');
        const focusFieldId = focusField.id;

        const textfocus = document.getElementById(focusFieldId);

        if (textfocus != null) {

          textfocus.focus();
          textfocus.classList.add('cdk-keyboard-focused');
          textfocus.scrollIntoView();
        }

      } else if (failureField['fieldType'] === 'RADIO') {

        let validationFieldFieldname = failureField['fieldName'];

        let objectId = '';
        let object = failureField['objectId']
        let string = object.toString()
        let objectStructure = string.slice(0, 3)
        if (objectStructure == 'pfm') {
          objectId = failureField['objectId'];
        } else {
          objectId = 'pfm' + failureField['objectId'];
        }

        let validationFieldId = objectId + '_' + validationFieldFieldname;

        let focusField = document.getElementById(validationFieldId).querySelector('mat-radio-button');
        const focusFieldId = focusField.id;

        const textfocus = document.getElementById(focusFieldId);

        if (textfocus != null) {

          textfocus.focus();
          textfocus.classList.add('cdk-keyboard-focused');
          textfocus.scrollIntoView();
        }
      } else {
        let validationFieldFieldname = failureField['fieldName'];
        let objectId = '';
        let object = failureField['objectId']
        let string = object.toString()
        let objectStructure = string.slice(0, 3)
        if (objectStructure == 'pfm') {
          objectId = failureField['objectId'];
        } else {
          objectId = 'pfm' + failureField['objectId'];
        }
        let validationFieldId = objectId + '_' + validationFieldFieldname;

        let focusField = document.getElementById(validationFieldId).querySelector("[formControlName='" + validationFieldFieldname + "']");
        const focusFieldId = focusField.id;

        const textfocus = document.getElementById(focusFieldId);


        if (textfocus != null) {
          if(failureField["fieldType"] === "BOOLEAN"){
            textfocus.focus();
            textfocus.classList.add('cdk-keyboard-focused');
            textfocus.scrollIntoView();
          }else{
            textfocus.focus();
          } 
        }
      }


    }, 500);

  }

  showParentAndChaildObjectErrorMessage(){    
    this.messageObject = this.actionConsolidateMessageType['validationFailureSet'];
    this.objectId = this.actionConsolidateMessageType['objectId'];
    this.validationtype = this.actionConsolidateMessageType['validationtype'];
    this.successObjectMesg = this.actionConsolidateMessageType['successObjectMesg'];
    this.messageType = this.actionConsolidateMessageType['messageType'];
    setTimeout(() => { 
      this.showConsolidate = false;           
      this.toggleConsolidate();
    }, 100);
    
  }

  showValidationMessage() {   

    if (this.actionId.length > 0) { // Show Action Consolidate Message
      this.messageObject = this.actionConsolidateMessageType[this.actionId];
    } else { // Show Field Consolidate Message
      this.messageObject = this.fieldConsolidateMessage;
    }
    
  }
  okButtonOnclick(messageObject, messageTypes) {
    this.skipValidation.emit({
      actionId: this.actionId,
      messageType: messageTypes,
      message: messageObject
    })
    
  }

  rowButtonOnclick(messageObject, messageTypes, fieldname?) {    
    this.showValidationField.emit({
      messageType: messageTypes,
      message: messageObject,
      fieldname: fieldname
    });
  }

  close(buttonInfo) {
    const data = {
      messageType: this.messageType,
      displayType: this.displayType,
      message: this.validationObject
    };
      this.dialogRef.close(data);
  }
  toggleAccordian() {
    var acc = document.getElementsByClassName("cs-error-accordion");
    var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
     
    } else {
      panel.style.display = "block";
    }
  });
}
}
toggleAccordianerr(event) {
  event.currentTarget.classList.toggle("cs-toggle-active"); 
  var panel = event.currentTarget.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";  
    }
}
}
