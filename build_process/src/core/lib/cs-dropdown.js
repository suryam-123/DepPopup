/*
 * jQuery Dropdown: A simple dropdown plugin
 *
 * Contribute: https://github.com/claviska/jquery-dropdown
 *
 * @license: MIT license: http://opensource.org/licenses/MIT
 *
 */
// To Dynamic Trigger
//$('#TriggerElement').jqDropdown('attach', ['#DropdownID']);
// $('.1').jqDropdown('show', ['.cs-dropdown'])
// window.$(".cs-dropdown-open").jqDropdown("show", [".cs-dropdown"]);


$(document).ready(function () {
  if (jQuery)
    (function ($) {
      $.extend($.fn, {
        jqDropdown: function (method, data) {
          switch (method) {
            case "show":
              show(null, $(this));
              return $(this);
            case "hide":
              hide();
              return $(this);
            case "attach":
              return $(this).attr("data-cs-dropdown", data);
            case "detach":
              hide();
              return $(this).removeAttr("data-cs-dropdown");
            case "disable":
              return $(this).addClass("cs-dropdown-disabled");
            case "enable":
              hide();
              return $(this).removeClass("cs-dropdown-disabled");
          }
        },
      });

      function show(event, object) {
        var trigger = event ? $(this) : object,
          jqDropdown = $(trigger.attr("data-cs-dropdown")),
          isOpen = trigger.hasClass("cs-dropdown-open");
        // console.log("jqDropdown =>", jqDropdown);
        // In some cases we don't want to show it
        if (event) {
          if ($(event.target).hasClass("cs-dropdown-ignore")) return;
          event.preventDefault();
          event.stopPropagation();
        } 
    else {
          if (
            trigger !== object.target &&
            $(object.target).hasClass("cs-dropdown-ignore")
          )
            return;
        }

        $(document).find('.dontCloseInGloablClick').removeClass("dontCloseInGloablClick")
        if(trigger.attr("stopdropdownclose") == "true") {
          // $(document).find(".cs-dropdown-open").removeClass("cs-dropdown-open");
          $(`#${trigger.attr("data-cs-dropdown").split("#")[1]}`).addClass("dontCloseInGloablClick");
        }

        $(document).find(".cs-fabDropDown").removeClass("cs-fabDropDown");
        if(trigger.attr("isfab") == "true") {
          $(`#${trigger.attr("data-cs-dropdown").split("#")[1]}`).addClass("cs-fabDropDown");
        }

        if(trigger.hasClass("cs-dropdown-open") && event != undefined ){
          trigger.removeClass("cs-dropdown-open");
        hide();
        }
        else{
          $(document).find(".cs-dropdown-open").removeClass("cs-dropdown-open");
        hide();

        // if (isOpen || trigger.hasClass('cs-dropdown-disabled')) return;
        // Show it
        trigger.addClass("cs-dropdown-open");
        console.log("Open>>>>>>>>>>>>>>>");
        jqDropdown.data("cs-dropdown-trigger", trigger).show();

        // Position it
        position();

        // Trigger the show callback
        jqDropdown.trigger("show", {
          jqDropdown: jqDropdown,
          trigger: trigger,
        });
      }

        
      }

      function hide(event) {
        // In some cases we don't hide them
        var targetGroup = event ? $(event.target).parents().addBack() : null;

        // Are we clicking anywhere in a cs-dropdown?
        if (targetGroup && targetGroup.is(".cs-dropdown")) {
          // Is it a cs-dropdown menu?
          if (targetGroup.is(".cs-dropdown-menu")) {
            // Did we click on an option? If so close it.
            if (!targetGroup.is("A")) return;
          } else {
            // Nope, it's a panel. Leave it open.
            return;
          }
        }

        // Hide any cs-dropdown that may be showing
        // if ($(".cs-dropdown").is(":visible")) {
          if(!$(".cs-dropdown").hasClass("dontCloseInGloablClick")){
            $(document).find(".cs-dropdown:visible").each(function () {
              var jqDropdown = $(this);
              jqDropdown.hide().removeData("cs-dropdown-trigger").trigger("hide", { jqDropdown: jqDropdown });
            });
        // Remove all cs-dropdown-open classes
        $(document).find(".cs-dropdown-open").removeClass("cs-dropdown-open");
      }
        // }
        console.log("Close<<<<<<<<<<<<<<<<<<<<<<");
      }

      function position() {
        $(".cs-dropdown").removeClass("dd-top");
    var winhei = $(window).outerHeight();
        var jqDropdown = $(".cs-dropdown:visible").eq(0);
        jqDropdown.removeClass("cs-dropdown-anchor-right");
        var trigger = jqDropdown.data("cs-dropdown-trigger");
        var hOffset = trigger ? parseInt(trigger.attr("data-horizontal-offset") || 0, 10) : null;
        var vOffset = trigger ? parseInt(trigger.attr("data-vertical-offset") || 0, 10) : null;
        var toolMenuHeight = $(jqDropdown.closest("app-root")[0]).find("ion-toolbar").height() || 0;
        var topHorizontalMenuHeight = $("app-menu").find(".cs-top-horizontal-menu").height() || 0;
        $(".cs-dropdown").css("max-height",((winhei/2)-toolMenuHeight - topHorizontalMenuHeight - 10)+'px');

        var leftPos = "";
        var topPos = "";
        
        if (jqDropdown.length === 0 || !trigger) return;

        // Position the cs-dropdown relative-to-parent...
        if (jqDropdown.hasClass("cs-dropdown-relative")) {
          leftPos = jqDropdown.hasClass("cs-dropdown-anchor-right") ? trigger.position().left - (jqDropdown.outerWidth(true) - trigger.outerWidth(true)) - parseInt(trigger.css("margin-right"), 10) + hOffset : trigger.position().left + parseInt(trigger.css("margin-left"), 10) + hOffset
          topPos = trigger.position().top + trigger.outerHeight(true) - parseInt(trigger.css("margin-top"), 10) + vOffset - toolMenuHeight - topHorizontalMenuHeight
          jqDropdown.css({
            left: leftPos,
           top: topPos,
          });
          $(".cs-tablemaping-dropdown").css("left", "auto");
          $(".cs-tablemaping-dropdown").css("right", "0");
          $(".cs-tablemaping-dropdown").css("top", "30px");
        } 
        // ...or relative to document
        else {
          leftPos = jqDropdown.hasClass("cs-dropdown-anchor-right") ? trigger.offset().left - (jqDropdown.outerWidth() - trigger.outerWidth()) + hOffset : trigger.offset().left + hOffset
          topPos = trigger.offset().top + trigger.outerHeight() + vOffset - window.scrollY - toolMenuHeight - topHorizontalMenuHeight
          jqDropdown.css({ 
            left: leftPos,
            top: topPos,
          });
          // rearrange left are right
          var winWid = $(window).outerWidth();
          var popupLeft = jqDropdown[0]["offsetLeft"];
          var popupWidth = jqDropdown[0]["clientWidth"];
          if (winWid - (popupLeft + popupWidth + 50) < 0) {
          jqDropdown.addClass("cs-dropdown-anchor-right");
          jqDropdown.css({ 
            left: jqDropdown.hasClass("cs-dropdown-anchor-right") ? trigger.offset().left - (jqDropdown.outerWidth() - trigger.outerWidth()) + hOffset : trigger.offset().left + hOffset,
            top: trigger.offset().top + trigger.outerHeight() + vOffset - window.scrollY - toolMenuHeight - topHorizontalMenuHeight,
            });
          } 
          else {
            jqDropdown.removeClass("cs-dropdown-anchor-right");
          }
          $(".cs-tablemaping-dropdown").css("left", "auto");
          $(".cs-tablemaping-dropdown").css("right", "0");
          $(".cs-tablemaping-dropdown").css("top", "30px");

          //auto position
          var ddhei = $(".cs-dropdown:visible").outerHeight();
          var ddtop = parseFloat($(".cs-dropdown:visible").css("top"));
          var ddbot = ddtop + ddhei + toolMenuHeight + topHorizontalMenuHeight;
          var thishei = trigger.outerHeight();

          if (window.scrollY > 0) {
            ddtop = ddtop - window.scrollY;
          }
          jqDropdown.removeClass("cs-tipchange");
          // for bottom to top
          // console.log('winhei',winhei)
          // console.log('ddhei',ddhei)
          // console.log('ddtop',ddtop)
          // console.log('thishei',thishei)
          // console.log('ddbot',ddbot)
          var ddtopset = ddtop
          if (ddbot > winhei) {
            // console.log('inside bottom to top');
            if (jqDropdown.hasClass("cs-dropdown-tip")) {
              // console.log('if');
              jqDropdown.addClass("cs-tipchange");
              ddtopset = ddtop - (thishei + ddhei + 17);
            } 
            else {
            // console.log('else');
              jqDropdown.removeClass("cs-tipchange");
              ddtopset = ddtop - (thishei + ddhei + 10);
            }
            $(".cs-dropdown").css("top", ddtopset + window.scrollY);
            $(".cs-dropdown").addClass("dd-top");
          }

          $(".cs-close-fab").css("top", ddtopset);
          $(".cs-close-fab").css("left",leftPos - 20);
          $(".cs-fab-view-dd .cs-close-fab").css("left",leftPos - 30);

        }
      }
       
      function removeFieldFocus(event) {
        $(document).find(".cdk-keyboard-focused").removeClass("cdk-keyboard-focused")
      }
      $(document).on("click",removeFieldFocus)
      $(document).on("click.cs-dropdown", "[data-cs-dropdown]", show);
      $(document).on("click.cs-dropdown", hide);
      $(window).on("resize", position);
    })(jQuery);
});