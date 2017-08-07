/**
 * Binds a Ace widget to an  element.
 */
define(['angular',"directives/directives","common/utils"], function(angular,directiveModule) {
	'use strict';
	var directiveName="uiAce";
	directiveModule.directive(directiveName, function factory($timeout) {
		var directiveDef={
				restrict:'A',
				scope: {
			        aceValue: '='
			    },
			    controller:function($scope, $element, $attrs, $transclude){
			    	$scope.$watch("aceValue",function(value){
			    		if($element.data("ace")&&$element.data("ace").getValue()!==value){
			    			$element.data("ace").setValue(value,-1);
			    		}
			    	});
			    },
				link:function (scope, ele, attrs) {
					var options, opts, aceEditor;
					options = {theme:"ace/theme/eclipse",mode:"ace/mode/html"};
					opts = angular.extend({}, options, scope.$eval(attrs[directiveName]));
					var domId=attrs.id;
					if(!domId){
						throw new Error('uiAce can only be applied to an element has id attribute');
					}
					aceEditor = ace.edit(domId);
					aceEditor.setTheme(opts.theme);
					aceEditor.getSession().setMode(opts.mode);
					aceEditor.setShowPrintMargin(false);
					aceEditor.navigateTo(0,0);
					aceEditor.updateSelectionMarkers();
					aceEditor.on("change", function(e){
						setTimeout(function(){
							scope.$apply(function(){
								scope.aceValue=aceEditor.getValue();
							});
						},10);
					});
					$(ele).data("ace",aceEditor);
				}
			};
		return directiveDef;
	});
});