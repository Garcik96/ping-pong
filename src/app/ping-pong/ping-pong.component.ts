import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { Global } from '../app.component';
import { Pala } from './pala.model';
import { Pelota } from './pelota.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  titulo: string;
  mensaje: string;
}

@Component({
  selector: 'ping-pong-dialog',
  templateUrl: './ping-pong-dialog.component.html',
  styleUrls: ['./ping-pong.component.scss'],
})
export class PingPongDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

@Component({
  selector: 'ping-pong',
  templateUrl: './ping-pong.component.html',
  styleUrls: ['./ping-pong.component.scss'],
})
export class PingPongComponent implements OnInit {
  form: FormGroup;
  @ViewChild('pingpong', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D;
  interval = interval(20);
  intervalSubscribe: any;
  partidaIniciada: boolean = false;
  separacionPala: number = 50;
  anchoPala: number = 20;
  palaJugador1: Pala;
  palaJugador2: Pala;
  radioPelota: number = 15;
  pelota: Pelota;

  constructor(private formBuilder: FormBuilder, private global: Global, private matDialog: MatDialog) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = 1500;
    this.canvas.nativeElement.height = 1000;
    this.dibujarCampo();
    this.dibujarLineaCentral();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      jugador1: [null, Validators.required],
      jugador2: [null, Validators.required],
      tamPala: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
      velocidad: [null, [Validators.required, Validators.min(0), Validators.max(20)]],
    })
  }

  get jugador1(): any {
    return this.form.get('jugador1');
  }

  get jugador2(): any {
    return this.form.get('jugador2');
  }

  get tamPala(): any {
    return this.form.get('tamPala');
  }

  get velocidad(): any {
    return this.form.get('velocidad');
  }

  instruccionesPartida(): void {
    const dialog = this.matDialog.open(PingPongDialogComponent, {
      autoFocus: false,
      data: {
        titulo: 'Instrucciones del juego',
        mensaje: 'Se debe indicar tanto los nombres de los jugadores como el tamaño de las palas (mínimo 1 y máximo 10) y la velocidad (mínimo 1 y máximo 20).\nUna vez comience la partida los controles de la pala del jugador 1 (izquierda) serán las teclas W y S para bajar y subir respectivamente, mientras que los controles del jugador 2 (derecha) serán las flechas de arriba y abajo.\n\n¡Que gane el mejor!',
      },
    })
  }

  iniciarPartida(): void {
    if(this.form.valid) {
      this.partidaIniciada = true;
      this.form.disable();
      this.palaJugador1 = new Pala(this.separacionPala, this.canvas.nativeElement.height / 2 - (this.tamPala.value * 100 / 2), this.anchoPala, this.tamPala.value * 100);
      this.palaJugador2 = new Pala(this.canvas.nativeElement.width - (this.separacionPala + this.anchoPala), this.canvas.nativeElement.height / 2 - (this.tamPala.value * 100 / 2), this.anchoPala, this.tamPala.value * 100);
      this.pelota = new Pelota(this.canvas.nativeElement.width / 2, this.canvas.nativeElement.height / 2, this.radioPelota, this.velocidad.value, this.global);
      this.intervalSubscribe = this.interval.subscribe(() => {
        this.actualizarCampo();
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  terminarPartida(): void {
    this.intervalSubscribe.unsubscribe();

    let mensaje: string;

    if(this.global.puntuacionJugador1 > this.global.puntuacionJugador2) {
      mensaje = '¡El ganador del partido de ping-pong ha sido ' + this.jugador1.value + ' con un total de ' + this.global.puntuacionJugador1 + ' puntos!';
    } else if(this.global.puntuacionJugador2 > this.global.puntuacionJugador1) {
      mensaje = '¡El ganador del partido de ping-pong ha sido ' + this.jugador2.value + ' con un total de ' + this.global.puntuacionJugador2 + ' puntos!';
    } else {
      mensaje = '¡El partido de ping-pong ha terminado en tablas con una puntuación de ' + this.global.puntuacionJugador1 + '!';
    }

    const dialog = this.matDialog.open(PingPongDialogComponent, {
      autoFocus: false,
      data: {
        titulo: mensaje,
        mensaje: '',
      },
    })

    dialog.afterClosed().subscribe(() => {
      this.partidaIniciada = false;
      this.form = this.createForm();
      this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.dibujarCampo();
      this.dibujarLineaCentral();
      this.global.puntuacionJugador1 = 0;
      this.global.puntuacionJugador2 = 0;
    });
  }

  dibujarCampo(): void {
    this.context.fillStyle = '#EAECEE';
    this.context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  dibujarLineaCentral(): void {
    for (var i = 0; i <= this.canvas.nativeElement.height; i += 115) {
      this.context.fillStyle = '#263238';
      this.context.fillRect(this.canvas.nativeElement.width / 2 - 5, i, 10, 90);
    }
  }

  dibujarMarcador(): void {
    this.context.font = '30px Arial';

    const textJugador1 = this.context.measureText(this.jugador1.value + ': ' + this.global.puntuacionJugador1);
    this.context.fillText(this.jugador1.value + ': ' + this.global.puntuacionJugador1, this.canvas.nativeElement.width / 4 - textJugador1.width / 2, 50);

    const textJugador2 = this.context.measureText(this.jugador1.value + ': ' + this.global.puntuacionJugador2);
    this.context.fillText(this.jugador2.value + ': ' + this.global.puntuacionJugador2, (this.canvas.nativeElement.width - this.canvas.nativeElement.width / 4) - textJugador2.width / 2, 50);
  }

  @HostListener('document:keydown', ['$event'])
  actualizarPalas(event: KeyboardEvent) {
    if(this.partidaIniciada) {
      if(event.code === 'ArrowUp') {
        this.palaJugador2.actualizar('up', this.canvas);
      } else if(event.code === 'ArrowDown') {
        this.palaJugador2.actualizar('down', this.canvas);
      } else if(event.code === 'KeyW') {
        this.palaJugador1.actualizar('up', this.canvas);
      } else if(event.code === 'KeyS') {
        this.palaJugador1.actualizar('down', this.canvas);
      }
    }
  }

  actualizarCampo(): void {
    if(this.partidaIniciada) {
      this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.dibujarCampo();
      this.dibujarLineaCentral();
      this.dibujarMarcador();
      this.palaJugador1.dibujar(this.context);
      this.palaJugador2.dibujar(this.context);
      this.pelota.dibujar(this.context);
      this.pelota.actualizar(this.canvas, this.palaJugador1.getPosicionX(), this.palaJugador1.getPosicionY(), this.palaJugador1.getAncho(), this.palaJugador1.getAlto(), this.palaJugador2.getPosicionX(), this.palaJugador2.getPosicionY(), this.palaJugador2.getAncho(), this.palaJugador2.getAlto());
    }
  }
}