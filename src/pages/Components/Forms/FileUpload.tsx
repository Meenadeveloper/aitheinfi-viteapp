import  {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Dropzone from "react-dropzone";
import type { FileWithPath } from "react-dropzone";
import pdfImage from "../../../assets/images/new-document.png";
import { UploadCloud } from "lucide-react";

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

const FileUpload = forwardRef<any, FileUploadProps>(
  (
    {
      files,
      onFilesChange,
      className = "",
      error,
      multiple = false,
      maxFiles = 10,
      autoFocus = false,
      label,
    },
    ref
  ) => {
    const dropzoneRef = useRef<HTMLDivElement>(null);

    // Expose focus method via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (dropzoneRef.current) {
          dropzoneRef.current.focus();
        }
      },
    }));

    // // Handle autofocus
    // useEffect(() => {
    //   if (autoFocus && dropzoneRef.current) {
    //     setTimeout(() => {
    //       dropzoneRef.current?.focus();
    //     }, 100);
    //   }
    // }, [autoFocus]);

    // Handle autofocus - more aggressive approach
    useEffect(() => {
      if (autoFocus) {
        // Multiple attempts with different delays
        const focusAttempts = [50, 150, 300, 500];

        focusAttempts.forEach((delay) => {
          setTimeout(() => {
            if (dropzoneRef.current) {
              dropzoneRef.current.focus();
              // Scroll into view for better UX
              dropzoneRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, delay);
        });
      }
    }, [autoFocus]);

    // Also handle focus when component mounts and autoFocus is true
    useEffect(() => {
      if (autoFocus && dropzoneRef.current) {
        // Ensure DOM is fully rendered
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (dropzoneRef.current) {
              dropzoneRef.current.focus();
            }
          }, 100);
        });
      }
    }, []); // Run only on mount

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

    // Add to FileUpload component for debugging
    useEffect(() => {
      console.log("FileUpload mounted, autoFocus:", autoFocus);
      console.log("Dropzone ref current:", !!dropzoneRef.current);
    }, []);

    useEffect(() => {
      console.log("AutoFocus changed:", autoFocus);
      if (autoFocus) {
        console.log("Attempting to focus dropzone...");
      }
    }, [autoFocus]);

    return (
      <div className={className}>
        {label && (
          <label className="inline-block mb-2 text-base font-medium">
            {label}
          </label>
        )}
        <Dropzone onDrop={handleDrop} multiple={multiple} maxFiles={maxFiles}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              ref={dropzoneRef}
              tabIndex={0}
              className={`flex flex-col items-center justify-center p-5 border border-dashed rounded-md cursor-pointer bg-white dark:bg-zink-700 focus:outline-none focus:ring-2 focus:ring-custom-100 ${
                error
                  ? "border-red-500 dark:border-red-500"
                  : "border-slate-200 dark:border-zink-500 focus:border-custom-500"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mb-5 text-slate-500 dark:text-zink-200" />
              <p className="text-center text-sm text-slate-500 dark:text-zink-200">
                Drag and drop files here or browse
              </p>
            </div>
          )}
        </Dropzone>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {/* <ul className="flex flex-wrap gap-4 mt-4">
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
        </ul> */}

        <ul className="mb-0" id="dropzone-preview">
          {files.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const isDoc =
              file.type === "application/pdf" ||
              file.type === "application/msword" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            // Add other doc MIME types as needed

            // Image UI
            if (isImage) {
              return (
                <>
                  <li
                    className="mt-2"
                    id="dropzone-preview-list"
                    key={`${file.name}-${index}`}
                  >
                    <div className="border rounded border-slate-200 dark:border-zink-500">
                      <div className="flex p-2">
                        <div className="shrink-0 me-3">
                          <div className="p-2 rounded-md size-14 bg-slate-100 dark:bg-zink-600">
                            <img
                              data-dz-thumbnail
                              className="block w-full h-full rounded-md"
                              src={file.preview}
                              alt={file.name}
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="grow max-w-[280px]">
                          <div className="pt-1">
                            <h5 className="mb-1 text-15 truncate" data-dz-name>
                              {file.name}
                            </h5>
                            <p
                              className="mb-0 text-slate-500 dark:text-zink-200 truncate"
                              data-dz-size
                            >
                              {file.formattedSize}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 ms-3">
                          <button
                            data-dz-remove
                            className="px-2 py-1.5 text-xs text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20"
                            onClick={() => handleRemove(index)}
                            aria-label={`Remove file ${file.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              );
            }

            // PDF/Word/DOC UI
            if (isDoc) {
              return (
                <>
                  <li
                    className="mt-2"
                    id="dropzone-preview-list"
                    key={`${file.name}-${index}`}
                  >
                    <div className="border rounded border-slate-200 dark:border-zink-500">
                      <div className="flex p-2">
                        <div className="shrink-0 me-3">
                          <div className="p-2 rounded-md size-14 bg-slate-100 dark:bg-zink-600">
                            <img
                              data-dz-thumbnail
                              className="block w-full h-full rounded-md"
                              src={pdfImage || file.preview}
                              alt={file.name}
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="grow max-w-[280px]">
                          <div className="pt-1">
                            <h5 className="mb-1 text-15 truncate" data-dz-name>
                              {file.name}
                            </h5>
                            <p
                              className="mb-0 text-slate-500 dark:text-zink-200 truncate"
                              data-dz-size
                            >
                              {file.formattedSize}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 ms-3">
                          <button
                            data-dz-remove
                            className="px-2 py-1.5 text-xs text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20"
                            onClick={() => handleRemove(index)}
                            aria-label={`Remove file ${file.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              );
            }

            // Fallback for other file types
            return (
              <li
                key={`${file.name}-${index}`}
                className="w-24 border rounded-md dark:border-zink-500"
              >
                <div className="p-2">
                  <div className="flex items-center justify-center w-full h-24 bg-gray-100 dark:bg-zink-600 rounded-md">
                    <p className="text-xs text-center break-all">{file.name}</p>
                  </div>
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
            );
          })}
        </ul>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
