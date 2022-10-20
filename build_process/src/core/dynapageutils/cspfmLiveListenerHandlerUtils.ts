import { Injectable } from "@angular/core";
import { appUtility } from '../utils/appUtility';
import { DependentObjectListType, FetchMode } from '../models/cspfmLiveListenerConfig.type';
import * as lodash from 'lodash';
import {
    dataProvider
} from 'src/core/utils/dataProvider';
import {
    cspfmSlickgridUtils
} from 'src/core/dynapageutils/cspfmSlickgridUtils';
import { cspfmCustomFieldProvider } from 'src/core/utils/cspfmCustomFieldProvider';
@Injectable({
    providedIn: "root"
})

export class cspfmLiveListenerHandlerUtils {
    constructor(private appUtilityConfig: appUtility, public dataProvider: dataProvider
        ,public slickgridUtils: cspfmSlickgridUtils, public cspfmCustomFieldProviderObject : cspfmCustomFieldProvider) { }

    getIdsFromResult(results) {
        var ids = [];
        if (Array.isArray(results)) {
            results.forEach(item => {
                if (item && item['rows'] && item['rows'].length > 0) {
                    ids = ids.concat(item['rows'].map(e => e['id']))
                }
            });
        } else {
            if (results && results['rows'] && results['rows'].length > 0) {
                ids = ids.concat(results['rows'].map(e => e['id']))
            }
        }
        return lodash.uniq(ids);
    }

    modifiedDataSet(angularGrid, modifiedDataId, tablename, filteredResultList, gridSearchRowToggle, filterSectionDetail ? ) {
        if (modifiedDataId) {
            const removedObjectId = modifiedDataId.replace(tablename + '_2_', "")
            const filterRecord = lodash.filter(filteredResultList, {
                'id': removedObjectId
            });
            if (filterRecord.length > 0) {
                const index = lodash.findIndex(filteredResultList, {
                    'id': removedObjectId
                })
                if (angularGrid) {
                    angularGrid.dataView.beginUpdate();
                    angularGrid.dataView.deleteItem(filteredResultList[index]["id"]);
                    angularGrid.dataView.endUpdate();
                    angularGrid.dataView.reSort();
                }
                this.slickgridUtils.slickgridHeightChange(angularGrid.dataView.getLength(), false, filteredResultList, gridSearchRowToggle, angularGrid, filterSectionDetail)
                this.slickgridUtils.resizeColumnsByCellContent(angularGrid)
            }
        }
    }

    modifiedBulkDocs(formattedId, angularGrid, tablename, filteredResultList, gridSearchRowToggle, filterSectionDetail) {
        if (formattedId.length > 0) {
            formattedId.forEach(modifiedDataId => {
                this.modifiedDataSet(angularGrid, modifiedDataId, tablename, filteredResultList, gridSearchRowToggle, filterSectionDetail)
            });
        }
    }

