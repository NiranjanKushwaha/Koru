import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataShareService } from 'src/app/services/data-share.service';
@Component({
  selector: 'koru-table',
  templateUrl: './koru-table.component.html',
  styleUrls: ['./koru-table.component.css'],
})
// export interface DataType {
//   id: number;
//   name: string;
//   mob: number;
//   designation:string
// }
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
  ngOnInit(): void {
    this.http.get('../../../assets/data.json').subscribe((res) => {
      this.allData = res;
      console.log(res);
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

      console.log(this.tableSortOrder.idSort);
    }
    if (type === 'nameSort') {
      this.tableSortOrder.nameSort.value += 1;
      this.tableSortOrder.nameSort = this.getSortingOrder(
        this.tableSortOrder.nameSort.value,
        Object.keys(this.tableSortOrder)[1]
      );
    }
    if (type === 'mobSort') {
      this.tableSortOrder.mobSort.value += 1;
      this.tableSortOrder.mobSort = this.getSortingOrder(
        this.tableSortOrder.mobSort.value,
        Object.keys(this.tableSortOrder)[2]
      );
    }
    if (type === 'designationSort') {
      this.tableSortOrder.designationSort.value += 1;
      this.tableSortOrder.designationSort = this.getSortingOrder(
        this.tableSortOrder.designationSort.value,
        Object.keys(this.tableSortOrder)[3]
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

  handleFilteredData(data: any) {
    this.allData = data;
  }
}
