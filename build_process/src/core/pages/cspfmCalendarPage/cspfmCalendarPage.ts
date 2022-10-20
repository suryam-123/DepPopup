import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Injectable, HostListener } from '@angular/core';
 import { Subject } from 'rxjs';
 import { differenceInDays, isSameDay, isSameMonth } from 'date-fns';
 import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView, CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
 import { ModalController, AlertController, PopoverController } from '@ionic/angular';
 import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
 import { calendarBridge } from 'src/core/nativebridges/calendarBridge';
 import { appUtility } from 'src/core/utils/appUtility';
 import * as moment from 'moment';
 import RRule from 'rrule';
 import * as lodash from 'lodash';
 import { appConstant } from "src/core/utils/appConstant";
 import { dataProvider } from 'src/core/utils/dataProvider';
 import { popoverpage } from 'src/core/pages/popoverpage/popoverpage';
 import { DatePipe } from '@angular/common';
 import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
 import { Router } from '@angular/router';
 import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';
 import { appConfiguration } from 'src/core/utils/appConfiguration';
 import { TranslateService } from '@ngx-translate/core';
 import { cspfmDataTraversalUtils } from 'src/core/dynapageutils/cspfmDataTraversalUtils';
 import { DataFieldTraversal } from 'src/core/models/cspfmDataFieldTraversal.type';
 import { SlickgridPopoverService } from "../../services/slickgridPopover.service";  
 import { HttpClient } from '@angular/common/http';
 declare const $: any;		
 declare const window: any;
 interface RecurringEvent {
   id: any,
   title: string;
   color: any;
   cssClass?: string;
   allDay: any;
   dayCount:any;
   hours:any;
   mins:any;
   rrule?: {
     freq: any;
     bymonth?: number;
     bymonthday?: number;
     byweekday?: any;
     dtstart?: any;
     until?: any
     count?: any,
     interval?: any,
     byyearday?: any
 
   };
   meta?: any;
 }
 @Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {

   public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
     return new DatePipe(locale).transform(date, 'EEE', locale);
   }
   public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {		
    return new DatePipe(locale).transform(date, 'EEE', locale);		
  }
 }
 @Component({
   selector: 'app-cspfmCalendarPage',
   changeDetection: ChangeDetectionStrategy.OnPush,
   templateUrl: './cspfmCalendarPage.html',
   styleUrls: ['./cspfmCalendarPage.scss'],
   providers: [
     {
       provide: CalendarDateFormatter,
       useClass: CustomDateFormatter,
     },
   ],
 })
 
 export class cspfmCalendarPage implements OnInit {
   searchText:any;
   scrHeight: any;
   rowHeight: any;
   calHeight: any;
   yearContent = false;
   IsHidden = true;
   showContent = true;
   smallcalendarview: CalendarView = CalendarView.Month;
   view: CalendarView = CalendarView.Month;
   CalendarView = CalendarView;
   viewDate: Date = new Date();
   selectedviewDate: Date = new Date();
   refresh: Subject<any> = new Subject();
   events: CalendarEvent[] = []
   monthEvent: CalendarEvent[] = []
   monthObj: {} = {}
   masterSelected:boolean;
   temporaryEvents = [];
   recurringEvents: RecurringEvent[] = []
   activeDayIsOpen = false;
   private calendarConfigJSON;
   loadAllEvents: Array<any> = [];
   filteredLoadEvents: Array<any> = [];
   calendarDetails;
   calendarDetailsReference: Array<any> = [];
   calendarEventObject = [];
   Month_6_TimeStamp = 0;
   year_30_TimeStamp = 0;
   batchIdLimit = 1000;
   createEventArr: Array<any> = [];
  private calendarSettingPath = './calendar_setting.json';
  // private calendarSettingPath = 'assets/calendarconfig/calendar_setting.json'
   public dbServiceProvider = appConstant.couchDBStaticName
   locale = 'en';
   public dataSource = "CouchDB";
   layoutId = "calendarPage";
   public layoutNameConstant = "cs-dropdown-custom-123";
   public sectionDependentObjectList = {};
   isLoading = true;
   public previousevent:HTMLElement;
   ngAfterViewInit() {
     this.myCalendarheight();
     this.screenHeight();
     this.calendarinnerheight();
   }
   @HostListener('window:resize', ['$event'])
   getScreenSize(event?) {
     this.screenHeight();
     this.myCalendarheight();
     this.calendarinnerheight();
   }
   constructor(public calendarBridgeObject: calendarBridge,
     private appUtilityObject: appUtility,
     public modalCtrl: ModalController,
     public dataProviderObject: dataProvider,private httpClient:HttpClient,
     public alerCtrl: AlertController, public popoverController: PopoverController,
     private changeRef: ChangeDetectorRef, public dialog: MatDialog, public router: Router,
     public datePipe: DatePipe, public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils, public appConfig: appConfiguration,
     public observableListenerUtils: cspfmObservableListenerUtils,private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils, private translateservice:TranslateService, private slickgridpopoverservice: SlickgridPopoverService) {
 
     this.masterSelected=true;
     this.getScreenSize();
     
 
     const monthFirstDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
     const monthFirstDayTS = this.getOrgTimezoneDate(monthFirstDay)
     const monthFirstDayTimeStamp = monthFirstDayTS.getTime()
 
     const monthLastDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0, 23, 59, 59);
     const monthLastDayTS = this.getOrgTimezoneDate(monthLastDay)
     const monthLastDayTimeStamp = monthLastDayTS.getTime()
     const currentDate = new Date()
     const yearEnd = new Date(currentDate.getFullYear() + 30, 12, 0, 23, 59, 59);
     const yearEndTS = this.getOrgTimezoneDate(yearEnd)
     this.year_30_TimeStamp = yearEndTS.getTime()
     console.log('end year timestamp', yearEnd, this.year_30_TimeStamp);
     const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 0, 23, 59, 59);
     const monthEndTS = this.getOrgTimezoneDate(monthEnd)
     this.Month_6_TimeStamp = monthEndTS.getTime()
     console.log('end month timestamp', monthEnd, this.Month_6_TimeStamp);
    
    this.locale = this.translateservice.currentLang
    this.httpClient.get(this.calendarSettingPath).toPromise()
       .then((response) => {
         const resValue = response;
         this.calendarConfigJSON = resValue
         const calendarConfigProperties = this.calendarConfigJSON["calendarConfigProperties"]
         this.calendarDetails = calendarConfigProperties["calendarDetails"]
         this.temporaryEvents=JSON.parse(JSON.stringify(this.calendarDetails))
         this.sectionDependentObjectList = calendarConfigProperties['sectionDependentObjectList']
         this.calendarDetailsReference = [...this.calendarDetails];
         this.calendarDetailsReference.forEach(calendarDetailObject => {
           if (calendarDetailObject['isActive']) {
             const calObj = {
               "displayName": calendarDetailObject['calendarDisplayName'],
               "calendarName": calendarDetailObject['calendarName'],
               "isSelected": true,
               "eventNavigationInfo": calendarDetailObject['eventLayoutInfo'],
               "fieldForCalendarToLoad": calendarDetailObject['columnMappingInfo']['startDate'],
               "fieldType": calendarDetailObject['columnMappingInfo']['fieldType'],
               "query": "",
               "calendarIcon": calendarDetailObject['calendarIcon'],
               "calendarColor": calendarDetailObject['calendarConfig']['calendarColor']
             }
             if (calendarDetailObject['eventLayoutInfo']['isCreateEvent']){
              this.createEventArr.push(calObj)
              }
             this.loadAllEvents.push(calObj);
             this.filteredLoadEvents.push(calObj);
           }
         });
         this.initiateFetch(monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay,monthLastDay)
         if (this.sectionDependentObjectList && Object.keys(this.sectionDependentObjectList).length !== 0){
          this.registerRecordChangeListener()
        }
       }).catch((err) => {
         console.log(err);
         this.appUtilityObject.presentToast("Please contact admin for calendar configuration.")
       });

   }
   setIdforReferenceCalendar() {
    if (this.view === CalendarView.Day) {
      var allDayVal = 0;
      var calEvent = 0;
      var createEvent = 0;
      var calendarDaysForday = Array.from(document.getElementsByClassName('cal-week-view')[0].getElementsByClassName('cal-time-events')[0].getElementsByClassName('cal-day-columns')[0].getElementsByClassName('cal-day-column') as HTMLCollectionOf<HTMLElement>);
      var calendarevents = Array.from(document.getElementsByClassName('cal-week-view')[0].getElementsByClassName('cal-all-day-events') as HTMLCollectionOf<HTMLElement>);
      if (calendarevents.length !== 0){
        var calendareventsAllday = Array.from(calendarevents[0].getElementsByClassName('cal-events-row') as HTMLCollectionOf<HTMLElement>);
        calendareventsAllday.forEach(elementAllDay => {
          var calendar_Allday = Array.from(elementAllDay.getElementsByClassName('cal-event') as HTMLCollectionOf<HTMLElement>);
          calendar_Allday.forEach(elementAllDayCal => {
            allDayVal = allDayVal + 1;
            elementAllDayCal.id = 'ACT_calendar_day_alldayevent_' + allDayVal;
            });
          });  
      }
        calendarDaysForday.forEach(element => {
        var calendar_day = Array.from(element.getElementsByClassName('cal-event-container') as HTMLCollectionOf<HTMLElement>);
        calendar_day.forEach(elementday => {
            var calendar_WeekEvents = Array.from(elementday.getElementsByClassName('cal-event') as HTMLCollectionOf<HTMLElement>);
            calendar_WeekEvents.forEach(elementweekEvent =>{
            calEvent = calEvent + 1;
            elementweekEvent.id = 'ACT_calendar_day_event_' + calEvent;
          });
        });
          var calendar_Events = Array.from(element.getElementsByClassName('cal-hour') as HTMLCollectionOf<HTMLElement>);
          calendar_Events.forEach(element_day => {
            var calendar_eve = Array.from(element_day.getElementsByTagName('mwl-calendar-week-view-hour-segment')as HTMLCollectionOf<HTMLElement>);
            calendar_eve.forEach(element_create => {
            var calendar_create = element_create.getElementsByClassName('cal-hour-segment')[0];
            createEvent = createEvent + 1;
            calendar_create.id = 'ACT_calendar_day_create_' + createEvent; 
            });   
        });
      });
    } else if (this.view === CalendarView.Week){
      var calDayForweek = Array.from(document.getElementsByClassName("cs-calendar-weekview")[0].getElementsByClassName("cal-week-view")[0].getElementsByClassName("cal-time-events")[0].getElementsByClassName('cal-day-columns')[0].getElementsByClassName('cal-day-column') as HTMLCollectionOf<HTMLElement>);
      var calAllDayEvent = Array.from(document.getElementsByClassName("cs-calendar-weekview")[0].getElementsByClassName("cal-week-view")[0].getElementsByClassName("cal-all-day-events") as HTMLCollectionOf<HTMLElement>);
      var eventVal = 0;
      var createVal = 0;
      var eventValue = 0;
      if (calAllDayEvent.length !== 0){
      calAllDayEvent.forEach(elementValue => {
      var alldayEventElement = Array.from(elementValue.getElementsByClassName('cal-events-row') as HTMLCollectionOf<HTMLElement>);	
      alldayEventElement.forEach(elementVal =>{
          var cal_hourDay = Array.from(elementVal.getElementsByClassName('cal-event') as HTMLCollectionOf<HTMLElement>);
          cal_hourDay.forEach(elementEvent => {
            eventVal = eventVal + 1;
            elementEvent.id = 'ACT_calendar_week_allDayevent_' + eventVal;
          });
        })
      });
      }
      calDayForweek.forEach(element => {
        var cal_hourDay = Array.from(element.getElementsByClassName('cal-hour') as HTMLCollectionOf<HTMLElement>);
        var calendar_weekevent = Array.from(element.getElementsByClassName('cal-event-container') as HTMLCollectionOf<HTMLElement>);
        calendar_weekevent.forEach(elementVal => {
          var weekevent = Array.from(elementVal.getElementsByTagName('mwl-calendar-week-view-event') as HTMLCollectionOf<HTMLElement>);
          weekevent.forEach(elementweek => {
            var weekevents = Array.from(elementweek.getElementsByClassName('cal-event')as HTMLCollectionOf<HTMLElement>);
            weekevents.forEach(elementweekevent => {
              eventValue = eventValue + 1;
              elementweekevent.id = 'ACT_calendar_week_event_' + eventValue;
          });
        });
      });
        cal_hourDay.forEach(elementVal => {
          var calendar_week = Array.from(elementVal.getElementsByTagName('mwl-calendar-week-view-hour-segment') as HTMLCollectionOf<HTMLElement>);
          calendar_week.forEach(elementday => {
            createVal = createVal + 1;
          elementday.id = 'ACT_calendar_week_create_' + createVal;
          });
        });
      })
    }
  var calendarDays = Array.from(document.getElementsByClassName('cal-days') as HTMLCollectionOf<HTMLElement>);
  let iVal = 0;
  calendarDays.forEach(element => {
    var refCaldays = Array.from(element.getElementsByClassName('cal-day-cell') as HTMLCollectionOf<HTMLElement>);
    refCaldays.forEach(elementCal => {
      iVal = iVal+1;
      elementCal.id = 'ACT_calendar_month_create_' + iVal;
      });
    });
}
   // To select and Unselect All the events in a Single Click
   checkUncheckAll() {
     for (let i of this.filteredLoadEvents) {
       i.isSelected = this.masterSelected;
     }
     let dataToFetch = [];
     if (this.masterSelected !== false) {
       this.filteredLoadEvents.forEach(element => {
         if (element.isSelected) {
           let findObj = this.temporaryEvents.filter(calendarEvent => element.calendarName === calendarEvent.calendarName)[0]
           this.calendarDetails.push(findObj);
         }
       });
       this.calendarDetails = lodash.uniqBy(this.calendarDetails, this.calendarDetails.calendarName);
       this.nextPrevMonthAction()
     } else {
       dataToFetch = JSON.parse(JSON.stringify(this.temporaryEvents));
       this.filteredLoadEvents.forEach(element => {
         if (!element.isSelected) {
           let findObj = dataToFetch.filter(calendarEvent => element.calendarName === calendarEvent.calendarName)[0]
           const indexValue = dataToFetch.indexOf(findObj);
           dataToFetch.splice(indexValue, 1);
         }
       });
       this.calendarDetails = dataToFetch;
       this.calendarEventObject = [];
       if (this.calendarDetails.length === 0) {
         this.createEventsForCalendar(this.calendarEventObject);
       } else {
         this.calendarDetails = lodash.uniqBy(this.calendarDetails, this.calendarDetails.calendarName);
         this.nextPrevMonthAction()
       }
     }
   }
   async initiateFetch(monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay,monthLastDay) {
     this.isLoading = true;
     var taskList = [];
     this.calendarDetails.forEach(calendarDetailObject => {
       if (calendarDetailObject['isActive']) {
         var enableCriteria = calendarDetailObject['enableCriteria'];
         if (enableCriteria) {
           var layoutCriteriaQueryConfig = calendarDetailObject['criteriaConfig'];
           var queryConfig = layoutCriteriaQueryConfig['queryConfig']
           if (Object.keys(queryConfig).length > 0) {
             taskList.push(this.checkRelationalObjectsAndContinueFetch(calendarDetailObject, monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay,monthLastDay).then(result => {
               return result
             }))
           }
         } else {
           taskList.push(this.fetchCalendarRecords(calendarDetailObject, monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay,monthLastDay).then(result => {
             return result;
           }));
         }
       }
     });
     Promise.all(taskList).then(res => {
       this.isLoading = false;
       this.calendarEventObject = [];
       if (res && res.length > 0) {
         res.forEach(element => {
          if (element.constructor === Array) {
            element.forEach(elementVal => {
              if (elementVal['calendarRecords'].length !== 0)
                this.calendarEventObject.push(elementVal);
            })
          } else {
             if (element !== null && element['status'] === 'SUCCESS') {
               if (element.constructor === Array) {
                 element.forEach(elementVal => {
                   if (elementVal['calendarRecords'].length !== 0)
                     this.calendarEventObject.push(elementVal);
                 })
               } else {
                 this.calendarEventObject.push(element);
               }
             }
          }
         });
       }
       if (this.calendarEventObject.length !== 0) {
         this.createEventsForCalendar(this.calendarEventObject);
       }
       this.changeRef.detectChanges();
     });
   }
   async checkRelationalObjectsAndContinueFetch(calendarDetailObject, monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay,monthLastDay,methodCalledBy?) {
     var queryConfig = calendarDetailObject['criteriaConfig']['queryConfig']
     const configObject = {
       'layoutCriteriaQueryConfig': calendarDetailObject['criteriaConfig']['queryConfig'],
       'listCriteriaDataObject': {}
     }
     if (queryConfig['relationalObjects'] && queryConfig['relationalObjects'].length > 0) {
       
       return this.cspfmLookupCriteriaUtils.getRelationalObjectValues(configObject).then(res => {
        calendarDetailObject['criteriaConfig']['relationalObjectIds'] = configObject['relationalObjectsResult']
         return this.makeQueryAndStartFetch(calendarDetailObject, monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay,monthLastDay).then(result => {
           return result;
         })
       })
     } else {
       return this.makeQueryAndStartFetch(calendarDetailObject, monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay,monthLastDay).then(result => {
         return result;
       })
     }
   }
   getCombinationIds(ids, n = 0, result = [], current = []){
    if (n === ids.length) {
        result.push(current)
    } else {
        if(ids[n].length > 0){
            ids[n].forEach(item => 
                this.getCombinationIds(ids, n+1, result, [...current, item])
            )
        } else {
            this.getCombinationIds(ids, n+1, result, [...current])
        }
    }
    return result
}
   async makeQueryAndStartFetch(calendarDetailObject, monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay,monthLastDay,searchQuery?, paginationAction?: 'next_pressed' | 'limit_changed' | 'prev_pressed' | 'current_page_refresh', paginationClickFlag?) {
     var criteriaQueryConfig = calendarDetailObject['criteriaConfig']
     const configObject = {
       'layoutCriteriaQueryConfig': criteriaQueryConfig['queryConfig'],
       'listCriteriaDataObject': {}
     }
     if (criteriaQueryConfig['relationalObjectIds']) {
       var taskList = [];
       let idArray = []
            let keys = Object.keys(calendarDetailObject['criteriaConfig']['relationalObjectIds']);
            for(let i of keys) {
                let key = i;
                let value = lodash.chunk(calendarDetailObject['criteriaConfig']['relationalObjectIds'][key], this.batchIdLimit);
                idArray.push(value)
            }
            let result = this.getCombinationIds(idArray);
            

            for(let j of result){
                let ids = j
                let tempConfig = {}
              for (let [i, m] of ids.entries()) {
                tempConfig[keys[i]] = ids[i]
              }
                configObject['relationalObjectsResult'] = tempConfig;
                criteriaQueryConfig['criteriaQuery'] = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject)
                taskList.push(this.fetchCalendarRecords(calendarDetailObject, monthFirstDayTimeStamp, monthLastDayTimeStamp, monthFirstDay, monthLastDay).then(result => {
                    return result
                }))
            // })
            }
       return Promise.all(taskList).then(result => {
         return result;
       })
     } else {
       if (criteriaQueryConfig['criteriaQuery'] === '') {
         criteriaQueryConfig['queryConfig']['relationalObjectResults'] = criteriaQueryConfig['relationalObjectIds'];
         criteriaQueryConfig['criteriaQuery'] = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject)
       }
       return this.fetchCalendarRecords(calendarDetailObject, monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay,monthLastDay).then(result => {
         return result;
       })
     }
   }
   calendarinnerheight() {
     setTimeout(() => {
       var calendarcommonhead = document.getElementsByClassName("cs-right-cal-headpad")[0]['offsetHeight'];
       var toolheight = document.getElementsByTagName('ion-toolbar')[0].offsetHeight;
       if (this.view === CalendarView.Day) {
         var extracalevents = document.getElementsByClassName("cs-calendar-dayview")[0].getElementsByClassName("cal-day-view")[0].getElementsByClassName("cal-week-view")[0].getElementsByClassName("cal-all-day-events");
         var dayinnerHeight = document.getElementsByClassName("cs-calendar-dayview")[0].getElementsByClassName("cal-day-view")[0].getElementsByClassName("cal-week-view")[0].getElementsByClassName("cal-time-events");
         if (extracalevents.length !== 0) {
           dayinnerHeight[0]['style']['height'] = (window.innerHeight - calendarcommonhead - extracalevents[0]['offsetHeight'] - toolheight - 30) + 'px';
           dayinnerHeight[0].classList.add("cs-custom-scroll");
           dayinnerHeight[0]['style']['overflow'] = 'auto';
         } else {
           dayinnerHeight[0]['style']['height'] = (window.innerHeight - calendarcommonhead - toolheight - 30) + 'px'
           dayinnerHeight[0].classList.add("cs-custom-scroll");
           dayinnerHeight[0]['style']['overflow'] = 'auto';
         }
       }
       if (this.view === CalendarView.Week) {
         var dayheadersHeight = document.getElementsByClassName("cs-calendar-weekview")[0].getElementsByClassName("cal-week-view")[0].getElementsByClassName("cal-day-headers")[0]['offsetHeight'];
         var extraweekcaleve = document.getElementsByClassName("cs-calendar-weekview")[0].getElementsByClassName("cal-week-view")[0].getElementsByClassName("cal-all-day-events");
         var weekinnerHeight = document.getElementsByClassName("cs-calendar-weekview")[0].getElementsByClassName("cal-week-view")[0].getElementsByClassName("cal-time-events");
         if (extraweekcaleve.length !== 0) {
           weekinnerHeight[0]['style']['height'] = (window.innerHeight - calendarcommonhead - dayheadersHeight - extraweekcaleve[0]['offsetHeight'] - toolheight - 30) + 'px';
           weekinnerHeight[0].classList.add("cs-custom-scroll");
           weekinnerHeight[0]['style']['overflow'] = 'auto';
         } else {
           weekinnerHeight[0]['style']['height'] = (window.innerHeight - calendarcommonhead - dayheadersHeight - toolheight - 30) + 'px'
           weekinnerHeight[0].classList.add("cs-custom-scroll");
           weekinnerHeight[0]['style']['overflow'] = 'auto';
         }
       }
     }, 10)
   }
   screenHeight() {
     var toolbarHeight;
     var calendarHeaderHeight;
     setTimeout(()=> {
       if (document.getElementsByTagName('ion-toolbar')) {
         toolbarHeight = document.getElementsByTagName('ion-toolbar')[0].offsetHeight;
       }
       if (document.getElementById("calendarMonthHeader")) {
         calendarHeaderHeight = document.getElementById("calendarMonthHeader").offsetHeight;
       }
       this.calHeight = window.innerHeight - toolbarHeight - 29;
       this.scrHeight = window.innerHeight - toolbarHeight - calendarHeaderHeight - 90;
       var calendarDays = Array.from(document.getElementsByClassName('cal-days') as HTMLCollectionOf<HTMLElement>);
       if (calendarDays && calendarDays[1]) {
         calendarDays[1].style.height = this.scrHeight + 'px';
       }
     }, 100);
   }
   ngOnInit() { }
 
   async fetchCalendarRecords(calendarDetailObject, monthFirstDayTimeStamp, monthLastDayTimeStamp, monthFirstDay, monthLastDay) {
     this.calendarEventObject = [];
     this.recurringEvents = [];
     this.events = [];
     const objectType = calendarDetailObject["databaseDetails"]["tableName"]
     const field = calendarDetailObject["columnMappingInfo"]["startDate"]
     const endfield = calendarDetailObject["columnMappingInfo"]["endDate"]
     const startDate = monthFirstDayTimeStamp
     const endDate = monthLastDayTimeStamp
     const recurrence = calendarDetailObject["calendarConfig"]["recurrence"]
     let query = "";
     if (recurrence) {
       const recurrenceType = calendarDetailObject["calendarConfig"]["recurrenceType"]
       // query = this.makeQueryRecurrenceEvent(objectType, field, startDate, recurrenceType)
       // calculation for monthly and yearly we need to draw eventfor 3 years
       // calculation for weekly and daily we need to draw eventfor 6 months
 
       if (recurrenceType === "Yearly" || recurrenceType === "Monthly"||recurrenceType === "Weekly" || recurrenceType === "Daily") {
        
           query = this.makeQueryRecurrenceEvent(objectType, field, startDate, recurrenceType,monthFirstDay)
        
       } 
     } else {
       query = this.makeQuery(objectType, field, startDate, endDate, endfield)
     }
     if (calendarDetailObject['enableCriteria'] && calendarDetailObject['criteriaConfig']['criteriaQuery'] !== undefined && calendarDetailObject['criteriaConfig']['criteriaQuery'] !== "" && query !== "") {
        query = query + ' AND ' + calendarDetailObject['criteriaConfig']['criteriaQuery']
      }
     calendarDetailObject.query = query;
     console.log("query ==> ", query);
     if (query !== "") {
       const hierarchyJson = calendarDetailObject["calendarHierarchyJSON"]
       return this.calendarBridgeObject.fetchCalendarRecordFromCouchDB(query, hierarchyJson).then(result => {
         
         const calendarStatus = result["status"];
         if (calendarStatus === "SUCCESS") {
           const calendarRecords = result["records"]
           if (calendarRecords.length > 0) {
             return {
               'calendarRecords': calendarRecords,
               'calendarObject': calendarDetailObject,
               'status': "SUCCESS"
             }
           } else {
             return {
               'calendarRecords': [],
               'calendarObject': calendarDetailObject,
               'status': "SUCCESS"
             }
           }
         } else {
           console.log("Calendar Error Data - status failed");
           return {
             'calendarRecords': [],
             'calendarObject': '',
             'status': "FAILED"
           };
         }
       }).catch(error => {
         return {
           'calendarRecords': [],
           'calendarObject': '',
           'status': "FAILED"
         }
       });
     }
     return {
      'calendarRecords': [],
      'calendarObject': '',
      'status': "FAILED"
    }
   }
   showHideEvents(ival) {
     const calObj = this.filteredLoadEvents[ival];
     let selectedelement;
     let selectedObj;
     this.calendarDetailsReference.forEach(element => {
       if (calObj.calendarName === element.calendarName) {
         selectedelement = element
       }
     });
     this.calendarDetails.forEach(elementVal => {
       if (calObj.calendarName === elementVal.calendarName) {
         selectedObj = elementVal
       }
     });
     const indexValue = this.loadAllEvents.indexOf(calObj);
     const indexVal = this.calendarDetails.indexOf(selectedObj);

     if (calObj.isSelected === true) {
       this.masterSelected = false;
       calObj.isSelected = false;
       this.loadAllEvents.splice(indexValue, 1);
       this.loadAllEvents.splice(indexValue, 0, calObj);
       this.filteredLoadEvents.splice(ival, 1);
       this.filteredLoadEvents.splice(ival, 0, calObj)
       this.calendarDetails.splice(indexVal, 1);
       const filteredResult = this.calendarEventObject.filter(childItem => childItem['calendarObject']['calendarName'] === calObj.calendarName)
       const indexValCal = this.calendarEventObject.indexOf(filteredResult[0]);
       if (indexValCal !== -1) {
         this.calendarEventObject.splice(indexValCal, 1)
       }
       this.createEventsForCalendar(this.calendarEventObject);
     } else {
       calObj.isSelected = true;
       this.loadAllEvents.splice(indexValue, 1);
       this.loadAllEvents.splice(indexValue, 0, calObj);
       this.filteredLoadEvents.splice(ival, 1);
       this.filteredLoadEvents.splice(ival, 0, calObj)
       if (indexVal < 0) {
         this.calendarDetails.push(selectedelement);
       }
       this.changeRef.detectChanges();
       const unselect = this.filteredLoadEvents.filter(obj => obj.isSelected === false);
       console.log("unselect", unselect);
       if (unselect.length === 0) {
         this.masterSelected = true;
       } else {
         this.masterSelected = false;
       }
       this.nextPrevMonthAction()
     }
     this.calendarinnerheight();
   }
   getSearchedItems(searchText) {
     if (!searchText) {
       this.filteredLoadEvents = [...this.loadAllEvents];
       this.changeRef.detectChanges();
       return;
     }
     this.filteredLoadEvents = this.loadAllEvents.filter(event => {
       if (event.displayName && searchText) {
         return (event.displayName.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
       }
     });
     console.log('this.filteredLoadEvents in search', this.filteredLoadEvents);
 
   }
   
   getStartEndDayoftheMonth(date, option) {
     let StartDate = new Date(date);
     let startEndDate;
     let monthFirstLastDayTS;
     const TodayNumber = StartDate.getDay();
     if (option === "StartDate") {
       const mondayNumber = 0 - TodayNumber;
       startEndDate = new Date(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate() + mondayNumber)
       monthFirstLastDayTS = this.getOrgTimezoneDate(startEndDate)
     } else {
       const sundayNumber = 6 - TodayNumber;
       startEndDate = new Date(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate() + sundayNumber)
       monthFirstLastDayTS = this.getOrgTimezoneDate(startEndDate)
     }
     return monthFirstLastDayTS.getTime()
   }
   
   makeQuery(objectType, field, startDate, endDate, endfield) {
    const startDay = this.getStartEndDayoftheMonth(startDate,"StartDate")
    const EndDay = this.getStartEndDayoftheMonth(endDate, "EndDate")  
     
     const query = "type:pfm" + objectType + " AND " + '(' + field + ': [ ' + startDay + ' TO ' + EndDay + ' ]' +
       " OR " + ' (' + field + ': { -Infinity TO ' + startDay + ' } ' +
       " AND " + endfield + ': { ' + EndDay + ' TO Infinity } )' +
       " OR " + endfield + ': [ ' + startDay + ' TO ' + EndDay + ' ] )';
     console.log('query str', query);
     return query
   }
 
   makeQueryRecurrenceEvent(objectType, field, startDate, recurrenceType, monthFirstDay) {
     
     if (recurrenceType === "Yearly") {
      let firstMonth = monthFirstDay.getMonth();
      let secondMonth = monthFirstDay.getMonth() + 1;
      let thirdMonth = monthFirstDay.getMonth() + 2;  
       if (firstMonth === 11){
        thirdMonth = 1
       } else if (firstMonth === 0){
         firstMonth = 12;
       }
       const query = "type:pfm" + objectType + " AND " + field + "_recurrence:" + "(" + firstMonth + "_*" + " OR " + secondMonth + "_*" + " OR " + thirdMonth + "_*" + " OR cspfm_null" + ")";
       console.log('yearly query',query);
       return query;
     } else {
       const queryInput = this.getMonthWeeklyDailyRecurrenceQueryInput()
       return "type:pfm" + objectType + " AND " + field + "_recurrence:" + "(" + queryInput + ")"
     }
   }
   getMonthWeeklyDailyRecurrenceQueryInput() {
     let queryString = "";
     for (let i = 1; i <= 31; i++) {
       const makeString = i + "_*" + " " + "OR" + " "
       queryString = queryString.concat(makeString)
     }
    
     return queryString.concat('cspfm_null');
   }
 
   // Create Events and Recurring Events For Calendar using Calendar Records
   createEventsForCalendar(calendarEventObject) {
     this.events = [];
     this.monthEvent = [];
     this.monthObj = {};
     //end date calculation
     const todayNumber = this.viewDate.getDay();
     const mondayNumber = 0 - todayNumber;
     const sundayNumber = 6 - todayNumber;
     const monday = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), -7);
     const monthFirstDayTS = this.getOrgTimezoneDate(monday)
     const sunday = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, sundayNumber + 5, 23, 59, 59);
     const monthLastDayTS = this.getOrgTimezoneDate(sunday)
     const monthFirstDayTimeStamp = monthFirstDayTS.getTime()
     const monthLastDayTimeStamp = monthLastDayTS.getTime()
     calendarEventObject.forEach(calElement => {
       this.recurringEvents = [];
       const calendarObject = calElement['calendarObject']
       const result = calElement['calendarRecords']
       if (result && result.length !== 0) {
         const titleType = calendarObject["columnMappingInfo"]["titleType"];
         const titleField = calendarObject["columnMappingInfo"]["title"];
         const titleFields = calendarObject["columnMappingInfo"]["titleFields"];
         const startDate = calendarObject["columnMappingInfo"]["startDate"]
         const endDate = calendarObject["columnMappingInfo"]["endDate"]
         const sourceID = calendarObject["columnMappingInfo"]["sourceId"]
         const calendarColor = calendarObject["calendarConfig"]["calendarColor"]
         const colorValue = {
           'primary': calendarColor,
           "secondary": calendarColor,
         }
         const allDayEvent = calendarObject["calendarConfig"]["allDayEvent"]
         const recurrence = calendarObject["calendarConfig"]["recurrence"]
         const dateFieldType = calendarObject['columnMappingInfo']['fieldType']
         let recurrenceTypeValue: any
         if (recurrence) {
           const recurrenceType = calendarObject["calendarConfig"]["recurrenceType"]
           if (recurrenceType === "Yearly") {
             recurrenceTypeValue = RRule.YEARLY
           } else if (recurrenceType === "Monthly") {
             recurrenceTypeValue = RRule.MONTHLY
           } else if (recurrenceType === "Daily") {
             recurrenceTypeValue = RRule.DAILY
           } else if (recurrenceType === "Weekly") {
             recurrenceTypeValue = RRule.WEEKLY
           }
           let untilValue = calendarObject["calendarConfig"]["recurrenceEndDate"]
           if (untilValue === undefined || untilValue === null || untilValue === "" || untilValue === 0) {
             untilValue = monthLastDayTimeStamp // 2556124199000 Now Set upto 12/12/2050 23:59:59
           }
           // Make Recurring Events
           result.forEach(element => {
             let titleValue = this.splitFieldNameAndObjectName(element, titleType, titleField, titleFields)
             let startDateValue = this.getOrgTimezoneDate(element[startDate], dateFieldType)
             let endDateValue;
             if (element[endDate] === null) {
               if (dateFieldType === "DATE") {
                 endDateValue = element[startDate] + (1000 * 60 * 60 * 23.99);
               } else {
                 //adding 30 mins
                 endDateValue = element[startDate] + 1800000
               }
               endDateValue = this.getOrgTimezoneDate(endDateValue, dateFieldType)
             } else if (element[startDate] !== null && element[endDate] !== null) {
               if (dateFieldType === "TIMESTAMP") {
                 let startEndDateDiffTS = element[endDate] - element[startDate];
                 let startEndDateDayDiff = startEndDateDiffTS / (1000 * 3600 * 24)
                 if (startEndDateDiffTS <= 1800000) { // adding 30 mins if difference < 30min
                   endDateValue = element[startDate] + 1800000;
                   endDateValue = this.getOrgTimezoneDate(endDateValue, dateFieldType)
                 }
                 else if (startEndDateDayDiff >= 1) {
                   let enddate = this.getOrgTimezoneDate(element[endDate], dateFieldType)
                   if (new Date(enddate).getHours() === 0 && new Date(enddate).getMinutes() <= 30) {
                     endDateValue = new Date(element[endDate]).setHours(0, 0, 0, 0) + 1800000;
                     endDateValue = this.getOrgTimezoneDate(endDateValue, dateFieldType)
                   } else {
                     endDateValue = enddate
                   } endDateValue = this.getOrgTimezoneDate(element[endDate], dateFieldType)
                 }
               } else {
                 endDateValue = this.getOrgTimezoneDate(element[endDate], dateFieldType)
               }
             }else if (element[startDate] === null) {
               element[endDate] = null;
             }
             if (startDateValue <= endDateValue) {
               var diffDays = 0;
               var diffHrs = 0;
               var diffMins = 0;
               var diff = Math.abs(endDateValue.getTime() - startDateValue.getTime());
               let diffhours = Math.abs(diff / (1000 * 3600));
               diffDays = Math.floor(diffhours / 24);
               let diffday = diffhours - (diffDays * 24);
               diffHrs = Math.floor(diffday);
               let minutes = diffday * 60;
               diffMins = Math.floor(minutes % 60);
               if (dateFieldType === "DATE" && element[endDate] !== null) {
                 diffHrs = 23;
                 diffMins = 59;
               }
               if (recurrenceType === "Daily" && diffDays !== 0) {
                 let start = new Date(element[startDate]);
                 diffDays = 0;
                 diffHrs = 23 - start.getHours();
                 diffMins = 59 - start.getMinutes();
               }
               this.recurringEvents = [...this.recurringEvents,
               {
                 id: element[sourceID],
                 title: titleValue,
                 color: colorValue,
                 cssClass: 'cs-overlap',
                 allDay: allDayEvent,
                 dayCount: diffDays,
                 hours: diffHrs,
                 mins: diffMins,
                 rrule: {
                   freq: recurrenceTypeValue,
                   dtstart: this.getOrgTimezoneDate(element[startDate], dateFieldType),
                   until: this.getOrgTimezoneDate(untilValue, dateFieldType),
                   interval: 1
                 },
                 meta: calendarObject

               }
               ]
             }
           })

           // Add Recurring Events in Calendar Events
           this.recurringEvents.forEach((event) => {
             const rule: RRule = new RRule({
               ...event.rrule,
               dtstart: event.rrule.dtstart
             });
             const { id, title, color, allDay, meta, cssClass } = event;
             rule.all().forEach((date) => {
               const finalDate = this.getOrgTimezoneDate(date, dateFieldType)
               const finalDateTS = finalDate.getTime()
               const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + event.dayCount);
               let endDateToLoad = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), date.getHours() + event.hours, date.getMinutes() + event.mins, 0);
               if (monthFirstDayTimeStamp < finalDateTS && monthLastDayTimeStamp > endDateToLoad.getTime()) {
                 let titleStr = this.loadDatesInEvents(finalDate, endDateToLoad);
                 console.log("title Str", finalDate)
                 this.events.push({
                   id,
                   color,
                   cssClass,
                   allDay,
                   meta,
                   title: title + titleStr,
                   start: this.getOrgTimezoneDate(date, dateFieldType),
                   end: this.getOrgTimezoneDate(endDateToLoad, dateFieldType)
                 });
                 // Code for loading events in ref calendar
                 const startDate1 = new Date(finalDate.getFullYear(), finalDate.getMonth(), finalDate.getDate(), 0, 0, 0);
                 const endDate1 = new Date(endDateToLoad.getFullYear(), endDateToLoad.getMonth(), endDateToLoad.getDate(), 23, 59, 59);
                 const diffDays = differenceInDays(endDate1, startDate1);
                 for (var i = 0; i <= diffDays; i++) {
                   let datestartdateVal = finalDateTS + (1000 * 60 * 60 * (24 * i));
                   var dateVal = new Date(datestartdateVal);
                   const inputDateString = this.datePipe.transform(dateVal, 'dd/MM/yyyy')
                   let calendarObj = {
                     id,
                     title,
                     color,
                     cssClass,
                     allDay,
                     meta,
                     start: this.getOrgTimezoneDate(dateVal, dateFieldType),
                     end: this.getOrgTimezoneDate(dateVal, dateFieldType)
                   }
                   this.dataForReferenceCalendar(inputDateString, calendarObj);
                 }
               }
             });
           });
         } else {
           // Make Calendar Events
           result.forEach(element => {
             var startdateVal = element[startDate];
             var enddateVal = element[endDate];
             let titleStr = '';
             if (enddateVal === null) {
               if (dateFieldType === "TIMESTAMP") { //adding 30 mins
                 enddateVal = startdateVal + 1800000;
               } else {
                 enddateVal = startdateVal + (1000 * 60 * 60 * 23.99);
               }
             } else if (startdateVal !== null && enddateVal !== null) {
               if (dateFieldType === "TIMESTAMP") {
                 let startEndDateDiffTS = enddateVal - startdateVal;

                 if (startEndDateDiffTS <= 1800000) {//adding 30 mins if difference < 30min
                   enddateVal = startdateVal + 1800000;
                 } else {
                   let enddate = this.getOrgTimezoneDate(enddateVal, dateFieldType)
                   if (new Date(enddate).getHours() === 0 && new Date(enddate).getMinutes() <= 30) {
                     enddateVal = new Date(enddateVal).setHours(0, 0, 0, 0) + 1800000;
                   }
                   titleStr = this.loadDatesInEvents(startdateVal, enddateVal, dateFieldType);
                 }
               } else {
                 enddateVal = enddateVal + (1000 * 60 * 60 * 23.99);
                 titleStr = this.loadDatesInEvents(startdateVal, enddateVal, dateFieldType);
               }
             } else if (startdateVal === null) {
               enddateVal = null;
             }
             if (startdateVal <= enddateVal) {
               const titleValue = this.splitFieldNameAndObjectName(element, titleType, titleField, titleFields)
               this.events = [...this.events,
               {
                 id: element[sourceID],
                 title: titleValue + titleStr,
                 start: this.getOrgTimezoneDate(startdateVal, dateFieldType),
                 end: this.getOrgTimezoneDate(enddateVal, dateFieldType),
                 allDay: allDayEvent,
                 color: colorValue,
                 meta: calendarObject
               }
               ]
               // Code for loading events in ref calendar
               const newstart = this.getOrgTimezoneDate(startdateVal, dateFieldType)
               const newend = this.getOrgTimezoneDate(enddateVal, dateFieldType)
               const startDate = new Date(newstart.getFullYear(), newstart.getMonth(), newstart.getDate(), 0, 0, 0);
               const endDate = new Date(newend.getFullYear(), newend.getMonth(), newend.getDate(), 23, 59, 59);
               const diffDays = differenceInDays(endDate, startDate);
               for (var i = 0; i <= diffDays; i++) {
                 let datestartdateVal = startdateVal + (1000 * 60 * 60 * (24 * i));
                 let startVal = new Date(datestartdateVal);
                 const inputDateString = this.datePipe.transform(startVal, this.appUtilityObject.userDateFormat, this.appUtilityObject.orgZoneOffsetValue)
                 let calendarObj = {
                   title: titleValue,
                   start: this.getOrgTimezoneDate(datestartdateVal, dateFieldType),
                   end: this.getOrgTimezoneDate(datestartdateVal, dateFieldType),
                   allDay: allDayEvent,
                   color: colorValue,
                   meta: calendarObject
                 };
                 this.dataForReferenceCalendar(inputDateString, calendarObj);
               }
             }
           })
         }
       }
     });
     this.refresh.next()
     if (this.view !== CalendarView.Month) {
       setTimeout(() => {
         this.eventoverlap();
       }, 1000)
     }
     setTimeout(() => {
       this.setIdforReferenceCalendar();
     }, 10);
   }
   dataForReferenceCalendar(inputDateString, calendarObjectToLoad) {
    let keysArray = Object.keys(this.monthObj);
    const indexValue = keysArray.indexOf(inputDateString);
    console.log("indexValue",inputDateString, indexValue)
    if (indexValue !== -1) {
      let currMonthArray = this.monthObj[inputDateString];
      if (currMonthArray.length < 2){
         currMonthArray.push(calendarObjectToLoad)
         this.monthObj[inputDateString] = currMonthArray
         this.monthEvent.push(calendarObjectToLoad)
      }
    } else {
       let monthEventArr = [];
       monthEventArr.push(calendarObjectToLoad)
       this.monthObj[inputDateString] = monthEventArr;
       this.monthEvent.push(calendarObjectToLoad);
    }
   }
 
   // Split Field Name and Object Name (split %%)
   splitFieldNameAndObjectName(resultObject, inputType, field, dataFieldTraversal: DataFieldTraversal) {
     if (inputType === "USER") {
      let fieldValue = field.trim().length;
      if(fieldValue === 0){
           return "(no title)"
      }
       return field
     } else {
       const fieldValueObject = {}
       Object.keys(dataFieldTraversal['fields']).forEach(fieldKey => {
         fieldValueObject['%%' + fieldKey + '%%'] = this.cspfmDataTraversalUtilsObject.parse(resultObject, dataFieldTraversal, fieldKey, 'display');
       })
       const fieldKeys = lodash.keysIn(fieldValueObject);
       fieldKeys.forEach(fieldKey => {
         const fieldValue = fieldValueObject[fieldKey]
        
         field = field.replaceAll(fieldKey, fieldValue);
       });
       let fieldValue = field.trim().length;
       if(fieldValue === 0){
           field = "(no title)"
       }
       return field;
     }
   }

   // Get Value from Result Object Using Field Name and Object Name
   getValueUsingFieldNameAndObjectName(fieldName, fieldType, resultObject) {
     if (fieldType === "DATE" || fieldType === "TIMESTAMP") {
       const dateValue = resultObject[fieldName]
       const date = new Date(dateValue)
       return moment(date).format(this.appUtilityObject.userDateFormat)
     } else {
       return resultObject[fieldName]
     }
   }
 
   selectedDateAction() {
    this.isLoading = true;
     if (this.view === CalendarView.Month) {
       const monthFirstDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
       const monthFirstDayTS = this.getOrgTimezoneDate(monthFirstDay)
       const monthFirstDayTimeStamp = monthFirstDayTS.getTime()

       const monthLastDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0, 23, 59, 59);
       const monthLastDayTS = this.getOrgTimezoneDate(monthLastDay)
       const monthLastDayTimeStamp = monthLastDayTS.getTime()
       this.initiateFetch(monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay,monthLastDay)
     } else if (this.view === CalendarView.Week) {
       const todayNumber = this.viewDate.getDay();
       const mondayNumber = 0 - todayNumber;
       const sundayNumber = 6 - todayNumber;
       const monday = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate() + mondayNumber);
       const monthFirstDayTS = this.getOrgTimezoneDate(monday)
       const sunday = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate() + sundayNumber + 1);
       const monthLastDayTS = this.getOrgTimezoneDate(sunday)
       const monthFirstDayTimeStamp = monthFirstDayTS.getTime()
       const monthLastDayTimeStamp = monthLastDayTS.getTime()
       this.initiateFetch(monthFirstDayTimeStamp, monthLastDayTimeStamp,monday,sunday)
     } else if (this.view === CalendarView.Day) {
       const startDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate(), 0, 0, 0);
       const monthFirstDayTS = this.getOrgTimezoneDate(startDate)
       const endDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate(), 23, 23, 59);
       const monthLastDayTS = this.getOrgTimezoneDate(endDate)
       const monthFirstDayTimeStamp = monthFirstDayTS.getTime()
       const monthLastDayTimeStamp = monthLastDayTS.getTime()
       this.initiateFetch(monthFirstDayTimeStamp, monthLastDayTimeStamp,startDate,endDate)
     }
   }
   nextPrevMonthAction() {
    this.isLoading = true;
     console.log('nextPrevMonthAction', CalendarView.Month)
     this.selectedviewDate = this.viewDate;
     if (this.view === CalendarView.Month) {
       const monthFirstDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
       const monthFirstDayTS = this.getOrgTimezoneDate(monthFirstDay)
       const monthFirstDayTimeStamp = monthFirstDayTS.getTime()
 
       const monthLastDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0, 23, 59, 59);
       const monthLastDayTS = this.getOrgTimezoneDate(monthLastDay)
       const monthLastDayTimeStamp = monthLastDayTS.getTime()
 
       this.initiateFetch(monthFirstDayTimeStamp, monthLastDayTimeStamp,monthFirstDay, monthLastDay);
     } else if (this.view === CalendarView.Week) {
       const todayNumber = this.viewDate.getDay();
       const mondayNumber = 0 - todayNumber;
       const sundayNumber = 6 - todayNumber;
       const monday = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate() + mondayNumber);
       const monthFirstDayTS = this.getOrgTimezoneDate(monday)
       const sunday = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate() + sundayNumber+1);
       const monthLastDayTS = this.getOrgTimezoneDate(sunday)
       const monthFirstDayTimeStamp = monthFirstDayTS.getTime()
       const monthLastDayTimeStamp = monthLastDayTS.getTime()
       this.initiateFetch(monthFirstDayTimeStamp, monthLastDayTimeStamp,monday,sunday)
     } else if (this.view === CalendarView.Day) {
       const startDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate(), 0, 0, 0);
       const endDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate(), 23, 23, 59);
       const monthFirstDayTS = this.getOrgTimezoneDate(startDate)
       const monthLastDayTS = this.getOrgTimezoneDate(endDate)
       const monthFirstDayTimeStamp = monthFirstDayTS.getTime()
       const monthLastDayTimeStamp = monthLastDayTS.getTime()
       this.initiateFetch(monthFirstDayTimeStamp, monthLastDayTimeStamp,startDate,endDate)
     }
     setTimeout(() => {
       this.myCalendarheight();
       this.calendarinnerheight()
     }, 1000)
   }
 
   nextPrevMonthAction1() {
     const monthFirstDay = new Date(this.selectedviewDate.getFullYear(), this.selectedviewDate.getMonth(), 1);
     this.selectedviewDate = monthFirstDay;
     setTimeout(() => {
       this.myCalendarheight();
       this.calendarinnerheight();
       this.setIdforReferenceCalendar();
     }, 1000)
   }
 
 
   async handleEvent(action: string, event: CalendarEvent, datedisplay?: string) {
     var queryParamsRouting = {
       serviceObject: this.dataProviderObject.getDbServiceProvider(this.dbServiceProvider),
       parentPage: this,
       dataSource: appConstant.couchDBStaticName,
       id: event.id,
       calendarConfig: event.meta,
       dateDisplay: datedisplay,
       redirectUrl: '/menu/cspfmCalendarPage'
     }
     const dialogConfig = new MatDialogConfig()
     dialogConfig.data = {
       params: queryParamsRouting
     };
     dialogConfig.panelClass = 'cs-dialoguecontainer-large'
     // handleEvent Builder Replace Content
   }
   segmentChanged(ev: any) {
     console.log('Segment changed', ev.detail.value);
     if (ev.detail.value === "Week") {
       this.view = CalendarView.Week
     } else if (ev.detail.value === "Day") {
       this.view = CalendarView.Day
     } else {
       this.view = CalendarView.Month
     }
   }
   dayClickedVal(eventdiv,event) {
    if(this.previousevent){
      this.previousevent.classList.remove("cs-day-clk-active");
    }
    let element = eventdiv.currentTarget.children[0].children[0].children;
    let elementGot = eventdiv.currentTarget.children[0].children[0].children[element.length - 1]
    elementGot.classList.add("cs-day-clk-active");
    const monthVal = moment(this.viewDate).format('MMM')
    const yearVal = moment(this.viewDate).format('YYYY')

    const monthValue = moment(event.date).format('MMM')
    const yearValue = moment(event.date).format('YYYY')
    if (this.view === CalendarView.Month){
      if (monthVal !== monthValue || yearVal !== yearValue) {
        this.viewDate = event.date;
        this.nextPrevMonthAction()
      }
    } else {
      this.viewDate = event.date;
      this.nextPrevMonthAction()
    }
    this.previousevent = elementGot;
   }
   dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
     if (isSameMonth(date, this.viewDate)) {
       if (
         (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
         events.length === 0
       ) {
         this.activeDayIsOpen = false;
       } else {
         this.activeDayIsOpen = true;
       }
       this.viewDate = date;
       
       this.onSelect();
     }
   }
 
   eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
     this.events = this.events.map((iEvent) => {
       if (iEvent === event) {
         return {
           ...event,
           start: newStart,
           end: newEnd
         };
       }
       return iEvent;
     });
    
   }
 
   setView(view: CalendarView) {
     this.view = view;
     this.yearContent = !this.yearContent;
     this.screenHeight();
     this.calendarinnerheight();
     this.nextPrevMonthAction();
   }
 
   closeOpenMonthViewDay() {
     this.activeDayIsOpen = false;
   }
 
   detailActionPressed(event, day, eventVal) {
     eventVal.stopPropagation();
     const datedisplay = moment(day).format('MMMM DD,YYYY')
     this.handleEvent('Dropped or resized', event, datedisplay);
   }
   async moreButtonPressed(day, event) {
     event.stopPropagation();
     console.log('day more', day)
     const datedisplay = moment(day.date).format('MMMM DD,YYYY')
     const daydisplay = moment(day.date).format('dddd');
 
     let htmlElement: HTMLElement = document.getElementById('cs-dropdown-custom-123');	
     htmlElement.innerHTML = ""	
  
     this.slickgridpopoverservice.appendComponentToElement_View('cs-dropdown-custom-123', popoverpage, {	
       setdateDisplay: datedisplay,	
       setdayDisplay: daydisplay,	
       setdisplayMessage: '',	
       setitems: day.events,	
       parentPage: this,	
     })	
     let e = event.currentTarget	
     setTimeout(() => {	
       e.classList.add("cs-dropdown-open");	
       window.$(".cs-dropdown-open").jqDropdown("attach", [".cs-dropdown"]);	
       window.$(".cs-dropdown-open").jqDropdown("show", [".cs-dropdown"]);	
     }, 100)
   }
   popUpResponse(item, dataDisplay) {
     console.log('lookup response');
     this.popoverController.dismiss();
     this.handleEvent('Dropped or resized', item, dataDisplay);
   }
   createNewEvent(event) {
     if (this.createEventArr.length !== 0){
      let dateVal = new Date();
      let dateValBasedOnProfile = this.datePipe.transform(dateVal, this.appUtilityObject.userDateTimeFormat, this.appUtilityObject.userZoneOffsetValue)
      this.addEventForDate(dateValBasedOnProfile, event);
     } else {
      this.appUtilityObject.showInfoAlert("No calendar available for create event")
     }
   }
   popUpResponseForCreate(eventInfo, dateDisplay) {
     this.popoverController.dismiss();
     this.loadEntryforEvent(eventInfo, dateDisplay);
   }
   getDateWithoutTime(dateTimestamp) {
     var dateObject = new Date(dateTimestamp);
     dateObject.setHours(0, 0, 0, 0);
     return dateObject;
   }
 
   loadEntryforEvent(eventInfo, dateDisplay) {
     let dateVal;
     if (eventInfo.fieldType === "DATE") {
       let dateSelected = moment(new Date(dateDisplay)).tz(this.appUtilityObject.orgTimeZone).toISOString();
       dateVal = this.getDateWithoutTime(dateSelected).getTime();
     } else {
       dateVal = moment(new Date(dateDisplay), this.appUtilityObject.userDateTimePickerFormat).toDate()
     }
     var queryParamsRouting = {
       action: 'Add',
       redirectUrl: '/menu/cspfmCalendarPage',
       isFromCalendarNavigation: true,
       calendarParams: JSON.stringify({
         "fieldInfo": [
           {
             "fieldName": eventInfo.fieldForCalendarToLoad,
             "objectName": "",
             "dafaultValue": dateVal,
             "fieldType": eventInfo.fieldType
           }
         ]
       })
     }
     const dialogConfig = new MatDialogConfig()
     dialogConfig.data = {
       params: queryParamsRouting
     };
     dialogConfig.panelClass = 'cs-dialoguecontainer-large'
     // Loader Entry Builder Replace Content
   }
   columnHeaderClicked(event) {
  }
   handlingClickOnMonthCell(day, event) {
     event.stopPropagation();
     if (this.createEventArr.length !== 0) {
     this.addEventForDate(day.date, event);
     } else {
      this.appUtilityObject.showInfoAlert("No calendar available for create event")
    }
   }
   handlingClickOnDayCell(day,event) {
    if(event['isTrusted'] === undefined){
      event = event['sourceEvent']
    }
    if (this.createEventArr.length !== 0) {
      this.addEventForDate(day, event);
    } else {
      this.appUtilityObject.showInfoAlert("No calendar available for create event")
    }
   }
   dayHeaderClicked(event) {
    if(event['isTrusted'] === undefined){
      let temp = event;
      event = event['sourceEvent']
      event['day'] = temp['day'];
    }
    this.addEventForDate(event.day.date, event);
   }
   weekDayClick(event) {
  }
   async addEventForDate(dateVal, event) {
     const datedisplay = moment(dateVal, this.appUtilityObject.userDateTimePickerFormat).format('MMMM DD,YYYY')
     const daydisplay = moment(dateVal, this.appUtilityObject.userDateTimePickerFormat).format('dddd');
     const dateFordisplay = moment(dateVal, this.appUtilityObject.userDateTimePickerFormat).format('MMMM DD,YYYY hh:mm a')
     console.log('dateFordisplay', dateFordisplay);
     let htmlElement: HTMLElement = document.getElementById('cs-dropdown-custom-123');	
     htmlElement.innerHTML = ""	
     this.slickgridpopoverservice.appendComponentToElement_View('cs-dropdown-custom-123', popoverpage, {	
       setdateDisplay: datedisplay,	
       setdayDisplay: daydisplay,	
       setdisplayMessage: 'Choose the calendar to create new event',	
       setdateToDisplay: dateFordisplay,	
       seteventLayoutInfo: this.createEventArr,	
       parentPage: this 
     })	
     //  rayeez		
     let e = event.currentTarget	
     setTimeout(() => {	
       e.classList.add("cs-dropdown-open");	
       window.$(".cs-dropdown-open").jqDropdown("attach", [".cs-dropdown"]);	
       window.$(".cs-dropdown-open").jqDropdown("show", [".cs-dropdown"]);	
     }, 100)
   }
   ionViewDidEnter() {
    this.locale = this.translateservice.currentLang
    this.refresh.next();
    this.screenHeight();
  
   }
     showHideButton() {
     this.showContent = this.showContent ? false : true;
     this.myCalendarheight();
   }
   onSelect() {
     this.IsHidden = !this.IsHidden;
   }
   showyearContent() {
     this.yearContent = true;
   }
 
   onCancel() { }
 
   myCalendarheight() {
     var toolbarHeight;
     var leftmonthcal;
     var mycalhead;
     var leftsearchbox;
     var eventselectionDiv;
     setTimeout(() => {
       toolbarHeight = document.getElementsByTagName('ion-toolbar')[0].offsetHeight;
       var mycalheight =  document.getElementsByClassName("cs-mycal-section")[0];
       leftmonthcal = document.getElementById("cs-left-month-cal")['offsetHeight'];
       mycalhead = document.getElementById("cs-ion-cal-listheader")['offsetHeight'];
       leftsearchbox = document.getElementsByClassName("cs-mycal-inputbox")[0]['offsetHeight'];
       eventselectionDiv = document.getElementsByClassName("cs-selandunsel")[0]['offsetHeight'];
       mycalheight['style']['height'] = (window.innerHeight - toolbarHeight - leftmonthcal - mycalhead - leftsearchbox - eventselectionDiv - 45) + 'px';
     }, 100)
   }
   eventoverlap() {
     var overlapingevents = document.getElementsByTagName("mwl-calendar-week-view")[0];
     var dayElement = overlapingevents.getElementsByClassName("cal-day-column");
     for (let i = 0; i < dayElement.length; i++) {
       var childElement = dayElement[i].getElementsByClassName('cal-events-container');
       for (let j = 0; j < childElement.length; j++) {
         var nodechildElement = childElement[j].getElementsByClassName('cal-event-container');
         let xVal = -5;
         for (let x = 0; x < nodechildElement.length; x++) {
           nodechildElement[x]['style']['marginLeft'] = (x * xVal) + 'px';
         }
       }
     }
   }
   registerRecordChangeListener() {
     const sectionObjectKeys = Object.keys(this.sectionDependentObjectList)
     sectionObjectKeys.forEach(sectionObjectName => {
       const sectionDependentObject = this.sectionDependentObjectList[sectionObjectName];
       if (sectionDependentObject['relationalObjects']) {
         Object.keys(sectionDependentObject['relationalObjects']).forEach(dependentObjectName => {
           this.appUtilityObject.setEventSubscriptionlayoutIds(dependentObjectName, sectionObjectName, this.dataSource)
         })
       }
       if (sectionDependentObject['lookupObjects']) {
         Object.keys(sectionDependentObject['lookupObjects']).forEach(dependentObjectName => {
           this.appUtilityObject.setEventSubscriptionlayoutIds(dependentObjectName, sectionObjectName, this.dataSource)
         })
       }

       this.observableListenerUtils.subscribe(sectionObjectName, (modified) => {
         const changedDependentObject = this.sectionDependentObjectList[sectionObjectName]
         let idArrayToFetch = [];
         const type = modified['doc']['data']['type'];
         const filteredResult = this.calendarEventObject.filter(childItem => childItem['calendarObject']['calendarName'] === changedDependentObject['calendarName'])
         const calendarObj = this.calendarDetails.filter(calendarDetailsObj => calendarDetailsObj['calendarName'] === changedDependentObject['calendarName'])[0]
         if (filteredResult && filteredResult.length !== 0) {
           let calendarEventList = filteredResult[0]['calendarRecords']
           if (changedDependentObject['relationalObjects'] && changedDependentObject['relationalObjects'][type]) {
             if (changedDependentObject['relationalObjects'][type].length === 0) {
               // parent record fetch
               this.handleLiveParentRecordFetch(modified['doc']['_id'], calendarObj).then(result => {
                 this.listenerRecordhandling(calendarEventList, modified['doc']['_id'], type, result).then(calResult => {
                   this.createEventsForCalendar(this.calendarEventObject);
                 })
               })

             } else if (changedDependentObject['relationalObjects'][type].length === 1) {
               // For first level dependent
               idArrayToFetch = calendarEventList.filter(element => {
                 var object = this.appUtilityObject.getObject(element, changedDependentObject['relationalObjects'][type][0])
                 if (object && type + "_2_" + object['id'] === modified['id']) {
                   return element
                 }
               })
               idArrayToFetch.forEach(element => {
                 this.handleLiveParentRecordFetch(element['type'] + "_2_" + element['id'], calendarObj).then(result => {
                   this.listenerRecordhandling(calendarEventList, element['type'] + "_2_" + element['id'], element['type'], result).then(calResult => {
                     this.createEventsForCalendar(this.calendarEventObject);
                   })
                 })
               });
             } else {
               // For inner level dependent
               idArrayToFetch = calendarEventList.filter(element => {
                 if (this.appUtilityObject.innerDependentObjectIdCheck(element, changedDependentObject['relationalObjects'][type], type, modified)) {
                   return element
                 }
               })
               idArrayToFetch.forEach(element => {
                 this.handleLiveParentRecordFetch(element['type'] + "_2_" + element['id'], calendarObj).then(result => {
                   this.listenerRecordhandling(calendarEventList, element['type'] + "_2_" + element['id'], element['type'], result).then(calResult => {
                     this.createEventsForCalendar(this.calendarEventObject);
                   })
                 })
               });
             }
           }
           if (changedDependentObject['lookupObjects'] && changedDependentObject['lookupObjects'][type]) {
             let arrayData = changedDependentObject['lookupObjects'][type]
             var lookupInvolvedObjKeys = Object.keys(changedDependentObject['lookupObjects'][type])
             lookupInvolvedObjKeys.forEach(elementType => {
               if (arrayData[elementType].length === 1) {
                 // For first level lookup
                 const taskList = [];
                 idArrayToFetch = calendarEventList.filter(element => {
                   var object = this.appUtilityObject.getObject(element, arrayData[elementType][0])
                   if (object && type + "_2_" + object['id'] === modified['id']) {
                     return element
                   }
                 })
                 idArrayToFetch.forEach(element => {
                   taskList.push(this.handleLiveParentRecordFetch(element['type'] + "_2_" + element['id'], calendarObj).then(result => {
                     return this.listenerRecordhandling(calendarEventList, element['type'] + "_2_" + element['id'], element['type'], result).then(calresult => {
                       return calresult;
                     })
                   }))
                 });
                 Promise.all(taskList).then(res => {
                   this.createEventsForCalendar(this.calendarEventObject);
                 });
               } else {
                 // For inner level lookup
                 const taskList = [];
                 idArrayToFetch = calendarEventList.filter(element => {
                   if (this.appUtilityObject.innerDependentObjectIdCheck(element, arrayData[elementType], type, modified)) {
                     return element
                   }
                 })
                 idArrayToFetch.forEach(element => {
                   taskList.push(this.handleLiveParentRecordFetch(element['type'] + "_2_" + element['id'], calendarObj).then(result => {
                     return this.listenerRecordhandling(calendarEventList, element['type'] + "_2_" + element['id'], element['type'], result).then(calresult => {
                       return calresult;
                     })
                   }))
                 });
                 Promise.all(taskList).then(res => {
                   this.createEventsForCalendar(this.calendarEventObject);
                 });
               }
             })
           }
         }
       })
     })
   }
   async handleLiveParentRecordFetch(idVal,calendarObj) {
     const hierarchyJson = calendarObj["calendarHierarchyJSON"];
     const query = calendarObj["query"] + " AND " + 'id: ' + idVal;
     console.log("query str", query);
     return this.calendarBridgeObject.fetchCalendarRecordFromCouchDB(query, hierarchyJson).then(result => {
      
       const calendarStatus = result["status"];
       if (calendarStatus === "SUCCESS") {
         return result["records"];
       } else {
         return [];
       }
     });
   }
   async listenerRecordhandling(calendarEventList, removedObjectId, type, calendarRecords) {
     if (calendarRecords.length !== 0) {
       if (calendarEventList.length !== 0) {
         let findObj = calendarEventList.filter(calendarEvent => type + "_2_" + calendarEvent["id"] === removedObjectId)[0]
         if (findObj) {
           let indexVal = calendarEventList.indexOf(findObj)
           calendarEventList.splice(indexVal, 1);
           calendarEventList.push(calendarRecords[0])
         } else {
           calendarEventList.push(calendarRecords[0])
         }
       } else {
         calendarEventList.push(calendarRecords[0])
       }
       return true
     } else {
      let findObj = calendarEventList.filter(calendarEvent => type + "_2_" + calendarEvent["id"] === removedObjectId)[0]
      if (findObj) {
         let indexVal = calendarEventList.indexOf(findObj)
         calendarEventList.splice(indexVal, 1);
         return true
       }
     }
     return false
   }
   getOrgTimezoneDate(inputDate, dateType?) {
    if (dateType === "DATE") {
        if (inputDate instanceof Date) {
            inputDate = inputDate.getTime()
            + moment.tz(Intl.DateTimeFormat().resolvedOptions().timeZone).utcOffset() * 60 * 1000
        }
        const inputDateString = this.datePipe.transform(inputDate,this.appUtilityObject.userDateTimeFormat, this.appUtilityObject.utcOffsetValue)
        return moment(inputDateString, this.appUtilityObject.userDateTimePickerFormat).toDate()
    } else {
        if (inputDate instanceof Date) {
            inputDate = inputDate.getTime() 
            + moment.tz(Intl.DateTimeFormat().resolvedOptions().timeZone).utcOffset() * 60 * 1000
            - moment.tz(this.appUtilityObject.userTimeZone).utcOffset() * 60 * 1000
            
        }
        const inputDateString = this.datePipe.transform(inputDate,this.appUtilityObject.userDateTimeFormat, this.appUtilityObject.userZoneOffsetValue) //this.getDateTimeFromCalendar(inputDate);
        return moment(inputDateString, this.appUtilityObject.userDateTimePickerFormat).toDate()
    }
}
  loadDatesInEvents(startdate, endDate,dateFieldType?){
    // Removed the added 24 hrs for date field 
    if (dateFieldType === "DATE") {
      endDate = endDate - (1000 * 60 * 60 * 23.99)
    }
    var startDateVal = this.getOrgTimezoneDate(startdate,dateFieldType)
    var endDateVal = this.getOrgTimezoneDate(endDate,dateFieldType)
    const startDate1 = new Date(startDateVal.getFullYear(), startDateVal.getMonth(), startDateVal.getDate(), 0, 0, 0);
    const endDate1 = new Date(endDateVal.getFullYear(), endDateVal.getMonth(), endDateVal.getDate(), 23, 59, 59);
    const diffDays = differenceInDays(endDate1, startDate1);
    let titleStr = '';
    if (diffDays === 1) {
      let startdateStr = this.datePipe.transform(startDate1, "dd MMM yyyy");
      let enddateStr = this.datePipe.transform(endDate1, "dd MMM yyyy");
      titleStr = ' (' +startdateStr + ' and ' + enddateStr + ')'
    } else if (diffDays >= 2) {
      let startdateStr = this.datePipe.transform(startDate1, "dd MMM yyyy")
      let enddateStr = this.datePipe.transform(endDate1, "dd MMM yyyy")
      titleStr = ' (' +startdateStr + ' to ' + enddateStr + ')'
    }
    return titleStr;
  }
 }
 
