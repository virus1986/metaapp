$(function () {
    $(window).scroll(function(){
        // add navbar opacity on scroll
        if ($(this).scrollTop() > 100) {
            $(".navbar.navbar-fixed-top").addClass("scroll");
        } else {
            $(".navbar.navbar-fixed-top").removeClass("scroll");
        }

        // global scroll to top button
        if ($(this).scrollTop() > 300) {
            $('.scrolltop').fadeIn();
        } else {
            $('.scrolltop').fadeOut();
        }        
    });

    // scroll back to top btn
    $('.scrolltop').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 700);
        return false;
    });
    
    // scroll navigation functionality
    $('.scroller').click(function(){
    	var section = $($(this).data("section"));
    	var top = section.offset().top;
        $("html, body").animate({ scrollTop: top }, 700);
        return false;
    });
});


var Loader={
	showLoader:function(){
		var zIndex=1000;
		var container=$(document.body);
		var height = Math.max($(document).height()-20,$(window).height()) ;
		var modelEl = $('<div class="ui-dialog-mask ui-widget-overlay"></div>')
			.appendTo(container)
			.css({"z-index":zIndex,"height":height+"px","position":"absolute","left":"0px","top":"0px","width":"100%","display":"none"}) ;
		modelEl.fadeIn("slow",function(){
			var left=container.width()/2-40;
			var top=container.height()/2-80;
			var loader=$("<div class='alert alert-info ui-dialog-loader' style='position:absolute; top:"+top+"px;left:"+left+"px;z-index:19999;'></div>");
			loader.appendTo(container);
		});
	},
	hideLoader:function(){
		var modelEl=$(".ui-dialog-mask");
		if(modelEl.length>0){
			modelEl.fadeOut("fast",function(){
				modelEl.remove();
			});
		}
		var loader=$(".ui-dialog-loader");
		if(loader.length>0){
			loader.fadeOut("fast",function(){
				loader.remove();
			});
		}
	}
	
};

