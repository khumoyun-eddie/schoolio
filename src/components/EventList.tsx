import prisma from "@/lib/prisma";
import React from "react";

const EventList = async ({ dateParams }: { dateParams: string | undefined }) => {
  const date = dateParams ? new Date(dateParams) : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 9999)),
      },
    },
  });
  console.log(data);
  return (
    <div className="flex flex-col gap-4">
      {data.length > 0 ? (
        data.map((event) => (
          <div
            className="p-5 border-2 border-t-4 border-gray-100 rounded-md odd:border-t-lamaSky even:border-t-lamaPurple"
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-xs text-gray-300">
                {event.startTime.toLocaleTimeString("en-UK", { hour: "2-digit", minute: "2-digit", hour12: false })}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-400">{event.description}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No events</p>
      )}
    </div>
  );
};

export default EventList;
