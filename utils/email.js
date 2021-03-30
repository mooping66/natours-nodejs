const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

//@@ Building a Complex Email Handler
module.exports = class Email {
  // new Email(user.url).sendWelcome()
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Mooping.p <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //* Sendgrid
      return nodemailer.createTransport({
        //@@ Using Sendgrid for "Real" Emails
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    //* 1. Create a transporter
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      // service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      //* Activate in gmail "less secure app" option
    });
  }

  async send(template, subject) {
    //* Send the actual email
    //* 1. Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      //@@ Email Templates with Pug: Welcome Emails
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //* 2.Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //* 3. Create a transform and send email
    //* Actually send the email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  //@@ Sending Password Reset Emails
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
