const nodemailer = require('nodemailer');

async function createTestAccount() {
    try {
        const testAccount = await nodemailer.createTestAccount();
        console.log('Ethereal Email Credentials (for testing):');
        console.log('-------------------------------------------');
        console.log(`SMTP_HOST=${testAccount.smtp.host}`);
        console.log(`SMTP_PORT=${testAccount.smtp.port}`);
        console.log(`SMTP_USER=${testAccount.user}`);
        console.log(`SMTP_PASS=${testAccount.pass}`);
        console.log(`SMTP_SECURE=${testAccount.smtp.secure}`);
        console.log('-------------------------------------------');
        console.log('Copy these lines into your .env file to test immediately.');
    } catch (err) {
        console.error('Failed to create test account:', err);
    }
}

createTestAccount();
