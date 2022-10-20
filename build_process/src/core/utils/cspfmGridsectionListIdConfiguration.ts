import { Injectable } from "@angular/core";
import { objectTableMapping } from 'src/core/pfmmapping/objectTableMapping';

@Injectable({
  providedIn: "root"
})
export class cspfmGridsectionListIdConfiguration {

  constructor(public objMapping: objectTableMapping) {

  }
  setSlickGridPaginationId(slickgridHeaderColumn , gridId, objectName, columndef, cspfmdocument) {
    // this.reSetSlickGridId(gridId, objectName, columndef, cspfmdocument)
    const slickgridDocument = cspfmdocument.getElementById('slickGridContainer-' + gridId)
    const select = slickgridDocument.getElementsByTagName('slick-pagination')[0].getElementsByTagName('select')[0];
    const previous = slickgridDocument.getElementsByTagName('slick-pagination')[0].querySelectorAll('[aria-label="Previous"]')[0];
    const first = slickgridDocument.getElementsByTagName('slick-pagination')[0].querySelectorAll('[aria-label="First"]')[0];
    const next = slickgridDocument.getElementsByTagName('slick-pagination')[0].querySelectorAll('[aria-label="Next"]')[0];
    const last = slickgridDocument.getElementsByTagName('slick-pagination')[0].querySelectorAll('[aria-label="Last"]')[0];

    select.setAttribute("id", 'cspfm_' + objectName + '_slickgrid_select');
    previous.setAttribute("id", 'cspfm_' + objectName + '_slickgrid_previous');
    first.setAttribute("id", 'cspfm_' + objectName + '_slickgrid_first');
    next.setAttribute("id", 'cspfm_' + objectName + '_slickgrid_next');
    last.setAttribute("id", 'cspfm_' + objectName + '_slickgrid_last');

    for (let i = 0; i <= slickgridHeaderColumn.length - 1; i++) {
      if (slickgridHeaderColumn[i].getElementsByClassName('slick-header-menubutton')
      [0] !== undefined) {
        slickgridHeaderColumn[i].getElementsByClassName('slick-header-menubutton')
        [0].setAttribute('id', 'cspfm_' + objectName + '_slickgrid_header_sort')
      }
    }
  }
  private reSetSlickGridId(id, objectName, columndefinitions, cspfmdocument) {
    let cloumndef;
    if (columndefinitions.constructor === [].constructor) { 
      cloumndef = columndefinitions;
    } else {
      cloumndef = columndefinitions[this.objMapping.mappingDetail[objectName]]
    }
    const exitingSlickGridIds = []
    for (let i = 0; i <= cspfmdocument.getElementById(id).getElementsByClassName('slick-header-column').length - 1; i++) {
      exitingSlickGridIds.push(cspfmdocument.getElementById(id).getElementsByClassName('slick-header-column')[i])
    }
    let isCheckBoxAvailable = true
    if(exitingSlickGridIds.length > 0) {
        if (exitingSlickGridIds[0].id.split('_') && exitingSlickGridIds[0].id.split('_')[2] === "checkbox") {
            isCheckBoxAvailable = true
        } else {
            isCheckBoxAvailable = false
        }
    }
    exitingSlickGridIds.forEach((e, i) => {
      let fieldId = ""
        fieldId = "cspfm_slickgrid_" + objectName + "_"
        if (isCheckBoxAvailable) {
        if (i === 0) {
          fieldId = fieldId + "checkbox_selector"
        } else {
          if (cloumndef[i - 1]) {
            fieldId = fieldId + cloumndef[i - 1].id
          }
        }
      } else{
        console.log(objectName, cloumndef[i]);
        
        fieldId = fieldId + cloumndef[i].id
      }
        cspfmdocument.getElementById(id).getElementsByClassName('slick-header-column')[i].setAttribute("id", fieldId);
    })
  }
  toggleFilterSetId(filterCls, tablename) {
            for (let i = 0; i < filterCls.length; i++) {
                const fieldNameWithid = 'cspfm_slickgrid_' + tablename +'_'+ filterCls[i].classList[2]
                if (filterCls[i].getElementsByClassName('input-group-addon')[0]) {
                    filterCls[i].getElementsByClassName('input-group-addon')[0].
                    getElementsByTagName('select')[0].setAttribute("id", fieldNameWithid);
                    filterCls[i].getElementsByTagName('input')[0].setAttribute("id", fieldNameWithid + '-input');
                } else {
                    if (filterCls[i].getElementsByTagName('select')[0]) {
                        filterCls[i].getElementsByTagName('select')[0].setAttribute("id", fieldNameWithid + '-select')
                    } else if (filterCls[i].getElementsByTagName('input')[0]) {
                        filterCls[i].getElementsByTagName('input')[0].setAttribute("id", fieldNameWithid + '-input')
                        filterCls[i].getElementsByTagName('button')[0].setAttribute("id", fieldNameWithid + '-button')
                    }
                }
            }
  }

