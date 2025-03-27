import { useParams } from "react-router-dom";
import { useListUsers } from "../../../../core/state/ListOfUsersContext";
import FolderPage from "../../../folder/view/home/pages/Folder";
import ListOfFolders from "../../../folder/view/home/components/ListOfFolders";

const PeerPage = () => {
  const { userId } = useParams();
  const { users } = useListUsers();

  if (!userId) {
    return <p>Utilisateur non trouvé.</p>;
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return <p>Aucun utilisateur trouvé avec cet ID.</p>;
  }

  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-4">Détails de l'utilisateur</h1>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Nom:</strong> {user.username}
      </p>
      <p>
        <strong>Type:</strong> {user.type}
      </p>
      <p>
        <strong>Structure:</strong> {user.workAt}
      </p>
      <p>
        <strong>Wilaya:</strong> {user.wilaya}
      </p> */}
      {/* Add more user fields as needed */}
      <ListOfFolders
        peer={{
          id: user.id,
          name: user.username,
          type: user.type,
          wilaya: user.wilaya,
          org: {
            id: user.idInstituion,
            name: user.workAt,
          },
        }}
      />
    </div>
  );
};

export default PeerPage;
