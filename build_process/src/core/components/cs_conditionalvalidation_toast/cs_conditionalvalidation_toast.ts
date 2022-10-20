/* 
 *   File: cs_conditionalvalidation_toast.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component,Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";
import { appUtility } from 'src/core/utils/appUtility';
@Component({
  selector: 'cs_conditionalvalidation_toast',
  templateUrl: './cs_conditionalvalidation_toast.html',
  styleUrls: ['./cs_conditionalvalidation_toast.scss'],
})
export class cs_conditionalvalidation_toast{
  title: string;
  parentContext: any;
  messageType: string;
  displayType: string;

  constructor(public appUtilityConfig: appUtility,
    @Inject(MAT_SNACK_BAR_DATA) data,
    private readonly snackBarRef: MatSnackBarRef<cs_conditionalvalidation_toast>) {
    this.title = data['message'];
    this.parentContext = data['parentContext'];
    this.messageType = data['messageType'];
    this.displayType = data['displayType'];
  } 

  closeOnClick() {
    this.snackBarRef.dismiss();
  }
}
