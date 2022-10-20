import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef,MAT_DIALOG_DATA } from "@angular/material/dialog";
import { objectTableMapping } from 'src/core/pfmmapping/objectTableMapping';
import { lookupFieldMapping } from 'src/core/pfmmapping/lookupFieldMapping';

@Component({
  selector: "cspfmCloneMappingInfo",
  templateUrl: "./cspfmCloneMappingInfo.html",
  styleUrls: ["./cspfmCloneMappingInfo.scss"],
})
export class cspfmCloneMappingInfo implements OnInit {
  public objectName;
  public fieldName;
  public isLookup: boolean;
  public dataCloningInfo = [];
  public items = [];
  public dripDownAttribute = "#cs-dropdown-dataclone";
  public isDisableManualclose: boolean = false;
  public Same: boolean = false;
  public Different: boolean = false;
  public checkedResult = [];
  public cloneData = [];
  public gridSearchRowToggle: boolean = false;
  constructor(private dialogRef: MatDialogRef<cspfmCloneMappingInfo>,
    @Inject(MAT_DIALOG_DATA) data,
    public lookupMapping: lookupFieldMapping,
    public objectMapping: objectTableMapping) {
    this.objectName = data["objectName"];
    this.isLookup = data["isLookup"];
    this.fieldName = this.isLookup ? this.getKeyByValue(data["fieldName"]) : data["fieldName"];
    this.dataCloningInfo = data["dataCloningInfo"];
    this.makeClonedFieldMappingDetails();
    this.checkedResult = this.cloneData;
    this.defaultOpen();
  }
  closeButtonClick() {
    this.dialogRef.close();
  }

  ngOnInit() {
    const popupsize = <HTMLElement>(
      document.querySelector(".custom-dialog-container")
    );
    popupsize.style.setProperty("--cust_height", "calc(100vh - 25%)");
    popupsize.style.setProperty("--cust_width", "calc(100vw - 62%)");
  }

  makeClonedFieldMappingDetails() {
    let i = 0;
    this.dataCloningInfo.forEach(element => {
      let checkElementAlreadyNotPresent:boolean= this.cloneData.some(e => e.source === element["sourceFieldInfo"]["sourceObjectName"] && e.target === element["destinationFieldInfo"]["destinationObjectName"])
      if (!checkElementAlreadyNotPresent) {
        this.cloneData.push({
          id: i++,
          source: element["sourceFieldInfo"]["sourceObjectName"],
          cloneStatus: element["sourceFieldInfo"]["sourceObjectName"] === element["destinationFieldInfo"]["destinationObjectName"] ? "Same" : "Different",
          target: element["destinationFieldInfo"]["destinationObjectName"],
          style: element["sourceFieldInfo"]["sourceObjectName"] === element["destinationFieldInfo"]["destinationObjectName"] ? "cs-same" : "cs-diff",
          fieldProperties: [
            {
              sourceFieldName: this.getFieldName(element,'source'),
              destinationFieldName: this.getFieldName(element,'destination')
            }
          ]
        })
      } else {
        let index = this.cloneData.findIndex(e => {
          if (e.source === element["sourceFieldInfo"]["sourceObjectName"] && e.target === element["destinationFieldInfo"]["destinationObjectName"]) {
            return true
          }
        })
        this.cloneData[index]["fieldProperties"].push({
          sourceFieldName: this.getFieldName(element,'source'),
          destinationFieldName: this.getFieldName(element,'destination')
        })
      }
    })
  }
  getFieldName(element, type) {
    let fieldType = element['fieldType']
    let inputType = element['inputType']
    let sourceObjectName = element['sourceFieldInfo']['sourceObjectName']
    let sourceFieldName = element['sourceFieldInfo']['sourceFieldName']
    let destinationObjectName = element['destinationFieldInfo']['destinationObjectName']
    let destinationFieldName = element['destinationFieldInfo']['destinationFieldName']
    let lookupMapping = this.lookupMapping.mappingDetail
    let objectId
    let object
    if (inputType === "USER") {
      return type === 'source' ? "Constant" : destinationFieldName
    }else if (fieldType === "LOOKUP" && inputType === "FIELD") {
      if (type === 'source') {
        objectId = this.objectMapping.mappingDetail[sourceObjectName]
        object = lookupMapping[objectId]
        return Object.keys(object).find(key => object[key] === sourceFieldName);
      } else {
        objectId = this.objectMapping.mappingDetail[destinationObjectName]
        object = lookupMapping[objectId]
        return Object.keys(object).find(key => object[key] === destinationFieldName);
      }
    } else {
      return type === 'source' ? sourceFieldName : destinationFieldName
    }
  }
  toggleAccordian(id) {
    let index = this.cloneData.findIndex( x => x.id === id );
    if (this.cloneData[index].isActive) {
      this.cloneData[index].isActive = false;
    } else {
      this.cloneData[index].isActive = true;
    }
  }
  defaultOpen() {
    let clonedObject
     this.cloneData.forEach(element => {
      if (element['target'] === this.objectName) {
        element['fieldProperties'].forEach(e => {
          if (e['destinationFieldName'] === this.fieldName) {
            clonedObject = element
          }
        })
      }
     })
    this.toggleAccordian(clonedObject['id'])
  }
  getKeyByValue(fieldName) {
    let object = this.lookupMapping.mappingDetail[this.objectMapping.mappingDetail[this.objectName]]
    return Object.keys(object).find(key => object[key] === fieldName);
  }
  getStats() {
    if (this.Same === true && this.Different === true) {
      this.checkedResult = this.cloneData;
    } else if (this.Same === true) {
      this.checkedResult = this.cloneData.filter(
        (e) => e.cloneStatus === "Same"
      );
    } else if (this.Different === true) {
      this.checkedResult = this.cloneData.filter(
        (e) => e.cloneStatus === "Different"
      );
    } else {
      this.checkedResult = this.cloneData;
    }
  }
}
