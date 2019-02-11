function t142_checkSize(recid) {
    var el = $("#rec" + recid).find(".t142__submit");
    if (el.length) {
        var btnheight = el.height() + 5;
        var textheight = el[0].scrollHeight;
        if (btnheight < textheight) {
            var btntext = el.text();
            el.addClass("t142__submit-overflowed");
            el.html("<span class=\"t142__text\">" + btntext + "</span>");
        }
    }
}

function t190_scrollToTop() {
    $('html, body').animate({scrollTop: 0}, 700);
}

function t228_highlight() {
    var url = window.location.href;
    var pathname = window.location.pathname;
    if (url.substr(url.length - 1) == "/") {
        url = url.slice(0, -1);
    }
    if (pathname.substr(pathname.length - 1) == "/") {
        pathname = pathname.slice(0, -1);
    }
    if (pathname.charAt(0) == "/") {
        pathname = pathname.slice(1);
    }
    if (pathname == "") {
        pathname = "/";
    }
    $(".t228__list_item a[href='" + url + "']").addClass("t-active");
    $(".t228__list_item a[href='" + url + "/']").addClass("t-active");
    $(".t228__list_item a[href='" + pathname + "']").addClass("t-active");
    $(".t228__list_item a[href='/" + pathname + "']").addClass("t-active");
    $(".t228__list_item a[href='" + pathname + "/']").addClass("t-active");
    $(".t228__list_item a[href='/" + pathname + "/']").addClass("t-active");
}

function t228_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t228_navLinks = $("#rec" + recid + " .t228__list_item a:not(.tooltipstered)[href*='#']");
        if (t228_navLinks.length > 0) {
            setTimeout(function () {
                t228_catchScroll(t228_navLinks);
            }, 500);
        }
    }
}

function t228_catchScroll(t228_navLinks) {
    var t228_clickedSectionId = null,
        t228_sections = new Array(),
        t228_sectionIdTonavigationLink = [],
        t228_interval = 100,
        t228_lastCall, t228_timeoutId;
    t228_navLinks = $(t228_navLinks.get().reverse());
    t228_navLinks.each(function () {
        var t228_cursection = t228_getSectionByHref($(this));
        if (typeof t228_cursection.attr("id") != "undefined") {
            t228_sections.push(t228_cursection);
        }
        t228_sectionIdTonavigationLink[t228_cursection.attr("id")] = $(this);
    });
    t228_updateSectionsOffsets(t228_sections);
    t228_sections.sort(function (a, b) {
        return b.attr("data-offset-top") - a.attr("data-offset-top");
    });
    $(window).bind('resize', t_throttle(function () {
        t228_updateSectionsOffsets(t228_sections);
    }, 200));
    $('.t228').bind('displayChanged', function () {
        t228_updateSectionsOffsets(t228_sections);
    });
    setInterval(function () {
        t228_updateSectionsOffsets(t228_sections);
    }, 5000);
    t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);

    t228_navLinks.click(function () {
        var t228_clickedSection = t228_getSectionByHref($(this));
        if (!$(this).hasClass("tooltipstered") && typeof t228_clickedSection.attr("id") != "undefined") {
            t228_navLinks.removeClass('t-active');
            $(this).addClass('t-active');
            t228_clickedSectionId = t228_getSectionByHref($(this)).attr("id");
        }
    });
    $(window).scroll(function () {
        var t228_now = new Date().getTime();
        if (t228_lastCall && t228_now < (t228_lastCall + t228_interval)) {
            clearTimeout(t228_timeoutId);
            t228_timeoutId = setTimeout(function () {
                t228_lastCall = t228_now;
                t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
            }, t228_interval - (t228_now - t228_lastCall));
        } else {
            t228_lastCall = t228_now;
            t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
        }
    });
}


function t228_updateSectionsOffsets(sections) {
    $(sections).each(function () {
        var t228_curSection = $(this);
        t228_curSection.attr("data-offset-top", t228_curSection.offset().top);
    });
}


function t228_getSectionByHref(curlink) {
    var t228_curLinkValue = curlink.attr("href").replace(/\s+/g, '');
    if (t228_curLinkValue[0] == '/') {
        t228_curLinkValue = t228_curLinkValue.substring(1);
    }
    if (curlink.is('[href*="#rec"]')) {
        return $(".r[id='" + t228_curLinkValue.substring(1) + "']");
    } else {
        return $(".r[data-record-type='215']").has("a[name='" + t228_curLinkValue.substring(1) + "']");
    }
}

function t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId) {
    var t228_scrollPosition = $(window).scrollTop(),
        t228_valueToReturn = t228_clickedSectionId;
    /*if first section is not at the page top (under first blocks)*/
    if (t228_sections.length != 0 && t228_clickedSectionId == null && t228_sections[t228_sections.length - 1].attr("data-offset-top") > (t228_scrollPosition + 300)) {
        t228_navLinks.removeClass('t-active');
        return null;
    }

    $(t228_sections).each(function (e) {
        var t228_curSection = $(this),
            t228_sectionTop = t228_curSection.attr("data-offset-top"),
            t228_id = t228_curSection.attr('id'),
            t228_navLink = t228_sectionIdTonavigationLink[t228_id];
        if (((t228_scrollPosition + 300) >= t228_sectionTop) || (t228_sections[0].attr("id") == t228_id && t228_scrollPosition >= $(document).height() - $(window).height())) {
            if (t228_clickedSectionId == null && !t228_navLink.hasClass('t-active')) {
                t228_navLinks.removeClass('t-active');
                t228_navLink.addClass('t-active');
                t228_valueToReturn = null;
            } else {
                if (t228_clickedSectionId != null && t228_id == t228_clickedSectionId) {
                    t228_valueToReturn = null;
                }
            }
            return false;
        }
    });
    return t228_valueToReturn;
}

