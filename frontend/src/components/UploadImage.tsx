import Image from "next/image";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";

interface UploadImageProps {
  adPicture?: string;
  inputFile: File | null;
  setInputFile: Dispatch<SetStateAction<File | null>>;
}

export default function UploadImage({
  adPicture,
  inputFile,
  setInputFile,
}: UploadImageProps) {
  function handleInputFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const file = e.target.files[0];

    setInputFile(file);
  }

  return (
    <div className="w-full max-w-xs form-control">
      <label className="label" htmlFor="picture">
        <span className="label-text">Image</span>
      </label>
      <input
        defaultValue={adPicture}
        type="text"
        name="picture"
        id="picture"
        // required
        placeholder="https://imageshack.com/zoot.png"
        className="w-full max-w-xs input input-bordered"
      />
      <div className="flex flex-col items-center justify-center w-full p-3 mt-2 bg-white border rounded-lg border-1">
        <input type="file" onChange={handleInputFile} />
        {inputFile && (
          <Image
            src={URL.createObjectURL(inputFile)}
            alt="uploded picture"
            width={150}
            height={100}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
}
