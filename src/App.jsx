import React, { useEffect, useState } from "react";
import "./App.scss";
import { Card } from "./Card/Card";
import { posts } from "./store/DummyData";
import { io } from "socket.io-client";
import { Comments, Notification, Settings } from "./store/Svgs";

export const App = () => {
  const [userName, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [senderName, setSenderName] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({});

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", user);
  }, [socket, user]);

  useEffect(() => {
    socket?.on("GET_NOTIFICATION", (data) => {
      setNotifications((prev) => [...prev, data]);
      setSenderName(data.senderName);
      setNotificationData(data);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    });
  }, [socket]);

  const handleLoginInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleLoginClick = () => {
    setUser(userName);
  };

  const handleNotificationState = () => {
    return notificationData.type === 1
      ? "liked"
      : notificationData.type === 2
      ? "commented on"
      : notificationData.type === 3
      ? "shared"
      : null;
  };

  const handleNotificationCount = (number) => {
    return notifications.filter((elm) => elm?.type === number).length;
  };

  return (
    <div className="App">
      {!user ? (
        // login
        <div className="Login">
          <div className="container">
            <h1 className="text-center mb-5">Login</h1>
            <input
              className="form-control my-2"
              type="text"
              onChange={handleLoginInputChange}
            />
            <button
              className="btn btn-primary w-100 my-2"
              onClick={handleLoginClick}
            >
              LOGIN
            </button>
          </div>
        </div>
      ) : (
        // Home
        <div className="Home boxShadow">
          {/* navbar */}
          <div className="Navbar">
            <h2 className="m-0 text-uppercase">{user}</h2>
            <div className="icons">
              <span>
                <Notification />
                <div className="count">{handleNotificationCount(1)}</div>
              </span>
              <span>
                <Comments />
                <div className="count">{handleNotificationCount(2)}</div>
              </span>
              <span>
                <Settings />
                <div className="count">{handleNotificationCount(3)}</div>
              </span>
            </div>
            {showNotification && (
              <div className="notification">
                <span>{`${senderName} ${handleNotificationState()} your Post`}</span>
              </div>
            )}
          </div>
          <div className="cardsContainer">
            {posts.map((elm) => (
              <Card
                key={elm.id}
                data={elm}
                socket={socket}
                user={user}
                notificationData={notificationData}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
