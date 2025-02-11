import { Component } from '@angular/core';
import { MenuNavigationComponent } from './components/menu-navigation/menu-navigation.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MenuNavigationComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'json';
}
