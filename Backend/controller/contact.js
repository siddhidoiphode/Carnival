import nodemailer from 'nodemailer';
import User from '../model/user.js'; // adjust the path if needed

const sendQuery = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const admins = await User.find({ role: 'admin' });

        if (admins.length === 0) {
            return res.status(404).json({ error: 'No admins found to receive the message' });
        }

        const adminEmails = admins.map(admin => admin.email);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: email,
            to: adminEmails,
            subject: `Query from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Your Message received` successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export { sendQuery };
