import axios from "axios";
import Item from "../item/Item";
import "../itemList/ItemList.scss";
import loading from "../itemList/loading.gif";
import { useCallback, useEffect, useState } from "react";

const ItemList = ({ tasks, setTasks, isLoading, setIsLoading }) => {
  const [filter, setFilter] = useState("all");
  const [filterTasks, setFilterTasks] = useState(tasks);

  const onDelete = useCallback((id) => {
    setIsLoading(true);
    axios
      .delete(`http://localhost:8080/api/todos/${id}`)
      .then(() => {
        setTasks(tasks.filter((item) => item.id !== id));
        setIsLoading(false);
      })
      .catch((res) => console.log(res));
  }, [setIsLoading, setTasks, tasks]);

  const onReady = useCallback((task) => {
    setIsLoading(true);
    axios
      .put(`http://localhost:8080/api/todos/${task.id}`, {
        title: task.title,
        is_ready: !task.is_ready,
      })
      .then(() => {
        axios
          .get(`http://localhost:8080/api/todos`)
          .then((res) => {
            const allTasks = res.data;
            setTasks(allTasks);
          })
          .catch((res) => console.log(res));
        setIsLoading(false);
      });
  }, [setIsLoading, setTasks]);

  useEffect(() => {
    switch (filter) {
      case "all":
        setFilterTasks(tasks);
        break;
      case "done":
        setFilterTasks(tasks.filter((task) => task.is_ready));
        break;
      case "not done":
        setFilterTasks(tasks.filter((task) => !task.is_ready));
        break;
      default:
    }
  }, [onDelete, onReady, tasks, filter]);

  return (
    <>
      <div className="filter">
        <button className="btn_f" onClick={() => setFilter("all")}>
          All
        </button>
        <button
          className="btn_f"
          onClick={() => setFilter("done")}>
          Done
        </button>
        <button
          className="btn_f"
          onClick={() => setFilter("not done")}>
          Not done
        </button>
      </div>
      <div className="itemList_background">
        {isLoading ? (
          <div className="spiner">
            <img src={loading} alt="loading" />
          </div>
        ) : filterTasks.length !== 0 ? (
          filterTasks.map((task) => (
            <Item
              task={task}
              key={task.id}
              setTasks={setTasks}
              onDelete={onDelete}
              onReady={onReady}
            />
          ))
        ) : (
          <p>No tasks</p>
        )}
      </div>
    </>
  );
};

export default ItemList;
