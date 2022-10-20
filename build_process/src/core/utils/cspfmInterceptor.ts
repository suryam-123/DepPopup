import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appUtility } from './appUtility';

@Injectable()
export class cspfmInterceptor implements HttpInterceptor {
    private appUtilityConfig;
    constructor(private injector:Injector){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let modified = request;
        if (request.url === '/apps/additionalInfoService') {
            const sourceVersion: string = '1';
            modified = request.clone({ setHeaders: { 'version': sourceVersion } });
        }
        if (request.hasOwnProperty('headers') && (request.url.includes('/apps/') || request.url.includes('/appbuilder/'))) {
            this.appUtilityConfig = this.appUtilityConfig && this.appUtilityConfig !== undefined ? this.appUtilityConfig : this.injector.get(appUtility);
            if (this.appUtilityConfig.userTimeZone && this.appUtilityConfig.userDateFormat && this.appUtilityConfig.userDateTimeFormat) {
                let dateAndTimeConversion: any = {
                    'userTimeZone': this.appUtilityConfig.userTimeZone,
                    'userDateFormat': this.appUtilityConfig.userDateFormat,
                    'userTimeFormat': this.appUtilityConfig.userDateTimeFormat
                }
                dateAndTimeConversion = JSON.stringify(dateAndTimeConversion);
                modified = modified.clone({ setHeaders: { dateAndTimeConversion } });
            }
        }
        return next.handle(modified);
    }
}