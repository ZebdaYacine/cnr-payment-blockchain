import { MdErrorOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import { FaMessage } from "react-icons/fa6";
import { useNotificationContext } from "../state/NotificationContext";
import { FolderUseCase } from "../../feature/folder/domain/usecase/FolderUseCase";
import { FolderDataSourceImpl } from "../../feature/folder/data/dataSource/FolderAPIDataSource";
import { FolderRepositoryImpl } from "../../feature/folder/data/repository/FolderRepositoryImpl";
import { useFolderViewModel } from "../../feature/folder/viewmodel/FolderViewModel";

interface WarningProps {
  message: string;
  notification?: boolean;
  user?: string;
}

function Warning({ message, notification = false, user }: WarningProps) {
  const folderUseCase = new FolderUseCase(
    new FolderRepositoryImpl(new FolderDataSourceImpl())
  );

  const [commitText, setCommitText] = useState("");
  const [commitSize, setCommitSize] = useState(100);
  const [canSend, setCanSend] = useState(false);
  const [loading, setLoading] = useState("");

  const { GetNotification } = useNotificationContext();
  const {
    addNotification,
    isNotificationLoading,
    isNotificationSuccess,
    Notifications,
    isNotificationError,
  } = useFolderViewModel(folderUseCase);

  useEffect(() => {
    setCanSend(GetNotification() === null);
  }, [GetNotification]);

  const handleCommitSizeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newText = event.target.value.slice(0, 100);
    setCommitText(newText);
    setCommitSize(100 - newText.length);
  };

  const sendNotification = () => {
    addNotification({
      permission: "",
      receiverId: [],
      senderId: "",
      message: "",
      time: "",
    });
    setCanSend(GetNotification() !== null);
  };

  useEffect(() => {
    if (isNotificationLoading) {
      setLoading("send notification...");
    } else if (isNotificationSuccess && Notifications) {
      //setCanSend(GetNotification() !== null);
      setLoading("sent");
    } else if (isNotificationError) {
      setLoading("Error..");
    }
  }, [isNotificationLoading, isNotificationSuccess, Notifications]);

  return (
    <div className="flex flex-col justify-center items-center p-4 rounded-lg space-y-5">
      <MdErrorOutline className="text-red-500 w-12 h-12 mb-2" />
      <p className="font-bold text-red-600 text-lg">{message}</p>
      {loading}
      {notification && canSend && (
        <div className="flex flex-col items-center space-y-2 w-full">
          <div className="flex flex-col mt-3 w-full md:w-3/4">
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder={`Notifier ${user} ....`}
              onChange={handleCommitSizeChange}
              value={commitText}
            />
            <div className="mt-2 flex flex-row-reverse">
              <div
                className={`badge badge-lg ${
                  commitText.length === 100
                    ? "badge-secondary"
                    : "badge-primary"
                }`}
              >
                {commitSize}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2 cursor-pointer"
            onClick={sendNotification}
            disabled={!commitText.trim()}
          >
            <FaMessage className="animate-bounce text-xl" />
            Envoyer la notification
          </button>
        </div>
      )}
    </div>
  );
}

export default Warning;
