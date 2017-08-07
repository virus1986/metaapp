;(function($) {
	"use strict";
	//根据字段名，判断是否是子表中的字段
	function isSlaveField(fieldName){
		var reg=new RegExp("[^a-zA-Z0-9_]*_slaves[^a-zA-Z0-9_]*","i");
		if(reg.test(fieldName)){
			return true;
		}
		return false;
	}
	
	//根据子表的字段名
	function getSlaveFieldName(fieldName){
		return fieldName.substr(fieldName.lastIndexOf(".")+1);
	}
	
	//解析子表字段名格式
	function resolveSlaveFieldName(fieldName){
		var reg=new RegExp("_slaves\\[['\"\\s]+([a-z0-9A-Z_-]+)['\"\\s]+\\]\\s?\\[\\s?([0-9]+)\\s?\\][.]\\s?([a-z0-9A-Z_-]+)","i");
		var result=(fieldName).match(reg);
		if(result==null){
			return null;
		}
		return {
			entity:result[1],
			index:parseInt(result[2]),
			fieldName:result[3]
		};		
	}
	
	//获取字段的值
	function getFieldValue(el){
		var n = el.name, t = el.type, tag = el.tagName.toLowerCase();

	    if ((!n || el.disabled || t == 'reset' || t == 'button' ||
	        (t == 'checkbox' || t == 'radio') && !el.checked ||
	        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
	        tag == 'select' && el.selectedIndex == -1)) {
	            return null;
	    }

	    if (tag == 'select') {
	        var index = el.selectedIndex;
	        if (index < 0) {
	            return null;
	        }
	        var a = [], ops = el.options;
	        var one = (t == 'select-one');
	        var max = (one ? index+1 : ops.length);
	        for(var i=(one ? index : 0); i < max; i++) {
	            var op = ops[i];
	            if (op.selected) {
	                var v = op.value;
	                if (!v) { // extra pain for IE...
	                    v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
	                }
	                if (one) {
	                    return v;
	                }
	                a.push(v);
	            }
	        }
	        return a;
	    }
	    
	    v=$(el).val();
	    if(v && v.length<10 && $.isNumeric(v)){
	    	v=v-0;
	    }
	    return v;
	}
	
	//表单转对象
	function formToObject(form){
		var formObj={};
		$(":input",form).each(function(i){
			var self=this;
			var fieldName=self.name;
			var fieldValue=	getFieldValue(self);
			if(isSlaveField(fieldName)){
				var fieldInfo=resolveSlaveFieldName(fieldName);
				if(fieldInfo==null) return;
				if(!formObj[fieldInfo.entity]){
					//ToDo:默认子表下标
					formObj[fieldInfo.entity]=new Array(20);
				}
				var slaveObj=formObj[fieldInfo.entity][fieldInfo.index];
				if(slaveObj==null){
					slaveObj={};					
					formObj[fieldInfo.entity][fieldInfo.index]=slaveObj;
				}
				slaveObj[fieldInfo.fieldName]=fieldValue;
			}else{
				formObj[fieldName]=fieldValue;
			}		
		});
		return formObj;
	}
	
	//子表行转对象 
	function slaveTrToObject(form){
		var formObj={};
		$(":input",form).each(function(i){
			var self=this;
			var fieldName=getSlaveFieldName(self.name);			
			var fieldValue=	getFieldValue(self);
			formObj[fieldName]=fieldValue;
		});
		return formObj;
	}
	
	function isAgFunc(funcName){
		if(funcName=="sum" || funcName=="avg"){
			return true;
		}
		return false;
	}
	
	var evalContext={
		sum:function(entity,expression){
			//$item.sum('entity','entity.field+10')
			var val=0;
			var data=this.data;
			var slaveDatas=data[entity];
			if(!slaveDatas || !$.isArray(slaveDatas)) return val;
			$.each(slaveDatas,function(i,item){
				if(!item) return;
				var template="${"+expression.replace(/__index/ig,i)+"}";
				$.template('template', template);
				var result = $.tmpl('template', data);
				if(result.length>0 && $.isNumeric(result.text())){
					result=result.text()-0;
					val=val+result;
				}
			});
			if($.isNumeric(val)){
				val = Math.round(val*100);
				val = val/100;
			}else{
				val = NaN;
			}
			return val;
		},
		avg:function(expression){
			
		},
		getEntity:function(entityName,id){
			var response={};
			try{
				var url=Global.contextPath + "/entities/"+entityName+"/get?id="+id;
				response=jQuery.simpleRequest({
					type: 'get',
					url :url,
					dataType :'json',
					async:false				
				});
			}catch(e){
				
			}
			if(!response){
				response={};
			}
			return response.responseJSON;
		}
	};
	
	//对表达式进行预处理
	function prepareExpression(expression){
		$.each(evalContext,function(key,value){
			//sum(entity.field1+10) ==>  $item.sum('entity','entity.field+10')
			var isAgFunction=isAgFunc(key);			
			var regFunc=new RegExp("("+key+"\\()([^)]+)('?\\))","ig");
			expression=expression.replace(regFunc,function($0,$1,$2,$3){
				if(isAgFunction){
					var cal=$2;
					var regEntity=new RegExp("([a-zA-Z][a-zA-Z0-9_-]*)([.][a-zA-Z][a-zA-Z0-9_-]*)","ig");
					var slaveEntity=null;
					cal=cal.replace(regEntity,function($$0,$$1,$$2){
						slaveEntity=$$1;
						return $$1+"[__index]"+$$2;
					});
					return "$item."+$1+"'"+slaveEntity+"','"+cal+"'"+$3;
				}else{
					return "$item."+$1+$2+$3;
				}
			});
			
		});
		return expression;
	}
	
	//改变计算字段的值
	function changeFieldValue($field,expression,options){
		var isSlave=isSlaveField($field[0].name);
		var formData=null,formContext=null;
		if(isSlave){
			formContext=$field.closest("tr");
			formData=slaveTrToObject(formContext);
		}else{
			formContext=$field.closest("form");
			formData=formToObject(formContext);
		}
		
		var template=expression;
		if(template.indexOf("@{")==0){
			template=template.replace("@{","${");
		}else{
			template="${"+template+"}";
		}
		
		$.template('fieldValueTemplate', template);
		var result = $.tmpl('fieldValueTemplate', formData,evalContext);
		if(result.length>0){
			if(result.text().length < 10 && $.isNumeric(result.text())){
				result=result.text()-0;
				result = Math.round(result*100);
				result = result/100;
			}else{
				result=result.text();
			}
		}else{
			result="";
		}
		
		var sval = $field.val();
		if(sval != result || (sval === '' && result === 0)){
			$field.val(result);
			$field.trigger("change",{"input":$field[0],"old":sval,"new":result});
		}
	}
	
	//判断str是否是合法的字段名
	function isFieldName(str){
		var reg=new RegExp("^[a-zA-Z][a-zA-Z0-9_-]+$","i");
		return reg.test(str);
	}
		
	$.fn.caculate = function(options) {
	    options = options || {};
	    
	    var curField=$(this);
	    var expression =options.expression || curField.data("expression");
	    if(!expression) return this;
	    var prepared=prepareExpression(expression);
	    var isSlave=isSlaveField(curField[0].name);
	    
	    var reg=new RegExp("(([a-zA-Z][a-zA-Z0-9_-]+)\\s?[.]\\s?([a-z][a-z0-9A-Z_-]+))|([.'\"]?[a-zA-Z][a-zA-Z0-9_-]+[('\"]?)","ig");
	    var arr;
	    while ((arr = reg.exec(expression)) != null){
	    	var dependencyField=null;
	    	var context=null;
	    	var dependencyEntity=null;
	    	if(arr[4]){
	    		//同实体字段
	    		if(!isFieldName(arr[4])) continue;
	    		if(isSlave){
	    			context=curField.closest("tr");
	    			dependencyField="[name$='."+arr[4]+"']";
	    		}else{
	    			context=curField.closest("form");
	    			dependencyField="[name='"+arr[4]+"']";
	    		}
	    	}else{
	    		//主-从表
	    		var field=arr[3];
	    		dependencyEntity=arr[2];	    		
	    		context=curField.closest("form").find("[data-slave='"+dependencyEntity+"']");
	    		dependencyField="[name$='."+field+"']";
	    	}
	    	if(context.lengh==0) continue;
	    	$(context).on("change",dependencyField,function(){
	    		var me=$(this);
	    		var field=dependencyField;
	    		changeFieldValue(curField,prepared,{sender:me,senderType:"field",event:"change"});
	    	});
	    	if(dependencyEntity){
	    		$(context).on("addItem",function(){
	    			var me=$(this);
	    			changeFieldValue(curField,prepared,{sender:me,senderType:"container",event:"addItem"});
	    		}).on("delItem",function(){
	    			var me=$(this);
	    			changeFieldValue(curField,prepared,{sender:me,senderType:"container",event:"delItem"});
	    		});
	    	}
	    };
	    return this;
	};

})(jQuery);



