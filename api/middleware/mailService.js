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

async function sendResetPasswordEmail(email, link) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: mailServiceSender,
      pass: mailServicePassword,
    },
  });

  let info = transporter.sendMail({
    from: mailServiceSender, // sender address
    to: email, // receiver
    subject: 'Responsible AI System Assessment Reset Account Password', // Subject line
    html: `
          <p>
            This is your <a href="${link}">link</a> to recover your account's password for The Responsible AI System Assessment!
          </p>
          <p>
            If you did not request this action, please contact
            <a href="admin@responsible.ai">admin@responsible.ai</a> immediately.
          </p>
        `,
  });
}

exports.sendEmail = sendEmail;
exports.sendResetPasswordEmail = sendResetPasswordEmail;
