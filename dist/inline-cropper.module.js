"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var image_cropper_component_1 = require("./components/image-cropper/image-cropper.component");
var InlineCropperModule = (function () {
    function InlineCropperModule() {
    }
    return InlineCropperModule;
}());
InlineCropperModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [
                    common_1.CommonModule,
                ],
                declarations: [
                    image_cropper_component_1.ImageCropper,
                ],
                exports: [
                    image_cropper_component_1.ImageCropper,
                ],
            },] },
];
/** @nocollapse */
InlineCropperModule.ctorParameters = function () { return []; };
exports.InlineCropperModule = InlineCropperModule;
//# sourceMappingURL=inline-cropper.module.js.map