import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
audio: any;
  constructor() { }


  playProfessorAudio(){
  if(!this.audio){this.audio = new Audio();}
    this.audio.src = "../../assets/light.mp3";
    this.audio.load();
    this.audio.play();
  }

  playStudentAudio(){
  if(!this.audio){this.audio = new Audio();}
    this.audio.src = "../../assets/all-eyes-on-me.mp3";
    this.audio.load();
    this.audio.play();
  }

  playSilentAudio(){
  if(!this.audio){this.audio = new Audio();}
    this.audio.src = "../../assets/1SecSilence.mp3";
    this.audio.load();
    this.audio.play();
  }

}
