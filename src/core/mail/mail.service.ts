export interface MailService {
  sendPasswordResetCode(email: string, code: string): Promise<void>;
}
