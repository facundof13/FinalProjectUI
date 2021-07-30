import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RoomService } from 'src/app/room.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  form: FormGroup;
  success: string;
  error: string;

  constructor(
    public dialogRef: MatDialogRef<CreateRoomComponent>,
    private _room: RoomService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
  }

  async createRoom() {
    this.error = null;
    this.success = null;

    if (this.form.valid) {
      const body = { name: this.form.get('name').value };
      const id = await this._room.createRoom(body);

      if (id) {
        this.success = 'Successfully created room.';

        setTimeout(() => {
          this.dialogRef.close(id.id);
        }, 1500);
      } else {
        this.error = 'Error creating room.';
      }

    } else {
      this.form.markAllAsTouched();
    }
  }

}
