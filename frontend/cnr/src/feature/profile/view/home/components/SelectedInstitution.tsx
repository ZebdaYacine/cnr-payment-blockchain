import { ChildResponse, Institution } from "../../../data/dtos/ProfileDtos";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import { useEffect, useState } from "react";
import { useChild } from "../../../../../core/state/InstitutionContext";

interface ListOfInstitutionProps {
  institutions: Institution[];
}

const dataSource = new ProfileDataSourceImpl();
const repository = new ProfileRepositoryImpl(dataSource);
const profileUseCase = new PofileUseCase(repository);

function SelectedInstitution({ institutions }: ListOfInstitutionProps) {
  const { SetChild } = useChild();
  const [institution, setInstitution] = useState<Institution>({
    ID: "",
    Name: "",
  });

  const {
    GetChildInstituations,
    childInstitutionData,
    isChildInstituaionsSuccss,
  } = useProfileViewModel(profileUseCase);

  const handleInstitutionSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = event.target.value;
    const selectedInstitution = institutions.find(
      (inst) => inst.ID === selectedId
    );

    if (selectedInstitution) {
      setInstitution({
        ID: selectedInstitution.ID,
        Name: selectedInstitution.Name,
      });

      console.log("Selected Institution:", selectedInstitution);

      GetChildInstituations({ id: selectedInstitution.ID });
    }
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
      value={institution.ID}
    >
      <option value="" disabled>
        Select Institution
      </option>
      {institutions.map((inst) => (
        <option key={inst.ID} value={inst.ID}>
          {inst.Name}
        </option>
      ))}
    </select>
  );
}

export default SelectedInstitution;
