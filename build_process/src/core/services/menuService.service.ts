import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class menuService {

  public menuClickListeners = {}
  public isMenuOpen = false;
  public isDefaultMenu = false;
  public assignedMenuGroups = [];
  public popupitems = [];
  public openmoremenu = false;
  constructor(public menuctrl: MenuController) { }

  showMenu() {
    if (document.getElementById("top_popup_menu")) {
      var toggle = document.getElementById("top_popup_menu");
      toggle.classList.toggle("cs-menu-web-scroll-hide");
      toggle.classList.toggle("cs-menu-web-scroll");
    } else if (document.getElementById("left_vertical_menu")) {
      var childNodes = document.getElementsByTagName("ion-router-outlet")[1].childNodes
      for (let i = 0; i < childNodes.length; i++) {
        let page = document.getElementsByTagName(childNodes[i]['tagName'].toLowerCase())[0]
        page.classList.toggle('cs-click-menu-show');
      }
      var menu = document.getElementById("left_vertical_menu");
      menu.classList.toggle("cs-menu2-hide");
      menu.classList.toggle("cs-menu2-show");
    } else if (document.getElementById("left_animation_menu")) {
      var animmenu = document.getElementById("left_animation_menu");
      animmenu.classList.toggle("cs-leftanimation-menu");
      animmenu.classList.toggle("cs-leftanimation-menu-hide");
    } else if (document.getElementById("box_menu")) {
      var element = document.getElementById("box_menu");
      element.classList.toggle("cs-box-menu-active")
    } else {
      this.menuctrl.toggle();
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

  removeEventListener() {
    if (!this.isDefaultMenu) {
      if (this.menuClickListeners['element']) {
        this.menuClickListeners['element'].removeEventListener(this.menuClickListeners['eventType'], this.menuClickListeners['handler'], this.menuClickListeners['option']);
      }
      this.menuClickListeners = JSON.parse(JSON.stringify({}));
      this.closeOverAllMenu()
    }
  }

  registerMenuBodyClickListener() {
    if (!this.isDefaultMenu) {
      this.menuClickListeners = this.addEventListener(document.body, "click", (event) => {
        console.log('++++listener trigger')
        if (this.isMenuOpen && !document.getElementById("top_horizontal_menu")) {
          console.log('++++body click')
          this.assignedMenuGroups.forEach(menuGroup => {
            menuGroup['expand'] = false
          })
          this.isMenuOpen = false
          this.removeEventListener()
        } else if (document.getElementById("top_horizontal_menu")) {
          if (this.isMenuOpen) {
            console.log('++++body top menu close')
            this.assignedMenuGroups.forEach(menuGroup => {
              menuGroup['expand'] = false
            })
            this.isMenuOpen = false
            this.removeEventListener()
          }
          if (this.openmoremenu) {
            console.log('++++body more menu close')
            this.openmoremenu = false;
            this.removeEventListener()
          }
        }
      }, false);
    }
  }

  closeOverAllMenu() {
    var menu;
    if (document.getElementById("top_popup_menu")) {
      menu = document.getElementById("top_popup_menu")
      if (menu && menu.classList.contains('cs-menu-web-scroll')) {
        menu.classList.toggle("cs-menu-web-scroll-hide");
        menu.classList.toggle("cs-menu-web-scroll");
      }
    } else if (document.getElementById("left_animation_menu")) {
      menu = document.getElementById("left_animation_menu");
      if (menu && menu.classList.contains('cs-leftanimation-menu')) {
        menu.classList.toggle("cs-leftanimation-menu");
        menu.classList.toggle("cs-leftanimation-menu-hide");
      }
    } else if (document.getElementById("box_menu")) {
      menu = document.getElementById("box_menu");
      if (menu && menu.classList.contains('cs-box-menu-active')) {
        menu.classList.toggle("cs-box-menu-active");
      }
    } else if (document.getElementById("left_vertical_menu")) {
      var childNodes = document.getElementsByTagName("ion-router-outlet")[1].childNodes
      for (let i = 0; i < childNodes.length; i++) {
        let page = document.getElementsByTagName(childNodes[i]['tagName'].toLowerCase())[0]
        if (page.classList.contains('cs-click-menu-show')) {
          page.classList.toggle('cs-click-menu-show');
        }
      }
      menu = document.getElementById("left_vertical_menu");
      if (menu && menu.classList.contains('cs-menu2-show')) {
        menu.classList.toggle("cs-menu2-hide");
        menu.classList.toggle("cs-menu2-show");
      }
    }
  }

  showLeftVerticalMenuPopUp(index) {
    let userAgent = navigator.userAgent;
    setTimeout(() => {
      var sidemenu = document.getElementsByClassName("cs-menu2-submenu")[0];
      if (!sidemenu) {
        return
      }
      var pos = document.getElementsByClassName("cs-menu-btns")[index]["offsetTop"];
      sidemenu["style"]["position"] = "fixed";
      sidemenu["style"]["z-index"] = 1;
      var windowHeight = document.getElementsByTagName("ion-router-outlet")[1]["offsetHeight"];
      var sidemenuHeight = document.getElementsByClassName("cs-menu2-submenu")[0]["offsetHeight"];
      var totval = sidemenuHeight + pos;
      var scrollval = document.getElementsByClassName("cs-scrolltopVal")[0]["scrollTop"];
      if ((totval - scrollval) > windowHeight) {
        sidemenu["style"]["top"] = 'inherit';
        sidemenu["style"]["bottom"] = 20 + "px";
      } else {
        sidemenu["style"]["top"] = (pos - scrollval + 1) + "px";
        if(userAgent.match(/firefox|fxios/i)){
          sidemenu["style"]["top"] = (pos - scrollval + 68) + "px";
        }
      }
    }, 10)
  }

}