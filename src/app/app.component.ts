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
}
