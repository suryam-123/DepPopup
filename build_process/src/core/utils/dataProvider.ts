import { objectTableMapping } from './../pfmmapping/objectTableMapping';
import { Injectable } from '@angular/core';
import { dbProvider } from '../db/dbProvider';
import { couchdbProvider } from '../db/couchdbProvider';
import { jsondbProvider } from '../db/jsondbProvider';
import { appConstant } from './appConstant';
import { dbConfiguration } from '../db/dbConfiguration';
import { appUtility } from './appUtility';
import { metaDbConfiguration } from '../db/metaDbConfiguration';
import { metaDataDbProvider } from '../db/metaDataDbProvider';
import { cspfmObjectConfiguration } from '../pfmmapping/cspfmObjectConfiguration';
import * as lodash from 'lodash';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
import { cspfmExecutionCouchDbProvider } from '../db/cspfmExecutionCouchDbProvider';
import { cspfmExecutionPouchDbProvider } from '../db/cspfmExecutionPouchDbProvider';
import { appConfiguration } from './appConfiguration';
import { formulaDbConfiguration } from '../db/formulaDbConfiguration';
import { formulaCouchDbProvider } from '../db/formulaCouchDbProvider';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { cspfmAlertDialog } from '../components/cspfmAlertDialog/cspfmAlertDialog';
import { attachmentCouchDbProvider } from '../db/attachmentCouchDbProvider';
import { attachmentDbProvider } from '../db/attachmentDbProvider';

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line: class-name
export class dataProvider {

  public keysToSchema = {};
  public couchValidation: Boolean = false;
  public hierarchyErrorMessage = 'Coruserhierarchy fetch failed'
  constructor(private pouchDBProvider: dbProvider, private dbConfigObj: dbConfiguration, public dialog: MatDialog, public metaCouchDbProvider: cspfmMetaCouchDbProvider, public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider,
    private couchDBProvider: couchdbProvider, private jsonDataProvider: jsondbProvider, private appUtilityObj: appUtility,
    public metaDbConfig: metaDbConfiguration, public metaDataDbProvider: metaDataDbProvider, public cspfmexecutionCouchDBProvider: cspfmExecutionCouchDbProvider,
    public pfmObjectConfig: cspfmObjectConfiguration, public objectTableMapObject: objectTableMapping, public appConfig: appConfiguration,
    public formulaDbConfig: formulaDbConfiguration, public formulaCouchDbProvider: formulaCouchDbProvider,public attachmentCouchDbProviderObject:attachmentCouchDbProvider,public attachmentDbProvider:attachmentDbProvider) {
    this.setSchema();
  }
  tableStructure() {
    return this.dbConfigObj.configuration.tableStructure;
  }

  // Get plural form of table name
  getPluralName(type) {
    const schema = this.keysToSchema[type];
    return schema.plural;
  }
  setSchema() {
    this.dbConfigObj.configuration.schema.forEach(type => {
      this.keysToSchema[type.singular] = type;
    });
  }

