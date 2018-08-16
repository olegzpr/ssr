const items = {
    /*** -= Деактивація оголошення =- ***/
    'deactive': function (id) {
        $.ajax({
            url: '/items/deactive',
            type: 'post',
            data: {id: id},
            success: function (res) {
                $("tr[data-key=" + id + "]").remove();
            }
        })
    },

    'viewphone': function (id) {
        $.ajax({
            url: '/items/view-phone',
            type: 'post',
            data: {id: id},
            success: function (res) {
                console.log(res);
            }
        })
    },

    'active': function (id) {
        $.ajax({
            url: '/items/active',
            type: 'post',
            data: {id: id},
            success: function (res) {
                $("tr[data-key=" + id + "]").remove();
            }
        })
    },

    'reklama': function (id) {
        $.ajax({
            url: '/items/reklama',
            type: 'post',
            data: {id: id},
            dataType: 'json',
            success: function (res) {
                noty(res.type, res.sms);
            }
        })
    }
};

var sms = {
    'search': function (q) {
        if (q != '') {
            $(".chat-users .item").hide();
            $(".chat-users .item .name:contains(" + q + ")").closest('.item').show();
        } else {
            $(".chat-users .item").show();
        }
    }
};

var counter = {
    'minus': function (el) {
        if (Number(el.next().val()) > 1) {
            el.next().val(Number(el.next().val()) - 1);
        }
    },

    'plus': function (el) {
        el.prev().val(Number(el.prev().val()) + 1);
    }
};

let lockPage = {
    'lock': function () {
        $.blockUI({
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff',
                message: 'Подождите...'
            }
        });
    },

    'unlock': function () {
        $.unblockUI();
    }
};

var catalog = {
    'changeCurrency': function (id) {
        $.ajax({
            url: '/ajax/change-currency',
            type: 'post',
            data: {id: id},
            success: function () {
                window.location.reload();
            }
        })
    }
};

