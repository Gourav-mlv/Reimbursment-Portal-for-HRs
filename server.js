const mysql = require('mysql');
const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
var axios = require('axios');


const app = express();


app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));



app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});


//Remove #'s fill the credentials 


const s3 = new AWS.S3({
    accessKeyId: '###############',
    secretAccessKey: '##################'
});

app.get('/', (req, res) => {
    res.send("this is database for keeping track of logins");
});


app.get('/view', (req, res) => {
    let sql = 'select * from login_table '
    con.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});


app.post("/app/loginTried", (req, res) => {
    //to be filled by http request should be made changes if required
    //all the req.body.<field> should be same as in http request that will be sent , so keep that in mind

    let MobileNo = req.body.mno;
    let create_dt = new Date();
    let id;
    let sql = `INSERT INTO login_table(MOBILE_NUMBER,LOGIN_DATETIME) VALUES ?`;

    let values = [[MobileNo, create_dt]];
    con.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log('new login tried by ' + MobileNo);
        id = result.insertId;
        //id is generated in database itself so we have to send it to the client which then will be sent to us if login success
        console.log('new login id is ' + result.insertId);
    });


    axios.get(/*fill with the link for otp generation*/ )     //this has to be populated with service used for ottp verification.
        .then((response) => {
            console.log(response.data);
            res.status(200).json({ 'id': id  });
            upDb(id, response.data);
        }, (error) => {
            console.log(error);
        });

});

function upDb(id, serv) {
    let serv_resp_l = JSON.stringify(serv);

    //here id is required to fetch the correct record

    let sql = `UPDATE login_table SET LOGIN_RESPONSE = ?
      WHERE id = ?`;

    let values = [serv_resp_l, id];
    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log("login response saved successfully in db");
        console.log(result);
    });
};


app.post("/app/loginVerify", (req, res) => {

    //to be filled by http request , should be made changes if required
    //all the req.body.<field> should be same in http request that will be sent so keep that in mind


    let mod_date = new Date();
    let mno = req.body.mno;
    let otp = req.body.otp;
    let id = req.body.id_no;
    let serv_resp_v;
    let sts;
    let name ;

    //we have to configure it to able to behave properly with the otp service we are using.
    axios.post('link for otp service' + mno + ' and add ' + otp + 'parameters as query strings', {
        otp: otp
    })
        .then((response) => {
            console.log(response.data);
            serv_resp_v = response.data;
            if ((response.data["message"] == "OTP verified success") || (response.data["message"] == "Mobile no. already verified")) {
                sts = 1;
            } else {
                sts = 0;
            }

            let sql = `UPDATE login_table SET VERIFY_STATUS= ? , VERIFIED_DATETIME = ?,VERIFY_RESPONSE = ?
        WHERE id = ?`;

            let values = [sts, mod_date, JSON.stringify(serv_resp_v), id];
            con.query(sql, values, (err, result) => {
                if (err) throw err;
                console.log(result);
                console.log('login Success  : ' + id);
            });


            console.log(serv_resp_v);
            if(sts==1){
                let sql2 = `select ENAME FROM emp_table WHERE EMNO = ?`;

                let values2 = [mno];
                con.query(sql2, values2, (error, result2) => {
                 if (error) throw error;
                console.log(result2);
                if (result2[0] != undefined) {
                    name = result2[0] ;

                } else {
                    name = "New Employee" ;
                }

    });
            }
            res.status(200).send({name : name});  //check is it correct way to append id part to our response to be accessed in front end
            res.end();
        }, (error) => {
            console.log(error);
            res.status(200).send(error);
        });
    
});



app.post("/app/loginResend", (req, res) => {

    let mno = req.body.mno;
    axios.post('link for otp service' + mno + 'parameters as query strings', {
        mno: mno
    })
        .then((response) => {
            console.log(response);
            res.status(200).send("Request to resend acqired successfully");
        }, (error) => {
            console.log(error);
        });

});


app.post("/app/EmpData", (req, res) => {
    
    let empid = req.body.empid;
    let usrNm = req.body.usrNm;
    let mno = req.body.mno;
    let email = req.body.email;



    let sql = `insert into emp_table values(?,?,?,?)`;

    let values = [empid,usrNm,mno,email];
    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log("new Employee added " + usrNm + " added");
        console.log(result);

    });
});




