import { useParams } from "react-router";
import PKeyComponents from "../../../../../core/components/PKeyComponents";
import AddPKeyForm from "../../../../../core/components/AddPkeyComponent";
import { useUser } from "../../../../../core/state/UserContext";
import { HandleDateTime } from "../../../../../services/Utils";

const PKeyPage = () => {
  const { action } = useParams();
  const { userSaved } = useUser();
  return (
    <div className=" mt-7 ">
      {action === "get-keys" ? (
        <PKeyComponents
          email={userSaved.email}
          hash={userSaved.publicKey}
          addedDate={HandleDateTime(new Date(userSaved.createAt))}
          onDelete={() => alert("You clicked delete")}
        />
      ) : (
        <AddPKeyForm />
      )}
    </div>
  );
};

export default PKeyPage;
