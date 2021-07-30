import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { CreateRoomComponent } from './dialogs/create-room/create-room.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomComponent } from './room/room.component';
import { HomeComponent } from './home/home.component';
import { NamePromptComponent } from './dialogs/name-prompt/name-prompt.component';
import { AboutComponent } from './about/about.component';
import { WinComponent } from './dialogs/win/win.component';
@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    ChatComponent,
    CreateRoomComponent,
    RoomComponent,
    HomeComponent,
    NamePromptComponent,
    AboutComponent,
    WinComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
