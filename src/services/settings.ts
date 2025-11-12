import { api } from "./api";

export interface NotificationEmailsResponse {
  emails: string[];
}

export interface UpdateNotificationEmailsRequest {
  emails: string[];
}

export const getNotificationEmails = async (): Promise<NotificationEmailsResponse> => {
  const response = await api.get<NotificationEmailsResponse>("/system-config/notification-emails");
  return response.data;
};

export const updateNotificationEmails = async (data: UpdateNotificationEmailsRequest): Promise<NotificationEmailsResponse> => {
  const response = await api.put<NotificationEmailsResponse>("/system-config/notification-emails", data);
  return response.data;
};
