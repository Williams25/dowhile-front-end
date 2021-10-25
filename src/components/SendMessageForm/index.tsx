import { useContext } from "react";
import styles from "./SendMessageForm.module.scss";
import { VscSignOut, VscGithubInverted } from "react-icons/vsc";
import { authContext } from "../../contexts/AuthProvider";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

type SendMessage = {
  message: string;
};

export const SendMessageForm = () => {
  const { user, signOut } = useContext(authContext);
  const methods = useForm<SendMessage>();

  const handleSendMessage = async (data: SendMessage) => {
    await api.post("messages", { message: data.message });
    methods.setValue("message", "");
  };

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button className={styles.signOutButton} onClick={signOut}>
        <VscSignOut size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>

        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size={16} />
          {user?.login}
        </span>
      </header>

      <form
        onSubmit={methods.handleSubmit(handleSendMessage)}
        className={styles.sendMessageForm}
      >
        <label htmlFor="message">Mensagem</label>

        <textarea
          id="message"
          placeholder="Qual sua expectativa para o doWhile?"
          {...methods.register("message", {
            required: {
              message: "Mensagem obrigatória",
              value: true,
            },
          })}
        ></textarea>

        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  );
};
