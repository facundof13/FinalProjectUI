import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-name-prompt',
  templateUrl: './name-prompt.component.html',
  styleUrls: ['./name-prompt.component.scss']
})
export class NamePromptComponent implements OnInit {
  form: FormGroup;
  success;
  error;

  constructor(
    public dialogRef: MatDialogRef<NamePromptComponent>,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.get('name').value);
    } else {
      this.form.markAllAsTouched();
    }
  }

}
