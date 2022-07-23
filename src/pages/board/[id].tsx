import { format } from "date-fns";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { app } from "../../services/firebaseConnection";

type Task = {
  id              : string,
  created         : string | Date,
  createdFormated?: string,
  tarefa          : string,
  userId          : string,
  nome            : string
}

interface TaskListProps {
  data: string
}

export default function Task({ data }: TaskListProps) {
  const task = JSON.parse(data) as Task;
  return(
    <div>
      <h1>{task.tarefa}</h1>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const { id } = params;
  const session = await getSession({ req });

  if(!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }



  const db      = getFirestore(app);
  const docRef  = doc(db, 'tarefas', String(id));
  const docSnap = await getDoc(docRef)
  
  if(!docSnap.exists()){
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const data = JSON.stringify({
    id             : docSnap.id,
    created        : docSnap.data().created,
    createdFormated: format(docSnap.data().created.toDate(), 'dd MMMM yyyy'),
    tarefa         : docSnap.data().tarefa,
    userId         : docSnap.data().userId,
    nome           : docSnap.data().nome,
  });

  return {
    props: {
      data
    }
  }
}