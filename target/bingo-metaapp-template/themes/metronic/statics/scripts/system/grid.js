define(["require"],function(require){
	return {
		editRecord:function(send,grid){
			grid.jqGrid().editRecord();
		}
	}
});