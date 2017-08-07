/**
 * 基本样式
 */
define(["common/utils","plugins/htmleditor/singleItem","directives/toolbar-editors/htmleditor/editor"],function(utils,SingleItem,editor){
	var baseStyleItems=[
	{label:"首行缩进",cmdName:"indent",styleName:"textIndent",styleValue:"2em"},
	{label:"字体加粗",cmdName:"bold",styleName:"fontWeight",styleValue:"bold"},
	{label:"斜体",cmdName:"italic",styleName:"fontStyle",styleValue:"italic"},
	{label:"贯穿线",cmdName:"lineThrough",styleName:"textDecoration",styleValue:"line-through"},
	{label:"下划线",cmdName:"underline",styleName:"textDecoration",styleValue:"underline"},
	{label:"左对齐",cmdName:"left",styleName:"textAlign",styleValue:"left"},
	{label:"居中对齐",cmdName:"center",styleName:"textAlign",styleValue:"center"},
	{label:"右对齐",cmdName:"right",styleName:"textAlign",styleValue:"right"},
	{label:"两端对齐",cmdName:"justify",styleName:"textAlign",styleValue:"justify"}
    ];
	
	$.each(baseStyleItems,function(index,style){
		var Item=SingleItem.extend(style);
		editor.register(Item);
	});
});
