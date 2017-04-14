import { Component } from '@angular/core'
import { DialogRef, ModalComponent } from 'angular2-modal'
import { BSModalContext } from 'angular2-modal/plugins/bootstrap'
import { IImageCropperSetting } from '../../image-cropper/image-cropper.component'

export class ImageCropperModalContext extends BSModalContext {
	imageUrl: string
	settings: IImageCropperSetting
	modalTitle: string
	buttonCloseCaption: string
	buttonSaveCaption: string
}

@Component({
	selector: 'image-cropper-modal',
	providers: [],
	template: `<div class="modal-content"><div class="modal-header"><button class="close" type="button" (click)="dialog.dismiss()"></button><h4 class="modal-title">{{ context.modalTitle }}</h4></div><div class="modal-body" #body="#body" style="min-height:250px;padding:0"><image-cropper #cropper style="width: 100%" [imageUrl]="context.imageUrl" (export)="saveData($event)" [settings]="context.settings" [cropbox]="context.cropbox"></image-cropper></div><div class="modal-footer"><button class="btn btn-default" type="button" (click)="dialog.dismiss()">{{ context.buttonCloseCaption }}</button> <button class="btn btn-primary" (click)="cropper.exportCanvas()" type="button" [disabled]="cropper.isLoading"><i class="fa fa-save"></i><span> {{ context.buttonSaveCaption }}</span></button></div></div>`,
})
export class ImageCropperModal implements ModalComponent<ImageCropperModalContext> {
	private context

	constructor(public dialog: DialogRef<ImageCropperModalContext>) {
		this.context = this.dialog.context
	}

	ngOnInit() {
	}

	ngOnDestroy() {
	}

	saveData(data) {
		this.dialog.close(data)
	}
}
