import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AudioService {
	audio: any;

	private audioMuted;

	constructor() {
		this.audioMuted = false;
	}

	mute(): void {
		this.audioMuted = true;
	}

	unmute(): void {
		this.audioMuted = false;
	}

	get Muted(): boolean {
		return this.audioMuted;
	}

	get Unmuted(): boolean {
		return !(this.audioMuted);
	}

	toggleAudio(): void {
		this.audioMuted = !this.audioMuted;
	}

	private play(src: string): void {
		if (this.audioMuted) return;

		if (!this.audio) {
			this.audio = new Audio();
		}

		this.audio.src = src;
		this.audio.load();
		this.audio.play();
	}

	//notification sound for the professor view
	playProfessorAudio() {
		this.play("../../assets/light.mp3")
	}

	//notification sound for the student view
	playStudentAudio() {
		this.play("../../assets/all-eyes-on-me.mp3");
	}

	//plays the sound of silence
	playSilentAudio() {
		this.play("../../assets/1SecSilence.mp3")
	}
}
