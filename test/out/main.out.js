/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	var angular=window.angular,ngModule;
	try {ngModule=angular.module(["appModule"])}
	catch(e){ngModule=angular.module("appModule",[])}
	var v1="\n<div class=\"view\">\n        <p>...</p>\n    </div>\n";
	var id1="myAnotherTemplate";
	var inj=angular.element(window.document).injector();
	if(inj){inj.get("$templateCache").put(id1,v1);}
	else{ngModule.run(["$templateCache",function(c){c.put(id1,v1)}]);}
	var v2="\n<div class=\"view\">\n        <h2>First View</h2>\n        <p>\n            Search:<input type=\"text\" ng-model=\"filterText\" />\n        </p>\n    </div>\n";
	var id2="myTemplate";
	var inj=angular.element(window.document).injector();
	if(inj){inj.get("$templateCache").put(id2,v2);}
	else{ngModule.run(["$templateCache",function(c){c.put(id2,v2)}]);}
	var v3="\n<div class=\"view\">\n<h2>Second View</h2>\n<p>About me</p>\n</div>\n\n<div class=\"view\">\n<h2>Second View</h2>\n<p>About you</p>\n</div>\n\n<div class=\"view\"></div>\n";
	var id3="grot/merqlove/ng-cache-loader/tmpl/template.tpl";
	var inj=angular.element(window.document).injector();
	if(inj){inj.get("$templateCache").put(id3,v3);}
	else{ngModule.run(["$templateCache",function(c){c.put(id3,v3)}]);}
	module.exports=v3;

/***/ }
/******/ ]);