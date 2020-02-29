import { Component } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { SignalRService } from '../services/signalr.services';
import { User } from './User';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})

export class ChatComponent {
  private connection: HubConnection;
  private user = new User();
  whomToChat: string;
  users: User[] = [];
  message: string;
  messages = [];
  showChatBox = false;
  groupMessage: string;
  groupMessages = [];

  constructor(private signalrService: SignalRService) {
    this.initializeUsers();
    const currentUser = this.getUserNameFromUrl();
    if (currentUser) {
      const isBBTUser = this.updateUsers(currentUser);
      this.connection = this.signalrService.connectToServer(this.user);
      this.subscribeToChatMessage();
      if (isBBTUser) {
        this.subscribeToGroupChatMessage();
      }
    }
  }

  onSelection(whomToChat: string) {
    this.showChatBox = true;
    this.whomToChat = whomToChat;
  }

  sendGroupMessage() {
    if (this.user && this.groupMessage) {
      this.connection.invoke("SendGroupMessage", this.user.name, "BBT", this.groupMessage).catch(err => console.error(err.toString()));
    }
  }

  sendMessage() {
    if (this.user && this.message) {
      this.connection.invoke("SendMessage", this.user.name, this.whomToChat, this.message).catch(err => console.error(err.toString()));
    }
  }

  private updateUsers(currentUser: string) {
    const index = this.users.findIndex(u => u.name === currentUser);
    let userFound = new User();
    if (index > -1) {
      this.users.splice(index, 1);
      userFound = this.users[index];
      this.user.isBBTUser = true;
    }
    this.user.name = currentUser;
    return userFound ? userFound.isBBTUser : false;
  }

  private getUserNameFromUrl() {
    return new URLSearchParams(location.search).get('username');;
  }

  private subscribeToChatMessage() {
    this.connection.on("ReceiveMessage", (user, message) => {
      this.messages.push(`Message From ${user} ::  ${message}`)
    });
  }
  private subscribeToGroupChatMessage() {
    this.connection.on("ReceiveGroupMessage", (user, message) => {
      if (this.user.name !== user) {
        this.groupMessages.push(`Group Message BBT: From ${user} ::  ${message}`);
      }
    });
  }
  private initializeUsers() {
    this.users = [
      {
        isBBTUser: true,
        name: 'leonard'
      },
      {
        isBBTUser: true,
        name: 'penny'
      },
      {
        isBBTUser: true,
        name: 'howard'
      }, {
        isBBTUser: true,
        name: 'amy'
      },
      {
        isBBTUser: true,
        name: 'bernadette'
      }
    ]
  }
}
