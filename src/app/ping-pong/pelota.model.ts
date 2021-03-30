import { ElementRef } from "@angular/core";
import { Global } from '../app.component';

export class Pelota {
  private radio: number;
  private posicionX: number;
  private posicionY: number;
  private direccionX: number;
  private direccionY: number;
  private velocidad: number;

  constructor(posicionX: number, posicionY: number, radio: number, velocidad: number, public global: Global) {
    this.posicionX = posicionX;
    this.posicionY = posicionY;
    this.radio = radio;
    this.velocidad = velocidad;
    const randomDireccionX = Math.floor(Math.random() * Math.floor(2));
    const randomDireccionY = Math.floor(Math.random() * Math.floor(2));
    if(randomDireccionX === 0) {
      this.direccionX = 1;
    } else {
      this.direccionX = -1;
    }
    if(randomDireccionY === 0) {
      this.direccionY = 1;
    } else {
      this.direccionY = -1;
    }
  }

  dibujar(context: CanvasRenderingContext2D): void { 
    context.fillStyle = '#5850EC';
    context.beginPath();
    context.arc(this.posicionX, this.posicionY, this.radio, 0, Math.PI * 2); // x y radio inicioAngulo finAngulo
    context.fill();
  }

  actualizar(canvas: ElementRef<HTMLCanvasElement>, jugador1PosicionX: number, jugador1PosicionY: number, jugador1Ancho: number, jugador1Alto: number, jugador2PosicionX: number, jugador2PosicionY: number, jugador2Ancho: number, jugador2Alto: number): void {
    if(this.posicionX + this.radio * 2 <= 0) {
      this.posicionX = canvas.nativeElement.width / 2 - this.radio;
      this.global.puntuacionJugador2++;
      this.direccionX = 1;
    }

    if(this.posicionX - this.radio >= canvas.nativeElement.width) {
      this.posicionX = canvas.nativeElement.width / 2 - this.radio;
      this.global.puntuacionJugador1++;
      this.direccionX = -1;
    }

    if(this.posicionY - this.radio <= 0) {
      this.direccionY = 1;
    }

    if(this.posicionY + this.radio >= canvas.nativeElement.height) {
      this.direccionY = -1;
    }

    if(this.posicionX - this.radio <= jugador1PosicionX + jugador1Ancho) {
      if(this.posicionY >= jugador1PosicionY && this.posicionY + this.radio <= jugador1PosicionY + jugador1Alto) {
        this.direccionX = 1;
      }
    }

    if(this.posicionX + this.radio >= jugador2PosicionX) {
      if(this.posicionY >= jugador2PosicionY && this.posicionY + this.radio <= jugador2PosicionY + jugador2Alto) {
        this.direccionX = -1;
      }
    }

    this.posicionX += this.direccionX * this.velocidad;
    this.posicionY += this.direccionY * this.velocidad;
  }
}