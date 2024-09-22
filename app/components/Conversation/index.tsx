"use client";
import { useEffect, useRef } from "react";

import ChatMessage from "../ChatMessage";
import { useChat } from "../../hooks";

import styles from "./Conversation.module.css";
import ChatSuggestion from "../ChatSuggestion";

const Conversation = () => {
  const conversationContainerRef = useRef(null);
  const { messages, suggestions } = useChat();

  useEffect(() => {
    if (!conversationContainerRef?.current) return;
    (conversationContainerRef.current as HTMLDivElement).scrollTo({
      top: (conversationContainerRef.current as HTMLDivElement).scrollHeight,
      behavior: "smooth",
    });
  }, [messages, suggestions]);

  return (
    <div className={styles.conversation} ref={conversationContainerRef}>
      {messages.map((message, index) => {
        if (message.from === "user") {
          return (
            <ChatMessage
              side={"user"}
              message={message.text}
              key={`user-${message.text}-${index}`}
            />
          );
        }
        return (
          <ChatMessage
            side={"ai"}
            avatar={"robot.png"}
            message={message.text}
            key={`ai-${message.text}-${index}`}
          />
        );
      })}
      <ChatSuggestion suggestions={suggestions} />
    </div>
  );
};

export default Conversation;
