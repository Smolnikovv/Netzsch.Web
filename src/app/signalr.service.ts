import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  constructor(private ngZone: NgZone) { 
    this.startConnection();
  }


  hubConnection:signalR.HubConnection | undefined;
  receivedText=new BehaviorSubject<string>('Output field');

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5016/signal', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .build();

    this.hubConnection
    .start()
    .then(() =>{
      console.log('Connected to Hub');
    })
    .catch((err: string) => console.log('Failed with connection' + err))
    this.outputListiner();
  }

  outputListiner = () => {
    this.hubConnection?.on("SendWpfInput", (data: any) =>{
      this.ngZone.run(() =>{
        this.receivedText.next(data);
      })     
    })
  }

  inputSender(value:string){
    this.hubConnection?.invoke("SendWebInput", value)
      .catch(err => console.log(err));
  }
}