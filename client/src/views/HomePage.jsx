import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";

export default function HomePage({ socket }) {
  return (
    <>
      <div
        className="w-full min-h-screen"
        style={{
          backgroundImage:
            "url(https://i.pinimg.com/564x/74/6b/56/746b56945686154e7f2e7259efd29999.jpg)",
        }}
      >
        <div className="p-4 h-screen flex items-center justify-center">
          <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-teal-600 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-80">
            <Sidebar socket={socket} />
            <MessageContainer socket={socket} />
          </div>
        </div>
      </div>
    </>
  );
}
