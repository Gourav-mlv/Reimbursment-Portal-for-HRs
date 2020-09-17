import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {LoginService} from '../app/login-component/login-component.service';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { HeaderComponentComponent } from './header-component/header-component.component';
import { HomeComponent } from './home/home.component';
import { RouterModule , Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {NgbdAlertBasic} from '../app/alert/alert';
import { ListComponent } from './list/list.component';
import { ListService } from './list/list.service';

const appRoutes: Routes = [
  {
      path:'',
      component: LoginComponentComponent
  },
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'alert',
    component: NgbdAlertBasic
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    HeaderComponentComponent,
    HomeComponent,
    NgbdAlertBasic,
    ListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    LoginService,
    ListService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
