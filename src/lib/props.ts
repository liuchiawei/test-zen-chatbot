import { Message } from "@ai-sdk/react";

export type HeaderPartProps = {
  className?: string;
  textScale: string;
  isCoverOpen: boolean;
  handleCoverOpen: () => void;
};

export type ChatMode = 'searchOnly' | 'searchSummary' | 'category' | 'free';

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
  handleUpdateMessage?: (messageId: string, newContent: string) => void;
};

export type InputPartProps = {
  handleSubmit?: any;
  input?: any;
  handleInputChange?: any;
  status?: any;
  stop?: any;
  style: string;
  currentMode: ChatMode;
  setCurrentMode: (mode: ChatMode) => void;
  currentTopK: number;
  setTopK: (topK: number) => void;
  currentRange: string;
  setRange: (range: string) => void;
};

export type ModeTagsProps = {
  currentMode: ChatMode;
  setCurrentMode: (mode: ChatMode) => void;
};

export type TopKSelectorProps = {
  topK: number;
  setTopK: (topK: number) => void;
  currentRange: string;
  setRange: (range: string) => void;
};

export type SearchResultsProps = {
  textScale: string;
  style: string;
  responseData: any;
  extracted_chunks: [
    {
      text: string;
      filename: string;
    }
  ];
};

export type SourceProps = {
  textScale: string;
  style: string;
  chunk: {
    text: string;
    filename: string;
  };
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
