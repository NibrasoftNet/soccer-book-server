export class NotificationMessageDto {
  notification: {
    title: string;
    body: string;
  };
  data: { [key: string]: string };
  tokens: Array<string>;

  constructor({
    notification,
    data,
    tokens,
  }: {
    notification: {
      title: string;
      body: string;
    };
    data: { [p: string]: string };
    tokens: Array<string>;
  }) {
    this.notification = notification;
    this.data = data;
    this.tokens = tokens;
  }
}
