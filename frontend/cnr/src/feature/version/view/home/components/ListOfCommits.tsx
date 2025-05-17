import { VersionData } from "../../../data/dtos/VersionsDtos";
import Commit from "./Commit";

interface ListOfCommitProps {
  commits: VersionData[];
}

function ListOdCommits({ commits: commits }: ListOfCommitProps) {
  return (
    <>
      <div className="flex  flex-col  h-full">
        <h1 className="text-2xl font-bold">List des Commits:</h1>
        <div className="divider divider-info" />
        <div className="space-y-2  max-h-full overflow-y-auto ">
          {" "}
          {commits.map((commit) => (
            <Commit
              key={commit.ID}
              commit={{
                ID: commit.ID,
                Body: commit.Commit,
                User: {
                  id: "",
                  email: "",
                  password: "",
                  username: commit.UserID,
                  idInstituion: "",
                  workAt: "",
                  type: "",
                  permission: "",
                  wilaya: "",
                  publicKey: "",
                  privateKey: "",
                  createAt: "",
                  phases: [],
                  last_name: "",
                  first_name: "",
                  avatar: "",
                },
                Time: commit.Time,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ListOdCommits;
