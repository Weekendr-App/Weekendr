import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";
import Image from "next/image";
import { FC, useCallback, useRef, useState } from "react";
import { Spinner } from "../Spinner";
import Button from "./Button";

interface Props {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onError: (name: string, error: string) => void;
  label?: string;
  error?: string;
}

const FileUpload: FC<Props> = ({
  name,
  value,
  onChange,
  label,
  error,
  onError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openFileUpload = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsUploading(true);
      const storage = getStorage();
      const file = e.target.files?.[0];
      if (!file) {
        setIsUploading(false);
        return;
      }

      try {
        const storageRef = ref(storage, `images/${file.name}`);
        const uploaded = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(uploaded.ref);

        onChange({
          target: {
            name,
            value: url,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      } catch (error: unknown) {
        const message = (error as Error).message ?? "An unknown error occured";
        onError(name, message);
      } finally {
        setIsUploading(false);
      }
    },
    [name, onChange, onError]
  );

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="font-bold">
          {label}
        </label>
      )}
      <div className="mb-2">
        {isUploading ? (
          <Spinner />
        ) : (
          value && (
            <Image
              src={value}
              alt="Venue"
              className="w-16 h-16"
              width={64}
              height={64}
              unoptimized
            />
          )
        )}
        {error && <span className="mt-2 text-red-500 italic">{error}</span>}
      </div>
      <Button loading={isUploading} onClick={openFileUpload}>
        Upload
      </Button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        name={name}
        id={name}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