app.post("/web/chk", (req, res) => {

    let usrNm = req.body.usrNm;
    let pwd = req.body.pwd;
    let sql = `select PASSWORD FROM admin_table WHERE USER_NAME = ?`;

    let values = [usrNm];
    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log("checked password for " + usrNm);

        if (result[0] != undefined) {
            if (result[0].PASSWORD == pwd) {
                res.status(200).send({ verification: 'Verified' });
            } else {
                res.status(200).send({ verification: 'Not Verified' });
            }
        } else {
            res.status(200).send({ verification: 'User not valid' });
        }

    });
});

app.post("/web/addAdmin", (req, res) => {
    let usrNm = req.body.usrNm;
    let pwd = req.body.pwd;


    let sql = `insert into admin_table values(?,?)`;

    let values = [usrNm];
    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log("new admin " + usrNm + " added");
        console.log(result);

    });
});


app.get("/web/no_all_rqst", (req, res) => {

    let sql = `select count(*) from requests_table  `;

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log("No. of All is" + result[0].count);
        res.status(200).send({ no_all_rqst: result[0].count });

    });
});


app.get("/web/no_pend_rqst", (req, res) => {

    let sql = `select count(*) from requests_table where VERIFY_STATUS = 0 `;

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log("no. of pending Requests is" + result[0].count);
        res.status(200).send({ no_pend_rqst: result[0].count });

    });
});

app.get("/web/aprv_rqst", (req, res) => {

    let sql = `select * from requests_table where VERIFY_STATUS = 1 `;

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.status(200).JSON(result);

    });
});

app.get("/web/rjt_rqst", (req, res) => {

    let sql = `select * from requests_table where VERIFY_STATUS = 2 `;

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.status(200).JSON(result);

    });
});

app.get("/web/all_rqst", (req, res) => {

    let sql = `select * from requests_table `;

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.status(200).JSON(result);
    });
});

app.get("/web/pnd_rqst", (req, res) => {

    let sql = `select * from requests_table where VERIFY_STATUS = 0 `;

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.status(200).JSON(result);

    });
});

app.post("/web/get_request", (req, res) => {

    let id = req.body.id;

    let sql = `select * from requests_table where id = ? `;
    let values = [id]

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result[0]));
        res.status(200).JSON(result[0]);

    });
});





app.post("/web/update_request", (req, res) => {

    let id = req.body.id;
    let sts = req.body.sts;
    let dt = new Date();

    let sql = `update requests_table set VERIFY_STATUS = ? REQUEST_VERIFY_DATETIME = ? where id = ? `;
    let values = [sts, dt, id]

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log("Updated status of  Request @" + id);
        res.status(200).send("ok");

    });
});

app.get("/web/bills_in_mnth", (req, res) => {

    let dt = new Date();

    let sql = `select count(*) from  requests_table where month(REQUEST_VERIFY_DATETIME) = month(?)  and year(REQUEST_VERIFY_DATETIME) = year(?)`;
    let values = [dt, dt]

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log("No. of  Request in Current Month is " + result[0].count);
        res.status(200).send({ no_of_bills: result[0].count });
    });
});

app.get("/web/amount_in_mnth", (req, res) => {

    let dt = new Date();

    let sql = `select sum(REQUESTED_AMOUNT) from  requests_table where month(REQUEST_VERIFY_DATETIME) = month(?)  and year(REQUEST_VERIFY_DATETIME) = year(?)`;
    let values = [dt, dt]

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log("Amount reimbursed in Current Month is " + result[0].sum(REQUESTED_AMOUNT));
        res.status(200).send({ no_of_bills: result[0].sum(REQUESTED_AMOUNT) });
    });
});

app.post("/web/fetch", (req, res) => {

    let imgNm = req.body.imgName;
    const params = {
        Bucket: 'aztecs',
        Key: imgNm
    };

    s3.getObject(params, function (err, data) {
        if (err) { console.log(err); }
        else {
            
        }
    })

});


app.post("/app/aprv_rqst", (req, res) => {
    let mno = req.body.mno;
    let sql = `select * from requests_table where VERIFY_STATUS = 1 AND APPLICANT_MOBILE_NUMBER = ?`;
    let values = [mno];
    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.status(200).JSON(result);

    });
});

app.post("/app/rjt_rqst", (req, res) => {
    let mno = req.body.mno;
    let values = [mno];
    let sql = `select * from requests_table where VERIFY_STATUS = 2 AND APPLICANT_MOBILE_NUMBER = ? `;

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.status(200).JSON(result);
    });
});

