import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { appUtility } from 'src/core/utils/appUtility';
import { Router, ActivatedRoute } from '@angular/router';
import { appConfiguration } from 'src/core/utils/appConfiguration';
import { TranslateService } from '@ngx-translate/core';
import { Platform, IonRouterOutlet, AlertController, NavController } from '@ionic/angular';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';

@Component({
  selector: 'app-approotpage',
  templateUrl: './approotpage.html',
  styleUrls: ['./approotpage.scss'],
})
export class approotpage implements OnInit {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  isConfigurationFailed = false;
  failureMessage: string;
  failureDescription: string;
  rootPage: any = 'syncpage';
  embedingRoute: any;
  embedingRouteParams: any;
  constructor(public appUtilityObj: appUtility, public router: Router, public appConfig: appConfiguration,
    private broadcaster: Broadcaster, public translate: TranslateService,public observableListenerUtils: cspfmObservableListenerUtils, private appPreferences: AppPreferences,
    public platform: Platform, public alertCtrl: AlertController,
    public navCtrl: NavController, private route: ActivatedRoute, private dialog: MatDialog) {

    this.route.queryParams.subscribe(params => {
      this.embedingRoute = params['menu']
      if (this.embedingRoute) {
        this.rootPage = `menu/${this.embedingRoute}`
        this.embedingRouteParams = params['params']
      }
    })

    platform.backButton.subscribeWithPriority(0, () => {
      let childNode = document.getElementsByTagName('ion-router-outlet')[1]
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (childNode.childNodes.length === 1 && childNode.children[0].tagName.toLowerCase() !== this.appUtilityObj.landingPageInfo.selector) {
        this.appUtilityObj.navigateToHomepage()
      } else if (childNode.childNodes.length === 1 && childNode.children[0].tagName.toLowerCase() === this.appUtilityObj.landingPageInfo.selector) {
        this.showExitAlertView({ title: 'Exit' })
      } else if (router.url === '/syncpage') {
        return
      } else {
        this.navCtrl.pop()
      }
    })

    platform.ready().then(async () => {
      await this.appUtilityObj.getPlatform();
      if (!this.appUtilityObj.isMobile && ((navigator.userAgent.includes('Firefox/') && parseFloat(navigator.userAgent.split('Firefox/')[1].split(" ")[0]) < 37) || (navigator.userAgent.includes('Edg/') && parseFloat(navigator.userAgent.split('Edg/')[1].split(" ")[0]) < 12) || (navigator.userAgent.includes('Chrome/') && parseFloat(navigator.userAgent.split('Chrome/')[1].split(" ")[0]) < 24) || (navigator.userAgent.includes('Safari/') && parseFloat(navigator.userAgent.split('Safari/')[1].split(" ")[0]) < 10))) {
        let browserInfo = {
          "Firefox": {
            "browserName": "Mozila Firefox",
            "availableVersionOfIndexedDb": 37
          },
          "Edg": {
            "browserName": "Microsoft Edge",
            "availableVersionOfIndexedDb": 12
          },
          "Chrome": {
            "browserName": "Google Chrome",
            "availableVersionOfIndexedDb": 24
          },
          "Safari": {
            "browserName": "Apple Safari",
            "availableVersionOfIndexedDb": 10
          }
        };
        let browserIdentifierKey = navigator.userAgent.includes('Firefox/') ? "Firefox" : navigator.userAgent.includes('Edg/') ? "Edg" : navigator.userAgent.includes('Chrome/') ? "Chrome" : navigator.userAgent.includes('Safari/') ? "Safari" : " ";
        if (browserIdentifierKey) {
          this.showBrowserAlert(this, `You are using ${browserInfo[browserIdentifierKey]["browserName"]} version ${navigator.userAgent.split(browserIdentifierKey + '/')[1].split(" ")[0]}, this version of ${browserInfo[browserIdentifierKey]["browserName"]} don't support the indexedDb functionality. So kindly upgrade your ${browserInfo[browserIdentifierKey]["browserName"]} version above ${browserInfo[browserIdentifierKey]["availableVersionOfIndexedDb"]}.`)
        } else {
          this.showBrowserAlert(this, `Your browser is don't suppor the indexedDb functionality.So kindly use any other browser.`)
        }
      } else if (!this.appUtilityObj.isMobile && navigator.userAgent.includes('Firefox/')) {
        this.indexDbOpen().then(res => {
          if (res === "SUCCESS") {
            this.initialSetup();
            //  meta data failure page trigger
            this.failurePageEventSubscribe()
          } else if (res === "ERROR") {
            this.showBrowserAlert(this, `You are using Mozila Firefox in private window, this private window don't support the indexedDb functionality. So kindly use the normal window of Mozila Firefox.`);
          }
        }).catch(error => {
          console.log("IndexDb Error:", error)
        });
      } else {
        this.initialSetup();
        //  meta data failure page trigger
        this.failurePageEventSubscribe()
      }
    });

  }

