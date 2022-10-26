

/* 
 *   File: settingpage.ts
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */
import { Component, OnInit } from '@angular/core';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import {   Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { themechange } from '../../services/themechange.service';
import { appUtility } from 'src/core/utils/appUtility';
import { IonPullUpFooterState } from "ionic-pullup";

@Component({
    selector: 'app-settingpage',
    templateUrl: './settingpage.html',
    styleUrls: ['./settingpage.scss'],
})
export class settingpage implements OnInit {
    colorChange = ['cs-footer-icon-color-change','cs-footer-icon-color-change','cs-footer-icon-color-change','cs-footer-icon-color-change'];
    changestyles = ['cs-cspfmsetting-icon', 'cs-cspfmsetting-icon', 'cs-cspfmsetting-icon', 'cs-cspfmsetting-icon'];
    footerState: IonPullUpFooterState;
    offlinemode: boolean;
    pushnotification: boolean;
    isRequiredToShow: boolean;
    changestyle = ['#fff', '#fff'];
    constructor(public emailComposer: EmailComposer, public appUtilityObj: appUtility, private router: Router,
          private platform: Platform, private service: themechange,) {
        this.footerState = IonPullUpFooterState.Collapsed; 
        const platforms = this.platform.platforms();
        
        if (platforms[0] === 'core') {
            this.isRequiredToShow = true;
        } else {
            this.isRequiredToShow = false;
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
    sendMessageAction() {
        console.log('sendMessageAction');
    }
    changeOfflineMode() {
        if (this.offlinemode === true) {
            console.log(this.offlinemode + 'true');
        } else {
            console.log(this.offlinemode + 'false');

        }
    }
    changePushNotification() {
        if (this.pushnotification === true) {
            console.log(this.pushnotification + 'true');
        } else {
            console.log(this.pushnotification + 'false');

        }
    }


   
    ionViewDidEnter() {

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

    backButtonOnclick() {
        this.router.navigateByUrl("menu/cspfmSettings", {
            skipLocationChange: true
        });
    }
    //new
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
}
