import React, { useContext, useState } from "react";
import axios from "../../axios/api";
import { WebSocketContext } from "../../socket/socket";

interface Users {
	username: string;
	avatar: string;
	id: number;
	status: string;
}
interface FileUploadProps {
  userData: Users;
  setUserData: (newUserData: Users) => void;
}

const FileUpload : React.FC<FileUploadProps> = ({ userData, setUserData }) => {
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [error, setError] = useState<string>('');
  const socket = useContext(WebSocketContext);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      let url;
      formData.append("image", selectedFile[0]);
      try {
        const response = await axios.patch("/users/add-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        url = response.data;
        await axios.post(`achievements/add/${6}`);
		socket.emit("all-update");
      } catch (error) {
        console.error("Error uploading file:", error);
        setError('Incorrect file')
      }
      if (url)
        setUserData({...userData, avatar: url});
    }
  };

  return (
    <div className="ml-6">
      <input className="mb-2 block w-full text-xs text-gray-900 rounded-lg cursor-pointer bg-transparent dark:text-lilac focus:outline-none focus:bg-purple dark:bg-purple placeholder:bg-purple" id="small_size" type="file" onChange={handleFileChange} />
      {error && <p className="text-red-orange text-xs ">{error}</p>}
      <button className="text-sm px-4 py-1 bg-purple rounded disabled:bg-dark-violet disabled:text-black" disabled={!selectedFile} onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
