import { Injectable } from '@angular/core';
import { appUtility } from './appUtility';
import { appConfiguration } from './appConfiguration';
import { HttpClient } from "@angular/common/http";
@Injectable({
    providedIn: 'root'
})
export class onlineDbIndexCreation {
    public isAllSearchIndexCompleted = false;
    public isGlobalSearchIndexCompleted = false;


    constructor(public appUtilityObj: appUtility, public appConfigurationObj: appConfiguration,private httpClient:HttpClient) {

    }
    
    public callBuilderForIndexingApi(){
        let url = "";
        const requestParams = {
            "inputparams": {
                "appId": this.appConfigurationObj.configuration.appId,
                "orgId": this.appUtilityObj.orgId,
                "userId": this.appUtilityObj.userId
            }
        }

        if (this.appUtilityObj.isMobile) {
            url = this.appUtilityObj.appBuilderURL + "/appcontainer/couchIndexStatus";
            requestParams.inputparams['sessionToken'] = this.appUtilityObj.accessToken
            requestParams.inputparams['sessionType'] = "OAUTH"
        } else {
            url = "/apps/couchIndexStatus";
            requestParams.inputparams['sessionToken'] = this.appUtilityObj.sessionId
            requestParams.inputparams['sessionType'] = "NODEJS"
        }
        return this.httpClient.post(url, requestParams).toPromise().then(res => {
            this.parseIndexingResponse(res)
        }).catch(err => {
            console.log(err);
        });
    }

    parseIndexingResponse(response){
        if(response['status'] === 'SUCCESS'){
            if(response['bodyResponse'].length > 0){
                let isIndexRunning = false;
                response['bodyResponse'].forEach(indexObj => {
                    if(indexObj['status'] === 'OPEN' || indexObj['status'] === 'INPROGRESS'){
                        isIndexRunning = true;
                    }
                });

                if(!isIndexRunning && this.appConfigurationObj.configuration.isGlobalSearchEnabled) {
                    if(response['globalSearchIndexStatus'] === 'OPEN' || response['globalSearchIndexStatus'] === 'INPROGRESS') {
                        this.isAllSearchIndexCompleted = true;
                        isIndexRunning = true
                    }
                }

                if(isIndexRunning){
                    setTimeout(() => {
                        this.callBuilderForIndexingApi();
                    }, 60000);
                    return
                }else{
                    this.isAllSearchIndexCompleted = true;
                    this.isGlobalSearchIndexCompleted = true
                }
            }else{
                this.isAllSearchIndexCompleted = true;
                if(response['globalSearchIndexStatus'] === 'COMPLETED' && this.appConfigurationObj.configuration.isGlobalSearchEnabled) {
                    this.isGlobalSearchIndexCompleted = true;
                }
            }
        }else{
            console.log("builder index API response : " + response['status'],response['message'])
        }
    }
}
