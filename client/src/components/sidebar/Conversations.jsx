import { useContext } from "react";
import { MessageContext } from "../../contexts/MessageContext";

// MessageContainer
export default function Conversations({ card }) {
  const { setName } = useContext(MessageContext);

  return (
    <div className="py-2 flex flex-col">
      <div
        className="flex gap-2 items-center hover:bg-accent rounded p-2 py-1 cursor-pointer"
        onClick={() => (!card.self ? setName({ card }) : null)}
      >
        <div className="avatar">
          <div
            className={`w-12 rounded-full ring  ${card.online ? "ring-warning" : "ring-error"
              }  ring-offset-base-100 ring-offset-2`}
          >
            <img
              src={`https://avatar.iran.liara.run/username?username=${card.username}`}
              alt="user avatar"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-lg text-gray-200">{card.username}</p>
            <span className="text-base">
              {card.self ? (
                <>
                  <p>My contact</p>
                </>
              ) : (
                <>
                  <p>{card.online ? '🟢online' : '🔴offline'}</p>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="divider my-0 py-0 h-1" />
    </div>
  );
}
