import Mailgen from "mailgen";
import mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "cerberus",
        product: {
            name: "TransitOps",
            link: "https://localhost:5173"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHTML = mailGenerator.generate(options.mailgenContent);

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mail = {
        from: "teamTransitOps@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML,
    }

    try {
        await transport.sendMail(mail)
    } catch (error) {
        console.error("Something went wrong ", error);
    }
}

const resetPasswordMail = (username, resetPasswordUrl) => {
    return {
        body: {
            name: username,
            intro: "We received the request to change the password",
            action: {
                instructions: "To change your current password please click the following button",
                button: {
                    color: "#D98A3D",
                    text: "Reset",
                    link: resetPasswordUrl
                },
            },
            outro: "If the request is not initiated by you, kindly ignore the mail"
        }
    }
}

export {
    resetPasswordMail,
    sendEmail
}
