;(function($){
	$.browserFix.register("ie","6","base",function( target ){
		$('.row div[class^="span"]:last-child',target).addClass('last-child');
	    $(':button[class="btn"], :reset[class="btn"], :submit[class="btn"], input[type="button"]',target).addClass('button-reset');
	    $('input:checkbox,input:radio',target).addClass('input-checkbox');
	    $('.pagination li:first-child a',target).addClass('pagination-first-child');
	});
	$.browserFix.register("ie","6","bootstrap",function( target ){
					$('.row div[class^="span"]:last-child').addClass('last-child');
					$(".row-fluid > [class*='span']").addClass("row-fluid-span") ;
					$('.row-fluid > [class*="span"]:first-child').addClass("row-span-first") ;
					$("input[type='checkbox'],input[type='radio']").addClass("input-check");

					$(".pagination li:first-child").addClass("pagination-first") ;
	} ) ;
	$.browserFix.register("ie",['6','7','8'],"bootstrap",function( target ){
			$(".table-striped tbody tr:even").addClass("table-striped-odd") ;
			$(".table-striped tbody tr").hover(function(){
					$(this).addClass("table-row-hover") ;
			},function(){
					$(this).removeClass("table-row-hover") ;
			}) ;
	} ) ;
}(jQuery));