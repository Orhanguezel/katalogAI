// src/modules/mail/index.ts
// Minimal mail stubs — real implementation deferred

export async function sendWelcomeMail(_opts: { to: string; user_name: string; user_email: string }) {
  // TODO: implement with nodemailer
}

export async function sendPasswordChangedMail(_opts: { to: string; user_name: string }) {
  // TODO: implement with nodemailer
}
