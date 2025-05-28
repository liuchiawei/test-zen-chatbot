'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FaqCarousel from '@/components/common/faqCarousel';
import { QuotationReply } from '@/components/ai/QuotationReply';
import { MessagePartProps } from "@/lib/props";
import content from '@/data/content.json';
import LoadingThreeDotsJumping from '@/components/common/loading';
import { UserMessageOpts, AssistantMessageOpts } from '@/components/common/messageOpts';
import { Send } from 'lucide-react';

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
  handleSourceOpen,
  handleCoverOpen
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
  const handleEdit = (messageId: string) => {
    if (!messages) return;
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditingContent(message.content);
    }
  }

  // 編集内容変更ハンドラー
  const handleEditChange = (value: string) => {
    setEditingContent(value);
  }

  // 編集送信ハンドラー
  const handleEditSubmit = (messageId: string) => {
    setEditingMessageId('');
    setEditingContent('');
    reload();
  }

  // 編集キャンセルハンドラー
  const handleEditCancel = () => {
    setEditingMessageId('');
    setEditingContent('');
  }

  // コピー状態管理
  const [isCopied, setIsCopied] = useState(false);

  // コピーハンドラー
  const handleCopy = async (content: string) => {
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
  }

  // 音声再生状態管理
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 音頻緩存管理
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  // 音頻再生ハンドラー
  const handleSpeak = async (content: string) => {
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
      setIsSpeaking(true);
      audioElement.play();
      
      // 音頻再生終了時にisSpeakingをfalseにする
      audioElement.onended = () => {
        setIsSpeaking(false);
      };
    } catch (error) {
      console.error('音頻生成に失敗しました:', error);
      setIsSpeaking(false); // エラー時もfalseにする
    }
  }
  
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
            {/* キャラクター表示 */}
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
              {message.role === 'assistant' && message.toolInvocations?.map(toolInvocation => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state !== 'result') {
                  return <LoadingThreeDotsJumping key={toolCallId} />
                }
                
                if (state === 'result') {
                    if (toolName === 'searchTool') {
                        const { result } = toolInvocation;
                        return (
                            <div key={toolCallId} className="mt-2 max-w-[85%] w-full flex flex-col justify-start">
                              <QuotationReply textScale={textScale} style={style} data={result.data} handleSourceOpen={handleSourceOpen} handleCoverOpen={handleCoverOpen} />
                            </div>
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
                        ? 'bg-white dark:bg-stone-700 text-foreground/80'
                        : 'bg-background dark:bg-stone-800 text-foreground/80'
                      : 'bg-stone-100/20 text-stone-50'}
                      ${editingMessageId === message.id
                        ? 'min-w-1/2 py-4'
                        : 'py-2'}
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
                // アシスタントの場合
                <p className={`text-justify tracking-wide
                  ${textScale === 'md'
                    ? 'text-sm leading-6'
                    : 'text-2xl leading-10'
                  }
                  ${style === 'default'
                    ? 'text-foreground/90 '
                    : 'text-stone-100'}
                  `}>
                  {message.content}
                </p>
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
        {status === 'submitted' && <LoadingThreeDotsJumping />}
        
      </>
    );
  }, [messages, status, error, textScale, handleEdit, handleDelete, reload]);

  return (
    <div className='flex flex-col border-t border-b w-full h-full text-justify pb-4 overflow-hidden'>
        {messages && messages.length === 0 ? (
          <div className='px-18'>
            <h1 className={`my-6 text-xl
              ${textScale === 'md'
              ? 'text-sm'
              : 'text-2xl'}
              ${style === 'default'
              ? 'text-stone-700 dark:text-stone-400'
              : 'text-stone-300'}
              `}
            >
              {content.chat.defaultContent}
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
