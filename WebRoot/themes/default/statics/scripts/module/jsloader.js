var JSLoader = {
    browser: {
        ie: /msie/.test(window.navigator.userAgent.toLowerCase()),
        moz: /gecko/.test(window.navigator.userAgent.toLowerCase()),
        opera: /opera/.test(window.navigator.userAgent.toLowerCase()),
        safari: /safari/.test(window.navigator.userAgent.toLowerCase())
    },
    call: (function () {
        function hasFile(tag, url) {
            var contains = false;
            var files = document.getElementsByTagName(tag);
            var type = tag == "script" ? "src" : "href";
            for (var i = 0, len = files.length; i < len; i++) {
                if (files[i].getAttribute(type) == url) {
                    contains = true;
                    break;
                }
            }
            return contains;
        };
        function loadFile(element, callback, parent) {
            var p = parent && parent != undefined ? parent : "head";
            document.getElementsByTagName(p)[0].appendChild(element);
            if (callback) {
                //ie
                if (JSLoader.browser.ie) {
                    element.onreadystatechange = function () {
                        if (this.readyState == 'loaded' || this.readyState == 'complete') {
                            callback();
                        }
                    };
                } else if (JSLoader.browser.moz) {
                    element.onload = function () {
                        callback();
                    };
                } else {
                    callback();
                }
            }
        };
        function loadCssFile(files, callback) {
            var urls = files && typeof (files) == "string" ? [files] : files;
            for (var i = 0, len = urls.length; i < len; i++) {
                var cssFile = document.createElement("link");
                cssFile.setAttribute('type', 'text/css');
                cssFile.setAttribute('rel', 'stylesheet');
                cssFile.setAttribute('href', urls[i]);
                if (!hasFile("link", urls[i])) {
                    loadFile(cssFile, callback);
                }
            }
        };
        function loadScript(files, callback, parent) {
            var urls = files && typeof (files) == "string" ? [files] : files;
            for (var i = 0, len = urls.length; i < len; i++) {
                var script = document.createElement("script");
                script.setAttribute('charset', 'utf-8');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('async', 'async');
                script.setAttribute('src', urls[i]);
                if (!hasFile("script", urls[i])) {
                    loadFile(script, callback, parent);
                }
            }
        };
        function includeFile(options) {
            if(options.cssFiles.length===0){
            	loadScript(options.scripts, null, "body");
            }else{
            	//首先加载css
            	loadCssFile(options.cssFiles, function () {
            		//加载页面所需的script
            		loadScript(options.scripts, null, "body");
            	});
            }
        };
        return { include: includeFile };
    })()
};

/*
* 供外部调用接口
* Include({cssFiles:[], scripts:[]})
*/
var Include = function (module) {
	if(!module){return false;}
	var cssFiles=module.cssFiles||[];
	var scripts=module.scripts||[];
	var contextPath=module.contextPath;
	for(var i=0,len=cssFiles.length;i<len;++i){
		var cssFile=cssFiles[i];
		if(!cssFile.startWith("http:")){
			cssFiles[i]=contextPath+cssFile;
		}
	}
	for(var i=0,len=scripts.length;i<len;++i){
		var script=scripts[i];
		if(!script.startWith("http:")){
			scripts[i]=contextPath+script;
		}
	}
	var options={cssFiles:cssFiles,scripts:scripts};
    JSLoader.call.include(options);
};