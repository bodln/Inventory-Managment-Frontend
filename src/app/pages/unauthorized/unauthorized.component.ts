import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-unauthorized',
    imports: [RouterLink, MatIconModule],
    templateUrl: './unauthorized.component.html',
    styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

}