function t228_setPath() {
}

function t228_setWidth(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function () {
            var el = $(this);
            var left_exist = el.find('.t228__leftcontainer').length;
            var left_w = el.find('.t228__leftcontainer').outerWidth(true);
            var max_w = left_w;
            var right_exist = el.find('.t228__rightcontainer').length;
            var right_w = el.find('.t228__rightcontainer').outerWidth(true);
            var items_align = el.attr('data-menu-items-align');
            if (left_w < right_w) max_w = right_w;
            max_w = Math.ceil(max_w);
            var center_w = 0;
            el.find('.t228__centercontainer').find('li').each(function () {
                center_w += $(this).outerWidth(true);
            });
            var padd_w = 40;
            var maincontainer_width = el.find(".t228__maincontainer").outerWidth(true);
            if (maincontainer_width - max_w * 2 - padd_w * 2 > center_w + 20) {
                //if(left_exist>0 && right_exist>0){
                if (items_align == "center" || typeof items_align === "undefined") {
                    el.find(".t228__leftside").css("min-width", max_w + "px");
                    el.find(".t228__rightside").css("min-width", max_w + "px");
                    el.find(".t228__list").removeClass("t228__list_hidden");
                }
            } else {
                el.find(".t228__leftside").css("min-width", "");
                el.find(".t228__rightside").css("min-width", "");

            }
        });
    }
}

function t228_setBg(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function () {
            var el = $(this);
            if (el.attr('data-bgcolor-setbyscript') == "yes") {
                var bgcolor = el.attr("data-bgcolor-rgba");
                el.css("background-color", bgcolor);
            }
        });
    } else {
        $(".t228").each(function () {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-hex");
            el.css("background-color", bgcolor);
            el.attr("data-bgcolor-setbyscript", "yes");
        });
    }
}

function t228_appearMenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function () {
            var el = $(this);
            var appearoffset = el.attr("data-appearoffset");
            if (appearoffset != "") {
                if (appearoffset.indexOf('vh') > -1) {
                    appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                }

                appearoffset = parseInt(appearoffset, 10);

                if ($(window).scrollTop() >= appearoffset) {
                    if (el.css('visibility') == 'hidden') {
                        el.finish();
                        el.css("top", "-50px");
                        el.css("visibility", "visible");
                        var topoffset = el.data('top-offset');
                        if (topoffset && parseInt(topoffset) > 0) {
                            el.animate({"opacity": "1", "top": topoffset + "px"}, 200, function () {
                            });

                        } else {
                            el.animate({"opacity": "1", "top": "0px"}, 200, function () {
                            });
                        }
                    }
                } else {
                    el.stop();
                    el.css("visibility", "hidden");
                    el.css("opacity", "0");
                }
            }
        });
    }

}

function t228_changebgopacitymenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function () {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-rgba");
            var bgcolor_afterscroll = el.attr("data-bgcolor-rgba-afterscroll");
            var bgopacityone = el.attr("data-bgopacity");
            var bgopacitytwo = el.attr("data-bgopacity-two");
            var menushadow = el.attr("data-menushadow");
            if (menushadow == '100') {
                var menushadowvalue = menushadow;
            } else {
                var menushadowvalue = '0.' + menushadow;
            }
            if ($(window).scrollTop() > 20) {
                el.css("background-color", bgcolor_afterscroll);
                if (bgopacitytwo == '0' || (typeof menushadow == "undefined" && menushadow == false)) {
                    el.css("box-shadow", "none");
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")");
                }
            } else {
                el.css("background-color", bgcolor);
                if (bgopacityone == '0.0' || (typeof menushadow == "undefined" && menushadow == false)) {
                    el.css("box-shadow", "none");
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")");
                }
            }
        });
    }
}

function t228_createMobileMenu(recid) {
    var window_width = $(window).width(),
        el = $("#rec" + recid),
        menu = el.find(".t228"),
        burger = el.find(".t228__mobile");
    burger.click(function (e) {
        menu.fadeToggle(300);
        $(this).toggleClass("t228_opened")
    })
    $(window).bind('resize', t_throttle(function () {
        window_width = $(window).width();
        if (window_width > 980) {
            menu.fadeIn(0);
        }
    }, 200));
}


function t282_showMenu(recid) {
    var el = $("#rec" + recid);
    el.find('.t282__burger, .t282__menu__item:not(".tooltipstered"), .t282__overlay').click(function () {
        if ($(this).is(".t282__menu__item.tooltipstered, .t794__tm-link")) {
            return;
        }
        $('body').toggleClass('t282_opened');
        el.find('.t282__menu__container, .t282__overlay').toggleClass('t282__closed');
        el.find(".t282__menu__container").css({'top': (el.find(".t282__container").height() + 'px')});
    });
    $('.t282').bind('clickedAnchorInTooltipMenu', function () {
        $('body').removeClass('t282_opened');
        $('#rec' + recid + ' .t282__menu__container, #rec' + recid + ' .t282__overlay').addClass('t282__closed');
    });
}

function t282_changeSize(recid) {
    var el = $("#rec" + recid);
    var bottomheight = el.find(".t282__menu__container");
    var headerheight = el.find(".t282__container");
    var menu = bottomheight.height() + headerheight.height();
    var win = $(window).height();
    if (menu > win) {
        $("#nav" + recid).addClass('t282__menu_static');
    } else {
        $("#nav" + recid).removeClass('t282__menu_static');
    }
}

