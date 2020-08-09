
const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'leticiashi3@gmail.com',
        subject: 'Welcome to the app!',
        html: `<p>Dear App User <strong><em>${name}</em></strong>,</p>
        <p style="padding-left: 30px;">Welcome to the To-Do-List App, enjoy the experience!</p>
        <p>From Cindy</p>`
    })

    //console.log('email sent');
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'leticiashi3@gmail.com',
        subject: 'Goodbye!',
        text: `${name}, your account has been deactivated.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}