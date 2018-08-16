$(function () {
    if (window.module_mandatory_login_for_chat) window.AccountObject = new AccountClass()
});
window.AdClass = (function () {
    'use strict';
    var searchRgxDeliveryRequestLogin = /(^\?|&)delivery_request_login=true(&|$)/, hashRgxLogin = /#login/,
        SEARCH_DELIVERY_REQUEST_LOGIN = 'delivery_request_login=true',
        ENDPOINT_SAFEDEAL_API = '/ajax/safedeal/request/', SELECTOR_DELIVERY_REQUEST_BUTTON = '#deliveryRequestButton',
        SELECTOR_DELIVERY_REQUEST_SENT_FLAG = '#deliveryRequestSent', trackEvent = function (eventName) {
            if (!(NinjaTracker && NinjaTracker.push && NinjaTracker.getDataFrom && trackingData)) return;
            NinjaTracker.push(NinjaTracker.mergeValidOptionalParams(NinjaTracker.getDataFrom(trackingData.pageView), {
                trackEvent: [eventName],
                action_type: eventName
            }))
        };
    return BaseClass.extend({
        init: function () {
            this._super();
            this.adsenseOptions = {};
            this.initPrevNext();
            this.initSendingMail();
            this.initOverlay();
            this.initContact();
            this.initPhonesInDescription();
            this.initReport();
            if (window.module_ucell_trackers_off === undefined) this.initMap();
            if ($('.offeractions').length > 0) this.initFixedSidebar();
            this.initSearch();
            this.initShowNumber();
            this.initABtestOptions();
            this.initPrintOptions();
            this.initGoToTop();
            this.initCaptcha();
            this.initOwnerBar();
            this.initDogs();
            this.initDFPCalcWidget();
            this.initScreening();
            this.initDFPFloorAd();
            this.initShowNumberWithCaptcha();
            this.initDeliveryRequest();
            if (method === 'index') this.initAdsense();
            if (typeof messageSent != 'undefined' && messageSent == '1') if (window.user_logged == 1) {
                ShowMessage.success('Р’Р°С€Рµ СЃРѕРѕР±С‰РµРЅРёРµ РѕС‚РїСЂР°РІР»РµРЅРѕ Р°РІС‚РѕСЂСѓ РѕР±СЉСЏРІР»РµРЅРёСЏ.')
            } else ShowMessage.success('Р’Р°С€Рµ СЃРѕРѕР±С‰РµРЅРёРµ РѕС‚РїСЂР°РІР»РµРЅРѕ Р°РІС‚РѕСЂСѓ РѕР±СЉСЏРІР»РµРЅРёСЏ.');
            this.initFacebook();
            this.initFastreplyTooltip();
            if (this.isModuleActive('comperiabox')) this.initComperia();
            if (this.isChrome() && this.getChromeVersion() > 34) $.cookie('from_detail', 1, {
                path: '/',
                domain: '.' + window.session_domain
            });
            this.CVupload = new CVuploadClass(this);
            this.JobsMessagePrefill = new JobsMessagePrefillClass()
        },
        initScreening: function () {
            var $banner = $('.fullscreen-banner');
            if ($banner.length) {
                var $document = $(document), topBanner = $banner.offset().top, fixBanner = function fixBanner() {
                    var yScroll = Math.abs($document.scrollTop());
                    if (yScroll >= topBanner) {
                        $banner.addClass('fix').css('top', 0)
                    } else $banner.removeClass('fix').css('top', '')
                };
                fixBanner();
                $(window).scroll(function () {
                    fixBanner()
                });
                $(window).resize(function () {
                    fixBanner()
                })
            }
        },
        initDFPCalcWidget: function () {
            var $dfpCalcWidgetSlider = $("#dfpCalcWidgetSlider");
            if ($dfpCalcWidgetSlider.length > 0) {
                var $period = $('#dfpCalcWidget_field_3'), imSliding = function imSliding(event, ui) {
                        $period.val([ui.value])
                    }, val = parseInt($period.val(), 10), periodMin = parseInt($('#periodMin').val(), 10),
                    periodMax = parseInt($('#periodMax').val(), 10);
                $dfpCalcWidgetSlider.slider({step: 1, min: periodMin, max: periodMax, value: val, slide: imSliding})
            }
            ;$('#dfpCalcWidget').click(function () {
                var url = $(this).find('#link').val(), serialize = $(this).data('serialize');
                if (serialize) url += $(this).serialize();
                window.open(url);
                return false
            })
        },
        initDogs: function () {
            var thiz = this;
            if (thiz.isModuleActive('dogs') && !$.cookie('dogs_accepted')) $('#dogs_vote_button').click(function () {
                if ($.cookie('dogs_accepted')) return true;
                thiz.showDogsLayer();
                return false
            })
        },
        initFacebook: function () {
            if ($('#fb_offerLikeButton').length) {
                var cache = $.ajaxSettings.cache;
                $.ajaxSettings.cache = true;
                $.getScript(fb_connect_url, function () {
                    FB.init({appId: fb_app_id, status: true, cookie: true, xfbml: true})
                });
                $.ajaxSettings.cache = cache
            }
        },
        initSendingMail: function () {
            var $sendmailContent = $($('#sendmail').attr('href')), thiz = this;
            $('#sendmail').fancybox({
                onStart: function () {
                    $sendmailContent.show()
                }, autoScale: false, autoDimensions: true, scrolling: 'no', onClosed: function () {
                    $sendmailContent.hide();
                    $('#sendmailSuccess').hide()
                }, onCleanup: function () {
                    $sendmailContent.unwrap()
                }
            });
            var $sendmailForm = $sendmailContent.children('form');
            if ($sendmailForm.length) $sendmailForm.validate({
                rules: {
                    name: {required: true, maxlength: 50},
                    email: {required: true, email: true},
                    friendsEmail: {required: true, email: true},
                    ad: {required: true}
                }, submitHandler: function () {
                    var serialized = $sendmailForm.serializeArray(), fields = {};
                    for (var i = 0; i < serialized.length; i++) fields[serialized[i].name] = serialized[i].value;
                    thiz.post('misc', 'sharebyemail', fields, function (data) {
                        var $outterStatus = $('#sendmailSuccess').hide(),
                            $innerStatus = $outterStatus.children('div').removeClass();
                        if (data.error) {
                            $outterStatus.show();
                            $innerStatus.html(data.error).addClass('error_js')
                        } else if (data.errors && !$.isEmptyObject(data.errors)) {
                            $sendmailForm.validate().showErrors(data.errors)
                        } else {
                            $sendmailForm.find('input[name=friendsEmail]').val('');
                            $outterStatus.show();
                            $innerStatus.html('Р’Р°С€Рµ РѕР±СЉСЏРІР»РµРЅРёРµ СѓСЃРїРµС€РЅРѕ РѕС‚РїСЂР°РІР»РµРЅРѕ РЅР° email' + fields.friendsEmail).addClass('success_js')
                        }
                    }, 'json');
                    return false
                }
            }).showErrorsFromAction();
            $('#sendmailClose').click(function () {
                $.fancybox.close();
                return false
            })
        },
        initOverlay: function () {
            var thiz = this;
            thiz.oGallery = {
                overgallery: $('.overgallery'),
                overgalleryImgFrame: $('.overgallery').find('.photospace'),
                bigImage: null,
                bigImageDIV: $('#bigImage'),
                currentImage: 1,
                bigGallery: $('#bigGallery a'),
                overlayMapInitialized: false,
                galerryClicked: false,
                overgalleryIE7: function () {
                    var layerHeight = thiz.oGallery.overgallery.find('.vertical').height(),
                        viewportHeight = $(window).height();
                    if (layerHeight < viewportHeight) {
                        var layerValign = parseInt((viewportHeight - layerHeight) / 2);
                        thiz.oGallery.overgallery.find('.vertical').css('marginTop', layerValign)
                    } else thiz.oGallery.overgallery.find('.vertical').css('marginTop', 0)
                },
                overGalleryFun: function () {
                    $('.offeractions').removeClass('fix');
                    var maxImageWidth = '1000', maxImageHeight = '700',
                        overgalleryWidth = thiz.oGallery.overgallery.width(),
                        overgalleryHeight = thiz.oGallery.overgallery.height(),
                        layertitleHeight = thiz.oGallery.overgallery.find('.layertitle').height(),
                        optionsX = thiz.oGallery.overgallery.find('.optionsbar').width(),
                        optionsY = thiz.oGallery.overgallery.find('.photosbar').height(),
                        photospaceWidth = parseInt(overgalleryWidth - optionsX > maxImageWidth ? maxImageWidth : overgalleryWidth - optionsX),
                        photospaceHeight = parseInt(overgalleryHeight - optionsY - layertitleHeight > maxImageHeight ? maxImageHeight : overgalleryHeight - optionsY - layertitleHeight),
                        isOpera = (navigator.userAgent.indexOf('Opera') > -1);
                    if (isOpera) {
                        $('#operaDOM').remove();
                        $('body').prepend('<div id="operaDOM"></div>')
                    }
                    ;thiz.oGallery.overgalleryImgFrame.css({width: photospaceWidth, height: photospaceHeight});
                    if ($.browser.msie && parseInt($.browser.version, 10) == '7') thiz.oGallery.overgalleryIE7()
                },
                overgalleryImage: function () {
                    var currentImageHeight = thiz.oGallery.overgalleryImgFrame.children('img').height(),
                        photospaceHeight = thiz.oGallery.overgalleryImgFrame.height(),
                        imageValign = parseInt((photospaceHeight - currentImageHeight) / 2);
                    thiz.oGallery.overgalleryImgFrame.children('img').css('top', imageValign)
                },
                setThumbs: function () {
                    thiz.oGallery.bigGallery.each(function () {
                        var $a = $(this), $img = $('<img />').attr('src', $a.attr('rel'));
                        $img.appendTo($a);
                        $a.click(function () {
                            if (thiz.oGallery.bigImage) thiz.oGallery.bigImage.show();
                            if (thiz.oGallery.bigImage.attr('src') != $a.attr('href')) {
                                thiz.oGallery.bigImageDIV.addClass('loading').removeClass('ismap');
                                thiz.oGallery.bigImage.removeAttr('src').attr('src', $a.attr('href')).show()
                            }
                            ;$('#showOnlyImage').attr('href', $a.attr('href')).show();
                            thiz.oGallery.currentImage = parseInt($a.data("nr"));
                            thiz.oGallery.bigGallery.removeClass('selected');
                            $a.addClass('selected');
                            $('.overgalleryMap').hide();
                            return false
                        })
                    })
                },
                setMapLayer: function () {
                    if (window.module_ucell_trackers_off === undefined) google.load('maps', '3', {
                        other_params: 'client=' + mapclient + '&channel=' + mapchannel,
                        callback: function () {
                            thiz.oGallery.bigImageDIV.addClass('ismap');
                            if (!thiz.oGallery.overlayMapInitialized) {
                                var $div = $('<div/>').addClass('overgalleryMap').css({
                                    width: '78%',
                                    height: '100%',
                                    margin: '0 auto'
                                });
                                $div.prependTo(thiz.oGallery.bigImage.parent());
                                var overlaymapobj = thiz.oGallery.overlayMap($div, {}, {});
                                $('.overgalleryMap').data('map', overlaymapobj);
                                thiz.oGallery.overlayMapInitialized = true;
                                $('.searchLocationInput').watermark()
                            }
                            ;$('.overgalleryMap').show();
                            $('#showOnlyImage').hide();
                            thiz.oGallery.bigImage.hide();
                            thiz.oGallery.bigImageDIV.removeClass('loading');
                            google.maps.event.trigger($('.overgalleryMap').data('map'), 'resize')
                        }
                    })
                },
                overlayMap: function ($el, options, markerOptions) {
                    if (window.module_ucell_trackers_off === undefined) {
                        var mapOptions = $('#mapcontainer').data(), map = new google.maps.Map($el.get(0), {
                                center: new google.maps.LatLng(mapOptions.lat, mapOptions.lon),
                                mapTypeId: google.maps.MapTypeId.ROADMAP,
                                zoom: parseInt(mapOptions.zoom),
                                scrollwheel: true
                            }),
                            icon = (window.map_show_detailed == 1 && mapOptions.rad <= 0) ? 'imageSelected' : 'imageZone';
                        if (markerOptions != undefined) {
                            var imageSelected = new google.maps.MarkerImage(marker_default, new google.maps.Size(67, 48), new google.maps.Point(0, 0), new google.maps.Point(18, 50)),
                                imageZone = new google.maps.MarkerImage(marker_zone, new google.maps.Size(278, 278), new google.maps.Point(0, 0), new google.maps.Point(135, 135)),
                                markerImage = icon == 'imageSelected' ? imageSelected : null;
                            if (icon != 'imageZone') {
                                new google.maps.Marker($.extend({}, {
                                    position: new google.maps.LatLng(mapOptions.lat, mapOptions.lon),
                                    icon: markerImage
                                }, markerOptions, {map: map}))
                            } else new google.maps.Circle($.extend({
                                center: new google.maps.LatLng(mapOptions.lat, mapOptions.lon),
                                strokeColor: '#eeb1a6',
                                strokeOpacity: 0.8,
                                strokeWeight: 5,
                                fillColor: '#f7dcd7',
                                fillOpacity: 0.35,
                                radius: mapOptions.rad > 0 ? parseInt(mapOptions.rad) : 2500
                            }, {map: map}))
                        }
                        ;
                        return map
                    }
                },
                loadGallery: function () {
                    if (thiz.oGallery.bigImage == null) {
                        thiz.oGallery.bigImage = $('<img />');
                        thiz.oGallery.bigImage.prependTo(thiz.oGallery.bigImageDIV);
                        thiz.oGallery.bigImage.load(function () {
                            thiz.oGallery.bigImageDIV.removeClass('loading');
                            thiz.oGallery.overgalleryImage()
                        });
                        $('#showMapLayer').click(thiz.oGallery.setMapLayer);
                        thiz.oGallery.setThumbs();
                        thiz.showGalleryBanner()
                    }
                    ;$('#bigImageContent').show();
                    thiz.oGallery.bigGallery.eq(thiz.oGallery.currentImage - 1).click();
                    thiz.oGallery.overGalleryFun()
                },
                overGalleryEvents: function () {
                    $('#overgalleryclose').click(function () {
                        thiz.oGallery.overgallery.fadeOut(function () {
                            $('body').css('overflow', '')
                        });
                        return false
                    });
                    $(document).bind('click', function (e) {
                        var $clicked = $(e.target);
                        if (!$clicked.parents().hasClass('optionsbar') && !$clicked.parents().hasClass('viewspace') && !$clicked.parents().hasClass('layertitle') && !$clicked.parents().hasClass('fancybox-container')) thiz.oGallery.overgallery.fadeOut(function () {
                            $('body').css('overflow', '')
                        })
                    });
                    $('#enlargephoto, .zoom-overlay').click(function () {
                        var $this = $(this);
                        $this.parent().find('img.bigImage').click();
                        return false
                    });
                    $(window).resize(function () {
                        if (!thiz.oGallery.overgallery.is(':hidden') && thiz.oGallery.overgallery.length > 0) {
                            thiz.oGallery.overGalleryFun();
                            thiz.oGallery.overgalleryImage()
                        }
                    });
                    $('img.bigImage').click(function () {
                        if (!thiz.oGallery.galerryClicked) {
                            thiz.oGallery.galerryClicked = true;
                            if (typeof _gaq != 'undefined') _gaq.push(['_trackPageview']);
                            if (typeof xt_med != 'undefined' && typeof xtsite != 'undefined' && typeof window.remove_old_ati === "undefined") xt_med('F', xtsite, '')
                        }
                        ;var $this = $(this);
                        $('body').css('overflow', 'hidden');
                        thiz.oGallery.currentImage = parseInt($this.data("nr"));
                        thiz.oGallery.loadGallery();
                        return false
                    })
                },
                bindEvents: function () {
                    if ($('img.bigImage').length > 0) thiz.oGallery.overGalleryEvents();
                    $('.bigImagePrev, .bigImageNext').click(function () {
                        var $this = $(this),
                            index = thiz.oGallery.currentImage + ($this.hasClass('bigImagePrev') ? -1 : 1);
                        if (thiz.oGallery.bigGallery.length === index) if (typeof NinjaTracker !== 'undefined') NinjaTracker.push(NinjaTracker.mergeValidOptionalParams(NinjaTracker.getDataFrom(trackingData.pageView), {
                            trackEvent: ['gallery_open_swipe_end'],
                            action_type: 'gallery_open_swipe_end',
                            touch_point_page: 'gallery_open'
                        }));
                        if (!thiz.oGallery.bigGallery.eq(index - 1).length) index = $this.hasClass('bigImagePrev') ? thiz.oGallery.bigGallery.length : 1;
                        thiz.oGallery.bigGallery.eq(index - 1).click();
                        return false
                    });
                    $(document).keydown(function (e) {
                        if ((e.keyCode == 37 || e.keyCode == 39) && !thiz.oGallery.overgallery.is(':hidden') && thiz.oGallery.bigGallery.length > 1) {
                            var index = thiz.oGallery.currentImage + (e.keyCode == 37 ? -1 : 1);
                            if (!thiz.oGallery.bigGallery.eq(index - 1).length) index = e.keyCode == 37 ? thiz.oGallery.bigGallery.length : 1;
                            thiz.oGallery.bigGallery.eq(index - 1).click();
                            return false
                        }
                    });
                    $(document).keydown(function (e) {
                        if (e.keyCode == 27 && !thiz.oGallery.overgallery.is(':hidden')) {
                            thiz.oGallery.overgallery.fadeOut(function () {
                                $('body').css('overflow', '')
                            });
                            return false
                        }
                    })
                }
            };
            thiz.oGallery.bindEvents()
        },
        initPhonesInDescription: function () {
            if (window.module_phone_in_desc != 1) return;
            var hiddenPhones = $('#offerdescription, #offer-content').find('.spoilerHidden');
            hiddenPhones.click(function () {
                var adIDRaw = $(this).data('raw'), adID = $(this).data('id');
                hiddenPhones.each(function () {
                    var $this = $(this), phone = $this.data('phone') + '';
                    $this.unbind('click');
                    $this.replaceWith(phone)
                });
                var url = www_base_ajax + '/misc/contact/desc/' + adID + '/';
                $.get(url, function (data) {
                });
                if (useExternalScripts && typeof window.remove_old_ati === "undefined") {
                    var myxt = xtcustom, p = 'desc_showing_phone';
                    myxt.action_type = p;
                    p += ';' + adIDRaw;
                    delete myxt.page_name;
                    xt_med('C', '', p + '&stc=' + encodeURIComponent(JSON.stringify(myxt)), 'A')
                }
            })
        },
        initContact: function () {
            var thiz = this;
            if (window.module_mandatory_login_for_chat && action == 'ad' && method == 'contact' && typeof window.remove_old_ati === "undefined") if (!window.user_logged) {
                var tracking = {}, xt_temp = xtcustom;
                xt_temp.touch_point_button = xtcustom.touch_point_button;
                xt_temp.touch_point_page = 'adpage';
                tracking.xt_temp = xt_temp;
                tracking.event = 'reply_chat_login_close';
                thiz.initMandatoryLogin({redirectOnClose: 'http://' + site_domain + '/' + adID}, tracking);
                var xt_temp = xtcustom;
                xt_temp.action_type = 'reply_chat_click';
                xt_temp.touch_point_button = 'message_top';
                xt_temp.touch_point_page = 'adpage';
                xt_med('C', '', 'reply_chat_click&stc=' + encodeURIComponent(JSON.stringify(xt_temp)))
            }
            ;$('#offer-show').toggle(function () {
                $('#addetails, #offer-content').slideDown(300);
                $(this).find('span').text('РЎРІРµСЂРЅСѓС‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ')
            }, function () {
                $('#addetails, #offer-content').slideUp(300);
                $(this).find('span').text('РџРѕРєР°Р·Р°С‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ РїРѕР»РЅРѕСЃС‚СЊСЋ')
            });
            $('textarea#ask-text').autoResize().trigger('change');
            if ($('#answerbox').length > 0) $('#ask-text').focus();
            setTimeout(function () {
                if ($('div.captcha').hasClass('error')) $('#ask-captcha').focus()
            }, 500);
            $('#upload-a').click(function () {
                thiz.sendTracking('attachment_upload_step1');
                $('#upload-div').show();
                return false
            });
            $('ul.attachments').length && $('#upload-a').click();
            $('a.prev-link').each(function () {
                $(this).show().bind('click', function () {
                    if ($(this).data("preventClick") == true) return;
                    if (window.prevLink != undefined) {
                        $(this).attr('href', prevLink + window.location.hash)
                    } else {
                        window.history.back();
                        return false
                    }
                })
            });
            $.validator.addMethod("phone", function (value, element) {
                if ($.trim(value).length == 0) return true;
                if (/^[0-9 \-,\+\(\)]+$/i.test(value)) {
                    var candidates = [].concat(value.split(',') || '');
                    for (var i in candidates) {
                        var matches = candidates[i].match(/(\d+)/g);
                        if (matches == null) return false;
                        var number = matches.join("");
                        if (number == '123456789') return false;
                        if (number.length < 7 || number.length > 14) return false
                    }
                    ;
                    return true
                }
                ;
                return false
            }, 'СЌС‚Рѕ РЅРµ РїРѕС…РѕР¶Рµ РЅР° РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР°');
            var rulesObj = {
                'contact[txt]': {required: true, maxlength: 5e3, minlength: 20},
                'contact[email]': {required: true, maxlength: 255, email: true},
                'contact[captcha]': {required: true},
                'contact[phone]': {
                    required: function (element) {
                        return $(element).data('required')
                    }, phone: true, maxlength: 50
                }
            };
            if (thiz.isModuleActive('answers_with_phone')) rulesObj['contact[userFromPhone]'] = {phone: true};
            $('#contact-form,#contact-form2').each(function () {
                var $form = $(this);
                if ((!thiz.isIE() || thiz.getIEVersion() > 7)) $form.validate({
                    rules: rulesObj,
                    submitHandler: function (form) {
                        $(form).find('input[type=submit]').attr('disabled', 'disabled');
                        $form.find('#javascript').val(eval($form.find('#javascript').val()));
                        $('#securitybox, #answerbox').hide();
                        $('.offer-contact').addClass('sendinfobox');
                        $('#message-loading').show();
                        form.submit();
                        if (window.module_criteo !== undefined) $(window).trigger('criteoSendMessage')
                    }
                }).showErrorsFromAction();
                var $fileInputs = $form.find('input[type=file]'), $uploadLink = $('#upload-a');
                $uploadLink.click(function () {
                    $('#upload-div').show();
                    if ($fileInputs.length == 1) $uploadLink.hide();
                    return false
                });
                $fileInputs.each(function (index, el) {
                    $(el).change(function () {
                        var $this = $(this), fn = 'hide';
                        if ($this.val().length) fn = 'show';
                        $this.next('.removeAtachment')[fn]();
                        $fileInputs.eq(index + 1).show()
                    });
                    $(el).click(function () {
                        thiz.sendTracking('attachment_upload_step2')
                    })
                }).filter(':gt(0)').hide();
                $fileInputs.eq(-2).change(function () {
                    $uploadLink.hide()
                });
                $form.on('click', '.removeAtachment', function () {
                    var $this = $(this), $fileInput = $this.prev('input[type=file]');
                    $fileInput.val('').replaceWith($fileInput.clone(true));
                    $this.hide()
                });
                $form.find('.removeAtachment').hide();
                if (typeof $.fn.renderForms == 'function') $form.renderForms()
            });
            $(document).on('click', '.removeAttachment', function () {
                var $this = $(this),
                    $el = $('<input type="hidden" name="contact[removeImages][]">').val($this.data('slot'));
                thiz.updateAttachmentsInputs();
                $this.parent().replaceWith($el)
            });
            if (this.isIOS() && this.getIOSVersion() < 6) $('#safariWarning').show();
            $('.ask-for-courier').click(function () {
                var msg = 'РњРµРЅСЏ Р·Р°РёРЅС‚РµСЂРµСЃРѕРІР°Р» Р’Р°С€ С‚РѕРІР°СЂ. РЎРјРѕР¶РµС‚Рµ Р»Рё Р’С‹ РѕС„РѕСЂРјРёС‚СЊ РґРѕСЃС‚Р°РІРєСѓ РЅР° OLX, С‡С‚РѕР±С‹ РјРѕР¶РЅРѕ Р±С‹Р»Рѕ РѕСЃРјРѕС‚СЂРµС‚СЊ Рё РѕРїР»Р°С‚РёС‚СЊ С‚РѕРІР°СЂ РїСЂРё РїРѕР»СѓС‡РµРЅРёРё? РЎРїР°СЃРёР±Рѕ!';
                $('#ask-text').val(msg).focus();
                $('html, body').stop().animate({scrollTop: $('#contact-form').offset().top}, 600, function () {
                    $('#ask-text').val(msg).focus()
                });
                $('#overgalleryclose').click();
                return false
            });
            var $appsOverlay = $('#layer-apps'), closeLayerApps = function () {
                $appsOverlay.find('.layer-content').fadeOut(200, function () {
                    $appsOverlay.fadeOut(100)
                });
                $.cookie('layerappsSeen', '1', {expires: 30, path: '/', domain: '.' + session_domain})
            };
            if (typeof showLayerapp != 'undefined' && $.cookie('layerappsSeen') == null) setTimeout(function () {
                $appsOverlay.fadeIn()
            }, 1600);
            $('.layerapps-close', $appsOverlay).click(function (e) {
                e.preventDefault();
                closeLayerApps()
            });
            $(document).keyup(function (e) {
                if (e.keyCode == 27) closeLayerApps()
            });
            if (window.module_mandatory_login_for_chat) {
                var showLoginPopup = function (tracking) {
                    if (window.user_logged) return;
                    thiz.initMandatoryLogin(undefined, tracking)
                };
                $('.js-mandatory-login').click(function (e) {
                    e.preventDefault();
                    var tracking;
                    if (!$(this).hasClass('button-safedeal')) {
                        tracking = {};
                        var xt_temp = xtcustom;
                        xt_temp.touch_point_button = xtcustom.touch_point_button;
                        xt_temp.touch_point_page = 'adpage';
                        tracking.xt_temp = xt_temp;
                        tracking.event = 'reply_chat_login_close'
                    } else if (NinjaTracker !== undefined) NinjaTracker.push(NinjaTracker.mergeValidOptionalParams(NinjaTracker.getDataFrom(trackingData.pageView), {
                        trackEvent: ['login_page'],
                        action_type: 'login_page',
                        touch_point_page: trackingData.pageView.trackPage,
                        touch_point_button: 'safedeal'
                    }));
                    showLoginPopup(tracking)
                });
                if (typeof window.remove_old_ati === "undefined") $('.msg-contact').click(function () {
                    if (!window.user_logged) {
                        var xt_temp = xtcustom;
                        xt_temp.action_type = 'reply_chat_click';
                        xt_temp.touch_point_button = 'message_bottom';
                        xt_temp.touch_point_page = 'adpage';
                        xt_med('C', '', 'reply_chat_click&stc=' + encodeURIComponent(JSON.stringify(xt_temp)))
                    }
                });
                $('[type="text"], textarea, #upload-a', '#contact-form').click(function () {
                    var tracking = {}, xt_temp = xtcustom;
                    xt_temp.touch_point_button = xtcustom.touch_point_button;
                    xt_temp.touch_point_page = 'adpage';
                    tracking.xt_temp = xt_temp;
                    tracking.event = 'reply_chat_login_close';
                    showLoginPopup(tracking);
                    if (!window.user_logged && typeof window.remove_old_ati === "undefined") {
                        var xt_temp = xtcustom;
                        xt_temp.action_type = 'reply_chat_click';
                        xt_temp.touch_point_button = 'message_bottom';
                        xt_temp.touch_point_page = 'adpage';
                        xt_med('C', '', 'reply_chat_click&stc=' + encodeURIComponent(JSON.stringify(xt_temp)))
                    }
                })
            }
            ;
            if (typeof window.remove_old_ati === "undefined") $('a[data-contact-partner-ati="1"]').click(function (event) {
                var xt_temp = {};
                xt_temp.ad_id = xtcustom.ad_id;
                xt_temp.poster_id = xtcustom.poster_id;
                xt_temp.poster_type = xtcustom.poster_type;
                xt_temp.category = xtcustom.category;
                xt_temp.subcategory = xtcustom.subcategory;
                xt_temp.subsubcategory = xtcustom.subsubcategory;
                xt_temp.provinces = xtcustom.provinces;
                xt_temp.cities = xtcustom.cities;
                xt_temp.user_status = xtcustom.user_status;
                xt_temp.action_type = 'contact_via_partner';
                if ($(this).parents('#contact_methods').length) {
                    xt_temp.touch_point_button = 'top'
                } else xt_temp.touch_point_button = 'bottom';
                xt_med('C', '', 'contact_via_partner&stc=' + encodeURIComponent(JSON.stringify(xt_temp)));
                return true
            })
        },
        initReport: function () {
            var thiz = this, $fillForm = $('#report-form-fill'), $confirmationMsg = $('#report-form-confirmation');
            $('#reportMe').fancybox({
                onStart: function () {
                    $('#report-form').show();
                    var innerHeight = $(window).height() - 100;
                    $('#reportInnerHeight').css({maxHeight: innerHeight, overflow: "auto"})
                },
                onClosed: function () {
                    $('#report-form').hide()
                },
                href: "#report-data",
                width: "560",
                height: "auto",
                autoScale: false,
                autoDimensions: true,
                titleShow: true
            }).click(function () {
                return false
            });
            $('input[type=radio]', $fillForm).click(function (_v, _k) {
                var current_value = $(this).val();
                $('#report_form_description_field').show();
                $('#report-textarea').removeClass('do-not-validate');
                $.fancybox.resize();
                $.fancybox.center()
            });
            $confirmationMsg.find("a.close").bind('click', function () {
                $.fancybox.close();
                return false
            });
            var $reportTxtArea = $('#report-textarea'),
                defaultReportTxt = $reportTxtArea.attr('defaultval') || $reportTxtArea.attr('data-default');
            $reportTxtArea.val(defaultReportTxt);
            $reportTxtArea.focus(function () {
                var $this = $(this);
                if ($this.val() == defaultReportTxt) $this.val('').removeClass('c73')
            }).blur(function () {
                var $this = $(this);
                if ($this.val() == '') $this.val(defaultReportTxt).addClass('c73')
            });
            $('#report-textarea').keyup(function () {
                $this = $(this);
                if ($this.val().length > 1e3) $this.val($this.val().substring(0, 1e3));
                $('b.report-countdown').text(1e3 - $this.val().length)
            });
            $('#closeReportMessage').click(function () {
                $.fancybox.close()
            });
            $fillForm.validate({
                ignore: '.do-not-validate',
                rules: {
                    'report[reason]': {required: true},
                    'report[content]': {required: true, notDefault: true, minlength: 10}
                },
                submitHandler: function () {
                    var fraudValue = $('#report-form').find('input[type=radio][name=report[reason]]:checked').val();
                    $('#report-textarea').click();
                    var msg = $('#report-textarea').val(), email = $('#report-email').val(),
                        id = $('#report-submit').data("id"), captcha = $('#reportCaptcha').val(),
                        token = $('#reportToken').val();
                    if (msg == defaultReportTxt) msg = '';
                    thiz.post('misc', 'report', {
                        reason: fraudValue,
                        msg: msg,
                        email: email,
                        id: id,
                        token: token,
                        captcha: captcha
                    }, function () {
                        var title = $confirmationMsg.find('h4').hide().text();
                        $fillForm.hide();
                        $('#fancybox-title-inside').text(title);
                        $confirmationMsg.show();
                        $('#reportMe').find('span').text('РћС‚РїСЂР°РІР»РµРЅР°!').unbind('click');
                        try {
                            NinjaTracker.push(NinjaTracker.mergeValidOptionalParams(NinjaTracker.getDataFrom(trackingData.pageView), {
                                trackEvent: ['ad_report_sent'],
                                action_type: 'ad_report_sent'
                            }))
                        } catch (e) {
                        }
                    });
                    return false
                }
            });
            $fillForm.submit(function () {
                if (!$(this).find('[name="report[reason]"]').valid()) ShowMessage.error('Р’С‹Р±РµСЂРёС‚Рµ РїСЂРёС‡РёРЅСѓ')
            });
            $.validator.addMethod("notDefault", function (value, element, param) {
                if (!this.depend(param, element)) return "dependency-mismatch";
                return element.value && element.value != $(element).attr('defaultval')
            }, 'Р­С‚Рѕ РїРѕР»Рµ РЅСѓР¶РЅРѕ Р·Р°РїРѕР»РЅРёС‚СЊ')
        },
        initMap: function () {
            function showMap(options, markerOptions, circleOptions) {
                var $mapDiv = $('#googlemap').show(), map = new google.maps.Map($mapDiv.get(0), options);
                this.map = map;
                if (markerOptions != undefined && rad <= 0 && markerOptions.icon !== null) new google.maps.Marker($.extend(markerOptions, {map: map}));
                if (circleOptions != undefined) new google.maps.Circle($.extend(circleOptions, {map: map}));
                if (typeof _gaq != 'undefined') _gaq.push(['_trackPageview']);
                if (typeof xt_med != 'undefined' && typeof xtsite != 'undefined' && typeof window.remove_old_ati === "undefined") xt_med('F', xtsite, '')
            };var $mapContainer = $('#mapcontainer'), markerImage = null, $fancy = $('.show-map-link');
            if ($fancy.length) $fancy.fancybox({
                onStart: function () {
                    google.load('maps', '3', {
                        other_params: 'client=' + mapclient + '&channel=' + mapchannel,
                        callback: function () {
                            if ($mapContainer.length && $mapContainer.data("init") == undefined) {
                                $mapContainer.data("init", 1);
                                var lat = $mapContainer.data("lat"), lon = $mapContainer.data("lon"),
                                    zoom = $mapContainer.data("zoom"), rad = $mapContainer.data("rad");
                                if (rad && rad < 300) rad = rad * 1e3;
                                var mapOptions = $('#mapcontainer').data(),
                                    icon = (window.map_show_detailed == 1 && mapOptions.rad <= 0) ? 'imageSelected' : 'imageZone',
                                    imageSelected = new google.maps.MarkerImage(marker_default, new google.maps.Size(67, 48), new google.maps.Point(0, 0), new google.maps.Point(18, 50)),
                                    imageZone = new google.maps.MarkerImage(marker_zone, new google.maps.Size(278, 278), new google.maps.Point(0, 0), new google.maps.Point(135, 135));
                                markerImage = icon == 'imageSelected' ? imageSelected : null;
                                showMap({
                                    center: new google.maps.LatLng(lat, lon),
                                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                                    zoom: parseInt(zoom),
                                    scrollwheel: true
                                }, icon == 'imageZone' ? {} : {
                                    position: new google.maps.LatLng(lat, lon),
                                    icon: icon == 'imageSelected' ? imageSelected : null
                                }, {
                                    strokeColor: '#eeb1a6',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 5,
                                    fillColor: '#f7dcd7',
                                    fillOpacity: 0.35,
                                    center: new google.maps.LatLng(lat, lon),
                                    radius: (icon == 'imageZone') ? (rad > 0 ? parseInt(rad) : 2500) : null
                                });
                                markerImage = imageSelected
                            }
                            ;$mapContainer.show();
                            $('#fancybox-close').addClass('map-close');
                            google.maps.event.trigger(map, "resize")
                        }
                    })
                },
                onComplete: function () {
                    $('.searchLocationInput').watermark()
                },
                onClosed: function () {
                    $('#mapcontainer').hide();
                    $('.askForAddress').remove();
                    $('form.searchLocation').remove();
                    $('#fancybox-close').removeClass('map-close')
                },
                href: '#googlemap',
                width: 'auto',
                height: 'auto',
                titleShow: false,
                showCloseButton: true,
                padding: 7
            }).click(function () {
                return false
            })
        },
        initPrevNext: function () {
            if (location.href.indexOf("#") != -1 && window.location.hash && window.adID != undefined && typeof archive_ad == 'undefined') {
                var indexOf = window.location.hash.substring(1).indexOf(';'), hash = window.location.hash.substring(1);
                if (hash !== 'noback') {
                    var urlPart = '', search_id = '', promoted = 0;
                    if (indexOf > 0) {
                        search_id = window.location.hash.substring(1).substring(0, indexOf);
                        urlPart = '?search_id=' + search_id + '&ad_id=' + window.adID;
                        indexOf = window.location.hash.substring(1).indexOf(';promoted');
                        if (indexOf > 0) {
                            urlPart += '&promoted=1';
                            promoted = 1
                        }
                    } else {
                        search_id = window.location.hash.substring(1);
                        urlPart = '?search_id=' + search_id + '&ad_id=' + window.adID
                    }
                    ;var $cloud = $('#breadcrumbTop').find('.cloud'), thiz = this;
                    $('a.next-link').each(function () {
                        var $link = $(this);
                        $link.css("display", "inline-block").attr('href', $link.attr('href') + urlPart).parent('td').removeClass('hidden').closest('.breadcrumb').addClass('rightActive');
                        $link.mouseover(function () {
                            if ($link.hasClass('binded')) return;
                            $link.addClass('binded');
                            $cloud.addClass('loading');
                            thiz.get('misc', 'next', {
                                search_id: search_id,
                                ad_id: window.adID,
                                promoted: promoted
                            }, function (data) {
                                $cloud.removeClass('loading');
                                if (data.status == 'ok') {
                                    $link.attr('href', data.link);
                                    $cloud.find('.link > span').html(data.title);
                                    $cloud.find('.title-label').text('РЎР»РµРґСѓСЋС‰РµРµ РѕР±СЉСЏРІР»РµРЅРёРµ');
                                    if (data.img) $cloud.find('img').attr('src', data.img).removeClass('hidden')
                                } else $cloud.remove()
                            })
                        })
                    });
                    $('a.prev-link:not(.editbar *)').each(function () {
                        $(this).data("preventClick", true);
                        $(this).css("display", "inline-block").attr('href', $(this).attr('href') + urlPart).parent('td').removeClass('hidden').closest('.breadcrumb').addClass('leftActive')
                    });
                    $('a.button-email').each(function () {
                        var _url = $(this).attr('href');
                        _url += (_url.split('?')[1] ? '&' : '?') + 'search_id=' + search_id;
                        $(this).attr('href', _url)
                    })
                } else $('a.prev-link').remove()
            } else if (history.length > 1) {
                $('a.prev-link').each(function () {
                    $(this).css("display", "inline-block").attr('href', 'javascript:history.go(-1)').parent('td').removeClass('hidden').closest('.breadcrumb').addClass('leftActive')
                })
            } else $('a.prev-link').remove();
            $('a.button-email').each(function () {
                var $this = $(this);
                $this.attr('href', $this.attr('href') + window.location.hash)
            })
        },
        initFixedSidebar: function () {
            var fixedController = (function () {
                var _window = $(window), _sidebar = $('#offerbox'), _sidebarHeight, _offerDesc = $('#offerdescription'),
                    _offerDescHeight, _relatedPosition,
                    _fixer = $('<div class=\"fix fixedHandler\" style=\"display:none;\"></div>'), _startPoint,
                    _hasHandler = false, _setup = function () {
                        _sidebarHeight = _sidebar.height();
                        _offerDescHeight = _offerDesc.height();
                        _relatedPosition = _offerDesc.offset().top + _offerDescHeight;
                        _fixer.css({width: '1px', top: '0px', display: 'block'}).appendTo('body')
                    };
                return {
                    handler: {}, init: function () {
                        _setup();
                        if (_window.height() >= _sidebarHeight) {
                            fixedController.setElement($('#offeractions'))
                        } else fixedController.setElement($('.stickyEnabled'));
                        if ((_offerDescHeight < _sidebarHeight) || !_hasHandler) return;
                        fixedController.scrollHandler();
                        _window.scroll(function () {
                            fixedController.scrollHandler()
                        }).resize(function () {
                            fixedController.scrollHandler()
                        })
                    }, setElement: function (el) {
                        if (el.length > 0) {
                            _hasHandler = true;
                            _startPoint = el.offset().top;
                            return this.handler = el
                        }
                    }, getElement: function () {
                        return this.handler
                    }, getHeight: function () {
                        return (this.getElement().height())
                    }, getWidth: function () {
                        return (this.getElement().width())
                    }, getFixerPosition: function () {
                        return _fixer.position()
                    }, scrollHandler: function () {
                        var elWidth = this.getWidth(), elHeight = this.getHeight(),
                            elBottom = this.getFixerPosition().top + elHeight, y = _window.scrollTop();
                        if (y >= _startPoint) {
                            _fixer.css({left: _sidebar.offset().left + elWidth, height: elHeight});
                            this.getElement().addClass('fix');
                            if (elBottom < _relatedPosition) {
                                this.getElement().css({top: '0px', left: _sidebar.offset().left - _window.scrollLeft()})
                            } else {
                                this.getElement().css({top: _offerDescHeight - elHeight, left: 0});
                                this.getElement().removeClass('fix').addClass('abs')
                            }
                        } else this.getElement().removeClass('fix').removeClass('abs')
                    }
                }
            })();
            $(window).load(function () {
                setTimeout(function () {
                    fixedController.init()
                }, 300)
            })
        },
        initSearch: function () {
            $('#mainTopSearch input[type=text]').focus(function () {
                $this = $(this);
                $this.removeClass('ca2');
                if ($this.val() == $this.attr('defaultval')) $this.val('')
            }).blur(function () {
                $this = $(this);
                $this.removeClass('ca2');
                if ($this.val() == '' || $this.val() == $this.attr('defaultval')) {
                    $this.addClass('ca2');
                    $this.val($this.attr('defaultval'))
                }
            })
        },
        url: {ads: [location.protocol, '//', location.host, location.pathname].join('')},
        recaptchaCallback: function (response) {
            var $contactDetails = $('#contact_methods .contact-a, #contact_methodsBigImage .contact-a, #contact_methods_below .contact-a, .contact_methods .contact-a, .js-show-phone-number'),
                $target = AdObj.contactDetailsTarget;
            AdObj.processShowNumber($contactDetails, $target, response)
        },
        initShowNumber: function () {
            var $contactDetails = $('#contact_methods .contact-a, #contact_methodsBigImage .contact-a, #contact_methods_below .contact-a, .contact_methods .contact-a');
            $contactDetails.not('.suggest-link').click(function () {
                AdObj.processShowNumber($contactDetails, $(this))
            })
        },
        initShowNumberWithCaptcha: function () {
            $('.js-show-phone-number').click(function () {
                AdObj.contactDetailsTarget = $(this);
                if (!$(this).hasClass('activated')) {
                    grecaptcha.execute();
                    var recaptchaChallenge = $('iframe[src*="https://www.google.com/recaptcha/api2/bframe"]'),
                        recaptchaChallengeInfo = '<div class="recaptcha-information">captcha_challenge_info</div>';
                    if (recaptchaChallenge.length) if (recaptchaChallenge.parent().find('.recaptcha-information').length === 0) recaptchaChallenge.parent().addClass('google-recaptcha-challenge-container').prepend(recaptchaChallengeInfo)
                }
            })
        },
        processShowNumber: function ($contactDetails, $target, recaptcha) {
            var $this = $contactDetails.filter('[data-rel="' + $target.attr('data-rel') + '"]');
            if ($this.hasClass('callTo')) return true;
            if ($this.hasClass('activated')) return true;
            var path = $this.data("path"), id = $this.data("id"),
                securitySuggest = $this.closest('.contactbox').find('.contactwarn');
            if (securitySuggest.length) securitySuggest.show();
            var url = www_base_ajax + '/misc/contact/' + path + '/' + id + '/';
            if (typeof phoneToken != 'undefined') {
                url += '?pt=' + phoneToken;
                if (typeof recaptcha != 'undefined') url += '&rc=' + recaptcha
            }
            ;$.get(url, function (dat) {
                if (dat.value.replace(/\s/g, '') == '000000000') {
                    document.location.reload()
                } else {
                    if (path == 'phone' && typeof module_contact_as_image != 'undefined' && module_contact_as_image == 1) {
                        $('#contact_methods .contact-a, .contact_methods .contact-a, #contact_methods_below .contact-a').filter('[data-rel="phone"]').closest('li').find('strong').html(dat.value);
                        $('#contact_methodsBigImage .contact-a').filter('[data-rel="phone"]').find('strong').html(dat.value)
                    } else $this.find('strong').html(dat.value);
                    if (window.module_criteo !== undefined) $(window).trigger('criteoShowPhone');
                    $this.find('.spoiler').hide();
                    $this.removeClass('cpointer');
                    $this.addClass('activated');
                    $('body').trigger('adPageShowContact', {type: path})
                }
            });
            if (useExternalScripts && typeof window.remove_old_ati === "undefined") {
                var myxt = xtcustom, p = 'showing_' + path;
                myxt.action_type = p;
                p += ';' + adID;
                delete myxt.page_name;
                xt_med('C', '', p + '&stc=' + encodeURIComponent(JSON.stringify(myxt)), 'A')
            }
            ;
            return false
        },
        initMandatoryLogin: function (oSettings, tracking) {
            var mandatoryLoginDiv = '#mandatoryLoginDiv', $mandatoryLoginDiv = $(mandatoryLoginDiv),
                fancyboxSettings = {redirectOnClose: typeof oSettings !== 'undefined' ? oSettings.redirectOnClose : false};
            $.fancybox({
                href: mandatoryLoginDiv,
                titleShow: false,
                scrolling: 'no',
                autoScale: false,
                autoDimensions: true,
                margin: 0,
                padding: 0,
                overlayColor: '#fff',
                overlayOpacity: '0.85',
                speedIn: 800,
                transitionOut: 'none',
                hideOnOverlayClick: !fancyboxSettings.redirectOnClose,
                enableEscapeButton: !fancyboxSettings.redirectOnClose,
                onStart: function () {
                    var xt_temp = xtcustom;
                    $mandatoryLoginDiv.show();
                    $('#fancybox-wrap').addClass('fancybox-container--mandatory-login');
                    if (fancyboxSettings.redirectOnClose) $('#fancybox-close').unbind().bind('click', function () {
                        if (typeof tracking != 'undefined' && typeof window.remove_old_ati === "undefined") xt_med('C', '', tracking.event + '&stc=' + encodeURIComponent(JSON.stringify(tracking.xt_temp)));
                        window.location.replace(fancyboxSettings.redirectOnClose)
                    })
                },
                onComplete: function () {
                    $('#userEmail').focus()
                },
                onCleanup: function () {
                    $mandatoryLoginDiv.hide().unwrap();
                    if (typeof tracking != 'undefined' && typeof window.remove_old_ati === "undefined") xt_med('C', '', tracking.event + '&stc=' + encodeURIComponent(JSON.stringify(tracking.xt_temp)));
                    if (fancyboxSettings.redirectOnClose) window.location.replace(fancyboxSettings.redirectOnClose)
                },
                onClosed: function () {
                    $('#fancybox-wrap').removeClass('fancybox-container--mandatory-login')
                }
            })
        },
        initABtestOptions: function () {
            var $textarea = $('textarea', '.quick-contact'), $emaiField = $('.email-field', '.quick-contact');
            if ($emaiField.length && $emaiField.find('input').val() != "") {
                $textarea.autoResize().change();
                $emaiField.show()
            } else $textarea.focus(function () {
                if ($emaiField.length) $emaiField.slideDown(200)
            })
        },
        initPrintOptions: function () {
            var $printOffer = $('#printOffer'), printOfferDiv = '#printOfferDiv', $printOfferDiv = $(printOfferDiv),
                $printOfferInner = $(window).height() - 240,
                $printOfferCheck = $printOfferDiv.find('input[type="radio"]'),
                $printOfferPhotos = $('#printOfferPhotos');
            $printOffer.fancybox({
                title: $('#printCaption').html(),
                titleShow: true,
                scrolling: 'no',
                href: printOfferDiv,
                autoScale: false,
                autoDimensions: true,
                onStart: function () {
                    $printOfferDiv.show();
                    $printOfferDiv.find('.inner').css({maxHeight: $printOfferInner, overflow: "auto"});
                    $printOfferDiv.find('form').renderForms();
                    $printOfferCheck.change(function () {
                        $(this).val() == 'print-opt-2' ? $printOfferPhotos.show() : $printOfferPhotos.hide().find('input[type="checkbox"]').attr('checked', true).change();
                        $.fancybox.resize()
                    });
                    if ($('#print-opt-2').is(':checked')) $printOfferPhotos.show()
                },
                onCleanup: function () {
                    $printOfferDiv.hide().unwrap()
                },
                onClosed: function () {
                    $('#print-opt-1').click()
                }
            });
            $('#printButton').click(function () {
                $.fancybox.close()
            })
        },
        initGoToTop: function () {
            if (!$('#managebar').length) {
                var gotophtml = "<a id=\"gotop\" class=\"fix bgfff br-1 tdnone normal color-1 tcenter\" style=\"display:none; bottom:0px\"><span class=\"inlblk icon gotop margintop5\">&nbsp;</span></a>";
                $('body').append(gotophtml);
                $('a#gotop').click(function () {
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    return false
                });
                var halfContent = parseInt($('#body-container').height() / 3), $html = $(document),
                    getPositionGoTop = function getPositionGoTop() {
                        var positionContent = $('#body-container .content').offset(),
                            widthContent = $('#body-container .wrapper').outerWidth(), goTop = $('#gotop');
                        if ($(window).width() > 1e3) {
                            goTop.css({left: positionContent.left + widthContent - 5})
                        } else goTop.css({left: 'auto', right: 5});
                        if ($html.scrollTop() > halfContent) {
                            goTop.fadeIn()
                        } else goTop.fadeOut()
                    };
                if ($html.scrollTop() > halfContent) getPositionGoTop();
                $(window).scroll(function () {
                    getPositionGoTop()
                });
                $(window).resize(function () {
                    getPositionGoTop()
                })
            }
        },
        showDogsLayer: function ($type) {
            var dogsDiv = '#dogsDiv', $dogsDiv = $(dogsDiv), innerHeight = $(window).height() - 240;
            if ($dogsDiv.length) $.fancybox({
                href: dogsDiv,
                title: '<p class="block clr large lheight22 marginleft10 minheight22">Akceptacja regulaminu</p>',
                titleShow: true,
                scrolling: 'no',
                autoScale: false,
                autoDimensions: true,
                onStart: function () {
                    $dogsDiv.show();
                    $dogsDiv.find('.inner').css({maxHeight: innerHeight, overflow: "auto"});
                    $('a.button', $dogsDiv).click(function () {
                        $.cookie('dogs_accepted', '1', {expires: 20, path: '/', domain: '.' + session_domain});
                        $.fancybox.close();
                        document.location = $('#dogs_vote_button').attr('href');
                        return false
                    })
                },
                onClosed: function () {
                },
                onCleanup: function () {
                    $dogsDiv.hide().unwrap()
                }
            })
        },
        initCaptcha: function () {
            var $captcha = $('img.captcha');
            if ($captcha.length) {
                if ($('div.captcha').hasClass('error')) $captcha.attr('src', $captcha.data('src')).closest('div.captcha').removeClass('hidden');
                $('#ask-text').keyup(function () {
                    if (!$captcha.attr('src')) $captcha.attr('src', $captcha.data('src')).closest('div.captcha').removeClass('hidden')
                })
            }
        },
        initOwnerBar: function () {
            if ($('#managebar').length) {
                $('#addphotoforall').addClass('hidden');
                $('#addphotoforowner').removeClass('hidden')
            }
            ;var thiz = this;
            $('#ownerbarRefresh').click(function () {
                thiz.post('myaccount', 'refreshme', {
                    adID: $('#ownerbarRefresh').data("adid"),
                    token: $(this).data('token')
                }, function (data) {
                    $('#ownerbarRefresh').hide().closest('td').removeAttr('width');
                    ShowMessage.success('РћР±СЉСЏРІР»РµРЅРёРµ РѕР±РЅРѕРІР»РµРЅРѕ СѓСЃРїРµС€РЅРѕ');
                    location.reload()
                });
                return false
            });
            $('#remove-ad-from-myaccount').click(function () {
                thiz.post('myaccount', 'removeme', {
                    adID: $('#managebar').data("adid"),
                    token: $(this).data('token')
                }, function (data) {
                    $('#remove-ad-from-myaccount').hide();
                    ShowMessage.success('РћР±СЉСЏРІР»РµРЅРёРµ СѓРґР°Р»РµРЅРѕ')
                });
                return false
            });
            $('#activate-ad').click(function () {
                thiz.post('myaccount', 'activateme', {
                    adID: $('#managebar').data("adid"),
                    token: $(this).data('token')
                }, function (data) {
                    $('#activate-ad').hide();
                    ShowMessage.success('РћР±СЉСЏРІР»РµРЅРёРµ Р°РєС‚РёРІРёСЂРѕРІР°РЅРѕ')
                });
                return false
            });
            $('#confirm-ad').click(function () {
                thiz.post('myaccount', 'confirmme', {
                    adID: $('#managebar').data("adid"),
                    token: $(this).data('token')
                }, function (data) {
                    $('#confirm-ad').hide();
                    ShowMessage.success('РћР±СЉСЏРІР»РµРЅРёРµ РїРѕРґС‚РІРµСЂР¶РґРµРЅРѕ');
                    document.location.reload()
                });
                return false
            });
            $('#hideOwnerBar').click(function () {
                var $this = $(this), $manageLayer = $this.closest('.managelayer');
                if ($manageLayer.hasClass('minimized')) {
                    $manageLayer.animate({bottom: 0}, 300, function () {
                        $this.find('.text').text('Р—Р°РєСЂС‹С‚СЊ').end().find('.icon').removeClass('arrowasc');
                        $manageLayer.removeClass('minimized')
                    })
                } else $manageLayer.animate({bottom: -($manageLayer.height() - 35)}, 300, function () {
                    $this.find('.text').text('РџРѕРєР°Р·Р°С‚СЊ').end().find('.icon').addClass('arrowasc');
                    $manageLayer.addClass('minimized')
                })
            });
            $('#save-from-preview').click(function () {
                var $saveFromPreview = $('#save-from-preview');
                if ($saveFromPreview.hasClass('disabled')) {
                    $saveFromPreview.attr('href', '#');
                    return false
                }
                ;$saveFromPreview.addClass('disabled waiting');
                $('body').trigger('previewPageSubmit')
            });
            var $statsCloud = $('.statsviewscloud');
            if ($statsCloud.length) {
                $statsCloud.bind("mouseenter", function () {
                    var $this = $(this), $statsCloudBox = $this.find('.suggesttitle');
                    clearTimeout($this.data('timeout'));
                    if ($statsCloudBox.is(':hidden')) $statsCloudBox.slideDown('fast')
                });
                $statsCloud.bind("mouseleave", function () {
                    var $this = $(this), $statsCloudBox = $this.find('.suggesttitle');
                    $this.data('timeout', setTimeout(function () {
                        if (!$statsCloudBox.is(':hidden')) $statsCloudBox.slideUp('fast')
                    }, 1e3))
                });
                $statsCloud.find('.clearViews').click(function () {
                    var $this = $(this), $tr = $this.closest('tr.row-stats').prev('tr.row-elem'),
                        adID = $('#managebar').data("adid"), $statsCloudBox = $this.closest('.suggesttitle');
                    $.post(www_base_ajax + '/myaccount/clearviews/', {
                        adID: adID,
                        token: $(this).data('token')
                    }, function (resp) {
                        $('.suggesttext', $statsCloudBox).fadeOut(function () {
                            $(this).text(resp.response).fadeIn();
                            $this.closest('tr.row-stats').find('.statsviewsCounter').text('a');
                            $('.statsviewsCounter').text(0)
                        })
                    }, 'json');
                    return false
                });
                $statsCloud.find('.clearPhoneViews').click(function () {
                    var $this = $(this), $tr = $this.closest('tr.row-stats').prev('tr.row-elem'),
                        adID = $('#managebar').data("adid"), $statsCloudBox = $this.closest('.suggesttitle');
                    $.post(www_base_ajax + '/myaccount/clearviews/phone/', {
                        adID: adID,
                        token: $(this).data('token')
                    }, function (resp) {
                        $('.suggesttext', $statsCloudBox).fadeOut(function () {
                            $(this).text(resp.response).fadeIn();
                            $this.closest('tr.row-stats').find('.statsPhoneCounter').text('a');
                            $('.statsviewsCounter').text(0)
                        })
                    }, 'json');
                    return false
                })
            }
        },
        initAdsense: function () {
            var thiz = this;
            if (window.module_afc_to_dfp == undefined) setTimeout(function () {
                if (useExternalScripts && typeof AdsenseClass != 'undefined') {
                    thiz.adsense = new AdsenseClass();
                    if (window.module_adsense_new === undefined) {
                        thiz.adsense.setRegionName(regionName);
                        thiz.adsense.setSubregionName(subregionName);
                        thiz.adsense.setCategory(category_id, categoryName, categoryCode, categoryAdsenseText);
                        thiz.adsense.setRootCategory(root_category_id, rootCategoryName, rootCategoryCode, rootCategoryAdsenseText);
                        thiz.adsense.setSeoPageName(setSeoPageName);
                        thiz.adsense.forAd = true;
                        thiz.adsense.addAdsenseForContentBlock('google-ads-container1', 3, 'ad_bottom', thiz.adsenseOptions);
                        thiz.adsense.showAdsenseForContentAds()
                    }
                }
            }, 150);
            setTimeout(function () {
                if (window.module_afc_to_afs_slot !== undefined && $('#adcontainer3').length) {
                    thiz.adsense = new AdsenseClass();
                    thiz.adsense.setQuery($('#adcontainer3').data('q'));
                    thiz.adsense.setRootCategory(window.root_category_id, window.rootCategoryName, window.rootCategoryCode, window.rootCategoryAdsenseText);
                    thiz.adsense.addAdsenseForSearchBlock('adcontainer3', 3);
                    thiz.adsense.showAdsenseForSearchAds('asf_ad')
                }
            }, 150)
        },
        initComperia: function () {
            if ($('.comperiaoffer').hasClass('comperiabox') && comperiaCheck == true) {
                _gaq.push(['_trackEvent', 'comperia', 'view', 'page_view']);
                $.post(www_base + '/ajax/ad/comperia/', {
                    product_id: comperia_product,
                    credit_time: comperia_time,
                    credit_amount: comperia_amount
                }, function (data) {
                    data = JSON.parse(data);
                    if (data.status != 'error') {
                        var instalment = data.instalment;
                        $('.comperiaoffer').html('lub od <strong class="x-large">' + instalment + ' zЕ‚</strong>/mc')
                    }
                })
            }
        },
        updateAttachmentsInputs: function () {
            var $alreadyAdded = $('#alreadyAdded'), alreadyAdded = parseInt($alreadyAdded.val());
            $('#upload-div').append('<p><input type="file" id="attachment' + (5 - alreadyAdded) + '" name="attachment[' + (5 - alreadyAdded) + ']" size="39" class="attachment" style="display: none;"><input type="button" class="removeAtachment" value="РЈРґР°Р»РёС‚СЊ" style="display: none;"><input type="hidden" name="attachment[' + (5 - alreadyAdded) + ']" value="file"></p>');
            $alreadyAdded.val(alreadyAdded + 1);
            var $fileInputs = $('#contact-form').find('input[type=file]');
            $fileInputs.each(function (index, el) {
                $(el).change(function () {
                    var $this = $(this), fn = 'hide';
                    if ($this.val().length) fn = 'show';
                    $this.next('.removeAtachment')[fn]();
                    $fileInputs.eq(index + 1).show()
                })
            })
        },
        initChatBox: function () {
            var $chatButton = $('.listing-online'), $chatHtml = $('.ad-chat-box'),
                $closeBtn = $chatHtml.find('.header .closeBtn');
            $chatButton.bind("click", function () {
                $chatHtml.show();
                useExternalScripts && xt_click(this, 'C', '', 'CHAT_FROM_AD_LIST')
            });
            $closeBtn.bind("click", function () {
                $chatHtml.hide()
            })
        },
        showGalleryBanner: function () {
        },
        initDFPFloorAd: function () {
            var divGPTAdItemFloorAd = $('#div-gpt-ad-item-floor-ad'),
                divGPTAdItemFloorAdWrapper = $('#div-gpt-ad-item-floor-ad-container');
            if (divGPTAdItemFloorAd.length > 0 && $.cookie('GPTAdItemFloorAd') == null) {
                var closeButton = $('<a href="" class="div-gpt-ad-item-floor-ad__close"></a>').click(function (e) {
                    divGPTAdItemFloorAdWrapper.addClass('hidden');
                    $.cookie('GPTAdItemFloorAd', '1', {expires: 30, path: '/', domain: '.' + session_domain});
                    e.preventDefault()
                });
                $(window).load(function () {
                    setTimeout(function () {
                        if (divGPTAdItemFloorAd.css('display') == 'block') {
                            divGPTAdItemFloorAd.append(closeButton);
                            divGPTAdItemFloorAdWrapper.removeClass('hidden')
                        }
                    }, 2500)
                })
            }
        },
        initFastreplyTooltip: function () {
            $('.user-fast__tooltip').delay(3e3).animate({marginLeft: 10}, 300, function () {
                $('.user-fast__tooltip').animate({marginLeft: -20}, {duration: 1e3, easing: 'easeOutBounce'})
            })
        },
        sendTracking: function (eventName, touchPointPage) {
            var trackDataObject = {trackEvent: [eventName], action_type: eventName};
            trackDataObject.touch_point_page = touchPointPage ? touchPointPage : trackingData.pageView.trackPage;
            if (eventName && NinjaTracker !== 'undefined') NinjaTracker.push(NinjaTracker.mergeValidOptionalParams(NinjaTracker.getDataFrom(trackingData.pageView), trackDataObject))
        },
        hideDeliveryRequestButton: function () {
            $(SELECTOR_DELIVERY_REQUEST_BUTTON).hide()
        },
        showDeliveryRequestSentFlag: function () {
            $(SELECTOR_DELIVERY_REQUEST_SENT_FLAG).show()
        },
        postDeliveryRequestCB: function (data) {
            this.isDeliveryRequestInProgress = false;
            if (data.status !== 'error') {
                this.hideDeliveryRequestButton();
                this.showDeliveryRequestSentFlag();
                trackEvent('request_delivery_buyer_sent')
            }
        },
        postDeliveryRequestFail: function (req) {
            this.isDeliveryRequestInProgress = false;
            console.error(req)
        },
        postDeliverRequest: function () {
            if (this.isDeliveryRequestInProgress) return;
            this.isDeliveryRequestInProgress = true;
            trackEvent('request_delivery_click');
            $.post(window.www_base + ENDPOINT_SAFEDEAL_API, {adId: window.adId}).done(this.postDeliveryRequestCB.bind(this)).fail(this.postDeliveryRequestFail.bind(this))
        },
        initDeliveryRequestLogin: function () {
            var isDeliveryRequestLogin = searchRgxDeliveryRequestLogin.test(window.location.search),
                isLoginHash = hashRgxLogin.test(window.location.hash);
            if (isDeliveryRequestLogin && !isLoginHash) this.initMandatoryLogin()
        },
        initDeliveryRequestBtn: function () {
            var that = this;
            $(SELECTOR_DELIVERY_REQUEST_BUTTON).click(function () {
                if (!window.user_logged) {
                    that.deliveryRequestLogin()
                } else that.postDeliverRequest()
            })
        },
        deliveryRequestLogin: function () {
            var urlOrigin = window.location.origin, urlPathname = window.location.pathname,
                urlSearch = window.location.search, urlHash = window.location.hash,
                newUrlSearch = urlSearch ? urlSearch + '&' + SEARCH_DELIVERY_REQUEST_LOGIN : '?' + SEARCH_DELIVERY_REQUEST_LOGIN;
            window.location.replace(urlOrigin + urlPathname + newUrlSearch + urlHash)
        },
        initDeliveryRequest: function () {
            this.initDeliveryRequestLogin();
            this.initDeliveryRequestBtn();
            this.isDeliveryRequestInProgress = false
        }
    })
}());
AdClass = AdClass.extend({
    init: function () {
        this._super();
        this.initAdditionalScripts();
        if (typeof messageSent != 'undefined' && messageSent == '1') _gaq.push(['_trackEvent', 'ContactAction', 'contact_contacted-email', 'A user has successfully contacted a poster via email form'])
    }, initAdditionalScripts: function () {
    }, initHash: function () {
        if (location.href.indexOf("#") != -1 && window.location.hash.indexOf(';r:') != -1) {
            var begin = window.location.hash.indexOf(';r:'),
                end = window.location.hash.substring(begin + 1).indexOf(';'),
                region = window.location.hash.substring(begin + 3, begin + 1 + end),
                begin = window.location.hash.indexOf(';s:'),
                end = (window.location.hash.substring(begin + 1).indexOf(';') != -1) ? window.location.hash.substring(begin + 1).indexOf(';') : window.location.hash.substring(begin).length,
                subregion = window.location.hash.substring(begin + 3, begin + 1 + end);
            if (!subregion) {
                if (region) {
                    var regionData = regionsJSON[region]
                } else var regionData = {
                    possessive: 'РЈРєСЂР°РёРЅС‹',
                    locative: 'РІ РЈРєСЂР°РёРЅРµ',
                    url: 'http://' + session_domain
                };
                if (typeof regionData.possessive != 'undefined' && typeof regionData.locative != 'undefined') {
                    var $breadcrumbTop = $('ul.breadcrumb').not('.footer').find('li a span'),
                        $breadcrumbTopLinks = $('ul.breadcrumb').not('.footer').find('li a');
                    $breadcrumbTop.each(function () {
                        var $this = $(this);
                        if ($this.children('span').length) $this = $this.children('span');
                        var text = $this.text().replace(new RegExp(subregion_possessive, 'g'), regionData.possessive);
                        text = text.replace(new RegExp(subregion_locative, 'g'), regionData.locative);
                        $this.text(text)
                    });
                    $breadcrumbTopLinks.each(function () {
                        var $this = $(this);
                        $this.attr('href', $this.attr('href').replace(new RegExp(www_base, 'g'), regionData.url))
                    });
                    var $mainTopSearch = $('#searchSimple');
                    $mainTopSearch.attr('action', $mainTopSearch.attr('action').replace(www_base, regionData.url + '/list/'));
                    $postNewAdLink = $('#postNewAdLink');
                    $postNewAdLink.attr('href', $postNewAdLink.attr('href').replace(www_base, regionData.url))
                }
            }
        }
    }
});

function checkAdriverBanner() {
    $body = $('body');
    if (typeof $body.attr('style') != 'undefined' && $body.attr('style').indexOf('background') >= 0) $body.addClass('bgadriver')
};AdClass = AdClass.extend({
    init: function () {
        this._super();
        this.initAdriver();
        if (typeof window.remove_old_ati === "undefined") $('.button-safedeal').click(function (e) {
            xt_med('C', '', 'click_button_buy&stc={"page_name":"adpage","action_type":"click_button_buy"}')
        })
    }, initAdriver: function () {
        $(window).load(function () {
            checkAdriverBanner();
            window.setTimeout("checkAdriverBanner()", 1e3)
        });
        $(window).scroll(function () {
            checkAdriverBanner();
            window.setTimeout("checkAdriverBanner()", 1e3)
        })
    }, initAdsense: function () {
        var thiz = this;
        setTimeout(function () {
            if (useExternalScripts && typeof AdsenseClass != 'undefined' && window.category_id !== '1435') {
                thiz.adsense = new AdsenseClass();
                if (window.module_test_afc_afs_slots_listing !== undefined && $('#adcontainerafswithoutphrase').length) {
                    thiz.adsense.showAdsense($('#adcontainerafswithoutphrase').data('pageoption'), $('#adcontainerafswithoutphrase').data('adblockconfig'))
                } else {
                    thiz.adsense.setRegionName(regionName);
                    thiz.adsense.setSubregionName(subregionName);
                    thiz.adsense.setCategory(category_id, categoryName, categoryCode, categoryAdsenseText);
                    thiz.adsense.setRootCategory(root_category_id, rootCategoryName, rootCategoryCode, rootCategoryAdsenseText);
                    thiz.adsense.setSeoPageName(setSeoPageName);
                    thiz.adsense.forAd = true;
                    thiz.adsense.addAdsenseForContentBlock('google-ads-container1', 3, 'ad_bottom');
                    thiz.adsense.showAdsenseForContentAds()
                }
            }
        }, 150)
    }, showGalleryBanner: function () {
        var event = new CustomEvent("showGallery");
        document.getElementById('div-gpt-ad-rectangle_gallery').dispatchEvent(event)
    }
});
$().ready(function () {
    AdObj = new AdClass();
    window.recaptchaCallback = AdObj.recaptchaCallback
});
if (!window['googleLT_']) {
    window['googleLT_'] = (new Date()).getTime();
}
if (!window['google']) {
    window['google'] = {};
}
if (!window['google']['loader']) {
    window['google']['loader'] = {};
    google.loader.ServiceBase = 'https://www.google.com/uds';
    google.loader.GoogleApisBase = 'https://ajax.googleapis.com/ajax';
    google.loader.ApiKey = 'notsupplied';
    google.loader.KeyVerified = true;
    google.loader.LoadFailure = false;
    google.loader.Secure = true;
    google.loader.GoogleLocale = 'www.google.com';
    google.loader.ClientLocation = {
        "latitude": 52.417,
        "longitude": 16.883,
        "address": {"city": "Poznan", "region": "Greater Poland", "country": "Poland", "country_code": "PL"}
    };
    google.loader.AdditionalParams = '';
    (function () {
        var d = encodeURIComponent, g = window, h = document;

        function l(a, b) {
            return a.load = b
        }

        var m = "push", n = "replace", q = "charAt", r = "indexOf", t = "ServiceBase", u = "name", v = "getTime",
            w = "length", x = "prototype", y = "setTimeout", z = "loader", A = "substring", B = "join",
            C = "toLowerCase";

        function D(a) {
            return a in E ? E[a] : E[a] = -1 != navigator.userAgent[C]()[r](a)
        }

        var E = {};

        function F(a, b) {
            var c = function () {
            };
            c.prototype = b[x];
            a.U = b[x];
            a.prototype = new c
        }

        function G(a, b, c) {
            var e = Array[x].slice.call(arguments, 2) || [];
            return function () {
                return a.apply(b, e.concat(Array[x].slice.call(arguments)))
            }
        }

        function H(a) {
            a = Error(a);
            a.toString = function () {
                return this.message
            };
            return a
        }

        function I(a, b) {
            for (var c = a.split(/\./), e = g, f = 0; f < c[w] - 1; f++) e[c[f]] || (e[c[f]] = {}), e = e[c[f]];
            e[c[c[w] - 1]] = b
        }

        function J(a, b, c) {
            a[b] = c
        }

        if (!K) var K = I;
        if (!L) var L = J;
        google[z].v = {};
        K("google.loader.callbacks", google[z].v);
        var M = {}, N = {};
        google[z].eval = {};
        K("google.loader.eval", google[z].eval);
        l(google, function (a, b, c) {
            function e(a) {
                var b = a.split(".");
                if (2 < b[w]) throw H("Module: '" + a + "' not found!");
                "undefined" != typeof b[1] && (f = b[0], c.packages = c.packages || [], c.packages[m](b[1]))
            }

            var f = a;
            c = c || {};
            if (a instanceof Array || a && "object" == typeof a && "function" == typeof a[B] && "function" == typeof a.reverse) for (var k = 0; k < a[w]; k++) e(a[k]); else e(a);
            if (a = M[":" + f]) {
                c && !c.language && c.locale && (c.language = c.locale);
                c && "string" == typeof c.callback && (k = c.callback, k.match(/^[[\]A-Za-z0-9._]+$/) && (k = g.eval(k), c.callback =
                    k));
                if ((k = c && null != c.callback) && !a.s(b)) throw H("Module: '" + f + "' must be loaded before DOM onLoad!");
                k ? a.m(b, c) ? g[y](c.callback, 0) : a.load(b, c) : a.m(b, c) || a.load(b, c)
            } else throw H("Module: '" + f + "' not found!");
        });
        K("google.load", google.load);
        google.T = function (a, b) {
            b ? (0 == O[w] && (P(g, "load", Q), !D("msie") && !D("safari") && !D("konqueror") && D("mozilla") || g.opera ? g.addEventListener("DOMContentLoaded", Q, !1) : D("msie") ? h.write("<script defer onreadystatechange='google.loader.domReady()' src=//:>\x3c/script>") : (D("safari") || D("konqueror")) && g[y](S, 10)), O[m](a)) : P(g, "load", a)
        };
        K("google.setOnLoadCallback", google.T);

        function P(a, b, c) {
            if (a.addEventListener) a.addEventListener(b, c, !1); else if (a.attachEvent) a.attachEvent("on" + b, c); else {
                var e = a["on" + b];
                a["on" + b] = null != e ? aa([c, e]) : c
            }
        }

        function aa(a) {
            return function () {
                for (var b = 0; b < a[w]; b++) a[b]()
            }
        }

        var O = [];
        google[z].P = function () {
            var a = g.event.srcElement;
            "complete" == a.readyState && (a.onreadystatechange = null, a.parentNode.removeChild(a), Q())
        };
        K("google.loader.domReady", google[z].P);
        var ba = {loaded: !0, complete: !0};

        function S() {
            ba[h.readyState] ? Q() : 0 < O[w] && g[y](S, 10)
        }

        function Q() {
            for (var a = 0; a < O[w]; a++) O[a]();
            O.length = 0
        }

        google[z].d = function (a, b, c) {
            if (c) {
                var e;
                "script" == a ? (e = h.createElement("script"), e.type = "text/javascript", e.src = b) : "css" == a && (e = h.createElement("link"), e.type = "text/css", e.href = b, e.rel = "stylesheet");
                (a = h.getElementsByTagName("head")[0]) || (a = h.body.parentNode.appendChild(h.createElement("head")));
                a.appendChild(e)
            } else "script" == a ? h.write('<script src="' + b + '" type="text/javascript">\x3c/script>') : "css" == a && h.write('<link href="' + b + '" type="text/css" rel="stylesheet"></link>')
        };
        K("google.loader.writeLoadTag", google[z].d);
        google[z].Q = function (a) {
            N = a
        };
        K("google.loader.rfm", google[z].Q);
        google[z].S = function (a) {
            for (var b in a) "string" == typeof b && b && ":" == b[q](0) && !M[b] && (M[b] = new T(b[A](1), a[b]))
        };
        K("google.loader.rpl", google[z].S);
        google[z].R = function (a) {
            if ((a = a.specs) && a[w]) for (var b = 0; b < a[w]; ++b) {
                var c = a[b];
                "string" == typeof c ? M[":" + c] = new U(c) : (c = new V(c[u], c.baseSpec, c.customSpecs), M[":" + c[u]] = c)
            }
        };
        K("google.loader.rm", google[z].R);
        google[z].loaded = function (a) {
            M[":" + a.module].l(a)
        };
        K("google.loader.loaded", google[z].loaded);
        google[z].O = function () {
            return "qid=" + ((new Date)[v]().toString(16) + Math.floor(1E7 * Math.random()).toString(16))
        };
        K("google.loader.createGuidArg_", google[z].O);
        I("google_exportSymbol", I);
        I("google_exportProperty", J);
        google[z].a = {};
        K("google.loader.themes", google[z].a);
        google[z].a.I = "//www.google.com/cse/style/look/bubblegum.css";
        L(google[z].a, "BUBBLEGUM", google[z].a.I);
        google[z].a.K = "//www.google.com/cse/style/look/greensky.css";
        L(google[z].a, "GREENSKY", google[z].a.K);
        google[z].a.J = "//www.google.com/cse/style/look/espresso.css";
        L(google[z].a, "ESPRESSO", google[z].a.J);
        google[z].a.M = "//www.google.com/cse/style/look/shiny.css";
        L(google[z].a, "SHINY", google[z].a.M);
        google[z].a.L = "//www.google.com/cse/style/look/minimalist.css";
        L(google[z].a, "MINIMALIST", google[z].a.L);
        google[z].a.N = "//www.google.com/cse/style/look/v2/default.css";
        L(google[z].a, "V2_DEFAULT", google[z].a.N);

        function U(a) {
            this.b = a;
            this.o = [];
            this.n = {};
            this.e = {};
            this.f = {};
            this.j = !0;
            this.c = -1
        }

        U[x].g = function (a, b) {
            var c = "";
            void 0 != b && (void 0 != b.language && (c += "&hl=" + d(b.language)), void 0 != b.nocss && (c += "&output=" + d("nocss=" + b.nocss)), void 0 != b.nooldnames && (c += "&nooldnames=" + d(b.nooldnames)), void 0 != b.packages && (c += "&packages=" + d(b.packages)), null != b.callback && (c += "&async=2"), void 0 != b.style && (c += "&style=" + d(b.style)), void 0 != b.noexp && (c += "&noexp=true"), void 0 != b.other_params && (c += "&" + b.other_params));
            if (!this.j) {
                google[this.b] && google[this.b].JSHash && (c += "&sig=" + d(google[this.b].JSHash));
                var e = [], f;
                for (f in this.n) ":" == f[q](0) && e[m](f[A](1));
                for (f in this.e) ":" == f[q](0) && this.e[f] && e[m](f[A](1));
                c += "&have=" + d(e[B](","))
            }
            return google[z][t] + "/?file=" + this.b + "&v=" + a + google[z].AdditionalParams + c
        };
        U[x].t = function (a) {
            var b = null;
            a && (b = a.packages);
            var c = null;
            if (b) if ("string" == typeof b) c = [a.packages]; else if (b[w]) for (c = [], a = 0; a < b[w]; a++) "string" == typeof b[a] && c[m](b[a][n](/^\s*|\s*$/, "")[C]());
            c || (c = ["default"]);
            b = [];
            for (a = 0; a < c[w]; a++) this.n[":" + c[a]] || b[m](c[a]);
            return b
        };
        l(U[x], function (a, b) {
            var c = this.t(b), e = b && null != b.callback;
            if (e) var f = new W(b.callback);
            for (var k = [], p = c[w] - 1; 0 <= p; p--) {
                var s = c[p];
                e && f.B(s);
                if (this.e[":" + s]) c.splice(p, 1), e && this.f[":" + s][m](f); else k[m](s)
            }
            if (c[w]) {
                b && b.packages && (b.packages = c.sort()[B](","));
                for (p = 0; p < k[w]; p++) s = k[p], this.f[":" + s] = [], e && this.f[":" + s][m](f);
                if (b || null == N[":" + this.b] || null == N[":" + this.b].versions[":" + a] || google[z].AdditionalParams || !this.j) b && b.autoloaded || google[z].d("script", this.g(a, b), e); else {
                    c = N[":" + this.b];
                    google[this.b] = google[this.b] || {};
                    for (var R in c.properties) R && ":" == R[q](0) && (google[this.b][R[A](1)] = c.properties[R]);
                    google[z].d("script", google[z][t] + c.path + c.js, e);
                    c.css && google[z].d("css", google[z][t] + c.path + c.css, e)
                }
                this.j && (this.j = !1, this.c = (new Date)[v](), 1 != this.c % 100 && (this.c = -1));
                for (p = 0; p < k[w]; p++) s = k[p], this.e[":" + s] = !0
            }
        });
        U[x].l = function (a) {
            -1 != this.c && (X("al_" + this.b, "jl." + ((new Date)[v]() - this.c), !0), this.c = -1);
            this.o = this.o.concat(a.components);
            google[z][this.b] || (google[z][this.b] = {});
            google[z][this.b].packages = this.o.slice(0);
            for (var b = 0; b < a.components[w]; b++) {
                this.n[":" + a.components[b]] = !0;
                this.e[":" + a.components[b]] = !1;
                var c = this.f[":" + a.components[b]];
                if (c) {
                    for (var e = 0; e < c[w]; e++) c[e].C(a.components[b]);
                    delete this.f[":" + a.components[b]]
                }
            }
        };
        U[x].m = function (a, b) {
            return 0 == this.t(b)[w]
        };
        U[x].s = function () {
            return !0
        };

        function W(a) {
            this.F = a;
            this.q = {};
            this.r = 0
        }

        W[x].B = function (a) {
            this.r++;
            this.q[":" + a] = !0
        };
        W[x].C = function (a) {
            this.q[":" + a] && (this.q[":" + a] = !1, this.r--, 0 == this.r && g[y](this.F, 0))
        };

        function V(a, b, c) {
            this.name = a;
            this.D = b;
            this.p = c;
            this.u = this.h = !1;
            this.k = [];
            google[z].v[this[u]] = G(this.l, this)
        }

        F(V, U);
        l(V[x], function (a, b) {
            var c = b && null != b.callback;
            c ? (this.k[m](b.callback), b.callback = "google.loader.callbacks." + this[u]) : this.h = !0;
            b && b.autoloaded || google[z].d("script", this.g(a, b), c)
        });
        V[x].m = function (a, b) {
            return b && null != b.callback ? this.u : this.h
        };
        V[x].l = function () {
            this.u = !0;
            for (var a = 0; a < this.k[w]; a++) g[y](this.k[a], 0);
            this.k = []
        };
        var Y = function (a, b) {
            return a.string ? d(a.string) + "=" + d(b) : a.regex ? b[n](/(^.*$)/, a.regex) : ""
        };
        V[x].g = function (a, b) {
            return this.G(this.w(a), a, b)
        };
        V[x].G = function (a, b, c) {
            var e = "";
            a.key && (e += "&" + Y(a.key, google[z].ApiKey));
            a.version && (e += "&" + Y(a.version, b));
            b = google[z].Secure && a.ssl ? a.ssl : a.uri;
            if (null != c) for (var f in c) a.params[f] ? e += "&" + Y(a.params[f], c[f]) : "other_params" == f ? e += "&" + c[f] : "base_domain" == f && (b = "http://" + c[f] + a.uri[A](a.uri[r]("/", 7)));
            google[this[u]] = {};
            -1 == b[r]("?") && e && (e = "?" + e[A](1));
            return b + e
        };
        V[x].s = function (a) {
            return this.w(a).deferred
        };
        V[x].w = function (a) {
            if (this.p) for (var b = 0; b < this.p[w]; ++b) {
                var c = this.p[b];
                if (RegExp(c.pattern).test(a)) return c
            }
            return this.D
        };

        function T(a, b) {
            this.b = a;
            this.i = b;
            this.h = !1
        }

        F(T, U);
        l(T[x], function (a, b) {
            this.h = !0;
            google[z].d("script", this.g(a, b), !1)
        });
        T[x].m = function () {
            return this.h
        };
        T[x].l = function () {
        };
        T[x].g = function (a, b) {
            if (!this.i.versions[":" + a]) {
                if (this.i.aliases) {
                    var c = this.i.aliases[":" + a];
                    c && (a = c)
                }
                if (!this.i.versions[":" + a]) throw H("Module: '" + this.b + "' with version '" + a + "' not found!");
            }
            return google[z].GoogleApisBase + "/libs/" + this.b + "/" + a + "/" + this.i.versions[":" + a][b && b.uncompressed ? "uncompressed" : "compressed"]
        };
        T[x].s = function () {
            return !1
        };
        var ca = !1, Z = [], da = (new Date)[v](), fa = function () {
            ca || (P(g, "unload", ea), ca = !0)
        }, ga = function (a, b) {
            fa();
            if (!(google[z].Secure || google[z].Options && !1 !== google[z].Options.csi)) {
                for (var c = 0; c < a[w]; c++) a[c] = d(a[c][C]()[n](/[^a-z0-9_.]+/g, "_"));
                for (c = 0; c < b[w]; c++) b[c] = d(b[c][C]()[n](/[^a-z0-9_.]+/g, "_"));
                g[y](G($, null, "//gg.google.com/csi?s=uds&v=2&action=" + a[B](",") + "&it=" + b[B](",")), 1E4)
            }
        }, X = function (a, b, c) {
            c ? ga([a], [b]) : (fa(), Z[m]("r" + Z[w] + "=" + d(a + (b ? "|" + b : ""))), g[y](ea, 5 < Z[w] ? 0 : 15E3))
        }, ea = function () {
            if (Z[w]) {
                var a =
                    google[z][t];
                0 == a[r]("http:") && (a = a[n](/^http:/, "https:"));
                $(a + "/stats?" + Z[B]("&") + "&nc=" + (new Date)[v]() + "_" + ((new Date)[v]() - da));
                Z.length = 0
            }
        }, $ = function (a) {
            var b = new Image, c = $.H++;
            $.A[c] = b;
            b.onload = b.onerror = function () {
                delete $.A[c]
            };
            b.src = a;
            b = null
        };
        $.A = {};
        $.H = 0;
        I("google.loader.recordCsiStat", ga);
        I("google.loader.recordStat", X);
        I("google.loader.createImageForLogging", $);

    })();
    google.loader.rm({
        "specs": ["feeds", "spreadsheets", "gdata", "visualization", {
            "name": "sharing",
            "baseSpec": {
                "uri": "http://www.google.com/s2/sharing/js",
                "ssl": null,
                "key": {"string": "key"},
                "version": {"string": "v"},
                "deferred": false,
                "params": {"language": {"string": "hl"}}
            }
        }, "search", "orkut", "ads", "elements", {
            "name": "books",
            "baseSpec": {
                "uri": "http://books.google.com/books/api.js",
                "ssl": "https://encrypted.google.com/books/api.js",
                "key": {"string": "key"},
                "version": {"string": "v"},
                "deferred": true,
                "params": {"callback": {"string": "callback"}, "language": {"string": "hl"}}
            }
        }, {
            "name": "friendconnect",
            "baseSpec": {
                "uri": "http://www.google.com/friendconnect/script/friendconnect.js",
                "ssl": "https://www.google.com/friendconnect/script/friendconnect.js",
                "key": {"string": "key"},
                "version": {"string": "v"},
                "deferred": false,
                "params": {}
            }
        }, "identitytoolkit", "ima", {
            "name": "maps",
            "baseSpec": {
                "uri": "http://maps.google.com/maps?file\u003dgoogleapi",
                "ssl": "https://maps-api-ssl.google.com/maps?file\u003dgoogleapi",
                "key": {"string": "key"},
                "version": {"string": "v"},
                "deferred": true,
                "params": {"callback": {"regex": "callback\u003d$1\u0026async\u003d2"}, "language": {"string": "hl"}}
            },
            "customSpecs": [{
                "uri": "http://maps.googleapis.com/maps/api/js",
                "ssl": "https://maps.googleapis.com/maps/api/js",
                "version": {"string": "v"},
                "deferred": true,
                "params": {"callback": {"string": "callback"}, "language": {"string": "hl"}},
                "pattern": "^(3|3..*)$"
            }]
        }, "payments", "wave", "annotations_v2", "earth", "language", {
            "name": "annotations",
            "baseSpec": {
                "uri": "http://www.google.com/reviews/scripts/annotations_bootstrap.js",
                "ssl": null,
                "key": {"string": "key"},
                "version": {"string": "v"},
                "deferred": true,
                "params": {
                    "callback": {"string": "callback"},
                    "language": {"string": "hl"},
                    "country": {"string": "gl"}
                }
            }
        }, "picker"]
    });
    google.loader.rfm({
        ":search": {
            "versions": {":1": "1", ":1.0": "1"},
            "path": "/api/search/1.0/ee93f9aae9c9e9dba5eea831d506e69a/",
            "js": "default+pl.I.js",
            "css": "default+pl.css",
            "properties": {":JSHash": "ee93f9aae9c9e9dba5eea831d506e69a", ":NoOldNames": false, ":Version": "1.0"}
        },
        ":language": {
            "versions": {":1": "1", ":1.0": "1"},
            "path": "/api/language/1.0/aa67524fe978e85d12a837b6f572142f/",
            "js": "default+pl.I.js",
            "properties": {":JSHash": "aa67524fe978e85d12a837b6f572142f", ":Version": "1.0"}
        },
        ":feeds": {
            "versions": {":1": "1", ":1.0": "1"},
            "path": "/api/feeds/1.0/482f2817cdf8982edf2e5669f9e3a627/",
            "js": "default+pl.I.js",
            "css": "default+pl.css",
            "properties": {":JSHash": "482f2817cdf8982edf2e5669f9e3a627", ":Version": "1.0"}
        },
        ":spreadsheets": {
            "versions": {":0": "1", ":0.4": "1"},
            "path": "/api/spreadsheets/0.4/87ff7219e9f8a8164006cbf28d5e911a/",
            "js": "default.I.js",
            "properties": {":JSHash": "87ff7219e9f8a8164006cbf28d5e911a", ":Version": "0.4"}
        },
        ":ima": {
            "versions": {":3": "1", ":3.0": "1"},
            "path": "/api/ima/3.0/28a914332232c9a8ac0ae8da68b1006e/",
            "js": "default.I.js",
            "properties": {":JSHash": "28a914332232c9a8ac0ae8da68b1006e", ":Version": "3.0"}
        },
        ":wave": {
            "versions": {":1": "1", ":1.0": "1"},
            "path": "/api/wave/1.0/3b6f7573ff78da6602dda5e09c9025bf/",
            "js": "default.I.js",
            "properties": {":JSHash": "3b6f7573ff78da6602dda5e09c9025bf", ":Version": "1.0"}
        },
        ":annotations": {
            "versions": {":1": "1", ":1.0": "1"},
            "path": "/api/annotations/1.0/bacce7b6155a1bbadda3c05d65391b22/",
            "js": "default+pl.I.js",
            "properties": {":JSHash": "bacce7b6155a1bbadda3c05d65391b22", ":Version": "1.0"}
        },
        ":earth": {
            "versions": {":1": "1", ":1.0": "1"},
            "path": "/api/earth/1.0/db22e5693e0a8de1f62f3536f5a8d7d3/",
            "js": "default.I.js",
            "properties": {":JSHash": "db22e5693e0a8de1f62f3536f5a8d7d3", ":Version": "1.0"}
        },
        ":picker": {
            "versions": {":1": "1", ":1.0": "1"},
            "path": "/api/picker/1.0/1c635e91b9d0c082c660a42091913907/",
            "js": "default.I.js",
            "css": "default.css",
            "properties": {":JSHash": "1c635e91b9d0c082c660a42091913907", ":Version": "1.0"}
        }
    });
    google.loader.rpl({
        ":scriptaculous": {
            "versions": {
                ":1.8.3": {
                    "uncompressed": "scriptaculous.js",
                    "compressed": "scriptaculous.js"
                },
                ":1.9.0": {"uncompressed": "scriptaculous.js", "compressed": "scriptaculous.js"},
                ":1.8.2": {"uncompressed": "scriptaculous.js", "compressed": "scriptaculous.js"},
                ":1.8.1": {"uncompressed": "scriptaculous.js", "compressed": "scriptaculous.js"}
            }, "aliases": {":1.8": "1.8.3", ":1": "1.9.0", ":1.9": "1.9.0"}
        },
        ":yui": {
            "versions": {
                ":2.6.0": {
                    "uncompressed": "build/yuiloader/yuiloader.js",
                    "compressed": "build/yuiloader/yuiloader-min.js"
                },
                ":2.9.0": {
                    "uncompressed": "build/yuiloader/yuiloader.js",
                    "compressed": "build/yuiloader/yuiloader-min.js"
                },
                ":2.7.0": {
                    "uncompressed": "build/yuiloader/yuiloader.js",
                    "compressed": "build/yuiloader/yuiloader-min.js"
                },
                ":2.8.0r4": {
                    "uncompressed": "build/yuiloader/yuiloader.js",
                    "compressed": "build/yuiloader/yuiloader-min.js"
                },
                ":2.8.2r1": {
                    "uncompressed": "build/yuiloader/yuiloader.js",
                    "compressed": "build/yuiloader/yuiloader-min.js"
                },
                ":2.8.1": {
                    "uncompressed": "build/yuiloader/yuiloader.js",
                    "compressed": "build/yuiloader/yuiloader-min.js"
                },
                ":3.3.0": {"uncompressed": "build/yui/yui.js", "compressed": "build/yui/yui-min.js"}
            },
            "aliases": {
                ":3": "3.3.0",
                ":2": "2.9.0",
                ":2.7": "2.7.0",
                ":2.8.2": "2.8.2r1",
                ":2.6": "2.6.0",
                ":2.9": "2.9.0",
                ":2.8": "2.8.2r1",
                ":2.8.0": "2.8.0r4",
                ":3.3": "3.3.0"
            }
        },
        ":swfobject": {
            "versions": {
                ":2.1": {"uncompressed": "swfobject_src.js", "compressed": "swfobject.js"},
                ":2.2": {"uncompressed": "swfobject_src.js", "compressed": "swfobject.js"}
            }, "aliases": {":2": "2.2"}
        },
        ":webfont": {
            "versions": {
                ":1.0.28": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.27": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.29": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.12": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.13": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.14": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.15": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.10": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.11": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.2": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.1": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.0": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.6": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.19": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.5": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.18": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.4": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.17": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.3": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.16": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.9": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.21": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.22": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.25": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.26": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.23": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"},
                ":1.0.24": {"uncompressed": "webfont_debug.js", "compressed": "webfont.js"}
            }, "aliases": {":1": "1.0.29", ":1.0": "1.0.29"}
        },
        ":ext-core": {
            "versions": {
                ":3.1.0": {"uncompressed": "ext-core-debug.js", "compressed": "ext-core.js"},
                ":3.0.0": {"uncompressed": "ext-core-debug.js", "compressed": "ext-core.js"}
            }, "aliases": {":3": "3.1.0", ":3.0": "3.0.0", ":3.1": "3.1.0"}
        },
        ":mootools": {
            "versions": {
                ":1.3.1": {
                    "uncompressed": "mootools.js",
                    "compressed": "mootools-yui-compressed.js"
                },
                ":1.1.1": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.3.0": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.3.2": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.1.2": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.2.3": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.2.4": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.2.1": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.2.2": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.2.5": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.4.0": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.4.1": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"},
                ":1.4.2": {"uncompressed": "mootools.js", "compressed": "mootools-yui-compressed.js"}
            },
            "aliases": {
                ":1": "1.1.2",
                ":1.11": "1.1.1",
                ":1.4": "1.4.2",
                ":1.3": "1.3.2",
                ":1.2": "1.2.5",
                ":1.1": "1.1.2"
            }
        },
        ":jqueryui": {
            "versions": {
                ":1.8.0": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.2": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.1": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.15": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.14": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.13": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.12": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.11": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.10": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.17": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.16": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.6.0": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.9": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.7": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.8": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.7.2": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.5": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.7.3": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.6": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.7.0": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.7.1": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.8.4": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.5.3": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"},
                ":1.5.2": {"uncompressed": "jquery-ui.js", "compressed": "jquery-ui.min.js"}
            },
            "aliases": {
                ":1.8": "1.8.17",
                ":1.7": "1.7.3",
                ":1.6": "1.6.0",
                ":1": "1.8.17",
                ":1.5": "1.5.3",
                ":1.8.3": "1.8.4"
            }
        },
        ":chrome-frame": {
            "versions": {
                ":1.0.2": {"uncompressed": "CFInstall.js", "compressed": "CFInstall.min.js"},
                ":1.0.1": {"uncompressed": "CFInstall.js", "compressed": "CFInstall.min.js"},
                ":1.0.0": {"uncompressed": "CFInstall.js", "compressed": "CFInstall.min.js"}
            }, "aliases": {":1": "1.0.2", ":1.0": "1.0.2"}
        },
        ":jquery": {
            "versions": {
                ":1.6.2": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.3.1": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.6.1": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.3.0": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.6.4": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.6.3": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.3.2": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.6.0": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.2.3": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.7.0": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.7.1": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.2.6": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.4.3": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.4.4": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.5.1": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.5.0": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.4.0": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.5.2": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.4.1": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"},
                ":1.4.2": {"uncompressed": "jquery.js", "compressed": "jquery.min.js"}
            },
            "aliases": {
                ":1.7": "1.7.1",
                ":1.6": "1.6.4",
                ":1": "1.7.1",
                ":1.5": "1.5.2",
                ":1.4": "1.4.4",
                ":1.3": "1.3.2",
                ":1.2": "1.2.6"
            }
        },
        ":dojo": {
            "versions": {
                ":1.3.1": {
                    "uncompressed": "dojo/dojo.xd.js.uncompressed.js",
                    "compressed": "dojo/dojo.xd.js"
                },
                ":1.3.0": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.6.1": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.1.1": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.3.2": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.6.0": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.2.3": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.7.2": {"uncompressed": "dojo/dojo.js.uncompressed.js", "compressed": "dojo/dojo.js"},
                ":1.7.0": {"uncompressed": "dojo/dojo.js.uncompressed.js", "compressed": "dojo/dojo.js"},
                ":1.7.1": {"uncompressed": "dojo/dojo.js.uncompressed.js", "compressed": "dojo/dojo.js"},
                ":1.4.3": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.5.1": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.5.0": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.2.0": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.4.0": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"},
                ":1.4.1": {"uncompressed": "dojo/dojo.xd.js.uncompressed.js", "compressed": "dojo/dojo.xd.js"}
            },
            "aliases": {
                ":1.7": "1.7.2",
                ":1": "1.6.1",
                ":1.6": "1.6.1",
                ":1.5": "1.5.1",
                ":1.4": "1.4.3",
                ":1.3": "1.3.2",
                ":1.2": "1.2.3",
                ":1.1": "1.1.1"
            }
        },
        ":prototype": {
            "versions": {
                ":1.7.0.0": {"uncompressed": "prototype.js", "compressed": "prototype.js"},
                ":1.6.0.2": {"uncompressed": "prototype.js", "compressed": "prototype.js"},
                ":1.6.1.0": {"uncompressed": "prototype.js", "compressed": "prototype.js"},
                ":1.6.0.3": {"uncompressed": "prototype.js", "compressed": "prototype.js"}
            },
            "aliases": {
                ":1.7": "1.7.0.0",
                ":1.6.1": "1.6.1.0",
                ":1": "1.7.0.0",
                ":1.6": "1.6.1.0",
                ":1.7.0": "1.7.0.0",
                ":1.6.0": "1.6.0.3"
            }
        }
    });
}
;AccountClass = BaseClass.extend({
    init: function () {
        this._super();
        this.initFacebookIssue();
        if (this.isModuleActive('phone_login')) {
            this.initSMS();
            this.initRegisterValidators();
            this.initPassword()
        } else this.initValidators();
        this.initLoginTabs();
        this.initNewLoginForm();
        this.initForms();
        this.initAdRemider();
        if (this.isModuleActive('googleplus')) this.initGooglePlus();
        if (this.isModuleActive('threat_metrix')) this.initThreatMetrix()
    }, initThreatMetrix: function () {
        var token = window.metrix_token;
        $.cookie('threat_matrix_token', token, {expires: 30, path: '/', domain: '.' + session_domain})
    }, initForms: function () {
        var $form = $('#loginForm'), $phonePassword = $('.phone-password-sent');
        if (window.action === 'ad') {
            var $forms = $('#loginForm, #registerForm');
            $forms.each(function () {
                var $this = $(this), formAction = $this.attr('action'),
                    bs = window.method === 'contact' ? 'bs=adpage_chat_login_top' : 'bs=adpage_chat_login_bottom';
                formAction = formAction.replace('?', '?' + bs + '&');
                $this.attr('action', formAction);
                $this.find('.login-button--facebook').each(function () {
                    var $this = $(this), href = $this.attr('href'),
                        bs = window.method === 'contact' ? 'bs=adpage_chat_login_top' : 'bs=adpage_chat_login_bottom';
                    href = href.replace('?', '?' + bs + '&');
                    $this.attr('href', href);
                    if (typeof window.remove_old_ati === "undefined") $this.bind('click', function () {
                        var xt_temp = xtcustom;
                        xt_temp.touch_point_button = xtcustom.touch_point_button;
                        if ($(this).data('ref') === 'login') {
                            xt_med('C', '', 'reply_chat_login_fb_click&stc=' + encodeURIComponent(JSON.stringify(xt_temp)))
                        } else if ($(this).data('ref') === 'register') xt_med('C', '', 'reply_chat_registration_fb_click&stc=' + encodeURIComponent(JSON.stringify(xt_temp)))
                    })
                })
            })
        }
        ;
        if (!$('#formErrors').length) {
            if ($phonePassword.length) {
                $phonePassword.find('input').focus()
            } else $form.find('input').first().focus()
        } else $('div.suggest').show();
        $form.renderForms();
        if (!$('#formErrors').find('li#allegro_login').length) $('#loginForm').validate().showErrorsFromAction();
        $('input[name=q]').click(function () {
            $this = $(this);
            if ($this.val() == $this.attr('defaultval')) $this.val('')
        })
    }, initLoginValidators: function () {
        var $form = $('#loginForm');
        $form.validate({
            rules: {'login[email]': {required: true, email: true}, 'login[password]': {required: true}},
            messages: {
                'login[email]': {
                    required: 'РџРѕР»Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ РґР»СЏ Р·Р°РїРѕР»РЅРµРЅРёСЏ',
                    email: 'СЌС‚Рѕ РЅРµ РїРѕС…РѕР¶Рµ РЅР° email-Р°РґСЂРµСЃ'
                }, 'login[password]': {required: 'РџРѕР»Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ РґР»СЏ Р·Р°РїРѕР»РЅРµРЅРёСЏ'}
            }
        })
    }, initRegisterValidators: function () {
        var $form = $('#registerForm');
        $form.renderForms();
        $form.find('input').first().focus();
        $form.validate({
            rules: {
                'register[phone]': {required: true, cellphone: true},
                'register[email_phone]': {required: true, email_phone: true},
                'register[email]': {required: true, email: true, maxlength: 255},
                'register[password]': {required: true, minlength: 6, maxlength: 255},
                'register[rules]': {required: true}
            },
            messages: {
                'register[email]': {
                    required: 'РџРѕР»Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ РґР»СЏ Р·Р°РїРѕР»РЅРµРЅРёСЏ',
                    email: 'СЌС‚Рѕ РЅРµ РїРѕС…РѕР¶Рµ РЅР° email-Р°РґСЂРµСЃ',
                    maxlength: 'РќРµ РјРѕР¶РµС‚ Р±С‹С‚СЊ РґР»РёРЅРµРµ 255 СЃРёРјРІРѕР»РѕРІ'
                },
                'register[rules]': {required: 'РќРµРѕР±С…РѕРґРёРјРѕ РїРѕРґС‚РІРµСЂРґРёС‚СЊ РІР°С€Рµ СЃРѕРіР»Р°СЃРёРµ'},
                'register[password]': {
                    required: 'РџРѕР»Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ РґР»СЏ Р·Р°РїРѕР»РЅРµРЅРёСЏ',
                    maxlength: 'РќРµ РјРѕР¶РµС‚ Р±С‹С‚СЊ РґР»РёРЅРµРµ 255 СЃРёРјРІРѕР»РѕРІ'
                }
            },
            submitHandler: function (form) {
                $('#se_userSignIn').attr('disabled', 'disabled');
                form.submit()
            }
        }).showErrorsFromAction()
    }, initValidators: function () {
        this.initLoginValidators();
        this.initRegisterValidators()
    }, initSMS: function () {
        var $form = $('#loginForm');
        $form.validate({
            rules: {
                'login[phone]': {required: true, cellphone: true},
                'login[email_phone]': {required: true, email_phone: true},
                'login[password]': {required: true}
            },
            messages: {
                'login[email_phone]': {required: 'РџРѕР»Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ РґР»СЏ Р·Р°РїРѕР»РЅРµРЅРёСЏ'},
                'login[password]': {required: 'РџРѕР»Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ РґР»СЏ Р·Р°РїРѕР»РЅРµРЅРёСЏ'}
            }
        })
    }, initPassword: function () {
        $('#userEmailPhoneRegister').bind('change input keyup', function () {
            if ($.validator.methods['email'].call({
                    optional: function () {
                        return false
                    }
                }, $('#userEmailPhoneRegister').val(), null)) {
                $('#pass1Div').show()
            } else $('#pass1Div').hide()
        });
        $('#userEmailPhoneRegister').change()
    }, initFacebookIssue: function () {
        if (window.location.hash == '#_=_') {
            window.location.hash = '';
            if ($.type(history.pushState) != 'undefined') history.pushState('', document.title, window.location.pathname)
        }
    }, initGooglePlus: function () {
        var bs = '';
        if (window.action === 'ad') {
            bs = window.method === 'contact' ? '?bs=adpage_chat_login_top' : '?bs=adpage_chat_login_bottom';
            if (typeof window.remove_old_ati === "undefined") $('#signinButton').bind('mouseup', function () {
                var xt_temp = xtcustom;
                xt_temp.action_type = 'reply_chat_login_gmail_click';
                xt_temp.touch_point_button = xtcustom.touch_point_button;
                xt_med('C', '', 'reply_chat_login_gmail_click&stc=' + encodeURIComponent(JSON.stringify(xt_temp)))
            })
        }
        ;(function () {
            var po = document.createElement('script');
            po.type = 'text/javascript';
            po.async = true;
            po.src = 'https://plus.google.com/js/client:plusone.js?onload=start';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(po, s)
        })();
        (function () {
            signInCallback = function (authResult) {
                if (authResult['g-oauth-window']) if (authResult.code) {
                    $.ajax({
                        type: 'POST',
                        url: '/ajax/account/googlepluslogin/' + bs,
                        success: function (result) {
                            if (result.status == "ok") if (action === 'ad') {
                                window.location.reload()
                            } else if (Main.getReferrer()) {
                                window.location = window.referrer !== undefined ? window.referrer : Main.getReferrer()
                            } else window.location = "/myaccount/index/"
                        },
                        data: {
                            code: authResult.code,
                            state: $("#googlePlusState").val() ? $("#googlePlusState").val() : state
                        }
                    })
                } else if (authResult.error && authResult.error != 'immediate_failed') ShowMessage.error('Р’Рѕ РІСЂРµРјСЏ РІС…РѕРґР° С‡РµСЂРµР· google plus РїСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР°')
            }
        })()
    }, initLoginTabs: function () {
        var $tabs = $('.login-tabs'), hash = location.hash.replace(/[^\d\w\_\-]+/g, ''), action = window.action;
        $tabs.each(function () {
            var $this = $(this), $tabNavigation = $this.find('.login-tabs__navigation'),
                $tabContent = $this.children('.login-tabs__content');
            $tabNavigation.find('a').click(function (e) {
                e.preventDefault();
                var $this = $(this), href = $this.data('content');
                if (action === 'account') location.hash = href;
                if (!$this.hasClass('active')) {
                    var selectedTab = $this.data('content'),
                        $selectedContent = $tabContent.find('li[data-content="' + selectedTab + '"]');
                    $tabNavigation.find('a.active').removeClass('active');
                    $this.addClass('active');
                    $selectedContent.addClass('active').siblings('li').removeClass('active');
                    $selectedContent.find('input').first().focus()
                }
            })
        });
        if (hash && action === 'account') $('[data-content="' + hash + '"]').click()
    }, initNewLoginForm: function () {
        var $standardLoginBox = $('.standard-login-box'), $otherMethodsBox = $('.other-methods-box'),
            $registerPassword = $('#userPassRegister, #userPass'),
            $eyeIcon = $registerPassword.closest('.focusbox').find('i');
        $('.login-form__othermethods').click(function (e) {
            e.preventDefault();
            $standardLoginBox.slideUp(200, function () {
                $otherMethodsBox.slideDown()
            })
        });
        $('.login-button--email').click(function (e) {
            e.preventDefault();
            $otherMethodsBox.slideUp(200, function () {
                $standardLoginBox.slideDown()
            })
        });
        $registerPassword.keyup(function () {
            if ($(this).val()) {
                $eyeIcon.removeClass('hidden')
            } else $eyeIcon.addClass('hidden')
        });
        $eyeIcon.click(function (e) {
            e.preventDefault();
            var $this = $(this);
            if (!$this.hasClass('active')) {
                $registerPassword.prop('type', 'text');
                $this.addClass('active')
            } else {
                $registerPassword.prop('type', 'password');
                $this.removeClass('active')
            }
        })
    }, initAdRemider: function () {
        var thiz = this, $noAccountDivShow = $('#noAccountDivShow'), $noAccountDiv = $($noAccountDivShow.attr('href')),
            noAccountInnerHeight = $(window).height() - 240, $form2 = $('form.sendmail2');
        $noAccountDivShow.fancybox({
            title: '<p class="block clr large lheight22 marginleft10">Р’С‹ СЂР°Р·РјРµСЃС‚РёР»Рё РѕР±СЉСЏРІР»РµРЅРёРµ, РЅРѕ Сѓ РІР°СЃ РЅРµС‚ СѓС‡РµС‚РЅРѕР№ Р·Р°РїРёСЃРё</p>',
            titleShow: true,
            scrolling: 'no',
            padding: 0,
            autoScale: false,
            autoDimensions: true,
            onStart: function () {
                $noAccountDiv.show();
                $noAccountDiv.find('.inner').css({maxHeight: noAccountInnerHeight, overflow: "auto"});
                $noAccountDiv.find('form').submit(function (e) {
                    e.preventDefault();
                    if ($form2.validate().numberOfInvalids() > 0) return false;
                    var method = $noAccountDiv.find('#accountEmail').attr('name'),
                        email = $noAccountDiv.find('#accountEmail').val();
                    if (method == 'email_phone') {
                        Main.post('account', 'sendautologin', {email_phone: email}, function (data) {
                            if (data.status == 'ok') {
                                $noAccountDiv.find('#accountEmail').val("");
                                if (data.url) {
                                    document.location = data.url
                                } else ShowMessage.success(data.message);
                                $.fancybox.close()
                            } else if (data.status = 'error') ShowMessage.error(data.message)
                        })
                    } else Main.post('account', 'sendautologin', {email: email}, function (data) {
                        if (data.status == 'ok') {
                            ShowMessage.success(data.message);
                            $noAccountDiv.find('#accountEmail').val("");
                            $.fancybox.close()
                        } else if (data.status = 'error') ShowMessage.error(data.message)
                    })
                })
            },
            onCleanup: function () {
                $noAccountDiv.hide().unwrap()
            }
        });
        var $form2 = $('form.sendmail2');
        if (thiz.isModuleActive('phone_login')) {
            $form2.validate({
                rules: {email_phone: {required: true, email_phone: true}},
                messages: {email_phone: {required: 'РџРѕР»Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ РґР»СЏ Р·Р°РїРѕР»РЅРµРЅРёСЏ'}}
            })
        } else $form2.validate({
            rules: {email: {required: true, email: true}},
            messages: {
                email: {
                    required: 'РџРѕР»Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ РґР»СЏ Р·Р°РїРѕР»РЅРµРЅРёСЏ',
                    email: 'СЌС‚Рѕ РЅРµ РїРѕС…РѕР¶Рµ РЅР° email-Р°РґСЂРµСЃ'
                }
            }
        })
    }
});
var signInCallback;
/*
 * jQuery autoResize (textarea auto-resizer)
 * @copyright James Padolsey http://james.padolsey.com
 * @version 1.04
 */

(function (a) {
    a.fn.autoResize = function (j) {
        var b = a.extend({
            onResize: function () {
            }, animate: true, animateDuration: 150, animateCallback: function () {
            }, extraSpace: 20, limit: 1000
        }, j);
        this.filter('textarea').each(function () {
            var c = a(this).css({resize: 'none', 'overflow-y': 'hidden'}), k = c.height(), f = (function () {
                var l = ['height', 'width', 'lineHeight', 'textDecoration', 'letterSpacing'], h = {};
                a.each(l, function (d, e) {
                    h[e] = c.css(e)
                });
                return c.clone().removeAttr('id').removeAttr('name').css({
                    position: 'absolute',
                    top: 0,
                    left: -9999
                }).css(h).attr('tabIndex', '-1').insertBefore(c)
            })(), i = null, g = function () {
                f.height(0).val(a(this).val()).scrollTop(10000);
                var d = Math.max(f.scrollTop(), k) + b.extraSpace, e = a(this).add(f);
                if (i === d) {
                    return
                }
                i = d;
                if (d >= b.limit) {
                    a(this).css('overflow-y', '');
                    return
                }
                b.onResize.call(this);
                b.animate && c.css('display') === 'block' ? e.stop().animate({height: d}, b.animateDuration, b.animateCallback) : e.height(d)
            };
            c.unbind('.dynSiz').bind('keyup.dynSiz', g).bind('keydown.dynSiz', g).bind('change.dynSiz', g)
        });
        return this
    }
})(jQuery);
;
/*
 * jQuery Watermark plugin
 * Version 1.3.1 (23-MAR-2012)
 * @requires jQuery v1.3 or later
 *
 * Examples at: http://mario.ec/static/jq-watermark/
 * Copyright (c) 2010 Mario Estrada
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function (a) {
    var b = a.browser.msie && a.browser.version < 8, c = 4;
    a.watermarker = function () {
    }, a.extend(a.watermarker, {
        defaults: {
            color: "#999",
            left: 0,
            top: 0,
            fallback: !1,
            animDuration: 300,
            minOpacity: .6
        }, setDefaults: function (b) {
            a.extend(a.watermarker.defaults, b)
        }, checkVal: function (b, c, d) {
            return b.length == 0 ? a(c).show() : a(c).hide(), b.length > 0
        }, html5_support: function () {
            var a = document.createElement("input");
            return "placeholder" in a
        }
    }), a.fn.watermark = function (d, e) {
        var e, f;
        return e = a.extend(a.watermarker.defaults, e), f = this.filter("textarea, input:not(:checkbox,:radio,:file,:submit,:reset)"), e.fallback && a.watermarker.html5_support() ? this : (f.each(function () {
            var f, g, h, i, j, k, l, m, n = 0, o, p;
            f = a(this);
            if (f.attr("data-jq-watermark") == "processed") return;
            g = f.attr("placeholder") != undefined && f.attr("placeholder") != "" ? "placeholder" : "title", h = d === undefined || d === "" ? a(this).attr(g) : d, i = a('<span class="watermark_container"></span>'), j = a('<span class="watermark">' + h + "</span>"), g == "placeholder" && f.removeAttr("placeholder"), i.css({
                display: "inline-block",
                position: "relative"
            }), f.attr("data-percent-width") == "true" && i.css("width", "100%"), f.attr("data-percent-height") == "true" && i.css("height", "100%"), b && i.css({
                zoom: 1,
                display: "inline"
            }), f.wrap(i).attr("data-jq-watermark", "processed"), this.nodeName.toLowerCase() == "textarea" ? (e_height = f.css("line-height"), e_height = e_height === "normal" ? parseInt(f.css("font-size")) : e_height, n = f.css("padding-top") != "auto" ? parseInt(f.css("padding-top")) : 0) : (e_height = f.outerHeight(), e_height <= 0 && (e_height = f.css("padding-top") != "auto" ? parseInt(f.css("padding-top")) : 0, e_height += f.css("padding-bottom") != "auto" ? parseInt(f.css("padding-bottom")) : 0, e_height += f.css("height") != "auto" ? parseInt(f.css("height")) : 0)), n += f.css("margin-top") != "auto" ? parseInt(f.css("margin-top")) : 0, k = f.css("margin-left") != "auto" ? parseInt(f.css("margin-left")) : 0, k += f.css("padding-left") != "auto" ? parseInt(f.css("padding-left")) : 0, j.css({
                position: "absolute",
                display: "block",
                fontFamily: f.css("font-family"),
                fontSize: f.css("font-size"),
                color: e.color,
                left: c + e.left + k,
                top: e.top + n,
                height: e_height,
                lineHeight: e_height + "px",
                textAlign: "left",
                pointerEvents: "none"
            }).data("jq_watermark_element", f), a.watermarker.checkVal(f.val(), j), j.click(function () {
                a(a(this).data("jq_watermark_element")).trigger("click").trigger("focus")
            }), f.before(j).bind("focus.jq_watermark", function () {
                a.watermarker.checkVal(a(this).val(), j) || j.stop().fadeTo(e.animDuration, e.minOpacity)
            }).bind("blur.jq_watermark change.jq_watermark", function () {
                a.watermarker.checkVal(a(this).val(), j) || j.stop().fadeTo(e.animDuration, 1)
            }).bind("keydown.jq_watermark, paste.jq_watermark", function (b) {
                a(j).hide()
            }).bind("keyup.jq_watermark", function (b) {
                a.watermarker.checkVal(a(this).val(), j)
            })
        }), this)
    }, a(function () {
        a(".jq_watermark").watermark()
    })
})(jQuery);
;(function (e) {
    function a() {
        var t, n, r = {height: s.innerHeight, width: s.innerWidth};
        if (!r.height) {
            t = i.compatMode;
            if (t || !e.support.boxModel) {
                n = t === "CSS1Compat" ? o : i.body;
                r = {height: n.clientHeight, width: n.clientWidth}
            }
        }
        return r
    }

    function f() {
        return {
            top: s.pageYOffset || o.scrollTop || i.body.scrollTop,
            left: s.pageXOffset || o.scrollLeft || i.body.scrollLeft
        }
    }

    function l() {
        var i = e(), s, u = 0;
        e.each(t, function (e, t) {
            var n = t.data.selector, r = t.$element;
            i = i.add(n ? r.find(n) : r)
        });
        s = i.length;
        if (s) {
            n = n || a();
            r = r || f();
            for (; u < s; u++) {
                if (!e.contains(o, i[u])) {
                    continue
                }
                var l = e(i[u]), c = {height: l.height(), width: l.width()}, h = l.offset(), p = l.data("inview"), d, v,
                    m;
                if (!r || !n) {
                    return
                }
                if (h.top + c.height > r.top && h.top < r.top + n.height && h.left + c.width > r.left && h.left < r.left + n.width) {
                    d = r.left > h.left ? "right" : r.left + n.width < h.left + c.width ? "left" : "both";
                    v = r.top > h.top ? "bottom" : r.top + n.height < h.top + c.height ? "top" : "both";
                    m = d + "-" + v;
                    if (!p || p !== m) {
                        l.data("inview", m).trigger("inview", [true, d, v])
                    }
                } else if (p) {
                    l.data("inview", false).trigger("inview", [false])
                }
            }
        }
    }

    var t = {}, n, r, i = document, s = window, o = i.documentElement, u = e.expando;
    e.event.special.inview = {
        add: function (n) {
            t[n.guid + "-" + this[u]] = {data: n, $element: e(this)}
        }, remove: function (e) {
            try {
                delete t[e.guid + "-" + this[u]]
            } catch (n) {
            }
        }
    };
    e(s).bind("scroll resize", function () {
        n = r = null
    });
    if (!o.addEventListener && o.attachEvent) {
        o.attachEvent("onfocusin", function () {
            r = null
        })
    }
    setInterval(l, 250)
})(jQuery);
/*!
 * jQuery UI 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function (c, j) {
    function k(a, b) {
        var d = a.nodeName.toLowerCase();
        if ("area" === d) {
            b = a.parentNode;
            d = b.name;
            if (!a.href || !d || b.nodeName.toLowerCase() !== "map") return false;
            a = c("img[usemap=#" + d + "]")[0];
            return !!a && l(a)
        }
        return (/input|select|textarea|button|object/.test(d) ? !a.disabled : "a" == d ? a.href || b : b) && l(a)
    }

    function l(a) {
        return !c(a).parents().andSelf().filter(function () {
            return c.curCSS(this, "visibility") === "hidden" || c.expr.filters.hidden(this)
        }).length
    }

    c.ui = c.ui || {};
    if (!c.ui.version) {
        c.extend(c.ui, {
            version: "1.8.16",
            keyCode: {
                ALT: 18,
                BACKSPACE: 8,
                CAPS_LOCK: 20,
                COMMA: 188,
                COMMAND: 91,
                COMMAND_LEFT: 91,
                COMMAND_RIGHT: 93,
                CONTROL: 17,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                INSERT: 45,
                LEFT: 37,
                MENU: 93,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SHIFT: 16,
                SPACE: 32,
                TAB: 9,
                UP: 38,
                WINDOWS: 91
            }
        });
        c.fn.extend({
            propAttr: c.fn.prop || c.fn.attr, _focus: c.fn.focus, focus: function (a, b) {
                return typeof a === "number" ? this.each(function () {
                    var d =
                        this;
                    setTimeout(function () {
                        c(d).focus();
                        b && b.call(d)
                    }, a)
                }) : this._focus.apply(this, arguments)
            }, scrollParent: function () {
                var a;
                a = c.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
                    return /(relative|absolute|fixed)/.test(c.curCSS(this, "position", 1)) && /(auto|scroll)/.test(c.curCSS(this, "overflow", 1) + c.curCSS(this, "overflow-y", 1) + c.curCSS(this, "overflow-x", 1))
                }).eq(0) : this.parents().filter(function () {
                    return /(auto|scroll)/.test(c.curCSS(this,
                        "overflow", 1) + c.curCSS(this, "overflow-y", 1) + c.curCSS(this, "overflow-x", 1))
                }).eq(0);
                return /fixed/.test(this.css("position")) || !a.length ? c(document) : a
            }, zIndex: function (a) {
                if (a !== j) return this.css("zIndex", a);
                if (this.length) {
                    a = c(this[0]);
                    for (var b; a.length && a[0] !== document;) {
                        b = a.css("position");
                        if (b === "absolute" || b === "relative" || b === "fixed") {
                            b = parseInt(a.css("zIndex"), 10);
                            if (!isNaN(b) && b !== 0) return b
                        }
                        a = a.parent()
                    }
                }
                return 0
            }, disableSelection: function () {
                return this.bind((c.support.selectstart ? "selectstart" :
                    "mousedown") + ".ui-disableSelection", function (a) {
                    a.preventDefault()
                })
            }, enableSelection: function () {
                return this.unbind(".ui-disableSelection")
            }
        });
        c.each(["Width", "Height"], function (a, b) {
            function d(f, g, m, n) {
                c.each(e, function () {
                    g -= parseFloat(c.curCSS(f, "padding" + this, true)) || 0;
                    if (m) g -= parseFloat(c.curCSS(f, "border" + this + "Width", true)) || 0;
                    if (n) g -= parseFloat(c.curCSS(f, "margin" + this, true)) || 0
                });
                return g
            }

            var e = b === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], h = b.toLowerCase(), i = {
                innerWidth: c.fn.innerWidth, innerHeight: c.fn.innerHeight,
                outerWidth: c.fn.outerWidth, outerHeight: c.fn.outerHeight
            };
            c.fn["inner" + b] = function (f) {
                if (f === j) return i["inner" + b].call(this);
                return this.each(function () {
                    c(this).css(h, d(this, f) + "px")
                })
            };
            c.fn["outer" + b] = function (f, g) {
                if (typeof f !== "number") return i["outer" + b].call(this, f);
                return this.each(function () {
                    c(this).css(h, d(this, f, true, g) + "px")
                })
            }
        });
        c.extend(c.expr[":"], {
            data: function (a, b, d) {
                return !!c.data(a, d[3])
            }, focusable: function (a) {
                return k(a, !isNaN(c.attr(a, "tabindex")))
            }, tabbable: function (a) {
                var b = c.attr(a,
                    "tabindex"), d = isNaN(b);
                return (d || b >= 0) && k(a, !d)
            }
        });
        c(function () {
            var a = document.body, b = a.appendChild(b = document.createElement("div"));
            c.extend(b.style, {minHeight: "100px", height: "auto", padding: 0, borderWidth: 0});
            c.support.minHeight = b.offsetHeight === 100;
            c.support.selectstart = "onselectstart" in b;
            a.removeChild(b).style.display = "none"
        });
        c.extend(c.ui, {
            plugin: {
                add: function (a, b, d) {
                    a = c.ui[a].prototype;
                    for (var e in d) {
                        a.plugins[e] = a.plugins[e] || [];
                        a.plugins[e].push([b, d[e]])
                    }
                }, call: function (a, b, d) {
                    if ((b = a.plugins[b]) &&
                        a.element[0].parentNode) for (var e = 0; e < b.length; e++) a.options[b[e][0]] && b[e][1].apply(a.element, d)
                }
            }, contains: function (a, b) {
                return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16 : a !== b && a.contains(b)
            }, hasScroll: function (a, b) {
                if (c(a).css("overflow") === "hidden") return false;
                b = b && b === "left" ? "scrollLeft" : "scrollTop";
                var d = false;
                if (a[b] > 0) return true;
                a[b] = 1;
                d = a[b] > 0;
                a[b] = 0;
                return d
            }, isOverAxis: function (a, b, d) {
                return a > b && a < b + d
            }, isOver: function (a, b, d, e, h, i) {
                return c.ui.isOverAxis(a, d, h) &&
                    c.ui.isOverAxis(b, e, i)
            }
        })
    }
})(jQuery);
;
/*!
 * jQuery UI Widget 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function (b, j) {
    if (b.cleanData) {
        var k = b.cleanData;
        b.cleanData = function (a) {
            for (var c = 0, d; (d = a[c]) != null; c++) try {
                b(d).triggerHandler("remove")
            } catch (e) {
            }
            k(a)
        }
    } else {
        var l = b.fn.remove;
        b.fn.remove = function (a, c) {
            return this.each(function () {
                if (!c) if (!a || b.filter(a, [this]).length) b("*", this).add([this]).each(function () {
                    try {
                        b(this).triggerHandler("remove")
                    } catch (d) {
                    }
                });
                return l.call(b(this), a, c)
            })
        }
    }
    b.widget = function (a, c, d) {
        var e = a.split(".")[0], f;
        a = a.split(".")[1];
        f = e + "-" + a;
        if (!d) {
            d = c;
            c = b.Widget
        }
        b.expr[":"][f] =
            function (h) {
                return !!b.data(h, a)
            };
        b[e] = b[e] || {};
        b[e][a] = function (h, g) {
            arguments.length && this._createWidget(h, g)
        };
        c = new c;
        c.options = b.extend(true, {}, c.options);
        b[e][a].prototype = b.extend(true, c, {
            namespace: e,
            widgetName: a,
            widgetEventPrefix: b[e][a].prototype.widgetEventPrefix || a,
            widgetBaseClass: f
        }, d);
        b.widget.bridge(a, b[e][a])
    };
    b.widget.bridge = function (a, c) {
        b.fn[a] = function (d) {
            var e = typeof d === "string", f = Array.prototype.slice.call(arguments, 1), h = this;
            d = !e && f.length ? b.extend.apply(null, [true, d].concat(f)) :
                d;
            if (e && d.charAt(0) === "_") return h;
            e ? this.each(function () {
                var g = b.data(this, a), i = g && b.isFunction(g[d]) ? g[d].apply(g, f) : g;
                if (i !== g && i !== j) {
                    h = i;
                    return false
                }
            }) : this.each(function () {
                var g = b.data(this, a);
                g ? g.option(d || {})._init() : b.data(this, a, new c(d, this))
            });
            return h
        }
    };
    b.Widget = function (a, c) {
        arguments.length && this._createWidget(a, c)
    };
    b.Widget.prototype = {
        widgetName: "widget", widgetEventPrefix: "", options: {disabled: false}, _createWidget: function (a, c) {
            b.data(c, this.widgetName, this);
            this.element = b(c);
            this.options =
                b.extend(true, {}, this.options, this._getCreateOptions(), a);
            var d = this;
            this.element.bind("remove." + this.widgetName, function () {
                d.destroy()
            });
            this._create();
            this._trigger("create");
            this._init()
        }, _getCreateOptions: function () {
            return b.metadata && b.metadata.get(this.element[0])[this.widgetName]
        }, _create: function () {
        }, _init: function () {
        }, destroy: function () {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName);
            this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass +
                "-disabled ui-state-disabled")
        }, widget: function () {
            return this.element
        }, option: function (a, c) {
            var d = a;
            if (arguments.length === 0) return b.extend({}, this.options);
            if (typeof a === "string") {
                if (c === j) return this.options[a];
                d = {};
                d[a] = c
            }
            this._setOptions(d);
            return this
        }, _setOptions: function (a) {
            var c = this;
            b.each(a, function (d, e) {
                c._setOption(d, e)
            });
            return this
        }, _setOption: function (a, c) {
            this.options[a] = c;
            if (a === "disabled") this.widget()[c ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled",
                c);
            return this
        }, enable: function () {
            return this._setOption("disabled", false)
        }, disable: function () {
            return this._setOption("disabled", true)
        }, _trigger: function (a, c, d) {
            var e = this.options[a];
            c = b.Event(c);
            c.type = (a === this.widgetEventPrefix ? a : this.widgetEventPrefix + a).toLowerCase();
            d = d || {};
            if (c.originalEvent) {
                a = b.event.props.length;
                for (var f; a;) {
                    f = b.event.props[--a];
                    c[f] = c.originalEvent[f]
                }
            }
            this.element.trigger(c, d);
            return !(b.isFunction(e) && e.call(this.element[0], c, d) === false || c.isDefaultPrevented())
        }
    }
})(jQuery);
;
/*!
 * jQuery UI Mouse 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function (b) {
    var d = false;
    b(document).mouseup(function () {
        d = false
    });
    b.widget("ui.mouse", {
        options: {cancel: ":input,option", distance: 1, delay: 0}, _mouseInit: function () {
            var a = this;
            this.element.bind("mousedown." + this.widgetName, function (c) {
                return a._mouseDown(c)
            }).bind("click." + this.widgetName, function (c) {
                if (true === b.data(c.target, a.widgetName + ".preventClickEvent")) {
                    b.removeData(c.target, a.widgetName + ".preventClickEvent");
                    c.stopImmediatePropagation();
                    return false
                }
            });
            this.started = false
        }, _mouseDestroy: function () {
            this.element.unbind("." +
                this.widgetName)
        }, _mouseDown: function (a) {
            if (!d) {
                this._mouseStarted && this._mouseUp(a);
                this._mouseDownEvent = a;
                var c = this, f = a.which == 1,
                    g = typeof this.options.cancel == "string" && a.target.nodeName ? b(a.target).closest(this.options.cancel).length : false;
                if (!f || g || !this._mouseCapture(a)) return true;
                this.mouseDelayMet = !this.options.delay;
                if (!this.mouseDelayMet) this._mouseDelayTimer = setTimeout(function () {
                    c.mouseDelayMet = true
                }, this.options.delay);
                if (this._mouseDistanceMet(a) && this._mouseDelayMet(a)) {
                    this._mouseStarted =
                        this._mouseStart(a) !== false;
                    if (!this._mouseStarted) {
                        a.preventDefault();
                        return true
                    }
                }
                true === b.data(a.target, this.widgetName + ".preventClickEvent") && b.removeData(a.target, this.widgetName + ".preventClickEvent");
                this._mouseMoveDelegate = function (e) {
                    return c._mouseMove(e)
                };
                this._mouseUpDelegate = function (e) {
                    return c._mouseUp(e)
                };
                b(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
                a.preventDefault();
                return d = true
            }
        }, _mouseMove: function (a) {
            if (b.browser.msie &&
                !(document.documentMode >= 9) && !a.button) return this._mouseUp(a);
            if (this._mouseStarted) {
                this._mouseDrag(a);
                return a.preventDefault()
            }
            if (this._mouseDistanceMet(a) && this._mouseDelayMet(a)) (this._mouseStarted = this._mouseStart(this._mouseDownEvent, a) !== false) ? this._mouseDrag(a) : this._mouseUp(a);
            return !this._mouseStarted
        }, _mouseUp: function (a) {
            b(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted =
                    false;
                a.target == this._mouseDownEvent.target && b.data(a.target, this.widgetName + ".preventClickEvent", true);
                this._mouseStop(a)
            }
            return false
        }, _mouseDistanceMet: function (a) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
        }, _mouseDelayMet: function () {
            return this.mouseDelayMet
        }, _mouseStart: function () {
        }, _mouseDrag: function () {
        }, _mouseStop: function () {
        }, _mouseCapture: function () {
            return true
        }
    })
})(jQuery);
;
/*
 * jQuery UI Position 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function (c) {
    c.ui = c.ui || {};
    var n = /left|center|right/, o = /top|center|bottom/, t = c.fn.position, u = c.fn.offset;
    c.fn.position = function (b) {
        if (!b || !b.of) return t.apply(this, arguments);
        b = c.extend({}, b);
        var a = c(b.of), d = a[0], g = (b.collision || "flip").split(" "), e = b.offset ? b.offset.split(" ") : [0, 0],
            h, k, j;
        if (d.nodeType === 9) {
            h = a.width();
            k = a.height();
            j = {top: 0, left: 0}
        } else if (d.setTimeout) {
            h = a.width();
            k = a.height();
            j = {top: a.scrollTop(), left: a.scrollLeft()}
        } else if (d.preventDefault) {
            b.at = "left top";
            h = k = 0;
            j = {
                top: b.of.pageY,
                left: b.of.pageX
            }
        } else {
            h = a.outerWidth();
            k = a.outerHeight();
            j = a.offset()
        }
        c.each(["my", "at"], function () {
            var f = (b[this] || "").split(" ");
            if (f.length === 1) f = n.test(f[0]) ? f.concat(["center"]) : o.test(f[0]) ? ["center"].concat(f) : ["center", "center"];
            f[0] = n.test(f[0]) ? f[0] : "center";
            f[1] = o.test(f[1]) ? f[1] : "center";
            b[this] = f
        });
        if (g.length === 1) g[1] = g[0];
        e[0] = parseInt(e[0], 10) || 0;
        if (e.length === 1) e[1] = e[0];
        e[1] = parseInt(e[1], 10) || 0;
        if (b.at[0] === "right") j.left += h; else if (b.at[0] === "center") j.left += h / 2;
        if (b.at[1] === "bottom") j.top +=
            k; else if (b.at[1] === "center") j.top += k / 2;
        j.left += e[0];
        j.top += e[1];
        return this.each(function () {
            var f = c(this), l = f.outerWidth(), m = f.outerHeight(),
                p = parseInt(c.curCSS(this, "marginLeft", true)) || 0,
                q = parseInt(c.curCSS(this, "marginTop", true)) || 0,
                v = l + p + (parseInt(c.curCSS(this, "marginRight", true)) || 0),
                w = m + q + (parseInt(c.curCSS(this, "marginBottom", true)) || 0), i = c.extend({}, j), r;
            if (b.my[0] === "right") i.left -= l; else if (b.my[0] === "center") i.left -= l / 2;
            if (b.my[1] === "bottom") i.top -= m; else if (b.my[1] === "center") i.top -=
                m / 2;
            i.left = Math.round(i.left);
            i.top = Math.round(i.top);
            r = {left: i.left - p, top: i.top - q};
            c.each(["left", "top"], function (s, x) {
                c.ui.position[g[s]] && c.ui.position[g[s]][x](i, {
                    targetWidth: h,
                    targetHeight: k,
                    elemWidth: l,
                    elemHeight: m,
                    collisionPosition: r,
                    collisionWidth: v,
                    collisionHeight: w,
                    offset: e,
                    my: b.my,
                    at: b.at
                })
            });
            c.fn.bgiframe && f.bgiframe();
            f.offset(c.extend(i, {using: b.using}))
        })
    };
    c.ui.position = {
        fit: {
            left: function (b, a) {
                var d = c(window);
                d = a.collisionPosition.left + a.collisionWidth - d.width() - d.scrollLeft();
                b.left =
                    d > 0 ? b.left - d : Math.max(b.left - a.collisionPosition.left, b.left)
            }, top: function (b, a) {
                var d = c(window);
                d = a.collisionPosition.top + a.collisionHeight - d.height() - d.scrollTop();
                b.top = d > 0 ? b.top - d : Math.max(b.top - a.collisionPosition.top, b.top)
            }
        }, flip: {
            left: function (b, a) {
                if (a.at[0] !== "center") {
                    var d = c(window);
                    d = a.collisionPosition.left + a.collisionWidth - d.width() - d.scrollLeft();
                    var g = a.my[0] === "left" ? -a.elemWidth : a.my[0] === "right" ? a.elemWidth : 0,
                        e = a.at[0] === "left" ? a.targetWidth : -a.targetWidth, h = -2 * a.offset[0];
                    b.left +=
                        a.collisionPosition.left < 0 ? g + e + h : d > 0 ? g + e + h : 0
                }
            }, top: function (b, a) {
                if (a.at[1] !== "center") {
                    var d = c(window);
                    d = a.collisionPosition.top + a.collisionHeight - d.height() - d.scrollTop();
                    var g = a.my[1] === "top" ? -a.elemHeight : a.my[1] === "bottom" ? a.elemHeight : 0,
                        e = a.at[1] === "top" ? a.targetHeight : -a.targetHeight, h = -2 * a.offset[1];
                    b.top += a.collisionPosition.top < 0 ? g + e + h : d > 0 ? g + e + h : 0
                }
            }
        }
    };
    if (!c.offset.setOffset) {
        c.offset.setOffset = function (b, a) {
            if (/static/.test(c.curCSS(b, "position"))) b.style.position = "relative";
            var d = c(b),
                g = d.offset(), e = parseInt(c.curCSS(b, "top", true), 10) || 0,
                h = parseInt(c.curCSS(b, "left", true), 10) || 0;
            g = {top: a.top - g.top + e, left: a.left - g.left + h};
            "using" in a ? a.using.call(b, g) : d.css(g)
        };
        c.fn.offset = function (b) {
            var a = this[0];
            if (!a || !a.ownerDocument) return null;
            if (b) return this.each(function () {
                c.offset.setOffset(this, b)
            });
            return u.call(this)
        }
    }
})(jQuery);
;
/*
 * jQuery UI Draggable 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function (d) {
    d.widget("ui.draggable", d.ui.mouse, {
        widgetEventPrefix: "drag",
        options: {
            addClasses: true,
            appendTo: "parent",
            axis: false,
            connectToSortable: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            grid: false,
            handle: false,
            helper: "original",
            iframeFix: false,
            opacity: false,
            refreshPositions: false,
            revert: false,
            revertDuration: 500,
            scope: "default",
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: false,
            snapMode: "both",
            snapTolerance: 20,
            stack: false,
            zIndex: false
        },
        _create: function () {
            if (this.options.helper ==
                "original" && !/^(?:r|a|f)/.test(this.element.css("position"))) this.element[0].style.position = "relative";
            this.options.addClasses && this.element.addClass("ui-draggable");
            this.options.disabled && this.element.addClass("ui-draggable-disabled");
            this._mouseInit()
        },
        destroy: function () {
            if (this.element.data("draggable")) {
                this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
                this._mouseDestroy();
                return this
            }
        },
        _mouseCapture: function (a) {
            var b =
                this.options;
            if (this.helper || b.disabled || d(a.target).is(".ui-resizable-handle")) return false;
            this.handle = this._getHandle(a);
            if (!this.handle) return false;
            if (b.iframeFix) d(b.iframeFix === true ? "iframe" : b.iframeFix).each(function () {
                d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
                    width: this.offsetWidth + "px",
                    height: this.offsetHeight + "px",
                    position: "absolute",
                    opacity: "0.001",
                    zIndex: 1E3
                }).css(d(this).offset()).appendTo("body")
            });
            return true
        },
        _mouseStart: function (a) {
            var b = this.options;
            this.helper = this._createHelper(a);
            this._cacheHelperProportions();
            if (d.ui.ddmanager) d.ui.ddmanager.current = this;
            this._cacheMargins();
            this.cssPosition = this.helper.css("position");
            this.scrollParent = this.helper.scrollParent();
            this.offset = this.positionAbs = this.element.offset();
            this.offset = {top: this.offset.top - this.margins.top, left: this.offset.left - this.margins.left};
            d.extend(this.offset, {
                click: {left: a.pageX - this.offset.left, top: a.pageY - this.offset.top},
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            });
            this.originalPosition = this.position = this._generatePosition(a);
            this.originalPageX = a.pageX;
            this.originalPageY = a.pageY;
            b.cursorAt && this._adjustOffsetFromHelper(b.cursorAt);
            b.containment && this._setContainment();
            if (this._trigger("start", a) === false) {
                this._clear();
                return false
            }
            this._cacheHelperProportions();
            d.ui.ddmanager && !b.dropBehaviour && d.ui.ddmanager.prepareOffsets(this, a);
            this.helper.addClass("ui-draggable-dragging");
            this._mouseDrag(a, true);
            d.ui.ddmanager && d.ui.ddmanager.dragStart(this, a);
            return true
        },
        _mouseDrag: function (a, b) {
            this.position = this._generatePosition(a);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!b) {
                b = this._uiHash();
                if (this._trigger("drag", a, b) === false) {
                    this._mouseUp({});
                    return false
                }
                this.position = b.position
            }
            if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + "px";
            d.ui.ddmanager && d.ui.ddmanager.drag(this, a);
            return false
        },
        _mouseStop: function (a) {
            var b =
                false;
            if (d.ui.ddmanager && !this.options.dropBehaviour) b = d.ui.ddmanager.drop(this, a);
            if (this.dropped) {
                b = this.dropped;
                this.dropped = false
            }
            if ((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original") return false;
            if (this.options.revert == "invalid" && !b || this.options.revert == "valid" && b || this.options.revert === true || d.isFunction(this.options.revert) && this.options.revert.call(this.element, b)) {
                var c = this;
                d(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration,
                    10), function () {
                    c._trigger("stop", a) !== false && c._clear()
                })
            } else this._trigger("stop", a) !== false && this._clear();
            return false
        },
        _mouseUp: function (a) {
            this.options.iframeFix === true && d("div.ui-draggable-iframeFix").each(function () {
                this.parentNode.removeChild(this)
            });
            d.ui.ddmanager && d.ui.ddmanager.dragStop(this, a);
            return d.ui.mouse.prototype._mouseUp.call(this, a)
        },
        cancel: function () {
            this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear();
            return this
        },
        _getHandle: function (a) {
            var b = !this.options.handle ||
            !d(this.options.handle, this.element).length ? true : false;
            d(this.options.handle, this.element).find("*").andSelf().each(function () {
                if (this == a.target) b = true
            });
            return b
        },
        _createHelper: function (a) {
            var b = this.options;
            a = d.isFunction(b.helper) ? d(b.helper.apply(this.element[0], [a])) : b.helper == "clone" ? this.element.clone().removeAttr("id") : this.element;
            a.parents("body").length || a.appendTo(b.appendTo == "parent" ? this.element[0].parentNode : b.appendTo);
            a[0] != this.element[0] && !/(fixed|absolute)/.test(a.css("position")) &&
            a.css("position", "absolute");
            return a
        },
        _adjustOffsetFromHelper: function (a) {
            if (typeof a == "string") a = a.split(" ");
            if (d.isArray(a)) a = {left: +a[0], top: +a[1] || 0};
            if ("left" in a) this.offset.click.left = a.left + this.margins.left;
            if ("right" in a) this.offset.click.left = this.helperProportions.width - a.right + this.margins.left;
            if ("top" in a) this.offset.click.top = a.top + this.margins.top;
            if ("bottom" in a) this.offset.click.top = this.helperProportions.height - a.bottom + this.margins.top
        },
        _getParentOffset: function () {
            this.offsetParent =
                this.helper.offsetParent();
            var a = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                a.left += this.scrollParent.scrollLeft();
                a.top += this.scrollParent.scrollTop()
            }
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && d.browser.msie) a = {
                top: 0,
                left: 0
            };
            return {
                top: a.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: a.left + (parseInt(this.offsetParent.css("borderLeftWidth"),
                    10) || 0)
            }
        },
        _getRelativeOffset: function () {
            if (this.cssPosition == "relative") {
                var a = this.element.position();
                return {
                    top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            } else return {top: 0, left: 0}
        },
        _cacheMargins: function () {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"),
                    10) || 0
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
        },
        _setContainment: function () {
            var a = this.options;
            if (a.containment == "parent") a.containment = this.helper[0].parentNode;
            if (a.containment == "document" || a.containment == "window") this.containment = [a.containment == "document" ? 0 : d(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, a.containment == "document" ? 0 : d(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
                (a.containment == "document" ? 0 : d(window).scrollLeft()) + d(a.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (a.containment == "document" ? 0 : d(window).scrollTop()) + (d(a.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(a.containment) && a.containment.constructor != Array) {
                a = d(a.containment);
                var b = a[0];
                if (b) {
                    a.offset();
                    var c = d(b).css("overflow") !=
                        "hidden";
                    this.containment = [(parseInt(d(b).css("borderLeftWidth"), 10) || 0) + (parseInt(d(b).css("paddingLeft"), 10) || 0), (parseInt(d(b).css("borderTopWidth"), 10) || 0) + (parseInt(d(b).css("paddingTop"), 10) || 0), (c ? Math.max(b.scrollWidth, b.offsetWidth) : b.offsetWidth) - (parseInt(d(b).css("borderLeftWidth"), 10) || 0) - (parseInt(d(b).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (c ? Math.max(b.scrollHeight, b.offsetHeight) : b.offsetHeight) - (parseInt(d(b).css("borderTopWidth"),
                        10) || 0) - (parseInt(d(b).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom];
                    this.relative_container = a
                }
            } else if (a.containment.constructor == Array) this.containment = a.containment
        },
        _convertPositionTo: function (a, b) {
            if (!b) b = this.position;
            a = a == "absolute" ? 1 : -1;
            var c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                f = /(html|body)/i.test(c[0].tagName);
            return {
                top: b.top +
                this.offset.relative.top * a + this.offset.parent.top * a - (d.browser.safari && d.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : f ? 0 : c.scrollTop()) * a),
                left: b.left + this.offset.relative.left * a + this.offset.parent.left * a - (d.browser.safari && d.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0 : c.scrollLeft()) * a)
            }
        },
        _generatePosition: function (a) {
            var b = this.options, c = this.cssPosition == "absolute" &&
                !(this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                f = /(html|body)/i.test(c[0].tagName), e = a.pageX, h = a.pageY;
            if (this.originalPosition) {
                var g;
                if (this.containment) {
                    if (this.relative_container) {
                        g = this.relative_container.offset();
                        g = [this.containment[0] + g.left, this.containment[1] + g.top, this.containment[2] + g.left, this.containment[3] + g.top]
                    } else g = this.containment;
                    if (a.pageX - this.offset.click.left < g[0]) e = g[0] + this.offset.click.left;
                    if (a.pageY - this.offset.click.top < g[1]) h = g[1] + this.offset.click.top;
                    if (a.pageX - this.offset.click.left > g[2]) e = g[2] + this.offset.click.left;
                    if (a.pageY - this.offset.click.top > g[3]) h = g[3] + this.offset.click.top
                }
                if (b.grid) {
                    h = b.grid[1] ? this.originalPageY + Math.round((h - this.originalPageY) / b.grid[1]) * b.grid[1] : this.originalPageY;
                    h = g ? !(h - this.offset.click.top < g[1] || h - this.offset.click.top > g[3]) ? h : !(h - this.offset.click.top < g[1]) ? h - b.grid[1] : h + b.grid[1] : h;
                    e = b.grid[0] ? this.originalPageX + Math.round((e - this.originalPageX) /
                        b.grid[0]) * b.grid[0] : this.originalPageX;
                    e = g ? !(e - this.offset.click.left < g[0] || e - this.offset.click.left > g[2]) ? e : !(e - this.offset.click.left < g[0]) ? e - b.grid[0] : e + b.grid[0] : e
                }
            }
            return {
                top: h - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (d.browser.safari && d.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : f ? 0 : c.scrollTop()),
                left: e - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (d.browser.safari && d.browser.version <
                526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0 : c.scrollLeft())
            }
        },
        _clear: function () {
            this.helper.removeClass("ui-draggable-dragging");
            this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove();
            this.helper = null;
            this.cancelHelperRemoval = false
        },
        _trigger: function (a, b, c) {
            c = c || this._uiHash();
            d.ui.plugin.call(this, a, [b, c]);
            if (a == "drag") this.positionAbs = this._convertPositionTo("absolute");
            return d.Widget.prototype._trigger.call(this, a, b,
                c)
        },
        plugins: {},
        _uiHash: function () {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    });
    d.extend(d.ui.draggable, {version: "1.8.16"});
    d.ui.plugin.add("draggable", "connectToSortable", {
        start: function (a, b) {
            var c = d(this).data("draggable"), f = c.options, e = d.extend({}, b, {item: c.element});
            c.sortables = [];
            d(f.connectToSortable).each(function () {
                var h = d.data(this, "sortable");
                if (h && !h.options.disabled) {
                    c.sortables.push({instance: h, shouldRevert: h.options.revert});
                    h.refreshPositions();
                    h._trigger("activate", a, e)
                }
            })
        }, stop: function (a, b) {
            var c = d(this).data("draggable"), f = d.extend({}, b, {item: c.element});
            d.each(c.sortables, function () {
                if (this.instance.isOver) {
                    this.instance.isOver = 0;
                    c.cancelHelperRemoval = true;
                    this.instance.cancelHelperRemoval = false;
                    if (this.shouldRevert) this.instance.options.revert = true;
                    this.instance._mouseStop(a);
                    this.instance.options.helper = this.instance.options._helper;
                    c.options.helper == "original" && this.instance.currentItem.css({top: "auto", left: "auto"})
                } else {
                    this.instance.cancelHelperRemoval =
                        false;
                    this.instance._trigger("deactivate", a, f)
                }
            })
        }, drag: function (a, b) {
            var c = d(this).data("draggable"), f = this;
            d.each(c.sortables, function () {
                this.instance.positionAbs = c.positionAbs;
                this.instance.helperProportions = c.helperProportions;
                this.instance.offset.click = c.offset.click;
                if (this.instance._intersectsWith(this.instance.containerCache)) {
                    if (!this.instance.isOver) {
                        this.instance.isOver = 1;
                        this.instance.currentItem = d(f).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item", true);
                        this.instance.options._helper = this.instance.options.helper;
                        this.instance.options.helper = function () {
                            return b.helper[0]
                        };
                        a.target = this.instance.currentItem[0];
                        this.instance._mouseCapture(a, true);
                        this.instance._mouseStart(a, true, true);
                        this.instance.offset.click.top = c.offset.click.top;
                        this.instance.offset.click.left = c.offset.click.left;
                        this.instance.offset.parent.left -= c.offset.parent.left - this.instance.offset.parent.left;
                        this.instance.offset.parent.top -= c.offset.parent.top - this.instance.offset.parent.top;
                        c._trigger("toSortable", a);
                        c.dropped = this.instance.element;
                        c.currentItem = c.element;
                        this.instance.fromOutside = c
                    }
                    this.instance.currentItem && this.instance._mouseDrag(a)
                } else if (this.instance.isOver) {
                    this.instance.isOver = 0;
                    this.instance.cancelHelperRemoval = true;
                    this.instance.options.revert = false;
                    this.instance._trigger("out", a, this.instance._uiHash(this.instance));
                    this.instance._mouseStop(a, true);
                    this.instance.options.helper = this.instance.options._helper;
                    this.instance.currentItem.remove();
                    this.instance.placeholder &&
                    this.instance.placeholder.remove();
                    c._trigger("fromSortable", a);
                    c.dropped = false
                }
            })
        }
    });
    d.ui.plugin.add("draggable", "cursor", {
        start: function () {
            var a = d("body"), b = d(this).data("draggable").options;
            if (a.css("cursor")) b._cursor = a.css("cursor");
            a.css("cursor", b.cursor)
        }, stop: function () {
            var a = d(this).data("draggable").options;
            a._cursor && d("body").css("cursor", a._cursor)
        }
    });
    d.ui.plugin.add("draggable", "opacity", {
        start: function (a, b) {
            a = d(b.helper);
            b = d(this).data("draggable").options;
            if (a.css("opacity")) b._opacity =
                a.css("opacity");
            a.css("opacity", b.opacity)
        }, stop: function (a, b) {
            a = d(this).data("draggable").options;
            a._opacity && d(b.helper).css("opacity", a._opacity)
        }
    });
    d.ui.plugin.add("draggable", "scroll", {
        start: function () {
            var a = d(this).data("draggable");
            if (a.scrollParent[0] != document && a.scrollParent[0].tagName != "HTML") a.overflowOffset = a.scrollParent.offset()
        }, drag: function (a) {
            var b = d(this).data("draggable"), c = b.options, f = false;
            if (b.scrollParent[0] != document && b.scrollParent[0].tagName != "HTML") {
                if (!c.axis || c.axis !=
                    "x") if (b.overflowOffset.top + b.scrollParent[0].offsetHeight - a.pageY < c.scrollSensitivity) b.scrollParent[0].scrollTop = f = b.scrollParent[0].scrollTop + c.scrollSpeed; else if (a.pageY - b.overflowOffset.top < c.scrollSensitivity) b.scrollParent[0].scrollTop = f = b.scrollParent[0].scrollTop - c.scrollSpeed;
                if (!c.axis || c.axis != "y") if (b.overflowOffset.left + b.scrollParent[0].offsetWidth - a.pageX < c.scrollSensitivity) b.scrollParent[0].scrollLeft = f = b.scrollParent[0].scrollLeft + c.scrollSpeed; else if (a.pageX - b.overflowOffset.left <
                    c.scrollSensitivity) b.scrollParent[0].scrollLeft = f = b.scrollParent[0].scrollLeft - c.scrollSpeed
            } else {
                if (!c.axis || c.axis != "x") if (a.pageY - d(document).scrollTop() < c.scrollSensitivity) f = d(document).scrollTop(d(document).scrollTop() - c.scrollSpeed); else if (d(window).height() - (a.pageY - d(document).scrollTop()) < c.scrollSensitivity) f = d(document).scrollTop(d(document).scrollTop() + c.scrollSpeed);
                if (!c.axis || c.axis != "y") if (a.pageX - d(document).scrollLeft() < c.scrollSensitivity) f = d(document).scrollLeft(d(document).scrollLeft() -
                    c.scrollSpeed); else if (d(window).width() - (a.pageX - d(document).scrollLeft()) < c.scrollSensitivity) f = d(document).scrollLeft(d(document).scrollLeft() + c.scrollSpeed)
            }
            f !== false && d.ui.ddmanager && !c.dropBehaviour && d.ui.ddmanager.prepareOffsets(b, a)
        }
    });
    d.ui.plugin.add("draggable", "snap", {
        start: function () {
            var a = d(this).data("draggable"), b = a.options;
            a.snapElements = [];
            d(b.snap.constructor != String ? b.snap.items || ":data(draggable)" : b.snap).each(function () {
                var c = d(this), f = c.offset();
                this != a.element[0] && a.snapElements.push({
                    item: this,
                    width: c.outerWidth(), height: c.outerHeight(), top: f.top, left: f.left
                })
            })
        }, drag: function (a, b) {
            for (var c = d(this).data("draggable"), f = c.options, e = f.snapTolerance, h = b.offset.left, g = h + c.helperProportions.width, n = b.offset.top, o = n + c.helperProportions.height, i = c.snapElements.length - 1; i >= 0; i--) {
                var j = c.snapElements[i].left, l = j + c.snapElements[i].width, k = c.snapElements[i].top,
                    m = k + c.snapElements[i].height;
                if (j - e < h && h < l + e && k - e < n && n < m + e || j - e < h && h < l + e && k - e < o && o < m + e || j - e < g && g < l + e && k - e < n && n < m + e || j - e < g && g < l + e && k - e < o &&
                    o < m + e) {
                    if (f.snapMode != "inner") {
                        var p = Math.abs(k - o) <= e, q = Math.abs(m - n) <= e, r = Math.abs(j - g) <= e,
                            s = Math.abs(l - h) <= e;
                        if (p) b.position.top = c._convertPositionTo("relative", {
                            top: k - c.helperProportions.height,
                            left: 0
                        }).top - c.margins.top;
                        if (q) b.position.top = c._convertPositionTo("relative", {top: m, left: 0}).top - c.margins.top;
                        if (r) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: j - c.helperProportions.width
                        }).left - c.margins.left;
                        if (s) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: l
                        }).left - c.margins.left
                    }
                    var t =
                        p || q || r || s;
                    if (f.snapMode != "outer") {
                        p = Math.abs(k - n) <= e;
                        q = Math.abs(m - o) <= e;
                        r = Math.abs(j - h) <= e;
                        s = Math.abs(l - g) <= e;
                        if (p) b.position.top = c._convertPositionTo("relative", {top: k, left: 0}).top - c.margins.top;
                        if (q) b.position.top = c._convertPositionTo("relative", {
                            top: m - c.helperProportions.height,
                            left: 0
                        }).top - c.margins.top;
                        if (r) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: j
                        }).left - c.margins.left;
                        if (s) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: l - c.helperProportions.width
                        }).left - c.margins.left
                    }
                    if (!c.snapElements[i].snapping &&
                        (p || q || r || s || t)) c.options.snap.snap && c.options.snap.snap.call(c.element, a, d.extend(c._uiHash(), {snapItem: c.snapElements[i].item}));
                    c.snapElements[i].snapping = p || q || r || s || t
                } else {
                    c.snapElements[i].snapping && c.options.snap.release && c.options.snap.release.call(c.element, a, d.extend(c._uiHash(), {snapItem: c.snapElements[i].item}));
                    c.snapElements[i].snapping = false
                }
            }
        }
    });
    d.ui.plugin.add("draggable", "stack", {
        start: function () {
            var a = d(this).data("draggable").options;
            a = d.makeArray(d(a.stack)).sort(function (c, f) {
                return (parseInt(d(c).css("zIndex"),
                    10) || 0) - (parseInt(d(f).css("zIndex"), 10) || 0)
            });
            if (a.length) {
                var b = parseInt(a[0].style.zIndex) || 0;
                d(a).each(function (c) {
                    this.style.zIndex = b + c
                });
                this[0].style.zIndex = b + a.length
            }
        }
    });
    d.ui.plugin.add("draggable", "zIndex", {
        start: function (a, b) {
            a = d(b.helper);
            b = d(this).data("draggable").options;
            if (a.css("zIndex")) b._zIndex = a.css("zIndex");
            a.css("zIndex", b.zIndex)
        }, stop: function (a, b) {
            a = d(this).data("draggable").options;
            a._zIndex && d(b.helper).css("zIndex", a._zIndex)
        }
    })
})(jQuery);
;
/*
 * jQuery UI Droppable 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	jquery.ui.draggable.js
 */
(function (d) {
    d.widget("ui.droppable", {
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: false,
            addClasses: true,
            greedy: false,
            hoverClass: false,
            scope: "default",
            tolerance: "intersect"
        },
        _create: function () {
            var a = this.options, b = a.accept;
            this.isover = 0;
            this.isout = 1;
            this.accept = d.isFunction(b) ? b : function (c) {
                return c.is(b)
            };
            this.proportions = {width: this.element[0].offsetWidth, height: this.element[0].offsetHeight};
            d.ui.ddmanager.droppables[a.scope] = d.ui.ddmanager.droppables[a.scope] || [];
            d.ui.ddmanager.droppables[a.scope].push(this);
            a.addClasses && this.element.addClass("ui-droppable")
        },
        destroy: function () {
            for (var a = d.ui.ddmanager.droppables[this.options.scope], b = 0; b < a.length; b++) a[b] == this && a.splice(b, 1);
            this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");
            return this
        },
        _setOption: function (a, b) {
            if (a == "accept") this.accept = d.isFunction(b) ? b : function (c) {
                return c.is(b)
            };
            d.Widget.prototype._setOption.apply(this, arguments)
        },
        _activate: function (a) {
            var b = d.ui.ddmanager.current;
            this.options.activeClass &&
            this.element.addClass(this.options.activeClass);
            b && this._trigger("activate", a, this.ui(b))
        },
        _deactivate: function (a) {
            var b = d.ui.ddmanager.current;
            this.options.activeClass && this.element.removeClass(this.options.activeClass);
            b && this._trigger("deactivate", a, this.ui(b))
        },
        _over: function (a) {
            var b = d.ui.ddmanager.current;
            if (!(!b || (b.currentItem || b.element)[0] == this.element[0])) if (this.accept.call(this.element[0], b.currentItem || b.element)) {
                this.options.hoverClass && this.element.addClass(this.options.hoverClass);
                this._trigger("over", a, this.ui(b))
            }
        },
        _out: function (a) {
            var b = d.ui.ddmanager.current;
            if (!(!b || (b.currentItem || b.element)[0] == this.element[0])) if (this.accept.call(this.element[0], b.currentItem || b.element)) {
                this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
                this._trigger("out", a, this.ui(b))
            }
        },
        _drop: function (a, b) {
            var c = b || d.ui.ddmanager.current;
            if (!c || (c.currentItem || c.element)[0] == this.element[0]) return false;
            var e = false;
            this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function () {
                var g =
                    d.data(this, "droppable");
                if (g.options.greedy && !g.options.disabled && g.options.scope == c.options.scope && g.accept.call(g.element[0], c.currentItem || c.element) && d.ui.intersect(c, d.extend(g, {offset: g.element.offset()}), g.options.tolerance)) {
                    e = true;
                    return false
                }
            });
            if (e) return false;
            if (this.accept.call(this.element[0], c.currentItem || c.element)) {
                this.options.activeClass && this.element.removeClass(this.options.activeClass);
                this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
                this._trigger("drop",
                    a, this.ui(c));
                return this.element
            }
            return false
        },
        ui: function (a) {
            return {
                draggable: a.currentItem || a.element,
                helper: a.helper,
                position: a.position,
                offset: a.positionAbs
            }
        }
    });
    d.extend(d.ui.droppable, {version: "1.8.16"});
    d.ui.intersect = function (a, b, c) {
        if (!b.offset) return false;
        var e = (a.positionAbs || a.position.absolute).left, g = e + a.helperProportions.width,
            f = (a.positionAbs || a.position.absolute).top, h = f + a.helperProportions.height, i = b.offset.left,
            k = i + b.proportions.width, j = b.offset.top, l = j + b.proportions.height;
        switch (c) {
            case "fit":
                return i <= e && g <= k && j <= f && h <= l;
            case "intersect":
                return i < e + a.helperProportions.width / 2 && g - a.helperProportions.width / 2 < k && j < f + a.helperProportions.height / 2 && h - a.helperProportions.height / 2 < l;
            case "pointer":
                return d.ui.isOver((a.positionAbs || a.position.absolute).top + (a.clickOffset || a.offset.click).top, (a.positionAbs || a.position.absolute).left + (a.clickOffset || a.offset.click).left, j, i, b.proportions.height, b.proportions.width);
            case "touch":
                return (f >= j && f <= l || h >= j && h <= l || f < j && h > l) && (e >=
                    i && e <= k || g >= i && g <= k || e < i && g > k);
            default:
                return false
        }
    };
    d.ui.ddmanager = {
        current: null, droppables: {"default": []}, prepareOffsets: function (a, b) {
            var c = d.ui.ddmanager.droppables[a.options.scope] || [], e = b ? b.type : null,
                g = (a.currentItem || a.element).find(":data(droppable)").andSelf(), f = 0;
            a:for (; f < c.length; f++) if (!(c[f].options.disabled || a && !c[f].accept.call(c[f].element[0], a.currentItem || a.element))) {
                for (var h = 0; h < g.length; h++) if (g[h] == c[f].element[0]) {
                    c[f].proportions.height = 0;
                    continue a
                }
                c[f].visible = c[f].element.css("display") !=
                    "none";
                if (c[f].visible) {
                    e == "mousedown" && c[f]._activate.call(c[f], b);
                    c[f].offset = c[f].element.offset();
                    c[f].proportions = {width: c[f].element[0].offsetWidth, height: c[f].element[0].offsetHeight}
                }
            }
        }, drop: function (a, b) {
            var c = false;
            d.each(d.ui.ddmanager.droppables[a.options.scope] || [], function () {
                if (this.options) {
                    if (!this.options.disabled && this.visible && d.ui.intersect(a, this, this.options.tolerance)) c = c || this._drop.call(this, b);
                    if (!this.options.disabled && this.visible && this.accept.call(this.element[0], a.currentItem ||
                            a.element)) {
                        this.isout = 1;
                        this.isover = 0;
                        this._deactivate.call(this, b)
                    }
                }
            });
            return c
        }, dragStart: function (a, b) {
            a.element.parents(":not(body,html)").bind("scroll.droppable", function () {
                a.options.refreshPositions || d.ui.ddmanager.prepareOffsets(a, b)
            })
        }, drag: function (a, b) {
            a.options.refreshPositions && d.ui.ddmanager.prepareOffsets(a, b);
            d.each(d.ui.ddmanager.droppables[a.options.scope] || [], function () {
                if (!(this.options.disabled || this.greedyChild || !this.visible)) {
                    var c = d.ui.intersect(a, this, this.options.tolerance);
                    if (c = !c && this.isover == 1 ? "isout" : c && this.isover == 0 ? "isover" : null) {
                        var e;
                        if (this.options.greedy) {
                            var g = this.element.parents(":data(droppable):eq(0)");
                            if (g.length) {
                                e = d.data(g[0], "droppable");
                                e.greedyChild = c == "isover" ? 1 : 0
                            }
                        }
                        if (e && c == "isover") {
                            e.isover = 0;
                            e.isout = 1;
                            e._out.call(e, b)
                        }
                        this[c] = 1;
                        this[c == "isout" ? "isover" : "isout"] = 0;
                        this[c == "isover" ? "_over" : "_out"].call(this, b);
                        if (e && c == "isout") {
                            e.isout = 0;
                            e.isover = 1;
                            e._over.call(e, b)
                        }
                    }
                }
            })
        }, dragStop: function (a, b) {
            a.element.parents(":not(body,html)").unbind("scroll.droppable");
            a.options.refreshPositions || d.ui.ddmanager.prepareOffsets(a, b)
        }
    }
})(jQuery);
;
/*
 * jQuery UI Resizable 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function (e) {
    e.widget("ui.resizable", e.ui.mouse, {
        widgetEventPrefix: "resize",
        options: {
            alsoResize: false,
            animate: false,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: false,
            autoHide: false,
            containment: false,
            ghost: false,
            grid: false,
            handles: "e,s,se",
            helper: false,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            zIndex: 1E3
        },
        _create: function () {
            var b = this, a = this.options;
            this.element.addClass("ui-resizable");
            e.extend(this, {
                _aspectRatio: !!a.aspectRatio,
                aspectRatio: a.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: a.helper || a.ghost || a.animate ? a.helper || "ui-resizable-helper" : null
            });
            if (this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {
                /relative/.test(this.element.css("position")) && e.browser.opera && this.element.css({
                    position: "relative",
                    top: "auto",
                    left: "auto"
                });
                this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
                    position: this.element.css("position"),
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight(),
                    top: this.element.css("top"),
                    left: this.element.css("left")
                }));
                this.element = this.element.parent().data("resizable", this.element.data("resizable"));
                this.elementIsWrapper = true;
                this.element.css({
                    marginLeft: this.originalElement.css("marginLeft"),
                    marginTop: this.originalElement.css("marginTop"),
                    marginRight: this.originalElement.css("marginRight"),
                    marginBottom: this.originalElement.css("marginBottom")
                });
                this.originalElement.css({marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});
                this.originalResizeStyle =
                    this.originalElement.css("resize");
                this.originalElement.css("resize", "none");
                this._proportionallyResizeElements.push(this.originalElement.css({
                    position: "static",
                    zoom: 1,
                    display: "block"
                }));
                this.originalElement.css({margin: this.originalElement.css("margin")});
                this._proportionallyResize()
            }
            this.handles = a.handles || (!e(".ui-resizable-handle", this.element).length ? "e,s,se" : {
                n: ".ui-resizable-n",
                e: ".ui-resizable-e",
                s: ".ui-resizable-s",
                w: ".ui-resizable-w",
                se: ".ui-resizable-se",
                sw: ".ui-resizable-sw",
                ne: ".ui-resizable-ne",
                nw: ".ui-resizable-nw"
            });
            if (this.handles.constructor == String) {
                if (this.handles == "all") this.handles = "n,e,s,w,se,sw,ne,nw";
                var c = this.handles.split(",");
                this.handles = {};
                for (var d = 0; d < c.length; d++) {
                    var f = e.trim(c[d]),
                        g = e('<div class="ui-resizable-handle ' + ("ui-resizable-" + f) + '"></div>');
                    /sw|se|ne|nw/.test(f) && g.css({zIndex: ++a.zIndex});
                    "se" == f && g.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
                    this.handles[f] = ".ui-resizable-" + f;
                    this.element.append(g)
                }
            }
            this._renderAxis = function (h) {
                h = h || this.element;
                for (var i in this.handles) {
                    if (this.handles[i].constructor ==
                        String) this.handles[i] = e(this.handles[i], this.element).show();
                    if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
                        var j = e(this.handles[i], this.element), l = 0;
                        l = /sw|ne|nw|se|n|s/.test(i) ? j.outerHeight() : j.outerWidth();
                        j = ["padding", /ne|nw|n/.test(i) ? "Top" : /se|sw|s/.test(i) ? "Bottom" : /^e$/.test(i) ? "Right" : "Left"].join("");
                        h.css(j, l);
                        this._proportionallyResize()
                    }
                    e(this.handles[i])
                }
            };
            this._renderAxis(this.element);
            this._handles = e(".ui-resizable-handle", this.element).disableSelection();
            this._handles.mouseover(function () {
                if (!b.resizing) {
                    if (this.className) var h = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
                    b.axis = h && h[1] ? h[1] : "se"
                }
            });
            if (a.autoHide) {
                this._handles.hide();
                e(this.element).addClass("ui-resizable-autohide").hover(function () {
                    if (!a.disabled) {
                        e(this).removeClass("ui-resizable-autohide");
                        b._handles.show()
                    }
                }, function () {
                    if (!a.disabled) if (!b.resizing) {
                        e(this).addClass("ui-resizable-autohide");
                        b._handles.hide()
                    }
                })
            }
            this._mouseInit()
        },
        destroy: function () {
            this._mouseDestroy();
            var b = function (c) {
                e(c).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
            };
            if (this.elementIsWrapper) {
                b(this.element);
                var a = this.element;
                a.after(this.originalElement.css({
                    position: a.css("position"),
                    width: a.outerWidth(),
                    height: a.outerHeight(),
                    top: a.css("top"),
                    left: a.css("left")
                })).remove()
            }
            this.originalElement.css("resize", this.originalResizeStyle);
            b(this.originalElement);
            return this
        },
        _mouseCapture: function (b) {
            var a =
                false;
            for (var c in this.handles) if (e(this.handles[c])[0] == b.target) a = true;
            return !this.options.disabled && a
        },
        _mouseStart: function (b) {
            var a = this.options, c = this.element.position(), d = this.element;
            this.resizing = true;
            this.documentScroll = {top: e(document).scrollTop(), left: e(document).scrollLeft()};
            if (d.is(".ui-draggable") || /absolute/.test(d.css("position"))) d.css({
                position: "absolute",
                top: c.top,
                left: c.left
            });
            e.browser.opera && /relative/.test(d.css("position")) && d.css({
                position: "relative",
                top: "auto",
                left: "auto"
            });
            this._renderProxy();
            c = m(this.helper.css("left"));
            var f = m(this.helper.css("top"));
            if (a.containment) {
                c += e(a.containment).scrollLeft() || 0;
                f += e(a.containment).scrollTop() || 0
            }
            this.offset = this.helper.offset();
            this.position = {left: c, top: f};
            this.size = this._helper ? {width: d.outerWidth(), height: d.outerHeight()} : {
                width: d.width(),
                height: d.height()
            };
            this.originalSize = this._helper ? {width: d.outerWidth(), height: d.outerHeight()} : {
                width: d.width(),
                height: d.height()
            };
            this.originalPosition = {left: c, top: f};
            this.sizeDiff =
                {width: d.outerWidth() - d.width(), height: d.outerHeight() - d.height()};
            this.originalMousePosition = {left: b.pageX, top: b.pageY};
            this.aspectRatio = typeof a.aspectRatio == "number" ? a.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
            a = e(".ui-resizable-" + this.axis).css("cursor");
            e("body").css("cursor", a == "auto" ? this.axis + "-resize" : a);
            d.addClass("ui-resizable-resizing");
            this._propagate("start", b);
            return true
        },
        _mouseDrag: function (b) {
            var a = this.helper, c = this.originalMousePosition, d = this._change[this.axis];
            if (!d) return false;
            c = d.apply(this, [b, b.pageX - c.left || 0, b.pageY - c.top || 0]);
            this._updateVirtualBoundaries(b.shiftKey);
            if (this._aspectRatio || b.shiftKey) c = this._updateRatio(c, b);
            c = this._respectSize(c, b);
            this._propagate("resize", b);
            a.css({
                top: this.position.top + "px",
                left: this.position.left + "px",
                width: this.size.width + "px",
                height: this.size.height + "px"
            });
            !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize();
            this._updateCache(c);
            this._trigger("resize", b, this.ui());
            return false
        },
        _mouseStop: function (b) {
            this.resizing = false;
            var a = this.options, c = this;
            if (this._helper) {
                var d = this._proportionallyResizeElements, f = d.length && /textarea/i.test(d[0].nodeName);
                d = f && e.ui.hasScroll(d[0], "left") ? 0 : c.sizeDiff.height;
                f = f ? 0 : c.sizeDiff.width;
                f = {width: c.helper.width() - f, height: c.helper.height() - d};
                d = parseInt(c.element.css("left"), 10) + (c.position.left - c.originalPosition.left) || null;
                var g = parseInt(c.element.css("top"), 10) + (c.position.top - c.originalPosition.top) || null;
                a.animate || this.element.css(e.extend(f,
                    {top: g, left: d}));
                c.helper.height(c.size.height);
                c.helper.width(c.size.width);
                this._helper && !a.animate && this._proportionallyResize()
            }
            e("body").css("cursor", "auto");
            this.element.removeClass("ui-resizable-resizing");
            this._propagate("stop", b);
            this._helper && this.helper.remove();
            return false
        },
        _updateVirtualBoundaries: function (b) {
            var a = this.options, c, d, f;
            a = {
                minWidth: k(a.minWidth) ? a.minWidth : 0,
                maxWidth: k(a.maxWidth) ? a.maxWidth : Infinity,
                minHeight: k(a.minHeight) ? a.minHeight : 0,
                maxHeight: k(a.maxHeight) ? a.maxHeight :
                    Infinity
            };
            if (this._aspectRatio || b) {
                b = a.minHeight * this.aspectRatio;
                d = a.minWidth / this.aspectRatio;
                c = a.maxHeight * this.aspectRatio;
                f = a.maxWidth / this.aspectRatio;
                if (b > a.minWidth) a.minWidth = b;
                if (d > a.minHeight) a.minHeight = d;
                if (c < a.maxWidth) a.maxWidth = c;
                if (f < a.maxHeight) a.maxHeight = f
            }
            this._vBoundaries = a
        },
        _updateCache: function (b) {
            this.offset = this.helper.offset();
            if (k(b.left)) this.position.left = b.left;
            if (k(b.top)) this.position.top = b.top;
            if (k(b.height)) this.size.height = b.height;
            if (k(b.width)) this.size.width =
                b.width
        },
        _updateRatio: function (b) {
            var a = this.position, c = this.size, d = this.axis;
            if (k(b.height)) b.width = b.height * this.aspectRatio; else if (k(b.width)) b.height = b.width / this.aspectRatio;
            if (d == "sw") {
                b.left = a.left + (c.width - b.width);
                b.top = null
            }
            if (d == "nw") {
                b.top = a.top + (c.height - b.height);
                b.left = a.left + (c.width - b.width)
            }
            return b
        },
        _respectSize: function (b) {
            var a = this._vBoundaries, c = this.axis, d = k(b.width) && a.maxWidth && a.maxWidth < b.width,
                f = k(b.height) && a.maxHeight && a.maxHeight < b.height, g = k(b.width) && a.minWidth &&
                a.minWidth > b.width, h = k(b.height) && a.minHeight && a.minHeight > b.height;
            if (g) b.width = a.minWidth;
            if (h) b.height = a.minHeight;
            if (d) b.width = a.maxWidth;
            if (f) b.height = a.maxHeight;
            var i = this.originalPosition.left + this.originalSize.width, j = this.position.top + this.size.height,
                l = /sw|nw|w/.test(c);
            c = /nw|ne|n/.test(c);
            if (g && l) b.left = i - a.minWidth;
            if (d && l) b.left = i - a.maxWidth;
            if (h && c) b.top = j - a.minHeight;
            if (f && c) b.top = j - a.maxHeight;
            if ((a = !b.width && !b.height) && !b.left && b.top) b.top = null; else if (a && !b.top && b.left) b.left =
                null;
            return b
        },
        _proportionallyResize: function () {
            if (this._proportionallyResizeElements.length) for (var b = this.helper || this.element, a = 0; a < this._proportionallyResizeElements.length; a++) {
                var c = this._proportionallyResizeElements[a];
                if (!this.borderDif) {
                    var d = [c.css("borderTopWidth"), c.css("borderRightWidth"), c.css("borderBottomWidth"), c.css("borderLeftWidth")],
                        f = [c.css("paddingTop"), c.css("paddingRight"), c.css("paddingBottom"), c.css("paddingLeft")];
                    this.borderDif = e.map(d, function (g, h) {
                        g = parseInt(g, 10) ||
                            0;
                        h = parseInt(f[h], 10) || 0;
                        return g + h
                    })
                }
                e.browser.msie && (e(b).is(":hidden") || e(b).parents(":hidden").length) || c.css({
                    height: b.height() - this.borderDif[0] - this.borderDif[2] || 0,
                    width: b.width() - this.borderDif[1] - this.borderDif[3] || 0
                })
            }
        },
        _renderProxy: function () {
            var b = this.options;
            this.elementOffset = this.element.offset();
            if (this._helper) {
                this.helper = this.helper || e('<div style="overflow:hidden;"></div>');
                var a = e.browser.msie && e.browser.version < 7, c = a ? 1 : 0;
                a = a ? 2 : -1;
                this.helper.addClass(this._helper).css({
                    width: this.element.outerWidth() +
                    a,
                    height: this.element.outerHeight() + a,
                    position: "absolute",
                    left: this.elementOffset.left - c + "px",
                    top: this.elementOffset.top - c + "px",
                    zIndex: ++b.zIndex
                });
                this.helper.appendTo("body").disableSelection()
            } else this.helper = this.element
        },
        _change: {
            e: function (b, a) {
                return {width: this.originalSize.width + a}
            }, w: function (b, a) {
                return {left: this.originalPosition.left + a, width: this.originalSize.width - a}
            }, n: function (b, a, c) {
                return {top: this.originalPosition.top + c, height: this.originalSize.height - c}
            }, s: function (b, a, c) {
                return {
                    height: this.originalSize.height +
                    c
                }
            }, se: function (b, a, c) {
                return e.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [b, a, c]))
            }, sw: function (b, a, c) {
                return e.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [b, a, c]))
            }, ne: function (b, a, c) {
                return e.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [b, a, c]))
            }, nw: function (b, a, c) {
                return e.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [b, a, c]))
            }
        },
        _propagate: function (b, a) {
            e.ui.plugin.call(this, b, [a, this.ui()]);
            b != "resize" && this._trigger(b, a, this.ui())
        },
        plugins: {},
        ui: function () {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            }
        }
    });
    e.extend(e.ui.resizable, {version: "1.8.16"});
    e.ui.plugin.add("resizable", "alsoResize", {
        start: function () {
            var b = e(this).data("resizable").options, a = function (c) {
                e(c).each(function () {
                    var d = e(this);
                    d.data("resizable-alsoresize", {
                        width: parseInt(d.width(),
                            10),
                        height: parseInt(d.height(), 10),
                        left: parseInt(d.css("left"), 10),
                        top: parseInt(d.css("top"), 10),
                        position: d.css("position")
                    })
                })
            };
            if (typeof b.alsoResize == "object" && !b.alsoResize.parentNode) if (b.alsoResize.length) {
                b.alsoResize = b.alsoResize[0];
                a(b.alsoResize)
            } else e.each(b.alsoResize, function (c) {
                a(c)
            }); else a(b.alsoResize)
        }, resize: function (b, a) {
            var c = e(this).data("resizable");
            b = c.options;
            var d = c.originalSize, f = c.originalPosition, g = {
                height: c.size.height - d.height || 0, width: c.size.width - d.width || 0, top: c.position.top -
                f.top || 0, left: c.position.left - f.left || 0
            }, h = function (i, j) {
                e(i).each(function () {
                    var l = e(this), q = e(this).data("resizable-alsoresize"), p = {},
                        r = j && j.length ? j : l.parents(a.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                    e.each(r, function (n, o) {
                        if ((n = (q[o] || 0) + (g[o] || 0)) && n >= 0) p[o] = n || null
                    });
                    if (e.browser.opera && /relative/.test(l.css("position"))) {
                        c._revertToRelativePosition = true;
                        l.css({position: "absolute", top: "auto", left: "auto"})
                    }
                    l.css(p)
                })
            };
            typeof b.alsoResize == "object" && !b.alsoResize.nodeType ?
                e.each(b.alsoResize, function (i, j) {
                    h(i, j)
                }) : h(b.alsoResize)
        }, stop: function () {
            var b = e(this).data("resizable"), a = b.options, c = function (d) {
                e(d).each(function () {
                    var f = e(this);
                    f.css({position: f.data("resizable-alsoresize").position})
                })
            };
            if (b._revertToRelativePosition) {
                b._revertToRelativePosition = false;
                typeof a.alsoResize == "object" && !a.alsoResize.nodeType ? e.each(a.alsoResize, function (d) {
                    c(d)
                }) : c(a.alsoResize)
            }
            e(this).removeData("resizable-alsoresize")
        }
    });
    e.ui.plugin.add("resizable", "animate", {
        stop: function (b) {
            var a =
                    e(this).data("resizable"), c = a.options, d = a._proportionallyResizeElements,
                f = d.length && /textarea/i.test(d[0].nodeName),
                g = f && e.ui.hasScroll(d[0], "left") ? 0 : a.sizeDiff.height;
            f = {width: a.size.width - (f ? 0 : a.sizeDiff.width), height: a.size.height - g};
            g = parseInt(a.element.css("left"), 10) + (a.position.left - a.originalPosition.left) || null;
            var h = parseInt(a.element.css("top"), 10) + (a.position.top - a.originalPosition.top) || null;
            a.element.animate(e.extend(f, h && g ? {top: h, left: g} : {}), {
                duration: c.animateDuration, easing: c.animateEasing,
                step: function () {
                    var i = {
                        width: parseInt(a.element.css("width"), 10),
                        height: parseInt(a.element.css("height"), 10),
                        top: parseInt(a.element.css("top"), 10),
                        left: parseInt(a.element.css("left"), 10)
                    };
                    d && d.length && e(d[0]).css({width: i.width, height: i.height});
                    a._updateCache(i);
                    a._propagate("resize", b)
                }
            })
        }
    });
    e.ui.plugin.add("resizable", "containment", {
        start: function () {
            var b = e(this).data("resizable"), a = b.element, c = b.options.containment;
            if (a = c instanceof e ? c.get(0) : /parent/.test(c) ? a.parent().get(0) : c) {
                b.containerElement =
                    e(a);
                if (/document/.test(c) || c == document) {
                    b.containerOffset = {left: 0, top: 0};
                    b.containerPosition = {left: 0, top: 0};
                    b.parentData = {
                        element: e(document),
                        left: 0,
                        top: 0,
                        width: e(document).width(),
                        height: e(document).height() || document.body.parentNode.scrollHeight
                    }
                } else {
                    var d = e(a), f = [];
                    e(["Top", "Right", "Left", "Bottom"]).each(function (i, j) {
                        f[i] = m(d.css("padding" + j))
                    });
                    b.containerOffset = d.offset();
                    b.containerPosition = d.position();
                    b.containerSize = {height: d.innerHeight() - f[3], width: d.innerWidth() - f[1]};
                    c = b.containerOffset;
                    var g = b.containerSize.height, h = b.containerSize.width;
                    h = e.ui.hasScroll(a, "left") ? a.scrollWidth : h;
                    g = e.ui.hasScroll(a) ? a.scrollHeight : g;
                    b.parentData = {element: a, left: c.left, top: c.top, width: h, height: g}
                }
            }
        }, resize: function (b) {
            var a = e(this).data("resizable"), c = a.options, d = a.containerOffset, f = a.position;
            b = a._aspectRatio || b.shiftKey;
            var g = {top: 0, left: 0}, h = a.containerElement;
            if (h[0] != document && /static/.test(h.css("position"))) g = d;
            if (f.left < (a._helper ? d.left : 0)) {
                a.size.width += a._helper ? a.position.left - d.left :
                    a.position.left - g.left;
                if (b) a.size.height = a.size.width / c.aspectRatio;
                a.position.left = c.helper ? d.left : 0
            }
            if (f.top < (a._helper ? d.top : 0)) {
                a.size.height += a._helper ? a.position.top - d.top : a.position.top;
                if (b) a.size.width = a.size.height * c.aspectRatio;
                a.position.top = a._helper ? d.top : 0
            }
            a.offset.left = a.parentData.left + a.position.left;
            a.offset.top = a.parentData.top + a.position.top;
            c = Math.abs((a._helper ? a.offset.left - g.left : a.offset.left - g.left) + a.sizeDiff.width);
            d = Math.abs((a._helper ? a.offset.top - g.top : a.offset.top -
                d.top) + a.sizeDiff.height);
            f = a.containerElement.get(0) == a.element.parent().get(0);
            g = /relative|absolute/.test(a.containerElement.css("position"));
            if (f && g) c -= a.parentData.left;
            if (c + a.size.width >= a.parentData.width) {
                a.size.width = a.parentData.width - c;
                if (b) a.size.height = a.size.width / a.aspectRatio
            }
            if (d + a.size.height >= a.parentData.height) {
                a.size.height = a.parentData.height - d;
                if (b) a.size.width = a.size.height * a.aspectRatio
            }
        }, stop: function () {
            var b = e(this).data("resizable"), a = b.options, c = b.containerOffset, d = b.containerPosition,
                f = b.containerElement, g = e(b.helper), h = g.offset(), i = g.outerWidth() - b.sizeDiff.width;
            g = g.outerHeight() - b.sizeDiff.height;
            b._helper && !a.animate && /relative/.test(f.css("position")) && e(this).css({
                left: h.left - d.left - c.left,
                width: i,
                height: g
            });
            b._helper && !a.animate && /static/.test(f.css("position")) && e(this).css({
                left: h.left - d.left - c.left,
                width: i,
                height: g
            })
        }
    });
    e.ui.plugin.add("resizable", "ghost", {
        start: function () {
            var b = e(this).data("resizable"), a = b.options, c = b.size;
            b.ghost = b.originalElement.clone();
            b.ghost.css({
                opacity: 0.25,
                display: "block", position: "relative", height: c.height, width: c.width, margin: 0, left: 0, top: 0
            }).addClass("ui-resizable-ghost").addClass(typeof a.ghost == "string" ? a.ghost : "");
            b.ghost.appendTo(b.helper)
        }, resize: function () {
            var b = e(this).data("resizable");
            b.ghost && b.ghost.css({position: "relative", height: b.size.height, width: b.size.width})
        }, stop: function () {
            var b = e(this).data("resizable");
            b.ghost && b.helper && b.helper.get(0).removeChild(b.ghost.get(0))
        }
    });
    e.ui.plugin.add("resizable", "grid", {
        resize: function () {
            var b =
                    e(this).data("resizable"), a = b.options, c = b.size, d = b.originalSize, f = b.originalPosition,
                g = b.axis;
            a.grid = typeof a.grid == "number" ? [a.grid, a.grid] : a.grid;
            var h = Math.round((c.width - d.width) / (a.grid[0] || 1)) * (a.grid[0] || 1);
            a = Math.round((c.height - d.height) / (a.grid[1] || 1)) * (a.grid[1] || 1);
            if (/^(se|s|e)$/.test(g)) {
                b.size.width = d.width + h;
                b.size.height = d.height + a
            } else if (/^(ne)$/.test(g)) {
                b.size.width = d.width + h;
                b.size.height = d.height + a;
                b.position.top = f.top - a
            } else {
                if (/^(sw)$/.test(g)) {
                    b.size.width = d.width + h;
                    b.size.height =
                        d.height + a
                } else {
                    b.size.width = d.width + h;
                    b.size.height = d.height + a;
                    b.position.top = f.top - a
                }
                b.position.left = f.left - h
            }
        }
    });
    var m = function (b) {
        return parseInt(b, 10) || 0
    }, k = function (b) {
        return !isNaN(parseInt(b, 10))
    }
})(jQuery);
;
/*
 * jQuery UI Selectable 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Selectables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function (e) {
    e.widget("ui.selectable", e.ui.mouse, {
        options: {appendTo: "body", autoRefresh: true, distance: 0, filter: "*", tolerance: "touch"},
        _create: function () {
            var c = this;
            this.element.addClass("ui-selectable");
            this.dragged = false;
            var f;
            this.refresh = function () {
                f = e(c.options.filter, c.element[0]);
                f.each(function () {
                    var d = e(this), b = d.offset();
                    e.data(this, "selectable-item", {
                        element: this,
                        $element: d,
                        left: b.left,
                        top: b.top,
                        right: b.left + d.outerWidth(),
                        bottom: b.top + d.outerHeight(),
                        startselected: false,
                        selected: d.hasClass("ui-selected"),
                        selecting: d.hasClass("ui-selecting"),
                        unselecting: d.hasClass("ui-unselecting")
                    })
                })
            };
            this.refresh();
            this.selectees = f.addClass("ui-selectee");
            this._mouseInit();
            this.helper = e("<div class='ui-selectable-helper'></div>")
        },
        destroy: function () {
            this.selectees.removeClass("ui-selectee").removeData("selectable-item");
            this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable");
            this._mouseDestroy();
            return this
        },
        _mouseStart: function (c) {
            var f = this;
            this.opos = [c.pageX,
                c.pageY];
            if (!this.options.disabled) {
                var d = this.options;
                this.selectees = e(d.filter, this.element[0]);
                this._trigger("start", c);
                e(d.appendTo).append(this.helper);
                this.helper.css({left: c.clientX, top: c.clientY, width: 0, height: 0});
                d.autoRefresh && this.refresh();
                this.selectees.filter(".ui-selected").each(function () {
                    var b = e.data(this, "selectable-item");
                    b.startselected = true;
                    if (!c.metaKey) {
                        b.$element.removeClass("ui-selected");
                        b.selected = false;
                        b.$element.addClass("ui-unselecting");
                        b.unselecting = true;
                        f._trigger("unselecting",
                            c, {unselecting: b.element})
                    }
                });
                e(c.target).parents().andSelf().each(function () {
                    var b = e.data(this, "selectable-item");
                    if (b) {
                        var g = !c.metaKey || !b.$element.hasClass("ui-selected");
                        b.$element.removeClass(g ? "ui-unselecting" : "ui-selected").addClass(g ? "ui-selecting" : "ui-unselecting");
                        b.unselecting = !g;
                        b.selecting = g;
                        (b.selected = g) ? f._trigger("selecting", c, {selecting: b.element}) : f._trigger("unselecting", c, {unselecting: b.element});
                        return false
                    }
                })
            }
        },
        _mouseDrag: function (c) {
            var f = this;
            this.dragged = true;
            if (!this.options.disabled) {
                var d =
                    this.options, b = this.opos[0], g = this.opos[1], h = c.pageX, i = c.pageY;
                if (b > h) {
                    var j = h;
                    h = b;
                    b = j
                }
                if (g > i) {
                    j = i;
                    i = g;
                    g = j
                }
                this.helper.css({left: b, top: g, width: h - b, height: i - g});
                this.selectees.each(function () {
                    var a = e.data(this, "selectable-item");
                    if (!(!a || a.element == f.element[0])) {
                        var k = false;
                        if (d.tolerance == "touch") k = !(a.left > h || a.right < b || a.top > i || a.bottom < g); else if (d.tolerance == "fit") k = a.left > b && a.right < h && a.top > g && a.bottom < i;
                        if (k) {
                            if (a.selected) {
                                a.$element.removeClass("ui-selected");
                                a.selected = false
                            }
                            if (a.unselecting) {
                                a.$element.removeClass("ui-unselecting");
                                a.unselecting = false
                            }
                            if (!a.selecting) {
                                a.$element.addClass("ui-selecting");
                                a.selecting = true;
                                f._trigger("selecting", c, {selecting: a.element})
                            }
                        } else {
                            if (a.selecting) if (c.metaKey && a.startselected) {
                                a.$element.removeClass("ui-selecting");
                                a.selecting = false;
                                a.$element.addClass("ui-selected");
                                a.selected = true
                            } else {
                                a.$element.removeClass("ui-selecting");
                                a.selecting = false;
                                if (a.startselected) {
                                    a.$element.addClass("ui-unselecting");
                                    a.unselecting = true
                                }
                                f._trigger("unselecting", c, {unselecting: a.element})
                            }
                            if (a.selected) if (!c.metaKey &&
                                !a.startselected) {
                                a.$element.removeClass("ui-selected");
                                a.selected = false;
                                a.$element.addClass("ui-unselecting");
                                a.unselecting = true;
                                f._trigger("unselecting", c, {unselecting: a.element})
                            }
                        }
                    }
                });
                return false
            }
        },
        _mouseStop: function (c) {
            var f = this;
            this.dragged = false;
            e(".ui-unselecting", this.element[0]).each(function () {
                var d = e.data(this, "selectable-item");
                d.$element.removeClass("ui-unselecting");
                d.unselecting = false;
                d.startselected = false;
                f._trigger("unselected", c, {unselected: d.element})
            });
            e(".ui-selecting", this.element[0]).each(function () {
                var d =
                    e.data(this, "selectable-item");
                d.$element.removeClass("ui-selecting").addClass("ui-selected");
                d.selecting = false;
                d.selected = true;
                d.startselected = true;
                f._trigger("selected", c, {selected: d.element})
            });
            this._trigger("stop", c);
            this.helper.remove();
            return false
        }
    });
    e.extend(e.ui.selectable, {version: "1.8.16"})
})(jQuery);
;
/*
 * jQuery UI Sortable 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function (d) {
    d.widget("ui.sortable", d.ui.mouse, {
        widgetEventPrefix: "sort",
        options: {
            appendTo: "parent",
            axis: false,
            connectWith: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            dropOnEmpty: true,
            forcePlaceholderSize: false,
            forceHelperSize: false,
            grid: false,
            handle: false,
            helper: "original",
            items: "> *",
            opacity: false,
            placeholder: false,
            revert: false,
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1E3
        },
        _create: function () {
            var a = this.options;
            this.containerCache = {};
            this.element.addClass("ui-sortable");
            this.refresh();
            this.floating = this.items.length ? a.axis === "x" || /left|right/.test(this.items[0].item.css("float")) || /inline|table-cell/.test(this.items[0].item.css("display")) : false;
            this.offset = this.element.offset();
            this._mouseInit()
        },
        destroy: function () {
            this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");
            this._mouseDestroy();
            for (var a = this.items.length - 1; a >= 0; a--) this.items[a].item.removeData("sortable-item");
            return this
        },
        _setOption: function (a, b) {
            if (a ===
                "disabled") {
                this.options[a] = b;
                this.widget()[b ? "addClass" : "removeClass"]("ui-sortable-disabled")
            } else d.Widget.prototype._setOption.apply(this, arguments)
        },
        _mouseCapture: function (a, b) {
            if (this.reverting) return false;
            if (this.options.disabled || this.options.type == "static") return false;
            this._refreshItems(a);
            var c = null, e = this;
            d(a.target).parents().each(function () {
                if (d.data(this, "sortable-item") == e) {
                    c = d(this);
                    return false
                }
            });
            if (d.data(a.target, "sortable-item") == e) c = d(a.target);
            if (!c) return false;
            if (this.options.handle &&
                !b) {
                var f = false;
                d(this.options.handle, c).find("*").andSelf().each(function () {
                    if (this == a.target) f = true
                });
                if (!f) return false
            }
            this.currentItem = c;
            this._removeCurrentsFromItems();
            return true
        },
        _mouseStart: function (a, b, c) {
            b = this.options;
            var e = this;
            this.currentContainer = this;
            this.refreshPositions();
            this.helper = this._createHelper(a);
            this._cacheHelperProportions();
            this._cacheMargins();
            this.scrollParent = this.helper.scrollParent();
            this.offset = this.currentItem.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };
            this.helper.css("position", "absolute");
            this.cssPosition = this.helper.css("position");
            d.extend(this.offset, {
                click: {left: a.pageX - this.offset.left, top: a.pageY - this.offset.top},
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            });
            this.originalPosition = this._generatePosition(a);
            this.originalPageX = a.pageX;
            this.originalPageY = a.pageY;
            b.cursorAt && this._adjustOffsetFromHelper(b.cursorAt);
            this.domPosition = {prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0]};
            this.helper[0] != this.currentItem[0] && this.currentItem.hide();
            this._createPlaceholder();
            b.containment && this._setContainment();
            if (b.cursor) {
                if (d("body").css("cursor")) this._storedCursor = d("body").css("cursor");
                d("body").css("cursor", b.cursor)
            }
            if (b.opacity) {
                if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
                this.helper.css("opacity", b.opacity)
            }
            if (b.zIndex) {
                if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
                this.helper.css("zIndex", b.zIndex)
            }
            if (this.scrollParent[0] !=
                document && this.scrollParent[0].tagName != "HTML") this.overflowOffset = this.scrollParent.offset();
            this._trigger("start", a, this._uiHash());
            this._preserveHelperProportions || this._cacheHelperProportions();
            if (!c) for (c = this.containers.length - 1; c >= 0; c--) this.containers[c]._trigger("activate", a, e._uiHash(this));
            if (d.ui.ddmanager) d.ui.ddmanager.current = this;
            d.ui.ddmanager && !b.dropBehaviour && d.ui.ddmanager.prepareOffsets(this, a);
            this.dragging = true;
            this.helper.addClass("ui-sortable-helper");
            this._mouseDrag(a);
            return true
        },
        _mouseDrag: function (a) {
            this.position = this._generatePosition(a);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!this.lastPositionAbs) this.lastPositionAbs = this.positionAbs;
            if (this.options.scroll) {
                var b = this.options, c = false;
                if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") {
                    if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - a.pageY < b.scrollSensitivity) this.scrollParent[0].scrollTop = c = this.scrollParent[0].scrollTop + b.scrollSpeed; else if (a.pageY - this.overflowOffset.top <
                        b.scrollSensitivity) this.scrollParent[0].scrollTop = c = this.scrollParent[0].scrollTop - b.scrollSpeed;
                    if (this.overflowOffset.left + this.scrollParent[0].offsetWidth - a.pageX < b.scrollSensitivity) this.scrollParent[0].scrollLeft = c = this.scrollParent[0].scrollLeft + b.scrollSpeed; else if (a.pageX - this.overflowOffset.left < b.scrollSensitivity) this.scrollParent[0].scrollLeft = c = this.scrollParent[0].scrollLeft - b.scrollSpeed
                } else {
                    if (a.pageY - d(document).scrollTop() < b.scrollSensitivity) c = d(document).scrollTop(d(document).scrollTop() -
                        b.scrollSpeed); else if (d(window).height() - (a.pageY - d(document).scrollTop()) < b.scrollSensitivity) c = d(document).scrollTop(d(document).scrollTop() + b.scrollSpeed);
                    if (a.pageX - d(document).scrollLeft() < b.scrollSensitivity) c = d(document).scrollLeft(d(document).scrollLeft() - b.scrollSpeed); else if (d(window).width() - (a.pageX - d(document).scrollLeft()) < b.scrollSensitivity) c = d(document).scrollLeft(d(document).scrollLeft() + b.scrollSpeed)
                }
                c !== false && d.ui.ddmanager && !b.dropBehaviour && d.ui.ddmanager.prepareOffsets(this,
                    a)
            }
            this.positionAbs = this._convertPositionTo("absolute");
            if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + "px";
            for (b = this.items.length - 1; b >= 0; b--) {
                c = this.items[b];
                var e = c.item[0], f = this._intersectsWithPointer(c);
                if (f) if (e != this.currentItem[0] && this.placeholder[f == 1 ? "next" : "prev"]()[0] != e && !d.ui.contains(this.placeholder[0], e) && (this.options.type == "semi-dynamic" ? !d.ui.contains(this.element[0],
                        e) : true)) {
                    this.direction = f == 1 ? "down" : "up";
                    if (this.options.tolerance == "pointer" || this._intersectsWithSides(c)) this._rearrange(a, c); else break;
                    this._trigger("change", a, this._uiHash());
                    break
                }
            }
            this._contactContainers(a);
            d.ui.ddmanager && d.ui.ddmanager.drag(this, a);
            this._trigger("sort", a, this._uiHash());
            this.lastPositionAbs = this.positionAbs;
            return false
        },
        _mouseStop: function (a, b) {
            if (a) {
                d.ui.ddmanager && !this.options.dropBehaviour && d.ui.ddmanager.drop(this, a);
                if (this.options.revert) {
                    var c = this;
                    b = c.placeholder.offset();
                    c.reverting = true;
                    d(this.helper).animate({
                        left: b.left - this.offset.parent.left - c.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
                        top: b.top - this.offset.parent.top - c.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
                    }, parseInt(this.options.revert, 10) || 500, function () {
                        c._clear(a)
                    })
                } else this._clear(a, b);
                return false
            }
        },
        cancel: function () {
            var a = this;
            if (this.dragging) {
                this._mouseUp({target: null});
                this.options.helper == "original" ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") :
                    this.currentItem.show();
                for (var b = this.containers.length - 1; b >= 0; b--) {
                    this.containers[b]._trigger("deactivate", null, a._uiHash(this));
                    if (this.containers[b].containerCache.over) {
                        this.containers[b]._trigger("out", null, a._uiHash(this));
                        this.containers[b].containerCache.over = 0
                    }
                }
            }
            if (this.placeholder) {
                this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
                this.options.helper != "original" && this.helper && this.helper[0].parentNode && this.helper.remove();
                d.extend(this, {
                    helper: null,
                    dragging: false, reverting: false, _noFinalSort: null
                });
                this.domPosition.prev ? d(this.domPosition.prev).after(this.currentItem) : d(this.domPosition.parent).prepend(this.currentItem)
            }
            return this
        },
        serialize: function (a) {
            var b = this._getItemsAsjQuery(a && a.connected), c = [];
            a = a || {};
            d(b).each(function () {
                var e = (d(a.item || this).attr(a.attribute || "id") || "").match(a.expression || /(.+)[-=_](.+)/);
                if (e) c.push((a.key || e[1] + "[]") + "=" + (a.key && a.expression ? e[1] : e[2]))
            });
            !c.length && a.key && c.push(a.key + "=");
            return c.join("&")
        },
        toArray: function (a) {
            var b = this._getItemsAsjQuery(a && a.connected), c = [];
            a = a || {};
            b.each(function () {
                c.push(d(a.item || this).attr(a.attribute || "id") || "")
            });
            return c
        },
        _intersectsWith: function (a) {
            var b = this.positionAbs.left, c = b + this.helperProportions.width, e = this.positionAbs.top,
                f = e + this.helperProportions.height, g = a.left, h = g + a.width, i = a.top, k = i + a.height,
                j = this.offset.click.top, l = this.offset.click.left;
            j = e + j > i && e + j < k && b + l > g && b + l < h;
            return this.options.tolerance == "pointer" || this.options.forcePointerForContainers ||
            this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > a[this.floating ? "width" : "height"] ? j : g < b + this.helperProportions.width / 2 && c - this.helperProportions.width / 2 < h && i < e + this.helperProportions.height / 2 && f - this.helperProportions.height / 2 < k
        },
        _intersectsWithPointer: function (a) {
            var b = d.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, a.top, a.height);
            a = d.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, a.left, a.width);
            b = b && a;
            a = this._getDragVerticalDirection();
            var c = this._getDragHorizontalDirection();
            if (!b) return false;
            return this.floating ? c && c == "right" || a == "down" ? 2 : 1 : a && (a == "down" ? 2 : 1)
        },
        _intersectsWithSides: function (a) {
            var b = d.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, a.top + a.height / 2, a.height);
            a = d.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, a.left + a.width / 2, a.width);
            var c = this._getDragVerticalDirection(), e = this._getDragHorizontalDirection();
            return this.floating && e ? e == "right" && a || e == "left" && !a : c && (c == "down" && b || c == "up" && !b)
        },
        _getDragVerticalDirection: function () {
            var a = this.positionAbs.top - this.lastPositionAbs.top;
            return a != 0 && (a > 0 ? "down" : "up")
        },
        _getDragHorizontalDirection: function () {
            var a = this.positionAbs.left - this.lastPositionAbs.left;
            return a != 0 && (a > 0 ? "right" : "left")
        },
        refresh: function (a) {
            this._refreshItems(a);
            this.refreshPositions();
            return this
        },
        _connectWith: function () {
            var a = this.options;
            return a.connectWith.constructor == String ? [a.connectWith] : a.connectWith
        },
        _getItemsAsjQuery: function (a) {
            var b = [], c = [], e = this._connectWith();
            if (e && a) for (a = e.length - 1; a >= 0; a--) for (var f = d(e[a]), g = f.length - 1; g >= 0; g--) {
                var h = d.data(f[g], "sortable");
                if (h && h != this && !h.options.disabled) c.push([d.isFunction(h.options.items) ? h.options.items.call(h.element) : d(h.options.items, h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), h])
            }
            c.push([d.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : d(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),
                this]);
            for (a = c.length - 1; a >= 0; a--) c[a][0].each(function () {
                b.push(this)
            });
            return d(b)
        },
        _removeCurrentsFromItems: function () {
            for (var a = this.currentItem.find(":data(sortable-item)"), b = 0; b < this.items.length; b++) for (var c = 0; c < a.length; c++) a[c] == this.items[b].item[0] && this.items.splice(b, 1)
        },
        _refreshItems: function (a) {
            this.items = [];
            this.containers = [this];
            var b = this.items,
                c = [[d.isFunction(this.options.items) ? this.options.items.call(this.element[0], a, {item: this.currentItem}) : d(this.options.items, this.element),
                    this]], e = this._connectWith();
            if (e) for (var f = e.length - 1; f >= 0; f--) for (var g = d(e[f]), h = g.length - 1; h >= 0; h--) {
                var i = d.data(g[h], "sortable");
                if (i && i != this && !i.options.disabled) {
                    c.push([d.isFunction(i.options.items) ? i.options.items.call(i.element[0], a, {item: this.currentItem}) : d(i.options.items, i.element), i]);
                    this.containers.push(i)
                }
            }
            for (f = c.length - 1; f >= 0; f--) {
                a = c[f][1];
                e = c[f][0];
                h = 0;
                for (g = e.length; h < g; h++) {
                    i = d(e[h]);
                    i.data("sortable-item", a);
                    b.push({item: i, instance: a, width: 0, height: 0, left: 0, top: 0})
                }
            }
        },
        refreshPositions: function (a) {
            if (this.offsetParent &&
                this.helper) this.offset.parent = this._getParentOffset();
            for (var b = this.items.length - 1; b >= 0; b--) {
                var c = this.items[b];
                if (!(c.instance != this.currentContainer && this.currentContainer && c.item[0] != this.currentItem[0])) {
                    var e = this.options.toleranceElement ? d(this.options.toleranceElement, c.item) : c.item;
                    if (!a) {
                        c.width = e.outerWidth();
                        c.height = e.outerHeight()
                    }
                    e = e.offset();
                    c.left = e.left;
                    c.top = e.top
                }
            }
            if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this); else for (b =
                                                                                                                                              this.containers.length - 1; b >= 0; b--) {
                e = this.containers[b].element.offset();
                this.containers[b].containerCache.left = e.left;
                this.containers[b].containerCache.top = e.top;
                this.containers[b].containerCache.width = this.containers[b].element.outerWidth();
                this.containers[b].containerCache.height = this.containers[b].element.outerHeight()
            }
            return this
        },
        _createPlaceholder: function (a) {
            var b = a || this, c = b.options;
            if (!c.placeholder || c.placeholder.constructor == String) {
                var e = c.placeholder;
                c.placeholder = {
                    element: function () {
                        var f =
                            d(document.createElement(b.currentItem[0].nodeName)).addClass(e || b.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
                        if (!e) f.style.visibility = "hidden";
                        return f
                    }, update: function (f, g) {
                        if (!(e && !c.forcePlaceholderSize)) {
                            g.height() || g.height(b.currentItem.innerHeight() - parseInt(b.currentItem.css("paddingTop") || 0, 10) - parseInt(b.currentItem.css("paddingBottom") || 0, 10));
                            g.width() || g.width(b.currentItem.innerWidth() - parseInt(b.currentItem.css("paddingLeft") || 0, 10) - parseInt(b.currentItem.css("paddingRight") ||
                                0, 10))
                        }
                    }
                }
            }
            b.placeholder = d(c.placeholder.element.call(b.element, b.currentItem));
            b.currentItem.after(b.placeholder);
            c.placeholder.update(b, b.placeholder)
        },
        _contactContainers: function (a) {
            for (var b = null, c = null, e = this.containers.length - 1; e >= 0; e--) if (!d.ui.contains(this.currentItem[0], this.containers[e].element[0])) if (this._intersectsWith(this.containers[e].containerCache)) {
                if (!(b && d.ui.contains(this.containers[e].element[0], b.element[0]))) {
                    b = this.containers[e];
                    c = e
                }
            } else if (this.containers[e].containerCache.over) {
                this.containers[e]._trigger("out",
                    a, this._uiHash(this));
                this.containers[e].containerCache.over = 0
            }
            if (b) if (this.containers.length === 1) {
                this.containers[c]._trigger("over", a, this._uiHash(this));
                this.containers[c].containerCache.over = 1
            } else if (this.currentContainer != this.containers[c]) {
                b = 1E4;
                e = null;
                for (var f = this.positionAbs[this.containers[c].floating ? "left" : "top"], g = this.items.length - 1; g >= 0; g--) if (d.ui.contains(this.containers[c].element[0], this.items[g].item[0])) {
                    var h = this.items[g][this.containers[c].floating ? "left" : "top"];
                    if (Math.abs(h -
                            f) < b) {
                        b = Math.abs(h - f);
                        e = this.items[g]
                    }
                }
                if (e || this.options.dropOnEmpty) {
                    this.currentContainer = this.containers[c];
                    e ? this._rearrange(a, e, null, true) : this._rearrange(a, null, this.containers[c].element, true);
                    this._trigger("change", a, this._uiHash());
                    this.containers[c]._trigger("change", a, this._uiHash(this));
                    this.options.placeholder.update(this.currentContainer, this.placeholder);
                    this.containers[c]._trigger("over", a, this._uiHash(this));
                    this.containers[c].containerCache.over = 1
                }
            }
        },
        _createHelper: function (a) {
            var b =
                this.options;
            a = d.isFunction(b.helper) ? d(b.helper.apply(this.element[0], [a, this.currentItem])) : b.helper == "clone" ? this.currentItem.clone() : this.currentItem;
            a.parents("body").length || d(b.appendTo != "parent" ? b.appendTo : this.currentItem[0].parentNode)[0].appendChild(a[0]);
            if (a[0] == this.currentItem[0]) this._storedCSS = {
                width: this.currentItem[0].style.width,
                height: this.currentItem[0].style.height,
                position: this.currentItem.css("position"),
                top: this.currentItem.css("top"),
                left: this.currentItem.css("left")
            };
            if (a[0].style.width ==
                "" || b.forceHelperSize) a.width(this.currentItem.width());
            if (a[0].style.height == "" || b.forceHelperSize) a.height(this.currentItem.height());
            return a
        },
        _adjustOffsetFromHelper: function (a) {
            if (typeof a == "string") a = a.split(" ");
            if (d.isArray(a)) a = {left: +a[0], top: +a[1] || 0};
            if ("left" in a) this.offset.click.left = a.left + this.margins.left;
            if ("right" in a) this.offset.click.left = this.helperProportions.width - a.right + this.margins.left;
            if ("top" in a) this.offset.click.top = a.top + this.margins.top;
            if ("bottom" in a) this.offset.click.top =
                this.helperProportions.height - a.bottom + this.margins.top
        },
        _getParentOffset: function () {
            this.offsetParent = this.helper.offsetParent();
            var a = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                a.left += this.scrollParent.scrollLeft();
                a.top += this.scrollParent.scrollTop()
            }
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && d.browser.msie) a =
                {top: 0, left: 0};
            return {
                top: a.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: a.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function () {
            if (this.cssPosition == "relative") {
                var a = this.currentItem.position();
                return {
                    top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            } else return {top: 0, left: 0}
        },
        _cacheMargins: function () {
            this.margins = {
                left: parseInt(this.currentItem.css("marginLeft"),
                    10) || 0, top: parseInt(this.currentItem.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
        },
        _setContainment: function () {
            var a = this.options;
            if (a.containment == "parent") a.containment = this.helper[0].parentNode;
            if (a.containment == "document" || a.containment == "window") this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, d(a.containment == "document" ?
                document : window).width() - this.helperProportions.width - this.margins.left, (d(a.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(a.containment)) {
                var b = d(a.containment)[0];
                a = d(a.containment).offset();
                var c = d(b).css("overflow") != "hidden";
                this.containment = [a.left + (parseInt(d(b).css("borderLeftWidth"), 10) || 0) + (parseInt(d(b).css("paddingLeft"), 10) || 0) - this.margins.left, a.top + (parseInt(d(b).css("borderTopWidth"),
                    10) || 0) + (parseInt(d(b).css("paddingTop"), 10) || 0) - this.margins.top, a.left + (c ? Math.max(b.scrollWidth, b.offsetWidth) : b.offsetWidth) - (parseInt(d(b).css("borderLeftWidth"), 10) || 0) - (parseInt(d(b).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, a.top + (c ? Math.max(b.scrollHeight, b.offsetHeight) : b.offsetHeight) - (parseInt(d(b).css("borderTopWidth"), 10) || 0) - (parseInt(d(b).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
            }
        },
        _convertPositionTo: function (a, b) {
            if (!b) b =
                this.position;
            a = a == "absolute" ? 1 : -1;
            var c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                e = /(html|body)/i.test(c[0].tagName);
            return {
                top: b.top + this.offset.relative.top * a + this.offset.parent.top * a - (d.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : c.scrollTop()) * a),
                left: b.left + this.offset.relative.left * a + this.offset.parent.left * a - (d.browser.safari &&
                this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : c.scrollLeft()) * a)
            }
        },
        _generatePosition: function (a) {
            var b = this.options,
                c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                e = /(html|body)/i.test(c[0].tagName);
            if (this.cssPosition == "relative" && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) this.offset.relative = this._getRelativeOffset();
            var f = a.pageX, g = a.pageY;
            if (this.originalPosition) {
                if (this.containment) {
                    if (a.pageX - this.offset.click.left < this.containment[0]) f = this.containment[0] + this.offset.click.left;
                    if (a.pageY - this.offset.click.top < this.containment[1]) g = this.containment[1] + this.offset.click.top;
                    if (a.pageX - this.offset.click.left > this.containment[2]) f = this.containment[2] + this.offset.click.left;
                    if (a.pageY - this.offset.click.top > this.containment[3]) g = this.containment[3] + this.offset.click.top
                }
                if (b.grid) {
                    g = this.originalPageY + Math.round((g -
                        this.originalPageY) / b.grid[1]) * b.grid[1];
                    g = this.containment ? !(g - this.offset.click.top < this.containment[1] || g - this.offset.click.top > this.containment[3]) ? g : !(g - this.offset.click.top < this.containment[1]) ? g - b.grid[1] : g + b.grid[1] : g;
                    f = this.originalPageX + Math.round((f - this.originalPageX) / b.grid[0]) * b.grid[0];
                    f = this.containment ? !(f - this.offset.click.left < this.containment[0] || f - this.offset.click.left > this.containment[2]) ? f : !(f - this.offset.click.left < this.containment[0]) ? f - b.grid[0] : f + b.grid[0] : f
                }
            }
            return {
                top: g -
                this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (d.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : c.scrollTop()),
                left: f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (d.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : c.scrollLeft())
            }
        },
        _rearrange: function (a, b, c, e) {
            c ? c[0].appendChild(this.placeholder[0]) : b.item[0].parentNode.insertBefore(this.placeholder[0],
                this.direction == "down" ? b.item[0] : b.item[0].nextSibling);
            this.counter = this.counter ? ++this.counter : 1;
            var f = this, g = this.counter;
            window.setTimeout(function () {
                g == f.counter && f.refreshPositions(!e)
            }, 0)
        },
        _clear: function (a, b) {
            this.reverting = false;
            var c = [];
            !this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem);
            this._noFinalSort = null;
            if (this.helper[0] == this.currentItem[0]) {
                for (var e in this._storedCSS) if (this._storedCSS[e] == "auto" || this._storedCSS[e] == "static") this._storedCSS[e] =
                    "";
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else this.currentItem.show();
            this.fromOutside && !b && c.push(function (f) {
                this._trigger("receive", f, this._uiHash(this.fromOutside))
            });
            if ((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !b) c.push(function (f) {
                this._trigger("update", f, this._uiHash())
            });
            if (!d.ui.contains(this.element[0], this.currentItem[0])) {
                b || c.push(function (f) {
                    this._trigger("remove",
                        f, this._uiHash())
                });
                for (e = this.containers.length - 1; e >= 0; e--) if (d.ui.contains(this.containers[e].element[0], this.currentItem[0]) && !b) {
                    c.push(function (f) {
                        return function (g) {
                            f._trigger("receive", g, this._uiHash(this))
                        }
                    }.call(this, this.containers[e]));
                    c.push(function (f) {
                        return function (g) {
                            f._trigger("update", g, this._uiHash(this))
                        }
                    }.call(this, this.containers[e]))
                }
            }
            for (e = this.containers.length - 1; e >= 0; e--) {
                b || c.push(function (f) {
                    return function (g) {
                        f._trigger("deactivate", g, this._uiHash(this))
                    }
                }.call(this,
                    this.containers[e]));
                if (this.containers[e].containerCache.over) {
                    c.push(function (f) {
                        return function (g) {
                            f._trigger("out", g, this._uiHash(this))
                        }
                    }.call(this, this.containers[e]));
                    this.containers[e].containerCache.over = 0
                }
            }
            this._storedCursor && d("body").css("cursor", this._storedCursor);
            this._storedOpacity && this.helper.css("opacity", this._storedOpacity);
            if (this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex);
            this.dragging = false;
            if (this.cancelHelperRemoval) {
                if (!b) {
                    this._trigger("beforeStop",
                        a, this._uiHash());
                    for (e = 0; e < c.length; e++) c[e].call(this, a);
                    this._trigger("stop", a, this._uiHash())
                }
                return false
            }
            b || this._trigger("beforeStop", a, this._uiHash());
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
            this.helper[0] != this.currentItem[0] && this.helper.remove();
            this.helper = null;
            if (!b) {
                for (e = 0; e < c.length; e++) c[e].call(this, a);
                this._trigger("stop", a, this._uiHash())
            }
            this.fromOutside = false;
            return true
        },
        _trigger: function () {
            d.Widget.prototype._trigger.apply(this, arguments) === false && this.cancel()
        },
        _uiHash: function (a) {
            var b = a || this;
            return {
                helper: b.helper,
                placeholder: b.placeholder || d([]),
                position: b.position,
                originalPosition: b.originalPosition,
                offset: b.positionAbs,
                item: b.currentItem,
                sender: a ? a.element : null
            }
        }
    });
    d.extend(d.ui.sortable, {version: "1.8.16"})
})(jQuery);
;
/*
 * jQuery UI Accordion 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Accordion
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function (c) {
    c.widget("ui.accordion", {
        options: {
            active: 0,
            animated: "slide",
            autoHeight: true,
            clearStyle: false,
            collapsible: false,
            event: "click",
            fillSpace: false,
            header: "> li > :first-child,> :not(li):even",
            icons: {header: "ui-icon-triangle-1-e", headerSelected: "ui-icon-triangle-1-s"},
            navigation: false,
            navigationFilter: function () {
                return this.href.toLowerCase() === location.href.toLowerCase()
            }
        }, _create: function () {
            var a = this, b = a.options;
            a.running = 0;
            a.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix");
            a.headers = a.element.find(b.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion", function () {
                b.disabled || c(this).addClass("ui-state-hover")
            }).bind("mouseleave.accordion", function () {
                b.disabled || c(this).removeClass("ui-state-hover")
            }).bind("focus.accordion", function () {
                b.disabled || c(this).addClass("ui-state-focus")
            }).bind("blur.accordion", function () {
                b.disabled || c(this).removeClass("ui-state-focus")
            });
            a.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");
            if (b.navigation) {
                var d = a.element.find("a").filter(b.navigationFilter).eq(0);
                if (d.length) {
                    var h = d.closest(".ui-accordion-header");
                    a.active = h.length ? h : d.closest(".ui-accordion-content").prev()
                }
            }
            a.active = a._findActive(a.active || b.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");
            a.active.next().addClass("ui-accordion-content-active");
            a._createIcons();
            a.resize();
            a.element.attr("role", "tablist");
            a.headers.attr("role", "tab").bind("keydown.accordion",
                function (f) {
                    return a._keydown(f)
                }).next().attr("role", "tabpanel");
            a.headers.not(a.active || "").attr({
                "aria-expanded": "false",
                "aria-selected": "false",
                tabIndex: -1
            }).next().hide();
            a.active.length ? a.active.attr({
                "aria-expanded": "true",
                "aria-selected": "true",
                tabIndex: 0
            }) : a.headers.eq(0).attr("tabIndex", 0);
            c.browser.safari || a.headers.find("a").attr("tabIndex", -1);
            b.event && a.headers.bind(b.event.split(" ").join(".accordion ") + ".accordion", function (f) {
                a._clickHandler.call(a, f, this);
                f.preventDefault()
            })
        }, _createIcons: function () {
            var a =
                this.options;
            if (a.icons) {
                c("<span></span>").addClass("ui-icon " + a.icons.header).prependTo(this.headers);
                this.active.children(".ui-icon").toggleClass(a.icons.header).toggleClass(a.icons.headerSelected);
                this.element.addClass("ui-accordion-icons")
            }
        }, _destroyIcons: function () {
            this.headers.children(".ui-icon").remove();
            this.element.removeClass("ui-accordion-icons")
        }, destroy: function () {
            var a = this.options;
            this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");
            this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex");
            this.headers.find("a").removeAttr("tabIndex");
            this._destroyIcons();
            var b = this.headers.next().css("display", "").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");
            if (a.autoHeight || a.fillHeight) b.css("height", "");
            return c.Widget.prototype.destroy.call(this)
        }, _setOption: function (a, b) {
            c.Widget.prototype._setOption.apply(this, arguments);
            a == "active" && this.activate(b);
            if (a == "icons") {
                this._destroyIcons();
                b && this._createIcons()
            }
            if (a == "disabled") this.headers.add(this.headers.next())[b ? "addClass" : "removeClass"]("ui-accordion-disabled ui-state-disabled")
        }, _keydown: function (a) {
            if (!(this.options.disabled || a.altKey || a.ctrlKey)) {
                var b = c.ui.keyCode, d = this.headers.length, h = this.headers.index(a.target), f = false;
                switch (a.keyCode) {
                    case b.RIGHT:
                    case b.DOWN:
                        f = this.headers[(h + 1) % d];
                        break;
                    case b.LEFT:
                    case b.UP:
                        f = this.headers[(h - 1 + d) % d];
                        break;
                    case b.SPACE:
                    case b.ENTER:
                        this._clickHandler({target: a.target}, a.target);
                        a.preventDefault()
                }
                if (f) {
                    c(a.target).attr("tabIndex", -1);
                    c(f).attr("tabIndex", 0);
                    f.focus();
                    return false
                }
                return true
            }
        }, resize: function () {
            var a = this.options, b;
            if (a.fillSpace) {
                if (c.browser.msie) {
                    var d = this.element.parent().css("overflow");
                    this.element.parent().css("overflow", "hidden")
                }
                b = this.element.parent().height();
                c.browser.msie && this.element.parent().css("overflow", d);
                this.headers.each(function () {
                    b -= c(this).outerHeight(true)
                });
                this.headers.next().each(function () {
                    c(this).height(Math.max(0, b - c(this).innerHeight() +
                        c(this).height()))
                }).css("overflow", "auto")
            } else if (a.autoHeight) {
                b = 0;
                this.headers.next().each(function () {
                    b = Math.max(b, c(this).height("").height())
                }).height(b)
            }
            return this
        }, activate: function (a) {
            this.options.active = a;
            a = this._findActive(a)[0];
            this._clickHandler({target: a}, a);
            return this
        }, _findActive: function (a) {
            return a ? typeof a === "number" ? this.headers.filter(":eq(" + a + ")") : this.headers.not(this.headers.not(a)) : a === false ? c([]) : this.headers.filter(":eq(0)")
        }, _clickHandler: function (a, b) {
            var d = this.options;
            if (!d.disabled) if (a.target) {
                a = c(a.currentTarget || b);
                b = a[0] === this.active[0];
                d.active = d.collapsible && b ? false : this.headers.index(a);
                if (!(this.running || !d.collapsible && b)) {
                    var h = this.active;
                    j = a.next();
                    g = this.active.next();
                    e = {
                        options: d,
                        newHeader: b && d.collapsible ? c([]) : a,
                        oldHeader: this.active,
                        newContent: b && d.collapsible ? c([]) : j,
                        oldContent: g
                    };
                    var f = this.headers.index(this.active[0]) > this.headers.index(a[0]);
                    this.active = b ? c([]) : a;
                    this._toggle(j, g, e, b, f);
                    h.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header);
                    if (!b) {
                        a.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(d.icons.header).addClass(d.icons.headerSelected);
                        a.next().addClass("ui-accordion-content-active")
                    }
                }
            } else if (d.collapsible) {
                this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header);
                this.active.next().addClass("ui-accordion-content-active");
                var g = this.active.next(),
                    e = {options: d, newHeader: c([]), oldHeader: d.active, newContent: c([]), oldContent: g},
                    j = this.active = c([]);
                this._toggle(j, g, e)
            }
        }, _toggle: function (a, b, d, h, f) {
            var g = this, e = g.options;
            g.toShow = a;
            g.toHide = b;
            g.data = d;
            var j = function () {
                if (g) return g._completed.apply(g, arguments)
            };
            g._trigger("changestart", null, g.data);
            g.running = b.size() === 0 ? a.size() : b.size();
            if (e.animated) {
                d = {};
                d = e.collapsible && h ? {
                    toShow: c([]),
                    toHide: b,
                    complete: j,
                    down: f,
                    autoHeight: e.autoHeight || e.fillSpace
                } : {
                    toShow: a, toHide: b, complete: j, down: f, autoHeight: e.autoHeight ||
                    e.fillSpace
                };
                if (!e.proxied) e.proxied = e.animated;
                if (!e.proxiedDuration) e.proxiedDuration = e.duration;
                e.animated = c.isFunction(e.proxied) ? e.proxied(d) : e.proxied;
                e.duration = c.isFunction(e.proxiedDuration) ? e.proxiedDuration(d) : e.proxiedDuration;
                h = c.ui.accordion.animations;
                var i = e.duration, k = e.animated;
                if (k && !h[k] && !c.easing[k]) k = "slide";
                h[k] || (h[k] = function (l) {
                    this.slide(l, {easing: k, duration: i || 700})
                });
                h[k](d)
            } else {
                if (e.collapsible && h) a.toggle(); else {
                    b.hide();
                    a.show()
                }
                j(true)
            }
            b.prev().attr({
                "aria-expanded": "false",
                "aria-selected": "false", tabIndex: -1
            }).blur();
            a.prev().attr({"aria-expanded": "true", "aria-selected": "true", tabIndex: 0}).focus()
        }, _completed: function (a) {
            this.running = a ? 0 : --this.running;
            if (!this.running) {
                this.options.clearStyle && this.toShow.add(this.toHide).css({height: "", overflow: ""});
                this.toHide.removeClass("ui-accordion-content-active");
                if (this.toHide.length) this.toHide.parent()[0].className = this.toHide.parent()[0].className;
                this._trigger("change", null, this.data)
            }
        }
    });
    c.extend(c.ui.accordion, {
        version: "1.8.16",
        animations: {
            slide: function (a, b) {
                a = c.extend({easing: "swing", duration: 300}, a, b);
                if (a.toHide.size()) if (a.toShow.size()) {
                    var d = a.toShow.css("overflow"), h = 0, f = {}, g = {}, e;
                    b = a.toShow;
                    e = b[0].style.width;
                    b.width(parseInt(b.parent().width(), 10) - parseInt(b.css("paddingLeft"), 10) - parseInt(b.css("paddingRight"), 10) - (parseInt(b.css("borderLeftWidth"), 10) || 0) - (parseInt(b.css("borderRightWidth"), 10) || 0));
                    c.each(["height", "paddingTop", "paddingBottom"], function (j, i) {
                        g[i] = "hide";
                        j = ("" + c.css(a.toShow[0], i)).match(/^([\d+-.]+)(.*)$/);
                        f[i] = {value: j[1], unit: j[2] || "px"}
                    });
                    a.toShow.css({height: 0, overflow: "hidden"}).show();
                    a.toHide.filter(":hidden").each(a.complete).end().filter(":visible").animate(g, {
                        step: function (j, i) {
                            if (i.prop == "height") h = i.end - i.start === 0 ? 0 : (i.now - i.start) / (i.end - i.start);
                            a.toShow[0].style[i.prop] = h * f[i.prop].value + f[i.prop].unit
                        }, duration: a.duration, easing: a.easing, complete: function () {
                            a.autoHeight || a.toShow.css("height", "");
                            a.toShow.css({width: e, overflow: d});
                            a.complete()
                        }
                    })
                } else a.toHide.animate({
                    height: "hide",
                    paddingTop: "hide", paddingBottom: "hide"
                }, a); else a.toShow.animate({height: "show", paddingTop: "show", paddingBottom: "show"}, a)
            }, bounceslide: function (a) {
                this.slide(a, {easing: a.down ? "easeOutBounce" : "swing", duration: a.down ? 1E3 : 200})
            }
        }
    })
})(jQuery);
;
/*
 * jQuery UI Autocomplete 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Autocomplete
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function (d) {
    var e = 0;
    d.widget("ui.autocomplete", {
        options: {
            appendTo: "body",
            autoFocus: false,
            delay: 300,
            minLength: 1,
            position: {my: "left top", at: "left bottom", collision: "none"},
            source: null
        }, pending: 0, _create: function () {
            var a = this, b = this.element[0].ownerDocument, g;
            this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off").attr({
                role: "textbox",
                "aria-autocomplete": "list",
                "aria-haspopup": "true"
            }).bind("keydown.autocomplete", function (c) {
                if (!(a.options.disabled || a.element.propAttr("readOnly"))) {
                    g =
                        false;
                    var f = d.ui.keyCode;
                    switch (c.keyCode) {
                        case f.PAGE_UP:
                            a._move("previousPage", c);
                            break;
                        case f.PAGE_DOWN:
                            a._move("nextPage", c);
                            break;
                        case f.UP:
                            a._move("previous", c);
                            c.preventDefault();
                            break;
                        case f.DOWN:
                            a._move("next", c);
                            c.preventDefault();
                            break;
                        case f.ENTER:
                        case f.NUMPAD_ENTER:
                            if (a.menu.active) {
                                g = true;
                                c.preventDefault()
                            }
                        case f.TAB:
                            if (!a.menu.active) return;
                            a.menu.select(c);
                            break;
                        case f.ESCAPE:
                            a.element.val(a.term);
                            a.close(c);
                            break;
                        default:
                            clearTimeout(a.searching);
                            a.searching = setTimeout(function () {
                                if (a.term !=
                                    a.element.val()) {
                                    a.selectedItem = null;
                                    a.search(null, c)
                                }
                            }, a.options.delay);
                            break
                    }
                }
            }).bind("keypress.autocomplete", function (c) {
                if (g) {
                    g = false;
                    c.preventDefault()
                }
            }).bind("focus.autocomplete", function () {
                if (!a.options.disabled) {
                    a.selectedItem = null;
                    a.previous = a.element.val()
                }
            }).bind("blur.autocomplete", function (c) {
                if (!a.options.disabled) {
                    clearTimeout(a.searching);
                    a.closing = setTimeout(function () {
                        a.close(c);
                        a._change(c)
                    }, 150)
                }
            });
            this._initSource();
            this.response = function () {
                return a._response.apply(a, arguments)
            };
            this.menu = d("<ul></ul>").addClass("ui-autocomplete").appendTo(d(this.options.appendTo || "body", b)[0]).mousedown(function (c) {
                var f = a.menu.element[0];
                d(c.target).closest(".ui-menu-item").length || setTimeout(function () {
                    d(document).one("mousedown", function (h) {
                        h.target !== a.element[0] && h.target !== f && !d.ui.contains(f, h.target) && a.close()
                    })
                }, 1);
                setTimeout(function () {
                    clearTimeout(a.closing)
                }, 13)
            }).menu({
                focus: function (c, f) {
                    f = f.item.data("item.autocomplete");
                    false !== a._trigger("focus", c, {item: f}) && /^key/.test(c.originalEvent.type) &&
                    a.element.val(f.value)
                }, selected: function (c, f) {
                    var h = f.item.data("item.autocomplete"), i = a.previous;
                    if (a.element[0] !== b.activeElement) {
                        a.element.focus();
                        a.previous = i;
                        setTimeout(function () {
                            a.previous = i;
                            a.selectedItem = h
                        }, 1)
                    }
                    false !== a._trigger("select", c, {item: h}) && a.element.val(h.value);
                    a.term = a.element.val();
                    a.close(c);
                    a.selectedItem = h
                }, blur: function () {
                    a.menu.element.is(":visible") && a.element.val() !== a.term && a.element.val(a.term)
                }
            }).zIndex(this.element.zIndex() + 1).css({top: 0, left: 0}).hide().data("menu");
            d.fn.bgiframe && this.menu.element.bgiframe()
        }, destroy: function () {
            this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
            this.menu.element.remove();
            d.Widget.prototype.destroy.call(this)
        }, _setOption: function (a, b) {
            d.Widget.prototype._setOption.apply(this, arguments);
            a === "source" && this._initSource();
            if (a === "appendTo") this.menu.element.appendTo(d(b || "body", this.element[0].ownerDocument)[0]);
            a === "disabled" &&
            b && this.xhr && this.xhr.abort()
        }, _initSource: function () {
            var a = this, b, g;
            if (d.isArray(this.options.source)) {
                b = this.options.source;
                this.source = function (c, f) {
                    f(d.ui.autocomplete.filter(b, c.term))
                }
            } else if (typeof this.options.source === "string") {
                g = this.options.source;
                this.source = function (c, f) {
                    a.xhr && a.xhr.abort();
                    a.xhr = d.ajax({
                        url: g, data: c, dataType: "json", autocompleteRequest: ++e, success: function (h) {
                            this.autocompleteRequest === e && f(h)
                        }, error: function () {
                            this.autocompleteRequest === e && f([])
                        }
                    })
                }
            } else this.source =
                this.options.source
        }, search: function (a, b) {
            a = a != null ? a : this.element.val();
            this.term = this.element.val();
            if (a.length < this.options.minLength) return this.close(b);
            clearTimeout(this.closing);
            if (this._trigger("search", b) !== false) return this._search(a)
        }, _search: function (a) {
            this.pending++;
            this.element.addClass("ui-autocomplete-loading");
            this.source({term: a}, this.response)
        }, _response: function (a) {
            if (!this.options.disabled && a && a.length) {
                a = this._normalize(a);
                this._suggest(a);
                this._trigger("open")
            } else this.close();
            this.pending--;
            this.pending || this.element.removeClass("ui-autocomplete-loading")
        }, close: function (a) {
            clearTimeout(this.closing);
            if (this.menu.element.is(":visible")) {
                this.menu.element.hide();
                this.menu.deactivate();
                this._trigger("close", a)
            }
        }, _change: function (a) {
            this.previous !== this.element.val() && this._trigger("change", a, {item: this.selectedItem})
        }, _normalize: function (a) {
            if (a.length && a[0].label && a[0].value) return a;
            return d.map(a, function (b) {
                if (typeof b === "string") return {label: b, value: b};
                return d.extend({
                    label: b.label ||
                    b.value, value: b.value || b.label
                }, b)
            })
        }, _suggest: function (a) {
            var b = this.menu.element.empty().zIndex(this.element.zIndex() + 1);
            this._renderMenu(b, a);
            this.menu.deactivate();
            this.menu.refresh();
            b.show();
            this._resizeMenu();
            b.position(d.extend({of: this.element}, this.options.position));
            this.options.autoFocus && this.menu.next(new d.Event("mouseover"))
        }, _resizeMenu: function () {
            var a = this.menu.element;
            a.outerWidth(Math.max(a.width("").outerWidth(), this.element.outerWidth()))
        }, _renderMenu: function (a, b) {
            var g = this;
            d.each(b, function (c, f) {
                g._renderItem(a, f)
            })
        }, _renderItem: function (a, b) {
            return d("<li></li>").data("item.autocomplete", b).append(d("<a></a>").text(b.label)).appendTo(a)
        }, _move: function (a, b) {
            if (this.menu.element.is(":visible")) if (this.menu.first() && /^previous/.test(a) || this.menu.last() && /^next/.test(a)) {
                this.element.val(this.term);
                this.menu.deactivate()
            } else this.menu[a](b); else this.search(null, b)
        }, widget: function () {
            return this.menu.element
        }
    });
    d.extend(d.ui.autocomplete, {
        escapeRegex: function (a) {
            return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,
                "\\$&")
        }, filter: function (a, b) {
            var g = new RegExp(d.ui.autocomplete.escapeRegex(b), "i");
            return d.grep(a, function (c) {
                return g.test(c.label || c.value || c)
            })
        }
    })
})(jQuery);
(function (d) {
    d.widget("ui.menu", {
        _create: function () {
            var e = this;
            this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({
                role: "listbox",
                "aria-activedescendant": "ui-active-menuitem"
            }).click(function (a) {
                if (d(a.target).closest(".ui-menu-item a").length) {
                    a.preventDefault();
                    e.select(a)
                }
            });
            this.refresh()
        }, refresh: function () {
            var e = this;
            this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem").children("a").addClass("ui-corner-all").attr("tabindex",
                -1).mouseenter(function (a) {
                e.activate(a, d(this).parent())
            }).mouseleave(function () {
                e.deactivate()
            })
        }, activate: function (e, a) {
            this.deactivate();
            if (this.hasScroll()) {
                var b = a.offset().top - this.element.offset().top, g = this.element.scrollTop(),
                    c = this.element.height();
                if (b < 0) this.element.scrollTop(g + b); else b >= c && this.element.scrollTop(g + b - c + a.height())
            }
            this.active = a.eq(0).children("a").addClass("ui-state-hover").attr("id", "ui-active-menuitem").end();
            this._trigger("focus", e, {item: a})
        }, deactivate: function () {
            if (this.active) {
                this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
                this._trigger("blur");
                this.active = null
            }
        }, next: function (e) {
            this.move("next", ".ui-menu-item:first", e)
        }, previous: function (e) {
            this.move("prev", ".ui-menu-item:last", e)
        }, first: function () {
            return this.active && !this.active.prevAll(".ui-menu-item").length
        }, last: function () {
            return this.active && !this.active.nextAll(".ui-menu-item").length
        }, move: function (e, a, b) {
            if (this.active) {
                e = this.active[e + "All"](".ui-menu-item").eq(0);
                e.length ? this.activate(b, e) : this.activate(b, this.element.children(a))
            } else this.activate(b,
                this.element.children(a))
        }, nextPage: function (e) {
            if (this.hasScroll()) if (!this.active || this.last()) this.activate(e, this.element.children(".ui-menu-item:first")); else {
                var a = this.active.offset().top, b = this.element.height(),
                    g = this.element.children(".ui-menu-item").filter(function () {
                        var c = d(this).offset().top - a - b + d(this).height();
                        return c < 10 && c > -10
                    });
                g.length || (g = this.element.children(".ui-menu-item:last"));
                this.activate(e, g)
            } else this.activate(e, this.element.children(".ui-menu-item").filter(!this.active ||
            this.last() ? ":first" : ":last"))
        }, previousPage: function (e) {
            if (this.hasScroll()) if (!this.active || this.first()) this.activate(e, this.element.children(".ui-menu-item:last")); else {
                var a = this.active.offset().top, b = this.element.height();
                result = this.element.children(".ui-menu-item").filter(function () {
                    var g = d(this).offset().top - a + b - d(this).height();
                    return g < 10 && g > -10
                });
                result.length || (result = this.element.children(".ui-menu-item:first"));
                this.activate(e, result)
            } else this.activate(e, this.element.children(".ui-menu-item").filter(!this.active ||
            this.first() ? ":last" : ":first"))
        }, hasScroll: function () {
            return this.element.height() < this.element[d.fn.prop ? "prop" : "attr"]("scrollHeight")
        }, select: function (e) {
            this._trigger("selected", e, {item: this.active})
        }
    })
})(jQuery);
;
/*
 * jQuery UI Button 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function (b) {
    var h, i, j, g, l = function () {
        var a = b(this).find(":ui-button");
        setTimeout(function () {
            a.button("refresh")
        }, 1)
    }, k = function (a) {
        var c = a.name, e = a.form, f = b([]);
        if (c) f = e ? b(e).find("[name='" + c + "']") : b("[name='" + c + "']", a.ownerDocument).filter(function () {
            return !this.form
        });
        return f
    };
    b.widget("ui.button", {
        options: {disabled: null, text: true, label: null, icons: {primary: null, secondary: null}},
        _create: function () {
            this.element.closest("form").unbind("reset.button").bind("reset.button", l);
            if (typeof this.options.disabled !==
                "boolean") this.options.disabled = this.element.propAttr("disabled");
            this._determineButtonType();
            this.hasTitle = !!this.buttonElement.attr("title");
            var a = this, c = this.options, e = this.type === "checkbox" || this.type === "radio",
                f = "ui-state-hover" + (!e ? " ui-state-active" : "");
            if (c.label === null) c.label = this.buttonElement.html();
            if (this.element.is(":disabled")) c.disabled = true;
            this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role", "button").bind("mouseenter.button", function () {
                if (!c.disabled) {
                    b(this).addClass("ui-state-hover");
                    this === h && b(this).addClass("ui-state-active")
                }
            }).bind("mouseleave.button", function () {
                c.disabled || b(this).removeClass(f)
            }).bind("click.button", function (d) {
                if (c.disabled) {
                    d.preventDefault();
                    d.stopImmediatePropagation()
                }
            });
            this.element.bind("focus.button", function () {
                a.buttonElement.addClass("ui-state-focus")
            }).bind("blur.button", function () {
                a.buttonElement.removeClass("ui-state-focus")
            });
            if (e) {
                this.element.bind("change.button", function () {
                    g || a.refresh()
                });
                this.buttonElement.bind("mousedown.button", function (d) {
                    if (!c.disabled) {
                        g =
                            false;
                        i = d.pageX;
                        j = d.pageY
                    }
                }).bind("mouseup.button", function (d) {
                    if (!c.disabled) if (i !== d.pageX || j !== d.pageY) g = true
                })
            }
            if (this.type === "checkbox") this.buttonElement.bind("click.button", function () {
                if (c.disabled || g) return false;
                b(this).toggleClass("ui-state-active");
                a.buttonElement.attr("aria-pressed", a.element[0].checked)
            }); else if (this.type === "radio") this.buttonElement.bind("click.button", function () {
                if (c.disabled || g) return false;
                b(this).addClass("ui-state-active");
                a.buttonElement.attr("aria-pressed", "true");
                var d = a.element[0];
                k(d).not(d).map(function () {
                    return b(this).button("widget")[0]
                }).removeClass("ui-state-active").attr("aria-pressed", "false")
            }); else {
                this.buttonElement.bind("mousedown.button", function () {
                    if (c.disabled) return false;
                    b(this).addClass("ui-state-active");
                    h = this;
                    b(document).one("mouseup", function () {
                        h = null
                    })
                }).bind("mouseup.button", function () {
                    if (c.disabled) return false;
                    b(this).removeClass("ui-state-active")
                }).bind("keydown.button", function (d) {
                    if (c.disabled) return false;
                    if (d.keyCode == b.ui.keyCode.SPACE ||
                        d.keyCode == b.ui.keyCode.ENTER) b(this).addClass("ui-state-active")
                }).bind("keyup.button", function () {
                    b(this).removeClass("ui-state-active")
                });
                this.buttonElement.is("a") && this.buttonElement.keyup(function (d) {
                    d.keyCode === b.ui.keyCode.SPACE && b(this).click()
                })
            }
            this._setOption("disabled", c.disabled);
            this._resetButton()
        },
        _determineButtonType: function () {
            this.type = this.element.is(":checkbox") ? "checkbox" : this.element.is(":radio") ? "radio" : this.element.is("input") ? "input" : "button";
            if (this.type === "checkbox" || this.type ===
                "radio") {
                var a = this.element.parents().filter(":last"), c = "label[for='" + this.element.attr("id") + "']";
                this.buttonElement = a.find(c);
                if (!this.buttonElement.length) {
                    a = a.length ? a.siblings() : this.element.siblings();
                    this.buttonElement = a.filter(c);
                    if (!this.buttonElement.length) this.buttonElement = a.find(c)
                }
                this.element.addClass("ui-helper-hidden-accessible");
                (a = this.element.is(":checked")) && this.buttonElement.addClass("ui-state-active");
                this.buttonElement.attr("aria-pressed", a)
            } else this.buttonElement = this.element
        },
        widget: function () {
            return this.buttonElement
        },
        destroy: function () {
            this.element.removeClass("ui-helper-hidden-accessible");
            this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
            this.hasTitle || this.buttonElement.removeAttr("title");
            b.Widget.prototype.destroy.call(this)
        },
        _setOption: function (a, c) {
            b.Widget.prototype._setOption.apply(this, arguments);
            if (a === "disabled") c ? this.element.propAttr("disabled", true) : this.element.propAttr("disabled", false); else this._resetButton()
        },
        refresh: function () {
            var a = this.element.is(":disabled");
            a !== this.options.disabled && this._setOption("disabled", a);
            if (this.type === "radio") k(this.element[0]).each(function () {
                b(this).is(":checked") ? b(this).button("widget").addClass("ui-state-active").attr("aria-pressed",
                    "true") : b(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false")
            }); else if (this.type === "checkbox") this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false")
        },
        _resetButton: function () {
            if (this.type === "input") this.options.label && this.element.val(this.options.label); else {
                var a = this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),
                    c = b("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(a.empty()).text(),
                    e = this.options.icons, f = e.primary && e.secondary, d = [];
                if (e.primary || e.secondary) {
                    if (this.options.text) d.push("ui-button-text-icon" + (f ? "s" : e.primary ? "-primary" : "-secondary"));
                    e.primary && a.prepend("<span class='ui-button-icon-primary ui-icon " + e.primary + "'></span>");
                    e.secondary && a.append("<span class='ui-button-icon-secondary ui-icon " + e.secondary + "'></span>");
                    if (!this.options.text) {
                        d.push(f ? "ui-button-icons-only" :
                            "ui-button-icon-only");
                        this.hasTitle || a.attr("title", c)
                    }
                } else d.push("ui-button-text-only");
                a.addClass(d.join(" "))
            }
        }
    });
    b.widget("ui.buttonset", {
        options: {items: ":button, :submit, :reset, :checkbox, :radio, a, :data(button)"}, _create: function () {
            this.element.addClass("ui-buttonset")
        }, _init: function () {
            this.refresh()
        }, _setOption: function (a, c) {
            a === "disabled" && this.buttons.button("option", a, c);
            b.Widget.prototype._setOption.apply(this, arguments)
        }, refresh: function () {
            var a = this.element.css("direction") ===
                "ltr";
            this.buttons = this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function () {
                return b(this).button("widget")[0]
            }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(a ? "ui-corner-left" : "ui-corner-right").end().filter(":last").addClass(a ? "ui-corner-right" : "ui-corner-left").end().end()
        }, destroy: function () {
            this.element.removeClass("ui-buttonset");
            this.buttons.map(function () {
                return b(this).button("widget")[0]
            }).removeClass("ui-corner-left ui-corner-right").end().button("destroy");
            b.Widget.prototype.destroy.call(this)
        }
    })
})(jQuery);
;
/*
 * jQuery UI Dialog 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 */
(function (c, l) {
    var m = {
        buttons: true,
        height: true,
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true,
        width: true
    }, n = {maxHeight: true, maxWidth: true, minHeight: true, minWidth: true}, o = c.attrFn || {
        val: true,
        css: true,
        html: true,
        text: true,
        data: true,
        width: true,
        height: true,
        offset: true,
        click: true
    };
    c.widget("ui.dialog", {
        options: {
            autoOpen: true,
            buttons: {},
            closeOnEscape: true,
            closeText: "close",
            dialogClass: "",
            draggable: true,
            hide: null,
            height: "auto",
            maxHeight: false,
            maxWidth: false,
            minHeight: 150,
            minWidth: 150,
            modal: false,
            position: {
                my: "center", at: "center", collision: "fit", using: function (a) {
                    var b = c(this).css(a).offset().top;
                    b < 0 && c(this).css("top", a.top - b)
                }
            },
            resizable: true,
            show: null,
            stack: true,
            title: "",
            width: 300,
            zIndex: 1E3
        }, _create: function () {
            this.originalTitle = this.element.attr("title");
            if (typeof this.originalTitle !== "string") this.originalTitle = "";
            this.options.title = this.options.title || this.originalTitle;
            var a = this, b = a.options, d = b.title || "&#160;", e = c.ui.dialog.getTitleId(a.element),
                g = (a.uiDialog = c("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all " +
                    b.dialogClass).css({zIndex: b.zIndex}).attr("tabIndex", -1).css("outline", 0).keydown(function (i) {
                    if (b.closeOnEscape && !i.isDefaultPrevented() && i.keyCode && i.keyCode === c.ui.keyCode.ESCAPE) {
                        a.close(i);
                        i.preventDefault()
                    }
                }).attr({role: "dialog", "aria-labelledby": e}).mousedown(function (i) {
                    a.moveToTop(false, i)
                });
            a.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g);
            var f = (a.uiDialogTitlebar = c("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g),
                h = c('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role", "button").hover(function () {
                    h.addClass("ui-state-hover")
                }, function () {
                    h.removeClass("ui-state-hover")
                }).focus(function () {
                    h.addClass("ui-state-focus")
                }).blur(function () {
                    h.removeClass("ui-state-focus")
                }).click(function (i) {
                    a.close(i);
                    return false
                }).appendTo(f);
            (a.uiDialogTitlebarCloseText = c("<span></span>")).addClass("ui-icon ui-icon-closethick").text(b.closeText).appendTo(h);
            c("<span></span>").addClass("ui-dialog-title").attr("id",
                e).html(d).prependTo(f);
            if (c.isFunction(b.beforeclose) && !c.isFunction(b.beforeClose)) b.beforeClose = b.beforeclose;
            f.find("*").add(f).disableSelection();
            b.draggable && c.fn.draggable && a._makeDraggable();
            b.resizable && c.fn.resizable && a._makeResizable();
            a._createButtons(b.buttons);
            a._isOpen = false;
            c.fn.bgiframe && g.bgiframe()
        }, _init: function () {
            this.options.autoOpen && this.open()
        }, destroy: function () {
            var a = this;
            a.overlay && a.overlay.destroy();
            a.uiDialog.hide();
            a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");
            a.uiDialog.remove();
            a.originalTitle && a.element.attr("title", a.originalTitle);
            return a
        }, widget: function () {
            return this.uiDialog
        }, close: function (a) {
            var b = this, d, e;
            if (false !== b._trigger("beforeClose", a)) {
                b.overlay && b.overlay.destroy();
                b.uiDialog.unbind("keypress.ui-dialog");
                b._isOpen = false;
                if (b.options.hide) b.uiDialog.hide(b.options.hide, function () {
                    b._trigger("close", a)
                }); else {
                    b.uiDialog.hide();
                    b._trigger("close", a)
                }
                c.ui.dialog.overlay.resize();
                if (b.options.modal) {
                    d = 0;
                    c(".ui-dialog").each(function () {
                        if (this !==
                            b.uiDialog[0]) {
                            e = c(this).css("z-index");
                            isNaN(e) || (d = Math.max(d, e))
                        }
                    });
                    c.ui.dialog.maxZ = d
                }
                return b
            }
        }, isOpen: function () {
            return this._isOpen
        }, moveToTop: function (a, b) {
            var d = this, e = d.options;
            if (e.modal && !a || !e.stack && !e.modal) return d._trigger("focus", b);
            if (e.zIndex > c.ui.dialog.maxZ) c.ui.dialog.maxZ = e.zIndex;
            if (d.overlay) {
                c.ui.dialog.maxZ += 1;
                d.overlay.$el.css("z-index", c.ui.dialog.overlay.maxZ = c.ui.dialog.maxZ)
            }
            a = {scrollTop: d.element.scrollTop(), scrollLeft: d.element.scrollLeft()};
            c.ui.dialog.maxZ += 1;
            d.uiDialog.css("z-index", c.ui.dialog.maxZ);
            d.element.attr(a);
            d._trigger("focus", b);
            return d
        }, open: function () {
            if (!this._isOpen) {
                var a = this, b = a.options, d = a.uiDialog;
                a.overlay = b.modal ? new c.ui.dialog.overlay(a) : null;
                a._size();
                a._position(b.position);
                d.show(b.show);
                a.moveToTop(true);
                b.modal && d.bind("keypress.ui-dialog", function (e) {
                    if (e.keyCode === c.ui.keyCode.TAB) {
                        var g = c(":tabbable", this), f = g.filter(":first");
                        g = g.filter(":last");
                        if (e.target === g[0] && !e.shiftKey) {
                            f.focus(1);
                            return false
                        } else if (e.target ===
                            f[0] && e.shiftKey) {
                            g.focus(1);
                            return false
                        }
                    }
                });
                c(a.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus();
                a._isOpen = true;
                a._trigger("open");
                return a
            }
        }, _createButtons: function (a) {
            var b = this, d = false,
                e = c("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),
                g = c("<div></div>").addClass("ui-dialog-buttonset").appendTo(e);
            b.uiDialog.find(".ui-dialog-buttonpane").remove();
            typeof a === "object" && a !== null && c.each(a,
                function () {
                    return !(d = true)
                });
            if (d) {
                c.each(a, function (f, h) {
                    h = c.isFunction(h) ? {click: h, text: f} : h;
                    var i = c('<button type="button"></button>').click(function () {
                        h.click.apply(b.element[0], arguments)
                    }).appendTo(g);
                    c.each(h, function (j, k) {
                        if (j !== "click") j in o ? i[j](k) : i.attr(j, k)
                    });
                    c.fn.button && i.button()
                });
                e.appendTo(b.uiDialog)
            }
        }, _makeDraggable: function () {
            function a(f) {
                return {position: f.position, offset: f.offset}
            }

            var b = this, d = b.options, e = c(document), g;
            b.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar", containment: "document", start: function (f, h) {
                    g = d.height === "auto" ? "auto" : c(this).height();
                    c(this).height(c(this).height()).addClass("ui-dialog-dragging");
                    b._trigger("dragStart", f, a(h))
                }, drag: function (f, h) {
                    b._trigger("drag", f, a(h))
                }, stop: function (f, h) {
                    d.position = [h.position.left - e.scrollLeft(), h.position.top - e.scrollTop()];
                    c(this).removeClass("ui-dialog-dragging").height(g);
                    b._trigger("dragStop", f, a(h));
                    c.ui.dialog.overlay.resize()
                }
            })
        }, _makeResizable: function (a) {
            function b(f) {
                return {
                    originalPosition: f.originalPosition,
                    originalSize: f.originalSize, position: f.position, size: f.size
                }
            }

            a = a === l ? this.options.resizable : a;
            var d = this, e = d.options, g = d.uiDialog.css("position");
            a = typeof a === "string" ? a : "n,e,s,w,se,sw,ne,nw";
            d.uiDialog.resizable({
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: d.element,
                maxWidth: e.maxWidth,
                maxHeight: e.maxHeight,
                minWidth: e.minWidth,
                minHeight: d._minHeight(),
                handles: a,
                start: function (f, h) {
                    c(this).addClass("ui-dialog-resizing");
                    d._trigger("resizeStart", f, b(h))
                },
                resize: function (f, h) {
                    d._trigger("resize",
                        f, b(h))
                },
                stop: function (f, h) {
                    c(this).removeClass("ui-dialog-resizing");
                    e.height = c(this).height();
                    e.width = c(this).width();
                    d._trigger("resizeStop", f, b(h));
                    c.ui.dialog.overlay.resize()
                }
            }).css("position", g).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")
        }, _minHeight: function () {
            var a = this.options;
            return a.height === "auto" ? a.minHeight : Math.min(a.minHeight, a.height)
        }, _position: function (a) {
            var b = [], d = [0, 0], e;
            if (a) {
                if (typeof a === "string" || typeof a === "object" && "0" in a) {
                    b = a.split ? a.split(" ") :
                        [a[0], a[1]];
                    if (b.length === 1) b[1] = b[0];
                    c.each(["left", "top"], function (g, f) {
                        if (+b[g] === b[g]) {
                            d[g] = b[g];
                            b[g] = f
                        }
                    });
                    a = {my: b.join(" "), at: b.join(" "), offset: d.join(" ")}
                }
                a = c.extend({}, c.ui.dialog.prototype.options.position, a)
            } else a = c.ui.dialog.prototype.options.position;
            (e = this.uiDialog.is(":visible")) || this.uiDialog.show();
            this.uiDialog.css({top: 0, left: 0}).position(c.extend({of: window}, a));
            e || this.uiDialog.hide()
        }, _setOptions: function (a) {
            var b = this, d = {}, e = false;
            c.each(a, function (g, f) {
                b._setOption(g, f);
                if (g in m) e = true;
                if (g in n) d[g] = f
            });
            e && this._size();
            this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", d)
        }, _setOption: function (a, b) {
            var d = this, e = d.uiDialog;
            switch (a) {
                case "beforeclose":
                    a = "beforeClose";
                    break;
                case "buttons":
                    d._createButtons(b);
                    break;
                case "closeText":
                    d.uiDialogTitlebarCloseText.text("" + b);
                    break;
                case "dialogClass":
                    e.removeClass(d.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all " + b);
                    break;
                case "disabled":
                    b ? e.addClass("ui-dialog-disabled") :
                        e.removeClass("ui-dialog-disabled");
                    break;
                case "draggable":
                    var g = e.is(":data(draggable)");
                    g && !b && e.draggable("destroy");
                    !g && b && d._makeDraggable();
                    break;
                case "position":
                    d._position(b);
                    break;
                case "resizable":
                    (g = e.is(":data(resizable)")) && !b && e.resizable("destroy");
                    g && typeof b === "string" && e.resizable("option", "handles", b);
                    !g && b !== false && d._makeResizable(b);
                    break;
                case "title":
                    c(".ui-dialog-title", d.uiDialogTitlebar).html("" + (b || "&#160;"));
                    break
            }
            c.Widget.prototype._setOption.apply(d, arguments)
        }, _size: function () {
            var a =
                this.options, b, d, e = this.uiDialog.is(":visible");
            this.element.show().css({width: "auto", minHeight: 0, height: 0});
            if (a.minWidth > a.width) a.width = a.minWidth;
            b = this.uiDialog.css({height: "auto", width: a.width}).height();
            d = Math.max(0, a.minHeight - b);
            if (a.height === "auto") if (c.support.minHeight) this.element.css({minHeight: d, height: "auto"}); else {
                this.uiDialog.show();
                a = this.element.css("height", "auto").height();
                e || this.uiDialog.hide();
                this.element.height(Math.max(a, d))
            } else this.element.height(Math.max(a.height -
                b, 0));
            this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
        }
    });
    c.extend(c.ui.dialog, {
        version: "1.8.16", uuid: 0, maxZ: 0, getTitleId: function (a) {
            a = a.attr("id");
            if (!a) {
                this.uuid += 1;
                a = this.uuid
            }
            return "ui-dialog-title-" + a
        }, overlay: function (a) {
            this.$el = c.ui.dialog.overlay.create(a)
        }
    });
    c.extend(c.ui.dialog.overlay, {
        instances: [],
        oldInstances: [],
        maxZ: 0,
        events: c.map("focus,mousedown,mouseup,keydown,keypress,click".split(","), function (a) {
            return a + ".dialog-overlay"
        }).join(" "),
        create: function (a) {
            if (this.instances.length === 0) {
                setTimeout(function () {
                    c.ui.dialog.overlay.instances.length && c(document).bind(c.ui.dialog.overlay.events, function (d) {
                        if (c(d.target).zIndex() < c.ui.dialog.overlay.maxZ) return false
                    })
                }, 1);
                c(document).bind("keydown.dialog-overlay", function (d) {
                    if (a.options.closeOnEscape && !d.isDefaultPrevented() && d.keyCode && d.keyCode === c.ui.keyCode.ESCAPE) {
                        a.close(d);
                        d.preventDefault()
                    }
                });
                c(window).bind("resize.dialog-overlay", c.ui.dialog.overlay.resize)
            }
            var b = (this.oldInstances.pop() ||
                c("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({
                width: this.width(),
                height: this.height()
            });
            c.fn.bgiframe && b.bgiframe();
            this.instances.push(b);
            return b
        },
        destroy: function (a) {
            var b = c.inArray(a, this.instances);
            b != -1 && this.oldInstances.push(this.instances.splice(b, 1)[0]);
            this.instances.length === 0 && c([document, window]).unbind(".dialog-overlay");
            a.remove();
            var d = 0;
            c.each(this.instances, function () {
                d = Math.max(d, this.css("z-index"))
            });
            this.maxZ = d
        },
        height: function () {
            var a, b;
            if (c.browser.msie &&
                c.browser.version < 7) {
                a = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                b = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);
                return a < b ? c(window).height() + "px" : a + "px"
            } else return c(document).height() + "px"
        },
        width: function () {
            var a, b;
            if (c.browser.msie) {
                a = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
                b = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
                return a < b ? c(window).width() + "px" : a + "px"
            } else return c(document).width() +
                "px"
        },
        resize: function () {
            var a = c([]);
            c.each(c.ui.dialog.overlay.instances, function () {
                a = a.add(this)
            });
            a.css({width: 0, height: 0}).css({width: c.ui.dialog.overlay.width(), height: c.ui.dialog.overlay.height()})
        }
    });
    c.extend(c.ui.dialog.overlay.prototype, {
        destroy: function () {
            c.ui.dialog.overlay.destroy(this.$el)
        }
    })
})(jQuery);
;
/*
 * jQuery UI Slider 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function (d) {
    d.widget("ui.slider", d.ui.mouse, {
        widgetEventPrefix: "slide",
        options: {
            animate: false,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: false,
            step: 1,
            value: 0,
            values: null
        },
        _create: function () {
            var a = this, b = this.options,
                c = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
                f = b.values && b.values.length || 1, e = [];
            this._mouseSliding = this._keySliding = false;
            this._animateOff = true;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this.element.addClass("ui-slider ui-slider-" +
                this.orientation + " ui-widget ui-widget-content ui-corner-all" + (b.disabled ? " ui-slider-disabled ui-disabled" : ""));
            this.range = d([]);
            if (b.range) {
                if (b.range === true) {
                    if (!b.values) b.values = [this._valueMin(), this._valueMin()];
                    if (b.values.length && b.values.length !== 2) b.values = [b.values[0], b.values[0]]
                }
                this.range = d("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header" + (b.range === "min" || b.range === "max" ? " ui-slider-range-" + b.range : ""))
            }
            for (var j = c.length; j < f; j += 1) e.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>");
            this.handles = c.add(d(e.join("")).appendTo(a.element));
            this.handle = this.handles.eq(0);
            this.handles.add(this.range).filter("a").click(function (g) {
                g.preventDefault()
            }).hover(function () {
                b.disabled || d(this).addClass("ui-state-hover")
            }, function () {
                d(this).removeClass("ui-state-hover")
            }).focus(function () {
                if (b.disabled) d(this).blur(); else {
                    d(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
                    d(this).addClass("ui-state-focus")
                }
            }).blur(function () {
                d(this).removeClass("ui-state-focus")
            });
            this.handles.each(function (g) {
                d(this).data("index.ui-slider-handle",
                    g)
            });
            this.handles.keydown(function (g) {
                var k = true, l = d(this).data("index.ui-slider-handle"), i, h, m;
                if (!a.options.disabled) {
                    switch (g.keyCode) {
                        case d.ui.keyCode.HOME:
                        case d.ui.keyCode.END:
                        case d.ui.keyCode.PAGE_UP:
                        case d.ui.keyCode.PAGE_DOWN:
                        case d.ui.keyCode.UP:
                        case d.ui.keyCode.RIGHT:
                        case d.ui.keyCode.DOWN:
                        case d.ui.keyCode.LEFT:
                            k = false;
                            if (!a._keySliding) {
                                a._keySliding = true;
                                d(this).addClass("ui-state-active");
                                i = a._start(g, l);
                                if (i === false) return
                            }
                            break
                    }
                    m = a.options.step;
                    i = a.options.values && a.options.values.length ?
                        (h = a.values(l)) : (h = a.value());
                    switch (g.keyCode) {
                        case d.ui.keyCode.HOME:
                            h = a._valueMin();
                            break;
                        case d.ui.keyCode.END:
                            h = a._valueMax();
                            break;
                        case d.ui.keyCode.PAGE_UP:
                            h = a._trimAlignValue(i + (a._valueMax() - a._valueMin()) / 5);
                            break;
                        case d.ui.keyCode.PAGE_DOWN:
                            h = a._trimAlignValue(i - (a._valueMax() - a._valueMin()) / 5);
                            break;
                        case d.ui.keyCode.UP:
                        case d.ui.keyCode.RIGHT:
                            if (i === a._valueMax()) return;
                            h = a._trimAlignValue(i + m);
                            break;
                        case d.ui.keyCode.DOWN:
                        case d.ui.keyCode.LEFT:
                            if (i === a._valueMin()) return;
                            h = a._trimAlignValue(i -
                                m);
                            break
                    }
                    a._slide(g, l, h);
                    return k
                }
            }).keyup(function (g) {
                var k = d(this).data("index.ui-slider-handle");
                if (a._keySliding) {
                    a._keySliding = false;
                    a._stop(g, k);
                    a._change(g, k);
                    d(this).removeClass("ui-state-active")
                }
            });
            this._refreshValue();
            this._animateOff = false
        },
        destroy: function () {
            this.handles.remove();
            this.range.remove();
            this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
            this._mouseDestroy();
            return this
        },
        _mouseCapture: function (a) {
            var b = this.options, c, f, e, j, g;
            if (b.disabled) return false;
            this.elementSize = {width: this.element.outerWidth(), height: this.element.outerHeight()};
            this.elementOffset = this.element.offset();
            c = this._normValueFromMouse({x: a.pageX, y: a.pageY});
            f = this._valueMax() - this._valueMin() + 1;
            j = this;
            this.handles.each(function (k) {
                var l = Math.abs(c - j.values(k));
                if (f > l) {
                    f = l;
                    e = d(this);
                    g = k
                }
            });
            if (b.range === true && this.values(1) === b.min) {
                g += 1;
                e = d(this.handles[g])
            }
            if (this._start(a, g) === false) return false;
            this._mouseSliding = true;
            j._handleIndex = g;
            e.addClass("ui-state-active").focus();
            b = e.offset();
            this._clickOffset = !d(a.target).parents().andSelf().is(".ui-slider-handle") ? {
                left: 0,
                top: 0
            } : {
                left: a.pageX - b.left - e.width() / 2,
                top: a.pageY - b.top - e.height() / 2 - (parseInt(e.css("borderTopWidth"), 10) || 0) - (parseInt(e.css("borderBottomWidth"), 10) || 0) + (parseInt(e.css("marginTop"), 10) || 0)
            };
            this.handles.hasClass("ui-state-hover") || this._slide(a, g, c);
            return this._animateOff = true
        },
        _mouseStart: function () {
            return true
        },
        _mouseDrag: function (a) {
            var b =
                this._normValueFromMouse({x: a.pageX, y: a.pageY});
            this._slide(a, this._handleIndex, b);
            return false
        },
        _mouseStop: function (a) {
            this.handles.removeClass("ui-state-active");
            this._mouseSliding = false;
            this._stop(a, this._handleIndex);
            this._change(a, this._handleIndex);
            this._clickOffset = this._handleIndex = null;
            return this._animateOff = false
        },
        _detectOrientation: function () {
            this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function (a) {
            var b;
            if (this.orientation === "horizontal") {
                b =
                    this.elementSize.width;
                a = a.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)
            } else {
                b = this.elementSize.height;
                a = a.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)
            }
            b = a / b;
            if (b > 1) b = 1;
            if (b < 0) b = 0;
            if (this.orientation === "vertical") b = 1 - b;
            a = this._valueMax() - this._valueMin();
            return this._trimAlignValue(this._valueMin() + b * a)
        },
        _start: function (a, b) {
            var c = {handle: this.handles[b], value: this.value()};
            if (this.options.values && this.options.values.length) {
                c.value = this.values(b);
                c.values = this.values()
            }
            return this._trigger("start", a, c)
        },
        _slide: function (a, b, c) {
            var f;
            if (this.options.values && this.options.values.length) {
                f = this.values(b ? 0 : 1);
                if (this.options.values.length === 2 && this.options.range === true && (b === 0 && c > f || b === 1 && c < f)) c = f;
                if (c !== this.values(b)) {
                    f = this.values();
                    f[b] = c;
                    a = this._trigger("slide", a, {handle: this.handles[b], value: c, values: f});
                    this.values(b ? 0 : 1);
                    a !== false && this.values(b, c, true)
                }
            } else if (c !== this.value()) {
                a = this._trigger("slide", a, {handle: this.handles[b], value: c});
                a !== false && this.value(c)
            }
        },
        _stop: function (a, b) {
            var c = {handle: this.handles[b], value: this.value()};
            if (this.options.values && this.options.values.length) {
                c.value = this.values(b);
                c.values = this.values()
            }
            this._trigger("stop", a, c)
        },
        _change: function (a, b) {
            if (!this._keySliding && !this._mouseSliding) {
                var c = {handle: this.handles[b], value: this.value()};
                if (this.options.values && this.options.values.length) {
                    c.value = this.values(b);
                    c.values = this.values()
                }
                this._trigger("change", a, c)
            }
        },
        value: function (a) {
            if (arguments.length) {
                this.options.value =
                    this._trimAlignValue(a);
                this._refreshValue();
                this._change(null, 0)
            } else return this._value()
        },
        values: function (a, b) {
            var c, f, e;
            if (arguments.length > 1) {
                this.options.values[a] = this._trimAlignValue(b);
                this._refreshValue();
                this._change(null, a)
            } else if (arguments.length) if (d.isArray(arguments[0])) {
                c = this.options.values;
                f = arguments[0];
                for (e = 0; e < c.length; e += 1) {
                    c[e] = this._trimAlignValue(f[e]);
                    this._change(null, e)
                }
                this._refreshValue()
            } else return this.options.values && this.options.values.length ? this._values(a) :
                this.value(); else return this._values()
        },
        _setOption: function (a, b) {
            var c, f = 0;
            if (d.isArray(this.options.values)) f = this.options.values.length;
            d.Widget.prototype._setOption.apply(this, arguments);
            switch (a) {
                case "disabled":
                    if (b) {
                        this.handles.filter(".ui-state-focus").blur();
                        this.handles.removeClass("ui-state-hover");
                        this.handles.propAttr("disabled", true);
                        this.element.addClass("ui-disabled")
                    } else {
                        this.handles.propAttr("disabled", false);
                        this.element.removeClass("ui-disabled")
                    }
                    break;
                case "orientation":
                    this._detectOrientation();
                    this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                    this._refreshValue();
                    break;
                case "value":
                    this._animateOff = true;
                    this._refreshValue();
                    this._change(null, 0);
                    this._animateOff = false;
                    break;
                case "values":
                    this._animateOff = true;
                    this._refreshValue();
                    for (c = 0; c < f; c += 1) this._change(null, c);
                    this._animateOff = false;
                    break
            }
        },
        _value: function () {
            var a = this.options.value;
            return a = this._trimAlignValue(a)
        },
        _values: function (a) {
            var b, c;
            if (arguments.length) {
                b = this.options.values[a];
                return b = this._trimAlignValue(b)
            } else {
                b = this.options.values.slice();
                for (c = 0; c < b.length; c += 1) b[c] = this._trimAlignValue(b[c]);
                return b
            }
        },
        _trimAlignValue: function (a) {
            if (a <= this._valueMin()) return this._valueMin();
            if (a >= this._valueMax()) return this._valueMax();
            var b = this.options.step > 0 ? this.options.step : 1, c = (a - this._valueMin()) % b;
            a = a - c;
            if (Math.abs(c) * 2 >= b) a += c > 0 ? b : -b;
            return parseFloat(a.toFixed(5))
        },
        _valueMin: function () {
            return this.options.min
        },
        _valueMax: function () {
            return this.options.max
        },
        _refreshValue: function () {
            var a =
                    this.options.range, b = this.options, c = this, f = !this._animateOff ? b.animate : false, e, j = {}, g,
                k, l, i;
            if (this.options.values && this.options.values.length) this.handles.each(function (h) {
                e = (c.values(h) - c._valueMin()) / (c._valueMax() - c._valueMin()) * 100;
                j[c.orientation === "horizontal" ? "left" : "bottom"] = e + "%";
                d(this).stop(1, 1)[f ? "animate" : "css"](j, b.animate);
                if (c.options.range === true) if (c.orientation === "horizontal") {
                    if (h === 0) c.range.stop(1, 1)[f ? "animate" : "css"]({left: e + "%"}, b.animate);
                    if (h === 1) c.range[f ? "animate" : "css"]({
                        width: e -
                        g + "%"
                    }, {queue: false, duration: b.animate})
                } else {
                    if (h === 0) c.range.stop(1, 1)[f ? "animate" : "css"]({bottom: e + "%"}, b.animate);
                    if (h === 1) c.range[f ? "animate" : "css"]({height: e - g + "%"}, {
                        queue: false,
                        duration: b.animate
                    })
                }
                g = e
            }); else {
                k = this.value();
                l = this._valueMin();
                i = this._valueMax();
                e = i !== l ? (k - l) / (i - l) * 100 : 0;
                j[c.orientation === "horizontal" ? "left" : "bottom"] = e + "%";
                this.handle.stop(1, 1)[f ? "animate" : "css"](j, b.animate);
                if (a === "min" && this.orientation === "horizontal") this.range.stop(1, 1)[f ? "animate" : "css"]({width: e + "%"},
                    b.animate);
                if (a === "max" && this.orientation === "horizontal") this.range[f ? "animate" : "css"]({width: 100 - e + "%"}, {
                    queue: false,
                    duration: b.animate
                });
                if (a === "min" && this.orientation === "vertical") this.range.stop(1, 1)[f ? "animate" : "css"]({height: e + "%"}, b.animate);
                if (a === "max" && this.orientation === "vertical") this.range[f ? "animate" : "css"]({height: 100 - e + "%"}, {
                    queue: false,
                    duration: b.animate
                })
            }
        }
    });
    d.extend(d.ui.slider, {version: "1.8.16"})
})(jQuery);
;
/*
 * jQuery UI Tabs 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function (d, p) {
    function u() {
        return ++v
    }

    function w() {
        return ++x
    }

    var v = 0, x = 0;
    d.widget("ui.tabs", {
        options: {
            add: null,
            ajaxOptions: null,
            cache: false,
            cookie: null,
            collapsible: false,
            disable: null,
            disabled: [],
            enable: null,
            event: "click",
            fx: null,
            idPrefix: "ui-tabs-",
            load: null,
            panelTemplate: "<div></div>",
            remove: null,
            select: null,
            show: null,
            spinner: "<em>Loading&#8230;</em>",
            tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
        }, _create: function () {
            this._tabify(true)
        }, _setOption: function (b, e) {
            if (b == "selected") this.options.collapsible &&
            e == this.options.selected || this.select(e); else {
                this.options[b] = e;
                this._tabify()
            }
        }, _tabId: function (b) {
            return b.title && b.title.replace(/\s/g, "_").replace(/[^\w\u00c0-\uFFFF-]/g, "") || this.options.idPrefix + u()
        }, _sanitizeSelector: function (b) {
            return b.replace(/:/g, "\\:")
        }, _cookie: function () {
            var b = this.cookie || (this.cookie = this.options.cookie.name || "ui-tabs-" + w());
            return d.cookie.apply(null, [b].concat(d.makeArray(arguments)))
        }, _ui: function (b, e) {
            return {tab: b, panel: e, index: this.anchors.index(b)}
        }, _cleanup: function () {
            this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function () {
                var b =
                    d(this);
                b.html(b.data("label.tabs")).removeData("label.tabs")
            })
        }, _tabify: function (b) {
            function e(g, f) {
                g.css("display", "");
                !d.support.opacity && f.opacity && g[0].style.removeAttribute("filter")
            }

            var a = this, c = this.options, h = /^#.+/;
            this.list = this.element.find("ol,ul").eq(0);
            this.lis = d(" > li:has(a[href])", this.list);
            this.anchors = this.lis.map(function () {
                return d("a", this)[0]
            });
            this.panels = d([]);
            this.anchors.each(function (g, f) {
                var i = d(f).attr("href"), l = i.split("#")[0], q;
                if (l && (l === location.toString().split("#")[0] ||
                        (q = d("base")[0]) && l === q.href)) {
                    i = f.hash;
                    f.href = i
                }
                if (h.test(i)) a.panels = a.panels.add(a.element.find(a._sanitizeSelector(i))); else if (i && i !== "#") {
                    d.data(f, "href.tabs", i);
                    d.data(f, "load.tabs", i.replace(/#.*$/, ""));
                    i = a._tabId(f);
                    f.href = "#" + i;
                    f = a.element.find("#" + i);
                    if (!f.length) {
                        f = d(c.panelTemplate).attr("id", i).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(a.panels[g - 1] || a.list);
                        f.data("destroy.tabs", true)
                    }
                    a.panels = a.panels.add(f)
                } else c.disabled.push(g)
            });
            if (b) {
                this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");
                this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
                this.lis.addClass("ui-state-default ui-corner-top");
                this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");
                if (c.selected === p) {
                    location.hash && this.anchors.each(function (g, f) {
                        if (f.hash == location.hash) {
                            c.selected = g;
                            return false
                        }
                    });
                    if (typeof c.selected !== "number" && c.cookie) c.selected = parseInt(a._cookie(), 10);
                    if (typeof c.selected !== "number" && this.lis.filter(".ui-tabs-selected").length) c.selected =
                        this.lis.index(this.lis.filter(".ui-tabs-selected"));
                    c.selected = c.selected || (this.lis.length ? 0 : -1)
                } else if (c.selected === null) c.selected = -1;
                c.selected = c.selected >= 0 && this.anchors[c.selected] || c.selected < 0 ? c.selected : 0;
                c.disabled = d.unique(c.disabled.concat(d.map(this.lis.filter(".ui-state-disabled"), function (g) {
                    return a.lis.index(g)
                }))).sort();
                d.inArray(c.selected, c.disabled) != -1 && c.disabled.splice(d.inArray(c.selected, c.disabled), 1);
                this.panels.addClass("ui-tabs-hide");
                this.lis.removeClass("ui-tabs-selected ui-state-active");
                if (c.selected >= 0 && this.anchors.length) {
                    a.element.find(a._sanitizeSelector(a.anchors[c.selected].hash)).removeClass("ui-tabs-hide");
                    this.lis.eq(c.selected).addClass("ui-tabs-selected ui-state-active");
                    a.element.queue("tabs", function () {
                        a._trigger("show", null, a._ui(a.anchors[c.selected], a.element.find(a._sanitizeSelector(a.anchors[c.selected].hash))[0]))
                    });
                    this.load(c.selected)
                }
                d(window).bind("unload", function () {
                    a.lis.add(a.anchors).unbind(".tabs");
                    a.lis = a.anchors = a.panels = null
                })
            } else c.selected = this.lis.index(this.lis.filter(".ui-tabs-selected"));
            this.element[c.collapsible ? "addClass" : "removeClass"]("ui-tabs-collapsible");
            c.cookie && this._cookie(c.selected, c.cookie);
            b = 0;
            for (var j; j = this.lis[b]; b++) d(j)[d.inArray(b, c.disabled) != -1 && !d(j).hasClass("ui-tabs-selected") ? "addClass" : "removeClass"]("ui-state-disabled");
            c.cache === false && this.anchors.removeData("cache.tabs");
            this.lis.add(this.anchors).unbind(".tabs");
            if (c.event !== "mouseover") {
                var k = function (g, f) {
                    f.is(":not(.ui-state-disabled)") && f.addClass("ui-state-" + g)
                }, n = function (g, f) {
                    f.removeClass("ui-state-" +
                        g)
                };
                this.lis.bind("mouseover.tabs", function () {
                    k("hover", d(this))
                });
                this.lis.bind("mouseout.tabs", function () {
                    n("hover", d(this))
                });
                this.anchors.bind("focus.tabs", function () {
                    k("focus", d(this).closest("li"))
                });
                this.anchors.bind("blur.tabs", function () {
                    n("focus", d(this).closest("li"))
                })
            }
            var m, o;
            if (c.fx) if (d.isArray(c.fx)) {
                m = c.fx[0];
                o = c.fx[1]
            } else m = o = c.fx;
            var r = o ? function (g, f) {
                d(g).closest("li").addClass("ui-tabs-selected ui-state-active");
                f.hide().removeClass("ui-tabs-hide").animate(o, o.duration || "normal",
                    function () {
                        e(f, o);
                        a._trigger("show", null, a._ui(g, f[0]))
                    })
            } : function (g, f) {
                d(g).closest("li").addClass("ui-tabs-selected ui-state-active");
                f.removeClass("ui-tabs-hide");
                a._trigger("show", null, a._ui(g, f[0]))
            }, s = m ? function (g, f) {
                f.animate(m, m.duration || "normal", function () {
                    a.lis.removeClass("ui-tabs-selected ui-state-active");
                    f.addClass("ui-tabs-hide");
                    e(f, m);
                    a.element.dequeue("tabs")
                })
            } : function (g, f) {
                a.lis.removeClass("ui-tabs-selected ui-state-active");
                f.addClass("ui-tabs-hide");
                a.element.dequeue("tabs")
            };
            this.anchors.bind(c.event + ".tabs", function () {
                var g = this, f = d(g).closest("li"), i = a.panels.filter(":not(.ui-tabs-hide)"),
                    l = a.element.find(a._sanitizeSelector(g.hash));
                if (f.hasClass("ui-tabs-selected") && !c.collapsible || f.hasClass("ui-state-disabled") || f.hasClass("ui-state-processing") || a.panels.filter(":animated").length || a._trigger("select", null, a._ui(this, l[0])) === false) {
                    this.blur();
                    return false
                }
                c.selected = a.anchors.index(this);
                a.abort();
                if (c.collapsible) if (f.hasClass("ui-tabs-selected")) {
                    c.selected =
                        -1;
                    c.cookie && a._cookie(c.selected, c.cookie);
                    a.element.queue("tabs", function () {
                        s(g, i)
                    }).dequeue("tabs");
                    this.blur();
                    return false
                } else if (!i.length) {
                    c.cookie && a._cookie(c.selected, c.cookie);
                    a.element.queue("tabs", function () {
                        r(g, l)
                    });
                    a.load(a.anchors.index(this));
                    this.blur();
                    return false
                }
                c.cookie && a._cookie(c.selected, c.cookie);
                if (l.length) {
                    i.length && a.element.queue("tabs", function () {
                        s(g, i)
                    });
                    a.element.queue("tabs", function () {
                        r(g, l)
                    });
                    a.load(a.anchors.index(this))
                } else throw"jQuery UI Tabs: Mismatching fragment identifier.";
                d.browser.msie && this.blur()
            });
            this.anchors.bind("click.tabs", function () {
                return false
            })
        }, _getIndex: function (b) {
            if (typeof b == "string") b = this.anchors.index(this.anchors.filter("[href$=" + b + "]"));
            return b
        }, destroy: function () {
            var b = this.options;
            this.abort();
            this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs");
            this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
            this.anchors.each(function () {
                var e =
                    d.data(this, "href.tabs");
                if (e) this.href = e;
                var a = d(this).unbind(".tabs");
                d.each(["href", "load", "cache"], function (c, h) {
                    a.removeData(h + ".tabs")
                })
            });
            this.lis.unbind(".tabs").add(this.panels).each(function () {
                d.data(this, "destroy.tabs") ? d(this).remove() : d(this).removeClass("ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-hover ui-state-focus ui-state-disabled ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide")
            });
            b.cookie && this._cookie(null, b.cookie);
            return this
        }, add: function (b,
                          e, a) {
            if (a === p) a = this.anchors.length;
            var c = this, h = this.options;
            e = d(h.tabTemplate.replace(/#\{href\}/g, b).replace(/#\{label\}/g, e));
            b = !b.indexOf("#") ? b.replace("#", "") : this._tabId(d("a", e)[0]);
            e.addClass("ui-state-default ui-corner-top").data("destroy.tabs", true);
            var j = c.element.find("#" + b);
            j.length || (j = d(h.panelTemplate).attr("id", b).data("destroy.tabs", true));
            j.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");
            if (a >= this.lis.length) {
                e.appendTo(this.list);
                j.appendTo(this.list[0].parentNode)
            } else {
                e.insertBefore(this.lis[a]);
                j.insertBefore(this.panels[a])
            }
            h.disabled = d.map(h.disabled, function (k) {
                return k >= a ? ++k : k
            });
            this._tabify();
            if (this.anchors.length == 1) {
                h.selected = 0;
                e.addClass("ui-tabs-selected ui-state-active");
                j.removeClass("ui-tabs-hide");
                this.element.queue("tabs", function () {
                    c._trigger("show", null, c._ui(c.anchors[0], c.panels[0]))
                });
                this.load(0)
            }
            this._trigger("add", null, this._ui(this.anchors[a], this.panels[a]));
            return this
        }, remove: function (b) {
            b = this._getIndex(b);
            var e = this.options, a = this.lis.eq(b).remove(), c = this.panels.eq(b).remove();
            if (a.hasClass("ui-tabs-selected") && this.anchors.length > 1) this.select(b + (b + 1 < this.anchors.length ? 1 : -1));
            e.disabled = d.map(d.grep(e.disabled, function (h) {
                return h != b
            }), function (h) {
                return h >= b ? --h : h
            });
            this._tabify();
            this._trigger("remove", null, this._ui(a.find("a")[0], c[0]));
            return this
        }, enable: function (b) {
            b = this._getIndex(b);
            var e = this.options;
            if (d.inArray(b, e.disabled) != -1) {
                this.lis.eq(b).removeClass("ui-state-disabled");
                e.disabled = d.grep(e.disabled, function (a) {
                    return a != b
                });
                this._trigger("enable", null,
                    this._ui(this.anchors[b], this.panels[b]));
                return this
            }
        }, disable: function (b) {
            b = this._getIndex(b);
            var e = this.options;
            if (b != e.selected) {
                this.lis.eq(b).addClass("ui-state-disabled");
                e.disabled.push(b);
                e.disabled.sort();
                this._trigger("disable", null, this._ui(this.anchors[b], this.panels[b]))
            }
            return this
        }, select: function (b) {
            b = this._getIndex(b);
            if (b == -1) if (this.options.collapsible && this.options.selected != -1) b = this.options.selected; else return this;
            this.anchors.eq(b).trigger(this.options.event + ".tabs");
            return this
        },
        load: function (b) {
            b = this._getIndex(b);
            var e = this, a = this.options, c = this.anchors.eq(b)[0], h = d.data(c, "load.tabs");
            this.abort();
            if (!h || this.element.queue("tabs").length !== 0 && d.data(c, "cache.tabs")) this.element.dequeue("tabs"); else {
                this.lis.eq(b).addClass("ui-state-processing");
                if (a.spinner) {
                    var j = d("span", c);
                    j.data("label.tabs", j.html()).html(a.spinner)
                }
                this.xhr = d.ajax(d.extend({}, a.ajaxOptions, {
                    url: h, success: function (k, n) {
                        e.element.find(e._sanitizeSelector(c.hash)).html(k);
                        e._cleanup();
                        a.cache && d.data(c,
                            "cache.tabs", true);
                        e._trigger("load", null, e._ui(e.anchors[b], e.panels[b]));
                        try {
                            a.ajaxOptions.success(k, n)
                        } catch (m) {
                        }
                    }, error: function (k, n) {
                        e._cleanup();
                        e._trigger("load", null, e._ui(e.anchors[b], e.panels[b]));
                        try {
                            a.ajaxOptions.error(k, n, b, c)
                        } catch (m) {
                        }
                    }
                }));
                e.element.dequeue("tabs");
                return this
            }
        }, abort: function () {
            this.element.queue([]);
            this.panels.stop(false, true);
            this.element.queue("tabs", this.element.queue("tabs").splice(-2, 2));
            if (this.xhr) {
                this.xhr.abort();
                delete this.xhr
            }
            this._cleanup();
            return this
        },
        url: function (b, e) {
            this.anchors.eq(b).removeData("cache.tabs").data("load.tabs", e);
            return this
        }, length: function () {
            return this.anchors.length
        }
    });
    d.extend(d.ui.tabs, {version: "1.8.16"});
    d.extend(d.ui.tabs.prototype, {
        rotation: null, rotate: function (b, e) {
            var a = this, c = this.options, h = a._rotate || (a._rotate = function (j) {
                clearTimeout(a.rotation);
                a.rotation = setTimeout(function () {
                    var k = c.selected;
                    a.select(++k < a.anchors.length ? k : 0)
                }, b);
                j && j.stopPropagation()
            });
            e = a._unrotate || (a._unrotate = !e ? function (j) {
                j.clientX &&
                a.rotate(null)
            } : function () {
                t = c.selected;
                h()
            });
            if (b) {
                this.element.bind("tabsshow", h);
                this.anchors.bind(c.event + ".tabs", e);
                h()
            } else {
                clearTimeout(a.rotation);
                this.element.unbind("tabsshow", h);
                this.anchors.unbind(c.event + ".tabs", e);
                delete this._rotate;
                delete this._unrotate
            }
            return this
        }
    })
})(jQuery);
;
/*
 * jQuery UI Datepicker 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Datepicker
 *
 * Depends:
 *	jquery.ui.core.js
 */
(function (d, C) {
    function M() {
        this.debug = false;
        this._curInst = null;
        this._keyEvent = false;
        this._disabledInputs = [];
        this._inDialog = this._datepickerShowing = false;
        this._mainDivId = "ui-datepicker-div";
        this._inlineClass = "ui-datepicker-inline";
        this._appendClass = "ui-datepicker-append";
        this._triggerClass = "ui-datepicker-trigger";
        this._dialogClass = "ui-datepicker-dialog";
        this._disableClass = "ui-datepicker-disabled";
        this._unselectableClass = "ui-datepicker-unselectable";
        this._currentClass = "ui-datepicker-current-day";
        this._dayOverClass =
            "ui-datepicker-days-cell-over";
        this.regional = [];
        this.regional[""] = {
            closeText: "Done",
            prevText: "Prev",
            nextText: "Next",
            currentText: "Today",
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su",
                "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            weekHeader: "Wk",
            dateFormat: "mm/dd/yy",
            firstDay: 0,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ""
        };
        this._defaults = {
            showOn: "focus",
            showAnim: "fadeIn",
            showOptions: {},
            defaultDate: null,
            appendText: "",
            buttonText: "...",
            buttonImage: "",
            buttonImageOnly: false,
            hideIfNoPrevNext: false,
            navigationAsDateFormat: false,
            gotoCurrent: false,
            changeMonth: false,
            changeYear: false,
            yearRange: "c-10:c+10",
            showOtherMonths: false,
            selectOtherMonths: false,
            showWeek: false,
            calculateWeek: this.iso8601Week,
            shortYearCutoff: "+10",
            minDate: null,
            maxDate: null,
            duration: "fast",
            beforeShowDay: null,
            beforeShow: null,
            onSelect: null,
            onChangeMonthYear: null,
            onClose: null,
            numberOfMonths: 1,
            showCurrentAtPos: 0,
            stepMonths: 1,
            stepBigMonths: 12,
            altField: "",
            altFormat: "",
            constrainInput: true,
            showButtonPanel: false,
            autoSize: false,
            disabled: false
        };
        d.extend(this._defaults, this.regional[""]);
        this.dpDiv = N(d('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))
    }

    function N(a) {
        return a.bind("mouseout",
            function (b) {
                b = d(b.target).closest("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a");
                b.length && b.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover")
            }).bind("mouseover", function (b) {
            b = d(b.target).closest("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a");
            if (!(d.datepicker._isDisabledDatepicker(J.inline ? a.parent()[0] : J.input[0]) || !b.length)) {
                b.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
                b.addClass("ui-state-hover");
                b.hasClass("ui-datepicker-prev") && b.addClass("ui-datepicker-prev-hover");
                b.hasClass("ui-datepicker-next") && b.addClass("ui-datepicker-next-hover")
            }
        })
    }

    function H(a, b) {
        d.extend(a, b);
        for (var c in b) if (b[c] == null || b[c] == C) a[c] = b[c];
        return a
    }

    d.extend(d.ui, {datepicker: {version: "1.8.16"}});
    var B = (new Date).getTime(), J;
    d.extend(M.prototype, {
        markerClassName: "hasDatepicker",
        maxRows: 4,
        log: function () {
            this.debug && console.log.apply("", arguments)
        },
        _widgetDatepicker: function () {
            return this.dpDiv
        },
        setDefaults: function (a) {
            H(this._defaults, a || {});
            return this
        },
        _attachDatepicker: function (a, b) {
            var c = null;
            for (var e in this._defaults) {
                var f = a.getAttribute("date:" + e);
                if (f) {
                    c = c || {};
                    try {
                        c[e] = eval(f)
                    } catch (h) {
                        c[e] = f
                    }
                }
            }
            e = a.nodeName.toLowerCase();
            f = e == "div" || e == "span";
            if (!a.id) {
                this.uuid += 1;
                a.id = "dp" + this.uuid
            }
            var i = this._newInst(d(a), f);
            i.settings = d.extend({}, b || {}, c || {});
            if (e == "input") this._connectDatepicker(a, i); else f && this._inlineDatepicker(a, i)
        },
        _newInst: function (a, b) {
            return {
                id: a[0].id.replace(/([^A-Za-z0-9_-])/g,
                    "\\\\$1"),
                input: a,
                selectedDay: 0,
                selectedMonth: 0,
                selectedYear: 0,
                drawMonth: 0,
                drawYear: 0,
                inline: b,
                dpDiv: !b ? this.dpDiv : N(d('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))
            }
        },
        _connectDatepicker: function (a, b) {
            var c = d(a);
            b.append = d([]);
            b.trigger = d([]);
            if (!c.hasClass(this.markerClassName)) {
                this._attachments(c, b);
                c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",
                    function (e, f, h) {
                        b.settings[f] = h
                    }).bind("getData.datepicker", function (e, f) {
                    return this._get(b, f)
                });
                this._autoSize(b);
                d.data(a, "datepicker", b);
                b.settings.disabled && this._disableDatepicker(a)
            }
        },
        _attachments: function (a, b) {
            var c = this._get(b, "appendText"), e = this._get(b, "isRTL");
            b.append && b.append.remove();
            if (c) {
                b.append = d('<span class="' + this._appendClass + '">' + c + "</span>");
                a[e ? "before" : "after"](b.append)
            }
            a.unbind("focus", this._showDatepicker);
            b.trigger && b.trigger.remove();
            c = this._get(b, "showOn");
            if (c ==
                "focus" || c == "both") a.focus(this._showDatepicker);
            if (c == "button" || c == "both") {
                c = this._get(b, "buttonText");
                var f = this._get(b, "buttonImage");
                b.trigger = d(this._get(b, "buttonImageOnly") ? d("<img/>").addClass(this._triggerClass).attr({
                    src: f,
                    alt: c,
                    title: c
                }) : d('<button type="button"></button>').addClass(this._triggerClass).html(f == "" ? c : d("<img/>").attr({
                    src: f,
                    alt: c,
                    title: c
                })));
                a[e ? "before" : "after"](b.trigger);
                b.trigger.click(function () {
                    d.datepicker._datepickerShowing && d.datepicker._lastInput == a[0] ? d.datepicker._hideDatepicker() :
                        d.datepicker._showDatepicker(a[0]);
                    return false
                })
            }
        },
        _autoSize: function (a) {
            if (this._get(a, "autoSize") && !a.inline) {
                var b = new Date(2009, 11, 20), c = this._get(a, "dateFormat");
                if (c.match(/[DM]/)) {
                    var e = function (f) {
                        for (var h = 0, i = 0, g = 0; g < f.length; g++) if (f[g].length > h) {
                            h = f[g].length;
                            i = g
                        }
                        return i
                    };
                    b.setMonth(e(this._get(a, c.match(/MM/) ? "monthNames" : "monthNamesShort")));
                    b.setDate(e(this._get(a, c.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - b.getDay())
                }
                a.input.attr("size", this._formatDate(a, b).length)
            }
        },
        _inlineDatepicker: function (a,
                                     b) {
            var c = d(a);
            if (!c.hasClass(this.markerClassName)) {
                c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker", function (e, f, h) {
                    b.settings[f] = h
                }).bind("getData.datepicker", function (e, f) {
                    return this._get(b, f)
                });
                d.data(a, "datepicker", b);
                this._setDate(b, this._getDefaultDate(b), true);
                this._updateDatepicker(b);
                this._updateAlternate(b);
                b.settings.disabled && this._disableDatepicker(a);
                b.dpDiv.css("display", "block")
            }
        },
        _dialogDatepicker: function (a, b, c, e, f) {
            a = this._dialogInst;
            if (!a) {
                this.uuid +=
                    1;
                this._dialogInput = d('<input type="text" id="' + ("dp" + this.uuid) + '" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
                this._dialogInput.keydown(this._doKeyDown);
                d("body").append(this._dialogInput);
                a = this._dialogInst = this._newInst(this._dialogInput, false);
                a.settings = {};
                d.data(this._dialogInput[0], "datepicker", a)
            }
            H(a.settings, e || {});
            b = b && b.constructor == Date ? this._formatDate(a, b) : b;
            this._dialogInput.val(b);
            this._pos = f ? f.length ? f : [f.pageX, f.pageY] : null;
            if (!this._pos) this._pos = [document.documentElement.clientWidth /
            2 - 100 + (document.documentElement.scrollLeft || document.body.scrollLeft), document.documentElement.clientHeight / 2 - 150 + (document.documentElement.scrollTop || document.body.scrollTop)];
            this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px");
            a.settings.onSelect = c;
            this._inDialog = true;
            this.dpDiv.addClass(this._dialogClass);
            this._showDatepicker(this._dialogInput[0]);
            d.blockUI && d.blockUI(this.dpDiv);
            d.data(this._dialogInput[0], "datepicker", a);
            return this
        },
        _destroyDatepicker: function (a) {
            var b =
                d(a), c = d.data(a, "datepicker");
            if (b.hasClass(this.markerClassName)) {
                var e = a.nodeName.toLowerCase();
                d.removeData(a, "datepicker");
                if (e == "input") {
                    c.append.remove();
                    c.trigger.remove();
                    b.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)
                } else if (e == "div" || e == "span") b.removeClass(this.markerClassName).empty()
            }
        },
        _enableDatepicker: function (a) {
            var b = d(a), c = d.data(a, "datepicker");
            if (b.hasClass(this.markerClassName)) {
                var e =
                    a.nodeName.toLowerCase();
                if (e == "input") {
                    a.disabled = false;
                    c.trigger.filter("button").each(function () {
                        this.disabled = false
                    }).end().filter("img").css({opacity: "1.0", cursor: ""})
                } else if (e == "div" || e == "span") {
                    b = b.children("." + this._inlineClass);
                    b.children().removeClass("ui-state-disabled");
                    b.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")
                }
                this._disabledInputs = d.map(this._disabledInputs, function (f) {
                    return f == a ? null : f
                })
            }
        },
        _disableDatepicker: function (a) {
            var b = d(a), c = d.data(a,
                "datepicker");
            if (b.hasClass(this.markerClassName)) {
                var e = a.nodeName.toLowerCase();
                if (e == "input") {
                    a.disabled = true;
                    c.trigger.filter("button").each(function () {
                        this.disabled = true
                    }).end().filter("img").css({opacity: "0.5", cursor: "default"})
                } else if (e == "div" || e == "span") {
                    b = b.children("." + this._inlineClass);
                    b.children().addClass("ui-state-disabled");
                    b.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled", "disabled")
                }
                this._disabledInputs = d.map(this._disabledInputs, function (f) {
                    return f ==
                    a ? null : f
                });
                this._disabledInputs[this._disabledInputs.length] = a
            }
        },
        _isDisabledDatepicker: function (a) {
            if (!a) return false;
            for (var b = 0; b < this._disabledInputs.length; b++) if (this._disabledInputs[b] == a) return true;
            return false
        },
        _getInst: function (a) {
            try {
                return d.data(a, "datepicker")
            } catch (b) {
                throw"Missing instance data for this datepicker";
            }
        },
        _optionDatepicker: function (a, b, c) {
            var e = this._getInst(a);
            if (arguments.length == 2 && typeof b == "string") return b == "defaults" ? d.extend({}, d.datepicker._defaults) : e ? b == "all" ?
                d.extend({}, e.settings) : this._get(e, b) : null;
            var f = b || {};
            if (typeof b == "string") {
                f = {};
                f[b] = c
            }
            if (e) {
                this._curInst == e && this._hideDatepicker();
                var h = this._getDateDatepicker(a, true), i = this._getMinMaxDate(e, "min"),
                    g = this._getMinMaxDate(e, "max");
                H(e.settings, f);
                if (i !== null && f.dateFormat !== C && f.minDate === C) e.settings.minDate = this._formatDate(e, i);
                if (g !== null && f.dateFormat !== C && f.maxDate === C) e.settings.maxDate = this._formatDate(e, g);
                this._attachments(d(a), e);
                this._autoSize(e);
                this._setDate(e, h);
                this._updateAlternate(e);
                this._updateDatepicker(e)
            }
        },
        _changeDatepicker: function (a, b, c) {
            this._optionDatepicker(a, b, c)
        },
        _refreshDatepicker: function (a) {
            (a = this._getInst(a)) && this._updateDatepicker(a)
        },
        _setDateDatepicker: function (a, b) {
            if (a = this._getInst(a)) {
                this._setDate(a, b);
                this._updateDatepicker(a);
                this._updateAlternate(a)
            }
        },
        _getDateDatepicker: function (a, b) {
            (a = this._getInst(a)) && !a.inline && this._setDateFromField(a, b);
            return a ? this._getDate(a) : null
        },
        _doKeyDown: function (a) {
            var b = d.datepicker._getInst(a.target), c = true, e = b.dpDiv.is(".ui-datepicker-rtl");
            b._keyEvent = true;
            if (d.datepicker._datepickerShowing) switch (a.keyCode) {
                case 9:
                    d.datepicker._hideDatepicker();
                    c = false;
                    break;
                case 13:
                    c = d("td." + d.datepicker._dayOverClass + ":not(." + d.datepicker._currentClass + ")", b.dpDiv);
                    c[0] && d.datepicker._selectDay(a.target, b.selectedMonth, b.selectedYear, c[0]);
                    if (a = d.datepicker._get(b, "onSelect")) {
                        c = d.datepicker._formatDate(b);
                        a.apply(b.input ? b.input[0] : null, [c, b])
                    } else d.datepicker._hideDatepicker();
                    return false;
                case 27:
                    d.datepicker._hideDatepicker();
                    break;
                case 33:
                    d.datepicker._adjustDate(a.target,
                        a.ctrlKey ? -d.datepicker._get(b, "stepBigMonths") : -d.datepicker._get(b, "stepMonths"), "M");
                    break;
                case 34:
                    d.datepicker._adjustDate(a.target, a.ctrlKey ? +d.datepicker._get(b, "stepBigMonths") : +d.datepicker._get(b, "stepMonths"), "M");
                    break;
                case 35:
                    if (a.ctrlKey || a.metaKey) d.datepicker._clearDate(a.target);
                    c = a.ctrlKey || a.metaKey;
                    break;
                case 36:
                    if (a.ctrlKey || a.metaKey) d.datepicker._gotoToday(a.target);
                    c = a.ctrlKey || a.metaKey;
                    break;
                case 37:
                    if (a.ctrlKey || a.metaKey) d.datepicker._adjustDate(a.target, e ? +1 : -1, "D");
                    c =
                        a.ctrlKey || a.metaKey;
                    if (a.originalEvent.altKey) d.datepicker._adjustDate(a.target, a.ctrlKey ? -d.datepicker._get(b, "stepBigMonths") : -d.datepicker._get(b, "stepMonths"), "M");
                    break;
                case 38:
                    if (a.ctrlKey || a.metaKey) d.datepicker._adjustDate(a.target, -7, "D");
                    c = a.ctrlKey || a.metaKey;
                    break;
                case 39:
                    if (a.ctrlKey || a.metaKey) d.datepicker._adjustDate(a.target, e ? -1 : +1, "D");
                    c = a.ctrlKey || a.metaKey;
                    if (a.originalEvent.altKey) d.datepicker._adjustDate(a.target, a.ctrlKey ? +d.datepicker._get(b, "stepBigMonths") : +d.datepicker._get(b,
                        "stepMonths"), "M");
                    break;
                case 40:
                    if (a.ctrlKey || a.metaKey) d.datepicker._adjustDate(a.target, +7, "D");
                    c = a.ctrlKey || a.metaKey;
                    break;
                default:
                    c = false
            } else if (a.keyCode == 36 && a.ctrlKey) d.datepicker._showDatepicker(this); else c = false;
            if (c) {
                a.preventDefault();
                a.stopPropagation()
            }
        },
        _doKeyPress: function (a) {
            var b = d.datepicker._getInst(a.target);
            if (d.datepicker._get(b, "constrainInput")) {
                b = d.datepicker._possibleChars(d.datepicker._get(b, "dateFormat"));
                var c = String.fromCharCode(a.charCode == C ? a.keyCode : a.charCode);
                return a.ctrlKey || a.metaKey || c < " " || !b || b.indexOf(c) > -1
            }
        },
        _doKeyUp: function (a) {
            a = d.datepicker._getInst(a.target);
            if (a.input.val() != a.lastVal) try {
                if (d.datepicker.parseDate(d.datepicker._get(a, "dateFormat"), a.input ? a.input.val() : null, d.datepicker._getFormatConfig(a))) {
                    d.datepicker._setDateFromField(a);
                    d.datepicker._updateAlternate(a);
                    d.datepicker._updateDatepicker(a)
                }
            } catch (b) {
                d.datepicker.log(b)
            }
            return true
        },
        _showDatepicker: function (a) {
            a = a.target || a;
            if (a.nodeName.toLowerCase() != "input") a = d("input",
                a.parentNode)[0];
            if (!(d.datepicker._isDisabledDatepicker(a) || d.datepicker._lastInput == a)) {
                var b = d.datepicker._getInst(a);
                if (d.datepicker._curInst && d.datepicker._curInst != b) {
                    d.datepicker._datepickerShowing && d.datepicker._triggerOnClose(d.datepicker._curInst);
                    d.datepicker._curInst.dpDiv.stop(true, true)
                }
                var c = d.datepicker._get(b, "beforeShow");
                c = c ? c.apply(a, [a, b]) : {};
                if (c !== false) {
                    H(b.settings, c);
                    b.lastVal = null;
                    d.datepicker._lastInput = a;
                    d.datepicker._setDateFromField(b);
                    if (d.datepicker._inDialog) a.value =
                        "";
                    if (!d.datepicker._pos) {
                        d.datepicker._pos = d.datepicker._findPos(a);
                        d.datepicker._pos[1] += a.offsetHeight
                    }
                    var e = false;
                    d(a).parents().each(function () {
                        e |= d(this).css("position") == "fixed";
                        return !e
                    });
                    if (e && d.browser.opera) {
                        d.datepicker._pos[0] -= document.documentElement.scrollLeft;
                        d.datepicker._pos[1] -= document.documentElement.scrollTop
                    }
                    c = {left: d.datepicker._pos[0], top: d.datepicker._pos[1]};
                    d.datepicker._pos = null;
                    b.dpDiv.empty();
                    b.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
                    d.datepicker._updateDatepicker(b);
                    c = d.datepicker._checkOffset(b, c, e);
                    b.dpDiv.css({
                        position: d.datepicker._inDialog && d.blockUI ? "static" : e ? "fixed" : "absolute",
                        display: "none",
                        left: c.left + "px",
                        top: c.top + "px"
                    });
                    if (!b.inline) {
                        c = d.datepicker._get(b, "showAnim");
                        var f = d.datepicker._get(b, "duration"), h = function () {
                            var i = b.dpDiv.find("iframe.ui-datepicker-cover");
                            if (i.length) {
                                var g = d.datepicker._getBorders(b.dpDiv);
                                i.css({
                                    left: -g[0],
                                    top: -g[1],
                                    width: b.dpDiv.outerWidth(),
                                    height: b.dpDiv.outerHeight()
                                })
                            }
                        };
                        b.dpDiv.zIndex(d(a).zIndex() + 1);
                        d.datepicker._datepickerShowing =
                            true;
                        d.effects && d.effects[c] ? b.dpDiv.show(c, d.datepicker._get(b, "showOptions"), f, h) : b.dpDiv[c || "show"](c ? f : null, h);
                        if (!c || !f) h();
                        b.input.is(":visible") && !b.input.is(":disabled") && b.input.focus();
                        d.datepicker._curInst = b
                    }
                }
            }
        },
        _updateDatepicker: function (a) {
            this.maxRows = 4;
            var b = d.datepicker._getBorders(a.dpDiv);
            J = a;
            a.dpDiv.empty().append(this._generateHTML(a));
            var c = a.dpDiv.find("iframe.ui-datepicker-cover");
            c.length && c.css({left: -b[0], top: -b[1], width: a.dpDiv.outerWidth(), height: a.dpDiv.outerHeight()});
            a.dpDiv.find("." + this._dayOverClass + " a").mouseover();
            b = this._getNumberOfMonths(a);
            c = b[1];
            a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
            c > 1 && a.dpDiv.addClass("ui-datepicker-multi-" + c).css("width", 17 * c + "em");
            a.dpDiv[(b[0] != 1 || b[1] != 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi");
            a.dpDiv[(this._get(a, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");
            a == d.datepicker._curInst && d.datepicker._datepickerShowing && a.input && a.input.is(":visible") &&
            !a.input.is(":disabled") && a.input[0] != document.activeElement && a.input.focus();
            if (a.yearshtml) {
                var e = a.yearshtml;
                setTimeout(function () {
                    e === a.yearshtml && a.yearshtml && a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml);
                    e = a.yearshtml = null
                }, 0)
            }
        },
        _getBorders: function (a) {
            var b = function (c) {
                return {thin: 1, medium: 2, thick: 3}[c] || c
            };
            return [parseFloat(b(a.css("border-left-width"))), parseFloat(b(a.css("border-top-width")))]
        },
        _checkOffset: function (a, b, c) {
            var e = a.dpDiv.outerWidth(), f = a.dpDiv.outerHeight(),
                h = a.input ? a.input.outerWidth() : 0, i = a.input ? a.input.outerHeight() : 0,
                g = document.documentElement.clientWidth + d(document).scrollLeft(),
                j = document.documentElement.clientHeight + d(document).scrollTop();
            b.left -= this._get(a, "isRTL") ? e - h : 0;
            b.left -= c && b.left == a.input.offset().left ? d(document).scrollLeft() : 0;
            b.top -= c && b.top == a.input.offset().top + i ? d(document).scrollTop() : 0;
            b.left -= Math.min(b.left, b.left + e > g && g > e ? Math.abs(b.left + e - g) : 0);
            b.top -= Math.min(b.top, b.top + f > j && j > f ? Math.abs(f + i) : 0);
            return b
        },
        _findPos: function (a) {
            for (var b =
                this._get(this._getInst(a), "isRTL"); a && (a.type == "hidden" || a.nodeType != 1 || d.expr.filters.hidden(a));) a = a[b ? "previousSibling" : "nextSibling"];
            a = d(a).offset();
            return [a.left, a.top]
        },
        _triggerOnClose: function (a) {
            var b = this._get(a, "onClose");
            if (b) b.apply(a.input ? a.input[0] : null, [a.input ? a.input.val() : "", a])
        },
        _hideDatepicker: function (a) {
            var b = this._curInst;
            if (!(!b || a && b != d.data(a, "datepicker"))) if (this._datepickerShowing) {
                a = this._get(b, "showAnim");
                var c = this._get(b, "duration"), e = function () {
                    d.datepicker._tidyDialog(b);
                    this._curInst = null
                };
                d.effects && d.effects[a] ? b.dpDiv.hide(a, d.datepicker._get(b, "showOptions"), c, e) : b.dpDiv[a == "slideDown" ? "slideUp" : a == "fadeIn" ? "fadeOut" : "hide"](a ? c : null, e);
                a || e();
                d.datepicker._triggerOnClose(b);
                this._datepickerShowing = false;
                this._lastInput = null;
                if (this._inDialog) {
                    this._dialogInput.css({position: "absolute", left: "0", top: "-100px"});
                    if (d.blockUI) {
                        d.unblockUI();
                        d("body").append(this.dpDiv)
                    }
                }
                this._inDialog = false
            }
        },
        _tidyDialog: function (a) {
            a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
        },
        _checkExternalClick: function (a) {
            if (d.datepicker._curInst) {
                a = d(a.target);
                a[0].id != d.datepicker._mainDivId && a.parents("#" + d.datepicker._mainDivId).length == 0 && !a.hasClass(d.datepicker.markerClassName) && !a.hasClass(d.datepicker._triggerClass) && d.datepicker._datepickerShowing && !(d.datepicker._inDialog && d.blockUI) && d.datepicker._hideDatepicker()
            }
        },
        _adjustDate: function (a, b, c) {
            a = d(a);
            var e = this._getInst(a[0]);
            if (!this._isDisabledDatepicker(a[0])) {
                this._adjustInstDate(e, b + (c == "M" ? this._get(e, "showCurrentAtPos") :
                    0), c);
                this._updateDatepicker(e)
            }
        },
        _gotoToday: function (a) {
            a = d(a);
            var b = this._getInst(a[0]);
            if (this._get(b, "gotoCurrent") && b.currentDay) {
                b.selectedDay = b.currentDay;
                b.drawMonth = b.selectedMonth = b.currentMonth;
                b.drawYear = b.selectedYear = b.currentYear
            } else {
                var c = new Date;
                b.selectedDay = c.getDate();
                b.drawMonth = b.selectedMonth = c.getMonth();
                b.drawYear = b.selectedYear = c.getFullYear()
            }
            this._notifyChange(b);
            this._adjustDate(a)
        },
        _selectMonthYear: function (a, b, c) {
            a = d(a);
            var e = this._getInst(a[0]);
            e["selected" + (c == "M" ?
                "Month" : "Year")] = e["draw" + (c == "M" ? "Month" : "Year")] = parseInt(b.options[b.selectedIndex].value, 10);
            this._notifyChange(e);
            this._adjustDate(a)
        },
        _selectDay: function (a, b, c, e) {
            var f = d(a);
            if (!(d(e).hasClass(this._unselectableClass) || this._isDisabledDatepicker(f[0]))) {
                f = this._getInst(f[0]);
                f.selectedDay = f.currentDay = d("a", e).html();
                f.selectedMonth = f.currentMonth = b;
                f.selectedYear = f.currentYear = c;
                this._selectDate(a, this._formatDate(f, f.currentDay, f.currentMonth, f.currentYear))
            }
        },
        _clearDate: function (a) {
            a = d(a);
            this._getInst(a[0]);
            this._selectDate(a, "")
        },
        _selectDate: function (a, b) {
            a = this._getInst(d(a)[0]);
            b = b != null ? b : this._formatDate(a);
            a.input && a.input.val(b);
            this._updateAlternate(a);
            var c = this._get(a, "onSelect");
            if (c) c.apply(a.input ? a.input[0] : null, [b, a]); else a.input && a.input.trigger("change");
            if (a.inline) this._updateDatepicker(a); else {
                this._hideDatepicker();
                this._lastInput = a.input[0];
                typeof a.input[0] != "object" && a.input.focus();
                this._lastInput = null
            }
        },
        _updateAlternate: function (a) {
            var b = this._get(a, "altField");
            if (b) {
                var c = this._get(a, "altFormat") || this._get(a, "dateFormat"), e = this._getDate(a),
                    f = this.formatDate(c, e, this._getFormatConfig(a));
                d(b).each(function () {
                    d(this).val(f)
                })
            }
        },
        noWeekends: function (a) {
            a = a.getDay();
            return [a > 0 && a < 6, ""]
        },
        iso8601Week: function (a) {
            a = new Date(a.getTime());
            a.setDate(a.getDate() + 4 - (a.getDay() || 7));
            var b = a.getTime();
            a.setMonth(0);
            a.setDate(1);
            return Math.floor(Math.round((b - a) / 864E5) / 7) + 1
        },
        parseDate: function (a, b, c) {
            if (a == null || b == null) throw"Invalid arguments";
            b = typeof b == "object" ?
                b.toString() : b + "";
            if (b == "") return null;
            var e = (c ? c.shortYearCutoff : null) || this._defaults.shortYearCutoff;
            e = typeof e != "string" ? e : (new Date).getFullYear() % 100 + parseInt(e, 10);
            for (var f = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort, h = (c ? c.dayNames : null) || this._defaults.dayNames, i = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort, g = (c ? c.monthNames : null) || this._defaults.monthNames, j = c = -1, l = -1, u = -1, k = false, o = function (p) {
                (p = A + 1 < a.length && a.charAt(A + 1) == p) && A++;
                return p
            }, m = function (p) {
                var D =
                    o(p);
                p = new RegExp("^\\d{1," + (p == "@" ? 14 : p == "!" ? 20 : p == "y" && D ? 4 : p == "o" ? 3 : 2) + "}");
                p = b.substring(q).match(p);
                if (!p) throw"Missing number at position " + q;
                q += p[0].length;
                return parseInt(p[0], 10)
            }, n = function (p, D, K) {
                p = d.map(o(p) ? K : D, function (w, x) {
                    return [[x, w]]
                }).sort(function (w, x) {
                    return -(w[1].length - x[1].length)
                });
                var E = -1;
                d.each(p, function (w, x) {
                    w = x[1];
                    if (b.substr(q, w.length).toLowerCase() == w.toLowerCase()) {
                        E = x[0];
                        q += w.length;
                        return false
                    }
                });
                if (E != -1) return E + 1; else throw"Unknown name at position " + q;
            }, s =
                function () {
                    if (b.charAt(q) != a.charAt(A)) throw"Unexpected literal at position " + q;
                    q++
                }, q = 0, A = 0; A < a.length; A++) if (k) if (a.charAt(A) == "'" && !o("'")) k = false; else s(); else switch (a.charAt(A)) {
                case "d":
                    l = m("d");
                    break;
                case "D":
                    n("D", f, h);
                    break;
                case "o":
                    u = m("o");
                    break;
                case "m":
                    j = m("m");
                    break;
                case "M":
                    j = n("M", i, g);
                    break;
                case "y":
                    c = m("y");
                    break;
                case "@":
                    var v = new Date(m("@"));
                    c = v.getFullYear();
                    j = v.getMonth() + 1;
                    l = v.getDate();
                    break;
                case "!":
                    v = new Date((m("!") - this._ticksTo1970) / 1E4);
                    c = v.getFullYear();
                    j = v.getMonth() +
                        1;
                    l = v.getDate();
                    break;
                case "'":
                    if (o("'")) s(); else k = true;
                    break;
                default:
                    s()
            }
            if (q < b.length) throw"Extra/unparsed characters found in date: " + b.substring(q);
            if (c == -1) c = (new Date).getFullYear(); else if (c < 100) c += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (c <= e ? 0 : -100);
            if (u > -1) {
                j = 1;
                l = u;
                do {
                    e = this._getDaysInMonth(c, j - 1);
                    if (l <= e) break;
                    j++;
                    l -= e
                } while (1)
            }
            v = this._daylightSavingAdjust(new Date(c, j - 1, l));
            if (v.getFullYear() != c || v.getMonth() + 1 != j || v.getDate() != l) throw"Invalid date";
            return v
        },
        ATOM: "yy-mm-dd",
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y",
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd",
        _ticksTo1970: (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 24 * 60 * 60 * 1E7,
        formatDate: function (a, b, c) {
            if (!b) return "";
            var e = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort,
                f = (c ? c.dayNames : null) || this._defaults.dayNames,
                h = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort;
            c = (c ? c.monthNames :
                null) || this._defaults.monthNames;
            var i = function (o) {
                (o = k + 1 < a.length && a.charAt(k + 1) == o) && k++;
                return o
            }, g = function (o, m, n) {
                m = "" + m;
                if (i(o)) for (; m.length < n;) m = "0" + m;
                return m
            }, j = function (o, m, n, s) {
                return i(o) ? s[m] : n[m]
            }, l = "", u = false;
            if (b) for (var k = 0; k < a.length; k++) if (u) if (a.charAt(k) == "'" && !i("'")) u = false; else l += a.charAt(k); else switch (a.charAt(k)) {
                case "d":
                    l += g("d", b.getDate(), 2);
                    break;
                case "D":
                    l += j("D", b.getDay(), e, f);
                    break;
                case "o":
                    l += g("o", Math.round(((new Date(b.getFullYear(), b.getMonth(), b.getDate())).getTime() -
                        (new Date(b.getFullYear(), 0, 0)).getTime()) / 864E5), 3);
                    break;
                case "m":
                    l += g("m", b.getMonth() + 1, 2);
                    break;
                case "M":
                    l += j("M", b.getMonth(), h, c);
                    break;
                case "y":
                    l += i("y") ? b.getFullYear() : (b.getYear() % 100 < 10 ? "0" : "") + b.getYear() % 100;
                    break;
                case "@":
                    l += b.getTime();
                    break;
                case "!":
                    l += b.getTime() * 1E4 + this._ticksTo1970;
                    break;
                case "'":
                    if (i("'")) l += "'"; else u = true;
                    break;
                default:
                    l += a.charAt(k)
            }
            return l
        },
        _possibleChars: function (a) {
            for (var b = "", c = false, e = function (h) {
                (h = f + 1 < a.length && a.charAt(f + 1) == h) && f++;
                return h
            }, f =
                0; f < a.length; f++) if (c) if (a.charAt(f) == "'" && !e("'")) c = false; else b += a.charAt(f); else switch (a.charAt(f)) {
                case "d":
                case "m":
                case "y":
                case "@":
                    b += "0123456789";
                    break;
                case "D":
                case "M":
                    return null;
                case "'":
                    if (e("'")) b += "'"; else c = true;
                    break;
                default:
                    b += a.charAt(f)
            }
            return b
        },
        _get: function (a, b) {
            return a.settings[b] !== C ? a.settings[b] : this._defaults[b]
        },
        _setDateFromField: function (a, b) {
            if (a.input.val() != a.lastVal) {
                var c = this._get(a, "dateFormat"), e = a.lastVal = a.input ? a.input.val() : null, f, h;
                f = h = this._getDefaultDate(a);
                var i = this._getFormatConfig(a);
                try {
                    f = this.parseDate(c, e, i) || h
                } catch (g) {
                    this.log(g);
                    e = b ? "" : e
                }
                a.selectedDay = f.getDate();
                a.drawMonth = a.selectedMonth = f.getMonth();
                a.drawYear = a.selectedYear = f.getFullYear();
                a.currentDay = e ? f.getDate() : 0;
                a.currentMonth = e ? f.getMonth() : 0;
                a.currentYear = e ? f.getFullYear() : 0;
                this._adjustInstDate(a)
            }
        },
        _getDefaultDate: function (a) {
            return this._restrictMinMax(a, this._determineDate(a, this._get(a, "defaultDate"), new Date))
        },
        _determineDate: function (a, b, c) {
            var e = function (h) {
                var i = new Date;
                i.setDate(i.getDate() + h);
                return i
            }, f = function (h) {
                try {
                    return d.datepicker.parseDate(d.datepicker._get(a, "dateFormat"), h, d.datepicker._getFormatConfig(a))
                } catch (i) {
                }
                var g = (h.toLowerCase().match(/^c/) ? d.datepicker._getDate(a) : null) || new Date,
                    j = g.getFullYear(), l = g.getMonth();
                g = g.getDate();
                for (var u = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, k = u.exec(h); k;) {
                    switch (k[2] || "d") {
                        case "d":
                        case "D":
                            g += parseInt(k[1], 10);
                            break;
                        case "w":
                        case "W":
                            g += parseInt(k[1], 10) * 7;
                            break;
                        case "m":
                        case "M":
                            l += parseInt(k[1], 10);
                            g =
                                Math.min(g, d.datepicker._getDaysInMonth(j, l));
                            break;
                        case "y":
                        case "Y":
                            j += parseInt(k[1], 10);
                            g = Math.min(g, d.datepicker._getDaysInMonth(j, l));
                            break
                    }
                    k = u.exec(h)
                }
                return new Date(j, l, g)
            };
            if (b = (b = b == null || b === "" ? c : typeof b == "string" ? f(b) : typeof b == "number" ? isNaN(b) ? c : e(b) : new Date(b.getTime())) && b.toString() == "Invalid Date" ? c : b) {
                b.setHours(0);
                b.setMinutes(0);
                b.setSeconds(0);
                b.setMilliseconds(0)
            }
            return this._daylightSavingAdjust(b)
        },
        _daylightSavingAdjust: function (a) {
            if (!a) return null;
            a.setHours(a.getHours() >
            12 ? a.getHours() + 2 : 0);
            return a
        },
        _setDate: function (a, b, c) {
            var e = !b, f = a.selectedMonth, h = a.selectedYear;
            b = this._restrictMinMax(a, this._determineDate(a, b, new Date));
            a.selectedDay = a.currentDay = b.getDate();
            a.drawMonth = a.selectedMonth = a.currentMonth = b.getMonth();
            a.drawYear = a.selectedYear = a.currentYear = b.getFullYear();
            if ((f != a.selectedMonth || h != a.selectedYear) && !c) this._notifyChange(a);
            this._adjustInstDate(a);
            if (a.input) a.input.val(e ? "" : this._formatDate(a))
        },
        _getDate: function (a) {
            return !a.currentYear || a.input &&
            a.input.val() == "" ? null : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay))
        },
        _generateHTML: function (a) {
            var b = new Date;
            b = this._daylightSavingAdjust(new Date(b.getFullYear(), b.getMonth(), b.getDate()));
            var c = this._get(a, "isRTL"), e = this._get(a, "showButtonPanel"), f = this._get(a, "hideIfNoPrevNext"),
                h = this._get(a, "navigationAsDateFormat"), i = this._getNumberOfMonths(a),
                g = this._get(a, "showCurrentAtPos"), j = this._get(a, "stepMonths"), l = i[0] != 1 || i[1] != 1,
                u = this._daylightSavingAdjust(!a.currentDay ?
                    new Date(9999, 9, 9) : new Date(a.currentYear, a.currentMonth, a.currentDay)),
                k = this._getMinMaxDate(a, "min"), o = this._getMinMaxDate(a, "max");
            g = a.drawMonth - g;
            var m = a.drawYear;
            if (g < 0) {
                g += 12;
                m--
            }
            if (o) {
                var n = this._daylightSavingAdjust(new Date(o.getFullYear(), o.getMonth() - i[0] * i[1] + 1, o.getDate()));
                for (n = k && n < k ? k : n; this._daylightSavingAdjust(new Date(m, g, 1)) > n;) {
                    g--;
                    if (g < 0) {
                        g = 11;
                        m--
                    }
                }
            }
            a.drawMonth = g;
            a.drawYear = m;
            n = this._get(a, "prevText");
            n = !h ? n : this.formatDate(n, this._daylightSavingAdjust(new Date(m, g - j, 1)), this._getFormatConfig(a));
            n = this._canAdjustMonth(a, -1, m, g) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + B + ".datepicker._adjustDate('#" + a.id + "', -" + j + ", 'M');\" title=\"" + n + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "e" : "w") + '">' + n + "</span></a>" : f ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + n + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "e" : "w") + '">' + n + "</span></a>";
            var s = this._get(a, "nextText");
            s = !h ? s : this.formatDate(s, this._daylightSavingAdjust(new Date(m,
                g + j, 1)), this._getFormatConfig(a));
            f = this._canAdjustMonth(a, +1, m, g) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + B + ".datepicker._adjustDate('#" + a.id + "', +" + j + ", 'M');\" title=\"" + s + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "w" : "e") + '">' + s + "</span></a>" : f ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + s + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "w" : "e") + '">' + s + "</span></a>";
            j = this._get(a, "currentText");
            s = this._get(a, "gotoCurrent") &&
            a.currentDay ? u : b;
            j = !h ? j : this.formatDate(j, s, this._getFormatConfig(a));
            h = !a.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + B + '.datepicker._hideDatepicker();">' + this._get(a, "closeText") + "</button>" : "";
            e = e ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (c ? h : "") + (this._isInRange(a, s) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_' +
                B + ".datepicker._gotoToday('#" + a.id + "');\">" + j + "</button>" : "") + (c ? "" : h) + "</div>" : "";
            h = parseInt(this._get(a, "firstDay"), 10);
            h = isNaN(h) ? 0 : h;
            j = this._get(a, "showWeek");
            s = this._get(a, "dayNames");
            this._get(a, "dayNamesShort");
            var q = this._get(a, "dayNamesMin"), A = this._get(a, "monthNames"), v = this._get(a, "monthNamesShort"),
                p = this._get(a, "beforeShowDay"), D = this._get(a, "showOtherMonths"),
                K = this._get(a, "selectOtherMonths");
            this._get(a, "calculateWeek");
            for (var E = this._getDefaultDate(a), w = "", x = 0; x < i[0]; x++) {
                var O =
                    "";
                this.maxRows = 4;
                for (var G = 0; G < i[1]; G++) {
                    var P = this._daylightSavingAdjust(new Date(m, g, a.selectedDay)), t = " ui-corner-all", y = "";
                    if (l) {
                        y += '<div class="ui-datepicker-group';
                        if (i[1] > 1) switch (G) {
                            case 0:
                                y += " ui-datepicker-group-first";
                                t = " ui-corner-" + (c ? "right" : "left");
                                break;
                            case i[1] - 1:
                                y += " ui-datepicker-group-last";
                                t = " ui-corner-" + (c ? "left" : "right");
                                break;
                            default:
                                y += " ui-datepicker-group-middle";
                                t = "";
                                break
                        }
                        y += '">'
                    }
                    y += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + t + '">' + (/all|left/.test(t) &&
                    x == 0 ? c ? f : n : "") + (/all|right/.test(t) && x == 0 ? c ? n : f : "") + this._generateMonthYearHeader(a, g, m, k, o, x > 0 || G > 0, A, v) + '</div><table class="ui-datepicker-calendar"><thead><tr>';
                    var z = j ? '<th class="ui-datepicker-week-col">' + this._get(a, "weekHeader") + "</th>" : "";
                    for (t = 0; t < 7; t++) {
                        var r = (t + h) % 7;
                        z += "<th" + ((t + h + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : "") + '><span title="' + s[r] + '">' + q[r] + "</span></th>"
                    }
                    y += z + "</tr></thead><tbody>";
                    z = this._getDaysInMonth(m, g);
                    if (m == a.selectedYear && g == a.selectedMonth) a.selectedDay = Math.min(a.selectedDay,
                        z);
                    t = (this._getFirstDayOfMonth(m, g) - h + 7) % 7;
                    z = Math.ceil((t + z) / 7);
                    this.maxRows = z = l ? this.maxRows > z ? this.maxRows : z : z;
                    r = this._daylightSavingAdjust(new Date(m, g, 1 - t));
                    for (var Q = 0; Q < z; Q++) {
                        y += "<tr>";
                        var R = !j ? "" : '<td class="ui-datepicker-week-col">' + this._get(a, "calculateWeek")(r) + "</td>";
                        for (t = 0; t < 7; t++) {
                            var I = p ? p.apply(a.input ? a.input[0] : null, [r]) : [true, ""], F = r.getMonth() != g,
                                L = F && !K || !I[0] || k && r < k || o && r > o;
                            R += '<td class="' + ((t + h + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (F ? " ui-datepicker-other-month" : "") + (r.getTime() ==
                            P.getTime() && g == a.selectedMonth && a._keyEvent || E.getTime() == r.getTime() && E.getTime() == P.getTime() ? " " + this._dayOverClass : "") + (L ? " " + this._unselectableClass + " ui-state-disabled" : "") + (F && !D ? "" : " " + I[1] + (r.getTime() == u.getTime() ? " " + this._currentClass : "") + (r.getTime() == b.getTime() ? " ui-datepicker-today" : "")) + '"' + ((!F || D) && I[2] ? ' title="' + I[2] + '"' : "") + (L ? "" : ' onclick="DP_jQuery_' + B + ".datepicker._selectDay('#" + a.id + "'," + r.getMonth() + "," + r.getFullYear() + ', this);return false;"') + ">" + (F && !D ? "&#xa0;" : L ? '<span class="ui-state-default">' +
                                r.getDate() + "</span>" : '<a class="ui-state-default' + (r.getTime() == b.getTime() ? " ui-state-highlight" : "") + (r.getTime() == u.getTime() ? " ui-state-active" : "") + (F ? " ui-priority-secondary" : "") + '" href="#">' + r.getDate() + "</a>") + "</td>";
                            r.setDate(r.getDate() + 1);
                            r = this._daylightSavingAdjust(r)
                        }
                        y += R + "</tr>"
                    }
                    g++;
                    if (g > 11) {
                        g = 0;
                        m++
                    }
                    y += "</tbody></table>" + (l ? "</div>" + (i[0] > 0 && G == i[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : "");
                    O += y
                }
                w += O
            }
            w += e + (d.browser.msie && parseInt(d.browser.version, 10) < 7 && !a.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' :
                "");
            a._keyEvent = false;
            return w
        },
        _generateMonthYearHeader: function (a, b, c, e, f, h, i, g) {
            var j = this._get(a, "changeMonth"), l = this._get(a, "changeYear"), u = this._get(a, "showMonthAfterYear"),
                k = '<div class="ui-datepicker-title">', o = "";
            if (h || !j) o += '<span class="ui-datepicker-month">' + i[b] + "</span>"; else {
                i = e && e.getFullYear() == c;
                var m = f && f.getFullYear() == c;
                o += '<select class="ui-datepicker-month" onchange="DP_jQuery_' + B + ".datepicker._selectMonthYear('#" + a.id + "', this, 'M');\" >";
                for (var n = 0; n < 12; n++) if ((!i || n >= e.getMonth()) &&
                    (!m || n <= f.getMonth())) o += '<option value="' + n + '"' + (n == b ? ' selected="selected"' : "") + ">" + g[n] + "</option>";
                o += "</select>"
            }
            u || (k += o + (h || !(j && l) ? "&#xa0;" : ""));
            if (!a.yearshtml) {
                a.yearshtml = "";
                if (h || !l) k += '<span class="ui-datepicker-year">' + c + "</span>"; else {
                    g = this._get(a, "yearRange").split(":");
                    var s = (new Date).getFullYear();
                    i = function (q) {
                        q = q.match(/c[+-].*/) ? c + parseInt(q.substring(1), 10) : q.match(/[+-].*/) ? s + parseInt(q, 10) : parseInt(q, 10);
                        return isNaN(q) ? s : q
                    };
                    b = i(g[0]);
                    g = Math.max(b, i(g[1] || ""));
                    b = e ? Math.max(b,
                        e.getFullYear()) : b;
                    g = f ? Math.min(g, f.getFullYear()) : g;
                    for (a.yearshtml += '<select class="ui-datepicker-year" onchange="DP_jQuery_' + B + ".datepicker._selectMonthYear('#" + a.id + "', this, 'Y');\" >"; b <= g; b++) a.yearshtml += '<option value="' + b + '"' + (b == c ? ' selected="selected"' : "") + ">" + b + "</option>";
                    a.yearshtml += "</select>";
                    k += a.yearshtml;
                    a.yearshtml = null
                }
            }
            k += this._get(a, "yearSuffix");
            if (u) k += (h || !(j && l) ? "&#xa0;" : "") + o;
            k += "</div>";
            return k
        },
        _adjustInstDate: function (a, b, c) {
            var e = a.drawYear + (c == "Y" ? b : 0), f = a.drawMonth +
                (c == "M" ? b : 0);
            b = Math.min(a.selectedDay, this._getDaysInMonth(e, f)) + (c == "D" ? b : 0);
            e = this._restrictMinMax(a, this._daylightSavingAdjust(new Date(e, f, b)));
            a.selectedDay = e.getDate();
            a.drawMonth = a.selectedMonth = e.getMonth();
            a.drawYear = a.selectedYear = e.getFullYear();
            if (c == "M" || c == "Y") this._notifyChange(a)
        },
        _restrictMinMax: function (a, b) {
            var c = this._getMinMaxDate(a, "min");
            a = this._getMinMaxDate(a, "max");
            b = c && b < c ? c : b;
            return b = a && b > a ? a : b
        },
        _notifyChange: function (a) {
            var b = this._get(a, "onChangeMonthYear");
            if (b) b.apply(a.input ?
                a.input[0] : null, [a.selectedYear, a.selectedMonth + 1, a])
        },
        _getNumberOfMonths: function (a) {
            a = this._get(a, "numberOfMonths");
            return a == null ? [1, 1] : typeof a == "number" ? [1, a] : a
        },
        _getMinMaxDate: function (a, b) {
            return this._determineDate(a, this._get(a, b + "Date"), null)
        },
        _getDaysInMonth: function (a, b) {
            return 32 - this._daylightSavingAdjust(new Date(a, b, 32)).getDate()
        },
        _getFirstDayOfMonth: function (a, b) {
            return (new Date(a, b, 1)).getDay()
        },
        _canAdjustMonth: function (a, b, c, e) {
            var f = this._getNumberOfMonths(a);
            c = this._daylightSavingAdjust(new Date(c,
                e + (b < 0 ? b : f[0] * f[1]), 1));
            b < 0 && c.setDate(this._getDaysInMonth(c.getFullYear(), c.getMonth()));
            return this._isInRange(a, c)
        },
        _isInRange: function (a, b) {
            var c = this._getMinMaxDate(a, "min");
            a = this._getMinMaxDate(a, "max");
            return (!c || b.getTime() >= c.getTime()) && (!a || b.getTime() <= a.getTime())
        },
        _getFormatConfig: function (a) {
            var b = this._get(a, "shortYearCutoff");
            b = typeof b != "string" ? b : (new Date).getFullYear() % 100 + parseInt(b, 10);
            return {
                shortYearCutoff: b,
                dayNamesShort: this._get(a, "dayNamesShort"),
                dayNames: this._get(a,
                    "dayNames"),
                monthNamesShort: this._get(a, "monthNamesShort"),
                monthNames: this._get(a, "monthNames")
            }
        },
        _formatDate: function (a, b, c, e) {
            if (!b) {
                a.currentDay = a.selectedDay;
                a.currentMonth = a.selectedMonth;
                a.currentYear = a.selectedYear
            }
            b = b ? typeof b == "object" ? b : this._daylightSavingAdjust(new Date(e, c, b)) : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay));
            return this.formatDate(this._get(a, "dateFormat"), b, this._getFormatConfig(a))
        }
    });
    d.fn.datepicker = function (a) {
        if (!this.length) return this;
        if (!d.datepicker.initialized) {
            d(document).mousedown(d.datepicker._checkExternalClick).find("body").append(d.datepicker.dpDiv);
            d.datepicker.initialized = true
        }
        var b = Array.prototype.slice.call(arguments, 1);
        if (typeof a == "string" && (a == "isDisabled" || a == "getDate" || a == "widget")) return d.datepicker["_" + a + "Datepicker"].apply(d.datepicker, [this[0]].concat(b));
        if (a == "option" && arguments.length == 2 && typeof arguments[1] == "string") return d.datepicker["_" + a + "Datepicker"].apply(d.datepicker, [this[0]].concat(b));
        return this.each(function () {
            typeof a ==
            "string" ? d.datepicker["_" + a + "Datepicker"].apply(d.datepicker, [this].concat(b)) : d.datepicker._attachDatepicker(this, a)
        })
    };
    d.datepicker = new M;
    d.datepicker.initialized = false;
    d.datepicker.uuid = (new Date).getTime();
    d.datepicker.version = "1.8.16";
    window["DP_jQuery_" + B] = d
})(jQuery);
;
/*
 * jQuery UI Progressbar 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function (b, d) {
    b.widget("ui.progressbar", {
        options: {value: 0, max: 100}, min: 0, _create: function () {
            this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({
                role: "progressbar",
                "aria-valuemin": this.min,
                "aria-valuemax": this.options.max,
                "aria-valuenow": this._value()
            });
            this.valueDiv = b("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);
            this.oldValue = this._value();
            this._refreshValue()
        }, destroy: function () {
            this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
            this.valueDiv.remove();
            b.Widget.prototype.destroy.apply(this, arguments)
        }, value: function (a) {
            if (a === d) return this._value();
            this._setOption("value", a);
            return this
        }, _setOption: function (a, c) {
            if (a === "value") {
                this.options.value = c;
                this._refreshValue();
                this._value() === this.options.max && this._trigger("complete")
            }
            b.Widget.prototype._setOption.apply(this, arguments)
        }, _value: function () {
            var a = this.options.value;
            if (typeof a !== "number") a = 0;
            return Math.min(this.options.max, Math.max(this.min, a))
        }, _percentage: function () {
            return 100 *
                this._value() / this.options.max
        }, _refreshValue: function () {
            var a = this.value(), c = this._percentage();
            if (this.oldValue !== a) {
                this.oldValue = a;
                this._trigger("change")
            }
            this.valueDiv.toggle(a > this.min).toggleClass("ui-corner-right", a === this.options.max).width(c.toFixed(0) + "%");
            this.element.attr("aria-valuenow", a)
        }
    });
    b.extend(b.ui.progressbar, {version: "1.8.16"})
})(jQuery);
;
/*
 * jQuery UI Effects 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/
 */
jQuery.effects || function (f, j) {
    function m(c) {
        var a;
        if (c && c.constructor == Array && c.length == 3) return c;
        if (a = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(c)) return [parseInt(a[1], 10), parseInt(a[2], 10), parseInt(a[3], 10)];
        if (a = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(c)) return [parseFloat(a[1]) * 2.55, parseFloat(a[2]) * 2.55, parseFloat(a[3]) * 2.55];
        if (a = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(c)) return [parseInt(a[1],
            16), parseInt(a[2], 16), parseInt(a[3], 16)];
        if (a = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(c)) return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)];
        if (/rgba\(0, 0, 0, 0\)/.exec(c)) return n.transparent;
        return n[f.trim(c).toLowerCase()]
    }

    function s(c, a) {
        var b;
        do {
            b = f.curCSS(c, a);
            if (b != "" && b != "transparent" || f.nodeName(c, "body")) break;
            a = "backgroundColor"
        } while (c = c.parentNode);
        return m(b)
    }

    function o() {
        var c = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle,
            a = {}, b, d;
        if (c && c.length && c[0] && c[c[0]]) for (var e = c.length; e--;) {
            b = c[e];
            if (typeof c[b] == "string") {
                d = b.replace(/\-(\w)/g, function (g, h) {
                    return h.toUpperCase()
                });
                a[d] = c[b]
            }
        } else for (b in c) if (typeof c[b] === "string") a[b] = c[b];
        return a
    }

    function p(c) {
        var a, b;
        for (a in c) {
            b = c[a];
            if (b == null || f.isFunction(b) || a in t || /scrollbar/.test(a) || !/color/i.test(a) && isNaN(parseFloat(b))) delete c[a]
        }
        return c
    }

    function u(c, a) {
        var b = {_: 0}, d;
        for (d in a) if (c[d] != a[d]) b[d] = a[d];
        return b
    }

    function k(c, a, b, d) {
        if (typeof c == "object") {
            d =
                a;
            b = null;
            a = c;
            c = a.effect
        }
        if (f.isFunction(a)) {
            d = a;
            b = null;
            a = {}
        }
        if (typeof a == "number" || f.fx.speeds[a]) {
            d = b;
            b = a;
            a = {}
        }
        if (f.isFunction(b)) {
            d = b;
            b = null
        }
        a = a || {};
        b = b || a.duration;
        b = f.fx.off ? 0 : typeof b == "number" ? b : b in f.fx.speeds ? f.fx.speeds[b] : f.fx.speeds._default;
        d = d || a.complete;
        return [c, a, b, d]
    }

    function l(c) {
        if (!c || typeof c === "number" || f.fx.speeds[c]) return true;
        if (typeof c === "string" && !f.effects[c]) return true;
        return false
    }

    f.effects = {};
    f.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor",
        "borderTopColor", "borderColor", "color", "outlineColor"], function (c, a) {
        f.fx.step[a] = function (b) {
            if (!b.colorInit) {
                b.start = s(b.elem, a);
                b.end = m(b.end);
                b.colorInit = true
            }
            b.elem.style[a] = "rgb(" + Math.max(Math.min(parseInt(b.pos * (b.end[0] - b.start[0]) + b.start[0], 10), 255), 0) + "," + Math.max(Math.min(parseInt(b.pos * (b.end[1] - b.start[1]) + b.start[1], 10), 255), 0) + "," + Math.max(Math.min(parseInt(b.pos * (b.end[2] - b.start[2]) + b.start[2], 10), 255), 0) + ")"
        }
    });
    var n = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0,
            0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211,
            211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0],
        transparent: [255, 255, 255]
    }, q = ["add", "remove", "toggle"], t = {
        border: 1,
        borderBottom: 1,
        borderColor: 1,
        borderLeft: 1,
        borderRight: 1,
        borderTop: 1,
        borderWidth: 1,
        margin: 1,
        padding: 1
    };
    f.effects.animateClass = function (c, a, b,
                                       d) {
        if (f.isFunction(b)) {
            d = b;
            b = null
        }
        return this.queue(function () {
            var e = f(this), g = e.attr("style") || " ", h = p(o.call(this)), r, v = e.attr("class");
            f.each(q, function (w, i) {
                c[i] && e[i + "Class"](c[i])
            });
            r = p(o.call(this));
            e.attr("class", v);
            e.animate(u(h, r), {
                queue: false, duration: a, easing: b, complete: function () {
                    f.each(q, function (w, i) {
                        c[i] && e[i + "Class"](c[i])
                    });
                    if (typeof e.attr("style") == "object") {
                        e.attr("style").cssText = "";
                        e.attr("style").cssText = g
                    } else e.attr("style", g);
                    d && d.apply(this, arguments);
                    f.dequeue(this)
                }
            })
        })
    };
    f.fn.extend({
        _addClass: f.fn.addClass, addClass: function (c, a, b, d) {
            return a ? f.effects.animateClass.apply(this, [{add: c}, a, b, d]) : this._addClass(c)
        }, _removeClass: f.fn.removeClass, removeClass: function (c, a, b, d) {
            return a ? f.effects.animateClass.apply(this, [{remove: c}, a, b, d]) : this._removeClass(c)
        }, _toggleClass: f.fn.toggleClass, toggleClass: function (c, a, b, d, e) {
            return typeof a == "boolean" || a === j ? b ? f.effects.animateClass.apply(this, [a ? {add: c} : {remove: c}, b, d, e]) : this._toggleClass(c, a) : f.effects.animateClass.apply(this,
                [{toggle: c}, a, b, d])
        }, switchClass: function (c, a, b, d, e) {
            return f.effects.animateClass.apply(this, [{add: a, remove: c}, b, d, e])
        }
    });
    f.extend(f.effects, {
        version: "1.8.16", save: function (c, a) {
            for (var b = 0; b < a.length; b++) a[b] !== null && c.data("ec.storage." + a[b], c[0].style[a[b]])
        }, restore: function (c, a) {
            for (var b = 0; b < a.length; b++) a[b] !== null && c.css(a[b], c.data("ec.storage." + a[b]))
        }, setMode: function (c, a) {
            if (a == "toggle") a = c.is(":hidden") ? "show" : "hide";
            return a
        }, getBaseline: function (c, a) {
            var b;
            switch (c[0]) {
                case "top":
                    b =
                        0;
                    break;
                case "middle":
                    b = 0.5;
                    break;
                case "bottom":
                    b = 1;
                    break;
                default:
                    b = c[0] / a.height
            }
            switch (c[1]) {
                case "left":
                    c = 0;
                    break;
                case "center":
                    c = 0.5;
                    break;
                case "right":
                    c = 1;
                    break;
                default:
                    c = c[1] / a.width
            }
            return {x: c, y: b}
        }, createWrapper: function (c) {
            if (c.parent().is(".ui-effects-wrapper")) return c.parent();
            var a = {width: c.outerWidth(true), height: c.outerHeight(true), "float": c.css("float")},
                b = f("<div></div>").addClass("ui-effects-wrapper").css({
                    fontSize: "100%",
                    background: "transparent",
                    border: "none",
                    margin: 0,
                    padding: 0
                }),
                d = document.activeElement;
            c.wrap(b);
            if (c[0] === d || f.contains(c[0], d)) f(d).focus();
            b = c.parent();
            if (c.css("position") == "static") {
                b.css({position: "relative"});
                c.css({position: "relative"})
            } else {
                f.extend(a, {position: c.css("position"), zIndex: c.css("z-index")});
                f.each(["top", "left", "bottom", "right"], function (e, g) {
                    a[g] = c.css(g);
                    if (isNaN(parseInt(a[g], 10))) a[g] = "auto"
                });
                c.css({position: "relative", top: 0, left: 0, right: "auto", bottom: "auto"})
            }
            return b.css(a).show()
        }, removeWrapper: function (c) {
            var a, b = document.activeElement;
            if (c.parent().is(".ui-effects-wrapper")) {
                a = c.parent().replaceWith(c);
                if (c[0] === b || f.contains(c[0], b)) f(b).focus();
                return a
            }
            return c
        }, setTransition: function (c, a, b, d) {
            d = d || {};
            f.each(a, function (e, g) {
                unit = c.cssUnit(g);
                if (unit[0] > 0) d[g] = unit[0] * b + unit[1]
            });
            return d
        }
    });
    f.fn.extend({
        effect: function (c) {
            var a = k.apply(this, arguments), b = {options: a[1], duration: a[2], callback: a[3]};
            a = b.options.mode;
            var d = f.effects[c];
            if (f.fx.off || !d) return a ? this[a](b.duration, b.callback) : this.each(function () {
                b.callback && b.callback.call(this)
            });
            return d.call(this, b)
        }, _show: f.fn.show, show: function (c) {
            if (l(c)) return this._show.apply(this, arguments); else {
                var a = k.apply(this, arguments);
                a[1].mode = "show";
                return this.effect.apply(this, a)
            }
        }, _hide: f.fn.hide, hide: function (c) {
            if (l(c)) return this._hide.apply(this, arguments); else {
                var a = k.apply(this, arguments);
                a[1].mode = "hide";
                return this.effect.apply(this, a)
            }
        }, __toggle: f.fn.toggle, toggle: function (c) {
            if (l(c) || typeof c === "boolean" || f.isFunction(c)) return this.__toggle.apply(this, arguments); else {
                var a = k.apply(this,
                    arguments);
                a[1].mode = "toggle";
                return this.effect.apply(this, a)
            }
        }, cssUnit: function (c) {
            var a = this.css(c), b = [];
            f.each(["em", "px", "%", "pt"], function (d, e) {
                if (a.indexOf(e) > 0) b = [parseFloat(a), e]
            });
            return b
        }
    });
    f.easing.jswing = f.easing.swing;
    f.extend(f.easing, {
        def: "easeOutQuad", swing: function (c, a, b, d, e) {
            return f.easing[f.easing.def](c, a, b, d, e)
        }, easeInQuad: function (c, a, b, d, e) {
            return d * (a /= e) * a + b
        }, easeOutQuad: function (c, a, b, d, e) {
            return -d * (a /= e) * (a - 2) + b
        }, easeInOutQuad: function (c, a, b, d, e) {
            if ((a /= e / 2) < 1) return d /
                2 * a * a + b;
            return -d / 2 * (--a * (a - 2) - 1) + b
        }, easeInCubic: function (c, a, b, d, e) {
            return d * (a /= e) * a * a + b
        }, easeOutCubic: function (c, a, b, d, e) {
            return d * ((a = a / e - 1) * a * a + 1) + b
        }, easeInOutCubic: function (c, a, b, d, e) {
            if ((a /= e / 2) < 1) return d / 2 * a * a * a + b;
            return d / 2 * ((a -= 2) * a * a + 2) + b
        }, easeInQuart: function (c, a, b, d, e) {
            return d * (a /= e) * a * a * a + b
        }, easeOutQuart: function (c, a, b, d, e) {
            return -d * ((a = a / e - 1) * a * a * a - 1) + b
        }, easeInOutQuart: function (c, a, b, d, e) {
            if ((a /= e / 2) < 1) return d / 2 * a * a * a * a + b;
            return -d / 2 * ((a -= 2) * a * a * a - 2) + b
        }, easeInQuint: function (c, a, b,
                                  d, e) {
            return d * (a /= e) * a * a * a * a + b
        }, easeOutQuint: function (c, a, b, d, e) {
            return d * ((a = a / e - 1) * a * a * a * a + 1) + b
        }, easeInOutQuint: function (c, a, b, d, e) {
            if ((a /= e / 2) < 1) return d / 2 * a * a * a * a * a + b;
            return d / 2 * ((a -= 2) * a * a * a * a + 2) + b
        }, easeInSine: function (c, a, b, d, e) {
            return -d * Math.cos(a / e * (Math.PI / 2)) + d + b
        }, easeOutSine: function (c, a, b, d, e) {
            return d * Math.sin(a / e * (Math.PI / 2)) + b
        }, easeInOutSine: function (c, a, b, d, e) {
            return -d / 2 * (Math.cos(Math.PI * a / e) - 1) + b
        }, easeInExpo: function (c, a, b, d, e) {
            return a == 0 ? b : d * Math.pow(2, 10 * (a / e - 1)) + b
        }, easeOutExpo: function (c,
                                  a, b, d, e) {
            return a == e ? b + d : d * (-Math.pow(2, -10 * a / e) + 1) + b
        }, easeInOutExpo: function (c, a, b, d, e) {
            if (a == 0) return b;
            if (a == e) return b + d;
            if ((a /= e / 2) < 1) return d / 2 * Math.pow(2, 10 * (a - 1)) + b;
            return d / 2 * (-Math.pow(2, -10 * --a) + 2) + b
        }, easeInCirc: function (c, a, b, d, e) {
            return -d * (Math.sqrt(1 - (a /= e) * a) - 1) + b
        }, easeOutCirc: function (c, a, b, d, e) {
            return d * Math.sqrt(1 - (a = a / e - 1) * a) + b
        }, easeInOutCirc: function (c, a, b, d, e) {
            if ((a /= e / 2) < 1) return -d / 2 * (Math.sqrt(1 - a * a) - 1) + b;
            return d / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b
        }, easeInElastic: function (c, a, b,
                                    d, e) {
            c = 1.70158;
            var g = 0, h = d;
            if (a == 0) return b;
            if ((a /= e) == 1) return b + d;
            g || (g = e * 0.3);
            if (h < Math.abs(d)) {
                h = d;
                c = g / 4
            } else c = g / (2 * Math.PI) * Math.asin(d / h);
            return -(h * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * e - c) * 2 * Math.PI / g)) + b
        }, easeOutElastic: function (c, a, b, d, e) {
            c = 1.70158;
            var g = 0, h = d;
            if (a == 0) return b;
            if ((a /= e) == 1) return b + d;
            g || (g = e * 0.3);
            if (h < Math.abs(d)) {
                h = d;
                c = g / 4
            } else c = g / (2 * Math.PI) * Math.asin(d / h);
            return h * Math.pow(2, -10 * a) * Math.sin((a * e - c) * 2 * Math.PI / g) + d + b
        }, easeInOutElastic: function (c, a, b, d, e) {
            c = 1.70158;
            var g =
                0, h = d;
            if (a == 0) return b;
            if ((a /= e / 2) == 2) return b + d;
            g || (g = e * 0.3 * 1.5);
            if (h < Math.abs(d)) {
                h = d;
                c = g / 4
            } else c = g / (2 * Math.PI) * Math.asin(d / h);
            if (a < 1) return -0.5 * h * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * e - c) * 2 * Math.PI / g) + b;
            return h * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * e - c) * 2 * Math.PI / g) * 0.5 + d + b
        }, easeInBack: function (c, a, b, d, e, g) {
            if (g == j) g = 1.70158;
            return d * (a /= e) * a * ((g + 1) * a - g) + b
        }, easeOutBack: function (c, a, b, d, e, g) {
            if (g == j) g = 1.70158;
            return d * ((a = a / e - 1) * a * ((g + 1) * a + g) + 1) + b
        }, easeInOutBack: function (c, a, b, d, e, g) {
            if (g == j) g = 1.70158;
            if ((a /= e / 2) < 1) return d / 2 * a * a * (((g *= 1.525) + 1) * a - g) + b;
            return d / 2 * ((a -= 2) * a * (((g *= 1.525) + 1) * a + g) + 2) + b
        }, easeInBounce: function (c, a, b, d, e) {
            return d - f.easing.easeOutBounce(c, e - a, 0, d, e) + b
        }, easeOutBounce: function (c, a, b, d, e) {
            return (a /= e) < 1 / 2.75 ? d * 7.5625 * a * a + b : a < 2 / 2.75 ? d * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + b : a < 2.5 / 2.75 ? d * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + b : d * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + b
        }, easeInOutBounce: function (c, a, b, d, e) {
            if (a < e / 2) return f.easing.easeInBounce(c, a * 2, 0, d, e) * 0.5 + b;
            return f.easing.easeOutBounce(c,
                a * 2 - e, 0, d, e) * 0.5 + d * 0.5 + b
        }
    })
}(jQuery);
;
/*
 * jQuery UI Effects Blind 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Blind
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (b) {
    b.effects.blind = function (c) {
        return this.queue(function () {
            var a = b(this), g = ["position", "top", "bottom", "left", "right"],
                f = b.effects.setMode(a, c.options.mode || "hide"), d = c.options.direction || "vertical";
            b.effects.save(a, g);
            a.show();
            var e = b.effects.createWrapper(a).css({overflow: "hidden"}), h = d == "vertical" ? "height" : "width";
            d = d == "vertical" ? e.height() : e.width();
            f == "show" && e.css(h, 0);
            var i = {};
            i[h] = f == "show" ? d : 0;
            e.animate(i, c.duration, c.options.easing, function () {
                f == "hide" && a.hide();
                b.effects.restore(a,
                    g);
                b.effects.removeWrapper(a);
                c.callback && c.callback.apply(a[0], arguments);
                a.dequeue()
            })
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Bounce 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Bounce
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (e) {
    e.effects.bounce = function (b) {
        return this.queue(function () {
            var a = e(this), l = ["position", "top", "bottom", "left", "right"],
                h = e.effects.setMode(a, b.options.mode || "effect"), d = b.options.direction || "up",
                c = b.options.distance || 20, m = b.options.times || 5, i = b.duration || 250;
            /show|hide/.test(h) && l.push("opacity");
            e.effects.save(a, l);
            a.show();
            e.effects.createWrapper(a);
            var f = d == "up" || d == "down" ? "top" : "left";
            d = d == "up" || d == "left" ? "pos" : "neg";
            c = b.options.distance || (f == "top" ? a.outerHeight({margin: true}) / 3 : a.outerWidth({margin: true}) /
                3);
            if (h == "show") a.css("opacity", 0).css(f, d == "pos" ? -c : c);
            if (h == "hide") c /= m * 2;
            h != "hide" && m--;
            if (h == "show") {
                var g = {opacity: 1};
                g[f] = (d == "pos" ? "+=" : "-=") + c;
                a.animate(g, i / 2, b.options.easing);
                c /= 2;
                m--
            }
            for (g = 0; g < m; g++) {
                var j = {}, k = {};
                j[f] = (d == "pos" ? "-=" : "+=") + c;
                k[f] = (d == "pos" ? "+=" : "-=") + c;
                a.animate(j, i / 2, b.options.easing).animate(k, i / 2, b.options.easing);
                c = h == "hide" ? c * 2 : c / 2
            }
            if (h == "hide") {
                g = {opacity: 0};
                g[f] = (d == "pos" ? "-=" : "+=") + c;
                a.animate(g, i / 2, b.options.easing, function () {
                    a.hide();
                    e.effects.restore(a, l);
                    e.effects.removeWrapper(a);
                    b.callback && b.callback.apply(this, arguments)
                })
            } else {
                j = {};
                k = {};
                j[f] = (d == "pos" ? "-=" : "+=") + c;
                k[f] = (d == "pos" ? "+=" : "-=") + c;
                a.animate(j, i / 2, b.options.easing).animate(k, i / 2, b.options.easing, function () {
                    e.effects.restore(a, l);
                    e.effects.removeWrapper(a);
                    b.callback && b.callback.apply(this, arguments)
                })
            }
            a.queue("fx", function () {
                a.dequeue()
            });
            a.dequeue()
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Clip 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Clip
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (b) {
    b.effects.clip = function (e) {
        return this.queue(function () {
            var a = b(this), i = ["position", "top", "bottom", "left", "right", "height", "width"],
                f = b.effects.setMode(a, e.options.mode || "hide"), c = e.options.direction || "vertical";
            b.effects.save(a, i);
            a.show();
            var d = b.effects.createWrapper(a).css({overflow: "hidden"});
            d = a[0].tagName == "IMG" ? d : a;
            var g = {size: c == "vertical" ? "height" : "width", position: c == "vertical" ? "top" : "left"};
            c = c == "vertical" ? d.height() : d.width();
            if (f == "show") {
                d.css(g.size, 0);
                d.css(g.position,
                    c / 2)
            }
            var h = {};
            h[g.size] = f == "show" ? c : 0;
            h[g.position] = f == "show" ? 0 : c / 2;
            d.animate(h, {
                queue: false, duration: e.duration, easing: e.options.easing, complete: function () {
                    f == "hide" && a.hide();
                    b.effects.restore(a, i);
                    b.effects.removeWrapper(a);
                    e.callback && e.callback.apply(a[0], arguments);
                    a.dequeue()
                }
            })
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Drop 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Drop
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (c) {
    c.effects.drop = function (d) {
        return this.queue(function () {
            var a = c(this), h = ["position", "top", "bottom", "left", "right", "opacity"],
                e = c.effects.setMode(a, d.options.mode || "hide"), b = d.options.direction || "left";
            c.effects.save(a, h);
            a.show();
            c.effects.createWrapper(a);
            var f = b == "up" || b == "down" ? "top" : "left";
            b = b == "up" || b == "left" ? "pos" : "neg";
            var g = d.options.distance || (f == "top" ? a.outerHeight({margin: true}) / 2 : a.outerWidth({margin: true}) / 2);
            if (e == "show") a.css("opacity", 0).css(f, b == "pos" ? -g : g);
            var i = {
                opacity: e ==
                "show" ? 1 : 0
            };
            i[f] = (e == "show" ? b == "pos" ? "+=" : "-=" : b == "pos" ? "-=" : "+=") + g;
            a.animate(i, {
                queue: false, duration: d.duration, easing: d.options.easing, complete: function () {
                    e == "hide" && a.hide();
                    c.effects.restore(a, h);
                    c.effects.removeWrapper(a);
                    d.callback && d.callback.apply(this, arguments);
                    a.dequeue()
                }
            })
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Explode 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Explode
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (j) {
    j.effects.explode = function (a) {
        return this.queue(function () {
            var c = a.options.pieces ? Math.round(Math.sqrt(a.options.pieces)) : 3,
                d = a.options.pieces ? Math.round(Math.sqrt(a.options.pieces)) : 3;
            a.options.mode = a.options.mode == "toggle" ? j(this).is(":visible") ? "hide" : "show" : a.options.mode;
            var b = j(this).show().css("visibility", "hidden"), g = b.offset();
            g.top -= parseInt(b.css("marginTop"), 10) || 0;
            g.left -= parseInt(b.css("marginLeft"), 10) || 0;
            for (var h = b.outerWidth(true), i = b.outerHeight(true), e = 0; e < c; e++) for (var f =
                0; f < d; f++) b.clone().appendTo("body").wrap("<div></div>").css({
                position: "absolute",
                visibility: "visible",
                left: -f * (h / d),
                top: -e * (i / c)
            }).parent().addClass("ui-effects-explode").css({
                position: "absolute",
                overflow: "hidden",
                width: h / d,
                height: i / c,
                left: g.left + f * (h / d) + (a.options.mode == "show" ? (f - Math.floor(d / 2)) * (h / d) : 0),
                top: g.top + e * (i / c) + (a.options.mode == "show" ? (e - Math.floor(c / 2)) * (i / c) : 0),
                opacity: a.options.mode == "show" ? 0 : 1
            }).animate({
                left: g.left + f * (h / d) + (a.options.mode == "show" ? 0 : (f - Math.floor(d / 2)) * (h / d)),
                top: g.top +
                e * (i / c) + (a.options.mode == "show" ? 0 : (e - Math.floor(c / 2)) * (i / c)),
                opacity: a.options.mode == "show" ? 1 : 0
            }, a.duration || 500);
            setTimeout(function () {
                a.options.mode == "show" ? b.css({visibility: "visible"}) : b.css({visibility: "visible"}).hide();
                a.callback && a.callback.apply(b[0]);
                b.dequeue();
                j("div.ui-effects-explode").remove()
            }, a.duration || 500)
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Fade 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Fade
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (b) {
    b.effects.fade = function (a) {
        return this.queue(function () {
            var c = b(this), d = b.effects.setMode(c, a.options.mode || "hide");
            c.animate({opacity: d}, {
                queue: false,
                duration: a.duration,
                easing: a.options.easing,
                complete: function () {
                    a.callback && a.callback.apply(this, arguments);
                    c.dequeue()
                }
            })
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Fold 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Fold
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (c) {
    c.effects.fold = function (a) {
        return this.queue(function () {
            var b = c(this), j = ["position", "top", "bottom", "left", "right"],
                d = c.effects.setMode(b, a.options.mode || "hide"), g = a.options.size || 15,
                h = !!a.options.horizFirst, k = a.duration ? a.duration / 2 : c.fx.speeds._default / 2;
            c.effects.save(b, j);
            b.show();
            var e = c.effects.createWrapper(b).css({overflow: "hidden"}), f = d == "show" != h,
                l = f ? ["width", "height"] : ["height", "width"];
            f = f ? [e.width(), e.height()] : [e.height(), e.width()];
            var i = /([0-9]+)%/.exec(g);
            if (i) g = parseInt(i[1],
                10) / 100 * f[d == "hide" ? 0 : 1];
            if (d == "show") e.css(h ? {height: 0, width: g} : {height: g, width: 0});
            h = {};
            i = {};
            h[l[0]] = d == "show" ? f[0] : g;
            i[l[1]] = d == "show" ? f[1] : 0;
            e.animate(h, k, a.options.easing).animate(i, k, a.options.easing, function () {
                d == "hide" && b.hide();
                c.effects.restore(b, j);
                c.effects.removeWrapper(b);
                a.callback && a.callback.apply(b[0], arguments);
                b.dequeue()
            })
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Highlight 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Highlight
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (b) {
    b.effects.highlight = function (c) {
        return this.queue(function () {
            var a = b(this), e = ["backgroundImage", "backgroundColor", "opacity"],
                d = b.effects.setMode(a, c.options.mode || "show"), f = {backgroundColor: a.css("backgroundColor")};
            if (d == "hide") f.opacity = 0;
            b.effects.save(a, e);
            a.show().css({backgroundImage: "none", backgroundColor: c.options.color || "#ffff99"}).animate(f, {
                queue: false, duration: c.duration, easing: c.options.easing, complete: function () {
                    d == "hide" && a.hide();
                    b.effects.restore(a, e);
                    d == "show" && !b.support.opacity &&
                    this.style.removeAttribute("filter");
                    c.callback && c.callback.apply(this, arguments);
                    a.dequeue()
                }
            })
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Pulsate 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Pulsate
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (d) {
    d.effects.pulsate = function (a) {
        return this.queue(function () {
            var b = d(this), c = d.effects.setMode(b, a.options.mode || "show");
            times = (a.options.times || 5) * 2 - 1;
            duration = a.duration ? a.duration / 2 : d.fx.speeds._default / 2;
            isVisible = b.is(":visible");
            animateTo = 0;
            if (!isVisible) {
                b.css("opacity", 0).show();
                animateTo = 1
            }
            if (c == "hide" && isVisible || c == "show" && !isVisible) times--;
            for (c = 0; c < times; c++) {
                b.animate({opacity: animateTo}, duration, a.options.easing);
                animateTo = (animateTo + 1) % 2
            }
            b.animate({opacity: animateTo}, duration,
                a.options.easing, function () {
                    animateTo == 0 && b.hide();
                    a.callback && a.callback.apply(this, arguments)
                });
            b.queue("fx", function () {
                b.dequeue()
            }).dequeue()
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Scale 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Scale
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (c) {
    c.effects.puff = function (b) {
        return this.queue(function () {
            var a = c(this), e = c.effects.setMode(a, b.options.mode || "hide"),
                g = parseInt(b.options.percent, 10) || 150, h = g / 100, i = {height: a.height(), width: a.width()};
            c.extend(b.options, {
                fade: true,
                mode: e,
                percent: e == "hide" ? g : 100,
                from: e == "hide" ? i : {height: i.height * h, width: i.width * h}
            });
            a.effect("scale", b.options, b.duration, b.callback);
            a.dequeue()
        })
    };
    c.effects.scale = function (b) {
        return this.queue(function () {
            var a = c(this), e = c.extend(true, {}, b.options), g = c.effects.setMode(a,
                b.options.mode || "effect"),
                h = parseInt(b.options.percent, 10) || (parseInt(b.options.percent, 10) == 0 ? 0 : g == "hide" ? 0 : 100),
                i = b.options.direction || "both", f = b.options.origin;
            if (g != "effect") {
                e.origin = f || ["middle", "center"];
                e.restore = true
            }
            f = {height: a.height(), width: a.width()};
            a.from = b.options.from || (g == "show" ? {height: 0, width: 0} : f);
            h = {y: i != "horizontal" ? h / 100 : 1, x: i != "vertical" ? h / 100 : 1};
            a.to = {height: f.height * h.y, width: f.width * h.x};
            if (b.options.fade) {
                if (g == "show") {
                    a.from.opacity = 0;
                    a.to.opacity = 1
                }
                if (g == "hide") {
                    a.from.opacity =
                        1;
                    a.to.opacity = 0
                }
            }
            e.from = a.from;
            e.to = a.to;
            e.mode = g;
            a.effect("size", e, b.duration, b.callback);
            a.dequeue()
        })
    };
    c.effects.size = function (b) {
        return this.queue(function () {
            var a = c(this),
                e = ["position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity"],
                g = ["position", "top", "bottom", "left", "right", "overflow", "opacity"],
                h = ["width", "height", "overflow"], i = ["fontSize"],
                f = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
                k = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
                p = c.effects.setMode(a, b.options.mode || "effect"), n = b.options.restore || false,
                m = b.options.scale || "both", l = b.options.origin, j = {height: a.height(), width: a.width()};
            a.from = b.options.from || j;
            a.to = b.options.to || j;
            if (l) {
                l = c.effects.getBaseline(l, j);
                a.from.top = (j.height - a.from.height) * l.y;
                a.from.left = (j.width - a.from.width) * l.x;
                a.to.top = (j.height - a.to.height) * l.y;
                a.to.left = (j.width - a.to.width) * l.x
            }
            var d = {
                from: {y: a.from.height / j.height, x: a.from.width / j.width},
                to: {y: a.to.height / j.height, x: a.to.width / j.width}
            };
            if (m == "box" || m == "both") {
                if (d.from.y != d.to.y) {
                    e = e.concat(f);
                    a.from = c.effects.setTransition(a, f, d.from.y, a.from);
                    a.to = c.effects.setTransition(a, f, d.to.y, a.to)
                }
                if (d.from.x != d.to.x) {
                    e = e.concat(k);
                    a.from = c.effects.setTransition(a, k, d.from.x, a.from);
                    a.to = c.effects.setTransition(a, k, d.to.x, a.to)
                }
            }
            if (m == "content" || m == "both") if (d.from.y != d.to.y) {
                e = e.concat(i);
                a.from = c.effects.setTransition(a, i, d.from.y, a.from);
                a.to = c.effects.setTransition(a, i, d.to.y, a.to)
            }
            c.effects.save(a, n ? e : g);
            a.show();
            c.effects.createWrapper(a);
            a.css("overflow", "hidden").css(a.from);
            if (m == "content" || m == "both") {
                f = f.concat(["marginTop", "marginBottom"]).concat(i);
                k = k.concat(["marginLeft", "marginRight"]);
                h = e.concat(f).concat(k);
                a.find("*[width]").each(function () {
                    child = c(this);
                    n && c.effects.save(child, h);
                    var o = {height: child.height(), width: child.width()};
                    child.from = {height: o.height * d.from.y, width: o.width * d.from.x};
                    child.to = {height: o.height * d.to.y, width: o.width * d.to.x};
                    if (d.from.y != d.to.y) {
                        child.from = c.effects.setTransition(child, f, d.from.y, child.from);
                        child.to = c.effects.setTransition(child, f, d.to.y, child.to)
                    }
                    if (d.from.x != d.to.x) {
                        child.from = c.effects.setTransition(child, k, d.from.x, child.from);
                        child.to = c.effects.setTransition(child, k, d.to.x, child.to)
                    }
                    child.css(child.from);
                    child.animate(child.to, b.duration, b.options.easing, function () {
                        n && c.effects.restore(child, h)
                    })
                })
            }
            a.animate(a.to, {
                queue: false, duration: b.duration, easing: b.options.easing, complete: function () {
                    a.to.opacity === 0 && a.css("opacity", a.from.opacity);
                    p == "hide" && a.hide();
                    c.effects.restore(a,
                        n ? e : g);
                    c.effects.removeWrapper(a);
                    b.callback && b.callback.apply(this, arguments);
                    a.dequeue()
                }
            })
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Shake 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Shake
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (d) {
    d.effects.shake = function (a) {
        return this.queue(function () {
            var b = d(this), j = ["position", "top", "bottom", "left", "right"];
            d.effects.setMode(b, a.options.mode || "effect");
            var c = a.options.direction || "left", e = a.options.distance || 20, l = a.options.times || 3,
                f = a.duration || a.options.duration || 140;
            d.effects.save(b, j);
            b.show();
            d.effects.createWrapper(b);
            var g = c == "up" || c == "down" ? "top" : "left", h = c == "up" || c == "left" ? "pos" : "neg";
            c = {};
            var i = {}, k = {};
            c[g] = (h == "pos" ? "-=" : "+=") + e;
            i[g] = (h == "pos" ? "+=" : "-=") + e * 2;
            k[g] =
                (h == "pos" ? "-=" : "+=") + e * 2;
            b.animate(c, f, a.options.easing);
            for (e = 1; e < l; e++) b.animate(i, f, a.options.easing).animate(k, f, a.options.easing);
            b.animate(i, f, a.options.easing).animate(c, f / 2, a.options.easing, function () {
                d.effects.restore(b, j);
                d.effects.removeWrapper(b);
                a.callback && a.callback.apply(this, arguments)
            });
            b.queue("fx", function () {
                b.dequeue()
            });
            b.dequeue()
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Slide 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Slide
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (c) {
    c.effects.slide = function (d) {
        return this.queue(function () {
            var a = c(this), h = ["position", "top", "bottom", "left", "right"],
                f = c.effects.setMode(a, d.options.mode || "show"), b = d.options.direction || "left";
            c.effects.save(a, h);
            a.show();
            c.effects.createWrapper(a).css({overflow: "hidden"});
            var g = b == "up" || b == "down" ? "top" : "left";
            b = b == "up" || b == "left" ? "pos" : "neg";
            var e = d.options.distance || (g == "top" ? a.outerHeight({margin: true}) : a.outerWidth({margin: true}));
            if (f == "show") a.css(g, b == "pos" ? isNaN(e) ? "-" + e : -e : e);
            var i = {};
            i[g] = (f == "show" ? b == "pos" ? "+=" : "-=" : b == "pos" ? "-=" : "+=") + e;
            a.animate(i, {
                queue: false, duration: d.duration, easing: d.options.easing, complete: function () {
                    f == "hide" && a.hide();
                    c.effects.restore(a, h);
                    c.effects.removeWrapper(a);
                    d.callback && d.callback.apply(this, arguments);
                    a.dequeue()
                }
            })
        })
    }
})(jQuery);
;
/*
 * jQuery UI Effects Transfer 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Transfer
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function (e) {
    e.effects.transfer = function (a) {
        return this.queue(function () {
            var b = e(this), c = e(a.options.to), d = c.offset();
            c = {top: d.top, left: d.left, height: c.innerHeight(), width: c.innerWidth()};
            d = b.offset();
            var f = e('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(a.options.className).css({
                top: d.top,
                left: d.left,
                height: b.innerHeight(),
                width: b.innerWidth(),
                position: "absolute"
            }).animate(c, a.duration, a.options.easing, function () {
                f.remove();
                a.callback && a.callback.apply(b[0], arguments);
                b.dequeue()
            })
        })
    }
})(jQuery);
;
;$(function () {
    new ModerationClass()
});
ModerationClass = BaseClass.extend({
    init: function () {
        var thiz = this;
        this._super();
        this.initModeration();
        this.ajaxContainer = $('#listContainer');
        thiz.ajaxContainer.ajaxComplete(function () {
            thiz.initModeration()
        })
    }, initModeration: function () {
        var thiz = this, editbarDiv = $('.editbar');
        if (editbarDiv.data('inited')) return;
        editbarDiv.data('inited', true);
        var canEdit = $('#frontendEditBox').length;
        if ($('.editbar #selectAllBtn').length > 0) $('.rightBranding').hide();
        var $sliders = $('.editbar .slider');
        $sliders.click(function () {
            $('.editbar .box').slideUp();
            $sliders.find(".icon").removeClass('aeup').addClass('aedown');
            var buttonID = $(this).attr("id"), actionName = buttonID.substring(7, 200).toLowerCase();
            if ($('.editbar .box.' + actionName).is(":hidden")) {
                $(this).find(".icon").removeClass('aedown').addClass('aeup');
                $('.editbar .box.' + actionName).slideDown()
            }
            ;
            return false
        });
        $('.editbar:first .cancel-edit').click(function (e) {
            e.preventDefault();
            $sliders.find(".icon").removeClass('aeup').addClass('aedown');
            $('.editbar .box').slideUp()
        });
        if (typeof $.fn.renderForms == 'function') {
            $('.checkbox-container').renderForms({dropdowns: false});
            $('#selectAllBtn').parent().renderForms({dropdowns: false})
        }
        ;$('.banselect').click(function () {
            $this = $(this);
            $('.banselect').removeClass('banselected');
            $this.addClass('banselected');
            return false
        });
        $('#removeAdButton').click(function () {
            $selected = $('.banselected');
            if ($selected.size() == 0) {
                alert('Select ban reason');
                return false
            }
            ;var reasonId = $selected.data("banId"), offerId = $selected.data("offerId"), isPaid = false;
            if ($(this).hasClass('is_paid')) isPaid = true;
            $('#ajax-remove-message').text('wait...').show();
            $.post('//' + window.location.host + '/adminpanel/ajax/frontendmoderation/remove/', {
                ids: offerId,
                reason: reasonId,
                paid_ads_remove: isPaid ? 1 : 0
            }, function (data) {
                $('#ajax-remove-message').text('Removed').show();
                setTimeout(function () {
                    $('#ajax-remove-message').fadeOut(1e3);
                    $('#ajax-remove-message').hide()
                }, 3e3)
            });
            return false
        });
        $('#removeAdsButton').click(function () {
            $selected = $('.banselected');
            if ($selected.size() == 0) {
                alert('Select ban reason');
                return false
            }
            ;var reasonId = $selected.data("banId"), offerIds = [];
            $('.checkbox-container :checked').each(function () {
                offerIds.push($(this).val())
            });
            offerIds = offerIds.join(',');
            $('#ajax-remove-message').text('wait...').show();
            $.post('//' + window.location.host + '/adminpanel/ajax/frontendmoderation/remove/', {
                ids: offerIds,
                reason: reasonId
            }, function (data) {
                $('#ajax-remove-message').text('Removed').show();
                setTimeout(function () {
                    $('#ajax-remove-message').fadeOut(1e3);
                    $('#ajax-remove-message').hide()
                }, 3e3)
            });
            return false
        });
        var changeFn = function () {
            $('#saveEdit').attr('disabled', false).parent().removeClass('disabled')
        };
        $('#privateBusiness, .category-select, #offerSeek').change(changeFn);
        $('#title, #description').bind('keypress change keyup', changeFn);
        $('#saveEdit').click(function () {
            var offerId = $(this).data("offerId"), title = $('#title').val(), txt = $('#description').val(),
                idCat = $('#category_field').val(), privateBusiness = $('#privateBusiness').val(),
                offerSeek = $('#offerSeek').val();
            $('#ajax-message').text('wait...').show();
            var postData = {
                id: offerId,
                title: title,
                text: txt,
                id_category: idCat,
                private_business: privateBusiness,
                offer_seek: offerSeek
            }, paramName = $('#fakecategory_name_field').val();
            if (paramName) {
                postData.fakeCategoryParamName = paramName;
                postData.fakeCategoryParamValue = $('#fakecategory_value_field').val()
            }
            ;$.post('//' + window.location.host + '/adminpanel/ajax/frontendmoderation/edit/', postData, function (data) {
                if (typeof data.status == 'string') {
                    $('#ajax-message').text('Saved').show();
                    setTimeout(function () {
                        $('#ajax-message').fadeOut(1e3);
                        $('#ajax-message').hide()
                    }, 3e3)
                }
            });
            return false
        });
        $('#multiEdit').click(function () {
            var offerIds = [];
            $('.checkbox-container :checked').each(function () {
                offerIds.push($(this).val())
            });
            var idCat = $('#category_field').val(), privateBusiness = $('#privateBusiness').val(),
                offerSeek = $('#offerSeek').val();
            $('#ajax-message').text('wait...').show();
            var postData = {
                ids: offerIds,
                id_category: idCat,
                private_business: privateBusiness,
                offer_seek: offerSeek
            }, paramName = $('#fakecategory_name_field').val();
            if (paramName) {
                postData.fakeCategoryParamName = paramName;
                postData.fakeCategoryParamValue = $('#fakecategory_value_field').val()
            }
            ;$.post('//' + window.location.host + '/adminpanel/ajax/frontendmoderation/multiedit/', postData, function (data) {
                if (typeof data.status == 'string') {
                    $('#ajax-message').text('Saved').show();
                    setTimeout(function () {
                        $('#ajax-message').fadeOut(1e3);
                        $('#ajax-message').hide()
                    }, 3e3)
                }
            });
            return false
        });
        $('.category-select').change(function () {
            $this = $(this);
            var idCat = $this.find('option:selected').val();
            thiz.showCategory(idCat);
            $('option[parent=' + idCat + ']').parent().show();
            newSelected = $('option[parent=' + idCat + ']').parent().find(':first').val();
            if ($('#edit-cat-' + newSelected).attr('is_last') == '1') $('#category_field').val(newSelected)
        });
        var $allParamSelect = $('.param-select').change(function () {
            $this = $(this);
            var paramName = $this.data('name'), paramValue = $this.val();
            $('#fakecategory_name_field').val(paramName);
            $('#fakecategory_value_field').val(paramValue)
        });
        if (canEdit && window.hotkeys) $(document).keydown(function (e) {
            if (e.altKey) {
                var keyCode = String.fromCharCode((96 <= e.keyCode && e.keyCode <= 105) ? e.keyCode - 48 : e.keyCode).toLowerCase();
                for (var i = 0; i < hotkeys.length; i++) if (keyCode === hotkeys[i].key) {
                    thiz.showCategory(hotkeys[i].category_id);
                    var adID = $('#saveEdit').data("offerId");
                    $.get('//' + window.location.host + '/adminpanel/ajax/frontendmoderation/changecategory/', {
                        adID: adID,
                        categoryID: hotkeys[i].category_id
                    }, function () {
                        alert('Category was changed.')
                    });
                    break
                }
                ;
                return false
            }
        });
        if (canEdit) {
            if (typeof __moderation_category_id != 'undefined') thiz.showCategory(__moderation_category_id);
            if (typeof __moderation_fakecategory_value != "undefined") $('#fake_category_' + __moderation_category_id).val(__moderation_fakecategory_value).change();
            var firstCategory = $('.category-select [is_last=1]').val();
            $('#checkbox-change-category').bind('click', function () {
                var $this = $(this);
                if ($this.filter(':checked').length) {
                    thiz.showCategory(firstCategory)
                } else {
                    $('.category-select').hide();
                    $('#category_field').val('')
                }
            })
        }
        ;$allParamSelect.change(changeFn);
        $('.removeImage').click(function () {
            var $this = $(this), adID = $('#saveEdit').data("offerId");
            $this.closest('li').remove();
            $('.removeImage').hide();
            $.post('//' + window.location.host + '/adminpanel/ajax/frontendmoderation/removeimage/', {
                adID: adID,
                number: $this.attr('rel')
            }, function () {
                $('.removeImage').show()
            });
            return false
        });
        $('#cancelDelete').click(function () {
            $('#editbarDeletearchived').click()
        });
        $('#saveDelete').click(function () {
            var offerId = $(this).data("offerId");
            $('#ajax-delete-message').text('wait...').show();
            $.post('//' + window.location.host + '/adminpanel/ajax/moderation/deletearchived/', {id: offerId}, function (data) {
                if (typeof data.status == 'string') {
                    $('#ajax-delete-message').text('Deleted').show();
                    setTimeout(function () {
                        $('#ajax-delete-message').fadeOut(1e3);
                        $('#ajax-delete-message').hide()
                    }, 3e3)
                }
            });
            return false
        });
        $('#addComment').click(function () {
            var $txt = $('#rmoderation_comment');
            text = $txt.val(), userID = $txt.data("userId");
            $.post('//' + window.location.host + '/adminpanel/ajax/moderation/usercomment/', {
                userID: userID,
                text: text
            }, function (data) {
                $txt.val('');
                var $tpl = $('#userCommentTemplate').clone().removeAttr('id');
                data.content = text;
                for (var v in data) $tpl.find('#' + v).text(data[v]).removeAttr('id');
                $tpl.hide().appendTo($('.commentslist')).fadeIn('slow');
                $('.commentslist').scrollTop(999999)
            }, 'json');
            return false
        });
        $('#selectAllBtn').click(function () {
            var $checkbox = $(this).parent().find(':checkbox');
            if ($checkbox.is(':checked')) {
                $('.checkbox-container input').attr('checked', true).change()
            } else $('.checkbox-container input').attr('checked', false).change()
        });
        var $adsCheckboxes = $('.checkbox-container input');
        $adsCheckboxes.click(function () {
            var $btn = $('#selectAllBtn');
            if ($btn.is(':checked') && $adsCheckboxes.length > $adsCheckboxes.filter(':checked').length) $('#selectAllBtn').attr('checked', false).change();
            if ($btn.is(':not(:checked)') && $adsCheckboxes.length == $adsCheckboxes.filter(':checked').length) $('#selectAllBtn').attr('checked', true).change()
        })
    }, showCategory: function (categoryId) {
        var thiz = this;
        $('.category-select').hide();
        $('.category-select').find('option').removeAttr('selected');
        var __categoryId = categoryId;
        do {
            obj = $('#edit-cat-' + categoryId);
            obj.parent().show();
            obj.attr('selected', 'selected');
            categoryId = obj.attr('parent')
        } while (categoryId);
        $('#category_field').val('');
        if ($('#edit-cat-' + __categoryId).attr('is_last') == '1') {
            $('#category_field').val(__categoryId);
            thiz.showFakeCategory(__categoryId)
        } else thiz.showCategory($('.category-select option[parent=' + __categoryId + ']').attr('value'))
    }, showFakeCategory: function (categoryId) {
        $('.param-select').hide();
        $('#fakecategory_name_field').val('');
        $('#fakecategory_value_field').val('');
        var $el = $('#fake_category_' + categoryId).show();
        if ($el.length) {
            $el.val($el.children(':first').attr('value'));
            $el.change()
        }
    }
});
CVuploadClass = BaseClass.extend({
    init: function (callerClass) {
        if (!window.module_cv_upload) return;
        this.$cvUploadElement = $('.js-cv-upload');
        this.cvul = {
            '$fileInput': $('<input type="file">'),
            '$cvUploadButton': this.$cvUploadElement.find('.js-cv-upload-button'),
            '$cvUploadDisclaimer': $('.js-cv-upload-disclaimer'),
            '$title': $('.js-cv-upload-content-title'),
            '$subtitle': $('.js-cv-upload-content-subtitle'),
            '$cvUploadCheckbox': $('.js-cv-upload-checkbox'),
            '$cvUploadCheckboxInput': $('.js-cv-upload-attach'),
            '$cvUploadFilename': $('.js-cv-upload-filename'),
            selectedFile: '',
            txt: {
                error: {
                    title: 'Ð§Ñ‚Ð¾-Ñ‚Ð¾ Ð¿Ð¾ÑˆÐ»Ð¾ Ð½Ðµ Ñ‚Ð°Ðº! ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·.',
                    subtitle: 'ÐŸÐ¾Ð²Ñ‚Ð¾Ñ€Ð¸Ñ‚Ðµ Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÑƒ Ð¸Ð»Ð¸  <a href="#" class="js-upload-other-link">Ð´Ð¾Ð±Ð°Ð²ÑŒÑ‚Ðµ Ð´Ñ€ÑƒÐ³Ð¾Ð¹ Ñ„Ð°Ð¹Ð»</a>',
                    button: 'ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·'
                },
                error_file: {
                    title: 'Ð§Ñ‚Ð¾-Ñ‚Ð¾ Ð¿Ð¾ÑˆÐ»Ð¾ Ð½Ðµ Ñ‚Ð°Ðº! ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·.',
                    subtitle: 'Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ Ð¸Ð»Ð¸ Ñ€Ð°Ð·Ð¼ÐµÑ€ Ñ„Ð°Ð¹Ð»Ð° Ñ€ÐµÐ·ÑŽÐ¼Ðµ Ð½Ðµ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÐµÑ‚ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸ÑÐ¼',
                    button: 'Ð—Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ Ñ„Ð°Ð¹Ð» Ñ€ÐµÐ·ÑŽÐ¼Ðµ'
                },
                init: {
                    title: 'Ð£ÑÑ‚Ð°Ð»Ð¸ Ð·Ð°Ð³Ñ€ÑƒÐ¶Ð°Ñ‚ÑŒ ÑÐ²Ð¾Ðµ Ñ€ÐµÐ·ÑŽÐ¼Ðµ ÑÐ½Ð¾Ð²Ð° Ð¸ ÑÐ½Ð¾Ð²Ð°?',
                    subtitle: 'Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚Ðµ Ñ„Ð°Ð¹Ð» Ñ€ÐµÐ·ÑŽÐ¼Ðµ Ð² OLX Ð¸ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÑÐ¹Ñ‚Ðµ Ð½Ð° Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ð¸ Ð½Ð°Ð¼Ð½Ð¾Ð³Ð¾ Ð±Ñ‹ÑÑ‚Ñ€ÐµÐµ!',
                    button: 'Ð—Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ Ñ„Ð°Ð¹Ð» Ñ€ÐµÐ·ÑŽÐ¼Ðµ'
                },
                ok: {
                    title: 'Ð’Ð°ÑˆÐµ Ñ€ÐµÐ·ÑŽÐ¼Ðµ Ð±Ñ‹Ð»Ð¾ ÑƒÑÐ¿ÐµÑˆÐ½Ð¾ ÑÐ¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¾!',
                    subtitle: 'Ð¢ÐµÐ¿ÐµÑ€ÑŒ Ð²Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¿Ñ€Ð¸ÐºÑ€ÐµÐ¿Ð»ÑÑ‚ÑŒ ÐµÐ³Ð¾ Ðº Ð¾Ñ‚Ð²ÐµÑ‚Ñƒ Ð½Ð° ÐºÐ°Ð¶Ð´ÑƒÑŽ Ð²Ð°ÐºÐ°Ð½ÑÐ¸ÑŽ Ð²ÑÐµÐ³Ð¾ Ð¾Ð´Ð½Ð¸Ð¼ ÐºÐ»Ð¸ÐºÐ¾Ð¼',
                    button: 'OK'
                },
                cv: {
                    title: '',
                    subtitle: 'ÐŸÑ€Ð¸ÐºÑ€ÐµÐ¿Ð¸Ñ‚Ðµ ÑÐ²Ð¾Ðµ Ñ€ÐµÐ·ÑŽÐ¼Ðµ Ðº ÑÑ‚Ð¾Ð¼Ñƒ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸ÑŽ - ',
                    button: 'Ð˜Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ Ð¼Ð¾Ðµ Ñ€ÐµÐ·ÑŽÐ¼Ðµ'
                }
            }
        };
        this.$cvUploadElement.data('state') === 'cv' ? this.setState('cv') : this.setState('init');
        this.bindEvents();
        this.callerClass = callerClass
    }, bindEvents: function () {
        var self = this;
        self.cvul.$fileInput.change(function () {
            var file = self.cvul.$fileInput[0].files[0];
            if (file) {
                self.selectedFile = self.cvul.$fileInput[0].files[0];
                self.uploadFile()
            }
        });
        self.cvul.$cvUploadCheckbox.click(function () {
            $(this).toggleClass('checked');
            self.cvul.$cvUploadCheckboxInput.val($(this).hasClass('checked') ? 'true' : '');
            if ($(this).hasClass('checked')) self.sendTracking('cv_upload_attach')
        });
        if (self.cvul.$cvUploadDisclaimer) {
            var $expandedText = $('.js-cv-upload-expanded-text'), $expandButton = $('.js-cv-upload-disclaimer-expand'),
                $collapseButton = $('.js-cv-upload-disclaimer-collapse');
            $expandButton.click(function () {
                $expandedText.addClass('expanded');
                $expandButton.hide()
            });
            $collapseButton.click(function () {
                $expandedText.removeClass('expanded');
                $expandButton.show()
            })
        }
    }, sendTracking: function (eventName, touchPointPage, eventType) {
        var trackDataObject = {trackEvent: [eventName], action_type: eventName};
        trackDataObject.touch_point_page = touchPointPage ? touchPointPage : trackingData.pageView.trackPage;
        trackDataObject.event_type = eventType ? eventType : 'click';
        if (eventName && NinjaTracker !== 'undefined') NinjaTracker.push(NinjaTracker.mergeValidOptionalParams(NinjaTracker.getDataFrom(trackingData.pageView), trackDataObject))
    }, uploadFile: function () {
        var self = this;
        if (!self.selectedFile) return;
        var formData = new FormData();
        formData.append('file', self.selectedFile);
        self.setState('loading');
        $.ajax({
            url: www_base + '/ajax/myaccount/cv/upload/',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (data) {
                if (data[0].status === 1) {
                    self.setState('ok');
                    self.sendTracking('cv_upload_save_success')
                } else if (data[0].status === 0) self.setState('error_file')
            },
            error: function () {
                self.setState('error')
            }
        })
    }, selectFile: function () {
        var self = this;
        if (self.$cvUploadElement.attr('data-state') === 'init') self.sendTracking('cv_upload_select_file');
        if (self.$cvUploadElement.attr('data-state') === 'cv') self.sendTracking('cv_upload_update');
        if (window.user_logged) {
            self.cvul.$fileInput.click()
        } else if (typeof self.callerClass.initMandatoryLogin !== 'undefined') {
            self.callerClass.initMandatoryLogin({redirectOnClose: 'http://' + site_domain + '/' + adID}, undefined);
            self.sendTracking('login_page', undefined, 'pv')
        }
    }, setButtonAction: function (state) {
        var self = this;
        self.cvul.$cvUploadButton.unbind('click');
        var btnAction = null;
        switch (state) {
            case'ok':
                btnAction = self.confirmUploadAndClose;
                break;
            case'error':
                btnAction = self.uploadFile;
                break;
            case'error_file':
                btnAction = self.selectFile;
                break;
            case'init':
                btnAction = self.selectFile;
                break;
            case'cv':
                btnAction = self.selectFile;
                break
        }
        ;
        if (btnAction) {
            self.cvul.$cvUploadButton.click(function (e) {
                e.preventDefault();
                btnAction.call(self)
            });
            self.cvul.$cvUploadButton.text(self.cvul.txt[state].button)
        }
    }, setContent: function (state) {
        var self = this;
        if (!self.cvul.txt[state]) return;
        var content = {title: self.cvul.txt[state].title || '', subtitle: self.cvul.txt[state].subtitle || ''};
        self.cvul.$title.html(content.title);
        self.cvul.$subtitle.html(content.subtitle);
        if (state === 'error') self.cvul.$subtitle.find('.js-upload-other-link').click(function (e) {
            e.preventDefault();
            self.selectFile()
        });
        if (state === 'cv') {
            var currentFilename = self.selectedFile ? self.selectedFile.name : self.cvul.$cvUploadFilename.text();
            self.cvul.$cvUploadFilename.html(currentFilename)
        } else self.cvul.$cvUploadFilename.html('')
    }, setState: function (state) {
        var self = this;
        self.setButtonAction(state);
        self.setContent(state);
        self.$cvUploadElement.attr('data-state', state);
        if (state === 'ok' && self.cvul.$cvUploadDisclaimer) self.cvul.$cvUploadDisclaimer.hide();
        if (state === 'ok' && !self.cvul.$cvUploadCheckbox.hasClass('checked')) self.cvul.$cvUploadCheckbox.click()
    }, confirmUploadAndClose: function () {
        var self = this;
        self.setState('cv')
    }
});
JobsMessagePrefillClass = BaseClass.extend({
    init: function () {
        this.elements = {
            '$phoneInput': $('.js-logged-user-phone'),
            '$cvCheckbox': $('.js-cv-upload-checkbox'),
            '$msgTextarea': $('.js-ad-message'),
            '$contactForm': $('#contact-form')
        };
        if (!window.module_jobs_message_prefill || this.elements.$msgTextarea.length === 0) return;
        this.messages = {
            has_phone: 'Ð—Ð´Ñ€Ð°Ð²ÑÑ‚Ð²ÑƒÐ¹Ñ‚Ðµ,<br> ÐœÐµÐ½Ñ Ð·Ð°Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ¾Ð²Ð°Ð»Ð° Ð²Ð°ÑˆÐ° Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ñ, Ð¿Ð¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²ÑŒÑ‚Ðµ Ð±Ð¾Ð»ÐµÐµ Ð¿Ð¾Ð´Ñ€Ð¾Ð±Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ, Ð¿Ð¾Ð·Ð²Ð¾Ð½Ð¸Ð² Ð½Ð° Ð¼Ð¾Ð¹ Ð½Ð¾Ð¼ÐµÑ€ %s.<br>Ð¡Ð¿Ð°ÑÐ¸Ð±Ð¾',
            has_cv: 'Ð—Ð´Ñ€Ð°Ð²ÑÑ‚Ð²ÑƒÐ¹Ñ‚Ðµ,<br>Ð’ Ð¾Ñ‚Ð²ÐµÑ‚ Ð½Ð° Ð²Ð°ÑˆÑƒ Ð²Ð°ÐºÐ°Ð½ÑÐ¸ÑŽ, Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÑÑŽ ÑÐ²Ð¾Ðµ Ñ€ÐµÐ·ÑŽÐ¼Ðµ. Ð¡ Ð½ÐµÑ‚ÐµÑ€Ð¿ÐµÐ½Ð¸ÐµÐ¼ Ð±ÑƒÐ´Ñƒ Ð¾Ð¶Ð¸Ð´Ð°Ñ‚ÑŒ Ð²Ð°ÑˆÐµ Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ.<br>Ð¡Ð¿Ð°ÑÐ¸Ð±Ð¾',
            has_phone_and_cv: 'Ð—Ð´Ñ€Ð°Ð²ÑÑ‚Ð²ÑƒÐ¹Ñ‚Ðµ,<br>Ð’ Ð¾Ñ‚Ð²ÐµÑ‚ Ð½Ð° Ð²Ð°ÑˆÑƒ Ð²Ð°ÐºÐ°Ð½ÑÐ¸ÑŽ, Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÑÑŽ ÑÐ²Ð¾Ðµ Ñ€ÐµÐ·ÑŽÐ¼Ðµ. Ð‘ÑƒÐ´Ñƒ Ð±Ð»Ð°Ð³Ð¾Ð´Ð°Ñ€ÐµÐ½ Ð·Ð° Ñ€Ð°ÑÑÐ¼Ð¾Ñ‚Ñ€ÐµÐ½Ð¸Ðµ Ð¼Ð¾ÐµÐ¹ ÐºÐ°Ð½Ð´Ð¸Ð´Ð°Ñ‚ÑƒÑ€Ñ‹, Ñ Ð½ÐµÑ‚ÐµÑ€Ð¿ÐµÐ½Ð¸ÐµÐ¼ Ð¶Ð´Ñƒ Ð¾Ñ‚Ð²ÐµÑ‚. ÐœÐ¾Ð¹ Ð½Ð¾Ð¼ÐµÑ€ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½Ð° %s.<br>Ð¡Ð¿Ð°ÑÐ¸Ð±Ð¾'
        };
        this.bindEvents();
        this.checkMessageStatus()
    }, bindEvents: function () {
        var self = this;
        self.elements.$msgTextarea.keyup(function () {
            $(this).toggleClass('js-dirty', $(this).val().length > 0)
        });
        self.elements.$cvCheckbox.click(function () {
            self.checkMessageStatus()
        });
        self.elements.$phoneInput.keyup(function () {
            self.checkMessageStatus()
        })
    }, fillContactMessage: function (text) {
        var self = this

        function br2nl(text) {
            return text.replace(/<br\s*\/?>/mg, '\n')
        };text = br2nl(text);
        if (!self.elements.$msgTextarea.hasClass('js-dirty')) {
            self.elements.$msgTextarea.val(text);
            self.elements.$msgTextarea.blur().focusout()
        }
    }, checkMessageStatus: function () {
        var self = this, hasPhone = self.elements.$phoneInput.length > 0 && self.elements.$phoneInput.val().length > 0,
            hasCV = self.elements.$cvCheckbox.length > 0 && self.elements.$cvCheckbox.hasClass('checked'), text = ''

        function injectPhone(text) {
            return text.replace(/(%s)/g, self.elements.$phoneInput.val())
        };
        if (hasPhone && hasCV) {
            text = injectPhone(self.messages.has_phone_and_cv)
        } else if (hasPhone) {
            text = injectPhone(self.messages.has_phone)
        } else if (hasCV) {
            text = self.messages.has_cv
        } else text = '';
        self.fillContactMessage(text)
    }
});
AdsenseClassBase = Class.extend({
    adsBlocks: [], defaultChannel: '', init: function (options) {
        var thiz = this;
        thiz.w = document.write;
        thiz.options = $.extend({}, options)
    }, setQuery: function (query) {
        this.query = query
    }, setRegionName: function (regionName) {
        this.regionName = regionName
    }, setSubregionName: function (subRegionName) {
        this.subRegionName = subRegionName
    }, setCategory: function (id, name, code, adsenseText) {
        this.category = {id: id, name: name, code: code, adsenseText: adsenseText}
    }, setRootCategory: function (id, name, code) {
        this.rootCategory = {id: id, name: name, code: code}
    }, setSeoPageName: function (seoPageName) {
        this.seoPageName = seoPageName
    }, setDefaultChannel: function (channel) {
        this.defaultChannel = channel
    }, getChannel: function (channelCode) {
        var thiz = this, channelsCodes = thiz.getChannelsCodes();
        if (window.isUserSearch) return channelsCodes.user_search;
        var mapping = thiz.getCategoryChannelsMapping(),
            channels = thiz.rootCategory && thiz.rootCategory.id ? mapping[thiz.rootCategory.id] : false;
        if (!channels) return channelsCodes[channelCode];
        if (thiz.query) {
            return channelsCodes[channelCode] + (channels.asf ? ',' + channels.asf : '')
        } else if (thiz.forAd) {
            return channelsCodes[channelCode] + (channels.category ? ',' + channels.category : '') + (channels.ad && channels.ad != channels.category ? ',' + channels.ad : '')
        } else return channelsCodes[channelCode] + (channels.category ? ',' + channels.category : '') + (channels.listing && channels.listing != channels.category ? ',' + channels.listing : '')
    }, addAdsenseForSearchBlock: function (container, numberOfAds, options) {
        if (!$('#' + container).length) return;
        var thiz = this;
        options = $.extend({
            container: container,
            number: numberOfAds,
            lines: numberOfAds,
            fontFamily: 'arial',
            fontSizeTitle: '16px',
            fontSizeDescription: '13px',
            fontSizeDomainLink: '13px',
            colorTitleLink: '#168ECA',
            colorText: '#B4B4B4',
            colorDomainLink: '#909090',
            attributionText: ' ',
            longerHeadlines: true
        }, options);
        thiz.adsBlocks.push(options)
    }, getQueryVariable: function (variable) {
        var query = window.location.search.substring(1), vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) return pair[1]
        }
        ;
        return false
    }, showAdsenseForSearchAds: function (channelCode) {
        var thiz = this, pageOptions = {
            pubId: thiz.getPubId(),
            query: channelCode == 'afs_q' ? thiz.query : thiz.query + (thiz.regionName ? (' ' + thiz.regionName) : ''),
            channel: thiz.getChannel(channelCode),
            hl: thiz.getLanguageId(),
            linkTarget: '_blank',
            titleBold: false,
            LinkUnderline: false,
            rolloverLinkUnderline: true,
            rolloverLinkBackgroundColor: '#3074B9',
            rolloverLinkColor: '#FFFFFF',
            siteLinks: false,
            verticalSpacing: 12
        };
        if (window.module_afs_query != undefined && thiz.category != undefined && thiz.category.code != undefined) pageOptions.query = thiz.category.code.replace('-', ' ') + ' ' + thiz.query;
        switch (thiz.adsBlocks.length) {
            case 1:
                _googCsa('ads', pageOptions, thiz.adsBlocks[0]);
                break;
            case 2:
                _googCsa('ads', pageOptions, thiz.adsBlocks[0], thiz.adsBlocks[1]);
                break;
            case 3:
                _googCsa('ads', pageOptions, thiz.adsBlocks[0], thiz.adsBlocks[1], thiz.adsBlocks[2]);
                break
        }
        ;thiz.adsBlocks = []
    }, addAdsenseForContentBlock: function (container, numberOfAds, channelCode, options) {
        if (!$('#' + container).length) return;
        var thiz = this;
        options = $.extend({
            container: container,
            google_max_num_ads: numberOfAds,
            google_adnum: 0,
            google_skip: 0,
            google_ad_client: thiz.getPubId(),
            google_ad_channel: thiz.getChannel(channelCode),
            google_ad_output: 'js',
            google_ad_type: 'text',
            google_feedback: 'on',
            google_language: thiz.getLanguageId()
        }, options);
        if (thiz.category && thiz.category.adsenseText) {
            options.google_kw_type = 'broad';
            options.google_kw = thiz.category.adsenseText
        } else options.google_hints = (thiz.category && thiz.category.id && thiz.seoPageName ? thiz.seoPageName : thiz.getDefaultHint()) + (thiz.subRegionName ? (' ' + thiz.subRegionName) : '');
        thiz.adsBlocks.push(options)
    }, showAdsenseForContentAds: function () {
        var thiz = this;
        if (typeof GoogleObj == 'undefined' || !thiz.adsBlocks.length) return;
        thiz.googleAdsDetails = [];
        for (x in thiz.adsBlocks) {
            var container = thiz.adsBlocks[x]['container'], data = thiz.adsBlocks[x];
            delete data.container;
            thiz.googleAdsDetails.push({data: data, callbackFunction: thiz.getGoogleAdsCallbackFunc(container)})
        }
        ;thiz.adsIndexToLoad = 0;
        thiz.loadGoogleAds(thiz.googleAdsDetails[0])
    }, loadGoogleAds: function (data) {
        var variables = data.data;
        for (name in window) if (name.indexOf('google_') >= 0) delete window[name];
        variables.google_adnum = 0;
        variables.google_skip = 0;
        window.google_ad_request_done = data.callbackFunction;
        for (v in variables) window[v] = variables[v];
        var eleScript = document.createElement('script');
        document.write = (function (params) {
            $(document.body).append(params)
        });
        eleScript.setAttribute('type', 'text/javascript');
        eleScript.setAttribute('src', 'http://pagead2.googlesyndication.com/pagead/show_ads.js?' + (new Date().getTime()));
        $(document.body).append(eleScript)
    }, loadGoogleNextAd: function () {
        var thiz = this;
        thiz.adsIndexToLoad++;
        if (typeof thiz.googleAdsDetails[thiz.adsIndexToLoad] != 'undefined') {
            thiz.loadGoogleAds(thiz.googleAdsDetails[thiz.adsIndexToLoad])
        } else {
            document.write = thiz.w;
            thiz.adsBlocks = []
        }
    }, getGoogleAdsCallbackFunc: function (container) {
        var $container = $('#' + container);
        if (!$container.length) return;
        var thiz = this;
        return function (google_ads) {
            if (google_ads.length == 0) return;
            var s = '', i;
            if (google_ads[0].type == 'flash') {
                s += '<a href=\"' + google_info.feedback_url + '\" style="color:000000">Ð ÐµÐºÐ»Ð°Ð¼Ð° Google</a><br><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" WIDTH="' + google_ad.image_width + '" HEIGHT="' + google_ad.image_height + '"> <PARAM NAME="movie" VALUE="' + google_ad.image_url + '"><PARAM NAME="quality" VALUE="high"><PARAM NAME="AllowScriptAccess" VALUE="never"><EMBED src="' + google_ad.image_url + '" WIDTH="' + google_ad.image_width + '" HEIGHT="' + google_ad.image_height + '" TYPE="application/x-shockwave-flash" AllowScriptAccess="never"  PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer"></EMBED></OBJECT>'
            } else if (google_ads[0].type == 'image') {
                s += '<a href=\"' + google_info.feedback_url + '\" style="color:000000"></a><br> <a href="' + google_ads[0].url + '" target="_top" title="ÐŸÐµÑ€ÐµÐ¹Ñ‚Ð¸ Ð½Ð° ' + google_ads[0].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'PrzejdÅº do ' + google_ads[0].visible_url + '\';return true"><img border="0" src="' + google_ads[0].image_url + '"width="' + google_ads[0].image_width + '"height="' + google_ads[0].image_height + '"></a>'
            } else if (google_ads[0].type == "html") {
                s += google_ads[0].snippet
            } else if (google_ads.length >= 1) {
                s += '<div class="google-ads-listing-hd"><span>Ð ÐµÐºÐ»Ð°Ð¼Ð° Google</span></div>';
                for (i = 0; i < google_ads.length; ++i) s += '<div class="offer"><table cellspacing="0" cellpadding="0" width="100%" summary="OgÅ‚oszenie" class="fixed breakword"><tbody><tr><td width="' + (window.action == 'ads' ? '168' : '112') + '"><a href="' + google_info.feedback_url + '" target="_blank" class="thumb vtop inlblk rel tdnone scale4 nophoto"><span class="alt-text">Ð‘ÐµÐ· Ñ„Ð¾Ñ‚Ð¾</span></a></td><td valign="top"><div class="space rel"><h4 class="' + (window.action == 'ads' ? 'x-large lheight20 margintop5' : 'large lheight20') + '"><a target="_blank" class="link adsense" href="' + google_ads[i].url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\';return true"> <span class="' + (window.action == 'ads' ? 'fbold' : '') + '"> ' + google_ads[i].line1 + '</span></a> </h4><p class="color-9 lheight16 margintop5 x-normal"><span>' + google_ads[i].line2 + ' ' + google_ads[i].line3 + '</span></p> <p class="small"><a target="_blank" class="c41 tunder" href="' + google_ads[i].url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\';return true"><span>' + google_ads[i].visible_url + '</span></a></p></div></td><td width="1" class="wwnormal tright"></td><td width="1" class="tright small"></td></tr></tbody></table></div>';
                if (google_ads[0].bidtype == "CPC") google_adnum = google_adnum + google_ads.length
            }
            ;$container.html(s);
            thiz.loadGoogleNextAd();
            return
        }
    }, isMobile: function () {
        return window.namespace !== undefined && window.namespace === 'i2'
    }, showAdsense: function (pageOptions, adBlockOptions) {
        _googCsa('ads', pageOptions, adBlockOptions)
    }, showAdsenseForQuery: function (pageOptions, adBlockOptions) {
        var channels = '';
        if (window.totalAds > 0) {
            channels = this.getChannelCheckABP(pageOptions.channel, 'ad_was_found_adblock', 'ad_was_found')
        } else channels = this.getChannelCheckABP(pageOptions.channel, 'ad_was_not_found_adblock', 'ad_was_not_found');
        channels += ',' + pageOptions.channel['dfp_segment_channel'];
        pageOptions.channel = channels;
        _googCsa('ads', pageOptions, adBlockOptions)
    }, getChannelCheckABP: function (channels, keyWithAbp, keyWithoutAbp) {
        if (window.abp !== undefined && window.abp === 1) return channels[keyWithAbp];
        return channels[keyWithoutAbp]
    }
});
AdsenseClass = AdsenseClassBase.extend({
    getPubId: function () {
        return this.isMobile() ? 'mobile-olx-ua' : 'olx-ua'
    }, getLanguageId: function () {
        return 'ru'
    }, getCategoryChannelsMapping: function () {
        return {
            36: {
                category: 3171537427,
                asf: 8282786199,
                asf_kw: 'cat_children_kw',
                asf_kw_empty: 'cat_children_kw_zero',
                ad: 5505248223,
                listing: 2830983420,
                i2_listing: 5596158454
            },
            899: {
                category: 1555203425,
                asf: 9759519393,
                asf_kw: 'cat_homegarden_kw',
                asf_kw_empty: 'cat_homegarden_kw_zero',
                ad: 6981981429,
                listing: 4307716628,
                i2_listing: 5456557659
            },
            37: {
                category: 5784449829,
                asf: 2236252594,
                asf_kw: 'cat_electronics_kw',
                asf_kw_empty: 'cat_electronics_kw_zero',
                ad: 8458714629,
                listing: 5784449829,
                i2_listing: 7072891657
            },
            903: {
                category: 5985403028,
                asf: 5189718992,
                asf_kw: 'cat_hobby_kw',
                asf_kw_empty: 'cat_hobby_kw_zero',
                ad: 9935447825,
                listing: 7261183021,
                i2_listing: 5316956850
            },
            891: {
                category: 4508669822,
                asf: 6387250590,
                asf_kw: 'cat_fashion_kw',
                asf_kw_empty: 'cat_fashion_kw_zero',
                ad: 2412181024,
                listing: 8737916223,
                i2_listing: 1026358050
            },
            1: {
                category: 2691382620,
                asf: 7863983793,
                asf_kw: 'cat_re_kw',
                asf_kw_empty: 'cat_re_kw_zero',
                ad: 3888914229,
                listing: 2691382620,
                i2_listing: 2363490458
            },
            6: {
                category: 4168115824,
                asf: 9340716990,
                asf_kw: 'cat_jobs_kw',
                asf_kw_empty: 'cat_jobs_kw_zero',
                ad: 5365647421,
                listing: 4168115824,
                i2_listing: 6933290850
            },
            3: {
                category: '',
                asf: '',
                asf_kw: 'cat_carparts_kw',
                asf_kw_empty: 'cat_carparts_kw_zero',
                ad: '',
                listing: '',
                i2_listing: ''
            },
            1532: {
                category: 5644849024,
                asf: 3294183390,
                asf_kw: 'cat_transport_kw',
                asf_kw_empty: 'cat_transport_kw_zero',
                ad: 6842380624,
                listing: 5644849024,
                i2_listing: 8410024053
            },
            7: {
                category: 7601737020,
                asf: 4770916595,
                asf_kw: 'cat_services_kw',
                asf_kw_empty: 'cat_services_kw_zero',
                ad: 8319113825,
                listing: 8598315423,
                i2_listing: 3840223655
            },
            35: {
                category: 3031936623,
                asf: 6247649794,
                asf_kw: 'cat_animals_kw',
                asf_kw_empty: 'cat_animals_kw_zero',
                ad: 2272580224,
                listing: 1075048624,
                i2_listing: 4119425259
            },
            1151: {asf_kw: 4997290056, asf_kw_empty: 6474023251, i2_listing: 2503091255},
            1153: {asf_kw: 8090357250, asf_kw_empty: 9567090457, i2_listing: 8549624857},
            1435: {asf_kw: 3799758459, asf_kw_empty: 5276491654, i2_listing: 3979824452}
        }
    }, getChannel: function (channelCode) {
        var thiz = this, channelsCodes = thiz.getChannelsCodes();
        if (window.isUserSearch) return channelsCodes.user_search;
        var mapping = thiz.getCategoryChannelsMapping(),
            channels = thiz.rootCategory && thiz.rootCategory.id ? mapping[thiz.rootCategory.id] : false;
        if (!channels) return channelsCodes[channelCode];
        if (thiz.query) {
            var channel = '';
            if (window.totalAds > 0) {
                channel += (channels.asf_kw ? ',' + channels.asf_kw : '');
                channel += ',cat_all'
            } else {
                channel += (channels.asf_kw_empty ? ',' + channels.asf_kw_empty : '');
                channel += ',cat_all_kw_zero'
            }
            ;
            return channelsCodes[channelCode] + channel + (channels.asf ? ',' + channels.asf : '')
        } else if (thiz.forAd) {
            return channelsCodes[channelCode] + (channels.category ? ',' + channels.category : '') + (channels.ad && channels.ad != channels.category ? ',' + channels.ad : '')
        } else return channelsCodes[channelCode] + (channels.category ? ',' + channels.category : '') + (channels.listing && channels.listing != channels.category ? ',' + channels.listing : '')
    }, getChannelsCodes: function () {
        return {
            asf: 'search',
            asf_empty: 'emptysearch',
            listing: '',
            listing_bottom: '2678146622',
            ad_bottom: '5631613029',
            user_search: '3620140620',
            afs_no_result_i2: 'emptysearch',
            i2_listing: '2642692053'
        }
    }, getDefaultQueryContext: function () {
        return ''
    }, getDefaultHint: function () {
        return ''
    }, addAdsenseForSearchBlock: function (container, numberOfAds, options) {
        if (!$('#' + container).length) return;
        var thiz = this;
        if (window.isTestServer) {
            options = $.extend({
                container: container,
                width: "890",
                number: numberOfAds,
                adIconUrl: 'https://afs.googleusercontent.com/olx/olx_ua_icon_ad.png',
                adIconWidth: thiz.isMobile() ? 106 : 160,
                adIconHeight: thiz.isMobile() ? 123 : 90,
                adIconLocation: "ad-left",
                fontFamily: "arial",
                colorTitleLink: "0098d0",
                colorText: "909090",
                colorDomainLink: "008000",
                colorLocation: "909090",
                colorAdBorder: "f0f0f0",
                colorSiteLinks: "f0f0f0",
                noTitleUnderline: true,
                titleBold: true,
                lineHeightTitle: 20,
                fontSizeTitle: 16,
                lineHeightDescription: 16,
                fontSizeDescription: 13,
                lineHeightDomainLink: 14,
                fontSizeDomainLink: 13,
                fontSizeAttribution: 13,
                fontSizeAnnotation: 11,
                longerHeadlines: true,
                adBorderSelections: "bottom"
            }, options)
        } else options = $.extend({
            container: container,
            number: numberOfAds,
            lines: numberOfAds,
            fontFamily: 'arial',
            fontSizeTitle: '16px',
            fontSizeDescription: '13px',
            fontSizeDomainLink: '13px',
            colorTitleLink: '#168ECA',
            colorText: '#B4B4B4',
            colorDomainLink: '#909090',
            attributionText: ' ',
            longerHeadlines: true,
            width: "700",
            location: true
        }, options);
        thiz.adsBlocks.push(options)
    }, showAdsenseForSearchAds: function (channelCode) {
        var thiz = this;
        if (window.isTestServer) {
            var pageOptions = {
                pubId: thiz.getPubId(),
                query: thiz.query,
                channel: thiz.getChannel(channelCode),
                hl: thiz.getLanguageId(),
                adsafe: "medium",
                adtest: "on",
                location: true,
                sellerRatings: true,
                siteLinks: true
            }
        } else var pageOptions = {
            pubId: thiz.getPubId(),
            query: thiz.query,
            channel: thiz.getChannel(channelCode),
            hl: thiz.getLanguageId(),
            linkTarget: '_blank',
            titleBold: false,
            noTitleUnderline: true,
            LinkUnderline: false,
            rolloverLinkUnderline: true,
            rolloverLinkBackgroundColor: '#3074B9',
            rolloverLinkColor: '#FFFFFF',
            siteLinks: false,
            verticalSpacing: 12
        };
        if (window.action == 'ads' && window.method == 'index') {
            var page = thiz.getQueryVariable('page');
            pageOptions.adPage = page == false ? 1 : page
        }
        ;
        switch (thiz.adsBlocks.length) {
            case 1:
                _googCsa('ads', pageOptions, thiz.adsBlocks[0]);
                break;
            case 2:
                _googCsa('ads', pageOptions, thiz.adsBlocks[0], thiz.adsBlocks[1]);
                break;
            case 3:
                _googCsa('ads', pageOptions, thiz.adsBlocks[0], thiz.adsBlocks[1], thiz.adsBlocks[2]);
                break
        }
        ;thiz.adsBlocks = []
    }
});
(function (Context) {
    "use strict";
    var _settings = {
        adReActivate: {selector: '.activateOffer', eventType: 'click'},
        adEdit: {selector: '.js-ad-edit-link', eventType: 'click'},
        galleryOpen: {selector: '.photo-handler img, .photo-handler a, .img-item img', eventType: 'click'},
        registerOpen: {selector: '#register_tab', eventType: 'click'},
        galleryOpenSwipePrev: {selector: '.bigImagePrev', eventType: 'click'},
        galleryOpenSwipeNext: {selector: '.bigImageNext', eventType: 'click'},
        replyOpenFirstStep: {selector: '#offerbox #contact_methods .link-phone', eventType: 'click'},
        replyOpenFirstStepContactPage: {selector: '#answerbox #contact_methods .link-phone', eventType: 'click'},
        replyOpenFirstStepBelow: {selector: '#contact_methods_below .link-phone', eventType: 'click'},
        replyOpenFirstStepText: {selector: '.showPhoneButton', eventType: 'click'},
        replyOpenFirstStepGallery: {selector: '.optionsbarinner .link-phone', eventType: 'click'},
        replyChat: {selector: '#contact_methods .button-email', eventType: 'click'},
        replyChat2: {selector: '.optionsbarinner .button-email', eventType: 'click'},
        replyChatArea: {selector: '.textarea-wrapper #ask-text', eventType: 'click'},
        contactViaPartner: {selector: '#contact_methods .contact-button[data-track]', eventType: 'click'},
        printButton: {selector: '.printOffer', eventType: 'click'},
        reportButton: {selector: '#reportMe', eventType: 'click'},
        userListingButton: {
            selector: '.user-offers, .offer-user__image-link, .offer-user__details h4 a',
            eventType: 'click'
        },
        userListingButtonOnGallery: {selector: '#linkUserAds', eventType: 'click'},
        addToFavourite: {selector: '#offerdescription .observe-link', eventType: 'click'},
        addToFavouriteGallery: {selector: '#bigImageContent .observe-link', eventType: 'click'},
        removeFromFavourite: {selector: '#offerdescription .observe-link', eventType: 'click'},
        removeFromFavouriteGallery: {selector: '#bigImageContent .observe-link', eventType: 'click'},
        refreshForFree: {selector: '#ownerbarRefresh', eventType: 'click'},
        buySafeDeal: {selector: '#offeractions .js-button-safedeal', eventType: 'click'},
        buySafeDealABtestVariantB: {
            selector: '#offeractions .js-button-safedeal-description-variant-B',
            eventType: 'click'
        },
        buySafeDealABtestVariantC: {
            selector: '#offeractions .js-button-safedeal-description-variant-C',
            eventType: 'click'
        }
    };
    Context.widget = {
        init: function () {
            this.bindUIActions();
            return this
        }, bindUIActions: function (isXHRUIActions) {
            var _$ = Context.$;
            _settings.adEdit.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['editing_form_click'],
                    action_type: 'editing_form_click',
                    touch_point_page: trackingData.pageView.listing_type || trackingData.pageView.trackPage,
                    '$dataset': {ad_id: 'data-ad'}
                })
            };
            _settings.adReActivate.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['ad_reactivate'],
                    action_type: 'ad_reactivate',
                    touch_point_page: trackingData.pageView.listing_type || trackingData.pageView.trackPage
                })
            };
            _settings.galleryOpen.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView, false), {
                    trackPage: 'gallery_open',
                    action_type: 'gallery_open'
                })
            };
            _settings.registerOpen.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView, false), {
                    trackPage: 'pre_chat_registration_page',
                    action_type: 'pre_chat_registration_page',
                    user_status: trackingData.pageView.user_status
                })
            };
            _settings.galleryOpenSwipePrev.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['gallery_open_swipe'],
                    action_type: 'gallery_open_swipe',
                    touch_point_page: 'gallery_open'
                })
            };
            _settings.galleryOpenSwipeNext.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['gallery_open_swipe'],
                    action_type: 'gallery_open_swipe',
                    touch_point_page: 'gallery_open'
                })
            };
            _settings.replyOpenFirstStep.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['reply_phone_1step'],
                    action_type: 'reply_phone_1step',
                    touch_point_page: trackingData.pageView.trackPage,
                    touch_point_button: 'top_button'
                })
            };
            _settings.replyOpenFirstStep.beforeCallback = function (node, e, listener, eventType) {
                var el = _$('#offerbox #contact_methods .link-phone .spoiler');
                if (el.style.display !== 'none') listener(e);
                return false
            };
            _settings.replyOpenFirstStepContactPage.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['reply_phone_1step'],
                    action_type: 'reply_phone_1step',
                    touch_point_page: trackingData.pageView.trackPage,
                    touch_point_button: 'reply_chat_page'
                })
            };
            _settings.replyOpenFirstStepContactPage.beforeCallback = function (node, e, listener, eventType) {
                var el = _$('#answerbox #contact_methods .link-phone .spoiler');
                if (el.style.display !== 'none') listener(e);
                return false
            };
            _settings.replyOpenFirstStepBelow.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['reply_phone_1step'],
                    action_type: 'reply_phone_1step',
                    touch_point_page: trackingData.pageView.trackPage,
                    touch_point_button: 'bottom_form'
                })
            };
            _settings.replyOpenFirstStepBelow.beforeCallback = function (node, e, listener, eventType) {
                var el = _$('#contact_methods_below .link-phone .spoiler');
                if (el.style.display !== 'none') listener(e);
                return false
            };
            _settings.replyOpenFirstStepGallery.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['reply_phone_1step'],
                    action_type: 'reply_phone_1step',
                    touch_point_page: 'gallery_open',
                    touch_point_button: 'gallery_open'
                })
            };
            _settings.replyOpenFirstStepGallery.beforeCallback = function (node, e, listener, eventType) {
                var el = _$('.optionsbarinner .link-phone .spoiler');
                if (el.style.display !== 'none') listener(e);
                return false
            };
            _settings.replyOpenFirstStepText.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['reply_phone_1step'],
                    action_type: 'reply_phone_1step',
                    touch_point_page: trackingData.pageView.trackPage,
                    touch_point_button: 'description'
                })
            };
            _settings.replyChat.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['reply_chat_click'],
                    action_type: 'reply_chat_click',
                    touch_point_page: trackingData.pageView.trackPage,
                    touch_point_button: 'top'
                })
            };
            _settings.replyChat.delayLocation = _settings.replyChat2.delayLocation = true;
            _settings.replyChat2.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['reply_chat_click'],
                    action_type: 'reply_chat_click',
                    touch_point_page: 'gallery_open'
                })
            };
            _settings.replyChat.beforeCallback = _settings.replyChat2.beforeCallback = function (node, e, listener, eventType) {
                var el = _$(_settings.replyChat.selector), status = el.getAttribute('disabled');
                if (status === null) {
                    el.setAttribute('disabled', 'disabled');
                    listener(e)
                } else e.preventDefault()
            };
            _settings.replyChatArea.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['reply_chat_click'],
                    action_type: 'reply_chat_click',
                    touch_point_page: trackingData.pageView.trackPage,
                    touch_point_button: 'bottom'
                })
            };
            _settings.replyChatArea.beforeCallback = function (node, e, listener, eventType) {
                if (!Context.cache(node).get('clicked')) {
                    listener(e);
                    Context.cache(node).set('clicked', 1)
                }
            };
            _settings.contactViaPartner.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['contact_via_partner'],
                    action_type: 'contact_via_partner',
                    touch_point_page: trackingData.pageView.listing_type || trackingData.pageView.trackPage,
                    partner_code: _$('#contact_methods .contact-button[data-track]').getAttribute('data-track')
                })
            };
            _settings.printButton.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['ad_print'],
                    action_type: 'ad_print',
                    touch_point_page: trackingData.pageView.listing_type || trackingData.pageView.trackPage
                })
            };
            _settings.reportButton.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['ad_report_click'],
                    action_type: 'ad_report_click',
                    touch_point_page: trackingData.pageView.listing_type || trackingData.pageView.trackPage
                })
            };
            _settings.refreshForFree.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['ad_refresh'],
                    action_type: 'ad_refresh',
                    touch_point_page: trackingData.pageView.listing_type || trackingData.pageView.trackPage
                })
            };
            _settings.buySafeDeal.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['safe_deal_click'],
                    action_type: 'safe_deal_click',
                    touch_point_page: trackingData.pageView.trackPage,
                    ABvariant: 'A'
                })
            };
            _settings.buySafeDeal.beforeCallback = function (node, e, listener, eventType) {
                if (user_logged == 1 && user_sms_verified == 1) _settings.buySafeDeal.delayLocation = true;
                listener(e)
            };
            _settings.buySafeDealABtestVariantB.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['safe_deal_click'],
                    action_type: 'safe_deal_click',
                    touch_point_page: trackingData.pageView.trackPage,
                    ABvariant: 'B'
                })
            };
            _settings.buySafeDealABtestVariantB.beforeCallback = function (node, e, listener, eventType) {
                if (user_logged == 1 && user_sms_verified == 1) _settings.buySafeDealABtestVariantB.delayLocation = true;
                listener(e)
            };
            _settings.buySafeDealABtestVariantC.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['safe_deal_click'],
                    action_type: 'safe_deal_click',
                    touch_point_page: trackingData.pageView.trackPage,
                    ABvariant: 'C'
                })
            };
            _settings.buySafeDealABtestVariantC.beforeCallback = function (node, e, listener, eventType) {
                if (user_logged == 1 && user_sms_verified == 1) _settings.buySafeDealABtestVariantC.delayLocation = true;
                listener(e)
            };
            _settings.userListingButton.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['seller_listing_click'],
                    action_type: 'seller_listing_click',
                    touch_point_page: trackingData.pageView.listing_type || trackingData.pageView.trackPage
                })
            };
            _settings.userListingButton.delayLocation = true;
            _settings.userListingButtonOnGallery.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['seller_listing_click'],
                    action_type: 'seller_listing_click',
                    touch_point_page: 'gallery_open'
                })
            };
            _settings.userListingButtonOnGallery.delayLocation = true;
            _settings.addToFavourite.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['favourite_ad_click'],
                    action_type: 'favourite_ad_click',
                    touch_point_page: trackingData.pageView.listing_type || trackingData.pageView.trackPage
                })
            };
            _settings.addToFavourite.beforeCallback = function (node, e, listener, eventType) {
                var stateHandler = Context.getClosest(node, '.gallery');
                if (!Context.hasClass(stateHandler, 'inobserved')) listener(e);
                return false
            };
            _settings.addToFavouriteGallery.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['favourite_ad_click'],
                    action_type: 'favourite_ad_click',
                    touch_point_page: 'gallery_open'
                })
            };
            _settings.addToFavouriteGallery.beforeCallback = function (node, e, listener, eventType) {
                var stateHandler = Context.getClosest(node, '.photospace');
                if (!Context.hasClass(stateHandler, 'inobserved')) listener(e);
                return false
            };
            _settings.removeFromFavourite.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['favourite_ad_deleted'],
                    action_type: 'favourite_ad_deleted',
                    touch_point_page: trackingData.pageView.listing_type || trackingData.pageView.trackPage
                })
            };
            _settings.removeFromFavourite.beforeCallback = function (node, e, listener, eventType) {
                var stateHandler = Context.getClosest(node, '.gallery');
                if (Context.hasClass(stateHandler, 'inobserved')) listener(e);
                return false
            };
            _settings.removeFromFavouriteGallery.params = function () {
                return Context.mergeValidOptionalParams(Context.getDataFrom(trackingData.pageView), {
                    trackEvent: ['favourite_ad_deleted'],
                    action_type: 'favourite_ad_deleted',
                    touch_point_page: 'gallery_open'
                })
            };
            _settings.removeFromFavouriteGallery.beforeCallback = function (node, e, listener, eventType) {
                var stateHandler = Context.getClosest(node, '.photospace');
                if (Context.hasClass(stateHandler, 'inobserved')) listener(e);
                return false
            };
            isXHRUIActions && Context.unregisterAll();
            for (var key in _settings) if (_settings.hasOwnProperty(key)) Context.registerEvent(_settings[key].selector, _settings[key].eventType, _settings[key].params, true, _settings[key].beforeCallback || false, _settings[key].afterCallback || false, _settings[key].delayLocation || false);
            return this
        }, XHRCompleted: function (isPageRequest) {
            var isPageRequest = isPageRequest || false;
            if (isPageRequest) Context.reInit();
            this.bindUIActions(true);
            return this
        }
    };
    return Context
})((typeof NinjaTracker !== 'undefined' ? NinjaTracker : {}));
$(function () {
    $('.payment-form').click(function () {
        $this = $(this);
        var type = $this.data("type"), adId = $this.data("adId");
        $.fancybox.showActivity();
        $.ajax({
            url: "/ajax/payment/form/", data: {type: type, id: adId}, success: function (data) {
                $.fancybox(data, {
                    onComplete: function () {
                        var innerHeight = $(window).height() - 100;
                        $('#innerheight').css({"max-height": innerHeight, overflow: "auto"})
                    }, autoDimensions: true
                })
            }
        });
        return false
    });
    $('input[name=rb_index_code]').live('click', function () {
        var code = $('input[name=rb_index_code]:checked').val();
        $('input[name=index_code]').val(code);
        $('#payment_form').html('');
        updatePrice()
    });
    $('#paymentMethod').live('change', function () {
        $('input[name=rb_index_code]').parent().show();
        $('input[name=rb_index_code]').each(function () {
            $this = $(this);
            $('input[name=index_code]').val('');
            $this.removeAttr('checked');
            indexCode = $this.val();
            price = $('#paymentMethod option:selected').data()[indexCode];
            if (price == undefined || price == 0) $this.parent().hide()
        });
        $.fancybox.center();
        updatePrice()
    });
    $('#rules_agree').live('click', function () {
        $this = $(this);
        $('#paidads_start').attr('disabled', 'disabled');
        $('#paidads_start').parent().addClass('disabled').addClass('gray');
        if ($this.is(':checked')) {
            $('#paidads_start').removeAttr('disabled');
            $('#paidads_start').parent().removeClass('disabled').removeClass('gray')
        }
    });
    $('#paidads_start').live('click', function () {
        $this = $(this);
        adId = $this.data("adId");
        code = $('input[name=index_code]').val();
        provider = $('#paymentMethod option:selected').val();
        if (adId == '' || code == '' || provider == '') return false;
        param = $('#paymentMethod option:selected').data("param");
        $.ajax({
            url: "/ajax/payment/startsession/",
            data: {code: code, id: adId, provider: provider, param: param},
            success: function (data) {
                $('#payment_form').html('');
                $('#payment_form').append(data);
                $('#payment_form form').submit();
                $.fancybox.center()
            }
        });
        return false
    })

    function updatePrice() {
        $('.amount').hide();
        $('.acceptancebox').hide();
        indexCode = $('input[name=index_code]').val();
        if (indexCode == '') return;
        if ($('#paymentMethod option:selected').val() == '') return;
        price = $('#paymentMethod option:selected').data()[indexCode];
        $('#price_value').text(price);
        $('.amount').show();
        $('.acceptancebox').show();
        $.fancybox.center()
    }
});