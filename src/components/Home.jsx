import React, { useEffect, useState } from "react";
import { fetchUser } from "../utils/fetchUser";
import { useNavigate } from "react-router-dom";
import { AutoComplete, Input } from "antd";
import axios from "axios";
import { Collapse } from "antd";
import { useDispatch } from "react-redux";
import { GET_MESSAGES, GET_NAMES, SEND_MASSAGE } from "../constant";
import { start, done } from "../store/loaderSlice";
import { snackbarStart } from "../store/SnackbarSlice";
const { Panel } = Collapse;
const { TextArea } = Input;
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [names, setNames] = useState([]);
  const [messages, setMessages] = useState([]);
  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login");
  };
  const getRequest = async () => {
    dispatch(start());
    try {
      const { data } = await axios({
        method: "post",
        url: GET_MESSAGES,
        headers: {},
        data: {
          recipient: getName(),
        },
      });
      setMessages(data?.messages);
      dispatch(done());
      getNames();
    } catch (err) {
      console.log(err);
      dispatch(done());
      dispatch(
        snackbarStart({
          text: err?.response?.data,
          severity: "error",
        })
      );
    }
  };
  const getNames = async () => {
    try {
      const { data } = await axios({
        method: "get",
        url: GET_NAMES,
        headers: {},
        data: {},
      });
      let arr = data[0]?.names?.map((item) => ({ value: item }));
      setNames(arr);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const user = fetchUser();
    if (!user) navigate("/login");
    getRequest();
  }, []);

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
  const sendMessage = async () => {
    if (name.length > 1 && title.length > 1 && message.length >= 3) {
      dispatch(start());
      try {
        const { data } = await axios({
          method: "post",
          url: SEND_MASSAGE,
          headers: {},
          data: {
            recipient: name,
            user: getName(),
            title: title,
            message: message,
          },
        });
        setMessages(data?.messages);
        setName("");
        setTitle("");
        setMessage("");
        getRequest();
        dispatch(done());
        dispatch(
          snackbarStart({
            text: "Message sent successfully!",
            severity: "success",
          })
        );
      } catch (err) {
        console.log(err);
        dispatch(done());
        dispatch(
          snackbarStart({
            text: err?.response?.data,
            severity: "error",
          })
        );
      }
    } else {
      dispatch(
        snackbarStart({
          text: "Name, title or message is incorrect",
          severity: "error",
        })
      );
    }
  };
  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDate = `${day < 10 ? "0" + day : day}.${
      month < 10 ? "0" + month : month
    }.${year} ${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;

    return formattedDate;
  }
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
              <div className="left">
                <span>To: </span>
              </div>
              <AutoComplete
                style={{ width: 200 }}
                options={names}
                placeholder="Recipient"
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                onSelect={onSelect}
                onSearch={handleSearch}
                value={name}
                className="ml-4"
              />
            </div>
            <div className="title mt-4">
              <div className="left">
                <span>Title: </span>
              </div>
              <AutoComplete
                style={{ width: 200 }}
                placeholder="Title"
                onSearch={handleSearchTitle}
                value={title}
                className="ml-4"
              />
            </div>
            <div className="flex items-center">
              <div className="left">
                <span>Message: </span>
              </div>
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
              <Collapse defaultActiveKey={["0"]} size="large">
                {messages?.map((message, i) => (
                  <Panel header={message?.title} key={i}>
                    <div className="flex justify-center flex-col">
                      <p className="text-base">{message?.message}</p>
                      <hr className="mt-4 mb-1" />
                      <span className="text-sm"> From: {message?.user} </span>
                      <span className="text-sm">
                        {" "}
                        Sent: {convertTimestamp(message?.time)}{" "}
                      </span>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
