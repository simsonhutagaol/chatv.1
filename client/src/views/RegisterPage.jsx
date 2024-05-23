import Swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function handleRegister(event) {
    event.preventDefault();
    try {
      await axios.post(`https://chat-api.simson.id/register`, {
        name,
        userName,
        password,
      });
      navigate("/login");
      Swal.fire({
        icon: "success",
        title: "Registration successful",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
      });
    }
  }
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="max-w-2xl mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl xl:text-5xl dark:text-black">
              Register now!
            </h1>
            <p className="py-6 text-xl">
              Lively chat with friends. Where people come to get connected, send
              and receive chat. Enjoy{" "}
              <span className="font-bold">ChatSync</span> anytime, anywhere, in
              real-time, for free.
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-md shadow-2xl bg-base-100">
            <form className="card-body">
              <IoArrowBackCircle
                className="w-6 h-6 outline-none cursor-pointer text-white bg-teal-700 hover:bg-teal-600 focus:ring-4 focus:ring-teal-300"
                onClick={() => navigate("/")}
              />
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="name"
                  className="input input-bordered"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="username"
                  className="input input-bordered"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="label m-auto">
                  <p>
                    Already have an account? &nbsp;
                    <span
                      onClick={() => navigate("/login")}
                      className="link link-primary"
                    >
                      Login to your account
                    </span>
                  </p>
                </label>
              </div>
              <div className="form-control mt-6">
                <button
                  className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none dark:focus:ring-teal-800"
                  onClick={handleRegister}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
