import { TestBed } from '@angular/core/testing';
import { FormArray, Validators } from '@angular/forms';
import { FormService } from './form.service';
import { ExtendedFormGroup } from '../models/extended-form-group';
import { ExtendedFormControl } from '../models/extended-form-control';

describe('FormService', () => {
  let service: FormService;
  let form: ExtendedFormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.get(FormService);
    form = new ExtendedFormGroup({
      fieldA: new ExtendedFormControl({ value: null, onSubmit: ['trim'] }, Validators.required),
      groupA: new ExtendedFormGroup({
        fieldB: new ExtendedFormControl(null),
        fieldC: new ExtendedFormControl(null)
      }),
      arrayA: new FormArray([
        new ExtendedFormGroup({
          fieldD: new ExtendedFormControl(null),
          fieldE: new ExtendedFormControl(null)
        })
      ])
    });
  });

  describe('should be able to pre-validate a form before submission', () => {
    let formGroup: ExtendedFormGroup;
    let formArray: FormArray;

    beforeEach(() => {
      formGroup = form.get('groupA') as ExtendedFormGroup;
      formArray = form.get('arrayA') as FormArray;
      spyOn(form, 'markAsPristine').and.callThrough();
    });

    describe('executing each control\'s onSubmit rules,', () => {
      let control: ExtendedFormControl;

      beforeEach(() => {
        control = form.getControl('fieldA') as ExtendedFormControl;
      });

      it('for "trim", should trim the control\'s value', () => {
        control.setValue('           mockValue           ');
        service.validate(form);
        expect(control.value).toBe('mockValue');
      });
    });

    it('marking it and every child form group as submitted', () => {
      service.validate(form);
      expect(form.submitted).toBe(true);
      expect(formGroup.submitted).toBe(true);
      expect((formArray.at(0) as ExtendedFormGroup).submitted).toBe(true);
    });

    it('not marking a form group as submitted if it is disabled', () => {
      formGroup.disable();
      formArray.at(0).disable();
      service.validate(form);
      expect(form.submitted).toBe(true);
      expect(formGroup.submitted).toBe(false);
      expect((formArray.at(0) as ExtendedFormGroup).submitted).toBe(false);
    });

    it('marking it as pristine if the form is invalid', () => {
      expect(service.validate(form)).toBe(false);
      expect(form.markAsPristine).toHaveBeenCalled();
    });

    it('returning true if the form is valid', () => {
      form.getControl('fieldA').setValue('mockValue');
      expect(service.validate(form)).toBe(true);
      expect(form.markAsPristine).not.toHaveBeenCalled();
    });

    it('returning true if the form is disabled', () => {
      form.disable();
      expect(service.validate(form)).toBe(true);
      expect(form.markAsPristine).not.toHaveBeenCalled();
    });

  });

  describe('should', () => {
    let formGroup: ExtendedFormGroup;
    beforeEach(() => {
      formGroup = form.get('groupA') as ExtendedFormGroup;
    });

    it('mark all child controls as dirty', () => {
      expect(formGroup.get('fieldB').dirty).toBe(false);
      expect(formGroup.get('fieldC').dirty).toBe(false);
      service.markFormAsDirty(formGroup);
      expect(formGroup.get('fieldB').dirty).toBe(true);
      expect(formGroup.get('fieldC').dirty).toBe(true);
    });
  });

});
