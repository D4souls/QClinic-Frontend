import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Application } from '@splinetool/runtime';
import { textValidator } from '../../shared/validators/text.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.css'
})
export class AssistantComponent implements OnInit{

  ngOnInit(): void {
    this.loadAssistant();
  }

  chatData = signal<any[]>([
    {
      role: "user",
      prompt: "Hi, im Sam!",
      date: "10:36"
    },
    {
      role: "assistant",
      prompt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae provident aspernatur animi reiciendis sit eligendi voluptates repudiandae cum maxime quod sint illum magni, beatae, voluptatem fugit atque incidunt quis accusantium!",
      date: "10:37"
    }
  ]);

  formAI = new FormGroup({
    prompt: new FormControl('', [Validators.required, textValidator])
  })

  currentTimeStamp() {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  askToAI(): void{
    
    const userPrompt = {
      role: "user",
      prompt: this.formAI.value.prompt,
      date: this.currentTimeStamp()
    }

    this.chatData.update((messages: any) => ([...messages, userPrompt]));

    // console.log(this.chatData());
    
  }

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

      chatAI!.classList.add('animate-expand-vertically');
      chatAI!.style.display = 'block';

      setTimeout(() => {
        canvas!.style.display = 'none';
      }, 500)



    }
  }

  closeChatBot(){
    const canvas = document.getElementById('canvas3d');
    const chatAI = document.getElementById('chatAI');

    if (canvas && chatAI) {

      chatAI!.classList.remove('animate-expand-vertically');
      chatAI!.classList.add('animate-contract-vertically');
      canvas!.style.display = 'block';
      
      setTimeout(() => {
        chatAI!.style.display = 'none';
      }, 500)
    }
  }
}
