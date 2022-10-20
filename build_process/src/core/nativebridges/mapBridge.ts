import { Injectable } from '@angular/core';
import { dbProvider } from '../db/dbProvider';
import { Platform } from '@ionic/angular';
import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';


@Injectable({
  providedIn: 'root'
})
export class mapBridge {
  public subscription;
  public alldocs;
  constructor(public serviceProvider: dbProvider,
    public platform: Platform, public broadcaster: Broadcaster, public file: File, private appPreferences: AppPreferences) {
  }

  startObserver() {
    this.subscription = this.broadcaster.addEventListener('FetchMapRecords').subscribe((userinfo) => {
      console.log('userinfo = ', userinfo);

      const syncDetail = JSON.parse(userinfo.syncInfo);
      if (syncDetail.syncType === 'StopObserver') {
        this.stopObserver();
      } else if (syncDetail.syncType === 'SingleRecord') {
        this.getDetailDocument(syncDetail);
      } else if (syncDetail.syncType === 'AllRecords') {
        this.fetchDataFromPouch(syncDetail);
      } else {
        console.log('Invalid input');
      }
    }, err => {
      console.log('Subscription error', err);
    });
  }

  stopObserver() {
    this.subscription.unsubscribe();
  }
  // Response to native
  sendResponceToNative(placeName, status, filename) {
    setTimeout(() => {
      this.broadcaster.fireNativeEvent('MapSyncNotification',
       { 'placeName': placeName, 'status': status, 'fileName': filename }).then(() => {
      });
      }, 2000);
  }
  sendSingleResponceToNative(data, status) {
    setTimeout(() => {
      this.broadcaster.fireNativeEvent('MapRecordDetailNotification', { 'status': status, 'recordDetail': data }).then(() => {
      });
    }, 2000);
  }
  // Get single document by id
  getDetailDocument(fetchDetail) {
    this.serviceProvider.fetchDocWithoutRelationshipByTypeAndId(fetchDetail.fetchData.tableName, fetchDetail.fetchData.id)
      .then(res => {
        if (res['status'] === 'SUCCESS') {
          if (res['records'].length > 0) {
            const data = res['records'];
            this.sendSingleResponceToNative(data, 'Success');
          } else {
            this.sendSingleResponceToNative('Record not found', 'Failed');
          }
        } else {
          this.sendSingleResponceToNative('Record not found', 'Failed');
        }
      }).catch((err) => {
        this.sendSingleResponceToNative('Record not found', 'Failed');
      });
  }

  // Get all document

  fetchDataFromPouch(fetchDetail) {

    const tablelist = fetchDetail.fetchData;
    tablelist.forEach(tabledata => {

      // Make fields unique
      const uniqueFields = tabledata.fieldDetails.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });

      // //Check id field available if available then replace with _id
      // if (uniqueFields.indexOf('id') > -1) {
      //   uniqueFields.splice(uniqueFields.indexOf('id'), 1, '_id');
      // }

      // //Modify rel style fields (All elements within data key)
      // var fieldsWithRelStyle = uniqueFields.map(function (val) {
      //   if (val != '_id') {
      //     val = 'data.' + val
      //   }
      //   return val
      // });

      // Check _id is available in fields array if not available then add the _id, because _id must for rel fetch
      if (uniqueFields.indexOf('_id') < 0) {
        uniqueFields.push('_id');
      }


      // Updated data validation
      if (!tabledata.lastmodifiedon || tabledata.lastmodifiedon === 0) {
        tabledata.lastmodifiedon = 0;
      }
      // 'data.last_modified_on': { $gte: tabledata.last_modified_on },
      const selector = { 'data.lastmodifiedon': { $gte: tabledata.lastmodifiedon }, 'data.type': tabledata.tableName };
      const options = {};
      options['selector'] = selector;
      console.log('options = ', options);

      this.serviceProvider.fetchDocsWithRelationshipUsingFindOption(options, false)
        .then(res => {
          if (res['status'] === 'SUCCESS') {
            const data = res['records'];
            if (data.length > 0) {
              const resultData = {
                records: data,
                recordsCount: data.length
              };
              this.writeDataAsJson(tabledata.placeName, JSON.stringify(resultData));
            } else {
              this.sendResponceToNative(tabledata.placeName, 'NoData', '');
            }
          } else {
            this.sendResponceToNative(tabledata.placeName, 'NoData', '');
          }
        });

    });

  }
  // Write all documents as json in local directory(ios:library/nocloud,Android:files)
  writeDataAsJson(placeName, jsondata) {
    this.getPath().then((path) => {
      if (path) {

        const options = {
          replace: true
        };
        const fileName = placeName;
        this.file.writeFile(path, fileName + '.json', jsondata, options).then(() => {
          this.sendResponceToNative(placeName, 'Success', fileName);

        }).catch((err) => {
          this.sendResponceToNative(placeName, 'Failed', '');

        });
      } else {
        this.sendResponceToNative(placeName, 'Failed', '');
      }
    }).catch((err) => {
      this.sendResponceToNative(placeName, 'Failed', '');
    });
  }

  // Get directory path, if directory not available then create it
  getPath() {
    return this.appPreferences.fetch('selectedappId').then((res) => {
      console.log('selectedappId base app= ', res);
      return Promise.resolve(this.file.checkDir(this.file.dataDirectory, 'Dyna_UI/' + res + '/MapData/').then(
        (exists) => {
          return this.file.dataDirectory + 'Dyna_UI/' + res + '/MapData/';
        })
        .catch((exception) => {
          return this.file.createDir(this.file.dataDirectory, 'Dyna_UI/' + res + '/MapData/', false).then(
            (dirEntry) => {
              return this.file.dataDirectory + 'Dyna_UI/' + res + '/MapData/';
            }).catch((error) => {
              if (exception.message = 'PATH_EXISTS_ERR') {
                return this.file.dataDirectory + 'Dyna_UI/' + res + '/MapData/';
              }
            });
        }));
    });
  }
}
