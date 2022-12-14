import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path:"",
    component:DashboardComponent,
    canActivate:[AuthGuard]
  },
  {
    path: "login",
    component:LoginComponent
  },
  {
    path:"signup",
    component:SignupComponent
  },
  {
    path: "profile",
    component:ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"**",
    redirectTo:""
  }
];

@NgModule({
  imports: [
    BrowserModule,
    AuthModule,
    HttpClientModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
