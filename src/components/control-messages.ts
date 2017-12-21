import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../providers/validation-service';

@Component({
  selector: 'control-messages',
  template: `<div *ngIf="errorMessage !== null" style="color: red" >{{errorMessage}}</div>`
})
export class ControlMessages {
//   errorMessage: string;
  @Input() control: FormControl;
  constructor(public validateService: ValidationService) { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return this.validateService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    
    return null;
  }
}