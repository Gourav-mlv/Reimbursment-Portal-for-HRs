import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'




@Injectable()
export class LoginService {
 


 
  url:string='http://localhost:3000/web/chk';
  constructor(private http : HttpClient) { }

  
  sendUser(username:string,password:string):Observable<any> {
     // return this.http.post(this.url,{username,password});

     return new Observable(observer => {
        
        this.http.post(this.url, {usrNm:username,pwd:password}).subscribe(
            res => {
                observer.next(res);
            },
            err => {
                observer.error(err);
            }
        )
    });
   }

  
 
}