import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { USERS } from './mock-users';
import {ListService} from '../list/list.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  
  userData=null;
  selecteduserData=null;
  public arr:any[]; 
  imagename:string;
  id:number;
  stsA=1;
  stsR=2;
  public imgsrc:any;
  constructor( public listservice:ListService) { }

  ngOnInit() {
  }

 


  getAllUsers(){
    console.log("action done");
    try {
      this.listservice.getAll()
        .subscribe((res: Response) => {
          console.log(res[0]);
         this.userData=res;
         
        },
          error => {
            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  getPendingUsers(){
    console.log("action done");
    try {
      this.listservice.getPending()
        .subscribe((res: Response) => {
          console.log(res[0]);
         this.userData=res;
         
        },
          error => {
            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }
  getApprovedUsers(){
    console.log("action done");
    try {
      this.listservice.getApproved()
        .subscribe((res: Response) => {
          console.log(res[0]);
         this.userData=res;
         
        },
          error => {
            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }
  getRejectedUsers(){
    console.log("action done");
    try {
      this.listservice.getRejected()
        .subscribe((res: Response) => {
          console.log(res[0]);
         this.userData=res;
         
        },
          error => {
            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  showSelectedUserData(id){
    console.log("Showing data for selected user ");
    try {
      this.listservice.getSelectedUser(id)
        .subscribe((res: Response) => {
          this.selecteduserData=res;
          console.log(res);
         
        },
          error => {
            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

 showSelectedUserImage(imgname){ console.log("Showing Image for selected user ");
 try {
   this.listservice.getImage(imgname)
     .subscribe((res: Response) => {
      this.imgsrc=res;
       
      
     },
       error => {
         console.log(error, "error in handling res");
       })
 } catch (e) {
   console.log(e);
 }}

 approve(id,stsA){ console.log("Approving invoice for the selected user ");
 try {

   this.listservice.updateStatus(id,stsA)
     .subscribe((res: Response) => {
         console.log(res);
       
      
     },
       error => {
         console.log(error, "error in handling res");
       })
 } catch (e) {
   console.log(e);
 }}
 reject(id,stsR){ console.log("Approving invoice for the selected user ");
 try {

   this.listservice.updateStatus(id,stsR)
     .subscribe((res: Response) => {
         console.log(res);
       
      
     },
       error => {
         console.log(error, "error in handling res");
       })
 } catch (e) {
   console.log(e);
 }}


}

   


