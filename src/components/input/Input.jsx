import axios from "axios";
import { useState } from "react";
import "../input/Input.scss";

const Input = ({ setTasks, setIsLoading }) => {
  const [title, setTask] = useState("");
  const [isError, setIsError] = useState("");

  const onChange = (e) => {
    setTask(e.target.value);
  };

  const onClick = async (task) => {
    setIsLoading(true);
    if (title.length < 5 && title.length > 0) {
      setIsError("The task is too short");
      setIsLoading(false);
    } else if (title.length === 0) {
      setIsError("The task cannot be empty");
      setIsLoading(false);
    } else {
      setIsError("");
      await axios
        .post("http://localhost:8080/api/todos", {
          title: title,
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
    }
  };

  return (
    <div className="input_backround">
      <p className="text_title">
        Add new tasks <br /> and start completing them!
      </p>
      <label htmlFor="task">
        <input
          name="task"
          type="text"
          className="input"
          placeholder="Add task"
          value={title}
          onChange={onChange}
        />
        <button
          className="btn_plus"
          type="submit"
          onClick={() => onClick(title)}>
          <i className="uil uil-plus"></i>
        </button>
      </label>
      {isError ? <p className="error">{isError}</p> : ""}
    </div>
  );
};

export default Input;
