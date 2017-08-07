/*global define*/
'use strict';

define([ 'angular', 'services/services'], function(angular, serviceModule) {
	var metauiTempateService = serviceModule.factory('MetauiTemplate',function($resource) {
			var url=Global.contextPath+'/html_editor/metauitemplate/:id';
			var postUrl=Global.contextPath+'/html_editor/layout_form';
			if(Global.publish=="1"){
				postUrl=Global.contextPath+'/html_editor/layout_form?publish=1'
			}
			var MetauiTemplate = $resource(url, {}, {
				save:{method:'POST',url:postUrl}
			});
			return MetauiTemplate;
		});
	return metauiTempateService;

});


