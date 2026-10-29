
import { Component, computed, inject } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { AuthService } from './core/auth';
import { ApiService } from './core/api.service';
import { MODULES } from './core/modules';
import { canAccess, isFull } from './core/roles';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    @if (auth.user()) {
      <div class="shell">

        <!-- Menu latéral -->
        <aside class="side">

          <!-- Logo -->
          <strong class="brand">
            <svg
              viewBox="0 0 64 64"
              width="26"
              height="26"
              aria-hidden="true">

              <polygon
                points="32,6 56,19 32,32 8,19"
                fill="#5aa9ff" />

              <polygon
                points="8,19 32,32 32,58 8,45"
                fill="#1a73f0" />

              <polygon
                points="32,32 56,19 56,45 32,58"
                fill="#0b4aa8" />
            </svg>

            StackUnity
          </strong>

          <!-- Tableau de bord -->
          <a
            routerLink="/"
            routerLinkActive="on"
            [routerLinkActiveOptions]="{ exact: true }">

            <i class="dot"></i>
            {{ full() ? 'Tableau de bord' : 'Mon espace' }}
          </a>

          <!-- Modules métier -->
          @if (modules().length) {

            <small class="muted sec">Modules</small>

            @for (m of modules(); track m.id) {
              <a
                [routerLink]="'/' + m.id"
                routerLinkActive="on">

                <i class="dot"></i>
                {{ m.title }}
              </a>
            }
          }

          <!-- Schéma et IA avancée -->
          @if (full()) {

            <small class="muted sec">Schéma</small>

            <a
              routerLink="/proprietes"
              routerLinkActive="on">
              <i class="dot"></i>
              Propriétés
            </a>

            <a
              routerLink="/sparql"
              routerLinkActive="on">
              <i class="dot"></i>
              Console SPARQL
            </a>

            <small class="muted sec">Intelligence</small>

            <!-- IA avancée des collègues -->
            <a
              routerLink="/ia"
              routerLinkActive="on">
              <i class="dot"></i>
              Assistant IA avancé
            </a>

            <a
              routerLink="/scenario"
              routerLinkActive="on">
              <i class="dot"></i>
              Scénario Amira
            </a>
          }

          <!-- Assistant IA NLP Dhia -->
          <small class="muted sec">NLP & Sémantique</small>

          <a
            routerLink="/assistant"
            routerLinkActive="on">
            <i class="dot"></i>
            Assistant IA – Personnes & Organismes
          </a>

          <div class="grow"></div>

          <!-- Export ontologie réservé aux rôles complets -->
          @if (full()) {
            <button
              class="ghost"
              (click)="download()">
              Télécharger .ttl
            </button>
          }

          <!-- Utilisateur connecté -->
          <span class="muted userbox">

            {{ full() ? auth.user() : auth.name() }}

            @if (!full() && auth.profile()) {
              <small class="role-tag">
                {{ auth.profile() }}
              </small>
            }

            ·

            <a (click)="auth.logout()">
              Déconnexion
            </a>

          </span>

        </aside>

        <!-- Pages Angular -->
        <main>
          <router-outlet />
        </main>

      </div>

    } @else {

      <!-- Page de connexion -->
      <main class="bare">
        <router-outlet />
      </main>

    }
  `
})
export class AppComponent {

  // Services Angular
  auth = inject(AuthService);
  private api = inject(ApiService);

  // Vérification des droits
  full = computed(() =>
    isFull(this.auth.role())
  );

  // Modules autorisés selon le rôle
  modules = computed(() =>
    MODULES.filter(m =>
      canAccess(this.auth.role(), m.id)
    )
  );

  // Télécharger l'ontologie TTL
  download() {
    this.api.exportTtl().subscribe(blob => {

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'formation_.ttl';
      a.click();

      URL.revokeObjectURL(url);

    });
  }
}
