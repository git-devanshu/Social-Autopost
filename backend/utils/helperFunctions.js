const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service : 'Gmail',
    secure : false,
    auth : {
        user : process.env.USER,
        pass : process.env.PASS
    }
});

const sendSignupMail = (emailid, name)=>{
    try{
        const info = transporter.sendMail({
            from : process.env.USER,
            to : emailid,
            subject : 'Registration Successful',
            text : `
Dear ${name},
Your registration at Social Autopost is successful.
You can now post automatically to your social media handles of Instagram, Facebook, X (Twitter) and LinkedIn.

Thankyou...
Team Social Autopost`
        });
        console.log("Signup email sent to : ", name);
    }
    catch(error){
        console.log("Error sending signup email", error);
    }
};

const sendVFCodeMail = (emailid, vfcode)=>{
    try{
        const info = transporter.sendMail({
            from : process.env.USER,
            to : emailid,
            subject : 'Reset Password',
            text : `
Verification Code : ${vfcode}

A request to reset your Social Autopost account password was received.
This is your one time verification code to set a new password.

In case its not you, do not share this code with anyone else.

Thankyou...
Team Social Autopost`
        });
        console.log("Verification code email sent");
    }
    catch(error){
        console.log("Error sending signup email", error);
    }
}

const generateVerificationCode = (size) =>{
    let code = '';
    const characters = '0123456789';
    for (let i = 0; i < size; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

//function to get the current date in different formats
/*
type values : 
1 - DD-MM-YYYY
2 - DD M_name, YYYY
3 - D_name DD M_name, YYYY
4 - YYYY
5 - hh:mm
else - YYYY-MM-DD
*/
function getCurrentDate(type){
    const date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth();
    var m_name = date.toLocaleString('default', {month : 'long'});
    var yy = date.getFullYear();
    var d_name = date.toLocaleString('default', {weekday : 'long'});
    var h = date.getHours();
    var min = date.getMinutes();

    if(type === 1){
        return dd + '-' + (mm+1) + '-' + yy;
    }
    else if(type === 2){
        return dd + ' ' + m_name + ', ' + yy;
    }
    else if(type === 3){
        return d_name + ' ' + dd + ' ' + m_name + ', ' + yy;
    }
    else if(type === 4){
        return yy;
    }
    else if(type === 5){
        return h.toString(10).padStart(2, '0') + ':' + min.toString(10).padStart(2, '0');
    }
    else{
        return yy + '-' + (mm+1) + '-' + dd;
    }
}

module.exports = {
    sendSignupMail,
    sendVFCodeMail,
    generateVerificationCode,
    getCurrentDate
}