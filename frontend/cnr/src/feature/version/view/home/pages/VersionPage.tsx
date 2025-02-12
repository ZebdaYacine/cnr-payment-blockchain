import { useEffect } from "react";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import NavBarComponent from "../../../../../core/components/NavBar";
import { useUserId } from "../../../../../core/state/UserContext";
import ListOfVersion from "../components/ListOfVersion";
import ListOfCommits from "../components/ListOfCommits";
import { VersionData } from "../../../data/dtos/ProfileDtos";

function VersionPage() {
  const dataSource = new ProfileDataSourceImpl();
  const repository = new ProfileRepositoryImpl(dataSource);
  const profileUseCase = new PofileUseCase(repository);

  const { getProfile } = useProfileViewModel(profileUseCase);
  const { username, email, permission } = useUserId();

  const sampleVersions: VersionData[] = [
    {
      ID: "1",
      HashFile: "abc123",
      UserID: "user001",
      FileName: "report.pdf",
      Parent: "root",
      Note: 5,
      Action: "Created",
      Time: "2024-02-12 10:30",
      Organisation: "Tech Corp",
      Status: "Approved",
    },
    {
      ID: "2",
      HashFile: "xyz789",
      UserID: "user002",
      FileName: "document.docx",
      Parent: "root",
      Note: 4,
      Action: "Updated",
      Time: "2024-02-13 15:45",
      Organisation: "Finance Ltd",
      Status: "Pending",
    },
    {
      ID: "2",
      HashFile: "xyz789",
      UserID: "user002",
      FileName: "document.docx",
      Parent: "root",
      Note: 4,
      Action: "Updated",
      Time: "2024-02-13 15:45",
      Organisation: "Finance Ltd",
      Status: "Pending",
    },
    {
      ID: "2",
      HashFile: "xyz789",
      UserID: "user002",
      FileName: "document.docx",
      Parent: "root",
      Note: 4,
      Action: "Updated",
      Time: "2024-02-13 15:45",
      Organisation: "Finance Ltd",
      Status: "Pending",
    },
    {
      ID: "2",
      HashFile: "xyz789",
      UserID: "user002",
      FileName: "document.docx",
      Parent: "root",
      Note: 4,
      Action: "Updated",
      Time: "2024-02-13 15:45",
      Organisation: "Finance Ltd",
      Status: "Pending",
    },
    {
      ID: "2",
      HashFile: "xyz789",
      UserID: "user002",
      FileName: "document.docx",
      Parent: "root",
      Note: 4,
      Action: "Updated",
      Time: "2024-02-13 15:45",
      Organisation: "Finance Ltd",
      Status: "Pending",
    },
    {
      ID: "2",
      HashFile: "xyz789",
      UserID: "user002",
      FileName: "document.docx",
      Parent: "root",
      Note: 4,
      Action: "Updated",
      Time: "2024-02-13 15:45",
      Organisation: "Finance Ltd",
      Status: "Pending",
    },
    {
      ID: "2",
      HashFile: "xyz789",
      UserID: "user002",
      FileName: "document.docx",
      Parent: "root",
      Note: 4,
      Action: "Updated",
      Time: "2024-02-13 15:45",
      Organisation: "Finance Ltd",
      Status: "Pending",
    },
  ];

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {}, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBarComponent
        user={{
          username: username,
          email: email,
          permission: permission,
        }}
      />

      <div className="flex  space-y-2">
        <div className="flex flex-col w-1/4  border-r border-gray-300 p-3 overflow-scroll">
          <ListOfCommits />
        </div>
        <div className="flex flex-col w-3/4 ">
          <div className="h-3/4 border shadow overflow-scroll">
            <ListOfVersion version={sampleVersions} />
          </div>
          <div className=" h-1/4  p-3 space-y-2">
            <span className="font-bold ">
              {" "}
              Checksum: 23972987498399502319092183426593246343432434
            </span>
            <textarea
              className="textarea textarea-success w-full h-full"
              placeholder="Details about operation..."
              readOnly
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default VersionPage;
