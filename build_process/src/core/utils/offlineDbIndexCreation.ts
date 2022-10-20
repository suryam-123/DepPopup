import { Injectable } from '@angular/core';
import { dbProvider } from '../db/dbProvider';
import { attachmentDbConfiguration } from '../db/attachmentDbConfiguration';
import { attachmentDbProvider } from '../db/attachmentDbProvider';
import { dbConfiguration } from '../db/dbConfiguration';
import { formulaDbProvider } from '../db/formulaDbProvider';

@Injectable({
  providedIn: 'root'
})
export class offlineDbIndexCreation {

  public isIndexCreated = false;
  public indexCreationProcessingMsg = '';
  constructor(public dbProvider: dbProvider, public dbConfigObj: dbConfiguration, public attachmentConfigObj: attachmentDbConfiguration,
    public attachmentDbProvider: attachmentDbProvider, public formulaDbProvider: formulaDbProvider) {

  }
  createIndex() {

    this.isIndexCreated = false;
    const taskList = [];

    if (this.dbConfigObj.configuration.indexingObject.length > 0) {
      taskList.push(this.dbProvider.indexCreation(['data.type']))
      taskList.push(this.dbProvider.indexCreation(['data.type', '_id']))
      this.dbConfigObj.configuration.indexingObject.forEach(field => {
        taskList.push(this.dbProvider.indexCreation(["data.type", "data." + field]))
      })
    }
    if (this.attachmentConfigObj.configuration.attachmentIndexingObject.length > 0) {
      this.attachmentConfigObj.configuration.attachmentIndexingObject.forEach(field => {
        taskList.push(this.attachmentDbProvider.indexCreation(["data.type", "data." + field]))
      })
    }
    taskList.push(this.dbProvider.startQuery("type_createdby_docid_view"));
    taskList.push(this.dbProvider.startQuery("masterdetailview"));
    taskList.push(this.dbProvider.startQuery("masterdetail_createdby_docid_view"));
    taskList.push(this.dbProvider.startQuery("masterdetail_createdby_view"));
    taskList.push(this.formulaDbProvider.startQuery("formulaView"));
    taskList.push(this.formulaDbProvider.startQuery("rollupView"));
    Promise.all(taskList).then(res => {
      if (res.length === taskList.length) {
        // const syncEndTimeAfterindex = new Date().getTime()
        // const seconds = (syncEndTimeAfterindex - syncEndTimeBeforeindex) / 1000;
        // if (seconds > 60) {
        //   const minutes = Math.floor(seconds / 60);
        //   stageObject.synctime = minutes + " m"
        // } else {
        //   stageObject.synctime = Math.floor(seconds % 60) + " s"
        // }
        // stageObject.status = 'completed';
        this.isIndexCreated = true;
        // const response = {
        //   "stage5Completed": true
        // }
      } else {
        this.isIndexCreated = false;
      }
    }).catch(res => {
      this.isIndexCreated = false;
    })
  }
}
