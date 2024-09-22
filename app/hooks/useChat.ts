import { useContext } from "react";
import { ChatContext, Role } from "../context/chat";

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatContextProvider");
  }

  const { messages, setMessage, streamMessage, suggestions, setSuggestions } =
    context;

  const sendMessage = async (newMessage: string) => {
    setSuggestions([]);
    setMessage(newMessage, Role.USER);
    // send message to the server
    const response = await fetch(`/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        messages: [
          ...messages.map((message) => {
            return {
              role: message.from === Role.USER ? "user" : "assistant",
              content: message.text,
            };
          }),
          { role: "user", content: newMessage },
        ],
      }),
    });

    if (!response.ok || !response.body) {
      throw response.statusText;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        getRelatedQuestions(newMessage);
        return;
      }
      const chunk = decoder.decode(value, { stream: true });
      streamMessage(chunk);
    }
  };

  const getRelatedQuestions = async (newMessage: string) => {
    const response = await fetch(`/api/suggestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        messages: [
          ...messages.map((message) => {
            return {
              role: message.from === Role.USER ? "user" : "assistant",
              content: message.text,
            };
          }),
          { role: "user", content: newMessage },
        ],
      }),
    });

    if (!response.ok || !response.body) {
      throw response.statusText;
    }

    const data = await response.json();
    const { relatedQuestions } = data;
    setSuggestions(relatedQuestions);
  };

  return { messages, sendMessage, suggestions };
};
