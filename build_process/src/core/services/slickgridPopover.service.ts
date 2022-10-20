

import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
  RendererFactory2,
} from "@angular/core";
import { AngularUtilService, OnEventArgs } from "angular-slickgrid";
import { FieldInfo } from "../pipes/cspfm_data_display";
import { Subject } from "rxjs";
declare const window: any;

interface PopoverServiceParams {
  /** the custom action formatter component that contains the dropdown */
  component: any;

  /** help to get the data context */
  args: any;

  /** parent container */
  parent: any;

  /** Offset bottom when using a Drop Up, if we need to reposition the dropdown component */
  offsetDropupBottom?: number;

  /** Offset left if we need to reposition the dropdown component */
  offsetLeft?: number;

  /** Offset top if we need to reposition the dropdown component */
  offsetTop?: number;

  additionalInfo?: any;
}

// using external non-typed js libraries
declare const $: any;

// Boostrap dropdown service
@Injectable()
export class SlickgridPopoverService {
  private _domContainerElement: any;
  private _domElement: any;
  public _getChangedValue = new Subject();
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private angularUtilService: AngularUtilService,
    private rendererFactory: RendererFactory2
  ) {}

  get domElement() {
    return this._domElement;
  }

  get domContainerElement() {
    return this._domContainerElement;
  }

  get gridViewport() {
    return $('.slick-viewport');
  }

  dispose() {
    if (this._domElement && this._domElement.remove) {
      this._domElement.remove();
      $(".cs-bgshade").remove();
      $(".cs-popup-arrow-left").remove();
      $(".cs-popup-arrow-right").remove();
    }
  }

  dropContainerShow() {
    if (this._domContainerElement && this._domContainerElement.show) {
      this._domContainerElement.show();
    }
  }
  getCellOffset(element) {
    var cellOffset = {
      top: element.offsetTop,
      left: element.offsetLeft,
      bottom: 0,
      right: 0,
      width: $(element).outerWidth(),
      height: $(element).outerHeight(),
      visible: true
    };
    cellOffset.bottom = cellOffset.top + cellOffset.height;
    cellOffset.right = cellOffset.left + cellOffset.width;
    // walk up the tree
    var offsetParent = element.offsetParent;
    while ((element = element.parentNode) !== document.body) {
      if (cellOffset.visible && element.scrollHeight !== element.offsetHeight && $(element).css("overflowY") !== "visible") {
        cellOffset.visible = cellOffset.bottom > element.scrollTop && cellOffset.top < element.scrollTop + element.clientHeight;
      }
      if (cellOffset.visible && element.scrollWidth !== element.offsetWidth && $(element).css("overflowX") !== "visible") {
        cellOffset.visible = cellOffset.right > element.scrollLeft && cellOffset.left < element.scrollLeft + element.clientWidth;
      }

      cellOffset.left -= element.scrollLeft;
      cellOffset.top -= element.scrollTop;

      if (element === offsetParent) {
        cellOffset.left += element.offsetLeft;
        cellOffset.top += element.offsetTop;
        offsetParent = element.offsetParent;
      }
      cellOffset.bottom = cellOffset.top + cellOffset.height;
      cellOffset.right = cellOffset.left + cellOffset.width;
    }
    return cellOffset;
  }
  render(dropdownParams: PopoverServiceParams) {
    return new Promise((resolve) => {
      const { component, args, parent, offsetTop, offsetLeft,additionalInfo } = dropdownParams;
      let componentInstance:any;
      const cell = args.cell;
      const row = args.row;

      let dataContext = args['grid'].getDataItem(row);
      let slickgridRowIdentificationValues = [];
      if (args['columnDef'] && args['columnDef']['params']['fieldInfo'] && (args['columnDef']['params']['fieldInfo']['fieldType'] === "STATUSWORKFLOW" || args["columnDef"]["params"]["cspfmEditorType"] === "LOOKUP") && args["grid"].getColumns() && args["grid"].getColumns().length > 0) {
        let satisfiedItemCount = 0;
        let filteredColumns = args["grid"].getColumns().filter((column) => {
          if (column["params"] && column["params"]["fieldInfo"]) {
            let fieldType = this.getFieldType(column["params"]["fieldInfo"]);
            let criteria = fieldType !== "ACTION" &&
              fieldType !== "STATUSWORKFLOW" &&
              fieldType !== "IMAGE" &&
              fieldType !== "GEOLOCATION" &&
              fieldType !== "PASSWORD" &&
              fieldType !== "RICHTEXT" &&
              fieldType !== "FILEUPLOAD";
            if (criteria === true && satisfiedItemCount < 2) {
              satisfiedItemCount = satisfiedItemCount + 1;
              return true;
            }
          }
        });
        filteredColumns.forEach((filteredColumn) => {
          slickgridRowIdentificationValues.push(filteredColumn["params"]["pipe"].transform(dataContext,filteredColumn["params"]["fieldInfo"]));
        });
      }

      this._domContainerElement = $(`#myDrop-r${row}-c${cell}`);

      if (this._domContainerElement) {
        // hide the dropdown we created as a formatter Component, we'll redisplay it later
        // console.log("domContainerElement",this._domContainerElement);
        // const cellPos = this._domContainerElement.offset();
        const cellPos = this.getCellOffset(args.grid.getCellNode(args.row, args.cell));
        const componentOutput = this.angularUtilService.createAngularComponent(component);
        componentInstance = componentOutput && componentOutput.componentRef && componentOutput.componentRef.instance;

        if (componentInstance) {
          const myDropId = componentInstance.dropdownId || "myDrop";
          const dropDownToggleId = componentInstance.dropDownToggleId || "dropdownMenu1";
          this._domElement = $(`#${myDropId}`);

          if (this._domElement) {
            // make sure to remove any previous Action dropdown elements, to avoid having multiple element of the same on top of each other
            this.dispose();

            // assign the row data to the dropdown component instance
            if(additionalInfo?.type === 'USERASSIGNMENT'){
              Object.assign(componentInstance, {
                layoutId:additionalInfo['layoutIdData'],
                actionId:additionalInfo['actionIdData'],
                setIcon:'icon-mat-person_add cs-editact',
                setIsHeaderAction:false,
                dataObject:additionalInfo['data']
              });
            } else{
            Object.assign(componentInstance, {
              parent,row: args.row,dataContext: dataContext,
              columnDef: args["columnDef"],
              info: additionalInfo,
              popoverClose: () => {
                this.dispose();
              },
              slickgridRowIdentificationValues: slickgridRowIdentificationValues,
            });
          }
            let cspfmEditorType = args["columnDef"]["params"]["cspfmEditorType"];
	            //close repetitive balloon popup on list page
              if($('.cs-balloon-popup-style:visible')){
                $('.cs-balloon-popup-style').parents('cspfmballooncomponent').remove();
              }
            // use a delay to make sure Angular ran at least a full cycle and make sure it finished rendering the Component before using it
            setTimeout(() => {
              $(document).find('.dontCloseInGloablClick').removeClass('dontCloseInGloablClick')
              $(document).find('.cs-fabDropDown').removeClass('cs-fabDropDown')
              
              // create a new dropdown element
              if(additionalInfo?.type === 'USERASSIGNMENT'){
                const div =  document.createElement('div')
                div.className ='dropdown'
                div.id='myDrop'
                div.innerHTML = ` <a class="dropdown-toggle" id="toggleDrop" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                <span class="caret"></span>
              </a>`
              div.append(componentOutput.domElement)
              this._domElement = $(div)
              } else{
                this._domElement = $(componentOutput.domElement);
              }
              let topPos = ((cellPos && cellPos.top) || 0) + 30 + (offsetTop || 0);
              let leftPos = ((cellPos && cellPos.left) || 0) + (offsetLeft || 0);
              this._domElement.appendTo("body");
              this._domElement.css("position", "absolute");
              // popup overlay already we have 1000. so we give 1001
              this._domElement.css("z-index", 1001);
              // this._domElement.css('top', topPos);
              this._domElement.css("left", leftPos);
              $(`#${myDropId}`).addClass("open");
              $(`#${dropDownToggleId}`).hide();

              // check if it should drop Up or Down
              //const offset = 35;
              const iElement = $(".dropdown-menu");
              //const iElementWrapper = iElement.parent();
              //const iElementWrapperOffset = iElementWrapper.offset() || {};
              //const iElementWrapperOffsetTop = iElementWrapperOffset.top || iElementWrapper && iElementWrapper.length > 0 && iElementWrapper[0].offsetTop;
              //const iElementHeight = iElement.height();
              const windowHeight = window.innerHeight;

              // if its a popover we need to provide left right top bottom with arrow  and the popover will be in the same line as the click icon
              if ($(this._domElement[0]['localName']).find('.cs-popover-style')['length']) {
                // console.log('Popover Called')
                var btnleft = $('.slick-cell.active').find('.cs-userassign-active').position()['left']
                var btnWidth = $('.slick-cell.active').find('.cs-userassign-active').width()
                var popupWidth = $(this._domElement[0]['localName']).find('.cs-popover-style').width()
                let cellHeight = $('.slick-cell.active').height()

                $('.cs-popup-arrow-left').remove();
                $('.cs-popup-arrow-right').remove();

                console.log("window ", window.innerWidth);
                console.log("cellPos left ", cellPos.left);
                console.log("cellPos width ", cellPos.width);
                console.log("btnleft ", btnleft);
                console.log("btnWidth ", btnWidth);
                console.log("popupWidth ", popupWidth);
                console.log("cellHeight ", cellHeight);

                // choose left are right
                // if(window.innerWidth - (cellPos.left + cellPos.width + 150) > 0){
                if ((window.innerWidth - cellPos.left) - (popupWidth + btnWidth) > 0) {
                  console.log("Popup right side == arrow to left");
                  this._domElement.css('left', cellPos.left + btnleft + btnWidth + 35); // 15 for arrow
                  $("body").append('<div class="cs-popup-arrow-left"></div>');
                  $(".cs-popup-arrow-left").css("top", cellPos.top + (cellHeight / 2));
                  $(".cs-popup-arrow-left").css("left", cellPos.left + btnleft + btnWidth + 15 - 10);
                } 
                else {
                  console.log("Popup left side == arrow to right");
                  this._domElement.css('left', 15 + cellPos.left - popupWidth+btnleft); // 15 for arrow
                  $("body").append('<div class="cs-popup-arrow-right"></div>');
                  $(".cs-popup-arrow-right").css("top", cellPos.top + (cellHeight / 2));
                  $(".cs-popup-arrow-right").css("left", cellPos.left+btnleft);
                }


                // choose top or bottom or center
                let _height = $(this._domElement[0]["localName"]).find(".cs-popover-style").height()
                if (windowHeight - (cellPos.top + _height) < 0) {
                  console.log("BOTTOM to Top")
                  // find hidden area of popup height and add with ct
                  this._domElement.css("top", (cellPos.top - 10 - 15) - ((cellPos.top + _height) - windowHeight));
                } else {
                  console.log("Top to BOTTOM")
                  this._domElement.css("top", cellPos.top - 10);
                }

              } else if ($(this._domElement[0]['localName']).find('.cs-balloon-popup-style')['length']) {
                // console.log('Popover Called')
                var ballBtnleft = $('.slick-cell.active').find('.cs-balloon-position').position()['left']
                var ballBtnWidth = $('.slick-cell.active').find('.cs-balloon-position').width()
                var ballPopupWidth = $(this._domElement[0]['localName']).find('.cs-balloon-popup-style').width()
                let ballCellHeight = $('.slick-cell.active').height()
                // $('.cs-popup-arrow-left').remove();
                // $('.cs-popup-arrow-right').remove();
                // console.log("window ", window.innerWidth);
                // console.log("cellPos left ", cellPos.left);
                // console.log("cellPos width ", cellPos.width);
                // console.log("ballBtnleft ", ballBtnleft);
                // console.log("ballBtnWidth ", ballBtnWidth);
                // console.log("ballPopupWidth ", ballPopupWidth);
                // console.log("ballCellHeight ", ballCellHeight);
                // choose left are right
                // if(window.innerWidth - (cellPos.left + cellPos.width + 150) > 0){
                if ((window.innerWidth - cellPos.left) - (ballPopupWidth + ballBtnWidth) > 0) {
                  console.log("Popup right side == arrow to left");
                  this._domElement.css('left', cellPos.left + ballBtnleft + ballBtnWidth + 35); // 15 for arrow
                  // $("body").append('<div class="cs-popup-arrow-left"></div>');
                  // $(".cs-popup-arrow-left").css("top", cellPos.top + (ballCellHeight / 2));
                  // $(".cs-popup-arrow-left").css("left", cellPos.left + ballBtnleft + ballBtnWidth + 15 - 10);
                } else {
                  console.log("Popup left side == arrow to right");
                  this._domElement.css('left', 22 + cellPos.left - ballPopupWidth); // 15 for arrow
                  // $("body").append('<div class="cs-popup-arrow-right"></div>');
                  // $(".cs-popup-arrow-right").css("top", cellPos.top + (ballCellHeight / 2));
                  // $(".cs-popup-arrow-right").css("left", cellPos.left);
                }
                // choose top or bottom or center
                let _ballHeight = $(this._domElement[0]["localName"]).find(".cs-balloon-popup-style").height()
                if (windowHeight - (cellPos.top + _ballHeight) < 0) {
                  console.log("BOTTOM to Top")
                  // find hidden area of popup height and add with ct
                  this._domElement.css("top", (cellPos.top - 10 - 15) - ((cellPos.top + _ballHeight) - windowHeight));
                } else {
                  console.log("Top to BOTTOM")
                  this._domElement.css("top", cellPos.top - 10);
                }
                 // height set to unset -> to make content based height for balloon popup
                 $("cspfmBalloonComponent").find(".cs-balloon-popup-style").find('.cs-scroll-body-height').css('height','unset')
              } else {
               
              let topPosc = topPos;
              if ((topPosc + Math.floor((windowHeight - 70) / 2)) < (windowHeight - 70)) {
                this._domElement.css("top", topPos);
              }
             
                if($('body').find('cspfmmoreactionpopover')[0]){
                  console.log("More Option")
                  console.log($(this._domElement[0]))
                  
                  let more_action_height = $('cspfm-slickgrid-popover .dropdown').height()
                  let more_Action_position = $('cspfm-slickgrid-popover').position()
                  console.log(more_action_height)
                  console.log(more_Action_position)
                  
                if(windowHeight - (topPos + more_action_height) < 0){
                  this._domElement.css('top', topPos - more_action_height - 10);
                } else{
                  this._domElement.css('top', topPos);
                }
              }
             

              const windowWidth = window.innerWidth;
              const iElementWidth = iElement.width();

              if (leftPos + iElementWidth > windowWidth) {
                leftPos = leftPos - iElementWidth + iElementWidth / 2.66;
                this._domElement.css("left", leftPos);
              }
              try {
                this._domElement.dropdown("show"); // required for Bootstrap 4 only
              } catch (e) {
                // Bootstrap 3 wil throw an error since that method doesn't exist, we can safely disregard it
              }

              if (cspfmEditorType && cspfmEditorType === "LOOKUP") {
                $("body").append("<div class='cs-bgshade'></div>");
                leftPos = (windowWidth - iElementWidth) / 2;
                topPos = (windowHeight - 464) / 2;
                this._domElement.css("left", leftPos);
                this._domElement.css("top", topPos);
              }

           }
              this._domElement.on("hidden.bs.dropdown", () =>this.dropContainerShow());

              // hide dropdown menu on grid scroll
              this.gridViewport.on("scroll", () => this.dispose());

              if (additionalInfo && !cspfmEditorType && additionalInfo["type"] !== "USERASSIGNMENT") {
                // hide on dropdown click
                this._domElement.on("click", (event) => {
                  this.dispose();
                });
              }

              if(args["columnDef"]["params"]["cspfmEditorType"] !== "LOOKUP") {
                $(document).on("click", (event) => {
                  let activeElement = (event && event["currentTarget"] && event["currentTarget"]["activeElement"]) || undefined;
                  let actionView = (activeElement && activeElement.getAttribute("actionView")) || undefined;
                  if (!event.target.closest('.cs-popover-style') && actionView === undefined && !event.target.closest('.cs-balloon-popup-style')) {
                    if(event.target.closest('.cdk-overlay-container') || event.target.closest(".slick-gridmenu")){
                      return;
                    } 
                    this.dispose();
                    if (typeof  componentInstance.ngOnDestroy === 'function'){
                    componentInstance.ngOnDestroy()
                    }
                  }
                });
              }
              resolve(true);
            });
          }
        }
      }
    });
  }

  getFieldType(fieldInfo: FieldInfo | "") {
    if (fieldInfo["fieldType"] === "LOOKUP" ||
      fieldInfo["fieldType"] === "MASTERDETAIL" ||
      fieldInfo["fieldType"] === "HEADER") {
      return this.getFieldType(fieldInfo["child"]);
    } else {
      return fieldInfo["fieldType"];
    }
  }

  getFieldValue(data, fieldInfo: FieldInfo | "") {
    if (fieldInfo === "") {
      return "";
    }
    if (data[fieldInfo["fieldName"]] === null) {
      return null;
    }
    if (fieldInfo["fieldType"] === "LOOKUP") {
      if (data[fieldInfo["fieldName"]]) {
        return this.getFieldValue(data[fieldInfo["fieldName"]],fieldInfo["child"]);
      } else {
        return "";
      }
    } else if (fieldInfo["fieldType"] === "COMMONLOOKUP") {
      if (data[fieldInfo["fieldName"]] && data[fieldInfo["fieldName"]] !== null) {
        const commonLookUpDropDownKeyValue = data[fieldInfo["commonLookupDropDownKey"]];
        const commonLookUpResultColumn = fieldInfo["commonLookUpMappingDetail"][commonLookUpDropDownKeyValue];
        const commonLookupObject = data[fieldInfo["fieldName"]];
        return commonLookupObject[commonLookUpResultColumn["field"]];
      } else {
        return "";
      }
    } else if (fieldInfo["fieldType"] === "MASTERDETAIL") {
      if (data[fieldInfo["fieldName"]] && data[fieldInfo["fieldName"]].length > 0) {
        return this.getFieldValue(
          data[fieldInfo["fieldName"]][0],
          fieldInfo["child"]
        );
      } else {
        return "";
      }
    } else {
      return data[fieldInfo["fieldName"]];
    }
  }

  getFieldData(data,fieldInfo: FieldInfo | ""): { fieldInfo: FieldInfo | ""; data: any } {
    if (fieldInfo["fieldType"] === "LOOKUP" ||
      fieldInfo["fieldType"] === "MASTERDETAIL" ||
      fieldInfo["fieldType"] === "HEADER") {
      let childFieldInfo = fieldInfo["child"];
      if (childFieldInfo) {
        if (childFieldInfo["fieldType"] === "LOOKUP" ||
          childFieldInfo["fieldType"] === "MASTERDETAIL" ||
          childFieldInfo["fieldType"] === "HEADER") {
          if (fieldInfo["fieldType"] === "MASTERDETAIL") {
            if (data[fieldInfo["fieldName"]] && data[fieldInfo["fieldName"]].length > 0) {
              return this.getFieldData(data[fieldInfo["fieldName"]][0],fieldInfo["child"]);
            } else {
              return this.getFieldData({}, fieldInfo["child"]);
            }
          } else {
            return this.getFieldData(data[fieldInfo["fieldName"]],fieldInfo["child"]);
          }
        } else {
          return { fieldInfo, data };
        }
      } else {
        if (fieldInfo["fieldType"] === "MASTERDETAIL") {
          if (data && data.length > 0) {
            return { fieldInfo, data: data[0] };
          } else {
            return {
              fieldInfo,data: {},
            };
          }
        } else {
          return { fieldInfo, data };
        }
      }
    } else {
      return { fieldInfo, data };
    }
  }
  getFieldInfo(fieldInfo: FieldInfo | "") {
    if (fieldInfo["fieldType"] === "LOOKUP" ||
      fieldInfo["fieldType"] === "MASTERDETAIL" ||
      fieldInfo["fieldType"] === "HEADER") {
      return this.getFieldInfo(fieldInfo["child"]);
    } else {
      return fieldInfo;
    }
  }

  appendComponentToElement(elementId: string,component: any,args: OnEventArgs,actionInfo?) {
    // 1. Create a component reference from the component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);
    let fieldType: string = '';
    if (args['columnDef'] && args['columnDef']["params"] && args['columnDef']["params"]["fieldInfo"]) {
      fieldType = this.getFieldType(args['columnDef']["params"]["fieldInfo"]);
    }
    if (actionInfo && actionInfo["actionType"] === "WHO_COLUMN") {
      Object.assign(componentRef.instance, {
        dataContext: args["dataContext"],
        columnDef: args["columnDef"],
        info: {
          cspfmObjectName:actionInfo["objectName"], 
          auditType: actionInfo["auditType"],
          auditFields: actionInfo["auditFields"]
        },
      });
    } else if (fieldType === "STATUSWORKFLOW") {
      this.prepareStatusWorkflowPopup(componentRef.instance, args);
    } else if (actionInfo && (actionInfo["actionType"] === "URL" || actionInfo["actionType"] === "ASSOCIATION")) {
      Object.assign(componentRef.instance, {
        dataContext: args["dataContext"],
        columnDef: args["columnDef"],
        info: actionInfo,
      });
    }else if (actionInfo["actionType"] === "WORK FLOW") {
      Object.assign(componentRef.instance, {
        dataContext: args["dataContext"],
        columnDef: args["columnDef"],
        info: actionInfo,
      });
    }else if (actionInfo && actionInfo["actionType"] === "MAIL"){
      Object.assign(componentRef.instance, {
        dataContext: args["dataContext"],
        columnDef: args["columnDef"],
        info: {
          cspfmObjectName:actionInfo["objectName"],
          actionInfo: actionInfo,
        },
      });
    }else if (actionInfo && actionInfo["type"] === "MORE_ACTION") {
      Object.assign(componentRef.instance, {
        dataContext: args["dataContext"],
        columnDef: args["columnDef"],
        info: {
          cspfmObjectName: actionInfo["cspfmObjectName"],
          moreActionInfo: actionInfo['moreActionInfo'],
          type: "MORE_ACTION",

        },
      });
    } else if (actionInfo["actionType"] === "CUSTOM_ACTION") {
      Object.assign(componentRef.instance, {
        dataContext: args["dataContext"],
        columnDef: args["columnDef"],
        info: actionInfo,
      });
    }

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // 3. Get DOM(Document object model) element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 4. Append DOM element to the body
    let htmlElement: HTMLElement = document.getElementById(elementId);
    htmlElement.innerHTML = "";
    htmlElement.appendChild(domElem);

    // 5. Wait some time and remove it from the component tree and from the DOM
    // setTimeout(() => {
    //   this.appRef.detachView(componentRef.hostView);
    //   componentRef.destroy();
    // }, 3000);

    //window.$(".cs-dropdown-open").jqDropdown("show", [".cs-dropdown"]);
    // window['$']('.cs-dropdown-open').jqDropdown('show',['.cs-dropdown'])
  }

  prepareStatusWorkflowPopup(componentInstance: any, args: OnEventArgs) {
    let slickgridRowIdentificationValues = [];
    if (
      args["columnDef"] &&
      args["columnDef"]["params"]["fieldInfo"] &&
      (args["columnDef"]["params"]["fieldInfo"]["fieldType"] ===
        "STATUSWORKFLOW" ||
        args["columnDef"]["params"]["cspfmEditorType"] === "LOOKUP") &&
      args["grid"].getColumns() &&
      args["grid"].getColumns().length > 0
    ) {
      let satisfiedItemCount = 0;
      let filteredColumns = args["grid"].getColumns().filter((column) => {
        if (column["params"] && column["params"]["fieldInfo"]) {
          let fieldType = this.getFieldType(column["params"]["fieldInfo"]);
          let criteria =
            fieldType !== "ACTION" &&
            fieldType !== "STATUSWORKFLOW" &&
            fieldType !== "IMAGE" &&
            fieldType !== "GEOLOCATION" &&
            fieldType !== "PASSWORD" &&
            fieldType !== "RICHTEXT" &&
            fieldType !== "FILEUPLOAD";
          if (criteria === true && satisfiedItemCount < 2) {
            satisfiedItemCount = satisfiedItemCount + 1;
            return true;
          }
        }
      });
      filteredColumns.forEach((filteredColumn) => {
        slickgridRowIdentificationValues.push(
          filteredColumn["params"]["pipe"].transform(
            args["dataContext"],
            filteredColumn["params"]["fieldInfo"]
          )
        );
      });
    }

    Object.assign(componentInstance, {
      dataContext: args["dataContext"],
      columnDef: args["columnDef"],
      popoverClose: () => {
        this.dispose();
      },
      slickgridRowIdentificationValues: slickgridRowIdentificationValues,
    });
  }

  appendComponentToElement_View(elementId: string, component: any, data) {
    // 1. Create a component reference from the component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    Object.assign(componentRef.instance, data);

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // 3. Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 4. Append DOM element to the body
    let htmlElement: HTMLElement = document.getElementById(elementId);
    htmlElement.innerHTML = "";
    htmlElement.appendChild(domElem);

   // window.$(".cs-dropdown-open").jqDropdown("show", [".cs-dropdown"]);

    // 5. Wait some time and remove it from the component tree and from the DOM
    // setTimeout(() => {
    //   this.appRef.detachView(componentRef.hostView);
    //   componentRef.destroy();
    // }, 3000);
  }
}
