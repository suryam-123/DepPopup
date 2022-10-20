import { Injectable } from '@angular/core';
import { FlatpickrOption } from 'angular-slickgrid';
import { appUtility } from './appUtility';

@Injectable({
  providedIn: 'root'
})
export class cspfmFlatpickrConfig {
  public selectedRowData : any;

  constructor(public appUtility: appUtility) { }

  getDateEditorOptions(params): FlatpickrOption {
    return {
      enableTime: params['enableTime'],
      noCalendar: params['noCalendar'] ? params['noCalendar'] : false,
      onReady: (selectedDates, dateStr, instance) => {
        instance['params'] = params
        instance['params']['initialValue'] = selectedDates[0]
        this.flatpickrOnReady(instance)
      },
      onMonthChange: (selectedDates, dateStr, instance) => {
        this.flatpickrOnMonthChange(instance)
      },
      onClose: (selectedDates: Date[] | Date, dateStr: string, instance: any) => {
        if (instance['params']['onOkButtonClick'] && !instance['params']['isOkButtonPressed']) {
          instance['params']['isOkButtonPressed'] = true;
          instance['params']['onOkButtonClick']();
        }
        return;
      },
      onChange: (selectedDates: Date[] | Date, dateStr: string, instance: any) => {
        if (instance['params']['noCalendar']) {
      
          if(this.selectedRowData){
           var date = this.selectedRowData['dataContext']['date'];
          instance.setDate(selectedDates[0].setFullYear(date.getFullYear(),date.getMonth(),date.getDate()))
          
          }
         }
        return;
      },
      onKeyDown: (selectedDates: Date[] | Date, dateStr: string, instance: any) => {
        return
      },
      onOpen: (selectedDates: Date[] | Date, dateStr: string, instance: any) => {
        instance['params']['isOkButtonPressed'] = false;
        return;
      }
    } as FlatpickrOption
  }

  flatpickrOnMonthChange(instance) {
    document.getElementById('flatpickr-custom-year-select')['value'] = '' + instance.currentYear;
  }

  flatpickrOnReady(instance) {
    if (instance.config.enableTime) {
      instance.now = new Date(new Date().toLocaleString('en-US', { timeZone: this.appUtility.userTimeZone }))
    } else {
      instance.now = new Date(new Date().toLocaleString('en-US', { timeZone: this.appUtility.orgTimeZone }))
    }

    var listeners = instance['params']['listeners']
    if (instance['params']['noCalendar']) {
      if (listeners.length > 0) {
        this.removeEventListener(listeners)
      }
      if (instance['params']['isfilterOrEntry']) {
        this.setFilterEntryConfig(instance)
      } else {
        this.addFlatpickrEventListeners(instance)
      }
      return
    }
    const flatpickrYearElement = instance.currentYearElement;

    // const children = flatpickrYearElement.parentElement.children;
    // for (let i in children) {
    //   if (children.hasOwnProperty(i)) {
    //     children[i].style.display = 'none';
    //   }
    // }

    // const yearSelect = document.createElement('select');
    // var minDate = new Date();
    // minDate.setFullYear(minDate.getFullYear() - 100);
    // minDate.setMonth(0);
    // minDate.setDate(1);
    // minDate.setHours(0, 0, 0, 0);
    // var maxDate = new Date();
    // maxDate.setFullYear(maxDate.getFullYear() + 50);
    // maxDate.setMonth(11);
    // maxDate.setDate(31);
    // maxDate.setHours(23, 59, 58, 999);
    // instance.config._minDate = minDate;
    // instance.config._maxDate = maxDate;
    // const minYear = new Date(instance.config._minDate).getFullYear();
    // const maxYear = new Date(instance.config._maxDate).getFullYear();

    // for (let i = minYear; i <= maxYear; i++) {
    //   const option = document.createElement('option');
    //   option.value = '' + i;
    //   option.text = '' + i;
    //   yearSelect.appendChild(option);
    // }
    // yearSelect.addEventListener('change', (event) => {
    //   flatpickrYearElement.value = event.target['value'];
    //   instance.changeYear(parseInt(event.target['value']));
    // });

    // yearSelect.className = 'flatpickr-monthDropdown-months';
    // yearSelect.id = 'flatpickr-custom-year-select';
    // yearSelect.value = instance.currentYearElement.value;

    // flatpickrYearElement.parentElement.appendChild(yearSelect);

    let confirmContainer = instance._createElement("div", 'flatpickr-confirm cs-cur' + " " + ("") + " " + 'light' + "Theme", 'Ok');
    confirmContainer.tabIndex = -1;
    confirmContainer.innerHTML += "";
    instance['params']['confirmContainer'] = confirmContainer;
    confirmContainer.id = instance['params']['idvalue']

    if (listeners.length > 0) {
      this.removeEventListener(listeners)
    }
    if (instance['params']['isfilterOrEntry']) {
      this.setFilterEntryConfig(instance)
    } else {
      this.addFlatpickrEventListeners(instance)
    }
    instance.monthNav.appendChild(confirmContainer)
    instance.loadedPlugins.push("confirmDate");

    instance.redraw()
  }

