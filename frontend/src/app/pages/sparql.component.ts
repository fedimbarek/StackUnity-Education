import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-sparql',
  imports: [FormsModule],
  template: `
    <h2>Console SPARQL</h2>
    <p class="muted">Préfixes déjà déclarés : <code>: rdf: rdfs: owl: xsd:</code> · lecture seule (SELECT / ASK).</p>
    <div class="examples">
      @for (e of examples; track e.label) { <button class="ghost" (click)="query = e.q">{{ e.label }}</button> }
    </div>
    <textarea [(ngModel)]="query" rows="7"></textarea>
    <button (click)="run()">Exécuter</button>
    @if (error()) { <p class="err">{{ error() }}</p> }
    @if (vars().length) {
      <div class="card scroll">
        <table>
          <tr>@for (v of vars(); track v) { <th>{{ v }}</th> }</tr>
          @for (r of rows(); track $index) { <tr>@for (v of vars(); track v) { <td>{{ r[v] }}</td> }</tr> }
        </table>
      </div>
      <p class="muted">{{ rows().length }} résultat(s)</p>
    }`,
})
export class SparqlComponent {
  private api = inject(ApiService);
  vars = signal<string[]>([]); rows = signal<any[]>([]); error = signal('');
  examples = [
    { label: 'Enseignants et département',
      q: 'SELECT ?enseignant ?dep WHERE {\n  ?e a :Enseignant ; rdfs:label ?enseignant ;\n     :appartientADepartement ?d .\n  ?d rdfs:label ?dep\n}' },
    { label: 'Matières > 3 coefficient',
      q: 'SELECT ?matiere ?coef WHERE {\n  ?m a/rdfs:subClassOf* :Matiere ; rdfs:label ?matiere ; :coefficient ?coef .\n  FILTER(?coef > 3)\n} ORDER BY DESC(?coef)' },
    { label: 'Sous-classes de Club',
      q: 'SELECT ?classe WHERE { ?classe rdfs:subClassOf+ :Club }' },
  ];
  query = this.examples[0].q;

  run() {
    this.error.set('');
    this.api.sparql(this.query).subscribe({
      next: r => { this.vars.set(r.vars); this.rows.set(r.rows); },
      error: e => { this.error.set(e.error?.error ?? 'Erreur'); this.vars.set([]); },
    });
  }
}
