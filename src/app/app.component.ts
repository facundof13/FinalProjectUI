import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateRoomComponent } from './dialogs/create-room/create-room.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() { }

  async createRoom() {
    const roomId = await this.dialog.open(CreateRoomComponent, {
      width: '300px',
      autoFocus: true,
    })
      .afterClosed()
      .toPromise<any>();

    if (roomId) {
      this.router.navigate(['/room', roomId], { relativeTo: this.route });
    }
  }
}
