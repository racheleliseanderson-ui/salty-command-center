import type { MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import { APP_ORIGINS, type SaltyApp } from "@/lib/salty-handoff/contract";
import {
  nightRecordUrl,
  readHomeProfile,
  startNightRecord,
  writeNightRecord,
  type NightState,
} from "@/lib/salty-night-record";

type Route = {
  title: string;
  detail: string;
  app: SaltyApp;
  path: string;
  state: NightState;
  next: string;
};

const ROUTES: Route[] = [
  {
    title: "Cook tonight",
    detail: "Start with what is actually on the shelf.",
    app: "kitchen",
    path: "/",
    state: "cooking",
    next: "Turn the confirmed shelf into tonight's useful options.",
  },
  {
    title: "Build a menu",
    detail: "Stress-test the menu before you build the whole night around it.",
    app: "occasion",
    path: "/architecture",
    state: "building-menu",
    next: "Build the first workable menu, then refine only what is tight.",
  },
  {
    title: "Host people",
    detail: "Turn guests, time and kitchen capacity into an executable night.",
    app: "occasion",
    path: "/",
    state: "planning",
    next: "Build the first workable plan, then refine only what is tight.",
  },
  {
    title: "Choose a restaurant",
    detail: "Match the room to this night, then verify what still matters.",
    app: "restaurant",
    path: "/",
    state: "choosing-restaurant",
    next: "Rank the room, surface the unknowns, then confirm what matters.",
  },
];

const LABEL: Record<SaltyApp, string> = {
  desk: "Salty Desk",
  kitchen: "Kitchen & Bar",
  occasion: "Occasion",
  restaurant: "Restaurant Intelligence",
};

export function QuickStart() {
  function go(route: Route, event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const base = `${APP_ORIGINS[route.app]}${route.path}`;
    const profile = readHomeProfile();
    const night = startNightRecord({
      decision: route.title,
      currentApp: route.app,
      state: route.state,
      nextStep: route.next,
      resumeUrl: base,
      partySize: profile?.defaultPartySize,
      home: profile
        ? {
            region: profile.region,
            defaultPartySize: profile.defaultPartySize,
            serviceStyle: profile.serviceStyle,
          }
        : undefined,
    });
    writeNightRecord(night);
    window.location.assign(nightRecordUrl(base, night));
  }

  return (
    <section aria-labelledby="quick-start-title" className="border-b border-border bg-ink-deep">
      <div className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="label-mono text-brass">Fast start</p>
            <h2 id="quick-start-title" className="mt-2 font-display text-4xl leading-tight text-bone sm:text-5xl">
              Choose the job. Go.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The destination can start immediately. Add party, timing and the main constraint only
              when carrying that context will save work downstream.
            </p>
          </div>
          <a href="#decision-desk" className="tap inline-flex min-h-11 items-center text-sm text-brass hover:text-bone">
            Carry more context first <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROUTES.map((route) => (
            <a
              key={route.title}
              href={`${APP_ORIGINS[route.app]}${route.path}`}
              onClick={(event) => go(route, event)}
              className="press panel group flex min-h-[10rem] flex-col rounded-lg p-5 hover:border-brass/50"
            >
              <span className="label-mono text-brass">{LABEL[route.app]}</span>
              <strong className="mt-3 font-display text-2xl font-normal leading-tight text-bone">
                {route.title}
              </strong>
              <span className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {route.detail}
              </span>
              <span className="mt-5 inline-flex items-center text-xs text-brass">
                Open now <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
