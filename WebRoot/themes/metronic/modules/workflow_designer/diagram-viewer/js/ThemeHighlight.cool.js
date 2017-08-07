;(function($) {
	function saveOriginalPS(canvas){
		originalPaint = canvas.getPaint();
		originalStroke = canvas.getStroke();
		originalFont=canvas.getFont();
	};
	function setPS(canvas,strokeColor,strokeWidth){
		if(strokeColor){
			canvas.setPaint(strokeColor);
		}
		if(strokeWidth){
			canvas.setStroke(strokeWidth);
		}
		canvas.setFont(TASK_BASE_FONT);
	};
	function restorePS(canvas){
		if(originalPaint){
			canvas.setPaint(originalPaint);
		}
		if(originalStroke){
			canvas.setStroke(originalStroke);
		}
		if(originalFont){
			canvas.setFont(originalFont);
		}
	};
	function imgp(relativePath){
		if(Global){
			if(Global.themePath){
				var basePath=Global.themePath+"/modules/workflow_designer/diagram-viewer/";
				return basePath+relativePath;
			}
		}
		return relativePath;
	};
	var taskShape={radius:30,iconBoxWidth:30,iconBoxHeight:40,iconWidth:25,iconHeight:28};
	window.SvgExtUtils={
			fixedTaskXy:function(x,y){
				// anti smoothing
				if (strokeWidth % 2 == 1){
					x = Math.round(x) + .5, y = Math.round(y) + .5;
				}
				x=x+25;
				y=y-4;
				return {x:x,y:y};
			},
			fixedTaskImgXy:function(x,y){
				var iconX=x+taskShape.radius/2;
				var iconY=y+taskShape.radius/2-5;
				return {x:iconX,y:iconY};
			},
			fixedEventXy:function(x,y){
				x=x;
				y=y-2;
				return {x:x,y:y};
			},
			fixedGatewayXy:function(x,y){
				x=x-2;
				y=y-4;
				return {x:x,y:y};
			},
			imgp:function(relativePath){
				return imgp(relativePath);
			},
			attrs:{
				overlay:{
					stroke : Color.Orange,
					"stroke-width" : 3,
					fill : Color.White,
					opacity : 0.0,
					cursor : "hand"},
				setActorText:{fill:"#ffffff","font-weight":"normal","font-family":"simsun"},
				selectedAct:{"stroke":Color.getRGB("#FF5A00"),"opacity":1,"fill":"#fff","fill-opacity":"0","stroke-width":3},
				disabledImg:{opacity:"0.3"},
				animate:{opacity:1.0,"fill-opacity":0.0,"stroke-width":10}
			}
	};
//blue: not walk through
	var ACT_circle_blue=Color.getRGB("#4AB2F9");
	var ACT_font_blue=ACT_circle_blue;
	var ACT_fill_blue=Color.getRGB("#EEF4FF");
	var ACT_start_blue_img=imgp("images/blue_start.png");
	var ACT_end_blue_img=imgp("images/blue_end.png");
	var ACT_blue_iconbox=imgp("images/blue_box.png");
//grey: not walk through
	var ACT_circle_gray=Color.getRGB("#CBCBCB");
	var ACT_font_gray=Color.getRGB("#787878");
	var ACT_fill_gray=Color.getRGB("#f5f5f5");
	var ACT_start_gray_img=imgp("images/gray_start.png");
	var ACT_end_gray_img=imgp("images/gray_end.png");
	var ACT_gray_iconbox=imgp("images/gray_box.png");
//orange: current
	var ACT_circle_orange=Color.getRGB("#FF5A00");window.HIGHLIGHT_COLOR=ACT_circle_orange;
	var ACT_font_orange=ACT_circle_orange;
	var ACT_fill_orange=Color.getRGB("#EEF4FF");
	var ACT_start_orange_img=imgp("images/orange_start.png");
	var ACT_end_orange_img=imgp("images/orange_end.png");
	var ACT_orange_iconbox=imgp("images/orange_box.png");
//green: walk through
	var ACT_circle_green=Color.getRGB("#45BB7F");
	var ACT_font_green=ACT_circle_green;
	var ACT_fill_green=Color.getRGB("#EEF4FF");
	var ACT_start_green_img=imgp("images/green_start.png");
	var ACT_end_green_img=imgp("images/green_end.png");
	var ACT_green_iconbox=imgp("images/green_box.png");
//gateway
	var GATEWAY_img={
			width:54,
			height:54,
			inclusive:{
				blue:imgp("images/blue_inclusive.png"),
				gray:imgp("images/gray_inclusive.png"),
				green:imgp("images/green_inclusive.png"),
				orange:imgp("images/orange_inclusive.png")
			},
			exclusive:{
				blue:imgp("images/blue_exclusive.png"),
				gray:imgp("images/gray_exclusive.png"),
				green:imgp("images/green_exclusive.png"),
				orange:imgp("images/orange_exclusive.png")
			},
			parallel:{
				blue:imgp("images/blue_parallel.png"),
				gray:imgp("images/gray_parallel.png"),
				green:imgp("images/green_parallel.png"),
				orange:imgp("images/orange_parallel.png")
			}
	};
	
	var ACT_title_box_width=100;
	var ACT_title_box_height=40;
	var Flow_title_box_width=100;
	var Flow_title_box_height=50;
	
//icon
	var TASK_img={
			defaultIcon:imgp("images/icons/ic-rsp.png"),
			draftTask:imgp("images/icons/ic-hq.png"),
			scriptTask:imgp("images/icons/ic-sq.png"),
			serviceTask:imgp("images/icons/ic-sq.png"),
			callActivity:imgp("images/icons/ic-bmsp.png")
	};
//normal style definition
	var TASK_BASE_FONT = {
			"font-family" : "simsun",
			font : "12px Arial",
			opacity : 1,
			fill : ACT_font_blue
	};
	
	var strokeWidth=3;
	var strokeWidthForLine=2;
	var strokeColor=ACT_circle_blue;
	var iconBox=ACT_blue_iconbox;
	var startEventImg=ACT_start_blue_img;
	var endEventImg=ACT_end_blue_img;
	var fillColor=ACT_fill_blue;
	
	var originalPaint = null;
	var originalStroke = null;
	var originalFont = null;
	var eventShape={imgWidth:36,imgHeight:36};
	SvgExtUtils.attrs.taskShape=taskShape;
	SvgExtUtils.attrs.eventShape=eventShape;
	
	window.SvgExt={
			_drawTask:	function(id, name, x, y, width, height, thickBorder){
				saveOriginalPS(this);
				var radius=taskShape.radius;
				var iconBoxWidth=taskShape.iconBoxWidth,iconBoxHeight=taskShape.iconBoxHeight,iconWidth=taskShape.iconWidth,iconHeight=taskShape.iconHeight;
				var contextObject = this.getConextObject();
				var icon=TASK_img.defaultIcon;
				if(contextObject){
					var _icon=TASK_img[contextObject.properties.type];
					if(_icon){
						icon=_icon;
					}
				}
				var dashed=false;
				if (Canvas_IsFlowTrack) {// if come from process instance
					strokeColor=ACT_circle_gray;
					TASK_BASE_FONT.fill=ACT_font_gray;
					iconBox=ACT_gray_iconbox;
					if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
						strokeColor=ACT_circle_orange;
						TASK_BASE_FONT.fill=ACT_font_orange;
						iconBox=ACT_orange_iconbox;
					} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
						strokeColor=ACT_circle_green;
						TASK_BASE_FONT.fill=ACT_font_green;
						iconBox=ACT_green_iconbox;
					}else{
						dashed=true;
					}
				}
				setPS(this,strokeColor,strokeWidth);
				
				var xy=SvgExtUtils.fixedTaskXy(x,y);
				x=xy.x,y=xy.y;
				// shape
				var shape = this.g.circle(x+radius, y+radius,radius);
				var iconXy=SvgExtUtils.fixedTaskImgXy(x,y);
				var iconX=iconXy.x,iconY=iconXy.y;
				var shape2 = this.g.image(iconBox,iconX,iconY,iconBoxWidth,iconBoxHeight);
				var shape3 = this.g.image(icon,iconX+3,iconY+6,iconWidth,iconHeight);
				var attr = {
						"stroke-width" : strokeWidth,
						stroke : strokeColor
				};
				if(dashed){
					attr["stroke-dasharray"]="-";
				}
				shape.attr(attr);
				
				if (contextObject) {
					shape.id = contextObject.id;
					shape.data("contextObject", contextObject);
				}
				//draw activity title 
				if (name) {
					var boxX = x-radius+10;
					var boxY = y + radius*2;
					var ss=this._drawMultilineText(name, boxX, boxY, ACT_title_box_width, ACT_title_box_height,
							MULTILINE_VERTICAL_ALIGN_MIDDLE,
							MULTILINE_HORIZONTAL_ALIGN_MIDDLE);
					ss.rafaelTextObject.attr({"font-weight":"bold","transform":"s1.1"});
				}
				restorePS(this);
			},
			_drawStartEvent:function(id, name, x, y, width, height, isInterrupting){
				saveOriginalPS(this);
				var imgWidth=eventShape.imgWidth,imgHeight=eventShape.imgHeight;
				if (Canvas_IsFlowTrack) {
					startEventImg=ACT_start_gray_img;
					TASK_BASE_FONT.fill=ACT_font_gray;
					if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
						startEventImg=ACT_start_orange_img;
						TASK_BASE_FONT.fill=ACT_font_orange;
					} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
						startEventImg=ACT_start_green_img;
						TASK_BASE_FONT.fill=ACT_font_green;
					}
				}
				setPS(this,null,null);
				var xy=SvgExtUtils.fixedEventXy(x,y);
				var img = this.g.image(startEventImg,xy.x,xy.y,imgWidth,imgHeight);
				this.setContextToElement(img);
				if(name){
					var boxX = x-imgWidth/2;
					var boxY = y+imgWidth;
					this._drawMultilineText(name, boxX, boxY, ACT_title_box_width, ACT_title_box_height,
							MULTILINE_VERTICAL_ALIGN_MIDDLE,
							MULTILINE_HORIZONTAL_ALIGN_MIDDLE);
				}
				restorePS(this);
			},
			_drawNoneEndEvent:function(id, name, x, y, width, height, image, type){
				saveOriginalPS(this);
				var imgWidth=eventShape.imgWidth,imgHeight=eventShape.imgHeight;
				if (Canvas_IsFlowTrack) {
					endEventImg=ACT_end_gray_img;
					TASK_BASE_FONT.fill=ACT_font_gray;
					if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
						endEventImg=ACT_end_orange_img;
						TASK_BASE_FONT.fill=ACT_font_orange;
					} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
						endEventImg=ACT_end_green_img;
						TASK_BASE_FONT.fill=ACT_font_green;
					}
				}
				setPS(this,null,null);
				var xy=SvgExtUtils.fixedEventXy(x,y);
				var img = this.g.image(endEventImg,xy.x,xy.y,imgWidth,imgHeight);
				this.setContextToElement(img);
				if(name){
					var boxX = x-imgWidth/2;
					var boxY = y+imgWidth;
					this._drawMultilineText(name, boxX, boxY, ACT_title_box_width, ACT_title_box_height,
							MULTILINE_VERTICAL_ALIGN_MIDDLE,
							MULTILINE_HORIZONTAL_ALIGN_MIDDLE);
				}
				restorePS(this);
			},
			_drawFlow : function(id, name, waypoints, conditional, isDefault,
					highLighted, withArrowHead, connectionType){
				saveOriginalPS(this);
				var dashed=false;
				if (Canvas_IsFlowTrack) {
					TASK_BASE_FONT.fill=ACT_font_gray;
					strokeColor=ACT_circle_gray;
					if (highLighted) {
						strokeColor=ACT_circle_orange;
						TASK_BASE_FONT.fill=ACT_font_orange;
					} else if ($.inArray(id, Canvas_HighlightsData.flows) > -1) {
						strokeColor=ACT_circle_green;
						TASK_BASE_FONT.fill=ACT_font_green;
					}else{
						dashed=true;
					}
				}
				setPS(this,strokeColor,null);
				var uuid = Raphael.createUUID();
				var contextObject = this.getConextObject();
				var newWaypoints = waypoints;
				if (contextObject) {
					var newWaypoints = this._connectFlowToActivity(contextObject.sourceActivityId,contextObject.destinationActivityId, waypoints);
					if (!newWaypoints) {
						restorePS(this);
						console.error("Error draw flow from '"
								+ contextObject.sourceActivityId + "' to '"
								+ contextObject.destinationActivityId + "' ");
						return;
					}
				}
				var polyline = new Polyline(uuid, newWaypoints, strokeWidthForLine);
				var path = [];
				for(var i = 0; i < newWaypoints.length; i++){
					var point = newWaypoints[i];
					var pathType = ""
					if (i==0)
						pathType = "M";
					else 
						pathType = "L";
					var targetX = point.x, targetY = point.y;
					// anti smoothing
					if (strokeWidthForLine%2 == 1) {
						targetX += 0.5;
						targetY += 0.5;
					}
					path.push([pathType, targetX, targetY]);	
				}
				polyline.element = this.g.path(path);
				polyline.element.attr("stroke-width", strokeWidthForLine);
				polyline.element.attr("stroke", strokeColor);
				if(dashed){
					polyline.element.attr("stroke-dasharray", "-");
				}
				if (contextObject) {
					polyline.element.id = contextObject.id;
					polyline.element.data("contextObject", contextObject);
				} else {
					polyline.element.id = uuid;
				}
				
				var last = polyline.getAnchorsCount() - 1;
				var x = polyline.getAnchor(last).x;
				var y = polyline.getAnchor(last).y;
				
				var lastLineIndex = polyline.getLinesCount() - 1;
				var line = polyline.getLine(lastLineIndex);
				var firstLine = polyline.getLine(0);
				
				var arrowHead = null, circleTail = null, defaultSequenceFlowIndicator = null, conditionalSequenceFlowIndicator = null;
				
				if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW) {
					circleTail = this._drawCircleTail(firstLine, connectionType);
				}
				if (withArrowHead)
					arrowHead = this._drawArrowHead(line, connectionType);
				
				/*if (isDefault && polyline.isDefaultConditionAvailable) {
					defaultSequenceFlowIndicator = this._drawDefaultSequenceFlowIndicator(firstLine);
				}
				if (conditional) {
					conditionalSequenceFlowIndicator = this._drawConditionalSequenceFlowIndicator(firstLine);
				}*/
				
				var st = this.g.set();
				st.push(polyline.element, arrowHead, circleTail,conditionalSequenceFlowIndicator);
				polyline.element.data("set", st);
				polyline.element.data("withArrowHead", withArrowHead);
				
				if (!connectionType || connectionType == CONNECTION_TYPE.SEQUENCE_FLOW)
					polyline.element.attr("stroke-width", strokeWidthForLine);
				else if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW)
					polyline.element.attr({
						"stroke-dasharray" : "--"
					});
				else if (connectionType == CONNECTION_TYPE.ASSOCIATION)
					polyline.element.attr({
						"stroke-dasharray" : ". "
					});
				
				if (name) {
					var first = 0;
					var x1 = polyline.getAnchor(first).x;
					var y1 = polyline.getAnchor(first).y;
					var posLabel = this.getFlowLabelPosition(name, polyline, x1, y1);
					this._drawMultilineText(name, posLabel.x, posLabel.y, Flow_title_box_width, Flow_title_box_height,
							MULTILINE_VERTICAL_ALIGN_MIDDLE,
							MULTILINE_HORIZONTAL_ALIGN_MIDDLE);
				}
				restorePS(this);
			},
			drawExpandedSubProcess:function(id, name, x, y, width, height,isTriggeredByEvent){
				saveOriginalPS(this);
				this.g.setStart();
				if (Canvas_IsFlowTrack) {
					TASK_BASE_FONT.fill=ACT_font_gray;
					strokeColor=ACT_circle_gray;
					fillColor=ACT_fill_gray;
					if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
						TASK_BASE_FONT.fill=ACT_font_orange;
						strokeColor=ACT_circle_orange;
						fillColor=ACT_fill_orange;
					} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
						TASK_BASE_FONT.fill=ACT_font_green;
						strokeColor=ACT_circle_green;
						fillColor=ACT_fill_green;
					}
				}		
				
				setPS(this,strokeColor,strokeWidthForLine);
				// anti smoothing
				if (this.getStroke() % 2 == 1){
					x = Math.round(x) + .5, y = Math.round(y) + .5;
				}
				// shape
				var rect = this.g.rect(x, y, width, height,5);
				// Use different stroke (dashed)
				if (isTriggeredByEvent) {
					rect.attr(EVENT_SUBPROCESS_ATTRS);
				} else {
					rect.attr(EXPANDED_SUBPROCESS_ATTRS);
				}
				
				rect.attr({
					"stroke-width" : this.getStroke(),
					"stroke" : this.getPaint(),
					"fill":fillColor
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
				this.drawExpandedMarker(id, x, y, width, height);
				this.addHandlers(set, x, y, width, height, "subProcess");
				restorePS(this);
			},
			drawExclusiveGateway : function(id, name, x, y, width, height) {
				saveOriginalPS(this);
				this.g.setStart();
				var img=GATEWAY_img.exclusive.blue;
				if (Canvas_IsFlowTrack) {
					strokeColor=ACT_circle_gray;
					img=GATEWAY_img.exclusive.gray;
					if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
						strokeColor=ACT_circle_orange;
						img=GATEWAY_img.exclusive.orange;
					} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
						strokeColor=ACT_circle_green;
						img=GATEWAY_img.exclusive.green;
					}
				}
				setPS(this,strokeColor,null);
				var xy=SvgExtUtils.fixedGatewayXy(x,y);
				x=xy.x,y=xy.y;
				this.g.image(img,x,y,GATEWAY_img.width,GATEWAY_img.height);
				/*if(name){
			this.drawLabel(id, name, x,y, ACT_title_box_width, ACT_title_box_height)
		}*/
				var set = this.g.setFinish();
				restorePS(this);
				this.addHandlers(set, x, y, width, height, "gateway");
			},
			drawInclusiveGateway : function(id, name, x, y, width, height) {
				saveOriginalPS(this);
				this.g.setStart();
				var img=GATEWAY_img.inclusive.blue;
				if (Canvas_IsFlowTrack) {
					strokeColor=ACT_circle_gray;
					img=GATEWAY_img.inclusive.gray;
					if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
						strokeColor=ACT_circle_orange;
						img=GATEWAY_img.inclusive.orange;
					} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
						strokeColor=ACT_circle_green;
						img=GATEWAY_img.inclusive.green;
					}
				}
				setPS(this,strokeColor,null);
				var xy=SvgExtUtils.fixedGatewayXy(x,y);
				x=xy.x,y=xy.y;
				this.g.image(img,x,y,GATEWAY_img.width,GATEWAY_img.height);
				/*if(name){
			this.drawLabel(id, name, x,y, ACT_title_box_width, ACT_title_box_height)
		}*/
				var set = this.g.setFinish();
				restorePS(this);
				this.addHandlers(set, x, y, width, height, "gateway");
			},
			drawParallelGateway : function(id, name, x, y, width, height) {
				saveOriginalPS(this);
				this.g.setStart();
				var img=GATEWAY_img.parallel.blue;
				if (Canvas_IsFlowTrack) {
					strokeColor=ACT_circle_gray;
					img=GATEWAY_img.parallel.gray;
					if ($.inArray(id, Canvas_HighlightsData.activities) > -1) {
						strokeColor=ACT_circle_orange;
						img=GATEWAY_img.parallel.orange;
					} else if ($.inArray(id, Canvas_HighlightsData.historyActivities) > -1) {
						strokeColor=ACT_circle_green;
						img=GATEWAY_img.parallel.green;
					}
				}
				setPS(this,strokeColor,null);
				var xy=SvgExtUtils.fixedGatewayXy(x,y);
				x=xy.x,y=xy.y;
				this.g.image(img,x,y,GATEWAY_img.width,GATEWAY_img.height);
				/*if(name){
			this.drawLabel(id, name, x,y, ACT_title_box_width, ACT_title_box_height)
		}*/
				var set = this.g.setFinish();
				restorePS(this);
				this.addHandlers(set, x, y, width, height, "gateway");
			},
			handlerChains:[],
			addHandlers:function(set, x, y, width, height, type){
				var that=this;
				var contextObject = this.getConextObject();
				var cx = x + width / 2, cy = y + height / 2;
				if (type == "event") {
					var xy=SvgExtUtils.fixedEventXy(x,y);
					cx=xy.x+eventShape.imgWidth/2,cy=xy.y+eventShape.imgHeight/2;
					var rx=eventShape.imgWidth/2-1,ry=eventShape.imgHeight/2-1;
					var border = this.g.ellipse(cx, cy, rx, ry);
					var overlay = this.g.ellipse(cx, cy, rx, ry);
				} else if (type == "gateway") {
					var xy=SvgExtUtils.fixedGatewayXy(x,y);
					x=xy.x+8,y=xy.y+12;
					width=GATEWAY_img.width-14,height=GATEWAY_img.height-14;
					var border = this.g.path("M" + (x - 4) + " " + (y + (height / 2))
							+ "L" + (x + (width / 2)) + " " + (y + height + 4) + "L"
							+ (x + width + 4) + " " + (y + (height / 2)) + "L"
							+ (x + (width / 2)) + " " + (y - 4) + "z");
					var x1=x-1,y1=y-3,width1=width+4,height1=height+4;
					var overlay = this.g.path("M" + (x1 - 4) + " " + (y1 + (height1 / 2))
							+ "L" + (x1 + (width1 / 2)) + " " + (y1 + height1 + 4) + "L"
							+ (x1 + width1 + 4) + " " + (y1 + (height1 / 2)) + "L"
							+ (x1 + (width1 / 2)) + " " + (y1 - 4) + "z");
				} else if (type == "task") {
					var xy=SvgExtUtils.fixedTaskXy(x,y);
					x=xy.x,y=xy.y;
					var border=this.g.circle(x+taskShape.radius, y+taskShape.radius,taskShape.radius);
					var overlay = this.g.circle(x+taskShape.radius, y+taskShape.radius,taskShape.radius);
				}else if(type==="subProcess"){
					var border=this.g.rect(x, y, width, height,5);
					var overlay=this.g.rect(x, y, width, height,5);
				}
				
				border.attr({
					stroke : Color.get(132, 112, 255)/* Color.Tan1 */,
					"stroke-width" : 4,
					opacity : 0.0
				});
				border.id = contextObject.id + "_border";
				
				set.push(border);
				
				overlay.attr(SvgExtUtils.attrs.overlay);
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
				if($.isArray(SvgExt.handlerChains)){
					$.each(SvgExt.handlerChains,function(i,handler){
						var func=handler.func;
						var params=handler.params||{};
						params.overlay=overlay;
						params.overlayMap=params.overlayMap||{};
						func.apply(that,[set, x, y, width, height, type,params]);
					});
				}
			}
	};
}(jQuery));