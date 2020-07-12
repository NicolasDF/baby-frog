import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

export class ExtendedFormGroup extends FormGroup {
  submitted = false;

  constructor(
    controls: { [ key: string ]: AbstractControl },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  getControl(controlName: string): FormControl {
    const control = this.get(controlName);

    if (!(control instanceof FormControl)) {
      return null;
    }

    return control;
  }

  getGroup(controlName: string): ExtendedFormGroup {
    const control = this.get(controlName);

    if (!(control instanceof ExtendedFormGroup)) {
      return null;
    }

    return control;
  }

}
