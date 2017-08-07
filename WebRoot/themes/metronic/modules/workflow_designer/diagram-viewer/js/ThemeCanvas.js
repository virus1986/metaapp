// Color.Cornsilk
var ARROW_HEAD_SIMPLE = "simple";
var ARROW_HEAD_EMPTY = "empty";
var ARROW_HEAD_FILL = "FILL";
var MULTILINE_VERTICAL_ALIGN_TOP = "top";
var MULTILINE_VERTICAL_ALIGN_MIDDLE = "middle";
var MULTILINE_VERTICAL_ALIGN_BOTTOM = "bottom";
var MULTILINE_HORIZONTAL_ALIGN_LEFT = "start";
var MULTILINE_HORIZONTAL_ALIGN_MIDDLE = "middle";
var MULTILINE_HORIZONTAL_ALIGN_RIGHT = "end";

// Predefined sized
var TEXT_PADDING = 3;
var ARROW_WIDTH = 4;
var CONDITIONAL_INDICATOR_WIDTH = 16;
var MARKER_WIDTH = 12;
var ANNOTATION_TEXT_PADDING = 7;

// Colors
var TASK_COLOR = "135-#cfe1f1-#fff";// Color.getRGB("#cfe1f1"); //
// Color.OldLace; // original: // Color.get(255, 255, 204);
var TASK_STROKE_COLOR = Color.getRGB("#546778"); // Color.black;
// /*Color.SlateGrey; */

var DEFAULT_HIGH_TASK_STROKE_COLOR = Color.Firebrick1;

// var EXPANDED_SUBPROCESS_ATTRS = Color.black; /*Color.SlateGrey; */
var BOUNDARY_EVENT_COLOR = Color.white;
var CONDITIONAL_INDICATOR_COLOR = Color.get(255, 255, 255);

// var SEQUENCEFLOW_COLOR = Color.DimGrey;
var SEQUENCEFLOW_COLOR = Color.getRGB("#546778"); // Color.black;

var CATCHING_EVENT_COLOR = Color.black; /* Color.SlateGrey; */
var START_EVENT_COLOR = "135-#7ff87f-#fff";// Color.getRGB("#7ff87f"); //
// Color.get(251, 251, 251);
var START_EVENT_STROKE_COLOR = Color.getRGB("#188b18");// Color.black; /*
// Color.SlateGrey; */
var END_EVENT_COLOR = "135-#f88282-#fff";// Color.getRGB("#f88282"); //
// Color.get(251, 251, 251);
// var END_EVENT_STROKE_COLOR = Color.black;
var NONE_END_EVENT_COLOR = "135-#f88282-#fff";// Color.getRGB("#f88282"); //
// Color.Firebrick4;
var NONE_END_EVENT_STROKE_COLOR = Color.getRGB("#7f0000"); // Color.Firebrick4;
var ERROR_END_EVENT_COLOR = Color.Firebrick;
var ERROR_END_EVENT_STROKE_COLOR = Color.Firebrick;
// var LABEL_COLOR = Color.get(112, 146, 190);
var LABEL_COLOR = Color.get(72, 106, 150);

var GATEWAY_COLOR = "135-#f0e68c-#fff";// Color.getRGB("#f0e68c");
var GATEWAY_STROKE_COLOR = Color.getRGB("#a67f00"); // Color.black;
var GATEWAY_MARKER_COLOR = Color.getRGB("#a67f00");

var LABEL_COLOR_BLACK = Color.Black;

