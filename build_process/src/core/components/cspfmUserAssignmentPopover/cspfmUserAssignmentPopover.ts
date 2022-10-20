/* 
 *   File: cspfmUserAssignmentPopover.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input, HostListener } from '@angular/core';

  import { objectTableMapping } from 'src/core/pfmmapping/objectTableMapping';
  import { appUtility } from 'src/core/utils/appUtility';
  import { appConfiguration } from 'src/core/utils/appConfiguration';
  import { cspfmObjectConfiguration } from 'src/core/pfmmapping/cspfmObjectConfiguration'
  import { cspfmUserAssignmentService } from 'src/core/services/cspfmuserAssigment.service';
  import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
  import { metaDataDbProvider } from 'src/core/db/metaDataDbProvider';
  import { dbConfiguration } from 'src/core/db/dbConfiguration';
  import { cspfmLayoutConfiguration } from 'src/core/pfmmapping/cspfmLayoutConfiguration';
  import { cspfm_data_display } from 'src/core/pipes/cspfm_data_display';
  import { dataProvider } from 'src/core/utils/dataProvider';
  import { couchdbProvider } from 'src/core/db/couchdbProvider';
  import * as lodash from 'lodash';
  
  
  declare var $: any;
  
  @Component({
    selector: 'cspfmUserAssignmentPopover',
    templateUrl: './cspfmUserAssignmentPopover.html',
    styleUrls: ['./cspfmUserAssignmentPopover.scss'],
  })
  
  export class cspfmUserAssignmentPopover implements OnInit {
  
    public showUserIcon;
    public iconName;
    public isHeaderAction = false;
    public elementId = ""
    public isDataLoading:boolean = false;
    constructor(
  
      public objectTableMappingObj: objectTableMapping,
  
      public appUtilityConfig: appUtility,
      private appConfig: appConfiguration,
      public cspfmObjectConfig: cspfmObjectConfiguration,
      private userAssignmentService: cspfmUserAssignmentService,
      private metaDbConfig: metaDbConfiguration,
      private metaDbProvider: metaDataDbProvider,
      private dbConfig: dbConfiguration,
      private cspfmLayoutConfig: cspfmLayoutConfiguration,
      public cspfmDataDisplay: cspfm_data_display,
      private dbService: dataProvider,
      private couchPr: couchdbProvider
  
    ) {
  
    }
  
    public assignmentConfigJson: Object = {}
    public userAssignmentConfigTypeList: Array<string> = []
    public userAssignmentRecordParseList = []
    public userAssignmentDataList = {}
    public userAssignmentTempDataList = {}
    public selectedObject = {}
    public userAssignmentConfigMode;
    public masterMapping = { "User": {}, "Role": {}, "Group": {},"Responsibilities":{} }
    public userGroupList = []
    public corUserDataList = []
    public corRoleDataList = []
    public searchKey = ''
  public layoutName = ''
    @Input() set setIcon(iconName) {
      this.iconName = iconName;
    }
    public actionIdInfo;
    @Input() set actionId(actionId) {
      this.actionIdInfo = actionId;
    }
  
    public layoutIdInfo;
    @Input() set layoutId(layoutId) {
      this.layoutIdInfo = this.getLayoutId(layoutId);
    }
  
  
    @Input() set dataObject(data) {
      $('.cs-userlisthoverblock').hide();
      this.selectedObject = data;   
        if (this.selectedObject && this.selectedObject['type']) {
          this.getAssignmentInfo()
        }
    }
  
    @Input() set setIsHeaderAction(isHeaderAction) {
      this.isHeaderAction = isHeaderAction;
    }
  
    ngOnInit() {
      setTimeout(function () {
        var userAssignSaveBtn = document.getElementsByClassName("cs-userassign-save-btn");
        console.log(userAssignSaveBtn);
        if (userAssignSaveBtn) {
              userAssignSaveBtn[0].addEventListener('click', function (e: Event) {
              document.getElementsByClassName('cdk-overlay-container')[0].classList.add('cs-userassign-overlay');
              e.stopPropagation();
            });
        }
      }, 1000);
      setTimeout(()=>{
        var ulWidth:HTMLElement = document.getElementsByClassName("tabs__tab-bar")[0] as HTMLElement;
        var uloffsetWidth = ulWidth.offsetWidth;
        var widthTop = document.getElementsByClassName("cs-userassign-userprofile")[0] as HTMLElement;
        widthTop.style.maxWidth = uloffsetWidth + 'px';
        var widthBottom: any = document.getElementsByClassName('cs-tab-back-none');
          for (var i = 0; i < widthBottom.length; i++ ) {
             widthBottom[i].style.maxWidth = uloffsetWidth + 'px';
          }
      }, 100);
    }
  
    getLayoutId(id) {
     if (id.includes('_preview')) {
       return id.slice(0, -8);
     } else {
       return id;
     }
   }
    showMoreUserContent() {
      this.showUserIcon = !this.showUserIcon;
    }
    public showGroupContent;
    showMoregroupContent() {
      this.showGroupContent = !this.showGroupContent;
    }
    public showRoleContent;
    showMoreroleContent() {
      this.showRoleContent = !this.showRoleContent;
    }
    public showResponseContent;
    showMoreResponseContent() {
      this.showResponseContent = !this.showResponseContent;
    }
    public showResponsibilitiesContent
    showMoreResponsibilitiesContent() {
      this.showResponsibilitiesContent = !this.showResponsibilitiesContent;
    }
  
    public corGroupDataTempList = []
   
    public corResponseList = []
    public corResponseTempList = []
   
   
    corUserDataTempList = []
    checkUserRecordFetched(){
    if(!this.userAssignmentDataList['User']){
      return false
    }
    if (this.corUserDataTempList.length > 0) {
                      
      let userIdList = []
      this.userAssignmentDataList['User'].map(el =>  userIdList.push(el['user_id']))
      if (this.searchKey === '') {
   
        for(let i =0;i<this.corUserDataTempList.length;i++){
          if(userIdList.indexOf(this.corUserDataTempList[i]['user_id'])===-1){
             this.corUserDataList .push(this.corUserDataTempList[i])
          }
        }
      }else{
    
      for(let i =0;i<this.corUserDataTempList.length;i++){
        if(userIdList.indexOf(this.corUserDataTempList[i]['user_id'])===-1 && this.corUserDataTempList[i]['username'].toLowerCase().includes(this.searchKey.toString().toLowerCase())){
           this.corUserDataList .push(this.corUserDataTempList[i])
        }
      }
      }
      this.corUserDataList = lodash.orderBy(this.corUserDataList, 'username', 'asc');
      return true
      
    }else{
      return false
    } 
  }
  filterUserData(response){
response['records'].map(el=>{ el['UserImage'] = this.appUtilityConfig.getUserImageURL(el['user_id'])} )

 
    this.corUserDataTempList = JSON.parse(JSON.stringify(response['records']))
    let userIdList = []
    this.userAssignmentDataList['User'].map(el => userIdList.push(el['user_id']))

     let filterList= []
    if (userIdList && userIdList.length > 0) {
      filterList =  response['records'].filter(el=> userIdList.indexOf(el['user_id'])===-1 && el['username'].toLowerCase().includes(this.searchKey.toString().toLowerCase()))
    }

    this.popupDataLoading = false;
    if(filterList.length===0){

        if(userIdList.indexOf(response['records'][0]['user_id'])>-1){
          this.corUserDataList=[]
          return
        }
 
          this.corUserDataList = JSON.parse(JSON.stringify(response['records']))
         

         

    }else if(filterList.length>0){
 
      this.corUserDataList = JSON.parse(JSON.stringify(response['records']))
      
        
    }
    this.corUserDataList = lodash.orderBy(this.corUserDataList, 'username', 'asc');
  }
  
    checkRoleRecordFetched(){
      if(!this.userAssignmentDataList['Role']){
        return false
      }
      if (this.corRoleDataTempList.length > 0) {
                        
        let idList = []
        this.userAssignmentDataList['Role'].map(el =>  idList.push(el['role_id']))
        if (this.searchKey === '') {
     
          for(let i =0;i<this.corRoleDataTempList.length;i++){
            if(idList.indexOf(this.corRoleDataTempList[i]['role_id'])===-1){
              this.corRoleDataList.push(this.corRoleDataTempList[i])
            }
          }
        }else{
      
        for(let i =0;i<this.corRoleDataTempList.length;i++){
          if(idList.indexOf(this.corRoleDataTempList[i]['role_id'])===-1 && this.corRoleDataTempList[i]['role_name'].toLowerCase().includes(this.searchKey.toString().toLowerCase())){
            this.corRoleDataList.push(this.corRoleDataTempList[i])
          }
        }
        }
        this.corRoleDataList = lodash.orderBy(this.corRoleDataList, 'role_name', 'asc');
        return true
        
      }else{
        return false
      } 
    }
    checkGroupRecordFetched(){
  
      if(!this.userAssignmentDataList['Group']){
        return false
      }
      
      if (this.corGroupDataTempList.length > 0) {
        console.log("corGroupDataTempList length..",this.corGroupDataTempList.length);
                        
        let idList = []
        this.userAssignmentDataList['Group'].map(el =>  idList.push(el['user_group_id']))
        console.log("idList length..",idList);
        if (this.searchKey === '') {
     
          for(let i =0;i<this.corGroupDataTempList.length;i++){
            if(idList.indexOf(this.corGroupDataTempList[i]['user_group_id'])===-1){
              this.userGroupList.push(this.corGroupDataTempList[i])
            }
          }
        }else{
      
        for(let i =0;i<this.corGroupDataTempList.length;i++){
          if(idList.indexOf(this.corGroupDataTempList[i]['user_group_id'])===-1 && this.corGroupDataTempList[i]['display_name'].toLowerCase().includes(this.searchKey.toString().toLowerCase())){
            this.userGroupList.push(this.corGroupDataTempList[i])
          }
        }
        }
        this.userGroupList = lodash.orderBy(this.userGroupList, 'display_name', 'asc');
        return true
        
      }else{
        return false
      } 
    }
    checkResponsiblityRecordFetched(){
      if(!this.userAssignmentDataList['Responsibilities']){
        return false
      }
      if (this.corResponseTempList.length > 0) {
                        
        let idList = []
        this.userAssignmentDataList['Responsibilities'].map(el =>  idList.push(el['responsibility_id']))
        if (this.searchKey === '') {
     
          for(let i =0;i<this.corResponseTempList.length;i++){
            if(idList.indexOf(this.corResponseTempList[i]['responsibility_id'])===-1){
              this.corResponseList.push(this.corResponseTempList[i])
            }
          }
        }else{
      
        for(let i =0;i<this.corResponseTempList.length;i++){
          if(idList.indexOf(this.corResponseTempList[i]['responsibility_id'])===-1 && this.corResponseTempList[i]['responsibility_name'].toLowerCase().includes(this.searchKey.toString().toLowerCase())){
            this.corResponseList.push(this.corResponseTempList[i])
          }
        }
        }
        this.corResponseList = lodash.orderBy(this.corResponseList, 'responsibility_name', 'asc');
        return true
        
      }else{
        return false
      } 
    }
  
    filterRoleData(response){
    
      this.corRoleDataTempList = JSON.parse(JSON.stringify(response['records']))
      let existingIdList = []
      this.userAssignmentDataList['Role'].map(el => existingIdList.push(el['role_id']))
  
       let filterList= []
      if (existingIdList && existingIdList.length > 0) {
        filterList =  response['records'].filter(el=> existingIdList.indexOf(el['role_id'])===-1)
      }
  
      this.popupDataLoading = false;
      if(filterList.length===0){
  
          if(existingIdList.indexOf(response['records'][0]['role_id'])>-1){
            this.corRoleDataList=[]
            return
          }
  
         
          
            this.corRoleDataList =  JSON.parse(JSON.stringify(response['records']));
          
      }else if(filterList.length>0){
  
          
            
         
            this.corRoleDataList=  JSON.parse(JSON.stringify(filterList));
          
          
      }
      this.corRoleDataList = lodash.orderBy(this.corRoleDataList, 'role_name', 'asc');
    }
    
    filterGroupData(response){
      
      this.corGroupDataTempList = JSON.parse(JSON.stringify(response['records']))
      let existingIdList = []
      this.userAssignmentDataList['Group'].map(el => existingIdList.push(el['user_group_id']))
  
       let filterList= []
      if (existingIdList && existingIdList.length > 0) {
        filterList =  response['records'].filter(el=> existingIdList.indexOf(el['user_group_id'])===-1)
      }
  
      this.popupDataLoading = false;
      if(filterList.length===0){
  
          if(existingIdList.indexOf(response['records'][0]['user_group_id'])>-1){
            this.userGroupList=[]
            return
          }
  
          
            this.userGroupList =  JSON.parse(JSON.stringify(response['records']));
           
  
      }else if(filterList.length>0){
  
           
         
            this.userGroupList=  JSON.parse(JSON.stringify(filterList));
          
          
      }
      this.userGroupList = lodash.orderBy(this.userGroupList, 'display_name', 'asc');
    }
    
    filterResponsiblityData(response){
      
      this.corResponseTempList = JSON.parse(JSON.stringify(response['records']))
      let existingIdList = []
      this.userAssignmentDataList['Responsibilities'].map(el => existingIdList.push(el['responsibility_id']))
  
       let filterList= []
      if (existingIdList && existingIdList.length > 0) {
        filterList =  response['records'].filter(el=> existingIdList.indexOf(el['responsibility_id'])===-1)
      }
  
      this.popupDataLoading = false;
      if(filterList.length===0){
  
          if(existingIdList.indexOf(response['records'][0]['responsibility_id'])>-1){
            this.corResponseList=[]
            return
          }
  
          
            this.corResponseList = JSON.parse(JSON.stringify(response['records']))
          
           
  
      }else if(filterList.length>0){       
            this.corResponseList=  JSON.parse(JSON.stringify(filterList));       
          
      }
      this.corResponseList = lodash.orderBy(this.corResponseList, 'responsibility_name', 'asc');
    }
    popupDataLoading = false;
    showUserList() {
      
      this.corUserDataList = []
   
      if(this.checkUserRecordFetched()){
        return
      }
      this.popupDataLoading = true;
      let query = ''
      if (this.userAssignmentConfigMode === 'FIXED') {
       query = this.userAssignmentService.makeInQuery(this.assignmentConfigJson['whomToAssignMode'][0]['User'], this.metaDbConfig.corUsersObject, 'user_id')
        return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corUsersObject).then(response => {
          if (response['status'] === 'SUCCESS') {
            if (response['records'].length === 0) {
              this.popupDataLoading = false
                  return;
            }
            this.filterUserData(response)
           }else{
             this.popupDataLoading = false
           }
  
        }).catch(err => {
  this.popupDataLoading = false
          return Promise.resolve(err)
        });
      }else {
        let roleIdList = []
        if (this.userAssignmentConfigTypeList.indexOf('Role') > -1) {
          roleIdList.push(Number(this.appUtilityConfig.roleId))
        }
        let groupIdList = []
        if (this.userAssignmentConfigTypeList.indexOf('Group') > -1) {
          groupIdList=this.appUtilityConfig.userGroups
        }
  
        let responsiblityIdList = []
        if (this.userAssignmentConfigTypeList.indexOf('Responsibilities') > -1) {
          responsiblityIdList=this.appUtilityConfig.userResponsibilities
        }       
  
        this.fetchUserRecord(groupIdList, roleIdList,responsiblityIdList).then(response => { 
          if (response['status'] === 'SUCCESS') {
            if (response['records'].length === 0) {
              this.popupDataLoading = false;
                  return
            }
            this.filterUserData(response) 
          }else{
             this.popupDataLoading = false
           }
        }).catch(err=>{
            this.popupDataLoading = false;
          })
      }
    }
  
    corRoleDataTempList = []
    showRoleList() {
  this.corRoleDataList = []
    
      if(this.checkRoleRecordFetched()){
        return
      }
      this.popupDataLoading = true;
      let query = ''
      if (this.userAssignmentConfigMode === 'FIXED') {
        query = this.userAssignmentService.makeInQuery(this.assignmentConfigJson['whomToAssignMode'][0]['Role'], this.metaDbConfig.corRoles, 'role_id')
      }else {
        var s = []
        s.push(this.appUtilityConfig.roleId)
        query = this.userAssignmentService.makeInQuery(s, this.metaDbConfig.corRoles, 'role_id')
  
  
      }
      return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corRoles).then(res => {
        if (res['status'] === 'SUCCESS') {
          if (res['records'].length === 0) {
           this.popupDataLoading = false;
            return
          }
          this.filterRoleData(res)
          }else{
             this.popupDataLoading = false
           }
      }).catch(err => {
       this.popupDataLoading = false;
        return Promise.resolve(err)
      });
  
    }
    showResponsibilitiesList() {
  this.corResponseList = []
      if(this.checkResponsiblityRecordFetched()){
        return
      }
      this.popupDataLoading = true;
      let query = ''
      if (this.userAssignmentConfigMode === 'FIXED') {
        query = this.userAssignmentService.makeInQuery(this.assignmentConfigJson['whomToAssignMode'][0]['Responsibilities'], this.metaDbConfig.userResponsibility, 'responsibility_id')
      }else {
  
        query = this.userAssignmentService.makeInQuery(this.appUtilityConfig.userResponsibilities, this.metaDbConfig.userResponsibility, 'responsibility_id')
  
      }
  
  
      return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.userResponsibility).then(res => {
        if (res['status'] === 'SUCCESS') {
          if (res['records'].length === 0) {
           this.popupDataLoading = false;
            return
          }
         this.filterResponsiblityData(res)
        
        }else{
         this.popupDataLoading = false;
        } 
      }).catch(err => {
       this.popupDataLoading = false;
        return Promise.resolve(err)
      });
    }
    showGroupList() {
      this.userGroupList = []
      
      if(this.checkGroupRecordFetched()){
        return
      }
      this.popupDataLoading = true;
      var query = ''
      if (this.userAssignmentConfigMode === 'FIXED') {
        query = this.userAssignmentService.makeInQuery(this.assignmentConfigJson['whomToAssignMode'][0]['Group'], this.metaDbConfig.userGroup, 'user_group_id')
      }else {
        query = this.userAssignmentService.makeInQuery(this.appUtilityConfig.userGroups, this.metaDbConfig.userGroup, 'user_group_id')
      }
      return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.userGroup).then(res => {
        if (res['status'] === 'SUCCESS') {
          if (res['records'].length === 0) {
           this.popupDataLoading = false;
            return
          }
          this.filterGroupData(res)
        } else {
         this.popupDataLoading = false; 
        }
  
  
      })
        .catch(err => {
         this.popupDataLoading = false; 
          console.log(err)
        });
    }
  
    morebtnaction() {
      var btn = document.getElementsByClassName("cs-assingeduser-more-btn")[0].getBoundingClientRect();
      var btnwidth = btn.width;
      var btnright = btn.right;
      var btnleft = document.getElementsByClassName("cs-assingeduser-more-btn")[0]['offsetLeft'];
      var popup = document.getElementsByClassName("cs-morebtn-popup")[0]['offsetWidth'];
      var popupstyle = document.getElementsByClassName("cs-morebtn-popup")[0];
      if ((btnleft + popup) > window.innerWidth) {
        var btn = document.getElementsByClassName("cs-assingeduser-more-btn")[0].getBoundingClientRect();
        var btnx = btn.width;
        var rightval = document.getElementsByClassName("cdk-overlay-pane")[0];
        rightval['style']['right'] = btnx + 'px';
        document.getElementsByClassName("cdk-overlay-pane")[0].classList.add("cs-remove-right");
        popupstyle['style']['left'] = btnleft - popup + 'px';
      }else {
        document.getElementsByClassName("cdk-overlay-pane")[0].classList.add("cs-remove-left");
        popupstyle['style']['left'] = btnright + 'px';
      }
    }
    public dataSetToSave = []
    toggeleUserInfo() {
  
    }
  
    toogleGroupInfo() {
  
    }
    getAssignmentInfo() {
  
      this.assignmentConfigJson = JSON.parse(JSON.stringify(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutIdInfo]['userAssignment'][this.actionIdInfo]))
      this.userAssignmentConfigMode = this.assignmentConfigJson['configMode']
      this.elementId = this.assignmentConfigJson['elementId']
      this.userAssignmentConfigTypeList = []
      this.layoutName  = this.assignmentConfigJson['layoutName']
      this.isDataLoading = true
     if (this.userAssignmentConfigMode === 'FIXED' && this.assignmentConfigJson['whomToAssignMode'].length > 0) {
       this.userAssignmentConfigTypeList = Object.keys(this.assignmentConfigJson['whomToAssignMode'][0])
        this.fetchUserRecordAssignment()
      }else if(this.userAssignmentConfigMode === 'LOGGEDUSER' && this.assignmentConfigJson['whomToAssignMode'].length > 0) {
  
        this.userAssignmentConfigTypeList = JSON.parse(JSON.stringify(this.assignmentConfigJson['whomToAssignMode']))
        if (this.userAssignmentConfigTypeList.indexOf('Group') > -1 || this.userAssignmentConfigTypeList.indexOf('Role') > -1 || this.userAssignmentConfigTypeList.indexOf('Responsibilities') > -1) {
          this.userAssignmentConfigTypeList.push('User')
        }
        this.fetchUserRecordAssignment()
  
  
      }
    }
  
    fetchUserGroupAssignment(groupIdList){
  
      if(groupIdList.length>0){
        var query = this.userAssignmentService.makeInQuery(groupIdList, this.metaDbConfig.corUserGroupAssignment, 'user_group_id_p')
        return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corUserGroupAssignment).then(res=>{
            if (res['status'] === 'SUCCESS') {
              if (res['records'].length > 0) {
                var userIdLits = []
                res['records'].map(el => userIdLits.push(el['user_id_s']))
                return Promise.resolve(userIdLits)
             }else{
               return Promise.resolve([])
             }
           }else{
             return Promise.resolve([])
           }
         }).catch(err=>{
             return Promise.resolve([])
           })
     }else{
       return Promise.resolve([])
     }
  
    }
    fetchResponsiblityGroupAssignment(responsiblityIdList){
  
      if(responsiblityIdList.length>0){
        var query = this.userAssignmentService.makeInQuery(responsiblityIdList, this.metaDbConfig.userResponsibilityAssignment, 'responsibility_id_s')
        return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.userResponsibilityAssignment).then(res=>{
            if (res['status'] === 'SUCCESS') {
              if (res['records'].length > 0) {
                var userIdLits = []
                res['records'].map(el => userIdLits.push(el['user_id_p']))
                return Promise.resolve(userIdLits)
               }else{
                 return Promise.resolve([])
               }
             }else{
               return Promise.resolve([])
             }
           }).catch(err=>{
               return Promise.resolve([])
             })
       }else{
         return Promise.resolve([])
       }
    }
  
    fetchUserRecord(groupIdList, roleIdList,responsiblityIdList) {
  
  
      if (!responsiblityIdList && !groupIdList  && roleIdList.length > 0) {
  
  
        var roleIdLits = []
        roleIdList.push(Number(this.appUtilityConfig.roleId))
        var query4 = this.userAssignmentService.makeInQuery(roleIdLits, this.metaDbConfig.corUsersObject, 'role_id')
        return this.metaDbProvider.fetchDocsUsingSearchApi(query4, this.metaDbConfig.corUsersObject).then(response => {
          let result:any = response;
          return result;
        }).catch(err=>{
            
          })
  
      }else{
       var taskList = []
       if (groupIdList) {
         taskList.push(this.fetchUserGroupAssignment(groupIdList))
       }
       if (responsiblityIdList) {
         taskList.push(this.fetchResponsiblityGroupAssignment(responsiblityIdList))
       }
       return Promise.all(taskList).then(res => {
         var query4 = ''
         var userIdList = []
         userIdList = lodash.uniq(lodash.flatten(res));
         let userIdListbatch = lodash.chunk(userIdList, 1000);
         let tasklistfetch = [];
         userIdListbatch.forEach(ele => {
           if (roleIdList.length > 0 && userIdList.length > 0) {
             query4 = this.userAssignmentService.makeInQueryWithOr(ele, this.metaDbConfig.corUsersObject, 'user_id', 'role_id', roleIdList)
           }else if (roleIdList.length > 0 && ele.length === 0) {
  
             query4 = this.userAssignmentService.makeInQuery(roleIdList, this.metaDbConfig.corUsersObject, 'role_id')
           }else if (roleIdList.length === 0 && ele.length > 0) {
  
             query4 = this.userAssignmentService.makeInQuery(ele, this.metaDbConfig.corUsersObject, 'user_id')
           }
           tasklistfetch.push(this.getUserList(query4))
         })
         return Promise.all(tasklistfetch).then(result => {
           return  {records:lodash.uniqBy(lodash.flatten(lodash.map(result, 'records')), 'id'),status:"SUCCESS"}
         })
  
          })
      }
  
    }
  
    // user record assignment fetch
    fetchUserRecordAssignment() {
      this.isDataLoading = true;
      let userAssignmentRecordParseList = []
      this.userAssignmentDataList = {}
      var key = []
      key.push(this.selectedObject['id'] + "|" + this.selectedObject['type'] + 'userAssignment')
      this.userAssignmentService.fetchUserAssignment(key, 'CouchDB').then(res => {
        if (res['status'] === 'SUCCESS') {
  
          var record = res['records']
          if (record && record.length > 0) {
  
            for (let i = 0; i < record.length; i++) {
              var ind = record[i]['doc']['_id'].lastIndexOf("_")
              ind = ind + 1;
              var obj = record[i]['doc']['data']
              obj['id'] = record[i]['doc']['_id'].slice(ind)
              obj['rev'] = record[i]['doc']['_rev']
              userAssignmentRecordParseList.push(obj)
            }
  
  
  
  
            if (this.userAssignmentConfigTypeList.indexOf("User") > -1) {
              this.userAssignmentDataList['User'] = userAssignmentRecordParseList.filter(el => {
                return el['id_type'] === 'User'
              })
            }
  
            if (this.userAssignmentConfigTypeList.indexOf("Group") > -1) {
              this.userAssignmentDataList['Group'] = userAssignmentRecordParseList.filter(el => {
                return el['id_type'] === 'Group'
              })
            }
            if (this.userAssignmentConfigTypeList.indexOf("Role") > -1) {
              this.userAssignmentDataList['Role'] = userAssignmentRecordParseList.filter(el => {
                return el['id_type'] === 'Role'
              })
            }
            if (this.userAssignmentConfigTypeList.indexOf("Responsibilities") > -1) {
              this.userAssignmentDataList['Responsibilities'] = userAssignmentRecordParseList.filter(el => {
                return el['id_type'] === 'Responsibilities'
              })
            }
  
  
  
            this.userAssignmentTempDataList = JSON.parse(JSON.stringify(this.userAssignmentDataList))
            this.fetchAndMapMasterRecord()
          }else {
  
            for (let i = 0; i < this.userAssignmentConfigTypeList.length; i++) {
              this.userAssignmentDataList[this.userAssignmentConfigTypeList[i]] = []
            }
            this.userAssignmentTempDataList = JSON.parse(JSON.stringify(this.userAssignmentDataList))
          }
         this.isDataLoading = false;
  
        
        }else {
          userAssignmentRecordParseList = []
          this.userAssignmentTempDataList = {}
          this.userAssignmentDataList = {}
          this.isDataLoading = false;
        }
  
  
      }).catch(err=>{
                this.isDataLoading = false
        })
    }
  
    getUserList(query4) {
     return this.metaDbProvider.fetchDocsUsingSearchApi(query4, this.metaDbConfig.corUsersObject).then(response => {
       return response
     }).catch(err => {
       return  err;
     })
   }
  
  
    fetchAndMapMasterRecord() {
      var useridList = []
      if (this.userAssignmentDataList && this.userAssignmentDataList['User']) {
        this.userAssignmentDataList['User'].map(el => useridList.push(el['user_id']))
      }
  
      var groupIdList = []
      if (this.userAssignmentDataList && this.userAssignmentDataList['Group']) {
        this.userAssignmentDataList['Group'].map(el => groupIdList.push(el['user_group_id']))
      }
  
      var roleIdList = []
      if (this.userAssignmentDataList && this.userAssignmentDataList['Role']) {
        this.userAssignmentDataList['Role'].map(el => roleIdList.push(el['role_id']))
      }
  
      var responsibilitiesIdList = []
      if (this.userAssignmentDataList && this.userAssignmentDataList['Responsibilities']) {
        this.userAssignmentDataList['Responsibilities'].map(el => responsibilitiesIdList.push(el['responsibility_id']))
      }
  
  
  var taskList = []
      if (useridList.length > 0) {
  
      
        taskList.push(this.mapUserData(useridList))
      }else {
        this.masterMapping['User'] = {}
      }
  
      if (roleIdList.length > 0) {
        taskList.push(this.mapRoleData(roleIdList))
      }else {
        this.masterMapping['Role'] = {}
      }
  
      if (groupIdList.length > 0) {
        taskList.push( this.mapUserGroupData(groupIdList))
      }else {
        this.masterMapping['Group'] = {}
      }
  
      if (responsibilitiesIdList.length > 0) {
        taskList.push(this.mapUserResponsibilitiesData(responsibilitiesIdList))
      }else {
        this.masterMapping['Responsibilities'] = {}
      }
  Promise.all(taskList).then(res=>{
      this.isDataLoading = false;
    }).catch(err=>{
        console.log(err);
        this.isDataLoading = false;
      })
  
    
    }
    mapUserData(useridList) {
  
      var query = this.userAssignmentService.makeInQuery(useridList, this.metaDbConfig.corUsersObject, 'user_id')
      return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corUsersObject).then(res => {
        if (res['status'] === 'SUCCESS') {
          if (res['records'].length === 0) {
  
            return Promise.resolve(true)
          }
          for (const UserAssignedId of this.userAssignmentDataList['User']) {
          for (const userId of res['records']) {
            if (parseInt(UserAssignedId['user_id']) === parseInt(userId['user_id'])) {
              //   this.userAssignmentDataList['User'][i]['username'] = res['records'][j]['username']
              this.masterMapping['User'][UserAssignedId['user_id']] = userId['username']
              const s = UserAssignedId['user_id'] + 'UserImage'
              this.masterMapping['User'][s] = this.appUtilityConfig.getUserImageURL(UserAssignedId['user_id'])
            }
          }
        }
          return Promise.resolve(true)
        }
      }).catch(err => {
        console.log(err)
        return
      })
    }
    mapRoleData(roleIdList) {
      var query = this.userAssignmentService.makeInQuery(roleIdList, this.metaDbConfig.corRoles, 'role_id')
      return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corRoles).then(res => {
        if (res['status'] === 'SUCCESS') {
          if (res['records'].length === 0) {
  
            return Promise.resolve(true)
          }
          for (const roleAssignedId of this.userAssignmentDataList['Role']) {
            for (const roleId of res['records']) {
              if (parseInt(roleAssignedId['role_id']) === parseInt(roleId['role_id'])) {
                //   this.userAssignmentDataList['Role'][i]['role_name'] = res['records'][j]['role_name']
                this.masterMapping['Role'][roleAssignedId['role_id']] = roleId['role_name']
              }
            }
          }
          return Promise.resolve(true)
        }
      }).catch(err => {
        console.log(err)
        return
      })
    }
    mapUserGroupData(groupIdList) {
      var query = this.userAssignmentService.makeInQuery(groupIdList, this.metaDbConfig.userGroup, 'user_group_id')
      return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.userGroup).then(res => {
        if (res['status'] === 'SUCCESS') {
          if (res['records'].length === 0) {
  
            return Promise.resolve(true)
          }
          for (const groupAssignedId of this.userAssignmentDataList['Group']) {
            for (const groupId of res['records']) {
              if (parseInt(groupAssignedId['user_group_id']) === parseInt(groupId['user_group_id'])) {
                this.masterMapping['Group'][groupAssignedId['user_group_id']] = groupId['display_name']
              }
            }
          }
          return Promise.resolve(true)
        }
      }).catch(err => {
        console.log(err)
        return
      })
    }
    mapUserResponsibilitiesData(responsibilitiesIdList)  {
      var query = this.userAssignmentService.makeInQuery(responsibilitiesIdList, this.metaDbConfig.userResponsibility, 'responsibility_id')
      return this.metaDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.userResponsibility).then(res => {
        if (res['status'] === 'SUCCESS') {
          if (res['records'].length === 0) {
  
            return Promise.resolve(true)
          }
          for (const responsibleAssignedId of this.userAssignmentDataList['Responsibilities']) {
            for (const responsibleId of  res['records']) {
              if (parseInt(responsibleAssignedId['responsibility_id']) === parseInt(responsibleId['responsibility_id'])) {
                this.masterMapping['Responsibilities'][responsibleAssignedId['responsibility_id']] = responsibleId['responsibility_name']
              }
            }
          }
          return Promise.resolve(true)
        }
      }).catch(err => {
        console.log(err)
        return
      })
    }
    removeItem(e, selectedItem, assignmentType, fieldName) {
      this.itemClickAction(e, selectedItem, assignmentType, fieldName, true)
    }
    userAssigmneRemoveId = {'User':[],'Role':[],'Responsibilities':[],'Group':[]}
    itemClickAction(e, clickedItem, assignmentType, fieldName, removeAction?) {
      e.stopPropagation();
      var rec = [];
      if (this.userAssignmentTempDataList[assignmentType] && this.userAssignmentTempDataList[assignmentType].length > 0) {
        rec = this.userAssignmentTempDataList[assignmentType].filter(el => el[fieldName] === clickedItem[fieldName])
      }
  
      if (!removeAction) {
      
          if (assignmentType === 'User') {
  
            for (let i = 0; i < this.corUserDataList.length; i++) {
              if (this.corUserDataList[i]['user_id'] === clickedItem['user_id']) {
                this.corUserDataList.splice(i,1)
                break;
              }
            }
  
  
          }else if (assignmentType === 'Role') {
  
            for (let i = 0; i < this.corRoleDataList.length; i++) {
              if (this.corRoleDataList[i]['role_id'] === clickedItem['role_id']) {
                this.corRoleDataList.splice(i,1)
                break;
              }
            }
            
  
          }
          if (assignmentType === 'Group') {
            
            for (let i = 0; i < this.userGroupList.length; i++) {
              if (this.userGroupList[i]['user_group_id'] === clickedItem['user_group_id']) {
                this.userGroupList.splice(i,1)
                break;
              }
            }
          
  
          } else if (assignmentType === 'Responsibilities') {
            for (let i = 0; i < this.corResponseList.length; i++) {
              if (this.corResponseList[i]['responsibility_id'] === clickedItem['responsibility_id']) {
                this.corResponseList.splice(i,1)
                break;
              }
            }
          
  
          }
      }
      if(removeAction){
  
        if(assignmentType==='User'){
          
          for (let i = 0; i < this.corUserDataTempList.length; i++) {
          if (this.corUserDataTempList[i]['user_id'] === rec[0]['user_id']) {
            this.corUserDataList.push(this.corUserDataTempList[i])
             break;
          }
        }
      }else if(assignmentType==='Role'){
       
          for (let i = 0; i < this.corRoleDataTempList.length; i++) {
            if (this.corRoleDataTempList[i]['role_id'] === rec[0]['role_id']) {
              this.corRoleDataList.push(this.corRoleDataTempList[i])
              break;
            }
          }
     
  
      }else if(assignmentType==='Group'){
       
          for (let i = 0; i < this.corGroupDataTempList.length; i++) {
            if (this.corGroupDataTempList[i]['user_group_id'] === rec[0]['user_group_id']) {
              this.userGroupList.push(this.corGroupDataTempList[i])
              break;
            }
          }
     
  
  
      }else if(assignmentType==='Responsibilities'){
        
          for (let i = 0; i < this.corResponseTempList.length; i++) {
            if (this.corResponseTempList[i]['responsibility_id'] === rec[0]['responsibility_id']) {
              this.corResponseList.push(this.corResponseTempList[i])
              break;
            }
          }
     
  
      }
      }
  
    
  
      if (rec && rec.length > 0 && rec[0]['modifiedAction'] && rec[0]['modifiedAction'] === 'Remove') {
  
        let removeIndex;
        for (let i = 0; i < this.userAssignmentDataList[assignmentType].length; i++) {
          if (this.userAssignmentDataList[assignmentType][i][fieldName] === clickedItem[fieldName]) {
            removeIndex = i;
            break;
          }
        }
        if (removeIndex !== undefined && removeIndex !== -1) {
  
          this.userAssignmentDataList[assignmentType][removeIndex]['isActive'] = true
          delete this.userAssignmentDataList[assignmentType][removeIndex]['modifiedAction']
        }
  
        let removeIndexTemp;
        for (let i = 0; i < this.userAssignmentTempDataList[assignmentType].length; i++) {
          if (this.userAssignmentTempDataList[assignmentType][i][fieldName] === clickedItem[fieldName]) {
            removeIndexTemp = i;
            break;
          }
        }
        if (removeIndexTemp !== undefined && removeIndexTemp !== -1) {
          this.userAssignmentTempDataList[assignmentType][removeIndexTemp]['isActive'] = true
          delete this.userAssignmentTempDataList[assignmentType][removeIndexTemp]['modifiedAction']
        }
  
        if (removeIndex === undefined && removeIndexTemp !== undefined) {
          this.userAssignmentDataList[assignmentType].push(this.userAssignmentTempDataList[assignmentType][removeIndexTemp])
        }
  
  
      }else if (rec && rec.length > 0 && rec[0]['modifiedAction'] && rec[0]['modifiedAction'] === 'Add') {
        let removeIndex;
        for (let i = 0; i < this.userAssignmentDataList[assignmentType].length; i++) {
          if (this.userAssignmentDataList[assignmentType][i][fieldName] === clickedItem[fieldName]) {
            removeIndex = i;
            break;
          }
        }
        let removeIndexTemp;
        for (let i = 0; i < this.userAssignmentTempDataList[assignmentType].length; i++) {
          if (this.userAssignmentTempDataList[assignmentType][i][fieldName] === clickedItem[fieldName]) {
            removeIndexTemp = i;
            break;
          }
        }
        if (removeIndex !== undefined && removeIndex !== -1) {
          this.userAssignmentDataList[assignmentType].splice(removeIndex, 1)
        }
        if (removeIndexTemp !== undefined && removeIndexTemp !== -1) {
          this.userAssignmentTempDataList[assignmentType].splice(removeIndex, 1)
        }
       
      }else if (rec && rec.length > 0) {
  
  
        let removeIndex;
        for (let i = 0; i < this.userAssignmentDataList[assignmentType].length; i++) {
          if (this.userAssignmentDataList[assignmentType][i][fieldName] === clickedItem[fieldName]) {
            removeIndex = i;
            break;
          }
        }
        if (removeIndex !== undefined && removeIndex !== -1) {
          this.userAssignmentDataList[assignmentType].splice(removeIndex, 1)
        }
  
        let removeIndexTemp;
        for (let i = 0; i < this.userAssignmentTempDataList[assignmentType].length; i++) {
          if (this.userAssignmentTempDataList[assignmentType][i][fieldName] === clickedItem[fieldName]) {
            removeIndexTemp = i;
            break;
          }
        }
        if (removeIndexTemp !== undefined && removeIndexTemp !== -1) {
          this.userAssignmentTempDataList[assignmentType][removeIndexTemp]['modifiedAction'] = 'Remove'
          this.userAssignmentTempDataList[assignmentType][removeIndexTemp]['isActive'] = false
        }
      
  
      } else {
  
  
        var dataSet = {}
  
        dataSet = JSON.parse(JSON.stringify(this.dbConfig['configuration']['tableStructure']['userAssignment']))
        dataSet['modifiedAction'] = 'Add'
        dataSet['reference_id'] = this.selectedObject['id']
        dataSet['id_type'] = assignmentType
  
        if (assignmentType === 'User') {
          dataSet['user_id'] = clickedItem['user_id']
          if (clickedItem['username']) {
            this.masterMapping['User'][clickedItem['user_id']] = clickedItem['username']
            this.masterMapping['User'][clickedItem['user_id']+'UserImage'] = clickedItem['UserImage']        
           
          }
  
        }else if (assignmentType === 'Role') {
          dataSet['role_id'] = clickedItem['role_id']
          if (clickedItem['role_name']) {
            this.masterMapping['Role'][clickedItem['role_id']] = clickedItem['role_name']
          }
  
  
        }else if (assignmentType === 'Responsibilities') {
          dataSet['responsibility_id'] = clickedItem['responsibility_id']
          if (clickedItem['responsibility_name']) {
            this.masterMapping['Responsibilities'][clickedItem['responsibility_id']] = clickedItem['responsibility_name']
          }
  
        }else {
          dataSet['user_group_id'] = clickedItem['user_group_id']
          this.masterMapping['Group'][clickedItem['user_group_id']] = clickedItem['display_name']
  
        }
     
  
          dataSet['type'] = this.selectedObject['type'] + "userAssignment"
        dataSet['isActive'] = true
        this.userAssignmentDataList[assignmentType].push(dataSet)
        this.userAssignmentTempDataList[assignmentType].push(dataSet)
      }
    }
    
    @HostListener('document:click', ['$event', '$event.target'])
    onClick(event: MouseEvent, targetElement: HTMLElement): void {
      console.log("General Click");
      $("#selectUser").addClass("cs-display-none");
      $("#selectUser").removeClass("cs-display-block");
      $("#selectedUser").addClass("cs-display-block");
      $("#selectedUser").removeClass("cs-display-none");
  
      $("#selectRole").addClass("cs-display-none");
      $("#selectRole").removeClass("cs-display-block");
      $("#selectedRole").addClass("cs-display-block");
      $("#selectedRole").removeClass("cs-display-none");
  
      $("#selectGroup").addClass("cs-display-none");
      $("#selectGroup").removeClass("cs-display-block");
      $("#selectedGroup").addClass("cs-display-block");
      $("#selectedGroup").removeClass("cs-display-none");
  
      $("#selectResponse").addClass("cs-display-none");
      $("#selectResponse").removeClass("cs-display-block");
      $("#selectedResponse").addClass("cs-display-block");
      $("#selectedResponse").removeClass("cs-display-none");
    }
    searchEnter(event, uat) {
      if (uat === "User") {
        this.showUserList();
        document.getElementById("selectedUser").classList.remove("cs-display-block");
        document.getElementById("selectedUser").classList.add("cs-display-none");
        document.getElementById("selectUser").classList.add("cs-display-block");
        document.getElementById("selectUser").classList.remove("cs-display-none");
      }
      if (uat === "Role") {
        this.showRoleList();
        document.getElementById("selectedRole").classList.remove("cs-display-block");
        document.getElementById("selectedRole").classList.add("cs-display-none");
        document.getElementById("selectRole").classList.add("cs-display-block");
        document.getElementById("selectRole").classList.remove("cs-display-none");
      }
      if (uat === "Group") {
     this.showGroupList();
        document.getElementById("selectedGroup").classList.remove("cs-display-block");
        document.getElementById("selectedGroup").classList.add("cs-display-none");
        document.getElementById("selectGroup").classList.add("cs-display-block");
        document.getElementById("selectGroup").classList.remove("cs-display-none");
      }
      if (uat === "Response") {
        this.showResponsibilitiesList();
        document.getElementById("selectedResponse").classList.remove("cs-display-block");
        document.getElementById("selectedResponse").classList.add("cs-display-none");
        document.getElementById("selectResponse").classList.add("cs-display-block");
        document.getElementById("selectResponse").classList.remove("cs-display-none");
      }
      event.stopPropagation();
    }
  
    searchListOne(event, assignmentType, fieldName) {
      this.searchKey = event.target.value
      if (assignmentType === "User") {
        this.showUserList();
        document.getElementById("selectedUser").classList.remove("cs-display-block");
        document.getElementById("selectedUser").classList.add("cs-display-none");
        document.getElementById("selectUser").classList.add("cs-display-block");
        document.getElementById("selectUser").classList.remove("cs-display-none");
      }else if (assignmentType === "Role") {
        this.showRoleList()
        document.getElementById("selectedRole").classList.remove("cs-display-block");
        document.getElementById("selectedRole").classList.add("cs-display-none");
        document.getElementById("selectRole").classList.add("cs-display-block");
        document.getElementById("selectRole").classList.remove("cs-display-none");
      }else if (assignmentType === "Group") {
        this.showGroupList();
        document.getElementById("selectedGroup").classList.remove("cs-display-block");
        document.getElementById("selectedGroup").classList.add("cs-display-none");
        document.getElementById("selectGroup").classList.add("cs-display-block");
        document.getElementById("selectGroup").classList.remove("cs-display-none");
      }else if (assignmentType === "Responsibilities") {
        this.showResponsibilitiesList();
        document.getElementById("selectedResponse").classList.remove("cs-display-block");
        document.getElementById("selectedResponse").classList.add("cs-display-none");
        document.getElementById("selectResponse").classList.add("cs-display-block");
        document.getElementById("selectResponse").classList.remove("cs-display-none");
      }
  
  
     
  
    }
    
  saveActionCliked:boolean = false
    saveAction() {
      this.saveActionCliked =true;
      this.searchKey = ''
      if (this.dataSetToSave && this.dataSetToSave.length === 0) {
        if (this.userAssignmentTempDataList && this.userAssignmentTempDataList['User']) {
          for (let i = 0; i < this.userAssignmentTempDataList['User'].length; i++) {
            if (this.userAssignmentTempDataList['User'][i]['modifiedAction']) {
              this.dataSetToSave.push(this.userAssignmentTempDataList['User'][i])
              delete this.userAssignmentTempDataList['User'][i]['modifiedAction']
          
            }
          }
        }
        if (this.userAssignmentTempDataList && this.userAssignmentTempDataList['Group']) {
          for (let j = 0; j < this.userAssignmentTempDataList['Group'].length; j++) {
            if (this.userAssignmentTempDataList['Group'][j]['modifiedAction']) {
              this.dataSetToSave.push(this.userAssignmentTempDataList['Group'][j])
              delete this.userAssignmentTempDataList['Group'][j]['modifiedAction']
           
            }
          }
        }
  
        if (this.userAssignmentTempDataList && this.userAssignmentTempDataList['Responsibilities']) {
          for (let k = 0; k < this.userAssignmentTempDataList['Responsibilities'].length; k++) {
            if (this.userAssignmentTempDataList['Responsibilities'][k]['modifiedAction']) {
              this.dataSetToSave.push(this.userAssignmentTempDataList['Responsibilities'][k])
              delete this.userAssignmentTempDataList['Responsibilities'][k]['modifiedAction']
  
            }
          }
        }
        if (this.userAssignmentTempDataList && this.userAssignmentTempDataList['Role']) {
          for (let k = 0; k < this.userAssignmentTempDataList['Role'].length; k++) {
            if (this.userAssignmentTempDataList['Role'][k]['modifiedAction']) {
              this.dataSetToSave.push(this.userAssignmentTempDataList['Role'][k])
              delete this.userAssignmentTempDataList['Role'][k]['modifiedAction']
         
            }
          }
        }
      }
  
      if (!this.dataSetToSave || this.dataSetToSave.length === 0) {
        this.appUtilityConfig.presentToast("Kindly assign record")
        this.saveActionCliked = false
        return;
      }
  
      this.dbService.saveBulkUserAssignmentDocument(this.dataSetToSave, "CouchDB").then(res => {
        if (res && res['status'] === 'SUCCESS') {
          this.appUtilityConfig.presentToast("The changes have been saved successfully!")
          this.dataSetToSave = []
  
  
          this.fetchUserRecordAssignment()
  
          this.saveActionCliked =false;
  
        }
  
      }).catch(err=>{
          this.saveActionCliked =false;
  
        })
  
    }
    tabChangeMethod(event) {
      if (this.searchKey === '') {
        return;
      }
      this.searchKey = ''
      if (this.userAssignmentTempDataList && this.userAssignmentTempDataList['User']) {
        this.userAssignmentDataList['User'] = this.userAssignmentTempDataList['User'].filter(el => { return el['isActive'] })
      }
      if (this.userAssignmentTempDataList && this.userAssignmentTempDataList['Role']) {
        this.userAssignmentDataList['Role'] = this.userAssignmentTempDataList['Role'].filter(el => { return el['isActive'] })
      }
      if (this.userAssignmentTempDataList && this.userAssignmentTempDataList['Group']) {
        this.userAssignmentDataList['Group'] = this.userAssignmentTempDataList['Group'].filter(el => { return el['isActive'] })
      }
  
  
    }
   
  }
  