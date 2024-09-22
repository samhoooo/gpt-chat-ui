import Markdown from "react-markdown";
import Image from "next/image";
import styles from "./ChatMessage.module.css";

type Props = {
  side?: "ai" | "user";
  avatar?: string;
  message: string;
};

const ChatMessage = (props: Props) => {
  const { side = "ai", avatar, message } = props;

  return (
    <div
      className={side === "ai" ? styles.aiChatMessage : styles.humanChatMessage}
    >
      {avatar && (
        <Image
          className={styles.image}
          width="45"
          height="45"
          src={`/${avatar}`}
          alt={avatar}
        />
      )}
      <div className={styles.messageText}>
        <Markdown>{message}</Markdown>
      </div>
    </div>
  );
};

export default ChatMessage;
