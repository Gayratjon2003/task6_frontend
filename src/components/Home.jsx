import React, { useEffect, useState } from "react";
import { fetchUser } from "../utils/fetchUser";
import { useNavigate } from "react-router-dom";
import { AutoComplete, Input } from "antd";
import { Collapse } from "antd";
const { Panel } = Collapse;
const { TextArea } = Input;
const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login");
  };
  useEffect(() => {
    const user = fetchUser();
    if (!user) navigate("/login");
  }, []);
  const options = [
    { value: "Burns Bay Road" },
    { value: "Downing Street" },
    { value: "Wall Street" },
  ];

  const getName = () => {
    return JSON.parse(localStorage?.getItem("name"));
  };
  const handleSearch = async (value) => {
    await setName(value);
  };
  const onSelect = (value) => {
    setName(value);
  };

  const handleSearchTitle = async (value) => {
    await setTitle(value);
  };
  const sendMessage = () => {
    setName("");
    setTitle("");
    setMessage("");
  };
  const text = "hello";
  return (
    <div>
      <div className="w-full flex items-center ">
        <h1 className="text-center text-3xl my-10 w-5/6">
          Welcome to Web Application {getName()}
        </h1>
        <button
          className="bg-red-600 px-6 py-2 rounded-lg text-white"
          onClick={logoutHandler}
        >
          Log out
        </button>
      </div>
      <div className="w-full">
        <div className="container">
          <div className="w-full">
            <div className="Recipient">
              <span>To: </span>
              <AutoComplete
                style={{ width: 200 }}
                options={options}
                placeholder="Recipient"
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                onSelect={onSelect}
                onSearch={handleSearch}
                className="ml-4"
              />
            </div>
            <div className="title mt-4">
              <span>Title: </span>
              <AutoComplete
                style={{ width: 200 }}
                placeholder="Title"
                onSearch={handleSearchTitle}
                className="ml-4"
              />
            </div>
            <div className="flex items-center">
              <span>Message: </span>
              <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message: "
                autoSize={{
                  minRows: 5,
                  maxRows: 5,
                }}
                className="w-1/2 m-4"
              />
              <button
                className="bg-green-600 px-6 py-2 rounded-lg text-white ml-4"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
            <div>
              <Collapse defaultActiveKey={["1"]}>
                <Panel header="This is panel header 1" key="1">
                  <p>{text}</p>
                </Panel>
                <Panel header="This is panel header 2" key="2">
                  <p>{text}</p>
                </Panel>
                <Panel header="This is panel header 3" key="3">
                  <p>{text}</p>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
