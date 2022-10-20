import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as Color from 'color';
import { Storage } from '@ionic/storage-angular';
import { appUtility } from '../utils/appUtility';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})



export class themechange {

  public themenewColor;
  private materialtheme: BehaviorSubject<String>;
  private defaultMaterialTheme = 'blueTheme';
  private storageInstance : Storage | null = null;
  constructor(
    @Inject(DOCUMENT) private document: Document, private storage: Storage,public apputility:appUtility) {

    this.init() 

  }

  async init() {
    this.materialtheme = new BehaviorSubject(this.defaultMaterialTheme);
   this.storageInstance = await this.storage.create();
    if (this.storageInstance) {
      this.storageInstance.get('theme').then(cssText => {
        this.setGlobalCSS(cssText);
      });
    }
  }
  changeToStyleOne() {
    var style = document.querySelector('ion-router-outlet');
    style.setAttribute('class', 'hydrated');
    var toolbar = document.querySelector('ion-toolbar');
    toolbar.setAttribute('color', 'primary');
    if (!this.apputility.isMobileResolution) {
      setTimeout(() => {
        var totheader = this.document.getElementsByClassName('cs-tool-web');
        totheader[0].setAttribute('color', 'primary');
      }, 1000);
      var style = document.querySelector('ion-router-outlet');
      style.setAttribute('class', 'styleLight hydrated');
      var header = document.querySelector('ion-toolbar');
      header.removeAttribute('color');
    }
    var headerColor = document.querySelectorAll('h2');
    var hcolor = headerColor.length;
    for (var i = 0; i < hcolor; i++) {
      headerColor[i].removeAttribute('style');
    }
    var menuList = document.querySelectorAll('ion-content.menu-content .menu-content-list');
    var menuListLen = menuList.length;
    for (var j = 0; j < menuListLen; j++) {
      menuList[j].removeAttribute('style');
    }
    var menuItem = document.querySelectorAll('ion-content.menu-content .menu-content-item');
    var menuItemLen = menuItem.length;
    for (var k = 0; k < menuItemLen; k++) {
      menuItem[k].removeAttribute('color');
    }
    var hldividerAttrColor = document.querySelectorAll('.styleLight ion-item-divider ion-row io-col ion-row');
    var hldividerAttrColorLen = hldividerAttrColor.length;
    for (var l = 0; l < hldividerAttrColorLen; l++) {
      hldividerAttrColor[l].setAttribute('color', `var(--ion-color-primary, #3880ff)`);
    }
    var menuContentItem = document.querySelectorAll('ion-content.menu-content');
    var menuContentItemLen = menuContentItem.length;
    for (var m = 0; m < menuContentItemLen; m++) {
      menuContentItem[m].removeAttribute('color');
    }
    var holor = document.querySelectorAll('.styleLight .hl-scroll-list-text p');
    var hcolor = headerColor.length;
    for (var n = 0; n < hcolor; n++) {
      headerColor[n].removeAttribute('color');
    }
    var heColor = document.querySelectorAll('.styleLight .hl-card-content-item ion-label');
    var labelcolor = heColor.length;
    for (var o = 0; o < labelcolor; o++) {
      heColor[o].removeAttribute('color');
    }
    var hlHeaderColor = document.querySelectorAll('.styleLight .hl-header-text');
    var hlHeaderColorLen = hlHeaderColor.length;
    for (var p = 0; p < hlHeaderColorLen; p++) {
      hlHeaderColor[p].removeAttribute('color');
    }
    var hldividerIconColor = document.querySelectorAll('.styleLight ion-item-divider ion-icon');
    var hldividerIconColorLen = hlHeaderColor.length;
    for (var q = 0; q < hldividerIconColorLen; q++) {
      hldividerIconColor[q].removeAttribute('backgroundcolor');
    }
    var hldividerAttrColor = document.querySelectorAll('ion-item-divider ion-icon');
    var hldividerAttrColorLen = hldividerAttrColor.length;
    for (var r = 0; r < hldividerAttrColorLen; r++) {
      hldividerAttrColor[r].removeAttribute('backgroundcolor');
    }
    this.themeChanged();

  }
  setColor(theme) {
    this.themenewColor = theme;
    console.log(this.themenewColor);
  }
  themeChanged() {
    var menuList = document.querySelectorAll('.styleLight ion-content.menu-content .menu-content-list');
    var menuListLen = menuList.length;
    for (var i = 0; i < menuListLen; i++) {
      menuList[i].setAttribute('style', `background:var(--ion-color-primary, #3880ff)`);
    }
    var menuItem = document.querySelectorAll('.styleLight ion-content.menu-content .menu-content-item');
    var menuItemLen = menuItem.length;
    for (var j = 0; j < menuItemLen; j++) {
      menuItem[j].setAttribute('color', `var(--ion-color-primary, #3880ff)`);
    }
    var menuItem = document.querySelectorAll('.styleLight ion-content.menu-content .menu-content-item');
    var menuItemLen = menuItem.length;
    for (var k = 0; k < menuItemLen; k++) {
      var menuValue = menuItem[k].classList.remove('class', 'active');
    }
    var menuContent = document.querySelectorAll('.styleLight ion-content.menu-content');
    var menuContentLen = menuContent.length;
    for (var l = 0; l < menuContentLen; l++) {
      menuContent[l].setAttribute('color', `var(--ion-color-primary, #3880ff)`);
    }
  }
  setTheme(theme) {
    const cssText = CSSTextGenerator(theme);
    this.setGlobalCSS(cssText);
    if (this.storageInstance) {
      this.storageInstance.set('theme', cssText);
    }
  }
  setVariable(name, value) {
    this.document.documentElement.style.setProperty(name, value);
  }
  private setGlobalCSS(css: string) {
    this.document.documentElement.style.cssText = css;
  }
  changeToStyleTwo() {
    var style = document.querySelector('ion-router-outlet');
    style.setAttribute('class', 'styleLight hydrated');

    var header = document.querySelector('ion-toolbar');
    header.removeAttribute('color');
    this.themeChanged();
  }

  setMaterialActiveTheme(val) {
    this.materialtheme.next(val);
  }

  getMaterialActiveTheme() {
    return this.materialtheme.asObservable();
  }

}
const defaults = {
  primary: '',
  secondary: '',
  tertiary: '',
};
function CSSTextGenerator(colors) {
  colors = { ...defaults, ...colors };

  const {
    primary,
    secondary,
    tertiary,
  } = colors;

  const shadeRatio = 0.1;
  const tintRatio = 0.1;

  return `
       --ion-color-primary: ${primary};
       --ion-color-primary-rgb: 56,128,255;
       --ion-color-primary-contrast: ${contrast(primary)};
       --ion-color-primary-contrast-rgb: 255,255,255;
       --ion-color-primary-shade:  ${Color(primary).darken(shadeRatio)}; 
   `;
}
function contrast(color, ratio = 1) {
  color = Color(color);
  return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
}


