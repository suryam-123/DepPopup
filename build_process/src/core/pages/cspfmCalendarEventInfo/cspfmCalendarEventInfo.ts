

/* 
 *    File: cspfmCalendarEventInfo.ts 
 *    Copyright(c) 2022 Chain-Sys Corporation Inc.
 *    Duplication or distribution of this code in part or in whole by any media
 *    without the express written permission of Chain-Sys Corporation or its agents is
 *    strictly prohibited.
 */
import { Component, OnInit, ApplicationRef } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { appUtility } from 'src/core/utils/appUtility';
import { DatePipe } from '@angular/common';
import { appConstant } from 'src/core/utils/appConstant';
import { DataFieldTraversal } from 'src/core/models/cspfmDataFieldTraversal.type'; // 28Apr2021#Nels1727

@Component({
    selector: 'app-cspfmCalendarEventInfo',
    templateUrl: './cspfmCalendarEventInfo.html',
    styleUrls: ['./cspfmCalendarEventInfo.scss'],
})
export class cspfmCalendarEventInfo implements OnInit {

    private serviceObject: any;
    private dataSource: string;
    public isSkeletonLoading = true;
    public objectRecordId: any;
    private errorMessageToDisplay: string = "No Records";
    private fetchErrorMessage = "Fetching Failed";
    public calendarName: string = ""
    public calendarConfig: any;
    public dataset: any;
    public eventDetails: Array<string>;
    public eventFields: DataFieldTraversal;

    public dateDispay: any;
    public calendarIcon: any;
    public calendarIconColor: any;

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        public route: Router,
        public activeRoute: ActivatedRoute,
        public modalController: ModalController,
        public appUtilityConfig: appUtility,
        public datePipe: DatePipe,    
                public applicationRef: ApplicationRef,
    ) {
        
        this.serviceObject = this.navParams.get('serviceObject');
        this.dataSource = this.navParams.get('dataSource');
        this.objectRecordId = this.navParams.get('objectRecordId')
        this.calendarConfig = this.navParams.get('calendarConfig')
        this.dateDispay = this.navParams.get('dateDisplay')
        
        this.calendarName = this.calendarConfig["calendarDisplayName"]
        this.calendarIconColor = this.calendarConfig["calendarConfig"]["calendarColor"];
        this.calendarIcon = this.calendarConfig['calendarIcon'];
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.fetchRecordAgainstSelectedObject();
    }
    fetchRecordAgainstSelectedObject() {
        if (appConstant.couchDBStaticName === this.dataSource) {
            const objectHierarchyJSON = this.calendarConfig["calendarHierarchyJSON"]
            this.serviceObject.querySingleDoc(objectHierarchyJSON, this.objectRecordId).then(res => {
                this.isSkeletonLoading = false;
                if (res['status'] !== 'SUCCESS') {
                    this.errorMessageToDisplay = res['message'];
                    if (this.errorMessageToDisplay === 'No internet') {
                        this.appUtilityConfig.presentNoInternetToast(this);
                    } else {
                        this.appUtilityConfig.showInfoAlert(this.errorMessageToDisplay)
                    }
                    return;
                }
                if (res['records'].length < 0) {
                    this.appUtilityConfig.showInfoAlert(this.errorMessageToDisplay)
                    return;
                }
                this.dataset = res['records'][0];
                this.eventDetails = this.calendarConfig["columnMappingInfo"]["eventDetails"]
                this.eventFields = this.calendarConfig["columnMappingInfo"]["eventFields"]
            }).catch(error => {
                console.log("catch block in calendar event info => ", error.message);
                this.isSkeletonLoading = false;
                this.appUtilityConfig.showInfoAlert(this.fetchErrorMessage)
            });
        }
    }
    

    // Get Value from Result Object Using Field Name and Object Name
    getValueUsingFieldNameAndObjectName(fieldName, fieldType, resultObject) {
        if (fieldType === "DATE" || fieldType === "TIMESTAMP") {
            const dateValue = resultObject[fieldName]
            if (dateValue === '' || dateValue === null) {
                return '';
            }
            const date = new Date(dateValue)
            return this.datePipe.transform(
                new Date(dateValue),
                this.appUtilityConfig.userDateFormat,
                this.appUtilityConfig.orgZoneOffsetValue
              );

        } else {
            const value = resultObject[fieldName]
            return value
        }
    }

    closeButtonClick() {
        this.modalController.dismiss(true);
    }    

    
    // mailButtonClick() {

    // }
    // messgaeButtonClick() {

    // }
    // callButtonClick() {

    // }
}