//TODO Мої скрипти
$(function () {

    /*** -= Фильтрация объектов =- ***/
    $(".tabs-ajax a").click(function (e) {
        e.preventDefault();
        $(this).parent().addClass('active').siblings().removeClass('active');
        const status = $(this).attr('href');
        if (status == 0) {
            $(".item-unit").show();
        } else {
            $(".item-unit").hide();
            $(".item-unit[data-status=" + status + "]").show();
        }
    });

    /*** Socket IO ***/
    socket = new WebSocket('ws://w4u.pp.ua:2002');
    socket.onmessage = function (e) {
        var all = Number($(".profile-footer .ui-block-c .badge").html());
        $(".profile-footer .ui-block-c .badge").html(all + 1).show();
        var sms = JSON.parse(e.data);
        $("[data-target=message-box]").prepend('<div class="one-block sent-you">\n' +
            '                <div class="message">\n' +
            '                    <p>' + sms.text + '</p>\n' +
            '                    <div class="date-time">' + sms.data + '</div>\n' +
            '                </div>\n' +
            '            </div>');
    };

    $("#send-sms").click(function (e) {
        e.preventDefault();
        let text = $("input[name=text]").val();
        const sender = $(".my-box").attr('now-sender');
        const time = new Date();
        const cHour = (time.getHours()).length == 1 ? '0' + time.getHours() : time.getHours();
        const cMin = (time.getMinutes()).length == 1 ? '0' + time.getMinutes() : time.getMinutes();
        $("#list-sms").append('<div class="i-message"><span>' + text + ' <i>' + cHour + ':' + cMin + '</i></span></div>');
        $("input[name=text]").val('');
        socket.send('{"text":"' + text + '", "user_from":"+' + uphone + '", "user_to":"' + sender + '", "action":"sms"}');
    })

    $(".advantages-list-item").mouseenter(function () {
        var a = $(this).find('img').attr('src');
        var b = $(this).find('img').attr('data-hover');
        $(this).find('img').attr('src', b).attr('data-hover', a);
    }).mouseleave(function () {
        var a = $(this).find('img').attr('src');
        var b = $(this).find('img').attr('data-hover');
        $(this).find('img').attr('src', b).attr('data-hover', a);
    });

    if ($(window).width() > 768) {
        $(".drop-main span, .drop-main i").click(function () {
            $(this).parent().find('.drop-body-box').toggle();
        });
    }

    $(".mobile-icon-menu").click(function () {
        $("body").addClass('mobile-menu-open');
    });

    $(".place").each(function () {
        $(this).place();
    });

    $('#login-form').on('afterValidateAttribute', function (event, messages, errorAttributes) {
        if (errorAttributes != '') {
            noty('error', errorAttributes);
        }
    });

    $('#register-form').on('afterValidateAttribute', function (event, messages, errorAttributes) {
        if (errorAttributes != '') {
            noty('error', errorAttributes);
        }
    });

    /*** -= TODO проверка полей при потери фокуса =- ***/
    $(".styled-input-row input:not(input[type=radio])").blur(function () {
        var req = $(this).attr('required');
        if ($(this).val() == '' && req != undefined) {
            $(this).addClass('error').parent().append('<i class="fa fa-times times-error"></i>').find('.check-success').remove();
        } else {
            $(this).addClass('success').removeClass('error');
            $(this).parent().append('<i class="fa fa-check check-success"></i>').find('.times-error').remove();
        }
    });

    $(".styled-input-row input").keyup(function () {
        var req = $(this).attr('required');
        if ($(this).val() == '' && req != undefined) {
            $(this).addClass('error');
        } else {
            $(this).addClass('success').removeClass('error');
        }
    });
    /*** -= end =- ***/

    $("#send-code").click(function () {
        var phone = $("#phone-type").val();
        if ((phone.replace('_', '')).length >= 13) {
            $.ajax({
                url: '/send-code',
                type: 'post',
                data: {phone: phone,}
            })
        } else {
            noty('error', 'Введите правильный номер телефона');
        }
    });

    $(".one-sms").click(function () {
        const sender = $(this).attr('data-send');
        $.ajax({
            url: '/ajax/dialog',
            type: 'post',
            data: {sender: sender},
            success: function (res) {
                $("#list-sms").html(res);
                $(".my-box").addClass('my-box-left').attr('now-sender', sender);
            }
        });
    });

    $("[data-toggle=tabs-page]").click(function (e) {
        e.preventDefault();
        $(".box-index").hide();
        $($(this).attr('href')).show();
        $(this).parent().addClass('active').siblings().removeClass('active');
    });

    $("#upload-cover").jLoad({
        path: '/source/users/',
        onsuccess: function (image, th) {
            $(".crop-image2").show().find('img').attr('src', image);
            $(".backdoor").show();
            $('.crop-image2 img').cropper({
                aspectRatio: 5 / 1,
                crop: function (e) {
                    $("#save-cover").attr({
                        'data-left': e.x,
                        'data-top': e.y,
                        'data-width': e.width,
                        'data-height': e.height
                    });
                }
            });
        }
    });

    $("#save-cover").click(function () {
        const x = $(this).data('left');
        const y = $(this).data('top');
        const width = $(this).data('width');
        const height = $(this).data('height');
        const image = $('.crop-image2 img').attr('src');

        $.ajax({
            url: '/my/save-cover',
            type: 'post',
            data: {image: image, x: x, y: y, width: width, height: height,},
            dataType: 'json',
            success: function (res) {
                if (res.error == null) {
                    noty('success', 'Обложна сохранена');
                    $(".cover").css('background', 'url(' + image + ') no-repeat center center/cover');
                    $(".crop-image2, .backdoor").fadeOut();
                    $('.crop-image2 img').cropper('destroy')
                } else {
                    noty('error', res.error);
                }
            }
        })
    });

    $("#upload-avatar").jLoad({
        path: '/source/users/',
        onsuccess: function (image, th) {
            $(".crop-image").show().find('img').attr('src', image);
            $(".backdoor").show();
            $('.crop-image img').cropper({
                aspectRatio: 1 / 1,
                crop: function (e) {
                    $("#save-ava").attr({
                        'data-left': e.x,
                        'data-top': e.y,
                        'data-width': e.width,
                        'data-height': e.height
                    });
                }
            });
        }
    });

    $("#save-ava").click(function () {
        const x = $(this).data('left');
        const y = $(this).data('top');
        const width = $(this).data('width');
        const height = $(this).data('height');
        const image = $('.crop-image img').attr('src');

        $.ajax({
            url: '/my/save-avatar',
            type: 'post',
            data: {image: image, x: x, y: y, width: width, height: height,},
            dataType: 'json',
            success: function (res) {
                if (res.error == null) {
                    noty('success', 'Фото сохранено');
                    $("#user-avatar").attr('src', image);
                    $(".crop-image, .backdoor").fadeOut();
                    $('.crop-image img').cropper('destroy')
                } else {
                    noty('error', res.error);
                }
            }
        })
    });

    $(document).on('click', '.box-index .box-group .field .add-more', function (e) {
        e.preventDefault();
        const tpl = [
            '<div class="field" data-type="phone">\n' +
            '                            <div class="row clearfix">\n' +
            '                                <div class="col-md-4">\n' +
            '                                    <input type="text" class="form-control" data-mask="phone">\n' +
            '                                </div>\n' +
            '                                <div class="col-md-5">\n' +
            '                                    <p>По указанному телефону я доступен в мессенжерах: </p>\n' +
            '                                </div>\n' +
            '                                <div class="col-md-3">\n' +
            '                                    <a href="#" class="active-app"><i class="fa fa-telegram"></i></a>\n' +
            '                                    <a href="#" class="active-app"><i class="fa fa-whatsapp"></i></a>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                            <a href="#" class="add-more" data-clone="phone"><i class="fa fa-plus"></i> Добавить другой номер телефона</a>\n' +
            '                        </div>',
            '<div class="field" data-type="email">\n' +
            '                            <div class="row clearfix">\n' +
            '                                <div class="col-md-6">\n' +
            '                                    <input type="email" class="form-control">\n' +
            '                                </div>\n' +
            '                                <div class="col-md-4">\n' +
            '                                    <select class="styled-select">\n' +
            '                                        <option value="lock"><i class="fa fa-lock"></i> Не показывать</option>\n' +
            '                                        <option value="unlock"><i class="fa fa-unlock"></i> Показывать</option>\n' +
            '                                    </select>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                            <a href="#" class="add-more" data-clone="email"><i class="fa fa-plus"></i> Добавить другой электронный адрес</a>\n' +
            '                        </div>',
            '<div class="field" data-type="soc">\n' +
            '                            <div class="row clearfix">\n' +
            '                                <div class="col-md-6">\n' +
            '                                    <input type="email" class="form-control">\n' +
            '                                </div>\n' +
            '                                <div class="col-md-6">\n' +
            '                                    <div class="row clearfix">\n' +
            '                                        <div class="col-md-6">\n' +
            '                                            <select class="styled-select" name="soc_name">\n' +
            '                                                <option value="">Facebook</option>\n' +
            '                                                <option value="">Instagram</option>\n' +
            '                                            </select>\n' +
            '                                        </div>\n' +
            '                                        <div class="col-md-6">\n' +
            '                                            <select class="styled-select" name="allow">\n' +
            '                                                <option value="lock"><i class="fa fa-lock"></i> Не показывать</option>\n' +
            '                                                <option value="unlock"><i class="fa fa-unlock"></i> Показывать</option>\n' +
            '                                            </select>\n' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                            <a href="#" class="add-more" data-clone="soc"><i class="fa fa-plus"></i> Добавить ещё одну ссылку на профиль в сети</a>\n' +
            '                        </div>'
        ];
        const type = $(this).data('clone');
        switch (type) {
            case 'phone':
                $(this).closest('.col-md-8').append(tpl[0]);
                break;

            case 'email':
                $(this).closest('.col-md-8').append(tpl[1]);
                break;

            case 'soc':
                $(this).closest('.col-md-8').append(tpl[2]);
                break;

        }
        $(this).hide();
        $('select.styled-select').styler({
            selectSearch: true
        });
        $("input[data-mask=phone]").inputmask("+38 (999) 999-99-99");
    });

    $(document).on('click', '.active-app', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
    })

    /***
     * TODO збереження контактів
     */
    $("#save-contacts").click(function () {
        let phones = [];
        let emails = [];
        let socs = [];
        $("[data-type=phone]").each(function () {
            let number = $(this).find('input').val();
            if (number != '') {
                let apps = [];
                $(this).find('.active-app.active').each(function () {
                    apps.push($(this).data('app'));
                });
                phones.push({number: number, apps: apps});
            }
        });

        $("[data-type=email]").each(function () {
            let email = $(this).find('input').val();
            if (email != '') {
                emails.push({email: email, allow: $(this).find('select').val()});
            }
        });

        $("[data-type=soc]").each(function () {
            let link = $(this).find('input').val();
            if (link != '') {
                socs.push({
                    link: link,
                    allow: $(this).find('select[name=allow]').val(),
                    name: $(this).find('select[name=soc_name]').val()
                });
            }
        });

        $.ajax({
            url: '/ajax/save-contact',
            type: 'post',
            data: {phones: phones, emails: emails, socs: socs},
            success: function (res) {
                console.log(res);
            }
        })
    });

    $(".user-top-proff .action").click(function () {
        $(".poper-modal").toggle();
    });

    /*** TODO Typeahead ***/
    $(".drop-head li").click(function () {
        $(this).closest('.box-row-input').find('input').val($(this).html());
        $(this).parent().hide();

        saveRangeFilter($(this).closest('.box-row-input').find('input').data('filter'), Number($(this).closest('.filter-group').find('.box-row-input:eq(0)').find('input').val()), Number($(this).closest('.filter-group').find('.box-row-input:eq(1)').find('input').val()));
    });

    $('.box-row-input input').keyup(function () {
        saveRangeFilter($(this).data('filter'), Number($(this).closest('.filter-group').find('.box-row-input:eq(0)').find('input').val()), Number($(this).closest('.filter-group').find('.box-row-input:eq(1)').find('input').val()));
    });

    $(".box-row-input i").click(function () {
        $(this).closest('.box-row-input').find('.drop-head').toggle();
    });

    /*** TODO Загрузка городов региона ***/
    $("select[data-name=region]").change(function () {
        $.ajax({
            url: '/ajax/city-list',
            type: 'post',
            data: {region: $(this).val()},
            success: function (res) {
                $("select[data-name=city]").html(res).trigger('refresh');
            }
        });

        $.ajax({
            url: '/ajax/save-filter',
            type: 'post',
            data: {key: 'region', val: $(this).val(), flag: $(this).val() == 'Область' ? false : true},
            success: function (res) {
                $("#all-items").html(res);
                $('.catalog-item-gallery').slick({
                    dots: false,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 1,
                    prevArrow: '<div class="slick-prev"></div>',
                    nextArrow: '<div class="slick-next"></div>'
                });
            }
        });
    });

    /*** TODO Загрузка районов города ***/
    $("select[data-name=city]").change(function () {
        $.ajax({
            url: '/ajax/area-list',
            type: 'post',
            data: {city: $(this).val()},
            success: function (res) {
                $("select[data-name=area]").html(res).trigger('refresh');
            }
        });

        $.ajax({
            url: '/ajax/save-filter',
            type: 'post',
            data: {key: 'city', val: $(this).val(), flag: $(this).val() == 'Город' ? false : true},
            success: function (res) {
                $("#all-items").html(res);
                $('.catalog-item-gallery').slick({
                    dots: false,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 1,
                    prevArrow: '<div class="slick-prev"></div>',
                    nextArrow: '<div class="slick-next"></div>'
                });
            }
        });
    });

    $("#filter-srok").change(function () {
        $.ajax({
            url: '/ajax/save-filter',
            type: 'post',
            data: {key: 'srok', val: $(this).val(), flag: $(this).val() == 0 ? false : true},
            success: function (res) {
                $("#all-items").html(res);
                $('.catalog-item-gallery').slick({
                    dots: false,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 1,
                    prevArrow: '<div class="slick-prev"></div>',
                    nextArrow: '<div class="slick-next"></div>'
                });
            }
        });
    });
});

