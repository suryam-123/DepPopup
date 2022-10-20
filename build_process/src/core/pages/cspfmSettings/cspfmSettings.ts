import { Component, OnInit } from '@angular/core';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { ToastController, AlertController, Platform, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { themechange } from '../../services/themechange.service';
import { appUtility } from 'src/core/utils/appUtility';
import { appConfiguration } from '../../utils/appConfiguration';
import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
@Component({
    selector: 'app-cspfmSettings',
    templateUrl: './cspfmSettings.html',
    styleUrls: ['./cspfmSettings.scss'],
})
export class cspfmSettings implements OnInit {
    changestyle = ['cs-cspfmsetting-icon', 'cs-cspfmsetting-icon', 'cs-cspfmsetting-icon', 'cs-cspfmsetting-icon'];
    public isLanguageRequired: boolean;

    constructor(public emailComposer: EmailComposer, public appConfig: appConfiguration, public appUtilityObj: appUtility, public navController: NavController, private router: Router,
        public toastCtrl: ToastController, public alertCtrl: AlertController, private platform: Platform, private service: themechange,
        private broadcaster: Broadcaster) {

        if (this.appConfig.configuration.defaultMenu.isI18Enable) {
            this.isLanguageRequired = true;
        } else {
            this.isLanguageRequired = false;

        }

    }


    // openLanguagePage(item){
    //     this.changestyletabcolor(item)
    //     this.navController.navigateBack(['/menu/languagepage'], { skipLocationChange: true }); 
    // }

    // openThemePage(item){
    //     this.changestyletabcolor(item)
    //     this.navController.navigateBack(['/menu/themepage'], { skipLocationChange: true }); 

    // }

    // openSettingsPage(item){
    //     this.changestyletabcolor(item)
    //     this.navController.navigateBack(['/menu/settingpage'], { skipLocationChange: true }); 

    // }

    // exitAction(item){
    //     this.changestyletabcolor(item)
    //     window.location.replace('/apps/applist');

    // }

    openLanguagePage(item) {
        this.changestyletabcolor(item)
        this.navController.navigateBack(['/menu/cspfmSettings/languagepage'], { skipLocationChange: true });
    }

    openThemePage(item) {
        this.changestyletabcolor(item)
        this.navController.navigateBack(['/menu/cspfmSettings/themepage'], { skipLocationChange: true });

    }

    openSettingsPage(item) {
        this.changestyletabcolor(item)
        this.navController.navigateBack(['/menu/cspfmSettings/settingpage'], { skipLocationChange: true });

    }

    exitAction(item) {
        this.changestyletabcolor(item)
        this.showExitAlertView();
    }

    async showExitAlertView() {
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
                            this.callNotificationBroadcastPlugin({ title: 'Exit' });
                          } else {
                            window.location.replace('/apps/applist');
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
    ionViewWillEnter() {
        this.changestyletabcolor(0);
    }
    ionViewDidEnter() {

    }
    ngOnInit() {
    }

    changestyletabcolor(item) {
        for (let i = 0; i < this.changestyle.length; i++) {
            this.changestyle[i] = 'cs-cspfmsetting-icon'
        }
        this.changestyle[item] = 'cs-cspfmsetting-icon-onClick'
    }
}
