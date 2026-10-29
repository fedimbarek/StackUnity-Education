import { Routes } from '@angular/router';
<<<<<<< HEAD
import { authGuard, accessGuard } from './core/auth';
import { LoginComponent } from './pages/login.component';
import { HomeComponent } from './pages/home.component';
import { SchemaComponent } from './pages/schema.component';
import { SparqlComponent } from './pages/sparql.component';
import { AiComponent } from './pages/ai.component';
import { ScenarioComponent } from './pages/scenario.component';
=======
import { authGuard } from './core/auth';
import { LoginComponent } from './pages/login.component';
import { DashboardComponent } from './pages/dashboard.component';
import { SchemaComponent } from './pages/schema.component';
import { SparqlComponent } from './pages/sparql.component';
>>>>>>> origin/main
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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
<<<<<<< HEAD
  { path: '', component: HomeComponent, canActivate: [authGuard] },      // dashboard général (admin) ou personnel (selon le rôle)
  // un composant par module métier (chacun a ses onglets / colonnes / formulaires)
  { path: 'personnes', component: PersonnesComponent, canActivate: [authGuard, accessGuard] },
  { path: 'formations', component: FormationsComponent, canActivate: [authGuard, accessGuard] },
  { path: 'matieres', component: MatieresComponent, canActivate: [authGuard, accessGuard] },
  { path: 'clubs', component: ClubsComponent, canActivate: [authGuard, accessGuard] },
  { path: 'organismes', component: OrganismesComponent, canActivate: [authGuard, accessGuard] },
  { path: 'espaces', component: EspacesComponent, canActivate: [authGuard, accessGuard] },
  { path: 'inscriptions', component: InscriptionsComponent, canActivate: [authGuard, accessGuard] },
  { path: 'bourses', component: BoursesComponent, canActivate: [authGuard, accessGuard] },
  { path: 'sante', component: SanteComponent, canActivate: [authGuard, accessGuard] },
  { path: 'vie', component: VieComponent, canActivate: [authGuard, accessGuard] },
  { path: 'proprietes', component: SchemaComponent, canActivate: [authGuard, accessGuard] },
  { path: 'sparql', component: SparqlComponent, canActivate: [authGuard, accessGuard] },
  { path: 'ia', component: AiComponent, canActivate: [authGuard, accessGuard] },
  { path: 'scenario', component: ScenarioComponent, canActivate: [authGuard, accessGuard] },
=======
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
>>>>>>> origin/main
  { path: '**', redirectTo: '' },
];
