import CardForm from "./cardForm";

export default function CreateCardPage() {
  return (
    <div className="mx-auto w-full lg:w-[90%] p-6">
      <h1 className="mb-6 text-2xl font-bold">Create Marriage Card</h1>
      <CardForm />
    </div>
  );
}