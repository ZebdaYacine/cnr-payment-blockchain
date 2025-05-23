import React, { useEffect, useState, useRef } from "react";
import { format, addDays, endOfMonth, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { FaClock } from "react-icons/fa6";
import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import TimeDisplay from "./navbar/TimeDisplay";

interface EventItem {
  id: number;
  name: string;
  description: string;
  date: Date;
}

const rawJson = [
  {
    number: 1,
    name: "Ouverture Échéance",
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
    endAt: 27,
  },
];

const generateEventsFromJson = (month: number, year: number): EventItem[] => {
  const events: EventItem[] = [];

  rawJson.forEach((item) => {
    // Add for current month
    for (let day = item.startAt; day <= item.endAt; day++) {
      events.push({
        id: item.number,
        name: item.name,
        description: item.description,
        date: new Date(year, month - 1, day),
      });
    }

    // Add also to previous month if "Ouverture Échéance"
    if (item.number === 1) {
      const prevMonthDate = new Date(year, month - 1, 1);
      prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
      const prevMonth = prevMonthDate.getMonth();
      const prevYear = prevMonthDate.getFullYear();

      for (let day = item.startAt; day <= item.endAt; day++) {
        events.push({
          id: item.number,
          name: item.name,
          description: item.description,
          date: new Date(prevYear, prevMonth, day),
        });
      }
    }
  });

  return events;
};

const getBadgeLabel = (day: Date) => {
  if (isSameDay(day, new Date())) return "Aujourd'hui";
  return day > new Date() ? "À venir" : "Dépassée";
};

const getBadgeClass = (day: Date) => {
  if (isSameDay(day, new Date())) return "badge-primary";
  if (day < new Date()) return "badge-error text-white";
  return "badge-success text-white";
};

const SchedulerGrid: React.FC = () => {
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { getCurrentPhase } = useProfileViewModel(profileUseCase);

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    getCurrentPhase();
  }, []);

  const [currentDate] = useState<Date>(new Date());
  const [events] = useState<EventItem[]>(
    generateEventsFromJson(
      currentDate.getMonth() + 1,
      currentDate.getFullYear()
    )
  );

  const handleDayClick = (date: Date) => {
    const match = events.find((e) => isSameDay(e.date, date));
    if (match && isSameDay(date, new Date())) {
      setSelectedEvent(match);
      modalRef.current?.showModal();
    }
  };

  const renderMonthView = () => {
    const days: JSX.Element[] = [];

    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      28
    );
    const end = endOfMonth(currentDate);

    let current = start;
    const daysToRender: Date[] = [];

    while (current <= end) {
      daysToRender.push(current);
      current = addDays(current, 1);
    }

    daysToRender.forEach((currentDaySelected) => {
      const dayEvents = events.filter((event) =>
        isSameDay(event.date, currentDaySelected)
      );
      const hasEvents = dayEvents.length > 0;

      days.push(
        <div
          key={currentDaySelected.toISOString()}
          className={`card border shadow-sm h-40 overflow-auto cursor-pointer flex-grow sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6 ${
            isSameDay(currentDaySelected, currentDate)
              ? "hover:border-black transition-transform duration-300 ease-in-out transform hover:scale-105"
              : ""
          }`}
          onClick={() => handleDayClick(currentDaySelected)}
        >
          <div
            className={`card-body p-2 ${
              hasEvents
                ? isSameDay(currentDaySelected, new Date())
                  ? "bg-primary text-white "
                  : ""
                : "bg-base-100 text-base-content/30"
            }`}
          >
            <div className="font-bold text-xl">
              {format(currentDaySelected, "dd")} -{" "}
              {format(currentDaySelected, "LLLL", { locale: fr })}
            </div>

            {hasEvents &&
              dayEvents.map((event, index) => (
                <div key={index} className="mt-2 space-y-3">
                  <div className="flex items-center space-x-1">
                    {isSameDay(currentDaySelected, new Date()) && (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                    <span className="font-semibold text-md">{event.name}</span>
                  </div>
                  <div
                    className={`badge mt-1 font-semibold text-md text-center gap-2 p-2 ${getBadgeClass(
                      currentDaySelected
                    )}`}
                  >
                    <FaClock />
                    {getBadgeLabel(currentDaySelected)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    });

    return (
      <div className="card bg-base-100 p-4 shadow">
        <div className="flex flex-wrap gap-2">{days}</div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-center mb-6">
        <div className="text-2xl font-bold text-center space-y-5">
          {<TimeDisplay />}
        </div>
      </div>

      {renderMonthView()}

      <dialog id="my_modal_3" className="modal" ref={modalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{selectedEvent?.name}</h3>
          <p className="py-2 text-sm text-gray-500">
            {selectedEvent &&
              format(selectedEvent.date, "PPPP", { locale: fr })}
          </p>
          <p className="py-2">{selectedEvent?.description}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-primary">Fermer</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SchedulerGrid;
