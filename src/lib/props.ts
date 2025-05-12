import { Message } from "@ai-sdk/react";

export type MessagePartProps = {
  messages?: Message[],
  error?: any,
  status?: any,
  handleEdit?: any,
  handleDelete?: any,
  reload?: any
}

export type InputPartProps = {
  handleSubmit?: any,
  input?: any,
  handleInputChange?: any,
  status?: any,
  stop?: any
}
