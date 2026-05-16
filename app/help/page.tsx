export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-slate-900 font-sans">
      <header className="border-b border-slate-200 bg-white px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl tracking-tight">
          mis<span className="italic text-blue-600">gastos</span>
        </h1>

        <a
          href="/dashboard"
          className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
        >
          Volver al dashboard
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-5xl font-light tracking-tight mb-4">
            Centro de <span className="italic text-blue-600">ayuda</span>
          </h2>

          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Encontrá información sobre cómo usar la aplicación, registrar
            gastos, administrar categorías y exportar tus datos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-4">💸</div>

            <h3 className="text-xl font-semibold mb-2">Registrar gastos</h3>

            <p className="text-slate-500 leading-relaxed text-sm">
              Desde el panel principal podés agregar nuevos gastos indicando
              descripción, categoría y monto.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-4">📊</div>

            <h3 className="text-xl font-semibold mb-2">
              Visualizar estadísticas
            </h3>

            <p className="text-slate-500 leading-relaxed text-sm">
              Consultá gráficos de distribución por categoría y gastos mensuales
              para analizar tus finanzas.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-4">🗂️</div>

            <h3 className="text-xl font-semibold mb-2">
              Administrar categorías
            </h3>

            <p className="text-slate-500 leading-relaxed text-sm">
              Creá, eliminá y organizá categorías personalizadas para clasificar
              mejor tus gastos.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-4">📄</div>

            <h3 className="text-xl font-semibold mb-2">Exportar información</h3>

            <p className="text-slate-500 leading-relaxed text-sm">
              Exportá los gastos filtrados en PDF para guardar reportes o
              compartir información.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-semibold mb-6">Preguntas frecuentes</h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">¿Cómo edito un gasto?</h4>

              <p className="text-sm text-slate-500 leading-relaxed">
                Presioná el botón ✏️ en el historial de gastos para modificar la
                información.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">¿Cómo elimino un gasto?</h4>

              <p className="text-sm text-slate-500 leading-relaxed">
                Usá el botón ✕ dentro del historial. Se mostrará una ventana de
                confirmación antes de eliminarlo.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">¿Cómo cambio el tema?</h4>

              <p className="text-sm text-slate-500 leading-relaxed">
                Desde el menú de configuración podés alternar entre modo claro y
                oscuro.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
