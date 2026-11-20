"use client";
import { useState } from "react";

export function SavingsCalculator() {
  const [tools, setTools] = useState(5);
  const [avgCost, setAvgCost] = useState(18000);
  const [analysts, setAnalysts] = useState(3);
  const [hoursPerWeek, setHours] = useState(10);
  const [rate, setRate] = useState(55);

  // Deterministic estimate. Assumptions are shown to the user, not hidden.
  const consolidatedTools = Math.max(1, Math.ceil(tools / 3));
  const licenseSaving = Math.max(0, (tools - consolidatedTools) * avgCost * 0.6);
  const hoursSaved = analysts * hoursPerWeek * 0.4 * 52;
  const laborSaving = hoursSaved * rate;
  const total = licenseSaving + laborSaving;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const field = (label: string, v: number, set: (n: number) => void, step = 1) => (
    <label className="block text-sm font-bold">
      {label}
      <input type="number" min={0} step={step} value={v} onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))} className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 font-normal" />
    </label>
  );

  return (
    <div className="mx-auto grid max-w-5xl gap-8 rounded-2xl bg-white p-8 shadow-lg md:grid-cols-2">
      <div className="space-y-4">
        {field("Security tools in use today", tools, setTools)}
        {field("Average annual cost per tool (USD)", avgCost, setAvgCost, 1000)}
        {field("Analysts and admins on security tasks", analysts, setAnalysts)}
        {field("Hours per person per week on manual triage", hoursPerWeek, setHours)}
        {field("Loaded hourly cost (USD)", rate, setRate, 5)}
      </div>
      <div className="flex flex-col justify-center rounded-xl bg-ink p-8 text-white">
        <p className="text-sm font-bold uppercase tracking-wider text-red">Estimated annual impact</p>
        <p className="display mt-2 text-5xl font-extrabold">{fmt(total)}</p>
        <dl className="mt-6 space-y-2 text-sm text-white/80">
          <div className="flex justify-between"><dt>License consolidation</dt><dd>{fmt(licenseSaving)}</dd></div>
          <div className="flex justify-between"><dt>Triage hours saved</dt><dd>{Math.round(hoursSaved).toLocaleString()} h</dd></div>
          <div className="flex justify-between"><dt>Labor value</dt><dd>{fmt(laborSaving)}</dd></div>
        </dl>
        <p className="mt-6 text-xs text-white/60">
          Illustrative estimate. Assumes tools consolidate roughly 3:1 with 60% of their license cost recovered, and 40% of manual triage time saved. Your results will differ.
        </p>
      </div>
    </div>
  );
}
