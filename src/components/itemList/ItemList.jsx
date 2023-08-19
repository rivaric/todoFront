import axios from "axios";
import Item from "../item/Item";
import "../itemList/ItemList.scss";
import loading from "../itemList/loading.gif";
import { useCallback, useEffect, useState } from "react";

const ItemList = ({ tasks, setTasks, isLoading, setIsLoading }) => {
  const [filter, setFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [filterTasks, setFilterTasks] = useState(tasks);

  const btns_f = [
    { name: "all" },
    { name: "done" },
    { name: "not done" },
    { name: "search" },
  ];

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      axios
        .delete(`http://localhost:8080/api/todos/${id}`)
        .then(() => {
          setTasks(tasks.filter((item) => item.id !== id));
          setIsLoading(false);
        })
        .catch((res) => console.log(res));
    },
    [setIsLoading, setTasks, tasks]
  );

  const onReady = useCallback(
    (task) => {
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
    },
    [setIsLoading, setTasks]
  );

  const onChange = (e) => {
    setSearchValue(e.target.value);
  };

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
      case "search":
        setFilterTasks(tasks.filter((task) => task.title.toLowerCase().includes(searchValue.toLowerCase()) > 0));
        break;
      default:
    }
  }, [onDelete, onReady, tasks, filter, searchValue]);

  useEffect(() => {
    setSearchValue("")
  }, [filter])

  return (
    <>
      <div className={`filter ${tasks.length === 0 ? "hide" : "show"}`}>
        {btns_f.map(({ name }) => {
          if (name !== "search") {
            return (
              <button
                key={name}
                className={`btn_f ${filter === name ? "active" : ""}`}
                onClick={() => setFilter(name)}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </button>
            );
          } else {
            return (
              <input
                key={name}
                className={`input_search ${filter === name ? "active" : ""}`}
                placeholder="Search task"
                onClick={() => setFilter(name)}
                onChange={onChange}
                value={searchValue}
              />
            );
          }
        })}
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
