$(function () {
    // setTimeout(function () {
    //     toastr.options = {
    //         closeButton: true,
    //         progressBar: true,
    //         showMethod: 'slideDown',
    //         timeOut: 4000
    //     };
    //     toastr.success('Responsive Admin Theme', 'Welcome to INSPINIA');
    //
    // }, 1300);

    var lang={
        "ru":{
            "success": "Успешно",
            "success_message": "Данные сохранены",
            "error": "Ошибка",
            "error_message": "Ошибка сохранения. Детали в консоле",
            "delete": "Удалить?",
            "delete_message": "Вернуть не будет возможности",
            "delete_success": "Успешно удалено",
            "delete_fail": "Не удалось удалить",
            "yes": "да",
            "no": "нет"
        }
    }

    /********** Тур СЕО *************/
    var tour = new Tour({
        steps: [
            {
                element: "#change-part",
                title: "Шаг 1",
                content: "Выберите нужный раздел",
                container: "body",
            },
            {
                element: "#my-other-element",
                title: "Title of my step",
                content: "Content of my step"
            }
        ]});

    tour.init();

    tour.start();
    /********** end Тур СЕО *************/

    $("#change-part").change(function () {
        $.ajax({
            url: '/admin/ajax',
            type: 'post',
            data: {part: $(this).val(), 'flag':'part'},
            success: function (res) {
                $("#select-element").html('<option value="">--</option><option value="0">Весь раздел</option>'+res);
                $("#select-element").select2();
                $("input[name=title]").val('');
                $("input[name=keywords]").val('');
                $("textarea[name=description]").val('');
            }
        })
    });

    $("#show-rows").change(function () {
        $.ajax({
            url: '/admin/load-rows',
            type: 'post',
            data: {modul: $(this).val()},
            success: function (res) {
                console.log(res);
            }
        })
    });

    $("#select-element").change(function () {
        $.ajax({
            url: '/admin/ajax',
            type: 'post',
            data: {element: $(this).val(), part: $("#change-part").val(), 'flag':'info'},
            dataType: 'json',
            success: function (res) {
                $("input[name=title]").val(res.title).removeAttr('disabled');
                $("input[name=keywords]").val(res.keywords).removeAttr('disabled');
                $("textarea[name=description]").val(res.desc).removeAttr('disabled');
            }
        })
    })

    var sparklineCharts = function(){
        $("#sparkline1").sparkline([34, 43, 43, 35, 44, 32, 44, 52], {
            type: 'line',
            width: '100%',
            height: '50',
            lineColor: '#1ab394',
            fillColor: "transparent"
        });

        $("#sparkline2").sparkline([32, 11, 25, 37, 41, 32, 34, 42], {
            type: 'line',
            width: '100%',
            height: '50',
            lineColor: '#1ab394',
            fillColor: "transparent"
        });

        $("#sparkline3").sparkline([34, 22, 24, 41, 10, 18, 16,8], {
            type: 'line',
            width: '100%',
            height: '50',
            lineColor: '#1C84C6',
            fillColor: "transparent"
        });
    };

    var sparkResize;

    $(window).resize(function(e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparklineCharts, 500);
    });

    sparklineCharts();




    var data1 = [
        [0,4],[1,8],[2,5],[3,10],[4,4],[5,16],[6,5],[7,11],[8,6],[9,11],[10,20],[11,10],[12,13],[13,4],[14,7],[15,8],[16,12]
    ];
    var data2 = [
        [0,0],[1,2],[2,7],[3,4],[4,11],[5,4],[6,2],[7,5],[8,11],[9,5],[10,4],[11,1],[12,5],[13,2],[14,5],[15,2],[16,0]
    ];
    $("#flot-dashboard5-chart").length && $.plot($("#flot-dashboard5-chart"), [
            data1,  data2
        ],
        {
            series: {
                lines: {
                    show: false,
                    fill: true
                },
                splines: {
                    show: true,
                    tension: 0.4,
                    lineWidth: 1,
                    fill: 0.4
                },
                points: {
                    radius: 0,
                    show: true
                },
                shadowSize: 2
            },
            grid: {
                hoverable: true,
                clickable: true,

                borderWidth: 2,
                color: 'transparent'
            },
            colors: ["#1ab394", "#1C84C6"],
            xaxis:{
            },
            yaxis: {
            },
            tooltip: false
        }
    );

    $("[data-pref=out]").keyup(function () {
        var loc=window.location.href;
        if (loc.search('edit')==-1) {
            $("[data-pref=in]").val(translit($(this).val()));
        }
    });

    /*** delete ***/
    $(document).on('click', '[data-toggle=delete]', function () {
        var id = $(this).attr('data-id'),
            table = $(this).attr('data-table'),
            th = $(this);
        swal({
                title: lang.ru.delete,
                text: lang.ru.delete_message,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: lang.ru.yes,
                cancelButtonText: lang.ru.no,
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    $.ajax({
                        url: '/admin/'+table+'/delete/'+id,
                        type: 'post',
                        success: function () {
                            swal(lang.ru.success, lang.ru.delete_success, "success");
                            th.parents('tr').remove();
                        }
                    })
                } else {
                    swal(lang.ru.error, lang.ru.delete_fail, "error");
                }
            });
    });

    $("input[data-toggle=loadFiles]").change(function(evt) {
        var files = evt.target.files;
        var folder=$(this).attr('data-folder');
        var paren=$(this).attr('data-parent');
        var input=$(this).attr('data-name');
        for (var i = 0, f; f = files[i]; i++) {
            renderImage(f, folder, paren, input);
        }
    });

    $("button[data-toggle=insertFiles]").click(function () {
        var b=$(this).closest('.modal');
        var arr=[];
            b.find('input[data-toggle=selectFile]:checked').each(function () {
                b.prev().find('.loadedImage').append('<div class="item"><i class="fa fa-trash" onclick="$(this).parent().remove();"></i><img src="'+$(this).attr('data-file')+'" class="img-thumbnail"><input type="hidden" value="'+$(this).attr('data-file')+'" name="'+$(this).attr('data-name')+'[]"></div>')
            })
        b.modal('hide');
    })

    $( ".loadedImage" ).sortable();


    $(".select2").each(function () {
        if ($(this).attr('id')=='employees-article_id'||$(this).attr('id')=='employees-article_author_id'){
            $(this).select2({
                maximumSelectionLength: 3
            })
        } else {
            $(this).select2();
        }
    });

    $(document).on('click', '[data-toggle=deleteFiles]', function () {
        var file=$(this).closest('.file').find('[data-toggle=selectFile]').attr('data-file');
        var th=$(this).closest('.file-box');
            $.ajax({
                url: '/admin/delete-files',
                type: 'post',
                data: {file: file},
                success: function () {
                    th.remove();
                }
            })
    })

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $(document).on('click', 'input[data-toggle=selectAllInput]', function () {
        $("input[data-toggle=selectForAction]").prop('checked', $(this).prop('checked'));
    })

    if ($("*").is("#codeeditor")) {
        var editor = CodeMirror.fromTextArea(document.getElementById("codeeditor"), {
            lineNumbers: true,
            matchBrackets: true,
            styleActiveLine: true,
            theme: "ambiance"
        });
    }
    if ($("*").is(".code")) {
        var editor = CodeMirror.fromTextArea('.code', {
            lineNumbers: true,
            matchBrackets: true,
            styleActiveLine: true,
            theme: "ambiance",
            mode: "htmlmixed"
        });
    }

    $("#add-block-to-page").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/admin/generate_box',
            type: 'post',
            data: $(this).serialize()+'&code='+editor.getValue(),
            success: function (res) {
                if (res==''){
                    toastr.success(lang.ru.success, lang.ru.success_message);
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                } else {
                    toastr.error(lang.ru.error, lang.ru.error_message);
                    console.log(res);
                }
            }
        })
        return;
    })

    $(document).on('keyup', 'input[data-toggle=generate_insert]', function () {
        var pref=translit($(this).val());
        $(this).closest('.row').find('[data-target=code-box]').html('Код для вставки - {$'+pref+'}');
        $(this).closest('.row').find('[data-target=code-input]').val('{$'+pref+'}');
    });

    // tinymce.init({
    //     selector: '.editor',
    //     height: 300,
    //     language: 'ru',
    //     plugins: [
    //         'advlist autolink lists link charmap print preview anchor',
    //         'searchreplace visualblocks code fullscreen',
    //         'insertdatetime media table contextmenu paste image'
    //     ],
    //     toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | responsivefilemanager link image media',
    //     image_dimensions: false
    // });

    $('.iframe-btn').fancybox({
        iframe : {
            css : {
                width : '90%',
                height: '90%'
            }
        }
    });

    $("[data-toggle=liveedit]").keyup(function () {
        var table=$(this).data('table');
        var input=$(this).data('input');
        var id=$(this).data('id');
        var value=$(this).html();
        var csrfToken = $(this).data('token');
        $.ajax({
            url: '/admin/liveedit',
            type: 'post',
            data: {table: table, input: input, id:id, _csrf: csrfToken, value: value},
            success: function (res) {
                console.log(res);
            }
        })
    });

    /*** Chart ***/
});

