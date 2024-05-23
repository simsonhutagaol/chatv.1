import { useContext, useEffect, useState } from "react";
import { BsSend } from "react-icons/bs";
import { TiMessages } from "react-icons/ti";
import { MessageContext } from "../../contexts/MessageContext";
import Swal from "sweetalert2";

export default function MessageContainer({ socket }) {
  const { name } = useContext(MessageContext);
  const [messageSent, setMessageSent] = useState("");
  const [messages, setMessages] = useState([]);

  // Event handler untuk mengirim pesan
  const sendMessage = (e) => {
    e.preventDefault();
    if (messageSent.trim() === "") return;

    // Mengirim pesan ke server
    socket.emit("private message", {
      content: messageSent,
      to: name.card.userID,
    });

    // Menambahkan pesan yang dikirim ke daftar pesan yang ada
    setMessages([
      ...messages,
      { content: messageSent, fromID: socket.id, to: name.card.userID },
    ]);

    setMessageSent("");
  };
  const showNotification = (message, from) => {
    Swal.fire({
      title: `From : ${from}`,
      text: `Message: ${message}`,
      icon: 'info',
      timer: 3000,
      timerProgressBar: true,
      toast: true,
      position: 'top-end',
      showConfirmButton: false
    });
  };

  useEffect(() => {
    socket.on("private message", ({ content, to, from, fromID }) => {
      if (socket.id == to) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: content, from: from, fromID: fromID, to: to },
        ]);
        showNotification(content, from)
      }
    });

    return () => {
      socket.off("private message");
    };
  }, [socket]);

  if (!name) {
    return (
      <>
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
            <p>Welcome 👋</p>
            <p>Select a chat to start messaging</p>
            <TiMessages className="text-3xl md:text-6xl text-center" />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="md:min-w-[450px] flex flex-col">
      <div className="bg-slate-500 px-4 py-2 mb-2">
        <span className="label-text text-white font-bold">To : </span>{" "}
        <span className="text-white font-medium">{name.card.username}</span>
      </div>
      <div className="px-4 flex-1 overflow-auto">
        {messages.map((message, index) => (
          <div key={index}>
            {message.fromID == name.card.userID ||
              (message.fromID == socket.id && message.to == name.card.userID) ? (
              <>
                <div
                  className={
                    message.fromID == socket.id
                      ? "chat chat-end"
                      : "chat chat-start"
                  }
                >
                  <div className="text-white">
                    {message.fromID == socket.id ? "You" : null}
                  </div>
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src={
                          message.fromID == socket.id
                            ? `${`https://avatar.iran.liara.run/username?username=you`}`
                            : `${`https://avatar.iran.liara.run/username?username=${name.card.username}`}`
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={`chat-bubble text-white ${message.fromID == socket.id ? "chat-bubble-accent" : ""
                      }   pb-2`}
                  >
                    {message.content}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
      <form className="px-4 my-3" onSubmit={sendMessage}>
        <div className="w-full relative">
          <input
            type="text"
            className="border text-sm rounded-lg block w-full p-2.5  bg-slate-100 border-gray-600"
            placeholder={
              name.card.online
                ? "Send a message"
                : `${name.card.username} is offline`
            }
            disabled={name.card.online ? false : true}
            value={messageSent}
            onChange={(e) => setMessageSent(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-0 end-0 flex items-center pe-3"
          >
            <BsSend />
          </button>
        </div>
      </form>
    </div>
  );
}
