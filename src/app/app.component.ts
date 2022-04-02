import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewChild,
  OnInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { ContainerModalComponent } from './Components/container-modal/container-modal.component';
import { DataShareService } from './services/data-share.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private _dataShareService: DataShareService
  ) {}

  @ViewChildren('inps') inps: QueryList<any>;
  isAllSelected: boolean = false;
  selectedCheckBoxes: any = [];
  allData: any = [];
  allDataDeepCopy: any = [];
  getAllData(): Observable<any[]> {
    return this.http
      .get<any>('../../../assets/data.json')
      .pipe(map((response) => response));
  }
  ngOnInit(): void {
    this.getAllData().subscribe((res: any) => {
      this.allData = res.data;
      this.allDataDeepCopy = res.data;
    });
  }

  handleAllCheckboxes(data: any) {
    console.log(data.target.checked);
    this.isAllSelected = data.target.checked;
    this.selectedCheckBoxes = [];
    if (this.isAllSelected) {
      this.inps.map((inputbox: any) => {
        inputbox.nativeElement.checked = true;
        this.selectedCheckBoxes.push({
          id: parseInt(inputbox.nativeElement.id),
        });
      });
    } else {
      this.inps.map((inputbox, id) => {
        inputbox.nativeElement.checked = false;
      });
    }
  }

  handleSingleCheckbox(event: any, checkboxId: number) {
    const found = this.selectedCheckBoxes.some(
      (checkbox: any) => checkbox.id === checkboxId
    );
    if (!found && event.target.checked) {
      this.selectedCheckBoxes.push({
        id: checkboxId,
      });
    } else if (found && !event.target.checked) {
      this.selectedCheckBoxes = this.selectedCheckBoxes.filter(
        (checkbox: any) => checkbox.id !== checkboxId
      );
    }
    this.selectedCheckBoxes.sort((a: any, b: any) => a.id - b.id);
  }

  handleDelete() {
    this.allData = this.allData.filter((item: any) => {
      let temp = this.selectedCheckBoxes.some((checkbox: any) => {
        if (item.id === checkbox.id) {
          return item;
        }
      });
      if (!temp) {
        return item;
      }
    });
  }

  // sorting code goes here
  tableSortOrder: any = {
    webReferenceSort: { type: '', value: 0 },
    nameSort: { type: '', value: 0 },
    descriptionSort: { type: '', value: 0 },
  };
  sort(type: string) {
    console.log(type);
    if (type === 'webReferenceSort') {
      this.tableSortOrder.webReferenceSort.value += 1;
      this.tableSortOrder.webReferenceSort = this.getSortingOrder(
        this.tableSortOrder.webReferenceSort.value,
        Object.keys(this.tableSortOrder)[0]
      );
      this.allData = this.sortByOrder(
        this.tableSortOrder.webReferenceSort.type,
        'webReference',
        'string'
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
    if (type === 'descriptionSort') {
      this.tableSortOrder.descriptionSort.value += 1;
      this.tableSortOrder.descriptionSort = this.getSortingOrder(
        this.tableSortOrder.descriptionSort.value,
        Object.keys(this.tableSortOrder)[2]
      );

      this.allData = this.sortByOrder(
        this.tableSortOrder.descriptionSort.type,
        'description',
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
        // return this.allDataDeepCopy.slice(
        //   (this.currentPage - 1) * this.dataPerPage,
        //   this.currentPage * this.dataPerPage
        // );
        return this.allDataDeepCopy;
      }
    }
  }
}
