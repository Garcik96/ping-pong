import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PingPongComponent, PingPongDialogComponent } from './ping-pong.component';

@NgModule({
    declarations: [PingPongComponent, PingPongDialogComponent],
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
    exports: [PingPongComponent, PingPongDialogComponent]
})
export class PingPongModule {}