function t282_changeBgOpacityMenu(recid) {
    var window_width = $(window).width();
    var record = $("#rec" + recid);
    record.find(".t282__container__bg").each(function () {
        var el = $(this);
        var bgcolor = el.attr("data-bgcolor-rgba");
        var bgcolor_afterscroll = el.attr("data-bgcolor-rgba-afterscroll");
        var bgopacity = el.attr("data-bgopacity");
        var bgopacity_afterscroll = el.attr("data-bgopacity2");
        var menu_shadow = el.attr("data-menu-shadow");
        if ($(window).scrollTop() > 20) {
            el.css("background-color", bgcolor_afterscroll);
            if (bgopacity_afterscroll != "0" && bgopacity_afterscroll != "0.0") {
                el.css('box-shadow', menu_shadow);
            } else {
                el.css('box-shadow', 'none');
            }
        } else {
            el.css("background-color", bgcolor);
            if (bgopacity != "0" && bgopacity != "0.0") {
                el.css('box-shadow', menu_shadow);
            } else {
                el.css('box-shadow', 'none');
            }
        }
    });
}

function t282_highlight(recid) {
    var url = window.location.href;
    var pathname = window.location.pathname;
    if (url.substr(url.length - 1) == "/") {
        url = url.slice(0, -1);
    }
    if (pathname.substr(pathname.length - 1) == "/") {
        pathname = pathname.slice(0, -1);
    }
    if (pathname.charAt(0) == "/") {
        pathname = pathname.slice(1);
    }
    if (pathname == "") {
        pathname = "/";
    }
    $(".t282__menu a[href='" + url + "']").addClass("t-active");
    $(".t282__menu a[href='" + url + "/']").addClass("t-active");
    $(".t282__menu a[href='" + pathname + "']").addClass("t-active");
    $(".t282__menu a[href='/" + pathname + "']").addClass("t-active");
    $(".t282__menu a[href='" + pathname + "/']").addClass("t-active");
    $(".t282__menu a[href='/" + pathname + "/']").addClass("t-active");
}

function t282_appearMenu(recid) {
    var window_width = $(window).width();
    $(".t282").each(function () {
        var el = $(this);
        var appearoffset = el.attr("data-appearoffset");
        if (appearoffset != "") {
            if (appearoffset.indexOf('vh') > -1) {
                appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
            }

            appearoffset = parseInt(appearoffset, 10);

            if ($(window).scrollTop() >= appearoffset) {
                if (el.css('visibility') == 'hidden') {
                    el.finish();
                    el.css("top", "-50px");
                    el.css("visibility", "visible");
                    el.animate({"opacity": "1", "top": "0px"}, 200, function () {
                    });
                }
            } else {
                el.stop();
                el.css("visibility", "hidden");
            }
        }
    });

}


function t390_showPopup(recid) {
    var el = $('#rec' + recid),
        popup = el.find('.t-popup');

    popup.css('display', 'block');
    setTimeout(function () {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show');
    }, 50);

    $('body').addClass('t-body_popupshowed');

    el.find('.t-popup').click(function (e) {
        if (e.target == this) {
            t390_closePopup();
        }
    });

    el.find('.t-popup__close').click(function (e) {
        t390_closePopup();
    });

    el.find('a[href*=#]').click(function (e) {
        var url = $(this).attr('href');
        if (!url || url.substring(0, 7) != '#price:') {
            t390_closePopup();
            if (!url || url.substring(0, 7) == '#popup:') {
                setTimeout(function () {
                    $('body').addClass('t-body_popupshowed');
                }, 300);
            }
        }
    });

    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            t390_closePopup();
        }
    });
}

function t390_closePopup() {
    $('body').removeClass('t-body_popupshowed');
    $('.t-popup').removeClass('t-popup_show');
    setTimeout(function () {
        $('.t-popup').not('.t-popup_show').css('display', 'none');
    }, 300);
}

function t390_resizePopup(recid) {
    var el = $("#rec" + recid),
        div = el.find(".t-popup__container").height(),
        win = $(window).height() - 120,
        popup = el.find(".t-popup__container");
    if (div > win) {
        popup.addClass('t-popup__container-static');
    } else {
        popup.removeClass('t-popup__container-static');
    }
}

/* deprecated */
function t390_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7);
    }

    virtPage += popupname;
    virtTitle += popupname;
    if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
        Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
    } else {
        if (ga) {
            if (window.mainTracker != 'tilda') {
                ga('send', {'hitType': 'pageview', 'page': virtPage, 'title': virtTitle});
            }
        }

        if (window.mainMetrika > '' && window[window.mainMetrika]) {
            window[window.mainMetrika].hit(virtPage, {title: virtTitle, referer: window.location.href});
        }
    }
}

function t390_initPopup(recid) {
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t-popup'),
        hook = el.attr('data-tooltip-hook'),
        analitics = el.attr('data-track-popup');
    if (hook !== '') {
        $('.r').on('click', 'a[href="' + hook + '"]', function (e) {
            t390_showPopup(recid);
            t390_resizePopup(recid);
            e.preventDefault();
            if (window.lazy == 'y') {
                t_lazyload_update();
            }
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7);
                }
                Tilda.sendEventToStatistics(analitics, virtTitle);
            }
        });
    }
}

