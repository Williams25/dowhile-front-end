import { useState, useEffect } from "react";
import { api } from "../../services/api";
import styles from "./MessageList.module.scss";
import io from "socket.io-client";

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

const messagesQeue: Message[] = [];

const socket = io("http://localhost:4000");

socket.on("new_message", (newMessage) => {
  messagesQeue.push(newMessage);
});

export const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleLoadMessages = async () => {
    const { data } = await api.get<Message[]>("messages/last3");
    setMessages(data);
  };

  useEffect(() => {
    handleLoadMessages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQeue.length > 0) {
        setMessages((messages) =>
          [messagesQeue[0], messages[0], messages[1]].filter(Boolean)
        );
        messagesQeue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [messagesQeue]);

  return (
    <div className={styles.messageListWrapper}>
      <img src="assets/logo.svg" alt="logo dowhile 2021" />

      <ul className={styles.messageList}>
        {messages &&
          messages.map((message, index) => {
            return (
              <li className={styles.message} key={index}>
                <p className={styles.messageContent}>{message.text}</p>
                <div className={styles.messageUser}>
                  <div className={styles.userImage}>
                    <img
                      src={message.user.avatar_url}
                      alt={message.user.name}
                    />
                  </div>
                  <span>{message.user.name}</span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
