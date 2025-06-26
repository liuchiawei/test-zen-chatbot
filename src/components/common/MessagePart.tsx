'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FaqCarousel from '@/components/common/faqCarousel';
import { SearchResults } from '@/components/ai/searchResults';
import { MessagePartProps } from "@/lib/props";
import content from '@/data/content.json';
import MessageLoading from '@/components/common/messageLoading';
import { UserMessageOpts, AssistantMessageOpts } from '@/components/common/messageOpts';
import { Send } from 'lucide-react';
import MarkdownRenderer from '@/components/common/markdownRender';
export default function MessagePart({
  messages,
  error,
  status,
  handleDelete,
  reload,
  textScale,
  style,
  input,
  handleSubmit,
  handleInputChange,
  handleUpdateMessage,
}: MessagePartProps) {
  // メッセージの最下部を参照する
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // メッセージが追加されたらメッセージの最下部にスクロール
  useEffect(() => {
    if (messagesEndRef.current && status === 'ready') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, status]);

  // 編集状態管理
  const [editingMessageId, setEditingMessageId] = useState<string>('');
  const [editingContent, setEditingContent] = useState<string>('');

  // 編集開始ハンドラー
  const handleEdit = useCallback((messageId: string) => {
    if (!messages) return;
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditingContent(message.content);
    }
  }, [messages]);

  // 編集内容変更ハンドラー
  const handleEditChange = (value: string) => {
    setEditingContent(value);
  }

  // 編集送信ハンドラー
  const handleEditSubmit = useCallback((messageId: string) => {
    if (!messages || !editingContent.trim()) return;
    
    // メッセージを更新する処理をここに追加
    handleUpdateMessage?.(messageId, editingContent.trim());
    // 編集状態を解除
    setEditingMessageId('');
    setEditingContent('');
    // メッセージが更新された後にreloadする
    reload();
  }, [messages, editingContent, handleUpdateMessage, reload]);

  // 編集キャンセルハンドラー
  const handleEditCancel = () => {
    // 編集状態を解除
    setEditingMessageId('');
    setEditingContent('');
  }

  // コピー状態管理
  const [isCopied, setIsCopied] = useState(false);

  // コピーハンドラー
  const handleCopy = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      // (0.6秒後に)コピー状態を解除
      setTimeout(() => {
        setIsCopied(false);
      }, 600);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
      // フォールバック: 古いブラウザ対応
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, []);

  // 音声再生状態管理
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 音頻緩存管理
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  // 音頻再生ハンドラー
  const handleSpeak = useCallback(async (content: string) => {
    // キャッシュから既存の音頻を確認
    const cachedAudio = audioCache.current.get(content);
    
    if (cachedAudio) {
      // 既存の音頻を再生
      setIsSpeaking(true);
      cachedAudio.currentTime = 0; // 最初から再生
      cachedAudio.play();
      
      // 音頻再生終了時にisSpeakingをfalseにする
      cachedAudio.onended = () => {
        setIsSpeaking(false);
      };
      return;
    }

    try {
      // 新しい音頻をAPIから取得
      const audio = await fetch('/api/speech', {
        method: 'POST',
        body: JSON.stringify({ text: content }),
      });
      const audioBlob = await audio.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      
      // キャッシュに保存
      audioCache.current.set(content, audioElement);
      
      // 音頻を再生
      if (!isSpeaking) {
        setIsSpeaking(true);
        audioElement.play();
      }
      
      // 音頻再生終了時にisSpeakingをfalseにする
      audioElement.onended = () => {
        setIsSpeaking(false);
      };
    } catch (error) {
      console.error('音頻生成に失敗しました:', error);
      setIsSpeaking(false); // エラー時もfalseにする
    }
  }, [isSpeaking]);
  
  // メッセージリストのレンダリングをメモ化してパフォーマンス最適化
  const renderedMessages = useMemo(() => {
    if (!messages || messages.length === 0) return null;
    return (
      <>
        {/* TODO: Error Area Style */}
        {error ? <div className='p-6 bg-red-800'>{error.message}</div> : null}

        {messages.map(message => (
          <div
            key={message.id}
            className="px-2 md:px-3 grid grid-cols-[56px_1fr_12px] md:grid-cols-[60px_1fr_12px] justify-center w-full mt-6"
          >
            {/* キャラクター画像表示 */}
            <div
              className={`w-full h-full flex justify-center
              ${message.role === 'user' ? 'col-start-3' : 'col-start-1'}
              `}>
              {message.role === 'user'
              ? ''
              : <Avatar>
                  <AvatarImage src={content.chat.role.answerImage} />
                  <AvatarFallback>
                    {content.chat.role.answer.charAt(0)}
                  </AvatarFallback>
                </Avatar>}
            </div>
            {/* メッセージエリア */}
            <div className={`w-full flex flex-col gap-1 col-start-2 row-start-1
              ${message.role === 'user' ? 'items-end' : 'items-start'}
              `}>
              {/* ツール呼び出しUI */}
              {message.role === 'assistant' && message.parts?.map((part, index) => {
                if (part.type !== 'tool-invocation') return null;
                if (part.toolInvocation.state === 'result') {
                  if (part.toolInvocation.toolName === 'searchTool') {
                    const { result } = part.toolInvocation;
                    if (result.reason) {
                      return (
                        <div key={`search-error-${index}`} className="p-4 text-center">
                          検索失敗理由: {result.reason}
                        </div>
                      );
                    } else if (result.completionStreamResponseData.extracted_chunks.length === 0) {
                      return (
                        <div key={`search-empty-${index}`} className="p-4 text-center">
                          検索結果が見つかりませんでした
                        </div>
                      );
                    }
                    return (
                      <SearchResults 
                        key={part.toolInvocation.toolCallId || `tool-${index}`} 
                        textScale={textScale} 
                        style={style} 
                        responseData={result.responseData}
                        extracted_chunks={result.completionStreamResponseData.extracted_chunks}
                      />
                    );
                  }
                }
                return null;
              })}

              {/* チャット内容 */}
              {message.role === 'user' ? (
                // ユーザーの場合
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-lg text-justify tracking-wide px-4 shadow-sm
                      ${textScale === 'md'
                        ? 'text-sm leading-6'
                        : 'text-2xl leading-10'
                      }
                      ${style === 'default'
                      ? editingMessageId === message.id
                        ? 'min-w-1/2 py-4 bg-white dark:bg-stone-700 text-foreground/80'
                        : 'py-2 bg-linear-to-b from-stone-50/50 to-stone-100/70 dark:from-stone-700/50 dark:to-stone-800/70 text-foreground/80'
                      : editingMessageId === message.id
                        ? 'min-w-1/2 py-4 bg-black/30 text-stone-100 border border-stone-300 dark:border-stone-400'
                        : 'py-2 bg-black/30 text-stone-100 border border-stone-300 dark:border-stone-400'}
                    `}
                  >
                    {/* 編集フォーム */}
                    {editingMessageId === message.id ? (
                      <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(message.id); }} className="flex flex-col gap-2">
                        <textarea 
                          title='edit message' 
                          value={editingContent} 
                          onChange={(e) => handleEditChange(e.target.value)}
                          placeholder={message.content}
                          className="bg-transparent outline-none resize-none"
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <button 
                            type='button'
                            onClick={handleEditCancel}
                            className="cursor-pointer px-4 py-2 text-xs bg-stone-200 dark:bg-stone-600 rounded-md hover:bg-stone-300 dark:hover:bg-stone-600/70"
                          >
                            キャンセル
                          </button>
                          <button
                            title='保存' 
                            type='submit'
                            className="cursor-pointer px-4 py-2 text-xs bg-accent text-white rounded-md hover:bg-accent/80"
                          >
                            <Send className="size-4"/>
                          </button>
                        </div>
                      </form>
                    ) : (
                      message.content
                    )}
                  </motion.div>
                </>
              ) : (
                // AIの場合
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-justify tracking-wide
                  ${textScale === 'md'
                    ? 'text-sm leading-6'
                    : 'text-2xl leading-10'
                  }
                  ${style === 'default'
                    ? 'text-foreground/90 '
                    : 'text-stone-100'}
                  ${status === 'streaming' && 'animate-pulse'}
                  `}
                >
                  <MarkdownRenderer content={message.content} />
                  {/* TODO: デバッグ用 delete after testing */}
                  {/* <div className='text-xs text-left max-w-4xl'>
                    {JSON.stringify(message.parts)}
                  </div> */}
                </motion.div> 
              )}
              {/* 生成中にはボタンセット呼び出しない */}
              {/* ボタンセット */}
              {(status === 'ready' || status !== 'streaming') && (
                message.role === 'user'
                ? (
                  <UserMessageOpts
                    messageId={message.id}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    reload={reload}
                    status={status}
                    style={style}
                    editingMessageId={editingMessageId}
                  />
                ) : (
                  <AssistantMessageOpts
                    messageId={message.id}
                    status={status}
                    style={style}
                    isCopied={isCopied}
                    handleCopy={handleCopy}
                    handleSpeak={handleSpeak}
                    isSpeaking={isSpeaking}
                    messageContent={message.content}
                  />
                )
              )}
            </div>
          </div>
        ))}
        {/* ローディングメッセージ */}
        {status === 'submitted' && <MessageLoading />}
        {status === 'streaming' && messages[messages.length - 1].parts?.map((part, index) => {
            if (part.type !== 'tool-invocation') return null;
            if (part.toolInvocation.toolName === 'searchTool') {
              return (
                <div key={part.toolInvocation.toolCallId || `tool-${index}`} className='animate-pulse px-3 md:px-6'>
                  {part.toolInvocation.state === 'call'
                   ? content.loadingMessage.searching
                   : content.loadingMessage.summarizing}
                </div>
              );
            }
            return null;
          })}
      </>
    );
  }, [messages, status, error, textScale, style, editingMessageId, editingContent, handleEdit, handleEditSubmit, handleDelete, reload, isCopied, handleCopy, handleSpeak, isSpeaking]);

  // 初期画面
  return (
    <div className='grow flex flex-col justify-end border-t border-b w-full h-full text-justify overflow-hidden pb-8'>
        {messages && messages.length === 0 ? (
          <div className='px-18 flex flex-col justify-between h-full'>
            <div className='h-full py-10 text-center'>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`font-bold
                  ${textScale === 'md'
                  ? 'text-2xl mb-3'
                  : 'text-5xl mb-6'}
                  `}
              >
                {content.chat.initial.title}
              </motion.h1>
              <p className={`text-foreground/40
                ${textScale === 'md'
                ? 'text-sm'
                : 'text-xl'}
                `}>
                {content.chat.initial.content.map((content, index) => (
                  <motion.span key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.3 }}
                  >{content}<br /></motion.span>
                ))}
              </p>
            </div>
            <h1 className={`my-3 text-xl
              ${textScale === 'md'
              ? 'text-sm'
              : 'text-2xl'}
              ${style === 'default'
              ? 'text-foreground/40'
              : 'text-stone-300'}
              `}
            >
              {content.chat.initial.defaultContent}
            </h1>
            <FaqCarousel
              textScale={textScale}
              style={style}
              input={input}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
            />
          </div>
        ) : (
          renderedMessages
        )}
        <div ref={messagesEndRef} />
      </div>
  );
}
