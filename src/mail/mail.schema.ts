export class MailSchema {
  messageId: string;
  to: string;
  depth: number;
  content: string;
  forwardable: boolean;
  forwardContent;
}
