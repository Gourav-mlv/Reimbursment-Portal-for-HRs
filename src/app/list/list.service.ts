import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'




@Injectable()
export class ListService {
url7:string='http://localhost:3000/web/rej_rqst';

url6:string='http://localhost:3000/web/app_rqst';

url5:string='http://localhost:3000/web/pnd_rqst';

url4:string='http://localhost:3000/web/update_request';
url3:string='http://localhost:3000/web/selected_rqst?id=';
url2:string='http://localhost:3000/hello?imgname=';
url1:string='http://localhost:3000/web/all_rqst';
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

  getAll():Observable<any>{
     
  return this.http.get(this.url1);
  
}
getPending():Observable<any>{
     
  return this.http.get(this.url5);
  
}
getApproved():Observable<any>{
     
  return this.http.get(this.url6);
  
}
getRejected():Observable<any>{
     
  return this.http.get(this.url7);
  
}

  getImage(imgname:string):Observable<any>{
     
    return this.http.get(this.url2+imgname ,{responseType: 'text'});
    
  }
  getSelectedUser(id:number):Observable<any>{
     
    return this.http.get(this.url3+id);
    
  }

  updateStatus(id:number,sts:number):Observable<any>{
     
    return this.http.post(this.url4,{id,sts});
    
  }

}