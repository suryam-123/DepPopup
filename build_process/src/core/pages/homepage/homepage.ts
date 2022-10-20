import { ApplicationRef, Component, OnInit } from '@angular/core';
import { appUtility } from 'src/core/utils/appUtility';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { appConfiguration } from 'src/core/utils/appConfiguration';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss'],
})
export class homepage implements OnInit {
  version: number;
  public currentObject;
  public appIcon = 'appicon.png';
  constructor(public apputilityObject: appUtility, private appPreferences: AppPreferences, private appConfig: appConfiguration, public appRef :  ApplicationRef) {
    if (this.apputilityObject.isMobile) {
      this.appPreferences.fetch('login_response').then((res) => {
        const assignedAppsDetail = JSON.parse(res);
        const currentAppId = this.appConfig.configuration.appId;
        this.currentObject = assignedAppsDetail.filter(app => app.appId === currentAppId);
        this.appRef.tick()
      });
    } else {
      if (this.apputilityObject.assignedApps) {
        const assignedAppsDetail = this.apputilityObject.assignedApps;
        const currentAppId = this.appConfig.configuration.appId;
        this.currentObject = assignedAppsDetail.filter(app => app.appId === currentAppId);
        // this.appIcon = 'appicon.png';
      }
    }
  }

  ngOnInit() {
    this.apputilityObject.setHomePageNode()
  }

}
