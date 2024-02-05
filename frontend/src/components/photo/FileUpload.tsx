import React, { useState } from "react";
import axios from "../../axios/api";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile[0]);
      try {
        const response = await axios.patch("/users/add-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await axios.post(`achievements/add/${6}`);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div>
      <input className="ml-6 block w-full mb-5 text-xs text-gray-900 rounded-lg cursor-pointer bg-transparent dark:text-lilac focus:outline-none focus:bg-purple dark:bg-purple placeholder:bg-purple" id="small_size" type="file" onChange={handleFileChange} />
      <button className="text-sm ml-6 px-4 py-1 bg-purple rounded-md" onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
