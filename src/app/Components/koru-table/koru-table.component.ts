import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataShareService } from 'src/app/services/data-share.service';
@Component({
  selector: 'koru-table',
  templateUrl: './koru-table.component.html',
  styleUrls: ['./koru-table.component.css'],
})
export class KoruTableComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private _dataShareService: DataShareService
  ) {
    this._dataShareService.filteredData.subscribe((res) => {
      if (res && res.length) {
        if (res.length > this.dataPerPage) {
          this.allData = res.slice(
            (this.currentPage - 1) * this.dataPerPage,
            this.currentPage * this.dataPerPage
          );
        } else {
          this.allData = res;
        }
      } else {
        this.allData = [];
      }
    });
    this._dataShareService.currentPage.subscribe((res) => {
      if (res) {
        this.currentPage = res;
        this.allData = this.allDataDeepCopy.slice(
          (this.currentPage - 1) * this.dataPerPage,
          this.currentPage * this.dataPerPage
        );
        this._dataShareService.searchData.next(this.allData);
      }
    });
  }
  tableSortOrder: any = {
    idSort: { type: '', value: 0 },
    nameSort: { type: '', value: 0 },
    mobSort: { type: '', value: 0 },
    designationSort: { type: '', value: 0 },
  };

  allData: any;
  allDataDeepCopy: any = [];
  shouldAddNewField: boolean = false;
  newRowData = {
    id: null,
    name: '',
    mob: '',
    designation: '',
  };

  currentPage: number = 1;
  dataPerPage: number = 5;
  ngOnInit(): void {
    this.http.get('../../../assets/data.json').subscribe((res) => {
      this.allData = res;
      this._dataShareService.dataForPagination.next(this.allData);
      this._dataShareService.allDataCopy.next(this.allData);
      this.allData = this.allData.slice(
        (this.currentPage - 1) * this.dataPerPage,
        this.currentPage * this.dataPerPage
      );
      if (Array.isArray(res)) {
        this.allDataDeepCopy = res.slice();
      }
      this._dataShareService.searchData.next(res);
    });
  }
  sort(type: string) {
    console.log(type);
    if (type === 'idSort') {
      this.tableSortOrder.idSort.value += 1;
      this.tableSortOrder.idSort = this.getSortingOrder(
        this.tableSortOrder.idSort.value,
        Object.keys(this.tableSortOrder)[0]
      );
      this.allData = this.sortByOrder(
        this.tableSortOrder.idSort.type,
        'id',
        'number'
      );
    }
    if (type === 'nameSort') {
      this.tableSortOrder.nameSort.value += 1;
      this.tableSortOrder.nameSort = this.getSortingOrder(
        this.tableSortOrder.nameSort.value,
        Object.keys(this.tableSortOrder)[1]
      );
      this.allData = this.sortByOrder(
        this.tableSortOrder.nameSort.type,
        'name',
        'string'
      );
    }
    if (type === 'mobSort') {
      this.tableSortOrder.mobSort.value += 1;
      this.tableSortOrder.mobSort = this.getSortingOrder(
        this.tableSortOrder.mobSort.value,
        Object.keys(this.tableSortOrder)[2]
      );

      this.allData = this.sortByOrder(
        this.tableSortOrder.mobSort.type,
        'mob',
        'number'
      );
    }
    if (type === 'designationSort') {
      this.tableSortOrder.designationSort.value += 1;
      this.tableSortOrder.designationSort = this.getSortingOrder(
        this.tableSortOrder.designationSort.value,
        Object.keys(this.tableSortOrder)[3]
      );

      this.allData = this.sortByOrder(
        this.tableSortOrder.designationSort.type,
        'designation',
        'string'
      );
    }
  }

  getSortingOrder(value: number, keyName: string): any {
    this.resetRestSortings(keyName);
    if (value === 1) {
      return { type: 'ascending', value: 1 };
    }
    if (value === 2) {
      return { type: 'descending', value: 2 };
    }
    if (value === 3) {
      return { type: '', value: 0 };
    }
  }

  resetRestSortings(currentResetItem: string) {
    Object.keys(this.tableSortOrder).forEach((item: any) => {
      if (currentResetItem !== item) {
        this.tableSortOrder[item].value = 0;
        this.tableSortOrder[item].type = '';
      }
    });
  }

  sortByOrder(type: string, keyName: string, dataType: string) {
    if (dataType === 'string') {
      if (type === 'ascending') {
        return this.allData.sort((a: any, b: any) => {
          const nameA = a[keyName].toUpperCase();
          const nameB = b[keyName].toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      } else if (type === 'descending') {
        return this.allData.sort((a: any, b: any) => {
          const nameA = a[keyName].toUpperCase();
          const nameB = b[keyName].toUpperCase();
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        });
      } else {
        return this.allDataDeepCopy.slice(
          (this.currentPage - 1) * this.dataPerPage,
          this.currentPage * this.dataPerPage
        );
      }
    }
    if (dataType === 'number') {
      if (type === 'ascending') {
        return this.allData.sort((a: any, b: any) => {
          return a[keyName] - b[keyName];
        });
      } else if (type === 'descending') {
        return this.allData.sort((a: any, b: any) => {
          return b[keyName] - a[keyName];
        });
      } else {
        return this.allDataDeepCopy.slice(
          (this.currentPage - 1) * this.dataPerPage,
          this.currentPage * this.dataPerPage
        );
      }
    }
  }

  deleteRow(id: any) {
    if (this.allData && this.allData.length > 1) {
      this.allData = this.allData.filter((item: any) => item.id !== id);
      this.allDataDeepCopy = this.allDataDeepCopy.filter(
        (item: any) => item.id !== id
      );
      this.allDataDeepCopy = this.allData.slice();
    }
  }
  addNewRow() {
    const found = this.allData.some(
      (el: any) =>
        el.name === this.newRowData.name || el.mob === this.newRowData.mob
    );
    if (!found) {
      this.allDataDeepCopy.push(this.newRowData);
      this._dataShareService.dataForPagination.next(this.allDataDeepCopy);
      this.allData = this.allDataDeepCopy.slice(
        (this.currentPage - 1) * this.dataPerPage,
        this.currentPage * this.dataPerPage
      );

      this.newRowData = {
        id: null,
        name: '',
        mob: '',
        designation: '',
      };
    }
  }

  isAllFieldsNotMapped(): boolean {
    let isAnyFieldNotMapped: boolean = true;
    this.newRowData.id = this.allDataDeepCopy.at(-1).id + 1;
    Object.keys(this.newRowData).forEach((key: any) => {
      if (
        this.newRowData['name'] !== '' &&
        this.newRowData['designation'] !== '' &&
        this.newRowData['mob'] !== null &&
        Number(this.newRowData['mob'].split('')[0]) > 5 &&
        this.newRowData['mob'].split('').length === 10
      ) {
        isAnyFieldNotMapped = false;
      }
    });
    return isAnyFieldNotMapped;
  }
}
