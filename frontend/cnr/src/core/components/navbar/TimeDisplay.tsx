import { useEffect, useState } from "react";

// interface Props {
//   phaseDialogRef?: RefObject<HTMLDialogElement>;
// }

export default function TimeDisplay(/*{ phaseDialogRef? }: Props*/) {
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
      className="  font-bold sm:text-xl md:text-3xl "
      // onClick={() => phaseDialogRef.current?.showModal()}
    >
      {formattedTime}
    </p>
  );
}
