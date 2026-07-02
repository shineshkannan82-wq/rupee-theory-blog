# EmailJS Setup for Rupee Theory

The contact form is fully wired for EmailJS. Complete these steps before publishing so messages are delivered to `rupeetheory28@gmail.com`.

## 1. Create an EmailJS account

1. Visit [EmailJS](https://www.emailjs.com/) and create an account.
2. Verify your email address and sign in to the dashboard.

## 2. Create an email service

1. Open **Email Services**.
2. Select **Add New Service**.
3. Connect the email provider that receives messages for `rupeetheory28@gmail.com`.
4. Copy the generated **Service ID**.

## 3. Create an email template

1. Open **Email Templates** and select **Create New Template**.
2. Set the recipient address to `rupeetheory28@gmail.com`.
3. Use these form variables in the template:

```text
Name: {{from_name}}
Email: {{reply_to}}
Subject: {{subject}}
Message: {{message}}
```

4. Set **Reply To** to `{{reply_to}}`.
5. Save the template and copy its **Template ID**.

## 4. Find the public key

Open **Account > General** in EmailJS and copy the **Public Key**.

## 5. Add the values to Rupee Theory

Open `assets/js/emailjs-config.js` and replace the three placeholders:

```javascript
window.RUPEE_THEORY_EMAILJS = {
  publicKey: "YOUR_PUBLIC_KEY",
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
};
```

Do not change the property names. EmailJS public keys are intended for browser use, but service-side rate limits and allowed-domain restrictions should still be enabled.

## 6. Secure and test

1. In EmailJS, restrict requests to the website's production domain.
2. Set an appropriate monthly quota and rate limit.
3. Deploy the website over HTTPS.
4. Submit a test message from the Contact page.
5. Confirm that the message arrives at `rupeetheory28@gmail.com` and that replying uses the visitor's email address.

The form includes required fields, length limits, email validation, a hidden spam trap, a 15-second repeat-submission delay, loading feedback, success/error popups, and automatic reset after a successful send.
