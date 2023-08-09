import cropImage from "@weekendr/src/utils/cropImage";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";
import Image from "next/image";
import { FC, lazy, Suspense, useCallback, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import ReactModal from "react-modal";
import { Spinner } from "@weekendr/src/components/Spinner";

interface Props {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onError: (name: string, error: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const Button = lazy(() => import("@weekendr/src/components/Form/Button"));

const FileUpload: FC<Props> = ({
  name,
  value,
  disabled,
  onChange,
  label,
  error,
  onError,
}) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const onCloseModal = () => setOpen(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<Area | undefined>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<
    string | ArrayBuffer | null
  >(null);
  const [isUploading, setIsUploading] = useState(false);
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedImage(croppedAreaPixels);
    },
    []
  );

  const cropPhoto = useCallback(async () => {
    cropImage(croppedImageUrl, croppedImage as Area)
      .then(async (file) => {
        if (typeof file !== "string") {
          setIsUploading(true);
          const storage = getStorage();
          if (!file) {
            setIsUploading(false);
            return;
          }

          try {
            const storageRef = ref(storage, `images/${file.size}`);
            const uploaded = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(uploaded.ref);

            onChange({
              target: {
                name,
                value: url,
              },
            } as React.ChangeEvent<HTMLInputElement>);

            setOpen(false);
          } catch (error: unknown) {
            const message =
              (error as Error).message ?? "An unknown error occured";
            onError(name, message);
          } finally {
            setIsUploading(false);
          }
        }
      })
      .catch(console.error);
  }, [croppedImage, croppedImageUrl, name, onChange, onError]);

  const inputRef = useRef<HTMLInputElement>(null);

  const openFileUpload = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(true);
    setFile(e.target.files?.[0]);
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      setCroppedImageUrl(dataURL);
    };
    reader.readAsDataURL(e.target.files?.[0] as Blob);
  };

  return (
    <>
      <ReactModal
        ariaHideApp={false}
        isOpen={open}
        style={{
          overlay: { position: "absolute", top: "4rem" },
          content: { background: "#888" },
        }}
        onRequestClose={onCloseModal}
      >
        <div>
          {file && croppedImageUrl && (
            <Cropper
              image={croppedImageUrl as string}
              crop={crop}
              zoom={zoom}
              aspect={3 / 4}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </div>
        <div className="controls">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(Number(e.target.value));
            }}
            className="zoom-range"
          />
          <div className="flex gap-5">
            <Suspense fallback={<Spinner />}>
              <Button disabled={isUploading} onClick={onCloseModal}>
                Cancel
              </Button>
            </Suspense>
            <Suspense fallback={<Spinner />}>
              <Button disabled={isUploading} onClick={cropPhoto}>
                Crop
              </Button>
            </Suspense>
          </div>
        </div>
      </ReactModal>
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
                className="rounded"
                alt="Venue"
                width={128}
                height={128}
              />
            )
          )}
          {error && <span className="mt-2 text-red-500 italic">{error}</span>}
        </div>
        <Suspense fallback={<Spinner />}>
          <Button
            type="button"
            loading={isUploading}
            disabled={isUploading || disabled}
            onClick={openFileUpload}
          >
            Upload
          </Button>
        </Suspense>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          name={name}
          id={name}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </>
  );
};

export default FileUpload;
