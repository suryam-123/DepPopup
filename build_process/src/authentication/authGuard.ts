import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { appUtility } from 'src/core/utils/appUtility';
import { sessionValidator } from './sessionValidator';
import { ToastController } from '@ionic/angular';

@Injectable()
export class authGuard implements CanActivate {
    constructor(private toastCtrl: ToastController, private router: Router, private utilityObj: appUtility, private sessionvalidation: sessionValidator) { 

    }

    /*canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.sessionvalidation.validateSession().then(res => {
            if (res === "Failure") {     
                window.location.replace('/apps');
                this.displayToast("Session Invalid")
            }            
            return true;
        }).catch(error => {
            console.log("canactive error===>", error)
            return false
        })
    }

    */
            canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
                return Promise.resolve(true)
            }
            async displayToast(message) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 2500,
            position: 'bottom',
            cssClass: 'cs-customToast cs-sucessToast small zoomIn animated'
        });
        setTimeout(() => {
            document.querySelector('.cs-sucessToast').classList.add('zoomOut');
        }, 1500);
        toast.present();
    }
}


