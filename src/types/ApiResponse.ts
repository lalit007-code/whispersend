import { Message } from "@/model/user";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessaging?: boolean;
  messages?: Array<Message>;
}

