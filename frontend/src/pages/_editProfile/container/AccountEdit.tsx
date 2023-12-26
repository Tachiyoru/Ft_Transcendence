import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { FaUser } from "react-icons/fa6";
import axios from "../../../axios/api";
import Cookies from "js-cookie";
import FileUpload from "../../../components/photo/FileUpload";

interface IdataRegister {
  username: string;
  email: string;
}

const AccountEdit = () => {
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    watch,
  } = useForm<IdataRegister>();

  const { username, email } = watch();

  const submitHandler = async () => {
    try {
      setLoading(true);
      const filteredData: Partial<IdataRegister> = {};

      if (username) {
        filteredData.username = username;
        console.log("username : ", filteredData.username);
      }

      if (email) {
        filteredData.email = email;
        console.log("email : ", filteredData.email);
      }

      await axios.patch("/users/edit", filteredData);

      console.log("User data updated successfully:", filteredData);
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-2">
      {/*TITLE*/}
      <div className="text-lilac mt-4">
        <h2>Profile and account</h2>
        <p className="text-xs">Manage profile preferences</p>
      </div>

      {/*PHOTO*/}
      <div className="text-lilac mt-4 flex flex-row items-center">
        <div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center mr-4">
          <FaUser className="w-[30px] h-[30px] text-lilac" />
        </div>
        <div>
          <FileUpload />
        </div>
      </div>

      {/*CHANGE*/}
      <form onSubmit={handleSubmit(submitHandler)} className="mt-6">
        <div className="flex flex-row w-60 items-center border-lilac border-b">
          <AiOutlineUser className="w-4 h-4 text-lilac" />
          <input
            type="text"
            id="name"
            {...register("username", {
              minLength: {
                value: 1,
                message: "Name length must be at least 1 character:",
              },
            })}
            placeholder="Enter name"
            className="px-5 py-3 text-sm text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
          />
        </div>

        <div className="flex flex-row w-60 items-center border-b border-lilac">
          <AiOutlineMail className="w-4 h-4 text-lilac" />
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Please enter a valid email",
              },
            })}
            placeholder="Email"
            className="px-5 py-3 text-sm text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!isValid}
          className="mt-4 border text-sm bg-lilac py-2 px-5 rounded mb-6 disabled:opacity-40"
        >
          Save changes
        </button>
      </form>

      {/*DELETE ACCOUNT*/}
      <p
        className="text-xs text-lilac pt-2 underline"
        style={{ cursor: "pointer" }}
      >
        Delete Account
      </p>
    </div>
  );
};

export default AccountEdit;