    upsertModifiedData(data: Array<any>, angularGrid, columnDefinitions, tableName, sectionObjectDetails, isLoading, dataSource, filteredResultList, gridSearchRowToggle, filterSectionDetail) {
        data = data.filter(e => e !== undefined);
        data = this.cspfmCustomFieldProviderObject.makeSlickGridCustomFields(data, columnDefinitions[tableName])
        if (angularGrid && data && data.length > 0) {
            angularGrid.dataView.beginUpdate();
            data.forEach(element => {
                var value = angularGrid.dataView.getItemById(element['id'])
                if (value) {
                    angularGrid.dataView.updateItem(element['id'], element);
                } else {
                    angularGrid.dataView.addItem(element);
                }
            });
            angularGrid.dataView.endUpdate();
            angularGrid.dataView.reSort();
            if (sectionObjectDetails[tableName]['matrixConfig']['displayInfo']['currentMode'] === 'matrix') {
                this.slickgridUtils.changeMatrixLayout(isLoading, angularGrid, sectionObjectDetails, tableName, dataSource);
            }
            this.slickgridUtils.slickgridHeightChange(angularGrid.dataView.getLength().itemsPerPage, true, filteredResultList, gridSearchRowToggle, angularGrid, filterSectionDetail)
            this.slickgridUtils.resizeColumnsByCellContent(angularGrid)
        }
    }
    handleListenerBasedOnPageType(fetchMode: FetchMode, dependentObjectList: DependentObjectListType, modified, layoutInfo : Object): any | void {
        const dataObject = layoutInfo['dataObject'];
        switch (fetchMode) {
            case FetchMode.GRID_FETCH:
                return this.checkIfFetchRequired(dependentObjectList, dataObject, modified);
            case FetchMode.SECTION_FETCH:
                const gridObjData = layoutInfo['gridData'];
                const idFetchArray = [];
                const objectId = layoutInfo['objectId'];
                const formulaAndRollupFieldInfoJSON = layoutInfo['formulaAndRollupFieldInfo']
                return this.checkIfFetchRequiredForListPart(dependentObjectList, modified, idFetchArray,  gridObjData, formulaAndRollupFieldInfoJSON, objectId, dataObject)
        }

    }
    checkIfFetchRequiredForListPart(dependentObjectList, modified, idArrayToFetch, gridData, formulaAndRollupFieldInfo, objectId, dataObject) {
        let providerType = modified['providerType'];
        const type = modified['doc']['data']['type'];
        if (dependentObjectList['relationalObjects'] && dependentObjectList['relationalObjects'][type]) {
                idArrayToFetch = idArrayToFetch
                    .concat(this.handleLiveListenerForRelationalObjectsWithIDArray(dependentObjectList['relationalObjects'][type], modified, type, providerType, gridData, formulaAndRollupFieldInfo, objectId, dataObject))
        }
        if (dependentObjectList['lookupObjects'] && dependentObjectList['lookupObjects'][type]) {
                idArrayToFetch = idArrayToFetch
                    .concat(this.handleLiveListenerForLookupObjectsWithIDArray(dependentObjectList['lookupObjects'][type], modified, type, providerType, gridData, formulaAndRollupFieldInfo))
        }
        idArrayToFetch = lodash.uniq(idArrayToFetch);
        return idArrayToFetch;
    }

    checkIfFetchRequired(dependentObjectList: DependentObjectListType, dataObject: object, modified: object): boolean {
        const type = modified['doc']['data']['type'];
        if (dependentObjectList['relationalObjects'] && dependentObjectList['relationalObjects'][type]) {
            return (this.handleLiveListenerForRelationalObjects(dataObject, dependentObjectList['relationalObjects'][type], modified));
        }
        if (dependentObjectList['lookupObjects'] && dependentObjectList['lookupObjects'][type]) {
            return (this.handleLiveListenerForLookupObjects(dataObject, dependentObjectList['lookupObjects'][type], modified));
        }
        return false;
    }

    handleLiveListenerForRelationalObjects(dataObject: object, listenedDependentObjArray: string[], modified: object): boolean {
        let modifiedRecord = null;
        if(modified !== null){
           modifiedRecord =  this.dataProvider.convertRelDocToNormalDoc(modified);
        }
        const type = modified['doc']['data']['type'];
        if (listenedDependentObjArray.length === 0) {                   // For parent type
            return (type + "_2_" + dataObject['id'] === modified['id']);
        } else if (listenedDependentObjArray.length === 1) {             // For first level dependent
            var object = this.appUtilityConfig.getObject(dataObject, listenedDependentObjArray[0],modifiedRecord)
            return (object) ? (type + "_2_" + object['id'] === modified['id']) : false;
        } else {                                                        // For inner level dependent
            return (this.appUtilityConfig.innerDependentObjectIdCheck(dataObject, listenedDependentObjArray, type, modified, "","",modifiedRecord));
        }
    }

