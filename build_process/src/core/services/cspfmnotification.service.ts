
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class cspfmNotificationService {
    private socket;

    constructor(private http: HttpClient) {
    }
    public initsocket(url,option){
        this.socket = io(url,option)
    }

    public notificationRequest() {
        this.socket.emit('getNotification', 0);
    }

    public getMessages = () => {
        return Observable.create((observer) => {
          if(this.socket){
                this.socket.on('getMessage', (message) => {
                    observer.next(message);
                });
              }
            
        });
    }
    updateSeenStatus(orgId, userId, sessionId,notificationIds) {

        const postData = {
            "inputparams": {
              "sessionType": "NODEJS",
              "sessionToken": sessionId,
              "userId": userId,
              "orgId": orgId,
              "notificationIds": notificationIds
            }
          }
         const serviceURl = '/appbuilder/appcontainer/updatenotificationseenstatus';
        //const serviceURl = 'http://localhost:3000/updatenotificationseenstatus';

        return this.http
            .post(serviceURl, JSON.stringify(postData))
            .toPromise().then(res => {
                if (res['status'] === 'SUCCESS') {
                    return Promise.resolve('SUCCESS');
                }    else{
                    return Promise.resolve('ERROR');
                }
            })
            .catch(error => {
                console.log('An error occurred', error);
                return Promise.resolve(error.message || 'Seen update failed');
            });
    }
}