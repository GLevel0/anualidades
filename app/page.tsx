import CalculatorForm from "./CalculatorForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <h1 className="text-xl md:text-3xl lg:text-4xl text-center font-bold ">Calculadora de anualidades MAT141-01</h1>
          <CalculatorForm />
        </div>
      </main>
    </div>
  );
}
