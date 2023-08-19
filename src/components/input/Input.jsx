import axios from "axios";
import { useState } from "react";
import "../input/Input.scss";

const Input = ({ setTasks, setIsLoading }) => {
  const [task, setTask] = useState("");

  const onChange = (e) => {
    setTask(e.target.value);
  };

  const onClick = async (task) => {
    setIsLoading(true);
    await axios
      .post("http://localhost:8080/api/todos", {
        title: task,
        is_ready: false,
      })
      .then(() => {
        axios
          .get(`http://localhost:8080/api/todos`)
          .then((res) => {
            const allTasks = res.data;
            setTasks(allTasks);
            setIsLoading(false);
          })
          .catch((res) => console.log(res));
        setTask("");
      })
      .catch((res) => console.log(res));
  };

  return (
    <div className="input_backround">
      <p>
        Add new tasks <br /> and start completing them!
      </p>
      <label htmlFor="task">
        <input
          name="task"
          type="text"
          className="input"
          placeholder="Add task"
          value={task}
          onChange={onChange}
        />
        <button
          className="btn_plus"
          type="submit"
          onClick={() => onClick(task)}>
          <i className="uil uil-plus"></i>
        </button>
      </label>
    </div>
  );
};

export default Input;
