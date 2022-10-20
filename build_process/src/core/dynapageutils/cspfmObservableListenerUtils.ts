import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class cspfmObservableListenerUtils {
  private limit = {
    maxListeners: null,
    maxSubscriptionPerListener: null,
  };
  private listeners: {
    [listenerName: string]: {
      [subscriptionId: string]: Subscriber<any>;
    };
  } = {};
  constructor() { }

  emit(listenerName: string, data: any) {
    if (this.listeners[listenerName]) {
      Object.values(this.listeners[listenerName]).forEach((subscriber) => {
        subscriber.next(data);
      });
    } else {
      console.warn('No listener register for ' + listenerName);
    }
  }

  subscribe(listenerName: string, callback: (data) => any): string {
    if (this.limit.maxListeners != null &&
      !Object.keys(this.listeners).includes(listenerName) &&
      Object.keys(this.listeners).length >= this.limit.maxListeners
    ) {
      console.error('Maximum listener limit reached. Your request cancelled');
      return;
    }
    if (!this.listeners[listenerName]) {
      this.listeners[listenerName] = {};
    }

    if (this.limit.maxSubscriptionPerListener != null &&
      Object.keys(this.listeners[listenerName]).length >=
      this.limit.maxSubscriptionPerListener
    ) {
      console.error(
        'Maximum listener subscription reached for ' +
        listenerName +
        '. Your subscription ignored'
      );
      return;
    }

    let subscriptionId = uuid.v4();
    console.log('subscriptionId', subscriptionId);
    let observable = new Observable((subscriber: Subscriber<any>) => {
      this.listeners[listenerName][subscriptionId] = subscriber;
    });
    observable.subscribe(callback);
    return subscriptionId;
  }

  unsubscribe(listenerName: string, subscriptionId: string) {
    if (listenerName === undefined || listenerName === null) {
      console.warn('Invalid listener name : ' + listenerName);
      return;
    }
    if (subscriptionId === undefined || subscriptionId === null) {
      console.warn('Invalid subscription id : ' + subscriptionId);
      return;
    }
    if (this.listeners[listenerName]) {
      if (this.listeners[listenerName][subscriptionId]) {
        this.listeners[listenerName][subscriptionId].unsubscribe();
        delete this.listeners[listenerName][subscriptionId];
        if (Object.keys(this.listeners[listenerName]).length === 0) {
          delete this.listeners[listenerName];
        }
      } else {
        console.warn('No subscription available for ' + subscriptionId);
      }
    } else {
      console.warn('No listener register for ' + listenerName);
    }
  }

  checkSubscription(
    listenerName: string,
    subscriptionId: string
  ): { status: 'invalid-input' | 'subscribed' | 'not-subscribed' } {
    if (listenerName === undefined || listenerName === null) {
      console.warn('Invalid listener name : ' + listenerName);
      return { status: 'invalid-input' };
    }
    if (subscriptionId === undefined || subscriptionId === null) {
      console.warn('Invalid subscription id : ' + subscriptionId);
      return { status: 'invalid-input' };
    }
    if (
      this.listeners[listenerName] &&
      this.listeners[listenerName][subscriptionId]
    ) {
      return { status: 'subscribed' };
    }
    return { status: 'not-subscribed' };
  }

  printListeners() {
    console.info('Listeners', this.listeners);
  }

  clear() {
    Object.keys(this.listeners).forEach((listenerName) => {
      Object.keys(this.listeners[listenerName]).forEach((subscriptionId) => {
        this.unsubscribe(listenerName, subscriptionId);
      });
    });
  }

  /**
   * 
   * @param listenerSearchKey 
   * @param searchOperator 
   */
  remove(listenerSearchKey: string, searchOperator: '*a' | '*z' | '==' | '!=' | '*c*') {
    Object.keys(this.listeners).forEach((listenerName) => {
      if (this.compare(listenerName, listenerSearchKey, searchOperator)) {
        Object.keys(this.listeners[listenerName]).forEach((subscriptionId) => {
          this.unsubscribe(listenerName, subscriptionId);
        });
      }
    });
  }
  private compare(leftOperand: string, rightOperand: string, operator: '*a' | '*z' | '==' | '!=' | '*c*'): boolean {
    if (operator === '*a') {
      return leftOperand.startsWith(rightOperand)
    }
    if (operator === '*z') {
      return leftOperand.endsWith(rightOperand)
    }
    if (operator === '==') {
      return leftOperand === rightOperand
    }
    if (operator === '!=') {
      return leftOperand !== rightOperand
    }
    if (operator === '*c*') {
      return leftOperand.includes(rightOperand)
    }
  }

  getUUID() {
    return uuid.v4();
  }
}