  setIdForInlineEdit(cspfmdocument, tablename) {
    setTimeout(() => {
      const slick_textbox = cspfmdocument.getElementsByClassName('slick-large-editor-text')[0]
      if (slick_textbox) {
          const text_Area = slick_textbox.getElementsByTagName('textarea')[0]
          const text_cancel = slick_textbox.getElementsByClassName('btn-cancel')[0]
          const text_save = slick_textbox.getElementsByClassName('btn-save')[0]

          text_Area.setAttribute("id", 'cspfm_slickgrid_' + tablename + '_text_Area');
          text_cancel.setAttribute("id", 'cspfm_slickgrid_' + tablename + '_text_cancel');
          text_save.setAttribute("id", 'cspfm_slickgrid_' + tablename + '_text_save');
      }

      const slick_cell_input = cspfmdocument.getElementsByClassName('slick-cell editable')[0]
      if (slick_cell_input && slick_cell_input.getElementsByTagName('input') && slick_cell_input.getElementsByTagName('input').length > 0) {
          if (slick_cell_input.getElementsByTagName('input')[0].getAttribute('type') === "checkbox") {
              slick_cell_input.getElementsByTagName('input')[0].setAttribute("id", 'cspfm_slickgrid_' + tablename + '_checkbox_' + slick_cell_input.getElementsByTagName('input')[0].getAttribute('value'));
          } else {
              slick_cell_input.getElementsByTagName('input')[0].setAttribute("id", 'cspfm_slickgrid_' + tablename + '_input_save');
          }
      }
      
      // Double Click Slick Cell Input
      const slick_select_radio_option = cspfmdocument.getElementsByClassName('ms-drop') as HTMLCollectionOf<HTMLElement>
      if (slick_select_radio_option) {
          for (let i = 0; i < slick_select_radio_option.length; i++) {
              if (slick_select_radio_option[i].style.display === 'block') {
                  const individual_select = slick_select_radio_option[i].getElementsByTagName('ul')[0].getElementsByTagName('li')
                  for (let j = 0; j < individual_select.length - 1; j++) {
                      if (individual_select[j].getElementsByTagName('input')[0].getAttribute('type') === "radio") {
                          individual_select[j].getElementsByTagName('input')[0].setAttribute("id", 'cspfm_slickgrid_' + tablename + '_radio_' + individual_select[j].getElementsByTagName('input')[0].getAttribute('value'));
                      } else {
                          individual_select[j].getElementsByTagName('input')[0].setAttribute("id", 'cspfm_slickgrid_' + tablename + '_input_save');
                      }
                  }
              }
          }
      }

      // Double Click Slick Cell Calendar

      const slickgrid_calendar = cspfmdocument.getElementsByClassName('flatpickr-calendar open')[0]
      if (slickgrid_calendar) {
          slickgrid_calendar.setAttribute("id", 'cspfm_slickgrid_' + tablename + '_calendar_flatpicker');
          const slickgrid_calendar_ok = slickgrid_calendar.getElementsByClassName('flatpickr-confirm')[0]
          slickgrid_calendar_ok.setAttribute("id", 'cspfm_slickgrid_' + tablename + '_calendar_ok');
      }

      // Slick Select option

      const slick_select_optionAry = cspfmdocument.getElementsByClassName('ms-drop') as HTMLCollectionOf<HTMLElement>
      for (let i = 0; i < slick_select_optionAry.length; i++) {
          if (slick_select_optionAry[i].style.display === 'block') {
              const slick_select_option = slick_select_optionAry[i]
              if (slick_select_option && slick_select_option.getElementsByClassName('ms-select-all') && slick_select_option.getElementsByClassName('ms-select-all').length > 0) {
                  const select_all = slick_select_option.getElementsByClassName('ms-select-all')[0].getElementsByTagName('input')[0]
                  select_all.setAttribute("id", 'cspfm_slickgrid_' + tablename + '_selectall');
                  
                  const individual_select = slick_select_option.getElementsByTagName('ul')[0].getElementsByTagName('li')
                  for (let i = 0; i < individual_select.length - 1; i++) {
                      if (individual_select[i].getElementsByTagName('input') && individual_select[i].getElementsByTagName('input').length > 0) {
                          individual_select[i].getElementsByTagName('input')[0].setAttribute("id", 'cspfm_slickgrid_' + tablename + '_text_' + individual_select[i].getAttribute('label'));
                      }
                  }
                  slick_select_option.getElementsByTagName('button')[0].setAttribute("id", 'cspfm_slickgrid_' + tablename + '_text_save');
              }
          }
      }

  }, 100);
  }

}
