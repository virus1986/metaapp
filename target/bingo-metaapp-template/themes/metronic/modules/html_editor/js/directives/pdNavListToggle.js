/*global define*/
'use strict';
/**
 * Directive that executes an expression when the element it is applied to loses focus.
 */

define(['angular',"directives/directives"], function(angular,directiveModule) {
	'use strict';
	var navListToggleDirective=directiveModule.directive('pdNavListToggle', [function() {
			return function($scope, elm, attrs) {
				elm.click(function($event){
					var f = $($event.target).closest("a");
					if (!f || f.length == 0) {
						return;
					}
					if (!f.hasClass("dropdown-toggle")) {
						if ($scope.menuMini && f.get(0).parentNode.parentNode == this) {
							var h = f.find(".menu-text").get(0);
							if (event.target != h && !$.contains(h, g.target)) {
								return false;
							}
						}
						return;
					}
					var d = f.next().get(0);
					if (!$(d).is(":visible")) {
						var c = $(d.parentNode).closest("ul");
						if ($scope.menuMini && c.hasClass("nav-list")) {
							return;
						}
						c.find("> .open > .submenu").each(function() {
							if (this != d && !$(this.parentNode).hasClass("active")) {
								$(this).slideUp(200).parent().removeClass("open");
							}
						});
					}
					if ($scope.menuMini && $(d.parentNode.parentNode).hasClass("nav-list")) {
						return false;
					}
					$(d).slideToggle(200).parent().toggleClass("open");
				});
		};
	return navListToggleDirective;
	}]);
});