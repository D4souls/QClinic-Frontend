import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserDataComponent } from './user-data/user-data.component';

export const routes: Routes = [{ path: 'home', title: 'Home page', component: HomeComponent}, {path: 'user-data', title: 'Personal information', component: UserDataComponent}];
