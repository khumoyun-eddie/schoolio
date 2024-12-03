import Image from "next/image";
import EventList from "./EventList";
import EventCalendar from "./EventCalendar";

const EventCalendarContainer = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { date } = searchParams;

  return (
    <div className="p-4 bg-white rounded-lg">
      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="my-4 text-xl font-semibold">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <EventList dateParams={date} />
    </div>
  );
};

export default EventCalendarContainer;
