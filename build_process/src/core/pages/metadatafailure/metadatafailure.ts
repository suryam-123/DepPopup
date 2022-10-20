import { Component,  ApplicationRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
import { appConfiguration } from 'src/core/utils/appConfiguration';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
import { appUtility } from 'src/core/utils/appUtility';
import { dbProvider } from 'src/core/db/dbProvider';
import { attachmentDbProvider } from 'src/core/db/attachmentDbProvider';

@Component({
  selector: 'app-metadatafailure',
  templateUrl: './metadatafailure.html',
  styleUrls: ['./metadatafailure.scss'],
})
export class metadatafailure {

  public failureMessage = '';
  public isSyncFailed = false;
  public actionName = ''
  public failureContent = '';
  public imgName = '';
  private backButtonSubscribeRef;
  public forceUpdateAvailable = false;
  public forceUpdaeImagePath = "assets/metaimages/appm_app_logo.png"

  constructor(public dbprovider: dbProvider, public attachmentdbprovider: attachmentDbProvider, public applicationRef: ApplicationRef, public appUtils: appUtility,
    public activeRoute: ActivatedRoute, public platform: Platform, public appConfic: appConfiguration, private appPreferences: AppPreferences, private broadcaster: Broadcaster, public metaConfig: metaDbConfiguration) {
    this.getModefiedRecordsFromParams();
    this.disableHardWareBackButtonAction();
  }

  getModefiedRecordsFromParams() {

    this.activeRoute.queryParams.subscribe(params => {
      var failureMesg = JSON.parse(params.modifiedRecord);
      this.failureMessage = failureMesg.message;
      this.isSyncFailed = true;
      this.setImageAndActionButtonName();
      this.applicationRef.tick();
    });
   

  }

  buttonClickAction() {
    this.callToNativePageWithActions();

  }



  setImageAndActionButtonName() {
    var taskList = [];
    if (this.failureMessage === this.metaConfig.userInActive
      || this.failureMessage === this.metaConfig.userLocked ||
      this.failureMessage === this.metaConfig.userSessionExpired) {

      this.actionName = 'Login';
      this.imgName = 'user_locked';
      this.failureContent = 'Please reach administrator';

      if (this.failureMessage === this.metaConfig.userInActive) {
        this.imgName = 'activation_required';
        this.failureContent = 'Please reach administrator';
      } else if (this.failureMessage === this.metaConfig.userSessionExpired) {
        // need to add this functionality after implemented oAuth 
        this.imgName = 'session_expired';
        this.failureContent = 'Login is required for using this application';
      }

    } else if (this.failureMessage === this.metaConfig.appUnassigned) {
      taskList.push(this.dbprovider.destroyDb());
      taskList.push(this.attachmentdbprovider.destroyDb());
      Promise.all(taskList).then(res => {
        if (res.length === 2 && res[0]['ok'] === true && res[1]['ok'] === true) {
          this.getUnAssignedAppName();

          this.actionName = 'Goto AppList';
          this.imgName = 'unassigned_apps';
          this.failureContent = '';
          this.applicationRef.tick();
        }
      });
    } else if (this.failureMessage.includes(this.metaConfig.newVersionWithForceUpdate)) {
      if (this.appUtils.isMobile) {
        this.forceUpdateAvailable = true;
        this.forceUpdaeImagePath = 'appicon.png';
        this.actionName = 'Resync';
        this.imgName = 'force_update';
        this.failureContent = 'Sync action is required for proceed';
      } else {
        this.forceUpdateAvailable = true;
        this.forceUpdaeImagePath = 'appicon.png';
        this.actionName = 'Goto AppList';
        this.imgName = 'force_update';
        this.failureContent = 'You must reopen this app, because it have force update';
      }
    } else if (this.failureMessage === this.metaConfig.menuGroupInActive) {
      if (this.appUtils.isMobile) {
        this.actionName = 'Resync';
        this.imgName = 'inactive_menu';
        this.failureContent = 'Sync action is required for proceed';
      } else {
        this.actionName = 'Goto AppList';
        this.imgName = 'inactive_menu';
        this.failureContent = 'You must reopen the app, because some menu group inactivated for you';
      }
    } else if (this.failureMessage === this.metaConfig.menuGroupUnAssigned) {
      if (this.appUtils.isMobile) {
        this.actionName = 'Resync';
        this.imgName = 'unassigned_menu';
        this.failureContent = 'Use other app';
        this.failureContent = 'Sync action is required for proceed';
      } else {
        this.actionName = 'Goto AppList';
        this.imgName = 'unassigned_menu';
        this.failureContent = 'Use other app';
        this.failureContent = 'You must reopen the app, because some menu un assigned for you';
      }
    } else if (this.failureMessage === this.metaConfig.applicationInActive) {

      this.actionName = 'Goto AppList';
      this.imgName = 'unassigned_menu';
      this.failureContent = 'Use other app';
    } else if (this.failureMessage === this.metaConfig.currentlyNoAppsAreAssigned) {

      this.actionName = 'Login';
      this.imgName = 'unassigned_menu';
      this.failureContent = 'No apps are assigned to you. Please login with other user';
    }
  }

  getUnAssignedAppName() {
    var appId = this.appConfic.configuration.appId;
    if (this.appUtils.isMobile) {

      this.appPreferences.fetch('login_response').then((res) => {
        JSON.parse(res).map(appDataObject => {
          if (appDataObject.appId === appId) {
            this.failureMessage = appDataObject.appDisplayName + " " + this.failureMessage;
          }
        })

      });
    } else {
      if (this.appUtils.assignedApps) {
        var assignedAppsDetail = this.appUtils.assignedApps;

        assignedAppsDetail.map(assignedAppDataObject => {
          if (assignedAppDataObject.appId === appId) {
            this.failureMessage = assignedAppDataObject.appDisplayName + " " + this.failureMessage;

          }
        })

      }
    }
  }

  callToNativePageWithActions() {
    if (this.appUtils.isMobile) {
      if (this.failureMessage === this.metaConfig.userInActive
        || this.failureMessage === this.metaConfig.userLocked) {
        this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'Logout' });
      } else if (this.failureMessage.includes(this.metaConfig.appUnassigned)) {
        var appId = this.appConfic.configuration.appId;
        this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'AppUnAssigned', 'appId': appId });
      } else if (this.failureMessage.includes(this.metaConfig.newVersionWithForceUpdate)) {
        this.broadcaster.fireNativeEvent("ionicNativeBroadcast", { action: 'AppVersionWithForceUpdate' });
      } else if (this.failureMessage === this.metaConfig.menuGroupInActive
        || this.failureMessage === this.metaConfig.menuGroupUnAssigned) {
        this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'MenuGroupUnassigned' })
      } else if (this.failureMessage === this.metaConfig.applicationInActive) {
        this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'ApplicationInActive' });
      } else if (this.failureMessage === this.metaConfig.currentlyNoAppsAreAssigned) {
        this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'NoAppsAssigned' });
      }
    } else {
      if (this.failureMessage === this.metaConfig.userInActive
        || this.failureMessage === this.metaConfig.userLocked) {
        window.location.replace('/apps/applist?metaFailureAction=Logout');
      } else if (this.failureMessage.includes(this.metaConfig.appUnassigned)) {
        window.location.replace('/apps/applist?metaFailureAction=Goto AppList');
      } else if (this.failureMessage.includes(this.metaConfig.newVersionWithForceUpdate)) {
        window.location.replace('/apps/applist?metaFailureAction=Goto AppList');
      } else if (this.failureMessage === this.metaConfig.menuGroupInActive
        || this.failureMessage === this.metaConfig.menuGroupUnAssigned) {
        window.location.replace('/apps/applist?metaFailureAction=Goto AppList');
      } else if (this.failureMessage === this.metaConfig.applicationInActive) {
        window.location.replace('/apps/applist?metaFailureAction=Goto AppList');
      }
    }
  }


  ionViewWillLeave() {
    this.backButtonSubscribeRef.unsubscribe();
  }

  // To handle Android device default back button
  disableHardWareBackButtonAction() {
    this.backButtonSubscribeRef = this.platform.backButton.subscribeWithPriority(999999, () => {

      if (this.isSyncFailed) {
        return;
      }

    });
  }
}
