var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Component } from '@angular/core';
import { DialogRef } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
var ImageCropperModalContext = (function (_super) {
    __extends(ImageCropperModalContext, _super);
    function ImageCropperModalContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ImageCropperModalContext;
}(BSModalContext));
export { ImageCropperModalContext };
var ImageCropperModal = (function () {
    function ImageCropperModal(dialog) {
        this.dialog = dialog;
        this.context = this.dialog.context;
    }
    ImageCropperModal.prototype.ngOnInit = function () {
    };
    ImageCropperModal.prototype.ngOnDestroy = function () {
    };
    ImageCropperModal.prototype.saveData = function (data) {
        this.dialog.close(data);
    };
    return ImageCropperModal;
}());
export { ImageCropperModal };
ImageCropperModal.decorators = [
    { type: Component, args: [{
                selector: 'image-cropper-modal',
                providers: [],
                template: "<div class=\"modal-content\"><div class=\"modal-header\"><button class=\"close\" type=\"button\" (click)=\"dialog.dismiss()\"></button><h4 class=\"modal-title\">{{ context.modalTitle }}</h4></div><div class=\"modal-body\" #body=\"#body\" style=\"min-height:250px;padding:0\"><image-cropper #cropper style=\"width: 100%\" [imageUrl]=\"context.imageUrl\" (export)=\"saveData($event)\" [settings]=\"context.settings\" [cropbox]=\"context.cropbox\"></image-cropper></div><div class=\"modal-footer\"><button class=\"btn btn-default\" type=\"button\" (click)=\"dialog.dismiss()\">{{ context.buttonCloseCaption }}</button> <button class=\"btn btn-primary\" (click)=\"cropper.exportCanvas()\" type=\"button\" [disabled]=\"cropper.isLoading\"><i class=\"fa fa-save\"></i><span> {{ context.buttonSaveCaption }}</span></button></div></div>",
            },] },
];
/** @nocollapse */
ImageCropperModal.ctorParameters = function () { return [
    { type: DialogRef, },
]; };
//# sourceMappingURL=image-cropper-modal.component.js.map