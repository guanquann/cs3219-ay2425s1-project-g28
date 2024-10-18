export const ACCOUNT_VERIFICATION_SUBJ = "Account Verification Link";

export const ACCOUNT_VERIFICATION_TEMPLATE = `
<html>
  <head>
    <title>Account Verification</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <p>Hello {{username}}!</p>
    <p>
      Thank you for signing up with us. Please verify your email address via
      this
      <span><a href={{verificationLink}}>link</a></span>.
    </p>
    <p>If you did not sign up with us, please ignore this email.</p>
    <p>Regards,</p>
    <p>Peerprep G28</p>
  </body>
</html>
`;
