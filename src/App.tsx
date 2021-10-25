import { useContext } from "react";
import { MessageList, LoginBox, SendMessageForm } from "./components";
import styles from "./styles/app.module.scss";
import { authContext } from "./contexts/AuthProvider";

export const App = () => {
  const { user } = useContext(authContext);
  return (
    <main
      className={`${styles.contentWrapper} ${
        !!user ? styles.contentSigned : ""
      }`}
    >
      <MessageList />
      {!!user ? <SendMessageForm /> : <LoginBox />}
    </main>
  );
};
