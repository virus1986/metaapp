var ActivitiRest = {
	options : {},
	getProcessDefinitionByKey : function(processDefinitionKey, callback) {
		var url = this.options.processDefinitionByKeyUrl + "?flowKey="
				+ processDefinitionKey;

		$.ajax(
				{
					url : url,
					dataType : 'json',
					type : 'POST',
					contentType : "application/json",
					data : "{}",
					cache : false,
					async : true,
					success : function(data, textStatus) {
						var processDefinition = data.processDefinition;
						if (!processDefinition) {
							console.error("Process definition '"
									+ processDefinitionKey + "' not found");
						} else if (data.errors && data.errors.length > 0) {
							for ( var i = 0; i < data.errors.length; i++) {
								var e = data.errors[i];
								console.error(e.message);
							}
						} else {
							callback(processDefinition.id);
						}
					},
					complete : function(data, textStatus) {
						console.log("ajax complete: " + textStatus);

					}
				}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(
				function(jqXHR, textStatus, error) {
					console.error('Get diagram layout[' + processDefinitionKey
							+ '] failure: ', textStatus, 'error: ', error,
							jqXHR);
				});
	},
	
	getProcessDefinitionByInstanceId : function(processInstanceId, callback) {
		var url = this.options.processDefinitionUrl + "?instId="
				+ processInstanceId;

		$.ajax(
				{
					url : url,
					dataType : 'json',
					contentType : "application/json",
					data : "{}",
					type : 'POST',
					cache : false,
					async : true,
					success : function(data, textStatus) {
						var retResult = data;
						if (!retResult) {
							console.error("Process definition diagram layout '"
									+ processInstanceId + "' not found");
							return;
						} else if (data.errors && data.errors.length > 0) {
							for ( var i = 0; i < data.errors.length; i++) {
								var e = data.errors[i];
								console.error(e.message);
							}
						} else {
							callback(retResult);
						}
					},
					complete : function(data, textStatus) {
						console.log("ajax complete: " + textStatus);

					}
				}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(
				function(jqXHR, textStatus, error) {
					console.log('Get diagram layout[' + processInstanceId
							+ '] failure: ', textStatus, jqXHR);
				});
	},
	
	getProcessDefinition : function(processDefinitionId, callback) {
		var url = this.options.processDefinitionUrl + "?flowId="
				+ processDefinitionId;

		$.ajax(
				{
					url : url,
					dataType : 'json',
					contentType : "application/json",
					data : "{}",
					type : 'POST',
					cache : false,
					async : true,
					success : function(data, textStatus) {
						var retResult = data;
						if (!retResult) {
							console.error("Process definition diagram layout '"
									+ processDefinitionId + "' not found");
							return;
						} else if (data.errors && data.errors.length > 0) {
							for ( var i = 0; i < data.errors.length; i++) {
								var e = data.errors[i];
								console.error(e.message);
							}
						} else {
							callback(retResult);
						}
					},
					complete : function(data, textStatus) {
						console.log("ajax complete: " + textStatus);

					}
				}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(
				function(jqXHR, textStatus, error) {
					console.log('Get diagram layout[' + processDefinitionId
							+ '] failure: ', textStatus, jqXHR);
				});
	},

	getHighLights : function(processInstanceId, callback) {
		var url = this.options.processInstanceHighLightsUrl + "?instId="
				+ processInstanceId;

		$.ajax({
			url : url,
			dataType : 'json',
			contentType : "application/json",
			data : "{}",
			type : 'POST',
			cache : false,
			async : true,
			success : function(data, textStatus) {
				console.log("ajax returned data");
				var highLights = data;
				if (!highLights) {
					console.log("highLights not found");
					return;
				} else {
					callback.apply(highLights);
				}
			},
			complete : function(data, textStatus) {
				console.log("ajax complete: " + textStatus);

			}
		}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(
				function(jqXHR, textStatus, error) {
					console.log('Get HighLights[' + processInstanceId
							+ '] failure: ', textStatus, jqXHR);
				});
	}
};