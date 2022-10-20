const userAssignment = function (layoutID,userAssignment,metaDbProvider,metaDbConfig){
    let userData = [];
    let groupData = [];
    let roleData = [];
    let responseData = [];
    let newObject = false
    let objectId = ''
    console.log("User Assignment JS file entered : Layout Id ---->"+ layoutID)

    // data prepartion while hovering ua icon
    $(document).off('mouseover').on('mouseover', '[userAssignmentKey=' + layoutID + '] .cs-click-position', function (e) {
       
        e.stopPropagation();
        let globalUaData = JSON.parse($(e.currentTarget).closest('.cs-userassign-click').attr("user-assignment"))
      
        if(objectId!==''){
            console.log("newObject",newObject)
            newObject  = (objectId == globalUaData['data']['id'])
        }
        objectId = globalUaData['data']['id']
        console.log("globalUaData",globalUaData['data'])
        console.log("objectId",objectId)

        let countTarget = $(e.currentTarget).closest('.cs-userassign-click')
        countTarget.find('.cs-ua-loader').show()
        countTarget.find(".cs-loader-text").hide();
        countTarget.find('.cs-loader').show()
        countTarget.find('.cs-ra-ua-assignedlist').hide()
        $(".cs-userinfoblock").removeClass("cs-nodata-indicater");
        
        if(!newObject){
            var key = []
            userData = []
            groupData = []
            roleData = []
            responseData = []

            key.push(globalUaData['data']['id']+"|"+globalUaData['data']['type']+'userAssignment')
            userAssignment.fetchUserAssignment(key,'CouchDB').then(res=> {
            if(res['status']==='SUCCESS'){
                if(res['records'] && res['records'].length> 0){
                    if(globalUaData['data']['id'] !==res['records'][0]['reference_id']){
                        userData = []
                        groupData = []
                        roleData = []
                        responseData = []
                    }
                    var taskList=[]
                    let userList  = res['records'].filter(el=>el['doc']['data']['id_type']==='User')
                    let groupList  =  res['records'].filter(el=>el['doc']['data']['id_type']==='Group')
                    let roleList =  res['records'].filter(el=>el['doc']['data']['id_type']==='Role')
                    let responseList =  res['records'].filter(el=>el['doc']['data']['id_type']==='Responsibilities')
                    if(groupList && groupList.length>0){
                        let id = []
                        groupList.map(el=>id.push(el['doc']['data']['user_group_id']))
                        taskList.push(mapUserGroupData(id))
                    }
                    if(userList && userList.length>0){
                        let id = []
                        userList.map(el=>id.push(el['doc']['data']['user_id']))
                        taskList.push(mapUserData(id))
                    }
                    if(roleList && roleList.length>0){
                        let id = []
                        roleList.map(el=>id.push(el['doc']['data']['role_id']))
                        taskList.push(mapRoleData(id))
                    }
                    if(responseList && responseList.length>0){
                        let id = []
                        responseList.map(el=>id.push(el['doc']['data']['responsibility_id'])) 
                        taskList.push(mapUserResponsibilitiesData(id))
                    }

                    return Promise.all(taskList).then(response => {
                        countTarget.find('.cs-ua-loader').show()
                        countTarget.find(".cs-loader-text").hide();
                        $(".cs-userinfoblock").removeClass("cs-nodata-indicater");
                        if (userData.length) {
                            countTarget.find('.cs-loader').hide();
                            countTarget.find(".cs-loader-text").hide();
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').show()
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').find('.cs-assignedcount').text(userData.length)
                        } else {
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').hide()
                        }
                        if (groupData.length) {
                            countTarget.find('.cs-loader').hide();
                            countTarget.find(".cs-loader-text").hide();
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').show()
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').find('.cs-assignedcount').text(groupData.length)
                        } else {
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').hide()
                        }
                        if (roleData.length) {
                            countTarget.find('.cs-loader').hide();
                            countTarget.find(".cs-loader-text").hide();
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').show()
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').find('.cs-assignedcount').text(roleData.length)
                        }
                        else {
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').hide()
                        }
                        if (responseData.length) {
                            countTarget.find('.cs-loader').hide();
                            countTarget.find(".cs-loader-text").hide();
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-responseassignedmain').show()
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-responseassignedmain').find('.cs-assignedcount').text(responseData.length)
                        }
                        else {
                            countTarget.find('.cs-ra-ua-assignedlist.cs-ra-responseassignedmain').hide()
                        }
                        if(userData.length == 0 && groupData.length == 0 && roleData.length == 0){
                            countTarget.find('.cs-ua-loader').show()    
                            countTarget.find('.cs-ra-ua-assignedlist').hide();
                            countTarget.find('.cs-loader').hide();
                            countTarget.find(".cs-loader-text").show();
                        }
                        console.log("if --------------------------");
                        console.log("user",userData)
                        console.log("group",groupData)             
                        console.log("role",roleData) 
                        console.log("responseData",responseData) 
                        return Promise.resolve(response)
                    })
                 }
                 else{
                    userData = []
                    groupData = []
                    roleData = []
                    responseData = []
                }
             }
             else{
                userData = []
                groupData = []
                roleData = []
                responseData = []
            }
         }).catch(err=> {
                 console.log("err",err)
            })
        }
        else{
            countTarget.find('.cs-ua-loader').show()
            countTarget.find(".cs-loader-text").hide();
            $(".cs-userinfoblock").removeClass("cs-nodata-indicater");
            if (userData.length) {
                countTarget.find('.cs-loader').hide();
                countTarget.find(".cs-loader-text").hide();
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').show()
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').find('.cs-assignedcount').text(userData.length)
            } else {
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').hide()
            }
            if (groupData.length) {
                countTarget.find('.cs-loader').hide();
                countTarget.find(".cs-loader-text").hide();
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').show()
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').find('.cs-assignedcount').text(groupData.length)
            } else {
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').hide()
            }
            if (roleData.length) {
                countTarget.find('.cs-loader').hide();
                countTarget.find(".cs-loader-text").hide();
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').show()
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').find('.cs-assignedcount').text(roleData.length)
            }
            else {
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').hide()
            }
            if (responseData.length) {
                countTarget.find('.cs-loader').hide();
                countTarget.find(".cs-loader-text").hide();
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-responseassignedmain').show()
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-responseassignedmain').find('.cs-assignedcount').text(responseData.length)
            }
            else {
                countTarget.find('.cs-ra-ua-assignedlist.cs-ra-responseassignedmain').hide()
            }
            if(userData.length == 0 && groupData.length == 0 && roleData.length == 0){
                console.log("else size check --------------------------");
                countTarget.find('.cs-ua-loader').show()    
                countTarget.find('.cs-ra-ua-assignedlist').hide();
                countTarget.find('.cs-loader').hide();
                countTarget.find(".cs-loader-text").show();
            }
            console.log("else --------------------------");
            console.log("user",userData)
            console.log("group",groupData)             
            console.log("role",roleData) 
            console.log("responseData",responseData) 
        }

        $(e.currentTarget).closest('.slick-cell').css({
            "z-index": "99",
            "overflow": "visible"
        })
        $(e.currentTarget).closest('.cs-userassign-click').addClass('hover-active')

        let cellLeftPos = $(e.currentTarget).closest('.cs-slick-user-list-assign').offset().left;
        // let slickscrollLeft = $(e.currentTarget).closest(".slick-viewport").prop("scrollLeft")
        var ddwid = $(".cs-userlisthoverblock").outerWidth();
        var winwid = $(window).width();
        let leftPos = cellLeftPos + $(e.currentTarget).width() + 15;
        let btnwidth=$(e.currentTarget).closest(".cs-click-position").width();

        if ($(".cdk-overlay-pane")[0] != undefined) {
            var popWinWidth = $(".cdk-overlay-pane").width();
            if (leftPos + ddwid > popWinWidth) {
                $(e.currentTarget).closest('.cs-userassign-click').addClass('righttoleft');
                $(e.currentTarget).find('.cs-userinfoblock').css({
                    "right": btnwidth,
                });
                $(e.currentTarget).closest('.cs-slick-user-list-assign').css({
                    "width": "unset"
                })
            } else {
                $(e.currentTarget).closest('.cs-userassign-click').removeClass('righttoleft');
                $(e.currentTarget).find('.cs-userinfoblock').css({
                    "right":"unset",
                });
                $(e.currentTarget).closest('.cs-slick-user-list-assign').css({
                    "width": "210px"
                })
            }
        } 
        else {
            if (leftPos + ddwid > winwid) {
                $(e.currentTarget).closest('.cs-userassign-click').addClass('righttoleft');
                $(e.currentTarget).find('.cs-userinfoblock').css({
                    "right": btnwidth,
                });
                // $(e.currentTarget).closest('.cs-slick-user-list-assign').css({
                //     "width": "unset"
                // })
            } else {
                $(e.currentTarget).closest('.cs-userassign-click').removeClass('righttoleft');
                $(e.currentTarget).find('.cs-userinfoblock').css({
                    "right":"unset",
                });
                // $(e.currentTarget).closest('.cs-slick-user-list-assign').css({
                //     "width": "210px"
                // })
            }
        }
            // let countTarget = $(e.currentTarget).closest('.cs-userassign-click')

            // countTarget.find('.cs-ua-loader').hide()
            // countTarget.find('.cs-ua-loader').show()
            // countTarget.find('.cs-ra-ua-assignedlist').hide()
            // countTarget.find('.cs-ua-loader').find(".cs-loader-text").hide();
            // $(".cs-userinfoblock").removeClass("cs-nodata-indicater");
            // setTimeout(()=>{
            //     countTarget.find('.cs-ua-loader').hide()
    
            //     if (userData.length) {
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').show()
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').find('.cs-assignedcount').text(userData.length)
            //     } else {
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').hide()
            //     }
            //     if (groupData.length) {
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').show()
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').find('.cs-assignedcount').text(groupData.length)
            //     } else {
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').hide()
            //     }
            //     if (roleData.length) {
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').show()
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').find('.cs-assignedcount').text(roleData.length)
            //     } else {
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').hide()
            //     }
            //     if (responseData.length) {
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-responseassignedmain').show()
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-responseassignedmain').find('.cs-assignedcount').text(responseData.length)
            //     } else {
            //         countTarget.find('.cs-ra-ua-assignedlist.cs-ra-responseassignedmain').hide()
            //     }
            //     if(userData.length == 0 && groupData.length == 0 && roleData.length == 0){
            //         $(".cs-userinfoblock").addClass("cs-nodata-indicater");
            //         countTarget.find('.cs-ua-loader').show()
            //         countTarget.find('.cs-ua-loader').find('.cs-loader').hide();
            //         countTarget.find('.cs-ua-loader').find(".cs-loader-text").show();
            //     }
            // },3000)
            
            // if (userData.length) {
            //     countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').show()
            //     countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').find('.cs-assignedcount').text(userData.length)
            // } else {
            //     countTarget.find('.cs-ra-ua-assignedlist.cs-ra-userassignedmain').hide()
            // }
            // if (groupData.length) {
            //     countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').show()
            //     countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').find('.cs-assignedcount').text(groupData.length)
            // } else {
            //     countTarget.find('.cs-ra-ua-assignedlist.cs-ra-usergroupassignedmain').hide()
            // }
            // if (roleData.length) {
            //     countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').show()
            //     countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').find('.cs-assignedcount').text(roleData.length)
            // } else {
            //     countTarget.find('.cs-ra-ua-assignedlist.cs-ra-roleassignedmain').hide()
            // }
        

    })

    // appending list div in body
    $(document).on('mouseenter', '[userAssignmentKey=' + layoutID + '] .cs-click-position', function (e) {
        $(".cs-userlisthoverblock").remove();
        if ($(".cs-userlisthoverblock").length === 0) {
            var hoverHtml = `<div class="clearfix cs-line cs-4x-radius cs-pf cs-b-white cs-userlisthoverblock" style="display: none;">
                            <h4 class="cs-ts-12 cs-tw-600 cs-bluec cs-hpad"></h4>
                            <ul class="clearfix cs-ua-hover-list cs-custom-scroll cs-pr"></ul>
                    </div>`;
            $("body").append(hoverHtml);
        }
        $('.cs-userassign-click').removeClass('cs-temp-hov-act')
        $(e.currentTarget).closest('.cs-userassign-click').addClass('cs-temp-hov-act')
    })

    // appending list div in body
    $(document).on('click', '[userAssignmentKey=' + layoutID + '] .cs-click-position', function (e) {
        $('.cs-click-position').removeClass('cs-userassign-active');
        $(e.currentTarget).closest('.cs-click-position').addClass('cs-userassign-active');
    })

    // while leaving the UA cell , close all popup and slide
    $(document).on('mouseleave', '[userAssignmentKey=' + layoutID + '] .cs-slick-user-list-assign', function (e) {
        $(e.currentTarget).find('.cs-userassign-click').removeClass('hover-active')
        $(".cs-userlisthoverblock").hide();
        // setTimeout(()=>{
        $(e.currentTarget).closest('.slick-cell').css({
            "z-index": "unset",
            "overflow": "hidden"
        })
        // },500)
    })

    // 3 dots enter
    $(document).on('mouseenter', '[userAssignmentKey=' + layoutID + '] .cs-ra-ua-assignedlist', function (e) {
        $('.cs-temp-hov-act').closest('.slick-cell').css({
            "z-index": "99",
            "overflow": "visible"
        })
        $('.cs-temp-hov-act').addClass('hover-active')


        $(".cs-userlisthoverblock").show();
        var userListName = "";
        if ($(e.currentTarget).hasClass('cs-ra-userassignedmain')) {
            userData.forEach((e) => {
                userListName += `<li class="cs-cur">${e}</li>`;
            });
        }
        if ($(e.currentTarget).hasClass('cs-ra-usergroupassignedmain')) {
            groupData.forEach((e) => {
                userListName += `<li class="cs-cur">${e}</li>`;
            });
        }
        if ($(e.currentTarget).hasClass('cs-ra-roleassignedmain')) {
            roleData.forEach((e) => {
                userListName += `<li class="cs-cur">${e}</li>`;
            });
        }
        if ($(e.currentTarget).hasClass('cs-ra-responseassignedmain')) {
            responseData.forEach((e) => {
                userListName += `<li class="cs-cur">${e}</li>`;
            });
        }
        $(".cs-userlisthoverblock").find("ul").empty();
        $(".cs-userlisthoverblock").find("ul").append(userListName);
        $(".cs-userlisthoverblock").find("h4").text(e.currentTarget.getAttribute("userdetails"));
    })

    // 3 dots hover dropdown position
    $(document).on('mouseover', '[userAssignmentKey=' + layoutID + '] .cs-ra-ua-assignedlist', function (e) {
        $(e.currentTarget).closest('.cs-userassign-click').addClass('fromddtodots')
        let popWinHeight = 0;
        let popWinWidth = 0;
        if ($(".cdk-overlay-pane")[0] != undefined) {
            popWinHeight = $(".cdk-overlay-pane").height();
            popWinWidth = $(".cdk-overlay-pane").width();
        }
        var winwid = $(window).width();
        var winhei = $(window).height();
        var ddwid = $(".cs-userlisthoverblock").outerWidth();
        var ddhei = $(".cs-userlisthoverblock").outerHeight();
        let pos = $(e.currentTarget).position();
        let scrolltop = $(e.currentTarget).closest(".slick-viewport").prop("scrollTop") || 0;
        // let cellLeftPos = $(e.currentTarget).closest('.slick-cell').offset().left;
        let cellitemLeftPos = $(e.currentTarget).closest('.cs-slick-user-list-assign').offset().left;
        // let slickscrollLeft = $(e.currentTarget).closest(".slick-viewport").prop("scrollLeft")
        let slickscrollTop = $(e.currentTarget).closest(".cs-custom-scroll").prop("scrollTop")
        // let checkHeight = parseInt($(e.currentTarget).closest('.slick-row').css('top').split('px')[0]) - scrolltop + winhei - $(e.currentTarget).closest('.slick-viewport').height() + ddhei
        let btnwidth=$(e.currentTarget).closest(".cs-click-position").width();
        let topPos = 0;
        let leftPos = 0;
        topPos=$(e.currentTarget).closest('.cs-slick-user-list-assign').offset().top+$(e.currentTarget).closest('.cs-slick-user-list-assign').height();
        if ( topPos+ddhei > winhei) {
            topPos= topPos - ddhei-$(e.currentTarget).closest('.cs-slick-user-list-assign').height();
        }

        leftPos = cellitemLeftPos  + pos.left + ($(e.currentTarget).width() / 2) + btnwidth;
        if ($(e.currentTarget).closest('.righttoleft')[0]) {
            leftPos = leftPos - $(e.currentTarget).closest('.cs-userinfoblock').width() - btnwidth;
        }

        if (leftPos + ddwid > winwid) {
            leftPos = leftPos - ddwid + ($(e.currentTarget).width() / 2)-20;
        }

        if ($(".cdk-overlay-pane")[0] != undefined) {
            topPos = parseInt($(e.currentTarget).closest('.slick-row').css('top').split('px')[0]) - scrolltop + winhei - $(e.currentTarget).closest('.slick-viewport').height() + 15 - slickscrollTop + $(e.currentTarget).closest('.slick-cell').height() + 11 + (winhei - popWinHeight) / 2 + 6
            if (topPos + ddhei > winhei) {
                topPos = topPos - ddhei - $(e.currentTarget).height()
            }
            leftPos = leftPos + (winwid - popWinWidth) / 2
            if (leftPos + ddwid > winwid) {
                leftPos = leftPos - ddwid + ($(e.currentTarget).width() / 2)
            }
        }

        $(".cs-userlisthoverblock").css({
            top: "" + topPos + "px",
            left: "" + leftPos + "px",
            display: "block",
        });
        $(".cs-userlisthoverblock").show();
        e.stopPropagation()
    })

    $(document).on('mouseleave', '[userAssignmentKey=' + layoutID + '] .cs-ra-ua-assignedlist', function (e) {
        $('.cs-userassign-click').removeClass('fromddtodots')
    })

    // dropdown hover
    $(document).on('mouseover', '.cs-userlisthoverblock', function (e) {
        $('.cs-temp-hov-act').closest('.slick-cell').css({
            "z-index": "99",
            "overflow": "visible"
        })
        $('.cs-temp-hov-act').addClass('hover-active')
        // $('.cs-temp-hov-act').removeClass('cs-temp-hov-act')
        $(".cs-userlisthoverblock").show();
        e.stopPropagation()
    })

    // clear while leaving th list dd
    $(document).on('mouseleave', '.cs-userlisthoverblock', function (e) {
        clearAll()
    })

    // Click acttion for different segments to open UA dropdown and clear exisitng all open option
    $(document).on('click', '[userAssignmentKey=' + layoutID + '] .cs-ra-ua-assignedlist', function (e) {
        let event = $(e.currentTarget);
        event.closest('.cs-click-position').find('em').trigger('click')
        setTimeout(() => {
            if (event.hasClass('cs-ra-userassignedmain')) {
                $('.cs-userassignment-tabs').find('.tabs__tab:nth-child(2)').trigger('click')
            } else if (event.hasClass('cs-ra-usergroupassignedmain')) {
                $('.cs-userassignment-tabs').find('.tabs__tab:nth-child(3)').trigger('click')
            } else if (event.hasClass('cs-ra-roleassignedmain')) {
                $('.cs-userassignment-tabs').find('.tabs__tab:nth-child(4)').trigger('click')
            } else if (event.hasClass('cs-ra-responseassignedmain')) {
                $('.cs-userassignment-tabs').find('.tabs__tab:nth-child(5)').trigger('click')
            }
            clearAll()
        })
    })

    function mapUserData(useridList)
    {
        console.log("mapUserData")
      
     var query = userAssignment.makeInQuery(useridList,metaDbConfig.corUsersObject,'user_id')
     return metaDbProvider.fetchDocsUsingSearchApi(query,metaDbConfig.corUsersObject).then(res=>
      {
        if(res['status']==='SUCCESS')
        {
             if(res['records'].length==0)
             {
                return Promise.resolve(true)
             }
             userData = []
           
          for(let j=0;j<res['records'].length;j++)
          {
              userData.push(res['records'][j]['username'])
          }
          return Promise.resolve(true)
             
        }
        else{
            return Promise.resolve(true)
        }
      }).catch(err=>
        {
            return Promise.resolve(true)
        })
    }
    function  mapRoleData(roleIdList)
    {
        console.log("mapRoleData")
       
        var query = userAssignment.makeInQuery(roleIdList,metaDbConfig.corRoles,'role_id')
           return metaDbProvider.fetchDocsUsingSearchApi(query, metaDbConfig.corRoles).then(res=>
            {
              if(res['status']==='SUCCESS')
              {
               if(res['records'].length==0)
               {
                return Promise.resolve(true)
               }
               roleData = []  
            for(let j=0;j<res['records'].length;j++)
          {
              roleData.push(res['records'][j]['role_name'])
          }
          return Promise.resolve(true)
              }
              else{
                return Promise.resolve(true)
              }
            }).catch(err=>
              {
                return Promise.resolve(true)
              })
    }
    function  mapUserGroupData(groupIdList)
    {
   
          var query = userAssignment.makeInQuery(groupIdList,metaDbConfig.userGroup,'user_group_id')
           return metaDbProvider.fetchDocsUsingSearchApi(query, metaDbConfig.userGroup).then(res=>
            {
                console.log("mapUserGroupData")
              if(res['status']==='SUCCESS'){

               if(res['records'].length==0){
                return Promise.resolve(true)
               }
               groupData = []
                //  let s= []
                // groupList.map(el=>s.push(el['doc']['data']['display_name']))
                // console.log(s)
                for(let j=0;j<res['records'].length;j++)
                {
                    groupData.push(res['records'][j]['display_name'])
                }
                return Promise.resolve(true)
              }
              else{
                return Promise.resolve(true)
              }
            }).catch(err=>
              {
                return Promise.resolve(true)
              })
    }
    function  mapUserResponsibilitiesData(responsibilitiesIdList) {
        var query = userAssignment.makeInQuery(responsibilitiesIdList, metaDbConfig.userResponsibility, 'responsibility_id')
        return metaDbProvider.fetchDocsUsingSearchApi(query, metaDbConfig.userResponsibility).then(res=>
            {
            
              if(res['status']==='SUCCESS'){

               if(res['records'].length==0){
                return Promise.resolve(true)
               }
               responseData = []
               
                for(let j=0;j<res['records'].length;j++)
                {
                    responseData.push(res['records'][j]['responsibility_name'])
                }
                return Promise.resolve(true)
              }
              else{
                return Promise.resolve(true)
              }
            }).catch(err=>
              {
                return Promise.resolve(true)
              })
      }
    function clearAll() {
        // hold for 5 msec 
        setTimeout(() => {
            if (!$('.cs-userassign-click').hasClass('fromddtodots')) {
                $('.hover-active').removeClass('hover-active')
                $(".cs-userlisthoverblock").hide();
                $(".cs-userassign-click").removeClass("hover-active");
                $('.slick-cell').css({
                    "z-index": "unset",
                    "overflow": "hidden"
                })
                $('.cs-userassign-click').removeClass('cs-temp-hov-act')
            }
        }, 500)
    }
    // remove only leaveing total cell are dropdown temp-hover but after 5 sec
}
