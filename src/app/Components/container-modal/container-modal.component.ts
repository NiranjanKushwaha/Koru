import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'container-modal',
  templateUrl: './container-modal.component.html',
  styleUrls: ['./container-modal.component.css'],
})
export class ContainerModalComponent {
  constructor(private modalService: NgbModal) {}
  @ViewChild('modal')
  private modalContent: TemplateRef<ContainerModalComponent>;
  private modalRef: NgbModalRef;
  open() {
    this.modalRef = this.modalService.open(this.modalContent, {
      backdrop: 'static',
      size: 'lg',
      keyboard: false,
      backdropClass: 'modal-custom',
    });
  }
  dismiss() {
    this.modalRef.close();
  }
}
