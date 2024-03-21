import React from "react";
import Image from "next/image";
import FilePreview from "./FilePreview";
// const fs = require("fs");
const axios = require("axios");
// const FormData = require("form-data");
const DropZone = ({ data, dispatch }) => {
  // onDragEnter sets inDropZone to true
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDragLeave sets inDropZone to false
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };

  // onDragOver sets inDropZone to true
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // get files from event on the dataTransfer object as an array
    let files = [...e.dataTransfer.files];

    // ensure a file or files are dropped
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = data.fileList.map((f) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      // dispatch action to add droped file or files to fileList
      dispatch({ type: "ADD_FILE_TO_LIST", files });
      // reset inDropZone to false
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    }
  };
  // to handle file uploads
  const uploadFiles = async () => {
    // get the files from the fileList as an array
    let files = data.fileList;
    // initialize formData object
    const formData = new FormData();
    // loop over files and add to formData
    // files.forEach((file) => formData.append("files", file));
    formData.append("file", files[0]);

    // Upload the files as a POST request to the server using fetch
    // Note: /api/fileupload is not a real endpoint, it is just an example
    const response = await fetch("https://ashva.pythonanywhere.com/upload", {
      method: "POST",
      body: formData,
    })
      // axios
      //   .post("https://ashva.pythonanywhere.com/upload", formData, {
      //     headers: {
      //       ...formData.getHeaders(),
      //     },
      //     data: mdata,
      //   })
      .then((response) => {
        const resp = response.data;
        console.log(resp); // Full response by server, dictionary with keys: status, message, status_code, server_response, filename

        console.log(resp.message); // this is the AI chatbot response
        console.log(resp.server_response); // three js model provided by server, this is what we want
      });

    // // Upload the files as a POST request to the server using fetch
    // // Note: /api/fileupload is not a real endpoint, it is just an example
    // const response = await fetch("/api/fileupload", {
    //   method: "POST",
    //   body: formData,
    // });

    // //successful file upload
    // if (response.ok) {
    //   alert("Files uploaded successfully");
    // } else {
    //   // unsuccessful file upload
    //   alert("Error uploading files");
    // }
  };
  return (
    <>
      <div
        className="dropzone max-w-[400px] mt-5 mx-auto"
        onDragEnter={(e) => handleDragEnter(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={(e) => handleDragLeave(e)}
        onDrop={(e) => handleDrop(e)}
      >
        {/* <input id="fileSelect" type="file" multiple className="files" /> */}
        {/* <label htmlFor="fileSelect">You can select multiple Files</label> */}
        <h3 className="uploadMessage text-2xl text-gray-500">
          Start typing, or drop your documents here
        </h3>
        <Image src="/img4.png" alt="upload" height={50} width={50} />
      </div>
      <FilePreview fileData={data} />
      {data.fileList.length > 0 && (
        <button className="uploadBtn" onClick={uploadFiles}>
          Upload
        </button>
      )}
    </>
  );
};

export default DropZone;
