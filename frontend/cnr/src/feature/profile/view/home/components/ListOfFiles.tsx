import { useNavigate } from "react-router";
import {
  ChildResponse,
  Data,
  // Institution,
  // InstitutionResponse,
} from "../../../data/dtos/ProfileDtos";
// import SelectedInstitution from "./SelectedInstitution";
import ListOfChildern from "./ListOfInstitutions";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import { useEffect } from "react";
import { useUserId } from "../../../../../core/state/UserContext";
interface ListOfFilesProps {
  files: Data[];
}

const dataSource = new ProfileDataSourceImpl();
const repository = new ProfileRepositoryImpl(dataSource);
const profileUseCase = new PofileUseCase(repository);

function ListOfFiles({ files }: ListOfFilesProps) {
  const navigate = useNavigate();

  const handleRowClick = (file: Data) => {
    console.log("File clicked:", file);
    navigate("/versions-file");
  };
  const { workAt, idInstituion } = useUserId();

  // const [listOfInstituations, setlistOfInstituations] = useState<Institution[]>(
  //   []
  // );

  const {
    // GetInstituations,
    // institutionData,
    // isInstituaionsSuccss,
    GetChildInstituations,
    childInstitutionData,
    isChildInstituaionsSuccss,
  } = useProfileViewModel(profileUseCase);

  useEffect(() => {
    if (workAt && idInstituion) {
      console.log({ id: idInstituion, name: workAt });
      GetChildInstituations({ id: idInstituion, name: workAt });
    }
  }, [workAt, idInstituion]);

  useEffect(() => {
    if (childInstitutionData && isChildInstituaionsSuccss) {
      const d = childInstitutionData as ChildResponse;
      console.log(d.data || []);
    }
  }, [childInstitutionData, isChildInstituaionsSuccss]);

  // useEffect(() => {
  //   if (isInstituaionsSuccss && institutionData) {
  //     const d = institutionData as InstitutionResponse;
  //     setlistOfInstituations(d.data || []);
  //   }
  // }, [institutionData, isInstituaionsSuccss]);

  return (
    <>
      <div className="mt-4 w-full">
        <div className="card bg-base-300 shadow-xl w-full">
          <div className="card-body">
            <div className="flex flex-col">
              <div className="flex flex-row justify-between">
                <h2 className="card-title text-center">
                  List of Uploaded Files
                </h2>
                {/* <SelectedInstitution institutions={listOfInstituations} /> */}
              </div>
              <div className="divider divider-primary" />
              <ListOfChildern />
            </div>
            <div className="divider divider-primary" />

            <div className="overflow-x-auto">
              <table className="table table-auto">
                <thead>
                  <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">File</th>
                    <th className="text-center">User</th>
                    <th className="text-center">Time</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Version</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file.ID}
                      className="cursor-pointer hover"
                      onClick={() => handleRowClick(file)}
                    >
                      <td className="text-center ">{file.ID}</td>
                      <td className="text-center">{file.FileName}</td>
                      <td className="text-center">{file.UserID}</td>
                      <td className="text-center">{file.Time}</td>
                      <td className="text-center">
                        <div
                          className={`badge ${
                            file.Status === "Valid"
                              ? "badge-accent"
                              : "badge-secondary"
                          }`}
                        >
                          {file.Status}
                        </div>
                      </td>
                      <td className="text-center">
                        <div
                          className={`badge ${
                            file.Version > 1
                              ? "badge-secondary"
                              : "badge-accent"
                          }`}
                        >
                          {file.Version} version
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListOfFiles;
