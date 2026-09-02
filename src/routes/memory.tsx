import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import {
  readHomeProfile,
  readNightHistory,
  writeHomeProfile,
  type SaltyNightRecord,
} from "@/lib/salty-night-record";

export const Route = createFileRoute("/memory")({
  head: () => ({
    meta: [
      { title: "Remembered context — Salty Desk" },
      {
        name: "description",
        content:
          "Home profile, recent night decisions and clean resume points for Salty & Clever. Specialist calculations remain inside their specialist tools.",
      },
    ],
  }),
  component: Memory,
});

function Memory() {
  const [region, setRegion] = useState("");
  const [partySize, setPartySize] = useState("");
  const [serviceStyle, setServiceStyle] = useState("");
  const [kitchenNote, setKitchenNote] = useState("");
  const [history, setHistory] = useState<SaltyNightRecord[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = readHomeProfile();
    if (profile) {
      setRegion(profile.region ?? "");
      setPartySize(profile.defaultPartySize ? String(profile.defaultPartySize) : "");
      setServiceStyle(profile.serviceStyle ?? "");
      setKitchenNote(profile.kitchenNote ?? "");
    }
    setHistory(readNightHistory());
  }, []);

  function saveProfile() {
    const size = Number(partySize);
    writeHomeProfile({
      region: region.trim() || undefined,
      defaultPartySize: Number.isFinite(size) && size > 0 ? Math.min(40, Math.round(size)) : undefined,
      serviceStyle: serviceStyle || undefined,
      kitchenNote: kitchenNote.trim().slice(0, 160) || undefined,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="min-h-dvh bg-ink">
      <DeskHeader />
      <main className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 sm:py-16">
        <p className="label-mono text-brass">Remembered context</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.02] text-bone sm:text-6xl">
          Remember the useful parts. Leave the engines alone.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Salty remembers the shape of your nights so you do not start from zero. Shelf matching,
          menu feasibility and restaurant ranking still belong to Kitchen & Bar, Occasion and
          Restaurant Intelligence respectively.
        </p>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="panel rounded-lg p-6 sm:p-8">
            <p className="label-mono text-brass">Home profile</p>
            <h2 className="mt-2 font-display text-3xl text-bone">Facts worth reusing</h2>
            <div className="mt-6 grid gap-5">
              <label className="grid gap-2 text-sm text-muted-foreground">
                Home region
                <input
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Denver metro"
                  className="min-h-11 rounded-sm border border-border bg-ink-deep px-3 text-bone"
                />
              </label>
              <label className="grid gap-2 text-sm text-muted-foreground">
                Usual party size
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={partySize}
                  onChange={(e) => setPartySize(e.target.value)}
                  placeholder="e.g. 6"
                  className="min-h-11 rounded-sm border border-border bg-ink-deep px-3 text-bone"
                />
              </label>
              <label className="grid gap-2 text-sm text-muted-foreground">
                Usual service style
                <select
                  value={serviceStyle}
                  onChange={(e) => setServiceStyle(e.target.value)}
                  className="min-h-11 rounded-sm border border-border bg-ink-deep px-3 text-bone"
                >
                  <option value="">No default</option>
                  <option value="seated">Seated</option>
                  <option value="buffet">Buffet</option>
                  <option value="grazing">Grazing</option>
                  <option value="standing">Standing / cocktails</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-muted-foreground">
                Kitchen shorthand
                <input
                  value={kitchenNote}
                  onChange={(e) => setKitchenNote(e.target.value)}
                  placeholder="e.g. one oven · four usable burners"
                  className="min-h-11 rounded-sm border border-border bg-ink-deep px-3 text-bone"
                />
              </label>
              <button
                type="button"
                onClick={saveProfile}
                className="tap inline-flex min-h-11 w-fit items-center rounded-sm bg-brass px-5 text-sm font-medium text-primary-foreground hover:bg-bone"
              >
                {saved ? "Saved" : "Save home profile"}
              </button>
            </div>
          </article>

          <article className="panel rounded-lg p-6 sm:p-8">
            <p className="label-mono text-brass">Specialist memory</p>
            <h2 className="mt-2 font-display text-3xl text-bone">Keep detail where it belongs</h2>
            <div className="mt-6 grid gap-3 text-sm">
              <a className="rounded-sm border border-border p-4 hover:border-brass/50" href="https://kitchen.saltnotes.blog/">
                <strong className="text-bone">Kitchen & Bar</strong>
                <span className="mt-1 block text-muted-foreground">Shelf continuity and confirmed availability.</span>
              </a>
              <a className="rounded-sm border border-border p-4 hover:border-brass/50" href="https://occasion.saltnotes.blog/">
                <strong className="text-bone">Occasion</strong>
                <span className="mt-1 block text-muted-foreground">Saved kitchens, reusable host setups and prior workable plans.</span>
              </a>
              <a className="rounded-sm border border-border p-4 hover:border-brass/50" href="https://deepdish.saltnotes.blog/">
                <strong className="text-bone">Restaurant Intelligence</strong>
                <span className="mt-1 block text-muted-foreground">Restaurant decisions, live confirmations and unresolved questions.</span>
              </a>
            </div>
          </article>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-mono text-brass">Recent nights</p>
              <h2 className="mt-2 font-display text-3xl text-bone">Decision history</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              A recent night stores the decision summary and resume point, not the specialist's full working state.
            </p>
          </div>
          <div className="mt-6 grid gap-3">
            {history.length ? (
              history.map((night) => (
                <article key={night.id} className="panel flex flex-col gap-4 rounded-lg p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-display text-xl text-bone">{night.decision}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {night.state.replace(/-/g, " ")} · {new Date(night.updatedAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">Next: {night.nextStep}</p>
                  </div>
                  <a
                    href={night.resume.url}
                    className="tap inline-flex min-h-11 shrink-0 items-center rounded-sm border border-brass/50 px-4 text-sm text-brass hover:bg-brass/10"
                  >
                    {night.resume.label}
                  </a>
                </article>
              ))
            ) : (
              <div className="panel rounded-lg p-6 text-sm text-muted-foreground">
                No remembered nights yet. Start from Salty Desk and the first decision will appear here.
              </div>
            )}
          </div>
        </section>
      </main>
      <DeskFooter />
    </div>
  );
}
