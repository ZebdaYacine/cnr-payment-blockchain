import { FaFileCirclePlus } from "react-icons/fa6";

import { ToastContainer } from "react-toastify";

function SelectFilesComponent() {
  const displayVersionModal = () => {
    const modal = document.getElementById("files") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      <div className="card-body items-center text-center">
        <div className="card-actions flex flex-col items-center gap-4">
          <label className="btn btn-primary flex items-center gap-2 cursor-pointer ">
            <FaFileCirclePlus />
            Select Files
            <input
              type="button"
              onClick={displayVersionModal}
              multiple
              className="hidden"
            />
          </label>
        </div>
      </div>
      <ToastContainer />
      <dialog id="modal" className="modal">
        <div className="modal-box p-8 shadow-lg">
          <h3 className="font-bold text-lg">File MetaData!</h3>
          <div className="modal-action mt-6">
            <form method="dialog">
              <button className="btn btn-primary" onClick={close}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default SelectFilesComponent;