  // Record association Save Bulk Document
  saveBulkAssociationDocument(doc, dataSource) {
    if (this.appConfig.configuration.associationDbConfigInfo['associationConfigDbName'] && this.appConfig.configuration.associationDbConfigInfo['associationConfigDbName'] === this.formulaDbConfig.configuration.databaseName) {
      if (dataSource === appConstant.couchDBStaticName) {
        return this.formulaCouchDbProvider.saveBulkAssociationDocs(doc);
      }
    } else {
      if (dataSource === appConstant.couchDBStaticName) {
        return this.couchDBProvider.saveBulkAssociationDocs(doc);
      }else if (dataSource === appConstant.pouchDBStaticName) {
        // return this.pouchDBProvider.saveBulkDocs(doc);
      } else {
        return this.invalidResponse(appConstant.inValidInput);
      }
    }
  }
  // User Assignment Save Bulk Document
  saveBulkUserAssignmentDocument(doc, dataSource) {
    if (this.appConfig.configuration.userAssignmentDbConfigInfo['userAssignmentConfigDbName'] === this.formulaDbConfig.configuration.databaseName) {
      if (dataSource === appConstant.couchDBStaticName) {
        return this.formulaCouchDbProvider.saveUserAssignmentDocs(doc);
      }
    } else {
      if (dataSource === appConstant.couchDBStaticName) {
        return this.couchDBProvider.saveUserAssignmentDocs(doc);
      }else if (dataSource === appConstant.pouchDBStaticName) {
        // return this.pouchDBProvider.saveBulkDocs(doc);
      } else {
        return this.invalidResponse(appConstant.inValidInput);
      }
    }
  }
  getUserAssignmentData(keys: Array<string>, dataSource) {
    if (dataSource === appConstant.couchDBStaticName) {
      return this.couchDBProvider.fetchUserAssignment('userAssignmentView', keys);
    }else if (dataSource === appConstant.pouchDBStaticName) {
      // return this.couchDBProvider.fetchUserAssignment('associationView', keys);
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }

  // Save Bulk Document
  saveBulkDocument(type, doc, dataSorce) {
    doc.forEach(element => {
      this.replaceEmptyValueToNullAndRemoveCustomKeys(element, type);
    });
    if (dataSorce === appConstant.couchDBStaticName) {
      return this.couchDBProvider.saveBulkDocs(type, doc, [], []);
    }else if (dataSorce === appConstant.pouchDBStaticName) {
      return this.pouchDBProvider.saveBulkDocs(type, doc);
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }

  save(type, doc, dataSorce, previousDoc?, fieldTrackAvailable?) {
    if (!type.endsWith("association")) {
      this.replaceEmptyValueToNullAndRemoveCustomKeys(doc, type);
    }
    if (dataSorce === appConstant.couchDBStaticName) {
      return this.couchDBProvider.save(type, doc);
    } else if (dataSorce === appConstant.pouchDBStaticName) {
      return this.pouchDBProvider.save(type, doc, previousDoc, fieldTrackAvailable);
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }
  saveWebService(isAddEditAction, fetchActionInfo, dataJSON, requiredColumnForUpsert) {
    if (isAddEditAction === "Edit") {
      const resultJSON: any = {}
      const requiredObjectForUpsert = Object.keys(requiredColumnForUpsert)
      requiredObjectForUpsert.forEach(objectId => {
        const objectName = Object.keys(this.objectTableMapObject.mappingDetail).find(key =>
          this.objectTableMapObject.mappingDetail[key] === objectId)
        if (dataJSON[objectName]) {
          const dataObjects = dataJSON[objectName]


          const requiredColumn = requiredColumnForUpsert[objectId]
          const requiredColumnsForUpsert = requiredColumn.map(displayColumnObject => displayColumnObject.fieldName);
          dataObjects.forEach(dataObject => {
            dataObject = lodash.pick(dataObject, requiredColumnsForUpsert)
            requiredColumn.forEach(requiredColumnObject => {
              if (requiredColumnObject["defaultValue"] && requiredColumnObject["defaultValue"] !== "") {
                const fieldName = requiredColumnObject["fieldName"]
                dataObject[fieldName] = requiredColumnObject["defaultValue"]
              }
            })
            if (resultJSON[objectName]) {
              const childObjects = resultJSON[objectName]
              const childObjectValue = lodash.concat(dataObject, childObjects);
              resultJSON[objectName] = childObjectValue
            } else {
              resultJSON[objectName] = [dataObject]
            }
          })
        }
      })
      return this.jsonDataProvider.upsertByProcessInfo(fetchActionInfo, resultJSON)

    } else {
      const resultJSON: any = {}
      const requiredObjectForUpsert = Object.keys(requiredColumnForUpsert)
      requiredObjectForUpsert.forEach(objectId => {
        const objectName = Object.keys(this.objectTableMapObject.mappingDetail).find(key =>
          this.objectTableMapObject.mappingDetail[key] === objectId)
        const dataObjects = dataJSON[objectName]
        const requiredColumn = requiredColumnForUpsert[objectId]
        const resultValue = lodash.filter(requiredColumn, function (fieldObject) {
          return fieldObject["fieldType"] === "autonumber";
        });
        let autoNumField = ""
        if (resultValue.length > 0) {
          autoNumField = resultValue[0]["fieldName"]
        }
        dataObjects.forEach(dataObject => {
          if (autoNumField !== "") {
            if (dataObject[autoNumField]) {

            } else {
              dataObject[autoNumField] = ""
            }
          }
          const requiredColumnsForUpsert = requiredColumn.map(displayColumnObject => displayColumnObject.fieldName);
          dataObject = lodash.pick(dataObject, requiredColumnsForUpsert)
          if (resultJSON[objectName]) {
            const childObjects = resultJSON[objectName]
            const childObjectValue = lodash.concat(dataObject, childObjects);
            resultJSON[objectName] = childObjectValue
          } else {
            resultJSON[objectName] = [dataObject]
          }
        })
      })
      return this.jsonDataProvider.upsertByProcessInfo(fetchActionInfo, resultJSON)
    }
  }

  saveWithCouchValidation(isAddEditAction, dataSource, type, dataObject, previousDataObject){
    this.couchValidation = true;
    dataObject['couchValidation'] = this.couchValidation 
    

    if (dataSource === appConstant.couchDBStaticName) {
      return this.couchDBProvider.save(type, dataObject);
    } else if (dataSource === appConstant.pouchDBStaticName) {
      return this.pouchDBProvider.save(type, dataObject, previousDataObject);
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
    // return this.saveActionBasedonProvider(dataSource, type, dataObject, previousDataObject)
  }

  checkCompositeFields(objectName, getData) {
    if (getData != undefined) {
      let compositeObjectInfo = this.getCompositeObjectValidationArray(objectName);
      console.log('compositeObjectInfo', compositeObjectInfo);
      let childObjSet = getData[objectName]
      console.log("childObjSet", childObjSet);
      childObjSet.forEach(allRecords => {
        //  allRecords['failureReason'] = { 'validationFailureSet': [] };
        // allRecords['failureType'] = '';
        allRecords['isFailure'] = false;
        allRecords['internalComposite'] = [];
      })
      let compositeFieldName = '';
      let compositeFailureRecords = [];
      compositeObjectInfo.forEach(compositeGroup => {
        let compositeGroupName = compositeGroup['compositeName']
        let childObjRecord = getData[objectName]
        compositeGroup['compositeFields'].forEach(field => {
          compositeFieldName = field['fieldName']
          field['faildReasons'] = [];
          let failuremessage = {}
          failuremessage['failureType'] = 'internalUniqueValidationFailure';
          failuremessage['message'] = "This field involved in " + compositeGroupName;
          field['faildReasons'].push(failuremessage)
          let unique = lodash.groupBy(childObjRecord, compositeFieldName);
          console.log('unique', unique);
          childObjRecord = [];
          let records = Object.keys(unique);
          records.forEach(value => {
            if (value != 'null' && unique[value].length > 1) {
              let record = unique[value].flat()
              childObjRecord = childObjRecord.concat(record);
              let obj = {};
              obj[compositeFieldName] = unique[value]
              compositeFailureRecords.push(unique[value])
            }
          })

        })

        // childRecord['faildReasons'].push(failuremessage)
        childObjRecord.forEach(errorRecords => {
          errorRecords['isFailure'] = true;
          errorRecords['failureType'] = 'internalCompositeValidationFailure';
          errorRecords.internalComposite = errorRecords.internalComposite.concat(compositeGroup['compositeFields']);
          // errorRecords.failureReason.validationFailureSet.push(childRecord)
        })
      })
    }
  }

  checkUniqueFields(objectName, getData) {
    let checkUniqueRecords = false;
    if (getData != undefined) {
      let uniqueObjectInfo = this.getObjectUniqueValidatorArray(objectName);
      console.log("uniqueObjectInfo", uniqueObjectInfo);
      let childObjSet = getData[objectName]
      console.log("childObjSet", childObjSet);
      childObjSet.forEach(allRecords => {
        //  allRecords['failureReason'] = { 'validationFailureSet': [] };
        allRecords['failureType'] = '';
        allRecords['isFailure'] = false;
        allRecords['internalUnique'] = [];
      })
      let uniqueFailureRecords = [];
      let uniqueFieldName = '';
      uniqueObjectInfo.forEach(childRecord => {
        if (childRecord['fieldType'] == 'LOOKUP') {
          uniqueFieldName = childRecord['fieldName'] + "['id']"
          childRecord['faildReasons'] = []
          let failuremessage = {}
          failuremessage['failureType'] = 'internalUniqueValidationFailure';
          failuremessage['message'] = childRecord['displayName'] + " already exists!";
          childRecord['faildReasons'].push(failuremessage)
          console.log('uniqueFieldName', uniqueFieldName)
        } else {
          uniqueFieldName = childRecord['fieldName']
          childRecord['faildReasons'] = []
          let failuremessage = {}
          failuremessage['failureType'] = 'internalUniqueValidationFailure';
          failuremessage['message'] = childRecord['displayName'] + " already exists!";
          childRecord['faildReasons'].push(failuremessage)
        }

        let childObjSet = getData[objectName]
        let unique = lodash.groupBy(childObjSet, uniqueFieldName);
        console.log('unique', unique);
        let records = Object.keys(unique);
        records.forEach(value => {
          if (value != 'null' && unique[value].length > 1) {
            let obj = {};
            obj[uniqueFieldName] = unique[value]
            uniqueFailureRecords.push(unique[value])
            unique[value].forEach(errorRecords => {
              checkUniqueRecords = true;
              //  errorRecords['isFailure'] = true;
              errorRecords['failureType'] = 'internalUniqueValidationFailure';
              errorRecords.internalUnique.push(childRecord);
              //  errorRecords.failureReason.validationFailureSet.push(childRecord)
            })
          }
        })
        console.log("Child Data", childObjSet);
      })
      //  this.updateChild(objectName)
      return checkUniqueRecords
    } else {
      return checkUniqueRecords = false;
    }
  }


  uniqueValidation(isAddEditAction, dataSource, type, dataObject, previousDataObject, uniqueObjectInfo, getData) {     
      if (uniqueObjectInfo.length > 0) {
        return this.validateUniqueField(type, dataObject, dataSource,
          uniqueObjectInfo, isAddEditAction).then(result => {
            if (result['records'].length === 0) {
              console.log(result)
              return { "status": "SUCCESS" }
              // return this.saveActionBasedonProvider(dataSource, type, dataObject, previousDataObject)
            } else {
            const validatedFields = this.getUniqueValidationField(result['records'], uniqueObjectInfo)
              validatedFields['objectType'] = type;
              return this.invalidResponse(validatedFields['displaymessages'] + " already exists!", validatedFields['ValidationFailure'], validatedFields['uniqueValidationFailure'], validatedFields['objectType']);
            }
          })
      }
    
  }

  async compositeValidation(isAddEditAction, dataSource, type, dataObject, previousDataObject, compositeObjectInfo){
      if (compositeObjectInfo.length > 0 ) {
        const result = await this.couchDBProvider.compositeKeyValidation(type, dataObject, compositeObjectInfo, isAddEditAction)
      
            if (result.length != 0) {
            const validatedFields = this.getValidatedCompositeFieldsGroping(result, compositeObjectInfo)
              validatedFields['objectType'] = type;
              return this.invalidResponse(validatedFields['displaymessages'] + " already exists!", validatedFields['validationFailure'],  validatedFields['compositeValidationFailure'], validatedFields['objectType']);
            }
            else{
              return {"status":"SUCCESS"}
            }
          
      }else{
        return {"status":"SUCCESS"}
      }
    }


    async checkValidation(isAddEditAction, dataSource, type, dataObject, previousDataObject, consolidateErrorData, saveButtonClicked, conditionalValidationError, getData?) {
    let status = {};
    let checkValidationstatus = false;
    let conditionalValidation = [];
    let conditionalValidationErrormessage = [];
    let validationFailureJson = {}
    if(dataObject['conditional_validation']){
      conditionalValidation = dataObject['conditional_validation']['Error'];

      conditionalValidation.forEach(result => {
        let primaryField = result['fieldName'];
        let obejctFieldName = result['primaryFieldName'];
        let validationMessage = result['validationMessage'];
        let validationObj = {}
        validationObj['message'] = validationMessage;
        result['involvedFields'].forEach(fieldSet => {
            if (fieldSet['fieldName'] == obejctFieldName){
                fieldSet['faildReasons'] = [];
                fieldSet['faildReasons'].push(validationObj)
                conditionalValidationErrormessage.push(fieldSet);                                         
                
            }
        })
        
        validationFailureJson['messageType'] = 'multilineError';
        validationFailureJson['validationFailureSet'] = conditionalValidationErrormessage;
    }) 
    }   
    const compositeObjectInfo = this.getCompositeObjectValidationArray(type);
    await this.compositeValidation(isAddEditAction, dataSource, type, dataObject, previousDataObject, compositeObjectInfo).then(async (result) => {

      if (result['status'] != 'SUCCESS') {
        console.log("composite validation failure:", result)
        saveButtonClicked = false;
        checkValidationstatus = true;
        let compositeError = {}
        compositeError['objectId'] = result['objectId'];
        compositeError['failureField']= result['validationFailureSet'];
        status['compositeError'] = compositeError;
        // this.showConsolidatePopupForValidationFailure(result, consolidateErrorData, saveButtonClicked)            
        //  return status
      } else { 
        let compositeError = {}
        status['compositeError'] = compositeError;
      }
    })
    const uniqueObjectInfo = this.getObjectUniqueValidatorArray(type);
    await this.uniqueValidation(isAddEditAction, dataSource, type, dataObject, previousDataObject, uniqueObjectInfo, getData).then(async (result) => {

      if (result['status'] != 'SUCCESS') {
        console.log("unique validation failure:", result)
        saveButtonClicked = false;
        checkValidationstatus = true;
        let uniqueError = {}
        //  uniqueError['message'] = result['message'];
        uniqueError['objectId'] = result['objectId'];
        //  uniqueError['validationFailure'] = result['validationFailure'];
        //  uniqueError['validationFailureSet']= result['validationFailureSet'];
        uniqueError['failureField']= result['validationFailureSet'];
        status['uniqueError'] = uniqueError;
        // this.showConsolidatePopupForValidationFailure(result, consolidateErrorData, saveButtonClicked)            
        //  return status
      } else { 
        let uniqueError = {}
        status['uniqueError'] = uniqueError;
      }
    })
    await this.saveWithCouchValidation(isAddEditAction, dataSource, type, dataObject, previousDataObject).then(async (result) => {
      console.log("couch validation:", result)

      if (result['message'] != 'SUCCESS') {
        console.log("couch validation failure:", result)
        saveButtonClicked = false;
        checkValidationstatus = true;
        let couchError = {}
        //  couchError['message'] = result['message'];
        couchError['objectId'] = result['objectId'];
        //  couchError['validationFailure'] = result['validationFailure'];
        //  couchError['validationFailureSet']= result['validationFailureSet'];
        couchError['failureField']= result['validationFailureSet'];
        status['couchError'] = couchError;
        // this.showConsolidatePopupForValidationFailure(result, consolidateErrorData, saveButtonClicked) 
        //  return status
      } else {
        let couchError = {}
        status['couchError'] = couchError;
        //  console.log("validation SUCCESS")
        //  status = { "status": "SUCCESS" }
      }
    })

    if (getData != undefined && dataObject['internalComposite'].length > 0){
      checkValidationstatus = true;
      let internalCompositeError = {}
      internalCompositeError['objectId'] = type;
      internalCompositeError['failureField']= dataObject['internalComposite'];
      status['internalCompositeError'] = internalCompositeError;
    }else{
      let internalCompositeError = {}
      status['internalCompositeError'] = internalCompositeError;
    }
    
    if (getData != undefined && dataObject['internalUnique'].length > 0) {
      checkValidationstatus = true;
      let internalUniqueError = {}
      internalUniqueError['objectId'] = type;
      internalUniqueError['failureField'] = dataObject['internalUnique'];
      status['internalUniqueError'] = internalUniqueError;
    //  })

    }else{
    let internalUniqueError = {}
      status['internalUniqueError'] = internalUniqueError;
    }

      if (status['internalUniqueError']) {
        this.uniqueAndInternalUnique(status)
      }

      if (checkValidationstatus) {
        status['status'] = appConstant.failed;
        let failureField = this.failureFieldGroupBy(status, conditionalValidationError)
        let conditionalValidationFlag = false;
        let consoilidatedError = [];
        if (validationFailureJson['validationFailureSet']) {
          let failedFieldset = [];
          let fieldsGroup: any;
          let objectId = "";
          if (failureField) {
            failedFieldset.push(failureField)
          }
          failedFieldset.push(validationFailureJson['validationFailureSet'])
          conditionalValidationFlag = true;
          fieldsGroup = failedFieldset;
          let fields = fieldsGroup.flat();
          let unique = lodash.groupBy(fields, 'fieldName');
          let key = Object.keys(unique)
          console.log("value", key);
          let fieldFailureSet = []
          key.forEach(element => {
            if (unique[element].length > 1) {
              let set = []
              unique[element].forEach(record => {
                set.push(record['faildReasons'])
              })
              let faildReasons: any
              faildReasons = set
              let Reasons = faildReasons.flat()
              let consolidateField = unique[element][0]['faildReasons'] = Reasons;
              console.log('consolidateField', consolidateField);
              let fieldDetail = unique[element][0];
              fieldDetail['objectId'] = objectId;
              fieldFailureSet.push(fieldDetail)
            } else {
              // let field = [];
              // field.push(unique[element])
              let fieldDetail = unique[element]
              // fieldDetail['objectId'] = objectId;
              fieldDetail[0]['objectId'] = objectId;
              fieldFailureSet.push(fieldDetail)
            }
          })
          let groupingFields: any;
          groupingFields = fieldFailureSet
          let fieldSet = groupingFields.flat()
          console.log('fieldSet', fieldSet);
          consoilidatedError = fieldSet;
          // return fieldSet;

        }
        if (conditionalValidationFlag) {
          status['failureField'] = consoilidatedError;
          return status;
        } else {
          status['failureField'] = failureField;
          return status;
        }
        //  status['failureField'] = failureField;
        // return status;
      }
    if (validationFailureJson['validationFailureSet']){
    status['failureField'] = validationFailureJson['validationFailureSet'];
    return status;
    }
    else{
      status['status'] = 'SUCCESS'
      return status
    }
  }
  uniqueAndInternalUnique(status) {
    let failedFields = [];
    let uniqueAndInternalUniqueError = {};
    uniqueAndInternalUniqueError['failureField'] = []
    let fieldsGroup: any;
    if (status['uniqueError']['failureField']) {
      failedFields.push(status['uniqueError']['failureField'])
      uniqueAndInternalUniqueError['objectId'] = status['uniqueError']['objectId']
    }
    if (status['internalUniqueError']['failureField']) {
      failedFields.push(status['internalUniqueError']['failureField'])
      uniqueAndInternalUniqueError['objectId'] = status['internalUniqueError']['objectId']
    }
    fieldsGroup = failedFields;
    let fields = fieldsGroup.flat();
    let unique = lodash.groupBy(fields, 'fieldName');
    console.log("unique", unique)
    let key = Object.keys(unique)
    console.log("value", key);
    key.forEach(element => {      
      uniqueAndInternalUniqueError['failureField'].push(unique[element][0])       
    })     
    status['uniqueAndInternalUniqueError'] = uniqueAndInternalUniqueError;
  }
  failureFieldGroupBy(status, conditionalValidationError){
    let failedFields = [];
    let fieldsGroup : any;
    let objectId = "";    
    if (status['compositeError']['failureField']){
      failedFields.push(status['compositeError']['failureField'])
      objectId = status['compositeError']['objectId']
    }
    if (status['couchError']['failureField']){
      failedFields.push(status['couchError']['failureField'])
      objectId = status['couchError']['objectId']
    }
    if (status['uniqueAndInternalUniqueError']['failureField']) {
      failedFields.push(status['uniqueAndInternalUniqueError']['failureField'])
      objectId = status['uniqueAndInternalUniqueError']['objectId']
    }
    if (status['internalCompositeError']['failureField']){
      failedFields.push(status['internalCompositeError']['failureField'])
      objectId = status['internalCompositeError']['objectId']
    }
    fieldsGroup = failedFields;
    let fields = fieldsGroup.flat();    
    let unique = lodash.groupBy(fields, 'fieldName');
    let key = Object.keys(unique)
    console.log("value", key);
    let fieldFailureSet = []
    key.forEach(element => {
      if (unique[element].length > 1){
        let set = []
        unique[element].forEach(record => {
          set.push(record['faildReasons']) 
        })
        let faildReasons : any
        faildReasons = set
        let Reasons = faildReasons.flat()        
        let consolidateField = unique[element][0]['faildReasons'] = Reasons;
        console.log('consolidateField', consolidateField);
        let fieldDetail = unique[element][0];        
        fieldDetail['objectId'] = objectId;
        fieldFailureSet.push(fieldDetail)
      }else{
        // let field = [];
        // field.push(unique[element])
        let fieldDetail = unique[element]
        // fieldDetail['objectId'] = objectId;
        fieldDetail[0]['objectId'] = objectId;
        fieldFailureSet.push(fieldDetail)
      }
    })
    let groupingFields: any;
    groupingFields = fieldFailureSet
    let fieldSet = groupingFields.flat()
    console.log('fieldSet', fieldSet);
    return fieldSet;
  }
  async saveWithValidation(isAddEditAction, dataSource, type, dataObject, previousDataObject) {
    const masterFieldUniqueObjectInfo = this.getMasterObjectInfo(type);


    // PouchDB Master Field Unique Validation
    if (dataSource !== appConstant.couchDBStaticName) {
      if (masterFieldUniqueObjectInfo === "") {
        return this.saveActionBasedonProvider(dataSource, type, dataObject, previousDataObject)
      } else {
        return this.validateUniqueMasterId(isAddEditAction, dataSource, type, dataObject, masterFieldUniqueObjectInfo).
          then(result => {
            if (result.length === 0) {
              return this.saveActionBasedonProvider(dataSource, type, dataObject, previousDataObject)
            } else {
              return this.invalidResponse(
                "One to One Relationship : Already this parent have child record.Pick some other parent to proceed.");
            }
          })
      }
    }

    const compositeObjectInfo = this.getCompositeObjectValidationArray(type);
    
    if (compositeObjectInfo.length > 0 ) {
      const result = await this.couchDBProvider.compositeKeyValidation(type, dataObject, compositeObjectInfo, isAddEditAction)
     
          if (result.length !== 0) {
            const validatedFields = this.getValidatedCompositeFields(result)
            validatedFields['objectType'] = type;
            return this.invalidResponse(validatedFields['displaymessages'] + " already exists!", validatedFields['validationFailure'],  validatedFields['compositeValidationFailure'], validatedFields['objectType']);
          }
        
    }



    const uniqueObjectInfo = this.getObjectUniqueValidatorArray(type);

    // will get the array if the unique validator and unique master id exist
    if (uniqueObjectInfo.length <= 0 && masterFieldUniqueObjectInfo === "") {
      return this.saveActionBasedonProvider(dataSource, type, dataObject, previousDataObject)
    }

    // Master Field Validation
    if (masterFieldUniqueObjectInfo !== "") {
      return this.validateUniqueMasterId(isAddEditAction, dataSource, type, dataObject, masterFieldUniqueObjectInfo).then(result => {
        if (result.length === 0) {
          if (uniqueObjectInfo.length > 0) {
            return this.validateUniqueField(type, dataObject, dataSource,
              uniqueObjectInfo, isAddEditAction).then(result => {
                if (result['status'] === 'SUCCESS' && result['records'].length === 0) {
                  return this.saveActionBasedonProvider(dataSource, type, dataObject, previousDataObject)
                } else if(result['status'] === 'FAILED'){
                  return this.invalidResponse(result['message']+'!');
                }else {
                  const validatedFields = this.getValidationField(result['records'], uniqueObjectInfo)
                  validatedFields['objectType'] = type;
                  return this.invalidResponse(validatedFields['displaymessages'] + " already exists!", validatedFields['ValidationFailure'], validatedFields['uniqueValidationFailure'], validatedFields['objectType']);
                }
              })
          }
          return this.saveActionBasedonProvider(dataSource, type, dataObject, previousDataObject)
        } else {
          return this.invalidResponse(
            "One to One Relationship : Already this parent have child record.Pick some other parent to proceed.");
        }
      })
    }

    //  Unique Field Validation
    if (uniqueObjectInfo.length > 0) {
      return this.validateUniqueField(type, dataObject, dataSource,
        uniqueObjectInfo, isAddEditAction).then(result => {
          if (result['status'] === 'SUCCESS' && result['records'].length === 0) {
            return this.saveActionBasedonProvider(dataSource, type, dataObject, previousDataObject)
          } else if(result['status'] === 'FAILED'){
            return this.invalidResponse(result['message']+'!');
          }else {
            const validatedFields = this.getValidationField(result['records'], uniqueObjectInfo)
            validatedFields['objectType'] = type;
            return this.invalidResponse(validatedFields['displaymessages'] + " already exists!", validatedFields['ValidationFailure'], validatedFields['uniqueValidationFailure'], validatedFields['objectType']);
          }
        })
    }
    return this.saveActionBasedonProvider(dataSource, type, dataObject, previousDataObject)


  }

  showConsolidatePopupForValidationFailure(result, consolidateErrorData, saveButtonClicked){    
    let  tempValidationFailureJson = {};   
    if (result["validationFailure"] === "uniqueValidationFailure" ){
        saveButtonClicked = false;
        consolidateErrorData["saveButtonClicked"] = saveButtonClicked; 
        consolidateErrorData["showConsolidatePopup"] = true;
        tempValidationFailureJson["objectId"] = result["objectId"];
        tempValidationFailureJson["validationFailureSet"] = result["validationFailureSet"]
        tempValidationFailureJson["messageType"] = "UniqueError"
        consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
        return Promise.resolve(consolidateErrorData);
        }else if(result["validationFailure"] === "compositeValidationFailure"){
        saveButtonClicked = false;       
        consolidateErrorData["saveButtonClicked"] = saveButtonClicked;        
        consolidateErrorData["showConsolidatePopup"] = true;
        tempValidationFailureJson["objectId"] = result["objectId"];
        tempValidationFailureJson["validationFailureSet"] = result["validationFailureSet"]
        tempValidationFailureJson["messageType"] = "CompositeError"
        consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
        return Promise.resolve(consolidateErrorData) ;            
        }else if(result["validationFailure"] === "couchdbValidationFailure"){
        saveButtonClicked = false;       
        consolidateErrorData["saveButtonClicked"] = saveButtonClicked;        
        consolidateErrorData["showConsolidatePopup"] = true;
        tempValidationFailureJson["objectId"] = result["objectId"];
        tempValidationFailureJson["validationFailureSet"] = result["validationFailureSet"]
        tempValidationFailureJson["messageType"] = "CouchdbError"
        consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
        return Promise.resolve(consolidateErrorData) ;            
        }else{
        saveButtonClicked = false;
        this.showInfoAlert(result["message"]);        
        consolidateErrorData["showConsolidatePopup"]  = false;
        return Promise.resolve(consolidateErrorData);
        }
}

async showInfoAlert(info) {
  const dialogConfig = new MatDialogConfig()

  dialogConfig.data = {
      title: info,
      buttonInfo: [{
          "name": "OK"
      }],
      parentContext: this,
      type: "Alert"
  };
  dialogConfig.autoFocus = false
  this.dialog.open(cspfmAlertDialog, dialogConfig);
}


  getValidatedCompositeFields(validationResult) {
    let validatedFields = ""
    let validationFailerFieldSet = [];
    let result = {}
    validationResult.forEach(singleSet => {
      validationFailerFieldSet.push(singleSet)
      singleSet['fieldName'].forEach(field => {
        validatedFields = field['fieldDisplayName'] + ',' + ' ' + validatedFields
      });
      
    });
    result['displaymessages'] = validatedFields;
    result['compositeValidationFailure'] = "compositeValidationFailure"
    result['validationFailure'] = validationFailerFieldSet;
    return result;
  }

  getCompositeObjectValidationArray(type){
    const objectConfigData = this.pfmObjectConfig['objectConfiguration'];
    const objectConfigInfo = objectConfigData[type];
    if (objectConfigInfo instanceof Object) {
      if (objectConfigInfo['compositeValidation'] instanceof Array) {
        return objectConfigInfo['compositeValidation'];
      }
      return [];
    }
    return [];
  }
  saveActionBasedonProvider(dataSorce, type, doc, previousDoc) {
    this.replaceEmptyValueToNullAndRemoveCustomKeys(doc, type);
    if (dataSorce === appConstant.couchDBStaticName) {
      return this.couchDBProvider.save(type, doc);
    } else if (dataSorce === appConstant.pouchDBStaticName) {
      return this.pouchDBProvider.save(type, doc, previousDoc);
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }
  validateUniqueField(type, doc, dataSorce, uniqueField, action) {
    if (dataSorce === appConstant.couchDBStaticName) {
      return this.couchDBProvider.vaidateUniqueField(type, doc, uniqueField, action);
    }
  }
  validateUniqueMasterId(isAddEditAction, dataSource, type, dataObject, uniqueId) {
    if (dataSource === appConstant.couchDBStaticName) {
      return this.couchDBProvider.validateUniqueMasterId(isAddEditAction, type, dataObject, uniqueId);
    } else if (dataSource === appConstant.pouchDBStaticName) {
      return this.couchDBProvider.validateUniqueMasterId(isAddEditAction, type, dataObject, uniqueId);
    }
  }

  getValidatedCompositeFieldsGroping(validationResult, compositeObjectInfo){
    let validatedFields = ""
    let validationFailerFieldSet = [];
    let result = {}
    validationResult.forEach(singleSet => {
      let compositeGroupname = singleSet['compositeName']
      // validationFailerFieldSet.push(singleSet)
      singleSet['fieldName'].forEach(field => {
        let failuremessage = {}
            failuremessage['failureType'] = 'compositeValidationFailure'
            failuremessage['message'] = "This field involved in " + compositeGroupname;
        field.faildReasons = []
        field.faildReasons.push(failuremessage)        
        validatedFields = field['fieldDisplayName'] + ',' + ' ' + validatedFields
        validationFailerFieldSet.push(field)
      });      
    });
    result['displaymessages'] = validatedFields;
    result['compositeValidationFailure'] = "compositeValidationFailure"
    result['validationFailure'] = validationFailerFieldSet;
    return result;
  }

  getUniqueValidationField(validationResult, uniqueObjectInfo) {
    let validatedFields = ""
    let validationFailerFieldSet = [];
    let result = {}
    validationResult.forEach(element => {
      uniqueObjectInfo.forEach(uniqueObjectInfoElement => {
        if (element !== "" && uniqueObjectInfoElement !== "") {
          if (element['fieldName'] === uniqueObjectInfoElement['fieldName']) {
            let failuremessage = {}
            failuremessage['failureType'] = 'uniqueValidationFailure'
            failuremessage['message'] = uniqueObjectInfoElement['displayName'] + " already exists!"
            uniqueObjectInfoElement.faildReasons = []
            uniqueObjectInfoElement.faildReasons.push(failuremessage)
            validationFailerFieldSet.push(uniqueObjectInfoElement)
            if (validatedFields === "") {
              validatedFields = uniqueObjectInfoElement['displayName']
            } else {
              validatedFields = validatedFields + ',' + ' ' + uniqueObjectInfoElement['displayName']
            }
          }
        }
      });
    });
    result['displaymessages'] = validatedFields;
    result['uniqueValidationFailure'] = "uniqueValidationFailure"
    result['ValidationFailure'] = validationFailerFieldSet;
    return result;
  }

  getValidationField(validationResult, uniqueObjectInfo) {
    let validatedFields = ""
    let validationFailerFieldSet = [];
    let result = {}
    validationResult.forEach(element => {
      uniqueObjectInfo.forEach(uniqueObjectInfoElement => {
        if (element !== "" && uniqueObjectInfoElement !== "") {
          if (element['fieldName'] === uniqueObjectInfoElement['fieldName']) {
            validationFailerFieldSet.push(uniqueObjectInfoElement)
            if (validatedFields === "") {
              validatedFields = uniqueObjectInfoElement['displayName']
            } else {
              validatedFields = validatedFields + ',' + ' ' + uniqueObjectInfoElement['displayName']
            }
          }
        }
      });
    });
    result['displaymessages'] = validatedFields;
    result['uniqueValidationFailure'] = "uniqueValidationFailure"
    result['ValidationFailure'] = validationFailerFieldSet;
    return result;
  }

  getObjectUniqueValidatorArray(type) {
    const objectConfigData = this.pfmObjectConfig['objectConfiguration'];
    const objectConfigInfo = objectConfigData[type];
    if (objectConfigInfo instanceof Object) {
      if (objectConfigInfo['uniqueValidation'] instanceof Array) {
        return objectConfigInfo['uniqueValidation'];
      }
      return [];
    }
    return [];
  }

  getMasterObjectInfo(type) {
    const objectConfigData = this.pfmObjectConfig['objectConfiguration'];
    const objectConfigInfo = objectConfigData[type];
    if (objectConfigInfo instanceof Object) {
      if (objectConfigInfo['masterDetailObject']) {
        return objectConfigInfo['masterDetailObject']
      }
      return ""
    }
    return ""
  }

  replaceEmptyValueToNullAndRemoveCustomKeys(dataObject,type) {
    const tableStruct = this.tableStructure()
    const objTableStruct = tableStruct[type]
    Object.keys(dataObject).forEach(key => {
      if (key.includes(appConstant['customFieldSuffix']['formula']) ||
        key.includes(appConstant['customFieldSuffix']['slickgrid']) ||
        key.includes(appConstant['customFieldSuffix']['rollup_summary']) ||
        key.includes(appConstant['customFieldSuffix']['developer_template'])) {
        delete dataObject[key]
      } else if (dataObject[key] === '') {
        dataObject[key] = null;
      } else if (dataObject[key] && Array.isArray(dataObject[key]) && dataObject[key].length === 0) {
        dataObject[key] = null;
      }
      if (!(key in objTableStruct) && key !== 'id' && key !== 'org_id'
      && key !== 'rev' && key !== 'type' && key !== 'sync_flag' && key !== 'systemAttributes' && key !== 'sys_attributes'){
        delete dataObject[key]
      }
    })
  }

  startLazyLoading(listenerName) {
    let lazyData = [];
    for (let i = 0; i < 10; i++) {
      lazyData.push({
        id: i,
      });
    }
    this.couchDBProvider.emitFetchedData(true, listenerName, lazyData, 'started');
  }
  finishLazyLoading(listenerName, lazyLoadingData: Array<any>) {
    this.couchDBProvider.emitFetchedData(true, listenerName, lazyLoadingData || [], 'finished');
  }

  fetchDataFromDataSource(dataFetchingInput, methodCalledBy?: 'filter' | 'listener', batchQuery?) {
    // tslint:disable-next-line: no-shadowed-variable
    if (dataFetchingInput['objectHierarchyJSON'] && dataFetchingInput['batchIds']) {
      return this.couchDBProvider.queryBulkDoc(dataFetchingInput['objectHierarchyJSON'], dataFetchingInput['batchIds']).then(result => {
        return result;
      });
    } else if (dataFetchingInput['layoutDataRestrictionSet'] !== undefined && dataFetchingInput['layoutDataRestrictionSet'].length > 0) {
      let layoutDataRestrictionSet = dataFetchingInput['layoutDataRestrictionSet']
      if (layoutDataRestrictionSet.length === 1 && layoutDataRestrictionSet[0]['restrictionType'].toLowerCase() === 'owner') {
        layoutDataRestrictionSet[0]['restrictedDataUserIds'] = [this.appUtilityObj.userId]
        return this.fetchDbSelection(dataFetchingInput, methodCalledBy, batchQuery)
      } else {
        return this.fetchUserHierarchy(dataFetchingInput, layoutDataRestrictionSet, methodCalledBy, batchQuery)
      }
    } else {
      return this.fetchDbSelection(dataFetchingInput, methodCalledBy, batchQuery);
    }
  }

  fetchUserAssingment(objectid, layoutDataRestrictionSet, methodCalledBy?, searchQuery?) {     
    return this.fetchUserId(objectid, layoutDataRestrictionSet).then((useridkeys) => {
      return this.getUserAssignmentData(useridkeys, "CouchDB").then((result) => {
        var refrenceids = [];
        result.records.forEach(element => {
          if (element.doc.data.reference_id) {
            refrenceids.push(objectid + '_' + 2 + '_' + element.doc.data.reference_id);
          }
        });
        refrenceids = lodash.uniq(refrenceids);
        if (refrenceids.length === 0) {
          return refrenceids;
        }
        if (methodCalledBy === 'list') {
          return refrenceids;
        } else if (methodCalledBy === 'HL_list') {
          const fetchParams = { "searchListQuery": searchQuery, "objectName": objectid };
          refrenceids = lodash.chunk(refrenceids, this.couchDBProvider.batchIdLimit)
          return this.primaryObjDataFetch(fetchParams, refrenceids);
        }
      })
    });
  }

  primaryObjDataFetch(fetchParams, batchWiseIdArray?) {
    let taskList = [];
    const queryFlags = { include_docs: false, include_fields: [] };
    const designDocName = fetchParams['objectName'] + '_search';
    const searchListQuery = fetchParams['searchListQuery'];
    if (batchWiseIdArray && batchWiseIdArray.length > 0) {
      batchWiseIdArray.forEach(idArray => {
        if (Array.isArray(idArray)) {
          const batchIdQuery = searchListQuery + " AND _id : ( " + idArray.join(" OR ") + " ) "
          taskList.push(this.couchDBProvider.callSearchDesignDocsForFilter(batchIdQuery, designDocName, "", queryFlags))
        }
      });
    } else {
      const batchIdQuery = searchListQuery;
      taskList.push(this.couchDBProvider.callSearchDesignDocsForFilter(batchIdQuery, designDocName, "", queryFlags))
    }

    return Promise.all(taskList).then(res => {
    let returnBatchIdArray = [];
      res.forEach(item => {
        if (item && item['rows'] && item['rows'].length > 0) {
          item['rows'].forEach(idItem => {
            returnBatchIdArray.push(idItem['id']);
          });
        }
      });
      return returnBatchIdArray
    }).catch(error => {
      return error;
    });
  }


  fetchUserId(objectid, layoutDataRestrictionSet) {
    let useridkeys = [];
    let awaitFun = [];
    const type = layoutDataRestrictionSet[0]['restrictionType'];
    const userAssignTypes = ["user", "role", "groups", "responsibilities"]
    if (userAssignTypes.includes("user")) {
      useridkeys.push(objectid + type + '|User|' + this.appUtilityObj.userId);
    }
    if (userAssignTypes.includes("role")) {
      useridkeys.push(objectid + type + '|Role|' + this.appUtilityObj.roleId);
    }
    if (userAssignTypes.includes("groups") || userAssignTypes.includes("responsibilities")) {
      var query = "type:" + this.metaDbConfig.corUserHierarchy + " AND " + "user_id:" + Number(this.appUtilityObj.userId)
      awaitFun.push(this.metaDataDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corUserHierarchy).then(res => {
        
        if (userAssignTypes.includes("groups")) {
          let groupids = res["records"][0]["userGroupsId"];
          groupids.forEach(element => {
            useridkeys.push(objectid + type + '|Group|' + element);
          });
        }
        if (userAssignTypes.includes("responsibilities")) {
          let userResponsibilitiesId = res["records"][0]["ResponsibilitiesId"];
          userResponsibilitiesId.forEach(element => {
            useridkeys.push(objectid + type + '|Responsibilities|' + element);
          });
        }
        return res["records"][0]["userGroupsId"]
      }));
    }
    return Promise.all(awaitFun).then(res => {
      return Promise.resolve(useridkeys);
    });
  }

  fetchUserHierarchy(dataFetchingInput, layoutDataRestrictionSet, methodCalledBy?: 'filter' | 'listener', batchQuery?) {
    if (dataFetchingInput['dataSource'] === appConstant.couchDBStaticName) {
      var query = "type:" + this.metaDbConfig.corUserHierarchy + " AND " + "user_id:" + Number(this.appUtilityObj.userId)
      return this.metaDataDbProvider.fetchDocsUsingSearchApi(query, this.metaDbConfig.corUserHierarchy).then(res => {
        return this.fetchRecordsAgainstUserHierarchy(dataFetchingInput, layoutDataRestrictionSet, res, methodCalledBy, batchQuery)
      }).catch(err => {
        console.log("Data provider error :", err);
        return Promise.resolve({ "status": 'FAILED', 'message': this.hierarchyErrorMessage, "records": [], bookmark: '', total_rows: 0 })
      });
    } else {
      let corUsersObjectHierarchyJSON = {
        "objectId": this.metaDbConfig.corUserHierarchy,
        "objectName": this.metaDbConfig.corUserHierarchy,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": []
      }

      return this.metaDataDbProvider.fetchDataWithReference(corUsersObjectHierarchyJSON).then(res => {
        return this.fetchRecordsAgainstUserHierarchy(dataFetchingInput, layoutDataRestrictionSet, res, methodCalledBy, batchQuery)
      }).catch(err => {
        console.log("Data provider error :", err);
        return Promise.resolve({ "status": 'FAILED', 'message': this.hierarchyErrorMessage, "records": [], bookmark: '', total_rows: 0 })
      })
    }
  }
  fetchFormulaRollupForDependentLookup(query:string, designDocName:string, type){
    return this.formulaCouchDbProvider.callSearchDesignDocs(query, designDocName, 'ASC').then(response => {
      
      return response['rows'].map(value=> type +'_2_' + value['fields']['reference_id'])
    } )
  }
  fetchRecordsAgainstUserHierarchy(dataFetchingInput, layoutDataRestrictionSet, res, methodCalledBy?: 'filter' | 'listener', batchQuery?) {
    if (res['status'] === "SUCCESS" && res['records'].length > 0) {
      layoutDataRestrictionSet.forEach(element => {
        if (element['restrictionType'].toLowerCase() === "owner") {
          element['restrictedDataUserIds'] = [this.appUtilityObj.userId];
        } else {
          element['restrictedDataUserIds'] = this.getHierarchialUserIds(element, res['records'][0]);
        }
      })
      return this.fetchDbSelection(dataFetchingInput, methodCalledBy, batchQuery);

    } else {

      if (res['status'] === "SUCCESS"){
        return Promise.resolve({ "status": 'SUCCESS', 'message': '', "records": [], bookmark: '', total_rows: 0 })
      }else{
        return Promise.resolve({ "status": 'FAILED', 'message': this.hierarchyErrorMessage, "records": [], bookmark: '', total_rows: 0 })
      }
    }
  }

  private fetchDbSelection(dataFetchingInput, methodCalledBy?: 'filter' | 'listener', batchQuery?) {
    const dataProvider = dataFetchingInput['dataSource']

    let layoutDataRestrictionSet = dataFetchingInput['layoutDataRestrictionSet']
    let useridArray = []
    if (dataProvider) {
      if (dataProvider === appConstant.couchDBStaticName) {
        if (dataFetchingInput["searchListQuery"]) {
          let query = dataFetchingInput["searchListQuery"]
          if (layoutDataRestrictionSet !== undefined && layoutDataRestrictionSet.length > 0 && layoutDataRestrictionSet[0]['restrictionType'].toLowerCase() !== 'userassignment') {
            let restrictionAvailabeResult = this.checkIfAtleastOneRestrictionAvailable(layoutDataRestrictionSet)
            if (restrictionAvailabeResult['isRestrictionAvailabe']) {
              useridArray = restrictionAvailabeResult['useridArray']
              query = query + ' AND ' + "createdby:(" + useridArray.join(' OR ') + ')';
            } else {
              return Promise.resolve({
                "status": 'SUCCESS',
                'message': '',
                "records": [],
                bookmark: '',
                total_rows: 0,
                'layoutDataRestrictionSet': dataFetchingInput['layoutDataRestrictionSet']
              })
            }

          }



          

          const hierarchyJSON = dataFetchingInput["objectHierarchyJSON"]
          // For online data fetching for table with pagination
          if (dataFetchingInput['pagination']) {
            let limit = 100;
            if (dataFetchingInput['pagination']['limit']) {
              limit = Number(dataFetchingInput['pagination']['limit']);
            }
            let bookmark = '';
            if (dataFetchingInput['pagination']['bookmark']) {
              bookmark = dataFetchingInput['pagination']['bookmark'];
            }
            let sort = 'createdon<number>'
            if (dataFetchingInput['sort']) {
              sort = dataFetchingInput['sort']
            }
            if (methodCalledBy === "filter" || methodCalledBy === "listener") {
              let objectName = ""
              if (isNaN(hierarchyJSON['objectId'])) {
                objectName = hierarchyJSON['objectId']
              } else {
                objectName = "pfm" + hierarchyJSON['objectId']
              }
              if (useridArray.length > 0) {
                batchQuery = batchQuery + ' AND ' + "createdby:(" + useridArray.join(' OR ') + ')'
              }
              const designDocName = objectName + "_search";
              const queryFlags = {
                "include_docs": false,
                "include_fields": false
              }
              return this.couchDBProvider.callSearchDesignDocs(batchQuery, designDocName, '', queryFlags).then(result => {
                return result
              })
            } else {
              return this.couchDBProvider.searchRecordsWithPagination(query, hierarchyJSON, sort, { limit: limit, offset: 0, bookmark: bookmark }, dataFetchingInput['isLazyLoadEnabled'], dataFetchingInput['listenerName']).then(result => {
                result['layoutDataRestrictionSet'] = layoutDataRestrictionSet
                return result
              })
            }
          } else {
            // For online data fetching without pagination
            return this.couchDBProvider.fetchRecordsBySearchFilterPhrases(query, hierarchyJSON).then(result => {
              result['layoutDataRestrictionSet'] = layoutDataRestrictionSet
              return result
            })
          }
        }
        return this.couchDbDataFetching(dataFetchingInput)
      } else if (dataProvider === appConstant.pouchDBStaticName) {
        return this.pouchDbDataFetching(dataFetchingInput)
      } else if (dataProvider === appConstant.jsonDBStaticName) {
        return this.jsonDbDataFetching(dataFetchingInput)
      }
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }

  private getHierarchialUserIds(layoutDataRestrictionSet, userHierarchyRecord) {
    var useridArray = [];
    var type = "";
    // need to handle Owner , sub, super and created user array

    if (layoutDataRestrictionSet['restrictionType'].toLowerCase() === "subordinate") {
      type = "subordinate_level_";
    } else if (layoutDataRestrictionSet['restrictionType'].toLowerCase() === "supervisor") {
      type = "supervisor_level_";
    }
    for (let i = 0; i < layoutDataRestrictionSet['restrictionLevel']; i++) {
      if (userHierarchyRecord[type + (i + 1)]) {
        useridArray = useridArray.concat(userHierarchyRecord[type + (i + 1)])
      }
    }
    
    return useridArray;
  }

  couchDbDataFetching(dataFetchingInput) {
    if (navigator.onLine) {
      const objectHierarchyJSON = dataFetchingInput['objectHierarchyJSON'];
      const additionalInfo = dataFetchingInput['additionalInfo'];
      const layoutDataRestrictionSet = dataFetchingInput['layoutDataRestrictionSet']

      if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
        return this.invalidResponse(appConstant.inValidInput);
      } else {
        return this.couchDBProvider.fetchDataWithReference(objectHierarchyJSON, layoutDataRestrictionSet, additionalInfo).then(result => {
          result['layoutDataRestrictionSet'] = layoutDataRestrictionSet
          return result
        })
      }
    } else {
      return this.invalidResponse(appConstant.noInternet)
    }
  }

  pouchDbDataFetching(dataFetchingInput) {
    const objectHierarchyJSON = dataFetchingInput['objectHierarchyJSON'];
    const additionalInfo = dataFetchingInput['additionalInfo'];
    const layoutDataRestrictionSet = dataFetchingInput['layoutDataRestrictionSet']

    if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
      return this.invalidResponse(appConstant.inValidInput);
    } else {
      return this.pouchDBProvider.fetchdatawithRelationship(objectHierarchyJSON, layoutDataRestrictionSet, additionalInfo).then(result => {
        result['layoutDataRestrictionSet'] = layoutDataRestrictionSet
        return result
      })
    }
  }

  jsonDbDataFetching(dataFetchingInput) {
    if (navigator.onLine) {
      const fetchActionInfo = dataFetchingInput['fetchActionInfo'];
      const layoutId = dataFetchingInput['layoutId'];
      const actionParams = dataFetchingInput['actionParams'];
      if (fetchActionInfo && layoutId) {
        return this.jsonDataProvider.fetchByProcessInfo(fetchActionInfo, layoutId, actionParams).then(result => {
          return result
        })
      } else {
        return this.invalidResponse(appConstant.inValidInput)
      }
    } else {
      return this.invalidResponse(appConstant.noInternet)
    }
  }
  invalidResponse(message, validationFailureSet?,validationFailure?, objectType?) {
    return Promise.resolve({ 'status': appConstant.failed, 'message': message, 'validationFailureSet' : validationFailureSet ,'validationFailure' : validationFailure, 'objectId':objectType })
  }

  // Convert reldoc to normal doc
  convertRelDocToNormalDoc(modifiedRec) {
    if (modifiedRec['dataProvider'] === appConstant.pouchDBStaticName) {
      return this.pouchDBProvider.convertRelDocToNormalDoc(modifiedRec['doc']);
    } else {
      return this.couchDBProvider.convertRelDocToNormalDoc(modifiedRec['doc']);
    }
  }

  fetchDataByFindOption(dataFetchingInput) {
    // tslint:disable-next-line: no-shadowed-variable
    const dataProvider = dataFetchingInput['dataSource']
    if (dataProvider) {
      if (dataProvider === appConstant.couchDBStaticName) {
        return this.couchDbDataFetchingUsingOptions(dataFetchingInput)
      } else if (dataProvider === appConstant.pouchDBStaticName) {
        return this.pouchDbDataFetchingUsingOptions(dataFetchingInput)
      }
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }

  couchDbDataFetchingUsingOptions(dataFetchingInput) {
    if (navigator.onLine) {
      const options = dataFetchingInput['options'];
      if (!options) {
        return this.invalidResponse(appConstant.inValidInput);
      } else {
        return this.couchDBProvider.findAPIwithOptions(options).then(result => {
          return result
        })
      }
    } else {
      return this.invalidResponse(appConstant.noInternet)
    }
  }

  pouchDbDataFetchingUsingOptions(dataFetchingInput) {

    const options = dataFetchingInput['options'];
    if (!options) {
      return this.invalidResponse(appConstant.inValidInput);
    } else {
      return this.pouchDBProvider.fetchDataWithReference(options).then(result => {
        return result
      })
    }
  }

  queryDataFromDataSource(dataFetchingInput) {
    if (dataFetchingInput['layoutDataRestrictionSet'] !== undefined && dataFetchingInput['layoutDataRestrictionSet'].length > 0) {
      let layoutDataRestrictionSet = dataFetchingInput['layoutDataRestrictionSet']
      if (layoutDataRestrictionSet.length === 1 && layoutDataRestrictionSet[0]['restrictionType'].toLowerCase() === 'owner') {
        layoutDataRestrictionSet[0]['restrictedDataUserIds'] = [this.appUtilityObj.userId]
        return this.queryData(dataFetchingInput)
      } else {
        return this.fetchUserHierarchy(dataFetchingInput, layoutDataRestrictionSet)
      }
    } else {
      return this.queryData(dataFetchingInput);
    }
  }

  private queryData(dataFetchingInput) {
    const dataProvider = dataFetchingInput['dataSource']

    if (dataProvider) {
      if (dataProvider === appConstant.couchDBStaticName) {
        return this.queryCouchData(dataFetchingInput)
      } else if (dataProvider === appConstant.pouchDBStaticName) {
        return this.queryPouchData(dataFetchingInput)
      } else if (dataProvider === appConstant.jsonDBStaticName) {
        return this.jsonDbDataFetching(dataFetchingInput)
      }
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }

  queryCouchData(dataFetchingInput) {
    if (navigator.onLine) {
      var useridArray = []
      const objectHierarchyJSON = dataFetchingInput['objectHierarchyJSON'];

      if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
        return this.invalidResponse(appConstant.inValidInput);
      } else {
        let layoutDataRestrictionSet = dataFetchingInput['layoutDataRestrictionSet']
        if (layoutDataRestrictionSet !== undefined && layoutDataRestrictionSet.length > 0) {
          let restrictionAvailabeResult = this.checkIfAtleastOneRestrictionAvailable(layoutDataRestrictionSet)
          if (restrictionAvailabeResult['isRestrictionAvailabe']) {
            useridArray = restrictionAvailabeResult['useridArray']
            return this.couchDBProvider.queryListDataWithBatch(objectHierarchyJSON, useridArray).then(result => {
              return result
            })
          } else {
            return Promise.resolve({ "status": 'SUCCESS', 'message': '', "records": [] })
          }
        } else {
          return this.couchDBProvider.queryListDataWithBatch(objectHierarchyJSON).then(result => {
            return result
          })
        }
      }
    } else {
      return this.invalidResponse(appConstant.noInternet)
    }
  }

  queryPouchData(dataFetchingInput) {
    const objectHierarchyJSON = dataFetchingInput['objectHierarchyJSON'];
    var useridArray = []

    if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
      return this.invalidResponse(appConstant.inValidInput);
    } else {
      let layoutDataRestrictionSet = dataFetchingInput['layoutDataRestrictionSet']
      if (layoutDataRestrictionSet !== undefined && layoutDataRestrictionSet.length > 0) {
        let restrictionAvailabeResult = this.checkIfAtleastOneRestrictionAvailable(layoutDataRestrictionSet)
        if (restrictionAvailabeResult['isRestrictionAvailabe']) {
          useridArray = restrictionAvailabeResult['useridArray']
          return this.pouchDBProvider.queryListDataWithBatch(objectHierarchyJSON, useridArray).then(result => {
            return result
          })
        } else {
          return Promise.resolve({ "status": 'SUCCESS', 'message': '', "records": [] })
        }
      } else {
        return this.pouchDBProvider.queryListDataWithBatch(objectHierarchyJSON).then(result => {
          return result
        })
      }
    }
  }

  querySingleDoc(queryParams) {
    const dataProvider = queryParams['dataSource']

    if (dataProvider) {
      if (dataProvider === appConstant.couchDBStaticName) {
        return this.querySingleCouchData(queryParams)
      } else if (dataProvider === appConstant.pouchDBStaticName) {
        return this.querySinglePouchData(queryParams)
      } else if (dataProvider === appConstant.jsonDBStaticName) {
        return this.jsonDbDataFetching(queryParams)
      }
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }

  private querySingleCouchData(queryParams) {
    if (navigator.onLine) {
      const objectHierarchyJSON = queryParams['objectHierarchyJSON'];

      if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
        return this.invalidResponse(appConstant.inValidInput);
      } else {
        if (queryParams['additionalInfo'] && queryParams['additionalInfo']['id']) {
          return this.couchDBProvider.querySingleDoc(objectHierarchyJSON, queryParams['additionalInfo']['id']).then(result => {
            return result
          })
        } else {
          return this.invalidResponse(appConstant.inValidInput);
        }
      }
    } else {
      return this.invalidResponse(appConstant.noInternet)
    }
  }

  private querySinglePouchData(queryParams) {
    const objectHierarchyJSON = queryParams['objectHierarchyJSON'];

    if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
      return this.invalidResponse(appConstant.inValidInput);
    } else {
      if (queryParams['additionalInfo'] && queryParams['additionalInfo']['id']) {
        return this.pouchDBProvider.querySingleDoc(objectHierarchyJSON, queryParams['additionalInfo']['id']).then(result => {
          return result
        })
      } else {
        return this.invalidResponse(appConstant.inValidInput);
      }
    }
  }

  /* Formula Data Fetch Methods */
  querySingleFormualDoc(queryParams) {
    const dataProvider = queryParams['dataSource']

    if (dataProvider) {
      if (dataProvider === appConstant.couchDBStaticName) {
        return this.querySingleFormulaCouchData(queryParams)
      } else if (dataProvider === appConstant.pouchDBStaticName) {
        return this.querySingleFormulaPouchData(queryParams)
      } else if (dataProvider === appConstant.jsonDBStaticName) {
        return this.getSingleFormulaJsonData(queryParams)
      }
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }

  private querySingleFormulaCouchData(queryParams) {
    if (navigator.onLine) {
      const objectHierarchyJSON = queryParams['objectHierarchyJSON'];
      const objectReverseHierarchyJSON = queryParams['objectReverseHierarchyJSON']

      if (Object.entries(objectHierarchyJSON).length === 0
        && objectHierarchyJSON.constructor === Object && Object.entries(objectReverseHierarchyJSON).length === 0
        && objectReverseHierarchyJSON.constructor === Object) {
        return this.invalidResponse(appConstant.inValidInput);
      } else {
        if (queryParams['additionalInfo'] && queryParams['fetchParent']) {
          const finalRes = {}
          return this.couchDBProvider.fetchFormulaObjectForParent(objectReverseHierarchyJSON,
            queryParams['additionalInfo']['type'], queryParams['additionalInfo']['id'], finalRes).then(result => {
              return result
            })
        } else if (queryParams['additionalInfo']) {
          const finalRes = {}
          return this.couchDBProvider.fetchFormulaDataObject(objectReverseHierarchyJSON,
            objectHierarchyJSON, queryParams['additionalInfo'], finalRes).then(result => {
              return result
            })
        } else {
          return this.invalidResponse(appConstant.inValidInput);
        }
      }
    } else {
      return this.invalidResponse(appConstant.noInternet)
    }
  }

  private querySingleFormulaPouchData(queryParams) {
    const objectHierarchyJSON = queryParams['objectHierarchyJSON'];
    const objectReverseHierarchyJSON = queryParams['objectReverseHierarchyJSON']

    if (Object.entries(objectHierarchyJSON).length === 0
      && objectHierarchyJSON.constructor === Object && Object.entries(objectReverseHierarchyJSON).length === 0
      && objectReverseHierarchyJSON.constructor === Object) {
      return this.invalidResponse(appConstant.inValidInput);
    } else {
      if (queryParams['additionalInfo'] && queryParams['fetchParent']) {
        const finalRes = {}
        return this.pouchDBProvider.fetchFormulaObjectForParent(objectReverseHierarchyJSON,
          queryParams['additionalInfo']['type'], queryParams['additionalInfo']['id'], finalRes).then(result => {
            return result
          })
      } else if (queryParams['additionalInfo']) {
        const finalRes = {}
        return this.pouchDBProvider.fetchFormulaDataObject(objectReverseHierarchyJSON,
          objectHierarchyJSON, queryParams['additionalInfo'], finalRes).then(result => {
            return result
          })
      } else {
        return this.invalidResponse(appConstant.inValidInput);
      }
    }
  }

  private getSingleFormulaJsonData(queryParams) {
    const objectHierarchyJSON = queryParams['objectHierarchyJSON'];
    const objectReverseHierarchyJSON = queryParams['objectReverseHierarchyJSON']

    if (Object.entries(objectHierarchyJSON).length === 0
      && objectHierarchyJSON.constructor === Object && Object.entries(objectReverseHierarchyJSON).length === 0
      && objectReverseHierarchyJSON.constructor === Object) {
      return this.invalidResponse(appConstant.inValidInput);
    } else {
      if (queryParams['additionalInfo']) {
        const finalRes = {}
        return this.pouchDBProvider.fetchFormulaDataObject(objectReverseHierarchyJSON,
          objectHierarchyJSON, queryParams['additionalInfo'], finalRes).then(result => {
            return result
          })
      } else {
        return this.invalidResponse(appConstant.inValidInput);
      }
    }
  }

  getChildCount(dataFetchingInput) {
    if (dataFetchingInput['layoutDataRestrictionSet'] !== undefined && dataFetchingInput['layoutDataRestrictionSet'].length > 0) {
      let layoutDataRestrictionSet = dataFetchingInput['layoutDataRestrictionSet']
      if (layoutDataRestrictionSet.length === 1 && layoutDataRestrictionSet['restrictionType'].toLowerCase() === 'owner') {
        layoutDataRestrictionSet[0]['restrictedDataUserIds'] = [this.appUtilityObj.userId]
        return this.queryRecordCount(dataFetchingInput)
      } else {
        return this.fetchUserHierarchy(dataFetchingInput, layoutDataRestrictionSet)
      }
    } else {
      return this.queryRecordCount(dataFetchingInput);
    }
  }

  private queryRecordCount(queryParams) {
    const dataProvider = queryParams['dataSource']

    if (dataProvider) {
      if (dataProvider === appConstant.couchDBStaticName) {
        return this.queryChildCountFromCouch(queryParams)
      } else if (dataProvider === appConstant.pouchDBStaticName) {
        return this.queryChildCountFromPouch(queryParams)
      } else if (dataProvider === appConstant.jsonDBStaticName) {
        return this.jsonDbDataFetching(queryParams)
      }
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }

  queryChildCountFromPouch(queryParams) {
    const objectHierarchyJSON = queryParams['objectHierarchyJSON'];

    if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
      return this.invalidResponse(appConstant.inValidInput);
    } else {
      if (queryParams['additionalInfo'] && queryParams['additionalInfo']['id']) {
        var userIds = undefined;
        if (queryParams['layoutDataRestrictionSet'] !== undefined && queryParams['layoutDataRestrictionSet'].length > 0) {
          const layoutDataRestrictionSet = queryParams['layoutDataRestrictionSet']
          let restrictionAvailabeResult = this.checkIfAtleastOneRestrictionAvailable(layoutDataRestrictionSet)
          if (restrictionAvailabeResult['isRestrictionAvailabe']) {
            userIds = restrictionAvailabeResult['useridArray']
            return this.pouchDBProvider.getChildCount(objectHierarchyJSON, queryParams['additionalInfo']['id'], userIds).then(result => {
              return result
            })
          } else {
            return Promise.resolve({ "status": 'SUCCESS', 'message': '', "records": [] })
          }
        }else {
          return this.pouchDBProvider.getChildCount(objectHierarchyJSON, queryParams['additionalInfo']['id'], userIds).then(result => {
            return result
          })
        }
      } else {
        return this.invalidResponse(appConstant.inValidInput);
      }
    }
  }

  queryChildCountFromCouch(queryParams) {
    if (navigator.onLine) {
      const objectHierarchyJSON = queryParams['objectHierarchyJSON'];

      if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
        return this.invalidResponse(appConstant.inValidInput);
      } else {
        if (queryParams['additionalInfo'] && queryParams['additionalInfo']['id']) {
          var userIds = undefined;
          if (queryParams['layoutDataRestrictionSet'] !== undefined && queryParams['layoutDataRestrictionSet'].length > 0) {
            const layoutDataRestrictionSet = queryParams['layoutDataRestrictionSet']
            let restrictionAvailabeResult = this.checkIfAtleastOneRestrictionAvailable(layoutDataRestrictionSet)
            if (restrictionAvailabeResult['isRestrictionAvailabe']) {
              userIds = restrictionAvailabeResult['useridArray']
              return this.couchDBProvider.getChildCount(objectHierarchyJSON, queryParams['additionalInfo']['id'], userIds).then(result => {
                return result
              })
            } else {
              return Promise.resolve({ "status": 'SUCCESS', 'message': '', "records": [] })
            }
          } else {
            return this.couchDBProvider.getChildCount(objectHierarchyJSON, queryParams['additionalInfo']['id'], userIds).then(result => {
              return result
            })
          }
        } else {
          return this.invalidResponse(appConstant.inValidInput);
        }
      }
    }else {
      return this.invalidResponse(appConstant.noInternet)
    }
  }

  queryChildDataBatchwise(dataFetchingInput) {

    if (dataFetchingInput['layoutDataRestrictionSet'] !== undefined && dataFetchingInput['layoutDataRestrictionSet'].length > 0) {
      let layoutDataRestrictionSet = dataFetchingInput['layoutDataRestrictionSet']
      if (layoutDataRestrictionSet.length === 1 && layoutDataRestrictionSet['restrictionType'].toLowerCase() === 'owner') {
        layoutDataRestrictionSet[0]['restrictedDataUserIds'] = [this.appUtilityObj.userId]
        return this.queryChildData(dataFetchingInput)
      } else {
        return this.fetchUserHierarchy(dataFetchingInput, layoutDataRestrictionSet)
      }
    } else {
      return this.queryChildData(dataFetchingInput);
    }
  }

  queryChildData(queryParams) {
    const dataProvider = queryParams['dataSource']

    if (dataProvider) {
      if (dataProvider === appConstant.couchDBStaticName) {
        return this.queryChildFromCouch(queryParams)
      } else if (dataProvider === appConstant.pouchDBStaticName) {
        return this.queryChildFromPouch(queryParams)
      } else if (dataProvider === appConstant.jsonDBStaticName) {
        return this.jsonDbDataFetching(queryParams)
      }
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }

  queryChildFromPouch(queryParams) {
    const objectHierarchyJSON = queryParams['objectHierarchyJSON'];

    if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
      return this.invalidResponse(appConstant.inValidInput);
    } else {
      if (queryParams['additionalInfo'] && queryParams['additionalInfo']['parentId']) {
        var userIds = undefined;
        if (queryParams['layoutDataRestrictionSet'] !== undefined && queryParams['layoutDataRestrictionSet'].length > 0) {
          const layoutDataRestrictionSet = queryParams['layoutDataRestrictionSet']
          let restrictionAvailabeResult = this.checkIfAtleastOneRestrictionAvailable(layoutDataRestrictionSet)
          if (restrictionAvailabeResult['isRestrictionAvailabe']) {
            userIds = restrictionAvailabeResult['useridArray']
            return this.pouchDBProvider.queryChildListDataWithBatch(objectHierarchyJSON, queryParams['additionalInfo']['parentId'],
              userIds).then(result => {
                return result
              })
          }else {
            return Promise.resolve({ "status": 'SUCCESS', 'message': '', "records": [] })
          }

        }else {
          return this.pouchDBProvider.queryChildListDataWithBatch(objectHierarchyJSON, queryParams['additionalInfo']['parentId'], userIds).then(result => {
            return result
          })
        }
      } else {
        return this.invalidResponse(appConstant.inValidInput);
      }
    }
  }

  queryChildFromCouch(queryParams) {
    if (navigator.onLine) {
      const objectHierarchyJSON = queryParams['objectHierarchyJSON'];

      if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
        return this.invalidResponse(appConstant.inValidInput);
      } else {
        var userIds = undefined;
        if (queryParams['additionalInfo'] && queryParams['additionalInfo']['parentId']) {

          if (queryParams['layoutDataRestrictionSet'] !== undefined && queryParams['layoutDataRestrictionSet'].length > 0) {

            const layoutDataRestrictionSet = queryParams['layoutDataRestrictionSet']
            let restrictionAvailabeResult = this.checkIfAtleastOneRestrictionAvailable(layoutDataRestrictionSet)
            if (restrictionAvailabeResult['isRestrictionAvailabe']) {
              userIds = restrictionAvailabeResult['useridArray']
              return this.couchDBProvider.queryChildListDataWithBatch(objectHierarchyJSON, queryParams['additionalInfo']['parentId'],
                userIds).then(result => {
                  return result
                })
            }else {
              return Promise.resolve({ "status": 'SUCCESS', 'message': '', "records": [] })
            }
          }else {
            return this.couchDBProvider.queryChildListDataWithBatch(objectHierarchyJSON, queryParams['additionalInfo']['parentId'], userIds).then(result => {
              return result
            })
          }


        } else {
          return this.invalidResponse(appConstant.inValidInput);
        }
      }
    } else {
      return this.invalidResponse(appConstant.noInternet)
    }
  }
  getDbServiceProvider(dataSorce) {
    if (dataSorce === appConstant.couchDBStaticName) {
      return this.couchDBProvider;
    } else if (dataSorce === appConstant.pouchDBStaticName) {
      return this.pouchDBProvider;
    }
  }
  getMetaDbServiceProvider(dataSorce) {
    if (dataSorce === appConstant.couchDBStaticName) {
      return this.metaCouchDbProvider;
    }else if (dataSorce === appConstant.pouchDBStaticName) {
      return this.metaDataDbProvider;
    }
  }


  vaidateUniqueField(type, doc, dataSorce, uniqueField, action) {
    
    if (dataSorce === appConstant.couchDBStaticName) {
      return this.couchDBProvider.vaidateUniqueField(type, doc, uniqueField, action);
    }
  }

  fetchDocsWithoutRelationshipByParentTypeAndId(dataSorce, childtype, parent_type, parent_id, referencedetail?) {
    if (dataSorce === appConstant.couchDBStaticName) {
      return this.couchDBProvider.fetchDocsWithoutRelationshipByParentTypeAndId(childtype, parent_type, parent_id, referencedetail);
    } else if (dataSorce === appConstant.pouchDBStaticName) {
      return this.pouchDBProvider.fetchDocsWithoutRelationshipByParentTypeAndId(childtype, parent_type, parent_id);
    }
  }

  queryBulkDoc(queryParams) {
    const dataProvider = queryParams['dataSource']

    if (dataProvider) {
      if (dataProvider === appConstant.couchDBStaticName) {
        return this.queryBulkCouchData(queryParams)
      } else if (dataProvider === appConstant.pouchDBStaticName) {
        return this.queryBulkPouchData(queryParams)
      } else if (dataProvider === appConstant.jsonDBStaticName) {
        return this.jsonDbDataFetching(queryParams)
      }
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }


  private queryBulkCouchData(queryParams) {
    if (navigator.onLine) {
      const objectHierarchyJSON = queryParams['objectHierarchyJSON'];

      if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
        return this.invalidResponse(appConstant.inValidInput);
      } else {
        if (queryParams['additionalInfo'] && queryParams['additionalInfo']['id']) {
          return this.couchDBProvider.queryBulkDoc(objectHierarchyJSON, queryParams['additionalInfo']['id']).then(result => {
            return result
          })
        } else {
          return this.invalidResponse(appConstant.inValidInput);
        }
      }
    } else {
      return this.invalidResponse(appConstant.noInternet)
    }
  }

  private queryBulkPouchData(queryParams) {
    const objectHierarchyJSON = queryParams['objectHierarchyJSON'];

    if (Object.entries(objectHierarchyJSON).length === 0 && objectHierarchyJSON.constructor === Object) {
      return this.invalidResponse(appConstant.inValidInput);
    } else {
      if (queryParams['additionalInfo'] && queryParams['additionalInfo']['id']) {
        return this.pouchDBProvider.queryBulkDoc(objectHierarchyJSON, queryParams['additionalInfo']['id']).then(result => {
          return result
        })
      } else {
        return this.invalidResponse(appConstant.inValidInput);
      }
    }
  }
  // Fetch Single Data Without Relationship Record
  fetchDocsUsingRecordIds(queryParams) {
    const dataSouce = queryParams['dataSource']
    const isStandardObject = queryParams['isStandardObject']
    if (dataSouce) {
      if(isStandardObject && dataSouce === appConstant.couchDBStaticName) {
        return this.metaCouchDbProvider.fetchDocsWithDocIds(queryParams['id']) 
      } else if (dataSouce === appConstant.couchDBStaticName) {
        return this.couchDBProvider.fetchDocsWithDocIds(queryParams['id'])
      } else if (dataSouce === appConstant.pouchDBStaticName) {
        return this.pouchDBProvider.fetchDocsWithDocIds(queryParams['id'])
      }
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }

  checkIfAtleastOneRestrictionAvailable(layoutDataRestrictionSet) {
    var useridArray = []
    layoutDataRestrictionSet.forEach(element => {
      if (element['restrictedDataUserIds']) {
        useridArray = useridArray.concat(element['restrictedDataUserIds'])
      }
    })
    var isRestrictionAvailabe = useridArray.length > 0 ? true : false;
    return { 'isRestrictionAvailabe': isRestrictionAvailabe, 'useridArray': useridArray }
  }
  // Execution Data Fetch
  executionDBDataFetching(dataFetchingInput) {
    const dataProvider = dataFetchingInput['dataSource']
    if (dataProvider === appConstant.couchDBStaticName) {
      const query = dataFetchingInput["query"]
      const pfmApproveUserStatusHierarchyJSON = dataFetchingInput["objectHierarchyJSON"]
      return this.cspfmexecutionCouchDBProvider.fetchRecordsBySearchFilterPhrases(query, pfmApproveUserStatusHierarchyJSON).then(result => {
        return result
      })
    } else {
      const pfmApproveUserStatusHierarchyJSON = dataFetchingInput["objectHierarchyJSON"]
      return this.cspfmexecutionPouchDbProvider.fetchDataWithReference(pfmApproveUserStatusHierarchyJSON).then(result => {
        return result
      })
    }
  }

  executionDataSave(type, doc, dataServiceProvider) {
    if (dataServiceProvider === appConstant.couchDBStaticName) {
      return this.cspfmexecutionCouchDBProvider.save(type, doc).then(result => {
        return result
      })
    } else {
      return this.cspfmexecutionPouchDbProvider.save(type, doc).then(result => {
        return result
      })
    }
  }
  excutionDataBulkSave(type, doc, dataServiceProvider) {
    if (dataServiceProvider === appConstant.couchDBStaticName) {
      return this.cspfmexecutionCouchDBProvider.saveBulkDocs(type, doc, [], []).then(result => {
        return result
      })
    } else {
      return this.cspfmexecutionPouchDbProvider.saveBulkDocs(type, doc).then(result => {
        return result
      })
    }
  }

  getAssignmentData(keys: Array<string>, dataSource) {
    if (dataSource === appConstant.couchDBStaticName) {
      return this.couchDBProvider.fetchAssociation('associationView', keys);
    }else if (dataSource === appConstant.pouchDBStaticName) {
      // return this.couchDBProvider.fetchAssociation('associationView', keys);
    } else {
      return this.invalidResponse(appConstant.inValidInput);
    }
  }
  
  fileManageDbSelection(options) {
    if (options['dbProvider'] === 'CouchDB') {
      return this.attachmentCouchDbProviderObject.callSearchDesignDocs(options['query'], options['design_doc'], '', options['queryFlags']).then(res => {
        if (res['rows'] && res['rows'].length > 0) {
          const responseInfo = this.couchDBProvider.handleGlobalSearchResponse(res['rows'])
          return { 'status': 'SUCCESS', 'records': responseInfo }
        } else {
          return { 'status': 'SUCCESS', 'records': [] }
        }
      }).catch(error => {
        return { 'Status': 'Error', 'Message': 'Server error. Please contact admin.' };
      });
    } else {
      return this.attachmentDbProvider.fetchDocsWithRelationshipUsingFindOption(options['selector'], true)
    }
  }
  insertTrackingDocument(actionTrackingInfo, processingState){
    let trackingInfo = {};
    trackingInfo['actionid'] = actionTrackingInfo['actionId'];
    trackingInfo['actionname'] = actionTrackingInfo['actionName'];
    trackingInfo['actionmode'] = actionTrackingInfo['actionMode'];
    trackingInfo['processtype'] = actionTrackingInfo['processType'];
    trackingInfo['layoutid'] = actionTrackingInfo['layoutId'];
    trackingInfo['recordid'] = actionTrackingInfo['recordId'];
    trackingInfo['status'] = processingState === 'start' ? 'processing' : 'completed';
    return this.cspfmexecutionCouchDBProvider.save("cspfmactiontracking", trackingInfo).then(result => {
      
    }).catch(err => {
      console.log(err);
    });
  }
}
