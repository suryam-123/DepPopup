import { Injectable } from '@angular/core';
import { appConfiguration } from './appConfiguration';
import { appUtility } from './appUtility';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { dbProvider } from '../db/dbProvider';
import { couchdbProvider } from '../db/couchdbProvider';
import { attachmentDbProvider } from '../db/attachmentDbProvider';
import { attachmentCouchDbProvider } from '../db/attachmentCouchDbProvider';
import { metaDbValidation } from './metaDbValidation';
import { metaDataDbProvider } from '../db/metaDataDbProvider';
import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
import { cspfmExecutionPouchDbProvider } from '../db/cspfmExecutionPouchDbProvider';
import { formulaCouchDbProvider } from '../db/formulaCouchDbProvider';
import { cspfmMetaCouchDbProvider } from '../db/cspfmMetaCouchDbProvider';
import { HttpClient } from '@angular/common/http';
import { sessionValidator } from 'src/authentication/sessionValidator';
@Injectable({
  providedIn: 'root'
})
export class networkHandler {
  public networkConnectSubscription;
  public networkDisconnectSubscription;
  constructor(public appConfig: appConfiguration,
    public appUtilityObj: appUtility,
    public appPreferences: AppPreferences,
    public network: Network,
    public observableListenerUtils: cspfmObservableListenerUtils,
    public dbprovider: dbProvider,
    public couchdbprovider: couchdbProvider,
    public attachmentDbprovider: attachmentDbProvider,
    public attachmentCouchDBProvider: attachmentCouchDbProvider,
    public metaDbValidation: metaDbValidation,
    public metaDbProvider: metaDataDbProvider,private httpClient:HttpClient,
    public broadcaster: Broadcaster,public formulacouchDbProviderObj: formulaCouchDbProvider,
    public cspfmExecutionPouchDBProvider : cspfmExecutionPouchDbProvider,   public metaCouchDbProvider: cspfmMetaCouchDbProvider,private sessionvalidator: sessionValidator) { }

  networkHandlerForSync() {
    if (this.appUtilityObj.isMobile) {
      this.startNetworkConnectListener();
      this.startNetworkDisconnectListener();
    } else {
      window.addEventListener('offline', () => {
        this.stopSyncProcess();
      });
      window.addEventListener('online', () => {
        this.startSyncProcess();
      });
    }
  }
  startNetworkConnectListener() {
    this.networkConnectSubscription = this.network.onConnect().subscribe(() => {
      console.log('now you are online!');
      this.startSyncProcess();
    });
  }
  startNetworkDisconnectListener() {
    this.networkDisconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('now you are offline!');
      this.stopSyncProcess();
    });
  }
  startSyncProcess() {
    const syncCompletedStatus = this.appConfig.configuration.appId + "synCompletedStatus";
    if (this.appUtilityObj.isMobile) { // Mobile
      this.appPreferences.fetch("", syncCompletedStatus).then(res => {
        if (res === true) { // Live Sync
          this.oauthTokenValidation().then(oAuthResponse => {
            if (oAuthResponse === "SUCCESS") {
              this.startLiveSync();
            } else {
              console.log('broadcaster called')
              this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'Logout' })
                .then(() => console.log('Success'))
                .catch(() => console.log('Error'));
            }
          })
        } else if (res === false) { // Full Sync
          const response = {
            "network": true
          }
          this.observableListenerUtils.emit('startFullSync', response);
        }
      });
    } else { // Browser
      const syncCompletedStatusValue = localStorage.getItem(syncCompletedStatus)
      if (syncCompletedStatusValue === "true") { // Live Sync
        this.sessionvalidator.validateSession().then(response => {
          if (response === "SUCCESS") {
            this.startLiveSync();
          } else {
            window.location.replace('/apps/applist');
          }
        })
      } else if (syncCompletedStatusValue === "false") { // Full Sync
        const response = {
          "network": true
        }
        this.observableListenerUtils.emit('startFullSync', response);
      }
    }
  }
  stopSyncProcess() {
    const syncCompletedStatus = this.appConfig.configuration.appId + "synCompletedStatus";
    if (this.appUtilityObj.isMobile) { // Mobile
      this.appPreferences.fetch("", syncCompletedStatus).then(res => {
        if (res === true) { // Live Sync
          this.stopLiveSync();
        } else if (res === false) { // Full Sync
          const response = {
            "network": false
          }
          this.observableListenerUtils.emit('startFullSync', response);
        }
      });
    } else { // Browser
      const syncCompletedStatusValue = localStorage.getItem(syncCompletedStatus)
      if (syncCompletedStatusValue === "true") { // Live Sync
        this.stopLiveSync();
      } else if (syncCompletedStatusValue === "false") { // Full Sync
        const res = {
          "network": false
        }
        this.observableListenerUtils.emit('startFullSync', res);
      }
    }
  }
  stopLiveSync() {
    this.metaDbProvider.cancelLivereplicationFromServerWithSelector();
    this.dbprovider.cancelLivereplicationFromServerWithSelector();
    this.attachmentDbprovider.cancelLivereplicationFromServerWithSelector();
    this.cspfmExecutionPouchDBProvider.cancelLivereplicationFromServerWithSelector();
    this.couchdbprovider.networkWithOutConnectivity();
    this.attachmentCouchDBProvider.networkWithOutConnectivity();
    this.formulacouchDbProviderObj.networkWithOutConnectivity();
    this.metaCouchDbProvider.networkWithOutConnectivity();
  }
  startLiveSync() {
    //Open Sync Page
    this.observableListenerUtils.emit('syncPageSubscribe',"")
  }
  oauthTokenValidation() {
    const url = this.appUtilityObj.appBuilderURL;
    const postData = {
      'inputparams': {
        'orgId': this.appUtilityObj.orgId,
        'accessToken': this.appUtilityObj.accessToken,
        'appname': 'appM'
      }
    };
    const serviceURl = url + '/appcontainer/validateAccessToken';
    return this.httpClient
      .post(serviceURl,postData).toPromise()
      .then(res => {
        const response = res;
        if (response['status'] === 'Success') {
          this.appPreferences.store('', 'accessToken', response['accessToken'])
          this.appUtilityObj.accessToken = response['accessToken'];
          return Promise.resolve("SUCCESS");
        } else {
          return Promise.resolve("Failure");
        }
      })
      .catch(error => {
        console.log('An error occurred', error);
        return Promise.resolve("Failure");
      });
  }
}
