import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import SimpleCrypto from "simple-crypto-js";
import { appUtility } from 'src/core/utils/appUtility';
@Injectable()
export class sessionValidator {
    constructor(private appUtility:appUtility,private http: HttpClient) { }
    validateSession() {
        if (this.appUtility.isMobile) {
            return Promise.resolve("SUCCESS")
        } else {            
            const url = '/apps/AuthGuardAuth';

            return this.http.get(url)
                .toPromise()
                .then(res => {                    
                    if (res === 'success') {
                        return Promise.resolve("SUCCESS")
                    } else {
                        return Promise.resolve("Failure")
                    }
                }).catch(error => {
                    console.log("error===>", error)
                    return Promise.resolve("Failure")
                })
        }
    }

    validateSessionWithOrgidandUserId() {
        const userId = this.appUtility.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['userId'];
        const orgId = this.appUtility.simpleCrypto.decryptObject(localStorage.getItem("localStore"))['orgId'];
        if (userId && orgId) {
            
            const url = '/apps/sessionValidWithId';

            return this.http.post(url, { userId: userId, orgId: orgId })
                .toPromise()
                .then(res => {
            
                    return res
                }).catch(error => {
                    console.log("error===>", error)
                    const errmsg = error.message || 'Server connection failed';
                    return { 'status': 'failed', 'message': errmsg }
                })
        } else {
            
            const url = '/apps/sessionValid';
            return this.http.get(url)
                .toPromise()
                .then(res => {            
                    return res
                }).catch(error => {
                    console.log("error===>", error)
                    const errmsg = error.message || 'Server connection failed';
                    return { 'status': 'failed', 'message': errmsg }
                })
        }
    }
}


