"use client";

import Image from "next/image";

import styles from "./ChatHeader.module.css";

type Props = {
  avatar: {
    alt: string;
    src: string;
  };
  title: string;
};

const ChatHeader = ({ avatar, title }: Props) => {
  return (
    <div className={styles.header}>
      <div className={styles.avatar}>
        <Image
          className={styles.image}
          width="45"
          height="45"
          src={`/${avatar.src}`}
          alt={avatar.alt}
        />
      </div>
      <div className={styles.title}>
        <b>{title}</b>
      </div>
    </div>
  );
};

export default ChatHeader;
