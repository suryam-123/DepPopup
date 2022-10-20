import { DraggableGroupingExtension, ExtensionService, ExtensionUtility, GridOption, SharedService, SlickEventHandler } from "angular-slickgrid"
 declare var Slickgrid:any;
 export class cspfmSlickDraggableGrouping extends DraggableGroupingExtension{
 constructor(extensionUtility: ExtensionUtility, sharedService: SharedService){
     super( extensionUtility,sharedService);
 } 
   create(gridOptions: GridOption) {
       let _addon: any;
     if (gridOptions) {
       if (!_addon) {
         _addon = new Slickgrid.DraggableGrouping(gridOptions.draggableGrouping || {});
       }
       return _addon;
     }
     return null;
   }
 }