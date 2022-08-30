nodemailer = require('nodemailer');
fs = require('fs');

// TASK-TODO: Replace all of this will a copy-paste
// version of the email code in the portal using
// sendgrid.
const mailServiceSender = 'admin@responsible.ai';
const mailServicePassword = 'jxcgbsyvvjcxqosm';

async function sendEmail(email, emailSubject, emailTemplate) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: mailServiceSender,
      pass: mailServicePassword,
    },
  });

  fs.readFile(emailTemplate, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      console.log(err);
    } else {
      let info = transporter.sendMail({
        from: mailServiceSender, // sender address
        to: email, // receiver
        subject: emailSubject, // Subject line
        html: html,
      });
    }
  });
}

exports.sendEmail = sendEmail;
