/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./static/templates/import-youtube-playlist.html":
/*!*******************************************************!*\
  !*** ./static/templates/import-youtube-playlist.html ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<form id=\"playlist-yt-import\" autocomplete=\"off\" onsubmit=\"event.preventDefault();\">\r\n\t<p class=\"notes\">{{localize 'bellows.import-yt-playlist-notes'}}</p>\r\n\t<div class=\"form-group\">\r\n\t\t<div class=\"form-fields\">\r\n\t\t\t<input type=\"text\" id=\"bellows-yt-import-url-text\" placeholder=\"https://www.youtube.com/playlist?list=PLccmC0-jXVkiQF1uMehdwqSlpXafNAe_e\">\r\n\t\t\t<button type=\"button\" id=\"bellows-yt-import-btn-import\" name=\"import\"><i class=\"fas fa-file-import\"></i></button>\r\n\t\t</div>\r\n\t</div>\r\n\t{{#if working}}\r\n\t<div class=\"playlist-import-loading-spinner\"></div>\r\n\t{{/if}}\r\n\t{{#if playlistItems}}\r\n\t<div class=\"form-group\">\r\n\t\t<label for=\"bellows-yt-import-playlist-name\">{{localize 'bellows.import-yt-playlist-lbl-name'}}:</label>\r\n\t\t<input type=\"text\" id=\"bellows-yt-import-playlist-name\" name=\"playlistname\" required>\r\n\t</div>\r\n\t<div class=\"form-group\">\r\n\t\t<label for=\"bellows-yt-import-playlist-volume\">{{localize 'bellows.import-yt-playlist-lbl-volume'}}:</label>\r\n\t\t<input type=\"range\" class=\"sound-volume\" id=\"bellows-yt-import-playlist-volume\" val=\"0.5\" min=\"0\" max=\"1\" step=\"0.05\" name=\"playlistvolume\">\r\n\t</div>\r\n\t<section class=\"playlist-import-container\">\r\n\t\t<ol>\r\n\t\t\t{{#each playlistItems}}\r\n\t\t\t<li>\r\n\t\t\t\t{{this.title}}\r\n\t\t\t</li>\r\n\t\t\t{{/each}}\r\n\t\t</ol>\r\n\t</section>\r\n\t{{/if}}\r\n\t<button type=\"submit\" id=\"bellows-yt-import-btn-confirm\" name=\"submit\" {{#unless playlistItems}}disabled{{/unless}}>\r\n\t\t<i class=\"fas fa-file-download\"></i>{{localize 'bellows.import-yt-playlist-btn-submit'}}\r\n\t</button>\r\n</form>\r\n");

/***/ }),

/***/ "./src/module/helper/TemplatePreloader.ts":
/*!************************************************!*\
  !*** ./src/module/helper/TemplatePreloader.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TemplatePreloader": () => (/* binding */ TemplatePreloader)
/* harmony export */ });
/* harmony import */ var _static_templates_import_youtube_playlist_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../static/templates/import-youtube-playlist.html */ "./static/templates/import-youtube-playlist.html");

class TemplatePreloader {
    /**
     * Preload a set of templates to compile and cache them for fast access during rendering
     */
    static async preloadHandlebarsTemplates() {
        const templatePaths = ["modules/template/templates/import-youtube-playlist.html"];
        return loadTemplates(templatePaths);
    }
}


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/bellows.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _module_helper_TemplatePreloader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module/helper/TemplatePreloader */ "./src/module/helper/TemplatePreloader.ts");

