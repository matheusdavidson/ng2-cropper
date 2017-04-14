"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var image_cropper_modal_component_1 = require("./image-cropper-modal/image-cropper-modal.component");
var angular2_modal_1 = require("angular2-modal");
var bootstrap_1 = require("angular2-modal/plugins/bootstrap");
var platform_browser_1 = require("@angular/platform-browser");
function maybe(value) {
    return (value || {});
}
var InputImageCrop = (function () {
    function InputImageCrop(sanitizer, modal, renderer) {
        this.sanitizer = sanitizer;
        this.modal = modal;
        this.renderer = renderer;
        this.modalTitle = 'Crop image';
        this.buttonSaveCaption = 'Save';
        this.buttonCloseCaption = 'Close';
    }
    InputImageCrop.prototype.writeValue = function (value) {
        if (this.recropable) {
            value = maybe(value);
            this.croppedUrl = maybe(value.croppedImage).fullUrl;
            this.croppedRelativeUrl = maybe(value.croppedImage).relativeUrl;
            this.origin = value.originImage;
            this.fileName = value.fileName;
            this.cropbox = value.cropDimension;
            return;
        }
        value = maybe(value);
        this.croppedUrl = value ? value.fullUrl : undefined;
        this.croppedRelativeUrl = value.relativeUrl;
    };
    InputImageCrop.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    InputImageCrop.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    InputImageCrop.prototype.openCropperWindow = function (input) {
        var _this = this;
        var file = input.files[0];
        if (!file) {
            return;
        }
        this.origin = {
            fullUrl: file,
        };
        this.fileName = file.name;
        var url = URL.createObjectURL(file);
        var imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.openModal(imageUrl)
            .then(function (result) {
            if (!result) {
                input.value = '';
                return;
            }
            _this.cropbox = result.cropData;
            return _this.updateValue(result);
        })
            .then(function () {
            URL.revokeObjectURL(url);
        });
    };
    InputImageCrop.prototype.ngOnDestroy = function () {
        URL.revokeObjectURL(this.croppedUrl);
    };
    InputImageCrop.prototype.ngAfterViewInit = function () {
        var label = this.labelRef.nativeElement;
        var width = label.offsetWidth;
        if (this.settings) {
            var height = this.settings.height / this.settings.width * width;
            this.renderer.setElementStyle(label, 'minHeight', height + "px");
        }
    };
    InputImageCrop.prototype.remove = function (ev) {
        ev.stopPropagation();
        this.croppedUrl = undefined;
        this.onChange(undefined);
    };
    InputImageCrop.prototype.editImage = function (evnt) {
        var _this = this;
        event.stopPropagation();
        if (!this.recropable) {
            return;
        }
        this.openModal(this.origin.fullUrl)
            .then(function (result) { return _this.updateValue(result); });
    };
    Object.defineProperty(InputImageCrop.prototype, "isEmpty", {
        get: function () {
            return !this.croppedUrl;
        },
        enumerable: true,
        configurable: true
    });
    InputImageCrop.prototype.openModal = function (imageUrl) {
        var config = angular2_modal_1.overlayConfigFactory({
            imageUrl: imageUrl,
            settings: this.settings,
            cropbox: this.cropbox,
            modalTitle: this.modalTitle,
            buttonSaveCaption: this.buttonSaveCaption,
            buttonCloseCaption: this.buttonCloseCaption,
            size: 'lg',
        }, bootstrap_1.BSModalContext);
        return this.modal.open(image_cropper_modal_component_1.ImageCropperModal, config)
            .then(function (r) { return r.result; })
            .catch(function (_) { return undefined; });
    };
    InputImageCrop.prototype.updateValue = function (result) {
        if (!result) {
            return;
        }
        this.value = this.transform(result);
        if (this.onChange) {
            this.onChange(this.value);
        }
    };
    InputImageCrop.prototype.transform = function (result) {
        if (this.croppedUrl) {
            URL.revokeObjectURL(this.croppedUrl);
        }
        this.croppedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(result.blob));
        if (this.recropable) {
            var ret_1 = {};
            ret_1.cropDimension = result.cropData;
            ret_1.fileName = this.fileName;
            ret_1.originImage = this.origin;
            ret_1.croppedImage = {
                fullUrl: result.blob,
                relativeUrl: this.croppedRelativeUrl,
            };
            return ret_1;
        }
        var ret = {};
        ret.fullUrl = result.blob;
        ret.relativeUrl = this.croppedRelativeUrl;
        return ret;
    };
    return InputImageCrop;
}());
InputImageCrop.decorators = [
    { type: core_1.Component, args: [{
                selector: 'input-image-crop',
                providers: [{
                        provide: forms_1.NG_VALUE_ACCESSOR,
                        useExisting: core_1.forwardRef(function () { return InputImageCrop; }),
                        multi: true,
                    }],
                styles: [":host{display:block;overflow:hidden;position:relative}.preview{width:100%}.btn-group .btn-remove,label{position:relative;cursor:pointer;display:inline-block}label{min-height:100px;background-color:#ddd;width:100%}label:hover .icon{color:#fff}label .icon{font-size:4em;color:rgba(255,255,255,.7);position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}input{position:absolute;opacity:0;width:0;height:0}.btn-group{position:absolute;right:.5em;top:1em;z-index:10}.btn-group .btn-remove{line-height:1;padding:.5em;border-radius:50%;background-color:rgba(255,255,255,.4);color:#555;width:2em;text-align:center}.btn-group .btn-remove+.btn-remove{margin-left:.5em}.btn-group .btn-remove:hover{background-color:rgba(255,255,255,.9)}"],
                template: "<div class=\"btn-group\" *ngIf=\"!isEmpty\"><a class=\"btn-remove\" (click)=\"remove($event)\"><i class=\"fa fa-trash\"></i> </a><a class=\"btn-remove\" (click)=\"editImage($event)\" *ngIf=\"recropable\"><i class=\"fa fa-pencil\"></i></a></div><label #label=\"#label\"><div class=\"icon\" *ngIf=\"isEmpty\"><i class=\"fa fa-cloud-upload\"></i></div><img class=\"preview\" *ngIf=\"croppedUrl\" [src]=\"croppedUrl\"/> <input class=\"ghost\" type=\"file\" (change)=\"openCropperWindow($event.target)\" [disabled]=\"!isEmpty\" accept=\"image/*\"/></label>",
            },] },
];
/** @nocollapse */
InputImageCrop.ctorParameters = function () { return [
    { type: platform_browser_1.DomSanitizer, },
    { type: bootstrap_1.Modal, },
    { type: core_1.Renderer, },
]; };
InputImageCrop.propDecorators = {
    'settings': [{ type: core_1.Input },],
    'recropable': [{ type: core_1.Input },],
    'modalTitle': [{ type: core_1.Input },],
    'buttonSaveCaption': [{ type: core_1.Input },],
    'buttonCloseCaption': [{ type: core_1.Input },],
    'labelRef': [{ type: core_1.ViewChild, args: ['label',] },],
};
exports.InputImageCrop = InputImageCrop;
//# sourceMappingURL=input-image-crop.component.js.map