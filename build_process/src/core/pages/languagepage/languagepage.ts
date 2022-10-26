import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { appUtility } from 'src/core/utils/appUtility';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { ToastController, AlertController, Platform } from '@ionic/angular';
import { appConfiguration } from 'src/core/utils/appConfiguration';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { Router } from '@angular/router';
import { IonPullUpFooterState } from "ionic-pullup";

@Component({
  selector: 'app-languagepage',
  templateUrl: './languagepage.html',
  styleUrls: ['./languagepage.scss'],
})
export class languagepage implements OnInit {

  lanList;
  selectedLanguageCode = 'en';
  colorChange = ['cs-footer-icon-color-change','cs-footer-icon-color-change','cs-footer-icon-color-change','cs-footer-icon-color-change'];
  changestyle = ['#fff', '#fff','#fff'];//card
  changestyles = ['cs-cspfmsetting-icon', 'cs-cspfmsetting-icon', 'cs-cspfmsetting-icon', 'cs-cspfmsetting-icon'];
  footerState: IonPullUpFooterState;
  constructor(private translateService: TranslateService,public router: Router,
    public appUtilityObj: appUtility, public emailComposer: EmailComposer, public toastCtrl: ToastController,
      public alertCtrl: AlertController, private platform: Platform,
      public appconfig: appConfiguration, private appPreferences: AppPreferences) {
        this.footerState = IonPullUpFooterState.Collapsed; 
      if (this.appconfig.configuration['languageList']
      && this.appconfig.configuration['languageList'].constructor === Array && this.appconfig.configuration['languageList'].length > 0) {
          this.lanList = this.appconfig.configuration['languageList'];
      } else {
          this.lanList = [];
      }

      this.loadExistingSelectionLanguage();
  }




  loadExistingSelectionLanguage() {
      if (this.appconfig.configuration['defaultLanguage']) {
          if (this.appconfig.configuration['defaultLanguage']['code']) {
              this.selectedLanguageCode = this.appconfig.configuration['defaultLanguage']['code'];
          }
      }

      if (this.appUtilityObj.isMobile) {
          this.appPreferences.fetch('language_' + this.appconfig.configuration.appId).then((val) => {
              if (val && val != null && val !== 'null') {
                  this.selectedLanguageCode = val;
              }
          });
      } else {
          const code = localStorage.getItem('language_' + this.appconfig.configuration.appId);
          if (code != null && code !== 'null') {
              this.selectedLanguageCode = code;
          }
      }
  }

  setLanguage(code) {
    this.selectedLanguageCode = code;
      if (this.appUtilityObj.isMobile) {
          this.appPreferences.store('language_' + this.appconfig.configuration.appId, this.selectedLanguageCode);
      } else {
          localStorage.setItem('language_' + this.appconfig.configuration.appId, this.selectedLanguageCode);
      }

      this.translateService.use(this.selectedLanguageCode);
  }

  toggleChange(event, code) {
   
    if(!event.target.checked && this.selectedLanguageCode === code) {
        event.target.checked = true
    }
  }

  backButtonOnclick(){
    this.router.navigateByUrl("menu/cspfmSettings", {skipLocationChange: true
    });
  }
  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
}
footerExpanded() {
    console.log("Footer expanded!");
  }

  footerCollapsed() {
    console.log("Footer collapsed!");
  }

  toggleFooter() {
    this.footerState =
      this.footerState === IonPullUpFooterState.Collapsed? IonPullUpFooterState.Expanded: IonPullUpFooterState.Collapsed;
}

  changestyletabcolor(item) {
    for (let i = 0; i < this.changestyle.length; i++) {
        this.changestyle[i] = 'cs-cspfmsetting-icon'
    }
    this.changestyle[item] = 'cs-cspfmsetting-icon-onClick'
}

openSettingsPage(item) {
    for (let i = 0; i < this.changestyles.length; i++) {
        this.changestyles[i] = 'cs-cspfmsetting-icon'
    }
    this.changestyles[item] = 'cs-cspfmsetting-icon-onClick'

    if(item === 0){
        this.aboutUsClickAction();
    }else if(item === 1){
        this.contactUsClickAction();
    }else if(item === 2){
        this.feedbackClickAction();
    }else if(item === 3){
        this.shareClickAction();
    }
}

fotterSettingPage(item){
    for (let i = 0; i < this.colorChange.length; i++) {
        this.colorChange[i] = 'cs-footer-icon-color-change'
    }
    this.colorChange[item] = 'cs-footer-icon-color-change-onClick'
    if(item === 0){
        this.aboutUsClickAction();
    }else if(item === 1){
        this.contactUsClickAction();
    }else if(item === 2){
        this.feedbackClickAction();
    }else if(item === 3){
        this.shareClickAction();
    }
}


aboutUsClickAction() {
    window.open('https://www.chainsys.com/');
}
contactUsClickAction() {
    window.open('https://www.chainsys.com/contactus.shtml');
}
feedbackClickAction() {
    this.emailComposer.open({
        to: 'mobileosdeveloper@gmail.com',
        subject: 'Feedback',
        body: 'appContainer Web Application'
    }).then(() => console.log('success'))
        .catch(() => console.log('error'));
}
shareClickAction() {
  
    window.open('https://twitter.com/intent/tweet?text=How to create Dynamic Mobile/Web App, Check here https://www.chainsys.com');
}


goToPlayStoreAction() {
    window.open('https://play.google.com/store/apps/details?id=com.chainsys.echain');
}
goToAppStoreAction() {
    window.open('https://itunes.apple.com/us/app/e-chain/id1022753673?mt=8');
}

}
