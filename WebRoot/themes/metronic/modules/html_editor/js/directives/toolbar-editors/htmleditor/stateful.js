;'use strict';

define(["common/eventBase"],function(EventBase){
	var eState={
			disabled:-1,
			enabled:0,
			checked:1
	};
	var Stateful= EventBase.extend({
		state:0,
		stateClass:"",
		
        init:function(){
        	this._super();
        },        
        hasState:function(st){
        	return this.state==st;
        },
        setState:function(st){
        	this.state=st;
        	if(this.state==eState.checked){
        		this.stateClass="btn-inverse";
        	}else if(this.state==eState.disabled){
        		this.stateClass="btn-disabled";
        	}else {
        		this.stateClass="";
        	}
        },        
        isChecked: function (){
            return this.hasState(eState.checked);
        },
        setChecked: function (checked){
        	if(this.isDisabled()){
        		return;
        	}
            if(checked) {
            	if(!this.isChecked()){
            		this.setState(eState.checked);
            	}
            }else{
            	this.setState(eState.enabled);
            }
        },
        isDisabled: function (){
            return this.hasState(eState.disabled);
        },
        setDisabled: function (disabled){
            if (disabled) {
            	if(!this.isDisabled()){
            		this.setState(eState.disabled);
            	}
            }else{
            	this.setState(eState.enabled);
            }
        }
	});	
	return Stateful;
});