import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector } from "@angular/core";
import { OnEventArgs } from "angular-slickgrid";
import { FieldInfo } from "../pipes/cspfm_data_display";
import { SlickgridPopoverService } from "../services/slickgridPopover.service";
//SWF ML
import {
  couchdbProvider
} from 'src/core/db/couchdbProvider';
declare const $: any;
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class cspfmOnDemandFeature {
  constructor(private slickgridPopoverService: SlickgridPopoverService, private couchdbProvider: couchdbProvider, private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector, private appRef: ApplicationRef,) { }

  private _domElement: any;
  async appendComponentToElement(elementId: string, component: any, args: OnEventArgs, actionInfo?, isMultiline?:boolean) {
    // 1. Create a component reference from the component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);
    let fieldType: string = '';
    if (args['columnDef']['params']['cspfmEditorType']) {
      var cspfmEditorType = args['columnDef']['params']['cspfmEditorType'];
    } else if (args['columnDef'] && args['columnDef']["params"] && args['columnDef']["params"]["fieldInfo"]) {
      fieldType = this.getFieldType(args['columnDef']["params"]["fieldInfo"]);


      let fieldInfo = this.getFieldInfo(args['columnDef']["params"]["fieldInfo"])
      let getValue = (data, fieldInfo: FieldInfo | '') => {
        if (data[fieldInfo["fieldName"]] && data[fieldInfo["fieldName"]] !== "" && fieldInfo["child"]) {
          if (fieldInfo["fieldType"] === "MASTERDETAIL") {
            return getValue(data[fieldInfo["fieldName"]][0], fieldInfo["child"])
          } else {
            return getValue(data[fieldInfo["fieldName"]], fieldInfo["child"])
          }
        } else {
          return data[fieldInfo["fieldName"]]
        }
      }
      //SWF ML
      var multilineFlag = isMultiline ? true : false;
      isMultiline = false;
      let recIds = []
      recIds.push(args['dataContext']['type'] + '_2_' +args['dataContext']['id']);
      try{
        let res = await this.couchdbProvider.fetchDocsWithDocIdsForConflictRecords(recIds);
        args['dataContext'] = res['records'][0];
      }catch(e){
        console.log(e);
      }
      var fieldValue = getValue(args["dataContext"], args['columnDef']['params']['fieldInfo']);
      var value = fieldValue;
      var objectConfig = fieldInfo['statusWorkflow']['objectConfig']
      var objectId = fieldInfo['statusWorkflow']['objectId']
      var fieldName = fieldInfo['statusWorkflow']['fieldName']
      var fieldId = objectConfig[objectId]['workflow'][fieldName]['fieldId'];
      var swList = objectConfig[objectId]['workflow'][fieldName]['configJson'];
      fieldType = fieldInfo['fieldType']
      var label = fieldInfo['statusWorkflow']['label']
      var dbservice = args['columnDef']['params']['dbserviceprovider']
      var defaultOptionValue = swList[value].filter(item => {
        return item['statusValue'] === value
      })[0]['statusValue']
      var previousStatus = swList[value].filter(item => {
        return item['statusValue'] === value
      })[0]
      var selectedItems = swList[value];
      //SWF ML
      if (args['dataContext']['createdby'] == null && args['dataContext']['createdon'] == null){
        selectedItems = [];
        selectedItems.push(swList[value][0]);
        isMultiline = true
      }
      var actionType = args['columnDef']['params']['actionType']

    }
    if (actionInfo && actionInfo["actionType"] === "WHO_COLUMN") {
      Object.assign(componentRef.instance, {
        "setItem": args["dataContext"],
        "setTitle": actionInfo["objectName"],
        "setType": actionInfo["auditType"],
        "auditFields": actionInfo["auditFields"]
      });
    }else if (fieldType && fieldType === 'STATUSWORKFLOW') {
      if (actionType === 'workflowHistory') {
        Object.assign(componentRef.instance, {
          selectedObject: args["dataContext"],
          fieldName: fieldName,
          dbServiceProvider: dbservice,
          fieldDisplayName: label,
          objectname:objectId
        });
      } else if (actionType === 'workflowStatus') {
        const slickgridRowIdentificationValues = this.prepareStatusWorkflowPopup(componentRef.instance, args);
        Object.assign(componentRef.instance, {
          "configStyle": '3',
          "displayName": label,
          "callingFrom": 'external',
          "entryComments": '',
          "selectedObject": args['dataContext'],
          "dbServiceProvider": dbservice,
          "fieldName": fieldName,
          "selectedStatus": previousStatus,
          "popUpType": 'slickgrid',
          "fieldIdValue": fieldId,
          "slickgridRowIdentificationValues": slickgridRowIdentificationValues,
          "selectedItems": selectedItems,
          "previousStatus": previousStatus,
          "isMultiline": isMultiline ? true: false
        });
        if(!multilineFlag) { //SWF ML
          componentRef.instance['popoverStatusChanged'].subscribe(statusChanged => {
            if (args['columnDef']['params']['popoverStatusChanged']) {
              statusChanged['columnDef'] = args['columnDef'];
              args['columnDef']['params']['popoverStatusChanged'](statusChanged)
              if (this.dispose) {
                this.dispose();
              }
            }

          })
        } else {
          componentRef.instance['popoverOnSubmit'].subscribe(statusChanged => {
            if (args['columnDef']['params']['workflowSelected']) {
              statusChanged['columnDef'] = args['columnDef'];
              args['columnDef']['params']['workflowSelected'](statusChanged)
              if (this.dispose) {
                this.dispose();
              }
            }
          })
        }
      }
    }else if (actionInfo && actionInfo['actionType'] === "WORK FLOW") {
      Object.assign(componentRef.instance, {
        setDisplayName: actionInfo['displayName'],
        setDisplayType: actionInfo['displayType'],
        setConfigStyle: actionInfo['configStyle'],
        setSelectedRecords: actionInfo['selectedRecords'],
        setParent: actionInfo['parent'],
        setSatusWorkFlowList: actionInfo['statusWorkFlowList'],
        setPreviousStatus: actionInfo['previousStatus'],
        setCallingFrom: actionInfo['callingFrom'],
        setObjectname: actionInfo['objectName'],
        setFieldName: actionInfo['fieldName'],
        setFieldIde: actionInfo['fieldId'],
        setSelectedItems: actionInfo['selectedItems'],
        setLayoutId: actionInfo['layoutId']
      });
    }else if (actionInfo && (actionInfo["actionType"] === "URL" || actionInfo["actionType"] === "ASSOCIATION")) {
      Object.assign(componentRef.instance, {
        dataContext: args["dataContext"],
        columnDef: args["columnDef"],
        info: actionInfo,
      });
    }else if (actionInfo && actionInfo["actionType"] === "MAIL") {
      Object.assign(componentRef.instance, {
        styleData: "3",
        actionConfigJson: actionInfo,
        setElementId: actionInfo['elementId'],
        setViewArea: 'slickgrid',
        LayoutId: actionInfo['layoutId'],
        dataObject: args["dataContext"],
      });
    }else if (actionInfo && actionInfo["type"] === "MORE_ACTION") {
      Object.assign(componentRef.instance, {
        setElementId: 0,
        setMoreActionInfo: actionInfo['moreActionInfo'],
        setLayoutId: actionInfo['layoutId']
      });
      componentRef.instance['moreActionSelected'].subscribe(moreSelected => {

        if (args["columnDef"]['params']['moreActionSelected']) {
          moreSelected['columnDef'] = args["columnDef"];
          moreSelected['dataContext'] = args["dataContext"];
          args["columnDef"]['params']['moreActionSelected'](moreSelected)
          if (this.dispose) {
            this.dispose();
          }
        }
      })
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
  getFieldType(fieldInfo: FieldInfo | "") {
    if (fieldInfo["fieldType"] === "LOOKUP" ||
      fieldInfo["fieldType"] === "MASTERDETAIL" ||
      fieldInfo["fieldType"] === "HEADER") {
      return this.getFieldType(fieldInfo["child"]);
    } else {
      return fieldInfo["fieldType"];
    }
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

    return slickgridRowIdentificationValues;
  }

  dispose() {
    if (this._domElement && this._domElement.remove) {
      this._domElement.remove();
      $(".cs-bgshade").remove();
      $(".cs-popup-arrow-left").remove();
      $(".cs-popup-arrow-right").remove();
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

}