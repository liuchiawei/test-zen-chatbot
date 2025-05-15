import { Message } from "@ai-sdk/react";

export type HeaderPartProps = {
  className?: string
  textScale: string,
  isCoverOpen: boolean,
  handleCoverOpen: () => void
}

export type MessagePartProps = {
  messages?: Message[],
  error?: any,
  status?: any,
  handleEdit?: any,
  handleDelete?: any,
  reload?: any,
  textScale: string
}

export type InputPartProps = {
  handleSubmit?: any,
  input?: any,
  handleInputChange?: any,
  status?: any,
  stop?: any,
}

export type QuoteProps = {
  quote: string;
  author: string;
  source: string;
};

export type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};


