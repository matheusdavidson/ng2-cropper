import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropper } from './components/image-cropper/image-cropper.component';
var InlineCropperModule = (function () {
    function InlineCropperModule() {
    }
    return InlineCropperModule;
}());
export { InlineCropperModule };
InlineCropperModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                ],
                declarations: [
                    ImageCropper,
                ],
                exports: [
                    ImageCropper,
                ],
            },] },
];
/** @nocollapse */
InlineCropperModule.ctorParameters = function () { return []; };
//# sourceMappingURL=inline-cropper.module.js.map