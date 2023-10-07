const nodemailer = require("nodemailer");
const {SENDER, PASSWORD} = require("../env");

const sendEmail = async (email, subject, url) => {
    if (!email || !subject || !url) {
        throw new Error("Missing required parameters to send email.");
    }

    const emailTransporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: SENDER,
            pass: PASSWORD,
        },
    });

    const mailOptions = {
        from: SENDER,
        to: email,
        subject: subject,
        text: url,
    };

    try {
        await emailTransporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
    } catch (error) {
        throw new Error(`Error sending email: ${error.message}`);
    }
};

module.exports = sendEmail;
