"use client";

import { useEffect, useState } from "react";

const speedOptions = [
  { value: "INSTANT", label: "Instant" },
  { value: "SLOW", label: "Slow" },
  { value: "FAST", label: "Fast" },
  { value: "NORMAL", label: "Normal" },
];

const minTemperature = 0;
const maxTemperature = 0.8;

const defaultForm = {
  name: "",
  tone: "",
  streamSpeed: "NORMAL",
  openingLine: "",
  temperature: 0.4,
};

export default function ChatPreferencesPage() {
  const [form, setForm] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPreference() {
      try {
        const response = await fetch("/api/chat-preferences");
        if (!response.ok) {
          throw new Error("Failed to load preferences.");
        }
        const data = (await response.json()) as {
          preference?: typeof defaultForm | null;
        };

        if (data.preference && isMounted) {
          setForm({
            name: data.preference.name ?? "",
            tone: data.preference.tone ?? "",
            streamSpeed: data.preference.streamSpeed ?? "NORMAL",
            openingLine: data.preference.openingLine ?? "",
            temperature: data.preference.temperature ?? 0.4,
          });
        }
      } catch {
        if (isMounted) {
          setStatus("Unable to load preferences.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPreference();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "temperature" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      const response = await fetch("/api/chat-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences.");
      }

      setStatus("Preferences saved.");
    } catch {
      setStatus("Failed to save preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-[color:var(--panel-border)] bg-gradient-to-br from-[#1f4bd8]/10 via-transparent to-[#3b82f6]/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Chat preferences
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Chat Configuration</h1>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
          Define the assistant personality, opening line, temperature, and streaming tempo.
        </p>
      </section>

      <section className="rounded-3xl border border-[color:var(--panel-border)] bg-[color:var(--panel)] p-6">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isLoading || isSaving}
              placeholder="Example: Atlas"
              className="rounded-xl border border-[color:var(--panel-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Language Style
            <input
              name="tone"
              value={form.tone}
              onChange={handleChange}
              disabled={isLoading || isSaving}
              placeholder="Example: Warm, concise, confident"
              className="rounded-xl border border-[color:var(--panel-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Stream Speed
            <select
              name="streamSpeed"
              value={form.streamSpeed}
              onChange={handleChange}
              disabled={isLoading || isSaving}
              className="rounded-xl border border-[color:var(--panel-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {speedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Temperature
            <input
              name="temperature"
              type="range"
              min={minTemperature}
              max={maxTemperature}
              step={0.1}
              value={form.temperature}
              onChange={handleChange}
              disabled={isLoading || isSaving}
              className="accent-[color:var(--accent-1)]"
            />
            <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
              <span>{form.temperature.toFixed(1)}</span>
              <span>{minTemperature.toFixed(1)} - {maxTemperature.toFixed(1)}</span>
            </div>
            <p className="text-xs text-[color:var(--muted)]">
              Lower values keep replies focused and consistent. Higher values add creativity, but can reduce accuracy.
            </p>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
            Opening Line
            <textarea
              name="openingLine"
              value={form.openingLine}
              onChange={handleChange}
              disabled={isLoading || isSaving}
              rows={4}
              placeholder="Example: Hi! I can help summarize campaign updates."
              className="rounded-xl border border-[color:var(--panel-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isLoading || isSaving}
              className="rounded-full bg-[color:var(--accent-1)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save preferences"}
            </button>
            {status ? (
              <span className="text-xs font-semibold text-[color:var(--muted)]">{status}</span>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
