import { FormControl } from '@angular/forms';
import { ExtendedFormGroup } from './extended-form-group';

describe('ExtendedFormGroup', () => {
  let form: ExtendedFormGroup;

  beforeEach(() => {
    form = new ExtendedFormGroup({ fieldA: new FormControl(null) });
  });

  it('should have a "submitted" property set to false', () => {
    expect(form.submitted).toBe(false);
  });

  describe('should be able to get a FormControl of the FormGroup', () => {

    it('and return null if the control does not exist', () => {
      expect(form.getControl('fieldC')).toBeNull();
    });

    it('and return the control as an explicit FormControl', () => {
      expect(form.getControl('fieldA')).toBe(form.get('fieldA') as FormControl);
    });

  });

});
