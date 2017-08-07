/**
 * 基本样式
 */
define(["common/utils","plugins/htmleditor/listItem","directives/toolbar-editors/htmleditor/editor"],function(utils,ListItem,editor){
	var baseListItems=[
	{label:"字体名称",cmdName:"fontFamily",styleName:"fontFamily",valueList:["宋体,SimSun","微软雅黑,Microsoft YaHei","楷体,楷体_GB2312, SimKai","黑体, SimHei","隶书, SimLi","andale mono","arial, helvetica,sans-serif","arial black,avant garde","impact,chicago","times new roman"]},
	{label:"字体尺寸",cmdName:"fontSize",styleName:"fontSize",valueList:["10px","11px","12px","14px","16px","18px","20px","24px","36px"]},
	{label:"字体颜色",cmdName:"color",styleName:"color",valueList:['#ac725e','#d06b64','#f83a22','#fa573c','#ff7537','#ffad46','#42d692','#16a765','#7bd148','#b3dc6c','#fbe983','#fad165','#92e1c0','#9fe1e7','#9fc6e7','#4986e7','#9a9cff','#b99aff','#c2c2c2','#cabdbf','#cca6ac','#f691b2','#cd74e6','#a47ae2','#444444']},
	{label:"行距",cmdName:"lineHeight",styleName:"lineHeight",valueList:["50%","100%","150%","175%","200%","250%","300%"]},
	];
	
	$.each(baseListItems,function(index,style){
		var Item=ListItem.extend(style);
		editor.register(Item);
	});
});
