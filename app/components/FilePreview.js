import React from "react";

const FilePreview = ({ fileData }) => {
  return (
    <div className="fileList">
      <div className="fileContainer">
        {/* loop over the fileData */}
        {fileData.fileList.map((f) => {
          return (
            <>
              <ol>
                <li key={f.lastModified} className="fileList">
                  {/* display the filename and type */}
                  <div key={f.name} className="fileName">
                    {f.name}
                  </div>
                </li>
              </ol>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default FilePreview;
