/*global define*/
'use strict';

define([ 'angular', 'services/services'], function(angular, serviceModule) {
	var metauiTempateService = serviceModule.factory('MetauiTemplate',function($resource) {
			var url=Global.contextPath+'/html_editor/metauitemplate/:id';
			var MetauiTemplate = $resource(url, {}, {
				save:{method:'POST',url:Global.contextPath+'/html_editor/layout_form'}
			});
			return MetauiTemplate;
		});
	return metauiTempateService;

});


