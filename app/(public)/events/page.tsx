import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import EventCard from "@/components/sections/EventCard";
import { separateEvents } from "@/lib/events";
import SlideGrid from "@/components/SlideGrid";
import PageHeader from "@/components/PageHeader";
import SlideCard from "@/components/SlideCard";

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    return await prisma.event.findMany({ where: { published: true } });
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Events",
    description: "Upcoming and past academic events, talks, workshops, and conferences.",
    openGraph: { title: "Events", description: "Academic events, talks, and conference appearances." },
  };
}

export default async function EventsPage() {
  const events = await getEvents();
  const { upcoming, past } = separateEvents(events, new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader 
        title="Events"
        subtitle="Conferences, Workshops & Talks"
        description="Join me at upcoming events or explore past academic conferences, workshops, and seminars"
        icon="📅"
        gradient={true}
      />

      {/* Upcoming events */}
      <section className="mb-12">
        <SlideCard direction="up" delay={0.2}>
          <h2 className="text-2xl font-semibold text-navy-900 mb-6">Upcoming Events</h2>
        </SlideCard>
        {upcoming.length > 0 ? (
          <SlideGrid columns={3} direction="wave" staggerDelay={0.1}>
            {upcoming.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                date={event.date}
                location={event.location}
                description={event.description}
                externalUrl={event.externalUrl}
                posterImage={event.posterImage}
                registrationUrl={event.registrationUrl}
                streamUrl={event.streamUrl}
              />
            ))}
          </SlideGrid>
        ) : (
          <p className="text-navy-600">No upcoming events at this time.</p>
        )}
      </section>

      {/* Past events */}
      {past.length > 0 && (
        <section>
          <SlideCard direction="up" delay={0.3}>
            <h2 className="text-2xl font-semibold text-navy-900 mb-6">Past Events</h2>
          </SlideCard>
          <SlideGrid columns={3} direction="wave" staggerDelay={0.1}>
            {past.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                date={event.date}
                location={event.location}
                description={event.description}
                externalUrl={event.externalUrl}
                posterImage={event.posterImage}
                registrationUrl={event.registrationUrl}
                streamUrl={event.streamUrl}
              />
            ))}
          </SlideGrid>
        </section>
      )}

      {events.length === 0 && (
        <p className="text-center text-gray-600 py-12">No events available at this time.</p>
      )}
    </div>
  );
}