const item = {
    'edit': function (id) {
        $.ajax({
            url: '/admin/site/edit-item',
            type: 'post',
            data: {id:id, '_csrf-backend': $("meta[name=csrf-token]").attr('content')},
            success: function (res) {
                $("#edit-item .modal-body").html(res);
                $("#edit-item").modal('show');
            }
        });
    },

    'more': function (id) {
        $.ajax({
            url: '/admin/site/more-fields',
            type: 'post',
            data: {id:id, '_csrf-backend': $("meta[name=csrf-token]").attr('content')},
            success: function (res) {
                $("#mresult").html(res);
            }
        });
    },

    'save': function () {
        $.ajax({
            url: '/admin/site/save-item-prop',
            type: 'post',
            data: $('#save-item-prop').serialize()+'&_csrf-backend='+$("meta[name=csrf-token]").attr('content'),
            success: function (res) {
                if (res=='success'){
                    alert("Сохранено");
                } else {
                    alert("Ошибка сохранения");
                }
            }
        });
    }
};

var action={
    'delete': function (table) {
        var id=[];

        $("input[data-toggle=selectForAction]:checked").each(function () {
            id.push($(this).val());
        });

        $.ajax({
            url: '/admin/action/delete',
            type: 'post',
            data: {id: id, table: table},
            success: function (res) {
                window.location.reload();
            }
        })
    },

    'active': function (table) {
        var id=[];

        $("input[data-toggle=selectForAction]:checked").each(function () {
            id.push($(this).val());
        });

        $.ajax({
            url: '/admin/action/active',
            type: 'post',
            data: {id: id, table: table},
            success: function (res) {
                window.location.reload();
            }
        })
    },

    'deactive': function (table) {
        var id=[];

        $("input[data-toggle=selectForAction]:checked").each(function () {
            id.push($(this).val());
        });

        $.ajax({
            url: '/admin/action/deactive',
            type: 'post',
            data: {id: id, table: table},
            success: function (res) {
                window.location.reload();
            }
        })
    },

    'archive': function (table) {
        var id=[];

        $("input[data-toggle=selectForAction]:checked").each(function () {
            id.push($(this).val());
        });

        $.ajax({
            url: '/admin/action/archive',
            type: 'post',
            data: {id: id, table: table},
            success: function (res) {
                window.location.reload();
            }
        })
    },

    'sort': function (rows) {
        var tmp_url='';
        var type='';
        var url=(window.location.search).split('&');
            for (i=0;i<url.length;i++){
                var n=url[i].split('=');
                if (n[0].replace('?', '')!='sort'&&n[0]!=''&&n[0]!='type'){
                    tmp_url+=n[0]+'='+n[1]+'&';
                }

                if (n[0]=='type'){
                    if (n[1]=='desc'){
                        type='asc';
                    } else {
                        type='desc';
                    }
                }
            }
            if (type==''){
                type='asc';
            }
            if (tmp_url==''){
                document.cookie='statusUrl='+window.location.pathname+'?sort='+rows+'&type='+type;
                window.location.replace(window.location.pathname+'?sort='+rows+'&type='+type);
            } else {
                document.cookie='statusUrl='+window.location.pathname+tmp_url+'sort='+rows+'&type='+type;
                window.location.replace(window.location.pathname+tmp_url+'sort='+rows+'&type='+type);
            }
    },
    
    'filter': function (column, value) {
        var tmp_url='';
        var type='';
        var url=(window.location.search).split('&');
        for (i=0;i<url.length;i++){
            var n=url[i].split('=');
            if (n[0].replace('?', '')!=column&&n[0]!=''){
                tmp_url+=n[0]+'='+n[1]+'&';
            }
        }
        tmp_url = tmp_url.replace('?', '');
        if (value!='') {
            if (tmp_url == '') {
                document.cookie = 'statusUrl=' + window.location.pathname + '?' + column + '=' + value;
                window.location.replace(window.location.pathname + '?' + column + '=' + value);
            } else {
                document.cookie = 'statusUrl=' + window.location.pathname + '?' + tmp_url + column + '=' + value;
                window.location.replace(window.location.pathname + '?' + tmp_url + column + '=' + value);
            }
        } else {
            if (tmp_url == '') {
                document.cookie = 'statusUrl=' + window.location.pathname;
                window.location.replace(window.location.pathname);
            } else {
                document.cookie = 'statusUrl=' + window.location.pathname + '?' + tmp_url;
                window.location.replace(window.location.pathname + '?' + tmp_url);
            }
        }
    }
};

