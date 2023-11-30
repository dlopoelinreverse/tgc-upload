"use client";

import { useState } from "react";

export default function Uploader() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    const file = event.target.files[0];
    setUploadedFile(file);
  }

  async function handleUpload() {
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("file", uploadedFile);
    const upload = await fetch("http://localhost:8000/uploads", {
      method: "POST",
      body: formData,
    });
    const response = await upload.json();
    console.log(response);
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {uploadedFile && <img src={URL.createObjectURL(uploadedFile)} />}
      <button onClick={handleUpload}>Enregister</button>
    </div>
  );
}
