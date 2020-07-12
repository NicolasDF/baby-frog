import { Component, OnInit } from '@angular/core';
import { ExtendedFormGroup } from '../../../shared/models/extended-form-group';
import { ExtendedFormControl } from '../../../shared/models/extended-form-control';
import { Validators } from '@angular/forms';

@Component({
  selector: 'bf-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  form: ExtendedFormGroup;

  constructor() { }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): ExtendedFormGroup {
    return new ExtendedFormGroup({
      fullName: new ExtendedFormControl(null, Validators.required),
      contactType: new ExtendedFormControl(null),
      email: new ExtendedFormControl(null),
      phone: new ExtendedFormControl(null),
      comments: new ExtendedFormControl(null)
    });
  }

}
