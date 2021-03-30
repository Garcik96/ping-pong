import { Component, Injectable } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ping-pong';
}

@Injectable()
export class Global {
  puntuacionJugador1: number = 0;
  puntuacionJugador2: number = 0;
}