function t397_init(recid) {
    var el = $('#rec' + recid);
    el.find('.t397__tab').click(function () {
        el.find('.t397__tab').removeClass('t397__tab_active');
        $(this).addClass('t397__tab_active');
        t397_alltabs_updateContent(recid);
        t397_updateSelect(recid);
        $('.t230, .t670, .t347, .t346, .t519, .t774, .t764, .t744, .t349, .t650, .t604, .t117, .t517, .t609, .t351, .t353, .t341, .t404, .t385, .t386, .t412, .t268, .t425, .t409, .t384, .t279, .t428, .t418, .t433, .t121, .t478, .t498, .t552, .t544, .t554, .t545, .t486, .t570, .t422, .t601, .t228, .t229, .t456, .t592, .t520, .t599, .t422, .t504, .t688, .t675, .t132, .t616, .t686, .t778, .t615, .t433, .t598, .t762, .t538, .t226, .t698, .t760, .t511, .t799, .t780, .t827, .t740, .t480, .t827, .t829, .t605, .t726, .t728, .t822, .t798, .t801, .t694, .t842, .t843, .t849, .t850, .t851, .t856, .t858, .t859, .t860, .t396, .t518, .t738, .t532').trigger('displayChanged');
        setTimeout(function () {
            $('.t351, .t353, .t341, .t404, .t385, .t386, .t412, .t268, .t425, .t409, .t384, .t279, .t428, .t433, .t545, .t422, .t410, .t829, .t396, .t738').trigger('displayChanged')
        }, 50);
        if (window.lazy == 'y') {
            t_lazyload_update()
        }
    });
    t397_alltabs_updateContent(recid);
    t397_updateContentBySelect(recid);
    $('.t397').bind('displayChanged', function () {
        t397_alltabs_updateContent(recid);
        t397_updateContentBySelect(recid);
    });
    var bgcolor = el.css("background-color");
    var bgcolor_target = el.find(".t397__select, .t397__firefoxfix");
    bgcolor_target.css("background-color", bgcolor)
}

function t397_alltabs_updateContent(recid) {
    var el = $('#rec' + recid);
    el.find(".t397__tab").each(function (i) {
        var rec_ids = $(this).attr('data-tab-rec-ids').split(',');
        rec_ids.forEach(function (rec_id, i, arr) {
            var rec_el = $('#rec' + rec_id);
            rec_el.attr('data-connect-with-tab', 'yes');
            rec_el.attr('data-animationappear', 'off');
            rec_el.addClass('t379__off')
        })
    });
    el.find(".t397__tab_active").each(function (i) {
        if ($(this).is(":visible") || el.find(".t397__select").is(":visible")) {
            var rec_ids = $(this).attr('data-tab-rec-ids').split(',');
            rec_ids.forEach(function (rec_id, i, arr) {
                var rec_el = $('#rec' + rec_id);
                rec_el.removeClass('t379__off');
                rec_el.css('opacity', '')
            })
        }
    });
}

function t397_updateContentBySelect(recid) {
    var el = $('#rec' + recid);
    el.find(".t397__select").change(function () {
        var select_val = el.find(".t397__select").val();
        var tab_index = el.find(".t397__tab[data-tab-rec-ids='" + select_val + "']");
        tab_index.trigger('click')
    })
}

function t397_updateSelect(recid) {
    var el = $('#rec' + recid);
    var current_tab = el.find(".t397__tab_active").attr('data-tab-rec-ids');
    var el_select = el.find(".t397__select");
    el_select.val(current_tab)
}

function t552_init(recid, ratio) {
    var t552__el = $("#rec" + recid),
        t552__image = t552__el.find(".t552__blockimg:first");

    t552__setHeight(recid, t552__image, ratio);
    var t552__doResize;
    $(window).resize(function () {
        clearTimeout(t552__doResize);
        t552__doResize = setTimeout(function () {
            t552__setHeight(recid, t552__image, ratio);
        }, 200);
    });
}

function t552__setHeight(recid, image, ratio) {
    $("#rec" + recid + " .t552__blockimg").css("height", Math.round(image.innerWidth() * ratio));
}

function t635_init(recid) {
    t635_startType(recid);
}


function t635_startType(recid) {
    var t635_el = $('#rec' + recid),
        t635_data = t635_el.find(".t635__textholder"),
        t635_animRecId = t635_data.attr("data-recid"),
        t635_animText = t635_findAnimElem(t635_animRecId),
        t635_phrasesList = [],
        t635_phrase1 = t635_data.attr("data-text1"),
        t635_phrase2 = t635_data.attr("data-text2"),
        t635_phrase3 = t635_data.attr("data-text3"),
        t635_phrase4 = t635_data.attr("data-text4"),
        t635_phrase5 = t635_data.attr("data-text5"),
        t635_speed = t635_data.attr("data-speed"),
        t635_loop = t635_data.attr("data-loop"),
        t635_backspaceDelay = t635_data.attr("data-backspacing-delay");
    if (typeof t635_animText == "undefined") {
        return;
    }
    if (typeof t635_phrase1 != "undefined") {
        t635_phrasesList.push(t635_phrase1.slice(0, 80));
    }
    if (typeof t635_phrase2 != "undefined") {
        t635_phrasesList.push(t635_phrase2.slice(0, 80));
    }
    if (typeof t635_phrase3 != "undefined") {
        t635_phrasesList.push(t635_phrase3.slice(0, 80));
    }
    if (typeof t635_phrase4 != "undefined") {
        t635_phrasesList.push(t635_phrase4.slice(0, 80));
    }
    if (typeof t635_phrase5 != "undefined") {
        t635_phrasesList.push(t635_phrase5.slice(0, 80));
    }


    if (t635_animText.length != 0 && t635_phrasesList.length != 0) {
        var t635_animTextHtml = t635_animText.html(),
            t635_animTextSplitted = t635_animTextHtml.split("|"),
            t635_curWin = $(window);
        t635_animText.html(t635_animTextSplitted[0] + "<span class=\"t635__typing-text\"></span>" + t635_animTextSplitted[1]);

        t635_updateAnimTextLimits(t635_animRecId);
        t635_curWin.bind('resize', t_throttle(function () {
            t635_updateAnimTextLimits(t635_animRecId);
        }, 200));
        setInterval(function () {
            t635_updateAnimTextLimits(t635_animRecId);
        }, 5000);

        var t635_animatedText = $("#rec" + t635_animRecId + " .t635__typing-text"),
            t635_animTextTop = t635_animatedText.attr("data-top-limit"),
            t635_animTextBottom = t635_animatedText.attr("data-bottom-limit"),
            t635_winTop = t635_curWin.scrollTop(),
            t635_winBottom = t635_winTop + t635_curWin.height();
        t635_animateText(t635_animRecId, t635_phrasesList, t635_speed, t635_loop, t635_backspaceDelay);
        if (t635_animTextBottom < t635_winTop || t635_animTextTop > t635_winBottom) {
            $("#rec" + t635_animRecId + " .t635__typing-text").data('typed').pauseTyping();
            $("#rec" + t635_animRecId + " .t635__typing-text").html("");
        }

        t635_curWin.bind('scroll', t_throttle(function () {
            t635_animTextTop = t635_animatedText.attr("data-top-limit");
            t635_animTextBottom = t635_animatedText.attr("data-bottom-limit");
            t635_winTop = t635_curWin.scrollTop();
            t635_winBottom = t635_winTop + t635_curWin.height();
            if (t635_animTextBottom < t635_winTop || t635_animTextTop > t635_winBottom) {
                $("#rec" + t635_animRecId + " .t635__typing-text").data('typed').pauseTyping();
                $("#rec" + t635_animRecId + " .t635__typing-text").html("");
            } else {
                $("#rec" + t635_animRecId + " .t635__typing-text").data('typed').continueTyping();
            }
        }, 200));
    }
}