$('.catalog-item-gallery').slick({
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    prevArrow: '<div class="slick-prev"></div>',
    nextArrow: '<div class="slick-next"></div>'
});


$(document).on('click', '.tab-btn', function (event) {
    event.preventDefault();
    var self = $(this),
        target = $($('.tab-content[data-tab="' + self.attr('data-target') + '"]'));

    target.siblings('.tab-content').removeClass('active');
    target.addClass('active');
    self.closest('li').siblings('li').find('.tab-btn').removeClass('active');
    self.addClass('active');
});

$(document).on('click', '.mobile-menu-burger', function (event) {
    event.preventDefault();
    $(this).toggleClass('active');
    $('body').toggleClass('mobile-menu-open');
});

$(document).on('click', '.mobile-menu', function (event) {
    event.preventDefault();
    if ($(this).is(event.target)) {
        $('.mobile-menu-burger').removeClass('active');
        $('body').removeClass('mobile-menu-open');
    }
});

$(document).on('click', '.dash-top-menu-toggle, .dash-menu-close', function (event) {
    event.preventDefault();
    $('body').toggleClass('dashboard-mobile-menu-open');
});


$(document).on('click', '.filter-group-title', function (event) {
    event.preventDefault();
    $(this).closest('.filter-group').toggleClass('active');
});

