(function($) {
    $.fn.place = function(options) {
        options = $.extend({
            speed: 300,
            classBefore: 'place-before',
            classAfter: 'place-after'
        }, options);
        var th = $(this);
        var holder = th.attr('placeholder');
        th.attr('placeholder', '').attr('autocomplete', 'off');
        if (th.val()=='') {
            th.after('<span class="' + options.classBefore + '">' + holder + '</span>');
        } else {
            th.after('<span class="' + options.classBefore + ' '+options.classAfter+'">' + holder + '</span>');
        }

        th.focus(function () {
           $(this).next().addClass(options.classAfter);
        });

        th.blur(function () {
            if ($.trim($(this).val())==''){
                $(this).next().removeClass(options.classAfter);
            }
        });

        th.next().on('click', function () {
            $(this).addClass(options.classAfter);
            $(this).prev().focus();
        });

        return this;
    };
})(jQuery);