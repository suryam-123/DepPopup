
/**
 * @author Nels1727
 * @tag 20Oct2021#Nels1727
 * @message CR - Implementing record assignment for association field
 */

import { AssignmentObject, RecordAssignment } from "../models/cspfmRecordAssignment.type";
// declare function require(name:string);
declare function postMessage(message: any): void;
declare function importScripts(...urls: string[]): void;
// let _ = require('lodash');
declare var _:any;
 
 export const START = (input) => {
 
 
     let handleSecondaryDataSelection = (recordAssignment: RecordAssignment, assignmentObject: AssignmentObject, primaryCheckedIds: Array<string>, primaryCheckedData: Array<any>, selection: 'checked' | 'unchecked', data: Array<any>): RecordAssignment => {
         // let primaryCheckedIds = _.cloneDeep(recordAssignment['primaryObject']['internalProcess']['angularGrid']['slickGrid']['cspfm_selection_status']['checked'] || [])
         if (selection === 'unchecked') {
             return processUncheckedData(recordAssignment, assignmentObject, primaryCheckedIds, primaryCheckedData, data)
         } else {
             return processCheckedData(recordAssignment, assignmentObject, primaryCheckedIds, primaryCheckedData, data)
         }
 
     }
 
     let processUncheckedData = (recordAssignment: RecordAssignment, assignmentObject: AssignmentObject, primaryCheckedIds: Array<string>, primaryCheckedData: Array<any>, uncheckedData: Array<any>): RecordAssignment => {
         let assignmentData = {
             "association_id": "",
             "association_object_id": assignmentObject['objectId'],
             "isActive": true,
             "reference_id": "",
             "reference_object_id": recordAssignment['primaryObject']['objectId'],
             "type": assignmentObject['associationField']
         }
 
         // let uncheckedData = this.slickGridUtils.getDataByIds(assignmentObject['internalProcess']['angularGrid'], uncheckedIds);
         for (let item of uncheckedData) {
             if (item['assignment__s'][assignmentObject['objectId']]) {
                 let currentlyUnassigned = _.intersection(primaryCheckedIds, item['assignment__s'][assignmentObject['objectId']]['records']['alreadyAssigned'])
 
                 let removeCurrentlyAssigned = _.intersection(primaryCheckedIds, item['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'])
 
                 item['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'] = _.difference(item['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'], removeCurrentlyAssigned);
 
 
                 for (const primaryData of primaryCheckedData) {
                     if (!primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'].includes(item['id']) && primaryData['assignment__s'][assignmentObject['objectId']]['records']['alreadyAssigned'].includes(item['id'])) {
                         primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'].push(item['id'])
                     }
                     let index = primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'].indexOf(item['id']);
                     if (index > -1) {
                         primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'].splice(index, 1)
                     }
                     primaryData['assigned_records__s'][assignmentObject['objectId']] = ((primaryData['assignment__s'] && primaryData['assignment__s'][assignmentObject['objectId']] && primaryData['assignment__s'][assignmentObject['objectId']]['records'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['alreadyAssigned'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['alreadyAssigned'].length || 0) + (primaryData['assignment__s'] && primaryData['assignment__s'][assignmentObject['objectId']] && primaryData['assignment__s'][assignmentObject['objectId']]['records'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'].length || 0) - (primaryData['assignment__s'] && primaryData['assignment__s'][assignmentObject['objectId']] && primaryData['assignment__s'][assignmentObject['objectId']]['records'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'].length || 0)) || 0;
 
                     if (primaryData['assigned_records__s'][assignmentObject['objectId']] === 0) {
                         if (recordAssignment['assignmentMode'] !== 'ONE_TO_MANY') {
                             primaryData[assignmentObject['fieldName']] = null;
                         } else {
                             let index = primaryData[assignmentObject['fieldName']].indexOf(assignmentObject['objectName'])
                             if (index > -1) {
                                 primaryData[assignmentObject['fieldName']].splice(index, 1)
                             }
                             if (primaryData[assignmentObject['fieldName']] && primaryData[assignmentObject['fieldName']].length === 0) {
                                 primaryData[assignmentObject['fieldName']] = null
                             }
                         }
                     }
 
                     let isValidMinimumSelection = assignmentObject['limitation']['minimumSelection'] == null || assignmentObject['limitation']['minimumSelection'] <= primaryData['assigned_records__s'][assignmentObject['objectId']]
                     let isValidMaximumSelection = assignmentObject['limitation']['maximumSelection'] == null || assignmentObject['limitation']['maximumSelection'] >= primaryData['assigned_records__s'][assignmentObject['objectId']]
                     // if (isValidMinimumSelection && isValidMaximumSelection) {
                     //     let index = recordAssignment['extras']['temp']['violatedData'][assignmentObject['associationField']].indexOf(primaryData['id'])
                     //     if (index > -1) {
                     //         recordAssignment['extras']['temp']['violatedData'][assignmentObject['associationField']].splice(index, 1)
                     //     }
                     // } else {
                     //     recordAssignment['extras']['temp']['violatedData'][assignmentObject['associationField']].push(primaryData['id'])
                     // }
 
                     // if(primaryData['assigned_records__s'][assignmentObject['objectId']])
                     // console.log("primaryData - unchecked", primaryData);
 
                 }
                 for (let removeCurrentlyAssignedItem of removeCurrentlyAssigned) {
                     let key =
                         assignmentObject['associationField'] +
                         '#' +
                         assignmentData['reference_object_id'] +
                         '#' +
                         removeCurrentlyAssignedItem +
                         '#' +
                         assignmentObject['objectId'] +
                         '#' +
                         item['id'];
 
                     delete recordAssignment['extras']['temp']['assignmentData'][
                         assignmentObject['associationField']
                     ][key];
                 }
 
                 // _.remove(recordAssignment['extras']['assignmentData'][assignmentObject['associationField']], (itemIteration) => {
                 //     return _.includes(removeCurrentlyAssigned, itemIteration['reference_id']) && itemIteration['association_object_id'] == assignmentObject['objectId'] && itemIteration['association_id'] == item['id'];
                 // })
 
                 for (let currentlyUnassignedItem of currentlyUnassigned) {
                     let clonedData = _.cloneDeep(assignmentData);
                     clonedData['association_id'] = item['id'];
                     clonedData['reference_id'] = currentlyUnassignedItem;
                     clonedData['isActive'] = false;
                     let key =
                         clonedData['type'] +
                         '#' +
                         clonedData['reference_object_id'] +
                         '#' +
                         clonedData['reference_id'] +
                         '#' +
                         clonedData['association_object_id'] +
                         '#' +
                         clonedData['association_id'];
 
                     recordAssignment['extras']['temp']['unAssignmentData'][assignmentObject['associationField']][key] = clonedData;
                 }
 
                 // Need to check this code required or not (uniq && concat)
                 item['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'] = _.uniq(_.concat(item['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'], currentlyUnassigned));
             }
         }
         return recordAssignment;
     }
 
     let processCheckedData = (recordAssignment: RecordAssignment, assignmentObject: AssignmentObject, primaryCheckedIds: Array<string>, primaryCheckedData: Array<any>, checkedData: Array<any>): RecordAssignment => {
         let assignmentData = {
             "association_id": "",
             "association_object_id": assignmentObject['objectId'],
             "isActive": true,
             "reference_id": "",
             "reference_object_id": recordAssignment['primaryObject']['objectId'],
             "type": assignmentObject['associationField']
         }
 
         // let checkedData = this.slickGridUtils.getDataByIds(assignmentObject['internalProcess']['angularGrid'], checkedIds);
         for (let item of checkedData) {
             // console.log("recordAssignment - checked item", JSON.stringify(item));
             if (item['assignment__s'][assignmentObject['objectId']]) {
                 let removeCurrentlyUnassigned = _.intersection(primaryCheckedIds, item['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'])
                 let currentlyAssigned = _.difference(primaryCheckedIds, item['assignment__s'][assignmentObject['objectId']]['records']['alreadyAssigned'])
 
                 for (let currentlyAssignedItem of currentlyAssigned) {
                     let clonedData = _.cloneDeep(assignmentData);
                     clonedData['association_id'] = item['id'];
                     clonedData['reference_id'] = currentlyAssignedItem;
 
 
                     let key =
                         clonedData['type'] +
                         '#' +
                         clonedData['reference_object_id'] +
                         '#' +
                         clonedData['reference_id'] +
                         '#' +
                         clonedData['association_object_id'] +
                         '#' +
                         clonedData['association_id'];
 
 
                     recordAssignment['extras']['temp']['assignmentData'][assignmentObject['associationField']][key] = clonedData;
                 }
 
                 for (const primaryData of primaryCheckedData) {
                     if (!primaryData['assignment__s'][assignmentObject['objectId']]['records']['alreadyAssigned'].includes(item['id']) && !primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'].includes(item['id'])) {
                         primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'].push(item['id'])
                     }
                     let index = primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'].indexOf(item['id']);
                     if (index > -1) {
                         primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'].splice(index, 1)
                     }
                     primaryData['assigned_records__s'][assignmentObject['objectId']] = ((primaryData['assignment__s'] && primaryData['assignment__s'][assignmentObject['objectId']] && primaryData['assignment__s'][assignmentObject['objectId']]['records'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['alreadyAssigned'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['alreadyAssigned'].length || 0) + (primaryData['assignment__s'] && primaryData['assignment__s'][assignmentObject['objectId']] && primaryData['assignment__s'][assignmentObject['objectId']]['records'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'].length || 0) - (primaryData['assignment__s'] && primaryData['assignment__s'][assignmentObject['objectId']] && primaryData['assignment__s'][assignmentObject['objectId']]['records'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'] && primaryData['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'].length || 0)) || 0;
                     let isValidMinimumSelection = assignmentObject['limitation']['minimumSelection'] == null || assignmentObject['limitation']['minimumSelection'] <= primaryData['assigned_records__s'][assignmentObject['objectId']]
                     let isValidMaximumSelection = assignmentObject['limitation']['maximumSelection'] == null || assignmentObject['limitation']['maximumSelection'] >= primaryData['assigned_records__s'][assignmentObject['objectId']]
                     if (primaryData['assigned_records__s'][assignmentObject['objectId']] > 0) {
                         if (recordAssignment['assignmentMode'] !== 'ONE_TO_MANY') {
                             primaryData[assignmentObject['fieldName']] = assignmentObject['objectName'];
                         } else {
                             if (!primaryData[assignmentObject['fieldName']]) {
                                 primaryData[assignmentObject['fieldName']] = []
                             }
                             if (!primaryData[assignmentObject['fieldName']].includes(assignmentObject['objectName'])) {
                                 primaryData[assignmentObject['fieldName']].push(assignmentObject['objectName'])
                             }
                         }
                     }
                     // if (isValidMinimumSelection && isValidMaximumSelection) {
                     //     let index = recordAssignment['extras']['temp']['violatedData'][assignmentObject['associationField']].indexOf(primaryData['id'])
                     //     if (index > -1) {
                     //         recordAssignment['extras']['temp']['violatedData'][assignmentObject['associationField']].splice(index, 1)
                     //     }
                     // } else {
                     //     recordAssignment['extras']['temp']['violatedData'][assignmentObject['associationField']].push(primaryData['id'])
                     // }
                     // console.log("primaryData - checked",primaryData);
                 }
                 item['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'] = _.difference(item['assignment__s'][assignmentObject['objectId']]['records']['currentlyUnassigned'], removeCurrentlyUnassigned, item);
 
                 for (let removeCurrentlyUnassignedItem of removeCurrentlyUnassigned) {
                     let key =
                         assignmentObject['associationField'] +
                         '#' +
                         assignmentData['reference_object_id'] +
                         '#' +
                         removeCurrentlyUnassignedItem +
                         '#' +
                         assignmentObject['objectId'] +
                         '#' +
                         item['id'];
                     delete recordAssignment['extras']['temp']['unAssignmentData'][
                         assignmentObject['associationField']
                     ][key];
                 }
 
                 // _.remove(recordAssignment['extras']['unAssignmentData'][assignmentObject['associationField']], (itemIteration) => {
                 //     return _.includes(removeCurrentlyUnassigned, itemIteration['reference_id']) && itemIteration['association_object_id'] == assignmentObject['objectId'] && itemIteration['association_id'] == item['id'];
                 // })
                 item['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'] = _.uniq(_.concat(item['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'], currentlyAssigned));
                 // console.log("recordAssignment - checked --1 ", JSON.stringify(recordAssignment));
             } else {
 
                 item['assignment__s'][assignmentObject['objectId']]['records'] = {
                     "alreadyAssigned": [],
                     "currentlyUnassigned": [],
                     "currentlyAssigned": primaryCheckedIds
                 }
 
                 for (let primaryId of primaryCheckedIds) {
                     let clonedData = _.cloneDeep(assignmentData);
                     clonedData['association_id'] = item['id'];
                     clonedData['reference_id'] = primaryId;
 
                     let key =
                         clonedData['type'] +
                         '#' +
                         clonedData['reference_object_id'] +
                         '#' +
                         clonedData['reference_id'] +
                         '#' +
                         clonedData['association_object_id'] +
                         '#' +
                         clonedData['association_id'];
 
                     recordAssignment['extras']['temp']['assignmentData'][assignmentObject['associationField']][key] = clonedData;
                 }
                 // console.log("recordAssignment - checked --2 ", JSON.stringify(recordAssignment));
             }
         }
         return recordAssignment;
     }
 
 
     let start = (input: {
         recordAssignment: RecordAssignment,
         assignmentObject: AssignmentObject,
         primaryCheckedIds: Array<string>,
         selection: 'checked' | 'unchecked',
         data: Array<any>,
         url:string
     }) => {
         if (input) {
             importScripts(
                input['url']
             );
             let recordAssignment = handleSecondaryDataSelection(
                 input['recordAssignment'],
                 input['assignmentObject'],
                 input['primaryCheckedIds'],
                 input['primaryCheckedData'],
                 input['selection'],
                 input['data']
             );
             Object.keys(recordAssignment['extras']['temp']['assignmentData']).forEach(
                 (associationField) => {
                     recordAssignment['extras']['assignmentData'][
                         associationField
                     ] = Object.values(
                         recordAssignment['extras']['temp']['assignmentData'][associationField]
                     );
                 }
             );
             Object.keys(recordAssignment['extras']['temp']['unAssignmentData']).forEach(
                 (associationField) => {
                     recordAssignment['extras']['unAssignmentData'][
                         associationField
                     ] = Object.values(
                         recordAssignment['extras']['temp']['unAssignmentData'][associationField]
                     );
                 }
             );
             return { 'recordAssignment': recordAssignment, data: input['data'], primaryCheckedData: input['primaryCheckedData'] };
         } else {
             return null;
         }
     };
 
     const runnerResult = {
         executions: 0,
         results: {},
         time: 0,
     };
 
     const startTime = Date.now();
     let recordAssignment = start(input);
 
     const endTime = Date.now();
     runnerResult.time = (endTime - startTime) / 1000;
     runnerResult.results = recordAssignment;
 
     // if (input.worker) {
     postMessage(runnerResult);
     // } else {
     //     return runnerResult;
     // }
 }
 