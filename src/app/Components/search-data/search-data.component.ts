import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataShareService } from 'src/app/services/data-share.service';

@Component({
  selector: 'search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.css'],
})
export class SearchDataComponent implements OnInit {
  constructor(private _dataShareService: DataShareService) {
    this._dataShareService.searchData.subscribe((res) => {
      if (res && res.length) {
        this.searchData = res;
        console.log('res is: ', res);
      }
    });
  }
  searchText: any;
  searchData: any;
  filterBy: string = 'Select Filter By';
  @Output() filteredOutput = new EventEmitter<any>();

  ngOnInit(): void {}
  Search(data: any) {
    if (data && data.length > 2) {
      if (this.filterBy) {
        let filteredData = [1, 2, 3];
        filteredData = this.searchData.filter((item: any) => {
          if (typeof item[this.filterBy] === 'string') {
            if (
              item[this.filterBy].toLowerCase().includes(data.toLowerCase())
            ) {
              return item;
            }
          } else {
            if (item[this.filterBy].toString().includes(data.toString())) {
              return item;
            }
          }
        });

        this.filteredOutput.emit(filteredData);
      }
    } else {
      this._dataShareService.filteredData.next(this.searchData);
    }
  }
}
