/**
 * Represents a canvas on which BPMN 2.0 constructs can be drawn.
 * 
 * Some of the icons used are licenced under a Creative Commons Attribution 2.5
 * License, see http://www.famfamfam.com/lab/icons/silk/
 * 
 * @see ProcessDiagramGenerator
 * @author (Java) Joram Barrez
 * @author (Javascript) Dmitry Farafonov
 */

var Canvas_IsDrawShadow = false;
var Canvas_useCustomTheme = false;

var Canvas_IsFlowTrack = false;

var Canvas_HighlightsData = {};
var SvgExt=SvgExt||false;
// var Canvas_HighlightsData = {
// historyActivities : [ "StartEvent_1", "UserTask_1", "UserTask_1",
// "NotifyTask_1", "ServiceTask_1", "InclusiveGateway_2" ],
// activities : [ "CallActivity_1","UserTask_2" ],
// flows : [ "SequenceFlow_2", "SequenceFlow_14", "SequenceFlow_15",
// "SequenceFlow_16", "SequenceFlow_17","SequenceFlow_3" ]
// };

var ProcessDiagramCanvas = function() {
};
ProcessDiagramCanvas.$initCanvasWidth=880;
ProcessDiagramCanvas.$initCanvasHeight=3000;
ProcessDiagramCanvas.prototype = {
	// var ProcessDiagramCanvas = {
	canvasHolder : "holder",
	canvasWidth : 0,
	canvasHeight : 0,
	fillColor : Color.white,
	paint : Color.black,
	strokeWidth : 0,
	font : null,
	fontSmoothing : null,

	g : null,
	ninjaPaper : null,

	objects : [],

	processDefinitionId : null,
	activity : null,
	ProcessDiagramGenerator:null,

	frame : null,

	debug : false,

	/**
	 * Creates an empty canvas with given width and height.
	 */
	init : function(x, y, width, height, processDefinitionId,canvasHolderDiv,ProcessDiagramGenerator) {
		this.canvasWidth = width * 1.2;
		this.canvasHeight = height * 1.1;
		this.ProcessDiagramGenerator=ProcessDiagramGenerator;

		// TODO: name it as 'canvasName'
		if (!processDefinitionId)
			processDefinitionId = "holder";

		this.processDefinitionId = processDefinitionId;
		if(canvasHolderDiv){
			canvasHolderDiv.style.width = this.canvasWidth;
			canvasHolderDiv.style.height = this.canvasHeight;
			this.g = Raphael(canvasHolderDiv);
		}else{
			this.canvasHolder = this.processDefinitionId;
			var h = document.getElementById(this.canvasHolder);
			if (!h)
				return;
			
			h.style.width = this.canvasWidth;
			h.style.height = this.canvasHeight;
			
			this.g = Raphael(this.canvasHolder);
		}
		this.g.setViewBox(x, y, this.canvasWidth, this.canvasHeight, true);
		this.g.setSize(this.canvasWidth, this.canvasHeight);//fit canvas width and height for ie and firefox
		this.g.clear();

		this.setStroke(NORMAL_STROKE);

		this.setPaint(Color.black);
		this.setFillColor(Color.white);
		this.setFont(NORMAL_FONT);
		/*if (!Canvas_IsFlowTrack) {
			this.setPaint(Color.black);
			this.setFillColor(Color.white);
			this.setFont(NORMAL_FONT);
		} else {
			if (Canvas_useCustomTheme) {
				this.setPaint(HIGH_DISABLED_COLOR);
				this.setFillColor(HIGH_DISABLED_FILL_COLOR);
				this.setFont(HIGH_DISABLED_FONT);
			} else {
				this.setPaint(DISABLED_COLOR);
				this.setFillColor(DISABLED_FILL_COLOR);
				this.setFont(DISABLED_FONT);
			}
		}*/
		this.fontSmoothing = true;

		// ninja!
		var RaphaelOriginal = Raphael;
		this.ninjaPaper = (function(local_raphael) {
			var paper = local_raphael(1, 1, 1, 1, processDefinitionId);
			return paper;
		})(Raphael.ninja());
		Raphael = RaphaelOriginal;
	},
	setFillColor : function(color) {
		this.fillColor = color;
	},
	getFillColor : function() {
		return this.fillColor;
	},
	setPaint : function(color) {
		this.paint = color;
	},
	getPaint : function() {
		return this.paint;
	},
	setStroke : function(strokeWidth) {
		this.strokeWidth = strokeWidth;
	},
	getStroke : function() {
		return this.strokeWidth;
	},
	/*
	 * setFont: function(family, weight, style, stretch){ this.font =
	 * this.g.getFont(family, weight); },
	 */
	setFont : function(font) {
		this.font = font;
	},
	getFont : function() {
		return this.font;
	},
	drawShaddow : function(object) {
		if (!Canvas_IsDrawShadow)
			return null;

		var border = object.clone();
		border.attr({
			"stroke-width" : this.strokeWidth + 4,
			"stroke" : Color.white,
			"fill" : Color.white,
			"opacity" : 1,
			"stroke-dasharray" : null
		});
		// border.toBack();
		object.toFront();

		return border;
	},

	setConextObject : function(obj) {
		this.contextObject = obj;
	},
	getConextObject : function() {
		return this.contextObject;
	},
	setContextToElement : function(object) {
		var contextObject = this.getConextObject();
		object.id = contextObject.id;
		object.data("contextObject", contextObject);
	},
	onClick : function(event, instance, element) {
		var overlay = element;
		var set = overlay.data("set");
		var contextObject = overlay.data("contextObject");
		// console.log("["+contextObject.getProperty("type")+"], activityId: " +
		// contextObject.getId());
		var ProcessDiagramGenerator=this.ProcessDiagramGenerator;
		if (ProcessDiagramGenerator.options
				&& ProcessDiagramGenerator.options.on
				&& ProcessDiagramGenerator.options.on.click) {
			var args = [ instance, element, contextObject ,ProcessDiagramGenerator];
			ProcessDiagramGenerator.options.on.click.apply(event, args);
		}
	},
	onRightClick : function(event, instance, element) {
		var overlay = element;
		var set = overlay.data("set");
		var contextObject = overlay.data("contextObject");
		// console.log("[%s], activityId: %s (RIGHTCLICK)",
		// contextObject.getProperty("type"), contextObject.getId());
		var ProcessDiagramGenerator=this.ProcessDiagramGenerator;
		if (ProcessDiagramGenerator.options
				&& ProcessDiagramGenerator.options.on
				&& ProcessDiagramGenerator.options.on.rightClick) {
			var args = [ instance, element, contextObject  ,ProcessDiagramGenerator];
			ProcessDiagramGenerator.options.on.rightClick.apply(event, args);
		}
	},
	onHoverIn : function(event, instance, element) {
		var overlay = element;
		var set = overlay.data("set");
		var contextObject = overlay.data("contextObject");

		var border = instance.g.getById(contextObject.id + "_border");
		border.attr("opacity", 0.3);
		var ProcessDiagramGenerator=this.ProcessDiagramGenerator;
		// provide callback
		if (ProcessDiagramGenerator.options
				&& ProcessDiagramGenerator.options.on
				&& ProcessDiagramGenerator.options.on.over) {
			var args = [ instance, element, contextObject  ,false,ProcessDiagramGenerator];
			ProcessDiagramGenerator.options.on.over.apply(event, args);
		}
	},
	onHoverOut : function(event, instance, element) {
		var overlay = element;
		var set = overlay.data("set");
		var contextObject = overlay.data("contextObject");

		var border = instance.g.getById(contextObject.id + "_border");
		border.attr("opacity", 0.0);
		var ProcessDiagramGenerator=this.ProcessDiagramGenerator;
		// provide callback
		if (ProcessDiagramGenerator.options
				&& ProcessDiagramGenerator.options.on
				&& ProcessDiagramGenerator.options.on.out) {
			var args = [ instance, element, contextObject  ,ProcessDiagramGenerator];
			ProcessDiagramGenerator.options.on.out.apply(event, args);
		}
	},
	onFlowHoverIn : function(event, instance, element) {
		var overlay = element;
		var set = overlay.data("set");
		var contextObject = overlay.data("contextObject");
		var ProcessDiagramGenerator=this.ProcessDiagramGenerator;
		// provide callback
		if (ProcessDiagramGenerator.options
				&& ProcessDiagramGenerator.options.on
				&& ProcessDiagramGenerator.options.on.over) {
			var args = [ instance, element, contextObject, true  ,ProcessDiagramGenerator];
			ProcessDiagramGenerator.options.on.over.apply(event, args);
		}
	},
	onFlowHoverOut : function(event, instance, element) {
		var overlay = element;
		var set = overlay.data("set");
		var contextObject = overlay.data("contextObject");
		var ProcessDiagramGenerator=this.ProcessDiagramGenerator;
		// provide callback
		if (ProcessDiagramGenerator.options
				&& ProcessDiagramGenerator.options.on
				&& ProcessDiagramGenerator.options.on.out) {
			var args = [ instance, element, contextObject ,ProcessDiagramGenerator ];
			ProcessDiagramGenerator.options.on.out.apply(event, args);
		}
	},
	addHandlers : function(set, x, y, width, height, type) {
		if(SvgExt&&SvgExt.addHandlers){
			SvgExt.addHandlers.apply(this,[set, x, y, width, height, type]);
			return;
		}
		var contextObject = this.getConextObject();

		var cx = x + width / 2, cy = y + height / 2;
		if (type == "event") {
			var border = this.g.ellipse(cx, cy, width / 2 + 4, height / 2 + 4);
			var overlay = this.g.ellipse(cx, cy, width / 2, height / 2);
		} else if (type == "gateway") {
			var border = this.g.path("M" + (x - 4) + " " + (y + (height / 2))
					+ "L" + (x + (width / 2)) + " " + (y + height + 4) + "L"
					+ (x + width + 4) + " " + (y + (height / 2)) + "L"
					+ (x + (width / 2)) + " " + (y - 4) + "z");
			var overlay = this.g.path("M" + x + " " + (y + (height / 2)) + "L"
					+ (x + (width / 2)) + " " + (y + height) + "L"
					+ (x + width) + " " + (y + (height / 2)) + "L"
					+ (x + (width / 2)) + " " + y + "z");
		} else if (type == "task") {
			var border = this.g.rect(x - 4, y - 4, width + 9, height + 9,
					TASK_CORNER_ROUND + 4);
			var overlay = this.g.rect(x, y, width, height, TASK_CORNER_ROUND);
		}

		border.attr({
			stroke : Color.get(132, 112, 255)/* Color.Tan1 */,
			"stroke-width" : 4,
			opacity : 0.0
		});
		border.id = contextObject.id + "_border";

		set.push(border);

		overlay.attr({
			stroke : Color.Orange,
			"stroke-width" : 3,
			fill : Color.get(0, 0, 0),
			opacity : 0.0,
			cursor : "hand"
		});
		overlay.data("set", set);
		overlay.id = contextObject.id;
		overlay.data("contextObject", contextObject);

		var instance = this;
		overlay.mousedown(function(event) {
			if (event.button == 2)
				instance.onRightClick(event, instance, this);
		});
		overlay.click(function(event) {
			instance.onClick(event, instance, this);
		});
		overlay.hover(function(event) {
			instance.onHoverIn(event, instance, this);
		}, function(event) {
			instance.onHoverOut(event, instance, this);
		});
		var that=this;
		if($.isArray(ProcessDiagramCanvas.handlerChains)){
			$.each(ProcessDiagramCanvas.handlerChains,function(i,handler){
				var func=handler.func;
				var params=handler.params||{};
				params.overlay=overlay;
				func.apply(that,[set, x, y, width, height, type,params]);
			});
		}
	},

	/*
	 * Start Events:
	 * 
	 * drawNoneStartEvent drawTimerStartEvent drawMessageStartEvent
	 * drawErrorStartEvent drawSignalStartEvent _drawStartEventImage
	 * _drawStartEvent
	 */

	drawNoneStartEvent : function(id, name, x, y, width, height) {
		this.g.setStart();

		var isInterrupting = undefined;
		this._drawStartEvent(id, name, x, y, width, height, isInterrupting,
				null);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawTimerStartEvent : function(id, name, x, y, width, height,
			isInterrupting) {
		this.g.setStart();

		this._drawStartEvent(id, name, x, y, width, height, isInterrupting,
				null);

		var cx = x + width / 2 - this.getStroke() / 4;
		var cy = y + height / 2 - this.getStroke() / 4;

		var w = width * .9;// - this.getStroke()*2;
		var h = height * .9;// - this.getStroke()*2;

		this._drawClock(cx, cy, w, h);

		if (this.gebug)
			var center = this.g.ellipse(cx, cy, 3, 3).attr({
				stroke : "none",
				fill : Color.green
			});

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawMessageStartEvent : function(id, name, x, y, width, height,
			isInterrupting) {
		this.g.setStart();

		this._drawStartEvent(id, name, x, y, width, height, isInterrupting,
				null);

		this._drawStartEventImage(x, y, width, height, MESSAGE_CATCH_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawErrorStartEvent : function(id, name, x, y, width, height) {
		this.g.setStart();
		var isInterrupting = undefined;
		this._drawStartEvent(id, name, x, y, width, height, isInterrupting);

		this._drawStartEventImage(x, y, width, height, ERROR_CATCH_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawSignalStartEvent : function(id, name, x, y, width, height,
			isInterrupting) {
		this.g.setStart();
		this._drawStartEvent(id, name, x, y, width, height, isInterrupting,
				null);

		this._drawStartEventImage(x, y, width, height, SIGNAL_CATCH_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawMultipleStartEvent : function(id, name, x, y, width, height,
			isInterrupting) {
		this.g.setStart();

		this._drawStartEvent(id, name, x, y, width, height, isInterrupting,
				null);

		var cx = x + width / 2 - this.getStroke() / 4;
		var cy = y + height / 2 - this.getStroke() / 4;

		var w = width * 1;
		var h = height * 1;

		this._drawPentagon(cx, cy, w, h);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	_drawStartEventImage : function(x, y, width, height, image) {
		var cx = x + width / 2 - this.getStroke() / 2;
		var cy = y + height / 2 - this.getStroke() / 2;

		var w = width * .65;// - this.getStroke()*2;
		var h = height * .65;// - this.getStroke()*2;

		var img = this.g.image(image, cx - w / 2, cy - h / 2, w, h);
	},

	_drawStartEvent : function(id, name, x, y, width, height, isInterrupting) {
		if(SvgExt&&SvgExt._drawStartEvent){
			SvgExt._drawStartEvent.apply(this,[id, name, x, y, width, height, isInterrupting]);
			return;
		}
		var originalPaint = this.getPaint();
		var originalFill = this.getFillColor();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				this.setPaint(HIGHLIGHT_COLOR);
				this.setFillColor(HIGHLIGHT_FILLCOLOR);
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HISTORY_COLOR);
					this.setFillColor(HISTORY_FILLCOLOR);
				} else {
					this.setPaint(START_EVENT_STROKE_COLOR);
					this.setFillColor(START_EVENT_COLOR);
				}
			}
		} else {
			this.setPaint(START_EVENT_STROKE_COLOR);
			this.setFillColor(START_EVENT_COLOR);
		}

		width -= this.getStroke() / 2;
		height -= this.getStroke() / 2;

		x = x + width / 2;
		y = y + height / 2;

		var circle = this.g.ellipse(x, y, width / 2, height / 2);

		circle.attr({
			"stroke-width" : this.getStroke(),
			"stroke" : this.getPaint(),
			"fill" : this.getFillColor()
		});

		// white shaddow
		this.drawShaddow(circle);

		if (isInterrupting != null && isInterrupting != undefined
				&& !isInterrupting)
			circle.attr({
				"stroke-dasharray" : NON_INTERRUPTING_EVENT_STROKE
			});

		this.setContextToElement(circle);

		this.setPaint(originalPaint);
		this.setFillColor(originalFill);
	},

	/*
	 * End Events:
	 * 
	 * drawNoneEndEvent drawErrorEndEvent drawMessageEndEvent drawSignalEndEvent
	 * drawMultipleEndEvent _drawEndEventImage _drawNoneEndEvent
	 */

	drawNoneEndEvent : function(id, name, x, y, width, height) {
		this.g.setStart();

		this._drawNoneEndEvent(id, name, x, y, width, height, null,
				"noneEndEvent");

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawErrorEndEvent : function(id, name, x, y, width, height) {
		this.g.setStart();
		var type = "errorEndEvent";
		this._drawNoneEndEvent(id, name, x, y, width, height, null, type);

		this._drawEndEventImage(x, y, width, height, ERROR_THROW_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawMessageEndEvent : function(id, name, x, y, width, height) {
		this.g.setStart();
		var type = "errorEndEvent";
		this._drawNoneEndEvent(id, name, x, y, width, height, null, type);

		this._drawEndEventImage(x, y, width, height, MESSAGE_THROW_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawSignalEndEvent : function(id, name, x, y, width, height) {
		this.g.setStart();
		var type = "errorEndEvent";
		this._drawNoneEndEvent(id, name, x, y, width, height, null, type);

		this._drawEndEventImage(x, y, width, height, SIGNAL_THROW_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawMultipleEndEvent : function(id, name, x, y, width, height) {
		this.g.setStart();
		var type = "errorEndEvent";
		this._drawNoneEndEvent(id, name, x, y, width, height, null, type);

		var cx = x + width / 2;// - this.getStroke();
		var cy = y + height / 2;// - this.getStroke();

		var w = width * 1;
		var h = height * 1;

		var filled = true;
		this._drawPentagon(cx, cy, w, h, filled);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawTerminateEndEvent : function(id, name, x, y, width, height) {
		this.g.setStart();
		var type = "noneEndEvent";// "errorEndEvent";
		this._drawNoneEndEvent(id, name, x, y, width, height, null, type);

		var cx = x + (width / 2);// - this.getStroke()/2;
		var cy = y + (height / 2);// - this.getStroke()/2;

		var w = width / 2 * .5;
		var h = height / 2 * .5;

		var originalPaint = this.getPaint();
		var originalFill = this.getFillColor();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				this.setPaint(HISTORY_COLOR);
				this.setFillColor(HISTORY_FILLCOLOR);
			} else if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				this.setPaint(HIGHLIGHT_COLOR);
				this.setFillColor(HIGHLIGHT_FILLCOLOR);
			}

		} else {

			if (type == "errorEndEvent") {
				this.setPaint(ERROR_END_EVENT_STROKE_COLOR);
				this.setFillColor(ERROR_END_EVENT_COLOR);
			} else {
				this.setPaint(NONE_END_EVENT_STROKE_COLOR);
				this.setFillColor(NONE_END_EVENT_COLOR);
			}
		}

		var circle = this.g.ellipse(cx, cy, w, h).attr({
			"stroke-width" : this.strokeWidth,
			"stroke" : this.getPaint(),
			"fill" : this.getPaint()
		});

		this.setPaint(originalPaint);
		this.setFillColor(originalFill);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	_drawEndEventImage : function(x, y, width, height, image) {
		var cx = x + width / 2 - this.getStroke() / 2;
		var cy = y + height / 2 - this.getStroke() / 2;

		var w = width * .65;
		var h = height * .65;

		var img = this.g.image(image, cx - w / 2, cy - h / 2, w, h);
	},

	_drawNoneEndEvent : function(id, name, x, y, width, height, image, type) {
		if(SvgExt&&SvgExt._drawNoneEndEvent){
			SvgExt._drawNoneEndEvent.apply(this,[id, name, x, y, width, height, image, type]);
			return;
		}
		var originalPaint = this.getPaint();
		var originalFill = this.getFillColor();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HIGHLIGHT_COLOR);
					this.setFillColor(HIGHLIGHT_FILLCOLOR);
				} else {
					if (type == "errorEndEvent") {
						this.setPaint(ERROR_END_EVENT_STROKE_COLOR);
						this.setFillColor(ERROR_END_EVENT_COLOR);
					} else {
						this.setPaint(NONE_END_EVENT_STROKE_COLOR);
						this.setFillColor(NONE_END_EVENT_COLOR);
					}
				}
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HISTORY_COLOR);
					this.setFillColor(HISTORY_FILLCOLOR);
				} else {
					if (type == "errorEndEvent") {
						this.setPaint(ERROR_END_EVENT_STROKE_COLOR);
						this.setFillColor(ERROR_END_EVENT_COLOR);
					} else {
						this.setPaint(NONE_END_EVENT_STROKE_COLOR);
						this.setFillColor(NONE_END_EVENT_COLOR);
					}
				}
			}
		} else {

			if (type == "errorEndEvent") {
				this.setPaint(ERROR_END_EVENT_STROKE_COLOR);
				this.setFillColor(ERROR_END_EVENT_COLOR);
			} else {
				this.setPaint(NONE_END_EVENT_STROKE_COLOR);
				this.setFillColor(NONE_END_EVENT_COLOR);
			}
		}

		// event circles
		// width -= this.strokeWidth / 2;
		// height -= this.strokeWidth / 2;

		x = x + width / 2;// + this.strokeWidth/2;
		y = y + width / 2;// + this.strokeWidth/2;

		// outerCircle
		var outerCircle = this.g.ellipse(x, y, width / 2, height / 2);

		// white shaddow
		var shaddow = this.drawShaddow(outerCircle);

		outerCircle.attr({
			"stroke-width" : this.strokeWidth,
			"stroke" : this.getPaint(),
			"fill" : this.getFillColor()
		});

		var innerCircleX = x;
		var innerCircleY = y;
		var innerCircleWidth = width / 2 - 2;
		var innerCircleHeight = height / 2 - 2;
		var innerCircle = this.g.ellipse(innerCircleX, innerCircleY,
				innerCircleWidth, innerCircleHeight);
		innerCircle.attr({
			"stroke-width" : this.strokeWidth,
			"stroke" : this.getPaint(),
			"fill" : this.getFillColor()
		});

		// TODO: implement it
		// var originalPaint = this.getPaint();
		// this.g.setPaint(BOUNDARY_EVENT_COLOR);

		this.setPaint(originalPaint);
		this.setFillColor(originalFill);
	},

	/*
	 * Catching Events:
	 * 
	 * drawCatchingTimerEvent drawCatchingErrorEvent drawCatchingSignalEvent
	 * drawCatchingMessageEvent drawCatchingMultipleEvent
	 * _drawCatchingEventImage _drawCatchingEvent
	 */

	drawCatchingTimerEvent : function(id, name, x, y, width, height,
			isInterrupting) {
		this.g.setStart();
		this._drawCatchingEvent(id, name, x, y, width, height, isInterrupting,
				null);

		var innerCircleWidth = width - 4;
		var innerCircleHeight = height - 4;

		var cx = x + width / 2 - this.getStroke() / 4;
		var cy = y + height / 2 - this.getStroke() / 4;

		var w = innerCircleWidth * .9;// - this.getStroke()*2;
		var h = innerCircleHeight * .9;// - this.getStroke()*2;

		this._drawClock(cx, cy, w, h);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawCatchingErrorEvent : function(id, name, x, y, width, height,
			isInterrupting) {
		this.g.setStart();
		this._drawCatchingEvent(id, name, x, y, width, height, isInterrupting,
				null);

		this._drawCatchingEventImage(x, y, width, height, ERROR_CATCH_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawCatchingSignalEvent : function(id, name, x, y, width, height,
			isInterrupting) {
		this.g.setStart();
		this._drawCatchingEvent(id, name, x, y, width, height, isInterrupting,
				null);

		this._drawCatchingEventImage(x, y, width, height, SIGNAL_CATCH_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawCatchingMessageEvent : function(id, name, x, y, width, height,
			isInterrupting) {
		this.g.setStart();
		this._drawCatchingEvent(id, name, x, y, width, height, isInterrupting,
				null);

		this._drawCatchingEventImage(x, y, width, height, MESSAGE_CATCH_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawCatchingMultipleEvent : function(id, name, x, y, width, height,
			isInterrupting) {
		this.g.setStart();
		this._drawCatchingEvent(id, name, x, y, width, height, isInterrupting,
				null);

		var cx = x + width / 2 - this.getStroke();
		var cy = y + height / 2 - this.getStroke();

		var w = width * .9;
		var h = height * .9;

		this._drawPentagon(cx, cy, w, h);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	_drawCatchingEventImage : function(x, y, width, height, image) {
		var innerCircleWidth = width - 4;
		var innerCircleHeight = height - 4;

		var cx = x + width / 2 - this.getStroke() / 2;
		var cy = y + height / 2 - this.getStroke() / 2;

		var w = innerCircleWidth * .6;// - this.getStroke()*2;
		var h = innerCircleHeight * .6;// - this.getStroke()*2;

		var img = this.g.image(image, cx - w / 2, cy - h / 2, w, h);
	},

	_drawCatchingEvent : function(id, name, x, y, width, height,
			isInterrupting, image) {
		var originalPaint = this.getPaint();
		if (typeof (CATCHING_EVENT_COLOR) != "undefined")
			this.setPaint(CATCHING_EVENT_COLOR);

		// event circles
		width -= this.strokeWidth / 2;
		height -= this.strokeWidth / 2;

		x = x + width / 2;// + this.strokeWidth/2;
		y = y + width / 2;// + this.strokeWidth/2;

		// outerCircle
		var outerCircle = this.g.ellipse(x, y, width / 2, height / 2);

		// white shaddow
		var shaddow = this.drawShaddow(outerCircle);

		// console.log("isInterrupting: " + isInterrupting, "x:" , x, "y:",y);
		if (isInterrupting != null && isInterrupting != undefined
				&& !isInterrupting)
			outerCircle.attr({
				"stroke-dasharray" : NON_INTERRUPTING_EVENT_STROKE
			});

		outerCircle.attr({
			"stroke-width" : this.strokeWidth,
			"stroke" : this.getPaint(),
			"fill" : BOUNDARY_EVENT_COLOR
		});

		var innerCircleX = x;
		var innerCircleY = y;
		var innerCircleRadiusX = width / 2 - 4;
		var innerCircleRadiusY = height / 2 - 4;
		var innerCircle = this.g.ellipse(innerCircleX, innerCircleY,
				innerCircleRadiusX, innerCircleRadiusY);
		innerCircle.attr({
			"stroke-width" : this.strokeWidth,
			"stroke" : this.getPaint()
		});

		if (image) {
			var imageWidth = imageHeight = innerCircleRadiusX * 1.2
					+ this.getStroke() * 2;
			var imageX = innerCircleX - imageWidth / 2 - this.strokeWidth / 2;
			var imageY = innerCircleY - imageWidth / 2 - this.strokeWidth / 2;
			var img = this.g.image(image, imageX, imageY, imageWidth,
					imageHeight);
		}

		this.setPaint(originalPaint);

		var set = this.g.set();
		set.push(outerCircle, innerCircle, shaddow);
		this.setContextToElement(outerCircle);

		// TODO: add shapes to set

		/*
		 * var st = this.g.set(); st.push( this.g.ellipse(innerCircleX,
		 * innerCircleY, 2, 2), this.g.ellipse(imageX, imageY, 2, 2) );
		 * st.attr({fill: "red", "stroke-width":0});
		 */
	},

	/*
	 * Catching Events:
	 * 
	 * drawThrowingNoneEvent drawThrowingSignalEvent drawThrowingMessageEvent
	 * drawThrowingMultipleEvent
	 */

	drawThrowingNoneEvent : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawCatchingEvent(id, name, x, y, width, height, null, null);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawThrowingSignalEvent : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawCatchingEvent(id, name, x, y, width, height, null, null);

		this._drawCatchingEventImage(x, y, width, height, SIGNAL_THROW_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawThrowingMessageEvent : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawCatchingEvent(id, name, x, y, width, height, null, null);

		this._drawCatchingEventImage(x, y, width, height, MESSAGE_THROW_IMAGE);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	drawThrowingMultipleEvent : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawCatchingEvent(id, name, x, y, width, height, null, null);

		var cx = x + width / 2 - this.getStroke();
		var cy = y + height / 2 - this.getStroke();

		var w = width * .9;
		var h = height * .9;

		var filled = true;
		this._drawPentagon(cx, cy, w, h, filled);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},

	/*
	 * Draw flows:
	 * 
	 * _connectFlowToActivity _drawFlow _drawDefaultSequenceFlowIndicator
	 * drawSequenceflow drawMessageflow drawAssociation _drawCircleTail
	 * _drawArrowHead _drawConditionalSequenceFlowIndicator
	 * drawSequenceflowWithoutArrow
	 */

	_connectFlowToActivity : function(sourceActivityId, destinationActivityId,
			waypoints) {
		var sourceActivity = this.g.getById(sourceActivityId);
		var destinationActivity = this.g.getById(destinationActivityId);
		if (sourceActivity == null || destinationActivity == null) {
			if (sourceActivity == null)
				console.error("source activity[" + sourceActivityId
						+ "] not found");
			else
				console.error("destination activity[" + destinationActivityId
						+ "] not found");
			return null;
		}
		var bbSourceActivity = sourceActivity.getBBox()
		var bbDestinationActivity = destinationActivity.getBBox()

		var path = [];
		var newWaypoints = [];
		for ( var i = 0; i < waypoints.length; i++) {
			var pathType = ""
			if (i == 0)
				pathType = "M";
			else
				pathType = "L";

			path.push([ pathType, waypoints[i].x, waypoints[i].y ]);
			newWaypoints.push({
				x : waypoints[i].x,
				y : waypoints[i].y
			});
		}

		var ninjaPathSourceActivity = this.ninjaPaper
				.path(sourceActivity.realPath);
		var ninjaPathDestinationActivity = this.ninjaPaper
				.path(destinationActivity.realPath);
		var ninjaBBSourceActivity = ninjaPathSourceActivity.getBBox();
		var ninjaBBDestinationActivity = ninjaPathDestinationActivity.getBBox();

		// set target of the flow to the center of the taskObject
		var newPath = path;
		var originalSource = {
			x : newPath[0][1],
			y : newPath[0][2]
		};
		var originalTarget = {
			x : newPath[newPath.length - 1][1],
			y : newPath[newPath.length - 1][2]
		};
		//if SourceActivity and DestinationActivity are the same,then newPath[0] ==newPath[newPath.length - 1]
		newPath[0][1] = ninjaBBSourceActivity.x
				+ (ninjaBBSourceActivity.x2 - ninjaBBSourceActivity.x) / 2;
		newPath[0][2] = ninjaBBSourceActivity.y
				+ (ninjaBBSourceActivity.y2 - ninjaBBSourceActivity.y) / 2;
		newPath[newPath.length - 1][1] = ninjaBBDestinationActivity.x
				+ (ninjaBBDestinationActivity.x2 - ninjaBBDestinationActivity.x)
				/ 2;
		newPath[newPath.length - 1][2] = ninjaBBDestinationActivity.y
				+ (ninjaBBDestinationActivity.y2 - ninjaBBDestinationActivity.y)
				/ 2;
		//new ninja flow object
		var ninjaPathFlowObject = this.ninjaPaper.path(newPath);
		var ninjaBBFlowObject = ninjaPathFlowObject.getBBox();

		var intersectionsSource = Raphael.pathIntersection(
				ninjaPathSourceActivity.realPath, ninjaPathFlowObject.realPath);
		var intersectionsDestination = Raphael.pathIntersection(
				ninjaPathDestinationActivity.realPath,
				ninjaPathFlowObject.realPath);
		var intersectionSource = intersectionsSource.pop();
		var intersectionDestination = intersectionsDestination.pop();
		//if source and target is the same,try use second intersect point,modified by lijing
		if(intersectionDestination!= undefined){
			if(sourceActivityId===destinationActivityId){
				var intersectionDestination2=intersectionsDestination.pop();
				if(intersectionDestination2){
					intersectionDestination=intersectionDestination2;
					var _index=newWaypoints.length-1;
					if(_index>=3){//if first and last line intersect ,exchange intersectionSource and intersectionDestination
						var p1x1=intersectionSource.x,p1y1=intersectionSource.y;
						var p1x2=newWaypoints[1].x,p1y2=newWaypoints[1].y;
						var p2x1=newWaypoints[_index-1].x,p2y1=newWaypoints[_index-1].y;
						var p2x2=intersectionDestination.x,p2y2=intersectionDestination.y;
						var path1=[["M",p1x1,p1y1],["L",p1x2,p1y2]];
						var path2=[["M",p2x1,p2y1],["L",p2x2,p2y2]];
						var _intersects=Raphael.pathIntersection(path1, path2);
						if(_intersects&&_intersects.length>0){
							var temp=intersectionSource;
							intersectionSource=intersectionDestination;
							intersectionDestination=temp;
						}
					}
				}
			}
		}
		if (intersectionSource != undefined) {
			if (this.gebug) {
				var diameter = 5;
				var dotOriginal = this.g.ellipse(originalSource.x,
						originalSource.y, diameter, diameter).attr({
					"fill" : Color.white,
					"stroke" : Color.Pink
				});
				var dot = this.g.ellipse(intersectionSource.x,
						intersectionSource.y, diameter, diameter).attr({
					"fill" : Color.white,
					"stroke" : Color.Green
				});
			}

			newWaypoints[0].x = intersectionSource.x;
			newWaypoints[0].y = intersectionSource.y;
		}
		if (intersectionDestination != undefined) {
			if (this.gebug) {
				var diameter = 5;
				var dotOriginal = this.g.ellipse(originalTarget.x,
						originalTarget.y, diameter, diameter).attr({
					"fill" : Color.white,
					"stroke" : Color.Red
				});
				var dot = this.g.ellipse(intersectionDestination.x,
						intersectionDestination.y, diameter, diameter).attr({
					"fill" : Color.white,
					"stroke" : Color.Blue
				});
			}

			newWaypoints[newWaypoints.length - 1].x = intersectionDestination.x;
			newWaypoints[newWaypoints.length - 1].y = intersectionDestination.y;
		}

		this.ninjaPaper.clear();
		return newWaypoints;
	},

	_drawFlow : function(id, name, waypoints, conditional, isDefault,
			highLighted, withArrowHead, connectionType) {
		if(SvgExt&&SvgExt._drawFlow){
			SvgExt._drawFlow.apply(this,[id, name, waypoints, conditional, isDefault,
			                 			highLighted, withArrowHead, connectionType]);
			return;
		}
		var originalPaint = this.getPaint();
		var originalStroke = this.getStroke();

		this.setStroke(SEQUENCEFLOW_STROKE);

		if (Canvas_IsFlowTrack) {
			if (highLighted) {
				this.setPaint(HIGHLIGHT_FLOW_COLOR);
				this.setStroke(SEQUENCEFLOW_HIGHLIGHT_STROKE);
			} else if ($.inArray(id, Canvas_HighlightsData.flows) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HIGHLIGHT_FLOW_COLOR);
					this.setStroke(SEQUENCEFLOW_HIGHLIGHT_STROKE);
				} else {
					this.setPaint(DEFAULT_HIGH_TASK_STROKE_COLOR);
					this.setStroke(SEQUENCEFLOW_HIGHLIGHT_STROKE);
				}
			}
		} else {
			this.setPaint(SEQUENCEFLOW_COLOR);
		}

		// TODO: generate polylineId or do something!!
		var uuid = Raphael.createUUID();

		var contextObject = this.getConextObject();
		var newWaypoints = waypoints;
		if (contextObject) {
			var newWaypoints = this._connectFlowToActivity(
					contextObject.sourceActivityId,
					contextObject.destinationActivityId, waypoints);

			if (!newWaypoints) {
				console.error("Error draw flow from '"
						+ contextObject.sourceActivityId + "' to '"
						+ contextObject.destinationActivityId + "' ");
				return;
			}
		}
		var polyline = new Polyline(uuid, newWaypoints, this.getStroke());
		// var polyline = new Polyline(waypoints, 3);

		polyline.element = this.g.path(polyline.path);
		polyline.element.attr("stroke-width", this.getStroke());
		polyline.element.attr("stroke", this.getPaint());

		if (contextObject) {
			polyline.element.id = contextObject.id;
			polyline.element.data("contextObject", contextObject);
		} else {
			polyline.element.id = uuid;
		}

		/*
		 * polyline.element.mouseover(function(){ this.attr({"stroke-width":
		 * NORMAL_STROKE + 2}); }).mouseout(function(){
		 * this.attr({"stroke-width": NORMAL_STROKE}); });
		 */

		var last = polyline.getAnchorsCount() - 1;
		var x = polyline.getAnchor(last).x;
		var y = polyline.getAnchor(last).y;
		// var c = this.g.ellipse(x, y, 5, 5);

		var lastLineIndex = polyline.getLinesCount() - 1;
		var line = polyline.getLine(lastLineIndex);
		var firstLine = polyline.getLine(0);

		var arrowHead = null, circleTail = null, defaultSequenceFlowIndicator = null, conditionalSequenceFlowIndicator = null;

		if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW) {
			circleTail = this._drawCircleTail(firstLine, connectionType);
		}
		if (withArrowHead)
			arrowHead = this._drawArrowHead(line, connectionType);

		// console.log("isDefault: ", isDefault, ", isDefaultConditionAvailable:
		// ", polyline.isDefaultConditionAvailable);
		if (isDefault && polyline.isDefaultConditionAvailable) {
			// var angle = polyline.getLineAngle(0);
			// console.log("firstLine", firstLine);
			defaultSequenceFlowIndicator = this
					._drawDefaultSequenceFlowIndicator(firstLine);
		}

		if (conditional) {
			conditionalSequenceFlowIndicator = this
					._drawConditionalSequenceFlowIndicator(firstLine);
		}

		var st = this.g.set();
		st.push(polyline.element, arrowHead, circleTail,
				conditionalSequenceFlowIndicator);
		polyline.element.data("set", st);
		polyline.element.data("withArrowHead", withArrowHead);

		var polyCloneAttrNormal = {
			"stroke-width" : this.getStroke() + 5,
			stroke : Color.get(132, 112, 255),
			opacity : 0.0,
			cursor : "hand"
		};
		var polyClone = st.clone().attr(polyCloneAttrNormal).hover(function() {
			// if (polyLine.data("isSelected")) return;
			polyClone.attr({
				opacity : 0.2
			});
		}, function() {
			// if (polyLine.data("isSelected")) return;
			polyClone.attr({
				opacity : 0.0
			});
		});
		polyClone.data("objectId", polyline.element.id);

		polyClone.data("set", st);
		polyClone.data("contextObject", contextObject);

		var instance = this;
		polyClone.mousedown(function(event) {
			if (event.button == 2)
				instance.onRightClick(event, instance, this);
		});
		polyClone.click(function(event) {
			instance.onClick(event, instance, this);
		});
		polyClone.hover(function(event) {
			instance.onFlowHoverIn(event, instance, this);
		}, function(event) {
			instance.onFlowHoverOut(event, instance, this);
		});
		// polyClone.click(
		// function() {
		// var instance = this;
		// var objectId = instance.data("objectId");
		// var object = this.paper.getById(objectId);
		// var contextObject = object.data("contextObject");
		// if (contextObject) {
		// console.log("[flow], objectId: " + object.id
		// + ", flow: " + contextObject.flow);
		// ProcessDiagramGenerator.showFlowInfo(contextObject);
		// }
		// }).dblclick(function() {
		// console.log("!!! DOUBLE CLICK !!!");
		// }).hover(function(mouseEvent) {
		// var instance = this;
		// var objectId = instance.data("objectId");
		// var object = this.paper.getById(objectId);
		// var contextObject = object.data("contextObject");
		// if (contextObject)
		// ProcessDiagramGenerator.showFlowInfo(contextObject);
		// });

		polyClone.data("parentId", uuid);

		if (!connectionType || connectionType == CONNECTION_TYPE.SEQUENCE_FLOW)
			polyline.element.attr("stroke-width", this.getStroke());
		else if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW)
			polyline.element.attr({
				"stroke-dasharray" : "--"
			});
		else if (connectionType == CONNECTION_TYPE.ASSOCIATION)
			polyline.element.attr({
				"stroke-dasharray" : ". "
			});

		this.setPaint(originalPaint);
		this.setStroke(originalStroke);

		if (name) {
			var first = 0;
			var x = polyline.getAnchor(first).x;
			var y = polyline.getAnchor(first).y;

			if (false) {

				var len = polyline.element.getTotalLength();
				var posLabel = polyline.element.getPointAtLength(len / 2);

				this.drawFlowLabel(id, name, posLabel.x, posLabel.y, 100, 0);
			} else {
				var posLabel = this.getFlowLabelPosition(name, polyline, x, y);

				this.drawFlowLabel(id, name, posLabel.x, posLabel.y,
						posLabel.width, 0);
			}
		}
	},

	/**
	 * Returns the angle of the line between two dockers (0 - 359.99999999)
	 */
	_getAngle : function(docker1, docker2) {
		var p1 = docker1;
		var p2 = docker2;

		if (p1.x == p2.x && p1.y == p2.y)
			return 0;

		var angle = Math.asin(Math.sqrt(Math.pow(p1.y - p2.y, 2))
				/ (Math.sqrt(Math.pow(p2.x - p1.x, 2)
						+ Math.pow(p1.y - p2.y, 2))))
				* 180 / Math.PI;

		if (p2.x >= p1.x && p2.y <= p1.y)
			return angle;
		else if (p2.x < p1.x && p2.y <= p1.y)
			return 180 - angle;
		else if (p2.x < p1.x && p2.y > p1.y)
			return 180 + angle;
		else
			return 360 - angle;
	},

	getFlowLabelPosition : function(text, polyline, x, y, width, height) {

		if (!width || !height) {
			width = 100;
			height = 15;
		}

		var numOfDockers = polyline.getAnchorsCount();
		if (numOfDockers % 2 == 0) {
			var angle = this._getAngle(
					polyline.getAnchor(numOfDockers / 2 - 1), polyline
							.getAnchor(numOfDockers / 2))
			var pos1 = polyline.getAnchor(numOfDockers / 2 - 1);
			var pos2 = polyline.getAnchor(numOfDockers / 2);
			var pos = {
				x : (pos1.x + pos2.x) / 2.0,
				y : (pos1.y + pos2.y) / 2.0
			};

			x = pos.x;
			y = pos.y - height;

			if (angle <= 90 || angle > 270) {
				// label.rotate(360 - angle, pos);
			} else {
				// label.rotate(180 - angle, pos);
			}
		} else {
			var index = parseInt(numOfDockers / 2);
			var angle = this._getAngle(polyline.getAnchor(index), polyline
					.getAnchor(index + 1))
			var pos = polyline.getAnchor(index);

			if (angle <= 90 || angle > 270) {
				x = pos.x;
				y = pos.y - height;
				// label.rotate(360 - angle, pos);
			} else {
				x = pos.x;
				y = pos.y - height;
				// label.rotate(180 - angle, pos);
			}
		}

		x -= width / 2;

		return {
			x : x,
			y : y,
			width : width,
			height : height
		};
	},

	drawFlowLabel : function(id, text, x, y, width, height) {

		var originalFont = this.getFont();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.flows) > -1) {
				this.setFont(FLOW_LABEL_FONT);
			} else {
				this.setFont(DISABLED_FLOW_LABEL_FONT);
			}
		} else {
			this.setFont(FLOW_LABEL_FONT);
		}

		this
				._drawMultilineText(text, x, y, width, height,
						MULTILINE_VERTICAL_ALIGN_TOP,
						MULTILINE_HORIZONTAL_ALIGN_MIDDLE)

		this.setFont(originalFont);
	},

	_drawDefaultSequenceFlowIndicator : function(line) {
		// console.log("line: ", line);

		var len = 10;
		c = len / 2, f = 8;
		var defaultIndicator = this.g.path("M" + (-c) + " " + 0 + "L" + (c)
				+ " " + 0);
		defaultIndicator.attr("stroke-width", this.getStroke() + 0);
		defaultIndicator.attr("stroke", this.getPaint());

		var cosAngle = Math.cos((line.angle));
		var sinAngle = Math.sin((line.angle));

		var dx = f * cosAngle;
		var dy = f * sinAngle;

		var x1 = line.x1 + dx + 0 * c * cosAngle;
		var y1 = line.y1 + dy + 0 * c * sinAngle;

		defaultIndicator.transform("t" + (x1) + "," + (y1) + "");
		defaultIndicator
				.transform("...r" + Raphael.deg(line.angle - 3 * Math.PI / 4)
						+ " " + 0 + " " + 0);
		/*
		 * var c0 = this.g.ellipse(0, 0, 1, 1).attr({stroke: Color.Blue});
		 * c0.transform("t" + (line.x1) + "," + (line.y1) + ""); var center =
		 * this.g.ellipse(0, 0, 1, 1).attr({stroke: Color.Red});
		 * center.transform("t" + (line.x1+dx) + "," + (line.y1+dy) + "");
		 */

		return defaultIndicator;
	},

	drawSequenceflow : function(id, name, waypoints, conditional, isDefault,
			highLighted) {
		var withArrowHead = true;
		this._drawFlow(id, name, waypoints, conditional, isDefault,
				highLighted, withArrowHead, CONNECTION_TYPE.SEQUENCE_FLOW);
	},

	drawMessageflow : function(id, name, waypoints, highLighted) {
		var withArrowHead = true;
		var conditional = isDefault = false;
		this._drawFlow(id, name, waypoints, conditional, isDefault,
				highLighted, withArrowHead, CONNECTION_TYPE.MESSAGE_FLOW);
	},

	drawAssociation : function(id, name, waypoints, withArrowHead, highLighted) {
		var withArrowHead = withArrowHead;
		var conditional = isDefault = false;
		this._drawFlow(id, name, waypoints, conditional, isDefault,
				highLighted, withArrowHead, CONNECTION_TYPE.ASSOCIATION);
	},

	_drawCircleTail : function(line, connectionType) {
		var diameter = ARROW_WIDTH / 2 * 1.5;

		// anti smoothing
		if (this.strokeWidth % 2 == 1)
			line.x1 += .5, line.y1 += .5;

		var circleTail = this.g.ellipse(line.x1, line.y1, diameter, diameter);
		circleTail.attr("fill", Color.white);
		circleTail.attr("stroke", this.getPaint());

		return circleTail;
	},

	_drawArrowHead : function(line, connectionType) {
		var doubleArrowWidth = 2 * ARROW_WIDTH;

		if (connectionType == CONNECTION_TYPE.ASSOCIATION)
			var arrowHead = this.g.path("M-" + (ARROW_WIDTH / 2 + .5) + " -"
					+ doubleArrowWidth + "L 0 0 L" + (ARROW_WIDTH / 2 + .5)
					+ " -" + doubleArrowWidth);
		else
			var arrowHead = this.g.path("M0 0L-" + (ARROW_WIDTH / 2 + .5)
					+ " -" + doubleArrowWidth + "L" + (ARROW_WIDTH / 2 + .5)
					+ " -" + doubleArrowWidth + "z");

		// arrowHead.transform("t" + 0 + ",-" + this.getStroke() + "");

		// anti smoothing
		if (this.strokeWidth % 2 == 1)
			line.x2 += .5, line.y2 += .5;

		arrowHead.transform("t" + line.x2 + "," + line.y2 + "");
		arrowHead.transform("...r" + Raphael.deg(line.angle - Math.PI / 2)
				+ " " + 0 + " " + 0);

		if (!connectionType || connectionType == CONNECTION_TYPE.SEQUENCE_FLOW)
			arrowHead.attr("fill", this.getPaint());
		else if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW)
			arrowHead.attr("fill", Color.white);

		arrowHead.attr("stroke-width", this.getStroke());
		arrowHead.attr("stroke", this.getPaint());

		return arrowHead;
	},

	/*
	 * drawArrowHead2: function(srcX, srcY, targetX, targetY) { var
	 * doubleArrowWidth = 2 * ARROW_WIDTH;
	 * 
	 * //var arrowHead = this.g.path("M-" + ARROW_WIDTH/2 + " -" +
	 * doubleArrowWidth + "L0 0" + "L" + ARROW_WIDTH/2 + " -" + doubleArrowWidth +
	 * "z");
	 * 
	 * var arrowHead = this.g.path("M0 0L-" + ARROW_WIDTH/1.5 + " -" +
	 * doubleArrowWidth + "L" + ARROW_WIDTH/1.5 + " -" + doubleArrowWidth +
	 * "z"); //var c = ProcessDiagramCanvas.g.ellipse(0, 0, 3, 3);
	 * //c.transform("t"+targetX+","+targetY+"");
	 * 
	 * var angle = Math.atan2(targetY - srcY, targetX - srcX);
	 * 
	 * arrowHead.transform("t"+targetX+","+targetY+"");
	 * arrowHead.transform("...r" + Raphael.deg(angle - Math.PI / 2) + " "+0+"
	 * "+0);
	 * 
	 * //console.log(arrowHead.transform()); //console.log("--> " +
	 * Raphael.deg(angle - Math.PI / 2));
	 * 
	 * arrowHead.attr("fill", this.getPaint()); arrowHead.attr("stroke",
	 * this.getPaint()); / * // shaddow var c0 = arrowHead.clone();
	 * c0.transform("...t-1 1"); c0.attr("stroke-width", this.strokeWidth);
	 * c0.attr("stroke", Color.black); c0.attr("opacity", 0.15); c0.toBack(); / },
	 */

	_drawConditionalSequenceFlowIndicator : function(line) {
		var horizontal = (CONDITIONAL_INDICATOR_WIDTH * 0.7);
		var halfOfHorizontal = horizontal / 2;
		var halfOfVertical = CONDITIONAL_INDICATOR_WIDTH / 2;

		var uuid = null;
		var waypoints = [ {
			x : 0,
			y : 0
		}, {
			x : -halfOfHorizontal,
			y : halfOfVertical
		}, {
			x : 0,
			y : CONDITIONAL_INDICATOR_WIDTH
		}, {
			x : halfOfHorizontal,
			y : halfOfVertical
		} ];
		/*
		 * var polyline = new Polyline(uuid, waypoints, this.getStroke());
		 * polyline.element = this.g.path(polyline.path);
		 * polyline.element.attr("stroke-width", this.getStroke());
		 * polyline.element.attr("stroke", this.getPaint()); polyline.element.id =
		 * uuid;
		 */
		var polygone = new Polygone(waypoints, this.getStroke());
		polygone.element = this.g.path(polygone.path);
		polygone.element.attr("fill", Color.white);

		polygone.transform("t" + line.x1 + "," + line.y1 + "");
		polygone.transform("...r" + Raphael.deg(line.angle - Math.PI / 2) + " "
				+ 0 + " " + 0);

		var cosAngle = Math.cos((line.angle));
		var sinAngle = Math.sin((line.angle));

		// polygone.element.attr("stroke-width", this.getStroke());
		// polygone.element.attr("stroke", this.getPaint());

		polygone.attr({
			"stroke-width" : this.getStroke(),
			"stroke" : this.getPaint()
		});

		return polygone.element;
	},

	drawSequenceflowWithoutArrow : function(id, name, waypoints, conditional,
			isDefault, highLighted) {
		var withArrowHead = false;
		this._drawFlow(id, name, waypoints, conditional, isDefault,
				highLighted, withArrowHead, CONNECTION_TYPE.SEQUENCE_FLOW);
	},

	/*
	 * Draw artifacts
	 */

	drawPoolOrLane : function(id, name, x, y, width, height) {
		// anti smoothing
		if (this.strokeWidth % 2 == 1)
			x = Math.round(x) + .5, y = Math.round(y) + .5;

		// shape
		var rect = this.g.rect(x, y, width, height);
		var attr = {
			"stroke-width" : NORMAL_STROKE,
			stroke : TASK_STROKE_COLOR
		};
		rect.attr(attr);

		// Add the name as text, vertical
		if (name != null && name.length > 0) {
			var attr = POOL_LANE_FONT;

			// Include some padding
			var availableTextSpace = height - 6;

			// Create rotation for derived font
			var truncated = this.fitTextToWidth(name, availableTextSpace);
			var realWidth = this.getStringWidth(truncated, attr);
			var realHeight = this.getStringHeight(truncated, attr);

			// console.log("truncated:", truncated, ", height:", height, ",
			// realHeight:", realHeight, ", availableTextSpace:",
			// availableTextSpace, ", realWidth:", realWidth);
			var newX = x + 2 + realHeight * 1 - realHeight / 2;
			var newY = 3 + y + availableTextSpace
					- (availableTextSpace - realWidth) / 2 - realWidth / 2;
			var textElement = this.g.text(newX, newY, truncated).attr(attr);
			// console.log(".getBBox(): ", t.getBBox());
			textElement.transform("r" + Raphael.deg(270 * Math.PI / 180) + " "
					+ newX + " " + newY);
		}

		// TODO: add to set
	},

	_drawTask : function(id, name, x, y, width, height, thickBorder) {
		if(SvgExt&&SvgExt._drawTask){
			SvgExt._drawTask.apply(this,[id, name, x, y, width, height, thickBorder]);
			return;
		}
		var originalPaint = this.getPaint();
		var originalFill = this.getFillColor();
		var originalStroke = this.getStroke();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HIGHLIGHT_COLOR);
					this.setFillColor(HIGHLIGHT_FILLCOLOR);
					this.setStroke(HIGHLIGHT_STROKE);
				} else {
					this.setPaint(DEFAULT_HIGH_TASK_STROKE_COLOR);
					this.setFillColor(TASK_COLOR);
					this.setStroke(HIGHLIGHT_STROKE);
				}
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HISTORY_COLOR);
					this.setFillColor(HISTORY_FILLCOLOR);
				} else {
					this.setPaint(TASK_STROKE_COLOR);
					this.setFillColor(TASK_COLOR);
				}
			}
		} else {
			this.setPaint(TASK_STROKE_COLOR);
			this.setFillColor(TASK_COLOR);
		}

		// anti smoothing
		if (this.getStroke() % 2 == 1)
			x = Math.round(x) + .5, y = Math.round(y) + .5;

		// shape
		var shape = this.g.rect(x, y, width, height, TASK_CORNER_ROUND);
		var attr = {
			"stroke-width" : this.getStroke(),
			stroke : this.getPaint(),
			fill : this.getFillColor()
		};
		shape.attr(attr);
		// shape.attr({fill: "90-"+this.getPaint()+"-" + Color.get(250, 250,
		// 244)});

		var contextObject = this.getConextObject();
		if (contextObject) {
			shape.id = contextObject.id;
			shape.data("contextObject", contextObject);
		}

		// var activity = this.getConextObject();
		// console.log("activity: " + activity.getId(), activity);
		// Object.clone(activity);

		/*
		 * c.mouseover(function(){ this.attr({"stroke-width": NORMAL_STROKE +
		 * 2}); }).mouseout(function(){ this.attr({"stroke-width":
		 * NORMAL_STROKE}); });
		 */

		this.setPaint(originalPaint);
		this.setFillColor(originalFill);
		this.setStroke(originalStroke);

		// white shaddow
		this.drawShaddow(shape);

		if (thickBorder) {
			shape.attr({
				"stroke-width" : THICK_TASK_BORDER_STROKE
			});
		} else {
			// g.draw(rect);
		}

		// text
		if (name) {
			var fontAttr = TASK_FONT;

			// Include some padding
			var paddingX = 5;
			var paddingY = 5;
			var availableTextSpace = width - paddingX * 2;

			// TODO: this.setFont
			// var originalFont = this.getFont();
			// this.setFont(TASK_FONT)
			/*
			 * var truncated = this.fitTextToWidth(name, availableTextSpace);
			 * var realWidth = this.getStringWidth(truncated, fontAttr); var
			 * realHeight = this.getStringHeight(truncated, fontAttr);
			 * 
			 * //var t = this.g.text(x + width/2 + realWidth*0/2 + paddingX*0, y +
			 * height/2, truncated).attr(fontAttr);
			 */
			// console.log("draw task name: " + name);
			var boxWidth = width - (2 * TEXT_PADDING);
			var boxHeight = height - ICON_SIZE - ICON_PADDING - ICON_PADDING
					- MARKER_WIDTH - 2 - 2;
			var boxX = x + width / 2 - boxWidth / 2;

			// modify by lifei 这里需要去掉ICON_PADDING + ICON_PADDING的数值, 因为没有
			var boxY = y + height / 2 - boxHeight / 2 - 1; // +
			// ICON_PADDING
			// +
			// ICON_PADDING;

			/*
			 * var boxWidth = width - (2 * ANNOTATION_TEXT_PADDING); var
			 * boxHeight = height - (2 * ANNOTATION_TEXT_PADDING); var boxX = x +
			 * width/2 - boxWidth/2; var boxY = y + height/2 - boxHeight/2;
			 */

			this.drawTaskLabel(id, name, boxX, boxY, boxWidth, boxHeight);
		}
	},

	drawTaskLabel : function(id, text, x, y, boxWidth, boxHeight) {
		var originalFont = this.getFont();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setFont(HIGHLIGHT_TASK_FONT);
				} else {
					this.setFont(TASK_FONT);
				}
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setFont(HIGHLIGHT_TASK_FONT);
				} else {
					this.setFont(TASK_FONT);
				}
			} else {
				this.setFont(DISABLED_FONT);
			}
		} else {
			this.setFont(TASK_FONT);
		}

		this._drawMultilineText(text, x, y, boxWidth, boxHeight,
				MULTILINE_VERTICAL_ALIGN_MIDDLE,
				MULTILINE_HORIZONTAL_ALIGN_MIDDLE);

		this.setFont(originalFont);
	},

	/*
	 * drawMultilineLabel: function(text, x, y){ var originalFont =
	 * this.getFont(); this.setFont(LABEL_FONT_SMOOTH);
	 * 
	 * var boxWidth = 80; x = x - boxWidth/2
	 * 
	 * this._drawMultilineText(text, x, y, boxWidth, null, "middle");
	 * this.setFont(originalFont); },
	 */

	getStringWidth : function(text, fontAttrs) {
		var textElement = this.g.text(0, 0, text).attr(fontAttrs).hide();
		var bb = textElement.getBBox();

		// console.log("string width: ", t.getBBox().width);
		return textElement.getBBox().width;
	},
	getStringHeight : function(text, fontAttrs) {
		var textElement = this.g.text(0, 0, text).attr(fontAttrs).hide();
		var bb = textElement.getBBox();

		// console.log("string height: ", t.getBBox().height);
		return textElement.getBBox().height;
	},
	fitTextToWidth : function(original, width) {
		var text = original;

		// TODO: move attr on parameters
		var attr = {
			font : "11px Arial",
			opacity : 0
		};

		// remove length for "..."
		var dots = this.g.text(0, 0, "...").attr(attr).hide();
		var dotsBB = dots.getBBox();

		var maxWidth = width - dotsBB.width;

		var textElement = this.g.text(0, 0, text).attr(attr).hide();
		var bb = textElement.getBBox();

		// it's a little bit incorrect with "..."
		while (bb.width > maxWidth && text.length > 0) {
			text = text.substring(0, text.length - 1);
			textElement.attr({
				"text" : text
			});
			bb = textElement.getBBox();
		}

		// remove element from paper
		textElement.remove();
		if (text != original) {
			text = text + "...";
		}

		return text;
	},
	wrapTextToWidth : function(original, width) {

		// return original;

		var text = original;
		var wrappedText = "\n";

		// TODO: move attr on parameters
		var attr = {
			font : "11px Arial",
			opacity : 0
		};

		var textElement = this.g.text(0, 0, wrappedText).attr(attr).hide();
		var bb = textElement.getBBox();

		var resultText = "";
		var i = 0, j = 0;
		while (text.length > 0) {
			while (bb.width < width && text.length > 0) {
				// remove "\n"
				wrappedText = wrappedText.substring(0, wrappedText.length - 1);
				// add new char, add "\n"
				wrappedText = wrappedText + text.substring(0, 1) + "\n";
				text = text.substring(1);

				textElement.attr({
					"text" : wrappedText
				});
				bb = textElement.getBBox();
				i++;
				if (i > 200)
					break;
			}
			// remove "\n"
			wrappedText = wrappedText.substring(0, wrappedText.length - 1);

			if (text.length == 0) {
				resultText += wrappedText;
				break;
			}

			// return last char to text
			text = wrappedText.substring(wrappedText.length - 1) + text;
			// remove last char from wrappedText
			wrappedText = wrappedText.substring(0, wrappedText.length - 1)
					+ "\n";

			textElement.attr({
				"text" : wrappedText
			});
			bb = textElement.getBBox();

			// console.log(">> ", wrappedText, ", ", text);
			resultText += wrappedText;
			wrappedText = "\n";

			j++;
			if (j > 20)
				break;
		}
		// remove element from paper
		textElement.remove();

		return resultText;
	},

	wrapTextToWidth2 : function(original, width) {
		var text = original;
		var wrappedText = "\n";

		// TODO: move attr on parameters
		var attr = {
			font : "11px Arial",
			opacity : 0
		};

		var textElement = this.g.text(0, 0, wrappedText).attr(attr).hide();
		var bb = textElement.getBBox();

		var resultText = "";
		var i = 0, j = 0;
		while (text.length > 0) {
			while (bb.width < width && text.length > 0) {
				// remove "\n"
				wrappedText = wrappedText.substring(0, wrappedText.length - 1);
				// add new char, add "\n"
				wrappedText = wrappedText + text.substring(0, 1) + "\n";
				text = text.substring(1);

				textElement.attr({
					"text" : wrappedText
				});
				bb = textElement.getBBox();
				i++;
				if (i > 200)
					break;
			}
			// remove "\n"
			wrappedText = wrappedText.substring(0, wrappedText.length - 1);

			if (text.length == 0) {
				resultText += wrappedText;
				break;
			}

			// return last char to text
			text = wrappedText.substring(wrappedText.length - 1) + text;
			// remove last char from wrappedText
			wrappedText = wrappedText.substring(0, wrappedText.length - 1)
					+ "\n";

			textElement.attr({
				"text" : wrappedText
			});
			bb = textElement.getBBox();

			// console.log(">> ", wrappedText, ", ", text);
			resultText += wrappedText;
			wrappedText = "\n";

			j++;
			if (j > 20)
				break;
		}
		// remove element from paper
		textElement.remove();

		return resultText;
	},

	drawUserTask : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawTask(id, name, x, y, width, height);
		//var img = this.g.image(USERTASK_IMAGE, x + ICON_PADDING, y+ ICON_PADDING, ICON_SIZE, ICON_SIZE);
		/*if(userName){
			this.g.text(x + ICON_PADDING+ICON_SIZE*2+5, y+ ICON_PADDING+ICON_SIZE/2, userName).attr(this.getFont());
		}*/
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "task");
	},

	drawScriptTask : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawTask(id, name, x, y, width, height);
		/*var img = this.g.image(SCRIPTTASK_IMAGE, x + ICON_PADDING, y
				+ ICON_PADDING, ICON_SIZE, ICON_SIZE);*/
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "task");
	},

	drawServiceTask : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawTask(id, name, x, y, width, height);
		/*var img = this.g.image(SERVICETASK_IMAGE, x + ICON_PADDING, y
				+ ICON_PADDING, ICON_SIZE, ICON_SIZE);*/
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "task");
	},

	drawReceiveTask : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawTask(id, name, x, y, width, height);
		var img = this.g.image(RECEIVETASK_IMAGE, x + 7, y + 7, ICON_SIZE,
				ICON_SIZE);
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "task");
	},

	drawSendTask : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawTask(id, name, x, y, width, height);
		/*var img = this.g.image(SENDTASK_IMAGE, x + 7, y + 7, ICON_SIZE,
				ICON_SIZE);*/
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "task");
	},

	drawManualTask : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawTask(id, name, x, y, width, height);
		var img = this.g.image(MANUALTASK_IMAGE, x + 7, y + 7, ICON_SIZE,
				ICON_SIZE);
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "task");
	},

	drawBusinessRuleTask : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawTask(id, name, x, y, width, height);
		var img = this.g.image(BUSINESS_RULE_TASK_IMAGE, x + 7, y + 7,
				ICON_SIZE, ICON_SIZE);
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "task");
	},

	drawExpandedSubProcess : function(id, name, x, y, width, height,
			isTriggeredByEvent) {
		if(SvgExt&&SvgExt.drawExpandedSubProcess){
			SvgExt.drawExpandedSubProcess.apply(this,[id, name, x, y, width, height,isTriggeredByEvent]);
			return;
		}
		this.g.setStart();

		var originalPaint = this.getPaint();
		var originalFont = this.getFont();

		if (Canvas_IsFlowTrack) {
		} else {
			this.setFont(EXPANDED_SUBPROCESS_FONT);
			this.setPaint(TASK_STROKE_COLOR);
		}

		// anti smoothing
		if (this.getStroke() % 2 == 1)
			x = Math.round(x) + .5, y = Math.round(y) + .5;

		// shape
		var rect = this.g.rect(x, y, width, height,
				EXPANDED_SUBPROCESS_CORNER_ROUND);

		// Use different stroke (dashed)
		if (isTriggeredByEvent) {
			rect.attr(EVENT_SUBPROCESS_ATTRS);
		} else {
			rect.attr(EXPANDED_SUBPROCESS_ATTRS);
		}

		rect.attr({
			"stroke-width" : this.getStroke(),
			"stroke" : this.getPaint()
		});

		this.setContextToElement(rect);

		// Include some padding
		var paddingX = 10;
		var paddingY = 5;
		var availableTextSpace = width - paddingX * 2;

		var truncated = this.fitTextToWidth(name, availableTextSpace);
		var realWidth = this.getStringWidth(truncated, this.getFont());
		var realHeight = this.getStringHeight(truncated, this.getFont());

		var textElement = this.g.text(
				x +paddingX*2+15,
				y + realHeight / 2 + paddingY, truncated).attr(this.getFont());

		var set = this.g.setFinish();

		this.setPaint(originalPaint);
		this.setFont(originalFont);

		this.drawExpandedMarker(id, x, y, width, height);

		// TODO: Expanded Sub Process may has specific handlers
		// this.addHandlers(set, x, y, width, height, "task");
	},

	drawCollapsedSubProcess : function(id, name, x, y, width, height,
			isTriggeredByEvent) {
		this.g.setStart();
		this._drawCollapsedTask(id, name, x, y, width, height, false);
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "task");
	},

	drawCollapsedCallActivity : function(id, name, x, y, width, height) {
		this.g.setStart();
		this._drawCollapsedTask(id, name, x, y, width, height, true);
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "task");
	},

	_drawCollapsedTask : function(id, name, x, y, width, height, thickBorder) {
		// The collapsed marker is now visualized separately
		this._drawTask(id, name, x, y, width, height, thickBorder);
	},

	drawCollapsedMarker : function(id, x, y, width, height) {
		// rectangle
		var rectangleWidth = MARKER_WIDTH;
		var rectangleHeight = MARKER_WIDTH;

		var originalPaint = this.getPaint();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				this.setPaint(HIGHLIGHT_COLOR);
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				this.setPaint(HISTORY_COLOR);
			}
		} else {
			this.setPaint(TASK_STROKE_COLOR);
		}

		// anti smoothing
		// if (this.getStroke() % 2 == 1)
		// y += .5;
		y -= .5;

		var rect = this.g.rect(x + (width - rectangleWidth) / 2,
				y + height - rectangleHeight - 4, rectangleWidth,
				rectangleHeight).attr({
			"stroke-width" : this.getStroke(),
			"stroke" : this.getPaint()
		});

		// plus inside rectangle
		var cx = rect.attr("x") + rect.attr("width") / 2;
		var cy = rect.attr("y") + rect.attr("height") / 2;

		var line = this.g.path(
				"M" + cx + " " + (cy + 4) + "L" + cx + " " + (cy - 4) + "M"
						+ (cx - 4) + " " + cy + "L" + (cx + 4) + " " + cy)
				.attr({
					"stroke-width" : this.getStroke(),
					"stroke" : this.getPaint()
				});

		this.setPaint(originalPaint);

	},

	drawExpandedMarker : function(id, x, y, width, height) {
		// rectangle
		var rectangleWidth = MARKER_WIDTH;
		var rectangleHeight = MARKER_WIDTH;

		var originalPaint = this.getPaint();

		/*if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				this.setPaint(HIGHLIGHT_COLOR);
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				this.setPaint(HISTORY_COLOR);
			}
		} else {
			this.setPaint(TASK_STROKE_COLOR);
		}*/

		// anti smoothing
		// if (this.getStroke() % 2 == 1)
		x -= .5;
		y -= .5;

		var rect = this.g.rect(x + (width - rectangleWidth) / 2,
				y + height - rectangleHeight - 4, rectangleWidth,
				rectangleHeight).attr({
			"stroke-width" : this.getStroke(),
			"stroke" : this.getPaint()
		});

		// plus inside rectangle
		var cx = rect.attr("x") + rect.attr("width") / 2;
		var cy = rect.attr("y") + rect.attr("height") / 2;

		var line = this.g.path(
				"M" + (cx - 4) + " " + cy + "L" + (cx + 4) + " " + cy).attr({
			"stroke-width" : this.getStroke(),
			"stroke" : this.getPaint()
		});

		this.setPaint(originalPaint);

	},

	drawActivityMarkers : function(id, x, y, width, height, multiInstance,
			collapsed) {
		if (collapsed) {
			if (!multiInstance) {
				this.drawCollapsedMarker(id, x, y, width, height);
			} else {
				this.drawCollapsedMarker(id, x - MARKER_WIDTH / 2 - 2, y,
						width, height);

				if (multiInstance == "sequential") {
					console.log("is collapsed and multiInstanceSequential");
					this.drawMultiInstanceMarker(id, true, x + MARKER_WIDTH / 2
							+ 2, y, width, height);
				} else if (multiInstance == "parallel") {
					console.log("is collapsed and multiInstanceParallel");
					this.drawMultiInstanceMarker(id, false, x + MARKER_WIDTH
							/ 2 + 2, y, width, height);
				}
			}
		} else {
			if (multiInstance == "sequential") {
				console.log("is multiInstanceSequential");
				this.drawMultiInstanceMarker(id, true, x, y, width, height);
			} else if (multiInstance == "parallel") {
				console.log("is multiInstanceParallel");
				this.drawMultiInstanceMarker(id, false, x, y, width, height);
			}
		}
	},

	drawGateway : function(id, name, x, y, width, height) {

		var rhombus = this.g.path("M" + x + " " + (y + (height / 2)) + "L"
				+ (x + (width / 2)) + " " + (y + height) + "L" + (x + width)
				+ " " + (y + (height / 2)) + "L" + (x + (width / 2)) + " " + y
				+ "z");

		var originalPaint = this.getPaint();
		var originalFill = this.getFillColor();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				this.setPaint(HIGHLIGHT_COLOR);
				this.setFillColor(HIGHLIGHT_FILLCOLOR);
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HISTORY_COLOR);
					this.setFillColor(HISTORY_FILLCOLOR);
				} else {
					this.setPaint(GATEWAY_STROKE_COLOR);
					this.setFillColor(GATEWAY_COLOR);
				}
			}
		} else {
			this.setPaint(GATEWAY_STROKE_COLOR);
			this.setFillColor(GATEWAY_COLOR);
		}

		rhombus.attr("stroke-width", GATEWAY_STROKE);
		// rhombus.attr("stroke", Color.SlateGrey);
		rhombus.attr({
			"stroke" : this.getPaint(),
			"fill" : this.getFillColor()
		});

		this.setPaint(originalPaint);
		this.setFillColor(originalFill);

		// white shaddow
		this.drawShaddow(rhombus);

		this.setContextToElement(rhombus);

		return rhombus;
	},

	drawParallelGateway : function(id, name, x, y, width, height) {
		if(SvgExt&&SvgExt.drawParallelGateway){
			SvgExt.drawParallelGateway.apply(this,[id, name, x, y, width, height]);
			return;
		}
		this.g.setStart();

		// rhombus
		this.drawGateway(id, name, x, y, width, height);

		var originalPaint = this.getPaint();
		var originalFill = this.getFillColor();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				this.setPaint(HIGHLIGHT_COLOR);
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HISTORY_COLOR);
				} else {
					this.setPaint(GATEWAY_STROKE_COLOR);
				}
			}
		} else {
			this.setPaint(GATEWAY_MARKER_COLOR);
		}

		// plus inside rhombus
		var originalStroke = this.getStroke();

		this.setStroke(GATEWAY_TYPE_STROKE);

		var plus = this.g.path("M" + (x + 10) + " " + (y + height / 2) + "L"
				+ (x + width - 10) + " " + (y + height / 2) + // horizontal
				"M" + (x + width / 2) + " " + (y + height - 10) + "L"
				+ (x + width / 2) + " " + (y + 10) // vertical
		);
		plus.attr({
			"stroke-width" : this.getStroke(),
			"stroke" : this.getPaint()
		});

		this.setStroke(originalStroke);

		this.setPaint(originalPaint);
		this.setFillColor(originalFill);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "gateway");
	},

	drawExclusiveGateway : function(id, name, x, y, width, height) {
		if(SvgExt&&SvgExt.drawExclusiveGateway){
			SvgExt.drawExclusiveGateway.apply(this,[id, name, x, y, width, height]);
			return;
		}
		this.g.setStart();

		// rhombus
		var rhombus = this.drawGateway(id, name, x, y, width, height);

		var quarterWidth = width / 4;
		var quarterHeight = height / 4;

		var originalPaint = this.getPaint();
		var originalFill = this.getFillColor();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				this.setPaint(HIGHLIGHT_COLOR);
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HISTORY_COLOR);
				} else {
					this.setPaint(GATEWAY_STROKE_COLOR);
				}
			}
		} else {
			this.setPaint(GATEWAY_MARKER_COLOR);
		}

		// X inside rhombus
		var originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);

		var iks = this.g.path("M" + (x + quarterWidth + 3) + " "
				+ (y + quarterHeight + 3) + "L" + (x + 3 * quarterWidth - 3)
				+ " " + (y + 3 * quarterHeight - 3) + "M"
				+ (x + quarterWidth + 3) + " " + (y + 3 * quarterHeight - 3)
				+ "L" + (x + 3 * quarterWidth - 3) + " "
				+ (y + quarterHeight + 3));
		iks.attr({
			"stroke-width" : this.getStroke(),
			"stroke" : this.getPaint()
		});

		this.setStroke(originalStroke);

		this.setPaint(originalPaint);
		this.setFillColor(originalFill);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "gateway");
	},

	drawInclusiveGateway : function(id, name, x, y, width, height) {
		if(SvgExt&&SvgExt.drawInclusiveGateway){
			SvgExt.drawInclusiveGateway.apply(this,[id, name, x, y, width, height]);
			return;
		}
		this.g.setStart();

		// rhombus
		this.drawGateway(id, name, x, y, width, height);

		var diameter = width / 4;

		var originalPaint = this.getPaint();
		var originalFill = this.getFillColor();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HISTORY_COLOR);
				} else {
					this.setPaint(GATEWAY_STROKE_COLOR);
				}
			} else if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				this.setPaint(HIGHLIGHT_COLOR);
			}
		} else {
			this.setPaint(GATEWAY_MARKER_COLOR);
		}

		// circle inside rhombus
		var originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);
		var circle = this.g.ellipse(width / 2 + x, height / 2 + y, diameter,
				diameter);
		circle.attr({
			"stroke-width" : this.getStroke(),
			"stroke" : this.getPaint()
		});

		this.setStroke(originalStroke);

		this.setPaint(originalPaint);
		this.setFillColor(originalFill);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "gateway");
	},

	drawEventBasedGateway : function(id, name, x, y, width, height) {
		this.g.setStart();

		// rhombus
		this.drawGateway(id, name, x, y, width, height);

		var diameter = width / 2;

		var originalPaint = this.getPaint();
		var originalFill = this.getFillColor();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				this.setPaint(HIGHLIGHT_COLOR);
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HISTORY_COLOR);
				} else {
					this.setPaint(GATEWAY_STROKE_COLOR);
				}
			}
		} else {
			this.setPaint(GATEWAY_MARKER_COLOR);
		}

		// rombus inside rhombus
		var originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);

		// draw GeneralPath (polygon)
		var n = 5;
		var angle = 2 * Math.PI / n;
		var x1Points = [];
		var y1Points = [];

		for ( var index = 0; index < n; index++) {
			var v = index * angle - Math.PI / 2;
			x1Points[index] = x + parseInt(Math.round(width / 2))
					+ parseInt(Math.round((width / 4) * Math.cos(v)));
			y1Points[index] = y + parseInt(Math.round(height / 2))
					+ parseInt(Math.round((height / 4) * Math.sin(v)));
		}
		// g.drawPolygon(x1Points, y1Points, n);

		var path = "";
		for ( var index = 0; index < n; index++) {
			if (index == 0)
				path += "M";
			else
				path += "L";
			path += x1Points[index] + "," + y1Points[index];
		}
		path += "z";
		var polygone = this.g.path(path);

		polygone.attr({
			"stroke-width" : this.getStroke(),
			"stroke" : this.getPaint()
		});

		this.setStroke(originalStroke);

		this.setPaint(originalPaint);
		this.setFillColor(originalFill);

		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "gateway");
	},

	/*
	 * drawMultiInstanceMarker drawHighLight highLightFlow
	 */

	drawMultiInstanceMarker : function(id, sequential, x, y, width, height) {
		var rectangleWidth = MARKER_WIDTH;
		var rectangleHeight = MARKER_WIDTH;

		var originalPaint = this.getPaint();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HIGHLIGHT_COLOR);
				} else {
					this.setPaint(TASK_STROKE_COLOR);
				}
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HISTORY_COLOR);
				} else {
					this.setPaint(TASK_STROKE_COLOR);
				}
			}
		} else {
			this.setPaint(TASK_STROKE_COLOR);
		}

		var originalStroke = this.getStroke();
		this.setStroke(MULTI_INSTANCE_STROKE);

		// anti smoothing
		// if (this.getStroke() % 2 == 0)
		// x += .5, y += .5;

		var lineX = x + (width - rectangleWidth) / 2;
		var lineY = y + height - rectangleHeight - 2;

		// if (lineX % 2 > 0)
		lineX -= .5;
		// if (lineY % 2 > 0)
		lineY += .5;

		// lineX = Math.round(lineX);
		// lineY = Math.round(lineY);

		if (sequential) {
			var line = this.g.path("M" + lineX + " " + (lineY + 2) + "L"
					+ (lineX + rectangleWidth) + " " + (lineY + 2) + "M"
					+ lineX + " " + (lineY + rectangleHeight / 2) + "L"
					+ (lineX + rectangleWidth) + " "
					+ (lineY + rectangleHeight / 2) + "M" + lineX + " "
					+ (lineY + rectangleHeight - 2) + "L"
					+ (lineX + rectangleWidth) + " "
					+ (lineY + rectangleHeight - 2));

			line.attr({
				"stroke-width" : this.getStroke(),
				"stroke" : this.getPaint()
			});
		} else {
			var line = this.g.path("M" + (lineX + 2) + " " + lineY + "L"
					+ (lineX + 2) + " " + (lineY + rectangleHeight - 1) + "M"
					+ (lineX + rectangleWidth / 2) + " " + lineY + "L"
					+ (lineX + rectangleWidth / 2) + " "
					+ (lineY + rectangleHeight - 1) + "M"
					+ (lineX + rectangleWidth - 2) + " " + lineY + "L"
					+ (lineX + rectangleWidth - 2) + " "
					+ (lineY + rectangleHeight - 1));

			line.attr({
				"stroke-width" : this.getStroke(),
				"stroke" : this.getPaint()
			});
		}

		this.setStroke(originalStroke);

		this.setPaint(originalPaint);
	},

	drawHighLight : function(x, y, width, height) {
		var originalPaint = this.getPaint();
		var originalStroke = this.getStroke();

		this.setPaint(HIGHLIGHT_COLOR);
		this.setStroke(THICK_TASK_BORDER_STROKE);

		var sWidth = this.getStroke();

		// var c = this.g.rect(x - width/2 - THICK_TASK_BORDER_STROKE, y -
		// height/2 - THICK_TASK_BORDER_STROKE, width +
		// THICK_TASK_BORDER_STROKE*2, height + THICK_TASK_BORDER_STROKE*2, 5);

		var rect = this.g.rect(x - sWidth, y - sWidth, width + sWidth * 2,
				height + sWidth * 2, TASK_CORNER_ROUND);

		rect.attr("stroke-width", this.getStroke());
		rect.attr("stroke", this.getPaint());

		this.setPaint(originalPaint);
		this.setStroke(originalStroke);
	},

	highLightActivity : function(activityId) {
		var shape = this.g.getById(activityId);
		if (!shape) {
			console.error("Activity " + activityId + " not found");
			return;
		}

		var contextObject = shape.data("contextObject");
		if (contextObject)
			console.log("--> highLightActivity: ["
					+ contextObject.getProperty("type") + "], activityId: "
					+ contextObject.getId());
		else
			console.log("--> highLightActivity: ", shape, shape
					.data("contextObject"));

		var strokeWidth = THICK_TASK_BORDER_STROKE;
		var paintColor = HIGHLIGHT_COLOR;

		shape.attr("stroke-width", strokeWidth);
		shape.attr("stroke", paintColor);
	},

	highLightFlow : function(flowId) {
		var shapeFlow = this.g.getById(flowId);
		if (!shapeFlow) {
			console.error("Flow " + flowId + " not found");
			return;
		}

		var contextObject = shapeFlow.data("contextObject");
		if (contextObject)
			console.log("--> highLightFlow: [" + contextObject.id + "] "
					+ contextObject.flow);
		// console.log("--> highLightFlow: ", flow.flow, flow.data("set"));

		var strokeWidth = SEQUENCEFLOW_HIGHLIGHT_STROKE;
		var paintColor = HIGHLIGHT_FLOW_COLOR;

		var st = shapeFlow.data("set");

		st.attr("stroke-width", strokeWidth);
		st.attr("stroke", paintColor);

		var withArrowHead = shapeFlow.data("withArrowHead");
		if (withArrowHead)
			st[1].attr("fill", paintColor);

		st.forEach(function(el) {
			// console.log("---->", el);
			// el.attr("")
		});
	},

	_drawClock : function(cx, cy, width, height) {

		var circle = this.g.ellipse(cx, cy, 1, 1).attr({
			stroke : "none",
			fill : Color.get(232, 239, 241)
		});
		// var c = this.g.ellipse(cx, cy, width, height).attr({stroke:"none",
		// fill: Color.red});
		// x = cx - width/2;
		// y = cy - height/2;

		var clock = this.g
				.path(
				/* outer circle */"M15.5,2.374		C8.251,2.375,2.376,8.251,2.374,15.5		C2.376,22.748,8.251,28.623,15.5,28.627c7.249-0.004,13.124-5.879,13.125-13.127C28.624,8.251,22.749,2.375,15.5,2.374z"
						+
						/* inner circle */"M15.5,26.623	C8.909,26.615,4.385,22.09,4.375,15.5	C4.385,8.909,8.909,4.384,15.5,4.374c4.59,0.01,11.115,3.535,11.124,11.125C26.615,22.09,22.091,26.615,15.5,26.623z"
						+
						/* 9 */"M8.625,15.5c-0.001-0.552-0.448-0.999-1.001-1c-0.553,0-1,0.448-1,1c0,0.553,0.449,1,1,1C8.176,16.5,8.624,16.053,8.625,15.5z"
						+
						/* 8 */"M8.179,18.572c-0.478,0.277-0.642,0.889-0.365,1.367c0.275,0.479,0.889,0.641,1.365,0.365c0.479-0.275,0.643-0.887,0.367-1.367C9.27,18.461,8.658,18.297,8.179,18.572z"
						+
						/* 10 */"M9.18,10.696c-0.479-0.276-1.09-0.112-1.366,0.366s-0.111,1.09,0.365,1.366c0.479,0.276,1.09,0.113,1.367-0.366C9.821,11.584,9.657,10.973,9.18,10.696z"
						+
						/* 2 */"M22.822,12.428c0.478-0.275,0.643-0.888,0.366-1.366c-0.275-0.478-0.89-0.642-1.366-0.366c-0.479,0.278-0.642,0.89-0.366,1.367C21.732,12.54,22.344,12.705,22.822,12.428z"
						+
						/* 7 */"M12.062,21.455c-0.478-0.275-1.089-0.111-1.366,0.367c-0.275,0.479-0.111,1.09,0.366,1.365c0.478,0.277,1.091,0.111,1.365-0.365C12.704,22.344,12.54,21.732,12.062,21.455z"
						+
						/* 11 */"M12.062,9.545c0.479-0.276,0.642-0.888,0.366-1.366c-0.276-0.478-0.888-0.642-1.366-0.366s-0.642,0.888-0.366,1.366C10.973,9.658,11.584,9.822,12.062,9.545z"
						+
						/* 4 */"M22.823,18.572c-0.48-0.275-1.092-0.111-1.367,0.365c-0.275,0.479-0.112,1.092,0.367,1.367c0.477,0.275,1.089,0.113,1.365-0.365C23.464,19.461,23.3,18.848,22.823,18.572z"
						+
						/* 2 */"M19.938,7.813c-0.477-0.276-1.091-0.111-1.365,0.366c-0.275,0.48-0.111,1.091,0.366,1.367s1.089,0.112,1.366-0.366C20.581,8.702,20.418,8.089,19.938,7.813z"
						+
						/* 3 */"M23.378,14.5c-0.554,0.002-1.001,0.45-1.001,1c0.001,0.552,0.448,1,1.001,1c0.551,0,1-0.447,1-1C24.378,14.949,23.929,14.5,23.378,14.5z"
						+
						/* arrows */"M15.501,6.624c-0.552,0-1,0.448-1,1l-0.466,7.343l-3.004,1.96c-0.478,0.277-0.642,0.889-0.365,1.365c0.275,0.479,0.889,0.643,1.365,0.367l3.305-1.676C15.39,16.99,15.444,17,15.501,17c0.828,0,1.5-0.671,1.5-1.5l-0.5-7.876C16.501,7.072,16.053,6.624,15.501,6.624z"
						+
						/* 9 */"M15.501,22.377c-0.552,0-1,0.447-1,1s0.448,1,1,1s1-0.447,1-1S16.053,22.377,15.501,22.377z"
						+
						/* 8 */"M18.939,21.455c-0.479,0.277-0.643,0.889-0.366,1.367c0.275,0.477,0.888,0.643,1.366,0.365c0.478-0.275,0.642-0.889,0.366-1.365C20.028,21.344,19.417,21.18,18.939,21.455z"
						+ "");
		clock.attr({
			fill : Color.black,
			stroke : "none"
		});
		// clock.transform("t " + (cx-29.75/2) + " " + (cy-29.75/2));
		// clock.transform("...s 0.85");

		// clock.transform("...s " + .85 + " " + .85);
		clock.transform("t " + (-2.374) + " " + (-2.374));
		clock.transform("...t -" + (15.5 - 2.374) + " -" + (15.5 - 2.374));
		clock.transform("...s " + 1 * (width / 35) + " " + 1 * (height / 35));
		clock.transform("...T " + cx + " " + cy);
		// clock.transform("t " + (cx-width/2) + " " + (cy-height/2));

		// console.log(".getBBox(): ", clock.getBBox());
		// console.log(".attr(): ", c.attrs);
		circle.attr("rx", clock.getBBox().width / 2);
		circle.attr("ry", clock.getBBox().height / 2);

		// return circle
	},

	_drawPentagon : function(cx, cy, width, height, filled) {
		// draw GeneralPath (polygon)
		var n = 5;
		var angle = 2 * Math.PI / n;
		var waypoints = [];

		for ( var index = 0; index < n; index++) {
			var v = index * angle - Math.PI / 2;
			var point = {};
			point.x = -width * 1.2 / 2 + parseInt(Math.round(width * 1.2 / 2))
					+ parseInt(Math.round((width * 1.2 / 4) * Math.cos(v)));
			point.y = -height * 1.2 / 2
					+ parseInt(Math.round(height * 1.2 / 2))
					+ parseInt(Math.round((height * 1.2 / 4) * Math.sin(v)));
			waypoints[index] = point;
		}

		var polygone = new Polygone(waypoints, this.getStroke());
		polygone.element = this.g.path(polygone.path);
		if (filled)
			polygone.element.attr("fill", Color.black);
		else
			polygone.element.attr("fill", Color.white);

		polygone.element.transform("s " + 1 * (width / 35) + " " + 1
				* (height / 35));
		polygone.element.transform("...T " + cx + " " + cy);
	},

	// _drawMultilineText: function(text, x, y, boxWidth, boxHeight, textAnchor)
	// {
	_drawMultilineText : function(text, x, y, boxWidth, boxHeight,
			verticalAlign, horizontalAlign) {
		if (!text || text == "")
			return;
		// Autostretch boxHeight if boxHeight is 0
		if (boxHeight == 0)
			verticalAlign = MULTILINE_VERTICAL_ALIGN_TOP;

		// var TEXT_PADDING = 3;
		var width = boxWidth;
		if (boxHeight)
			var height = boxHeight;

		var layouts = [];

		// var font = {font: "11px Arial", opacity: 1, "fill": LABEL_COLOR};
		var font = this.getFont();
		var measurer = new LineBreakMeasurer(this.g, x, y, text, font);
		var lineHeight = measurer.rafaelTextObject.getBBox().height;
		// console.log("text: ", text.replace(/\n/g, "?"));

		if (height) {
			var availableLinesCount = parseInt(height / lineHeight);
			// console.log("availableLinesCount: " + availableLinesCount);
		}

		var i = 1;
		while (measurer.getPosition() < measurer.text.getEndIndex()) {
			var layout = measurer.nextLayout(width);
			// console.log("LAYOUT: " + layout + ", getPosition: " +
			// measurer.getPosition());

			if (layout != null) {
				// TODO: and check if measurer has next layout. If no then don't
				// draw dots
				if (!availableLinesCount || i < availableLinesCount) {
					layouts.push(layout);
				} else {
					//layouts.push(this.fitTextToWidth(layout + "...", boxWidth));
					//... bug fixed by lijing
					layouts.push(this.fitTextToWidth(layout, boxWidth));
					break;
				}
			}
			i++;
		}
		;
		// console.log(layouts);

		measurer.rafaelTextObject.attr({
			"text" : layouts.join("\n")
		});

		if (horizontalAlign)
			measurer.rafaelTextObject.attr({
				"text-anchor" : horizontalAlign
			}); // end, middle, start

		var bb = measurer.rafaelTextObject.getBBox();
		// TODO: there is somethin wrong with wertical align. May be:
		// measurer.rafaelTextObject.attr({"y": y + height/2 - bb.height/2})
		measurer.rafaelTextObject.attr({
			"y" : y + bb.height / 2
		});
		// var bb = measurer.rafaelTextObject.getBBox();

		if (measurer.rafaelTextObject.attr("text-anchor") == MULTILINE_HORIZONTAL_ALIGN_MIDDLE)
			measurer.rafaelTextObject.attr("x", x + boxWidth / 2);
		else if (measurer.rafaelTextObject.attr("text-anchor") == MULTILINE_HORIZONTAL_ALIGN_RIGHT)
			measurer.rafaelTextObject.attr("x", x + boxWidth);

		var boxStyle = {
			stroke : Color.LightSteelBlue2,
			"stroke-width" : 1.0,
			"stroke-dasharray" : "- "
		};
		// var box = this.g.rect(x+.5, y + .5, width, height).attr(boxStyle);
		var textAreaCX = x + boxWidth / 2;
		var textAreaCY = y + height / 2;

		var height = boxHeight;
		if (!height)
			height = bb.height;
		var dotLeftTop = this.g.ellipse(x, y, 3, 3).attr({
			"stroke-width" : 0,
			fill : Color.LightSteelBlue,
			stroke : "none"
		}).hide();
		var dotCenter = this.g.ellipse(textAreaCX, textAreaCY, 3, 3).attr({
			fill : Color.LightSteelBlue2,
			stroke : "none"
		}).hide();

		/*
		 * // real bbox var bb = measurer.rafaelTextObject.getBBox(); var rect =
		 * paper.rect(bb.x+.5, bb.y + .5, bb.width,
		 * bb.height).attr({"stroke-width": 1});
		 */
		var rect = this.g.rect(x, y, boxWidth, height).attr({
			"stroke-width" : 1
		}).attr(boxStyle).hide();
		var debugSet = this.g.set();
		debugSet.push(dotLeftTop, dotCenter, rect);
		// debugSet.show();
		return measurer;
	},

	drawTextAnnotation : function(id, text, x, y, width, height) {
		var lineLength = 18;
		var path = [];
		path.push([ "M", x + lineLength, y ]);
		path.push([ "L", x, y ]);
		path.push([ "L", x, y + height ]);
		path.push([ "L", x + lineLength, y + height ]);

		path.push([ "L", x + lineLength, y + height - 1 ]);
		path.push([ "L", x + 1, y + height - 1 ]);
		path.push([ "L", x + 1, y + 1 ]);
		path.push([ "L", x + lineLength, y + 1 ]);
		path.push([ "z" ]);

		var textAreaLines = this.g.path(path);

		var boxWidth = width - (2 * ANNOTATION_TEXT_PADDING);
		var boxHeight = height - (2 * ANNOTATION_TEXT_PADDING);
		var boxX = x + width / 2 - boxWidth / 2;
		var boxY = y + height / 2 - boxHeight / 2;

		// for debug
		var rectStyle = {
			stroke : Color(112, 146, 190),
			"stroke-width" : 1.0,
			"stroke-dasharray" : "- "
		};
		var r = this.g.rect(boxX, boxY, boxWidth, boxHeight).attr(rectStyle);
		//

		this.drawAnnotationText(text, boxX, boxY, boxWidth, boxHeight);
	},

	drawAnnotationText : function(id, text, x, y, width, height) {
		// this._drawMultilineText(text, x, y, width, height, "start");

		var originalPaint = this.getPaint();
		var originalFont = this.getFont();

		this.setPaint(Color.black);
		this.setFont(TASK_FONT);

		this._drawMultilineText(text, x, y, width, height,
				MULTILINE_VERTICAL_ALIGN_TOP, MULTILINE_HORIZONTAL_ALIGN_LEFT);

		this.setPaint(originalPaint);
		this.setFont(originalFont);
	},

	drawLabel : function(id, text, x, y, width, height) {
		// this._drawMultilineText(text, x, y, width, height, "start");

		var originalPaint = this.getPaint();
		var originalFont = this.getFont();

		if (Canvas_IsFlowTrack) {
			if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HIGHLIGHT_LABEL_COLOR);
					this.setFont(HIGHLIGHT_LABEL_FONT);
				} else {
					this.setPaint(LABEL_COLOR);
					this.setFont(LABEL_FONT);
				}
			} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
				if (Canvas_useCustomTheme) {
					this.setPaint(HIGHLIGHT_LABEL_COLOR);
					this.setFont(HIGHLIGHT_LABEL_FONT);
				} else {
					this.setPaint(LABEL_COLOR);
					this.setFont(LABEL_FONT);
				}
			} else {
				this.setFont(DISABLED_LABEL_FONT);
			}
		} else {
			this.setPaint(LABEL_COLOR);
			this.setFont(LABEL_FONT);
		}

		// predefined box width for labels
		// TODO: use label width as is, but not height (for stretching)
		if (!width || !height) {
			width = 100;
			height = 0;
		}

		// TODO: remove it. It is debug
		x = x - width / 2;

		this
				._drawMultilineText(text, x, y, width, height,
						MULTILINE_VERTICAL_ALIGN_TOP,
						MULTILINE_HORIZONTAL_ALIGN_MIDDLE);

		this.setPaint(originalPaint);
		this.setFont(originalFont);
	},

	drawLabel111111111 : function(text, x, y, width, height, labelAttrs) {
		var debug = false;

		// text
		if (text != null && text != undefined && text != "") {
			var attr = LABEL_FONT;

			// console.log("x", x, "y", y, "width", width, "height", height );

			wrappedText = text;
			if (labelAttrs && labelAttrs.wrapWidth) {
				wrappedText = this.wrapTextToWidth(wrappedText,
						labelAttrs.wrapWidth);
			}
			var realWidth = this.getStringWidth(wrappedText, attr);
			var realHeight = this.getStringHeight(wrappedText, attr);

			var textAreaCX = x + width / 2;
			var textAreaCY = y + 3 + height
					+ this.getStringHeight(wrappedText, attr) / 2;

			var textX = textAreaCX;
			var textY = textAreaCY;

			var textAttrs = {};
			if (labelAttrs && labelAttrs.align) {
				switch (labelAttrs.align) {
				case "left":
					textAttrs["text-anchor"] = "start";
					textX = textX - realWidth / 2;
					break;
				case "center":
					textAttrs["text-anchor"] = "middle";
					break;
				case "right":
					textAttrs["text-anchor"] = "end";
					textX = textX + realWidth / 2;
					break;
				}
			}
			if (labelAttrs && labelAttrs.wrapWidth) {
				if (true) {
					// Draw frameborder
					var textAreaStyle = {
						stroke : Color.LightSteelBlue2,
						"stroke-width" : 1.0,
						"stroke-dasharray" : "- "
					};
					var textAreaX = textAreaCX - realWidth / 2;
					var textAreaY = textAreaCY + .5 - realHeight / 2;
					var textArea = this.g.rect(textAreaX, textAreaY, realWidth,
							realHeight).attr(textAreaStyle);

					var textAreaLines = this.g.path("M" + textAreaX + " "
							+ textAreaY + "L" + (textAreaX + realWidth) + " "
							+ (textAreaY + realHeight) + "M"
							+ +(textAreaX + realWidth) + " " + textAreaY + "L"
							+ textAreaX + " " + (textAreaY + realHeight));
					textAreaLines.attr(textAreaStyle);

					this.g.ellipse(textAreaCX, textAreaCY, 3, 3).attr({
						fill : Color.LightSteelBlue2,
						stroke : "none"
					});
				}
			}

			var label = this.g.text(textX, textY, wrappedText).attr(attr).attr(
					textAttrs);
			// label.id = Raphael.createUUID();
			// console.log("label ", label.id, ", ", wrappedText);

			if (this.fontSmoothing) {
				label.attr({
					stroke : LABEL_COLOR,
					"stroke-width" : .4
				});
			}

			// debug
			if (debug) {
				var imageAreaStyle = {
					stroke : Color.grey61,
					"stroke-width" : 1.0,
					"stroke-dasharray" : "- "
				};
				var imageArea = this.g.rect(x + .5, y + .5, width, height)
						.attr(imageAreaStyle);
				var imageAreaLines = this.g.path("M" + x + " " + y + "L"
						+ (x + width) + " " + (y + height) + "M" + +(x + width)
						+ " " + y + "L" + x + " " + (y + height));
				imageAreaLines.attr(imageAreaStyle);
				var dotStyle = {
					fill : Color.Coral,
					stroke : "none"
				};
				this.g.ellipse(x, y, 3, 3).attr(dotStyle);
				this.g.ellipse(x + width, y, 2, 2).attr(dotStyle);
				this.g.ellipse(x + width, y + height, 2, 2).attr(dotStyle);
				this.g.ellipse(x, y + height, 2, 2).attr(dotStyle);
			}

			return label;
		}
	},

	vvoid : function() {
	}
};
