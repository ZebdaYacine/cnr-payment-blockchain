import React, { useEffect } from "react";
import { FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import { useUser } from "../state/UserContext";
import { useOTP } from "../state/OTPContext";

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
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { sendOTP, isOTPSentSuccess } = useProfileViewModel(profileUseCase);
  const { userSaved } = useUser();
  const { setOTPSent } = useOTP();

  useEffect(() => {
    if (isOTPSentSuccess) {
      setOTPSent(true);
      navigate("/home/PK-manager/check-otp");
    }
  }, [isOTPSentSuccess, setOTPSent]);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <p className="text font-semibold text-xl">🔐 Public Key</p>
        <button
          className="btn btn-success btn-outline"
          onClick={() => {
            sendOTP({ email: userSaved.email });
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
