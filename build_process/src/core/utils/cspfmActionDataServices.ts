import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})

export class cspfmActionDataServices {
    public actionData = {};
    public layoutActionJson;
    public dataObj;
    public makeActionData(layoutActionJson, dataObj) {
        this.actionData = {}
        this.layoutActionJson = layoutActionJson;
        this.dataObj = dataObj;

        this.layoutActionJson['LayoutProperties'].forEach(element => {
            this.getActionValueUsingConfigJson(element)

        })
        return this.actionData
    }
    getActionValueUsingConfigJson(actionInfoJson) {
        actionInfoJson['fieldDetails'].forEach(element => {
            this.getFieldValue(element, actionInfoJson['propertyKey'])
        })
    }

    getFieldValue(fieldInfo, propertyKey) {
        if (fieldInfo['inputType'] === 'FIELD') {
            this.getValueByObjectName(fieldInfo, propertyKey)
        }else if (fieldInfo['inputType'] === 'USER') {
            if (this.actionData[propertyKey]) {
                this.actionData[propertyKey] = this.actionData[propertyKey] + "," + fieldInfo['value'];
            }else{
                this.actionData[propertyKey] = fieldInfo['value']
            }
        }else {
            this.actionData[propertyKey] = this.makeFieldAndUserValue(propertyKey, fieldInfo)

        }
    }


    getValueByObjectName(fieldDetails, propertyKey) {
        var objectName;
        if (fieldDetails['objectId'].toString().includes("pfm")) {
            objectName = fieldDetails["objectId"];
        } else {
            objectName = "pfm" + fieldDetails['objectId']
        }
        if (this.dataObj['type'] === objectName) {
            if (this.actionData[propertyKey]) {
                this.actionData[propertyKey] = this.actionData[propertyKey] + "," + this.dataObj[fieldDetails['fieldName']];
            }else {
                this.actionData[propertyKey] = this.dataObj[fieldDetails['fieldName']]

            }

        }else {
            this.actionData[propertyKey] = this.getDependentObjectValue(fieldDetails[fieldDetails['objectId']], this.dataObj, fieldDetails['fieldName'], 0)

        }
    }

    makeFieldAndUserValue(propertyKey, fieldInfo) {
        var value: string = "";
        var array = fieldInfo['value'].split("$$");
        array.forEach(element => {
            if (element.includes(",")) {
                var objectFieldArray = element.split(",");
                if (objectFieldArray.length === 2) {
                    var objId = objectFieldArray[1];
                    if (objId.includes("_")) {
                        var fieldArray = objId.split("_");
                        objId = fieldArray[0] + fieldArray[1];

                    }
                    if (isNaN(objId)) {
                        value = value + element;
                    }else {

                        if (this.dataObj['type'] === "pfm" + objectFieldArray[1]) {
                            value = value + (this.dataObj[objectFieldArray[0]]);
                        }else {
                            value = value + this.getDependentObjectValue(fieldInfo[objectFieldArray[1]], this.dataObj, objectFieldArray[0], 0)
                        }


                    }
                }else {
                    value = value + (element);
                }
            }else {
                value = value + (element);
            }
        })
        return value;
    }

    getDependentObjectValue(hierarchyJsonArray, dataObject, fieldName, position) {
        var pfmObjectName;
        if (hierarchyJsonArray.length === position) {

            if (dataObject.constructor === Object){
                return dataObject[fieldName]
            }else if (dataObject.constructor === Array){
                return dataObject[0][fieldName];
            }else{
                return ''
            }
             
        }

        if (hierarchyJsonArray[position].includes("_")) {
            pfmObjectName = this.formatPfmObject(hierarchyJsonArray[position])
        }else {
            pfmObjectName = this.formatPfmObject(hierarchyJsonArray[position]) + "s"
        }

        if (dataObject.constructor === Object){
            return this.getDependentObjectValue(hierarchyJsonArray, dataObject[pfmObjectName], fieldName, position + 1)
        }else if (dataObject.constructor === Array){
            return this.getDependentObjectValue(hierarchyJsonArray, dataObject[0][pfmObjectName], fieldName, position + 1)
        }else{
            return ''
        }
        
    }
    formatPfmObject(objectId) {
        if (!objectId.includes("pfm")) {
            return "pfm" + objectId;
        }
        return objectId;
    }
}
