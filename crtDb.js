//use this file to create database for once  only using command -->node crtDb.js


const mysql = require('mysql');


var con = mysql.createConnection({   //mysql connection creation
    host : "localhost",
    user:"root",
    password : "123456789"
});

con.connect((err,res)=>{    //queries to be run on connection
    if(err) throw err;
    console.log("Connection Established  \n" );

    var sql1 = 'CREATE DATABASE smtbill;';          //Query to create a database with specified name
     

    var sql2 = 'USE smtbill;';          //to ensure database is always choosen to specific one.
    
    var sql3 = `
    create table  login_table (        
        ID INT AUTO_INCREMENT,
        MOBILE_NUMBER VARCHAR(12) NOT NULL,    
        LOGIN_DATETIME DATETIME,
        LOGIN_RESPONSE VARCHAR(21844),
        VERIFY_STATUS BOOLEAN DEFAULT false,
        VERIFIED_DATETIME DATETIME,
        VERIFY_RESPONSE VARCHAR(21844),
        PRIMARY KEY(ID)
        );
    `;     

    var sql4 = `
    create table  admin_table(        
        USER_NAME VARCHAR(255),    
        PASSWORD VARCHAR(255) NOT NULL,
        PRIMARY KEY(USER_NAME)
        );
    `;
    
    var sql5 = `
    create table  emp_table(        
        EMP_ID VARCHAR(20) DEFAULT NULL,
	    ENAME VARCHAR(255) NOT NULL,
	    EMNO VARCHAR(13) NOT NULL,
	    EMAIL VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY(EMNO)
        );
    `;


    var sql6 =   `
        create table  requests_table (
             ID INT AUTO_INCREMENT,
             APPLICANT_NAME VARCHAR(255) NOT NULL,
             APPLICANT_MOBILE_NUMBER VARCHAR(12) NOT NULL,
             BILL_DATE DATE,
             BILL_COMPANY_NAME VARCHAR(255) DEFAULT NULL,
             REQUESTED_AMOUNT INT,
             IMAGE_NAME VARCHAR(31),
             CREATED_DATETIME DATETIME,
             VERIFY_STATUS tinyint DEFAULT 0,
             REQUEST_VERIFY_DATETIME DATETIME,
             VERIFY_COMMENT VARCHAR(10242),
             PRIMARY KEY(ID)
             );
        `;



    con.query(sql1,(err,result)=>{
        if(err) throw err;
        console,log(' smtbill Database Created ' );
        console.log(result);
    });


    con.query(sql2,(err,result)=>{
        if(err) throw err;

        con.push["database"]='smtbill';    // ==>  this is done here so that database can be added to 
                                             //   con JSON object after creation of database
        console.log(result);               
    });

    
    con.query(sql3,(err,result)=>{
        if(err) throw err;
        res.send('login_table created ');
        console.log(result);
    });

    con.query(sql4,(err,result)=>{
        if(err) throw err;
        res.send('admin_table created ');
        console.log(result);
    });
    

    con.query(sql5,(err,result)=>{
        if(err) throw err;
        res.send('emp_table created ');
        console.log(result);
    });

    con.query(sql4,(err,result)=>{
        if(err) throw err;
        res.send('requests_table created ');
        console.log(result);
    });

    
   
});