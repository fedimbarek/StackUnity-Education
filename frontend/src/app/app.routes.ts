import { Routes } from '@angular/router';
import { authGuard } from './core/auth';
import { LoginComponent } from './pages/login.component';
import { DashboardComponent } from './pages/dashboard.component';
import { SchemaComponent } from './pages/schema.component';
import { SparqlComponent } from './pages/sparql.component';
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
import { AssistantComponent } from './features/assistant/assistant.component';

export const routes: Routes = [
  {
  path: 'assistant',
  component: AssistantComponent,
  canActivate: [authGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  // un composant par module métier (chacun a ses onglets / colonnes / formulaires)
  { path: 'personnes', component: PersonnesComponent, canActivate: [authGuard] },
  { path: 'formations', component: FormationsComponent, canActivate: [authGuard] },
  { path: 'matieres', component: MatieresComponent, canActivate: [authGuard] },
  { path: 'clubs', component: ClubsComponent, canActivate: [authGuard] },
  { path: 'organismes', component: OrganismesComponent, canActivate: [authGuard] },
  { path: 'espaces', component: EspacesComponent, canActivate: [authGuard] },
  { path: 'inscriptions', component: InscriptionsComponent, canActivate: [authGuard] },
  { path: 'bourses', component: BoursesComponent, canActivate: [authGuard] },
  { path: 'sante', component: SanteComponent, canActivate: [authGuard] },
  { path: 'vie', component: VieComponent, canActivate: [authGuard] },
  { path: 'proprietes', component: SchemaComponent, canActivate: [authGuard] },
  { path: 'sparql', component: SparqlComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