function t635_findAnimElem(animRecId) {
    var animRec = $("#rec" + animRecId);
    var animH1 = animRec.find("h1:contains(\'|\')").last();
    var animH2 = animRec.find("h2:contains(\'|\')").last();
    var animH3 = animRec.find("h3:contains(\'|\')").last();
    var animDiv = animRec.find("div:contains(\'|\')").last();
    if (typeof animH1 != "undefined" && animH1.length > 0) {
        return animH1;
    }
    if (typeof animH2 != "undefined" && animH2.length > 0) {
        return animH2;
    }
    if (typeof animH3 != "undefined" && animH3.length > 0) {
        return animH3;
    }
    if (typeof animDiv != "undefined" && animDiv.length > 0) {
        return animDiv;
    }
}


function t635_updateAnimTextLimits(t635_animRecId) {
    var t635_animatedBlock = $("#rec" + t635_animRecId),
        t635_animatedText = t635_animatedBlock.find(".t635__typing-text");
    t635_animatedText.attr("data-top-limit", t635_animatedText.offset().top);
    t635_animatedText.attr("data-bottom-limit", (t635_animatedBlock.offset().top + t635_animatedBlock.height()));
}


function t635_animateText(t635_animRecId, t635_phrasesList, t635_speed, t635_loop, t635_backspaceDelay) {
    if (typeof t635_speed == "undefined") {
        t635_speed = 40;
    }
    if (typeof t635_backspaceDelay == "undefined") {
        t635_backspaceDelay = 800;
    }
    if (typeof t635_loop == "undefined") {
        t635_loop = true;
    } else {
        t635_loop = false;
    }
    $("#rec" + t635_animRecId + " .t635__typing-text").typed({
        strings: t635_phrasesList,
        typeSpeed: t635_speed * 1,
        startDelay: 600,
        backSpeed: 10,
        backDelay: t635_backspaceDelay * 1,
        loop: t635_loop,
        contentType: 'text'
    });
}

function t651_initPopup(recid) {
    if (window.$isMobile) {
        if ($('#rec' + recid + ' .t651__phone').length == 0) {
            return;
        }
        t651_phone = $('#rec' + recid + ' .t651__phone').html().replace(/\s+/g, '');
        $('#rec' + recid + ' .t651__btn').click(function () {
            window.location.href = "tel:" + t651_phone;
            $('.t651__btn_wrapper').removeClass('t651__btn_animate');
            $('.t651__btn-text').css('display', 'none');
        });
        return;
    }
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t651__popup'),
        analitics = el.attr('data-track-popup'),
        hook = "TildaCallBackWidget" + recid,
        obj = $('#rec' + recid + ' .t651__btn');
    obj.click(function (e) {
        if (obj.hasClass("t651__btn_active")) {
            t651_closePopup();
            return;
        }
        obj.addClass("t651__btn_active");
        t651_showPopup(recid);
        e.preventDefault();
        if (analitics > '') {
            Tilda.sendEventToStatistics(analitics, hook);
        }
    });
}

function t651_showPopup(recid) {
    var el = $('#rec' + recid),
        popup = el.find('.t651__popup');

    $('.t651__btn_wrapper').removeClass('t651__btn_animate');
    $('.t651__btn-text').css('display', 'none');

    popup.css('display', 'block');
    setTimeout(function () {
        popup.addClass('t651__popup_show');
    }, 50);

    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            t651_closePopup();
        }
    });
}

function t651_closePopup() {
    $('.t651__btn').removeClass('t651__btn_active');
    $('.t651__popup').removeClass('t651__popup_show');
    setTimeout(function () {
        $('.t651__popup').not('.t651__popup_show').css('display', 'none');
    }, 300);
}

function t651_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7);
    }

    virtPage += popupname;
    virtTitle += popupname;
    if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
        Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
    } else {

        if (ga) {
            if (window.mainTracker != 'tilda') {
                ga('send', {'hitType': 'pageview', 'page': virtPage, 'title': virtTitle});
            }
        }

        if (window.mainMetrika > '' && window[window.mainMetrika]) {
            window[window.mainMetrika].hit(virtPage, {title: virtTitle, referer: window.location.href});
        }

    }
}

