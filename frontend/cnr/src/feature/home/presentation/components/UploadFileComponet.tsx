function UploadFileComponet() {
  return (
    <>
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">
            <div className="badge badge-warning">No File </div>
          </h2>
          <div className="card-actions">
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            />{" "}
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadFileComponet;
