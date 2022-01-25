import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ColorComponent } from './components/color/color.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EstatesComponent } from './components/estates/estates.component';
import { FallenComponent } from './components/fallen/fallen.component';
import { HarvestComponent } from './components/harvest/harvest.component';
import { LoginComponent } from './components/login/login.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { ModulesComponent } from './components/modules/modules.component';
import { QrGeneratorComponent } from './components/qr-generator/qr-generator.component';
import { ReturnsComponent } from './components/returns/returns.component';
import { AuthGuard } from './guards/auth.guard';
import { MaintenanceGuard } from './guards/maintenance.guard';

const routes: Routes = [
  { path: 'water_drop',               canActivate:[AuthGuard], component: DashboardComponent, children: [{path: "", component: ColorComponent, outlet: "home"}] },
  { path: 'date_range',               canActivate:[AuthGuard],component: DashboardComponent, children: [{path: "", component: CalendarComponent, outlet: "home"}] }, 
  { path: 'wb_shade',                 canActivate:[AuthGuard],component: DashboardComponent, children: [{path: "", component: EstatesComponent, outlet: "home"}] },
  { path: 'error_outline',            canActivate:[AuthGuard],component: DashboardComponent, children: [{path: "", component: FallenComponent, outlet: "home"}] }, 
  { path: 'error_outline/:code/:state',canActivate:[AuthGuard],component: DashboardComponent, children: [{path: "", component: FallenComponent, outlet: "home"}] }, 
  { path: 'receipt_long',             canActivate:[AuthGuard],component: DashboardComponent, children: [{path: "", component: QrGeneratorComponent, outlet: "home"}] },
  { path: 'rule',                     canActivate:[AuthGuard],component: DashboardComponent, children: [{path: "", component: ReturnsComponent, outlet: "home"}] },
  { path: 'rule/:code',               canActivate:[AuthGuard],component: DashboardComponent, children: [{path: "", component: ReturnsComponent, outlet: "home"}] },
  { path: 'spa',                      canActivate:[AuthGuard],component: DashboardComponent , children: [{path: "", component: HarvestComponent, outlet: "home"}] },
  { path: 'dashboard',                canActivate:[AuthGuard, MaintenanceGuard], component: DashboardComponent, children: [{path: "", component: ModulesComponent, outlet: "home"}] },
  { path: 'login',                    canActivate:[MaintenanceGuard], component: LoginComponent, pathMatch: 'full' },
  { path: "maintenance",               component: MaintenanceComponent },
  { path: "", pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
