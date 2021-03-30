import { ElementRef } from "@angular/core";

export class Pala {
  ancho: number;
  alto: number;
  posicionX: number;
  posicionY: number;
  direccionY: number;
  velocidad: number = 50;

  constructor(posicionX: number, posicionY: number, ancho: number, alto: number) {
    this.posicionX = posicionX;
    this.posicionY = posicionY;
    this.ancho = ancho;
    this.alto = alto;
  }

  dibujar(context: CanvasRenderingContext2D): void {
    context.fillStyle = '#263238';
    context.fillRect(this.posicionX, this.posicionY, this.ancho, this.alto);
  }

  actualizar(key: string, canvas: ElementRef<HTMLCanvasElement>): void {
    if(key === 'up') {
      this.direccionY = -1;
      if(this.posicionY <= 0) {
        this.direccionY = 0;
      }
    } else if(key === 'down') {
      this.direccionY = 1;
      if(this.posicionY + this.alto >= canvas.nativeElement.height) {
        this.direccionY = 0;
      }
    }
    this.posicionY += this.direccionY * this.velocidad;
  }

  getAlto(): number {
    return this.alto;
  }

  getAncho(): number {
    return this.ancho;
  }

  getPosicionX(): number {
    return this.posicionX;
  }

  getPosicionY(): number {
    return this.posicionY;
  }
}