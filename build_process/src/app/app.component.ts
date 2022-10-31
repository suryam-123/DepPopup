

/*   
 *   File: app.component.ts
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */ 

import { Component,ViewChild,QueryList,ViewChildren,AfterViewInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { themeChanger } from 'src/theme/themeChanger';
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
import { appUtility } from 'src/core/utils/appUtility';
import { Router} from '@angular/router';
import { appConfiguration } from 'src/core/utils/appConfiguration';
import { metaDataDbProvider } from 'src/core/db/metaDataDbProvider';
import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { themechange } from 'src/core/services/themechange.service';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
import * as lodash from 'lodash';
import { cspfmNotificationService } from 'src/core/services/cspfmnotification.service';
import { menuService } from 'src/core/services/menuService.service';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit  {
  selectedTheme;
  public selectedThemeClass;
  public appConnectFlag= false;
  public isValidateOption = false;
  announcementList = [];
  public announcementList_length = 0;
  callSyncActionButton;
  layoutName = '';
  layoutParams = '';
  public alertFlag=true;
  public userInfoActive = false;
  public currentObject;
  public loggedUserDetail = {};
  public appIcon = 'appicon.png';
  public imagesrc = 'assets/img/app-visualize.svg'
  public applistArray: Array<{ title: string, url: string, icon: string }>;
  public noAppsAssigned = true;
  public notificationsForDisplay = [];
  @ViewChildren('globalSearch', { read: ViewContainerRef }) globalSearchKey;
  @ViewChildren(MdePopoverTrigger) trigger: QueryList<MdePopoverTrigger>;
  constructor(public notificationservice:cspfmNotificationService,public dialog:MatDialog,public platform: Platform, statusBar: StatusBar, public theme: themeChanger, splashScreen: SplashScreen,
    public observableListenerUtils: cspfmObservableListenerUtils, private broadcaster: Broadcaster, public alertCtrl: AlertController,
    public appUtils: appUtility, private router: Router, public appConfig: appConfiguration,private componentFactoryResolver:ComponentFactoryResolver,
    public metaDbProvider: metaDataDbProvider, public metaDbConfig: metaDbConfiguration, public appPref: AppPreferences, private serviceandtheme: themechange,
    public menuService: menuService) {


    if (this.appUtils.isMobile) {
      this.callSyncActionButton = "Synchronization";
    }else {
      this.callSyncActionButton = "Goto AppList"
    }

    let searchParams = (new URL(window.location.href)).searchParams;
    if (searchParams.get("layoutname")) {
      this.layoutName = searchParams.get("layoutname");
      this.appUtils.isEmbeddingEnabled = true;
      if (searchParams.get("payload")) {
        this.layoutParams = searchParams.get("payload");
      }
    }
    platform.ready().then(() => {
                    const localStore = {
                      "userId": 3956,
                      "orgId": 15,
                      "roleId": 8,
                      "userTimeZone": 'Asia/Calcutta',
                      "userDateFormat": 'DD/MM/YYYY',
                        "appBuilderURL": "http://localhost:1337/appbuilder",
                        "userGroupsId": JSON.stringify([]),
                        "userResponsibilitiesId": JSON.stringify([]),
                      };
                      const assignedAppArray = {
                        "assignedApps":[{ "assignedMenuGroups": [6552], "appName": "DepPopup", "appDisplayName": "DepPopup", "appId": 14477, "versionNumber":0.16,"landingPage": "cspfm_default_landing_page" }]
                      }
                      localStorage.setItem('localStore', this.appUtils.simpleCrypto.encryptObject(localStore));
                      localStorage.setItem('assignedAppArray', this.appUtils.simpleCrypto.encryptObject(assignedAppArray));
      window.fetch = fetchPolyfill;

      statusBar.backgroundColorByHexString('#ffffff');
      statusBar.styleDefault();

      this.metaValidationAnnouncementEvent()
      if (this.platform.is('ios')) {
        statusBar.overlaysWebView(false);
      }
      splashScreen.hide();
      //   this.theme.setActiveTheme('yellow-theme');

      this.theme.getActiveTheme().subscribe(val => this.selectedTheme = val);
      this.serviceandtheme.getMaterialActiveTheme().subscribe(val => this.selectedThemeClass = val + ' cs-mat-ui cs-mat-custom-theme');
      if (searchParams.get("layoutname")) {
        this.router.navigate(["/approotpage"],
          { queryParams: { "menu": this.layoutName, "params": this.layoutParams } });

        //this.router.navigate([`/approotpage/${this.layoutName}`])
      }

      this.makeApplicationItemsArray();
    });
  }
  //Dismissing popover
    dismissUserPopover() {
    this.userInfoActive = false;
    }

  //Display notifications
  displayNotifications() {
    this.dismissUserPopover();
    this.notificationsForDisplay = []
    if(this.appUtils.notifications.length>0){
      var sortedNotifications = lodash.orderBy( this.appUtils.notifications, 'createdOn' ,'desc');
      sortedNotifications.forEach(element => {
        var notifyTitle=''
        var icon = ''
        if(element.messageType === "INFO"){
          notifyTitle = "Information";
          icon='icon-mat-info'
        }else if(element.messageType === "WARNING"){
          notifyTitle = "Warning";
          icon='icon-mat-warning'
        }else if(element.messageType === "SUCCESS"){
          notifyTitle = "Success";
          icon='icon-mat-check_circle'
        }else if(element.messageType === "ERROR"){
          notifyTitle = "Error";
          icon='icon-mat-error'
        }else if(element.messageType === "APPROVAL"){
          notifyTitle = "Approval";
          icon='icon-mat-check'
        }
        var notificationDate = element.createdOn;
        let currentDate = new Date().getTime()

        var Difference_In_Time = (currentDate - notificationDate)/1000
        var duration = ''
        if(Difference_In_Time < 60){
          var diffString = Difference_In_Time>1 ?  ' seconds ago' : ' second ago'
          duration = Math.floor(Difference_In_Time) + diffString
        } else if(Difference_In_Time >= 60 && Difference_In_Time < 3600) {
          var diffString = Math.floor(Difference_In_Time / 60) > 1 ? ' Minutes ago' : ' Minute ago'
          duration = Math.floor(Difference_In_Time / 60) + diffString;
        } else if(Difference_In_Time >= 3600 && Difference_In_Time < 86400){
          var diffString =  Math.floor(Difference_In_Time / 3600) > 1 ? ' Hours ago' : ' Hour ago'
          duration = Math.floor(Difference_In_Time / 3600) + diffString;
        } else if(Difference_In_Time >= 86400){
          var diffString = Math.floor(Difference_In_Time / 86400) > 1 ? ' Days ago' : ' Day ago'
          duration = Math.floor(Difference_In_Time / 86400) + diffString;
        }

        var notificationRecipients = element['notificationRecipients']
        var loggeduserNotifyDetail = notificationRecipients.find(recipient => {
          return recipient.userId === this.appUtils.userId
        })


        var isSeen = 'N'
        if(loggeduserNotifyDetail){
          isSeen = loggeduserNotifyDetail['isSeen']
        }

        if (element.systemActivityName !== "") {
          this.notificationsForDisplay.push({ "notificationId": element.notificationId, "messageType": notifyTitle, "processName": element.processName, "activityName": element.systemActivityName, "message": element.message, "notificationTime": duration, "icon": icon, "isSeen": isSeen })
        } else {
          if(element.activityName === 'CSP_SINGLE_ACTIVITY') {
            element.activityName = ""
          }
          this.notificationsForDisplay.push({ "notificationId": element.notificationId, "messageType": notifyTitle, "processName": element.processName, "activityName": element.activityName, "message": element.message, "notificationTime": duration, "icon": icon, "isSeen": isSeen })
        }
      });
    }
  }

  onNotificationClicked(notification){

    this.notificationservice.updateSeenStatus(this.appUtils.orgId,this.appUtils.userId,this.appUtils.sessionId,notification.notificationId.toString()).then(res=>{
      if(res === 'SUCCESS'){
        var originalNotify = this.appUtils.notifications.find(obj => {
          return obj.notificationId === notification.notificationId
        })
        let originalNotifyindex = this.appUtils.notifications.indexOf(originalNotify);

        if (originalNotifyindex > -1) {
          this.appUtils.notifications.splice(originalNotifyindex, 1);
        }
      }
    })

    var notify = this.notificationsForDisplay.find(obj => {
      return obj.notificationId === notification.notificationId
    })

    let index = this.notificationsForDisplay.indexOf(notify);
    notification['isSeen'] = 'Y';
    this.notificationsForDisplay[index] = notification
  }

  makeApplicationItemsArray() {
    const tempArray = [];
    let assignedApps:any = this.appUtils.simpleCrypto.decryptObject(localStorage.getItem("assignedAppArray"))['assignedApps'];
    assignedApps= Array.isArray(assignedApps)?assignedApps:JSON.parse(assignedApps);
    var imageUrl = '', appDescription='';
    assignedApps.forEach(element => {
      // if (element.appType === 'CUSTOM') {
      //   appDescription = `Custom Application`;
      // } else {
      //   appDescription = `Standard Application`;
      // }

      imageUrl = element.appLogoURL;
      appDescription = element.appDescription;
      const appItem = {
        title: element.appDisplayName,
        url: 'apps/pfm_apps/' + this.appUtils.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['orgId'] + '/' + element.appId + '/index.html',
        icon: imageUrl,
        appType: element.appType,
        appDescription: appDescription,
        appId: element.appId
      };
      tempArray.push(appItem);
    });
    this.applistArray = tempArray;
    if (tempArray.length > 0) {
      this.noAppsAssigned = false;
    }
  }
  showAppConnectNotification(){
    this.closePopover();
    var connectUrl;
    let {port,hostname,protocol}=location
    // if (protocol === "http:"){
      // connectUrl= `/apld/core/login/applicationswitcher?menuUrl=/appplatform/NotificationForm.echn?action=launch$getAllNotifications=Y&chainsysSessionGuid=${localStorage.getItem("chainsysSessionId")}&MenuType=EMBED`;
    // } else {
      connectUrl= `/${this.appUtils.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['contextName']}/core/login/applicationswitcher?menuUrl=/appplatform/notification/launch&chainsysSessionGuid=${this.appUtils.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['chainsysSessionId']}&MenuType=EMBED`;
    // }
    var res={
      type:'Notifications',
      url:connectUrl,
    }
    this.appConnectFlag = !this.appConnectFlag;
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = res
    dialogConfig.autoFocus = false
    this.dialog.open(cspfmAlertDialog, dialogConfig);
  }
  closePopover() {    
    this.trigger.toArray().forEach(
      closePopoverElement=>{
        closePopoverElement.closePopover();
      }
    );     
    }
  errorHandler(event,status) {
                    if (location.hostname !== "localhost") {
    console.debug("from error handler",event);
    let selectedImage=status?'default':'deploy-image';
    event.target.src = `${location.origin}/apps/images/${selectedImage}.png `};
  }
  openApplication(pageUrl, appType, appId) {
    this.closePopover();
    let {port,hostname,protocol}=location
    if (appType === "STANDARD") {
      window.location.href = `${this.appUtils["platformWebNodeHostName"]}/${this.appUtils["contextName"]}/core/login/applicationswitcher?applicationId=${appId}&chainsysSessionGuid=${this.appUtils["chainsysSessionId"]}`;
    } else {
      
      if (protocol === "http:"){
        window.location.href = `http://${hostname}:${port}/${pageUrl}`;
      } else {
        window.location.href = `https://${hostname}/${pageUrl}`;
      }

    }

  }
  AnouncementAction() {
    if (this.announcementList_length > 0) {
      this.isValidateOption = !this.isValidateOption
    } else {
      this.showInfoAlert("No new notifications!");
      return;
    }
  }
  AnnouncementCloseButton() {
    this.isValidateOption = false;
  }
  metaValidationAnnouncementEvent() {
    this.observableListenerUtils.subscribe('metaValidationAnnouncement', (modified) => {

      var unChangedWarningTypeList = [];
      if (this.announcementList_length > 0 && modified['warningSet'] && modified['warningSet'].length > 0) {

        if (modified['warningTypes'].length === 2){
          this.announcementList = modified['warningSet']
        } else {
          unChangedWarningTypeList = this.announcementList.filter(item => item.annoucementType !== modified['warningTypes'][0])

          if (unChangedWarningTypeList.length > 0) {
            this.announcementList = unChangedWarningTypeList.concat(modified['warningSet']);
          }else {
            this.announcementList = modified['warningSet']
          }
        }

      }else {
        this.announcementList = modified['warningSet']
      }


      this.announcementList_length = this.announcementList.length
      if (this.appUtils.isMobile) {
        this.callSyncActionButton = "Synchronization";
      }else {
        this.callSyncActionButton = "Goto AppList"
      }

    });
  }
  callSyncAction() {
    this.isValidateOption = false;
    this.announcementList = [];
    if (this.appUtils.isMobile) {
      this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'forceSync' });
    }else {
      window.location.replace('/apps/applist?metaFailureAction=Goto AppList');
    }
  }
  triggerMenuEvents() {
    if (document.getElementsByTagName('ion-menu').length > 0) {
      this.menuService.isDefaultMenu = true;
    }
    if (!this.menuService.isMenuOpen) {
      const index = this.menuService.assignedMenuGroups.findIndex(e => e['expand'])
      if (index > -1) {
        this.menuService.assignedMenuGroups[index]['expand'] = false
      }
      this.menuService.registerMenuBodyClickListener()
      setTimeout(() => {
        this.menuService.isMenuOpen = true;
      }, 100)
    }
    this.userInfoActive = false;
    this.menuService.showMenu()
  }
  public corUsersObjectHierarchyJSON = {
    "objectId": this.metaDbConfig.corUsersObject,
    "objectName": this.metaDbConfig.corUsersObject,
    "fieldId": 0,
    "objectType": "PRIMARY",
    "relationShipType": null,
    "childObject": [

    ]
  };

  getLoggedUserDetail() {
    this.loggedUserDetail  = this.appUtils.loggedUserInfo;
    this.userInfoActive = !this.userInfoActive;
  }


  openSettingPage() {
    this.closePopover();
    this.userInfoActive = false;
    this.router.navigate(["menu/cspfmSettings"], { skipLocationChange: true });
  }

  logoutAction() {
    this.closePopover();
    this.userInfoActive = false;
    this.showAlert('Logout','Are you sure want to logout ?');
  }

  async showAlert(headerText, messageText) {
    if (this.alertFlag) {
      this.alertFlag = !this.alertFlag;
      const confirm = await this.alertCtrl.create({
        header: headerText,
        message: messageText,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            handler: ()=>{
              this.alertFlag=true;
            }
          },
          {
            text: 'OK',
            handler: () => {
              this.alertFlag=true;
              if (headerText === 'Exit') {
                window.location.replace('/apps/applist');
              } else if (headerText === 'Logout') {
                window.location.replace('/apps/applist?metaFailureAction=Logout');
              }
            }
          }
        ]
      });
      confirm.present();
    }
  }
  async userInfoClick(event) {

    if (Object.keys(this.loggedUserDetail).length === 0){
      this.getLoggedUserDetail()
    }else{
      this.userInfoActive = !this.userInfoActive;
    }

  }
  appExitAction() {
    this.userInfoActive = false;
    this.showAlert('Exit','Are you sure want to exit ?');
  }
  setApplicationDefaultImage(event, object) {
   
    let assignedApps:any = this.appUtils.simpleCrypto.decryptObject(localStorage.getItem("assignedAppArray"))['assignedApps'];
    assignedApps= Array.isArray(assignedApps)?assignedApps:JSON.parse(assignedApps);
    var imageUrl = '';

    assignedApps.forEach(element => {
      if (object['appId'] && object['appId'] === element.appId) {
        imageUrl = element.appLogoURL;
      }
    });
    let img = event.srcElement.shadowRoot.children[1];
    if (imageUrl !== undefined && imageUrl !== '') {
      img.src = imageUrl;
    } else {
      img.onerror = () => { 
        img.src = 'assets/img/default_app.png'; 
      };
    }

  }
  async showInfoAlert(info) {
    if (this.alertFlag) {
      this.alertFlag=!this.alertFlag;
      this.alertCtrl.create({
        message: info,
        subHeader: '',
        buttons: [{
          text: 'Ok',
          handler: () => {
            this.alertFlag=true;
            console.log('Confirm Okay');
          }
        }]
      }).then(alert => alert.present());
    }
  }
  ngAfterViewInit(): void {
    const path = 'cs_global_search'
    import(`../core/components/cs_global_search/${path}.ts`).then(instance => {
      if (instance && instance[path]) {
        const dynamicComponentFactory = this.componentFactoryResolver.resolveComponentFactory(instance['cs_global_search']);
        if (this.appConfig?.configuration?.isGlobalSearchEnabled && this.appConfig?.configuration?.globalSearchConfigInfo.length > 0) {
              this.globalSearchKey?.changes.subscribe(()=>{
              if(this.globalSearchKey?.first){
                this.globalSearchKey.first.createComponent(dynamicComponentFactory);
                this.globalSearchKey.changes.unsubscribe();
              }   
            })
        }
      } else {
        console.error('global search component is missing')
      }
    }).catch(errorResponse => {
      console.error('global search component is missing', errorResponse)
    })
  } 

}