// Fonts
var NORMAL_FONT = {
	font : "11px Arial",
	opacity : 1,
	fill : LABEL_COLOR_BLACK
};
var LABEL_FONT = {
	font : "12px Arial",
	"font-style" : "nomal",
	opacity : 1,
	"fill" : LABEL_COLOR_BLACK
};
var LABEL_FONT_SMOOTH = {
	font : "11px Arial",
	"font-style" : "italic",
	opacity : 1,
	"fill" : LABEL_COLOR,
	stroke : LABEL_COLOR,
	"stroke-width" : .4
};
var FLOW_LABEL_FONT = {
	font : "12px Arial",
	"font-style" : "nomal",
	"font-weight" : "bold",
	opacity : 1,
	"fill" : LABEL_COLOR_BLACK
};
var FLOW_LABEL_FONT_SMOOTH = {
	font : "11px Arial",
	opacity : 1,
	"fill" : LABEL_COLOR_BLACK,
	stroke : LABEL_COLOR_BLACK,
	"stroke-width" : .2
};
var TASK_FONT = {
	"font-family" : "simsun",
	font : "12px Arial",
	opacity : 1,
	fill : LABEL_COLOR_BLACK
};
var TASK_FONT_SMOOTH = {
	font : "12px Arial",
	opacity : 1,
	fill : LABEL_COLOR_BLACK,
	stroke : LABEL_COLOR,
	"stroke-width" : .4
};
var POOL_LANE_FONT = {
	font : "12px Arial",
	opacity : 1,
	fill : LABEL_COLOR_BLACK
};
var EXPANDED_SUBPROCESS_FONT = {
	font : "12px Arial",
	opacity : 1,
	fill : LABEL_COLOR_BLACK
};

// Strokes

var NORMAL_STROKE = 2;
var SEQUENCEFLOW_STROKE = 2;

var THICK_TASK_BORDER_STROKE = 3.5;
var GATEWAY_STROKE = 1.5;
var GATEWAY_TYPE_STROKE = 4;
var END_EVENT_STROKE = NORMAL_STROKE + 1;
var MULTI_INSTANCE_STROKE = 2;

var EVENT_SUBPROCESS_ATTRS = {
	"stroke" : Color.black,
	"stroke-width" : NORMAL_STROKE,
	"stroke-dasharray" : ". "
};

// var EXPANDED_SUBPROCESS_ATTRS = {"stroke": Color.black, "stroke-width":
// NORMAL_STROKE, "fill": Color.FloralWhite};
var EXPANDED_SUBPROCESS_ATTRS = {
	"stroke" : Color.black,
	"stroke-width" : NORMAL_STROKE,
	"fill" : Color.WhiteSmoke
};
var NON_INTERRUPTING_EVENT_STROKE = "- ";

var TASK_CORNER_ROUND = 10;
var EXPANDED_SUBPROCESS_CORNER_ROUND = 10;

// icons
var ICON_SIZE = 16;
var ICON_PADDING = 4;
var USERTASK_IMAGE = "images/deployer/user.png";
var SCRIPTTASK_IMAGE = "images/deployer/script.png";
var SERVICETASK_IMAGE = "images/deployer/service.png";
var RECEIVETASK_IMAGE = "images/deployer/receive.png";
var SENDTASK_IMAGE = "images/deployer/send.png";
var NOTIFYTASK_IMAGE = "images/deployer/notify.png";
var MANUALTASK_IMAGE = "images/deployer/manual.png";
var BUSINESS_RULE_TASK_IMAGE = "images/deployer/business_rule.png";
var TIMER_IMAGE = "images/deployer/timer.png";
var MESSAGE_CATCH_IMAGE = "images/deployer/message_catch.png";
var MESSAGE_THROW_IMAGE = "images/deployer/message_throw.png";
var ERROR_THROW_IMAGE = "images/deployer/error_throw.png";
var ERROR_CATCH_IMAGE = "images/deployer/error_catch.png";
var SIGNAL_CATCH_IMAGE = "images/deployer/signal_catch.png";
var SIGNAL_THROW_IMAGE = "images/deployer/signal_throw.png";
var MULTIPLE_CATCH_IMAGE = "images/deployer/multiple_catch.png";

var ObjectType = {
	ELLIPSE : "ellipse",
	FLOW : "flow",
	RECT : "rect",
	RHOMBUS : "rhombus"
};

function OBJ(type) {
	this.c = null;
	this.type = type;
	this.nestedElements = [];
};
OBJ.prototype = {

};

var CONNECTION_TYPE = {
	SEQUENCE_FLOW : "sequence_flow",
	MESSAGE_FLOW : "message_flow",
	ASSOCIATION : "association"
};
