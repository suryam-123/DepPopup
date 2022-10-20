INSTALL_PATH="$PWD/build_process"
echo "App path is :" $INSTALL_PATH
echo " "
function extractPlugins {
    echo "Extracing the zip files :::: Extracting......."
    npm i -g extract-zip@2.0.1
    cd $INSTALL_PATH/cspfmPlugins
    extract-zip me.apla.cordova.app-preferences.zip
    echo "Extracted sucessfully...."
}
extractPlugins
cd $INSTALL_PATH
echo "["$(date +%d-%m-%Y) $(date +"%T")"] :::: "  "npm installing..."
npm install -f
echo "["$(date +%d-%m-%Y) $(date +"%T")"] :::: "  "npm install completed."
echo "["$(date +%d-%m-%Y) $(date +"%T")"] :::: "  "Updating pouch-utils.js file"
cd $INSTALL_PATH/node_modules/relational-pouch/lib
mv pouch-utils.js pouch-utils.js_bkp
sed  "3s+promise')+promise').default+g" pouch-utils.js_bkp > pouch-utils.js  
echo "["$(date +%d-%m-%Y) $(date +"%T")"] :::: "  "Updated pouch-utils.js file"
echo " "
cat pouch-utils.js | awk 'NR==3'
echo " "
echo "["$(date +%d-%m-%Y) $(date +"%T")"] :::: "  "Updating pouchdb-validation-index.js file"
cd $INSTALL_PATH/node_modules/pouchdb-validation/lib
mv index.js index.js_bkp
sed  "26s+promise\")+promise\").default+g" index.js_bkp > index.js
echo "["$(date +%d-%m-%Y) $(date +"%T")"] :::: "  "Updated pouchdb-validation-index.js file"
echo " "
cat index.js | awk 'NR==26'
echo " "
echo "["$(date +%d-%m-%Y) $(date +"%T")"] :::: "  "Updating pouchdb-bulkdocs-wrapper-index.js file "
cd $INSTALL_PATH/node_modules/pouchdb-bulkdocs-wrapper/lib
mv index.js index.js_bkp
sed  "19s+promise\")+promise\").default+g" index.js_bkp > index.js
echo "["$(date +%d-%m-%Y) $(date +"%T")"] :::: "  "Updated pouchdb-bulkdocs-wrapper-index.js file"
echo " "
cat index.js | awk 'NR==19'
cd $INSTALL_PATH/node_modules/ion-bottom-drawer/fesm5
mv ion-bottom-drawer.js ion-bottom-drawer.js_bkp
sed -e "32s+this._renderer.setStyle(this._element.nativeElement.querySelector('.ion-bottom-drawer-scrollable-content :first-child'), 'touch-action', 'none');+this._renderer.setStyle(this._element.nativeElement,'.ion-bottom-drawer-scrollable-content','.scroll-content');this._renderer.setStyle(this._element.nativeElement,'touch-action','none');+g" -e "34s+var hammer = new Hammer(this._element.nativeElement);+var buttonDividerElement = this._element.nativeElement.childNodes[0].childNodes[0]; var /** @type {?} */ hammer = new Hammer(buttonDividerElement);hammer.get('pan').set({ enable: true, direction: Hammer.DIRECTION_VERTICAL });+g" -e "36s+hammer.get+//hammer.get+g" ion-bottom-drawer.js_bkp > ion-bottom-drawer.js
echo " "
cd $INSTALL_PATH
ionic serve