import { Component, inject } from '@angular/core';
import { DialogService } from '../../services/DialogService.service';

@Component({
  selector: 'pop-up',
  imports: [],
  templateUrl: './PopUp.html',
})
export class PopUp {
dialogService = inject(DialogService);


}
