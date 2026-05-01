import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {

  router = inject(Router)

  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => event.url),
    map(
      (url) =>
        url.includes('login') ? 'Iniciar Sesión' : 'Registrarse'
    )
  );
}
