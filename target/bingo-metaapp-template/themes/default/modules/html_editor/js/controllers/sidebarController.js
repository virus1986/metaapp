/**
 * 依赖的定义
 * 所属module
 * 依赖的Services
 */
define(['angular',"controllers/controllers","services/sidebarItems","directives/pdNavListToggle"],function(angular,ctrlModule){	

	var sidebarController = ctrlModule.controller('sideBarController', [
		'$scope','$sce', "sidebarItems", function($scope,$sce, sidebarItems) {
			$scope.data = "sidebar";
			$scope.menuMini = false;
			$scope.items = sidebarItems.getItems();
			$scope.trustSnippet = function(snippet) {
				return $sce.trustAsHtml(snippet);
			};
			$scope.collapse=function(){
				$scope.menuMini=!$scope.menuMini;
				window.pd.refreshFocus();
			};
		} ]);
	return sidebarController;
});
