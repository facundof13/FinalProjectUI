import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { BoardService } from '../board.service';
import { ChatService } from '../chat.service';
import { NamePromptComponent } from '../dialogs/name-prompt/name-prompt.component';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  socketId;
  socket;
  roomId;
  chosenName;
  typingIds = [];

  messages;
  roomDetails: any;

  boardObj;
  isCurrentTurn;
  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private _chat: ChatService,
    private _room: RoomService,
    private _board: BoardService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.isLoading = true;
    this.roomId = Number(this.route?.snapshot?.params?.id);

    try {
      this.roomDetails = await this._room.getRoomDetails(this.roomId);
    } catch (err) {
      this.router.navigate(['/']);
      return;
    }

    this.socketId = sessionStorage.getItem('socketId');

    this.messages = await this.getNewMessages();
    await this.getBoard();

    this.handleSockets();
    this.chosenName = (await this._chat.getName(this.socketId))?.name;
    if (!this.chosenName) {
      const name = await this.dialog.open(NamePromptComponent, {
        disableClose: true,
        autoFocus: false,
        width: '25%',
      })
        .afterClosed()
        .toPromise<any>();

      if (name) {
        const body = { name, socket_id: this.socketId };
        await this._chat.updateName(body);

        this.socket.disconnect();

        await this.ngOnInit();
      }
    }

    if (this.chosenName) {
      this.isLoading = false;
    } else {
      await this.ngOnInit();
    }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  handleSockets() {
    this.socket = io(environment.apiUrl, {
      query: {
        roomId: this.roomId,
        socketId: this.socketId,
      }
    });

    this.socket.on('id', (id) => {
      if (!this.socketId) {
        this.socketId = id;
        sessionStorage.setItem('socketId', id);
      }
    });

    this.socket.on('message received', async () => {
      await this.getNewMessages();
    });

    this.socket.on('refresh board', async () => {
      await this.getBoard();
    });

    this.socket.on('started typing', (typingId) => {
      this.typingIds.push(typingId);
    });

    this.socket.on('stopped typing', (typingId) => {
      this.typingIds = this.typingIds.filter(i => i !== typingId);
    });
  }

  async messageSent(emitData) {
    switch (emitData.event) {
      case 'message sent':
        await this._chat.postMessage(this.roomId, this.socketId, emitData.message);
        this.socket.emit('message sent');
        break;
      case 'started typing':
      case 'stopped typing':
        this.socket.emit(emitData.event);
        break;
    }
  }

  async getNewMessages() {
    const messages = await this._chat.getExistingMessages(this.roomId);
    messages.forEach(message => {
      message.time = moment(message.time).fromNow();
    });
    this.messages = messages;
  }

  socketEmitter(evt) {
    this.socket.emit(evt);
  }

  async getBoard() {
    this.boardObj = await this._board.getBoard(this.roomId);
  }
}