/**
 * pd-bin='pdMetaField'顶部的工具栏
 */

define(['angular',"directives/directives","common/utils"], function(angular,directiveModule,utils) {
	'use strict';
	var directive=directiveModule.directive('metaFieldEditor', function factory() {
	  var directiveDefinition = {
	    priority: 0,
	    templateUrl: utils.resolveTemplateUrl("toolbar-editors/metafield-editor.html"),
	    replace: true,
	    transclude: false,
	    restrict: 'A',  
	    controller:["$scope", "$element", "$attrs",function($scope, $element, $attrs) {
	    	var modalObj=$("#configValidatorModal");
	    	var fieldBin=$scope.bin;
    		var currentField=fieldBin.data.metaField;
    		var fieldElement=fieldBin.element.find("[meta\\:field='"+currentField+"']");
    		var fieldElementWrapper=fieldElement.parent("._i-wrapper");
    		modalObj.off("shown");
    		modalObj.on("shown",function(){
    			$(modalObj).find(":input").val(null);
    			$(modalObj).find(":checkbox,:radio").prop("checked",false);
    			var validator=fieldElement.attr("data-validator");
    			var targetFields=[];
    			$("form",".page-content").find("[meta\\:field]").not("._i-wrapper").each(function(i,field){
    				var name=$(field).attr("meta:field");
    				if(name!=currentField){
    					targetFields.push(name);
    				}
    			});
    			var $funcSelect=$("[name='validator-func-param-fieldname']",modalObj);
    			var items="<option value=''>--选择目标字段--</option>";
    			$.each(targetFields,function(i,name){
    				items+="<option value='"+name+"'>"+name+"</option>";
    			});
    			$funcSelect.html(items);
    			if(validator){
    				var rules=[];
    				var ruleOptions = validator.match(/\[[^\]]+(\]\]|\])/g);
    				if (ruleOptions) {
    					$.each(ruleOptions, function(index, value) {
    						validator = validator.replace(this, ("##" + index));
    					});
    				}
    				validator = validator.split(",");
    				$.each(validator, function(index, value) {
    					
    					var ruleAndOption = this.split("##");
    					
    					if (ruleAndOption && ruleAndOption.length == 2) {
    						rules.push({
    							name : $.trim(ruleAndOption[0]),
    							options : ruleOptions[ruleAndOption[1]].replace(/^\[|\]$/g, "").split(",")
    						});
    					} else {
    						rules.push({
    							name : $.trim(ruleAndOption[0]),
    							options : []
    						});
    					}
    				});
    				$.each(rules,function(i,rule){
    					var name=rule.name,params=[];
    					if(rule.options.length>1){
    						params=rule.options.slice(1);
    					}
    					if(name=="required"){
    						$("[name='validator-required']",modalObj).prop("checked",true);
    					}
    					if(name=="func"){
    						$("[name='validator-func-name']",modalObj).val(rule.options[0]);
    						$("[name='validator-func-param-fieldname']",modalObj).val(rule.options[1]);
    					}
    				});
    			}
    		});
    		$(".saveBtn",modalObj).off("click");
    		$(".saveBtn",modalObj).on("click",function(){
    			var validator=[];
    			var ok=true;
				var required=$("[name='validator-required']",modalObj).is(":checked");
				if(required){
					validator.push("required");
				}
				$(".func-con",modalObj).each(function(i,t){
					var func=$(t).find(".func-name").val();
					if(func){
						var paramDoms=$(t).find(".func-param");
						if(paramDoms.length==0){
							validator.push("func["+func+"]");
						}else{
							var funcParams=[func],funStr="";
							funStr+="func[";
							paramDoms.each(function(i,t){
								var param=$(t).val();
								if(param){
									funcParams.push(param);
								}else{
									alert("验证函数"+func+"所需参数为空，请选择");
									ok=false;
									return false;
								}
							});
							if(ok){
								funStr+=funcParams.join(",");
							}
							funStr+="]";
							validator.push(funStr);
						}
					}
				});
				if(ok){
					if(validator.length==0){
						fieldElement.removeAttr("data-validator");
						fieldElementWrapper.removeAttr("data-validator");
					}else{
						var vs=validator.join(",");
						fieldElement.attr("data-validator",vs);
						fieldElementWrapper.attr("data-validator",vs);
					}
					modalObj.modal('hide');
				}
			
    		});
	    	$scope.configValidator=function(){
	    		modalObj.modal('show');
	    	};
	    }]
	  };
	  return directiveDefinition;
	});
	return directive;
});