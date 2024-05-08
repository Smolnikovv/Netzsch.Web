import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalrService } from './signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'NetzschWeb';
  paragraphText = "Output field";
  signalrSubscription = new Subscription;

  constructor(
    public signalrService:SignalrService
  )
  {}
  ngOnDestroy(): void {
    this.signalrService.hubConnection?.off("");
  }

  ngOnInit(){
    this.signalrService.startConnection();
    this.signalrService.outputListiner();
    this.signalrSubscription = this.signalrService.receivedText.subscribe((newText) => {
      this.paragraphText = newText; 
      console.log(this.paragraphText);
    });
  }

  onInputChange(event: Event){
    const inputElement = event.target as HTMLInputElement;
    setTimeout(() => {
      this.signalrService.inputSender(inputElement.value);
    }, 500);
   
  }
  
}

