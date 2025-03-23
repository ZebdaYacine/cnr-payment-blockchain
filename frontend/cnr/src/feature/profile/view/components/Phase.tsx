import { useEffect, useState } from "react";
import { TbCalendarClock } from "react-icons/tb";

function Phase() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
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
    <div className="card shadow-2xl ml-5 mr-5 mt-2">
      <div className="card-body">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-xs md:text-xl font-bold">
              La Phase actuelle:llkdfsd
            </p>
          </div>
          <div>
            <div className="badge  badge-xs md:badge-lg badge-accent font-bold gap-3">
              <TbCalendarClock className="text-xl md:text-xl" />
              {formattedTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Phase;
