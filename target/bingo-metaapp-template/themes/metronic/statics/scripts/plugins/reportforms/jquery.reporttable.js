/**
 * 报表插件：当当前页面滚动到底部时，会自动加载下一页的数据并添加到当前页面后面
 * 
 * init($table,$container,customData):
 * 第一个参数$table会展示数据的表格的jquery对象，
 * 第二个参数$container是容器对象，是滚动条滚动时随之滚动的div的jquery对象，
 * 第三个参数customData是自定义参数的json对象，包括：
 * 	imgAsc：按某个字段正序排序时在该字段旁边显示的小图片，是一个url路径
 * 	imgDesc：按某个字段倒序排序时在该字段旁边显示的小图片，是一个url路径
 *	img：一个图片的dom元素对象，如$("<image src='' style='margin-left:5' class='orderIcon'/>")
 * 	dataUrl:请求数据的url路径
 * 	listSqlKey：传到后端查询数据的sqlKey，后端可以使用动态Sql语句查询数据，通过这个参数确定使用哪一条动态的SQL
 * 	totalSqlKey：传到后端查询总计结果的sqlKey
 * 	orderField：初始化时默认排序的字段
 * 	pageSize：每次请求的记录数
 * init方法会初始化传入的$table，进行初始化数据和事件绑定，要求$table必须有以下的属性
 * 1.必须有<thead></thead>和<tbody></tbody>,
 * 2.在<thead></thead>下有一个<tr></tr>,这个<tr>下的单元格为<th>,即表头。
 * 3.作为表头元素的<th>，需要有一个属性field-name，这个属性的值是该列要显示查询结果的字段名，同时这个属性将用于绑定点击表头排序事件时传给后端的排序属性
 * 4.对于不想支持排序的列，可以加上no-order="true"这个属性，将不会给这个<th>绑定点击排序事件
 * 5.在$table内部，需要一个<script class="templatescript" type="text/x-jquery-tmpl"></script>元素，
 * 		这个元素下写的是jquery template模板，用于渲染从后端取回的数据，如果没有的话，会自动创建一个模板，该模板的字段排序和表头一致
 * 6.totalSqlKey这个参数传给后端后，查出的数据需要展示的话，可以在$container对象内部增加一个任意的dom元素，并且class=".result-total",查询结果会放在替换该dom元素的内部文本
 * 7.如果需要放在表格中，作为统计结果，可以在$table下的<tbody>元素下写如下元素：
 * 		<tr class="result-total-tr"><th colspan="11" >总计</th><td class="result-total"></td></tr>
 * 		注意<tr>元素的class="result-total-tr"不能省略
 * 8.关于这个方法的html文件示例可以看zkungfu-oa/WebRoot/themes/default/modules/reportforms/wfclaimpaymentdetail.html这个文件
 * loadData($table):传入的参数是已经初始化完成的$table元素，改方法将进行一次加载数据并渲染数据的动作，通常用于打开页面时请求第一页的数据
 */
ReportTable = {
		init:function($table,$container,customData){
			$table = $($table);
			var template = $("script.templatescript",$table);
			var scrollContainer = $($container).closest('div.menu-tab-container');
			var url = Global.contextPath + '/reportforms/getData';
			var searchParams = {
					pageIndex:1,
					pageSize:1000,
					nosearch:false,
					orientation:'asc',
					orderField:'deptCode',
					listSqlKey:'reportforms.claimpayment.detail',
					totalSqlKey:'reportforms.claimpayment.detail.total'
					};
			var imgAsc = Global.contextPath + '/statics/scripts/plugins/tablesortable/img/up.gif';
			var imgDesc = Global.contextPath + '/statics/scripts/plugins/tablesortable/img/down.gif';
			var img = $("<image src='' style='margin-left:5' class='orderIcon'/>");
			if(customData){
				imgAsc = customData.imgAsc || imgAsc;
				imgDesc = customData.imgDesc || imgDesc;
				img = customData.img || img;
				url = customData.dataUrl || url;
				searchParams.listSqlKey = customData.listSqlKey || searchParams.listSqlKey;
				searchParams.totalSqlKey = customData.totalSqlKey || searchParams.totalSqlKey;
				searchParams.orderField = customData.orderField || searchParams.orderField;
				searchParams.pageSize = customData.pageSize || searchParams.pageSize;
			}
			img.data("imgAsc",imgAsc);
			img.data("imgDesc",imgDesc);
			$table.data("searchParams",searchParams);
			$table.data("dataUrl",url);
			$table.data("orderImg",img);
			$table.data("container",$($container));
			$table.data("scrollContainer",scrollContainer);
			if(template.length == 1){
				$table.data("template",template);
			}else{
				var ths = $("thead > tr > th",$table);
				var tempTr = $("<tr class='data-row'></tr>");
				$.each(ths,function(key, val){
					tempTr.append("<td>${"+$(val).attr('field-name')+"}</td>");
				});
				var scriptTag = $("<script type='text/x-jquery-tmpl'></script>");
				scriptTag.append(tempTr);
				$table.data("template",scriptTag);
			}
			scrollContainer.scroll(function(){
				if(searchParams.nosearch){
					return;
				}
				if(scrollContainer.height() == ($container.height() - scrollContainer.scrollTop())) {
					$.restPost(url,searchParams,function(res){
						ReportTable.rangeResult(res,$table);
					});
				}
		    });
			$("thead > tr > th",$table).each(function(){
				$(this).css("cursor","pointer");
				$(this).on("click",function(){
					var orderField = $(this).attr("field-name");
					if(!orderField){
						return;
					}
					if($(this).attr("no-order")=='true'){
						return;
					}
					if(searchParams.orderField == orderField){
						if(searchParams.orientation == 'asc'){
							searchParams.orientation = 'desc';
						}else{
							searchParams.orientation = 'asc';
						}
					}else{
						searchParams.orderField = orderField;
						searchParams.orientation = 'asc';
					}
					searchParams.pageIndex = 1;
					searchParams.nosearch = false;
					$.restPost(url,searchParams,function(res){
						var $tbody = $('tbody',$table);
						$(".data-row",$tbody).remove();
						ReportTable.rangeResult(res,$table);
						$("thead > tr > th",$table).each(function(){
							if($(this).attr("field-name") == searchParams.orderField){
								img.attr('src',searchParams.orientation == 'asc'?imgAsc:imgDesc);
								$(this).append(img);
							}
						});
					});
				});
			});
		},
		loadData:function($table){
			var url = $($table).data("dataUrl");
			var searchParams = $table.data("searchParams");
			$.restPost(url,searchParams,function(res){
				ReportTable.rangeResult(res,$table);
			});
		},
		rangeResult:function (res,$table){
			var $tbody = $('tbody',$table);
			var $container = $table.data("container");
			var searchParams = $table.data("searchParams");
			var template = $table.data("template");
			if(res.invos.length != 0){
				searchParams.pageIndex++;
				template.tmpl(res.invos).appendTo($tbody);
				$('.result-total',$container).html(res.total[0].money);
				$('.result-total-tr',$container).appendTo($tbody);
			}else{
				searchParams.nosearch=true;
			}
		}
};