function t702_onSuccess(t702_form) {
    var t702_inputsWrapper = t702_form.find('.t-form__inputsbox');
    var t702_inputsHeight = t702_inputsWrapper.height();
    var t702_inputsOffset = t702_inputsWrapper.offset().top;
    var t702_inputsBottom = t702_inputsHeight + t702_inputsOffset;
    var t702_targetOffset = t702_form.find('.t-form__successbox').offset().top;

    if ($(window).width() > 960) {
        var t702_target = t702_targetOffset - 200;
    } else {
        var t702_target = t702_targetOffset - 100;
    }

    if (t702_targetOffset > $(window).scrollTop() || ($(document).height() - t702_inputsBottom) < ($(window).height() - 100)) {
        t702_inputsWrapper.addClass('t702__inputsbox_hidden');
        setTimeout(function () {
            if ($(window).height() > $('.t-body').height()) {
                $('.t-tildalabel').animate({opacity: 0}, 50);
            }
        }, 300);
    } else {
        $('html, body').animate({scrollTop: t702_target}, 400);
        setTimeout(function () {
            t702_inputsWrapper.addClass('t702__inputsbox_hidden');
        }, 400);
    }

    var successurl = t702_form.data('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function () {
            window.location.href = successurl;
        }, 500);
    }

}


function t702_lockScroll() {
    var body = $("body");
    if (!body.hasClass('t-body_scroll-locked')) {
        var bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        body.addClass('t-body_scroll-locked');
        body.css("top", "-" + bodyScrollTop + "px");
        body.attr("data-popup-scrolltop", bodyScrollTop);
    }
}

function t702_unlockScroll() {
    var body = $("body");
    if (body.hasClass('t-body_scroll-locked')) {
        var bodyScrollTop = $("body").attr("data-popup-scrolltop");
        body.removeClass('t-body_scroll-locked');
        body.css("top", "");
        body.removeAttr("data-popup-scrolltop")
        window.scrollTo(0, bodyScrollTop);
    }
}


function t702_showPopup(recid) {
    var el = $('#rec' + recid),
        popup = el.find('.t-popup');

    popup.css('display', 'block');
    el.find('.t-range').trigger('popupOpened');
    if (window.lazy == 'y') {
        t_lazyload_update();
    }
    setTimeout(function () {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show');
    }, 50);

    $('body').addClass('t-body_popupshowed t702__body_popupshowed');
    /*fix IOS11 cursor bug + general IOS background scroll*/
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
        setTimeout(function () {
            t702_lockScroll();
        }, 500);
    }
    el.find('.t-popup').click(function (e) {
        if (e.target == this) {
            t702_closePopup();
        }
    });

    el.find('.t-popup__close').click(function (e) {
        t702_closePopup();
    });

    el.find('a[href*="#"]').click(function (e) {
        var url = $(this).attr('href');
        if (!url || url.substring(0, 7) != '#price:') {
            t702_closePopup();
            if (!url || url.substring(0, 7) == '#popup:') {
                setTimeout(function () {
                    $('body').addClass('t-body_popupshowed');
                }, 300);
            }
        }
    });

    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            t702_closePopup();
        }
    });
}

function t702_closePopup() {
    $('body').removeClass('t-body_popupshowed t702__body_popupshowed');
    /*fix IOS11 cursor bug + general IOS background scroll*/
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
        t702_unlockScroll();
    }
    $('.t-popup').removeClass('t-popup_show');
    setTimeout(function () {
        $('.t-popup').not('.t-popup_show').css('display', 'none');
    }, 300);
}

function t702_resizePopup(recid) {
    var el = $("#rec" + recid),
        div = el.find(".t-popup__container").height(),
        win = $(window).height() - 120,
        popup = el.find(".t-popup__container");
    if (div > win) {
        popup.addClass('t-popup__container-static');
    } else {
        popup.removeClass('t-popup__container-static');
    }
}

/* deprecated */
function t702_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7);
    }

    virtPage += popupname;
    virtTitle += popupname;
    if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
        Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
    } else {
        if (ga) {
            if (window.mainTracker != 'tilda') {
                ga('send', {'hitType': 'pageview', 'page': virtPage, 'title': virtTitle});
            }
        }

        if (window.mainMetrika > '' && window[window.mainMetrika]) {
            window[window.mainMetrika].hit(virtPage, {title: virtTitle, referer: window.location.href});
        }
    }
}

function t702_initPopup(recid) {
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t-popup'),
        hook = el.attr('data-tooltip-hook'),
        analitics = el.attr('data-track-popup');
    if (hook !== '') {
        var obj = $('a[href="' + hook + '"]');
        obj.click(function (e) {
            t702_showPopup(recid);
            t702_resizePopup(recid);
            e.preventDefault();
            if (window.lazy == 'y') {
                t_lazyload_update();
            }
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7);
                }

                Tilda.sendEventToStatistics(analitics, virtTitle);
            }

        });
    }
}

function t706_onSuccessCallback(t706_form) {
    /*if (typeof localStorage === 'object') {
       try {
         localStorage.removeItem("tcart");
       } catch (e) {
         console.log('Your web browser does not support localStorage.');
       }
    }
    delete window.tcart;
    tcart__loadLocalObj();*/
    $(".t706__cartwin-products").slideUp(10, function () {
    });
    $(".t706__cartwin-bottom").slideUp(10, function () {
    });
    $(".t706 .t-form__inputsbox").slideUp(700, function () {
    });
    /*window.tcart_success='yes';*/
    try {
        /*fix IOS11 cursor bug + general IOS background scroll*/
        tcart__unlockScroll();
    } catch (e) {
    }
}

