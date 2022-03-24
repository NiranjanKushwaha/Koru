import { Component, ViewChild } from '@angular/core';
import { ContainerModalComponent } from './Components/container-modal/container-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {}
  @ViewChild('modal') private modal: ContainerModalComponent;

  openModal() {
    this.modal.open();
  }
}
