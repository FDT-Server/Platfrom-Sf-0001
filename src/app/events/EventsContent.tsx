"use client";

import { useState, useEffect } from "react";
import { 
  IconCalendarEvent, 
  IconExternalLink, 
  IconUsers, 
  IconCode,
  IconMicrophone2,
  IconMapPin,
  IconClock,
  IconCalendar,
  IconSearch
} from "@tabler/icons-react";

type EventCategory = "All" | "Workshops" | "Hackathons" | "Networking Events";
type EventStatus = "All" | "Upcoming" | "Ongoing" | "Past";

interface MockEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  speakerName?: string;
  speakerTitle?: string;
  speakerCompany?: string;
  speakerImage?: string;
  joinLink?: string;
  tags: string[];
  price?: string;
}

const EXACT_EVENTS: MockEvent[] = [
  {
    id: "cmsdaqzpr000004kyklwexkkb",
    title: "Incept Edition - 01",
    description: "By Student Forge",
    category: "Networking Events",
    status: "Past",
    date: "Sun, 9 Aug",
    time: "",
    location: "The Story Cafe, Plot No.55, 60, Central Park Main Rd, Devender Colony, Kompally, Hyderabad, Telangana 500100",
    imageUrl: "https://ik.imagekit.io/dypkhqxip/incept?updatedAt=1785669242499",
    tags: ["Incept", "Summit", "Networking"],
    price: "₹249"
  },
  {
    id: "cmsbpnls8000004lfw3bvf1a7",
    title: "Student Forge Platfrom Launch",
    description: "By Student Forge",
    category: "Networking Events",
    status: "Past",
    date: "Wed, 5 Aug",
    time: "",
    location: "CMR Central Auditorium, Medchal Rd, Kandlakoya Village, Hyderabad, Seethariguda, Telangana 501401",
    imageUrl: "https://ik.imagekit.io/dypkhqxip/1200%20(1).png",
    tags: ["Launch", "Platform", "Community"],
    price: "Free"
  }
];

function getEventStatus(dateStr: string): EventStatus {
  if (!dateStr) return "Upcoming";
  const cleanDateStr = dateStr.replace(/^[a-zA-Z]+,\s*/, '') + ` ${new Date().getFullYear()}`;
  const eventDate = new Date(cleanDateStr);
  const now = new Date();
  
  const eventTime = eventDate.getTime();
  const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  if (isNaN(eventTime)) return "Upcoming";
  
  if (eventTime < todayTime) {
    return "Past";
  } else if (eventTime === todayTime) {
    return "Ongoing";
  } else {
    return "Upcoming";
  }
}

export default function EventsContent() {
  const [events, setEvents] = useState<MockEvent[]>(EXACT_EVENTS.map(e => ({ ...e, status: getEventStatus(e.date) })));
  const [activeStatus, setActiveStatus] = useState<EventStatus>("All");
  const [activeCategory, setActiveCategory] = useState<EventCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Live scraping isn't possible directly from the SSR HTML because it returns the skeleton loaders.
    // Instead, we are using the exact data provided by the user.
  }, []);

  const filteredEvents = events.filter(
    (evt) => {
      const matchesStatus = activeStatus === "All" || evt.status === activeStatus;
      const matchesCategory = activeCategory === "All" || evt.category === activeCategory;
      const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            evt.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesCategory && matchesSearch;
    }
  );

  return (
    <div className="flex h-fit w-full flex-col animate-fadeIn space-y-6">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#1b5afb] p-6 md:px-10 md:py-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/20 backdrop-blur-md mb-4 shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#fbb03b]" />
            <span className="text-[11px] font-medium text-white/90 tracking-widest uppercase">National Impact</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-normal text-white leading-[1.15] tracking-tight mb-3">
            Events, Summits & <br />
            Student Forge <span className="text-[#fbb03b] font-medium">Work.</span>
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-2xl mb-1 font-normal">
            From technical immersion bootcamps to national leadership summits, we bring the industry to your academic node.
          </p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 py-2">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full xl:w-auto">
          {(["All", "Workshops", "Hackathons", "Networking Events"] as EventCategory[]).map((cat) => {
            let Icon = null;
            if (cat === "Workshops") Icon = IconMicrophone2;
            if (cat === "Hackathons") Icon = IconCode;
            if (cat === "Networking Events") Icon = IconUsers;
            
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  activeCategory === cat
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-64">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative xl:w-48">
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value as EventStatus)}
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="All">All Events</option>
              <option value="Upcoming">Upcoming Events</option>
              <option value="Ongoing">Ongoing Events</option>
              <option value="Past">Past Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
          {filteredEvents.map((evt) => (
            <a 
              key={evt.id}
              href={`https://events.studentforge.in/events/${evt.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-[1.5rem] border border-slate-200/60 bg-white/60 backdrop-blur-lg overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all duration-300 relative cursor-pointer"
            >
              {/* Event Image */}
              {evt.imageUrl ? (
                <div className="h-36 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={evt.imageUrl} 
                    alt={evt.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 z-20">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/90 text-slate-800 backdrop-blur-md shadow-sm">
                      {evt.category}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-36 w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative">
                  <IconCalendarEvent className="w-12 h-12 text-blue-200" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/90 text-slate-800 backdrop-blur-md shadow-sm">
                      {evt.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors">
                  {evt.title}
                </h3>
                
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {evt.description}
                </p>

                <div className="flex flex-col gap-2 mt-auto pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <IconCalendar className="w-3.5 h-3.5 text-blue-500" />
                    {evt.date}
                  </div>
                  {evt.time && (
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                      <IconClock className="w-3.5 h-3.5 text-amber-500" />
                      {evt.time}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <IconMapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>

                {evt.speakerName ? (
                  <div className="flex items-center gap-3 pt-4">
                    <img 
                      src={evt.speakerImage} 
                      alt={evt.speakerName}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-slate-100" 
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{evt.speakerName}</span>
                      <span className="text-[10px] font-medium text-slate-500">
                        {evt.speakerTitle} @ <span className="text-slate-700 font-semibold">{evt.speakerCompany}</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {evt.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {evt.price && (
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Price</span>
                    <span className="text-xs font-bold text-slate-900">{evt.price}</span>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 mt-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50/50">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
            <IconCalendarEvent className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-base font-bold text-slate-800">No events found</p>
          <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">
            There are currently no {activeStatus.toLowerCase()} {activeCategory === "All" ? "events" : activeCategory.toLowerCase()} matching your criteria.
          </p>
          <button 
            onClick={() => {
              setActiveStatus("Upcoming");
              setActiveCategory("All");
            }}
            className="mt-6 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors"
          >
            View All Upcoming Events
          </button>
        </div>
      )}
    </div>
  );
}
