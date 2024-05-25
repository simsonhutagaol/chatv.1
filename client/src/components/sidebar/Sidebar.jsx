import Conversations from "./Conversations";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar({ socket }) {
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.clear();
    navigate("/");
    socket.disconnect();
  }

  useEffect(() => {
    // fetchUser()
    socket.auth = {
      token: localStorage.token,
    };

    socket.connect();

    socket.on("users", async (users) => {
      try {
        users.forEach((user) => {
          user.self = user.userID === socket.id;
        });

        const { data } = await axios.get("https://chat-api.simson.id/list");
        let finalUserList = [];
        for (let i = 0; i < data.length; i++) {
          let dbUser = data[i];

          let isSocketExists = false;
          let userSocket = {};
          for (let j = 0; j < users.length; j++) {
            let tempSocketUser = users[j];

            if (tempSocketUser.username == dbUser.userName) {
              isSocketExists = true;
              userSocket = tempSocketUser;
              break;
            }
          }

          let tempUser = {
            username: dbUser.userName,
            online: false,
            self: false,
            key: "",
            userID: "",
          };

          if (isSocketExists) {
            tempUser.userID = userSocket.userID;
            tempUser.username = userSocket.username;
            tempUser.key = userSocket.key;
            tempUser.self = userSocket.self;
            tempUser.online = true;
          }

          finalUserList.push(tempUser);
        }

        finalUserList = finalUserList.sort((a, b) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });
        setUsersList(finalUserList);
      } catch (err) {
        console.log(err);
      }
    });

    const handleUserConnected = (user) => {
      setUsersList((usersList) =>
        usersList.map((e) => {
          if (e.username === user.username) {
            e.online = true;
            e.key = user.key;
            e.userID = user.userID;
            e.self = false;
          }
          return e;
        })
      );

      setUsersList((usersList) => {
        const isExists = usersList.some((u) => u.username === user.username);
        if (!isExists) {
          user.online = true;
          user.self = false;
          return [...usersList, user];
        } else {
          return usersList;
        }
      });

    };

    const handleUserDisconnected = (user) => {
      setUsersList((usersList) =>
        usersList.map((e) => {
          if (e.username === user.username) {
            e.online = false;
            e.key = "";
            e.userID = "";
            e.self = false;
          }
          return e;
        })
      );
    };

    socket.on("user connected", handleUserConnected);
    socket.on("user disconnected", handleUserDisconnected);

    return () => {
      socket.off("user connected", handleUserConnected);
      socket.off("user disconnected", handleUserDisconnected);
    };
  }, [usersList, socket]);
  return (
    <>
      <div className="border-r border-slate-500 p-4 flex flex-col">
        <div>
          <img
            className="flex justify-center items-center m-auto h-20"
            src="https://storage.googleapis.com/chat-storage-123/logo-chatsync.png"
            alt="logo"
          />
        </div>
        <div className="w-96 overflow-auto">
          {usersList.map((e) => {
            return <Conversations key={e.username} card={e} />;
          })}
        </div>
        <div className="mt-auto">
          <BiLogOut
            className="w-6 h-6 text-white cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </div>
    </>
  );
}
