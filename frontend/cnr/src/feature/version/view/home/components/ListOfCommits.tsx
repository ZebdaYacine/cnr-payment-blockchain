import Commit from "./Commit";

function ListOdCommits() {
  return (
    <>
      <div className="flex  flex-col  h-full">
        <h1 className="text-2xl font-bold">List of Commits:</h1>
        <div className="divider divider-info" />
        <div className="space-y-2  max-h-full overflow-y-auto ">
          {" "}
          {[...Array(30)].map((_, index) => (
            <Commit
              key={index}
              commit={{
                ID: "12231",
                Body: "Adding new version for this file",
                User: {
                  id: "",
                  password: "",
                  permission: "",
                  idInstituion: "",
                  email: "",
                  username: "Zebda Yacine",
                  workAt: "",
                  type: "",
                  wilaya: "",
                },
                Time: "2025-03-17",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ListOdCommits;
