import { UploadCloud } from "lucide-react";
import React, { memo } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
  uploadOptions?: DropzoneOptions;
  children?: React.ReactNode;
}

const Dragger: React.FC<Props> = memo(({ uploadOptions, children }) => {
  const { getRootProps, getInputProps } = useDropzone({ ...uploadOptions });

  return (
    <>
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
        >
          {children ? (
            children
          ) : (
            <div className=" text-center">
              <div className=" border p-2 rounded-md max-w-min mx-auto">
                <UploadCloud size={20} />
              </div>

              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Drag files</span>
              </p>
              <p className="text-xs text-gray-500">
                Click to upload files &#40;files should be under 10 MB&#41;
              </p>
              <div className="flex justify-center items-center my-5 ">
                    <Button variant={"outline"} className="border-primary text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary">
                        Upload a file
                    </Button>
              </div>
            </div>
          )}
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
        />
      </div>
    </>
  );
});

Dragger.displayName = "Dragger";

export default Dragger;
