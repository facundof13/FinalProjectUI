import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatService } from 'src/app/chat.service';

@Component({
  selector: 'app-win',
  templateUrl: './win.component.html',
  styleUrls: ['./win.component.scss']
})
export class WinComponent implements OnInit {
  winData;
  winName;
  socketId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<WinComponent>,
    private _chat: ChatService,
  ) {
    this.winData = data?.winId;
    this.socketId = data?.socketId;
  }

  async ngOnInit() {
    if (this.winData !== 'tie') {
      this.winName = await this._chat.getName(this.winData);
    }
  }

}
