var FormWizard = function ($) {

    return {
        //main function to initiate the module
        init: function (form,option) {
            if (!jQuery().bootstrapWizard) {
                return;
            }
        	var _option = {
    			nextSelector : '.button-next',
    			previousSelector : '.button-previous',
    			onTabClick : function(tab, navigation, index){
    				alert('on tab click disabled');
                    return false;
    			},
    			onNext : function (tab, navigation, index){
    			},
    			onPrevious : function (tab, navigation, index) {},
    			onTabShow: function (tab, navigation, index) {
    				var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    navigation.parent().find('.bar').css({
                        width: $percent + '%'
                    });
    			}
        	};
            _option = $.extend(_option,option);
            $form = $(form);
            $form.bootstrapWizard(_option);
        }

    };

}(jQuery);