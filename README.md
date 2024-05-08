# Wymagania
Do uruchomienia aplikacji wymagany jest angular w wersji 17.3.6. Do poprawnego działania aplikacji wymagana jest uruchomiona instancja aplikacji z poniższego [linku](https://github.com/Smolnikovv/Netzsch.WPF/tree/master). Jeżeli aplikacja się nie uruchamia możliwe, że należy zainstalować obsługę signalR. W tym celu należy użyć komendy 
```
npm install @microsoft/signalr
```
# Najważniejsze fragmenty kodu
## signalr.service.ts
### Połączenie z hubem
```ts
constructor(private ngZone: NgZone) { 
    this.startConnection();
  }
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
```
Powyższy kod odpowiada za uruchomienie połączenie z hubem aplikacji odpowiadającym za dwustronną komunikację.
### outputListiner
```ts
 receivedText=new BehaviorSubject<string>('Output field');

 outputListiner = () => {
    this.hubConnection?.on("SendWpfInput", (data: any) =>{
      this.ngZone.run(() =>{
        this.receivedText.next(data);
      })     
    })
  }
```
Powyższy kod odpowiada za otrzymanie wartości z aplikacji WPF
### inputSender
```ts
inputSender(value:string){
    this.hubConnection?.invoke("SendWebInput", value)
      .catch(err => console.log(err));
  }
```
Powyższy kod odpowiada za wysłanie wartości do aplikacji WPF
## app.component.ts
### Połączenie z Hubem
```ts
ngOnInit(){
    this.signalrService.startConnection();
```
Powyższy kod odpowiada za połączenie z Hubem. 
### Otrzymywanie danych z WPFa
```ts
 paragraphText = "Output field";
signalrSubscription = new Subscription;
this.signalrService.outputListiner();
    this.signalrSubscription = this.signalrService.receivedText.subscribe((newText) => {
      this.paragraphText = newText; 
      console.log(this.paragraphText);
    });
```
Kod subskrybuje metodę outputListiner, otrzymującej dane z WPFa. W przypadku otrzymania danych zmieniana jest wartość zmiennej paragraphText, odpowiadającej za wyświetlenie wartości
### Wysłanie danych do WPFa
```ts
onInputChange(event: Event){
    const inputElement = event.target as HTMLInputElement;
    setTimeout(() => {
      this.signalrService.inputSender(inputElement.value);
    }, 500);
```
Metoda odpowiadająca za wysłanie danych do WPF. Dane zostają wysłane z 0,5 sekundowym opóźnieniem
