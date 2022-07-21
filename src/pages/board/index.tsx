import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { FormEvent, useState } from 'react'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton'
import styles from './styles.module.scss'

import { collection, addDoc, getDocs, query, where, deleteDoc, doc, getFirestore } from 'firebase/firestore'

import { app, database } from '../../services/firebaseConnection'
import { format } from 'date-fns'
import Link from 'next/link'

type TaskList = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  tarefa: string;
  userId: string;
  nome: string;
}

interface BoardProps {
  user: {
    id: string;
    nome: string;
  };
  data: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));

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
      console.log('CADASTRADO COM SUCESSO!');

      let data = {
        id             : doc.id,
        created        : new Date(),
        createdFormated: format(new Date(), 'dd MMMM yyyy'),
        tarefa         : input,
        userId         : user.id,
        nome           : user.nome
      };

      setTaskList([...taskList, data]);
      setInput('');
    })
    .catch((err) => {
      console.log('ERRO AO CADASTAR: ', err)
    })
  }

  async function handleDelete(id: string) {
    const dbInstance = collection(database, 'tarefas');

    const db = getFirestore(app)

    let _doc = doc(db, 'tarefas', id );

    await deleteDoc(_doc)
    .then((data) => {
      console.log('DELETADO COM SUCESSO!', data);
      
      let taskDeleted = taskList.filter( item => {
        return (item.id != id);
      })

      setTaskList(taskDeleted);
    })
    .catch((err) => {
      console.error(err);
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

        <h1>Você tem {taskList.length} {taskList.length == 1 ? 'tarefa' : 'tarefas'}!</h1>

        <section>
          {taskList.map( (task, k) => (
            <article key={k} className={styles.taskList}>
              <Link href={`/board/${task.id}`}>
                <p>{task.tarefa}</p>
              </Link>

              <div className={styles.actions}>
                
                <div>
                  <div>
                    <FiCalendar size={20} color='#FFB800' />
                    <time>{task.createdFormated}</time>
                  </div>

                  <button>
                    <FiEdit2 size={20} color='#FFFFFF' />
                    <span>Editar</span>
                  </button>
                </div>

                <button onClick={() => handleDelete(task.id)}>
                  <FiTrash size={20} color='#FF3636' />
                  <span>Excluir</span>
                </button>

              </div>
            </article>
          ))}
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
  const dbInstance = collection(database, 'tarefas');

  if(!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const q = query((dbInstance), where('nome', '==', session.user.name));

  const tasks = await getDocs(q);

  const data = JSON.stringify(tasks.docs.map(u => {
    return {
      id: u.id,
      createdFormated: format(u.data().created.toDate(), 'dd MMMM yyyy'),
      ...u.data()
    }
  }))

  const user = {
    nome: session?.user.name,
    id: session?.id
  }

  return {
    props: {
      user,
      data
    }
  }
}