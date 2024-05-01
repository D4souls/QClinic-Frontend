import { Component, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Application } from '@splinetool/runtime';
import { textValidator } from '../../shared/validators/text.validator';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.css'
})
export class AssistantComponent implements OnInit{

  constructor(
    private apiService: ApiService
  ){}

  ngOnInit(): void {
    this.loadAssistant();
    this
  }

  statusAIResponse = signal<boolean>(true);

  chatData = signal<any[]>([]);

  formAI = new FormGroup({
    prompt: new FormControl('', [Validators.required])
  })

  handleResize(){
    const textArea = document.querySelector('textarea');
    textArea!.style.height = 'auto';
    textArea!.style.height = textArea!.scrollHeight + 'px';

    // Handle border radius
    const lines = textArea!.value.split('\n').length;
    if (lines > 1) {
      textArea!.classList.remove('rounded-full');
      textArea!.classList.add('rounded-md');
    }

    if (lines <= 1) {
      textArea!.classList.add('rounded-full');
      textArea!.classList.remove('rounded-md');
    }
  }

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

    // Set status to show loading
    this.statusAIResponse.set(false);

    const userPrompt = {
      role: "user",
      prompt: this.formAI.value.prompt,
      date: this.currentTimeStamp()
    }
    
    this.chatData.update((messages: any) => ([...messages, userPrompt]));

    // Call asistant
    const dataToSend = {
      prompt: this.formAI.value.prompt
      // token: localStorage.getItem('token'),
    }
    
    // Reset form values
    this.formAI.reset();

    this.apiService.callAssistant(dataToSend).subscribe((responseAI: any) => {
      if (responseAI.status == 200){
        
        // Create new object
        const aiRole = {
          role: "assistant",
          prompt: responseAI.data.response,
          date: responseAI.data.created
        }

        // Add to chatData
        this.chatData.update((messages: any) => ([...messages, aiRole]));

        // Set status to show loading
        this.statusAIResponse.set(true);

      } else {

        // Create new object
        const aiRole = {
          role: "assistant",
          prompt: "Ups... An error ocurred while asking to the AI",
          date: this.currentTimeStamp()
        }

        // Add to chatData
        this.chatData.update((messages: any) => ([...messages, aiRole]));

        // Set status to show loading
        this.statusAIResponse.set(true);

      }
    })
    
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

  clearChat(){
    this.chatData = signal<any[]>([]);
  }
}
