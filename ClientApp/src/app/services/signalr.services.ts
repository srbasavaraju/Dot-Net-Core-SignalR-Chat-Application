import { Injectable, Inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { User } from '../chat/User';

@Injectable()
export class SignalRService {
  private connection: HubConnection;
  constructor(private hubConnectionBuilder: HubConnectionBuilder,
    @Inject('BASE_URL') private baseUrl: string) { }

  connectToServer(user: User): HubConnection {
    if (this.connection) {
      this.connection.stop();
    }
    this.connection = this.hubConnectionBuilder.withUrl(`${this.baseUrl}chatHub?username=${user.name}`).build();
    this.connection.start().then(() => {
      console.log('Connected');
      if (user.isBBTUser) {
        this.connection.invoke('JoinGroup', 'BBT').catch(err => console.log('Error while Joining to group' + err));
      }
    }).catch(err => console.log('Error while connection' + err));
    return this.connection;
  }
}
