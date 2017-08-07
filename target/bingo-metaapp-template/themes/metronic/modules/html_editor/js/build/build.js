({
    baseUrl: "../",
    paths: {
		underscore:'lib/underscore-min',
		usStrings:'lib/underscore-string',
		angular: 'lib/angular',
		ngResource:'lib/angular-resource',
		ngAnimate:'lib/angular-animate',
		ngSanitize:'lib/angular-sanitize',
		cellPos:"lib/jquery.cellpos"
	},
	shim: {
		usStrings:{
			exports:'usStrings',
			deps:['underscore']
		},
		angular: {
			exports: 'angular'
		},
		ngResource:{
			exports:'$resource',
			deps: ['angular']
		},
		ngAnimate:{
			exports:'ngAnimate',
			deps: ['angular']
		},
		ngSanitize:{
			exports:'ngSanitize',
			deps: ['angular']
		}
	},
	//wrap: true,
	optimize:"uglify2",
	uglify2: {
        mangle: false
    },
	findNestedDependencies:true,
	name:"main",
    out: "../main-built.js"
})