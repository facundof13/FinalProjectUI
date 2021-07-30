import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('scroll') private scroll: ElementRef;
  @Input() messages: any;
  @Input() roomId: any;
  @Input() chosenName: any;
  @Input() typingIds: any;
  @Output() messageSent = new EventEmitter();
  form: FormGroup;

  isTyping: boolean;

  constructor(
    private _chat: ChatService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.form = new FormGroup({
      message: new FormControl(null, Validators.required),
    });

    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.form.valid) {
      const message = this.form.get('message').value;

      const emitData = {
        event: 'message sent',
        message
      };

      this.messageSent.emit(emitData);

      this.form.reset();
    }
  }

  scrollToBottom() {
    try {
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    } catch (err) { }
  }

  checkTyping() {
    if (this.isTyping) {
      return;
    } else if (this.form.get('message').value) {
      this.isTyping = true;
      this.typingIndicatorOn();
    }
  }

  typingIndicatorOn() {
    const emitData: any = { event: 'started typing'};
    this.messageSent.emit(emitData);

    const sub = this.form.get('message')
      .valueChanges.subscribe((val) => {
        if (val === '' || !val) {
          emitData.event = 'stopped typing';
          this.messageSent.emit(emitData);
          this.isTyping = false;

          sub.unsubscribe();
          return;
        }
      });

  }

}
