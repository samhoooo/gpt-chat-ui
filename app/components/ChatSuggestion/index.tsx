import { useChat } from "../../hooks/useChat";
import styles from "./ChatSuggestion.module.css";

type Prop = {
  suggestions: string[];
};

const ChatSuggestion = ({ suggestions }: Prop) => {
  const { sendMessage } = useChat();

  if (!suggestions || suggestions.length < 1) return null;

  const handleClick = (suggestion: string) => {
    // Send as a chat message
    sendMessage(suggestion);
  };

  return (
    <div className={styles.container}>
      {suggestions.map((suggestion, index) => (
        <span
          key={index}
          className={styles.chip}
          onClick={() => {
            handleClick(suggestion);
          }}
        >
          {suggestion}
        </span>
      ))}
    </div>
  );
};

export default ChatSuggestion;
