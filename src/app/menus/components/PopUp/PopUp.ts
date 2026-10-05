import { Component, inject } from '@angular/core';
import { DialogService } from '../../services/DialogService.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'pop-up',
  imports: [NgClass],
  templateUrl: './PopUp.html',
})
export class PopUp {
dialogService = inject(DialogService);

get modal() {
    return this.dialogService.modalState();
  }

}
