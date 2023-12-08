import React, { useState } from 'react';
import axios from '../../axios/api';

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
		formData.append('image', selectedFile[0]);

		try {
		const response = await axios.patch('/users/edit', formData, {
			headers: {
			'Content-Type': 'multipart/form-data'
			}
		});
		console.log('File uploaded successfully:', response.data);
		} catch (error) {
		console.error('Error uploading file:', error);
		}
	}
	};

	return (
	<div>
		<input className="text-sm" type="file" onChange={handleFileChange} />
		<button className="text-sm" onClick={handleUpload}>Upload</button>
	</div>
	);
};

export default FileUpload;
