import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function TimeDisplay() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const headline = format(dateTime, "LLLL yyyy", { locale: fr });
  // const timeString = dateTime.toLocaleTimeString("fr-FR", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // });
  const dateString = dateTime.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className=" text-neutral-content p-6 rounded-xl text-center shadow-xl space-y-2">
      <h1 className="text-4xl sm:text-5xl font-extrabold uppercase  text-green-400  tracking-wider">
        Échéance du mois {headline}
      </h1>
      <p className="text text-gray-600 ">{dateString}</p>
      <div className="mt-2 text-gray-600">
        <span className="countdown font-mono text-2xl sm:text-3xl">
          <span
            style={{ "--value": dateTime.getHours() } as React.CSSProperties}
          />
          :
          <span
            style={{ "--value": dateTime.getMinutes() } as React.CSSProperties}
          />
          :
          <span
            style={{ "--value": dateTime.getSeconds() } as React.CSSProperties}
          />
        </span>
      </div>
    </div>
  );
}
