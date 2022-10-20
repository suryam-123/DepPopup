import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class themeChanger {

  private theme: BehaviorSubject<String>;
  private defaultTheme = '';
  constructor() {
    this.theme = new BehaviorSubject(this.defaultTheme);
  }


  setActiveTheme(val) {
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }


  changeTheme(selectedTheme) {
    let theme = JSON.parse(selectedTheme);
    console.log("changeTheme theme = ", theme);

    var cssTag = document.createElement('style');
    document.getElementById('customTheme') != null ? document.getElementById('customTheme').remove() : 0;
    var css = `.drawer-content .row ion-col > .card > .label:nth-child(1) {
      background: ${theme['primary']};
    }
    .toolbar-background-ios, .toolbar-background-md {
      background: ${theme['primary']};
    }
    .footer-md .button-md, .footer-ios .button-ios {
      background: ${theme['primary']};
      color: ${theme['secondary']};
    }
    .bar-button-default-ios, .bar-button-default.bar-button-ios-default, .bar-button-clear-ios-default, .toolbar-title-ios {
      color: ${theme['secondary']};
      font-weight: 400;
    }
    .bar-button-default-md, .bar-button-clear-md-default, .bar-button-md-default, .toolbar-title-md {
      color: ${theme['secondary']};
      font-weight: 400;
    }
    .alert-ios .alert-head h2.alert-title, .alert-md .alert-head h2.alert-title {
      color: ${theme['primary']};
    }
    .alert-ios .alert-head h3.alert-sub-title, .alert-md .alert-head h3.alert-sub-title {
      color: ${theme['secondary']};
    }
    .alert-ios .alert-button-group .button-inner, .alert-md .alert-button-group .button-inner {
      color: ${theme['primary']};
    }
    .alert-md [aria-checked=true] .alert-radio-inner, .alert-ios [aria-checked=true] .alert-radio-inner {
      background: ${theme['barbg']};
    }
    .alert-ios .alert-radio-icon, .alert-md .alert-radio-icon {
      background: ${theme['primary']};
    }
    .radio.radio-ios .radio-icon, .radio.radio-md .radio-icon {
      background: ${theme['secondarylow']};
    }
    .radio.radio-ios .radio-icon.radio-checked .radio-inner, .radio.radio-md .radio-icon.radio-checked .radio-inner {
      background: ${theme['primary']};
    }
    .alert-md [aria-checked=true] .alert-checkbox-icon, .alert-ios [aria-checked=true] .alert-checkbox-icon {
      background: ${theme['primary']};
    }
    .alert-md [aria-checked=true] .alert-checkbox-icon .alert-checkbox-inner, .alert-ios [aria-checked=true] .alert-checkbox-icon .alert-checkbox-inner {
      border-color: ${theme['secondary']};
    }
    .picker-md .picker-columns .picker-opt.picker-opt-selected {
      color: ${theme['primary']};
    }
    .picker-ios .picker-columns .picker-opt.picker-opt-selected {
      color: ${theme['secondary']};
    }
    .toggle-ios.toggle-checked .toggle-icon .toggle-inner, .toggle-md.toggle-checked .toggle-icon .toggle-inner {
      background: ${theme['primary']};
    }
    .searchbar-ios.searchbar-animated.searchbar-show-cancel .searchbar-ios-cancel {
      background: ${theme['primary']};
      color: ${theme['secondary']};
    }
    .menu-inner .list-md .list-header-md, .menu-inner .list-ios .list-header-ios, .list-ios .item-ios.list-header, .list-md .item-md.list-header {
      background: ${theme['barbg']};
    }
    .menu-inner .item-block.item-md ion-icon, .menu-inner .item-block.item-ios ion-icon {
      color: ${theme['primary']};
    }
    .cs-navigation-link {
      text-decoration: underline ${theme['primary']};
      color: ${theme['primary']} !important;
  }`;
    cssTag.setAttribute('id', 'customTheme');
    cssTag.textContent = css;
    document.head.appendChild(cssTag);
  }

}
