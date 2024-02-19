import { Component } from '@angular/core';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'inventory-web';
  isLoggedIn: boolean = false;

  constructor(private sessionService: SessionService) {
    this.sessionService.authToken$.subscribe(x => this.isLoggedIn = x ? true : false)

  }
}
