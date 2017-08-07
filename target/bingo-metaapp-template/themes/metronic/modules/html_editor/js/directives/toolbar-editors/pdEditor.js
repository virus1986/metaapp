/**
 * 标题控件
 */
define(['angular',"directives/directives","services/appPd","common/utils",
        "services/binManager","services/editorManager",
        "directives/toolbar-editors/pdTitleEditor","directives/toolbar-editors/pdHtmleditor",
        "directives/toolbar-editors/metaRelationEditor","directives/toolbar-editors/uiTabEditor",
        "directives/toolbar-editors/form/uiFormToolbarEditor","directives/toolbar-editors/metaSlaveTableEditor",
        "directives/toolbar-editors/pdSpecsEditor","directives/toolbar-editors/metaFieldEditor"], function(angular,directiveModule,pd,utils) {
	var directiveName="pdEditor";
	var directive=directiveModule.directive(directiveName, ['$compile',"$animate","$timeout","binManager",function factory($compile,$animate,$timeout,binManager) {
		var directiveDef={};		
		var params={
			transclude: 'element',
			priority: 1000,
			terminal: true,
			restrict: 'A',
		};

		directiveDef=$.extend(true,{},params);	
		
		directiveDef.compile=function compile(tElement, tAttrs,transclusion) {
	    	//var editor=$attr[directiveName];
	    	return function ($scope, $element, $attr) {
	    		var currentScope,
	            	currentElement;
	    		
	    		var cleanupLastEditor = function() {
	    	          if (currentScope) {
	    	            currentScope.$destroy();
	    	            currentScope = null;
	    	          }
	    	          if(currentElement) {
	    	        	 currentElement.remove();
	    	        	 currentElement=null;
	    	          }
	    	     };
	    	     
	    	     var getEditor=function(focus){
	    	    	var editor={name:null,params:null};
	    	    	if(focus.el==null){
	    	    		return editor;
	    	    	}
	 				if(focus.type=="bin" || $(focus.el).attr("layout-id")){
	 					//var bin=focus.el.scope();
	 					var binId=$(focus.el).attr("bin-id")||$(focus.el).attr("layout-id");
	 					var bin=binManager.findBin(binId);
	 					editor.name=bin.module.editorName;
	 					editor.bin=bin;
	 					if(!editor.name&&bin.item){
	 						editor.name=bin.item.editorName;
	 		    		}
	 					editor.params=bin;
	 				}else{
	 					editor.name="pdHtmleditor";
	 				}
	 				return editor;
	    	     };
	    	     
	    	     pd.on("focusChanged",function(focusInfo){
	    	    	cleanupLastEditor();
	    	    	var editor=getEditor(focusInfo.current);	    	    	
	    	    	var newScope = $scope.$new();	    				
	    			transclusion(newScope, function(clone) {
	    				currentScope = newScope;
    	               	currentScope.bin=editor.bin;
    	               	currentScope.focus=focusInfo;
    	                
	   	                currentElement = clone;
	   	                if(editor.name!=null){
		   	                var editorNames=_.str.words(editor.name,",");
		   	                var editorsHtml="";
		   	                $.each(editorNames,function(i,name){
		   	                	editorsHtml+="<div "+_.str.dasherize(name)+"></div>";
		   	                });
		   	                currentElement.html(editorsHtml);
	   	                }
	    	            $element.after(currentElement);
	    	            currentElement.show();
	    	            $compile(currentElement.contents())(currentScope);
	    			});
	    	    });
	    	};
	    };
		return directiveDef;
	}]);
	return directive;
});