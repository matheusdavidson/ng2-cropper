import { Component, forwardRef, Input, ViewChild, ElementRef, Renderer } from '@angular/core'
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'
import { ImageCropperModal } from './image-cropper-modal/image-cropper-modal.component'
import { overlayConfigFactory } from 'angular2-modal'
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap'
import { DomSanitizer } from '@angular/platform-browser'
import { IImageView, IImageCropView } from '../../model'
import { IImageCropperSetting, IImageCropperResult } from '../image-cropper/image-cropper.component'

function maybe<T>(value) {
	return (value || {}) as T
}

@Component({
	selector: 'input-image-crop',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => InputImageCrop),
		multi: true,
	}],
	styles: [`:host{display:block;overflow:hidden;position:relative}.preview{width:100%}.btn-group .btn-remove,label{position:relative;cursor:pointer;display:inline-block}label{min-height:100px;background-color:#ddd;width:100%}label:hover .icon{color:#fff}label .icon{font-size:4em;color:rgba(255,255,255,.7);position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}input{position:absolute;opacity:0;width:0;height:0}.btn-group{position:absolute;right:.5em;top:1em;z-index:10}.btn-group .btn-remove{line-height:1;padding:.5em;border-radius:50%;background-color:rgba(255,255,255,.4);color:#555;width:2em;text-align:center}.btn-group .btn-remove+.btn-remove{margin-left:.5em}.btn-group .btn-remove:hover{background-color:rgba(255,255,255,.9)}`],
	template: `<div class="btn-group" *ngIf="!isEmpty"><a class="btn-remove" (click)="remove($event)"><i class="fa fa-trash"></i> </a><a class="btn-remove" (click)="editImage($event)" *ngIf="recropable"><i class="fa fa-pencil"></i></a></div><label #label="#label"><div class="icon" *ngIf="isEmpty"><i class="fa fa-cloud-upload"></i></div><img class="preview" *ngIf="croppedUrl" [src]="croppedUrl"/> <input class="ghost" type="file" (change)="openCropperWindow($event.target)" [disabled]="!isEmpty" accept="image/*"/></label>`,
})
export class InputImageCrop implements ControlValueAccessor {
	@Input() settings: IImageCropperSetting
	@Input() recropable: boolean
	@Input() modalTitle = 'Crop image'
	@Input() buttonSaveCaption = 'Save'
	@Input() buttonCloseCaption = 'Close'
	private onChange: Function
	private onTouched: Function
	private croppedUrl
	private croppedRelativeUrl: string
	private value: IImageView | IImageCropView
	private origin: {
		fullUrl: string | File,
		relativeUrl?: string,
	}
	private fileName: string
	private cropbox
	@ViewChild('label') private labelRef: ElementRef

	constructor(private sanitizer: DomSanitizer,
				private modal: Modal,
				private renderer: Renderer,) {
	}

	writeValue(value?: IImageView | IImageCropView) {
		if (this.recropable) {
			value = maybe<IImageCropView>(value)
			this.croppedUrl = maybe<IImageView>(value.croppedImage).fullUrl
			this.croppedRelativeUrl = maybe<IImageView>(value.croppedImage).relativeUrl
			this.origin = value.originImage
			this.fileName = value.fileName
			this.cropbox = value.cropDimension
			return
		}

		value = maybe<IImageView>(value)
		this.croppedUrl = value ? value.fullUrl : undefined
		this.croppedRelativeUrl = value.relativeUrl
	}

	registerOnChange(fn) {
		this.onChange = fn
	}

	registerOnTouched(fn) {
		this.onTouched = fn
	}

	openCropperWindow(input: HTMLInputElement) {
		let file = input.files[0]
		if (!file) {
			return
		}
		this.origin = {
			fullUrl: file,
		}
		this.fileName = file.name
		let url = URL.createObjectURL(file)
		let imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
		this.openModal(imageUrl)
			.then(result => {
				if (!result) { // clear input
					input.value = ''
					return
				}
				this.cropbox = result.cropData
				return this.updateValue(result)
			})
			.then(() => {
				URL.revokeObjectURL(url)
			})
	}

	ngOnDestroy() {
		URL.revokeObjectURL(this.croppedUrl)
	}

	ngAfterViewInit() {
		let label = this.labelRef.nativeElement as HTMLLabelElement
		let width = label.offsetWidth
		if (this.settings) {
			let height = this.settings.height / this.settings.width * width
			this.renderer.setElementStyle(label, 'minHeight', `${height}px`)
		}

	}

	remove(ev: Event) {
		ev.stopPropagation()
		this.croppedUrl = undefined
		this.onChange(undefined)
	}

	editImage(evnt: Event) {
		event.stopPropagation()

		if (!this.recropable) {
			return
		}

		this.openModal(this.origin.fullUrl)
			.then(result => this.updateValue(result))
	}

	get isEmpty() {
		return !this.croppedUrl
	}

	private openModal(imageUrl) {
		let config = overlayConfigFactory({
			imageUrl,
			settings: this.settings,
			cropbox: this.cropbox,
			modalTitle: this.modalTitle,
			buttonSaveCaption: this.buttonSaveCaption,
			buttonCloseCaption: this.buttonCloseCaption,
			size: 'lg',
		}, BSModalContext)
		return this.modal.open(ImageCropperModal, config)
			.then(r => r.result)
			.catch(_ => undefined)
	}

	private updateValue(result: IImageCropperResult) {
		if (!result) {
			return
		}

		this.value = this.transform(result)

		if (this.onChange) {
			this.onChange(this.value)
		}
	}

	private transform(result: IImageCropperResult): IImageCropView | IImageView {
		if (this.croppedUrl) {
			URL.revokeObjectURL(this.croppedUrl)
		}

		this.croppedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
			URL.createObjectURL(result.blob))

		if (this.recropable) {
			let ret = {} as IImageCropView
			ret.cropDimension = result.cropData
			ret.fileName = this.fileName
			ret.originImage = this.origin as IImageView
			ret.croppedImage = {
				fullUrl: result.blob as any,
				relativeUrl: this.croppedRelativeUrl,
			}

			return ret
		}

		let ret = {} as IImageView
		ret.fullUrl = result.blob as any
		ret.relativeUrl = this.croppedRelativeUrl
		return ret
	}
}
