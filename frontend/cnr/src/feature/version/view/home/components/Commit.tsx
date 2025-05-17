import { CommitData } from "../../../data/dtos/VersionsDtos";

interface CommitProps {
  commit: CommitData;
}

function Commit({ commit: commit }: CommitProps) {
  return (
    <>
      <div
        className="card border h-50 p-1 
            hover:border-gray-700 hover:shadow-lg hover:bg-base-100 
             transition-all duration-300 cursor-pointer"
      >
        <div className="flex flex-col">
          <p className="text-sm font-bold">{commit.Body}</p>
          <div className="flex flex-row mt-1">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <div className="flex flex-col p-2">
              <p className="text-xs">
                <span className="font-bold">{commit.User.username} </span>
                committed on
                <span className="font-bold"> {commit.Time}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Commit;
