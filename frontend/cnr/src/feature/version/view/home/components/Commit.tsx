function Commit() {
  return (
    <>
      <div
        className="card border h-50 p-1 
            hover:border-gray-700 hover:shadow-lg hover:bg-base-100 
             transition-all duration-300 cursor-pointer"
      >
        <div className="flex flex-col">
          <p className="text-sm font-bold">Adding new version for CCR Tipaza</p>
          <div className="flex flex-row mt-1">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <div className="flex flex-col p-2">
              <p className="text-xs">
                <span className="font-bold">ZebdaYacine </span>
                committed on
                <span className="font-bold"> 24-12-2024</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Commit;
