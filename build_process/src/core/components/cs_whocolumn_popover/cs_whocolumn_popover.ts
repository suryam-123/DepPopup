

/* 
 *   File: cs_whocolumn_popover.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
import { appUtility } from 'src/core/utils/appUtility';
import { metaDataDbProvider } from 'src/core/db/metaDataDbProvider';
import { appConfiguration } from 'src/core/utils/appConfiguration';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { cspfmAlertDialog } from '../cspfmAlertDialog/cspfmAlertDialog';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
declare const $: any;
declare const window: any;

@Component({
  selector: 'cs-whocolumn-popover',
  templateUrl: './cs_whocolumn_popover.html',
  styleUrls: ['./cs_whocolumn_popover.scss'],
})
export class cs_whocolumn_popover implements OnInit {

  values = [];
  title = '';
  name = '';
  selectedItem = {};
  auditType = '';
  auditfields = {};
  public corUsersObjectHierarchyJSON = {
    'objectId': this.metaDbconfig.corUsersObject,
    'objectName': this.metaDbconfig.corUsersObject,
    'fieldId': 0,
    'objectType': 'PRIMARY',
    'relationShipType': null,
    'childObject': []
  };

  constructor(private readonly datepipe: DatePipe,
    public metaDbconfig: metaDbConfiguration,
    public apputilityobject: appUtility,
    private readonly metaDataDbProvider: metaDataDbProvider,
    public appConfiguration: appConfiguration,
    public dialog:MatDialog,
    public cspfmMetaCouchDbProvider : cspfmMetaCouchDbProvider) {
    
  }

  @Input() set setTitle(title) {
    this.title = title;
  }

  @Input() set setItem(item){
    this.selectedItem = item;
    this.name = item['name'];
  }

  @Input() set setType(type) {
    this.auditType = type;
  }

  @Input() set setAuditField(field) {
    this.auditfields = field;
  }

  auditFieldTracking() {
    this.apputilityobject.webServiceCallForFieldTracking(this.selectedItem, this.auditfields).then(res => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = res;
      dialogConfig.autoFocus = false;
      this.dialog.open(cspfmAlertDialog, dialogConfig);
    });
  }

  ngOnInit() { 
    let tasklist = [];

    if (this.selectedItem) {
      tasklist.push(this.getUserNameAgainstUserId(this.selectedItem['createdby']));
      if (this.selectedItem['createdby'] !== this.selectedItem['lastmodifiedby']) {
        tasklist.push(this.getUserNameAgainstUserId(this.selectedItem['lastmodifiedby']));
      }
      Promise.all(tasklist).then(result => {
        if (result.length === 1
          && result[0]['status'] === 'SUCCESS') {
          this.getUserName(result, event);
        }else if (result.length === 2
          && result[0]['status'] === 'SUCCESS'
          && result[1]['status'] === 'SUCCESS') {
          this.getUserName(result, event);
        }else {
          this.getUserName([], event);
        }
      }).catch(err => {
        this.getUserName([], event);
      });
    }
  }

  getUserName(userList, event) {
    let createByUserFirstName = '';
    let modifyeByUserFirstName = '';
    let createByUserImg = '';
    let modifyByUserImg = '';

    if (userList.length > 0) {
      let createByUserName = userList[0]['records'];
      if (this.selectedItem['createdby'] === this.selectedItem['lastmodifiedby']) {
        createByUserFirstName = createByUserName[0]['first_name'];
        modifyeByUserFirstName = createByUserName[0]['first_name'];
        modifyByUserImg = (createByUserImg = this.apputilityobject.getUserImageURL(this.selectedItem['createdby']));
      }else {
        let modifyByUserName = userList[1]['records'];
        createByUserFirstName = createByUserName[0]['first_name'];
        modifyeByUserFirstName = modifyByUserName[0]['first_name'];
        createByUserImg = this.apputilityobject.getUserImageURL(this.selectedItem['createdby']);
        modifyByUserImg = this.apputilityobject.getUserImageURL(this.selectedItem['lastmodifiedby']);
      }
    }else {
      createByUserFirstName = this.selectedItem['createdby'];
      modifyeByUserFirstName = this.selectedItem['lastmodifiedby'];
      createByUserImg = this.apputilityobject.getUserImageURL(this.selectedItem['createdby']);
      modifyByUserImg = this.apputilityobject.getUserImageURL(this.selectedItem['lastmodifiedby']);
    }
    let createdon = this.datepipe.transform(this.selectedItem['createdon'], this.apputilityobject.userDateTimeFormat,this.apputilityobject.userZoneOffsetValue);
    let lastmodifiedon = this.datepipe.transform(this.selectedItem['lastmodifiedon'], this.apputilityobject.userDateTimeFormat,this.apputilityobject.userZoneOffsetValue);

    if (createdon === lastmodifiedon) {
      this.values = [
        {
          'label1': 'Created By',
          'label2': createByUserFirstName,
          'label3': createdon,
          'icon': createByUserImg
        }
      ];
    }else { 
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
    
   setTimeout(()=>{
      window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
    },100);
  }

  getUserNameAgainstUserId(userid) {
    if (navigator.onLine) {
      const query = 'type: ' + this.metaDbconfig.corUsersObject + ' AND ' + 'user_id: ' + userid;
      return this.cspfmMetaCouchDbProvider.fetchRecordsBySearchFilterPhrases(query,
         this.corUsersObjectHierarchyJSON).then(corUserResult => {
        return Promise.resolve(corUserResult);
      });
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
}
