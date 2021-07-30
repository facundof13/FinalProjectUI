import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public _room: RoomService,
  ) { }
  rooms;

  async ngOnInit() {
    this.rooms = await this.getRooms();

    setInterval(async () => {
      this.rooms = await this.getRooms();
    }, 10000)
  }

  async getRooms() {
    const rooms = await this._room.getRooms();
    rooms.forEach(room => {
      room.created_date = moment(room.created_date).format('MM-DD-YYYY LT');

      if ((room.host && !room.second_player) || (room.second_player && !room.host)) {
        room.needsOne = true;
      }
    });
    return rooms;
  }


}