$(document).on('click', '.top-form-input, .top-form-input-toggle', function (event) {
    event.preventDefault();
    $(this).closest('.col').toggleClass('active');
});

$(document).on('click', '.filter-title', function (event) {
    event.preventDefault();
    $(this).closest('.filter-side').toggleClass('active');
});

// TODO Custom Select style
(function ($) {
    $(function () {
        $('select.styled-select').styler();
    });
})(jQuery);

/*** TODO Функция переворота ***/
function rotate(degree) {
    // For webkit browsers: e.g. Chrome
    $elie.css({WebkitTransform: 'rotate(' + degree + 'deg)'});
    // For Mozilla browser: e.g. Firefox
    $elie.css({'-moz-transform': 'rotate(' + degree + 'deg)'});
}

$(function () {
    /*** TODO Переворот фото при загрузке ***/
    $(document).on('click', '.load-files i.fa-repeat', function () {
        var image = $(this).closest('.load-files').find('img').attr('src');
        var el = $(this).closest('.load-files').find('img');
        var r = Number($(this).attr('data-rotate'));
        $(this).attr('data-rotate', r + 1);
        console.log(r);
        $.ajax({
            url: '/ajax/image-rotate',
            type: 'post',
            data: {image: image},
            success: function (res) {
                $elie = el;
                rotate(90 * r);
            }
        })
    });

    /*** TODO Инициализация плагина загрузки фото ***/
    $("input[data-role=upload]").each(function () {
        $(this).jLoad({
            path: '/source/items/',
            onsuccess: function (res, th) {
                $("div[data-container=" + th.attr('data-id') + "]").find('.disabled-sort:first').append('<img src="' + res + '"><input type="hidden" value="' + res + '" name="' + th.closest('[data-role=box-to-upload]').attr('data-name') + '"><i class="fa fa-times-circle-o"></i><i class="fa fa-repeat" data-rotate="1"></i>').removeClass('disabled-sort').find('a').remove();
            }
        });
    })

    $(document).on('click', '.load-files i.fa-times-circle-o', function () {
        $(this).closest(".load-files").addClass('disabled-sort').find('img').remove();
        $(this).closest(".load-files").find('input[type=hidden]').remove();
        $(this).closest(".load-files").prepend('<a href="javascript:void(0)"\n' +
            '                               onclick="$(this).next().click();"><i class="fa fa-plus-circle"></i> </a>');
        $(this).remove();
    });

    $("[data-role=box-to-upload]").sortable({
        items: ".load-files:not(.disabled-sort)"
    });

    Inputmask().mask(document.querySelectorAll("input"));

    /*** TODO Фильтрация ***/
    $("[data-toggle=filter-catalog]").click(function () {
        $.ajax({
            url: '/ajax/save-filter',
            type: 'post',
            data: {key: $(this).attr('data-filter'), val: $(this).val(), flag: $(this).prop('checked')},
            success: function (res) {
                $("#all-items").html(res);
                $('.catalog-item-gallery').slick({
                    dots: false,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 1,
                    prevArrow: '<div class="slick-prev"></div>',
                    nextArrow: '<div class="slick-next"></div>'
                });
            }
        })
    });

    /*** TODO Сортировка ***/
    $("#sorting").change(function () {
        $.ajax({
            url: '/ajax/sorting',
            type: 'post',
            data: {type: $(this).val()},
            success: function (res) {
                $("#all-items").html(res);
            }
        })
    });

    /*** TODO Label ***/
    $("#filter-label").change(function () {
        $.ajax({
            url: '/ajax/filter-label',
            type: 'post',
            data: {label: $(this).val()},
            success: function (res) {
                $("#all-items").html(res);
            }
        })
    });

    $("[data-sender]").click(function () {
        var sender = $(this).attr('data-sender');
        $.ajax({
            url: '/ajax/dialog',
            type: 'post',
            data: {sender: sender},
            success: function (res) {
                $(".chat-messages").html(res);
                $(".chat-textarea").removeAttr('disabled');
                $(".chat-send-btn").removeAttr('disabled');
                $("input[name=user_to]").val(sender);
            }
        })
    });

    /*** -= Додаткові дії =- ***/
    $(document).on('click', '[data-action]', function () {
        var csrfParam = $('meta[name="csrf-param"]').attr("content");
        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        var action = $(this).attr('data-action');
        var th = $(this);
        switch (action) {
            case 'add-to-favorite':

                $.ajax({
                    url: '/add-to-favorite',
                    type: 'post',
                    data: {csrtParam: csrfToken, id: $(this).attr('data-id')},
                    dataType: 'json',
                    success: function (res) {
                        if (res.action=='add'){
                            th.addClass('active').find('i').removeClass('fa-heart-o').addClass('fa-heart');
                        } else {
                            th.removeClass('active').find('i').addClass('fa-heart-o').removeClass('fa-heart');
                        }
                        noty(res.type, res.text);
                    }
                });
                break;

            case 'add-to-favorite-with-text':
                $.ajax({
                    url: '/add-to-favorite',
                    type: 'post',
                    data: {csrtParam: csrfToken, id: $(this).attr('data-id')},
                    dataType: 'json',
                    success: function (res) {
                        if (res.action=='add'){
                            th.parent().addClass('active').find('a').html('<i class="fa fa-heart"></i> В избранном</a>');
                        } else {
                            th.parent().removeClass('active').find('a').html('<i class="fa fa-heart-o"></i> Добавить в избранное</a>');
                        }
                        noty(res.type, res.text);
                    }
                });
                break;

            case 'show_phone':
                $(this).html('<i class="fa fa-phone"></i> '+$(this).attr('data-phone'));
                break;

            case 'load-more':
                var limit = Number($(this).attr('data-limit'));
                var th = $(this);
                $(this).attr('data-limit', limit + 8);
                $.ajax({
                    url: '/ajax/more',
                    type: 'post',
                    data: {csrtParam: csrfToken, limit: limit},
                    success: function (res) {
                        if (res == '') {
                            th.hide();
                            noty('info', 'Больше нет объявлений, которые подходят под ваши требования');
                        }
                        $("#all-items").append(res);
                    }
                });
                break;

            case 'hide-in-catalog':
                const id = $(this).attr('data-id');
                $(this).closest('.catalog-item-wrap').hide();
                $.ajax({
                    url: '/ajax/hide-in-catalog',
                    type: 'post',
                    data: {csrtParam: csrfToken, id: id},
                    success: function (res) {}
                });
                break;
        }
    });

    localStorage.showmaps = 0;
    localStorage.showpan = 0;

    /*** TODO Hocks ***/
    $(document).on('click', '[data-hock]', function () {
        let csrfParam = $('meta[name="csrf-param"]').attr("content");
        let csrfToken = $('meta[name="csrf-token"]').attr("content");
        let self = $(this);
        switch ($(this).attr('data-hock')) {
            case 'nextInput':
                let id = $(this).attr('data-id');
                let z = $(this).find('input').val();
                $.ajax({
                    url: '/ajax/load-rows',
                    type: 'post',
                    data: {csrtParam: csrfToken, id: id, value: z},
                    success: function (res) {
                        self.closest('.styled-input-row').nextAll().remove();
                        $("#result").append(res);
                    }
                });
                break;

            case 'loadSteps':
                setTimeout(function () {
                    var mask = '';
                    $("#add-form label.active input:checked").each(function () {
                        mask += $(this).val();
                    });
                    localStorage.mask = mask;
                    $.ajax({
                        url: '/ajax/load-steps',
                        type: 'post',
                        data: {csrtParam: csrfToken, mask: mask},
                        success: function (res) {
                            $(".steps-box").html(res);
                        }
                    });
                    $("#result").hide().prev().hide();
                }, 1000);
                break;
        }
    });

    $(document).on('keypress', '[data-hock]', function () {
        var csrfParam = $('meta[name="csrf-param"]').attr("content");
        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        switch ($(this).attr('data-hock')) {
            case 'maxValue':
                let max = Number($(this).data('max'));
                if (Number($(this).val()) > max) {
                    $(this).val('');
                }
                break;

            case 'clone':
                //var row = $(this).closest('.row');
                //$(this).closest('.row').clone().appendTo( $(this).closest('.row').parent());
                break;
        }
    });

    $(document).on('blur', '[data-hock]', function () {
        var csrfParam = $('meta[name="csrf-param"]').attr("content");
        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        switch ($(this).attr('data-hock')) {
            case 'geolocate':
                var address = $("select[data-name=region] option:selected").text() + ', ' + $("select[data-name=city] option:selected").text() + ', ' + $('#address-input').val() + ', ' + $("#home-input").val();
                if (address.length > 10) {
                    var map = new GMaps({
                        div: '#map',
                        lat: 47.834946,
                        lng: 35.169854
                    });
                    GMaps.geocode({
                        address: address,
                        language: 'ru',
                        callback: function (results, status) {
                            if (status == 'OK') {
                                var latlng = results[0].geometry.location;
                                map.setCenter(latlng.lat(), latlng.lng());
                                map.addMarker({
                                    lat: latlng.lat(),
                                    lng: latlng.lng(),
                                    icon: '/images/map-marker.png',
                                    draggable: true,
                                    dragend: function (event) {
                                        var lat = event.latLng.lat();
                                        var lng = event.latLng.lng();
                                        GMaps.geocode({
                                            location: {lat: lat, lng: lng},
                                            language: 'ru',
                                            callback: function (results, status) {
                                                console.log(results);
                                                if (status == 'OK') {
                                                    let component = (results[0].formatted_address).split(',');
                                                    $("select[data-name=region]").find("option:contains('" + component[3] + "')").attr("selected", "selected");
                                                    $("select[data-name=region]").next().find('.jq-selectbox__select-text').html(component[3]);
                                                    $("select[data-name=city]").find("option:contains('" + component[2] + "')").attr("selected", "selected");
                                                    $("select[data-name=city]").next().find('.jq-selectbox__select-text').html(component[2]);
                                                    $("#address-input").val(component[0]);
                                                    $("#home-input").val(component[1]);
                                                }
                                            }
                                        });
                                    },
                                });
                            }
                        }
                    });
                }
                break;

            case 'notMax':
                let maxValue = Number($("input[name='Rows[" + $(this).data('sibling') + "]']").val());
                if (maxValue != 0) {
                    if (Number($(this).val()) > maxValue) {
                        $(this).val(maxValue);
                    }
                }
                break;

            case 'notMin':
                let minValue = Number($("input[name='Rows[" + $(this).data('sibling') + "]']").val());
                if (minValue != 0) {
                    if (Number($(this).val()) < minValue) {
                        $(this).val(minValue);
                    }
                }
                break;
        }
    });

    /*** TODO Отображение метки после ввода адреса ***/
    // if ($("input").is("#address-input")) {
    //     $("#address-input").blur({})
    // }

    /**
     * TODO Тільки числа
     */
    $("input[data-js=only-number]").keydown(function (e) {
        let key = String.fromCharCode(e.keyCode);
        if (!/^[0-9]$/.test(key) && e.keyCode != 190) {
            return false;
        }
    });

    /*** TODO Счетчики ***/
    $(".counter-span-minus").click(function () {
        let input = $(this).parent().find('input');
        let n = Number(input.val());
        if (n > 1) {
            input.val(n - 1);
        }
    });

    $(".counter-span-plus").click(function () {
        let input = $(this).parent().find('input');
        let n = Number(input.val());
        if (input.data('max') == undefined) {
            input.val(n + 1);
        } else {
            if (Number(input.data('max')) >= n + 1) {
                input.val(n + 1);
            }
        }
    });

    /*** TODO Загрузка следующего шага ***/
    $(document).on('click', '[data-toggle=next-step]', function () {
        var next = $(this).attr('data-next');
        var csrfParam = $('meta[name="csrf-param"]').attr("content");
        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        //$(this).closest('.row').slideUp();
        var th = $(this).closest('.row');
        var inp = [];
        $("[data-input=rows]").each(function () {
            inp[$(this).attr('data-id')] = $(this).val();
        });
        $.ajax({
            url: '/ajax/load-steps-next',
            type: 'post',
            data: {csrtParam: csrfToken, inp: inp, next: next, mask: localStorage.mask},
            success: function (res) {
                $(".steps-box").html(res);
                $("input[data-role=upload]").jLoad({
                    path: '/source/items/',
                    onsuccess: function (res, th) {
                        th.closest('[data-role=box-to-upload]').prepend('<div class="load-files"><img src="' + res + '"><input type="hidden" value="' + res + '" name="' + th.closest('[data-role=box-to-upload]').attr('data-name') + '"><i class="fa fa-trash"></i></div>');
                    }
                });
            }
        });
    });

    $(document).on('click', '[data-toggle=final-step]', function () {
        var csrfParam = $('meta[name="csrf-param"]').attr("content");
        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        var inp = [];
        $("[data-input=rows]").each(function () {
            inp[$(this).attr('data-id')] = $(this).val();
        });
        $.ajax({
            url: '/ajax/save-final',
            type: 'post',
            data: {csrtParam: csrfToken, inp: inp},
            success: function (res) {
                $(".steps-box").html('<div class="text-center">Спасибо! После расмотрения модератором ваше объявление будет показываться на сайте</div>');
            }
        });
    });

    /*** TODO Tooltip ****/
    $('.tool-tip').tooltipster();

    /*** TODO Написать заметку ****/
    $(document).on('click','[data-toggle=open-modal-note]',function (e) {
        e.preventDefault();
        $("#writeNote").find('input[name=id]').val($(this).attr('data-id'));
        $("#writeNote").modal('show');
    });

    /*** Жалоба ***/
    $(document).on('click','[data-toggle=write-complain]',function (e) {
        e.preventDefault();
        $("#complain").find('input[name=id]').val($(this).attr('data-id'));
        $("#complain").modal('show');
    });

    $("#form-note-add").submit(function (e) {
        e.preventDefault();
        var id = $(this).find('input[name=id]').val();
        $.ajax({
            url: '/ajax/save-note',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res == 1) {
                    noty('success', 'Заметка создана');
                    $("#writeNote").modal('hide');
                    $("[data-toggle=open-modal-note][data-id=" + id + "]").addClass('active').attr('data-toggle', 'open-edit-modal-note]');
                }
            }
        });
    });

    $("#form-complain").submit(function (e) {
        e.preventDefault();
        var id = $(this).find('input[name=id]').val();
        $.ajax({
            url: '/ajax/save-complain',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res == 'success') {
                    noty('success', 'Жалоба отправлена');
                    $("#complain").modal('hide');
                    //$("[data-toggle=open-modal-note][data-id=" + id + "]").addClass('active').attr('data-toggle', 'open-edit-modal-note]');
                } else {
                    noty('error', 'Ошибка, повторите позже');
                }
            }
        });
    });

    $(document).on('click', '[data-toggle=open-edit-modal-note]', function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        $.ajax({
            url: '/ajax/show-note',
            type: 'post',
            data: {id: id},
            success: function (res) {
                $("#editNote").find('[name=text]').val(res);
                $("#editNote").find('input[name=id]').val(id);
                $("#editNote").modal('show');
            }
        })
    });

    /*** TODO Редактирование заметки ***/
    $("#form-note-edit").submit(function (e) {
        e.preventDefault();
        var id = $(this).find('input[name=id]').val();
        $.ajax({
            url: '/ajax/edit-note',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res == 1) {
                    noty('success', 'Заметка обновлена');
                    $("#editNote").modal('hide');
                }
            }
        })
    });

    /*** TODO Сохранение фильтров ***/
    $("#form-save-filter").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/ajax/save-user-filter',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res == 1) {
                    noty('success', 'Набор сохранен');
                    $("#saveFilter").modal('hide');
                }
            }
        })
    });

    /*** TODO label ***/
    $(document).on('click', '[data-toggle=attach-label]', function (e) {
        e.preventDefault();
        var id = $(this).attr('data-label');
        var icon = $(this).find('i').attr('class');
        $(this).closest('.dropdown').find('.dots').addClass('active').html('<i class="' + icon + '"></i>');
        $.ajax({
            url: '/ajax/save-label',
            type: 'post',
            data: {item_id: $(this).attr('data-id'), label_id: id},
            success: function (res) {

            }
        })
    });

    $(document).on('click', '[data-toggle=attach-label-with-text]', function (e) {
        e.preventDefault();
        var id = $(this).attr('data-label');
        var icon = $(this).find('i').attr('class');
        $(this).closest('.dropdown').find('.dots').addClass('active').html('<a href="#">'+$(this).html()+'</a>');
        $.ajax({
            url: '/ajax/save-label',
            type: 'post',
            data: {item_id: $(this).attr('data-id'), label_id: id},
            success: function (res) {

            }
        })
    });



    /*** TODO change-currency ***/
    $("[data-toggle=change-currency]").click(function (e) {
        e.preventDefault();
        if ($(this).attr('data-curnow') == 'uah') {
            var price = $("#price-box").attr('data-usd');
            $("#price-box").html(price + '<sup>usd</sup>');
            $(this).html('гривнах');
            $("#show-now-currency").html('доларах');
            $(this).attr('data-curnow', 'usd')
        } else {
            var price = $("#price-box").attr('data-uah');
            $("#price-box").html(price + '<sup>грн</sup>');
            $(this).html('доларах');
            $("#show-now-currency").html('гривнах');
            $(this).attr('data-curnow', 'uah')
        }
    });

    /*** TODO Maps ***/
    $(".maps-item-box .close, .backdoor").click(function (e) {
        e.preventDefault();
        $(".maps-item-box, .backdoor").fadeOut();
    });


    /*** TODO Загрузка аватарки ***/
    $("#avatar-input").jLoad({
        onsuccess: function (res) {
            $(".box-avatar img").attr('src', res);
            $("input[name=photo]").val(res);
        },
        path: '/source/users/'
    });
});

