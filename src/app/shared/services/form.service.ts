import { Injectable } from '@angular/core';
import { ExtendedFormGroup } from '../models/extended-form-group';
import * as _ from 'lodash';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  validate(form: ExtendedFormGroup): boolean {
    this.processSubmit(form);

    if (form.disabled) {
      return true;
    }

    if (form.invalid) {
      form.markAsPristine();
    }

    return form.valid;
  }

  markFormAsDirty(form: FormGroup): void {
    _.forOwn(form.controls, contractControl => {
      contractControl.markAsDirty();
    });
  }

  private processSubmit(form: ExtendedFormGroup): void {
    _.forOwn(form.controls, abstractControl => {

      if (abstractControl instanceof ExtendedFormGroup) {
        this.processSubmit(abstractControl);
      }

      if (abstractControl instanceof FormArray) {
        abstractControl.controls.forEach(formArrayItem => {
          if (formArrayItem instanceof ExtendedFormGroup) {
            this.processSubmit(formArrayItem);
          }
        });
      }

    });

    if (form.enabled) {
      form.submitted = true;
    }
  }

}
