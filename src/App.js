import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import Input from './components/input/Input';
import ItemList from './components/itemList/ItemList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/todos`)
      .then(res => {
        const allTasks = res.data;
        setTasks(allTasks);
        setIsLoading(false);
      })
      .catch((res) => console.log(res))
  }, [setTasks])

  return (
    <div className="App">
      <div className="container">
        <h1 className='title'>Todo!</h1>
        <Input  setTasks={setTasks} setIsLoading={setIsLoading}/>
        <ItemList tasks={tasks} setTasks={setTasks} isLoading={isLoading} setIsLoading={setIsLoading}/>
      </div>
      {/* <Done/> */}
    </div>
  );
}

export default App;
