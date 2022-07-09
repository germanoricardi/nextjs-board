import styles from './styles.module.scss'

import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

export function SignInButton() {
  const session = 1;

  return session ? (
    <button
      type='button'
      className={styles.signInButton}
      onClick={ () => {} }
    >
      <img src="https://sujeitoprogramador.com/steve.png" alt="Germano Ricardi" />
      Olá Germano
      <FiX color='#737380' className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type='button'
      className={styles.signInButton}
      onClick={ () => {} }
    >
      <FaGithub color='#FFB800' />
      Entrar com github
    </button>
  )
}