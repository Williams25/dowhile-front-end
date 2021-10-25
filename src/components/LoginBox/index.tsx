import { useContext } from "react";
import { VscGithubInverted } from "react-icons/vsc";
import styles from "./LoginBox.module.scss";
import { authContext } from "../../contexts/AuthProvider";

export const LoginBox = () => {
  const { user, signinUrl } = useContext(authContext);

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>

      <a href={signinUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size={24} /> Entrar com Github
      </a>
    </div>
  );
};
