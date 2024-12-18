import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

const { ourFileRouter } = require("~/app/api/uploadthing/core");

// Generate upload button without TypeScript generic type
const UploadButton = generateUploadButton(ourFileRouter);

// Generate upload dropzone without TypeScript generic type
const UploadDropzone = generateUploadDropzone(ourFileRouter);

module.exports = {
  UploadButton,
  UploadDropzone,
};