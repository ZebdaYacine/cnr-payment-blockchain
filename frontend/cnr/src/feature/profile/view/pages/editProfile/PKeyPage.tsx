import { useParams } from "react-router";
import PKeyComponents from "../../../../../core/components/PKeyComponents";
import AddPKeyForm from "../../../../../core/components/AddPkeyComponent";
import { useUser } from "../../../../../core/state/UserContext";
import { HandleDateTime } from "../../../../../services/Utils";
import AddPRKComponent from "../../../../../core/components/AddPRKComponent";
import NotFound from "../../../../../core/components/NotFound";

const PKeyPage = () => {
  const { action } = useParams();
  const { userSaved } = useUser();

  return (
    <div className=" mt-7 ">
      {action === "get-public-key" ? (
        <PKeyComponents
          email={userSaved.email}
          hash={userSaved.publicKey.slice(26, 140)}
          addedDate={HandleDateTime(new Date(userSaved.createAt))}
          onDelete={() => alert("You clicked delete")}
        />
      ) : action == "add-public-key" ? (
        <AddPKeyForm />
      ) : action == "add-private-key" ? (
        <AddPRKComponent />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default PKeyPage;
