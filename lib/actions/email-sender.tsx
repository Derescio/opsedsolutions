'use server'; // Marks this as a Server Action

import nodemailer from 'nodemailer';

export async function sendEmail(formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const projectType = formData.get('projectType') as string;
    const budget = formData.get('budget') as string;
    const message = formData.get('message') as string;

    const fullName = `${firstName} ${lastName}`;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PWD,
        },
    });

    const emailBody = `
New Contact Form Submission

Name: ${fullName}
Email: ${email}
Company: ${company || 'Not provided'}
Project Type: ${projectType || 'Not specified'}
Budget: ${budget || 'Not specified'}

Message:
${message}
    `;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: 'opsedsolutions@gmail.com', // Your email
            subject: `New Portfolio Contact: ${fullName}`,
            text: emailBody,
            replyTo: email,
        });
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, message: 'Failed to send email.' };
    }
}