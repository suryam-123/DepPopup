import { Injectable } from '@angular/core';
import { dataProvider } from '../utils/dataProvider';
import { metaDbConfiguration } from '../db/metaDbConfiguration';
import { metaDataDbProvider } from 'src/core/db/metaDataDbProvider';


@Injectable({
  providedIn: 'root'
})

export class cspfmUserAssignmentService {

  constructor(private dbService: dataProvider, private metaDbConfig: metaDbConfiguration, private metaDbProvider: metaDataDbProvider) {
 
  }

  fetchUserAssignment(keys, dataSource) {
    return this.dbService.getUserAssignmentData(keys, dataSource).then(res => {
      return res;
    }).catch(err => {
      return ''
    })
  }

  makeInQuery(idList, objectName, fieldName) {
    if (idList.length === 0) {
      return "type:" + objectName + " AND " + fieldName + ":null"
    } else {
      return "type:" + objectName + " AND " + fieldName + ":" + "(" + idList.join(' ') + ")"
    }
  }


  makeInQueryWithOr(idList, objectName, fieldName, oRFieldName, orIdList) {
    return `type: ${objectName} AND (${fieldName}:(${idList.join(' ')}) OR ${oRFieldName}:(${orIdList}))`
  }

}