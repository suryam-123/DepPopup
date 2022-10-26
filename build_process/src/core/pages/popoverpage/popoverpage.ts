import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import * as $ from "jquery";
import { MdePopoverTrigger } from '@material-extended/mde';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
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
  dripDownAttribute = '';
  parentPage;
  public balloonLayoutInfo: any;
  public balloonEventType: any;
  @ViewChildren(MdePopoverTrigger) queryTrigger: QueryList<MdePopoverTrigger>;
  @ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;
  @ViewChild('targetelement', { static: false }) targetelement: MdePopoverTrigger;
  constructor(public observableListenerUtils: cspfmObservableListenerUtils, public modalController: ModalController) {
    this.dripDownAttribute = "#cs-dropdown-custom"
    console.log('date val', this.dateVal, this.items);
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
  @Input() set setitems(type) {
    this.items = type;
  }
  @Input() set setdateToDisplay(type) {
    this.dateVal = type;
  }
  @Input() set seteventLayoutInfo(type) {
    this.eventLayout = type;
  }
  @Input() set setParentpage(type) {
    this.parentPage = type;
  }
  ngOnInit() {
    console.log("ngOnInit")
    this.observableListenerUtils.subscribe('balloonCloseAfterActionClick', () => {
      this.closePopover();
    });
    setTimeout(() => {
      window.$(".cs-dropdown-open").jqDropdown("show", [".cs-dropdown"]);
    }, 100)
  }

  closePopover() {
    this.queryTrigger.toArray().forEach(
      closePopoverElement => {
        closePopoverElement.closePopover();
      }
    );
  }



  showBalloonLayoutOnHover(event: any, eventType: any, mouseEvent) {
    this.parentPage.showBalloonLayoutOnHover(event, eventType, mouseEvent);
  }

  onItemPressed(item, event) {
    this.parentPage.closePopover();
    event.stopPropagation()
    this.parentPage.popUpResponse(item, this.dateVal, event, this.items)
    let balloonhtmlElement = document.getElementById('cs-dropdown-calendarpage');
    if (balloonhtmlElement)
      balloonhtmlElement.innerHTML = ""
  }
  closeButtonPressed() {
    window.$(".cs-dropdown-open").jqDropdown("hide", [".cs-dropdown"]);
    let getDropdown = document.getElementsByClassName('cs-dropdown')[0];
    getDropdown.classList.remove('cs-stop-scroll-hide');
    let balloonhtmlElement = document.getElementById('cs-dropdown-calendarpage');
    if (balloonhtmlElement)
      balloonhtmlElement.innerHTML = ""
  }
  onCreatePressed(eventInfo) {
    this.parentPage.popUpResponseForCreate(eventInfo, this.dateVal)
  }
}
