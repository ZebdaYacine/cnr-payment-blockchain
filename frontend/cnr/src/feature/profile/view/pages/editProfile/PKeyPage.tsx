import { useParams } from "react-router";
import PKeyComponents from "../../../../../core/components/PKeyComponents";
import AddPKeyForm from "../../../../../core/components/AddPkeyComponent";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";

const PKeyPage = () => {
  const { action } = useParams();
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  return (
    <div className=" mt-7 ">
      {action === "get-keys" ? (
        <PKeyComponents
          email="zebdaadam1996@gmail.com"
          hash="SHA256:q2apJ+ILb/JYChakH16ivSj7jf/YOLWGPJ2x0d+11xk"
          addedDate="Mar 13, 2025"
          onDelete={() => alert("You clicked delete")}
        />
      ) : (
        <AddPKeyForm />
      )}
    </div>
  );
};

export default PKeyPage;
