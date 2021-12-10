import { createComponent } from '@angular/compiler/src/core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { CalbanComponent } from './components/calban/calban.component';
import { ColoresComponent } from './components/colores/colores.component';
import { CosechasComponent } from './components/cosechas/cosechas.component';
import { CreateCodebarComponent } from './components/create-codebar/create-codebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DevolucionComponent } from './components/devolucion/devolucion.component';
import { HaciendasComponent } from './components/haciendas/haciendas.component';
import { InformesComponent } from './components/informes/informes.component';
import { LoginComponent } from './components/login/login.component';
import { MotRecusadoComponent } from './components/mot-recusado/mot-recusado.component';
import { RecusadoComponent } from './components/recusado/recusado.component';

const routes: Routes = [
  { path: 'plagiarism',   component: InformesComponent },
  { path: 'spa',          component: CosechasComponent },
  { path: 'error_outline',component: RecusadoComponent },
  { path: 'motive',       component: MotRecusadoComponent },
  { path: 'rule',         component: DevolucionComponent },
  { path: 'gpp_good',     component: AuditoriaComponent },
  { path: 'receipt_long', component: CreateCodebarComponent },
  { path: 'date_range',   component: CalbanComponent },
  { path: 'water_drop',   component: ColoresComponent },
  { path: 'dash',         component: DashboardComponent },
  { path: 'wb_shade',     component: HaciendasComponent },
  { path: 'login',        component: LoginComponent, pathMatch: 'full' },
  { path: '**',           pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