Hooks.once("init", async () => {
});
Hooks.once("ready", async () => {
    console.log("Test");
});
if (true) {
    if (false) {}
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iZWxsb3dzLy4vc3RhdGljL3RlbXBsYXRlcy9pbXBvcnQteW91dHViZS1wbGF5bGlzdC5odG1sIiwid2VicGFjazovL2JlbGxvd3MvLi9zcmMvbW9kdWxlL2hlbHBlci9UZW1wbGF0ZVByZWxvYWRlci50cyIsIndlYnBhY2s6Ly9iZWxsb3dzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JlbGxvd3Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JlbGxvd3Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iZWxsb3dzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmVsbG93cy8uL3NyYy9iZWxsb3dzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWUsd0ZBQXdGLDhCQUE4Qiw2Q0FBNkMsc1lBQXNZLGFBQWEsbUVBQW1FLEtBQUssUUFBUSxtQkFBbUIseUZBQXlGLGdEQUFnRCxtTkFBbU4sa0RBQWtELG9RQUFvUSxxQkFBcUIsNEJBQTRCLFlBQVksMkJBQTJCLE9BQU8scUNBQXFDLEtBQUsscUZBQXFGLHVCQUF1QixVQUFVLFNBQVMsaURBQWlELGtEQUFrRCwrQkFBK0IsRTs7Ozs7Ozs7Ozs7Ozs7O0FDQXBvRDtBQUV6RCxNQUFNLGlCQUFpQjtJQUMxQjs7T0FFRztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsMEJBQTBCO1FBQ25DLE1BQU0sYUFBYSxHQUFHLENBQUMseURBQXlELENBQUMsQ0FBQztRQUNsRixPQUFPLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0o7Ozs7Ozs7VUNWRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ05zRTtBQUV0RSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLElBQUksRUFBRTtBQUU5QixDQUFDLENBQUMsQ0FBQztBQUVILEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFHSCxJQUFJLElBQXNDLEVBQUU7SUFDeEMsSUFBSSxLQUFVLEVBQUUsRUFrQmY7Q0FDSiIsImZpbGUiOiJiZWxsb3dzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgXCI8Zm9ybSBpZD1cXFwicGxheWxpc3QteXQtaW1wb3J0XFxcIiBhdXRvY29tcGxldGU9XFxcIm9mZlxcXCIgb25zdWJtaXQ9XFxcImV2ZW50LnByZXZlbnREZWZhdWx0KCk7XFxcIj5cXHJcXG5cXHQ8cCBjbGFzcz1cXFwibm90ZXNcXFwiPnt7bG9jYWxpemUgJ2JlbGxvd3MuaW1wb3J0LXl0LXBsYXlsaXN0LW5vdGVzJ319PC9wPlxcclxcblxcdDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclxcblxcdFxcdDxkaXYgY2xhc3M9XFxcImZvcm0tZmllbGRzXFxcIj5cXHJcXG5cXHRcXHRcXHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgaWQ9XFxcImJlbGxvd3MteXQtaW1wb3J0LXVybC10ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vcGxheWxpc3Q/bGlzdD1QTGNjbUMwLWpYVmtpUUYxdU1laGR3cVNscFhhZk5BZV9lXFxcIj5cXHJcXG5cXHRcXHRcXHQ8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgaWQ9XFxcImJlbGxvd3MteXQtaW1wb3J0LWJ0bi1pbXBvcnRcXFwiIG5hbWU9XFxcImltcG9ydFxcXCI+PGkgY2xhc3M9XFxcImZhcyBmYS1maWxlLWltcG9ydFxcXCI+PC9pPjwvYnV0dG9uPlxcclxcblxcdFxcdDwvZGl2PlxcclxcblxcdDwvZGl2PlxcclxcblxcdHt7I2lmIHdvcmtpbmd9fVxcclxcblxcdDxkaXYgY2xhc3M9XFxcInBsYXlsaXN0LWltcG9ydC1sb2FkaW5nLXNwaW5uZXJcXFwiPjwvZGl2PlxcclxcblxcdHt7L2lmfX1cXHJcXG5cXHR7eyNpZiBwbGF5bGlzdEl0ZW1zfX1cXHJcXG5cXHQ8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcXG5cXHRcXHQ8bGFiZWwgZm9yPVxcXCJiZWxsb3dzLXl0LWltcG9ydC1wbGF5bGlzdC1uYW1lXFxcIj57e2xvY2FsaXplICdiZWxsb3dzLmltcG9ydC15dC1wbGF5bGlzdC1sYmwtbmFtZSd9fTo8L2xhYmVsPlxcclxcblxcdFxcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBpZD1cXFwiYmVsbG93cy15dC1pbXBvcnQtcGxheWxpc3QtbmFtZVxcXCIgbmFtZT1cXFwicGxheWxpc3RuYW1lXFxcIiByZXF1aXJlZD5cXHJcXG5cXHQ8L2Rpdj5cXHJcXG5cXHQ8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcXG5cXHRcXHQ8bGFiZWwgZm9yPVxcXCJiZWxsb3dzLXl0LWltcG9ydC1wbGF5bGlzdC12b2x1bWVcXFwiPnt7bG9jYWxpemUgJ2JlbGxvd3MuaW1wb3J0LXl0LXBsYXlsaXN0LWxibC12b2x1bWUnfX06PC9sYWJlbD5cXHJcXG5cXHRcXHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIGNsYXNzPVxcXCJzb3VuZC12b2x1bWVcXFwiIGlkPVxcXCJiZWxsb3dzLXl0LWltcG9ydC1wbGF5bGlzdC12b2x1bWVcXFwiIHZhbD1cXFwiMC41XFxcIiBtaW49XFxcIjBcXFwiIG1heD1cXFwiMVxcXCIgc3RlcD1cXFwiMC4wNVxcXCIgbmFtZT1cXFwicGxheWxpc3R2b2x1bWVcXFwiPlxcclxcblxcdDwvZGl2PlxcclxcblxcdDxzZWN0aW9uIGNsYXNzPVxcXCJwbGF5bGlzdC1pbXBvcnQtY29udGFpbmVyXFxcIj5cXHJcXG5cXHRcXHQ8b2w+XFxyXFxuXFx0XFx0XFx0e3sjZWFjaCBwbGF5bGlzdEl0ZW1zfX1cXHJcXG5cXHRcXHRcXHQ8bGk+XFxyXFxuXFx0XFx0XFx0XFx0e3t0aGlzLnRpdGxlfX1cXHJcXG5cXHRcXHRcXHQ8L2xpPlxcclxcblxcdFxcdFxcdHt7L2VhY2h9fVxcclxcblxcdFxcdDwvb2w+XFxyXFxuXFx0PC9zZWN0aW9uPlxcclxcblxcdHt7L2lmfX1cXHJcXG5cXHQ8YnV0dG9uIHR5cGU9XFxcInN1Ym1pdFxcXCIgaWQ9XFxcImJlbGxvd3MteXQtaW1wb3J0LWJ0bi1jb25maXJtXFxcIiBuYW1lPVxcXCJzdWJtaXRcXFwiIHt7I3VubGVzcyBwbGF5bGlzdEl0ZW1zfX1kaXNhYmxlZHt7L3VubGVzc319PlxcclxcblxcdFxcdDxpIGNsYXNzPVxcXCJmYXMgZmEtZmlsZS1kb3dubG9hZFxcXCI+PC9pPnt7bG9jYWxpemUgJ2JlbGxvd3MuaW1wb3J0LXl0LXBsYXlsaXN0LWJ0bi1zdWJtaXQnfX1cXHJcXG5cXHQ8L2J1dHRvbj5cXHJcXG48L2Zvcm0+XFxyXFxuXCI7IiwiaW1wb3J0IFwiLi4vLi4vLi4vc3RhdGljL3RlbXBsYXRlcy9pbXBvcnQteW91dHViZS1wbGF5bGlzdC5odG1sXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVByZWxvYWRlciB7XG4gICAgLyoqXG4gICAgICogUHJlbG9hZCBhIHNldCBvZiB0ZW1wbGF0ZXMgdG8gY29tcGlsZSBhbmQgY2FjaGUgdGhlbSBmb3IgZmFzdCBhY2Nlc3MgZHVyaW5nIHJlbmRlcmluZ1xuICAgICAqL1xuICAgIHN0YXRpYyBhc3luYyBwcmVsb2FkSGFuZGxlYmFyc1RlbXBsYXRlcygpIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGVQYXRocyA9IFtcIm1vZHVsZXMvdGVtcGxhdGUvdGVtcGxhdGVzL2ltcG9ydC15b3V0dWJlLXBsYXlsaXN0Lmh0bWxcIl07XG4gICAgICAgIHJldHVybiBsb2FkVGVtcGxhdGVzKHRlbXBsYXRlUGF0aHMpO1xuICAgIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFRlbXBsYXRlUHJlbG9hZGVyIH0gZnJvbSBcIi4vbW9kdWxlL2hlbHBlci9UZW1wbGF0ZVByZWxvYWRlclwiO1xuXG5Ib29rcy5vbmNlKFwiaW5pdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgXG59KTtcblxuSG9va3Mub25jZShcInJlYWR5XCIsIGFzeW5jICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIlRlc3RcIik7XG59KTtcblxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIikge1xuICAgIGlmIChtb2R1bGUuaG90KSB7XG4gICAgICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG5cbiAgICAgICAgaWYgKG1vZHVsZS5ob3Quc3RhdHVzKCkgPT09IFwiYXBwbHlcIikge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0ZW1wbGF0ZSBpbiBfdGVtcGxhdGVDYWNoZSkge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX3RlbXBsYXRlQ2FjaGUsIHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgX3RlbXBsYXRlQ2FjaGVbdGVtcGxhdGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVGVtcGxhdGVQcmVsb2FkZXIucHJlbG9hZEhhbmRsZWJhcnNUZW1wbGF0ZXMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGFwcGxpY2F0aW9uIGluIHVpLndpbmRvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh1aS53aW5kb3dzLCBhcHBsaWNhdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpLndpbmRvd3NbYXBwbGljYXRpb25dLnJlbmRlcih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0=