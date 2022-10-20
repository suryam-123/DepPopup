import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { themechange } from '../../services/themechange.service';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { appUtility } from 'src/core/utils/appUtility';
import { IonPullUpFooterState } from "ionic-pullup";
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
const themes = {
  default: {
    primary: '',
    secondary: '',
    tertiary: '',
  },
  yellow: {
    primary: '#dabc56',
    secondary: '#FCFF6C',
    tertiary: '#FE5F55',
  },
  blue: {
    primary: '#3880ff',
    secondary: '#FCFF6C',
    tertiary: '#FE5F55',
  },
  red: {
    primary: '#F44336',
    secondary: '#FCFF6C',
    tertiary: '#FE5F55',
  },
  teal: {
    primary: '#009688',
    secondary: '#4CE0B3',
    tertiary: '#FF5E79',
    contrast: '#fff',
  },
  indigo: {
    primary: '#5070e9',
    secondary: '#7288d8',
    tertiary: '#a9b6e8',
  },

};
@Component({
  selector: 'app-themepage',
  templateUrl: './themepage.html',
  styleUrls: ['./themepage.scss'],
})
export class themepage implements OnInit {

  
  currentbg;
  public themenewColor;
  public primary_color = "";
  public secondary_color = "";
  public tertiary_color = "";
  themeType = 'light';
  changestyle = ['#fff', '#fff'];
  colorChange = ['cs-footer-icon-color-change','cs-footer-icon-color-change','cs-footer-icon-color-change','cs-footer-icon-color-change'];
  changestyles = ['cs-cspfmsetting-icon', 'cs-cspfmsetting-icon', 'cs-cspfmsetting-icon', 'cs-cspfmsetting-icon'];
  footerState: IonPullUpFooterState;
  constructor(public emailComposer: EmailComposer,private router: Router, public appUtilityObj:appUtility, private serviceandtheme: themechange, private statusBar: StatusBar) { }

  // ngOnInit() {
  // }
  submit() {

    if (this.primary_color === "" && this.secondary_color === "" && this.tertiary_color === "") {
      alert('Not valid/Empty');
    } else {
      console.log(themes.default.primary = this.primary_color);
      console.log(themes.default.secondary = this.secondary_color);
      console.log(themes.default.tertiary = this.tertiary_color);
      this.changeTheme('default');
      this.serviceandtheme.setColor(themes);
    }

  }
  changeTheme(name) {
    this.serviceandtheme.setTheme(themes[name]);
  }
  changeThemeformaterial(className) {
    this.serviceandtheme.setMaterialActiveTheme(className);
  }

  changeToStyleOne() {
    this.themeType = 'default';
    this.serviceandtheme.changeToStyleOne();
    this.statusBar.backgroundColorByHexString('#000000');
    this.statusBar.styleLightContent();
  }

  changeToStyleTwo() {
    this.themeType = 'light';
    this.serviceandtheme.changeToStyleTwo();
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.statusBar.styleDefault();
  }

  backButtonOnclick(){
    this.router.navigateByUrl("menu/cspfmSettings", {skipLocationChange: true
    });
  }
  changestyletabcolor(item) {
    for (let i = 0; i < this.changestyle.length; i++) {
        this.changestyle[i] = 'cs-cspfmsetting-icon'
    }
    this.changestyle[item] = 'cs-cspfmsetting-icon-onClick'
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