function t762_init(recid) {
    t_sldsInit(recid);

    setTimeout(function () {
        t_prod__init(recid);
    }, 500);

    $('#rec' + recid).find('.t762').bind('displayChanged', function () {
        t_slds_updateSlider(recid);
    });
}

function t786__init(recid) {
    setTimeout(function () {
        t_prod__init(recid);
        t786_initPopup(recid);
        t786__updateLazyLoad(recid);
    }, 500);
}

function t786__updateLazyLoad(recid) {
    var scrollContainer = $("#rec" + recid + " .t786__container_mobile-flex");
    var curMode = $(".t-records").attr("data-tilda-mode");
    if (scrollContainer.length && curMode != "edit" && curMode != "preview") {
        scrollContainer.bind('scroll', t_throttle(function () {
            t_lazyload_update();
        }, 500));
    }
}

function t786_initPopup(recid) {
    var rec = $('#rec' + recid);
    rec.find('[href^="#prodpopup"]').one("click", function (e) {
        e.preventDefault();
        var el_popup = rec.find('.t-popup');
        var el_prod = $(this).closest('.js-product');
        var lid_prod = el_prod.attr('data-product-lid');
        t_sldsInit(recid + ' #t786__product-' + lid_prod + '');
    });
    rec.find('[href^="#prodpopup"]').click(function (e) {
        e.preventDefault();
        t786_showPopup(recid);
        var el_popup = rec.find('.t-popup');
        var el_prod = $(this).closest('.js-product');
        var lid_prod = el_prod.attr('data-product-lid');
        el_popup.find('.js-product').css('display', 'none');
        var el_fullprod = el_popup.find('.js-product[data-product-lid="' + lid_prod + '"]')
        el_fullprod.css('display', 'block');

        var analitics = el_popup.attr('data-track-popup');
        if (analitics > '') {
            var virtTitle = el_fullprod.find('.js-product-name').text();
            if (!virtTitle) {
                virtTitle = 'prod' + lid_prod;
            }
            Tilda.sendEventToStatistics(analitics, virtTitle);
        }

        var curUrl = window.location.href;
        if (curUrl.indexOf('#!/tproduct/') < 0 && curUrl.indexOf('%23!/tproduct/') < 0) {
            if (typeof history.replaceState != 'undefined') {
                window.history.replaceState('', '', window.location.href + '#!/tproduct/' + recid + '-' + lid_prod);
            }
        }
        t786_updateSlider(recid + ' #t786__product-' + lid_prod + '');
        if (window.lazy == 'y') {
            t_lazyload_update();
        }
    });
    if ($('#record' + recid).length == 0) {
        t786_checkUrl(recid);
    }
    t786_copyTypography(recid);
}

function t786_checkUrl(recid) {
    var curUrl = window.location.href;
    var tprodIndex = curUrl.indexOf('#!/tproduct/');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && tprodIndex < 0) {
        tprodIndex = curUrl.indexOf('%23!/tproduct/');
    }
    if (tprodIndex >= 0) {
        var curUrl = curUrl.substring(tprodIndex, curUrl.length);
        var curProdLid = curUrl.substring(curUrl.indexOf('-') + 1, curUrl.length);
        var rec = $('#rec' + recid);
        if (curUrl.indexOf(recid) >= 0 && rec.find('[data-product-lid=' + curProdLid + ']').length) {
            rec.find('[data-product-lid=' + curProdLid + '] [href^="#prodpopup"]').triggerHandler('click');
        }
    }
}

function t786_updateSlider(recid) {
    var el = $('#rec' + recid);
    t_slds_SliderWidth(recid);
    var sliderWrapper = el.find('.t-slds__items-wrapper');
    var sliderWidth = el.find('.t-slds__container').width();
    var pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
    sliderWrapper.css({
        transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
    });
    t_slds_UpdateSliderHeight(recid);
    t_slds_UpdateSliderArrowsHeight(recid);
}

function t786_showPopup(recid) {
    var el = $('#rec' + recid);
    var popup = el.find('.t-popup');

    popup.css('display', 'block');
    setTimeout(function () {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show');
        if (window.lazy == 'y') {
            t_lazyload_update();
        }
    }, 50);

    $('body').addClass('t-body_popupshowed');

    el.find('.t-popup').click(function (e) {
        if (e.target == this) {
            t786_closePopup();
        }
    });

    el.find('.t-popup__close, .t786__close-text').click(function (e) {
        t786_closePopup();
    });

    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            t786_closePopup();
        }
    });
}

function t786_closePopup() {
    $('body').removeClass('t-body_popupshowed');
    $('.t-popup').removeClass('t-popup_show');
    var curUrl = window.location.href;
    var indexToRemove = curUrl.indexOf('#!/tproduct/');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && indexToRemove < 0) {
        indexToRemove = curUrl.indexOf('%23!/tproduct/');
    }
    curUrl = curUrl.substring(0, indexToRemove);
    setTimeout(function () {
        $(".t-popup").scrollTop(0);
        $('.t-popup').not('.t-popup_show').css('display', 'none');
        if (typeof history.replaceState != 'undefined') {
            window.history.replaceState('', '', curUrl);
        }
    }, 300);
}

function t786_removeSizeStyles(styleStr) {
    if (typeof styleStr != "undefined" && (styleStr.indexOf('font-size') >= 0 || styleStr.indexOf('padding-top') >= 0 || styleStr.indexOf('padding-bottom') >= 0)) {
        var styleStrSplitted = styleStr.split(';');
        styleStr = "";
        for (var i = 0; i < styleStrSplitted.length; i++) {
            if (styleStrSplitted[i].indexOf('font-size') >= 0 || styleStrSplitted[i].indexOf('padding-top') >= 0 || styleStrSplitted[i].indexOf('padding-bottom') >= 0) {
                styleStrSplitted.splice(i, 1);
                i--;
                continue;
            }
            if (styleStrSplitted[i] == "") {
                continue;
            }
            styleStr += styleStrSplitted[i] + ";";
        }
    }
    return styleStr;
}

