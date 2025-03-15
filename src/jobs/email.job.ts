import { BaseJob } from './base.job';
import nodemailer from 'nodemailer';

export class EmailJob extends BaseJob {
  private transporter: nodemailer.Transporter;

  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async execute(to: string, subject: string, content: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html: content,
      });
      this.logger.info('Email sent successfully', { to, subject });
    } catch (error) {
      await this.handleError(error as Error);
    }
  }
}