import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth';
import { HeroArtComponent } from '../shared/art.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, HeroArtComponent],
  template: `
    <div class="landing hero">
      <div class="landing-text">
        <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
          <polygon points="32,6 56,19 32,32 8,19" fill="#5aa9ff"/><polygon points="8,19 32,32 32,58 8,45" fill="#1a73f0"/><polygon points="32,32 56,19 56,45 32,58" fill="#0b4aa8"/>
        </svg>
        <h1>{{ signup() ? 'Créer un compte' : 'Connexion à StackUnity' }}</h1>
        <p class="lead">Consultez et modifiez l’ontologie de formation : personnes, formations, clubs, bourses et plus.</p>
        <div class="login">
          <input [(ngModel)]="username" placeholder="Nom d'utilisateur" />
          <input [(ngModel)]="password" type="password" placeholder="Mot de passe" (keyup.enter)="submit()" />
          @if (error()) { <p class="err">{{ error() }}</p> }
          <div class="cta">
            <button (click)="submit()">{{ signup() ? "S'inscrire" : 'Se connecter' }}</button>
            <button class="ghost" (click)="signup.set(!signup())">{{ signup() ? 'J’ai déjà un compte' : 'Créer un compte' }}</button>
          </div>
          <p class="muted small">Compte de démonstration : admin / admin123</p>
        </div>
      </div>
      <app-hero-art />
    </div>`,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  username = ''; password = '';
  signup = signal(false); error = signal('');

  submit() {
    const call = this.signup() ? this.auth.register(this.username, this.password)
                               : this.auth.login(this.username, this.password);
    call.subscribe({
      next: () => this.router.navigate(['/']),
      error: e => this.error.set(e.error?.error ?? 'Serveur injoignable (Flask lancé ?)'),
    });
  }
}
