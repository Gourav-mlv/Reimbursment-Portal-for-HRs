import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LoginService} from '../login-component/login-component.service';
import {HttpClientModule} from '@angular/common/http';
@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  constructor(private router:Router,public loginservice: LoginService, http: HttpClientModule) { }

  ngOnInit() {
  }

  loginUser(e){
    e.preventDefault();
    console.log(e);
    let username = e.target.elements[0].value;
    let password = e.target.elements[1].value;

      this.loginservice.sendUser(username,password)
      .subscribe((res: Response) => {
        console.log(res);
        console.log("Checking your credentials");
        if(res["verification"]=="Verified"){
          console.log("You are verified, Directing you to Home-Page...");
          this.router.navigate(['home']);

        }
        else if(res["verification"]=="User not valid"){
          console.log("Invalid username ");
          this.router.navigate(['alert']);
          //window.location.reload();
        }
        else {
          console.log("Invalid password");
        }
      },
        error => {
          console.log(error, "error");
        })
      
      
   /*
    if(username == 'admin' && password =='admin'){
      this.router.navigate(['home']);
    }
    */
  }
}
