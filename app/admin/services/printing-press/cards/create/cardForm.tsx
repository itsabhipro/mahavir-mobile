"use client";

import Input from "@/components/shared/input";
import ListInput from "@/components/shared/listInput";
import useForm from "@/hooks/useForm";
import { updateArray } from "@/utils/helpers/updateArray";
import { useState } from "react";

const steps = [
  "Card Info",
  "Welcomers",
  "Persons",
  "Events",
  "Arrangers",
  "Review",
];


export default function CardForm() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useForm();

  const next = () => setStep((s) => Math.min(s + 1, steps.length));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const submit = () => {
    alert("Form submitted! Check console for data.");
    console.log(form);
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow">
      <p>{step}- {steps.length}</p>
      {/* Step Indicator */}
      <div className="mb-4 flex gap-2 text-sm">
        {steps.map((s, i) => (
          <span
            key={i}
            className={`rounded px-2 py-1 ${
              i === step ? "bg-indigo-600 text-white" : "bg-slate-100"
            }`}
          >
            {s}
          </span>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 0 && (
        <>
          <Input label="Children Message" value={form.children_message}
            onChange={(v) => setForm({ ...form, children_message: v })} />
        </>
      )}

      {/* STEP 2 */}
      {step === 1 && (
        <>
          <div className="p-4 rounded-xl border border-slate-200">
          <ListInput
            label="Welcomers"
            values={form.welcomers}
            onChange={(v) => setForm({ ...form, welcomers: v })}
          />
          </div>
          <br />
          <div className="p-4 rounded-xl border border-slate-200">
          <ListInput
            label="Aspirations"
            values={form.aspirations}
            onChange={(v) => setForm({ ...form, aspirations: v })}
          />
          </div>
        </>
      )}

      {/* STEP 3 */}
      <div className="flex flex-col gap-4">
      {step === 2 &&
        form.persons.map((p, i) => (
          <div key={i} className="mb-4 border border-slate-200 p-4 rounded-xl">
            <h3 className="font-semibold">{p.person_type}</h3>
            <Input label="Name" value={p.name}
              onChange={(v) => updateArray(form.persons, i, "name", v, "persons", setForm, form)} />
            <Input label="Father Name" value={p.father_name}
              onChange={(v) => updateArray(form.persons, i, "father_name", v, "persons", setForm, form)} />
            <Input label="Mother Name" value={p.mother_name}
              onChange={(v) => updateArray(form.persons, i, "mother_name", v, "persons", setForm, form)} />
          </div>
        ))}
      </div>
      {/* STEP 4 */}
      <div className="flex flex-col gap-4">
      {step === 3 &&
      <>
        {form.events.map((e, i) => (
          <div key={i} className="mb-4 border border-slate-200 p-4 rounded-xl">
            <Input label="Event Name" value={e.event_name}
              onChange={(v) => updateArray(form.events, i, "event_name", v, "events", setForm, form)} />
            <Input type="date" label="Date" value={e.event_date}
              onChange={(v) => updateArray(form.events, i, "event_date", v, "events", setForm, form)} />
            <Input label="Location" value={e.event_location}
              onChange={(v) => updateArray(form.events, i, "event_location", v, "events", setForm, form)} />

              
          </div>
        )
        )}
        <button onClick={() => setForm({ ...form, events: [...form.events, { event_name: "", event_date: "", event_location: "" }] })}
          className="mt-2 inline-flex text-sm text-indigo-600">
          + Add Event
        </button>
        </>
        }
      </div>
      {/* STEP 5 */}
      <div className="flex flex-col gap-4">
      {step === 4 && (
        <>
          {form.arrangers.map((a, i) => (
            <div key={i} className="mb-4 border border-slate-200 p-4 rounded-xl">
              <Input label="Name" value={a.name}
                onChange={(v) => updateArray(form.arrangers, i, "name", v, "arrangers", setForm, form)} />
              <Input label="Mobile" value={a.mobile_number}
              onChange={(v) => updateArray(form.arrangers, i, "mobile_number", v, "arrangers", setForm, form)} />
          </div>
        ))}
        <button onClick={() => setForm({ ...form, arrangers: [...form.arrangers, { name: "", mobile_number: "" }] })}
          className="mt-2 inline-flex text-sm text-indigo-600">
          + Add Arranger
        </button>
        </>
      )}
      </div>
      {/* STEP 6 */}
      {step === 5 && (
        <pre className="rounded bg-slate-100 p-4 text-sm">
          {JSON.stringify(form, null, 2)}
        </pre>
      )}

      {/* Navigation */}
      <div className="mt-4 flex justify-between">
        <button onClick={back} disabled={step === 0}
          className="rounded-xl border px-4 py-2">
          Back
        </button>
        {
          step < steps.length - 1 ? (
            <button onClick={next} className="rounded-xl bg-indigo-600 px-4 py-2 text-white">
              Next
            </button>
          ) : (
            <button type="submit" onClick={submit} className="rounded-xl bg-sky-700 px-4 py-2 text-white">
              Submit
            </button>
          )
        }
      </div>
    </div>
  );
}








