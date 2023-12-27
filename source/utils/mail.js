const nodemailer = require("nodemailer");
const setting = require('../settings/general.json');

class Mail {
    constructor() { }

    static getHost() {
        return setting.MAIL.HOST;
    }

    static getPort() {
        return setting.MAIL.PORT;
    }

    static getUser() {
        return setting.MAIL.USER;
    }

    static getPassword() {
        return setting.MAIL.PASSWORD;
    }

    static async sendEmail(to, subject, text, html) {

        const auth = {
            user: this.getUser(),
            pass: this.getPassword()
        };

        const setingTrans = {
            host: this.getHost(),
            port: this.getPort(),
            secure: false,
            auth
        };

        const transporter = nodemailer.createTransport(setingTrans);
        const data = { from: `Shop Roy: <${this.getUser()}>`, to, subject, text, html };
        const info = await transporter.sendMail(data);

        return info;
    }
}


module.exports = Mail;