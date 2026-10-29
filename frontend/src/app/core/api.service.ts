import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from './auth';

export interface OClass { name: string; parent: string | null; count: number; label: string; comment: string; }
export interface Individual { id: string; label?: string; type?: string; cols?: Record<string, string>; }
export interface Prop { name: string; kind: 'object' | 'data'; domain: string | null; range: string | null; label: string; usage?: number; }
export interface Detail {
  id: string; label: string; types: string[];
  module?: string | null;
  properties: { property: string; value: string; node?: boolean }[];
  incoming: { source: string; property: string }[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  // --- transversal ---
  modules = () => this.http.get<any[]>(`${API}/modules`);
  stats = () => this.http.get<Record<string, number>>(`${API}/stats`);
  search = (q: string) => this.http.get<any[]>(`${API}/search`, { params: { q } });
  allIndividuals = () => this.http.get<Individual[]>(`${API}/individuals`);
  individual = (id: string) => this.http.get<Detail>(`${API}/individuals/${id}`);          // fiche globale (tous modules)
  individualsOf = (cls: string) => this.http.get<Individual[]>(`${API}/classes/${cls}/individuals`);
  allClasses = () => this.http.get<string[]>(`${API}/classes`);
  nlp = (question: string) =>
  this.http.post<{
    question: string;
    classe: string;
    intention: string;
    sparql: string;
    resultats: Record<string, string>[];
  }>(`${API}/nlp`, { question });
  sparql = (query: string) => this.http.post<{ vars: string[]; rows: any[] }>(`${API}/sparql`, { query });
  exportTtl = () => this.http.get(`${API}/export.ttl`, { responseType: 'blob' });
  // --- CRUD par module : /api/<module>/classes … /api/<module>/items … ---
  classes = (m: string) => this.http.get<OClass[]>(`${API}/${m}/classes`);
  createClass = (m: string, b: any) => this.http.post(`${API}/${m}/classes`, b);
  updateClass = (m: string, n: string, b: any) => this.http.put(`${API}/${m}/classes/${n}`, b);
  deleteClass = (m: string, n: string) => this.http.delete(`${API}/${m}/classes/${n}`);
  classProps = (m: string, n: string) => this.http.get<string[]>(`${API}/${m}/classes/${n}/properties`);
  items = (m: string, cls: string, columns: string[] = []) =>
    this.http.get<Individual[]>(`${API}/${m}/classes/${cls}/items`, { params: { columns: columns.join(',') } });
  item = (m: string, id: string) => this.http.get<Detail>(`${API}/${m}/items/${id}`);
  createItem = (m: string, b: any) => this.http.post(`${API}/${m}/items`, b);
  updateItem = (m: string, id: string, b: any) => this.http.put(`${API}/${m}/items/${id}`, b);
  deleteItem = (m: string, id: string) => this.http.delete(`${API}/${m}/items/${id}`);
  // --- CRUD des propriétés (module Schéma) ---
  props = () => this.http.get<Prop[]>(`${API}/properties`);
  createProp = (b: any) => this.http.post(`${API}/properties`, b);
  updateProp = (n: string, b: any) => this.http.put(`${API}/properties/${n}`, b);
  deleteProp = (n: string) => this.http.delete(`${API}/properties/${n}`);
}
