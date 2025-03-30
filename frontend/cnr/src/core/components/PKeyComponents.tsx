import React from "react";
import { FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface PKeyComponentsProps {
  email: string;
  hash: string;
  addedDate: string;
  onDelete: () => void;
}

const PKeyComponents: React.FC<PKeyComponentsProps> = ({
  email,
  hash,
  addedDate,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <p className="text font-semibold text-xl">🔐 Public Key</p>
        <button
          className="btn btn-success btn-outline"
          onClick={() => {
            navigate("/home/PK-manager/add-keys");
          }}
        >
          Add new
        </button>
      </div>
      <div className="divider" />
      <div className="border   rounded-xl p-4 bg-base-100 flex flex-col space-y-2 shadow-md cursor-pointer ">
        <div className="flex items-center gap-3">
          <FaKey className="text-green-600 w-5 h-5" />
          <div className="font-semibold text-lg">{email}</div>
        </div>

        <div className="text-sm text-gray-400 break-all font-semibold">
          {hash}
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-semibold"> Ajoutee le {addedDate}</span>
        </div>

        <div className="text-right ">
          <button onClick={onDelete} className="btn btn-error btn-outline  ">
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default PKeyComponents;
