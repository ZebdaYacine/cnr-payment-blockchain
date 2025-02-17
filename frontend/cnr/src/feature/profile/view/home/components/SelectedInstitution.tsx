import { ChildResponse, Institution } from "../../../data/dtos/ProfileDtos";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import { useEffect, useState } from "react";
import { useChild } from "../../../../../core/state/InstitutionContext";
import { useUserId } from "../../../../../core/state/UserContext";

interface ListOfInstitutionProps {
  institutions: Institution[];
}

const dataSource = new ProfileDataSourceImpl();
const repository = new ProfileRepositoryImpl(dataSource);
const profileUseCase = new PofileUseCase(repository);

function SelectedInstitution({ institutions }: ListOfInstitutionProps) {
  const { workAt, idInstituion } = useUserId();
  const { SetChild } = useChild();
  const [institution, setInstitution] = useState<Institution>({
    id: "",
    name: "",
  });

  const {
    GetChildInstituations,
    childInstitutionData,
    isChildInstituaionsSuccss,
  } = useProfileViewModel(profileUseCase);

  const handleInstitutionSelect = () => {
    // const selectedId = event.target.value;
    // const selectedInstitution = institutions.find(
    //   (inst) => inst.ID === selectedId
    // );

    setInstitution({
      id: idInstituion,
      name: workAt,
    });
    console.log("idInstituion:", idInstituion);
    console.log("Selected Institution:", institution);

    GetChildInstituations({ id: institution.id, name: workAt });
  };

  useEffect(() => {
    if (childInstitutionData && isChildInstituaionsSuccss) {
      const d = childInstitutionData as ChildResponse;
      SetChild(d.data || []);
    }
  }, [childInstitutionData, isChildInstituaionsSuccss]);

  return (
    <select
      className="select select-primary w-full max-w-xs"
      onChange={handleInstitutionSelect}
      value={institution.id}
    >
      <option value="" disabled>
        Select Institution
      </option>
      {institutions.map((inst) => (
        <option key={inst.id} value={inst.id}>
          {inst.name}
        </option>
      ))}
    </select>
  );
}

export default SelectedInstitution;
