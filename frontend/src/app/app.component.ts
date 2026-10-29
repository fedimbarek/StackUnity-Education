import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth';
import { ApiService } from './core/api.service';
import { MODULES } from './core/modules';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    @if (auth.user()) {
      <div class="shell">
        <aside class="side">
          <strong class="brand">
            <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
              <polygon points="32,6 56,19 32,32 8,19" fill="#5aa9ff"/><polygon points="8,19 32,32 32,58 8,45" fill="#1a73f0"/><polygon points="32,32 56,19 56,45 32,58" fill="#0b4aa8"/>
            </svg>
            StackUnity
          </strong>
          <a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{exact:true}"><i class="dot"></i>Tableau de bord</a>
          <small class="muted sec">Modules</small>
          @for (m of modules; track m.id) { <a [routerLink]="'/' + m.id" routerLinkActive="on"><i class="dot"></i>{{ m.title }}</a> }
          <small class="muted sec">Intelligence Artificielle</small>

          <a routerLink="/assistant" routerLinkActive="on">
            <i class="dot"></i> ✦ Assistant IA
          </a>
          <small class="muted sec">Schéma</small>
          <a routerLink="/proprietes" routerLinkActive="on"><i class="dot"></i>Propriétés</a>
          <a routerLink="/sparql" routerLinkActive="on"><i class="dot"></i>Console SPARQL</a>
          <div class="grow"></div>
          <button class="ghost" (click)="download()">Télécharger .ttl</button>
          <span class="muted userbox">{{ auth.user() }} · <a (click)="auth.logout()">Déconnexion</a></span>
        </aside>
        <main><router-outlet /></main>
      </div>
    } @else { <main class="bare"><router-outlet /></main> }`,
})
export class AppComponent {
  auth = inject(AuthService);
  private api = inject(ApiService);
  modules = MODULES;
  download() {
    this.api.exportTtl().subscribe(b => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = 'formation_.ttl'; a.click(); URL.revokeObjectURL(a.href);
    });
  }
}