var block={
    'add': function () {
        $("#input-to-block").append('<div class="form-group clearfix row"><div class="col-md-4"><input type="text" name="input_name[]" placeholder="название поля" data-toggle="generate_insert" required class="form-control"></div><div class="col-md-4"><select name="input_type[]" class="form-control"><option value="input">Поле ввода</option><option value="editor">Редактор</option></select></div><div class="col-md-4"  data-target="code-box"></div><input type="hidden" value="" name="input_pref[]" data-target="code-input"></div>');
    },
    
    'generate_insert': function (srt, th) {
        th.closest('.row').find('[data-target=code-input]').html('Код для вставки - {$'+translit(srt)+'}');
    }
}

function TrimStr(s) {
    s = s.replace(/^-/, '');
    return s.replace(/-$/, '');
}

function translit(text){
// Символ, на который будут заменяться все спецсимволы
    var space = '-';
// Берем значение из нужного поля и переводим в нижний регистр
    var text = text.toLowerCase();

// Массив для транслитерации
    var transl = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
        'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'і': 'i', 'є':'e', 'ї': 'i', 'щ': 'sh','ъ': space, 'ы': 'y', 'ь': space, 'э': 'e', 'ю': 'yu', 'я': 'ya', '’':space,
        ' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
        '#': space, '$': space, '%': space, '^': space, '&': space, '*': space,
        '(': space, ')': space, '\=': space, '+': space, '[': space,
        ']': space, '\\': space, '|': space, '/': space,'.': space, ',': space,
        '{': space, '}': space, '\'': space, '"': space, ';': space, ':': space,
        '?': space, '<': space, '>': space, '№':space, '«':space, '»':space
    }

    var result = '';
    var curent_sim = '';

    for(i=0; i < text.length; i++) {
        // Если символ найден в массиве то меняем его
        if(transl[text[i]] != undefined) {
            if(curent_sim != transl[text[i]] || curent_sim != space){
                result += transl[text[i]];
                curent_sim = transl[text[i]];
            }
        }
        // Если нет, то оставляем так как есть
        else {
            result += text[i];
            curent_sim = text[i];
        }
    }

    result = TrimStr(result);

    return result;
}

function renderImage(file, folder, element, input) {
    $(element).find('.spin-button').html('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>');
    var name=file.name;
    var reader = new FileReader();
    reader.onload = function(event) {
        the_url = event.target.result;
        $.ajax({
            url: '/admin/load',
            type: 'post',
            data: 'tmp='+the_url+'&name='+name+'&folder='+folder+'&input='+input,
            success: function(res){
                $(element).find('.allBoxFiles').append(res);
                $(element).find('.spin-button').html('Завантажити');
            },
            error: function(){
                toastr.error('Помилка завантаження файла');
                $(element).find('.spin-button').html('Завантажити');
            }
        })

    }
    // когда файл считывается он запускает событие OnLoad.
    reader.readAsDataURL(file);
}

function responsive_filemanager_callback(field_id){
    var url=jQuery('#'+field_id).val();
    var real_url=url.split(window.location.hostname);
    $('#'+field_id).closest('.form-group').find('.loadedImage').append('<div class="item"><i class="fa fa-trash" onclick="$(this).parent().remove();"></i><img src="'+real_url[1]+'" class="img-thumbnail"><input type="hidden" value="'+real_url[1]+'" name="'+$('#'+field_id).attr('data-name')+'"></div>')
    parent.$.fancybox.close();
}

