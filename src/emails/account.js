const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendVerificationEmail = (email, name, verificationToken) => {
    console.log(email, name, verificationToken)
    sgMail.send({
        to: email,
        from: 'alanrochford19@gmail.com',
        subject: 'Thanks for Joining Us',
        html: `<p>Welcome to the app, ${name}<br>Please click <a href="http://localhost:3000/users/verify/${verificationToken}">here</a> to verify your account</p>`
    })
}

module.exports = {sendVerificationEmail}

