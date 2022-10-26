

/*   
 *   File: cspfmListSearchListUtils.ts
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import {
    Injectable
} from '@angular/core';
import {
    Router
} from '@angular/router';
import { appUtility } from '../utils/appUtility';
import {
    cspfmSlickgridUtils
} from 'src/core/dynapageutils/cspfmSlickgridUtils';
import {
    FilterFieldInfo,
    FieldDataType
} from 'src/core/models/cspfmFilterFieldInfo.type.js';
import {  MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
    providedIn: 'root'
})
export class cspfmListSearchListUtils {

    constructor(private appUtilityConfig: appUtility, public router: Router, public slickgridUtils: cspfmSlickgridUtils,  public snackBarModule: MatSnackBar) {}

    setWidth() {
        var key = Array.from(document.getElementsByClassName("cs-org-filter-form-label") as HTMLCollection);
        var value = Array.from(document.getElementsByClassName("cs-org-filter-form-sublabel") as HTMLCollection);
        if (key && key.length > 0) {
            for (let i = 0; i < key.length; i++) {
                var keywidth = key[i]['offsetWidth'];
                var valuewidth = value[i]['offsetWidth'];
                if (keywidth >= valuewidth) {
                    value[i]['style']['width'] = (keywidth + 40) + 'px';
                }
            }
        }
    }

    dataFetchNewMethod(info) {
        if (info === "") {
            return 'success';
        } else {
            return 'failed';
        }
    }

    navigationFromComponent(queryParams, redirectUrl: string, navigationURL: string) {
        if (!this.appUtilityConfig.checkPageAlreadyInStack(navigationURL)) {
            queryParams['redirectUrl'] = redirectUrl
        }
        this.router.navigate([navigationURL], {
            queryParams: queryParams,
            skipLocationChange: true
        });
    }

    
    windowHeight(currentDocument) {
        if(this.appUtilityConfig.isTopHorizonatalMenu){
        let toolbarHeight = currentDocument.getElementsByClassName("cs-tool-web")[0]["offsetHeight"];
        let menuheaderHeight = currentDocument.getElementsByClassName("cs-top-menu-list")[0]["offsetHeight"];
        let menuinnerHeight = currentDocument.getElementsByClassName("cs-mat-pageheadtoolbar")[0]["offsetHeight"];
        let windowmenuHeight = currentDocument.getElementsByClassName("cs-mat-contentmain")[0];
        let calctotal = window.innerHeight - (toolbarHeight + menuheaderHeight + menuinnerHeight + 25);
        windowmenuHeight["style"]["height"] = calctotal + "px";
    }
    }
    prepareFormulaAndRollupFieldInfo(hierarchyJSON, formulaAndRollupFieldInfo) {
        if (hierarchyJSON['formulaField'] && hierarchyJSON['formulaField'].length > 0) {
            hierarchyJSON['formulaField'].forEach(element => {
                if (formulaAndRollupFieldInfo["pfm" + hierarchyJSON['objectId']]) {
                    formulaAndRollupFieldInfo["pfm" + hierarchyJSON['objectId']].push(element['fieldName'] + "__f")
                } else {
                    let infoArray = []
                    infoArray.push(element['fieldName'] + "__f")
                    formulaAndRollupFieldInfo["pfm" + hierarchyJSON['objectId']] = infoArray;
                }
            });
        }

        if (hierarchyJSON['rollupField'] && hierarchyJSON['rollupField'].length > 0) {
            hierarchyJSON['rollupField'].forEach(element => {
                if (formulaAndRollupFieldInfo["pfm" + hierarchyJSON['objectId']]) {
                    formulaAndRollupFieldInfo["pfm" + hierarchyJSON['objectId']].push(element['fieldName'] + "__r")
                } else {
                    let infoArray = []
                    infoArray.push(element['fieldName'] + "__r")
                    formulaAndRollupFieldInfo["pfm" + hierarchyJSON['objectId']] = infoArray;
                }
            });
        }

        if (hierarchyJSON['childObject'].length > 0) {
            hierarchyJSON['childObject'].forEach(element => {
                this.prepareFormulaAndRollupFieldInfo(element, formulaAndRollupFieldInfo);
            });
        }
    }

    async presentToast(message) {
        this.snackBarModule.open(message, '', { duration: 2000 }); 
    }
    getFlatpickrInstanceKeyName(filterFieldInfo: FilterFieldInfo, index) {
        var val = index ? (filterFieldInfo['objectName'] + '#' + filterFieldInfo['fieldName'] + '#' + index) : (filterFieldInfo['objectName'] + '#' + filterFieldInfo['fieldName']);
        return val;
    }

    onScroll(event, flatpickrInstance, layoutId) {
        if (flatpickrInstance) {
            if ((flatpickrInstance.element.getBoundingClientRect()['bottom'] <= document.getElementById(layoutId).getBoundingClientRect()['bottom']) ||
                (flatpickrInstance.element.getBoundingClientRect()['top'] >= document.body.getBoundingClientRect()['bottom'])) {
                flatpickrInstance.close()
            } else {
                flatpickrInstance._positionCalendar(flatpickrInstance.element)
            }
        }
    }

    removeSelectedItem(item, filterFieldInfo: FilterFieldInfo) {
        if (typeof (item) === 'string') {
            var tempItem = item;
            filterFieldInfo['displayInfo']['input'].forEach(element => {
                if (element['label'] === tempItem) {
                    item = element;
                }
            });
        }
        item.isChecked = false;
        filterFieldInfo['displayInfo']['selected'].splice(filterFieldInfo['displayInfo']['selected'].indexOf(item), 1)
        var index = filterFieldInfo['displayInfo']['input'].findIndex(element => element['value'] === item.value);
        if (index > -1) {
            filterFieldInfo['displayInfo']['input'][index]['isChecked'] = false
        }
        (filterFieldInfo['fieldValue'] as Array < FieldDataType > ).splice((filterFieldInfo['fieldValue'] as Array < FieldDataType > ).indexOf(item['value']), 1)
    }

    toggleSelectedItem(item, filterFieldInfo: FilterFieldInfo) {

        item['isChecked'] = !item['isChecked'];
      
        if (item['isChecked']) {
            filterFieldInfo['displayInfo']['selected'].push(item);
            (filterFieldInfo['fieldValue'] as Array<FieldDataType>).push(item['value'])
        } else {
            var index = filterFieldInfo['displayInfo']['selected'].findIndex(element => element['value'] === item['value']);
            if (index > -1) {
                filterFieldInfo['displayInfo']['selected'].splice(index, 1)
            }
            (filterFieldInfo['fieldValue'] as Array<FieldDataType>).splice((filterFieldInfo['fieldValue'] as Array<FieldDataType>).indexOf(item['value']), 1)
      
        }
      }

    reverseHierarchySetForInerLevel(hierarchyJson, objId) {
        if (!(objId.includes('staticreport') || objId.includes('rollup') || objId.includes('formula'))) {
            const typeWithoutPfm = objId.replace('pfm', '')
            if (hierarchyJson["objectId"] === typeWithoutPfm) {
                return { 'hierarchyJson': hierarchyJson, 'objectType': hierarchyJson['objectType'] }
            } else if (hierarchyJson['childObject'] !== '') {
                return this.reverseHierarchySetForInerLevel(hierarchyJson['childObject'][0], objId)
            } else {
                return {}
            }
        }
    }
}