function t786_copyTypography(recid) {
    var rec = $('#rec' + recid);
    var titleStyle = rec.find('.t786__title').attr('style');
    var descrStyle = rec.find('.t786__descr').attr('style');
    rec.find('.t-popup .t786__title').attr("style", t786_removeSizeStyles(titleStyle));
    rec.find('.t-popup .t786__descr, .t-popup .t786__text').attr("style", t786_removeSizeStyles(descrStyle));
}

function t859_init(recid) {
    var rec = $('#rec' + recid);
    var container = rec.find('.t859');
    var doResize;

    t859_unifyHeights(rec);

    $(window).resize(function () {
        clearTimeout(doResize);
        doResize = setTimeout(function () {
            t859_unifyHeights(rec);
        }, 200);
    });

    $(window).load(function () {
        t859_unifyHeights(rec);
    });

    $('.t859').bind('displayChanged', function () {
        t859_unifyHeights(rec);
    });

    if (container.hasClass('t859__previewmode')) {
        setInterval(function () {
            t859_unifyHeights(rec);
        }, 5000);
    }
}


function t859_unifyHeights(rec) {
    if ($(window).width() >= 960) {
        rec.find('.t859 .t-container .t859__row').each(function () {
            var highestBox = 0;
            var currow = $(this);
            $('.t859__inner-col', this).each(function () {
                var curCol = $(this);
                var curWrap = curCol.find('.t859__wrap');
                var curColHeight = curWrap.outerHeight();
                if (curColHeight > highestBox) {
                    highestBox = curColHeight;
                }
            });
            $('.t859__inner-col', this).css('height', highestBox);
        });
    } else {
        $('.t859__inner-col').css('height', 'auto');
    }
}

function t875_init(recid) {
    if (document.layers) {
        document.captureEvents(Event.MOUSEDOWN);
    }
    document.onmousedown = t875_click;
    document.oncontextmenu = function (event) {
        var event = event || window.event;
        var sender = event.target || event.srcElement;
        if (sender.tagName.match(/INPUT|TEXTAREA/i)) {
            return;
        } else {
            return false;
        }
    };
    t875_preventSelection(document);
    t875_preventUserSelect();
}


function t875_preventUserSelect() {
    $('body').css({
        '-ms-user-select': 'none',
        '-moz-user-select': 'none',
        '-webkit-user-select': 'none',
        'user-select': 'none',
        '-webkit-touch-callout': 'none'
    });
}

function t875_click(event) {
    t875_returnPrevent(event);

    if (document.all) {
        if (event.button == 2) {
            return false;
        }
    }
    if (document.layers) {
        if (event.which == 3) {
            return false;
        }
    }
}


function t875_preventSelection(element) {
    var preventSelection = false;

    t875_addHandler(element, 'mousemove', function () {
        if (preventSelection) {
            t875_removeSelection();
        }
    });

    t875_addHandler(element, 'mousedown', function (event) {
        var event = event || window.event;
        var sender = event.target || event.srcElement;
        preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
    });

    t875_addHandler(element, 'mouseup', function () {
        if (preventSelection) {
            t875_removeSelection();
        }
        preventSelection = false;
    });

    t875_addHandler(element, 'keydown', t875_killCtrlA);
    t875_addHandler(element, 'keyup', t875_killCtrlA);
    t875_addHandler(element, 'keydown', t875_killCtrlU);
    t875_addHandler(element, 'keyup', t875_killCtrlU);
    t875_addHandler(element, 'keydown', t875_killAltCmdI);
    t875_addHandler(element, 'keyup', t875_killAltCmdI);
    t875_addHandler(element, 'keydown', t875_killCtrlShiftI);
    t875_addHandler(element, 'keyup', t875_killCtrlShiftI);
}


function t875_addHandler(element, event, handler) {
    if (element.attachEvent) {
        element.attachEvent('on' + event, handler);
    } else {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        }
    }
}


function t875_removeSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection && document.selection.clear) {
        document.selection.clear();
    }
}


function t875_killCtrlU(event) {
    t875_returnPrevent(event);

    var key = event.keyCode || event.which;
    if ((event.ctrlKey && key == 'U'.charCodeAt(0)) || (event.altKey && event.metaKey && (key == 'U'.charCodeAt(0) || key == 'u'.charCodeAt(0)))) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
}


function t875_killAltCmdI(event) {
    t875_returnPrevent(event);

    var key = event.keyCode || event.which;
    if (event.altKey && event.metaKey && (key == 'I'.charCodeAt(0) || key == 'i'.charCodeAt(0))) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
}


function t875_killCtrlShiftI(event) {
    t875_returnPrevent(event);

    var key = event.keyCode || event.which;
    if (event.shiftKey && event.ctrlKey && (key == 'I'.charCodeAt(0) || key == 'i'.charCodeAt(0))) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
}


function t875_killCtrlA(event) {
    var event = event || window.event;
    var sender = event.target || event.srcElement;
    if (sender.tagName.match(/INPUT|TEXTAREA|BUTTON/i)) {
        return;
    }

    var key = event.keyCode || event.which;
    if ((event.ctrlKey && key == 'A'.charCodeAt(0)) || (event.metaKey && key == 'A'.charCodeAt(0))) {
        t875_removeSelection();
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
}


function t875_returnPrevent(event) {
    var event = event || window.event;
    var sender = event.target || event.srcElement;
    if (sender.tagName.match(/INPUT|TEXTAREA/i)) {
        return;
    }
}
