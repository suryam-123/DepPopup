import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import * as $ from "jquery";
declare const window: any;
@Component({
  selector: 'app-popover',
  templateUrl: './popoverpage.html',
  styleUrls: ['./popoverpage.scss'],
})

export class popoverpage {
  eventLayout = [];
  items = [];
  dateVal;
  dayDisplay;
  displayMessage;
  dateTimeVal;
  dripDownAttribute='';
  parentPage;
  constructor(public modalController: ModalController) {
    this.dripDownAttribute = "#cs-dropdown-custom"
    console.log('date val', this.dateVal,this.items);
  }
  @Input() set setdateDisplay(type) {
    this.dateVal = type;
  }
  @Input() set setdayDisplay(type) {
    this.dayDisplay = type;
  }
  @Input() set setdisplayMessage(type) {
    this.displayMessage = type;
  }
  @Input() set setitems(type){
    this.items = type;
  }
  @Input() set setdateToDisplay(type){
    this.dateVal = type;
  }
  @Input() set seteventLayoutInfo(type){
    this.eventLayout = type;
  }
  @Input() set setParentpage(type){
    this.parentPage = type;
  }
  ngOnInit(){
    console.log("ngOnInit")
      setTimeout(()=>{
        window.$(".cs-dropdown-open").jqDropdown("show", [".cs-dropdown"]);
      },100)
    }

  onItemPressed(item) {
      this.parentPage.popUpResponse(item, this.dateVal)
    }
  closeButtonPressed() {
    window.$(".cs-dropdown-open").jqDropdown("hide", [".cs-dropdown"]);
  }
  onCreatePressed(eventInfo){
    this.parentPage.popUpResponseForCreate(eventInfo, this.dateVal) 
   }
}