/*** TODO Сохранение фильтра с двойным выбором ***/
function saveRangeFilter(key, min = false, max = false) {
    $.ajax({
        url: '/ajax/save-filter-range',
        type: 'post',
        data: {key: key, min: min, max: max},
        success: function (res) {
            $("#all-items").html(res);
            $('.catalog-item-gallery').slick({
                dots: false,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                prevArrow: '<div class="slick-prev"></div>',
                nextArrow: '<div class="slick-next"></div>'
            });
        }
    })
}

/*** TODO Получение символа нажатой кнопки ***/
function getChar(event) {
    if (event.which == null) { // IE
        if (event.keyCode < 32) return null; // спец. символ
        return String.fromCharCode(event.keyCode)
    }

    if (event.which != 0 && event.charCode != 0) { // все кроме IE
        if (event.which < 32) return null; // спец. символ
        return String.fromCharCode(event.which); // остальные
    }

    return null; // спец. символ
}

/*** TODO Показ карточки товара на карте ***/
function showInfoMaps(id) {
    $.ajax({
        url: '/catalog/map-item',
        type: 'post',
        data: {id: id},
        success: function (res) {
            $(".maps-item-box .res").html(res);
            $(".maps-item-box").fadeIn();
            $(".backdoor").fadeIn();
        }
    });
}

