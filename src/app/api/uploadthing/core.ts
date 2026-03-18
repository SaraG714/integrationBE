import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => ({ uploadedBy: "user" }))
    .onUploadComplete(({ file }) => {
      console.log("Upload complete:", file.ufsUrl);
    }),

  videoUploader: f({ video: { maxFileSize: "64MB", maxFileCount: 1 } })
    .middleware(() => ({ uploadedBy: "user" }))
    .onUploadComplete(({ file }) => {
      console.log("Upload complete:", file.ufsUrl);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
