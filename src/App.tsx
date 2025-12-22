import ROICalculator from "@/components/ROICalculator";

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <section className="max-w-4xl mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Combien l’IA peut-elle vraiment rapporter ?
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Estimez en 30 secondes le ROI réel de l’IA sur votre équipe.
        </p>
      </section>

      <ROICalculator />
    </main>
  );
}
