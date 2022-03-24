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
        this.allData = res;
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
  allDataDeepCopy: Array<any> = [];
  shouldAddNewField: boolean = false;
  newRowData = {
    id: null,
    name: '',
    mob: '',
    designation: '',
    isLast: true,
  };
  ngOnInit(): void {
    this.http.get('../../../assets/data.json').subscribe((res) => {
      this.allData = res;
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

    let lastItem = this.allData.at(-1);
    this.allData.map((el: any, index: number) => {
      if (el.id === lastItem.id) {
        el.isLast = true;
      } else {
        el.isLast = false;
      }
    });
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
        return this.allDataDeepCopy;
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
        return this.allDataDeepCopy;
      }
    }
  }

  handleFilteredData(data: any) {
    this.allData = data;
  }

  deleteRow(id: any) {
    if (this.allData && this.allData.length > 1) {
      this.allData = this.allData.filter((item: any) => item.id !== id);
      this.allDataDeepCopy = this.allDataDeepCopy.filter(
        (item: any) => item.id !== id
      );
      this.allData.at(-1).isLast = true;
      this.allDataDeepCopy = this.allData.slice();
    }
  }
  addNewRow() {
    const found = this.allData.some((el: any) => el.id === this.newRowData.id);
    if (!found) {
      this.allData.push(this.newRowData);
      this.allData.map((item: any) => {
        if (item.id === this.newRowData.id) {
          item.isLast = true;
        } else {
          item.isLast = false;
        }
      });

      this.newRowData = {
        id: null,
        name: '',
        mob: '',
        designation: '',
        isLast: true,
      };
    }
  }

  isAllFieldsNotMapped(): boolean {
    let isAnyFieldNotMapped: boolean = true;
    this.newRowData.id = this.allData.length + 1;
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
