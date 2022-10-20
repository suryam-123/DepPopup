
import { Injectable } from '@angular/core';
import * as lodash from 'lodash';
import { cspfmDataTraversalUtils } from 'src/core/dynapageutils/cspfmDataTraversalUtils';
import { DataFieldTraversal } from 'src/core/models/cspfmDataFieldTraversal.type';
import {appUtility} from 'src/core/utils/appUtility';

@Injectable({
  providedIn: 'root'
})
export class cspfmWebActionService {

  constructor(private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils,public appUtilObj :appUtility) { 
  }
 

  makeMailActionData(layoutActionJson,dataObjectData)
  {
    var dataSet ={}
      if(layoutActionJson['LayoutProperties'].length>0){
        layoutActionJson['LayoutProperties'].forEach(element => {
          var data = this.splitFieldNameAndObjectName(layoutActionJson,dataObjectData,element['inputType'],element['value'],element['inputfields'])
       
            if(element['propertyKey']==='cc' || element['propertyKey']==='bcc' || element['propertyKey']==='to'){
              dataSet[element['propertyKey']] = data.split(/[ ,]+/).join(',')
            } else{
              dataSet[element['propertyKey']] = data
            }
        
        });
      }
     return dataSet;
  }
  
callEmailComposer(actionData) {
    var mailData = 'https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=' + actionData['to'] + '&su=' + actionData['subject'] + '&body='+actionData['body']+'&cc='+actionData['cc']+'&bcc='+actionData['bcc']
    window.open(mailData, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
  }

  callUserDefaultComposer(actionData) {
    var mailData = 'mailto:' + actionData['to'] + '?&subject=' + actionData['subject'] + "&body="+actionData['body']+'&cc='+actionData['cc']+'&bcc='+actionData['bcc']
    window.open(mailData, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
 }
 callOutLookComposer(actionData) {
  var mailData = 'https://outlook.live.com/owa/?path=/mail/action/compose&to=' + actionData['to'] + '&subject=' + actionData['subject'] + '&body='+actionData['body']+'&cc='+actionData['cc']+'&bcc='+actionData['bcc']
  window.open(mailData, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
}
 splitFieldNameAndObjectName(layoutActionJson,dataSet, fieldInputType, field, dataFieldTraversal: DataFieldTraversal) {

  if(!dataSet&&fieldInputType !== "USER") {
    return "";
  }
  if (fieldInputType === "USER") {
   let fieldValue = field.toString().trim().length;
   if(fieldValue === 0){
        return ""
   }
    return field
  } else {
    const fieldValueObject = {}
    Object.keys(dataFieldTraversal['fields']).forEach(fieldKey => {
        if(layoutActionJson['multiSelectListOption']) {
          var valueSet = ''
          dataSet.forEach(el=>{
                    if(valueSet===''){
                      valueSet = this.cspfmDataTraversalUtilsObject.parse(el, dataFieldTraversal, fieldKey, 'display')
                    } else{
                      valueSet = valueSet + " " +this.cspfmDataTraversalUtilsObject.parse(el, dataFieldTraversal, fieldKey, 'display')
                    }
                  
            })
            fieldValueObject['%%' + fieldKey + '%%'] = valueSet;
        } else{
          fieldValueObject['%%' + fieldKey + '%%'] = this.cspfmDataTraversalUtilsObject.parse(dataSet, dataFieldTraversal, fieldKey, 'display');
        }
      
    })
    const fieldKeys = lodash.keysIn(fieldValueObject);
    fieldKeys.forEach(fieldKey => {
      const fieldValue = fieldValueObject[fieldKey]
      field = field.replace(fieldKey, fieldValue);
    });
    let fieldValue = field.toString().trim().length;
    if(fieldValue === 0){
        field = "(no title)"
    }
    return field;
  }
}



}
