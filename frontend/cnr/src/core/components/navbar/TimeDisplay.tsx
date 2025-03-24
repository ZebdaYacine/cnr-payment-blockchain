import { RefObject, useEffect, useState } from "react";

interface Props {
  phaseDialogRef: RefObject<HTMLDialogElement>;
}

export default function TimeDisplay({ phaseDialogRef }: Props) {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = dateTime.toLocaleString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <p
      className="rounded hover:rounded-btn font-bold sm:text-xl md:text-xl text-cyan-50 hover:cursor-pointer border p-2"
      onClick={() => phaseDialogRef.current?.showModal()}
    >
      {formattedTime}
    </p>
  );
}
