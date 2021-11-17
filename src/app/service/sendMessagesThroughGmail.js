const nodemailer = require('nodemailer');
const mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nhtung5901@gmail.com',
        pass: '0975543798'
    }
});

const mailOptions = {
    from: 'nhtung5901@gmail.com',
    to: 'olegion2001@gmail.com',
    // subject: 'Sending Email via Node.js',
    // text: 'That was easy!'
};

class sendByMail {
    async confirmChangePassword(subject, text) {
        mailOptions.subject = subject;
        mailOptions.text = text;
        const response = await new Promise((resolve, reject) => {
            mail.sendMail(mailOptions, function(error){
                if (error) reject(new Error(error.message));
                resolve(true);
            })
        })
        return response;
    }
}

module.exports = new sendByMail();