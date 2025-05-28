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
  textScale: string,
  style: string,
  input?: any,
  handleSubmit?: () => void,
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleCoverOpen: () => void,
  handleSourceOpen: () => void
}

export type InputPartProps = {
  handleSubmit?: any,
  input?: any,
  handleInputChange?: any,
  status?: any,
  stop?: any,
  style: string
}

export type QuoteProps = {
  textScale: string;
  style: string;
  quote: string;
  author: string;
  source: string;
  handleSourceOpen: () => void,
  handleCoverOpen: () => void
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


