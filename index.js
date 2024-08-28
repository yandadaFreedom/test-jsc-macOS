/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@mpxjs/api-proxy/src/common/js/promisify.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");


// 特别指定的不进行Promise封装的方法
var blackList = ['clearStorage', 'hideToast', 'hideLoading', 'drawCanvas', 'canIUse', 'stopRecord', 'pauseVoice', 'stopVoice', 'pauseBackgroundAudio', 'stopBackgroundAudio', 'showNavigationBarLoading', 'hideNavigationBarLoading', 'createAnimation', 'createAnimationVideo', 'createSelectorQuery', 'createIntersectionObserver', 'getPerformance', 'hideKeyboard', 'stopPullDownRefresh', 'createWorker', 'pageScrollTo', 'reportAnalytics', 'getMenuButtonBoundingClientRect', 'reportMonitor', 'createOffscreenCanvas', 'reportEvent', 'connectSocket', 'base64ToArrayBuffer'];
function getMapFromList(list) {
  if (list && list.length) {
    var map = {};
    list.forEach(function (item) {
      map[item] = true;
    });
    return map;
  }
}
function promisify(listObj, whiteList, customBlackList) {
  var result = {};
  var whiteListMap = getMapFromList(whiteList);
  var blackListMap = getMapFromList(blackList.concat(customBlackList));
  function promisifyFilter(key) {
    if (whiteListMap && whiteListMap[key] !== undefined) {
      return !!whiteListMap[key];
    } else {
      return !(blackListMap[key] ||
      // 特别指定的方法
      /^get\w*Manager$/.test(key) ||
      // 获取manager的api
      /^create\w*Context$/.test(key) ||
      // 创建上下文相关api
      /^(on|off)/.test(key) ||
      // 以 on* 或 off开头的方法
      /\w+Sync$/.test(key) // 以Sync结尾的方法
      );
    }
  }
  Object.keys(listObj).forEach(function (key) {
    if (typeof listObj[key] !== 'function') {
      return;
    }
    result[key] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var obj = args[0] || {};
      // 不需要转换 or 用户已定义回调，则不处理
      if (!promisifyFilter(key) || obj.success || obj.fail) {
        return listObj[key].apply(_utils__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ, args);
      } else {
        // 其他情况进行转换
        if (!args[0]) args.unshift(obj);
        var returned;
        var promise = new Promise(function (resolve, reject) {
          obj.success = resolve;
          obj.fail = reject;
          returned = listObj[key].apply(_utils__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ, args);
        });
        promise.__returned = returned;
        return promise;
      }
    };
  });
  return result;
}
/* harmony default export */ __webpack_exports__["default"] = (promisify);

/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/common/js/utils.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ENV_OBJ: function() { return /* binding */ ENV_OBJ; },
/* harmony export */   changeOpts: function() { return /* binding */ changeOpts; },
/* harmony export */   defineUnsupportedProps: function() { return /* binding */ defineUnsupportedProps; },
/* harmony export */   envError: function() { return /* binding */ envError; },
/* harmony export */   error: function() { return /* binding */ error; },
/* harmony export */   handleSuccess: function() { return /* binding */ handleSuccess; },
/* harmony export */   isBrowser: function() { return /* binding */ isBrowser; },
/* harmony export */   throwSSRWarning: function() { return /* binding */ throwSSRWarning; },
/* harmony export */   warn: function() { return /* binding */ warn; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
var _this2 = undefined;


/**
 *
 * @param {Object} options 原参数
 * @param {Object} updateOrRemoveOpt 要修改或者删除的参数
 * @param {Object} extraOpt 额外增加的参数
 * @returns {Object} 返回参数
 * @example
 * changeOpts({ a: 1, b: 2 }, {
 *  a: 'c', // a 变为 c
 *  b: '' // 删除 b
 * }, {
 *  d: 4 // 增加 d
 * })
 */
function changeOpts(options) {
  var updateOrRemoveOpt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var extraOpt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var opts = {};
  Object.keys(options).forEach(function (key) {
    var myKey = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(updateOrRemoveOpt, key) ? updateOrRemoveOpt[key] : key;
    if (myKey !== '') {
      opts[myKey] = options[key];
    }
  });
  opts = Object.assign({}, opts, extraOpt);
  return opts;
}

/**
 * @param {Object} opts 原参数
 * @param {Function} getOptions 获取 success 回调修改后的参数
 * @param {Object} thisObj this对象
 */
var handleSuccess = function handleSuccess(opts) {
  var getOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.noop;
  var thisObj = arguments.length > 2 ? arguments[2] : undefined;
  if (!opts.success) {
    return;
  }
  var _this = thisObj || _this2;
  var cacheSuc = opts.success;
  opts.success = function (res) {
    var changedRes = getOptions(res) || res;
    cacheSuc.call(_this, changedRes);
  };
};
function warn(msg) {
  console.warn && console.warn("[@mpxjs/api-proxy warn]:\n ".concat(msg));
}
function error(msg) {
  console.error && console.error("[@mpxjs/api-proxy error]:\n ".concat(msg));
}
function envError(method) {
  return function () {
    throw Error("[@mpxjs/api-proxy error]:\n ".concat("ios", "\u73AF\u5883\u4E0D\u652F\u6301").concat(method, "\u65B9\u6CD5"));
  };
}
function defineUnsupportedProps(resObj, props) {
  var defineProps = {};
  props.forEach(function (item) {
    defineProps[item] = {
      get: function get() {
        warn("The ".concat(item, " attribute is not supported in ").concat("ios", " environment"));
        return null;
      }
    };
  });
  Object.defineProperties(resObj, defineProps);
}
var isBrowser = typeof window !== 'undefined';
function throwSSRWarning(info) {
  console.error("[Mpx runtime error]: Dangerous API! ".concat(info, ", It may cause some problems, please use this method with caution"));
}
var ENV_OBJ = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getEnvObj)();


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/common/js/web.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindTap: function() { return /* binding */ bindTap; },
/* harmony export */   createDom: function() { return /* binding */ createDom; },
/* harmony export */   getRootElement: function() { return /* binding */ getRootElement; },
/* harmony export */   isTabBarPage: function() { return /* binding */ isTabBarPage; },
/* harmony export */   webHandleFail: function() { return /* binding */ webHandleFail; },
/* harmony export */   webHandleSuccess: function() { return /* binding */ webHandleSuccess; }
/* harmony export */ });
function webHandleSuccess(result, success, complete) {
  typeof success === 'function' && success(result);
  typeof complete === 'function' && complete(result);
}
function webHandleFail(result, fail, complete) {
  typeof fail === 'function' && fail(result);
  typeof complete === 'function' && complete(result);
}
function isTabBarPage(url, router) {
  var tabBarPagesMap = __webpack_require__.g.__tabBarPagesMap;
  if (!tabBarPagesMap || !url) return false;
  var path = router.match(url, router.history.current).path;
  return !!tabBarPagesMap[path.slice(1)];
}

/**
 * Creates a new DOM element with the specified tag, attributes, and children.
 *
 * @param {string} tag - The tag name of the new element.
 * @param {Object.<string, string>} [attrs={}] - An object containing the attributes to set on the new element.
 * @param {Array.<HTMLElement>} [children=[]] - An array of child elements to append to the new element.
 * @returns {HTMLElement} The newly created DOM element.
 */
function createDom(tag) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var dom = document.createElement(tag);
  Object.keys(attrs).forEach(function (k) {
    return dom.setAttribute(k, attrs[k]);
  });
  children.length && children.forEach(function (child) {
    return dom.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return dom;
}

// 在H5中，直接绑定 click 可能出现延时问题，很多点击可以关闭的组件被唤出之后，有概率立马触发点击事件，导致组件被关闭。
// 使用该方法通过 touchstart 和 touchend 模拟 click 事件，解决延时问题。
function bindTap(dom, handler) {
  dom.addEventListener('tap', handler);
  return function () {
    dom.removeEventListener('tap', handler);
  };
}

/**
 * 获取弹窗应当挂载的根节点
 * @returns dom
 */
function getRootElement() {
  var _getCurrentPages$slic;
  var page = (_getCurrentPages$slic = getCurrentPages().slice(-1)[0]) === null || _getCurrentPages$slic === void 0 ? void 0 : _getCurrentPages$slic.$el;
  return page || document.body;
}


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addPhoneContact: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.addPhoneContact; },
/* harmony export */   arrayBufferToBase64: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.arrayBufferToBase64; },
/* harmony export */   base64ToArrayBuffer: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.base64ToArrayBuffer; },
/* harmony export */   canvasGetImageData: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.canvasGetImageData; },
/* harmony export */   canvasToTempFilePath: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.canvasToTempFilePath; },
/* harmony export */   checkSession: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.checkSession; },
/* harmony export */   clearStorage: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.clearStorage; },
/* harmony export */   clearStorageSync: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.clearStorageSync; },
/* harmony export */   closeBLEConnection: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.closeBLEConnection; },
/* harmony export */   closeSocket: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.closeSocket; },
/* harmony export */   compressImage: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.compressImage; },
/* harmony export */   connectSocket: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.connectSocket; },
/* harmony export */   createAnimation: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.createAnimation; },
/* harmony export */   createBLEConnection: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.createBLEConnection; },
/* harmony export */   createInnerAudioContext: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.createInnerAudioContext; },
/* harmony export */   createIntersectionObserver: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.createIntersectionObserver; },
/* harmony export */   createSelectorQuery: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.createSelectorQuery; },
/* harmony export */   createVideoContext: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.createVideoContext; },
/* harmony export */   downloadFile: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.downloadFile; },
/* harmony export */   getClipboardData: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getClipboardData; },
/* harmony export */   getDeviceInfo: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getDeviceInfo; },
/* harmony export */   getEnterOptionsSync: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getEnterOptionsSync; },
/* harmony export */   getNetworkType: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getNetworkType; },
/* harmony export */   getProxy: function() { return /* reexport safe */ _install__WEBPACK_IMPORTED_MODULE_1__.getProxy; },
/* harmony export */   getScreenBrightness: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getScreenBrightness; },
/* harmony export */   getStorage: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getStorage; },
/* harmony export */   getStorageInfo: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getStorageInfo; },
/* harmony export */   getStorageInfoSync: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getStorageInfoSync; },
/* harmony export */   getStorageSync: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getStorageSync; },
/* harmony export */   getSystemInfo: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getSystemInfo; },
/* harmony export */   getSystemInfoSync: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getSystemInfoSync; },
/* harmony export */   getUserInfo: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getUserInfo; },
/* harmony export */   getWindowInfo: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.getWindowInfo; },
/* harmony export */   hideLoading: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.hideLoading; },
/* harmony export */   hideTabBar: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.hideTabBar; },
/* harmony export */   hideToast: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.hideToast; },
/* harmony export */   login: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.login; },
/* harmony export */   makePhoneCall: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.makePhoneCall; },
/* harmony export */   navigateBack: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.navigateBack; },
/* harmony export */   navigateTo: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.navigateTo; },
/* harmony export */   nextTick: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.nextTick; },
/* harmony export */   offAppHide: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.offAppHide; },
/* harmony export */   offAppShow: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.offAppShow; },
/* harmony export */   offError: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.offError; },
/* harmony export */   offNetworkStatusChange: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.offNetworkStatusChange; },
/* harmony export */   offWindowResize: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.offWindowResize; },
/* harmony export */   onAppHide: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.onAppHide; },
/* harmony export */   onAppShow: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.onAppShow; },
/* harmony export */   onBLEConnectionStateChange: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.onBLEConnectionStateChange; },
/* harmony export */   onError: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.onError; },
/* harmony export */   onNetworkStatusChange: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.onNetworkStatusChange; },
/* harmony export */   onSocketClose: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.onSocketClose; },
/* harmony export */   onSocketError: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.onSocketError; },
/* harmony export */   onSocketMessage: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.onSocketMessage; },
/* harmony export */   onSocketOpen: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.onSocketOpen; },
/* harmony export */   onWindowResize: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.onWindowResize; },
/* harmony export */   pageScrollTo: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.pageScrollTo; },
/* harmony export */   previewImage: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.previewImage; },
/* harmony export */   promisify: function() { return /* reexport safe */ _common_js_promisify__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   reLaunch: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.reLaunch; },
/* harmony export */   redirectTo: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.redirectTo; },
/* harmony export */   removeStorage: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.removeStorage; },
/* harmony export */   removeStorageSync: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.removeStorageSync; },
/* harmony export */   request: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.request; },
/* harmony export */   requestPayment: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.requestPayment; },
/* harmony export */   scanCode: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.scanCode; },
/* harmony export */   sendSocketMessage: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.sendSocketMessage; },
/* harmony export */   setClipboardData: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.setClipboardData; },
/* harmony export */   setNavigationBarColor: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.setNavigationBarColor; },
/* harmony export */   setNavigationBarTitle: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.setNavigationBarTitle; },
/* harmony export */   setScreenBrightness: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.setScreenBrightness; },
/* harmony export */   setStorage: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.setStorage; },
/* harmony export */   setStorageSync: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.setStorageSync; },
/* harmony export */   setTabBarItem: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.setTabBarItem; },
/* harmony export */   setTabBarStyle: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.setTabBarStyle; },
/* harmony export */   showActionSheet: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.showActionSheet; },
/* harmony export */   showLoading: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.showLoading; },
/* harmony export */   showModal: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.showModal; },
/* harmony export */   showTabBar: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.showTabBar; },
/* harmony export */   showToast: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.showToast; },
/* harmony export */   startPullDownRefresh: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.startPullDownRefresh; },
/* harmony export */   stopPullDownRefresh: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.stopPullDownRefresh; },
/* harmony export */   switchTab: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.switchTab; },
/* harmony export */   uploadFile: function() { return /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.uploadFile; }
/* harmony export */ });
/* harmony import */ var _install__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/install.js");
/* harmony import */ var _common_js_promisify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/promisify.js");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/index.js");




/* harmony default export */ __webpack_exports__["default"] = (_install__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/install.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ install; },
/* harmony export */   getProxy: function() { return /* binding */ getProxy; }
/* harmony export */ });
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/index.js");
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");
/* harmony import */ var _common_js_promisify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/promisify.js");



function install(target) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$usePromise = options.usePromise,
    usePromise = _options$usePromise === void 0 ? false : _options$usePromise,
    _options$whiteList = options.whiteList,
    whiteList = _options$whiteList === void 0 ? [] : _options$whiteList,
    _options$blackList = options.blackList,
    blackList = _options$blackList === void 0 ? [] : _options$blackList,
    _options$custom = options.custom,
    custom = _options$custom === void 0 ? {} : _options$custom;
  var transedApi = Object.assign({}, _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ, _platform__WEBPACK_IMPORTED_MODULE_1__);
  var promisedApi = usePromise ? (0,_common_js_promisify__WEBPACK_IMPORTED_MODULE_2__["default"])(transedApi, whiteList, blackList) : {};
  Object.assign(target, transedApi, promisedApi, custom["ios"]);
}
function getProxy() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var apiProxy = {};
  install(apiProxy, options);
  return apiProxy;
}

/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/action-sheet/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   showActionSheet: function() { return /* binding */ showActionSheet; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var showActionSheet = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.showActionSheet || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('showActionSheet');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/add-phone-contact/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addPhoneContact: function() { return /* binding */ addPhoneContact; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var addPhoneContact = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.addPhoneContact || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('addPhoneContact');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/animation/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAnimation: function() { return /* binding */ createAnimation; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var createAnimation = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.createAnimation || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('createAnimation');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/app/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   offAppHide: function() { return /* binding */ offAppHide; },
/* harmony export */   offAppShow: function() { return /* binding */ offAppShow; },
/* harmony export */   offError: function() { return /* binding */ offError; },
/* harmony export */   onAppHide: function() { return /* binding */ onAppHide; },
/* harmony export */   onAppShow: function() { return /* binding */ onAppShow; },
/* harmony export */   onError: function() { return /* binding */ onError; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var onError = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.onError || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('onError');
var offError = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.offError || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('offError');
var onAppShow = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.onAppShow || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('onAppShow');
var offAppShow = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.offAppShow || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('offAppShow');
var onAppHide = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.onAppHide || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('onAppHide');
var offAppHide = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.offAppHide || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('offAppHide');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/audio/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createInnerAudioContext: function() { return /* binding */ createInnerAudioContext; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var createInnerAudioContext = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.createInnerAudioContext || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('createInnerAudioContext');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/base/base64.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   byteLength: function() { return /* binding */ byteLength; },
/* harmony export */   fromByteArray: function() { return /* binding */ fromByteArray; },
/* harmony export */   toByteArray: function() { return /* binding */ toByteArray; }
/* harmony export */ });
// fork base64-js@1.3.1
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}

// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;
  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var _i = start; _i < end; _i += 3) {
    tmp = (uint8[_i] << 16 & 0xFF0000) + (uint8[_i + 1] << 8 & 0xFF00) + (uint8[_i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var _i2 = 0, len2 = len - extraBytes; _i2 < len2; _i2 += maxChunkLength) {
    parts.push(encodeChunk(uint8, _i2, _i2 + maxChunkLength > len2 ? len2 : _i2 + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }
  return parts.join('');
}


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/base/index.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayBufferToBase64: function() { return /* reexport safe */ _index_web__WEBPACK_IMPORTED_MODULE_0__.arrayBufferToBase64; },
/* harmony export */   base64ToArrayBuffer: function() { return /* reexport safe */ _index_web__WEBPACK_IMPORTED_MODULE_0__.base64ToArrayBuffer; }
/* harmony export */ });
/* harmony import */ var _index_web__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/base/index.web.js");


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/base/index.web.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayBufferToBase64: function() { return /* binding */ arrayBufferToBase64; },
/* harmony export */   base64ToArrayBuffer: function() { return /* binding */ base64ToArrayBuffer; }
/* harmony export */ });
/* harmony import */ var _base64__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/base/base64.js");

function base64ToArrayBuffer(base64) {
  var _toByteArray;
  return (_toByteArray = (0,_base64__WEBPACK_IMPORTED_MODULE_0__.toByteArray)(base64)) === null || _toByteArray === void 0 ? void 0 : _toByteArray.buffer;
}
function arrayBufferToBase64(arrayBuffer) {
  return (0,_base64__WEBPACK_IMPORTED_MODULE_0__.fromByteArray)(arrayBuffer);
}


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/ble-connection/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeBLEConnection: function() { return /* binding */ closeBLEConnection; },
/* harmony export */   createBLEConnection: function() { return /* binding */ createBLEConnection; },
/* harmony export */   onBLEConnectionStateChange: function() { return /* binding */ onBLEConnectionStateChange; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var closeBLEConnection = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.closeBLEConnection || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('closeBLEConnection');
var createBLEConnection = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.createBLEConnection || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('createBLEConnection');
var onBLEConnectionStateChange = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.onBLEConnectionStateChange || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('onBLEConnectionStateChange');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/canvas/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canvasGetImageData: function() { return /* binding */ canvasGetImageData; },
/* harmony export */   canvasToTempFilePath: function() { return /* binding */ canvasToTempFilePath; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var canvasToTempFilePath = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.canvasToTempFilePath || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('canvasToTempFilePath');
var canvasGetImageData = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.canvasGetImageData || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('canvasGetImageData');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/check-session/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkSession: function() { return /* binding */ checkSession; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var checkSession = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.checkSession || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('checkSession');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/clipboard-data/index.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getClipboardData: function() { return /* reexport safe */ _rnClipboard__WEBPACK_IMPORTED_MODULE_0__.getClipboardData; },
/* harmony export */   setClipboardData: function() { return /* reexport safe */ _rnClipboard__WEBPACK_IMPORTED_MODULE_0__.setClipboardData; }
/* harmony export */ });
/* harmony import */ var _rnClipboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/clipboard-data/rnClipboard.js");


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/clipboard-data/rnClipboard.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getClipboardData: function() { return /* binding */ getClipboardData; },
/* harmony export */   setClipboardData: function() { return /* binding */ setClipboardData; }
/* harmony export */ });
/* harmony import */ var _react_native_clipboard_clipboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("@react-native-clipboard/clipboard");
/* harmony import */ var _react_native_clipboard_clipboard__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_react_native_clipboard_clipboard__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_js_web__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/web.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");



var setClipboardData = function setClipboardData(options) {
  var data = options.data,
    success = options.success,
    fail = options.fail,
    complete = options.complete;
  if (!data || (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_1__.type)(data) !== 'String') {
    var errStr = !data ? 'parameter.data should be String instead of Undefined;' : "parameter.data should be String instead of ".concat((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_1__.type)(data), ";");
    var _result = {
      errno: 1001,
      errMsg: errStr
    };
    (0,_common_js_web__WEBPACK_IMPORTED_MODULE_2__.webHandleFail)(_result, fail, complete);
    return;
  }
  _react_native_clipboard_clipboard__WEBPACK_IMPORTED_MODULE_0___default().setString(data);
  var result = {
    errMsg: 'setClipboardData:ok'
  };
  (0,_common_js_web__WEBPACK_IMPORTED_MODULE_2__.webHandleSuccess)(result, success, complete);
};
var getClipboardData = function getClipboardData(options) {
  var success = options.success,
    fail = options.fail,
    complete = options.complete;
  _react_native_clipboard_clipboard__WEBPACK_IMPORTED_MODULE_0___default().getString().then(function (data) {
    var result = {
      data: data,
      errMsg: 'getClipboardData:ok'
    };
    (0,_common_js_web__WEBPACK_IMPORTED_MODULE_2__.webHandleSuccess)(result, success, complete);
  }).catch(function () {
    var result = {
      errMsg: 'setClipboardData:fail'
    };
    (0,_common_js_web__WEBPACK_IMPORTED_MODULE_2__.webHandleFail)(result, fail, complete);
  });
};


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/create-intersection-observer/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createIntersectionObserver: function() { return /* binding */ createIntersectionObserver; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var createIntersectionObserver = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.createIntersectionObserver || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('createIntersectionObserver');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/create-selector-query/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSelectorQuery: function() { return /* binding */ createSelectorQuery; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var createSelectorQuery = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.createSelectorQuery || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('createSelectorQuery');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/device/network/index.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getNetworkType: function() { return /* reexport safe */ _rnNetwork__WEBPACK_IMPORTED_MODULE_0__.getNetworkType; },
/* harmony export */   offNetworkStatusChange: function() { return /* reexport safe */ _rnNetwork__WEBPACK_IMPORTED_MODULE_0__.offNetworkStatusChange; },
/* harmony export */   onNetworkStatusChange: function() { return /* reexport safe */ _rnNetwork__WEBPACK_IMPORTED_MODULE_0__.onNetworkStatusChange; }
/* harmony export */ });
/* harmony import */ var _rnNetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/device/network/rnNetwork.js");


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/device/network/rnNetwork.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getNetworkType: function() { return /* binding */ getNetworkType; },
/* harmony export */   offNetworkStatusChange: function() { return /* binding */ offNetworkStatusChange; },
/* harmony export */   onNetworkStatusChange: function() { return /* binding */ onNetworkStatusChange; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/web.js");
/* harmony import */ var _react_native_community_netinfo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("@react-native-community/netinfo");
/* harmony import */ var _react_native_community_netinfo__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_react_native_community_netinfo__WEBPACK_IMPORTED_MODULE_0__);


var _unsubscribe = null;
var _callbacks = new Set();
var getConnectionType = function getConnectionType(connectionInfo) {
  var type = 'unknown';
  if (connectionInfo.type === _react_native_community_netinfo__WEBPACK_IMPORTED_MODULE_0__.NetInfoStateType.cellular && connectionInfo.details.cellularGeneration) {
    type = connectionInfo.details.cellularGeneration;
  } else if (connectionInfo.type === _react_native_community_netinfo__WEBPACK_IMPORTED_MODULE_0__.NetInfoStateType.wifi || connectionInfo.type === _react_native_community_netinfo__WEBPACK_IMPORTED_MODULE_0__.NetInfoStateType.none) {
    type = connectionInfo.type;
  }
  return type;
};
var getNetworkType = function getNetworkType(options) {
  var success = options.success,
    fail = options.fail,
    complete = options.complete;
  _react_native_community_netinfo__WEBPACK_IMPORTED_MODULE_0___default().fetch().then(function (connectionInfo) {
    var result = {
      networkType: getConnectionType(connectionInfo),
      errMsg: 'getNetworkType:ok'
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.defineUnsupportedProps)(result, ['signalStrength', 'hasSystemProxy']);
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleSuccess)(result, success, complete);
  }).catch(function (err) {
    var result = {
      errMsg: err.message
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleFail)(result, fail, complete);
  });
};
var onNetworkStatusChange = function onNetworkStatusChange(callback) {
  _callbacks.add(callback);
  if (!_unsubscribe) {
    _unsubscribe = _react_native_community_netinfo__WEBPACK_IMPORTED_MODULE_0___default().addEventListener(function (connectionInfo) {
      _callbacks.forEach(function (cb) {
        var isConnected = connectionInfo.isConnected;
        // eslint-disable-next-line node/no-callback-literal
        cb && cb({
          isConnected: isConnected,
          networkType: getConnectionType(connectionInfo)
        });
      });
    });
  }
};
var offNetworkStatusChange = function offNetworkStatusChange(callback) {
  if (callback && typeof callback === 'function') {
    _callbacks.delete(callback);
  } else if (callback === undefined) {
    _callbacks.clear();
    _unsubscribe && _unsubscribe();
    _unsubscribe = null;
  }
};


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/file/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   downloadFile: function() { return /* binding */ downloadFile; },
/* harmony export */   uploadFile: function() { return /* binding */ uploadFile; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var downloadFile = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.downloadFile || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('downloadFile');
var uploadFile = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.uploadFile || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('uploadFile');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/get-user-info/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getUserInfo: function() { return /* binding */ getUserInfo; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var getUserInfo = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.getUserInfo || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('getUserInfo');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/image/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compressImage: function() { return /* binding */ compressImage; },
/* harmony export */   previewImage: function() { return /* binding */ previewImage; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var previewImage = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.previewImage || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('previewImage');
var compressImage = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.compressImage || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('compressImage');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/lifecycle/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getEnterOptionsSync: function() { return /* binding */ getEnterOptionsSync; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var getEnterOptionsSync = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.getEnterOptionsSync || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('getEnterOptionsSync');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/login/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   login: function() { return /* binding */ login; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var login = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.login || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('login');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/make-phone-call/index.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makePhoneCall: function() { return /* reexport safe */ _rnMakePhone__WEBPACK_IMPORTED_MODULE_0__.makePhoneCall; }
/* harmony export */ });
/* harmony import */ var _rnMakePhone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/make-phone-call/rnMakePhone.js");


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/make-phone-call/rnMakePhone.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makePhoneCall: function() { return /* binding */ makePhoneCall; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/web.js");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react-native");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_native__WEBPACK_IMPORTED_MODULE_0__);


var makePhoneCall = function makePhoneCall(options) {
  var _options$phoneNumber = options.phoneNumber,
    phoneNumber = _options$phoneNumber === void 0 ? '' : _options$phoneNumber,
    _options$success = options.success,
    success = _options$success === void 0 ? null : _options$success,
    _options$fail = options.fail,
    fail = _options$fail === void 0 ? null : _options$fail,
    _options$complete = options.complete,
    complete = _options$complete === void 0 ? null : _options$complete;
  react_native__WEBPACK_IMPORTED_MODULE_0__.Linking.openURL("tel:".concat(phoneNumber)).then(function () {
    var result = {
      errMsg: 'makePhoneCall:ok'
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleSuccess)(result, success, complete);
  }).catch(function () {
    var result = {
      errMsg: 'makePhoneCall:fail cancel'
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleFail)(result, fail, complete);
  });
};


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/modal/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   showModal: function() { return /* binding */ showModal; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var showModal = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.showModal || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('showModal');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/next-tick/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nextTick: function() { return /* binding */ nextTick; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var nextTick = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.nextTick || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('nextTick');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/page-scroll-to/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pageScrollTo: function() { return /* binding */ pageScrollTo; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var pageScrollTo = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.pageScrollTo || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('pageScrollTo');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/pull-down/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   startPullDownRefresh: function() { return /* binding */ startPullDownRefresh; },
/* harmony export */   stopPullDownRefresh: function() { return /* binding */ stopPullDownRefresh; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var stopPullDownRefresh = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.stopPullDownRefresh || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('stopPullDownRefresh');
var startPullDownRefresh = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.startPullDownRefresh || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('startPullDownRefresh');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/request-payment/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   requestPayment: function() { return /* binding */ requestPayment; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var requestPayment = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.requestPayment || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('requestPayment');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/request/RequestTask.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var RequestTask = /*#__PURE__*/function () {
  function RequestTask(abortCb) {
    _classCallCheck(this, RequestTask);
    this._abortCb = abortCb;
  }
  return _createClass(RequestTask, [{
    key: "abort",
    value: function abort() {
      if (typeof this._abortCb === 'function') {
        this._abortCb();
      }
    }
  }]);
}();
/* harmony default export */ __webpack_exports__["default"] = (RequestTask);

/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/request/index.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   request: function() { return /* reexport safe */ _index_web__WEBPACK_IMPORTED_MODULE_0__.request; }
/* harmony export */ });
/* harmony import */ var _index_web__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/request/index.web.js");


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/request/index.web.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   request: function() { return /* binding */ request; }
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/axios.js");
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/web.js");
/* harmony import */ var _RequestTask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/request/RequestTask.js");



function request() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    url: ''
  };
  var CancelToken = axios__WEBPACK_IMPORTED_MODULE_0__["default"].CancelToken;
  var source = CancelToken.source();
  var requestTask = new _RequestTask__WEBPACK_IMPORTED_MODULE_1__["default"](source.cancel);
  var _options$data = options.data,
    data = _options$data === void 0 ? {} : _options$data,
    _options$method = options.method,
    method = _options$method === void 0 ? 'GET' : _options$method,
    _options$dataType = options.dataType,
    dataType = _options$dataType === void 0 ? 'json' : _options$dataType,
    _options$responseType = options.responseType,
    responseType = _options$responseType === void 0 ? 'text' : _options$responseType,
    _options$timeout = options.timeout,
    timeout = _options$timeout === void 0 ? 60 * 1000 : _options$timeout,
    _options$header = options.header,
    header = _options$header === void 0 ? {} : _options$header,
    _options$success = options.success,
    success = _options$success === void 0 ? null : _options$success,
    _options$fail = options.fail,
    fail = _options$fail === void 0 ? null : _options$fail,
    _options$complete = options.complete,
    complete = _options$complete === void 0 ? null : _options$complete;
  method = method.toUpperCase();
  if (method === 'POST' && typeof data !== 'string' && (
  // string 不做处理
  header['Content-Type'] === 'application/x-www-form-urlencoded' || header['content-type'] === 'application/x-www-form-urlencoded')) {
    data = Object.keys(data).reduce(function (pre, curKey) {
      return "".concat(pre, "&").concat(encodeURIComponent(curKey), "=").concat(encodeURIComponent(data[curKey]));
    }, '').slice(1);
  }
  var rOptions = {
    method: method,
    url: options.url,
    data: data,
    headers: header,
    responseType: responseType,
    timeout: timeout,
    cancelToken: source.token,
    transitional: {
      // silent JSON parsing mode
      // `true`  - ignore JSON parsing errors and set response.data to null if parsing failed (old behaviour)
      // `false` - throw SyntaxError if JSON parsing failed (Note: responseType must be set to 'json')
      silentJSONParsing: true,
      // default value for the current Axios version
      // try to parse the response string as JSON even if `responseType` is not 'json'
      forcedJSONParsing: false,
      // throw ETIMEDOUT error instead of generic ECONNABORTED on request timeouts
      clarifyTimeoutError: false
    }
  };
  if (method === 'GET') {
    rOptions.params = rOptions.data || {};
    delete rOptions.data;
  }
  (0,axios__WEBPACK_IMPORTED_MODULE_0__["default"])(rOptions).then(function (res) {
    var data = res.data;
    if (dataType === 'json' && typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {}
    }
    var result = {
      errMsg: 'request:ok',
      data: data,
      statusCode: res.status,
      header: res.headers
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.defineUnsupportedProps)(result, ['cookies', 'profile', 'exception']);
    (0,_common_js__WEBPACK_IMPORTED_MODULE_3__.webHandleSuccess)(result, success, complete);
    return result;
  }).catch(function (err) {
    var response = (err === null || err === void 0 ? void 0 : err.response) || {};
    var res = {
      errMsg: "request:fail ".concat(err),
      statusCode: response.status,
      header: response.headers,
      data: response.data
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_3__.webHandleFail)(res, fail, complete);
    if (!fail) {
      return Promise.reject(res);
    }
  });
  return requestTask;
}


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/route/index.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   navigateBack: function() { return /* binding */ navigateBack; },
/* harmony export */   navigateTo: function() { return /* binding */ navigateTo; },
/* harmony export */   reLaunch: function() { return /* binding */ reLaunch; },
/* harmony export */   redirectTo: function() { return /* binding */ redirectTo; },
/* harmony export */   switchTab: function() { return /* binding */ switchTab; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/web.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");


function parseUrl(url) {
  var path = url;
  var query = '';
  var queryIndex = url.indexOf('?');
  if (queryIndex >= 0) {
    path = url.slice(0, queryIndex);
    query = url.slice(queryIndex);
  }
  var queryObj = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.parseQuery)(query || '?');
  return {
    path: path,
    queryObj: queryObj
  };
}
function getBasePath(navigation) {
  if (navigation) {
    var state = navigation.getState();
    return '/' + state.routes[state.index].name;
  }
  return '/';
}
function resolvePath(relative, base) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative;
  }
  var stack = base.split('/');
  stack.pop();
  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }
  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }
  return stack.join('/');
}
function navigateTo() {
  var _Object$values$;
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var navigation = (_Object$values$ = Object.values(__webpack_require__.g.__mpxPagesMap || {})[0]) === null || _Object$values$ === void 0 ? void 0 : _Object$values$[1];
  var navigationHelper = __webpack_require__.g.__navigationHelper;
  if (navigation && navigationHelper) {
    var _parseUrl = parseUrl(options.url),
      path = _parseUrl.path,
      queryObj = _parseUrl.queryObj;
    var basePath = getBasePath(navigation);
    var finalPath = resolvePath(path, basePath).slice(1);
    navigation.push(finalPath, queryObj);
    navigationHelper.lastSuccessCallback = function () {
      var res = {
        errMsg: 'navigateTo:ok'
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleSuccess)(res, options.success, options.complete);
    };
    navigationHelper.lastFailCallback = function (msg) {
      var res = {
        errMsg: "navigateTo:fail ".concat(msg)
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleFail)(res, options.fail, options.complete);
    };
  }
}
function redirectTo() {
  var _Object$values$2;
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var navigation = (_Object$values$2 = Object.values(__webpack_require__.g.__mpxPagesMap || {})[0]) === null || _Object$values$2 === void 0 ? void 0 : _Object$values$2[1];
  var navigationHelper = __webpack_require__.g.__navigationHelper;
  if (navigation && navigationHelper) {
    var _parseUrl2 = parseUrl(options.url),
      path = _parseUrl2.path,
      queryObj = _parseUrl2.queryObj;
    var basePath = getBasePath(navigation);
    var finalPath = resolvePath(path, basePath).slice(1);
    navigation.replace(finalPath, queryObj);
    navigationHelper.lastSuccessCallback = function () {
      var res = {
        errMsg: 'redirectTo:ok'
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleSuccess)(res, options.success, options.complete);
    };
    navigationHelper.lastFailCallback = function (msg) {
      var res = {
        errMsg: "redirectTo:fail ".concat(msg)
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleFail)(res, options.fail, options.complete);
    };
  }
}
function navigateBack() {
  var _Object$values$3;
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var navigation = (_Object$values$3 = Object.values(__webpack_require__.g.__mpxPagesMap || {})[0]) === null || _Object$values$3 === void 0 ? void 0 : _Object$values$3[1];
  var navigationHelper = __webpack_require__.g.__navigationHelper;
  if (navigation && navigationHelper) {
    navigation.pop(options.delta || 1);
    navigationHelper.lastSuccessCallback = function () {
      var res = {
        errMsg: 'navigateBack:ok'
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleSuccess)(res, options.success, options.complete);
    };
    navigationHelper.lastFailCallback = function (msg) {
      var res = {
        errMsg: "navigateBack:fail ".concat(msg)
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleFail)(res, options.fail, options.complete);
    };
  }
}
function reLaunch() {
  var _Object$values$4;
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var navigation = (_Object$values$4 = Object.values(__webpack_require__.g.__mpxPagesMap || {})[0]) === null || _Object$values$4 === void 0 ? void 0 : _Object$values$4[1];
  var navigationHelper = __webpack_require__.g.__navigationHelper;
  if (navigation && navigationHelper) {
    var _parseUrl3 = parseUrl(options.url),
      path = _parseUrl3.path,
      queryObj = _parseUrl3.queryObj;
    var basePath = getBasePath(navigation);
    var finalPath = resolvePath(path, basePath).slice(1);
    navigation.reset({
      index: 0,
      routes: [{
        name: finalPath,
        params: queryObj
      }]
    });
    navigationHelper.lastSuccessCallback = function () {
      var res = {
        errMsg: 'redirectTo:ok'
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleSuccess)(res, options.success, options.complete);
    };
    navigationHelper.lastFailCallback = function (msg) {
      var res = {
        errMsg: "redirectTo:fail ".concat(msg)
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleFail)(res, options.fail, options.complete);
    };
  }
}
function switchTab() {}


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/scan-code/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scanCode: function() { return /* binding */ scanCode; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var scanCode = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.scanCode || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('scanCode');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/screen-brightness/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getScreenBrightness: function() { return /* binding */ getScreenBrightness; },
/* harmony export */   setScreenBrightness: function() { return /* binding */ setScreenBrightness; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var setScreenBrightness = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.setScreenBrightness || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('setScreenBrightness');
var getScreenBrightness = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.getScreenBrightness || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('getScreenBrightness');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/set-navigation-bar/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setNavigationBarColor: function() { return /* binding */ setNavigationBarColor; },
/* harmony export */   setNavigationBarTitle: function() { return /* binding */ setNavigationBarTitle; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var setNavigationBarTitle = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.setNavigationBarTitle || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('setNavigationBarTitle');
var setNavigationBarColor = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.setNavigationBarColor || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('setNavigationBarColor');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/socket/SocketTask.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/web.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var socketTasks = new Set();
var SocketTask = /*#__PURE__*/function () {
  function SocketTask(url, protocols) {
    _classCallCheck(this, SocketTask);
    this._openCb = null;
    this._closeCb = null;
    this._messageCb = null;
    this._errorCb = null;
    this._closeData = null;
    if (protocols && protocols.length > 0) {
      this._socket = new window.WebSocket(url, protocols);
    } else {
      this._socket = new window.WebSocket(url);
    }
    this.addListener(this._socket);
    socketTasks.add(this._socket);
  }
  return _createClass(SocketTask, [{
    key: "CONNECTING",
    get: function get() {
      return this._socket.CONNECTING || 0;
    }
  }, {
    key: "OPEN",
    get: function get() {
      return this._socket.OPEN || 1;
    }
  }, {
    key: "CLOSING",
    get: function get() {
      return this._socket.CLOSING || 2;
    }
  }, {
    key: "CLOSED",
    get: function get() {
      return this._socket.CLOSED || 3;
    }
  }, {
    key: "readyState",
    get: function get() {
      return this._socket.readyState;
    }
  }, {
    key: "send",
    value: function send(options) {
      var _options$data = options.data,
        data = _options$data === void 0 ? '' : _options$data,
        success = options.success,
        fail = options.fail,
        complete = options.complete;
      if (typeof data !== 'string' || (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.type)(data) !== 'ArrayBuffer') {
        var res = {
          errMsg: 'sendSocketMessage:fail Unsupported data type'
        };
        (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleFail)(res, fail, complete);
        return;
      }
      if (this._socket.readyState === 1) {
        this._socket.send(data);
        var _res = {
          errMsg: 'sendSocketMessage:ok'
        };
        (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleSuccess)(_res, success, complete);
        return Promise.resolve(_res);
      } else {
        var _res2 = {
          errMsg: 'sendSocketMessage:fail'
        };
        (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleFail)(_res2, fail, complete);
        if (!fail) {
          return Promise.reject(_res2);
        }
      }
    }
  }, {
    key: "close",
    value: function close() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$code = options.code,
        code = _options$code === void 0 ? 1000 : _options$code,
        _options$reason = options.reason,
        reason = _options$reason === void 0 ? '' : _options$reason,
        success = options.success,
        fail = options.fail,
        complete = options.complete;
      this._closeData = {
        code: code,
        reason: reason
      };
      try {
        this._socket.close();
        var res = {
          errMsg: 'closeSocket:ok'
        };
        (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleSuccess)(res, success, complete);
        return Promise.resolve(res);
      } catch (err) {
        var _res3 = {
          errMsg: "closeSocket:fail ".concat(err)
        };
        (0,_common_js__WEBPACK_IMPORTED_MODULE_1__.webHandleFail)(_res3, fail, complete);
        if (!fail) {
          return Promise.reject(_res3);
        }
      }
    }
  }, {
    key: "addListener",
    value: function addListener(socket) {
      var _this = this;
      socket.onopen = function (event) {
        typeof _this._openCb === 'function' && _this._openCb(event);
      };
      socket.onmessage = function (event) {
        typeof _this._messageCb === 'function' && _this._messageCb({
          data: event.data
        });
      };
      socket.onerror = function (event) {
        socketTasks.delete(_this._socket);
        typeof _this._errorCb === 'function' && _this._errorCb(event);
      };
      socket.onclose = function (event) {
        socketTasks.delete(_this._socket);
        if (typeof _this._closeCb !== 'function') {
          return;
        }
        if (_this._closeData) {
          _this._closeCb(event);
        } else {
          _this._closeCb({
            code: event.code,
            reason: event.reason
          });
        }
      };
    }
  }, {
    key: "onOpen",
    value: function onOpen(cb) {
      this._openCb = cb;
    }
  }, {
    key: "onMessage",
    value: function onMessage(cb) {
      this._messageCb = cb;
    }
  }, {
    key: "onError",
    value: function onError(cb) {
      this._errorCb = cb;
    }
  }, {
    key: "onClose",
    value: function onClose(cb) {
      this._closeCb = cb;
    }
  }]);
}();
/* harmony default export */ __webpack_exports__["default"] = (SocketTask);

/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/socket/index.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeSocket: function() { return /* reexport safe */ _index_web__WEBPACK_IMPORTED_MODULE_0__.closeSocket; },
/* harmony export */   connectSocket: function() { return /* reexport safe */ _index_web__WEBPACK_IMPORTED_MODULE_0__.connectSocket; },
/* harmony export */   onSocketClose: function() { return /* reexport safe */ _index_web__WEBPACK_IMPORTED_MODULE_0__.onSocketClose; },
/* harmony export */   onSocketError: function() { return /* reexport safe */ _index_web__WEBPACK_IMPORTED_MODULE_0__.onSocketError; },
/* harmony export */   onSocketMessage: function() { return /* reexport safe */ _index_web__WEBPACK_IMPORTED_MODULE_0__.onSocketMessage; },
/* harmony export */   onSocketOpen: function() { return /* reexport safe */ _index_web__WEBPACK_IMPORTED_MODULE_0__.onSocketOpen; },
/* harmony export */   sendSocketMessage: function() { return /* reexport safe */ _index_web__WEBPACK_IMPORTED_MODULE_0__.sendSocketMessage; }
/* harmony export */ });
/* harmony import */ var _index_web__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/socket/index.web.js");


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/socket/index.web.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeSocket: function() { return /* binding */ closeSocket; },
/* harmony export */   connectSocket: function() { return /* binding */ connectSocket; },
/* harmony export */   onSocketClose: function() { return /* binding */ onSocketClose; },
/* harmony export */   onSocketError: function() { return /* binding */ onSocketError; },
/* harmony export */   onSocketMessage: function() { return /* binding */ onSocketMessage; },
/* harmony export */   onSocketOpen: function() { return /* binding */ onSocketOpen; },
/* harmony export */   sendSocketMessage: function() { return /* binding */ sendSocketMessage; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/web.js");
/* harmony import */ var _SocketTask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/socket/SocketTask.js");


function connectSocket() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    url: ''
  };
  if (!_common_js__WEBPACK_IMPORTED_MODULE_0__.isBrowser) {
    (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.throwSSRWarning)('connectSocket API is running in non browser environments');
    return;
  }
  var url = options.url,
    protocols = options.protocols,
    success = options.success,
    fail = options.fail,
    complete = options.complete;
  try {
    var socketTask = new _SocketTask__WEBPACK_IMPORTED_MODULE_1__["default"](url, protocols);
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleSuccess)({
      errMsg: 'connectSocket:ok'
    }, success, complete);
    return socketTask;
  } catch (e) {
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleFail)({
      errMsg: "connectSocket:fail ".concat(e)
    }, fail, complete);
  }
}
function sendSocketMessage() {
  (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.warn)('sendSocketMessage 请使用 socketTask.send');
}
function closeSocket() {
  (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.warn)('closeSocket 请使用 socketTask.close');
}
function onSocketOpen() {
  (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.warn)('onSocketOpen 请使用 socketTask.onOpen');
}
function onSocketError() {
  (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.warn)('onSocketError 请使用 socketTask.onError');
}
function onSocketMessage() {
  (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.warn)('onSocketMessage 请使用 socketTask.onMessage');
}
function onSocketClose() {
  (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.warn)('onSocketClose 请使用 socketTask.onClose');
}


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/storage/index.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearStorage: function() { return /* reexport safe */ _rnStorage__WEBPACK_IMPORTED_MODULE_0__.clearStorage; },
/* harmony export */   clearStorageSync: function() { return /* reexport safe */ _rnStorage__WEBPACK_IMPORTED_MODULE_0__.clearStorageSync; },
/* harmony export */   getStorage: function() { return /* reexport safe */ _rnStorage__WEBPACK_IMPORTED_MODULE_0__.getStorage; },
/* harmony export */   getStorageInfo: function() { return /* reexport safe */ _rnStorage__WEBPACK_IMPORTED_MODULE_0__.getStorageInfo; },
/* harmony export */   getStorageInfoSync: function() { return /* reexport safe */ _rnStorage__WEBPACK_IMPORTED_MODULE_0__.getStorageInfoSync; },
/* harmony export */   getStorageSync: function() { return /* reexport safe */ _rnStorage__WEBPACK_IMPORTED_MODULE_0__.getStorageSync; },
/* harmony export */   removeStorage: function() { return /* reexport safe */ _rnStorage__WEBPACK_IMPORTED_MODULE_0__.removeStorage; },
/* harmony export */   removeStorageSync: function() { return /* reexport safe */ _rnStorage__WEBPACK_IMPORTED_MODULE_0__.removeStorageSync; },
/* harmony export */   setStorage: function() { return /* reexport safe */ _rnStorage__WEBPACK_IMPORTED_MODULE_0__.setStorage; },
/* harmony export */   setStorageSync: function() { return /* reexport safe */ _rnStorage__WEBPACK_IMPORTED_MODULE_0__.setStorageSync; }
/* harmony export */ });
/* harmony import */ var _rnStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/storage/rnStorage.js");


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/storage/rnStorage.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearStorage: function() { return /* binding */ clearStorage; },
/* harmony export */   clearStorageSync: function() { return /* binding */ clearStorageSync; },
/* harmony export */   getStorage: function() { return /* binding */ getStorage; },
/* harmony export */   getStorageInfo: function() { return /* binding */ getStorageInfo; },
/* harmony export */   getStorageInfoSync: function() { return /* binding */ getStorageInfoSync; },
/* harmony export */   getStorageSync: function() { return /* binding */ getStorageSync; },
/* harmony export */   removeStorage: function() { return /* binding */ removeStorage; },
/* harmony export */   removeStorageSync: function() { return /* binding */ removeStorageSync; },
/* harmony export */   setStorage: function() { return /* binding */ setStorage; },
/* harmony export */   setStorageSync: function() { return /* binding */ setStorageSync; }
/* harmony export */ });
/* harmony import */ var _react_native_async_storage_async_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("@react-native-async-storage/async-storage");
/* harmony import */ var _react_native_async_storage_async_storage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_react_native_async_storage_async_storage__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/web.js");
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }



function setStorage(options) {
  var key = options.key,
    data = options.data,
    success = options.success,
    fail = options.fail,
    complete = options.complete;
  var obj = {};
  if (_typeof(data) === 'symbol') {
    obj = {
      data: ''
    };
  } else {
    obj = {
      data: data
    };
  }
  _react_native_async_storage_async_storage__WEBPACK_IMPORTED_MODULE_0___default().setItem(key, JSON.stringify(obj), function (err) {
    if (err) {
      var _result = {
        errMsg: "setStorage:fail ".concat(err)
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleFail)(_result, fail, complete);
      return;
    }
    var result = {
      errMsg: 'setStorage:ok'
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleSuccess)(result, success, complete);
  });
}
var setStorageSync = (0,_common_js__WEBPACK_IMPORTED_MODULE_3__.envError)('setStorageSync');
function getStorage(options) {
  var key = options.key,
    success = options.success,
    fail = options.fail,
    complete = options.complete;
  if (!key) {
    var result = {
      errMsg: 'getStorage:fail parameter error: parameter.key should be String instead of Undefined;'
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleFail)(result, fail, complete);
    return;
  }
  _react_native_async_storage_async_storage__WEBPACK_IMPORTED_MODULE_0___default().getItem(key, function (err, res) {
    if (err || !res) {
      var _result2 = {
        errMsg: "getStorage:fail ".concat(err || 'data not found')
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleFail)(_result2, fail, complete);
      return;
    }
    var item;
    var data = null;
    try {
      item = JSON.parse(res);
    } catch (e) {}
    if (item && _typeof(item) === 'object' && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(item, 'data')) {
      data = item.data;
    }
    var result = {
      errMsg: 'getStorage:ok',
      data: data
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleSuccess)(result, success, complete);
  });
}
var getStorageSync = (0,_common_js__WEBPACK_IMPORTED_MODULE_3__.envError)('getStorageSync');
function getStorageInfo(options) {
  var success = options.success,
    fail = options.fail,
    complete = options.complete;
  _react_native_async_storage_async_storage__WEBPACK_IMPORTED_MODULE_0___default().getAllKeys(function (err, keys) {
    if (err) {
      var _result3 = {
        errMsg: "getStorage:fail ".concat(err)
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleFail)(_result3, fail, complete);
      return;
    }
    var result = {
      keys: keys,
      errMsg: 'getStorageInfo:ok'
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_3__.defineUnsupportedProps)(result, ['currentSize', 'limitSize']);
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleSuccess)(result, success, complete);
  });
}
var getStorageInfoSync = (0,_common_js__WEBPACK_IMPORTED_MODULE_3__.envError)('getStorageInfoSync');
function removeStorage(options) {
  var key = options.key,
    success = options.success,
    fail = options.fail,
    complete = options.complete;
  _react_native_async_storage_async_storage__WEBPACK_IMPORTED_MODULE_0___default().removeItem(key, function (err) {
    if (err) {
      var _result4 = {
        errMsg: "removeStorage:fail ".concat(err)
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleFail)(_result4, fail, complete);
      return;
    }
    var result = {
      errMsg: 'removeStorage:ok'
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleSuccess)(result, success, complete);
  });
}
function removeStorageSync(key) {
  _react_native_async_storage_async_storage__WEBPACK_IMPORTED_MODULE_0___default().removeItem(key);
}
function clearStorage(options) {
  var success = options.success,
    fail = options.fail,
    complete = options.complete;
  _react_native_async_storage_async_storage__WEBPACK_IMPORTED_MODULE_0___default().clear(function (err) {
    if (err) {
      var _result5 = {
        errMsg: "clearStorage:fail ".concat(err)
      };
      (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleFail)(_result5, fail, complete);
      return;
    }
    var result = {
      errMsg: 'clearStorage:ok'
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_2__.webHandleSuccess)(result, success, complete);
  });
}
function clearStorageSync() {
  _react_native_async_storage_async_storage__WEBPACK_IMPORTED_MODULE_0___default().clear();
}


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/system/index.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDeviceInfo: function() { return /* reexport safe */ _rnSystem__WEBPACK_IMPORTED_MODULE_0__.getDeviceInfo; },
/* harmony export */   getSystemInfo: function() { return /* reexport safe */ _rnSystem__WEBPACK_IMPORTED_MODULE_0__.getSystemInfo; },
/* harmony export */   getSystemInfoSync: function() { return /* reexport safe */ _rnSystem__WEBPACK_IMPORTED_MODULE_0__.getSystemInfoSync; },
/* harmony export */   getWindowInfo: function() { return /* reexport safe */ _rnSystem__WEBPACK_IMPORTED_MODULE_0__.getWindowInfo; }
/* harmony export */ });
/* harmony import */ var _rnSystem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/system/rnSystem.js");


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/system/rnSystem.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDeviceInfo: function() { return /* binding */ getDeviceInfo; },
/* harmony export */   getSystemInfo: function() { return /* binding */ getSystemInfo; },
/* harmony export */   getSystemInfoSync: function() { return /* binding */ getSystemInfoSync; },
/* harmony export */   getWindowInfo: function() { return /* binding */ getWindowInfo; }
/* harmony export */ });
/* harmony import */ var react_native_device_info__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react-native-device-info");
/* harmony import */ var react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_native_device_info__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react-native");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_native__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("react-native-safe-area-context");
/* harmony import */ var react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/web.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




var getWindowInfo = function getWindowInfo() {
  var dimensionsWindow = react_native__WEBPACK_IMPORTED_MODULE_1__.Dimensions.get('window');
  var dimensionsScreen = react_native__WEBPACK_IMPORTED_MODULE_1__.Dimensions.get('screen');
  var result = {
    pixelRatio: react_native__WEBPACK_IMPORTED_MODULE_1__.PixelRatio.get(),
    windowWidth: dimensionsWindow.width,
    windowHeight: dimensionsWindow.height,
    screenWidth: dimensionsScreen.width,
    screenHeight: dimensionsScreen.height
  };
  (0,_common_js__WEBPACK_IMPORTED_MODULE_3__.defineUnsupportedProps)(result, ['screenTop']);
  return result;
};
var getSystemInfoSync = function getSystemInfoSync() {
  var windowInfo = getWindowInfo();
  var screenWidth = windowInfo.screenWidth,
    screenHeight = windowInfo.screenHeight;
  var safeArea = {};
  var _ref = (react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_2__.initialWindowMetrics === null || react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_2__.initialWindowMetrics === void 0 ? void 0 : react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_2__.initialWindowMetrics.insets) || {},
    _ref$top = _ref.top,
    top = _ref$top === void 0 ? 0 : _ref$top,
    _ref$bottom = _ref.bottom,
    bottom = _ref$bottom === void 0 ? 0 : _ref$bottom;
  if (react_native__WEBPACK_IMPORTED_MODULE_1__.Platform.OS === 'android') {
    top = react_native__WEBPACK_IMPORTED_MODULE_1__.StatusBar.currentHeight || 0;
  }
  var iosRes = {};
  try {
    var width = Math.min(screenWidth, screenHeight);
    var height = Math.max(screenWidth, screenHeight);
    safeArea = {
      left: 0,
      right: width,
      top: top,
      bottom: height - bottom,
      height: height - bottom - top,
      width: width
    };
  } catch (error) {}
  var result = _objectSpread(_objectSpread({
    brand: react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getBrand(),
    model: react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getModel(),
    system: "".concat(react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getSystemName(), " ").concat(react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getSystemVersion()),
    platform: react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().isEmulatorSync() ? 'emulator' : react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getSystemName(),
    deviceOrientation: screenWidth > screenHeight ? 'portrait' : 'landscape',
    statusBarHeight: top,
    fontSizeSetting: react_native__WEBPACK_IMPORTED_MODULE_1__.PixelRatio.getFontScale(),
    safeArea: safeArea
  }, windowInfo), iosRes);
  (0,_common_js__WEBPACK_IMPORTED_MODULE_3__.defineUnsupportedProps)(result, ['language', 'version', 'SDKVersion', 'benchmarkLevel', 'albumAuthorized', 'cameraAuthorized', 'locationAuthorized', 'microphoneAuthorized', 'notificationAuthorized', 'phoneCalendarAuthorized', 'host', 'enableDebug', 'notificationAlertAuthorized', 'notificationBadgeAuthorized', 'notificationSoundAuthorized', 'bluetoothEnabled', 'locationEnabled', 'wifiEnabled', 'locationReducedAccuracy', 'theme']);
  return result;
};
var getSystemInfo = function getSystemInfo(options) {
  var success = options.success,
    fail = options.fail,
    complete = options.complete;
  try {
    var systemInfo = getSystemInfoSync();
    Object.assign(systemInfo, {
      errMsg: 'setStorage:ok'
    });
    (0,_common_js__WEBPACK_IMPORTED_MODULE_4__.webHandleSuccess)(systemInfo, success, complete);
  } catch (err) {
    var result = {
      errMsg: "getSystemInfo:fail ".concat(err)
    };
    (0,_common_js__WEBPACK_IMPORTED_MODULE_4__.webHandleFail)(result, fail, complete);
  }
};
var getDeviceInfo = function getDeviceInfo() {
  var deviceInfo = {};
  if (react_native__WEBPACK_IMPORTED_MODULE_1__.Platform.OS === 'android') {
    var deviceAbi = react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().supported64BitAbisSync() || [];
    deviceInfo.deviceAbi = deviceAbi[0] || null;
  }
  (0,_common_js__WEBPACK_IMPORTED_MODULE_3__.defineUnsupportedProps)(deviceInfo, ['benchmarkLevel', 'abi', 'cpuType']);
  Object.assign(deviceInfo, {
    brand: react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getBrand(),
    model: react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getModel(),
    system: "".concat(react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getSystemName(), " ").concat(react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getSystemVersion()),
    platform: react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().isEmulatorSync() ? 'emulator' : react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getSystemName(),
    memorySize: react_native_device_info__WEBPACK_IMPORTED_MODULE_0___default().getTotalMemorySync() / (1024 * 1024)
  });
  return deviceInfo;
};


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/tab-bar/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hideTabBar: function() { return /* binding */ hideTabBar; },
/* harmony export */   setTabBarItem: function() { return /* binding */ setTabBarItem; },
/* harmony export */   setTabBarStyle: function() { return /* binding */ setTabBarStyle; },
/* harmony export */   showTabBar: function() { return /* binding */ showTabBar; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var setTabBarItem = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.setTabBarItem || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('setTabBarItem');
var setTabBarStyle = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.setTabBarStyle || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('setTabBarStyle');
var showTabBar = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.showTabBar || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('showTabBar');
var hideTabBar = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.hideTabBar || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('hideTabBar');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/toast/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hideLoading: function() { return /* binding */ hideLoading; },
/* harmony export */   hideToast: function() { return /* binding */ hideToast; },
/* harmony export */   showLoading: function() { return /* binding */ showLoading; },
/* harmony export */   showToast: function() { return /* binding */ showToast; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var showToast = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.showToast || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('showToast');
var hideToast = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.hideToast || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('hideToast');
var showLoading = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.showLoading || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('showLoading');
var hideLoading = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.hideLoading || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('hideLoading');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/video/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createVideoContext: function() { return /* binding */ createVideoContext; }
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/common/js/utils.js");

var createVideoContext = _common_js__WEBPACK_IMPORTED_MODULE_0__.ENV_OBJ.createVideoContext || (0,_common_js__WEBPACK_IMPORTED_MODULE_0__.envError)('createVideoContext');


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/window/index.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   offWindowResize: function() { return /* reexport safe */ _rnWindow__WEBPACK_IMPORTED_MODULE_0__.offWindowResize; },
/* harmony export */   onWindowResize: function() { return /* reexport safe */ _rnWindow__WEBPACK_IMPORTED_MODULE_0__.onWindowResize; }
/* harmony export */ });
/* harmony import */ var _rnWindow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/window/rnWindow.js");


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/api/window/rnWindow.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   offWindowResize: function() { return /* binding */ offWindowResize; },
/* harmony export */   onWindowResize: function() { return /* binding */ onWindowResize; }
/* harmony export */ });
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react-native");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_native__WEBPACK_IMPORTED_MODULE_0__);

var callbacks = [];
var subscription;
var addListener = function addListener() {
  subscription = react_native__WEBPACK_IMPORTED_MODULE_0__.Dimensions.addEventListener('change', function (_ref) {
    var window = _ref.window;
    var result = {
      size: {
        windowWidth: window.width,
        windowHeight: window.height
      }
    };
    callbacks.forEach(function (cb) {
      return cb(result);
    });
  });
};
var removeListener = function removeListener() {
  subscription && subscription.remove();
};
function onWindowResize(callback) {
  if (callbacks.length === 0) {
    addListener();
  }
  callbacks.push(callback);
}
function offWindowResize(callback) {
  var index = callbacks.indexOf(callback);
  if (index > -1) {
    callbacks.splice(index, 1);
  }
  if (callbacks.length === 0) {
    removeListener();
  }
}


/***/ }),

/***/ "./node_modules/@mpxjs/api-proxy/src/platform/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addPhoneContact: function() { return /* reexport safe */ _api_add_phone_contact__WEBPACK_IMPORTED_MODULE_1__.addPhoneContact; },
/* harmony export */   arrayBufferToBase64: function() { return /* reexport safe */ _api_base__WEBPACK_IMPORTED_MODULE_5__.arrayBufferToBase64; },
/* harmony export */   base64ToArrayBuffer: function() { return /* reexport safe */ _api_base__WEBPACK_IMPORTED_MODULE_5__.base64ToArrayBuffer; },
/* harmony export */   canvasGetImageData: function() { return /* reexport safe */ _api_canvas__WEBPACK_IMPORTED_MODULE_7__.canvasGetImageData; },
/* harmony export */   canvasToTempFilePath: function() { return /* reexport safe */ _api_canvas__WEBPACK_IMPORTED_MODULE_7__.canvasToTempFilePath; },
/* harmony export */   checkSession: function() { return /* reexport safe */ _api_check_session__WEBPACK_IMPORTED_MODULE_8__.checkSession; },
/* harmony export */   clearStorage: function() { return /* reexport safe */ _api_storage__WEBPACK_IMPORTED_MODULE_29__.clearStorage; },
/* harmony export */   clearStorageSync: function() { return /* reexport safe */ _api_storage__WEBPACK_IMPORTED_MODULE_29__.clearStorageSync; },
/* harmony export */   closeBLEConnection: function() { return /* reexport safe */ _api_ble_connection__WEBPACK_IMPORTED_MODULE_6__.closeBLEConnection; },
/* harmony export */   closeSocket: function() { return /* reexport safe */ _api_socket__WEBPACK_IMPORTED_MODULE_28__.closeSocket; },
/* harmony export */   compressImage: function() { return /* reexport safe */ _api_image__WEBPACK_IMPORTED_MODULE_15__.compressImage; },
/* harmony export */   connectSocket: function() { return /* reexport safe */ _api_socket__WEBPACK_IMPORTED_MODULE_28__.connectSocket; },
/* harmony export */   createAnimation: function() { return /* reexport safe */ _api_animation__WEBPACK_IMPORTED_MODULE_2__.createAnimation; },
/* harmony export */   createBLEConnection: function() { return /* reexport safe */ _api_ble_connection__WEBPACK_IMPORTED_MODULE_6__.createBLEConnection; },
/* harmony export */   createInnerAudioContext: function() { return /* reexport safe */ _api_audio__WEBPACK_IMPORTED_MODULE_4__.createInnerAudioContext; },
/* harmony export */   createIntersectionObserver: function() { return /* reexport safe */ _api_create_intersection_observer__WEBPACK_IMPORTED_MODULE_10__.createIntersectionObserver; },
/* harmony export */   createSelectorQuery: function() { return /* reexport safe */ _api_create_selector_query__WEBPACK_IMPORTED_MODULE_11__.createSelectorQuery; },
/* harmony export */   createVideoContext: function() { return /* reexport safe */ _api_video__WEBPACK_IMPORTED_MODULE_33__.createVideoContext; },
/* harmony export */   downloadFile: function() { return /* reexport safe */ _api_file__WEBPACK_IMPORTED_MODULE_13__.downloadFile; },
/* harmony export */   getClipboardData: function() { return /* reexport safe */ _api_clipboard_data__WEBPACK_IMPORTED_MODULE_9__.getClipboardData; },
/* harmony export */   getDeviceInfo: function() { return /* reexport safe */ _api_system__WEBPACK_IMPORTED_MODULE_30__.getDeviceInfo; },
/* harmony export */   getEnterOptionsSync: function() { return /* reexport safe */ _api_lifecycle__WEBPACK_IMPORTED_MODULE_35__.getEnterOptionsSync; },
/* harmony export */   getNetworkType: function() { return /* reexport safe */ _api_device_network__WEBPACK_IMPORTED_MODULE_12__.getNetworkType; },
/* harmony export */   getScreenBrightness: function() { return /* reexport safe */ _api_screen_brightness__WEBPACK_IMPORTED_MODULE_26__.getScreenBrightness; },
/* harmony export */   getStorage: function() { return /* reexport safe */ _api_storage__WEBPACK_IMPORTED_MODULE_29__.getStorage; },
/* harmony export */   getStorageInfo: function() { return /* reexport safe */ _api_storage__WEBPACK_IMPORTED_MODULE_29__.getStorageInfo; },
/* harmony export */   getStorageInfoSync: function() { return /* reexport safe */ _api_storage__WEBPACK_IMPORTED_MODULE_29__.getStorageInfoSync; },
/* harmony export */   getStorageSync: function() { return /* reexport safe */ _api_storage__WEBPACK_IMPORTED_MODULE_29__.getStorageSync; },
/* harmony export */   getSystemInfo: function() { return /* reexport safe */ _api_system__WEBPACK_IMPORTED_MODULE_30__.getSystemInfo; },
/* harmony export */   getSystemInfoSync: function() { return /* reexport safe */ _api_system__WEBPACK_IMPORTED_MODULE_30__.getSystemInfoSync; },
/* harmony export */   getUserInfo: function() { return /* reexport safe */ _api_get_user_info__WEBPACK_IMPORTED_MODULE_14__.getUserInfo; },
/* harmony export */   getWindowInfo: function() { return /* reexport safe */ _api_system__WEBPACK_IMPORTED_MODULE_30__.getWindowInfo; },
/* harmony export */   hideLoading: function() { return /* reexport safe */ _api_toast__WEBPACK_IMPORTED_MODULE_32__.hideLoading; },
/* harmony export */   hideTabBar: function() { return /* reexport safe */ _api_tab_bar__WEBPACK_IMPORTED_MODULE_31__.hideTabBar; },
/* harmony export */   hideToast: function() { return /* reexport safe */ _api_toast__WEBPACK_IMPORTED_MODULE_32__.hideToast; },
/* harmony export */   login: function() { return /* reexport safe */ _api_login__WEBPACK_IMPORTED_MODULE_16__.login; },
/* harmony export */   makePhoneCall: function() { return /* reexport safe */ _api_make_phone_call__WEBPACK_IMPORTED_MODULE_17__.makePhoneCall; },
/* harmony export */   navigateBack: function() { return /* reexport safe */ _api_route__WEBPACK_IMPORTED_MODULE_24__.navigateBack; },
/* harmony export */   navigateTo: function() { return /* reexport safe */ _api_route__WEBPACK_IMPORTED_MODULE_24__.navigateTo; },
/* harmony export */   nextTick: function() { return /* reexport safe */ _api_next_tick__WEBPACK_IMPORTED_MODULE_19__.nextTick; },
/* harmony export */   offAppHide: function() { return /* reexport safe */ _api_app__WEBPACK_IMPORTED_MODULE_3__.offAppHide; },
/* harmony export */   offAppShow: function() { return /* reexport safe */ _api_app__WEBPACK_IMPORTED_MODULE_3__.offAppShow; },
/* harmony export */   offError: function() { return /* reexport safe */ _api_app__WEBPACK_IMPORTED_MODULE_3__.offError; },
/* harmony export */   offNetworkStatusChange: function() { return /* reexport safe */ _api_device_network__WEBPACK_IMPORTED_MODULE_12__.offNetworkStatusChange; },
/* harmony export */   offWindowResize: function() { return /* reexport safe */ _api_window__WEBPACK_IMPORTED_MODULE_34__.offWindowResize; },
/* harmony export */   onAppHide: function() { return /* reexport safe */ _api_app__WEBPACK_IMPORTED_MODULE_3__.onAppHide; },
/* harmony export */   onAppShow: function() { return /* reexport safe */ _api_app__WEBPACK_IMPORTED_MODULE_3__.onAppShow; },
/* harmony export */   onBLEConnectionStateChange: function() { return /* reexport safe */ _api_ble_connection__WEBPACK_IMPORTED_MODULE_6__.onBLEConnectionStateChange; },
/* harmony export */   onError: function() { return /* reexport safe */ _api_app__WEBPACK_IMPORTED_MODULE_3__.onError; },
/* harmony export */   onNetworkStatusChange: function() { return /* reexport safe */ _api_device_network__WEBPACK_IMPORTED_MODULE_12__.onNetworkStatusChange; },
/* harmony export */   onSocketClose: function() { return /* reexport safe */ _api_socket__WEBPACK_IMPORTED_MODULE_28__.onSocketClose; },
/* harmony export */   onSocketError: function() { return /* reexport safe */ _api_socket__WEBPACK_IMPORTED_MODULE_28__.onSocketError; },
/* harmony export */   onSocketMessage: function() { return /* reexport safe */ _api_socket__WEBPACK_IMPORTED_MODULE_28__.onSocketMessage; },
/* harmony export */   onSocketOpen: function() { return /* reexport safe */ _api_socket__WEBPACK_IMPORTED_MODULE_28__.onSocketOpen; },
/* harmony export */   onWindowResize: function() { return /* reexport safe */ _api_window__WEBPACK_IMPORTED_MODULE_34__.onWindowResize; },
/* harmony export */   pageScrollTo: function() { return /* reexport safe */ _api_page_scroll_to__WEBPACK_IMPORTED_MODULE_20__.pageScrollTo; },
/* harmony export */   previewImage: function() { return /* reexport safe */ _api_image__WEBPACK_IMPORTED_MODULE_15__.previewImage; },
/* harmony export */   reLaunch: function() { return /* reexport safe */ _api_route__WEBPACK_IMPORTED_MODULE_24__.reLaunch; },
/* harmony export */   redirectTo: function() { return /* reexport safe */ _api_route__WEBPACK_IMPORTED_MODULE_24__.redirectTo; },
/* harmony export */   removeStorage: function() { return /* reexport safe */ _api_storage__WEBPACK_IMPORTED_MODULE_29__.removeStorage; },
/* harmony export */   removeStorageSync: function() { return /* reexport safe */ _api_storage__WEBPACK_IMPORTED_MODULE_29__.removeStorageSync; },
/* harmony export */   request: function() { return /* reexport safe */ _api_request__WEBPACK_IMPORTED_MODULE_22__.request; },
/* harmony export */   requestPayment: function() { return /* reexport safe */ _api_request_payment__WEBPACK_IMPORTED_MODULE_23__.requestPayment; },
/* harmony export */   scanCode: function() { return /* reexport safe */ _api_scan_code__WEBPACK_IMPORTED_MODULE_25__.scanCode; },
/* harmony export */   sendSocketMessage: function() { return /* reexport safe */ _api_socket__WEBPACK_IMPORTED_MODULE_28__.sendSocketMessage; },
/* harmony export */   setClipboardData: function() { return /* reexport safe */ _api_clipboard_data__WEBPACK_IMPORTED_MODULE_9__.setClipboardData; },
/* harmony export */   setNavigationBarColor: function() { return /* reexport safe */ _api_set_navigation_bar__WEBPACK_IMPORTED_MODULE_27__.setNavigationBarColor; },
/* harmony export */   setNavigationBarTitle: function() { return /* reexport safe */ _api_set_navigation_bar__WEBPACK_IMPORTED_MODULE_27__.setNavigationBarTitle; },
/* harmony export */   setScreenBrightness: function() { return /* reexport safe */ _api_screen_brightness__WEBPACK_IMPORTED_MODULE_26__.setScreenBrightness; },
/* harmony export */   setStorage: function() { return /* reexport safe */ _api_storage__WEBPACK_IMPORTED_MODULE_29__.setStorage; },
/* harmony export */   setStorageSync: function() { return /* reexport safe */ _api_storage__WEBPACK_IMPORTED_MODULE_29__.setStorageSync; },
/* harmony export */   setTabBarItem: function() { return /* reexport safe */ _api_tab_bar__WEBPACK_IMPORTED_MODULE_31__.setTabBarItem; },
/* harmony export */   setTabBarStyle: function() { return /* reexport safe */ _api_tab_bar__WEBPACK_IMPORTED_MODULE_31__.setTabBarStyle; },
/* harmony export */   showActionSheet: function() { return /* reexport safe */ _api_action_sheet__WEBPACK_IMPORTED_MODULE_0__.showActionSheet; },
/* harmony export */   showLoading: function() { return /* reexport safe */ _api_toast__WEBPACK_IMPORTED_MODULE_32__.showLoading; },
/* harmony export */   showModal: function() { return /* reexport safe */ _api_modal__WEBPACK_IMPORTED_MODULE_18__.showModal; },
/* harmony export */   showTabBar: function() { return /* reexport safe */ _api_tab_bar__WEBPACK_IMPORTED_MODULE_31__.showTabBar; },
/* harmony export */   showToast: function() { return /* reexport safe */ _api_toast__WEBPACK_IMPORTED_MODULE_32__.showToast; },
/* harmony export */   startPullDownRefresh: function() { return /* reexport safe */ _api_pull_down__WEBPACK_IMPORTED_MODULE_21__.startPullDownRefresh; },
/* harmony export */   stopPullDownRefresh: function() { return /* reexport safe */ _api_pull_down__WEBPACK_IMPORTED_MODULE_21__.stopPullDownRefresh; },
/* harmony export */   switchTab: function() { return /* reexport safe */ _api_route__WEBPACK_IMPORTED_MODULE_24__.switchTab; },
/* harmony export */   uploadFile: function() { return /* reexport safe */ _api_file__WEBPACK_IMPORTED_MODULE_13__.uploadFile; }
/* harmony export */ });
/* harmony import */ var _api_action_sheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/action-sheet/index.js");
/* harmony import */ var _api_add_phone_contact__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/add-phone-contact/index.js");
/* harmony import */ var _api_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/animation/index.js");
/* harmony import */ var _api_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/app/index.js");
/* harmony import */ var _api_audio__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/audio/index.js");
/* harmony import */ var _api_base__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/base/index.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _api_ble_connection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/ble-connection/index.js");
/* harmony import */ var _api_canvas__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/canvas/index.js");
/* harmony import */ var _api_check_session__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/check-session/index.js");
/* harmony import */ var _api_clipboard_data__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/clipboard-data/index.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _api_create_intersection_observer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/create-intersection-observer/index.js");
/* harmony import */ var _api_create_selector_query__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/create-selector-query/index.js");
/* harmony import */ var _api_device_network__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/device/network/index.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _api_file__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/file/index.js");
/* harmony import */ var _api_get_user_info__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/get-user-info/index.js");
/* harmony import */ var _api_image__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/image/index.js");
/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/login/index.js");
/* harmony import */ var _api_make_phone_call__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/make-phone-call/index.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _api_modal__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/modal/index.js");
/* harmony import */ var _api_next_tick__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/next-tick/index.js");
/* harmony import */ var _api_page_scroll_to__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/page-scroll-to/index.js");
/* harmony import */ var _api_pull_down__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/pull-down/index.js");
/* harmony import */ var _api_request__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/request/index.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _api_request_payment__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/request-payment/index.js");
/* harmony import */ var _api_route__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/route/index.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _api_scan_code__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/scan-code/index.js");
/* harmony import */ var _api_screen_brightness__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/screen-brightness/index.js");
/* harmony import */ var _api_set_navigation_bar__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/set-navigation-bar/index.js");
/* harmony import */ var _api_socket__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/socket/index.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _api_storage__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/storage/index.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _api_system__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/system/index.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _api_tab_bar__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/tab-bar/index.js");
/* harmony import */ var _api_toast__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/toast/index.js");
/* harmony import */ var _api_video__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/video/index.js");
/* harmony import */ var _api_window__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/window/index.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _api_lifecycle__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/lifecycle/index.js");
// showActionSheet


// addPhoneContact


// createAnimation


// onAppShow, onAppHide, offAppShow, offAppHide, onError, offError


// createInnerAudioContext


// base64ToArrayBuffer, arrayBufferToBase64


// closeBLEConnection, createBLEConnection, onBLEConnectionStateChange


// canvasToTempFilePath, canvasGetImageData


// checkSession


// setClipboardData, getClipboardData


// createIntersectionObserver


// createSelectorQuery


// getNetworkType, onNetworkStatusChange, offNetworkStatusChange


// downloadFile, uploadFile


// getUserInfo


// previewImage, compressImage


// login


// makePhoneCall


// showModal


// nextTick


// pageScrollTo


// stopPullDownRefresh


// request


// requestPayment


// redirectTo, navigateTo, navigateBack, reLaunch, switchTab


// scanCode


// setScreenBrightness, getScreenBrightness


// setNavigationBarTitle, setNavigationBarColor


// connectSocket


// setStorage, setStorageSync, getStorage, getStorageSync
// getStorageInfo, getStorageInfoSync, removeStorage, removeStorageSync
// clearStorage, clearStorageSync


// getSystemInfo, getSystemInfoSync


// setTabBarItem, setTabBarStyle, showTabBar, hideTabBar


// showToast, hideToast, showLoading, hideLoading


// createVideoContext


// onWindowResize, offWindowResize


// getEnterOptionsSync


/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/convertor.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getConvertRule: function() { return /* binding */ getConvertRule; }
/* harmony export */ });
/* harmony import */ var _platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/wx/lifecycle.js");
/* harmony import */ var _mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/mergeLifecycle.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _wxToAli__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/wxToAli.js");
/* harmony import */ var _wxToWeb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/wxToWeb.js");
/* harmony import */ var _wxToSwan__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/wxToSwan.js");
/* harmony import */ var _wxToQq__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/wxToQq.js");
/* harmony import */ var _wxToTt__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/wxToTt.js");
/* harmony import */ var _wxToDd__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/wxToDd.js");
/* harmony import */ var _wxToJd__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/wxToJd.js");
/* harmony import */ var _wxToReact__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/wxToReact.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }















// 根据当前环境获取的默认生命周期信息
var lifecycleInfo;
var pageMode;
if (false) {} else if (false) {} else if (false) {} else {
  lifecycleInfo = _platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_1__;
  pageMode = 'blend';
}

/**
 * 转换规则包含四点
 * lifecycle [object] 生命周期
 * lifecycleProxyMap [object] 代理规则
 * pageMode [string] 页面生命周期合并模式，是否为blend
 * support [boolean]当前平台是否支持blend
 * convert [function] 自定义转换函数, 接收一个options
 */
var defaultConvertRule = {
  lifecycle: (0,_mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__.mergeLifecycle)(lifecycleInfo.LIFECYCLE),
  lifecycleProxyMap: lifecycleInfo.lifecycleProxyMap,
  pageMode: pageMode,
  support: !!pageMode,
  convert: null
};
var rulesMap = {
  local: _objectSpread({}, defaultConvertRule),
  default: defaultConvertRule,
  wxToWeb: _wxToWeb__WEBPACK_IMPORTED_MODULE_3__["default"],
  wxToAli: _wxToAli__WEBPACK_IMPORTED_MODULE_4__["default"],
  wxToSwan: _wxToSwan__WEBPACK_IMPORTED_MODULE_5__["default"],
  wxToQq: _objectSpread(_objectSpread({}, defaultConvertRule), _wxToQq__WEBPACK_IMPORTED_MODULE_6__["default"]),
  wxToTt: _objectSpread(_objectSpread({}, defaultConvertRule), _wxToTt__WEBPACK_IMPORTED_MODULE_7__["default"]),
  wxToDd: _objectSpread(_objectSpread({}, defaultConvertRule), _wxToDd__WEBPACK_IMPORTED_MODULE_8__["default"]),
  wxToJd: _objectSpread(_objectSpread({}, defaultConvertRule), _wxToJd__WEBPACK_IMPORTED_MODULE_9__["default"]),
  wxToIos: _objectSpread(_objectSpread({}, defaultConvertRule), _wxToReact__WEBPACK_IMPORTED_MODULE_10__["default"]),
  wxToAndroid: _objectSpread(_objectSpread({}, defaultConvertRule), _wxToReact__WEBPACK_IMPORTED_MODULE_10__["default"])
};
function getConvertRule(convertMode) {
  var rule = rulesMap[convertMode];
  if (!rule || !rule.lifecycle) {
    (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("Absence of convert rule for ".concat(convertMode, ", please check."));
  } else {
    return rule;
  }
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/getConvertMode.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getConvertMode: function() { return /* binding */ getConvertMode; }
/* harmony export */ });
var convertModes = {
  'wx-ali': 'wxToAli',
  'wx-web': 'wxToWeb',
  'wx-swan': 'wxToSwan',
  'wx-qq': 'wxToQq',
  'wx-tt': 'wxToTt',
  'wx-jd': 'wxToJd',
  'wx-dd': 'wxToDd',
  'wx-ios': 'wxToIos',
  'wx-android': 'wxToAndroid'
};
function getConvertMode(srcMode) {
  return convertModes[srcMode + '-' + "ios"];
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/mergeLifecycle.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeLifecycle: function() { return /* binding */ mergeLifecycle; }
/* harmony export */ });
/* harmony import */ var _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/innerLifecycle.js");

function mergeLifecycle(lifecycle) {
  if (lifecycle) {
    var appHooks = (lifecycle.APP_HOOKS || []).concat(_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.INNER_LIFECYCLES);
    var pageHooks = (lifecycle.PAGE_HOOKS || []).concat(_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.INNER_LIFECYCLES);
    var componentHooks = (lifecycle.COMPONENT_HOOKS || []).concat(_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.INNER_LIFECYCLES);
    return {
      app: appHooks,
      page: pageHooks,
      component: componentHooks,
      blend: pageHooks.concat(lifecycle.COMPONENT_HOOKS || [])
    };
  }
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/wxToAli.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/wx/lifecycle.js");
/* harmony import */ var _platform_patch_ali_lifecycle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/ali/lifecycle.js");
/* harmony import */ var _mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/mergeLifecycle.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _core_implement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/implement.js");





var unsupported = ['moved', 'definitionFilter'];
function convertErrorDesc(key) {
  (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("Options.".concat(key, " is not supported in runtime conversion from wx to ali."), __webpack_require__.g.currentResource);
}
function notSupportTip(options) {
  unsupported.forEach(function (key) {
    if (options[key]) {
      if (!_core_implement__WEBPACK_IMPORTED_MODULE_1__.implemented[key]) {
        _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isDev && convertErrorDesc(key);
        delete options[key];
      } else if (_core_implement__WEBPACK_IMPORTED_MODULE_1__.implemented[key].remove) {
        delete options[key];
      }
    }
  });
  // relations部分支持
  var relations = options.relations;
  if (relations) {
    Object.keys(relations).forEach(function (path) {
      var item = relations[path];
      if (item.target) {
        convertErrorDesc('relations > target');
      }
      if (item.linkChanged) {
        convertErrorDesc('relations > linkChanged');
      }
    });
  }
}
/* harmony default export */ __webpack_exports__["default"] = ({
  lifecycle: (0,_mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__.mergeLifecycle)(_platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_3__.LIFECYCLE),
  lifecycle2: (0,_mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__.mergeLifecycle)(_platform_patch_ali_lifecycle__WEBPACK_IMPORTED_MODULE_4__.LIFECYCLE),
  pageMode: 'blend',
  support: false,
  lifecycleProxyMap: _platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_3__.lifecycleProxyMap,
  convert: function convert(options) {
    var props = Object.assign({}, options.properties, options.props);
    if (props) {
      Object.keys(props).forEach(function (key) {
        var prop = props[key];
        if (prop) {
          if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(prop, 'value')) {
            props[key] = prop.value;
          } else {
            var type = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(prop, 'type') ? prop.type : prop;
            if (typeof type === 'function') props[key] = type();
          }
        }
      });
      options.props = props;
      delete options.properties;
    }
    notSupportTip(options);
  }
});

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/wxToDd.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var BEHAVIORS_MAP = {
  'wx://form-field': 'dd://form-field',
  'wx://component-export': 'dd://component-export'
};
/* harmony default export */ __webpack_exports__["default"] = ({
  convert: function convert(options) {
    if (options.behaviors) {
      options.behaviors.forEach(function (behavior, idx) {
        if (typeof behavior === 'string' && BEHAVIORS_MAP[behavior]) {
          options.behaviors.splice(idx, 1, BEHAVIORS_MAP[behavior]);
        }
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/wxToJd.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var BEHAVIORS_MAP = {
  'wx://form-field': 'jd://form-field',
  'wx://component-export': 'jd://component-export'
};
/* harmony default export */ __webpack_exports__["default"] = ({
  convert: function convert(options) {
    if (options.behaviors) {
      options.behaviors.forEach(function (behavior, idx) {
        if (typeof behavior === 'string' && BEHAVIORS_MAP[behavior]) {
          options.behaviors.splice(idx, 1, BEHAVIORS_MAP[behavior]);
        }
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/wxToQq.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var BEHAVIORS_MAP = {
  'wx://form-field': 'qq://form-field',
  'wx://component-export': 'qq://component-export'
};
/* harmony default export */ __webpack_exports__["default"] = ({
  convert: function convert(options) {
    if (options.behaviors) {
      options.behaviors.forEach(function (behavior, idx) {
        if (typeof behavior === 'string' && BEHAVIORS_MAP[behavior]) {
          options.behaviors.splice(idx, 1, BEHAVIORS_MAP[behavior]);
        }
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/wxToReact.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _core_implement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/implement.js");



// 暂不支持的wx选项，后期需要各种花式支持
var unsupported = ['relations', 'moved', 'definitionFilter', 'onShareAppMessage', 'options', 'behaviors', 'externalClasses'];
function convertErrorDesc(key) {
  (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("Options.".concat(key, " is not supported in runtime conversion from wx to react native."), __webpack_require__.g.currentResource);
}
function notSupportTip(options) {
  unsupported.forEach(function (key) {
    if (options[key]) {
      if (!_core_implement__WEBPACK_IMPORTED_MODULE_1__.implemented[key]) {
        _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isDev && convertErrorDesc(key);
        delete options[key];
      } else if (_core_implement__WEBPACK_IMPORTED_MODULE_1__.implemented[key].remove) {
        delete options[key];
      }
    }
  });
}
/* harmony default export */ __webpack_exports__["default"] = ({
  convert: function convert(options) {
    notSupportTip(options);
  }
});

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/wxToSwan.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _core_implement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/implement.js");
/* harmony import */ var _mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/mergeLifecycle.js");
/* harmony import */ var _platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/wx/lifecycle.js");
/* harmony import */ var _platform_patch_swan_lifecycle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/swan/lifecycle.js");





var BEHAVIORS_MAP = {
  'wx://form-field': 'swan://form-field',
  'wx://component-export': 'swan://component-export'
};
var unsupported = ['moved', 'relations'];
function convertErrorDesc(key) {
  (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("Options.".concat(key, " is not supported in runtime conversion from wx to swan."), __webpack_require__.g.currentResource);
}
function notSupportTip(options) {
  unsupported.forEach(function (key) {
    if (options[key]) {
      if (!_core_implement__WEBPACK_IMPORTED_MODULE_1__.implemented[key]) {
        _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isDev && convertErrorDesc(key);
        delete options[key];
      } else if (_core_implement__WEBPACK_IMPORTED_MODULE_1__.implemented[key].remove) {
        delete options[key];
      }
    }
  });
}
/* harmony default export */ __webpack_exports__["default"] = ({
  lifecycle: (0,_mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__.mergeLifecycle)(_platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_3__.LIFECYCLE),
  lifecycle2: (0,_mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__.mergeLifecycle)(_platform_patch_swan_lifecycle__WEBPACK_IMPORTED_MODULE_4__.LIFECYCLE),
  pageMode: 'blend',
  support: true,
  lifecycleProxyMap: _platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_3__.lifecycleProxyMap,
  convert: function convert(options, type) {
    if (options.behaviors) {
      options.behaviors.forEach(function (behavior, idx) {
        if (typeof behavior === 'string' && BEHAVIORS_MAP[behavior]) {
          options.behaviors.splice(idx, 1, BEHAVIORS_MAP[behavior]);
        }
      });
    }
    if (type === 'page' && !options.__pageCtor__) {
      options.options = options.options || {};
      options.options.addGlobalClass = true;
    }
    notSupportTip(options);
  }
});

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/wxToTt.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");

var BEHAVIORS_MAP = ['wx://form-field', 'wx://form-field-group', 'wx://form-field-button', 'wx://component-export'];
/* harmony default export */ __webpack_exports__["default"] = ({
  convert: function convert(options) {
    if (options.behaviors) {
      options.behaviors.forEach(function (behavior, idx) {
        if (BEHAVIORS_MAP.includes(behavior)) {
          (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("Built-in behavior \"".concat(behavior, "\" is not supported in tt environment!"), __webpack_require__.g.currentResource);
          options.behaviors.splice(idx, 1);
        }
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/convertor/wxToWeb.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/wx/lifecycle.js");
/* harmony import */ var _platform_patch_web_lifecycle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/web/lifecycle.js");
/* harmony import */ var _mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/mergeLifecycle.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _core_implement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/implement.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }






// 暂不支持的wx选项，后期需要各种花式支持
var unsupported = ['moved', 'definitionFilter', 'onShareAppMessage'];
function convertErrorDesc(key) {
  (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("Options.".concat(key, " is not supported in runtime conversion from wx to web."), __webpack_require__.g.currentResource);
}
function notSupportTip(options) {
  unsupported.forEach(function (key) {
    if (options[key]) {
      if (!_core_implement__WEBPACK_IMPORTED_MODULE_1__.implemented[key]) {
        _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isDev && convertErrorDesc(key);
        delete options[key];
      } else if (_core_implement__WEBPACK_IMPORTED_MODULE_1__.implemented[key].remove) {
        delete options[key];
      }
    }
  });
}
/* harmony default export */ __webpack_exports__["default"] = ({
  lifecycle: (0,_mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__.mergeLifecycle)(_platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_3__.LIFECYCLE),
  lifecycle2: (0,_mergeLifecycle__WEBPACK_IMPORTED_MODULE_2__.mergeLifecycle)(_platform_patch_web_lifecycle__WEBPACK_IMPORTED_MODULE_4__.LIFECYCLE),
  pageMode: 'blend',
  support: true,
  lifecycleProxyMap: _platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_3__.lifecycleProxyMap,
  convert: function convert(options) {
    var props = Object.assign({}, options.properties, options.props);
    if (props) {
      Object.keys(props).forEach(function (key) {
        var prop = props[key];
        if (prop) {
          if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(prop, 'type')) {
            var newProp = {};
            if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(prop, 'optionalTypes')) {
              newProp.type = [prop.type].concat(_toConsumableArray(prop.optionalTypes));
            } else {
              newProp.type = prop.type;
            }
            if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(prop, 'value')) {
              // vue中对于引用类型数据需要使用函数返回
              newProp.default = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(prop.value) ? function propFn() {
                return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(prop.value).clone;
              } : prop.value;
            }
            props[key] = newProp;
          } else {
            props[key] = prop;
          }
        }
      });
      options.props = props;
      delete options.properties;
    }
    notSupportTip(options);
  }
});

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/core/implement.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   implement: function() { return /* binding */ implement; },
/* harmony export */   implemented: function() { return /* binding */ implemented; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");

var implemented = {};
function implement(name) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$modes = _ref.modes,
    modes = _ref$modes === void 0 ? [] : _ref$modes,
    _ref$processor = _ref.processor,
    processor = _ref$processor === void 0 ? _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.noop : _ref$processor,
    _ref$remove = _ref.remove,
    remove = _ref$remove === void 0 ? false : _ref$remove;
  if (!name) return;
  if (modes.indexOf("ios") > -1) {
    processor();
    implemented[name] = {
      remove: remove
    };
  }
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/core/injectMixins.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearInjectMixins: function() { return /* binding */ clearInjectMixins; },
/* harmony export */   injectMixins: function() { return /* binding */ injectMixins; },
/* harmony export */   mergeInjectedMixins: function() { return /* binding */ mergeInjectedMixins; }
/* harmony export */ });
/* harmony import */ var lodash_flatten_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/lodash/flatten.js");
/* harmony import */ var lodash_flatten_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_flatten_js__WEBPACK_IMPORTED_MODULE_0__);

var mixinsQueueMap = {
  app: [[], []],
  page: [[], []],
  component: [[], []]
};
function clearInjectMixins() {
  mixinsQueueMap.app = [[], []];
  mixinsQueueMap.page = [[], []];
  mixinsQueueMap.component = [[], []];
}
function injectMixins(mixins) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (typeof options === 'string' || Array.isArray(options)) {
    options = {
      types: options
    };
  }
  var types = options.types || ['page', 'component'];
  var stage = options.stage || -1;
  if (typeof types === 'string') {
    types = [types];
  }
  if (!Array.isArray(mixins)) {
    mixins = [mixins];
  }
  mixins.stage = stage;
  types.forEach(function (type) {
    var mixinsQueue = stage < 0 ? mixinsQueueMap[type][0] : mixinsQueueMap[type][1];
    for (var i = 0; i <= mixinsQueue.length; i++) {
      if (i === mixinsQueue.length) {
        mixinsQueue.push(mixins);
        break;
      }
      var item = mixinsQueue[i];
      if (mixins === item) break;
      if (stage < item.stage) {
        mixinsQueue.splice(i, 0, mixins);
        break;
      }
    }
  });
  return this;
}
function mergeInjectedMixins(options, type) {
  var before = lodash_flatten_js__WEBPACK_IMPORTED_MODULE_0___default()(mixinsQueueMap[type][0]);
  var middle = options.mixins || [];
  var after = lodash_flatten_js__WEBPACK_IMPORTED_MODULE_0___default()(mixinsQueueMap[type][1]);
  var mixins = before.concat(middle).concat(after);
  if (mixins.length) {
    options.mixins = mixins;
  }
  return options;
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/core/innerLifecycle.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BEFORECREATE: function() { return /* binding */ BEFORECREATE; },
/* harmony export */   BEFOREMOUNT: function() { return /* binding */ BEFOREMOUNT; },
/* harmony export */   BEFOREUNMOUNT: function() { return /* binding */ BEFOREUNMOUNT; },
/* harmony export */   BEFOREUPDATE: function() { return /* binding */ BEFOREUPDATE; },
/* harmony export */   CREATED: function() { return /* binding */ CREATED; },
/* harmony export */   INNER_LIFECYCLES: function() { return /* binding */ INNER_LIFECYCLES; },
/* harmony export */   MOUNTED: function() { return /* binding */ MOUNTED; },
/* harmony export */   ONHIDE: function() { return /* binding */ ONHIDE; },
/* harmony export */   ONLOAD: function() { return /* binding */ ONLOAD; },
/* harmony export */   ONRESIZE: function() { return /* binding */ ONRESIZE; },
/* harmony export */   ONSHOW: function() { return /* binding */ ONSHOW; },
/* harmony export */   SERVERPREFETCH: function() { return /* binding */ SERVERPREFETCH; },
/* harmony export */   UNMOUNTED: function() { return /* binding */ UNMOUNTED; },
/* harmony export */   UPDATED: function() { return /* binding */ UPDATED; }
/* harmony export */ });
var BEFORECREATE = '__beforeCreate__';
var CREATED = '__created__';
var BEFOREMOUNT = '__beforeMount__';
var MOUNTED = '__mounted__';
var BEFOREUPDATE = '__beforeUpdate__';
var UPDATED = '__updated__';
var BEFOREUNMOUNT = '__beforeUnmount__';
var UNMOUNTED = '__unmounted__';
var ONLOAD = '__onLoad__';
var ONSHOW = '__onShow__';
var ONHIDE = '__onHide__';
var ONRESIZE = '__onResize__';
var SERVERPREFETCH = '__serverPrefetch__';
var INNER_LIFECYCLES = [BEFORECREATE, CREATED, BEFOREMOUNT, MOUNTED, BEFOREUPDATE, UPDATED, BEFOREUNMOUNT, SERVERPREFETCH, UNMOUNTED, ONLOAD, ONSHOW, ONHIDE, ONRESIZE];

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/core/mergeOptions.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ mergeOptions; },
/* harmony export */   getMixin: function() { return /* binding */ getMixin; },
/* harmony export */   mergeArray: function() { return /* binding */ mergeArray; },
/* harmony export */   mergeDefault: function() { return /* binding */ mergeDefault; },
/* harmony export */   mergeHooks: function() { return /* binding */ mergeHooks; },
/* harmony export */   mergeShallowObj: function() { return /* binding */ mergeShallowObj; },
/* harmony export */   mergeToArray: function() { return /* binding */ mergeToArray; }
/* harmony export */ });
/* harmony import */ var _convertor_convertor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/convertor.js");
/* harmony import */ var _platform_patch_builtInKeysMap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/builtInKeysMap.js");
/* harmony import */ var _implement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/implement.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }




var currentHooksMap = {};
var curType;
var convertRule;
var mpxCustomKeysMap;
function mergeOptions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var type = arguments.length > 1 ? arguments[1] : undefined;
  var needConvert = arguments.length > 2 ? arguments[2] : undefined;
  // 缓存混合模式下的自定义属性列表
  mpxCustomKeysMap = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.makeMap)(options.mpxCustomKeysForBlend || []);
  // needConvert为false，表示衔接原生的root配置，那么此时的配置都是当前原生环境支持的配置，不需要转换
  convertRule = (0,_convertor_convertor__WEBPACK_IMPORTED_MODULE_1__.getConvertRule)(needConvert ? options.mpxConvertMode || 'default' : 'local');
  // 微信小程序使用Component创建page
  if (type === 'page' && convertRule.pageMode) {
    curType = convertRule.pageMode;
  } else {
    curType = type;
  }
  currentHooksMap = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.makeMap)(convertRule.lifecycle[curType]);
  var newOptions = {};
  extractMixins(newOptions, options, needConvert);
  if (needConvert) {
    proxyHooks(newOptions);
    // 自定义补充转换函数
    typeof convertRule.convert === 'function' && convertRule.convert(newOptions, type);
    // 当存在lifecycle2时，在转换后将currentHooksMap替换，以确保后续合并hooks时转换后的hooks能够被正确处理
    if (convertRule.lifecycle2) {
      var implementedHooks = convertRule.lifecycle[curType].filter(function (hook) {
        return _implement__WEBPACK_IMPORTED_MODULE_2__.implemented[hook];
      });
      currentHooksMap = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.makeMap)(convertRule.lifecycle2[curType].concat(implementedHooks));
    }
  }
  newOptions.mpxCustomKeysForBlend = Object.keys(mpxCustomKeysMap);
  return transformHOOKS(newOptions);
}
function getMixin() {
  var mixin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // 用于ts反向推导mixin类型
  return mixin;
}
function extractMixins(mergeOptions, options, needConvert) {
  // 如果编译阶段behaviors都被当做mixins处理，那么进行别名替换
  if (options.behaviors && options.behaviors[0] && options.behaviors[0].__mpx_behaviors_to_mixins__) {
    (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.aliasReplace)(options, 'behaviors', 'mixins');
  }
  if (options.mixins) {
    var _iterator = _createForOfIteratorHelper(options.mixins),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var mixin = _step.value;
        if (typeof mixin === 'string') {
          (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)('String-formatted builtin behaviors is not supported to be converted to mixins.', options.mpxFileResource);
        } else {
          extractMixins(mergeOptions, mixin, needConvert);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  // 出于业务兼容考虑暂时不移除pageShow/pageHide
  // options = extractPageShow(options)
  options = extractLifetimes(options);
  options = extractPageHooks(options);
  if (needConvert) {
    options = extractObservers(options);
  }
  mergeMixins(mergeOptions, options);
  return mergeOptions;
}

// function extractPageShow (options) {
//   if (options.pageShow || options.pageHide) {
//     const mixin = {
//       pageLifetimes: {}
//     }
//     if (options.pageShow) {
//       mixin.pageLifetimes.show = options.pageShow
//       delete options.pageShow
//     }
//     if (options.pageHide) {
//       mixin.pageLifetimes.hide = options.pageHide
//       delete options.pageHide
//     }
//     mergeToArray(options, mixin, 'pageLifetimes')
//   }
//   return options
// }

function extractLifetimes(options) {
  if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(options.lifetimes)) {
    var newOptions = Object.assign({}, options, options.lifetimes);
    delete newOptions.lifetimes;
    return newOptions;
  } else {
    return options;
  }
}
function extractObservers(options) {
  var observers = options.observers;
  var props = Object.assign({}, options.properties, options.props);
  var watch = Object.assign({}, options.watch);
  var extract = false;
  function mergeWatch(key, config) {
    if (watch[key]) {
      if (!Array.isArray(watch[key])) watch[key] = [watch[key]];
    } else {
      watch[key] = [];
    }
    watch[key].push(config);
    extract = true;
  }
  Object.keys(props).forEach(function (key) {
    var prop = props[key];
    if (prop && prop.observer) {
      mergeWatch(key, {
        handler: function handler() {
          var _callback;
          var callback = prop.observer;
          if (typeof callback === 'string') {
            callback = this[callback];
          }
          for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
          }
          typeof callback === 'function' && (_callback = callback).call.apply(_callback, [this].concat(rest));
        },
        deep: true,
        // 延迟触发首次回调，处理转换支付宝时在observer中查询组件的行为，如vant/picker中，如不考虑该特殊情形可用immediate代替
        // immediateAsync: true
        // 为了数据响应的标准化，不再提供immediateAsync选项，之前处理vant等原生组件跨平台转换遇到的问题推荐使用条件编译patch进行处理
        immediate: true
      });
    }
  });
  if (observers) {
    Object.keys(observers).forEach(function (key) {
      var callback = observers[key];
      if (callback) {
        var deep = false;
        var propsArr = Object.keys(props);
        var keyPathArr = [];
        key.split(',').forEach(function (item) {
          var result = item.trim();
          result && keyPathArr.push(result);
        });
        // 针对prop的watch都需要立刻执行一次
        var watchProp = false;
        for (var _i = 0, _propsArr = propsArr; _i < _propsArr.length; _i++) {
          var prop = _propsArr[_i];
          if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.findItem)(keyPathArr, prop)) {
            watchProp = true;
            break;
          }
        }
        if (key.indexOf('.**') > -1) {
          deep = true;
          key = key.replace('.**', '');
        }
        mergeWatch(key, {
          handler: function handler(val, old) {
            var cb = callback;
            if (typeof cb === 'string') {
              cb = this[cb];
            }
            if (typeof cb === 'function') {
              var _cb;
              if (keyPathArr.length < 2) {
                val = [val];
                old = [old];
              }
              (_cb = cb).call.apply(_cb, [this].concat(_toConsumableArray(val), _toConsumableArray(old)));
            }
          },
          deep: deep,
          // immediateAsync: watchProp
          // 为了数据响应的标准化，不再提供immediateAsync选项，之前处理vant等原生组件跨平台转换遇到的问题推荐使用条件编译patch进行处理
          immediate: watchProp
        });
      }
    });
  }
  if (extract) {
    var newOptions = Object.assign({}, options);
    newOptions.watch = watch;
    delete newOptions.observers;
    return newOptions;
  }
  return options;
}
function extractPageHooks(options) {
  if (curType === 'blend') {
    var newOptions = Object.assign({}, options);
    var methods = newOptions.methods;
    var pageHooksMap = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.makeMap)(convertRule.lifecycle.page);
    methods && Object.keys(methods).forEach(function (key) {
      if (pageHooksMap[key]) {
        if (newOptions[key]) {
          (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("Duplicate lifecycle [".concat(key, "] is defined in root options and methods, please check."), options.mpxFileResource);
        }
        newOptions[key] = methods[key];
        delete methods[key];
      }
    });
    return newOptions;
  } else {
    return options;
  }
}
function mergeMixins(parent, child) {
  for (var key in child) {
    if (currentHooksMap[key]) {
      mergeHooks(parent, child, key);
    } else if (/^(data|dataFn)$/.test(key)) {
      mergeDataFn(parent, child, key);
    } else if (/^(computed|properties|props|methods|proto|options|relations|initData)$/.test(key)) {
      mergeShallowObj(parent, child, key);
    } else if (/^(watch|observers|pageLifetimes|events)$/.test(key)) {
      mergeToArray(parent, child, key);
    } else if (/^behaviors|externalClasses$/.test(key)) {
      mergeArray(parent, child, key);
    } else if (key !== 'mixins' && key !== 'mpxCustomKeysForBlend') {
      // 收集非函数的自定义属性，在Component创建的页面中挂载到this上，模拟Page创建页面的表现，swan当中component构造器也能自动挂载自定义数据，不需要框架模拟挂载
      if (curType === 'blend' && typeof child[key] !== 'function' && !_platform_patch_builtInKeysMap__WEBPACK_IMPORTED_MODULE_3__["default"][key] && "ios" !== 'swan') {
        mpxCustomKeysMap[key] = true;
      }
      mergeDefault(parent, child, key);
    }
  }
}
function mergeDefault(parent, child, key) {
  parent[key] = child[key];
}
function mergeHooks(parent, child, key) {
  if (parent[key]) {
    parent[key].push(child[key]);
  } else {
    parent[key] = [child[key]];
  }
}
function mergeShallowObj(parent, child, key) {
  var parentVal = parent[key];
  var childVal = child[key];
  if (!parentVal) {
    parent[key] = parentVal = {};
  }
  Object.assign(parentVal, childVal);
}
function mergeDataFn(parent, child, key) {
  var parentVal = parent[key];
  var childVal = child[key];
  if (typeof parentVal === 'function' && key === 'data') {
    parent.dataFn = parentVal;
    delete parent.data;
  }
  if (typeof childVal !== 'function') {
    mergeShallowObj(parent, child, 'data');
  } else {
    parentVal = parent.dataFn;
    if (!parentVal) {
      parent.dataFn = childVal;
    } else {
      parent.dataFn = function mergeFn() {
        var to = parentVal.call(this);
        var from = childVal.call(this);
        return Object.assign(to, from);
      };
    }
  }
}
function mergeArray(parent, child, key) {
  var childVal = child[key];
  if (!parent[key]) {
    parent[key] = [];
  }
  parent[key] = parent[key].concat(childVal);
}
function mergeToArray(parent, child, key) {
  var parentVal = parent[key];
  var childVal = child[key];
  if (!parentVal) {
    parent[key] = parentVal = {};
  }
  Object.keys(childVal).forEach(function (key) {
    if (key in parentVal) {
      var _parent = parentVal[key];
      var _child = childVal[key];
      if (!Array.isArray(_parent)) {
        _parent = [_parent];
      }
      if (!Array.isArray(_child)) {
        _child = [_child];
      }
      parentVal[key] = _parent.concat(_child);
    } else {
      parentVal[key] = Array.isArray(childVal[key]) ? childVal[key] : [childVal[key]];
    }
  });
}
function composeHooks(target, includes) {
  Object.keys(target).forEach(function (key) {
    if (!includes || includes[key]) {
      var hooks = target[key];
      if (Array.isArray(hooks)) {
        target[key] = function () {
          var result;
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          for (var i = 0; i < hooks.length; i++) {
            if (typeof hooks[i] === 'function') {
              var data = hooks[i].apply(this, args);
              data !== undefined && (result = data);
            }
          }
          return result;
        };
      }
    }
  });
}
function proxyHooks(options) {
  var lifecycleProxyMap = convertRule.lifecycleProxyMap;
  lifecycleProxyMap && Object.keys(lifecycleProxyMap).forEach(function (key) {
    var newHooks = (options[key] || []).slice();
    var proxyArr = lifecycleProxyMap[key];
    proxyArr && proxyArr.forEach(function (lifecycle) {
      if (options[lifecycle] && currentHooksMap[lifecycle]) {
        newHooks.push.apply(newHooks, options[lifecycle]);
        delete options[lifecycle];
      }
    });
    newHooks.length && (options[key] = newHooks);
  });
}
function transformHOOKS(options) {
  composeHooks(options, currentHooksMap);
  options.pageLifetimes && composeHooks(options.pageLifetimes);
  options.events && composeHooks(options.events);
  if (curType === 'blend' && convertRule.support) {
    var componentHooksMap = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.makeMap)(convertRule.lifecycle.component);
    for (var key in options) {
      // 使用Component创建page实例，页面专属生命周期&自定义方法需写在methods内部
      if (typeof options[key] === 'function' && key !== 'dataFn' && key !== 'setup' && key !== 'serverPrefetch' && !componentHooksMap[key]) {
        if (!options.methods) options.methods = {};
        options.methods[key] = options[key];
        delete options[key];
      }
    }
  }
  return options;
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/core/proxy.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHook: function() { return /* binding */ createHook; },
/* harmony export */   currentInstance: function() { return /* binding */ currentInstance; },
/* harmony export */   "default": function() { return /* binding */ MpxProxy; },
/* harmony export */   getCurrentInstance: function() { return /* binding */ getCurrentInstance; },
/* harmony export */   injectHook: function() { return /* binding */ injectHook; },
/* harmony export */   onAddToFavorites: function() { return /* binding */ onAddToFavorites; },
/* harmony export */   onBeforeMount: function() { return /* binding */ onBeforeMount; },
/* harmony export */   onBeforeUnmount: function() { return /* binding */ onBeforeUnmount; },
/* harmony export */   onBeforeUpdate: function() { return /* binding */ onBeforeUpdate; },
/* harmony export */   onHide: function() { return /* binding */ onHide; },
/* harmony export */   onLoad: function() { return /* binding */ onLoad; },
/* harmony export */   onMounted: function() { return /* binding */ onMounted; },
/* harmony export */   onPageScroll: function() { return /* binding */ onPageScroll; },
/* harmony export */   onPullDownRefresh: function() { return /* binding */ onPullDownRefresh; },
/* harmony export */   onReachBottom: function() { return /* binding */ onReachBottom; },
/* harmony export */   onResize: function() { return /* binding */ onResize; },
/* harmony export */   onSaveExitState: function() { return /* binding */ onSaveExitState; },
/* harmony export */   onServerPrefetch: function() { return /* binding */ onServerPrefetch; },
/* harmony export */   onShareAppMessage: function() { return /* binding */ onShareAppMessage; },
/* harmony export */   onShareTimeline: function() { return /* binding */ onShareTimeline; },
/* harmony export */   onShow: function() { return /* binding */ onShow; },
/* harmony export */   onTabItemTap: function() { return /* binding */ onTabItemTap; },
/* harmony export */   onUnmounted: function() { return /* binding */ onUnmounted; },
/* harmony export */   onUpdated: function() { return /* binding */ onUpdated; },
/* harmony export */   setCurrentInstance: function() { return /* binding */ setCurrentInstance; },
/* harmony export */   unsetCurrentInstance: function() { return /* binding */ unsetCurrentInstance; }
/* harmony export */ });
/* harmony import */ var _observer_reactive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/reactive.js");
/* harmony import */ var _observer_effect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/effect.js");
/* harmony import */ var _platform_export_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/effectScope.js");
/* harmony import */ var _observer_watch__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/watch.js");
/* harmony import */ var _observer_computed__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/computed.js");
/* harmony import */ var _observer_scheduler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/scheduler.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/index.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _innerLifecycle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/innerLifecycle.js");
/* harmony import */ var _dynamic_astCache__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@mpxjs/core/src/dynamic/astCache.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }











var uid = 0;
var envObj = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getEnvObj)();
var RenderTask = /*#__PURE__*/_createClass(function RenderTask(instance) {
  var _this = this;
  _classCallCheck(this, RenderTask);
  _defineProperty(this, "resolved", false);
  instance.currentRenderTask = this;
  this.promise = new Promise(function (resolve) {
    _this.resolve = resolve;
  }).then(function () {
    _this.resolved = true;
  });
});
/**
 * process renderData, remove sub node if visit parent node already
 * @param {Object} renderData
 * @return {Object} processedRenderData
 */
function preProcessRenderData(renderData) {
  // method for get key path array
  var processKeyPathMap = function processKeyPathMap(keyPathMap) {
    var keyPath = Object.keys(keyPathMap);
    return keyPath.filter(function (keyA) {
      return keyPath.every(function (keyB) {
        if (keyA.startsWith(keyB) && keyA !== keyB) {
          var nextChar = keyA[keyB.length];
          if (nextChar === '.' || nextChar === '[') {
            return false;
          }
        }
        return true;
      });
    });
  };
  var processedRenderData = {};
  var renderDataFinalKey = processKeyPathMap(renderData);
  Object.keys(renderData).forEach(function (item) {
    if (renderDataFinalKey.indexOf(item) > -1) {
      processedRenderData[item] = renderData[item];
    }
  });
  return processedRenderData;
}
var MpxProxy = /*#__PURE__*/function () {
  function MpxProxy(options, target, reCreated) {
    _classCallCheck(this, MpxProxy);
    this.target = target;
    // 兼容 getCurrentInstance.proxy
    this.proxy = target;
    this.reCreated = reCreated;
    this.uid = uid++;
    this.name = options.name || '';
    this.options = options;
    // beforeCreate -> created -> mounted -> unmounted
    this.state = _innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.BEFORECREATE;
    this.ignoreProxyMap = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.makeMap)(_index__WEBPACK_IMPORTED_MODULE_2__["default"].config.ignoreProxyWhiteList);
    // 收集setup中动态注册的hooks，小程序与web环境都需要
    this.hooks = {};
    if (true) {
      this.scope = (0,_platform_export_index__WEBPACK_IMPORTED_MODULE_3__.effectScope)(true);
      // props响应式数据代理
      this.props = {};
      // data响应式数据代理
      this.data = {};
      // 非props key
      this.localKeysMap = {};
      // 渲染函数中收集的数据
      this.renderData = {};
      // 最小渲染数据
      this.miniRenderData = {};
      // 强制更新的数据
      this.forceUpdateData = {};
      // 下次是否需要强制更新全部渲染数据
      this.forceUpdateAll = false;
      this.currentRenderTask = null;
      this.propsUpdatedFlag = false;
      // react专用，正确触发updated钩子
      this.pendingUpdatedFlag = false;
    }
    this.initApi();
  }
  return _createClass(MpxProxy, [{
    key: "created",
    value: function created() {
      if (false) {}
      if (true) {
        // web中BEFORECREATE钩子通过vue的beforeCreate钩子单独驱动
        this.callHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.BEFORECREATE);
        setCurrentInstance(this);
        this.initProps();
        this.initSetup();
        this.initData();
        this.initComputed();
        this.initWatch();
        unsetCurrentInstance();
      }
      this.state = _innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.CREATED;
      this.callHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.CREATED);
      if (false) {}
      if (this.reCreated) {
        (0,_observer_scheduler__WEBPACK_IMPORTED_MODULE_4__.nextTick)(this.mounted.bind(this));
      }
    }
  }, {
    key: "createRenderTask",
    value: function createRenderTask(isEmptyRender) {
      if (!this.isMounted() && this.currentRenderTask || this.isMounted() && isEmptyRender) {
        return;
      }
      return new RenderTask(this);
    }
  }, {
    key: "isMounted",
    value: function isMounted() {
      return this.state === _innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.MOUNTED;
    }
  }, {
    key: "mounted",
    value: function mounted() {
      if (this.state === _innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.CREATED) {
        // 用于处理refs等前置工作
        this.callHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.BEFOREMOUNT);
        this.state = _innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.MOUNTED;
        this.callHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.MOUNTED);
        this.currentRenderTask && this.currentRenderTask.resolve();
      }
    }
  }, {
    key: "propsUpdated",
    value: function propsUpdated() {
      var _this2 = this;
      this.propsUpdatedFlag = true;
      var updateJob = this.updateJob || (this.updateJob = function () {
        var _this2$currentRenderT;
        _this2.propsUpdatedFlag = false;
        // 只有当前没有渲染任务时，属性更新才需要单独触发updated，否则可以由渲染任务触发updated
        if ((_this2$currentRenderT = _this2.currentRenderTask) !== null && _this2$currentRenderT !== void 0 && _this2$currentRenderT.resolved && _this2.isMounted()) {
          _this2.callHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.BEFOREUPDATE);
          _this2.callHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.UPDATED);
        }
      });
      (0,_observer_scheduler__WEBPACK_IMPORTED_MODULE_4__.nextTick)(updateJob);
    }
  }, {
    key: "unmounted",
    value: function unmounted() {
      var _this$scope;
      if (false) {}
      this.callHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.BEFOREUNMOUNT);
      (_this$scope = this.scope) === null || _this$scope === void 0 || _this$scope.stop();
      if (this.update) this.update.active = false;
      this.callHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.UNMOUNTED);
      this.state = _innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.UNMOUNTED;
    }
  }, {
    key: "isUnmounted",
    value: function isUnmounted() {
      return this.state === _innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.UNMOUNTED;
    }
  }, {
    key: "createProxyConflictHandler",
    value: function createProxyConflictHandler(owner) {
      var _this3 = this;
      return function (key) {
        if (_this3.ignoreProxyMap[key]) {
          !_this3.reCreated && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("The ".concat(owner, " key [").concat(key, "] is a reserved keyword of miniprogram, please check and rename it."), _this3.options.mpxFileResource);
          return false;
        }
        !_this3.reCreated && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("The ".concat(owner, " key [").concat(key, "] exist in the current instance already, please check and rename it."), _this3.options.mpxFileResource);
      };
    }
  }, {
    key: "initApi",
    value: function initApi() {
      // 挂载扩展属性到实例上
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.proxy)(this.target, _index__WEBPACK_IMPORTED_MODULE_2__["default"].prototype, undefined, true, this.createProxyConflictHandler('mpx.prototype'));
      // 挂载混合模式下createPage中的自定义属性，模拟原生Page构造器的表现
      if (this.options.__type__ === 'page' && !this.options.__pageCtor__) {
        (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.proxy)(this.target, this.options, this.options.mpxCustomKeysForBlend, false, this.createProxyConflictHandler('page options'));
      }
      // 挂载$rawOptions
      this.target.$rawOptions = this.options;
      if (true) {
        // 挂载$watch
        this.target.$watch = this.watch.bind(this);
        // 强制执行render
        this.target.$forceUpdate = this.forceUpdate.bind(this);
        this.target.$nextTick = _observer_scheduler__WEBPACK_IMPORTED_MODULE_4__.nextTick;
      }
    }
  }, {
    key: "initProps",
    value: function initProps() {
      if (true) {
        // react模式下props内部对象透传无需深clone，依赖对象深层的数据响应触发子组件更新
        this.props = this.target.__getProps();
      } else {}
      (0,_observer_reactive__WEBPACK_IMPORTED_MODULE_5__.reactive)(this.props);
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.proxy)(this.target, this.props, undefined, false, this.createProxyConflictHandler('props'));
    }
  }, {
    key: "initSetup",
    value: function initSetup() {
      var setup = this.options.setup;
      if (setup) {
        var setupResult = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling)(setup, this, 'setup function', [this.props, {
          triggerEvent: this.target.triggerEvent ? this.target.triggerEvent.bind(this.target) : _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.noop,
          refs: this.target.$refs,
          asyncRefs: this.target.$asyncRefs,
          forceUpdate: this.forceUpdate.bind(this),
          selectComponent: this.target.selectComponent.bind(this.target),
          selectAllComponents: this.target.selectAllComponents.bind(this.target),
          createSelectorQuery: this.target.createSelectorQuery ? this.target.createSelectorQuery.bind(this.target) : envObj.createSelectorQuery.bind(envObj),
          createIntersectionObserver: this.target.createIntersectionObserver ? this.target.createIntersectionObserver.bind(this.target) : envObj.createIntersectionObserver.bind(envObj)
        }]);
        if (!(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(setupResult)) {
          (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("Setup() should return a object, received: ".concat((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.type)(setupResult), "."), this.options.mpxFileResource);
          return;
        }
        (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.proxy)(this.target, setupResult, undefined, false, this.createProxyConflictHandler('setup result'));
        this.collectLocalKeys(setupResult, function (key, val) {
          return !(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(val);
        });
      }
    }
  }, {
    key: "initData",
    value: function initData() {
      var data = this.options.data;
      var dataFn = this.options.dataFn;
      // 之所以没有直接使用initialData，而是通过对原始dataOpt进行深clone获取初始数据对象，主要是为了避免小程序自身序列化时错误地转换数据对象，比如将promise转为普通object
      this.data = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(data || {}).clone;
      // 执行dataFn
      if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(dataFn)) {
        Object.assign(this.data, (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling)(dataFn.bind(this.target), this, 'data function'));
      }
      (0,_observer_reactive__WEBPACK_IMPORTED_MODULE_5__.reactive)(this.data);
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.proxy)(this.target, this.data, undefined, false, this.createProxyConflictHandler('data'));
      this.collectLocalKeys(this.data);
    }
  }, {
    key: "initComputed",
    value: function initComputed() {
      var _this4 = this;
      var computedOpt = this.options.computed;
      if (computedOpt) {
        var computedObj = {};
        Object.entries(computedOpt).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            opt = _ref2[1];
          var get = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(opt) ? opt.bind(_this4.target) : (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(opt.get) ? opt.get.bind(_this4.target) : _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.noop;
          var set = !(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(opt) && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(opt.set) ? opt.set.bind(_this4.target) : function () {
            return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("Write operation failed: computed property \"".concat(key, "\" is readonly."), _this4.options.mpxFileResource);
          };
          computedObj[key] = (0,_observer_computed__WEBPACK_IMPORTED_MODULE_6__.computed)({
            get: get,
            set: set
          });
        });
        this.collectLocalKeys(computedObj);
        (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.proxy)(this.target, computedObj, undefined, false, this.createProxyConflictHandler('computed'));
      }
    }
  }, {
    key: "initWatch",
    value: function initWatch() {
      var _this5 = this;
      var watch = this.options.watch;
      if (watch) {
        Object.entries(watch).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            handler = _ref4[1];
          if (Array.isArray(handler)) {
            for (var i = 0; i < handler.length; i++) {
              _this5.watch(key, handler[i]);
            }
          } else {
            _this5.watch(key, handler);
          }
        });
      }
    }
  }, {
    key: "watch",
    value: function watch(source, cb, options) {
      var target = this.target;
      var getter = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isString)(source) ? function () {
        // for watch multi path string like 'a.b,c,d'
        if (source.indexOf(',') > -1) {
          return source.split(',').map(function (path) {
            return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getByPath)(target, path.trim());
          });
        } else {
          return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getByPath)(target, source);
        }
      } : source.bind(target);
      if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(cb)) {
        options = cb;
        cb = cb.handler;
      }
      if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isString)(cb) && target[cb]) {
        cb = target[cb];
      }
      cb = cb || _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.noop;
      var cur = currentInstance;
      setCurrentInstance(this);
      var res = (0,_observer_watch__WEBPACK_IMPORTED_MODULE_7__.watch)(getter, cb.bind(target), options);
      if (cur) setCurrentInstance(cur);else unsetCurrentInstance();
      return res;
    }
  }, {
    key: "collectLocalKeys",
    value: function collectLocalKeys(data) {
      var _this6 = this;
      var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return true;
      };
      Object.keys(data).filter(function (key) {
        return filter(key, data[key]);
      }).forEach(function (key) {
        _this6.localKeysMap[key] = true;
      });
    }
  }, {
    key: "callHook",
    value: function callHook(hookName, params, hooksOnly) {
      var hook = this.options[hookName];
      var hooks = this.hooks[hookName] || [];
      var result;
      if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(hook) && !hooksOnly) {
        result = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling)(hook.bind(this.target), this, "".concat(hookName, " hook"), params);
      }
      hooks.forEach(function (hook) {
        result = params ? hook.apply(void 0, _toConsumableArray(params)) : hook();
      });
      return result;
    }
  }, {
    key: "hasHook",
    value: function hasHook(hookName) {
      return !!(this.options[hookName] || this.hooks[hookName]);
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;
      var renderData = {};
      Object.keys(this.localKeysMap).forEach(function (key) {
        renderData[key] = _this7.target[key];
      });
      this.doRender(this.processRenderDataWithStrictDiff(renderData));
    }
  }, {
    key: "renderWithData",
    value: function renderWithData(skipPre, vnode) {
      if (vnode) {
        return this.doRenderWithVNode(vnode);
      }
      var renderData = skipPre ? this.renderData : preProcessRenderData(this.renderData);
      this.doRender(this.processRenderDataWithStrictDiff(renderData));
      // 重置renderData准备下次收集
      this.renderData = {};
    }
  }, {
    key: "processRenderDataWithDiffData",
    value: function processRenderDataWithDiffData(result, key, diffData) {
      Object.keys(diffData).forEach(function (subKey) {
        result[key + subKey] = diffData[subKey];
      });
    }
  }, {
    key: "processRenderDataWithStrictDiff",
    value: function processRenderDataWithStrictDiff(renderData) {
      var _this8 = this;
      var result = {};
      var _loop = function _loop(key) {
        if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(renderData, key)) {
          var data = renderData[key];
          var firstKey = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getFirstKey)(key);
          if (!_this8.localKeysMap[firstKey]) {
            return 1; // continue
          }
          // 外部clone，用于只需要clone的场景
          var clone;
          if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(_this8.miniRenderData, key)) {
            var _diffAndCloneA = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(data, _this8.miniRenderData[key]),
              localClone = _diffAndCloneA.clone,
              diff = _diffAndCloneA.diff,
              diffData = _diffAndCloneA.diffData;
            clone = localClone;
            if (diff) {
              _this8.miniRenderData[key] = clone;
              if (diffData && _index__WEBPACK_IMPORTED_MODULE_2__["default"].config.useStrictDiff) {
                _this8.processRenderDataWithDiffData(result, key, diffData);
              } else {
                result[key] = clone;
              }
            }
          } else {
            var processed = false;
            var miniRenderDataKeys = Object.keys(_this8.miniRenderData);
            for (var i = 0; i < miniRenderDataKeys.length; i++) {
              var tarKey = miniRenderDataKeys[i];
              if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.aIsSubPathOfB)(tarKey, key)) {
                if (!clone) clone = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(data).clone;
                delete _this8.miniRenderData[tarKey];
                _this8.miniRenderData[key] = result[key] = clone;
                processed = true;
                continue;
              }
              var subPath = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.aIsSubPathOfB)(key, tarKey);
              if (subPath) {
                if (!_this8.miniRenderData[tarKey]) _this8.miniRenderData[tarKey] = {};
                // setByPath 更新miniRenderData中的子数据
                (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.doGetByPath)(_this8.miniRenderData[tarKey], subPath, function (current, subKey, meta) {
                  if (meta.isEnd) {
                    var _diffAndCloneA2 = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(data, current[subKey]),
                      _clone = _diffAndCloneA2.clone,
                      _diff = _diffAndCloneA2.diff,
                      _diffData = _diffAndCloneA2.diffData;
                    if (_diff) {
                      current[subKey] = _clone;
                      if (_diffData && _index__WEBPACK_IMPORTED_MODULE_2__["default"].config.useStrictDiff) {
                        _this8.processRenderDataWithDiffData(result, key, _diffData);
                      } else {
                        result[key] = _clone;
                      }
                    }
                  } else if (!current[subKey]) {
                    current[subKey] = {};
                  }
                  return current[subKey];
                });
                processed = true;
                break;
              }
            }
            if (!processed) {
              // 如果当前数据和上次的miniRenderData完全无关，但存在于组件的视图数据中，则与组件视图数据进行diff
              if (_this8.target.data && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(_this8.target.data, firstKey)) {
                var localInitialData = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getByPath)(_this8.target.data, key);
                var _diffAndCloneA3 = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(data, localInitialData),
                  _clone2 = _diffAndCloneA3.clone,
                  _diff2 = _diffAndCloneA3.diff,
                  _diffData2 = _diffAndCloneA3.diffData;
                _this8.miniRenderData[key] = _clone2;
                if (_diff2) {
                  if (_diffData2 && _index__WEBPACK_IMPORTED_MODULE_2__["default"].config.useStrictDiff) {
                    _this8.processRenderDataWithDiffData(result, key, _diffData2);
                  } else {
                    result[key] = _clone2;
                  }
                }
              } else {
                if (!clone) clone = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(data).clone;
                _this8.miniRenderData[key] = result[key] = clone;
              }
            }
          }
          if (_this8.forceUpdateAll) {
            if (!clone) clone = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(data).clone;
            _this8.forceUpdateData[key] = clone;
          }
        }
      };
      for (var key in renderData) {
        if (_loop(key)) continue;
      }
      return result;
    }
  }, {
    key: "doRenderWithVNode",
    value: function doRenderWithVNode(vnode) {
      if (!this._vnode) {
        this.target.__render({
          r: vnode
        });
      } else {
        var diffPath = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(vnode, this._vnode).diffData;
        if (!(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isEmptyObject)(diffPath)) {
          // 构造 diffPath 数据
          diffPath = Object.keys(diffPath).reduce(function (preVal, curVal) {
            var key = 'r' + curVal;
            preVal[key] = diffPath[curVal];
            return preVal;
          }, {});
          this.target.__render(diffPath);
        }
      }
      // 缓存本地的 vnode 用以下一次 diff
      this._vnode = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(vnode).clone;
    }
  }, {
    key: "doRender",
    value: function doRender(data, cb) {
      var _this9 = this;
      if (typeof this.target.__render !== 'function') {
        (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)('Please specify a [__render] function to render view.', this.options.mpxFileResource);
        return;
      }
      if (typeof cb !== 'function') {
        cb = undefined;
      }
      var isEmpty = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isEmptyObject)(data) && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isEmptyObject)(this.forceUpdateData);
      var renderTask = this.createRenderTask(isEmpty);
      if (isEmpty) {
        cb && cb();
        return;
      }
      (0,_observer_effect__WEBPACK_IMPORTED_MODULE_8__.pauseTracking)();
      // 使用forceUpdateData后清空
      if (!(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isEmptyObject)(this.forceUpdateData)) {
        data = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.mergeData)({}, data, this.forceUpdateData);
        this.forceUpdateData = {};
        this.forceUpdateAll = false;
      }
      var callback = cb;
      // mounted之后才会触发BEFOREUPDATE/UPDATED
      if (this.isMounted()) {
        this.callHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.BEFOREUPDATE);
        callback = function callback() {
          cb && cb();
          _this9.callHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.UPDATED);
          renderTask && renderTask.resolve();
        };
      }
      data = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.processUndefined)(data);
      if (typeof _index__WEBPACK_IMPORTED_MODULE_2__["default"].config.setDataHandler === 'function') {
        try {
          _index__WEBPACK_IMPORTED_MODULE_2__["default"].config.setDataHandler(data, this.target);
        } catch (e) {}
      }
      this.target.__render(data, callback);
      (0,_observer_effect__WEBPACK_IMPORTED_MODULE_8__.resetTracking)();
    }
  }, {
    key: "toggleRecurse",
    value: function toggleRecurse(allowed) {
      if (this.effect && this.update) this.effect.allowRecurse = this.update.allowRecurse = allowed;
    }
  }, {
    key: "updatePreRender",
    value: function updatePreRender() {
      this.toggleRecurse(false);
      (0,_observer_effect__WEBPACK_IMPORTED_MODULE_8__.pauseTracking)();
      (0,_observer_scheduler__WEBPACK_IMPORTED_MODULE_4__.flushPreFlushCbs)(this);
      (0,_observer_effect__WEBPACK_IMPORTED_MODULE_8__.resetTracking)();
      this.toggleRecurse(true);
    }
  }, {
    key: "initRender",
    value: function initRender() {
      var _this$target$_g,
        _this$target$__getAst,
        _this10 = this;
      if (this.options.__nativeRender__) return this.doRender();
      var _i = this.target._i.bind(this.target);
      var _c = this.target._c.bind(this.target);
      var _r = this.target._r.bind(this.target);
      var _sc = this.target._sc.bind(this.target);
      var _g = (_this$target$_g = this.target._g) === null || _this$target$_g === void 0 ? void 0 : _this$target$_g.bind(this.target);
      var __getAst = (_this$target$__getAst = this.target.__getAst) === null || _this$target$__getAst === void 0 ? void 0 : _this$target$__getAst.bind(this.target);
      var moduleId = this.target.__moduleId;
      var dynamicTarget = this.target.__dynamic;
      var effect = this.effect = new _observer_effect__WEBPACK_IMPORTED_MODULE_8__.ReactiveEffect(function () {
        // pre render for props update
        if (_this10.propsUpdatedFlag) {
          _this10.updatePreRender();
        }
        if (dynamicTarget || __getAst) {
          try {
            var ast = (0,_dynamic_astCache__WEBPACK_IMPORTED_MODULE_9__.getAst)(__getAst, moduleId);
            return _r(false, _g(ast, moduleId));
          } catch (e) {
            e.errType = 'mpx-dynamic-render';
            e.errmsg = e.message;
            if (true) {
              return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)('Please make sure you have set dynamicRuntime true in mpx webpack plugin config because you have use the dynamic runtime feature.', _this10.options.mpxFileResource, e);
            } else {}
          }
        }
        if (_this10.target.__injectedRender) {
          try {
            return _this10.target.__injectedRender(_i, _c, _r, _sc);
          } catch (e) {
            (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)('Failed to execute render function, degrade to full-set-data mode.', _this10.options.mpxFileResource, e);
            _this10.render();
          }
        } else {
          _this10.render();
        }
      }, function () {
        return (0,_observer_scheduler__WEBPACK_IMPORTED_MODULE_4__.queueJob)(update);
      }, this.scope);
      var update = this.update = effect.run.bind(effect);
      update.id = this.uid;
      // render effect允许自触发
      this.toggleRecurse(true);
      update();
    }
  }, {
    key: "forceUpdate",
    value: function forceUpdate(data, options, callback) {
      var _this11 = this;
      if (this.isUnmounted()) return;
      if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(data)) {
        callback = data;
        data = undefined;
      }
      options = options || {};
      if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(options)) {
        callback = options;
        options = {};
      }
      if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(data)) {
        Object.keys(data).forEach(function (key) {
          if (!_this11.options.__nativeRender__ && !_this11.localKeysMap[(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getFirstKey)(key)]) {
            (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("ForceUpdate data includes a props key [".concat(key, "], which may yield a unexpected result."), _this11.options.mpxFileResource);
          }
          (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.setByPath)(_this11.target, key, data[key]);
        });
        this.forceUpdateData = data;
      } else {
        this.forceUpdateAll = true;
      }
      if (true) {
        // rn中不需要setdata
        this.forceUpdateData = {};
        this.forceUpdateAll = false;
        if (this.update) {
          options.sync ? this.update() : (0,_observer_scheduler__WEBPACK_IMPORTED_MODULE_4__.queueJob)(this.update);
        }
        if (callback) {
          callback = callback.bind(this.target);
          options.sync ? callback() : (0,_observer_scheduler__WEBPACK_IMPORTED_MODULE_4__.nextTick)(callback);
        }
        return;
      }
      if (this.effect) {
        options.sync ? this.effect.run() : this.effect.update();
      } else {
        if (this.forceUpdateAll) {
          Object.keys(this.localKeysMap).forEach(function (key) {
            _this11.forceUpdateData[key] = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(_this11.target[key]).clone;
          });
        }
        options.sync ? this.doRender() : (0,_observer_scheduler__WEBPACK_IMPORTED_MODULE_4__.queueJob)(this.doRender.bind(this));
      }
      if (callback) {
        callback = callback.bind(this.target);
        var doCallback = function doCallback() {
          var _this11$currentRender;
          if (((_this11$currentRender = _this11.currentRenderTask) === null || _this11$currentRender === void 0 ? void 0 : _this11$currentRender.resolved) === false) {
            _this11.currentRenderTask.promise.then(callback);
          } else {
            callback();
          }
        };
        options.sync ? doCallback() : (0,_observer_scheduler__WEBPACK_IMPORTED_MODULE_4__.nextTick)(doCallback);
      }
    }
  }]);
}();

var currentInstance = null;
var getCurrentInstance = function getCurrentInstance() {
  return currentInstance;
};
var setCurrentInstance = function setCurrentInstance(instance) {
  var _instance$scope;
  currentInstance = instance;
  instance === null || instance === void 0 || (_instance$scope = instance.scope) === null || _instance$scope === void 0 || _instance$scope.on();
};
var unsetCurrentInstance = function unsetCurrentInstance() {
  var _currentInstance;
  (_currentInstance = currentInstance) === null || _currentInstance === void 0 || (_currentInstance = _currentInstance.scope) === null || _currentInstance === void 0 || _currentInstance.off();
  currentInstance = null;
};
var injectHook = function injectHook(hookName, hook) {
  var instance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : currentInstance;
  if (instance) {
    var wrappedHook = function wrappedHook() {
      if (instance.isUnmounted()) return;
      setCurrentInstance(instance);
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var res = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling)(hook, instance, "".concat(hookName, " hook"), args);
      unsetCurrentInstance();
      return res;
    };
    if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(hook)) (instance.hooks[hookName] || (instance.hooks[hookName] = [])).push(wrappedHook);
  }
};
var createHook = function createHook(hookName) {
  return function (hook, instance) {
    return injectHook(hookName, hook, instance);
  };
};
// 在代码中调用以下生命周期钩子时, 将生命周期钩子注入到mpxProxy实例上
var onBeforeMount = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.BEFOREMOUNT);
var onMounted = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.MOUNTED);
var onBeforeUpdate = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.BEFOREUPDATE);
var onUpdated = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.UPDATED);
var onBeforeUnmount = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.BEFOREUNMOUNT);
var onUnmounted = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.UNMOUNTED);
var onLoad = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.ONLOAD);
var onShow = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.ONSHOW);
var onHide = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.ONHIDE);
var onResize = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.ONRESIZE);
var onServerPrefetch = createHook(_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.SERVERPREFETCH);
var onPullDownRefresh = createHook('__onPullDownRefresh__');
var onReachBottom = createHook('__onReachBottom__');
var onShareAppMessage = createHook('__onShareAppMessage__');
var onShareTimeline = createHook('__onShareTimeline__');
var onAddToFavorites = createHook('__onAddToFavorites__');
var onPageScroll = createHook('__onPageScroll__');
var onTabItemTap = createHook('__onTabItemTap__');
var onSaveExitState = createHook('__onSaveExitState__');

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/core/transferOptions.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ transferOptions; }
/* harmony export */ });
/* harmony import */ var _injectMixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/injectMixins.js");
/* harmony import */ var _mergeOptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/mergeOptions.js");
/* harmony import */ var _convertor_getConvertMode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/getConvertMode.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");




function transferOptions(options, type) {
  var needConvert = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var currentInject;
  if (__webpack_require__.g.currentInject && __webpack_require__.g.currentInject.moduleId === __webpack_require__.g.currentModuleId) {
    currentInject = __webpack_require__.g.currentInject;
  } else {
    currentInject = {
      moduleId: __webpack_require__.g.currentModuleId
    };
  }
  // 文件编译路径
  options.mpxFileResource = __webpack_require__.g.currentResource;
  // 注入全局写入的mixins，原生模式下不进行注入
  if (!options.__nativeRender__) {
    options = (0,_injectMixins__WEBPACK_IMPORTED_MODULE_1__.mergeInjectedMixins)(options, type);
  }
  if (currentInject && currentInject.injectComputed) {
    // 编译计算属性注入
    options.computed = Object.assign({}, currentInject.injectComputed, options.computed);
  }
  if (currentInject && currentInject.injectMethods) {
    // 编译methods注入
    options.methods = Object.assign({}, currentInject.injectMethods, options.methods);
  }
  if (currentInject && currentInject.injectOptions) {
    // 编译options注入,优先微信中的单独配置
    options.options = Object.assign({}, currentInject.injectOptions, options.options);
  }
  if (currentInject && currentInject.pageEvents) {
    options.mixins = options.mixins || [];
    // 驱动层视作用户本地逻辑，作为最后的mixin来执行
    options.mixins.push(currentInject.pageEvents);
  }
  // 转换mode
  options.mpxConvertMode = options.mpxConvertMode || (0,_convertor_getConvertMode__WEBPACK_IMPORTED_MODULE_2__.getConvertMode)(__webpack_require__.g.currentSrcMode);
  var rawOptions = (0,_mergeOptions__WEBPACK_IMPORTED_MODULE_3__["default"])(options, type, needConvert);
  if (currentInject && currentInject.propKeys) {
    var computedKeys = Object.keys(rawOptions.computed || {});
    // 头条和百度小程序由于props传递为异步操作，通过props向子组件传递computed数据时，子组件无法在初始时(created/attached)获取到computed数据，如需进一步处理数据建议通过watch获取
    currentInject.propKeys.forEach(function (key) {
      if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.findItem)(computedKeys, key)) {
        (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("\u7531\u4E8E\u5E73\u53F0\u673A\u5236\u539F\u56E0\uFF0C\u5B50\u7EC4\u4EF6\u65E0\u6CD5\u5728\u521D\u59CB\u65F6(created/attached)\u83B7\u53D6\u5230\u901A\u8FC7props\u4F20\u9012\u7684\u8BA1\u7B97\u5C5E\u6027[".concat(key, "]\uFF0C\u8BE5\u95EE\u9898\u4E00\u822C\u4E0D\u5F71\u54CD\u6E32\u67D3\uFF0C\u5982\u9700\u8FDB\u4E00\u6B65\u5904\u7406\u6570\u636E\u5EFA\u8BAE\u901A\u8FC7watch\u83B7\u53D6\u3002"), __webpack_require__.g.currentResource);
      }
    });
  }
  return {
    rawOptions: rawOptions,
    currentInject: currentInject
  };
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/dynamic/astCache.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dynamic: function() { return /* binding */ dynamic; },
/* harmony export */   getAst: function() { return /* binding */ getAst; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }

var _astCache = /*#__PURE__*/new WeakMap();
var DynamicAstCache = /*#__PURE__*/function () {
  function DynamicAstCache() {
    _classCallCheck(this, DynamicAstCache);
    _classPrivateFieldInitSpec(this, _astCache, {});
  }
  return _createClass(DynamicAstCache, [{
    key: "getAst",
    value: function getAst(id) {
      return _classPrivateFieldGet(_astCache, this)[id];
    }
  }, {
    key: "setAst",
    value: function setAst(id, ast) {
      _classPrivateFieldGet(_astCache, this)[id] = ast;
    }
  }]);
}();
var dynamic = new DynamicAstCache();
var getAst = function getAst(__getAst, moduleId) {
  if (__getAst && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(__getAst)) {
    var ast = __getAst();
    if (!(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(ast)) return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)('__getAst returned data is not of type object');
    return Object.values(ast)[0];
  } else {
    return dynamic.getAst(moduleId);
  }
};

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/helper/const.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultLocale: function() { return /* binding */ DefaultLocale; },
/* harmony export */   ObKey: function() { return /* binding */ ObKey; },
/* harmony export */   PausedState: function() { return /* binding */ PausedState; },
/* harmony export */   RefKey: function() { return /* binding */ RefKey; }
/* harmony export */ });
var RefKey = '__composition_api_ref_key__';
var ObKey = '__ob__';
var PausedState = {
  paused: 0,
  dirty: 1,
  resumed: 2
};
var DefaultLocale = 'zh-CN';

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BEFORECREATE: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.BEFORECREATE; },
/* harmony export */   BEFOREMOUNT: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.BEFOREMOUNT; },
/* harmony export */   BEFOREUNMOUNT: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.BEFOREUNMOUNT; },
/* harmony export */   BEFOREUPDATE: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.BEFOREUPDATE; },
/* harmony export */   CREATED: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.CREATED; },
/* harmony export */   MOUNTED: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.MOUNTED; },
/* harmony export */   ONHIDE: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.ONHIDE; },
/* harmony export */   ONLOAD: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.ONLOAD; },
/* harmony export */   ONRESIZE: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.ONRESIZE; },
/* harmony export */   ONSHOW: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.ONSHOW; },
/* harmony export */   SERVERPREFETCH: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.SERVERPREFETCH; },
/* harmony export */   UNMOUNTED: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.UNMOUNTED; },
/* harmony export */   UPDATED: function() { return /* reexport safe */ _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__.UPDATED; },
/* harmony export */   computed: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.computed; },
/* harmony export */   createActionsWithThis: function() { return /* reexport safe */ _mpxjs_store__WEBPACK_IMPORTED_MODULE_2__.createActionsWithThis; },
/* harmony export */   createApp: function() { return /* reexport safe */ _platform_index__WEBPACK_IMPORTED_MODULE_4__["default"]; },
/* harmony export */   createComponent: function() { return /* reexport safe */ _platform_index__WEBPACK_IMPORTED_MODULE_6__["default"]; },
/* harmony export */   createGettersWithThis: function() { return /* reexport safe */ _mpxjs_store__WEBPACK_IMPORTED_MODULE_2__.createGettersWithThis; },
/* harmony export */   createMutationsWithThis: function() { return /* reexport safe */ _mpxjs_store__WEBPACK_IMPORTED_MODULE_2__.createMutationsWithThis; },
/* harmony export */   createPage: function() { return /* reexport safe */ _platform_index__WEBPACK_IMPORTED_MODULE_5__["default"]; },
/* harmony export */   createStateWithThis: function() { return /* reexport safe */ _mpxjs_store__WEBPACK_IMPORTED_MODULE_2__.createStateWithThis; },
/* harmony export */   createStore: function() { return /* reexport safe */ _mpxjs_store__WEBPACK_IMPORTED_MODULE_2__.createStore; },
/* harmony export */   createStoreWithThis: function() { return /* reexport safe */ _mpxjs_store__WEBPACK_IMPORTED_MODULE_2__.createStoreWithThis; },
/* harmony export */   customRef: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.customRef; },
/* harmony export */   del: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.del; },
/* harmony export */   dynamic: function() { return /* reexport safe */ _dynamic_astCache__WEBPACK_IMPORTED_MODULE_11__.dynamic; },
/* harmony export */   effectScope: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.effectScope; },
/* harmony export */   getCurrentInstance: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.getCurrentInstance; },
/* harmony export */   getCurrentScope: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.getCurrentScope; },
/* harmony export */   getMixin: function() { return /* reexport safe */ _core_mergeOptions__WEBPACK_IMPORTED_MODULE_10__.getMixin; },
/* harmony export */   implement: function() { return /* reexport safe */ _core_implement__WEBPACK_IMPORTED_MODULE_3__.implement; },
/* harmony export */   isReactive: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.isReactive; },
/* harmony export */   isRef: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.isRef; },
/* harmony export */   markRaw: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.markRaw; },
/* harmony export */   nextTick: function() { return /* reexport safe */ _observer_scheduler__WEBPACK_IMPORTED_MODULE_7__.nextTick; },
/* harmony export */   onAddToFavorites: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onAddToFavorites; },
/* harmony export */   onBeforeMount: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onBeforeMount; },
/* harmony export */   onBeforeUnmount: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onBeforeUnmount; },
/* harmony export */   onBeforeUpdate: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onBeforeUpdate; },
/* harmony export */   onHide: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onHide; },
/* harmony export */   onLoad: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onLoad; },
/* harmony export */   onMounted: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onMounted; },
/* harmony export */   onPageScroll: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onPageScroll; },
/* harmony export */   onPullDownRefresh: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onPullDownRefresh; },
/* harmony export */   onReachBottom: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onReachBottom; },
/* harmony export */   onResize: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onResize; },
/* harmony export */   onSaveExitState: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onSaveExitState; },
/* harmony export */   onScopeDispose: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.onScopeDispose; },
/* harmony export */   onServerPrefetch: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onServerPrefetch; },
/* harmony export */   onShareAppMessage: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onShareAppMessage; },
/* harmony export */   onShareTimeline: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onShareTimeline; },
/* harmony export */   onShow: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onShow; },
/* harmony export */   onTabItemTap: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onTabItemTap; },
/* harmony export */   onUnmounted: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onUnmounted; },
/* harmony export */   onUpdated: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_9__.onUpdated; },
/* harmony export */   reactive: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.reactive; },
/* harmony export */   ref: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.ref; },
/* harmony export */   set: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.set; },
/* harmony export */   shallowReactive: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.shallowReactive; },
/* harmony export */   shallowRef: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.shallowRef; },
/* harmony export */   toPureObject: function() { return /* binding */ toPureObject; },
/* harmony export */   toRef: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.toRef; },
/* harmony export */   toRefs: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.toRefs; },
/* harmony export */   triggerRef: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.triggerRef; },
/* harmony export */   unref: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.unref; },
/* harmony export */   useI18n: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.useI18n; },
/* harmony export */   watch: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.watch; },
/* harmony export */   watchEffect: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.watchEffect; },
/* harmony export */   watchPostEffect: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.watchPostEffect; },
/* harmony export */   watchSyncEffect: function() { return /* reexport safe */ _platform_export_index__WEBPACK_IMPORTED_MODULE_1__.watchSyncEffect; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _platform_export_api__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/export/api.js");
/* harmony import */ var _platform_builtInMixins_i18nMixin__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/builtInMixins/i18nMixin.js");
/* harmony import */ var _platform_export_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/export/index.js");
/* harmony import */ var _mpxjs_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/store/src/index.js");
/* harmony import */ var _core_implement__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/implement.js");
/* harmony import */ var _platform_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/createApp.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _platform_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/createPage.js");
/* harmony import */ var _platform_index__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/createComponent.js");
/* harmony import */ var _observer_scheduler__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/scheduler.js");
/* harmony import */ var _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/innerLifecycle.js");
/* harmony import */ var _core_proxy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/proxy.js");
/* harmony import */ var _core_mergeOptions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/mergeOptions.js");
/* harmony import */ var _dynamic_astCache__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./node_modules/@mpxjs/core/src/dynamic/astCache.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }













function toPureObject(obj) {
  return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.diffAndCloneA)(obj).clone;
}
function extendProps(target, proxyObj, rawProps, option) {
  var keys = Object.getOwnPropertyNames(proxyObj);
  var rawPropsMap = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.makeMap)(rawProps);
  var _iterator = _createForOfIteratorHelper(keys),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;
      if (_platform_export_api__WEBPACK_IMPORTED_MODULE_12__.APIs[key] || rawPropsMap[key]) {
        continue;
      } else if (option && (option.prefix || option.postfix)) {
        var transformKey = option.prefix ? option.prefix + '_' + key : key + '_' + option.postfix;
        target[transformKey] = proxyObj[key];
      } else if (!(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(target, key)) {
        target[key] = proxyObj[key];
      } else {
        (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("Mpx property [".concat(key, "] from installing plugin conflicts with already exists\uFF0Cplease pass prefix/postfix options to avoid property conflict, for example: \"use('plugin', {prefix: 'mm'})\""));
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

// 安装插件进行扩展API
var installedPlugins = [];
function use(plugin) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (installedPlugins.indexOf(plugin) > -1) {
    return this;
  }
  var args = [options];
  var proxyMpx = factory();
  var rawProps = Object.getOwnPropertyNames(proxyMpx);
  var rawPrototypeProps = Object.getOwnPropertyNames(proxyMpx.prototype);
  args.unshift(proxyMpx);
  // 传入真正的mpx对象供插件访问
  args.push(Mpx);
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args);
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args);
  }
  extendProps(Mpx, proxyMpx, rawProps, options);
  extendProps(Mpx.prototype, proxyMpx.prototype, rawPrototypeProps, options);
  installedPlugins.push(plugin);
  return this;
}
_platform_export_api__WEBPACK_IMPORTED_MODULE_12__.APIs.use = use;
function factory() {
  // 作为原型挂载属性的中间层
  function Mpx() {}
  Object.assign(Mpx, _platform_export_api__WEBPACK_IMPORTED_MODULE_12__.APIs);
  Object.assign(Mpx.prototype, _platform_export_api__WEBPACK_IMPORTED_MODULE_12__.InstanceAPIs);
  // 输出web时在mpx上挂载Vue对象
  if (false) {}
  return Mpx;
}
var Mpx = factory();
Mpx.config = {
  useStrictDiff: false,
  ignoreWarning: false,
  ignoreProxyWhiteList: ['id', 'dataset', 'data'],
  observeClassInstance: false,
  errorHandler: null,
  proxyEventHandler: null,
  setDataHandler: null,
  forceFlushSync: false,
  webRouteConfig: {},
  /*
    支持两个属性
    hostWhitelists Array 类型 支持h5域名白名单安全校验
    apiImplementations webview JSSDK接口 例如getlocation
   */
  webviewConfig: {},
  /**
  * react-native 相关配置，用于挂载事件等，如 onShareAppMessage
  */
  rnConfig: {}
};
__webpack_require__.g.__mpx = Mpx;
if (true) {
  if (__webpack_require__.g.i18n) {
    Mpx.i18n = (0,_platform_builtInMixins_i18nMixin__WEBPACK_IMPORTED_MODULE_13__.createI18n)(__webpack_require__.g.i18n);
  }
}
/* harmony default export */ __webpack_exports__["default"] = (Mpx);

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/observer/array.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayMethods: function() { return /* binding */ arrayMethods; }
/* harmony export */ });
/* harmony import */ var _reactive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/reactive.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");


var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.def)(arrayMethods, method, function mutator() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var result = original.apply(this, args);
    var ob = (0,_reactive__WEBPACK_IMPORTED_MODULE_1__.getObserver)(this);
    if (ob) {
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      if (inserted) ob.observeArray(inserted);
      // notify change
      ob.dep.notify();
    }
    return result;
  });
});

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/observer/computed.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computed: function() { return /* binding */ computed; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/dep.js");
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/ref.js");
/* harmony import */ var _effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/effect.js");




function computed(getterOrOptions) {
  var getter, setter;
  if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(getterOrOptions)) {
    getter = getterOrOptions;
    setter = _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.noop;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  // 复用createRef创建computedRef，使用闭包变量存储dirty/value/effect
  var dirty = true;
  var value;
  var effect = new _effect__WEBPACK_IMPORTED_MODULE_1__.ReactiveEffect(getter, function () {
    dirty = true;
  });
  return (0,_ref__WEBPACK_IMPORTED_MODULE_2__.createRef)({
    get: function get() {
      if (dirty) {
        value = effect.run();
        dirty = false;
      }
      if (_dep__WEBPACK_IMPORTED_MODULE_3__["default"].target) {
        effect.depend();
      }
      return value;
    },
    set: function set(val) {
      setter(val);
    }
  }, effect);
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/observer/dep.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Dep; },
/* harmony export */   popTarget: function() { return /* binding */ popTarget; },
/* harmony export */   pushTarget: function() { return /* binding */ pushTarget; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = /*#__PURE__*/function () {
  function Dep() {
    _classCallCheck(this, Dep);
    this.id = uid++;
    this.subs = [];
  }
  return _createClass(Dep, [{
    key: "addSub",
    value: function addSub(sub) {
      this.subs.push(sub);
    }
  }, {
    key: "removeSub",
    value: function removeSub(sub) {
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.remove)(this.subs, sub);
    }
  }, {
    key: "depend",
    value: function depend() {
      if (Dep.target) {
        Dep.target.addDep(this);
      }
    }
  }, {
    key: "notify",
    value: function notify() {
      // stabilize the subscriber list first
      var subs = this.subs.slice();
      for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
      }
    }
  }]);
}(); // the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.

Dep.target = null;
var targetStack = [];
function pushTarget(_target) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}
function popTarget() {
  Dep.target = targetStack.pop();
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/observer/effect.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactiveEffect: function() { return /* binding */ ReactiveEffect; },
/* harmony export */   pauseTracking: function() { return /* binding */ pauseTracking; },
/* harmony export */   resetTracking: function() { return /* binding */ resetTracking; }
/* harmony export */ });
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/dep.js");
/* harmony import */ var _effectScope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/effectScope.js");
/* harmony import */ var _helper_const__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/helper/const.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var uid = 0;
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  var last = trackStack.pop();
  shouldTrack = last === undefined ? true : last;
}
var ReactiveEffect = /*#__PURE__*/function () {
  function ReactiveEffect(fn, scheduler, scope) {
    _classCallCheck(this, ReactiveEffect);
    _defineProperty(this, "active", true);
    _defineProperty(this, "deps", []);
    _defineProperty(this, "newDeps", []);
    _defineProperty(this, "depIds", new Set());
    _defineProperty(this, "newDepIds", new Set());
    _defineProperty(this, "allowRecurse", false);
    this.id = ++uid;
    this.fn = fn;
    this.scheduler = scheduler;
    this.pausedState = _helper_const__WEBPACK_IMPORTED_MODULE_0__.PausedState.resumed;
    (0,_effectScope__WEBPACK_IMPORTED_MODULE_1__.recordEffectScope)(this, scope);
  }

  // run fn and return value
  return _createClass(ReactiveEffect, [{
    key: "run",
    value: function run() {
      if (!this.active) return this.fn();
      var lastShouldTrack = shouldTrack;
      try {
        (0,_dep__WEBPACK_IMPORTED_MODULE_2__.pushTarget)(this);
        shouldTrack = true;
        return this.fn();
      } finally {
        (0,_dep__WEBPACK_IMPORTED_MODULE_2__.popTarget)();
        shouldTrack = lastShouldTrack;
        this.deferStop ? this.stop() : this.cleanupDeps();
      }
    }

    // add dependency to this
  }, {
    key: "addDep",
    value: function addDep(dep) {
      if (!shouldTrack) return;
      var id = dep.id;
      if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if (!this.depIds.has(id)) {
          dep.addSub(this);
        }
      }
    }

    // Clean up for dependency collection.
  }, {
    key: "cleanupDeps",
    value: function cleanupDeps() {
      var i = this.deps.length;
      while (i--) {
        var dep = this.deps[i];
        if (!this.newDepIds.has(dep.id)) {
          dep.removeSub(this);
        }
      }
      var tmp = this.depIds;
      this.depIds = this.newDepIds;
      this.newDepIds = tmp;
      this.newDepIds.clear();
      tmp = this.deps;
      this.deps = this.newDeps;
      this.newDeps = tmp;
      this.newDeps.length = 0;
    }

    // same as trigger
  }, {
    key: "update",
    value: function update() {
      // avoid dead cycle
      if (_dep__WEBPACK_IMPORTED_MODULE_2__["default"].target !== this || this.allowRecurse) {
        if (this.pausedState !== _helper_const__WEBPACK_IMPORTED_MODULE_0__.PausedState.resumed) {
          this.pausedState = _helper_const__WEBPACK_IMPORTED_MODULE_0__.PausedState.dirty;
        } else {
          this.scheduler ? this.scheduler() : this.run();
        }
      }
    }

    // pass through deps for computed
  }, {
    key: "depend",
    value: function depend() {
      var i = this.deps.length;
      while (i--) {
        this.deps[i].depend();
      }
    }

    // Remove self from all dependencies' subscriber list.
  }, {
    key: "stop",
    value: function stop() {
      if (_dep__WEBPACK_IMPORTED_MODULE_2__["default"].target === this) {
        this.deferStop = true;
      } else if (this.active) {
        var i = this.deps.length;
        while (i--) {
          this.deps[i].removeSub(this);
        }
        typeof this.onStop === 'function' && this.onStop();
        this.active = false;
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.pausedState !== _helper_const__WEBPACK_IMPORTED_MODULE_0__.PausedState.dirty) {
        this.pausedState = _helper_const__WEBPACK_IMPORTED_MODULE_0__.PausedState.paused;
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      var ignoreDirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var lastPausedState = this.pausedState;
      this.pausedState = _helper_const__WEBPACK_IMPORTED_MODULE_0__.PausedState.resumed;
      if (!ignoreDirty && lastPausedState === _helper_const__WEBPACK_IMPORTED_MODULE_0__.PausedState.dirty) {
        this.scheduler ? this.scheduler() : this.run();
      }
    }
  }]);
}();

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/observer/effectScope.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   effectScope: function() { return /* binding */ effectScope; },
/* harmony export */   getCurrentScope: function() { return /* binding */ getCurrentScope; },
/* harmony export */   onScopeDispose: function() { return /* binding */ onScopeDispose; },
/* harmony export */   recordEffectScope: function() { return /* binding */ recordEffectScope; }
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var activeEffectScope;
var EffectScope = /*#__PURE__*/function () {
  function EffectScope(detached) {
    _classCallCheck(this, EffectScope);
    _defineProperty(this, "active", true);
    _defineProperty(this, "effects", []);
    _defineProperty(this, "cleanups", []);
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  return _createClass(EffectScope, [{
    key: "run",
    value: function run(fn) {
      if (this.active) {
        var currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      }
    }
  }, {
    key: "on",
    value: function on() {
      activeEffectScope = this;
    }
  }, {
    key: "off",
    value: function off() {
      activeEffectScope = this.parent;
    }
  }, {
    key: "stop",
    value: function stop(fromParent) {
      if (this.active) {
        var i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
        }
        // nested scope, dereference from parent to avoid memory leaks
        if (this.parent && !fromParent) {
          // optimized O(1) removal
          var last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.active = false;
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.active) {
        var i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].pause();
        }
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].pause();
          }
        }
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      var ignoreDirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.active) {
        var i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].resume(ignoreDirty);
        }
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].resume(ignoreDirty);
          }
        }
      }
    }
  }]);
}();
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect) {
  var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : activeEffectScope;
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/observer/reactive.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Observer: function() { return /* binding */ Observer; },
/* harmony export */   defineReactive: function() { return /* binding */ defineReactive; },
/* harmony export */   del: function() { return /* binding */ del; },
/* harmony export */   getObserver: function() { return /* binding */ getObserver; },
/* harmony export */   isReactive: function() { return /* binding */ isReactive; },
/* harmony export */   markRaw: function() { return /* binding */ markRaw; },
/* harmony export */   reactive: function() { return /* binding */ reactive; },
/* harmony export */   set: function() { return /* binding */ set; },
/* harmony export */   setForceTrigger: function() { return /* binding */ setForceTrigger; },
/* harmony export */   shallowReactive: function() { return /* binding */ shallowReactive; }
/* harmony export */ });
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/dep.js");
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/array.js");
/* harmony import */ var _helper_const__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/helper/const.js");
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/ref.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





var arrayKeys = Object.getOwnPropertyNames(_array__WEBPACK_IMPORTED_MODULE_1__.arrayMethods);
var rawSet = new WeakSet();
var isForceTrigger = false;
function setForceTrigger(val) {
  isForceTrigger = val;
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = /*#__PURE__*/function () {
  function Observer(value, shallow) {
    _classCallCheck(this, Observer);
    _defineProperty(this, "dep", new _dep__WEBPACK_IMPORTED_MODULE_2__["default"]());
    this.value = value;
    (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.def)(value, _helper_const__WEBPACK_IMPORTED_MODULE_3__.ObKey, this);
    if (Array.isArray(value)) {
      var augment = _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasProto && _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.arrayProtoAugment ? protoAugment : copyAugment;
      augment(value, _array__WEBPACK_IMPORTED_MODULE_1__.arrayMethods, arrayKeys);
      !shallow && this.observeArray(value);
    } else {
      this.walk(value, shallow);
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  return _createClass(Observer, [{
    key: "walk",
    value: function walk(obj, shallow) {
      Object.keys(obj).forEach(function (key) {
        defineReactive(obj, key, obj[key], shallow);
      });
    }

    /**
     * Observe a list of Array items.
     */
  }, {
    key: "observeArray",
    value: function observeArray(arr) {
      for (var i = 0, l = arr.length; i < l; i++) {
        observe(arr[i]);
      }
    }
  }]);
}();

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */

/* istanbul ignore next */
function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.def)(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value, shallow) {
  if (!(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(value) || rawSet.has(value)) {
    return;
  }
  var ob = getObserver(value);
  if (!ob && (Array.isArray(value) || (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) && Object.isExtensible(value)) {
    ob = new Observer(value, shallow);
  }
  return ob;
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive(obj, key, val, shallow) {
  var dep = new _dep__WEBPACK_IMPORTED_MODULE_2__["default"]();
  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;
      if (_dep__WEBPACK_IMPORTED_MODULE_2__["default"].target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return !shallow && (0,_ref__WEBPACK_IMPORTED_MODULE_4__.isRef)(value) ? value.value : value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      if (!(shallow && isForceTrigger) && !(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(newVal, value)) {
        return;
      }
      if (!shallow && (0,_ref__WEBPACK_IMPORTED_MODULE_4__.isRef)(value) && !(0,_ref__WEBPACK_IMPORTED_MODULE_4__.isRef)(newVal)) {
        value.value = newVal;
      } else if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set(target, key, val) {
  if (Array.isArray(target) && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isValidArrayIndex)(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(target, key)) {
    target[key] = val;
    return val;
  }
  var ob = getObserver(target);
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}

/**
 * Delete a property and trigger change if necessary.
 */
function del(target, key) {
  if (Array.isArray(target) && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isValidArrayIndex)(key)) {
    target.splice(key, 1);
    return;
  }
  var ob = getObserver(target);
  if (!(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(target, key)) {
    return;
  }
  delete target[key];
  if (!ob) {
    return;
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(arr) {
  for (var i = 0, l = arr.length; i < l; i++) {
    var item = arr[i];
    var ob = getObserver(item);
    ob && ob.dep.depend();
    if (Array.isArray(item)) {
      dependArray(item);
    }
  }
}
function reactive(value) {
  observe(value);
  return value;
}
function shallowReactive(value) {
  observe(value, true);
  return value;
}
function isReactive(value) {
  return value && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(value, _helper_const__WEBPACK_IMPORTED_MODULE_3__.ObKey) && value[_helper_const__WEBPACK_IMPORTED_MODULE_3__.ObKey] instanceof Observer;
}
function getObserver(value) {
  if (isReactive(value)) return value[_helper_const__WEBPACK_IMPORTED_MODULE_3__.ObKey];
}
function markRaw(value) {
  if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(value)) {
    rawSet.add(value);
  }
  return value;
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/observer/ref.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RefImpl: function() { return /* binding */ RefImpl; },
/* harmony export */   createRef: function() { return /* binding */ createRef; },
/* harmony export */   customRef: function() { return /* binding */ customRef; },
/* harmony export */   isRef: function() { return /* binding */ isRef; },
/* harmony export */   ref: function() { return /* binding */ ref; },
/* harmony export */   shallowRef: function() { return /* binding */ shallowRef; },
/* harmony export */   toRef: function() { return /* binding */ toRef; },
/* harmony export */   toRefs: function() { return /* binding */ toRefs; },
/* harmony export */   triggerRef: function() { return /* binding */ triggerRef; },
/* harmony export */   unref: function() { return /* binding */ unref; }
/* harmony export */ });
/* harmony import */ var _reactive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/reactive.js");
/* harmony import */ var _helper_const__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/helper/const.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var RefImpl = /*#__PURE__*/_createClass(function RefImpl(options) {
  _classCallCheck(this, RefImpl);
  Object.defineProperty(this, 'value', _objectSpread({
    enumerable: true
  }, options));
});
function createRef(options, effect) {
  var ref = new RefImpl(options);
  if (effect) {
    ref.effect = effect;
    effect.computed = ref;
  }
  return Object.seal(ref);
}
function isRef(val) {
  return val instanceof RefImpl;
}
function unref(ref) {
  return isRef(ref) ? ref.value : ref;
}
function ref(raw) {
  if (isRef(raw)) return raw;
  var wrapper = (0,_reactive__WEBPACK_IMPORTED_MODULE_1__.reactive)({
    [_helper_const__WEBPACK_IMPORTED_MODULE_2__.RefKey]: raw
  });
  return createRef({
    get: function get() {
      return wrapper[_helper_const__WEBPACK_IMPORTED_MODULE_2__.RefKey];
    },
    set: function set(val) {
      wrapper[_helper_const__WEBPACK_IMPORTED_MODULE_2__.RefKey] = val;
    }
  });
}
function toRef(obj, key) {
  if (!(0,_reactive__WEBPACK_IMPORTED_MODULE_1__.isReactive)(obj)) (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)('toRef() expects a reactive object but received a plain one.');
  if (!(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(obj, key)) (0,_reactive__WEBPACK_IMPORTED_MODULE_1__.set)(obj, key);
  var val = obj[key];
  if (isRef(val)) return val;
  return createRef({
    get: function get() {
      return obj[key];
    },
    set: function set(val) {
      obj[key] = val;
    }
  });
}
function toRefs(obj) {
  if (!(0,_reactive__WEBPACK_IMPORTED_MODULE_1__.isReactive)(obj)) (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)('toRefs() expects a reactive object but received a plain one.');
  if (!(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(obj)) return obj;
  var result = {};
  Object.keys(obj).forEach(function (key) {
    result[key] = toRef(obj, key);
  });
  return result;
}
function customRef(factory) {
  var version = ref(0);
  return createRef(factory(
  // track
  function () {
    return version.value;
  },
  // trigger
  function () {
    version.value++;
  }));
}
function shallowRef(raw) {
  if (isRef(raw)) return raw;
  var wrapper = (0,_reactive__WEBPACK_IMPORTED_MODULE_1__.shallowReactive)({
    [_helper_const__WEBPACK_IMPORTED_MODULE_2__.RefKey]: raw
  });
  return createRef({
    get: function get() {
      return wrapper[_helper_const__WEBPACK_IMPORTED_MODULE_2__.RefKey];
    },
    set: function set(val) {
      wrapper[_helper_const__WEBPACK_IMPORTED_MODULE_2__.RefKey] = val;
    }
  });
}
function triggerRef(ref) {
  if (!isRef(ref)) return;
  (0,_reactive__WEBPACK_IMPORTED_MODULE_1__.setForceTrigger)(true);
  /* eslint-disable no-self-assign */
  ref.value = ref.value;
  (0,_reactive__WEBPACK_IMPORTED_MODULE_1__.setForceTrigger)(false);
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/observer/scheduler.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   flushPostFlushCbs: function() { return /* binding */ flushPostFlushCbs; },
/* harmony export */   flushPreFlushCbs: function() { return /* binding */ flushPreFlushCbs; },
/* harmony export */   nextTick: function() { return /* binding */ nextTick; },
/* harmony export */   queueJob: function() { return /* binding */ queueJob; },
/* harmony export */   queuePostFlushCb: function() { return /* binding */ queuePostFlushCb; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/index.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }


var isFlushing = false;
var isFlushPending = false;
var queue = [];
var flushIndex = 0;
var pendingPostFlushCbs = [];
var activePostFlushCbs = null;
var postFlushIndex = 0;
var resolvedPromise = Promise.resolve();
var currentFlushPromise = null;
var RECURSION_LIMIT = 100;
var getId = function getId(job) {
  return job.id == null ? Infinity : job.id;
};
var comparator = function comparator(a, b) {
  var diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre) return -1;
    if (b.pre && !a.pre) return 1;
  }
  return diff;
};
function findInsertionIndex(id) {
  // the start index should be `flushIndex + 1`
  var start = flushIndex + 1;
  var end = queue.length;
  while (start < end) {
    var middle = start + end >>> 1;
    var middleJob = queue[middle];
    var middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function nextTick(fn) {
  var p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function queuePostFlushCb(cb) {
  if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isArray)(cb)) {
    pendingPostFlushCbs.push.apply(pendingPostFlushCbs, _toConsumableArray(cb));
  } else if (!activePostFlushCbs || !activePostFlushCbs.includes(cb, cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
    pendingPostFlushCbs.push(cb);
  }
  queueFlush();
}
function queueJob(job) {
  // the dedupe search uses the startIndex argument of Array.includes()
  // by default the search index includes the current job that is being run
  // so it cannot recursively trigger itself again.
  // if the job is a watch() callback, the search will start with a +1 index to
  // allow it recursively trigger itself - it is the user's responsibility to
  // ensure it doesn't end up in an infinite loop.
  if (!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    if (_index__WEBPACK_IMPORTED_MODULE_1__["default"].config.forceFlushSync) {
      flushJobs();
    } else {
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
}
function flushPreFlushCbs(instance, seen) {
  if (_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isDev) seen = seen || new Map();
  for (var i = isFlushing ? flushIndex + 1 : 0; i < queue.length; i++) {
    var cb = queue[i];
    if (cb && cb.pre) {
      if (instance && cb.id !== instance.uid) continue;
      if (_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isDev && checkRecursiveUpdates(seen, cb)) continue;
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    var deduped = _toConsumableArray(new Set(pendingPostFlushCbs));
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      var _activePostFlushCbs;
      (_activePostFlushCbs = activePostFlushCbs).push.apply(_activePostFlushCbs, _toConsumableArray(deduped));
      return;
    }
    activePostFlushCbs = deduped;
    if (_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isDev) seen = seen || new Map();
    // activePostFlushCbs.sort((a, b) => getId(a) - getId(b))
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isDev && checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) continue;
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  if (_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isDev) seen = seen || new Map();
  queue.sort(comparator);
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      var job = queue[flushIndex];
      if (job && job.active !== false) {
        if (_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isDev && checkRecursiveUpdates(seen, job)) continue;
        (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling)(job, null, 'scheduler');
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    // some postFlushCb queued jobs!
    // keep flushing until it drains.
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    var count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)('Maximum recursive updates exceeded.\n' + 'This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself');
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/observer/watch.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   traverse: function() { return /* binding */ traverse; },
/* harmony export */   watch: function() { return /* binding */ watch; },
/* harmony export */   watchEffect: function() { return /* binding */ watchEffect; },
/* harmony export */   watchPostEffect: function() { return /* binding */ watchPostEffect; },
/* harmony export */   watchSyncEffect: function() { return /* binding */ watchSyncEffect; }
/* harmony export */ });
/* harmony import */ var _effect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/effect.js");
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/ref.js");
/* harmony import */ var _reactive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/reactive.js");
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/scheduler.js");
/* harmony import */ var _core_proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/proxy.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






function watchEffect(effect, options) {
  return watch(effect, null, options);
}
function watchPostEffect(effect, options) {
  return watch(effect, null, _objectSpread(_objectSpread({}, options), {}, {
    flush: 'post'
  }));
}
function watchSyncEffect(effect, options) {
  return watch(effect, null, _objectSpread(_objectSpread({}, options), {}, {
    flush: 'sync'
  }));
}
var warnInvalidSource = function warnInvalidSource(s) {
  (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("Invalid watch source: ".concat(s, "\nA watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."));
};
var shouldTrigger = function shouldTrigger(value, oldValue) {
  return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(value, oldValue) || (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(value);
};
var processWatchOptionsCompat = function processWatchOptionsCompat(options) {
  var newOptions = _objectSpread({}, options);
  if (options.sync) {
    newOptions.flush = 'sync';
  }
  return newOptions;
};
function watch(source, cb) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _processWatchOptionsC = processWatchOptionsCompat(options),
    immediate = _processWatchOptionsC.immediate,
    deep = _processWatchOptionsC.deep,
    flush = _processWatchOptionsC.flush;
  var instance = _core_proxy__WEBPACK_IMPORTED_MODULE_1__.currentInstance;
  var getter;
  var isMultiSource = false;
  if ((0,_ref__WEBPACK_IMPORTED_MODULE_2__.isRef)(source)) {
    getter = function getter() {
      return source.value;
    };
  } else if ((0,_reactive__WEBPACK_IMPORTED_MODULE_3__.isReactive)(source)) {
    getter = function getter() {
      return source;
    };
    deep = true;
  } else if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isArray)(source)) {
    isMultiSource = true;
    getter = function getter() {
      return source.map(function (s) {
        if ((0,_ref__WEBPACK_IMPORTED_MODULE_2__.isRef)(s)) {
          return s.value;
        } else if ((0,_reactive__WEBPACK_IMPORTED_MODULE_3__.isReactive)(s)) {
          return traverse(s);
        } else if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(s)) {
          return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling)(s, instance, 'watch getter');
        } else {
          warnInvalidSource(s);
          return s;
        }
      });
    };
  } else if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(source)) {
    if (cb) {
      // getter with cb
      getter = function getter() {
        return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling)(source, instance, 'watch getter');
      };
    } else {
      // no cb -> simple effect
      getter = function getter() {
        if (instance && instance.isUnmounted()) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling)(source, instance, 'watch callback', [onCleanup]);
      };
    }
  } else {
    getter = _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.noop;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    var baseGetter = getter;
    getter = function getter() {
      return traverse(baseGetter());
    };
  }
  var cleanup;
  var onCleanup = function onCleanup(fn) {
    cleanup = effect.onStop = function () {
      return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling)(fn, instance, 'watch cleanup');
    };
  };
  var oldValue = isMultiSource ? [] : undefined;
  var job = function job() {
    if (!effect.active) return;
    if (cb) {
      var newValue = effect.run();
      if (deep || (isMultiSource ? newValue.some(function (v, i) {
        return shouldTrigger(v, oldValue[i]);
      }) : shouldTrigger(newValue, oldValue))) {
        // cleanup before running cb again
        if (cleanup) {
          cleanup();
        }
        (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling)(cb, instance, 'watch callback', [newValue, oldValue, onCleanup]);
        oldValue = newValue;
      }
    } else {
      // watchEffect
      effect.run();
    }
  };
  var scheduler;
  if (flush === 'sync') {
    // the scheduler function gets called directly
    scheduler = job;
  } else if (flush === 'post') {
    scheduler = function scheduler() {
      return (0,_scheduler__WEBPACK_IMPORTED_MODULE_4__.queuePostFlushCb)(job);
    };
  } else {
    // default: 'pre'
    job.pre = true;
    if (instance) job.id = instance.uid;
    scheduler = function scheduler() {
      return (0,_scheduler__WEBPACK_IMPORTED_MODULE_4__.queueJob)(job);
    };
  }
  job.allowRecurse = !!cb;
  var effect = new _effect__WEBPACK_IMPORTED_MODULE_5__.ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === 'post') {
    (0,_scheduler__WEBPACK_IMPORTED_MODULE_4__.queuePostFlushCb)(effect.run.bind(effect));
  } else {
    effect.run();
  }
  return function () {
    effect.stop();
    if (instance && instance.scope) {
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.remove)(instance.scope.effects, effect);
    }
  };
}
function traverse(value, seen) {
  if (!(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(value)) return value;
  seen = seen || new Set();
  if (seen.has(value)) return value;
  seen.add(value);
  if ((0,_ref__WEBPACK_IMPORTED_MODULE_2__.isRef)(value)) {
    traverse(value.value, seen);
  } else if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isArray)(value)) {
    for (var i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) {
    for (var key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/builtInMixins/directiveHelperMixin.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ directiveHelperMixin; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");

function directiveHelperMixin() {
  return {
    methods: {
      __getWxKey: function __getWxKey(item, key) {
        var value = key === '*this' ? item : item[key];
        if (typeof value === 'string' || typeof value === 'number') {
          return value;
        } else {
          (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("wx:key's value should return a string or a number, received: ".concat((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.type)(value)), this.__mpxProxy.options.mpxFileResource);
        }
      }
    }
  };
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/builtInMixins/i18nMixin.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createI18n: function() { return /* binding */ createI18n; },
/* harmony export */   "default": function() { return /* binding */ i18nMixin; },
/* harmony export */   useI18n: function() { return /* binding */ useI18n; }
/* harmony export */ });
/* harmony import */ var _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/innerLifecycle.js");
/* harmony import */ var _helper_const__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/helper/const.js");
/* harmony import */ var _observer_ref__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/ref.js");
/* harmony import */ var _observer_watch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/watch.js");
/* harmony import */ var _observer_effectScope__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/effectScope.js");
/* harmony import */ var _core_proxy__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/proxy.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var i18n = null;
var i18nMethods = null;
function createI18n(options) {
  if (!options) {
    (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)('CreateI18n() can not be called with null or undefined.');
  }
  i18nMethods = options.methods;
  var _createGlobal = createGlobal(options),
    _createGlobal2 = _slicedToArray(_createGlobal, 2),
    globalScope = _createGlobal2[0],
    _global = _createGlobal2[1];
  var __instances = new WeakMap();
  i18n = {
    get global() {
      return _global;
    },
    get locale() {
      return _global.locale.value || _helper_const__WEBPACK_IMPORTED_MODULE_1__.DefaultLocale;
    },
    set locale(val) {
      _global.locale.value = val;
    },
    get fallbackLocale() {
      return _global.fallbackLocale.value || _helper_const__WEBPACK_IMPORTED_MODULE_1__.DefaultLocale;
    },
    set fallbackLocale(val) {
      _global.fallbackLocale.value = val;
    },
    get t() {
      return _global.t;
    },
    get tc() {
      return _global.t;
    },
    get te() {
      return _global.te;
    },
    get tm() {
      return _global.tm;
    },
    dispose: function dispose() {
      globalScope.stop();
    },
    __instances: __instances,
    __getInstance: function __getInstance(instance) {
      return __instances.get(instance);
    },
    __setInstance: function __setInstance(instance, composer) {
      __instances.set(instance, composer);
    },
    __deleteInstance: function __deleteInstance(instance) {
      __instances.delete(instance);
    }
  };
  return i18n;
}
function createGlobal(options) {
  var scope = (0,_observer_effectScope__WEBPACK_IMPORTED_MODULE_2__.effectScope)();
  var obj = scope.run(function () {
    return createComposer(options);
  });
  return [scope, obj];
}
var id = 0;
function createComposer(options) {
  if (i18nMethods == null) {
    (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)('CreateI18n() should be called before useI18n() calling.');
    return;
  }
  var __root = options.__root,
    _options$inheritLocal = options.inheritLocale,
    inheritLocale = _options$inheritLocal === void 0 ? true : _options$inheritLocal,
    _options$fallbackRoot = options.fallbackRoot,
    fallbackRoot = _options$fallbackRoot === void 0 ? true : _options$fallbackRoot;
  var locale = (0,_observer_ref__WEBPACK_IMPORTED_MODULE_3__.ref)(__root && inheritLocale ? __root.locale.value : options.locale || _helper_const__WEBPACK_IMPORTED_MODULE_1__.DefaultLocale);
  var fallbackLocale = (0,_observer_ref__WEBPACK_IMPORTED_MODULE_3__.ref)(__root && inheritLocale ? __root.fallbackLocale.value : options.fallbackLocale || _helper_const__WEBPACK_IMPORTED_MODULE_1__.DefaultLocale);
  var messages = (0,_observer_ref__WEBPACK_IMPORTED_MODULE_3__.shallowRef)((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(options.messages) ? options.messages : {
    [locale]: {}
  });

  // t && tc
  var t = function t() {
    var ret;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isNumber)(args[1])) {
      var _i18nMethods;
      // Pluralization
      ret = (_i18nMethods = i18nMethods).tc.apply(_i18nMethods, [messages.value, locale.value, fallbackLocale.value].concat(args));
    } else {
      var _i18nMethods2;
      ret = (_i18nMethods2 = i18nMethods).t.apply(_i18nMethods2, [messages.value, locale.value, fallbackLocale.value].concat(args));
    }
    if (ret === args[0] && fallbackRoot && __root) {
      ret = __root.t.apply(__root, args);
    }
    return ret;
  };

  // te
  var te = function te() {
    var _i18nMethods3;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return (_i18nMethods3 = i18nMethods).te.apply(_i18nMethods3, [messages.value, locale.value, fallbackLocale.value].concat(args));
  };

  // tm
  var tm = function tm() {
    var _i18nMethods4;
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return (_i18nMethods4 = i18nMethods).tm.apply(_i18nMethods4, [messages.value, locale.value, fallbackLocale.value].concat(args));
  };
  var getLocaleMessage = function getLocaleMessage(locale) {
    return messages.value[locale];
  };
  var setLocaleMessage = function setLocaleMessage(locale, message) {
    messages.value[locale] = message;
    (0,_observer_ref__WEBPACK_IMPORTED_MODULE_3__.triggerRef)(messages);
  };
  var mergeLocaleMessage = function mergeLocaleMessage(locale, message) {
    messages.value[locale] = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.mergeObj)(messages.value[locale] || {}, message);
    (0,_observer_ref__WEBPACK_IMPORTED_MODULE_3__.triggerRef)(messages);
  };
  if (__root) {
    (0,_observer_watch__WEBPACK_IMPORTED_MODULE_4__.watch)([__root.locale, __root.fallbackLocale], function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        l = _ref2[0],
        fl = _ref2[1];
      if (inheritLocale) {
        locale.value = l;
        fallbackLocale.value = fl;
      }
    });
  }
  return {
    id: id++,
    locale: locale,
    fallbackLocale: fallbackLocale,
    get messages() {
      return messages;
    },
    get isGlobal() {
      return __root === undefined;
    },
    get inheritLocale() {
      return inheritLocale;
    },
    set inheritLocale(val) {
      inheritLocale = val;
      if (val && __root) {
        locale.value = __root.locale.value;
        fallbackLocale.value = __root.fallbackLocale.value;
      }
    },
    get fallbackRoot() {
      return fallbackRoot;
    },
    set fallbackRoot(val) {
      fallbackRoot = val;
    },
    t: t,
    te: te,
    tm: tm,
    getLocaleMessage: getLocaleMessage,
    setLocaleMessage: setLocaleMessage,
    mergeLocaleMessage: mergeLocaleMessage
  };
}
function getScope(options) {
  return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isEmptyObject)(options) ? 'global' : 'local';
}
function setupLifeCycle(instance) {
  (0,_core_proxy__WEBPACK_IMPORTED_MODULE_5__.onUnmounted)(function () {
    i18n.__deleteInstance(instance);
  }, instance);
}
function useI18n(options) {
  var instance = (0,_core_proxy__WEBPACK_IMPORTED_MODULE_5__.getCurrentInstance)();
  if (instance == null) {
    (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)('UseI18n() must be called in setup top.');
    return;
  }
  var scope = getScope(options);
  var global = i18n.global;
  if (scope === 'global') return global;
  var composer = i18n.__getInstance(instance);
  if (composer == null) {
    var composerOptions = Object.assign({}, options);
    if (global) composerOptions.__root = global;
    composer = createComposer(composerOptions);
    setupLifeCycle(instance);
    i18n.__setInstance(instance, composer);
  }
  return composer;
}
function i18nMixin() {
  if (i18n) {
    return {
      computed: {
        _l: function _l() {
          return i18n.global.locale.value || _helper_const__WEBPACK_IMPORTED_MODULE_1__.DefaultLocale;
        },
        _fl: function _fl() {
          return i18n.global.fallbackLocale.value || _helper_const__WEBPACK_IMPORTED_MODULE_1__.DefaultLocale;
        }
      },
      [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_6__.BEFORECREATE]: function () {
        var _this = this;
        // 挂载$i18n
        this.$i18n = {
          get locale() {
            return i18n.global.locale.value || _helper_const__WEBPACK_IMPORTED_MODULE_1__.DefaultLocale;
          },
          set locale(val) {
            i18n.global.locale.value = val;
          },
          get fallbackLocale() {
            return i18n.global.fallbackLocale.value || _helper_const__WEBPACK_IMPORTED_MODULE_1__.DefaultLocale;
          },
          set fallbackLocale(val) {
            i18n.global.fallbackLocale.value = val;
          }
        };

        // 挂载翻译方法，$t等注入方法只能使用global scope
        Object.keys(i18nMethods).forEach(function (methodName) {
          _this['$' + methodName] = function () {
            var _i18n$global;
            if (methodName === 'tc') methodName = 't';
            return (_i18n$global = i18n.global)[methodName].apply(_i18n$global, arguments);
          };
        });
      }
    };
  }
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/builtInMixins/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getBuiltInMixins; }
/* harmony export */ });
/* harmony import */ var _proxyEventMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/builtInMixins/proxyEventMixin.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _refsMixin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/builtInMixins/refsMixin.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _i18nMixin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/builtInMixins/i18nMixin.js");
/* harmony import */ var _styleHelperMixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/builtInMixins/styleHelperMixin.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _directiveHelperMixin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/builtInMixins/directiveHelperMixin.ios.js?infix=.ios&mode=ios");















function getBuiltInMixins(options, type) {
  var bulitInMixins;
  if (true) {
    bulitInMixins = [(0,_proxyEventMixin__WEBPACK_IMPORTED_MODULE_0__["default"])(), (0,_directiveHelperMixin__WEBPACK_IMPORTED_MODULE_1__["default"])(), (0,_styleHelperMixin__WEBPACK_IMPORTED_MODULE_2__["default"])(type), (0,_refsMixin__WEBPACK_IMPORTED_MODULE_3__["default"])(), (0,_i18nMixin__WEBPACK_IMPORTED_MODULE_4__["default"])()];
  } else {}
  return bulitInMixins.filter(function (item) {
    return item;
  });
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/builtInMixins/proxyEventMixin.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ proxyEventMixin; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/index.js");


function proxyEventMixin() {
  var methods = {
    __invoke: function __invoke(rawEvent) {
      var _this = this;
      var eventConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      if (typeof _index__WEBPACK_IMPORTED_MODULE_1__["default"].config.proxyEventHandler === 'function') {
        try {
          _index__WEBPACK_IMPORTED_MODULE_1__["default"].config.proxyEventHandler(rawEvent);
        } catch (e) {}
      }
      var location = this.__mpxProxy.options.mpxFileResource;
      var returnedValue;
      eventConfig.forEach(function (item) {
        var callbackName = item[0];
        if (callbackName) {
          var params = item.length > 1 ? item.slice(1).map(function (item) {
            if (item === '__mpx_event__') {
              return rawEvent;
            } else {
              return item;
            }
          }) : [rawEvent];
          if (typeof _this[callbackName] === 'function') {
            returnedValue = _this[callbackName].apply(_this, params);
          } else {
            (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)("Instance property [".concat(callbackName, "] is not function, please check."), location);
          }
        }
      });
      return returnedValue;
    },
    __model: function __model(expr, $event) {
      var valuePath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['value'];
      var filterMethod = arguments.length > 3 ? arguments[3] : undefined;
      var innerFilter = {
        trim: function trim(val) {
          return typeof val === 'string' && val.trim();
        }
      };
      var originValue = valuePath.reduce(function (acc, cur) {
        return acc[cur];
      }, $event.detail);
      var value = filterMethod ? innerFilter[filterMethod] ? innerFilter[filterMethod](originValue) : typeof this[filterMethod] === 'function' ? this[filterMethod](originValue) : originValue : originValue;
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.setByPath)(this, expr, value);
    }
  };
  return {
    methods: methods
  };
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/builtInMixins/refsMixin.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getRefsMixin; }
/* harmony export */ });
/* harmony import */ var _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/innerLifecycle.js");
/* harmony import */ var _mpxjs_api_proxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/create-selector-query/index.js");
/* harmony import */ var _observer_computed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/computed.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }



function getRefsMixin() {
  return {
    [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.BEFORECREATE]: function () {
      this.__refs = {};
      this.$refs = {};
    },
    // __getRefs强依赖数据响应，需要在CREATED中执行
    [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.CREATED]: function () {
      this.__getRefs();
    },
    methods: {
      __getRefs: function __getRefs() {
        var _this = this;
        var refs = this.__getRefsData() || [];
        var target = this;
        this.__selectorMap = (0,_observer_computed__WEBPACK_IMPORTED_MODULE_1__.computed)(function () {
          var selectorMap = {};
          refs.forEach(function (_ref) {
            var key = _ref.key,
              type = _ref.type,
              sKeys = _ref.sKeys;
            // sKeys 是使用 wx:ref 没有值的标记场景，支持运行时的 createSelectorQuery 的使用
            if (sKeys) {
              sKeys.forEach(function () {
                var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var computedKey = item.key;
                var prefix = item.prefix;
                var selectors = _this[computedKey] || '';
                selectors.trim().split(/\s+/).forEach(function (item) {
                  var selector = prefix + item;
                  selectorMap[selector] = selectorMap[selector] || [];
                  selectorMap[selector].push({
                    type: type,
                    key: key
                  });
                });
              });
            } else {
              selectorMap[key] = selectorMap[key] || [];
              selectorMap[key].push({
                type: type,
                key: key
              });
            }
          });
          return selectorMap;
        });
        refs.forEach(function (_ref2) {
          var key = _ref2.key,
            type = _ref2.type,
            all = _ref2.all,
            sKeys = _ref2.sKeys;
          // 如果没有 sKey 说明使用的是 wx:ref="xxx" 的场景
          if (!sKeys) {
            Object.defineProperty(_this.$refs, key, {
              enumerable: true,
              configurable: true,
              get: function get() {
                var refs = target.__refs[key] || [];
                if (type === 'component') {
                  return all ? refs : refs[0];
                } else {
                  return (0,_mpxjs_api_proxy__WEBPACK_IMPORTED_MODULE_2__.createSelectorQuery)().in(target).select(key, all);
                }
              }
            });
          }
        });
      },
      __getRefVal: function __getRefVal(key) {
        var _this2 = this;
        if (!this.__refs[key]) {
          this.__refs[key] = [];
        }
        return function (instance) {
          return instance && _this2.__refs[key].push(instance);
        };
      },
      __selectRef: function __selectRef(selector, refType) {
        var _this3 = this;
        var all = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var splitedSelector = selector.match(/(#|\.)?\w+/g) || [];
        var refsArr = splitedSelector.map(function (selector) {
          var _this3$__selectorMap;
          var selectorMap = ((_this3$__selectorMap = _this3.__selectorMap) === null || _this3$__selectorMap === void 0 ? void 0 : _this3$__selectorMap.value[selector]) || [];
          var res = [];
          selectorMap.forEach(function (_ref3) {
            var type = _ref3.type,
              key = _ref3.key;
            if (type === refType) {
              var _refs = _this3.__refs[key] || [];
              res.push.apply(res, _toConsumableArray(_refs));
            }
          });
          return res;
        });
        var refs = refsArr.reduce(function (preRefs, curRefs, curIndex) {
          if (curIndex === 0) return curRefs;
          curRefs = new Set(curRefs);
          return preRefs.filter(function (p) {
            return curRefs.has(p);
          });
        }, []);
        return all ? refs : refs[0];
      }
    }
  };
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/builtInMixins/styleHelperMixin.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ styleHelperMixin; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react-native");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_native__WEBPACK_IMPORTED_MODULE_1__);


function concat(a, b) {
  return a ? b ? a + ' ' + b : a : b || '';
}
function stringifyArray(value) {
  var res = '';
  var classString;
  for (var i = 0; i < value.length; i++) {
    if (classString = stringifyDynamicClass(value[i])) {
      if (res) res += ' ';
      res += classString;
    }
  }
  return res;
}
function stringifyObject(value) {
  var res = '';
  var keys = Object.keys(value);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (value[key]) {
      if (res) res += ' ';
      res += key;
    }
  }
  return res;
}
function stringifyDynamicClass(value) {
  if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isArray)(value)) {
    value = stringifyArray(value);
  } else if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(value)) {
    value = stringifyObject(value);
  }
  return value;
}
var listDelimiter = /;(?![^(]*[)])/g;
var propertyDelimiter = /:(.+)/;
var rpxRegExp = /^\s*(-?\d+(\.\d+)?)rpx\s*$/;
var pxRegExp = /^\s*(-?\d+(\.\d+)?)(px)?\s*$/;
function parseStyleText(cssText) {
  var res = {};
  var arr = cssText.split(listDelimiter);
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (item) {
      var tmp = item.split(propertyDelimiter);
      if (tmp.length > 1) {
        var k = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.dash2hump)(tmp[0].trim());
        res[k] = tmp[1].trim();
      }
    }
  }
  return res;
}
function normalizeDynamicStyle(value) {
  if (!value) return {};
  if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isArray)(value)) {
    return mergeObjectArray(value);
  }
  if (typeof value === 'string') {
    return parseStyleText(value);
  }
  return value;
}
function mergeObjectArray(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    Object.assign(res, arr[i]);
  }
  return res;
}
function transformStyleObj(context, styleObj) {
  var keys = Object.keys(styleObj);
  var transformed = {};
  keys.forEach(function (prop) {
    // todo 检测不支持的prop
    var value = styleObj[prop];
    var matched;
    if (matched = pxRegExp.exec(value)) {
      value = +matched[1];
    } else if (matched = rpxRegExp.exec(value)) {
      value = context.__rpx(+matched[1]);
    }
    // todo 检测不支持的value
    transformed[prop] = value;
  });
  return transformed;
}
function styleHelperMixin(type) {
  return {
    methods: {
      __rpx: function __rpx(value) {
        var _Dimensions$get = react_native__WEBPACK_IMPORTED_MODULE_1__.Dimensions.get('screen'),
          width = _Dimensions$get.width;
        // rn 单位 dp = 1(css)px =  1 物理像素 * pixelRatio(像素比)
        // px = rpx * (750 / 屏幕宽度)
        return value * width / 750;
      },
      __getClass: function __getClass(staticClass, dynamicClass) {
        return concat(staticClass, stringifyDynamicClass(dynamicClass));
      },
      __getStyle: function __getStyle(staticClass, dynamicClass, staticStyle, dynamicStyle, show) {
        var result = [];
        var classMap = {};
        if (type === 'page' && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(__webpack_require__.g.__getAppClassMap)) {
          Object.assign(classMap, __webpack_require__.g.__getAppClassMap.call(this));
        }
        if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(this.__getClassMap)) {
          Object.assign(classMap, this.__getClassMap());
        }
        if ((staticClass || dynamicClass) && !(0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isEmptyObject)(classMap)) {
          var classString = concat(staticClass, stringifyDynamicClass(dynamicClass));
          classString.split(' ').forEach(function (className) {
            if (classMap[className]) {
              result.push(classMap[className]);
            }
          });
        }
        if (staticStyle || dynamicStyle) {
          var styleObj = Object.assign(parseStyleText(staticStyle), normalizeDynamicStyle(dynamicStyle));
          result.push(transformStyleObj(this, styleObj));
        }
        if (show === false) {
          result.push({
            display: 'none'
          });
        }
        return result;
      }
    }
  };
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/createApp.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createApp; }
/* harmony export */ });
/* harmony import */ var _core_transferOptions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/transferOptions.js");
/* harmony import */ var _patch_builtInKeysMap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/builtInKeysMap.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _convertor_mergeLifecycle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/convertor/mergeLifecycle.js");
/* harmony import */ var _platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/wx/lifecycle.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@mpxjs/core/src/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("react-native");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_native__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _observer_ref__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/ref.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }









var appHooksMap = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.makeMap)((0,_convertor_mergeLifecycle__WEBPACK_IMPORTED_MODULE_3__.mergeLifecycle)(_platform_patch_wx_lifecycle__WEBPACK_IMPORTED_MODULE_4__.LIFECYCLE).app);
function getOrientation() {
  var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : react_native__WEBPACK_IMPORTED_MODULE_2__.Dimensions.get('window');
  return window.width > window.height ? 'landscape' : 'portrait';
}
function filterOptions(options, appData) {
  var newOptions = {};
  Object.keys(options).forEach(function (key) {
    if (_patch_builtInKeysMap__WEBPACK_IMPORTED_MODULE_5__["default"][key]) {
      return;
    }
    if (!appHooksMap[key]) {
      appData[key] = options[key];
    } else {
      newOptions[key] = options[key];
    }
  });
  return newOptions;
}
function createAppInstance(appData) {
  var instance = _objectSpread(_objectSpread({}, _index__WEBPACK_IMPORTED_MODULE_6__["default"].prototype), appData);
  return instance;
}
function createApp(option) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var appData = {};
  var _global$__navigationH = __webpack_require__.g.__navigationHelper,
    NavigationContainer = _global$__navigationH.NavigationContainer,
    createNavigationContainerRef = _global$__navigationH.createNavigationContainerRef,
    createNativeStackNavigator = _global$__navigationH.createNativeStackNavigator,
    SafeAreaProvider = _global$__navigationH.SafeAreaProvider;
  // app选项目前不需要进行转换
  var _transferOptions = (0,_core_transferOptions__WEBPACK_IMPORTED_MODULE_7__["default"])(option, 'app', false),
    rawOptions = _transferOptions.rawOptions,
    currentInject = _transferOptions.currentInject;
  var defaultOptions = filterOptions((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.spreadProp)(rawOptions, 'methods'), appData);
  defaultOptions.onAppInit && defaultOptions.onAppInit();
  // 在页面script执行前填充getApp()
  __webpack_require__.g.getApp = function () {
    return appData;
  };
  var pages = currentInject.getPages() || {};
  var firstPage = currentInject.firstPage;
  var Stack = createNativeStackNavigator();
  var navigationRef = createNavigationContainerRef();
  var pageScreens = Object.entries(pages).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      item = _ref2[1];
    return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(Stack.Screen, {
      name: key,
      component: item
    });
  });
  __webpack_require__.g.__mpxOptionsMap = __webpack_require__.g.__mpxOptionsMap || {};
  var onStateChange = function onStateChange() {
    if (__webpack_require__.g.__navigationHelper.lastSuccessCallback) {
      __webpack_require__.g.__navigationHelper.lastSuccessCallback();
      __webpack_require__.g.__navigationHelper.lastSuccessCallback = null;
    }
  };
  var onUnhandledAction = function onUnhandledAction(action) {
    var payload = action.payload;
    var message = "The action '".concat(action.type, "'").concat(payload ? " with payload ".concat(JSON.stringify(action.payload)) : '', " was not handled by any navigator.");
    if (__webpack_require__.g.__navigationHelper.lastFailCallback) {
      __webpack_require__.g.__navigationHelper.lastFailCallback(message);
      __webpack_require__.g.__navigationHelper.lastFailCallback = null;
    }
  };
  __webpack_require__.g.__mpxAppCbs = __webpack_require__.g.__mpxAppCbs || {
    show: [],
    hide: [],
    error: []
  };
  __webpack_require__.g.__mpxAppFocusedState = (0,_observer_ref__WEBPACK_IMPORTED_MODULE_8__.ref)('show');
  __webpack_require__.g.__mpxOptionsMap[currentInject.moduleId] = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(function () {
    var instanceRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    if (!instanceRef.current) {
      instanceRef.current = createAppInstance(appData);
    }
    var instance = instanceRef.current;
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
      var current = navigationRef.isReady() ? navigationRef.getCurrentRoute() : {};
      var options = {
        path: current.name,
        query: current.params,
        scene: 0,
        shareTicket: '',
        referrerInfo: {}
      };
      __webpack_require__.g.__mpxEnterOptions = options;
      defaultOptions.onLaunch && defaultOptions.onLaunch.call(instance, options);
      if (defaultOptions.onShow) {
        defaultOptions.onShow.call(instance, options);
        __webpack_require__.g.__mpxAppCbs.show.push(defaultOptions.onShow.bind(instance));
      }
      if (defaultOptions.onHide) {
        __webpack_require__.g.__mpxAppCbs.hide.push(defaultOptions.onHide.bind(instance));
      }
      if (defaultOptions.onError) {
        __webpack_require__.g.__mpxAppCbs.error.push(defaultOptions.onError.bind(instance));
      }
      var changeSubscription = react_native__WEBPACK_IMPORTED_MODULE_2__.AppState.addEventListener('change', function (currentState) {
        if (currentState === 'active') {
          __webpack_require__.g.__mpxAppCbs.show.forEach(function (cb) {
            cb(options);
            __webpack_require__.g.__mpxAppFocusedState.value = 'show';
          });
        } else if (currentState === 'background') {
          __webpack_require__.g.__mpxAppCbs.hide.forEach(function (cb) {
            cb();
            __webpack_require__.g.__mpxAppFocusedState.value = 'hide';
          });
        }
      });
      var count = 0;
      var lastOrientation = getOrientation();
      var resizeSubScription = react_native__WEBPACK_IMPORTED_MODULE_2__.Dimensions.addEventListener('change', function (_ref3) {
        var window = _ref3.window;
        var orientation = getOrientation(window);
        if (orientation === lastOrientation) return;
        lastOrientation = orientation;
        __webpack_require__.g.__mpxAppFocusedState.value = "resize".concat(count++);
      });
      return function () {
        changeSubscription();
        resizeSubScription && resizeSubScription.remove();
      };
    }, []);
    return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(SafeAreaProvider, null, /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(NavigationContainer, {
      ref: navigationRef,
      onStateChange: onStateChange,
      onUnhandledAction: onUnhandledAction
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement.apply(void 0, [Stack.Navigator, {
      initialRouteName: firstPage
    }].concat(_toConsumableArray(pageScreens)))));
  });
  __webpack_require__.g.getCurrentPages = function () {
    var _Object$values$;
    var navigation = (_Object$values$ = Object.values(__webpack_require__.g.__mpxPagesMap || {})[0]) === null || _Object$values$ === void 0 ? void 0 : _Object$values$[1];
    if (navigation) {
      return navigation.getState().routes.map(function (route) {
        return __webpack_require__.g.__mpxPagesMap[route.key] && __webpack_require__.g.__mpxPagesMap[route.key][0];
      }).filter(function (item) {
        return item;
      });
    }
    return [];
  };
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/createComponent.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _patch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/index.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_patch__WEBPACK_IMPORTED_MODULE_0__["default"])('component'));

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/createPage.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _patch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/index.js");

/* harmony default export */ __webpack_exports__["default"] = ((0,_patch__WEBPACK_IMPORTED_MODULE_0__["default"])('page'));

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/export/api.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   APIs: function() { return /* binding */ APIs; },
/* harmony export */   InstanceAPIs: function() { return /* binding */ InstanceAPIs; }
/* harmony export */ });
/* harmony import */ var _observer_reactive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/reactive.js");
/* harmony import */ var _observer_ref__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/ref.js");
/* harmony import */ var _observer_watch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/watch.js");
/* harmony import */ var _core_injectMixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/injectMixins.js");




var APIs = {
  injectMixins: _core_injectMixins__WEBPACK_IMPORTED_MODULE_0__.injectMixins,
  mixin: _core_injectMixins__WEBPACK_IMPORTED_MODULE_0__.injectMixins,
  observable: _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.reactive,
  watch: _observer_watch__WEBPACK_IMPORTED_MODULE_2__.watch,
  set: _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.set,
  delete: _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.del,
  isReactive: _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.isReactive,
  isRef: _observer_ref__WEBPACK_IMPORTED_MODULE_3__.isRef
};
var InstanceAPIs = {
  $set: _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.set,
  $delete: _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.del
};


/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/export/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computed: function() { return /* reexport safe */ _observer_computed__WEBPACK_IMPORTED_MODULE_3__.computed; },
/* harmony export */   customRef: function() { return /* reexport safe */ _observer_ref__WEBPACK_IMPORTED_MODULE_2__.customRef; },
/* harmony export */   del: function() { return /* reexport safe */ _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.del; },
/* harmony export */   effectScope: function() { return /* reexport safe */ _observer_effectScope__WEBPACK_IMPORTED_MODULE_4__.effectScope; },
/* harmony export */   getCurrentInstance: function() { return /* reexport safe */ _core_proxy__WEBPACK_IMPORTED_MODULE_5__.getCurrentInstance; },
/* harmony export */   getCurrentScope: function() { return /* reexport safe */ _observer_effectScope__WEBPACK_IMPORTED_MODULE_4__.getCurrentScope; },
/* harmony export */   isReactive: function() { return /* reexport safe */ _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.isReactive; },
/* harmony export */   isRef: function() { return /* reexport safe */ _observer_ref__WEBPACK_IMPORTED_MODULE_2__.isRef; },
/* harmony export */   markRaw: function() { return /* reexport safe */ _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.markRaw; },
/* harmony export */   onScopeDispose: function() { return /* reexport safe */ _observer_effectScope__WEBPACK_IMPORTED_MODULE_4__.onScopeDispose; },
/* harmony export */   reactive: function() { return /* reexport safe */ _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.reactive; },
/* harmony export */   ref: function() { return /* reexport safe */ _observer_ref__WEBPACK_IMPORTED_MODULE_2__.ref; },
/* harmony export */   set: function() { return /* reexport safe */ _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.set; },
/* harmony export */   shallowReactive: function() { return /* reexport safe */ _observer_reactive__WEBPACK_IMPORTED_MODULE_1__.shallowReactive; },
/* harmony export */   shallowRef: function() { return /* reexport safe */ _observer_ref__WEBPACK_IMPORTED_MODULE_2__.shallowRef; },
/* harmony export */   toRef: function() { return /* reexport safe */ _observer_ref__WEBPACK_IMPORTED_MODULE_2__.toRef; },
/* harmony export */   toRefs: function() { return /* reexport safe */ _observer_ref__WEBPACK_IMPORTED_MODULE_2__.toRefs; },
/* harmony export */   triggerRef: function() { return /* reexport safe */ _observer_ref__WEBPACK_IMPORTED_MODULE_2__.triggerRef; },
/* harmony export */   unref: function() { return /* reexport safe */ _observer_ref__WEBPACK_IMPORTED_MODULE_2__.unref; },
/* harmony export */   useI18n: function() { return /* reexport safe */ _platform_builtInMixins_i18nMixin__WEBPACK_IMPORTED_MODULE_6__.useI18n; },
/* harmony export */   watch: function() { return /* reexport safe */ _observer_watch__WEBPACK_IMPORTED_MODULE_0__.watch; },
/* harmony export */   watchEffect: function() { return /* reexport safe */ _observer_watch__WEBPACK_IMPORTED_MODULE_0__.watchEffect; },
/* harmony export */   watchPostEffect: function() { return /* reexport safe */ _observer_watch__WEBPACK_IMPORTED_MODULE_0__.watchPostEffect; },
/* harmony export */   watchSyncEffect: function() { return /* reexport safe */ _observer_watch__WEBPACK_IMPORTED_MODULE_0__.watchSyncEffect; }
/* harmony export */ });
/* harmony import */ var _observer_watch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/watch.js");
/* harmony import */ var _observer_reactive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/reactive.js");
/* harmony import */ var _observer_ref__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/ref.js");
/* harmony import */ var _observer_computed__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/computed.js");
/* harmony import */ var _observer_effectScope__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/effectScope.js");
/* harmony import */ var _core_proxy__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/proxy.js");
/* harmony import */ var _platform_builtInMixins_i18nMixin__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/builtInMixins/i18nMixin.js");








/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/patch/ali/lifecycle.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LIFECYCLE: function() { return /* binding */ LIFECYCLE; },
/* harmony export */   lifecycleProxyMap: function() { return /* binding */ lifecycleProxyMap; }
/* harmony export */ });
/* harmony import */ var _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/innerLifecycle.js");

var APP_HOOKS = ['onLaunch', 'onShow', 'onHide', 'onError', 'onShareAppMessage', 'onUnhandledRejection', 'onPageNotFound'];
var PAGE_HOOKS = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onShareAppMessage', 'onTitleClick', 'onOptionMenuClick', 'onPullDownRefresh', 'onTabItemTap', 'onPageScroll', 'onReachBottom'];
var COMPONENT_HOOKS = ['onInit', 'deriveDataFromProps', 'didMount', 'didUpdate', 'didUnmount', 'onError', 'pageShow', 'pageHide'];
var lifecycleProxyMap = {
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.CREATED]: ['onInit'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.UPDATED]: ['didUpdate'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.MOUNTED]: ['didMount', 'onReady'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.UNMOUNTED]: ['didUnmount', 'onUnload'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONSHOW]: ['pageShow', 'onShow'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONHIDE]: ['pageHide', 'onHide'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONLOAD]: ['onLoad']
};
var LIFECYCLE = {
  APP_HOOKS: APP_HOOKS,
  PAGE_HOOKS: PAGE_HOOKS,
  COMPONENT_HOOKS: COMPONENT_HOOKS
};

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/patch/builtInKeysMap.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/innerLifecycle.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");


var builtInKeys;
if (false) {} else {
  builtInKeys = ['setup', 'dataFn', 'proto', 'mixins', 'watch', 'computed', 'mpxCustomKeysForBlend', 'mpxConvertMode', 'mpxFileResource', '__nativeRender__', '__type__', '__pageCtor__'];
}
/* harmony default export */ __webpack_exports__["default"] = ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.makeMap)(builtInKeys.concat(_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_1__.INNER_LIFECYCLES)));

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/patch/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createFactory; }
/* harmony export */ });
/* harmony import */ var _core_transferOptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/transferOptions.js");
/* harmony import */ var _builtInMixins_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/builtInMixins/index.js");
/* harmony import */ var _react_getDefaultOptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/patch/react/getDefaultOptions.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");








function createFactory(type) {
  return function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      isNative = _ref.isNative,
      customCtor = _ref.customCtor,
      customCtorType = _ref.customCtorType;
    options.__nativeRender__ = !!isNative;
    options.__type__ = type;
    var ctor;
    if (false) {}
    var getDefaultOptions;
    if (true) {
      getDefaultOptions = _react_getDefaultOptions__WEBPACK_IMPORTED_MODULE_1__.getDefaultOptions;
    } else {}
    var setup = options.setup;
    var _transferOptions = (0,_core_transferOptions__WEBPACK_IMPORTED_MODULE_2__["default"])(options, type),
      rawOptions = _transferOptions.rawOptions,
      currentInject = _transferOptions.currentInject;
    rawOptions.setup = setup;
    // 不接受mixin中的setup配置
    // 注入内建的mixins, 内建mixin是按原始平台编写的，所以合并规则和rootMixins保持一致
    // 将合并后的用户定义的rawOptions传入获取当前应该注入的内建mixins
    rawOptions.mixins = (0,_builtInMixins_index__WEBPACK_IMPORTED_MODULE_3__["default"])(rawOptions, type);
    var defaultOptions = getDefaultOptions({
      type: type,
      rawOptions: rawOptions,
      currentInject: currentInject
    });
    if (true) {
      __webpack_require__.g.__mpxOptionsMap = __webpack_require__.g.__mpxOptionsMap || {};
      __webpack_require__.g.__mpxOptionsMap[currentInject.moduleId] = defaultOptions;
    } else {}
  };
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/patch/react/getDefaultOptions.ios.js?infix=.ios&mode=ios":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultOptions: function() { return /* binding */ getDefaultOptions; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react-native");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_native__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _observer_effect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/effect.js");
/* harmony import */ var _observer_watch__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/watch.js");
/* harmony import */ var _observer_reactive__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/reactive.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _core_proxy__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/proxy.js");
/* harmony import */ var _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/innerLifecycle.js");
/* harmony import */ var _core_mergeOptions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/mergeOptions.js");
/* harmony import */ var _observer_scheduler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/scheduler.js");
/* harmony import */ var _mpxjs_api_proxy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/platform/api/create-selector-query/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }











function getSystemInfo() {
  var window = react_native__WEBPACK_IMPORTED_MODULE_1__.Dimensions.get('window');
  var screen = react_native__WEBPACK_IMPORTED_MODULE_1__.Dimensions.get('screen');
  return {
    deviceOrientation: window.width > window.height ? 'landscape' : 'portrait',
    size: {
      screenWidth: screen.width,
      screenHeight: screen.height,
      windowWidth: window.width,
      windowHeight: window.height
    }
  };
}
function getRootProps(props) {
  var rootProps = {};
  for (var key in props) {
    if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(props, key)) {
      var match = /^(bind|catch|capture-bind|capture-catch|style):?(.*?)(?:\.(.*))?$/.exec(key);
      if (match) {
        rootProps[key] = props[key];
      }
    }
  }
  return rootProps;
}
function createEffect(proxy, components, props) {
  var update = proxy.update = function () {
    // pre render for props update
    if (proxy.propsUpdatedFlag) {
      proxy.updatePreRender();
    }
    if (proxy.isMounted()) {
      proxy.callHook(_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_3__.BEFOREUPDATE);
      proxy.pendingUpdatedFlag = true;
    }
    // eslint-disable-next-line symbol-description
    proxy.stateVersion = Symbol();
    proxy.onStoreChange && proxy.onStoreChange();
  };
  update.id = proxy.uid;
  var getComponent = function getComponent(tagName) {
    if (tagName === 'block') return react__WEBPACK_IMPORTED_MODULE_0__.Fragment;
    return components[tagName] || (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.getByPath)(react_native__WEBPACK_IMPORTED_MODULE_1__, tagName);
  };
  proxy.effect = new _observer_effect__WEBPACK_IMPORTED_MODULE_4__.ReactiveEffect(function () {
    return proxy.target.__injectedRender(react__WEBPACK_IMPORTED_MODULE_0__.createElement, getComponent, getRootProps(props));
  }, function () {
    return (0,_observer_scheduler__WEBPACK_IMPORTED_MODULE_5__.queueJob)(update);
  }, proxy.scope);
}
function createInstance(_ref) {
  var propsRef = _ref.propsRef,
    type = _ref.type,
    rawOptions = _ref.rawOptions,
    currentInject = _ref.currentInject,
    validProps = _ref.validProps,
    components = _ref.components;
  var instance = Object.create(_objectSpread({
    setData: function setData(data, callback) {
      return this.__mpxProxy.forceUpdate(data, {
        sync: true
      }, callback);
    },
    __getProps: function __getProps() {
      var propsData = {};
      var props = propsRef.current;
      Object.keys(validProps).forEach(function (key) {
        if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(props, key)) {
          propsData[key] = props[key];
        } else {
          var field = validProps[key];
          if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.isFunction)(field) || field === null) {
            field = {
              type: field
            };
          }
          // 处理props默认值
          propsData[key] = field.value;
        }
      });
      return propsData;
    },
    __getSlot: function __getSlot(name) {
      var _this = this;
      var children = propsRef.current.children;
      if (children) {
        var result = [];
        if (Array.isArray(children)) {
          children.forEach(function (child) {
            if (child && child.props && child.props.slot === name) {
              result.push(child);
            }
          });
        } else {
          if (children && children.props && children.props.slot === name) {
            result.push(children);
          }
        }
        return result.filter(function (item) {
          if (_this.__dispatchedSlotSet.has(item)) {
            return false;
          } else {
            _this.__dispatchedSlotSet.add(item);
            return true;
          }
        });
      }
      return null;
    },
    __injectedRender: currentInject.render || _mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.noop,
    __getRefsData: currentInject.getRefsData || _mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.noop,
    // render helper
    _i: function _i(val, fn) {
      var i, l, keys, key;
      var result = [];
      if (Array.isArray(val) || typeof val === 'string') {
        for (i = 0, l = val.length; i < l; i++) {
          result.push(fn.call(this, val[i], i));
        }
      } else if (typeof val === 'number') {
        for (i = 0; i < val; i++) {
          result.push(fn.call(this, i + 1, i));
        }
      } else if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.isObject)(val)) {
        keys = Object.keys(val);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          result.push(fn.call(this, val[key], key, i));
        }
      }
      return result;
    },
    triggerEvent: function triggerEvent(eventName, eventDetail) {
      var props = propsRef.current;
      var handler = props && (props['bind' + eventName] || props['catch' + eventName] || props['capture-bind' + eventName] || props['capture-catch' + eventName]);
      if (handler && typeof handler === 'function') {
        var timeStamp = +new Date();
        var dataset = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.collectDataset)(props);
        var id = props.id || '';
        var eventObj = {
          type: eventName,
          timeStamp: timeStamp,
          target: {
            id: id,
            dataset: dataset,
            targetDataset: dataset
          },
          currentTarget: {
            id: id,
            dataset: dataset
          },
          detail: eventDetail
        };
        handler.call(this, eventObj);
      }
    },
    selectComponent: function selectComponent(selector) {
      return this.__selectRef(selector, 'component');
    },
    selectAllComponents: function selectAllComponents(selector) {
      return this.__selectRef(selector, 'component', true);
    },
    createSelectorQuery: function createSelectorQuery() {
      return (0,_mpxjs_api_proxy__WEBPACK_IMPORTED_MODULE_6__.createSelectorQuery)().in(this);
    },
    createIntersectionObserver: function createIntersectionObserver() {
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.error)('createIntersectionObserver is not supported in react native, please use ref instead');
    }
  }, rawOptions.methods), {
    dataset: {
      get: function get() {
        var props = propsRef.current;
        return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.collectDataset)(props);
      },
      enumerable: true
    },
    id: {
      get: function get() {
        var props = propsRef.current;
        return props.id;
      },
      enumerable: true
    }
  });
  var props = propsRef.current;
  if (type === 'page') {
    instance.route = props.route.name;
    __webpack_require__.g.__mpxPagesMap[props.route.key] = [instance, props.navigation];
  }
  var proxy = instance.__mpxProxy = new _core_proxy__WEBPACK_IMPORTED_MODULE_7__["default"](rawOptions, instance);
  proxy.created();
  if (type === 'page') {
    proxy.callHook(_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_3__.ONLOAD, [props.route.params || {}]);
  }
  Object.assign(proxy, {
    onStoreChange: null,
    // eslint-disable-next-line symbol-description
    stateVersion: Symbol(),
    subscribe: function subscribe(onStoreChange) {
      if (!proxy.effect) {
        createEffect(proxy, components, propsRef.current);
        // eslint-disable-next-line symbol-description
        proxy.stateVersion = Symbol();
      }
      proxy.onStoreChange = onStoreChange;
      return function () {
        proxy.effect && proxy.effect.stop();
        proxy.effect = null;
        proxy.onStoreChange = null;
      };
    },
    getSnapshot: function getSnapshot() {
      return proxy.stateVersion;
    }
  });
  // react数据响应组件更新管理器
  if (!proxy.effect) {
    createEffect(proxy, components, propsRef.current);
  }
  return instance;
}
function hasPageHook(mpxProxy, hookNames) {
  var options = mpxProxy.options;
  var type = options.__type__;
  return hookNames.some(function (h) {
    if (mpxProxy.hasHook(h)) {
      return true;
    }
    if (type === 'page') {
      return (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.isFunction)(options.methods && options.methods[h]);
    } else if (type === 'component') {
      return options.pageLifetimes && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.isFunction)(options.pageLifetimes[h]);
    }
    return false;
  });
}
var routeContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
var triggerPageStatusHook = function triggerPageStatusHook(mpxProxy, event) {
  mpxProxy.callHook(event === 'show' ? _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_3__.ONSHOW : _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_3__.ONHIDE);
  var pageLifetimes = mpxProxy.options.pageLifetimes;
  if (pageLifetimes) {
    var instance = mpxProxy.target;
    (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.isFunction)(pageLifetimes[event]) && pageLifetimes[event].call(instance);
  }
};
var triggerResizeEvent = function triggerResizeEvent(mpxProxy) {
  var type = mpxProxy.options.__type__;
  var systemInfo = getSystemInfo();
  var target = mpxProxy.target;
  mpxProxy.callHook(_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_3__.ONRESIZE, [systemInfo]);
  if (type === 'page') {
    target.onResize && target.onResize(systemInfo);
  } else {
    var pageLifetimes = mpxProxy.options.pageLifetimes;
    pageLifetimes && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.isFunction)(pageLifetimes.resize) && pageLifetimes.resize.call(target, systemInfo);
  }
};
function usePageContext(mpxProxy) {
  var _ref2 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(routeContext) || {},
    routeName = _ref2.routeName;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var unWatch;
    var hasShowHook = hasPageHook(mpxProxy, [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_3__.ONSHOW, 'show']);
    var hasHideHook = hasPageHook(mpxProxy, [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_3__.ONHIDE, 'hide']);
    var hasResizeHook = hasPageHook(mpxProxy, [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_3__.ONRESIZE, 'resize']);
    if (hasShowHook || hasHideHook || hasResizeHook) {
      if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(pageStatusContext, routeName)) {
        unWatch = (0,_observer_watch__WEBPACK_IMPORTED_MODULE_8__.watch)(function () {
          return pageStatusContext[routeName];
        }, function (newVal) {
          if (newVal === 'show' || newVal === 'hide') {
            triggerPageStatusHook(mpxProxy, newVal);
          } else if (/^resize/.test(newVal)) {
            triggerResizeEvent(mpxProxy);
          }
        });
      }
    }
    return function () {
      unWatch && unWatch();
    };
  }, []);
}
var pageStatusContext = (0,_observer_reactive__WEBPACK_IMPORTED_MODULE_9__.reactive)({});
function setPageStatus(routeName, val) {
  (0,_observer_reactive__WEBPACK_IMPORTED_MODULE_9__.set)(pageStatusContext, routeName, val);
}
function usePageStatus(navigation, route) {
  var isFocused = true;
  setPageStatus(route.name, '');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setPageStatus(route.name, 'show');
    var focusSubscription = navigation.addListener('focus', function () {
      setPageStatus(route.name, 'show');
      isFocused = true;
    });
    var blurSubscription = navigation.addListener('blur', function () {
      setPageStatus(route.name, 'hide');
      isFocused = false;
    });
    var unWatchAppFocusedState = (0,_observer_watch__WEBPACK_IMPORTED_MODULE_8__.watch)(__webpack_require__.g.__mpxAppFocusedState, function (value) {
      if (isFocused) {
        setPageStatus(route.name, value);
      }
    });
    return function () {
      focusSubscription();
      blurSubscription();
      unWatchAppFocusedState();
    };
  }, [navigation]);
}
function getDefaultOptions(_ref3) {
  var type = _ref3.type,
    _ref3$rawOptions = _ref3.rawOptions,
    rawOptions = _ref3$rawOptions === void 0 ? {} : _ref3$rawOptions,
    currentInject = _ref3.currentInject;
  rawOptions = (0,_core_mergeOptions__WEBPACK_IMPORTED_MODULE_10__["default"])(rawOptions, type, false);
  var components = Object.assign({}, rawOptions.components, currentInject.getComponents());
  var validProps = Object.assign({}, rawOptions.props, rawOptions.properties);
  var defaultOptions = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)( /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function (props, ref) {
    var instanceRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    var propsRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(props);
    var isFirst = false;
    if (!instanceRef.current) {
      isFirst = true;
      instanceRef.current = createInstance({
        propsRef: propsRef,
        type: type,
        rawOptions: rawOptions,
        currentInject: currentInject,
        validProps: validProps,
        components: components
      });
    }
    var instance = instanceRef.current;
    // reset instance
    instance.__refs = {};
    instance.__dispatchedSlotSet = new WeakSet();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useImperativeHandle)(ref, function () {
      return instance;
    });
    var proxy = instance.__mpxProxy;
    if (!isFirst) {
      // 处理props更新
      propsRef.current = props;
      Object.keys(props).forEach(function (key) {
        if ((0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(validProps, key)) {
          instance[key] = props[key];
        }
      });
      proxy.propsUpdated();
    }
    usePageContext(proxy);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
      if (proxy.pendingUpdatedFlag) {
        proxy.pendingUpdatedFlag = false;
        proxy.callHook(_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_3__.UPDATED);
      }
    });
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
      proxy.mounted();
      return function () {
        proxy.unmounted();
        if (type === 'page') {
          delete __webpack_require__.g.__mpxPagesMap[props.route.key];
        }
      };
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore)(proxy.subscribe, proxy.getSnapshot);
    return proxy.effect.run();
  }));
  if (type === 'page') {
    var _global$__navigationH = __webpack_require__.g.__navigationHelper,
      Provider = _global$__navigationH.Provider,
      useSafeAreaInsets = _global$__navigationH.useSafeAreaInsets;
    var pageConfig = Object.assign({}, __webpack_require__.g.__mpxPageConfig, currentInject.pageConfig);
    var Page = function Page(_ref4) {
      var navigation = _ref4.navigation,
        route = _ref4.route;
      usePageStatus(navigation, route);
      (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(function () {
        navigation.setOptions({
          headerShown: pageConfig.navigationStyle !== 'custom',
          headerTitle: pageConfig.navigationBarTitleText || '',
          headerStyle: {
            backgroundColor: pageConfig.navigationBarBackgroundColor || '#000000'
          },
          headerTintColor: pageConfig.navigationBarTextStyle || 'white'
        });
      }, []);
      var insets = useSafeAreaInsets();
      return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Provider, null, /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_native__WEBPACK_IMPORTED_MODULE_1__.View, {
        style: _objectSpread(_objectSpread({
          paddingTop: insets.top,
          paddingLeft: insets.left
        }, react_native__WEBPACK_IMPORTED_MODULE_1__.StyleSheet.absoluteFillObject), {}, {
          backgroundColor: pageConfig.backgroundColor || '#ffffff'
        })
      }, /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(routeContext.Provider, {
        value: {
          routeName: route.name
        }
      }, /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(defaultOptions, {
        navigation: navigation,
        route: route,
        pageConfig: pageConfig
      }))));
    };
    return Page;
  }
  return defaultOptions;
}

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/patch/swan/lifecycle.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LIFECYCLE: function() { return /* binding */ LIFECYCLE; },
/* harmony export */   lifecycleProxyMap: function() { return /* binding */ lifecycleProxyMap; }
/* harmony export */ });
/* harmony import */ var _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/innerLifecycle.js");

var APP_HOOKS = ['onLogin', 'onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound'];
var PAGE_HOOKS = ['onInit', 'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onPageScroll', 'onShareAppMessage', 'onTabItemTap', 'onURLQueryChange', 'onResize'];
var COMPONENT_HOOKS = ['created', 'attached', 'ready', 'detached', 'pageShow', 'pageHide'];
var lifecycleProxyMap = {
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.CREATED]: ['onInit', 'created', 'attached'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.MOUNTED]: ['ready', 'onReady'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.UNMOUNTED]: ['detached', 'onUnload'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONSHOW]: ['pageShow', 'onShow'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONHIDE]: ['pageHide', 'onHide'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONLOAD]: ['onLoad'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONRESIZE]: ['onResize']
};
var LIFECYCLE = {
  APP_HOOKS: APP_HOOKS,
  PAGE_HOOKS: PAGE_HOOKS,
  COMPONENT_HOOKS: COMPONENT_HOOKS
};

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/patch/web/lifecycle.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LIFECYCLE: function() { return /* binding */ LIFECYCLE; }
/* harmony export */ });
var COMPONENT_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'beforeDestroy', 'destroyed', 'errorCaptured', 'serverPrefetch'];
var PAGE_HOOKS = [].concat(COMPONENT_HOOKS, ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onPageScroll', 'onAddToFavorites', 'onShareAppMessage', 'onShareTimeline', 'onResize', 'onTabItemTap', 'onSaveExitState']);
var APP_HOOKS = [].concat(COMPONENT_HOOKS, ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound', 'onUnhandledRejection', 'onThemeChange', 'onSSRAppCreated', 'onAppInit']);
var LIFECYCLE = {
  APP_HOOKS: APP_HOOKS,
  PAGE_HOOKS: PAGE_HOOKS,
  COMPONENT_HOOKS: COMPONENT_HOOKS
};

/***/ }),

/***/ "./node_modules/@mpxjs/core/src/platform/patch/wx/lifecycle.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LIFECYCLE: function() { return /* binding */ LIFECYCLE; },
/* harmony export */   lifecycleProxyMap: function() { return /* binding */ lifecycleProxyMap; }
/* harmony export */ });
/* harmony import */ var _core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/core/innerLifecycle.js");

var APP_HOOKS = ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound', 'onUnhandledRejection', 'onThemeChange', 'onAppInit'];
var PAGE_HOOKS = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onPageScroll', 'onAddToFavorites', 'onShareAppMessage', 'onShareTimeline', 'onResize', 'onTabItemTap', 'onSaveExitState'];
var COMPONENT_HOOKS = ['created', 'attached', 'ready', 'moved', 'detached', 'pageShow', 'pageHide'];
var lifecycleProxyMap = {
  // 类微信平台中onLoad不能代理到CREATED上，否则Component构造页面时无法获取页面参数
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.CREATED]: ['created', 'attached'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.MOUNTED]: ['ready', 'onReady'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.UNMOUNTED]: ['detached', 'onUnload'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONSHOW]: ['pageShow', 'onShow'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONHIDE]: ['pageHide', 'onHide'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONLOAD]: ['onLoad'],
  [_core_innerLifecycle__WEBPACK_IMPORTED_MODULE_0__.ONRESIZE]: ['onResize']
};
var LIFECYCLE = {
  APP_HOOKS: APP_HOOKS,
  PAGE_HOOKS: PAGE_HOOKS,
  COMPONENT_HOOKS: COMPONENT_HOOKS
};

/***/ }),

/***/ "./node_modules/@mpxjs/store/src/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createActionsWithThis: function() { return /* binding */ createActionsWithThis; },
/* harmony export */   createGettersWithThis: function() { return /* binding */ createGettersWithThis; },
/* harmony export */   createMutationsWithThis: function() { return /* binding */ createMutationsWithThis; },
/* harmony export */   createStateWithThis: function() { return /* binding */ createStateWithThis; },
/* harmony export */   createStore: function() { return /* binding */ createStore; },
/* harmony export */   createStoreWithThis: function() { return /* binding */ createStoreWithThis; }
/* harmony export */ });
/* harmony import */ var _mpxjs_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/effectScope.js");
/* harmony import */ var _mpxjs_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/reactive.js");
/* harmony import */ var _mpxjs_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/computed.js");
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _mapStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/store/src/mapStore.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



// 兼容在web和小程序平台中创建表现一致的store


function transformGetters(getters, module, store) {
  var newGetters = {};
  var _loop = function _loop(key) {
    if (key in store.getters) {
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("Duplicate getter type: ".concat(key, "."));
    }
    var getter = function getter() {
      if (store.withThis) {
        return getters[key].call({
          state: module.state,
          getters: store.getters,
          rootState: store.state
        });
      }
      return getters[key](module.state, store.getters, store.state);
    };
    newGetters[key] = getter;
  };
  for (var key in getters) {
    _loop(key);
  }
  return newGetters;
}
function transformMutations(mutations, module, store) {
  var newMutations = {};
  var _loop2 = function _loop2(key) {
    if (store.mutations[key]) {
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("Duplicate mutation type: ".concat(key, "."));
    }
    var context = {
      state: module.state,
      commit: store.commit.bind(store)
    };
    var mutation = function mutation() {
      for (var _len = arguments.length, payload = new Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }
      if (store.withThis) return mutations[key].apply(context, payload);
      return mutations[key].apply(mutations, [module.state].concat(payload));
    };
    newMutations[key] = mutation;
  };
  for (var key in mutations) {
    _loop2(key);
  }
  return newMutations;
}
function transformActions(actions, module, store) {
  var newActions = {};
  var _loop3 = function _loop3(key) {
    if (store.actions[key]) {
      (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("Duplicate action type: ".concat(key, "."));
    }
    newActions[key] = function () {
      var context = {
        rootState: store.state,
        state: module.state,
        getters: store.getters,
        dispatch: store.dispatch.bind(store),
        commit: store.commit.bind(store)
      };
      var result;
      for (var _len2 = arguments.length, payload = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        payload[_key2] = arguments[_key2];
      }
      if (store.withThis) {
        result = actions[key].apply(context, payload);
      } else {
        result = actions[key].apply(actions, [context].concat(payload));
      }
      // action一定返回一个promise
      if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
        return result;
      } else {
        return Promise.resolve(result);
      }
    };
  };
  for (var key in actions) {
    _loop3(key);
  }
  return newActions;
}
function mergeDeps(module, deps) {
  var mergeProps = ['state', 'getters', 'mutations', 'actions'];
  Object.keys(deps).forEach(function (key) {
    var store = deps[key];
    mergeProps.forEach(function (prop) {
      if (module[prop] && key in module[prop]) {
        (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("Deps's name [".concat(key, "] conflicts with ").concat(prop, "'s key in current options."));
      } else {
        module[prop] = module[prop] || {};
        if (prop === 'getters') {
          // depsGetters单独存放，不需要重新进行初始化
          module.depsGetters = module.depsGetters || {};
          module.depsGetters[key] = store.getters;
          // module[prop][key] = () => store[prop]
        } else {
          module[prop][key] = store[prop];
        }
      }
    });
  });
}
var Store = /*#__PURE__*/function () {
  function Store(options) {
    var _this = this;
    _classCallCheck(this, Store);
    var _options$plugins = options.plugins,
      plugins = _options$plugins === void 0 ? [] : _options$plugins;
    this.withThis = options.withThis;
    this.__wrappedGetters = {};
    this.__depsGetters = {};
    this.getters = {};
    this.mutations = {};
    this.actions = {};
    this._subscribers = [];
    this._scope = (0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_2__.effectScope)(true);
    this.state = this.registerModule(options).state;
    this.resetStoreVM();
    Object.assign(this, (0,_mapStore__WEBPACK_IMPORTED_MODULE_1__["default"])(this));
    plugins.forEach(function (plugin) {
      return plugin(_this);
    });
  }
  return _createClass(Store, [{
    key: "dispatch",
    value: function dispatch(type) {
      var action = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getByPath)(this.actions, type);
      if (!action) {
        return Promise.reject(new Error("unknown action type: ".concat(type)));
      } else {
        for (var _len3 = arguments.length, payload = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          payload[_key3 - 1] = arguments[_key3];
        }
        return action.apply(void 0, payload);
      }
    }
  }, {
    key: "commit",
    value: function commit(type) {
      var _this2 = this;
      for (var _len4 = arguments.length, payload = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        payload[_key4 - 1] = arguments[_key4];
      }
      var mutation = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getByPath)(this.mutations, type);
      if (!mutation) {
        (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("Unknown mutation type: ".concat(type, "."));
      } else {
        mutation.apply(void 0, payload);
        return this._subscribers.slice().forEach(function (sub) {
          return sub({
            type: type,
            payload: payload
          }, _this2.state);
        });
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(fn, options) {
      return genericSubscribe(fn, this._subscribers, options);
    }
  }, {
    key: "registerModule",
    value: function registerModule(module) {
      var _this3 = this;
      var state = module.state || {};
      var reactiveModule = {
        state: state
      };
      if (module.getters) {
        reactiveModule.getters = transformGetters(module.getters, reactiveModule, this);
      }
      if (module.mutations) {
        reactiveModule.mutations = transformMutations(module.mutations, reactiveModule, this);
      }
      if (module.actions) {
        reactiveModule.actions = transformActions(module.actions, reactiveModule, this);
      }
      if (module.deps) {
        mergeDeps(reactiveModule, module.deps);
      }
      Object.assign(this.__depsGetters, reactiveModule.depsGetters);
      Object.assign(this.__wrappedGetters, reactiveModule.getters);
      // merge mutations
      Object.assign(this.mutations, reactiveModule.mutations);
      // merge actions
      Object.assign(this.actions, reactiveModule.actions);
      // 子module
      if (module.modules) {
        var childs = module.modules;
        Object.keys(childs).forEach(function (key) {
          reactiveModule.state[key] = _this3.registerModule(childs[key]).state;
        });
      }
      return reactiveModule;
    }
  }, {
    key: "resetStoreVM",
    value: function resetStoreVM() {
      var _this4 = this;
      this._scope.run(function () {
        if (false) { var computedKeys, vm, Vue; } else {
          (0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_3__.reactive)(_this4.state);
          var computedObj = {};
          Object.entries(_this4.__wrappedGetters).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];
            computedObj[key] = (0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_4__.computed)(value);
          });
          (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.proxy)(_this4.getters, computedObj);
          (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.proxy)(_this4.getters, _this4.__depsGetters);
        }
      });
    }
  }]);
}();
function genericSubscribe(fn, subs, options) {
  if (subs.indexOf(fn) < 0) {
    options && options.prepend ? subs.unshift(fn) : subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  };
}
function createStore(options) {
  return new Store(options);
}

// ts util functions
function createStateWithThis(state) {
  return state;
}
function createGettersWithThis(getters) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return getters;
}
function createMutationsWithThis(mutations) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return mutations;
}
function createActionsWithThis(actions) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return actions;
}
function createStoreWithThis(options) {
  options.withThis = true;
  return new Store(options);
}

/***/ }),

/***/ "./node_modules/@mpxjs/store/src/mapStore.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/index.js");
/* harmony import */ var _mpxjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/computed.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


function normalizeMap(prefix, arr) {
  if (typeof prefix !== 'string') {
    arr = prefix;
    prefix = '';
  }
  if (Array.isArray(arr)) {
    var map = {};
    arr.forEach(function (value) {
      map[value] = prefix ? "".concat(prefix, ".").concat(value) : value;
    });
    return map;
  }
  if (prefix && (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(arr)) {
    arr = Object.assign({}, arr);
    Object.keys(arr).forEach(function (key) {
      if (typeof arr[key] === 'string') {
        arr[key] = "".concat(prefix, ".").concat(arr[key]);
      }
    });
  }
  return arr;
}
function mapFactory(type, store) {
  return function (depPath, maps) {
    maps = normalizeMap(depPath, maps);
    var result = {};
    Object.entries(maps).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      result[key] = function (payload) {
        switch (type) {
          case 'state':
            if (typeof value === 'function') {
              return value.call(this, store.state, store.getters);
            } else {
              var stateVal = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getByPath)(store.state, value, '', '__NOTFOUND__');
              if (stateVal === '__NOTFOUND__') {
                (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("Unknown state named [".concat(value, "]."));
                stateVal = '';
              }
              return stateVal;
            }
          case 'getters':
            {
              var getterVal = (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.getByPath)(store.getters, value, '', '__NOTFOUND__');
              if (getterVal === '__NOTFOUND__') {
                (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.warn)("Unknown getter named [".concat(value, "]."));
                getterVal = '';
              }
              return getterVal;
            }
          case 'mutations':
            return store.commit(value, payload);
          case 'actions':
            return store.dispatch(value, payload);
        }
      };
    });
    return result;
  };
}
function checkMapInstance(args) {
  var context = args[args.length - 1];
  var isValid = context && _typeof(context) === 'object' && context.__mpxProxy;
  if (!isValid) {
    (0,_mpxjs_utils__WEBPACK_IMPORTED_MODULE_0__.error)('调用map**ToInstance时必须传入当前component实例this');
  }
  args.splice(-1);
  return {
    restParams: args,
    context: context
  };
}
function mapComputedToInstance(result, context) {
  var options =  false ? 0 : context.__mpxProxy.options;
  options.computed = options.computed || {};
  Object.assign(options.computed, result);
}
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(store) {
  var mapState = mapFactory('state', store);
  var mapGetters = mapFactory('getters', store);
  var mapMutations = mapFactory('mutations', store);
  var mapActions = mapFactory('actions', store);
  return {
    mapState: mapState,
    mapGetters: mapGetters,
    mapMutations: mapMutations,
    mapActions: mapActions,
    // map*ToRefs用于组合式API解构获取响应式数据
    mapStateToRefs: function mapStateToRefs() {
      var result = {};
      Object.entries(mapState.apply(void 0, arguments)).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];
        result[key] = (0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_1__.computed)(value);
      });
      return result;
    },
    mapGettersToRefs: function mapGettersToRefs() {
      var result = {};
      Object.entries(mapGetters.apply(void 0, arguments)).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
          key = _ref6[0],
          value = _ref6[1];
        result[key] = (0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_1__.computed)(value);
      });
      return result;
    },
    // 以下是map*ToInstance用于异步store的,参数args：depPath, maps, context
    mapStateToInstance: function mapStateToInstance() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var _checkMapInstance = checkMapInstance(args),
        context = _checkMapInstance.context,
        restParams = _checkMapInstance.restParams;
      var result = mapState.apply(void 0, _toConsumableArray(restParams));
      // 将result挂载到mpxProxy实例属性上
      mapComputedToInstance(result, context);
    },
    mapGettersToInstance: function mapGettersToInstance() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      var _checkMapInstance2 = checkMapInstance(args),
        context = _checkMapInstance2.context,
        restParams = _checkMapInstance2.restParams;
      var result = mapGetters.apply(void 0, _toConsumableArray(restParams));
      mapComputedToInstance(result, context);
    },
    mapMutationsToInstance: function mapMutationsToInstance() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      var _checkMapInstance3 = checkMapInstance(args),
        context = _checkMapInstance3.context,
        restParams = _checkMapInstance3.restParams;
      var result = mapMutations.apply(void 0, _toConsumableArray(restParams));
      Object.assign(context, result);
    },
    mapActionsToInstance: function mapActionsToInstance() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      var _checkMapInstance4 = checkMapInstance(args),
        context = _checkMapInstance4.context,
        restParams = _checkMapInstance4.restParams;
      var result = mapActions.apply(void 0, _toConsumableArray(restParams));
      Object.assign(context, result);
    }
  };
}

/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/array.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayProtoAugment: function() { return /* binding */ arrayProtoAugment; },
/* harmony export */   findItem: function() { return /* binding */ findItem; },
/* harmony export */   isValidArrayIndex: function() { return /* binding */ isValidArrayIndex; },
/* harmony export */   makeMap: function() { return /* binding */ makeMap; },
/* harmony export */   remove: function() { return /* binding */ remove; }
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function makeMap(arr) {
  return arr.reduce(function (obj, item) {
    obj[item] = true;
    return obj;
  }, {});
}
function findItem() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var _iterator = _createForOfIteratorHelper(arr),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      if (key instanceof RegExp && key.test(item) || item === key) {
        return true;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return false;
}
function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

// 微信小程序插件环境2.8.3以下基础库protoAugment会失败，对环境进行测试按需降级为copyAugment
function testArrayProtoAugment() {
  var arr = [];
  /* eslint-disable no-proto, camelcase */
  arr.__proto__ = {
    __array_proto_test__: '__array_proto_test__'
  };
  return arr.__array_proto_test__ === '__array_proto_test__';
}
var arrayProtoAugment = testArrayProtoAugment();
function isValidArrayIndex(val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}


/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/base.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aliasReplace: function() { return /* binding */ aliasReplace; },
/* harmony export */   dash2hump: function() { return /* binding */ dash2hump; },
/* harmony export */   def: function() { return /* binding */ def; },
/* harmony export */   forEach: function() { return /* binding */ forEach; },
/* harmony export */   hasChanged: function() { return /* binding */ hasChanged; },
/* harmony export */   hasProto: function() { return /* binding */ hasProto; },
/* harmony export */   hump2dash: function() { return /* binding */ hump2dash; },
/* harmony export */   isArray: function() { return /* binding */ isArray; },
/* harmony export */   isBoolean: function() { return /* binding */ isBoolean; },
/* harmony export */   isDef: function() { return /* binding */ isDef; },
/* harmony export */   isEmptyObject: function() { return /* binding */ isEmptyObject; },
/* harmony export */   isFunction: function() { return /* binding */ isFunction; },
/* harmony export */   isNumber: function() { return /* binding */ isNumber; },
/* harmony export */   isNumberStr: function() { return /* binding */ isNumberStr; },
/* harmony export */   isObject: function() { return /* binding */ isObject; },
/* harmony export */   isString: function() { return /* binding */ isString; },
/* harmony export */   isValidIdentifierStr: function() { return /* binding */ isValidIdentifierStr; },
/* harmony export */   noop: function() { return /* binding */ noop; },
/* harmony export */   type: function() { return /* binding */ type; }
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var noop = function noop() {};
function isString(str) {
  return typeof str === 'string';
}
function isBoolean(bool) {
  return typeof bool === 'boolean';
}
function isNumber(num) {
  return typeof num === 'number';
}
function isArray(arr) {
  return Array.isArray(arr);
}
function isFunction(fn) {
  return typeof fn === 'function';
}
function isDef(v) {
  return v !== undefined && v !== null;
}
function isObject(obj) {
  return obj !== null && _typeof(obj) === 'object';
}
function isEmptyObject(obj) {
  if (!obj) {
    return true;
  }
  /* eslint-disable no-unreachable-loop */
  for (var key in obj) {
    return false;
  }
  return true;
}
function forEach(obj, fn) {
  if (obj === null || typeof obj === 'undefined') {
    return;
  }
  if (_typeof(obj) !== 'object') {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      fn(obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn(obj[key], key, obj);
      }
    }
  }
}
function isNumberStr(str) {
  return /^\d+$/.test(str);
}
function isValidIdentifierStr(str) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(str);
}
var hasProto = ('__proto__' in {});
function dash2hump(value) {
  return value.replace(/-([a-z])/g, function (match, p1) {
    return p1.toUpperCase();
  });
}
function hump2dash(value) {
  return value.replace(/[A-Z]/g, function (match) {
    return '-' + match.toLowerCase();
  });
}
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

// type在支付宝环境下不一定准确，判断是普通对象优先使用isPlainObject（新版支付宝不复现，issue #644 修改isPlainObject实现与type等价）
function type(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function aliasReplace() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var alias = arguments.length > 1 ? arguments[1] : undefined;
  var target = arguments.length > 2 ? arguments[2] : undefined;
  if (options[alias]) {
    if (Array.isArray(options[alias])) {
      options[target] = options[alias].concat(options[target] || []);
    } else if (isObject(options[alias])) {
      options[target] = Object.assign({}, options[alias], options[target]);
    } else {
      options[target] = options[alias];
    }
    delete options[alias];
  }
  return options;
}

// 比较一个值是否发生了变化（考虑NaN）。
function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue);
}


/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/element.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   collectDataset: function() { return /* binding */ collectDataset; },
/* harmony export */   parseDataset: function() { return /* binding */ parseDataset; },
/* harmony export */   parseSelector: function() { return /* binding */ parseSelector; },
/* harmony export */   walkChildren: function() { return /* binding */ walkChildren; }
/* harmony export */ });
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/object.js");

function parseSelector(selector) {
  var groups = selector.split(',');
  return groups.map(function (item) {
    var id;
    var ret = /#([^#.>\s]+)/.exec(item);
    if (ret) id = ret[1];
    var classes = [];
    var classReg = /\.([^#.>\s]+)/g;
    while (ret = classReg.exec(item)) {
      classes.push(ret[1]);
    }
    return {
      id: id,
      classes: classes
    };
  });
}
function matchSelector(vnode, selectorGroups) {
  var vnodeId;
  var vnodeClasses = [];
  if (vnode && vnode.data) {
    if (vnode.data.attrs && vnode.data.attrs.id) vnodeId = vnode.data.attrs.id;
    if (vnode.data.staticClass) vnodeClasses = vnode.data.staticClass.split(/\s+/);
  }
  if (vnodeId || vnodeClasses.length) {
    for (var i = 0; i < selectorGroups.length; i++) {
      var _selectorGroups$i = selectorGroups[i],
        id = _selectorGroups$i.id,
        classes = _selectorGroups$i.classes;
      if (id === vnodeId) return true;
      if (classes.every(function (item) {
        return vnodeClasses.includes(item);
      })) return true;
    }
  }
  return false;
}
function walkChildren(vm, selectorGroups, context, result, all) {
  if (vm.$children && vm.$children.length) {
    for (var i = 0; i < vm.$children.length; i++) {
      var child = vm.$children[i];
      if (child.$vnode.context === context && !child.$options.__mpxBuiltIn) {
        if (matchSelector(child.$vnode, selectorGroups)) {
          result.push(child);
          if (!all) return;
        }
      }
      walkChildren(child, selectorGroups, context, result, all);
    }
  }
}
var mpxEscapeReg = /(.+)MpxEscape$/;
function parseDataset(dataset) {
  var parsed = {};
  for (var key in dataset) {
    if ((0,_object__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(dataset, key)) {
      if (mpxEscapeReg.test(dataset[key])) {
        try {
          parsed[key] = JSON.parse(mpxEscapeReg.exec(dataset[key])[1]);
        } catch (e) {
          parsed[key] = dataset[key];
        }
      } else {
        parsed[key] = dataset[key];
      }
    }
  }
  return parsed;
}
var datasetReg = /^data-(.+)$/;
function collectDataset(props) {
  var needParse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var dataset = {};
  for (var key in props) {
    if ((0,_object__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(props, key)) {
      var matched = datasetReg.exec(key);
      if (matched) {
        dataset[matched[1]] = props[key];
      }
    }
  }
  return needParse ? parseDataset(dataset) : dataset;
}


/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/env.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getEnvObj: function() { return /* binding */ getEnvObj; },
/* harmony export */   isBrowser: function() { return /* binding */ isBrowser; },
/* harmony export */   isDev: function() { return /* binding */ isDev; },
/* harmony export */   isReact: function() { return /* binding */ isReact; }
/* harmony export */ });
function getEnvObj() {
  switch ("ios") {
    case 'wx':
      return wx;
    case 'ali':
      return my;
    case 'swan':
      return swan;
    case 'qq':
      return qq;
    case 'tt':
      return tt;
    case 'jd':
      return jd;
    case 'qa':
      return qa;
    case 'dd':
      return dd;
    default:
      return {};
  }
}
var isBrowser = typeof window !== 'undefined';
var isDev = process.env.NODE_ENV !== 'production';
var isReact =  true || 0;

/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/errorHandling.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   callWithErrorHandling: function() { return /* binding */ callWithErrorHandling; }
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/base.js");
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/utils/src/log.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }


function callWithErrorHandling(fn, instance, info, args) {
  if (!(0,_base__WEBPACK_IMPORTED_MODULE_0__.isFunction)(fn)) return;
  try {
    return args ? fn.apply(void 0, _toConsumableArray(args)) : fn();
  } catch (e) {
    var _instance$options;
    (0,_log__WEBPACK_IMPORTED_MODULE_1__.error)("Unhandled error occurs".concat(info ? " during execution of ".concat(info) : '', "!"), instance === null || instance === void 0 || (_instance$options = instance.options) === null || _instance$options === void 0 ? void 0 : _instance$options.mpxFileResource, e);
  }
}

/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/index.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aIsSubPathOfB: function() { return /* reexport safe */ _path__WEBPACK_IMPORTED_MODULE_3__.aIsSubPathOfB; },
/* harmony export */   aliasReplace: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.aliasReplace; },
/* harmony export */   arrayProtoAugment: function() { return /* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_4__.arrayProtoAugment; },
/* harmony export */   buildUrl: function() { return /* reexport safe */ _url__WEBPACK_IMPORTED_MODULE_9__.buildUrl; },
/* harmony export */   callWithErrorHandling: function() { return /* reexport safe */ _errorHandling__WEBPACK_IMPORTED_MODULE_6__.callWithErrorHandling; },
/* harmony export */   collectDataset: function() { return /* reexport safe */ _element__WEBPACK_IMPORTED_MODULE_7__.collectDataset; },
/* harmony export */   dash2hump: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.dash2hump; },
/* harmony export */   def: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.def; },
/* harmony export */   diffAndCloneA: function() { return /* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_2__.diffAndCloneA; },
/* harmony export */   doGetByPath: function() { return /* reexport safe */ _path__WEBPACK_IMPORTED_MODULE_3__.doGetByPath; },
/* harmony export */   enumerableKeys: function() { return /* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_2__.enumerableKeys; },
/* harmony export */   error: function() { return /* reexport safe */ _log__WEBPACK_IMPORTED_MODULE_0__.error; },
/* harmony export */   findItem: function() { return /* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_4__.findItem; },
/* harmony export */   forEach: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.forEach; },
/* harmony export */   getByPath: function() { return /* reexport safe */ _path__WEBPACK_IMPORTED_MODULE_3__.getByPath; },
/* harmony export */   getEnvObj: function() { return /* reexport safe */ _env__WEBPACK_IMPORTED_MODULE_8__.getEnvObj; },
/* harmony export */   getFirstKey: function() { return /* reexport safe */ _path__WEBPACK_IMPORTED_MODULE_3__.getFirstKey; },
/* harmony export */   hasChanged: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.hasChanged; },
/* harmony export */   hasOwn: function() { return /* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_2__.hasOwn; },
/* harmony export */   hasProto: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.hasProto; },
/* harmony export */   hump2dash: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.hump2dash; },
/* harmony export */   isArray: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.isArray; },
/* harmony export */   isBoolean: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.isBoolean; },
/* harmony export */   isBrowser: function() { return /* reexport safe */ _env__WEBPACK_IMPORTED_MODULE_8__.isBrowser; },
/* harmony export */   isDef: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.isDef; },
/* harmony export */   isDev: function() { return /* reexport safe */ _env__WEBPACK_IMPORTED_MODULE_8__.isDev; },
/* harmony export */   isEmptyObject: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.isEmptyObject; },
/* harmony export */   isFunction: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.isFunction; },
/* harmony export */   isNumber: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.isNumber; },
/* harmony export */   isNumberStr: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.isNumberStr; },
/* harmony export */   isObject: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.isObject; },
/* harmony export */   isPlainObject: function() { return /* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_2__.isPlainObject; },
/* harmony export */   isReact: function() { return /* reexport safe */ _env__WEBPACK_IMPORTED_MODULE_8__.isReact; },
/* harmony export */   isString: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.isString; },
/* harmony export */   isValidArrayIndex: function() { return /* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_4__.isValidArrayIndex; },
/* harmony export */   isValidIdentifierStr: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.isValidIdentifierStr; },
/* harmony export */   makeMap: function() { return /* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_4__.makeMap; },
/* harmony export */   mergeData: function() { return /* reexport safe */ _merge__WEBPACK_IMPORTED_MODULE_5__.mergeData; },
/* harmony export */   mergeObj: function() { return /* reexport safe */ _merge__WEBPACK_IMPORTED_MODULE_5__.mergeObj; },
/* harmony export */   mergeObjectArray: function() { return /* reexport safe */ _merge__WEBPACK_IMPORTED_MODULE_5__.mergeObjectArray; },
/* harmony export */   noop: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.noop; },
/* harmony export */   parseDataset: function() { return /* reexport safe */ _element__WEBPACK_IMPORTED_MODULE_7__.parseDataset; },
/* harmony export */   parseQuery: function() { return /* reexport safe */ _url__WEBPACK_IMPORTED_MODULE_9__.parseQuery; },
/* harmony export */   parseSelector: function() { return /* reexport safe */ _element__WEBPACK_IMPORTED_MODULE_7__.parseSelector; },
/* harmony export */   parseUrl: function() { return /* reexport safe */ _url__WEBPACK_IMPORTED_MODULE_9__.parseUrl; },
/* harmony export */   processUndefined: function() { return /* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_2__.processUndefined; },
/* harmony export */   proxy: function() { return /* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_2__.proxy; },
/* harmony export */   remove: function() { return /* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_4__.remove; },
/* harmony export */   serialize: function() { return /* reexport safe */ _url__WEBPACK_IMPORTED_MODULE_9__.serialize; },
/* harmony export */   setByPath: function() { return /* reexport safe */ _path__WEBPACK_IMPORTED_MODULE_3__.setByPath; },
/* harmony export */   spreadProp: function() { return /* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_2__.spreadProp; },
/* harmony export */   type: function() { return /* reexport safe */ _base__WEBPACK_IMPORTED_MODULE_1__.type; },
/* harmony export */   walkChildren: function() { return /* reexport safe */ _element__WEBPACK_IMPORTED_MODULE_7__.walkChildren; },
/* harmony export */   warn: function() { return /* reexport safe */ _log__WEBPACK_IMPORTED_MODULE_0__.warn; }
/* harmony export */ });
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/log.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/utils/src/base.js");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/utils/src/object.js");
/* harmony import */ var _path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/utils/src/path.js");
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/utils/src/array.js");
/* harmony import */ var _merge__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@mpxjs/utils/src/merge.js");
/* harmony import */ var _errorHandling__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@mpxjs/utils/src/errorHandling.js");
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@mpxjs/utils/src/element.js");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@mpxjs/utils/src/env.js");
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@mpxjs/utils/src/url.js");











/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/log.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   error: function() { return /* binding */ error; },
/* harmony export */   warn: function() { return /* binding */ warn; }
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/base.js");

var isDev = process.env.NODE_ENV !== 'production';
function warn(msg, location, e) {
  var _global$__mpx;
  var condition = (_global$__mpx = __webpack_require__.g.__mpx) === null || _global$__mpx === void 0 ? void 0 : _global$__mpx.config.ignoreWarning;
  var ignore = false;
  if (typeof condition === 'boolean') {
    ignore = condition;
  } else if (typeof condition === 'string') {
    ignore = msg.indexOf(condition) !== -1;
  } else if (typeof condition === 'function') {
    ignore = condition(msg, location, e);
  } else if (condition instanceof RegExp) {
    ignore = condition.test(msg);
  }
  if (!ignore) return log('warn', msg, location, e);
}
function error(msg, location, e) {
  var _global$__mpx2;
  var errorHandler = (_global$__mpx2 = __webpack_require__.g.__mpx) === null || _global$__mpx2 === void 0 ? void 0 : _global$__mpx2.config.errorHandler;
  if ((0,_base__WEBPACK_IMPORTED_MODULE_0__.isFunction)(errorHandler)) {
    errorHandler(msg, location, e);
  }
  return log('error', msg, location, e);
}
function log(type, msg, location, e) {
  if (isDev) {
    var header = "[Mpx runtime ".concat(type, "]: ");
    if (location) {
      header = "[Mpx runtime ".concat(type, " at ").concat(location, "]: ");
    }
    console[type](header + msg);
    if (e) console[type](e);
  }
}

/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/merge.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeData: function() { return /* binding */ mergeData; },
/* harmony export */   mergeObj: function() { return /* binding */ mergeObj; },
/* harmony export */   mergeObjectArray: function() { return /* binding */ mergeObjectArray; }
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/base.js");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/utils/src/object.js");
/* harmony import */ var _path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/utils/src/path.js");



function doMergeData(target, source) {
  Object.keys(source).forEach(function (srcKey) {
    if ((0,_object__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(target, srcKey)) {
      target[srcKey] = source[srcKey];
    } else {
      var processed = false;
      var tarKeys = Object.keys(target);
      for (var i = 0; i < tarKeys.length; i++) {
        var tarKey = tarKeys[i];
        if ((0,_path__WEBPACK_IMPORTED_MODULE_2__.aIsSubPathOfB)(tarKey, srcKey)) {
          delete target[tarKey];
          target[srcKey] = source[srcKey];
          processed = true;
          continue;
        }
        var subPath = (0,_path__WEBPACK_IMPORTED_MODULE_2__.aIsSubPathOfB)(srcKey, tarKey);
        if (subPath) {
          (0,_path__WEBPACK_IMPORTED_MODULE_2__.setByPath)(target[tarKey], subPath, source[srcKey]);
          processed = true;
          break;
        }
      }
      if (!processed) {
        target[srcKey] = source[srcKey];
      }
    }
  });
  return target;
}
function mergeData(target) {
  if (target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }
    sources.forEach(function (source) {
      if (source) doMergeData(target, source);
    });
  }
  return target;
}

// 用于合并i18n语言集
function mergeObj(target) {
  if ((0,_base__WEBPACK_IMPORTED_MODULE_0__.isObject)(target)) {
    for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      sources[_key2 - 1] = arguments[_key2];
    }
    var _loop = function _loop() {
      var source = _sources[_i];
      if ((0,_base__WEBPACK_IMPORTED_MODULE_0__.isObject)(source)) {
        Object.keys(source).forEach(function (key) {
          if ((0,_base__WEBPACK_IMPORTED_MODULE_0__.isObject)(source[key]) && (0,_base__WEBPACK_IMPORTED_MODULE_0__.isObject)(target[key])) {
            mergeObj(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        });
      }
    };
    for (var _i = 0, _sources = sources; _i < _sources.length; _i++) {
      _loop();
    }
  }
  return target;
}
function mergeObjectArray(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      Object.assign(res, arr[i]);
    }
  }
  return res;
}


/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/object.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   diffAndCloneA: function() { return /* binding */ diffAndCloneA; },
/* harmony export */   enumerableKeys: function() { return /* binding */ enumerableKeys; },
/* harmony export */   hasOwn: function() { return /* binding */ hasOwn; },
/* harmony export */   isPlainObject: function() { return /* binding */ isPlainObject; },
/* harmony export */   processUndefined: function() { return /* binding */ processUndefined; },
/* harmony export */   proxy: function() { return /* binding */ proxy; },
/* harmony export */   spreadProp: function() { return /* binding */ spreadProp; }
/* harmony export */ });
/* harmony import */ var _mpxjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/reactive.js");
/* harmony import */ var _mpxjs_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/ref.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/base.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }


var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
function isPlainObject(value) {
  var _global$__mpx;
  if (value === null || _typeof(value) !== 'object' || (0,_base__WEBPACK_IMPORTED_MODULE_0__.type)(value) !== 'Object') return false;
  var proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  // 处理支付宝接口返回数据对象的__proto__与js中创建对象的__proto__不一致的问题，判断value.__proto__.__proto__ === null时也认为是plainObject
  var innerProto = Object.getPrototypeOf(proto);
  if (proto === Object.prototype || innerProto === null) return true;
  // issue #644
  var observeClassInstance = (_global$__mpx = __webpack_require__.g.__mpx) === null || _global$__mpx === void 0 ? void 0 : _global$__mpx.config.observeClassInstance;
  if (observeClassInstance) {
    if (Array.isArray(observeClassInstance)) {
      for (var i = 0; i < observeClassInstance.length; i++) {
        if (proto === observeClassInstance[i].prototype) return true;
      }
    } else {
      return true;
    }
  }
  return false;
}
function diffAndCloneA(a, b) {
  var diffData = null;
  var curPath = '';
  var diff = false;
  function deepDiffAndCloneA(a, b, currentDiff, bIsEmpty) {
    var setDiff = function setDiff(val) {
      if (val && !currentDiff) {
        currentDiff = val;
        if (curPath) {
          diffData = diffData || {};
          diffData[curPath] = clone;
        }
      }
    };
    var clone = a;
    setDiff(bIsEmpty);
    if (_typeof(a) !== 'object' || a === null) {
      setDiff(a !== b);
    } else {
      var _toString = Object.prototype.toString;
      var className = _toString.call(a);
      var sameClass = className === _toString.call(b);
      var length;
      var lastPath;
      if (isPlainObject(a)) {
        var keys = Object.keys(a);
        length = keys.length;
        clone = {};
        setDiff(!sameClass || length < Object.keys(b).length || !Object.keys(b).every(function (key) {
          return hasOwn(a, key);
        }));
        lastPath = curPath;
        for (var i = 0; i < length; i++) {
          var key = keys[i];
          curPath += ".".concat(key);
          clone[key] = deepDiffAndCloneA(a[key], sameClass ? b[key] : undefined, currentDiff, !(sameClass && hasOwn(b, key)));
          curPath = lastPath;
        }
        // 继承原始对象的freeze/seal/preventExtensions操作
        if (Object.isFrozen(a)) {
          Object.freeze(clone);
        } else if (Object.isSealed(a)) {
          Object.seal(clone);
        } else if (!Object.isExtensible(a)) {
          Object.preventExtensions(clone);
        }
      } else if (Array.isArray(a)) {
        length = a.length;
        clone = [];
        setDiff(!sameClass || length < b.length);
        lastPath = curPath;
        for (var _i = 0; _i < length; _i++) {
          curPath += "[".concat(_i, "]");
          clone[_i] = deepDiffAndCloneA(a[_i], sameClass ? b[_i] : undefined, currentDiff, !(sameClass && _i < b.length));
          curPath = lastPath;
        }
        // 继承原始数组的freeze/seal/preventExtensions操作
        if (Object.isFrozen(a)) {
          Object.freeze(clone);
        } else if (Object.isSealed(a)) {
          Object.seal(clone);
        } else if (!Object.isExtensible(a)) {
          Object.preventExtensions(clone);
        }
      } else if (a instanceof RegExp) {
        setDiff(!sameClass || '' + a !== '' + b);
      } else if (a instanceof Date) {
        setDiff(!sameClass || +a !== +b);
      } else {
        setDiff(!sameClass || a !== b);
      }
    }
    if (currentDiff) {
      diff = currentDiff;
    }
    return clone;
  }
  return {
    clone: deepDiffAndCloneA(a, b, diff),
    diff: diff,
    diffData: diffData
  };
}
function proxy(target, source, keys, readonly, onConflict) {
  keys = keys || Object.keys(source);
  keys.forEach(function (key) {
    var descriptor = {
      get: function get() {
        var val = source[key];
        return !(0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_1__.isReactive)(source) && (0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_2__.isRef)(val) ? val.value : val;
      },
      configurable: true,
      enumerable: true
    };
    descriptor.set = readonly ? _base__WEBPACK_IMPORTED_MODULE_0__.noop : function (val) {
      // 对reactive对象代理时不需要处理ref解包
      if (!(0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_1__.isReactive)(source)) {
        var oldVal = source[key];
        if ((0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_2__.isRef)(oldVal) && !(0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_2__.isRef)(val)) {
          oldVal.value = val;
          return;
        }
      }
      source[key] = val;
    };
    if (onConflict) {
      if (key in target) {
        if (onConflict(key) === false) return;
      }
    }
    Object.defineProperty(target, key, descriptor);
  });
  return target;
}
function spreadProp(obj, key) {
  if (hasOwn(obj, key)) {
    var temp = obj[key];
    delete obj[key];
    Object.assign(obj, temp);
  }
  return obj;
}

// 包含原型链上属性keys
function enumerableKeys(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  return keys;
}
function processUndefined(obj) {
  var result = {};
  for (var key in obj) {
    if (hasOwn(obj, key)) {
      if (obj[key] !== undefined) {
        result[key] = obj[key];
      } else {
        result[key] = '';
      }
    }
  }
  return result;
}


/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/path.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aIsSubPathOfB: function() { return /* binding */ aIsSubPathOfB; },
/* harmony export */   doGetByPath: function() { return /* binding */ doGetByPath; },
/* harmony export */   getByPath: function() { return /* binding */ getByPath; },
/* harmony export */   getFirstKey: function() { return /* binding */ getFirstKey; },
/* harmony export */   setByPath: function() { return /* binding */ setByPath; }
/* harmony export */ });
/* harmony import */ var _mpxjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/observer/reactive.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var curStack;
var targetStacks;
var property;
var Stack = /*#__PURE__*/function () {
  function Stack(mark) {
    _classCallCheck(this, Stack);
    this.mark = mark;
    // 字符串stack需要特殊处理
    this.type = /['"]/.test(mark) ? 'string' : 'normal';
    this.value = [];
  }
  return _createClass(Stack, [{
    key: "push",
    value: function push(data) {
      this.value.push(data);
    }
  }]);
}();
function startStack(mark) {
  // 开启栈或关闭栈都意味着前面的字符拼接截止
  propertyJoinOver();
  curStack && targetStacks.push(curStack);
  curStack = new Stack(mark);
}
function endStack() {
  // 开启栈或关闭栈都意味着前面的字符拼接截止
  propertyJoinOver();
  // 字符串栈直接拼接
  var result = curStack.type === 'string' ? '__mpx_str_' + curStack.value.join('') : curStack.value;
  curStack = targetStacks.pop();
  // 将当前stack结果保存到父级stack里
  curStack.push(result);
}
function propertyJoinOver() {
  property = property.trim();
  if (property) curStack.push(property);
  property = '';
}
function init() {
  property = '';
  // 根stack
  curStack = new Stack();
  targetStacks = [];
}
function parse(str) {
  init();
  var _iterator = _createForOfIteratorHelper(str),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var char = _step.value;
      // 当前遍历引号内的字符串时
      if (curStack.type === 'string') {
        // 若为对应的结束flag，则出栈，反之直接push
        curStack.mark === char ? endStack() : curStack.push(char);
      } else if (/['"[]/.test(char)) {
        startStack(char);
      } else if (char === ']') {
        endStack();
      } else if (char === '.' || char === '+') {
        propertyJoinOver();
        if (char === '+') curStack.push(char);
      } else {
        property += char;
      }
    }
    // 字符解析收尾
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  propertyJoinOver();
  return curStack.value;
}
function outPutByPath(context, path, isSimple, transfer) {
  var result = context;
  var len = path.length;
  var meta = {
    isEnd: false,
    stop: false
  };
  for (var index = 0; index < len; index++) {
    if (index === len - 1) meta.isEnd = true;
    var key = void 0;
    var item = path[index];
    if (result) {
      if (isSimple) {
        key = item;
      } else if (Array.isArray(item)) {
        // 获取子数组的输出结果作为当前key
        key = outPutByPath(context, item, isSimple, transfer);
      } else if (/^__mpx_str_/.test(item)) {
        // 字符串一定会被[]包裹，一定在子数组中
        result = item.replace('__mpx_str_', '');
      } else if (/^\d+$/.test(item)) {
        // 数字一定会被[]包裹，一定在子数组中
        result = +item;
      } else if (item === '+') {
        // 获取加号后面所有path最终的结果
        result += outPutByPath(context, path.slice(index + 1), isSimple, transfer);
        break;
      } else {
        key = item;
      }
      if (key !== undefined) {
        result = transfer ? transfer(result, key, meta) : result[key];
        if (meta.stop) break;
      }
    } else {
      break;
    }
  }
  return result;
}
function doGetByPath(context, pathStrOrArr, transfer) {
  if (!pathStrOrArr) {
    return context;
  }
  var isSimple = false;
  if (Array.isArray(pathStrOrArr)) {
    isSimple = true;
  } else if (!/[[\]]/.test(pathStrOrArr)) {
    pathStrOrArr = pathStrOrArr.split('.');
    isSimple = true;
  }
  if (!isSimple) pathStrOrArr = parse(pathStrOrArr);
  return outPutByPath(context, pathStrOrArr, isSimple, transfer);
}
function isExist(obj, attr) {
  var type = _typeof(obj);
  var isNullOrUndefined = obj === null || obj === undefined;
  if (isNullOrUndefined) {
    return false;
  } else if (type === 'object' || type === 'function') {
    return attr in obj;
  } else {
    return obj[attr] !== undefined;
  }
}
function getByPath(data, pathStrOrArr, defaultVal, errTip) {
  var result = doGetByPath(data, pathStrOrArr, function (value, key) {
    var newValue;
    if (isExist(value, key)) {
      newValue = value[key];
    } else {
      newValue = errTip;
    }
    return newValue;
  });
  // 小程序setData时不允许undefined数据
  return result === undefined ? defaultVal : result;
}
function setByPath(data, pathStrOrArr, value) {
  doGetByPath(data, pathStrOrArr, function (current, key, meta) {
    if (meta.isEnd) {
      (0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_0__.set)(current, key, value);
    } else if (!current[key]) {
      current[key] = {};
    }
    return current[key];
  });
}
function getFirstKey(path) {
  return /^[^[.]*/.exec(path)[0];
}
function aIsSubPathOfB(a, b) {
  if (a.startsWith(b) && a !== b) {
    var nextChar = a[b.length];
    if (nextChar === '.') {
      return a.slice(b.length + 1);
    } else if (nextChar === '[') {
      return a.slice(b.length);
    }
  }
}


/***/ }),

/***/ "./node_modules/@mpxjs/utils/src/url.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildUrl: function() { return /* binding */ buildUrl; },
/* harmony export */   parseQuery: function() { return /* binding */ parseQuery; },
/* harmony export */   parseUrl: function() { return /* binding */ parseUrl; },
/* harmony export */   serialize: function() { return /* binding */ serialize; }
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/utils/src/base.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}
function decode(val) {
  return decodeURIComponent(val);
}
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}
function serialize(params) {
  if (isURLSearchParams(params)) {
    return params.toString();
  }
  var parts = [];
  (0,_base__WEBPACK_IMPORTED_MODULE_0__.forEach)(params, function (val, key) {
    if (typeof val === 'undefined' || val === null) {
      return;
    }
    if ((0,_base__WEBPACK_IMPORTED_MODULE_0__.isArray)(val)) {
      key = key + '[]';
    }
    if (!(0,_base__WEBPACK_IMPORTED_MODULE_0__.isArray)(val)) {
      val = [val];
    }
    (0,_base__WEBPACK_IMPORTED_MODULE_0__.forEach)(val, function parseValue(v) {
      if ((0,_base__WEBPACK_IMPORTED_MODULE_0__.type)(v) === 'Date') {
        v = v.toISOString();
      } else if ((0,_base__WEBPACK_IMPORTED_MODULE_0__.type)(v) === 'Object') {
        v = JSON.stringify(v);
      }
      parts.push(encode(key) + '=' + encode(v));
    });
  });
  return parts.join('&');
}
function buildUrl(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var serializer = arguments.length > 2 ? arguments[2] : undefined;
  if (!serializer) {
    serializer = serialize;
  }
  var serializedParams = serializer(params);
  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return url;
}

// 解析拆分 url 参数
function parseUrl(url) {
  var match = /^(.*?)(\?.*?)?(#.*?)?$/.exec(url);
  var _match = _slicedToArray(match, 4),
    fullUrl = _match[0],
    _match$ = _match[1],
    baseUrl = _match$ === void 0 ? '' : _match$,
    _match$2 = _match[2],
    search = _match$2 === void 0 ? '' : _match$2,
    _match$3 = _match[3],
    hash = _match$3 === void 0 ? '' : _match$3;
  var u1 = baseUrl.split('//'); // 分割出协议
  var protocolReg = /^\w+:$/;
  var protocol = protocolReg.test(u1[0]) ? u1[0] : '';
  var u2 = u1[1] || u1[0]; // 可能没有协议
  var i = u2.indexOf('/');
  var host = i > -1 ? u2.substring(0, i) : u2; // 分割出主机名和端口号
  var path = i > -1 ? u2.substring(i) : ''; // 分割出路径
  var u3 = host.split(':');
  var hostname = u3[0];
  var port = u3[1] || '';
  return {
    fullUrl: fullUrl,
    baseUrl: baseUrl,
    protocol: protocol,
    hostname: hostname,
    port: port,
    host: host,
    path: path,
    search: search,
    hash: hash
  };
}
var specialValues = {
  null: null,
  true: true,
  false: false
};
function parseQuery(query) {
  if (query.substr(0, 1) !== '?') {
    throw new Error("A valid query string passed to parseQuery should begin with '?'");
  }
  query = query.substr(1);
  if (!query) {
    return {};
  }
  if (query.substr(0, 1) === '{' && query.substr(-1) === '}') {
    return JSON.parse(query);
  }
  var queryArgs = query.split(/[,&]/g);
  var result = Object.create(null);
  queryArgs.forEach(function (arg) {
    var idx = arg.indexOf('=');
    if (idx >= 0) {
      var name = arg.substr(0, idx);
      var value = decode(arg.substr(idx + 1));

      // eslint-disable-next-line no-prototype-builtins
      if (specialValues.hasOwnProperty(value)) {
        value = specialValues[value];
      }
      if (name.substr(-2) === '[]') {
        name = decode(name.substr(0, name.length - 2));
        if (!Array.isArray(result[name])) {
          result[name] = [];
        }
        result[name].push(value);
      } else {
        name = decode(name);
        result[name] = value;
      }
    } else {
      if (arg.substr(0, 1) === '-') {
        result[decode(arg.substr(1))] = false;
      } else if (arg.substr(0, 1) === '+') {
        result[decode(arg.substr(1))] = true;
      } else {
        result[decode(arg)] = true;
      }
    }
  });
  return result;
}


/***/ }),

/***/ "./src/app.mpx?isApp":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mpxjs_webpack_plugin_lib_runtime_optionProcessorReact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/webpack-plugin/lib/runtime/optionProcessorReact.js");
/* harmony import */ var _react_navigation_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("@react-navigation/native");
/* harmony import */ var _react_navigation_native__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_react_navigation_native__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _react_navigation_native_stack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("@react-navigation/native-stack");
/* harmony import */ var _react_navigation_native_stack__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_react_navigation_native_stack__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ant_design_react_native__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("@ant-design/react-native");
/* harmony import */ var _ant_design_react_native__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_ant_design_react_native__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("react-native-safe-area-context");
/* harmony import */ var react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_4__);
/* template */
__webpack_require__.g.currentInject = {
  moduleId: "mpx-app-scope"
};
/* styles */
__webpack_require__.g.__getAppClassMap = function () {
  return {};
};
/* json */
/* script */






__webpack_require__.g.__navigationHelper = {
  NavigationContainer: _react_navigation_native__WEBPACK_IMPORTED_MODULE_1__.NavigationContainer,
  createNavigationContainerRef: _react_navigation_native__WEBPACK_IMPORTED_MODULE_1__.createNavigationContainerRef,
  createNativeStackNavigator: _react_navigation_native_stack__WEBPACK_IMPORTED_MODULE_2__.createNativeStackNavigator,
  StackActions: _react_navigation_native__WEBPACK_IMPORTED_MODULE_1__.StackActions,
  Provider: _ant_design_react_native__WEBPACK_IMPORTED_MODULE_3__.Provider,
  SafeAreaProvider: react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_4__.SafeAreaProvider,
  useSafeAreaInsets: react_native_safe_area_context__WEBPACK_IMPORTED_MODULE_4__.useSafeAreaInsets
};
__webpack_require__.g.getApp = function () {};
__webpack_require__.g.getCurrentPages = function () {
  return [];
};
__webpack_require__.g.__networkTimeout = undefined;
__webpack_require__.g.__mpxGenericsMap = {};
__webpack_require__.g.__mpxOptionsMap = {};
__webpack_require__.g.__mpxPagesMap = {};
__webpack_require__.g.__style = "v1";
__webpack_require__.g.__mpxPageConfig = undefined;
__webpack_require__.g.__getAppComponents = function () {
  return {};
};
__webpack_require__.g.currentInject.getPages = function () {
  return {
    'pages/event-bubble': (0,_mpxjs_webpack_plugin_lib_runtime_optionProcessorReact__WEBPACK_IMPORTED_MODULE_0__.getComponent)(__webpack_require__("./src/pages/event-bubble.mpx?isFirst&isPage"), {
      __mpxPageRoute: "pages/event-bubble",
      displayName: "Page"
    })
  };
};
__webpack_require__.g.currentInject.firstPage = "pages/event-bubble";
__webpack_require__.g.currentModuleId = "mpx-app-scope";
__webpack_require__.g.currentSrcMode = "wx";
__webpack_require__.g.currentResource = "/Users/didi/Work/Daily/RN/mpx-react-native-demo/src/app.mpx";
/** script content **/
__webpack_require__("./src/app.mpx.ts?isApp!=!./node_modules/@mpxjs/webpack-plugin/lib/selector.js?mode=ios&env=!./src/app.mpx?ctorType=app&index=0&isApp&lang=ts&mpx&type=script");
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.g.__mpxOptionsMap["mpx-app-scope"]);

/***/ }),

/***/ "./src/pages/event-bubble.mpx?isFirst&isPage":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mpxjs_webpack_plugin_lib_runtime_optionProcessorReact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/webpack-plugin/lib/runtime/optionProcessorReact.js");
/* template */
__webpack_require__.g.currentInject = {
  moduleId: "_1754195c"
};
__webpack_require__.g.currentInject.render = function (createElement, getComponent, rootProps) {
  var _this = this;
  return createElement(getComponent("mpx-view"), null, createElement(getComponent("mpx-view"), {
    style: this.__getStyle("outer", "", "", "", ""),
    "capture-bindtouchstart": function captureBindtouchstart(e) {
      return _this.__invoke(e, [["handleTap2"]]);
    },
    bindtouchstart: function bindtouchstart(e) {
      return _this.__invoke(e, [["handleTap1"]]);
    }
  }, createElement(getComponent("Text"), null, "outer view"), createElement(getComponent("mpx-view"), {
    style: this.__getStyle("inner", "", "", "", ""),
    bindtouchstart: function bindtouchstart(e) {
      return _this.__invoke(e, [["handleTap3"]]);
    },
    "capture-bindtouchstart": function captureBindtouchstart(e) {
      return _this.__invoke(e, [["handleTap4"]]);
    }
  }, createElement(getComponent("Text"), null, "inner view"))));
};
/* styles */
__webpack_require__.g.currentInject.injectMethods = {
  __getClassMap: function __getClassMap() {
    return {
      'outer': {
        'width': 300,
        'height': 300,
        'backgroundColor': "#f00",
        'position': "relative"
      },
      'inner': {
        'width': 100,
        'height': 100,
        'position': "absolute",
        'left': "0%",
        'backgroundColor': "#00f"
      }
    };
  }
};
/* json */
/* script */

__webpack_require__.g.currentInject.pageConfig = {};
__webpack_require__.g.currentInject.getComponents = function () {
  return {
    'mpx-view': (0,_mpxjs_webpack_plugin_lib_runtime_optionProcessorReact__WEBPACK_IMPORTED_MODULE_0__.getComponent)(__webpack_require__("./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/mpx-view.jsx?isComponent"), {
      __mpxBuiltIn: true
    })
  };
};
__webpack_require__.g.currentModuleId = "_1754195c";
__webpack_require__.g.currentSrcMode = "wx";
__webpack_require__.g.currentResource = "/Users/didi/Work/Daily/RN/mpx-react-native-demo/src/pages/event-bubble.mpx";
/** script content **/
__webpack_require__("./src/pages/event-bubble.mpx.js?isFirst&isPage!=!./node_modules/@mpxjs/webpack-plugin/lib/selector.js?mode=ios&env=!./src/pages/event-bubble.mpx?ctorType=page&index=0&isFirst&isPage&lang=js&mpx&type=script");
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.g.__mpxOptionsMap["_1754195c"]);

/***/ }),

/***/ "./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/event.config.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var eventConfigMap = {
  bindtap: ['onTouchStart', 'onTouchMove', 'onTouchEnd'],
  bindlongpress: ['onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'],
  bindtouchstart: ['onTouchStart'],
  bindtouchmove: ['onTouchMove'],
  bindtouchend: ['onTouchEnd'],
  bindtouchcancel: ['onTouchCancel'],
  catchtap: ['onTouchStart', 'onTouchMove', 'onTouchEnd'],
  catchlongpress: ['onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'],
  catchtouchstart: ['onTouchStart'],
  catchtouchmove: ['onTouchMove'],
  catchtouchend: ['onTouchEnd'],
  catchtouchcancel: ['onTouchCancel'],
  'capture-bindtap': ['onTouchStartCapture', 'onTouchMoveCapture', 'onTouchEndCapture'],
  'capture-bindlongpress': ['onTouchStartCapture', 'onTouchMoveCapture', 'onTouchEndCapture', 'onTouchCancelCapture'],
  'capture-bindtouchstart': ['onTouchStartCapture'],
  'capture-bindtouchmove': ['onTouchMoveCapture'],
  'capture-bindtouchend': ['onTouchEndCapture'],
  'capture-bindtouchcancel': ['onTouchCancelCapture'],
  'capture-catchtap': ['onTouchStartCapture', 'onTouchMoveCapture', 'onTouchEndCapture'],
  'capture-catchlongpress': ['onTouchStartCapture', 'onTouchMoveCapture', 'onTouchEndCapture', 'onTouchCancelCapture'],
  'capture-catchtouchstart': ['onTouchStartCapture'],
  'capture-catchtouchmove': ['onTouchMoveCapture'],
  'capture-catchtouchend': ['onTouchEndCapture'],
  'capture-catchtouchcancel': ['onTouchCancelCapture']
};
/* harmony default export */ __webpack_exports__["default"] = (eventConfigMap);

/***/ }),

/***/ "./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/getInnerListeners.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCustomEvent: function() { return /* binding */ getCustomEvent; },
/* harmony export */   getDataSet: function() { return /* binding */ getDataSet; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/utils.js");
/* harmony import */ var _event_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/event.config.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var getTouchEvent = function getTouchEvent(type, event, props, config) {
  var _layoutRef$current, _layoutRef$current2;
  var nativeEvent = event.nativeEvent;
  var timestamp = nativeEvent.timestamp,
    pageX = nativeEvent.pageX,
    pageY = nativeEvent.pageY,
    touches = nativeEvent.touches,
    changedTouches = nativeEvent.changedTouches;
  var id = props.id;
  var layoutRef = config.layoutRef;
  return _objectSpread(_objectSpread({}, event), {}, {
    type: type,
    timeStamp: timestamp,
    target: _objectSpread(_objectSpread({}, event.target || {}), {}, {
      id: id || '',
      dataset: getDataSet(props),
      offsetLeft: (layoutRef === null || layoutRef === void 0 || (_layoutRef$current = layoutRef.current) === null || _layoutRef$current === void 0 ? void 0 : _layoutRef$current.offsetLeft) || 0,
      offsetTop: (layoutRef === null || layoutRef === void 0 || (_layoutRef$current2 = layoutRef.current) === null || _layoutRef$current2 === void 0 ? void 0 : _layoutRef$current2.offsetTop) || 0
    }),
    detail: {
      x: pageX,
      y: pageY
    },
    touches: touches.map(function (item) {
      return {
        identifier: item.identifier,
        pageX: item.pageX,
        pageY: item.pageY,
        clientX: item.locationX,
        clientY: item.locationY
      };
    }),
    changedTouches: changedTouches.map(function (item) {
      return {
        identifier: item.identifier,
        pageX: item.pageX,
        pageY: item.pageY,
        clientX: item.locationX,
        clientY: item.locationY
      };
    }),
    persist: event.persist,
    stopPropagation: event.stopPropagation,
    preventDefault: event.preventDefault
  });
};
var getDataSet = function getDataSet(props) {
  var result = {};
  for (var key in props) {
    if (key.indexOf('data-') === 0) {
      var newKey = key.substr(5);
      result[newKey] = props[key];
    }
  }
  return result;
};
var getCustomEvent = function getCustomEvent() {
  var _layoutRef$current3, _layoutRef$current4;
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var oe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _ref = arguments.length > 2 ? arguments[2] : undefined,
    _ref$detail = _ref.detail,
    detail = _ref$detail === void 0 ? {} : _ref$detail,
    layoutRef = _ref.layoutRef;
  var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return _objectSpread(_objectSpread({}, oe), {}, {
    type: type,
    detail: detail,
    target: _objectSpread(_objectSpread({}, oe.target || {}), {}, {
      id: props.id || '',
      dataset: getDataSet(props),
      offsetLeft: (layoutRef === null || layoutRef === void 0 || (_layoutRef$current3 = layoutRef.current) === null || _layoutRef$current3 === void 0 ? void 0 : _layoutRef$current3.offsetLeft) || 0,
      offsetTop: (layoutRef === null || layoutRef === void 0 || (_layoutRef$current4 = layoutRef.current) === null || _layoutRef$current4 === void 0 ? void 0 : _layoutRef$current4.offsetTop) || 0
    })
  });
};
var useInnerProps = function useInnerProps() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var additionalProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var removeProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var rawConfig = arguments.length > 3 ? arguments[3] : undefined;
  var ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    startTimer: {
      bubble: null,
      capture: null
    },
    needPress: {
      bubble: false,
      capture: false
    },
    mpxPressInfo: {
      detail: {
        x: 0,
        y: 0
      }
    }
  });
  var propsRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({});
  var eventConfig = {};
  var config = rawConfig || {
    layoutRef: {
      current: {}
    },
    disableTouch: false,
    disableTap: false
  };
  propsRef.current = _objectSpread(_objectSpread({}, props), additionalProps);
  for (var key in _event_config__WEBPACK_IMPORTED_MODULE_2__["default"]) {
    if (propsRef.current[key]) {
      eventConfig[key] = _event_config__WEBPACK_IMPORTED_MODULE_2__["default"][key];
    }
  }
  if (!Object.keys(eventConfig).length || config.disableTouch) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_1__.omit)(propsRef.current, removeProps);
  }
  function handleEmitEvent(events, type, oe) {
    events.forEach(function (event) {
      if (propsRef.current[event]) {
        var match = /^(catch|capture-catch):?(.*?)(?:\.(.*))?$/.exec(event);
        if (match) {
          oe.stopPropagation();
        }
        propsRef.current[event](getTouchEvent(type, oe, propsRef.current, config));
      }
    });
  }
  function handleTouchstart(e, type) {
    e.persist();
    var bubbleTouchEvent = ['catchtouchstart', 'bindtouchstart'];
    var bubblePressEvent = ['catchlongpress', 'bindlongpress'];
    var captureTouchEvent = ['capture-catchtouchstart', 'capture-bindtouchstart'];
    var capturePressEvent = ['capture-catchlongpress', 'capture-bindlongpress'];
    ref.current.startTimer[type] = null;
    ref.current.needPress[type] = true;
    var nativeEvent = e.nativeEvent;
    ref.current.mpxPressInfo.detail = {
      x: nativeEvent.changedTouches[0].pageX,
      y: nativeEvent.changedTouches[0].pageY
    };
    var currentTouchEvent = type === 'bubble' ? bubbleTouchEvent : captureTouchEvent;
    var currentPressEvent = type === 'bubble' ? bubblePressEvent : capturePressEvent;
    handleEmitEvent(currentTouchEvent, 'touchstart', e);
    var _propsRef$current = propsRef.current,
      catchlongpress = _propsRef$current.catchlongpress,
      bindlongpress = _propsRef$current.bindlongpress,
      captureCatchlongpress = _propsRef$current['capture-catchlongpress'],
      captureBindlongpress = _propsRef$current['capture-bindlongpress'];
    if (catchlongpress || bindlongpress || captureCatchlongpress || captureBindlongpress) {
      ref.current.startTimer[type] = setTimeout(function () {
        ref.current.needPress[type] = false;
        handleEmitEvent(currentPressEvent, 'longpress', e);
      }, 350);
    }
  }
  function handleTouchmove(e, type) {
    var bubbleTouchEvent = ['catchtouchmove', 'bindtouchmove'];
    var captureTouchEvent = ['capture-catchtouchmove', 'capture-bindtouchmove'];
    var tapDetailInfo = ref.current.mpxPressInfo.detail || {
      x: 0,
      y: 0
    };
    var nativeEvent = e.nativeEvent;
    var currentPageX = nativeEvent.changedTouches[0].pageX;
    var currentPageY = nativeEvent.changedTouches[0].pageY;
    var currentTouchEvent = type === 'bubble' ? bubbleTouchEvent : captureTouchEvent;
    if (Math.abs(currentPageX - tapDetailInfo.x) > 1 || Math.abs(currentPageY - tapDetailInfo.y) > 1) {
      ref.current.needPress[type] = false;
      ref.current.startTimer[type] && clearTimeout(ref.current.startTimer[type]);
      ref.current.startTimer[type] = null;
    }
    handleEmitEvent(currentTouchEvent, 'touchmove', e);
  }
  function handleTouchend(e, type) {
    var bubbleTouchEvent = ['catchtouchend', 'bindtouchend'];
    var bubbleTapEvent = ['catchtap', 'bindtap'];
    var captureTouchEvent = ['capture-catchtouchend', 'capture-bindtouchend'];
    var captureTapEvent = ['capture-catchtap', 'capture-bindtap'];
    var currentTouchEvent = type === 'bubble' ? bubbleTouchEvent : captureTouchEvent;
    var currentTapEvent = type === 'bubble' ? bubbleTapEvent : captureTapEvent;
    ref.current.startTimer[type] && clearTimeout(ref.current.startTimer[type]);
    ref.current.startTimer[type] = null;
    handleEmitEvent(currentTouchEvent, 'touchend', e);
    if (ref.current.needPress[type]) {
      if (type === 'bubble' && config.disableTap) {
        return;
      }
      handleEmitEvent(currentTapEvent, 'tap', e);
    }
  }
  function handleTouchcancel(e, type) {
    var bubbleTouchEvent = ['catchtouchcancel', 'bindtouchcancel'];
    var captureTouchEvent = ['capture-catchtouchcancel', 'capture-bindtouchcancel'];
    var currentTouchEvent = type === 'bubble' ? bubbleTouchEvent : captureTouchEvent;
    ref.current.startTimer[type] && clearTimeout(ref.current.startTimer[type]);
    ref.current.startTimer[type] = null;
    handleEmitEvent(currentTouchEvent, 'touchcancel', e);
  }
  var touchEventList = [{
    eventName: 'onTouchStart',
    handler: function handler(e) {
      handleTouchstart(e, 'bubble');
    }
  }, {
    eventName: 'onTouchMove',
    handler: function handler(e) {
      handleTouchmove(e, 'bubble');
    }
  }, {
    eventName: 'onTouchEnd',
    handler: function handler(e) {
      handleTouchend(e, 'bubble');
    }
  }, {
    eventName: 'onTouchCancel',
    handler: function handler(e) {
      handleTouchcancel(e, 'bubble');
    }
  }, {
    eventName: 'onTouchStartCapture',
    handler: function handler(e) {
      handleTouchstart(e, 'capture');
    }
  }, {
    eventName: 'onTouchMoveCapture',
    handler: function handler(e) {
      handleTouchmove(e, 'capture');
    }
  }, {
    eventName: 'onTouchEndCapture',
    handler: function handler(e) {
      handleTouchend(e, 'capture');
    }
  }, {
    eventName: 'onTouchCancelCapture',
    handler: function handler(e) {
      handleTouchcancel(e, 'capture');
    }
  }];
  var events = {};
  var transformedEventKeys = [];
  for (var _key in eventConfig) {
    transformedEventKeys.push.apply(transformedEventKeys, _toConsumableArray(eventConfig[_key]));
  }
  var finalEventKeys = _toConsumableArray(new Set(transformedEventKeys));
  touchEventList.forEach(function (item) {
    if (finalEventKeys.includes(item.eventName)) {
      events[item.eventName] = item.handler;
    }
  });
  var rawEventKeys = Object.keys(eventConfig);
  return _objectSpread(_objectSpread({}, events), (0,_utils__WEBPACK_IMPORTED_MODULE_1__.omit)(propsRef.current, [].concat(rawEventKeys, _toConsumableArray(removeProps))));
};
/* harmony default export */ __webpack_exports__["default"] = (useInnerProps);

/***/ }),

/***/ "./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/mpx-view.jsx?isComponent":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react-native");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_native__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _getInnerListeners__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/getInnerListeners.js");
/* harmony import */ var _useNodesRef__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/useNodesRef.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * ✔ hover-class
 * ✘ hover-stop-propagation
 * ✔ hover-start-time
 * ✔ hover-stay-time
 */


// @ts-ignore

// @ts-ignore
 // 引入辅助函数


var IMAGE_STYLE_REGEX = /^background(Image|Size|Repeat|Position)$/;
function groupBy(style, callback) {
  var group = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var groupKey = '';
  for (var key in style) {
    if (style.hasOwnProperty(key)) {
      // 确保处理对象自身的属性
      var val = style[key];
      groupKey = callback(key, val);
      if (!group[groupKey]) {
        group[groupKey] = {};
      }
      group[groupKey][key] = val;
    }
  }
  return group;
}
var applyHandlers = function applyHandlers(handlers, args) {
  var _iterator = _createForOfIteratorHelper(handlers),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var handler = _step.value;
      handler.apply(void 0, _toConsumableArray(args));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
var checkNeedLayout = function checkNeedLayout(style) {
  var _style$sizeList = _slicedToArray(style.sizeList, 2),
    width = _style$sizeList[0],
    height = _style$sizeList[1];
  return _utils__WEBPACK_IMPORTED_MODULE_4__.PERCENT_REGX.test("".concat(height)) && width === 'auto' || _utils__WEBPACK_IMPORTED_MODULE_4__.PERCENT_REGX.test("".concat(width)) && height === 'auto';
};
/**
 * h - 用户设置的高度
 * lh - 容器的高度
 * ratio - 原始图片的宽高比
 * **/
function calculateSize(h, lh, ratio) {
  var height, width;
  if (_utils__WEBPACK_IMPORTED_MODULE_4__.PERCENT_REGX.test("".concat(h))) {
    // auto  px/rpx 
    if (!lh) return null;
    height = parseFloat("".concat(h)) / 100 * lh;
    width = height * ratio;
  } else {
    // 2. auto px/rpx - 根据比例计算
    height = h;
    width = height * ratio;
  }
  return {
    width: width,
    height: height
  };
}
// background-size 转换
function backgroundSize(imageProps, preImageInfo, imageSize, layoutInfo) {
  var sizeList = preImageInfo.sizeList;
  if (!sizeList) return;
  // 枚举值
  if (['cover', 'contain'].includes("".concat(sizeList[0]))) {
    imageProps.style.resizeMode = sizeList[0];
  } else {
    var _sizeList = _slicedToArray(sizeList, 2),
      width = _sizeList[0],
      height = _sizeList[1];
    var newWidth = 0,
      newHeight = 0;
    var _ref = imageSize || {},
      imageSizeWidth = _ref.width,
      imageSizeHeight = _ref.height;
    if (width === 'auto' && height === 'auto') {
      // 均为auto
      if (!imageSize) return;
      newHeight = imageSizeHeight;
      newWidth = imageSizeWidth;
    } else if (width === 'auto') {
      // auto px/rpx/%
      if (!imageSize) return;
      var dimensions = calculateSize(height, layoutInfo === null || layoutInfo === void 0 ? void 0 : layoutInfo.height, imageSizeWidth / imageSizeHeight);
      if (!dimensions) return;
      newWidth = dimensions.width;
      newHeight = dimensions.height;
    } else if (height === 'auto') {
      // auto px/rpx/%
      if (!imageSize) return;
      var _dimensions = calculateSize(width, layoutInfo === null || layoutInfo === void 0 ? void 0 : layoutInfo.width, imageSizeHeight / imageSizeWidth);
      if (!_dimensions) return;
      newHeight = _dimensions.width;
      newWidth = _dimensions.height;
    } else {
      // 数值类型      ImageStyle
      // 数值类型设置为 stretch
      imageProps.style.resizeMode = 'stretch';
      newWidth = _utils__WEBPACK_IMPORTED_MODULE_4__.PERCENT_REGX.test("".concat(width)) ? width : +width;
      newHeight = _utils__WEBPACK_IMPORTED_MODULE_4__.PERCENT_REGX.test("".concat(width)) ? height : +height;
    }
    // 样式合并
    imageProps.style = _objectSpread(_objectSpread({}, imageProps.style), {}, {
      width: newWidth,
      height: newHeight
    });
  }
}
// background-image转换为source
function backgroundImage(imageProps, preImageInfo) {
  imageProps.src = preImageInfo.src;
}
var imageStyleToProps = function imageStyleToProps(preImageInfo, imageSize, layoutInfo) {
  // 初始化
  var imageProps = {
    style: _objectSpread({
      resizeMode: 'cover'
    }, react_native__WEBPACK_IMPORTED_MODULE_0__.StyleSheet.absoluteFillObject)
  };
  applyHandlers([backgroundSize, backgroundImage], [imageProps, preImageInfo, imageSize, layoutInfo]);
  if (!(imageProps !== null && imageProps !== void 0 && imageProps.src)) return null;
  return imageProps;
};
function preParseImage(imageStyle) {
  var _ref2 = imageStyle || {},
    backgroundImage = _ref2.backgroundImage,
    _ref2$backgroundSize = _ref2.backgroundSize,
    backgroundSize = _ref2$backgroundSize === void 0 ? ["auto"] : _ref2$backgroundSize;
  var src = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.parseUrl)(backgroundImage);
  var sizeList = backgroundSize.slice();
  sizeList.length === 1 && sizeList.push(sizeList[0]);
  return {
    src: src,
    sizeList: sizeList
  };
}
function wrapImage(imageStyle) {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    show = _useState2[0],
    setShow = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    setImageSizeWidth = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    setImageSizeHeight = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    setLayoutInfoWidth = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),
    _useState10 = _slicedToArray(_useState9, 2),
    setLayoutInfoHeight = _useState10[1];
  var sizeInfo = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  var layoutInfo = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  // 预解析
  var preImageInfo = preParseImage(imageStyle);
  // 判断是否可挂载onLayout
  var needLayout = checkNeedLayout(preImageInfo);
  var src = preImageInfo.src,
    sizeList = preImageInfo.sizeList;
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    if (!src) {
      setShow(false);
      sizeInfo.current = null;
      layoutInfo.current = null;
      return;
    }
    if (!sizeList.includes('auto')) {
      setShow(true);
      return;
    }
    react_native__WEBPACK_IMPORTED_MODULE_0__.Image.getSize(src, function (width, height) {
      sizeInfo.current = {
        width: width,
        height: height
      };
      //1. 当需要绑定onLayout 2. 获取到布局信息
      if (!needLayout || layoutInfo.current) {
        setImageSizeWidth(width);
        setImageSizeHeight(height);
        if (layoutInfo.current) {
          setLayoutInfoWidth(layoutInfo.current.width);
          setLayoutInfoHeight(layoutInfo.current.height);
        }
        setShow(true);
      }
    });
  }, [preImageInfo === null || preImageInfo === void 0 ? void 0 : preImageInfo.src]);
  if (!(preImageInfo !== null && preImageInfo !== void 0 && preImageInfo.src)) return null;
  var onLayout = function onLayout(res) {
    var _res$nativeEvent;
    var _ref3 = (res === null || res === void 0 || (_res$nativeEvent = res.nativeEvent) === null || _res$nativeEvent === void 0 ? void 0 : _res$nativeEvent.layout) || {},
      width = _ref3.width,
      height = _ref3.height;
    layoutInfo.current = {
      width: width,
      height: height
    };
    if (sizeInfo.current) {
      setImageSizeWidth(sizeInfo.current.width);
      setImageSizeHeight(sizeInfo.current.height);
      setLayoutInfoWidth(width);
      setLayoutInfoHeight(height);
      setShow(true);
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_native__WEBPACK_IMPORTED_MODULE_0__.View, _objectSpread(_objectSpread({}, needLayout ? {
    onLayout: onLayout
  } : null), {}, {
    style: _objectSpread(_objectSpread({}, react_native__WEBPACK_IMPORTED_MODULE_0__.StyleSheet.absoluteFillObject), {}, {
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }),
    children: show && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_native__WEBPACK_IMPORTED_MODULE_0__.Image, _objectSpread({}, imageStyleToProps(preImageInfo, sizeInfo.current, layoutInfo.current)))
  }), 'viewBgImg');
}
function splitStyle(styles) {
  return groupBy(styles, function (key) {
    if (_utils__WEBPACK_IMPORTED_MODULE_4__.TEXT_STYLE_REGEX.test(key)) return 'textStyle';else if (IMAGE_STYLE_REGEX.test(key)) return 'imageStyle';
    return 'innerStyle';
  }, {});
}
function every(children, callback) {
  return children.every(function (child) {
    return callback(child);
  });
}
function wrapChildren(children, textStyle, imageStyle) {
  children = Array.isArray(children) ? children : [children];
  if (every(children, function (child) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_4__.isText)(child);
  })) {
    children = [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_native__WEBPACK_IMPORTED_MODULE_0__.Text, {
      style: textStyle,
      children: children
    }, 'viewTextWrap')];
  } else {
    if (textStyle) console.warn('Text style will be ignored unless every child of the view is Text node!');
  }
  return [wrapImage(imageStyle)].concat(_toConsumableArray(children));
}
var _View = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function (props, ref) {
  var _props$style = props.style,
    style = _props$style === void 0 ? [] : _props$style,
    children = props.children,
    hoverStyle = props.hoverStyle,
    _props$hoverStartTi = props['hover-start-time'],
    hoverStartTime = _props$hoverStartTi === void 0 ? 50 : _props$hoverStartTi,
    _props$hoverStayTim = props['hover-stay-time'],
    hoverStayTime = _props$hoverStayTim === void 0 ? 400 : _props$hoverStayTim,
    enableOffset = props['enable-offset'];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    isHover = _useState12[0],
    setIsHover = _useState12[1];
  var layoutRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)({});
  // 打平 style 数组
  var styleObj = react_native__WEBPACK_IMPORTED_MODULE_0__.StyleSheet.flatten(style);
  // 默认样式
  var defaultStyle = _objectSpread({}, styleObj.display === 'flex' && {
    flexDirection: 'row',
    flexBasis: 'auto',
    flexShrink: 1,
    flexWrap: 'nowrap'
  });
  var _useNodesRef = (0,_useNodesRef__WEBPACK_IMPORTED_MODULE_3__["default"])(props, ref, {
      defaultStyle: defaultStyle
    }),
    nodeRef = _useNodesRef.nodeRef;
  var dataRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)({});
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    return function () {
      dataRef.current.startTimer && clearTimeout(dataRef.current.startTimer);
      dataRef.current.stayTimer && clearTimeout(dataRef.current.stayTimer);
    };
  }, []);
  var setStartTimer = function setStartTimer() {
    dataRef.current.startTimer && clearTimeout(dataRef.current.startTimer);
    dataRef.current.startTimer = setTimeout(function () {
      setIsHover(function () {
        return true;
      });
    }, +hoverStartTime);
  };
  var setStayTimer = function setStayTimer() {
    dataRef.current.stayTimer && clearTimeout(dataRef.current.stayTimer);
    dataRef.current.startTimer && clearTimeout(dataRef.current.startTimer);
    dataRef.current.stayTimer = setTimeout(function () {
      setIsHover(function () {
        return false;
      });
    }, +hoverStayTime);
  };
  function onTouchStart(e) {
    var bindtouchstart = props.bindtouchstart;
    bindtouchstart && bindtouchstart(e);
    setStartTimer();
  }
  function onTouchEnd(e) {
    var bindtouchend = props.bindtouchend;
    bindtouchend && bindtouchend(e);
    setStayTimer();
  }
  var onLayout = function onLayout() {
    var _nodeRef$current;
    (_nodeRef$current = nodeRef.current) === null || _nodeRef$current === void 0 || _nodeRef$current.measure(function (x, y, width, height, offsetLeft, offsetTop) {
      layoutRef.current = {
        x: x,
        y: y,
        width: width,
        height: height,
        offsetLeft: offsetLeft,
        offsetTop: offsetTop
      };
    });
  };
  var _splitStyle = splitStyle(react_native__WEBPACK_IMPORTED_MODULE_0__.StyleSheet.flatten([defaultStyle, styleObj].concat(_toConsumableArray(isHover ? hoverStyle : [])))),
    textStyle = _splitStyle.textStyle,
    imageStyle = _splitStyle.imageStyle,
    innerStyle = _splitStyle.innerStyle;
  var innerProps = (0,_getInnerListeners__WEBPACK_IMPORTED_MODULE_2__["default"])(props, _objectSpread(_objectSpread({
    ref: nodeRef
  }, enableOffset ? {
    onLayout: onLayout
  } : {}), hoverStyle && {
    bindtouchstart: onTouchStart,
    bindtouchend: onTouchEnd
  }), ['style', 'children', 'hover-start-time', 'hover-stay-time', 'hoverStyle', 'hover-class', 'enable-offset'], {
    layoutRef: layoutRef
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_native__WEBPACK_IMPORTED_MODULE_0__.View, _objectSpread(_objectSpread({}, innerProps), {}, {
    style: innerStyle,
    children: wrapChildren(children, textStyle, imageStyle)
  }));
});
_View.displayName = 'mpx-view';
/* harmony default export */ __webpack_exports__["default"] = (_View);

/***/ }),

/***/ "./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/useNodesRef.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ useNodesRef; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function useNodesRef(props, ref) {
  var instance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var nodeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var _props = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(props);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    _props.current = props;
    return function () {
      _props.current = null; // 组件销毁，清空 _props 依赖数据
    };
  }, [props]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useImperativeHandle)(ref, function () {
    return {
      getNodeInstance: function getNodeInstance() {
        return {
          props: _props,
          nodeRef: nodeRef,
          instance: instance
        };
      }
    };
  });
  return {
    nodeRef: nodeRef
  };
}

/***/ }),

/***/ "./node_modules/@mpxjs/webpack-plugin/lib/runtime/components/react/dist/utils.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PERCENT_REGX: function() { return /* binding */ PERCENT_REGX; },
/* harmony export */   TEXT_STYLE_REGEX: function() { return /* binding */ TEXT_STYLE_REGEX; },
/* harmony export */   every: function() { return /* binding */ every; },
/* harmony export */   extractTextStyle: function() { return /* binding */ extractTextStyle; },
/* harmony export */   getRestProps: function() { return /* binding */ getRestProps; },
/* harmony export */   isEmbedded: function() { return /* binding */ isEmbedded; },
/* harmony export */   isText: function() { return /* binding */ isText; },
/* harmony export */   omit: function() { return /* binding */ omit; },
/* harmony export */   parseInlineStyle: function() { return /* binding */ parseInlineStyle; },
/* harmony export */   parseUrl: function() { return /* binding */ parseUrl; },
/* harmony export */   useUpdateEffect: function() { return /* binding */ useUpdateEffect; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react-native");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_native__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


var TEXT_STYLE_REGEX = /color|font.*|text.*|letterSpacing|lineHeight|includeFontPadding|writingDirection/;
var PERCENT_REGX = /\d+(\.\d+)?%$/;
var URL_REGEX = /url\(["']?(.*?)["']?\)/;
function omit(obj, fields) {
  var shallowCopy = Object.assign({}, obj);
  for (var i = 0; i < fields.length; i += 1) {
    var key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}
/**
 * 从 style 中提取 TextStyle
 * @param style
 * @returns
 */
var extractTextStyle = function extractTextStyle(style) {
  return Object.entries(react_native__WEBPACK_IMPORTED_MODULE_1__.StyleSheet.flatten(style)).reduce(function (textStyle, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    TEXT_STYLE_REGEX.test(key) && Object.assign(textStyle, {
      [key]: value
    });
    return textStyle;
  }, {});
};
/**
 * 用法等同于 useEffect，但是会忽略首次执行，只在依赖更新时执行
 */
var useUpdateEffect = function useUpdateEffect(effect, deps) {
  var isMounted = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  // for react-refresh
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    return function () {
      isMounted.current = false;
    };
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};
/**
 * 解析行内样式
 * @param inlineStyle
 * @returns
 */
var parseInlineStyle = function parseInlineStyle() {
  var inlineStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return inlineStyle.split(';').reduce(function (styleObj, style) {
    var _style$split = style.split(':'),
      _style$split2 = _toArray(_style$split),
      k = _style$split2[0],
      v = _style$split2[1],
      rest = _style$split2.slice(2);
    if (rest.length || !v || !k) return styleObj;
    var key = k.trim().replace(/-./g, function (c) {
      return c.substring(1).toUpperCase();
    });
    return Object.assign(styleObj, {
      [key]: v.trim()
    });
  }, {});
};
var parseUrl = function parseUrl() {
  var cssUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (!cssUrl) return;
  var match = cssUrl.match(URL_REGEX);
  return match === null || match === void 0 ? void 0 : match[1];
};
var getRestProps = function getRestProps() {
  var transferProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var originProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var deletePropsKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return _objectSpread(_objectSpread({}, transferProps), omit(originProps, deletePropsKey));
};
var isText = function isText(ele) {
  if ( /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(ele)) {
    var _ele$type;
    var displayName = (_ele$type = ele.type) === null || _ele$type === void 0 ? void 0 : _ele$type.displayName;
    return displayName === 'mpx-text' || displayName === 'Text';
  }
  return false;
};
var isEmbedded = function isEmbedded(ele) {
  if ( /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(ele)) {
    var _ele$type2;
    var displayName = (_ele$type2 = ele.type) === null || _ele$type2 === void 0 ? void 0 : _ele$type2.displayName;
    return displayName && ['mpx-checkbox', 'mpx-radio', 'mpx-switch'].includes(displayName);
  }
  return false;
};
function every(children, callback) {
  return react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children).every(function (child) {
    return callback(child);
  });
}

/***/ }),

/***/ "./node_modules/@mpxjs/webpack-plugin/lib/runtime/optionProcessorReact.js":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createApp: function() { return /* binding */ createApp; },
/* harmony export */   getComponent: function() { return /* binding */ getComponent; }
/* harmony export */ });
function getComponent(component, extendOptions) {
  component = component.__esModule ? component.default : component;
  // eslint-disable-next-line
  if (extendOptions) Object.assign(component, extendOptions);
  return component;
}
function createApp(_ref) {
  var App = _ref.App,
    pagesMap = _ref.pagesMap,
    firstPage = _ref.firstPage,
    createElement = _ref.createElement,
    NavigationContainer = _ref.NavigationContainer,
    createNativeStackNavigator = _ref.createNativeStackNavigator;
  var Stack = createNativeStackNavigator();
  var pages = [];
  return function () {
    return createElement(NavigationContainer, null, createElement.apply(void 0, [Stack.Navigator, null].concat(pages)));
  };
}

/***/ }),

/***/ "./src/pages/event-bubble.mpx.js?isFirst&isPage!=!./node_modules/@mpxjs/webpack-plugin/lib/selector.js?mode=ios&env=!./src/pages/event-bubble.mpx?ctorType=page&index=0&isFirst&isPage&lang=js&mpx&type=script":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mpxjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/createPage.js");

(0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_0__["default"])({
  data: {
    message: '12233'
  },
  created: function created() {
    // this.preview()
  },
  methods: {
    handleTap1: function handleTap1(e) {
      e.persist();
      console.log('handleTap1', e);
    },
    handleTap2: function handleTap2() {
      console.log('handleTap2==');
    },
    handleTap3: function handleTap3(e) {
      console.log('handleTap3');
    },
    handleTap4: function handleTap4(e) {
      console.log('handleTap4');
    },
    bubbleTap: function bubbleTap() {
      console.log('bubbleTap==');
    }
  }
});

/***/ }),

/***/ "./src/app.mpx.ts?isApp!=!./node_modules/@mpxjs/webpack-plugin/lib/selector.js?mode=ios&env=!./src/app.mpx?ctorType=app&index=0&isApp&lang=ts&mpx&type=script":
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mpxjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@mpxjs/core/src/index.js");
/* harmony import */ var _mpxjs_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@mpxjs/core/src/platform/createApp.ios.js?infix=.ios&mode=ios");
/* harmony import */ var _mpxjs_api_proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@mpxjs/api-proxy/src/index.js");


_mpxjs_core__WEBPACK_IMPORTED_MODULE_0__["default"].use(_mpxjs_api_proxy__WEBPACK_IMPORTED_MODULE_1__["default"], {
  usePromise: true
});
(0,_mpxjs_core__WEBPACK_IMPORTED_MODULE_2__["default"])({});

/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var root = __webpack_require__("./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_arrayPush.js":
/***/ (function(module) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ "./node_modules/lodash/_baseFlatten.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var arrayPush = __webpack_require__("./node_modules/lodash/_arrayPush.js"),
    isFlattenable = __webpack_require__("./node_modules/lodash/_isFlattenable.js");

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__("./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__("./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__("./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_baseIsArguments.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseGetTag = __webpack_require__("./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__("./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__("./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_isFlattenable.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__("./node_modules/lodash/_Symbol.js"),
    isArguments = __webpack_require__("./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__("./node_modules/lodash/isArray.js");

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/***/ (function(module) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var freeGlobal = __webpack_require__("./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/flatten.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseFlatten = __webpack_require__("./node_modules/lodash/_baseFlatten.js");

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),

/***/ "./node_modules/lodash/isArguments.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseIsArguments = __webpack_require__("./node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__("./node_modules/lodash/isObjectLike.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ "./node_modules/lodash/isArray.js":
/***/ (function(module) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/***/ (function(module) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "@ant-design/react-native":
/***/ (function(module) {

"use strict";
module.exports = require("@ant-design/react-native");

/***/ }),

/***/ "@react-native-async-storage/async-storage":
/***/ (function(module) {

"use strict";
module.exports = require("@react-native-async-storage/async-storage");

/***/ }),

/***/ "@react-native-clipboard/clipboard":
/***/ (function(module) {

"use strict";
module.exports = require("@react-native-clipboard/clipboard");

/***/ }),

/***/ "@react-native-community/netinfo":
/***/ (function(module) {

"use strict";
module.exports = require("@react-native-community/netinfo");

/***/ }),

/***/ "@react-navigation/native":
/***/ (function(module) {

"use strict";
module.exports = require("@react-navigation/native");

/***/ }),

/***/ "@react-navigation/native-stack":
/***/ (function(module) {

"use strict";
module.exports = require("@react-navigation/native-stack");

/***/ }),

/***/ "react":
/***/ (function(module) {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-native":
/***/ (function(module) {

"use strict";
module.exports = require("react-native");

/***/ }),

/***/ "react-native-device-info":
/***/ (function(module) {

"use strict";
module.exports = require("react-native-device-info");

/***/ }),

/***/ "react-native-safe-area-context":
/***/ (function(module) {

"use strict";
module.exports = require("react-native-safe-area-context");

/***/ }),

/***/ "react/jsx-runtime":
/***/ (function(module) {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/adapters.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _http_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/helpers/null.js");
/* harmony import */ var _xhr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/adapters/xhr.js");
/* harmony import */ var _fetch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/adapters/fetch.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/axios/lib/core/AxiosError.js");






const knownAdapters = {
  http: _http_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  xhr: _xhr_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  fetch: _fetch_js__WEBPACK_IMPORTED_MODULE_2__["default"]
}

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(adapter) || adapter === null || adapter === false;

/* harmony default export */ __webpack_exports__["default"] = ({
  getAdapter: (adapters) => {
    adapters = _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
});


/***/ }),

/***/ "./node_modules/axios/lib/adapters/fetch.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/axios/lib/helpers/composeSignals.js");
/* harmony import */ var _helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/axios/lib/helpers/trackStream.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/axios/lib/helpers/progressEventReducer.js");
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/axios/lib/helpers/resolveConfig.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/axios/lib/core/settle.js");










const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
}

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"](`Response type '${type}' is not supported`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NOT_SUPPORT, config);
      })
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isBlob(body)) {
    return body.size;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isSpecCompliantForm(body)) {
    return (await new Request(body).arrayBuffer()).byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArrayBufferView(body) || _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isURLSearchParams(body)) {
    body = body + '';
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(body)) {
    return (await encodeText(body)).byteLength;
  }
}

const resolveBodyLength = async (headers, body) => {
  const length = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
}

/* harmony default export */ __webpack_exports__["default"] = (isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let [composedSignal, stopTimeout] = (signal || cancelToken || timeout) ?
    (0,_helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__["default"])([signal, cancelToken], timeout) : [];

  let finished, request;

  const onFinish = () => {
    !finished && setTimeout(() => {
      composedSignal && composedSignal.unsubscribe();
    });

    finished = true;
  }

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader)
      }

      if (_request.body) {
        const [onProgress, flush] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventDecorator)(
          requestContentLength,
          (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventReducer)((0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.asyncDecorator)(onUploadProgress))
        );

        data = (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__.trackStream)(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush, encodeText);
      }
    }

    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype; 
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || isStreamResponse)) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventDecorator)(
        responseContentLength,
        (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventReducer)((0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.asyncDecorator)(onDownloadProgress), true)
      ) || [];

      response = new Response(
        (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__.trackStream)(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          isStreamResponse && onFinish();
        }, encodeText),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && onFinish();

    stopTimeout && stopTimeout();

    return await new Promise((resolve, reject) => {
      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_7__["default"])(resolve, reject, {
        data: responseData,
        headers: _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__["default"].from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      })
    })
  } catch (err) {
    onFinish();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].from(err, err && err.code, config, request);
  }
}));




/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/core/settle.js");
/* harmony import */ var _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/axios/lib/helpers/parseProtocol.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/axios/lib/helpers/progressEventReducer.js");
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/helpers/resolveConfig.js");











const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ __webpack_exports__["default"] = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])(config);
    let requestData = _config.data;
    const requestHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Request aborted', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__["default"];
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"](
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ETIMEDOUT : _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      _utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__.progressEventReducer)(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__.progressEventReducer)(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__["default"](null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = (0,_helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__["default"])(_config.url);

    if (protocol && _platform_index_js__WEBPACK_IMPORTED_MODULE_9__["default"].protocols.indexOf(protocol) === -1) {
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Unsupported protocol ' + protocol + ':', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/helpers/bind.js");
/* harmony import */ var _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/core/Axios.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./node_modules/axios/lib/helpers/formDataToJSON.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/axios/lib/cancel/CancelToken.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/axios/lib/env/data.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./node_modules/axios/lib/helpers/spread.js");
/* harmony import */ var _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./node_modules/axios/lib/helpers/isAxiosError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./node_modules/axios/lib/adapters/adapters.js");
/* harmony import */ var _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./node_modules/axios/lib/helpers/HttpStatusCode.js");




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"](defaultConfig);
  const instance = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.request, context);

  // Copy axios.prototype to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype, context, {allOwnKeys: true});

  // Copy context to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance((0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(_defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"]);

// Expose Axios class to allow class inheritance
axios.Axios = _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"];

// Expose Cancel & CancelToken
axios.CanceledError = _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__["default"];
axios.CancelToken = _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__["default"];
axios.isCancel = _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__["default"];
axios.VERSION = _env_data_js__WEBPACK_IMPORTED_MODULE_8__.VERSION;
axios.toFormData = _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__["default"];

// Expose AxiosError class
axios.AxiosError = _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__["default"];

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__["default"];

// Expose isAxiosError
axios.isAxiosError = _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__["default"];

// Expose mergeConfig
axios.mergeConfig = _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"];

axios.AxiosHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__["default"];

axios.formToJSON = thing => (0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__["default"].getAdapter;

axios.HttpStatusCode = _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__["default"];

axios.default = axios;

// this module should only have a default export
/* harmony default export */ __webpack_exports__["default"] = (axios);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/cancel/CanceledError.js");




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ __webpack_exports__["default"] = (CancelToken);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CanceledError.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/utils.js");





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].call(this, message == null ? 'canceled' : message, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].inherits(CanceledError, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
  __CANCEL__: true
});

/* harmony default export */ __webpack_exports__["default"] = (CanceledError);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isCancel; }
/* harmony export */ });


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/axios/lib/helpers/buildURL.js");
/* harmony import */ var _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/core/InterceptorManager.js");
/* harmony import */ var _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/axios/lib/core/dispatchRequest.js");
/* harmony import */ var _mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/helpers/validator.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/axios/lib/core/AxiosHeaders.js");











const validators = _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"](),
      response: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy;

        Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].merge(
      headers.common,
      headers[config.method]
    );

    headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__["default"].concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [_dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);
    const fullPath = (0,_buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__["default"])(config.baseURL, config.url);
    return (0,_helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__["default"])(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ __webpack_exports__["default"] = (Axios);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosError.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/utils.js");




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ __webpack_exports__["default"] = (AxiosError);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosHeaders.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/helpers/parseHeaders.js");





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(value)) return;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders((0,_helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"])(header), valueOrRewrite);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].freezeMethods(AxiosHeaders);

/* harmony default export */ __webpack_exports__["default"] = (AxiosHeaders);


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/utils.js");




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["default"] = (InterceptorManager);


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ buildFullPath; }
/* harmony export */ });
/* harmony import */ var _helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/helpers/isAbsoluteURL.js");
/* harmony import */ var _helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/helpers/combineURLs.js");





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !(0,_helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__["default"])(requestedURL)) {
    return (0,_helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__["default"])(baseURL, requestedURL);
  }
  return requestedURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ dispatchRequest; }
/* harmony export */ });
/* harmony import */ var _transformData_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/core/transformData.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/axios/lib/adapters/adapters.js");









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(config.headers);

  // Transform request data
  config.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAdapter(config.adapter || _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"].adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
      config,
      config.transformResponse,
      response
    );

    response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!(0,_cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__["default"])(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ mergeConfig; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/core/AxiosHeaders.js");





const headersToObject = (thing) => thing instanceof _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(target) && _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge.call({caseless}, target, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge({}, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ settle; }
/* harmony export */ });
/* harmony import */ var _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/core/AxiosError.js");




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](
      'Request failed with status code ' + response.status,
      [_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_REQUEST, _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ transformData; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/core/AxiosHeaders.js");






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  const context = response || config;
  const headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(context.headers);
  let data = context.data;

  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _transitional_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/axios/lib/helpers/toURLEncodedForm.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/helpers/formDataToJSON.js");










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: _transitional_js__WEBPACK_IMPORTED_MODULE_1__["default"],

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(data);

    if (isObjectPayload && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify((0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__["default"])(data)) : data;
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStream(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFile(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)
    ) {
      return data;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBufferView(data)) {
      return data.buffer;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return (0,_helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__["default"])(data, this.formSerializer).toString();
      }

      if ((isFileList = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return (0,_helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isResponse(data) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)) {
      return data;
    }

    if (data && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].from(e, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.FormData,
    Blob: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ __webpack_exports__["default"] = (defaults);


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


/* harmony default export */ __webpack_exports__["default"] = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: function() { return /* binding */ VERSION; }
/* harmony export */ });
const VERSION = "1.7.5";

/***/ }),

/***/ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/helpers/toFormData.js");




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ __webpack_exports__["default"] = (AxiosURLSearchParams);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/HttpStatusCode.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ __webpack_exports__["default"] = (HttpStatusCode);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ bind; }
/* harmony export */ });


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ buildURL; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(params) ?
      params.toString() :
      new _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__["default"](params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ combineURLs; }
/* harmony export */ });


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/composeSignals.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/core/AxiosError.js");



const composeSignals = (signals, timeout) => {
  let controller = new AbortController();

  let aborted;

  const onabort = function (cancel) {
    if (!aborted) {
      aborted = true;
      unsubscribe();
      const err = cancel instanceof Error ? cancel : this.reason;
      controller.abort(err instanceof _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? err : new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__["default"](err instanceof Error ? err.message : err));
    }
  }

  let timer = timeout && setTimeout(() => {
    onabort(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](`timeout ${timeout} of ms exceeded`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ETIMEDOUT))
  }, timeout)

  const unsubscribe = () => {
    if (signals) {
      timer && clearTimeout(timer);
      timer = null;
      signals.forEach(signal => {
        signal &&
        (signal.removeEventListener ? signal.removeEventListener('abort', onabort) : signal.unsubscribe(onabort));
      });
      signals = null;
    }
  }

  signals.forEach((signal) => signal && signal.addEventListener && signal.addEventListener('abort', onabort));

  const {signal} = controller;

  signal.unsubscribe = unsubscribe;

  return [signal, () => {
    timer && clearTimeout(timer);
    timer = null;
  }];
}

/* harmony default export */ __webpack_exports__["default"] = (composeSignals);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/platform/index.js");



/* harmony default export */ __webpack_exports__["default"] = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(path) && cookie.push('path=' + path);

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  });



/***/ }),

/***/ "./node_modules/axios/lib/helpers/formDataToJSON.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/utils.js");




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target) ? target.length : name;

    if (isLast) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(formData) && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(formData.entries)) {
    const obj = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ __webpack_exports__["default"] = (formDataToJSON);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isAbsoluteURL; }
/* harmony export */ });


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isAxiosError; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/utils.js");




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(payload) && (payload.isAxiosError === true);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/platform/index.js");





/* harmony default export */ __webpack_exports__["default"] = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = _platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].navigator && /(msie|trident)/i.test(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover its components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })());


/***/ }),

/***/ "./node_modules/axios/lib/helpers/null.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// eslint-disable-next-line strict
/* harmony default export */ __webpack_exports__["default"] = (null);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/utils.js");




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ __webpack_exports__["default"] = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseProtocol.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ parseProtocol; }
/* harmony export */ });


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/progressEventReducer.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asyncDecorator: function() { return /* binding */ asyncDecorator; },
/* harmony export */   progressEventDecorator: function() { return /* binding */ progressEventDecorator; },
/* harmony export */   progressEventReducer: function() { return /* binding */ progressEventReducer; }
/* harmony export */ });
/* harmony import */ var _speedometer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/helpers/speedometer.js");
/* harmony import */ var _throttle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/helpers/throttle.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/utils.js");




const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = (0,_speedometer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(50, 250);

  return (0,_throttle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
}

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
}

const asyncDecorator = (fn) => (...args) => _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].asap(() => fn(...args));


/***/ }),

/***/ "./node_modules/axios/lib/helpers/resolveConfig.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/axios/lib/helpers/isURLSameOrigin.js");
/* harmony import */ var _cookies_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/axios/lib/helpers/cookies.js");
/* harmony import */ var _core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _buildURL_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/helpers/buildURL.js");









/* harmony default export */ __webpack_exports__["default"] = ((config) => {
  const newConfig = (0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(headers);

  newConfig.url = (0,_buildURL_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__["default"])(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFormData(data)) {
    if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv || _platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv) {
    withXSRFToken && _utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && (0,_isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__["default"])(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && _cookies_js__WEBPACK_IMPORTED_MODULE_7__["default"].read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
});



/***/ }),

/***/ "./node_modules/axios/lib/helpers/speedometer.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ __webpack_exports__["default"] = (speedometer);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ spread; }
/* harmony export */ });


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/throttle.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  }

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs)
        }, threshold - passed);
      }
    }
  }

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

/* harmony default export */ __webpack_exports__["default"] = (throttle);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toFormData.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/helpers/null.js");




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(thing) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(arr) && !arr.some(isVisitable);
}

const predicates = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"], {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (_platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSpecCompliantForm(formData);

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(value)) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Blob is not supported. Use a Buffer instead.');
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) && isFlatArray(value)) ||
        ((_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]')) && (arr = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(value, function each(el, key) {
      const result = !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && visitor.call(
        formData, el, _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ __webpack_exports__["default"] = (toFormData);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toURLEncodedForm.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ toURLEncodedForm; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/utils.js");
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/platform/index.js");






function toURLEncodedForm(data, options) {
  return (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, new _platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (_platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNode && _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/trackStream.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   readBytes: function() { return /* binding */ readBytes; },
/* harmony export */   streamChunk: function() { return /* binding */ streamChunk; },
/* harmony export */   trackStream: function() { return /* binding */ trackStream; }
/* harmony export */ });

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
}

const readBytes = async function* (iterable, chunkSize, encode) {
  for await (const chunk of iterable) {
    yield* streamChunk(ArrayBuffer.isView(chunk) ? chunk : (await encode(String(chunk))), chunkSize);
  }
}

const trackStream = (stream, chunkSize, onProgress, onFinish, encode) => {
  const iterator = readBytes(stream, chunkSize, encode);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  }

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/env/data.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/core/AxiosError.js");





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + _env_data_js__WEBPACK_IMPORTED_MODULE_0__.VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"](
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('options must be an object', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('option ' + opt + ' must be ' + result, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('Unknown option ' + opt, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ __webpack_exports__["default"] = ({
  assertOptions,
  validators
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/Blob.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


/* harmony default export */ __webpack_exports__["default"] = (typeof Blob !== 'undefined' ? Blob : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/FormData.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


/* harmony default export */ __webpack_exports__["default"] = (typeof FormData !== 'undefined' ? FormData : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");



/* harmony default export */ __webpack_exports__["default"] = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/index.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js");
/* harmony import */ var _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/platform/browser/classes/FormData.js");
/* harmony import */ var _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/axios/lib/platform/browser/classes/Blob.js");




/* harmony default export */ __webpack_exports__["default"] = ({
  isBrowser: true,
  classes: {
    URLSearchParams: _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    FormData: _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    Blob: _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/common/utils.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasBrowserEnv: function() { return /* binding */ hasBrowserEnv; },
/* harmony export */   hasStandardBrowserEnv: function() { return /* binding */ hasStandardBrowserEnv; },
/* harmony export */   hasStandardBrowserWebWorkerEnv: function() { return /* binding */ hasStandardBrowserWebWorkerEnv; },
/* harmony export */   navigator: function() { return /* binding */ _navigator; },
/* harmony export */   origin: function() { return /* binding */ origin; }
/* harmony export */ });
const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';




/***/ }),

/***/ "./node_modules/axios/lib/platform/index.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/axios/lib/platform/browser/index.js");
/* harmony import */ var _common_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/platform/common/utils.js");



/* harmony default export */ __webpack_exports__["default"] = ({
  ..._common_utils_js__WEBPACK_IMPORTED_MODULE_0__,
  ..._node_index_js__WEBPACK_IMPORTED_MODULE_1__["default"]
});


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/helpers/bind.js");




// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__["default"])(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
}

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0]
  }

  return str;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************

/* harmony default export */ __webpack_exports__["default"] = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("react-native");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_native__WEBPACK_IMPORTED_MODULE_0__);

var App = (__webpack_require__("./src/app.mpx?isApp")["default"])
react_native__WEBPACK_IMPORTED_MODULE_0__.AppRegistry.registerComponent("AwesomeProject1", () => App)

}();
module.exports = __webpack_exports__["default"];
/******/ })()
;