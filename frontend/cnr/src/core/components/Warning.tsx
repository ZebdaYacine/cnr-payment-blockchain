import { MdErrorOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import { FaMessage } from "react-icons/fa6";
import { useNotificationContext } from "../state/NotificationContext";
import { NotificationUseCase } from "../../feature/notification/domain/usecase/NotificationUseCase";
import { NotificationDataSourceImpl } from "../../feature/notification/data/dataSource/NotificationAPIDataSource";
import { NotificationRepositoryImpl } from "../../feature/notification/data/repository/NotificationRepositoryImpl";
import { useNotificationViewModel } from "../../feature/notification/viewmodel/NotificationViewModel";
import { useUser } from "../state/UserContext";

interface WarningProps {
  message: string;
  userId?: string;
  notification?: boolean;
  senderName?: string;
}

function Warning({
  message,
  notification = false,
  userId,
  senderName: senderName,
}: WarningProps) {
  const notificationUseCase = new NotificationUseCase(
    new NotificationRepositoryImpl(new NotificationDataSourceImpl())
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
  } = useNotificationViewModel(notificationUseCase);

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

  const { userSaved } = useUser();

  const userPermission = userSaved.permission;

  const sendNotification = () => {
    addNotification({
      permission: userPermission?.toLowerCase() || "",
      receiverId: [userId || ""],
      senderId: "",
      message: commitText,
      title: `Nouvelle notification de  ${userSaved.id} `,
      time: new Date(),
      path: "",
    });
    setCanSend(GetNotification() !== null);
  };

  useEffect(() => {
    if (isNotificationLoading) {
      setLoading("send notification...");
    } else if (isNotificationSuccess && Notifications) {
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
              placeholder={`Notifier ${senderName} ....`}
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
