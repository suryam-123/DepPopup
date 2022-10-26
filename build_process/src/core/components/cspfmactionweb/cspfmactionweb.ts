

/* 
 *   File: cspfmactionweb.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'cspfmactionweb',
  templateUrl: './cspfmactionweb.html',
  styleUrls: ['./cspfmactionweb.scss'],
})
export class cspfmactionweb implements OnInit {
  actionConfig;
  selectedItem;


  @Output() OnAction: EventEmitter<any> = new EventEmitter();

  constructor() { 
  }

  actionButtonClick(action) {
    this.OnAction.emit({"dataContext": this.selectedItem, "actionInfo": action});
    event.stopPropagation();
  }

  ngOnInit() {
  }

}