app.get("/app/all_rqst", (req, res) => {
    let mno = req.query.mno;    // fetching mobile no from url so we used req.query.mno
    let values = [mno];
    let sql = `select * from requests_table where  APPLICANT_MOBILE_NUMBER = ? `;

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result));
      
        res.send(JSON.stringify(result));
    });
});

app.post("/app/pnd_rqst", (req, res) => {
    let mno = req.body.mno;
    let values = [mno];
    let sql = `select * from requests_table where VERIFY_STATUS = 0  AND APPLICANT_MOBILE_NUMBER = ?`;

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.status(200).JSON(result);

    });
});

app.post("/app/get_request", (req, res) => {

    let id = req.body.id;
    let mno = req.body.mno;
    let sql = `select * from requests_table where id = ? AND APPLICANT_MOBILE_NUMBER = ?`;
    let values = [id,mno]

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result[0]));
        res.status(200).JSON(result[0]);

    });
});


app.post("/app/crt_rqst", (req, res) => {

    let name = req.body.name;
    let ph_no = req.body.phone;
    let amnt = req.body.bill_amount;
    amnt = amnt.replace ( /[^\d.]/g, '' );
    amnt = parseInt(amnt);
    let bill_date = req.body.bill_date;
    let bill_company = req.body.bill_company;
    let img = req.body.bill_image;
    img = img + ".png";

    let dt = new Date();

    let sql = `insert into requests_table (APPLICANT_NAME,APPLICANT_MOBILE_NUMBER, BILL_DATE,
        BILL_COMPANY_NAME,REQUESTED_AMOUNT,IMAGE_NAME,CREATED_DATETIME ) 
        VALUES(?,?,?,?,?,?,?)`;
    let values = [name, ph_no, bill_date, bill_company, amnt, img, dt]

    con.query(sql, values, (err, result) => {
        if (err) throw err;
        res.status(200).send({ 'id': result.insertId });
    });
});



app.post("/app/ImgUplod", (req, res) => {

    let imgNm = req.body.imgName;
    let imgDt = req.body.imageDt;

    const base64Data = new Buffer.from(imgDt.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    // Getting the file type, ie: jpeg, png or gif
    const type = imgDt.split(';')[0].split('/')[1];
    //let buf = new Buffer(imgDt, "base64");
    imgNm = imgNm + "." + type;
    const params = {
        Bucket: 'aztecs',
        Key: imgNm,
        Body: base64Data,
        ContentEncoding: "base64",
        ContentType: "image/${type}"
    };

    s3.upload(params, (err, data) => {
        if (err) { console.log(err) }
        console.log("Successful upload to S3 bucket \n");
        console.log(data);
        res.status(200).send(data);
    });
    
});


app.post("/app/extract", (req, res) => {

    let imgNm = req.body.imgName;
    imgNm = imgNm + ".txt";
    const params = {
        Bucket: 'aztecs',
        Key: imgNm
    };

    s3.getObject(params, function (err, data) {
        if (err) { console.log(err); }
        else {
            

            input = data.Body.toString();
            var result = {};
            input.split('"').forEach(function (value, i, arr) {
                if (i % 2 === 0) return;
                var key = arr[i - 1].trim().replace("=", "");
                result[key] = value;

            console.log(result) ;
            });
            res.status(200).send(result);
        }
    })

});




app.listen(3000, () => {                        //Express Server starts to listen for calls on port 3000
    console.log('Express server running @ port : 3000');
});




var con = mysql.createConnection({   //mysql connection creation
    host: "localhost",
    user: "root",                    //put your own parameter
    password: "1234",                 //put your own parameter
    database: 'smtbill'
});

con.connect((err, res) => {
    if (err) throw err;
    console.log("Connection Established  \n");

    /*
     //queries to be run on connection
    var sqle = `
    create table  login_table (        
        ID INT AUTO_INCREMENT,
        MOBILE_NUMBER VARCHAR(12) NOT NULL,    
        CREATED_DATETIME DATETIME,
        MODIFIED_DATETIME DATETIME,
        STATUS BOOLEAN DEFAULT false,
        RESPONSE VARCHAR(21844),
        PRIMARY KEY(ID)
        )
    `;
    con.query(sqle,(err,result)=>
    {
        if(err) throw err;
        console.log(result);
    })
    */



});
