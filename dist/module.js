"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var input_image_crop_component_1 = require("./components/input-image-crop/input-image-crop.component");
var image_cropper_modal_component_1 = require("./components/input-image-crop/image-cropper-modal/image-cropper-modal.component");
var angular2_modal_1 = require("angular2-modal");
var inline_cropper_module_1 = require("./inline-cropper.module");
var NgCropModule = (function () {
    function NgCropModule() {
    }
    return NgCropModule;
}());
NgCropModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [
                    common_1.CommonModule,
                    angular2_modal_1.ModalModule,
                    inline_cropper_module_1.InlineCropperModule,
                ],
                declarations: [
                    image_cropper_modal_component_1.ImageCropperModal,
                    input_image_crop_component_1.InputImageCrop,
                ],
                exports: [
                    inline_cropper_module_1.InlineCropperModule,
                    image_cropper_modal_component_1.ImageCropperModal,
                    input_image_crop_component_1.InputImageCrop,
                ],
                entryComponents: [
                    image_cropper_modal_component_1.ImageCropperModal,
                ],
            },] },
];
/** @nocollapse */
NgCropModule.ctorParameters = function () { return []; };
exports.NgCropModule = NgCropModule;
//# sourceMappingURL=module.js.map