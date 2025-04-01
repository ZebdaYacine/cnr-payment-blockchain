import React, { useEffect, useState } from "react";
import { format, addDays, startOfMonth, isSameDay, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { FaClock } from "react-icons/fa6";
import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import { usePhaseId } from "../state/PhaseContext";
import { useUser } from "../state/UserContext";

interface EventItem {
  id: number;
  name: string;
  description: string;
  date: Date;
}

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

const isCurrentMonth = (date: Date) => {
  const today = new Date();
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth()
  );
};

const getBadgeLabel = (day: Date) => {
  if (isSameDay(day, new Date())) return "Aujourd'hui";
  if (!isCurrentMonth(day)) return "Hors période";
  return day > new Date() ? "À venir" : "Dépassée";
};

const getBadgeClass = (day: Date) => {
  if (!isCurrentMonth(day)) return "badge-neutral";
  if (isSameDay(day, new Date())) return "badge-primary";
  if (day < new Date()) return "badge-secondary"; // Dépassée
  return "badge-accent"; // À venir
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

  const [currentDate] = useState<Date>(
    () => new Date(format(new Date(), "yyyy-MM-dd"))
  );

  const [events] = useState<EventItem[]>(generateEventsFromJson(4, 2025)); // Avril 2025

  const handleDayClick = (date: Date) => {
    if (userSaved.phases.includes(phase?.id || "")) {
      console.log("You can navigate to your profile", date);
    }
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
                      className="badge badge-soft font-semibold gap-2"
                    >
                      {isSameDay(currentDaySelected, new Date()) && (
                        <div className="w-4 h-4 rounded-full bg-green-600 animate-pulse" />
                      )}
                      {event.name}
                    </div>
                  ))}
                  <div
                    className={`badge font-semibold text-sm text-center gap-2 p-3 ${getBadgeClass(
                      currentDaySelected
                    )}`}
                  >
                    <FaClock />
                    {getBadgeLabel(currentDaySelected)}
                  </div>
                </div>
              ) : (
                dayEvents.map((event, index) => (
                  <div key={index} className="flex flex-col space-y-3 mt-2">
                    <div className="flex items-center space-x-2">
                      {isSameDay(currentDaySelected, new Date()) && (
                        <div className="w-4 h-4 rounded-full bg-green-600 animate-pulse" />
                      )}
                      <p className="text-md font-bold">{event.name}</p>
                    </div>
                    <div className="text font-semibold text-xs">
                      {event.description}
                    </div>
                    <div
                      className={`badge font-semibold text-sm text-center gap-2 p-3 ${getBadgeClass(
                        currentDaySelected
                      )}`}
                    >
                      <FaClock />
                      {getBadgeLabel(currentDaySelected)}
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
      <div className="flex justify-center mb-6">
        <div className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy", { locale: fr })}
        </div>
      </div>
      {renderMonthView()}
    </div>
  );
};

export default SchedulerGrid;
