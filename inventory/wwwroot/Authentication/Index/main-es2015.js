(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/LoginViewModel.ts":
/*!***********************************!*\
  !*** ./src/app/LoginViewModel.ts ***!
  \***********************************/
/*! exports provided: LoginViewModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginViewModel", function() { return LoginViewModel; });
class LoginViewModel {
}


/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");




const routes = [];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
        _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _LoginViewModel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LoginViewModel */ "./src/app/LoginViewModel.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-cookie-service */ "./node_modules/ngx-cookie-service/__ivy_ngcc__/fesm2015/ngx-cookie-service.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");






class AppComponent {
    constructor(http, cookieService) {
        this.http = http;
        this.cookieService = cookieService;
        this.title = 'inventory-login';
        this.loading = false;
        this.loginViewModel = new _LoginViewModel__WEBPACK_IMPORTED_MODULE_1__["LoginViewModel"]();
    }
    Signin() {
        this.loading = true;
        var productUrl = "/api/account/login";
        this.http.post(productUrl, this.loginViewModel)
            .toPromise()
            .then(res => {
            this.cookieService.set('token', res);
            window.location.href = "/pallets";
        });
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](ngx_cookie_service__WEBPACK_IMPORTED_MODULE_3__["CookieService"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 19, vars: 3, consts: [[1, "row", "h-100"], [1, "form-signin"], ["xmlns", "http://www.w3.org/2000/svg", "width", "2in", "height", "1in", "viewBox", "0 0 3228 941", 1, "mb-3"], ["id", "Selection", "fill", "#ff6400", "stroke", "black", "stroke-width", "1", "d", "M 576.00,150.00\n      C 576.00,150.00 614.00,111.00 614.00,111.00\n        614.00,111.00 687.00,38.00 687.00,38.00\n        687.00,38.00 714.00,11.00 714.00,11.00\n        716.21,8.79 721.93,2.20 725.00,2.20\n        728.07,2.20 733.79,8.79 736.00,11.00\n        736.00,11.00 763.00,38.00 763.00,38.00\n        763.00,38.00 836.00,111.00 836.00,111.00\n        836.00,111.00 874.00,150.00 874.00,150.00\n        874.00,150.00 800.00,150.00 800.00,150.00\n        800.00,150.00 800.00,878.00 800.00,878.00\n        800.00,878.00 748.00,878.00 748.00,878.00\n        736.78,877.98 734.72,872.72 727.00,865.00\n        727.00,865.00 694.00,832.00 694.00,832.00\n        694.00,832.00 554.00,692.00 554.00,692.00\n        554.00,692.00 501.00,639.00 501.00,639.00\n        497.27,635.27 485.10,624.08 483.60,620.00\n        482.88,618.06 483.00,615.09 483.00,613.00\n        483.00,613.00 483.00,421.00 483.00,421.00\n        483.00,421.00 503.00,440.00 503.00,440.00\n        503.00,440.00 535.00,472.00 535.00,472.00\n        535.00,472.00 637.00,574.00 637.00,574.00\n        637.00,574.00 637.00,150.00 637.00,150.00\n        637.00,150.00 576.00,150.00 576.00,150.00 Z\n      M 72.00,63.00\n      C 72.00,63.00 118.00,63.00 118.00,63.00\n        129.22,63.02 131.28,68.28 139.00,76.00\n        139.00,76.00 174.00,111.00 174.00,111.00\n        174.00,111.00 321.00,258.00 321.00,258.00\n        321.00,258.00 374.00,311.00 374.00,311.00\n        377.73,314.73 389.90,325.92 391.40,330.00\n        392.12,331.94 392.00,334.91 392.00,337.00\n        392.00,337.00 392.00,529.00 392.00,529.00\n        392.00,529.00 372.00,510.00 372.00,510.00\n        372.00,510.00 339.00,477.00 339.00,477.00\n        339.00,477.00 235.00,373.00 235.00,373.00\n        235.00,373.00 235.00,791.00 235.00,791.00\n        235.00,791.00 300.00,791.00 300.00,791.00\n        300.00,791.00 262.00,830.00 262.00,830.00\n        262.00,830.00 187.00,905.00 187.00,905.00\n        187.00,905.00 160.00,932.00 160.00,932.00\n        157.46,934.53 153.02,940.22 149.00,938.83\n        146.35,937.91 138.43,929.43 136.00,927.00\n        136.00,927.00 107.00,898.00 107.00,898.00\n        107.00,898.00 37.00,828.00 37.00,828.00\n        37.00,828.00 1.00,791.00 1.00,791.00\n        1.00,791.00 72.00,791.00 72.00,791.00\n        72.00,791.00 72.00,63.00 72.00,63.00 Z\n      M 2034.00,63.00\n      C 2034.00,63.00 2187.00,63.00 2187.00,63.00\n        2187.00,63.00 2187.00,878.00 2187.00,878.00\n        2187.00,878.00 1506.00,878.00 1506.00,878.00\n        1506.00,878.00 1506.00,382.00 1506.00,382.00\n        1506.00,382.00 1658.00,382.00 1658.00,382.00\n        1658.00,382.00 1658.00,724.00 1658.00,724.00\n        1658.00,724.00 1770.00,724.00 1770.00,724.00\n        1770.00,724.00 1770.00,232.00 1770.00,232.00\n        1770.00,232.00 1922.00,232.00 1922.00,232.00\n        1922.00,232.00 1922.00,724.00 1922.00,724.00\n        1922.00,724.00 2034.00,724.00 2034.00,724.00\n        2034.00,724.00 2034.00,63.00 2034.00,63.00 Z\n      M 1026.00,661.00\n      C 1026.00,661.00 1030.44,680.00 1030.44,680.00\n        1033.68,690.83 1039.07,701.02 1045.90,710.00\n        1084.54,760.82 1157.75,760.14 1213.00,742.26\n        1226.53,737.88 1244.82,729.64 1257.00,722.40\n        1260.45,720.34 1273.07,711.19 1276.00,711.30\n        1278.67,711.39 1281.21,714.26 1283.00,716.01\n        1283.00,716.01 1295.00,728.00 1295.00,728.00\n        1295.00,728.00 1344.00,777.00 1344.00,777.00\n        1344.00,777.00 1356.99,790.00 1356.99,790.00\n        1358.69,791.74 1361.67,794.39 1361.67,797.00\n        1361.66,800.58 1353.57,808.42 1351.00,811.00\n        1337.96,824.10 1327.36,833.33 1311.00,842.23\n        1272.93,862.93 1235.68,870.90 1193.00,875.17\n        1193.00,875.17 1171.00,877.04 1171.00,877.04\n        1171.00,877.04 1157.00,877.04 1157.00,877.04\n        1157.00,877.04 1145.00,878.00 1145.00,878.00\n        1145.00,878.00 1137.00,878.00 1137.00,878.00\n        1137.00,878.00 1119.00,877.00 1119.00,877.00\n        1105.64,876.84 1084.24,873.34 1071.00,870.42\n        967.11,847.51 891.27,766.78 873.92,662.00\n        872.28,652.09 870.12,637.87 870.00,628.00\n        870.00,628.00 869.00,604.00 869.00,604.00\n        869.00,604.00 870.00,591.00 870.00,591.00\n        870.66,533.95 890.39,476.67 926.00,432.00\n        971.60,374.82 1034.05,344.03 1106.00,336.83\n        1106.00,336.83 1128.00,335.00 1128.00,335.00\n        1128.00,335.00 1151.00,335.00 1151.00,335.00\n        1151.00,335.00 1163.00,335.91 1163.00,335.91\n        1219.69,339.79 1272.06,356.39 1315.00,395.17\n        1360.99,436.70 1389.47,493.80 1397.72,555.00\n        1402.40,589.77 1401.00,624.97 1401.00,660.00\n        1401.00,660.00 1146.00,660.00 1146.00,660.00\n        1146.00,660.00 1067.00,660.00 1067.00,660.00\n        1067.00,660.00 1026.00,661.00 1026.00,661.00 Z\n      M 1250.00,552.00\n      C 1249.72,539.27 1247.15,524.55 1241.68,513.00\n        1232.05,492.69 1213.23,478.45 1193.00,469.72\n        1158.14,454.67 1115.98,455.76 1082.00,472.75\n        1063.71,481.90 1046.29,496.67 1038.45,516.00\n        1033.22,528.91 1032.00,538.26 1032.00,552.00\n        1032.00,552.00 1250.00,552.00 1250.00,552.00 Z"], ["id", "Selection #1", "fill", "black", "stroke", "black", "stroke-width", "1", "d", "M 2300.00,63.00\n           C 2300.00,63.00 2463.00,63.00 2463.00,63.00\n             2463.00,63.00 2463.00,387.00 2463.00,387.00\n             2463.00,387.00 2488.25,357.00 2488.25,357.00\n             2488.25,357.00 2533.25,303.00 2533.25,303.00\n             2533.25,303.00 2666.59,143.00 2666.59,143.00\n             2666.59,143.00 2716.59,83.00 2716.59,83.00\n             2716.59,83.00 2734.17,63.60 2734.17,63.60\n             2734.17,63.60 2741.00,63.00 2741.00,63.00\n             2741.00,63.00 2918.00,63.00 2918.00,63.00\n             2913.64,70.47 2897.70,88.25 2891.25,96.00\n             2891.25,96.00 2838.42,159.00 2838.42,159.00\n             2838.42,159.00 2684.25,343.00 2684.25,343.00\n             2684.25,343.00 2622.92,416.00 2622.92,416.00\n             2622.92,416.00 2607.08,435.00 2607.08,435.00\n             2605.52,436.87 2602.05,440.56 2601.94,443.00\n             2601.81,446.02 2606.01,449.89 2607.93,452.00\n             2607.93,452.00 2625.72,472.00 2625.72,472.00\n             2625.72,472.00 2697.58,553.00 2697.58,553.00\n             2697.58,553.00 2782.84,649.00 2782.84,649.00\n             2782.84,649.00 2889.16,769.00 2889.16,769.00\n             2889.16,769.00 2952.16,840.00 2952.16,840.00\n             2952.16,840.00 2985.00,878.00 2985.00,878.00\n             2985.00,878.00 2779.00,878.00 2779.00,878.00\n             2779.00,878.00 2772.17,877.40 2772.17,877.40\n             2772.17,877.40 2752.93,857.00 2752.93,857.00\n             2752.93,857.00 2694.85,791.00 2694.85,791.00\n             2694.85,791.00 2546.15,622.00 2546.15,622.00\n             2546.15,622.00 2487.16,555.00 2487.16,555.00\n             2487.16,555.00 2463.00,528.00 2463.00,528.00\n             2463.00,528.00 2463.00,878.00 2463.00,878.00\n             2463.00,878.00 2300.00,878.00 2300.00,878.00\n             2300.00,878.00 2300.00,63.00 2300.00,63.00 Z\n           M 3136.00,127.42\n           C 3160.30,124.47 3190.78,131.81 3207.91,150.00\n             3219.68,162.51 3227.92,180.68 3228.00,198.00\n             3228.00,198.00 3228.00,211.00 3228.00,211.00\n             3227.70,236.05 3211.88,259.90 3190.00,271.51\n             3176.38,278.74 3158.27,281.17 3143.00,281.00\n             3125.72,280.79 3105.52,275.61 3092.00,264.54\n             3055.25,234.42 3054.73,176.62 3090.00,145.17\n             3104.32,132.41 3117.95,130.00 3136.00,127.42 Z\n           M 3070.00,334.00\n           C 3070.00,334.00 3223.00,334.00 3223.00,334.00\n             3223.00,334.00 3223.00,878.00 3223.00,878.00\n             3223.00,878.00 3070.00,878.00 3070.00,878.00\n             3070.00,878.00 3070.00,334.00 3070.00,334.00 Z"], ["for", "inputEmail", 1, "visually-hidden"], ["type", "email", "id", "inputEmail", "placeholder", "Email address", "required", "", "autofocus", "", 1, "form-control", 3, "ngModel", "ngModelChange"], ["for", "inputPassword", 1, "visually-hidden"], ["type", "password", "id", "inputPassword", "placeholder", "Password", "required", "", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "checkbox", "mb-3"], ["type", "checkbox", "value", "remember-me", 3, "ngModel", "ngModelChange"], ["type", "button", 1, "w-100", "btn", "btn-lg", "btn-primary", 3, "click"], [1, "mt-5", "mb-3", "text-muted"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "svg", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "path", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "path", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "label", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Email address");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AppComponent_Template_input_ngModelChange_7_listener($event) { return ctx.loginViewModel.Email = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "label", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AppComponent_Template_input_ngModelChange_10_listener($event) { return ctx.loginViewModel.Password = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AppComponent_Template_input_ngModelChange_13_listener($event) { return ctx.loginViewModel.RememberMe = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Remember me ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "button", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_15_listener() { return ctx.Signin(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Sign in");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "\u00A9 2019-2021");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.loginViewModel.Email);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.loginViewModel.Password);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.loginViewModel.RememberMe);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["RequiredValidator"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["CheckboxControlValueAccessor"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.scss']
            }]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }, { type: ngx_cookie_service__WEBPACK_IMPORTED_MODULE_3__["CookieService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-cookie-service */ "./node_modules/ngx-cookie-service/__ivy_ngcc__/fesm2015/ngx-cookie-service.js");








class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [ngx_cookie_service__WEBPACK_IMPORTED_MODULE_6__["CookieService"]], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClientModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClientModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [
                    _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]
                ],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClientModule"],
                ],
                providers: [ngx_cookie_service__WEBPACK_IMPORTED_MODULE_6__["CookieService"]],
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /mnt/9A58A6A158A67C1F/projects/inventory/inventory/Views/Authentication/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map