/* 
 *   File: cspfmAlertDialog.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, Inject, OnInit, ViewEncapsulation, ViewChild, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'cspfmAlertDialog',
    templateUrl: './cspfmAlertDialog.html',
    styleUrls: ['./cspfmAlertDialog.scss']
})
export class cspfmAlertDialog implements OnInit {

    @ViewChild('pdfViewer') pdfViewer;

    title:string;
    description:string
    buttonInfo: any
    parentContext: any
    type: string
    url;
    innerHTML;
    startPrint: boolean;

    constructor(public sanitizer:DomSanitizer,private httpClient:HttpClient,
        private dialogRef: MatDialogRef<cspfmAlertDialog>,
        @Inject(MAT_DIALOG_DATA) data) {

        this.title = data['title'];
        this.buttonInfo = data['buttonInfo']
        this.description = data['description']
        this.parentContext = data['parentContext']
        this.type = data['type']
        this.startPrint = ((this.type === "PDF" || this.type === "HTML") && data['action'] === "Print") ? true : false
        this.url = (this.type === 'PDF' || this.type === 'HTML') ? data['url'] : this.sanitizer.bypassSecurityTrustResourceUrl(data['url'])
    }


    ngAfterViewInit() {
        try {
            if (this.type === 'PDF' || this.type === 'HTML') {
                const responseType = {}
                if (this.type === 'PDF') {
                    responseType['responseType'] = 'blob'
                }else if(this.type === 'HTML'){
                    responseType['responseType'] = 'text'
                }
                this.httpClient.get(this.url, responseType).pipe(
                    map((result: any) => {
                        if (this.type === 'PDF') {
                            return new Blob([result], { type: "application/pdf" });
                        } else {
                            return result
                        }
                    })
                ).subscribe(res => {
                    if (this.type === 'PDF') {
                        this.pdfViewer.pdfSrc = res;
                        this.pdfViewer.refresh()
                    } else {
                        this.innerHTML = this.sanitizer.bypassSecurityTrustHtml(res)
                        if(this.startPrint){
                            this.printHTML()
                        }
                    }
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    ngOnInit() {

    }

    close(buttoninfo) {
        this.dialogRef.close(buttoninfo);
        if(buttoninfo['handler']){
            buttoninfo.handler();
        }
    }

    printHTML() {
        var a = window.open('', '', 'height=600, width=1000');
        var div = a.document.createElement('div')
        div.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.innerHTML)
        a.document.body.append(div)
        setTimeout(() => {
            a.print();
            a.close();
        }, 10);
    }

}
