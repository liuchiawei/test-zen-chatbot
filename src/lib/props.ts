import { Message } from "@ai-sdk/react";

export type HeaderPartProps = {
  className?: string;
  textScale: string;
  isCoverOpen: boolean;
  handleCoverOpen: () => void;
};

export type MessagePartProps = {
  messages?: Message[];
  error?: any;
  status?: any;
  handleDelete?: any;
  reload?: any;
  textScale: string;
  style: string;
  input?: any;
  handleSubmit?: () => void;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type InputPartProps = {
  handleSubmit?: any;
  input?: any;
  handleInputChange?: any;
  status?: any;
  stop?: any;
  style: string;
};

export type QuoteProps = {
  textScale: string;
  style: string;
  data: {
    conversation_id: string;
    answer: string;
  };
};

export type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};

export type FaqCarouselProps = {
  textScale: string;
  style: string;
  input?: any;
  handleSubmit?: () => void;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type FaqProps = {
  textScale: string;
  style: string;
  question: string;
  input?: any;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit?: () => void;
};

export type UserMessageOptsProps = {
  messageId: string;
  handleEdit: (messageId: string) => void;
  handleDelete: (messageId: string) => void;
  reload: () => void;
  status: string;
  style: string;
  editingMessageId: string;
};

export type AssistantMessageOptsProps = {
  messageId: string;
  status: string;
  style: string;
  isCopied: boolean;
  isSpeaking: boolean;
  handleCopy: (content: string) => void;
  handleSpeak: (content: string) => void;
  messageContent: string;
};
