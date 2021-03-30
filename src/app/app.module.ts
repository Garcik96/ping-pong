import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, Global } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PingPongModule } from './ping-pong/ping-pong.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PingPongModule
  ],
  providers: [Global],
  bootstrap: [AppComponent]
})
export class AppModule { }
