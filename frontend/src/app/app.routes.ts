
import { Routes } from '@angular/router';

// Authentification et autorisations
import { authGuard, accessGuard } from './core/auth';

// Pages principales
import { LoginComponent } from './pages/login.component';
import { HomeComponent } from './pages/home.component';
import { SchemaComponent } from './pages/schema.component';
import { SparqlComponent } from './pages/sparql.component';
import { AiComponent } from './pages/ai.component';
import { ScenarioComponent } from './pages/scenario.component';

// Modules métier
import { PersonnesComponent } from './features/personnes/personnes.component';
import { FormationsComponent } from './features/formations/formations.component';
import { MatieresComponent } from './features/matieres/matieres.component';
import { ClubsComponent } from './features/clubs/clubs.component';
import { OrganismesComponent } from './features/organismes/organismes.component';
import { EspacesComponent } from './features/espaces/espaces.component';
import { InscriptionsComponent } from './features/inscriptions/inscriptions.component';
import { BoursesComponent } from './features/bourses/bourses.component';
import { SanteComponent } from './features/sante/sante.component';
import { VieComponent } from './features/vie/vie.component';

// Assistant IA Dhia
import { AssistantComponent } from './features/assistant/assistant.component';

export const routes: Routes = [

  // Connexion
  {
    path: 'login',
    component: LoginComponent
  },

  // Dashboard général ou personnalisé selon le rôle
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },

  // Assistant IA NLP + SPARQL
  {
    path: 'assistant',
    component: AssistantComponent,
    canActivate: [authGuard]
  },

  // Gestion des personnes
  {
    path: 'personnes',
    component: PersonnesComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Gestion des formations
  {
    path: 'formations',
    component: FormationsComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Gestion des matières
  {
    path: 'matieres',
    component: MatieresComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Gestion des clubs
  {
    path: 'clubs',
    component: ClubsComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Gestion des organismes
  {
    path: 'organismes',
    component: OrganismesComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Gestion des espaces
  {
    path: 'espaces',
    component: EspacesComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Gestion des inscriptions
  {
    path: 'inscriptions',
    component: InscriptionsComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Gestion des bourses
  {
    path: 'bourses',
    component: BoursesComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Gestion de la santé
  {
    path: 'sante',
    component: SanteComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Gestion de la vie étudiante
  {
    path: 'vie',
    component: VieComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Propriétés de l'ontologie
  {
    path: 'proprietes',
    component: SchemaComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Requêtes SPARQL
  {
    path: 'sparql',
    component: SparqlComponent,
    canActivate: [authGuard, accessGuard]
  },

  // IA avancée des collègues
  {
    path: 'ia',
    component: AiComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Scénarios
  {
    path: 'scenario',
    component: ScenarioComponent,
    canActivate: [authGuard, accessGuard]
  },

  // Redirection pour les routes inconnues
  {
    path: '**',
    redirectTo: ''
  }

];
