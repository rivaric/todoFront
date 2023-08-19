import { useState } from "react";
import "../item/Item.scss";
import axios from "axios";

const Item = ({ task, onDelete, onReady, setTasks }) => {
  const [value, setValue] = useState(task.title);
  const [isEdit, setIsEdit] = useState(true);

  const onEdit = () => {
    setIsEdit((isEdit) => !isEdit);
  };

  return (
    <div className="item_background">
      <input
        id={task.id}
        type="text"
        className={`input_edit ${isEdit ? "hide" : "show"}`}
        placeholder="Edit task"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          axios
            .put(`http://localhost:8080/api/todos/${task.id}`, {
              title: e.target.value,
              is_ready: false,
            })
            .then(() => {
              axios
                .get(`http://localhost:8080/api/todos`)
                .then((res) => {
                  const allTasks = res.data;
                  setTasks(allTasks);
                })
                .catch((res) => console.log(res));
            })
            .catch((res) => {
              console.log(res);
            });
        }}
      />
      <span className={`${isEdit ? "show" : "hide"} item_title`}>
        {task.title}
        <div className={`ready ${task.is_ready ? "show" : "hide"}`}></div>
      </span>
      <div className="icons_wrapper">
        <button onClick={onEdit}>
          <i className="uil uil-pen"></i>
        </button>
        <button onClick={() => onDelete(task.id)}>
          <i className="uil uil-trash-alt"></i>
        </button>
        <button onClick={() => onReady(task)}>
          {
            task.is_ready ? (
              <i className="uil uil-redo"></i>
            ) : (
              <i className="uil uil-check"></i>
            )
          }
        </button>
      </div>
    </div>
  );
};

export default Item;
