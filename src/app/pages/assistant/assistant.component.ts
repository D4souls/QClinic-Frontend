import { Component, OnInit } from '@angular/core';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [],
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.css'
})
export class AssistantComponent implements OnInit{

  ngOnInit(): void {
    this.loadAssistant();
  }

  chatData: any = [];

  loadAssistant(): void {
    const canvas  = document.getElementById('canvas3d') as HTMLCanvasElement;
    const app = new Application(canvas);
    app
      .load('https://prod.spline.design/6jlAda9nH8-1nHnF/scene.splinecode');
  }

  showChatBot(){
    const canvas = document.getElementById('canvas3d');
    const chatAI = document.getElementById('chatAI');

    if (canvas && chatAI) {
      canvas!.style.display = 'none';
      chatAI!.style.display = 'block';
    }
  }
}
