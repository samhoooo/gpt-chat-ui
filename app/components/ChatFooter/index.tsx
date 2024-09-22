"use client";

import { Fab, TextField } from "../../utils/mui";
import SendIcon from "@mui/icons-material/Send";

import styles from "./ChatFooter.module.css";
import { useChat } from "../../hooks";
import { useCallback, useState } from "react";

const ChatFooter = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChat();

  const onSubmitHandler = useCallback(() => {
    if (message.trim().length < 1) return;
    sendMessage(message);
    setMessage("");
    window.scrollTo(0, document.body.scrollHeight);
  }, [sendMessage, message]);

  return (
    <div className={styles.footer}>
      <div className={styles.messageInput}>
        <TextField
          id="outlined-basic-email"
          label="Message"
          fullWidth
          multiline
          variant="outlined"
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            e.preventDefault();
            if (e.key === "Enter" && !e.shiftKey) {
              onSubmitHandler();
            }
          }}
          sx={{ color: "#d07c23" }}
        />
      </div>

      <div className={styles.sendButton}>
        <Fab
          color="default"
          aria-label="add"
          size="small"
          onClick={onSubmitHandler}
          sx={{ backgroundColor: "#013a63" }}
        >
          <SendIcon sx={{ color: "white" }} />
        </Fab>
      </div>
    </div>
  );
};

export default ChatFooter;