  ngOnInit() {
  }

  indexDbOpen() {
    return new Promise(function (resolve) {
      let dbReq = indexedDB.open("CheckIncongito");
      dbReq.onsuccess = function (event) {
       
        resolve('SUCCESS');
      }
      dbReq.onerror = function (event) {
        resolve('ERROR');
      }
    });
  }

  showBrowserAlert(parent: object, message: string): MatDialogRef<cspfmAlertDialog, any> {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      title: message,
      buttonInfo: [],
      parentContext: parent,
      type: "Browser"
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false
    return this.dialog.open(cspfmAlertDialog, dialogConfig);
  }

  initialSetup() {
    this.appUtilityObj.initialSetup().then(res => {
      if (res === 'Success') {
        
        this.syncPageSubscribe();
        if (this.embedingRoute) {
          let embedingparam = { 'params': this.embedingRouteParams }
          this.router.navigate([this.rootPage], { skipLocationChange: true, queryParams: embedingparam });
        } else {
          this.router.navigate([this.rootPage], { skipLocationChange: true });
        }
        this.setApplicationLanguage();
      } else {
        this.isConfigurationFailed = true;
        this.failureMessage = res;
        if (res === 'Invalid session') {
          this.failureDescription = 'Please login again';
        } else if (res === "Session Expired") {
          this.failureDescription = '';
        } else if(res === "Upgrade Required"){
          this.failureDescription = '';
          this.failureMessage = "";
        } else {
          this.failureDescription = 'Please reach application administrator';
        }
      }
    });
  }
  gotoApplist() {
    this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'Exit' })
      .then(() => console.log('Success'))
      .catch(() => console.log('Error'));
  }

  setApplicationLanguage() {
    this.translate.setDefaultLang('en');
    if (this.appConfig.configuration['defaultLanguage']) {
      if (this.appConfig.configuration['defaultLanguage']['code']) {
        this.translate.use(this.appConfig.configuration['defaultLanguage']['code']);
      } else {
        this.translate.use('en');
      }
    } else {
      this.translate.use('en');
    }

    if (this.appUtilityObj.isMobile) {
      this.appPreferences.fetch('language_' + this.appConfig.configuration.appId).then((val) => {
        if (val && val != null && val !== 'null') {
          this.translate.use(val);
        }
      });
    } else {
      const code = localStorage.getItem('language_' + this.appConfig.configuration.appId);
      if (code != null && code !== 'null') {
        this.translate.use(code);
      }
    }
  }
  failurePageEventSubscribe() {
    this.observableListenerUtils.subscribe('events', (modified) => {
      const editNavigationParams = {

        'modifiedRecord': JSON.stringify(modified)
      };
      this.router.navigate(['/metadatafailure'], { queryParams: editNavigationParams, skipLocationChange: true });
    });
  }
  syncPageSubscribe() {
    this.observableListenerUtils.subscribe('syncPageSubscribe', () => {
      this.router.navigate([this.rootPage], { skipLocationChange: true });
    })
  }
  async showExitAlertView(page) {
    const confirm = await this.alertCtrl.create({
      header: 'Exit',
      message: 'Are you sure want to exit ?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'OK',
          handler: () => {
            if (this.appUtilityObj.isMobile) {
              this.callNotificationBroadcastPlugin(page);
            }
          }
        }
      ]
    });
    confirm.present();
  }
  callNotificationBroadcastPlugin(page) {
    this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: page.title })
      .then(() => console.log('Success'))
      .catch(() => console.log('Error'));
  }
}
