import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataShareService } from 'src/app/services/data-share.service';
@Component({
  selector: 'container-modal',
  templateUrl: './container-modal.component.html',
  styleUrls: ['./container-modal.component.css'],
})
export class ContainerModalComponent {
  constructor(
    private modalService: NgbModal,
    private _dataShareService: DataShareService
  ) {}
  @ViewChild('modal')
  private modalContent: TemplateRef<ContainerModalComponent>;
  private modalRef: NgbModalRef;
  dataPerPage: number = 5;
  totalCount: number = 13;
  pageNumber: number = 1;
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
  handleFilteredData(data: any) {
    this._dataShareService.filteredData.next(data);
  }

  onPageChange(pageId: any) {
    this.pageNumber = pageId;
    this._dataShareService.currentPage.next(pageId);
  }
}