    handleLiveListenerForLookupObjects(dataObject: object, listenedDependentObj: object, modified: object): boolean {
        const type = modified['doc']['data']['type'];
        return Object.keys(listenedDependentObj).some(element => {
            if (listenedDependentObj[element].length === 1) {       // For first level dependent
                var object = this.appUtilityConfig.getObject(dataObject, listenedDependentObj[element][0])
                return (object) ? (type + "_2_" + object['id'] === modified['id']) : false;
            } else {                                                    // For inner level dependent
                return (this.appUtilityConfig.innerDependentObjectIdCheck(dataObject, listenedDependentObj[element], type, modified));
            }
        });
    }
    handleLiveListenerForRelationalObjectsWithIDArray(listenedDependentObjArray, modified, type, providerType, getGridData, formulaAndRollupFieldInfo, objectId, dataObject) {
        var idArrayToFetch = []
        if (listenedDependentObjArray.length === 0) { //For parent type
            if (providerType) {
                let localData = getGridData.filter(element => {
                    return type + "_2_" + element['id'] === modified['id']
                })
                if (localData && localData.length > 0) {
                    let isValueChanged = this.appUtilityConfig.checkFormulaOrRollupColumnValuesChanged(modified, localData[0], formulaAndRollupFieldInfo)
                    if (isValueChanged) {
                        idArrayToFetch.push(modified)
                    }
                } else {
                    if (!dataObject) {
                        idArrayToFetch.push(modified)
                    } else {
                        let filteredData = getGridData.filter(element => {
                            return element['id'] === modified['doc']['data']['reference_id']
                        })
                        if (filteredData && filteredData.length > 0) {
                            if (filteredData[0][objectId] === dataObject['id']) {
                                idArrayToFetch.push(modified);
                            }
                        }
                    } 
                }
            } else {
                idArrayToFetch.push(modified)
            }
        } else if (listenedDependentObjArray.length === 1) { //For first level dependent
            idArrayToFetch = getGridData.filter(element => {
                var object = this.appUtilityConfig.getObject(element, listenedDependentObjArray[0])
                if (object) {
                    if (providerType) {
                        let isValueChanged = this.appUtilityConfig.checkFormulaOrRollupColumnValuesChanged(modified, object, formulaAndRollupFieldInfo)
                        if (type + "_2_" + object['id'] === modified['id'] && isValueChanged) {
                            return element
                        }
                    } else {
                        if (type + "_2_" + object['id'] === modified['id']) {
                            return element
                        }
                    }
                }
            })
        } else { //For inner level dependent
            idArrayToFetch = getGridData.filter(element => {
                if (this.appUtilityConfig.innerDependentObjectIdCheck(element, listenedDependentObjArray, type, modified, providerType, formulaAndRollupFieldInfo)) {
                    return element
                }
            })
        }
        return idArrayToFetch
    }
    handleLiveListenerForLookupObjectsWithIDArray(listenedDependentObjArray, modified, type, providerType, getGridData, formulaAndRollupFieldInfo ) {
        var idArrayToFetch = []
        var lookupInvolvedObjKeys = Object.keys(listenedDependentObjArray);
        lookupInvolvedObjKeys.forEach(dependentObject => {
            if (listenedDependentObjArray[dependentObject].length === 1) { //For first level dependent
                idArrayToFetch = getGridData.filter(element => {
                    const object = this.appUtilityConfig.getObject(element, listenedDependentObjArray[dependentObject][0])
                    if (object) {
                        if (providerType) {
                            let isValueChanged = this.appUtilityConfig.checkFormulaOrRollupColumnValuesChanged(modified, object, formulaAndRollupFieldInfo)
                            if (type + "_2_" + object['id'] === modified['id'] && isValueChanged) {
                                return element
                            }
                        } else {
                            if (type + "_2_" + object['id'] === modified['id']) {
                                return element
                            }
                        }
                    }
                })
            } else { //For inner level dependent
                idArrayToFetch = getGridData.filter(element => {
                    if (this.appUtilityConfig.innerDependentObjectIdCheck(element, listenedDependentObjArray[dependentObject], type, modified, providerType, formulaAndRollupFieldInfo)) {
                        return element
                    }
                })
            }
        });
        return idArrayToFetch
    }
 
    getIdWithoutPfm(id) {
        let value = "";
        if (id.includes("_2_")) {
            let splitItem = id.split("_2_");
            if (splitItem && splitItem.length > 0) {
                value = splitItem[1]
            } else {
                value = id;
            }
        } else {
            value = id;
        }
        return value
    }

    unregisterRecordChangeListener(dependentObjectList: object, layoutIdORSectionName: string, classContext: object) {
        let objectTypes = ['relationalObjects', 'lookupObjects'];
        objectTypes.forEach(type => {
            if (dependentObjectList.hasOwnProperty(type) && dependentObjectList[type]) {
                Object.keys(dependentObjectList[type]).forEach(dependentObjectName => {
                    this.appUtilityConfig.removeEventSubscriptionlayoutIds(dependentObjectName, layoutIdORSectionName, classContext["dataSource"]);
                })
            }
        });
        classContext["observableListenerUtils"].remove(layoutIdORSectionName,"==");
    }

    unregisterSectionRecordChangeListener(sectionDependentObjectList: object, classContext: object) {
        const sectionObjectKeys = Object.keys(sectionDependentObjectList);
        sectionObjectKeys.forEach(sectionObjectName => {
            const sectionDependentObject = sectionDependentObjectList[sectionObjectName];
            this.unregisterRecordChangeListener(sectionDependentObject, sectionObjectName, classContext);
        });
    }

