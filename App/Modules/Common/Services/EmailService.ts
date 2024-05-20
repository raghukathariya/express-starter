import * as fs from "fs";
import * as Handlebars from "handlebars";
import { EMAIL_CONFIG } from "../../../Config/mail";
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import { Service } from "typedi";

@Service()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(EMAIL_CONFIG);
  }

  async sendEmail(
    emailOptions: SendMailOptions,
    templatePath: any,
    templateData: any
  ): Promise<void> {
    const _emailHtml = await this.renderEmailTemplate(
      templatePath,
      templateData
    );

    return new Promise(async (resolve, reject) => {
      Object.assign(emailOptions, { html: _emailHtml });

      const _mailOptions: SendMailOptions = {
        ...emailOptions,
      };

      await this.transporter.sendMail(_mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error);
        } else {
          console.log("Email sent:", info.response);
          resolve();
        }
      });
    });
  }

  async renderEmailTemplate(
    templatePath: string,
    templateData: any
  ): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      await fs.readFile(templatePath, "utf8", (error, template) => {
        if (error) {
          reject(error);
        } else {
          const compiledTemplate = Handlebars.compile(template);
          resolve(compiledTemplate(templateData));
        }
      });
    });
  }
}
