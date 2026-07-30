export interface SendCampaignPayload {
  customerIds: string[];
  sendToAll: boolean;
  subject: string;
  title: string;
  messageContent: string;
  promoCode?: string;
}
