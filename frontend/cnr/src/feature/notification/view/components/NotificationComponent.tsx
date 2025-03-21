interface NotificationProps {
  notification: {
    title?: string;
    message?: string;
    time?: string;
    sendername?: string;
    senderid?: string;
  };
}

function NotificationComponent({ notification }: NotificationProps) {
  return (
    <>
      <div className="border-b py-2 text-sm">
        {notification.title ? (
          <p className="font-bold">{notification.title}</p>
        ) : null}
        <p>{notification.message}</p>
        <em>{notification.time}</em>
      </div>
    </>
  );
}

export default NotificationComponent;
