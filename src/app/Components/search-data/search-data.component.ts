import { Component, Input, OnInit } from '@angular/core';
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

  ngOnInit(): void {}
  Search(data: any) {
    console.log('filter by: ', this.filterBy);
    if (this.filterBy) {
      // let filteredData=this.searchData.filter(item=>{
      //    if(item.name.includes(data) || item.)
      // })
    }
  }
}
