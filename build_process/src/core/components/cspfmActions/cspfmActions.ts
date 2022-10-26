

/* 
 *   File: cspfmActions.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component,  Input } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { cspfmActionDataServices } from 'src/core/utils/cspfmActionDataServices';


@Component({
  selector: 'cspfmactions',
  templateUrl: './cspfmActions.html',
  styleUrls: ['./cspfmActions.scss'],
})

export class cspfmActions {
  public iconName = '';
  constructor(public callNumber: CallNumber, public sms: SMS,
    public emailComposer: EmailComposer, public pfmService: cspfmActionDataServices) { }
  public actionData = {};
  public layoutActionJson;
  public dataObj = '';

  @Input() set actionJson(configJson: string) {
    this.layoutActionJson = (configJson !== undefined && configJson !== null) ? configJson : '';
    this.setActionIcon();
  }

  @Input() set dataObject(selectedDataObejct: string) {
    this.dataObj = (selectedDataObejct !== undefined && selectedDataObejct !== null) ? selectedDataObejct : '';
  }

  setActionIcon() { 
    if (this.layoutActionJson['actionType'] === 'CALL') {
      this.iconName = 'call';
    } else if (this.layoutActionJson['actionType'] === 'SMS') {
      this.iconName = 'chatboxes';
    } else if (this.layoutActionJson['actionType'] === 'MAIL') {
      this.iconName = 'mail';
    }
  }

  mobileClickActions() {
    this.actionData = this.pfmService.makeActionData(this.layoutActionJson, this.dataObj);
    this.makeActions();
  }

  makeActions() {
    if (this.layoutActionJson['actionType'] === 'CALL') {
      this.makeCall();
    } else if (this.layoutActionJson['actionType'] === 'SMS') {
      this.makeSms();
    } else if (this.layoutActionJson['actionType'] === 'MAIL') {
      this.makeMail();
    }

  }

  makeCall() {
    this.callNumber.callNumber(this.actionData['phoneNumber'], true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  

  makeSms() {
    this.sms.send(this.actionData['phoneNumber'], this.actionData['message']).
      then(() => console.log('sms success'))
      .catch(() => console.log('sms error'));
  }

  makeMail() {
    let email = {
      to: this.actionData['to'],
      cc: this.actionData['cc'],
      bcc: this.actionData['bcc'],
      attachments: [],
      subject: this.actionData['subject'],
      body: this.actionData['body'],
      isHtml: true
    };
    this.emailComposer.open(email).then(() => 
    console.log('mail success')).catch(() => console.log('mail error'));
  }

}
