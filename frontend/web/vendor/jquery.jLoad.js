(function($) {
    $.fn.jLoad = function(options) {
        options = $.extend({
            path: '/source/',
            onsuccess: function(res){
                console.log(res);
            }
        }, options);
        let th = $(this);
        $(this).change(function(evt) {
            console.log('Start load...');
            var files = evt.target.files;
            for (var i = 0, f; f = files[i]; i++) {
                renderImage(f);
            }
        });

        function renderImage(file) {
            var reader = new FileReader();
            reader.onload = function(event) {
                the_url = event.target.result;
                $.ajax({
                    url: '/ajax/load-image',
                    type: 'post',
                    data: 'tmp='+the_url+'&name='+file.name+'&folder='+options.path,
                    success: function(res){
                        options.onsuccess(res, th);
                    },
                    error: function(){
                        alert("Ошибка загрузки");
                    }
                })
            }
            // когда файл считывается он запускает событие OnLoad.
            reader.readAsDataURL(file);
        }

        return this;
    };
})(jQuery);