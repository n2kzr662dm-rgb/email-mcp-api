const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { subject, content, sender, to } = req.query;

  if (!subject || !content) {
    return res.status(400).json({ error: '缺少 subject 或 content' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.QQ_EMAIL,
      pass: process.env.QQ_AUTH_CODE
    }
  });

  const mailOptions = {
    from: `${sender || 'Ccc-ke'} <${process.env.QQ_EMAIL}>`,
    to: to || process.env.QQ_EMAIL,
    subject: subject,
    text: content
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
