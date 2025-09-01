import React, { useEffect } from "react";
import Dropzone from "react-dropzone";
import type { FileWithPath } from "react-dropzone";

import { UploadCloud } from "lucide-react";

// Extend FileWithPath to add preview URL and formatted size metadata
// interface FileWithPreview extends FileWithPath {
//   preview: string;
//   formattedSize: string;
// }

export interface FileWithPreview extends FileWithPath {
  preview: string;
  formattedSize: string;
}


interface FileUploadProps {
  label?: string;
  files: FileWithPreview[];
  onFilesChange: (files: FileWithPreview[]) => void;
  className?: string;
  error?: string;
  multiple?: boolean;
  maxFiles?: number;
  autoFocus?: boolean;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  className = "",
  error,
  multiple = false,
  maxFiles = 10,
  autoFocus = false,
  label,
}) => {
  // Handle newly dropped files
 const handleDrop = (acceptedFiles: FileWithPath[]) => {
   const updatedFiles = multiple
     ? [...files, ...acceptedFiles].slice(0, maxFiles)
     : acceptedFiles.slice(0, 1);

   const filesWithMeta: FileWithPreview[] = updatedFiles.map((file) =>
     Object.assign(file, {
       preview: URL.createObjectURL(file),
       formattedSize: formatBytes(file.size),
     })
   );
   onFilesChange(filesWithMeta);
 };


  // Remove a file by index
  const handleRemove = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  // Cleanup previews URLs on component unmount or files change
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className={className}>
      <label>{label}</label>
      <Dropzone onDrop={handleDrop} multiple={multiple} maxFiles={maxFiles}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            tabIndex={autoFocus ? 0 : undefined}
            className="flex flex-col items-center justify-center p-5 border border-dashed rounded-md cursor-pointer bg-white dark:bg-zink-700 dark:border-zink-500"
          >
            <input {...getInputProps()} />
            <UploadCloud className="mb-3 text-slate-500 dark:text-zink-200" />
            <p className="text-center text-lg text-slate-500 dark:text-zink-200">
              Drag and drop files here or browse
            </p>
          </div>
        )}
      </Dropzone>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <ul className="flex flex-wrap gap-4 mt-4">
        {files.map((file, index) => (
          <li
            key={`${file.name}-${index}`}
            className="w-24 border rounded-md dark:border-zink-500"
          >
            <div className="p-2">
              {file.type.startsWith("image/") ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="object-cover w-full h-24 rounded-md"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-24 bg-gray-100 dark:bg-zink-600 rounded-md">
                  <p className="text-xs text-center break-all">{file.name}</p>
                </div>
              )}
              <div className="mt-2 text-center">
                <p className="text-xs text-slate-500 dark:text-zink-200">
                  {file.formattedSize}
                </p>
                <button
                  type="button"
                  className="mt-1 px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                  onClick={() => handleRemove(index)}
                  aria-label={`Remove file ${file.name}`}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
