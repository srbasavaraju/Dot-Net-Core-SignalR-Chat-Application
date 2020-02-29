import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { SignalRService } from './services/signalr.services';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: ChatComponent, pathMatch: 'full' },
      { path: 'chat', component: ChatComponent }
    ])
  ],
  providers: [HubConnectionBuilder, SignalRService],
  bootstrap: [AppComponent]
})
export class AppModule { }
