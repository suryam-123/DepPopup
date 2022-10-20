/* 
 *   File: cspfmFormula.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormulaConfig } from '../../models/cspfmFormulaConfig.type';
import { cspfmFormulaService } from '../../services/cspfmFormula.service';
import { appUtility } from 'src/core/utils/appUtility';
@Component({
  selector: 'cspfmformula',
  templateUrl: './cspfmFormula.html',
  styleUrls: ['./cspfmFormula.scss']
})
export class cspfmFormula implements OnInit, OnChanges {
  @Input() label: string = '';
  @Input() config: FormulaConfig;
  @Input() precision: number = 0;
  @Input() data: any = {};
  @Input() currencyCode: string = ''
  @Input() defaultValue: string | number | boolean;
  @Input() dataSource: string = '';
  @Input() fieldName: string = '';
  @Input() objectName: string = '';
  @Input() traversalPath: string = '';
  @Input() formulaDependentFlag: boolean;
  @Input() dependentNumberCount:number;
  @Output() calculated: EventEmitter<{
    config: FormulaConfig, result: any,
    traversalPath: string, fieldName: string, objectName: string
  }> = new EventEmitter();

  public formulaResult: any;
  public isDisplayPropAvailable: boolean;

  constructor(private formulaService: cspfmFormulaService, public appUtilityObject: appUtility) { }

  ngOnInit() {
    this.isDisplayPropAvailable = (this.config['displayProp'] && this.config['displayProp']['currency']) ? true : false;
    setTimeout(() => {
      this.calculateValue();
    }, 0);
  }

  ngOnChanges() {
    setTimeout(() => {
      this.calculateValue();
    }, 0);
  }

  calculateValue() {
    if (this.data !== undefined && this.data !== null
      && Object.entries(this.data).length > 0 && this.data.constructor === Object) {
      this.formulaResult = this.formulaService.evaluate(this.config, this.data,true);
      this.calculated.emit({
        config: this.config,
        result: this.formulaResult,
        traversalPath: this.traversalPath,
        fieldName: this.fieldName,
        objectName: this.objectName
      })
    }
  }
}
