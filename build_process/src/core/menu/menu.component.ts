import { Component ,Injector} from '@angular/core';
import { appConfiguration } from '../utils/appConfiguration';
import { appUtility } from '../utils/appUtility';
import { MenuController, Platform, AlertController, NavController } from '@ionic/angular';
import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { mapBridge } from '../nativebridges/mapBridge';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
import { metaDataDbProvider } from 'src/core/db/metaDataDbProvider';
import * as lodash from 'lodash';
import { menuService } from '../services/menuService.service';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
import { NgxMasonryOptions } from 'ngx-masonry';



@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
    isRequiredToShowComponent: boolean;
    activeMenuGroups = [0];
    singleMenuArray: any;
    allMenuGroups: Array<{
        menuGroupId: number, menugroupName: string, menuGroupDisplayName: string, icon: string,
        menuItems: {
            web: Array<{ title: string, url: string, icon: string, menuitemid: string, type: any, applicationId: number, MenuType: string }>,
            mobile: Array<{ title: string, url: string, icon: string, menuitemid: string, type: any, applicationId: number, MenuType: string }>
        }
    }>;
    defaultGroupObj = {};
    loggedUserDetail = {};
    calendarGroupObj = {};
    mapGroupObj = {};

    map: Array<{
        menuGroupId: number, menugroupName: string, menuGroupDisplayName: string, icon: string,
        menuItems: {
            web: Array<{ title: string, url: string, icon: string, menuitemid: string }>,
            mobile: Array<{ title: string, url: string, icon: string, menuitemid: string }>
        }
    }>;
    calender: Array<{
        menuGroupId: number, menugroupName: string, menuGroupDisplayName: string, icon: string,
        menuItems: {
            web: Array<{ title: string, url: string, icon: string, menuitemid: string }>,
            mobile: Array<{ title: string, url: string, icon: string, menuitemid: string }>
        }
    }>; defaultMenu: Array<{ title: string, url: any, icon: string }>;
    public menuButtonBackgroundColor = ["cs-btnclr-one", "cs-btnclr-two", "cs-btnclr-three", "cs-btnclr-four", "cs-btnclr-five"]
    public menuButtonColor = ["cs-top-menu-one", "cs-top-menu-two", "cs-top-menu-three", "cs-top-menu-four", "cs-top-menu-five", "cs-top-menu-six"]
    public menuClasses = ["cs-menu-c-one", "cs-menu-c-two", "cs-menu-c-three", "cs-menu-c-four", "cs-menu-c-five", "cs-menu-c-six", "cs-menu-c-seven", "cs-menu-c-eight", "cs-menu-c-nine"]
    public previousExpandedGroup = "";
    // public mobileProfilePic = "";

    public masonryOptions: NgxMasonryOptions = {
        gutter:20,
        columnWidth:250
    }
    constructor(public appConfig: appConfiguration,
        public file: File, private menuCtl: MenuController,
        private platform: Platform, private broadcaster: Broadcaster,
        public alertCtrl: AlertController, public nativeBridgeMap: mapBridge,
        public router: Router, public activeRoute: ActivatedRoute,
        public location: Location, private appPreferences: AppPreferences, public appUtilityConfig: appUtility, public navController: NavController,
        public metaDbConfig: metaDbConfiguration, public metaDbProvider: metaDataDbProvider, public menuService: menuService,
        private injector: Injector,
        public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider) {
        platform.ready().then(() => {
            this.getActiveMenuGroup();
        });

        // Predefined menu

        this.isRequiredToShowComponent = true;
        this.defaultMenu = [
            { title: 'Settings', url: '/menu/cspfmSettings', icon: 'icon-mat-settings' }
        ];


        // Map menu
        this.map = [
            {
                "menuGroupId": 0,
                "menugroupName": "mapmenugroup",
                "menuGroupDisplayName": "Map",
                "icon": "icon-mat-language",
                "menuItems": {
                    "web": [
                        {
                            "title": "Map",
                            "url": "/menu/homepage",
                            "icon": "icon-mat-language",
                            "menuitemid": "webMap"
                        }
                    ],
                    "mobile": [
                        {
                            "title": "Map",
                            "url": "/menu/homepage",
                            "icon": "icon-mat-language",
                            "menuitemid": "mobmap"
                        }
                    ]
                }
            }
        ];
        // Calender menu
        this.calender = [
            {
                "menuGroupId": 0,
                "menugroupName": "calendarmenugroup",
                "menuGroupDisplayName": "Calendar",
                "icon": "icon-mat-calendar_today",
                "menuItems": {
                    "web": [
                        {
                            "title": "Calendar",
                            "url": "/menu/cspfmCalendarPage",
                            "icon": "icon-mat-calendar_today",
                            "menuitemid": "webcalendar"
                        }
                    ],
                    "mobile": [
                        {
                            "title": "Calendar",
                            "url": "/menu/homepage",
                            "icon": "icon-mat-calendar_today",
                            "menuitemid": "mobcalendar"
                        }
                    ]
                }
            }
        ];

        // Dynamic menu entry start here
        this.allMenuGroups ;

        this.addMenuGroupExpandableFlag();
        if (!this.appUtilityConfig.isEmbeddingEnabled) {
            this.getLoggedUserDetail();
            this.metaDbProvider.fetchHierarchyRecord();
            setTimeout(() => {
                this.openPage({
                    "title": "Home",
                    "url": "/menu/homepage",
                    "icon": "icon-mat-home",
                    "menuitemid": "home"
                })
            }, 50);
        }
    }

    // Get active menu group for user
    getActiveMenuGroup() {


        if (this.appUtilityConfig.isMobile/*  && !this.appUtilityConfig.isEmbeddingEnabled */) {
            // For device
            this.getActiveMenuGroupFromJson();
        } else {
            const assignedApps = this.appUtilityConfig.assignedApps;

            if (assignedApps) {
                assignedApps.forEach(assignedapp => {
                    if (assignedapp['appId'] === this.appConfig.configuration.appId) {
                        const menuGroups = assignedapp['assignedMenuGroups'];
                        if (menuGroups) {
                            menuGroups.forEach(element => {
                                this.activeMenuGroups.push(element);
                            });
                        }
                        this.getAssignedMenuGroup()
                    }
                });
            }
        }
    }
    ngOnInit() {
        if (document.getElementById("box_menu")) {
            this.singleMenuArray = this.allMenuGroups.filter(function (element) {
                return element["menuItems"]["web"].length === 1;
            });
            if (this.appConfig.configuration.defaultMenu.isCalendarEnable &&
                !this.appUtilityConfig.isMobileResolution) {
                const calendarObject = this.calender[0]
                this.singleMenuArray.push(calendarObject)
            }
            if (this.appConfig.configuration.defaultMenu.isMapEnable &&
                !this.appUtilityConfig.isMobileResolution) {
                const mapObject = this.map[0]
                this.singleMenuArray.push(mapObject)
            }
            var groupMenuArray = this.allMenuGroups.filter(function (element) {
                return element["menuItems"]["web"].length > 1;
            });

            const mergeBothMenu = (singleMenuArray, groupMenuArray) => {
                groupMenuArray.forEach((groupMenuArrayElement) => {
                    let singleMenuArrayElement = singleMenuArray.find(
                        (singleMenuArrayElement) => {
                            return (
                                groupMenuArrayElement.menuItems.web[0].menuitemid ===
                                singleMenuArrayElement.menuItems.web[0].menuitemid
                            );
                        }
                    );
                    singleMenuArrayElement
                        ? Object.assign(singleMenuArrayElement, groupMenuArrayElement)
                        : singleMenuArray.push(groupMenuArrayElement);
                });
            };
            mergeBothMenu(this.singleMenuArray, groupMenuArray);
            return this.singleMenuArray;
        }
    }

    getAssignedMenuGroup() {
        if (this.appUtilityConfig.isMobileResolution) {
            this.activeMenuGroups.forEach(element => {
                const assignedMenu = lodash.filter(this.allMenuGroups, allMenu => allMenu.menuGroupId === element)
                const assignedMenuObject = assignedMenu[0]
                if (assignedMenuObject && assignedMenuObject["menuItems"]["mobile"].length > 0) {
                    this.menuService.assignedMenuGroups.push(assignedMenuObject)
                }
            })
            // this.setProfilePic();
        } else {
            setTimeout(() => {
                if (document.getElementById("box_menu")) {
                    this.singleMenuArray.forEach((activeMenuResults) => {
                        const assignedMenu = lodash.filter(
                            this.singleMenuArray,
                            (allMenu) => allMenu.menuItems.web[0].menuitemid === activeMenuResults.menuItems.web[0].menuitemid
                        );
                        const assignedMenuObject = assignedMenu[0];
                        if (assignedMenuObject !== undefined && assignedMenuObject["menuItems"]["web"].length > 0 && (this.activeMenuGroups.indexOf(activeMenuResults.menuGroupId) !== -1 || activeMenuResults.menuGroupId === 0)) {
                            this.menuService.assignedMenuGroups.push(assignedMenuObject);
                        }
                    });
                } else {
                    this.activeMenuGroups.forEach((activeMenuResult) => {
                        const assignedMenu = lodash.filter(
                            this.allMenuGroups,
                            (allMenu) => allMenu.menuGroupId === activeMenuResult
                        );
                        const assignedMenuObject = assignedMenu[0];
                        if (assignedMenuObject !== undefined && assignedMenuObject["menuItems"]["web"].length > 0) {
                            this.menuService.assignedMenuGroups.push(assignedMenuObject);
                        }
                    });
                }
                // If calendar is enabled, calendar menu is added in assignedMenuGroups for Box Style
                if (!document.getElementById("box_menu")) {
                    if (this.appConfig.configuration.defaultMenu.isCalendarEnable &&
                        !this.appUtilityConfig.isMobileResolution) {
                        const calendarObject = this.calender[0]
                        this.menuService.assignedMenuGroups.push(calendarObject)
                    }
                }

                // If map is enabled, map menu is added in assignedMenuGroups for Box Style
                if (!document.getElementById("box_menu")) {
                    if (this.appConfig.configuration.defaultMenu.isMapEnable &&
                        !this.appUtilityConfig.isMobileResolution) {
                        const mapObject = this.map[0]
                        this.menuService.assignedMenuGroups.push(mapObject)
                    }
                }
            });
        }
    }

    addMenuGroupExpandableFlag() {
     

        for (let i = 0; i < this.allMenuGroups.length; i++) {
            this.allMenuGroups[i]['expand'] = false;
        }

        this.defaultGroupObj['expand'] = false;
        this.defaultGroupObj['menuGroupDisplayName'] = 'Settings';
        this.defaultGroupObj['menuItems'] = this.defaultMenu;
        this.defaultGroupObj['menugroupName'] = "settingsmenu"

        this.calendarGroupObj['expand'] = false;
        this.calendarGroupObj['menuGroupDisplayName'] = 'Calendar';
        this.calendarGroupObj['menuItems'] = this.calender[0]["menuItems"];
        this.calendarGroupObj['menugroupName'] = "calendarmenu"

        this.mapGroupObj['expand'] = false;
        this.mapGroupObj['menuGroupDisplayName'] = 'Map';
        this.mapGroupObj['menuItems'] = this.map[0]["menuItems"];
        this.calendarGroupObj['menugroupName'] = "mapmenu"
    }

    getActiveMenuGroupFromJson() {

        this.platform.ready().then(() => {

            this.checkMenuGroupJsonExist().then(resValue => {
                if (resValue) {

                    return this.appPreferences.fetch('login_response').then(response => {


                        if (response) {
                            JSON.parse(response).forEach(app => {
                                if (app['appId'] === this.appConfig.configuration.appId) {
                                    const menuGroups = app['assignedMenuGroups'];
                                    if (menuGroups) {
                                        menuGroups.forEach(menuGroup => {
                                            this.activeMenuGroups.push(menuGroup);
                                        });
                                    }
                                    this.getAssignedMenuGroup()
                                }
                            });
                        } else {
                            alert('Invalid response from server. Json not found');
                        }

                    })

                } else {
                    alert('Invalid response from server. Json not found');
                }
            });
        });

    }


    // Read Menu Group Json from data directory
    readMenuGroupJson() {
        return this.file.readAsText(this.file.dataDirectory, 'loginResponse.json').then((result) => {
            return result;
        }).catch((err) => {
            return false;
        });
    }
    // Check Menu Group Json exist in data directory
    checkMenuGroupJsonExist() {
        // return this.file.checkFile(this.file.dataDirectory, 'loginResponse.json').then((result) => {
        //     return true;
        // }).catch(err => {
        //     return false;

        // });

        return this.appPreferences.fetch('login_response').then(res => {

            if (res && res !== ''){
                return true
            }
                
            else{
                return false
            }
               

        }).catch(err => {
            return false
        })
    }

    openPage(page, event?) {
        const pageValue = JSON.stringify(page);
        const pageResultObj = JSON.parse(pageValue);
        const pageTitle = pageResultObj['title'];
        const queryParamsRouting = { "isFromMenu": true }
        if (this.menuService.isMenuOpen) {
            if (document.getElementById("top_horizontal_menu")) {
                event.stopPropagation()
                this.previousExpandedGroup['expand'] = false;
            }
            if (Object.keys(this.menuService.menuClickListeners).length > 0) {
                this.menuService.removeEventListener()
            }
            this.menuService.isMenuOpen = false;
            this.menuService.closeOverAllMenu()
        }
        if (pageTitle === 'Settings' || pageTitle === 'Map' || pageTitle === 'Calender') {
            this.openComponentPage(page);
        } else if (pageTitle === 'Exit') {
            this.showExitAlertView(page);
        } else if (page['url'] === '/menu/homepage') {
            this.navController.navigateBack([this.appUtilityConfig.landingPageInfo.path], { queryParams: queryParamsRouting, skipLocationChange: true });
        } else {
            console.log("navigate url=> " + page['url']);
            if (page['type'] === 'standardApp') {
                let emUrl = `${this.appUtilityConfig["platformWebNodeHostName"]}/${this.appUtilityConfig["contextName"]}/core/login/applicationswitcher?menuUrl=${page['url']}&applicationId=${page.applicationId}&chainsysSessionGuid=${this.appUtilityConfig["chainsysSessionId"]}&MenuType=${page['MenuType']}`;
                if (page['MenuType'] === 'EMBED') {
                    this.router.navigate(['/menu/embedded'], {
                        queryParams: { emUrl }
                    });
                } else {
                    window.location.href = emUrl;
                }
            } else {
                this.navController.navigateBack([page['url']], { queryParams: queryParamsRouting, skipLocationChange: true });
            }
        }
        if (this.appConfig.configuration.isGridMenuEnabled) {
            var element = document.getElementById("cs-box-menu");
            element.classList.remove("cs-box-menu-active");
        }
    }
    openComponentPage(page) {
        this.navController.navigateBack([page['url']], { skipLocationChange: true });
        if (this.appUtilityConfig.isMobile) {
            if (page.title === 'Calender') {
                const calendarBridgeClass = 'calendarBridge'
                import(`../nativebridges/${calendarBridgeClass}`).then(calendarInstance => {
                    if (calendarInstance['calendarBridge']) {
                        calendarInstance = this.injector.get(calendarInstance['calendarBridge'])
                        calendarInstance.startObserver();                        
                        this.callNotificationBroadcastPlugin(page);
                    }else {
                        console.error('calendarBridge file is missing')
                    }
                }).catch(err => {
                    console.error('calendarBridge file is missing', err)
                })

            } else if (page.title === 'Map') {
                this.nativeBridgeMap.startObserver();
                this.callNotificationBroadcastPlugin(page);
         }
        }
    }
    callNotificationBroadcastPlugin(page) {
        this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: page.title })
            .then(() => console.log('Success'))
            .catch(() => console.log('Error'));
    }
    async showExitAlertView(page) {
        const confirm = await this.alertCtrl.create({
            header: 'Exit',
            message: 'Are you sure want to exit ?',
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'OK',
                    handler: () => {

                        if (this.appUtilityConfig.isMobile) {
                            this.callNotificationBroadcastPlugin(page);
                        }
                        window.location.replace('/apps/applist');

                    }
                }
            ]
        });
        confirm.present();
    }

    ionViewDidEnter() {

        this.appUtilityConfig.isTopHorizonatalMenu = false;
        var menuItem = document.querySelectorAll('.styleLight ion-content.menu-content .menu-content-item');
        var menuItemLen = menuItem.length;
        for (var k = 0; k < menuItemLen; k++) {
            menuItem[k].classList.remove('class', 'active');
        }

        if (document.getElementById("top_horizontal_menu")) {
            this.appUtilityConfig.isTopHorizonatalMenu = true;
            document.getElementsByClassName("cs-tool-web-button")[0].classList.add("cs-display-none");
        }
        this.topHorizontaloverlapmenu();
    }


    closeMenu(event, group, index?) {
        event.stopPropagation()
        // setTimeout(() => {
        if (document.getElementById("top_horizontal_menu")) {
            this.menuService.openmoremenu = false;
            if (!this.menuService.isMenuOpen) {
                this.menuService.isMenuOpen = true;
                if (Object.keys(this.menuService.menuClickListeners).length === 0) {
                    this.menuService.registerMenuBodyClickListener()
                }
            } else if (this.menuService.isMenuOpen && group === this.previousExpandedGroup) {
                if (Object.keys(this.menuService.menuClickListeners).length > 0) {
                    this.menuService.removeEventListener()
                }
                this.menuService.isMenuOpen = false;
            }
        }
        if (this.previousExpandedGroup === "") {
            this.previousExpandedGroup = group;
            group['expand'] = !group['expand'];
        } else {
            if (this.previousExpandedGroup === group) {
                group['expand'] = !group['expand'];
            } else {
                this.previousExpandedGroup['expand'] = false;
                group['expand'] = true;
                this.previousExpandedGroup = group;
            }
        }
        if (document.getElementById("left_vertical_menu")) {
            this.menuService.showLeftVerticalMenuPopUp(index)
        }

        console.log('this ==', this.menuService.assignedMenuGroups);
        if (
            document.getElementById("side_menu") &&
            group["menuItems"]["web"].length === 1
        ) {
            this.menuCtl.close();
        }
        if (
            document.getElementById("menu_component") &&
            group["menuItems"]["web"].length === 1
        ) {
            this.menuCtl.close();
        }
        // }, 100)
    }


    public corUsersObjectHierarchyJSON = {
        "objectId": this.metaDbConfig.corUsersObject,
        "objectName": this.metaDbConfig.corUsersObject,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": [

        ]
    };

    getLoggedUserDetail() {
        if (navigator.onLine) {
            const query = "type: " + this.metaDbConfig.corUsersObject + " AND " + "user_id: " + Number(this.appUtilityConfig.userId);
            return this.cspfmMetaCouchDbProvider.fetchRecordsBySearchFilterPhrases(query,
                this.corUsersObjectHierarchyJSON).then(corUserResult => {
                    if (corUserResult.status === 'SUCCESS') {
                        const userInfo = JSON.parse(JSON.stringify(corUserResult['records']))
                        this.loggedUserDetail = userInfo[0];
                    }
                }).catch(err => {
                    console.log('Menu Componenet - Exception Received in core user fetching method')
                });
        } else {
            const options = {};
            const selector = {}
            selector['data.type'] = this.metaDbConfig.corUsersObject;
            selector['data.user_id'] = Number(this.appUtilityConfig.userId);
            options['selector'] = selector;
            this.corUsersObjectHierarchyJSON['options'] = options;

            return this.metaDbProvider.fetchDataWithReference(this.corUsersObjectHierarchyJSON).then(corUserResult => {
                if (corUserResult.status === 'SUCCESS') {
                    const userInfo = JSON.parse(JSON.stringify(corUserResult['records']))
                    this.loggedUserDetail = userInfo[0];
                }

            }).catch(err => {
                console.log('Menu Componenet - Exception Received in core user fetching method')
            });
        }
    }

    // setProfilePic() {
    //     this.file.checkFile(this.file.dataDirectory, 'user.png').then((result) => {
    //         if (result) {
    //             this.mobileProfilePic = this.file.dataDirectory + 'user.png';
    //         } else {
    //             this.mobileProfilePic = "assets/img/user_icon.png";
    //         }
    //     }).catch(err => {
    //         this.mobileProfilePic = "assets/img/user_icon.png";

    //     });
    // }

    openTopHorizontalMenu() {
        if (document.getElementById("top_horizontal_menu")) {
            if (!this.menuService.openmoremenu) {
                if (this.previousExpandedGroup && this.previousExpandedGroup['expand']) {
                    this.previousExpandedGroup['expand'] = false
                    this.menuService.isMenuOpen = false;
                }
                if (Object.keys(this.menuService.menuClickListeners).length === 0) {
                    this.menuService.registerMenuBodyClickListener()
                }
                setTimeout(() => {
                    this.menuService.openmoremenu = true;
                }, 100)
            } else if (this.menuService.openmoremenu) {
                if (Object.keys(this.menuService.menuClickListeners).length > 0) {
                    this.menuService.removeEventListener()
                }
                this.menuService.openmoremenu = false;
            }
        }
    }

    submenuitem(i) {
        var menuitem = document.getElementsByClassName("cs-overlapmenu-item")[i].getBoundingClientRect();
        var menuitemtop = menuitem.top
        var submenu = document.getElementsByClassName("cs-tophorizontal-submenu-more")[i];
        var submenuitem = document.getElementsByClassName("cs-tophorizontal-submenu-more")[i].getBoundingClientRect();
        var submenuheight = submenuitem.height;
        var submenuwidth = document.getElementsByClassName("cs-top-horizontal-menu-morebtn")[0]['offsetWidth'];
        if ((submenuheight + menuitemtop) > window.innerHeight) {
            submenu['style']['bottom'] = '0' + 'px';
            submenu['style']['right'] = submenuwidth + 'px';
        }else {
            submenu['style']['top'] = '0' + 'px';
            submenu['style']['right'] = submenuwidth + 'px';
        }
    }

    // public menutoolitems = [];
    topHorizontaloverlapmenu() {
        var eachitemwidth = document.getElementsByClassName("cs-top-menu-items");
        var width = 0;
        for (let i = 0; i < eachitemwidth.length; i++) {
            width += eachitemwidth[i]['offsetWidth'];
            if (width > (window.innerWidth - 32)) {
                document.getElementsByClassName("cs-top-horizontal-menu-more-btn")[0]['style']['display'] = 'block';
                if (i >= this.menuService.assignedMenuGroups.length) {
                    this.menuService.popupitems.push(this.menuService.assignedMenuGroups.pop());
                }else {
                    this.menuService.popupitems.push(this.menuService.assignedMenuGroups[i])
                    this.menuService.assignedMenuGroups.splice(i, 1);
                }
            }
        }
    }
}
