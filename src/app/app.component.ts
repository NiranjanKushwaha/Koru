import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  @ViewChildren('inps') inps: QueryList<any>;
  isAllSelected: boolean = false;
  selectedCheckBoxes: any = [];
  allData: any = [];
  allDataDeepCopy: any = [];
  searchText: any;
  @ViewChildren('row') row: QueryList<any>;

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
  //------------------------------------------- checkboxes handling code goes here --------------------
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
  //------------------------------------------- deletion code goes here --------------------
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

  //------------------------------------------- sorting code goes here --------------------
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
        return this.allDataDeepCopy;
      }
    }
  }

  //------------------------------------------- Searching code goes here --------------------
  Search(data: any) {
    if (data.length) {
      console.log(data);
      let filteredData = [];
      filteredData = this.allDataDeepCopy.filter((item: any) => {
        if (
          item.name.toLowerCase().includes(data.toLowerCase()) ||
          item.description.toLowerCase().includes(data.toLowerCase()) ||
          item.webReference.toLowerCase().includes(data.toLowerCase())
        ) {
          return item;
        }
      });
      this.allData = filteredData;
    } else {
      this.allData = this.allDataDeepCopy;
    }
  }

  //------------------------------------------- Adding new fields code goes here --------------------
  newFieldsData: {
    id: number;
    name: string;
    description: string;
    webReference: string;
  } = {
    id: 0,
    name: '',
    description: '',
    webReference: '',
  };
  addNewData() {
    this.newFieldsData.id = this.allData.at(-1).id + 1;
    if (this.isAllFieldsFilled()) {
      const found = this.allDataDeepCopy.some(
        (el: any) => el.id === this.newFieldsData.id
      );
      if (!found) {
        this.allDataDeepCopy.push(this.newFieldsData);
        this.allData = this.allDataDeepCopy;
        this.scrollToView(this.newFieldsData.id);
      }

      this.clearAllFields();
    }
  }

  isAllFieldsFilled(): boolean {
    if (
      this.newFieldsData.name !== '' &&
      this.newFieldsData.description !== '' &&
      this.newFieldsData.webReference !== ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  scrollToView(currentItemIndex: number) {
    this.row.map((rw) => {
      if (parseInt(rw.nativeElement.id) + 1 === currentItemIndex) {
        rw.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  clearAllFields() {
    this.newFieldsData = {
      id: 0,
      name: '',
      description: '',
      webReference: '',
    };
  }
  //----------------------------- code for closing modal------------------------------------
  close() {
    this.clearAllFields();
  }
}
