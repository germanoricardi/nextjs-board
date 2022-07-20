import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { FormEvent, useState } from 'react'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton'
import styles from './styles.module.scss'

import { collection, addDoc } from 'firebase/firestore'

import { app, database } from '../../services/firebaseConnection'

interface BoardProps {
  user: {
    id: string;
    nome: string;
  }
}

export default function Board({ user }: BoardProps) {
  const [input, setInput] = useState('');

  async function handleSubmitTask(e: FormEvent) {
    e.preventDefault();

    if(input === '')
      return alert('Preencha alguma tarefa!');

    const dbInstance = collection(database, 'tarefas');

    await addDoc(dbInstance, {
      created: new Date(),
      tarefa: input,
      userId: user.id,
      nome: user.nome
    })
    .then((doc) => {
      console.log('CADASTRADO COM SUCESSO!')
    })
    .catch((err) => {
      console.log('ERRO AO CADASTAR: ', err)
    })
  }

  return(
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>

      <main className={styles.container}>
        <form onSubmit={handleSubmitTask}>
          
          <input
            type="text"
            placeholder='Digite sua tarefa'
            value={input}
            onChange={ (e) => setInput(e.target.value) }
          />

          <button type="submit">
            <FiPlus size={25} color='#17181F' />
          </button>

        </form>

        <h1>Você tem 7 tarefas!</h1>

        <section>
          <article className={styles.taskList}>
            <p>Aprender criar projetos usando NextJS e aplicando firebase como back.</p>

            <div className={styles.actions}>
              
              <div>
                <div>
                  <FiCalendar size={20} color='#FFB800' />
                  <time>17 de Julho de 2022</time>
                </div>

                <button>
                  <FiEdit2 size={20} color='#FFFFFF' />
                  <span>Editar</span>
                </button>
              </div>

              <button>
                <FiTrash size={20} color='#FF3636' />
                <span>Excluir</span>
              </button>

            </div>
          </article>
        </section>
      </main>

      <div className={styles.vipContainer}>
        <h3>Obrigado por apoiar esse projeto.</h3>

        <div>
          <FiClock size={28} color='#FFFFFF' />
          <time>Última doação foi a 3 dias.</time>
        </div>
      </div>

      <SupportButton />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if(!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const user = {
    nome: session?.user.name,
    id: session?.id
  }

  return {
    props: {
      user
    }
  }
}