/* 
 *   File: cs_whocolumn_icon.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
 import { DatePipe } from '@angular/common';
 import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
 import { appUtility } from 'src/core/utils/appUtility';
 import { metaDataDbProvider } from 'src/core/db/metaDataDbProvider';
 import { appConfiguration } from 'src/core/utils/appConfiguration';
 import { MdePopoverTrigger } from '@material-extended/mde';
 import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
 import { cspfmAlertDialog } from '../cspfmAlertDialog/cspfmAlertDialog';
 import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
 import { SlickgridPopoverService } from "../../services/slickgridPopover.service";
 import { cs_whocolumn_popover } from '../cs_whocolumn_popover/cs_whocolumn_popover';
 declare const $: any;
 declare const window: any;
 
 @Component({
   selector: 'cs-whocolumn-icon',
   templateUrl: './cs_whocolumn_icon.html',
   styleUrls: ['./cs_whocolumn_icon.scss'],
 })
 
 export class cs_whocolumn_icon implements OnInit {
   @ViewChild(MdePopoverTrigger) trigger: MdePopoverTrigger;
   selectedItem;
   iconName;
   iconClass;
   iconStyle;
   buttonStyle;
   labelStyle;
   objectName = '';
   iconElementId = '';
   metaDbProvider;
   values = [];
   auditType = '';
   viewArea = '';
   actionDisplayType = '';
   actionLabel = '';
   actionType = '';
   layoutId = '';
   auditfields = {};
   dripDownAttribute='';
   labelElementId='';
   buttonElementId='';
   public corUsersObjectHierarchyJSON = {
     'objectId': this.metaDbconfig.corUsersObject,
     'objectName': this.metaDbconfig.corUsersObject,
     'fieldId': 0,
     'objectType': "PRIMARY",
     'relationShipType': null,
     'childObject': []
   };
   
 
 
   constructor(
     public datePipe: DatePipe,
     public metaDbconfig: metaDbConfiguration,
     public apputilityobject: appUtility,
     private readonly metaDataDbProvider: metaDataDbProvider,
     public appConfiguration: appConfiguration,
     public dialog:MatDialog,
     public readonly cspfmMetaCouchDbProvider : cspfmMetaCouchDbProvider,
     private readonly slickgridpopoverservice: SlickgridPopoverService) {
   }
 
   @Input() set setInfo(item) {
     this.selectedItem = item;
   }
 
   @Input() set setIcon(iconName) {
     this.iconName = iconName;
   }
   
   @Input() set setIconStyle(iconStyle) {
     this.iconStyle = iconStyle;
   }
   @Input() set setButtonStyle(buttonStyle) {
   
     this.buttonStyle = buttonStyle;
 
   }
   @Input() set setLabelStyle(labelStyle) {
     this.labelStyle = labelStyle;
   }
   @Input() set setIconClass(iconClass) {
     this.iconClass = iconClass;
   }
   @Input() set setObjectName(objectName) {
     this.objectName = objectName;
   }
 
   @Input() set setType(type) {
     this.auditType = type;
   }
 
   @Input() set setIconElementId(elementId){
     this.iconElementId = elementId+'_icon';
     this.buttonElementId = elementId+'_button';
     this.labelElementId =  elementId+'_label';
 
   }
   @Input() set setViewArea(viewAreaName) {
     this.viewArea = viewAreaName;
   }
   @Input() set setActionDisplayType(actionDisplayTypeName) {
     this.actionDisplayType = actionDisplayTypeName;
   }
   @Input() set setActionLabel(actionLabelName) {
     this.actionLabel = actionLabelName;
   }
   @Input() set setSectionActionType(sectionActionType) {
     this.actionType = sectionActionType
   }
   @Input() set setLayoutId(layoutId){
     this.layoutId = layoutId
     this.dripDownAttribute = '#cs-dropdown-' + this.layoutId;
   }
   @Input() set setAuditField(field){
    this.auditfields = field
    
  }
 
   auditFieldTracking() {
     this.apputilityobject.webServiceCallForFieldTracking(this.selectedItem, this.auditfields).then(res => {
       const dialogConfig = new MatDialogConfig();
       dialogConfig.data = res;
       dialogConfig.autoFocus = false;
       this.dialog.open(cspfmAlertDialog, dialogConfig);
     });
   }
 
   closePopover() {
     this.trigger.togglePopover();
   }
 
 
   getUserName(userList, event) {
     let createByUserFirstName = '';
     let modifyeByUserFirstName = '';
     let createByUserImg = "";
     let modifyByUserImg = "";
 
     if (userList.length > 0) {
       let createByUserName = userList[0]['records'];
       if (this.selectedItem['createdby'] === this.selectedItem['lastmodifiedby']) {
         createByUserFirstName = createByUserName[0]['first_name'];
         modifyeByUserFirstName = createByUserName[0]['first_name'];
         modifyByUserImg = (createByUserImg = this.apputilityobject.getUserImageURL(this.selectedItem['createdby']));
       } else {
         let modifyByUserName = userList[1]['records'];
         createByUserFirstName = createByUserName[0]['first_name'];
         modifyeByUserFirstName = modifyByUserName[0]['first_name'];
         createByUserImg = this.apputilityobject.getUserImageURL(this.selectedItem['createdby']);
         modifyByUserImg = this.apputilityobject.getUserImageURL(this.selectedItem['lastmodifiedby']);
       }
     } else {
       createByUserFirstName = this.selectedItem['createdby'];
       modifyeByUserFirstName = this.selectedItem['lastmodifiedby'];
       createByUserImg = this.apputilityobject.getUserImageURL(this.selectedItem['createdby'])
       modifyByUserImg = this.apputilityobject.getUserImageURL(this.selectedItem['lastmodifiedby'])
     }
     let createdon = this.datePipe.transform(this.selectedItem['createdon'], 'medium');
     let lastmodifiedon = this.datePipe.transform(this.selectedItem['lastmodifiedon'], 'medium');
 
     if (createdon === lastmodifiedon) {
       this.values = [
         {
           'label1': 'Created By',
           'label2': createByUserFirstName,
           'label3': createdon,
           'icon': createByUserImg
         }
       ]
     } else {
       this.values = [
         {
           'label1': 'Created By',
           'label2': createByUserFirstName,
           'label3': createdon,
           'icon': createByUserImg
         },
         {
           'label1': 'Lastmodified By',
           'label2': modifyeByUserFirstName,
           'label3': lastmodifiedon,
           'icon': modifyByUserImg
         }
       ]
     }
   }
 
   getUserNameAgainstUserId(userid) {
     if (navigator.onLine) {
       const query = "type: " + this.metaDbconfig.corUsersObject + " AND " + "user_id: " + userid
       return this.cspfmMetaCouchDbProvider.fetchRecordsBySearchFilterPhrases(query, this.
         corUsersObjectHierarchyJSON).then(corUserResult => {
           return Promise.resolve(corUserResult);
         })
     } else {
       const options = {};
       const selector = {};
       selector['data.type'] = this.metaDbconfig.corUsersObject;
       selector['data.user_id'] = userid;
       options['selector'] = selector;
       this.corUsersObjectHierarchyJSON['options'] = options;
       return this.metaDataDbProvider.fetchDataWithReference(this.corUsersObjectHierarchyJSON).then(result => {
         return Promise.resolve(result);
       });
     }
   }
 
   iconClick(event) {
    event.stopPropagation();
    if(this.selectedItem === undefined || this.selectedItem ===null || !this.selectedItem || this.selectedItem.createdon === null){
      this.apputilityobject.showAlert(this,'No data found');
      return 
    }

   if (this.auditType === 'Detail') {
    let htmlElement: HTMLElement = document.getElementById('cs-dropdown-'+this.layoutId);
    if(htmlElement && htmlElement.innerHTML){
      htmlElement.innerHTML = '';
    }
    this.auditFieldTracking();
      return
    }

    let htmlElement: HTMLElement = document.getElementById('cs-dropdown-'+this.layoutId);
    if(htmlElement && htmlElement.innerHTML){
     htmlElement.innerHTML = "";
    }

    event.currentTarget.classList.add('cs-d-open-temp');
    window.$('.cs-d-open-temp').jqDropdown('show', ['.cs-dropdown']);
    this.slickgridpopoverservice.appendComponentToElement_View('cs-dropdown-' + this.layoutId,cs_whocolumn_popover,{
      setTitle:this.objectName,
      setItem:this.selectedItem,
     setType :this.auditType,
     setAuditField: this.auditfields
    })
    event.currentTarget.classList.remove('cs-d-open-temp');

  }
  
 
   ngOnInit() {
     setTimeout(() => {
       if(this.buttonStyle){
         document.getElementById(this.buttonElementId).setAttribute('style', this.buttonStyle);
       }
       if(this.iconStyle){
         document.getElementById(this.iconElementId).setAttribute('style', this.iconStyle);
       }
       if(this.labelStyle){
         document.getElementById(this.labelElementId).setAttribute('style', this.labelStyle);  
       }         
     }, 0);
 
    }
 
 }
 