    checkDataObjectAvailablity(classContext: Object, objectTraversalPathArray: Array<string>) {
        try {
            classContext["intervalId"] = setInterval(() => {
                objectTraversalPathArray.forEach(objectTraversalPath => {
                    if (!classContext["dataObject"][objectTraversalPath]) {
                        return;
                    }
                })
                this.clearListenerFetchInterval(classContext);
                classContext["fetchSelectedObject"]();
            }, 500);
        } catch (err) {
            this.clearListenerFetchInterval(classContext);
        }
    }

    clearListenerFetchInterval(classContext: object) {
        if (classContext["intervalId"]) {
            clearInterval(classContext["intervalId"]);
            classContext["intervalId"] = null;
        }
    }
    handleLiveListenerForDelectedRecords(layoutArea: 'HL-GRID' | 'HL-SECTION' | 'LIST' | 'ENTRY' | 'VIEW', modified, classContext, angularGridInstance?) {
      if (layoutArea === 'HL-GRID') {
          if (modified['deleted'] && modified['doc']['data']['type'] + '_2_' + classContext.id === modified['id']) {
              if (classContext.dialog) {
                  classContext.dialog.closeAll();
              }
              this.appUtilityConfig.presentToast('This record has been deleted. So navigate to home screen', 3000);
              this.appUtilityConfig.navigateToHomepage();
              return true;
          }
      } else if (layoutArea === 'HL-SECTION') {
          if (modified['deleted']) {
              const type = modified['doc']['data']['type'];
              const recordsInSlickgrid = angularGridInstance.dataView.getItems();
              const record = recordsInSlickgrid.filter(element => {
                  return (element['__isPopoverOpened'] && type + '_2_' + element['id'] === modified['id'])
              })
              if (classContext.dialog && record.length) {
                  classContext.dialog.closeAll();
              }
              this.slickgridUtils.modifiedDataSet(angularGridInstance, recordsInSlickgrid, type, modified['id']);
              return true;
          }
      } else if (layoutArea === 'LIST') {
          if (modified['deleted']) {
              const type = modified['doc']['data']['type'];
              const recordsInSlickgrid = classContext.angularGrid.dataView.getItems();
              const record = recordsInSlickgrid.filter(element => {
                  return (element['__isPopoverOpened'] && type + '_2_' + element['id'] === modified['id'])
              })
              console.log("recordsInSlickgrid:: ", recordsInSlickgrid);
              console.log("classContext.dialog:: ", type);
              console.log("classContext.dialog:: ", classContext.dialog);
              console.log("record.length:: ", record.length);
              console.log("if condition:: ", classContext.dialog && record.length);
              if (classContext.dialog && record.length) {
                  console.log("if condition SUCCESS");
                  classContext.dialog.closeAll();
              }
              this.slickgridUtils.modifiedDataSet(classContext.angularGrid, recordsInSlickgrid, type, modified['id']);
              return true;
          }
      } else if (layoutArea === 'ENTRY') {
          if (modified['deleted'] && modified['doc']['data']['type'] + '_2_' + classContext.id === modified['id']) {
              if (classContext.dialog) {
                  classContext.dialog.closeAll();
              }
              this.appUtilityConfig.presentToast('This record has been deleted. So navigate to home screen', 3000);
              this.appUtilityConfig.navigateToHomepage();
              return true;
          }
      } else if (layoutArea === 'VIEW') {
          if (modified['deleted'] && modified['doc']['data']['type'] + '_2_' + classContext.id === modified["id"]) {
              if (classContext.dialog) {
                  classContext.dialog.closeAll();
              }
              this.appUtilityConfig.presentToast('This record has been deleted. So navigate to home screen', 3000);
              this.appUtilityConfig.navigateToHomepage();
              return true;
          }
      }
      if (modified['doc']['data']['sys_attributes'] && modified['doc']['data']['sys_attributes']['_delete'] && (modified['doc']['data']['sys_attributes']['_delete']['status'] === 'inqueue'
      || modified['doc']['data']['sys_attributes']['_delete']['status'] === 'cascade' || modified['doc']['data']['sys_attributes']['_delete']['status'] === 'failed')) {
          return true;
      }
      return false;
  }

}
