import React, { useState, useEffect } from "react";
import ProjectFilesFile from "./File";
// import FileUpload from "../FileUpload/FileUpload";
import Modal from "react-modal";

const FilesList = ({ subgroup, detail, ...props }) => {
  const [isModalOpen, toggleIsModalOpen] = useState(false);

  useEffect(() => {
    Modal.setAppElement("#app");
  }, []);
  
  return (
    <div>
      <div>
        <h4 className="title is-7">{subgroup.publicName}</h4>
        <div>
          {subgroup.data.length > 0 &&
            subgroup.data.map((file, i) => (
              <ProjectFilesFile file={file} key={i} />
            ))}
          <button
           
            onClick={() => toggleIsModalOpen(!isModalOpen)}
          >
            Nahrát soubory
          </button>
        </div>
      </div>
      {/*<Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => toggleIsModalOpen(!isModalOpen)}
        contentLabel="Example Modal"
        className={`modal ${isModalOpen ? "is-active" : ""}`}
        overlayClassName="modal-background"
      >
        <div>
          <header>
            <p>
              nahrát: {subgroup.publicName}
            </p>
            <button
             
              aria-label="close"
              onClick={() => toggleIsModalOpen(!isModalOpen)}
            />
          </header>
          <section>
            <FileUpload model={subgroup.key} id={detail.id_akce} />
          </section>
          <footer>
            <div>
              <button>Nahrát soubory</button>
              <button
               
                onClick={() => toggleIsModalOpen(!isModalOpen)}
              >
                Zrušit
              </button>
            </div>
          </footer>
        </div>
      </Modal>*/}
    </div>
  );
};

export default FilesList;
