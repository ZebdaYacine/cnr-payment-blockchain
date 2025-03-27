import React, { useEffect, useState } from "react";
import {
  format,
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  isSameDay,
  subDays,
} from "date-fns";
import { fr } from "date-fns/locale";
import { FaClock } from "react-icons/fa6";
import { useProfileViewModel } from "../../viewmodel/ProfileViewModel";
import { PofileUseCase } from "../../domain/usecase/ProfileUseCase";
import { ProfileDataSourceImpl } from "../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../data/repository/ProfileRepositoryImpl";
import { usePhaseId } from "../../../../core/state/PhaseContext";
import { useUser } from "../../../../core/state/UserContext";

interface EventItem {
  id: number;
  name: string;
  description: string;
  date: Date;
}

// Données JSON
const rawJson = [
  {
    number: 1,
    name: "Ouverture Echéance",
    description: "Échange fichiers échéance entre agences et CCR",
    startAt: 28,
    endAt: 29,
  },
  {
    number: 2,
    name: "Incidence financière",
    description: "Envoi des bandes CCP, consolidation, envoi à la DOF",
    startAt: 1,
    endAt: 1,
  },
  {
    number: 3,
    name: "Saisie des annules",
    description: "Saisie au niveau agence via STAR TDR",
    startAt: 2,
    endAt: 8,
  },
  {
    number: 4,
    name: "Traitement de l’échéance",
    description: "Préparation, traitement et contrôle des fichiers annulés",
    startAt: 9,
    endAt: 9,
  },
  {
    number: 5,
    name: "Dépot CNR–AP",
    description: "Dépôt des fichiers, vérification générale, envoi recap",
    startAt: 10,
    endAt: 10,
  },
  {
    number: 6,
    name: "Correction des erreurs",
    description: "Correction des anomalies détectées",
    startAt: 12,
    endAt: 12,
  },
  {
    number: 7,
    name: "Contrôle jour par jour",
    description: "Triple vérification quotidienne des paiements",
    startAt: 14,
    endAt: 25,
  },
  {
    number: 8,
    name: "Clôture échéance",
    description: "Rapport final et sauvegarde",
    startAt: 27,
    endAt: 28,
  },
];

// Convertir JSON -> Events
const generateEventsFromJson = (month: number, year: number) => {
  const events: EventItem[] = [];
  rawJson.forEach((item) => {
    for (let day = item.startAt; day <= item.endAt; day++) {
      events.push({
        id: item.number,
        name: item.name,
        description: item.description,
        date: new Date(year, month - 1, day),
      });
    }
  });
  return events;
};

const SchedulerGrid: React.FC = () => {
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { getCurrentPhase } = useProfileViewModel(profileUseCase);
  const { phase } = usePhaseId();
  const { userSaved } = useUser();

  useEffect(() => {
    getCurrentPhase();
  }, [getCurrentPhase]);
  const [currentDate, setCurrentDate] = useState<Date>(
    () => new Date(format(new Date(), "yyyy-MM-dd"))
  );
  const [view] = useState<"month" | "week" | "year">("month");
  const [events] = useState<EventItem[]>(generateEventsFromJson(3, 2025));

  const handlePrev = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (date: Date) => {
    if (userSaved.phases.includes(phase?.id || "")) {
      console.log("You can navigate to your porfile", date);
    }
  };

  const isAfterDate = (a: Date, b: Date) => {
    return format(a, "yyyy-MM-dd") > format(b, "yyyy-MM-dd");
  };

  const renderMonthView = () => {
    const start = subDays(startOfMonth(currentDate), 1);
    const customStart = subDays(start, start.getDate() - 28);
    const days: JSX.Element[] = [];
    let day = customStart;

    for (let i = 0; i < 33; i++) {
      const currentDaySelected = day;
      const dayEvents = events.filter((event) =>
        isSameDay(event.date, currentDaySelected)
      );

      const hasEvents = dayEvents.length > 0;

      days.push(
        <div
          key={i}
          className={`card border shadow-sm h-40 overflow-auto cursor-pointer flex-grow sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6 ${
            isSameDay(currentDaySelected, currentDate)
              ? "hover:border-black transition-transform duration-300 ease-in-out transform hover:scale-105"
              : ""
          }`}
          onClick={() =>
            handleDayClick(new Date(format(currentDaySelected, "yyyy-MM-dd")))
          }
        >
          <div
            className={`card-body p-2 ${
              hasEvents
                ? isSameDay(day, new Date())
                  ? "bg-primary text-white"
                  : ""
                : "bg-base-100 text-base-content/30"
            }`}
          >
            <div className="font-bold">{format(currentDaySelected, "dd")}</div>

            {hasEvents &&
              (dayEvents.length > 1 ? (
                <div className="flex flex-col space-y-2 mt-2">
                  {dayEvents.map((event, index) => (
                    <div
                      key={index}
                      className="badge badge-soft hover:badge-outline badge-primary font-semibold cursor-pointer"
                    >
                      {event.name}
                    </div>
                  ))}
                </div>
              ) : (
                dayEvents.map((event, index) => (
                  <div key={index} className="flex flex-col space-y-3 mt-2">
                    <div className="flex items-center space-x-2">
                      {isSameDay(currentDate, currentDaySelected) && (
                        <div className="w-4 h-4 rounded-full bg-green-600 animate-pulse"></div>
                      )}
                      <p className="text-md font-bold">{event.name}</p>
                    </div>
                    <div className="text font-semibold text-sm">
                      {event.description}
                    </div>
                    <div
                      className={`badge font-semibold text-sm text-center gap-2 p-3  ${
                        isSameDay(currentDate, currentDaySelected)
                          ? "badge-primary"
                          : isAfterDate(currentDate, currentDaySelected)
                          ? "badge-secondary"
                          : "badge-accent"
                      }`}
                    >
                      <FaClock />
                      {isSameDay(currentDate, currentDaySelected)
                        ? "Aujourd'hui"
                        : isAfterDate(currentDate, currentDaySelected)
                        ? "Dépassée"
                        : "À venir"}
                    </div>
                  </div>
                ))
              ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    return (
      <div className="card bg-base-100 p-4 shadow">
        <div className="flex flex-wrap gap-2">{days}</div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button className="btn btn-sm btn-outline" onClick={handlePrev}>
          Précédent
        </button>
        <div className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy", { locale: fr })}
        </div>
        <button className="btn btn-sm btn-outline" onClick={handleNext}>
          Suivant
        </button>
      </div>
      {renderMonthView()}
    </div>
  );
};

export default SchedulerGrid;
