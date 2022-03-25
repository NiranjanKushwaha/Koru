import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataShareService {
  constructor() {}
  searchData = new Subject<any>();
  filteredData = new Subject<any>();
  currentPage = new Subject<number>();
  dataForPagination = new Subject<any>();
}
