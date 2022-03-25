import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'koru-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnChanges {
  pages = [{ id: 1 }];
  page = 1;
  @Output() changePage = new EventEmitter<any>(true);
  private _pageNo: any;
  get pageNo(): any {
    return this._pageNo;
  }
  @Input() set pageNo(v) {
    if (v !== this._pageNo) {
      this._pageNo = v;
    }
  }

  private _totalDataCount: any;
  get totalDataCount(): any {
    return this._totalDataCount;
  }
  @Input() set totalDataCount(v) {
    if (v !== this._totalDataCount) {
      this._totalDataCount = v;
      this.updatePageCount();
    }
  }

  private _dataPerPage: any;
  get dataPerPage(): any {
    return this._dataPerPage;
  }
  @Input() set dataPerPage(v) {
    if (v !== this._dataPerPage) {
      this._dataPerPage = v;
      this.updatePageCount();
    }
  }
  totalPages: any;
  enteredPage: any;

  ngOnChanges() {
    this.totalPages = Math.ceil(this.totalDataCount / this.dataPerPage);
    if (!isNaN(this.totalPages)) {
      if (this.totalPages === 1) {
        this.pages = [{ id: 1 }];
        this.pageNo = 1;
      }
      if (this.pageNo === 1) {
        this.page = 1;
        this.enteredPage = '';
      }
      for (let i = 2; i <= this.totalPages; i++) {
        const found = this.pages.some((page) => page.id === i);
        if (!found) {
          this.pages.push({ id: i });
        }
      }
    }
  }

  updatePageCount = () => {
    this.totalPages = Math.ceil(this.totalDataCount / this.dataPerPage);
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      const found = this.pages.some((page) => page.id === i);
      if (!found) {
        this.pages.push({ id: i });
      }
    }
  };

  setPage(page: any, type?: string) {
    if (page !== this.pageNo) {
      this.pages.forEach((el) => {
        if (page === el.id) {
          this.changePage.emit(page);
          this.page = page;
        }
      });
    }
    if (type === 'btnClick') {
      this.enteredPage = '';
    }
  }

  gotoPage(page: any) {
    if (page.trim() !== '' && page !== '0') {
      this.setPage(Number(page));
    }
  }
}
