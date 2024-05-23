import { config } from 'dotenv';
config();
/**
|
|=====================================================================
| EMAIL [NodeMailer]
|=====================================================================
|
*/

const action = process.env.MAIL_SERVER;
export const MAIL_FROM = process.env.MAIL_FROM;
let result = {};

switch (action) {

    case 'gmail':
        {
            result = {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: Boolean(JSON.parse(process.env.SMTP_SECURE)),
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD
                },
            }
            break;
        }
    case 'brevo':
        {
            result = {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: Boolean(JSON.parse(process.env.SMTP_SECURE)),
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD
                },
            }
            break;
        }

    default:
        {
            result = {};
        }
}
export const EMAIL_CONFIG = result;
