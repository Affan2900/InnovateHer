import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import { ourFileRouter } from "@/app/api/uploadthing/core";

// Generate upload button without TypeScript generic type
export const UploadButton = generateUploadButton(ourFileRouter);

// Generate upload dropzone without TypeScript generic type
export const UploadDropzone = generateUploadDropzone(ourFileRouter);