/*** TODO Уведомления ***/
function noty(type, text) {
    switch (type) {
        case 'success':
            toastr.success(text);
            break;

        case 'error':
            toastr.error(text);
            break;

        case 'info':
            toastr.info(text);
            break;
    }
}

/*** TODO Карта на корточке товара ***/
function loadMaps() {
    console.log($('#address').val());
    if (localStorage.showmaps == '0') {
        map = new GMaps({
            div: '#map',
            lat: -12.043333,
            lng: -77.028333
        });

        GMaps.geocode({
            address: $('#address').val(),
            callback: function (results, status) {
                if (status == 'OK') {
                    var latlng = results[0].geometry.location;
                    map.setCenter(latlng.lat(), latlng.lng());
                    map.addMarker({
                        lat: latlng.lat(),
                        lng: latlng.lng()
                    });
                }
            }
        });
        localStorage.showmaps = 1;
    }
}

/*** TODO Панорама ***/
function loadPan() {
    if (localStorage.showpan == '0') {
        GMaps.geocode({
            address: $('#address').val(),
            callback: function (results, status) {
                if (status == 'OK') {
                    var latlng = results[0].geometry.location;
                    panorama = GMaps.createPanorama({
                        el: '#panorama',
                        lat: latlng.lat(),
                        lng: latlng.lng()
                    });
                }
            }
        });
        localStorage.showpan = 1;
    }
}