  addFlatpickrEventListeners(instance) {
    var params = instance['params']
    var listeners = params['listeners']
    var enableTime = params['enableTime']
    var confirmContainer = instance['params']['confirmContainer']
    if (confirmContainer) {
      listeners.push(this.addEventListener(confirmContainer, "click", (event) => {
        params['isOkButtonPressed'] = true;
        instance.close();
        if (params['onOkButtonClick']) {
          params['onOkButtonClick']();
        }
        this.removeEventListener(listeners);
      }, false))
    }

    listeners.push(this.addEventListener(instance.calendarContainer, "keydown", (event) => {
      let eventTarget = this.getEventTarget(event);
      if (enableTime &&
        event.key === "Tab" &&
        eventTarget === instance.amPM) {
        event.preventDefault();
        confirmContainer.focus();
      }
      else if (event.key === "Enter") {
        params['isOkButtonPressed'] = true;
        instance.close();
        if (params['onOkButtonClick']) {
          params['onOkButtonClick']();
        }
        this.removeEventListener(listeners);
      }
    }, false))
    // if (!instance['params']['isfilterOrEntry']) {
    //   listeners.push(this.addEventListener(document.body, "click", (event) => {
    //     let eventTarget = this.getEventTarget(event);
    //     if (!instance.calendarContainer) {
    //       this.removeEventListener(listeners);
    //       return;
    //     }
    //     let isViewContains = (instance.calendarContainer as HTMLElement).contains(eventTarget)
    //     if (isViewContains === false) {
    //       if(instance.config.noCalendar){
    //         params['isOkButtonPressed'] = true;
    //       }else{
    //         instance.setDate(instance['params']['initialValue'])
    //       }
    //       instance.close();
    //       if (params['onOkButtonClick']) {
    //         params['onOkButtonClick']();
    //       }
    //       this.removeEventListener(listeners);
    //     }
    //   }, false));
    // }
  }

  setFilterEntryConfig(instance) {
    instance.config.closeOnSelect = false
    instance.config.altInput = true
    instance.config.allowInput = true
    if (instance.config.noCalendar && instance.config.enableTime) {
      instance.config.dateFormat = this.appUtility.hoursFormat
      instance.config.altFormat = this.appUtility.hoursFormat
    } else {
      if (instance.config.enableTime) {
        instance.config.dateFormat = this.appUtility.userDateTimePickerFormat
        instance.config.altFormat = this.appUtility.userDateTimePickerFormat
      } else {
        instance.config.dateFormat = this.appUtility.userDatePickerFormat
        instance.config.altFormat = this.appUtility.userDatePickerFormat
      }
    }
  }

  getEventTarget(event) {
    try {
      if (typeof event.composedPath === "function") {
        var path = event.composedPath();
        return path[0];
      }
      return event.target;
    }
    catch (error) {
      return event.target;
    }
  }

  addEventListener(element: HTMLElement, eventType: string, handler: (event) => any, option) {
    element.addEventListener(eventType, handler, option);
    return {
      element: element,
      eventType: eventType,
      handler: handler,
      option: option
    }
  }

  removeEventListener(listeners) {
    listeners.forEach(listener => {
      listener.element.removeEventListener(listener.eventType, listener.handler, listener.option);
    })
    listeners = [];
  }

}
