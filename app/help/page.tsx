"use client";

import { useState } from "react";
import styles from "./help.module.css";

const sections = [
  {
    icon: "💸",
    title: "Registrar gastos",
    description:
      "Desde el panel principal podés agregar nuevos gastos indicando descripción, categoría y monto. También podés editar cualquier gasto existente desde el historial.",
  },
  {
    icon: "📊",
    title: "Visualizar estadísticas",
    description:
      "Consultá gráficos de distribución por categoría y gastos mensuales para analizar tus finanzas. Podés filtrar por año en el gráfico de barras.",
  },
  {
    icon: "🗂️",
    title: "Administrar categorías",
    description:
      "Creá, eliminá y organizá categorías personalizadas desde el menú de configuración para clasificar mejor tus gastos.",
  },
  {
    icon: "📄",
    title: "Exportar información",
    description:
      "Exportá los gastos filtrados en PDF desde el menú de configuración para guardar reportes o compartir información.",
  },
];

const faqs = [
  {
    q: "¿Cómo edito un gasto?",
    a: "Presioná el botón ✏️ en el historial de gastos. El formulario se cargará con los datos actuales para que puedas modificarlos.",
  },
  {
    q: "¿Cómo elimino un gasto?",
    a: "Usá el botón ✕ dentro del historial. Se mostrará una ventana de confirmación antes de eliminarlo definitivamente.",
  },
  {
    q: "¿Cómo filtro por fecha?",
    a: "En el historial encontrás filtros por mes, fecha desde y fecha hasta. Podés combinarlos o limpiarlos con el botón Limpiar.",
  },
  {
    q: "¿Cómo cambio el tema?",
    a: "Desde el menú ⚙️ Config en la barra superior podés alternar entre modo claro y oscuro. La preferencia se guarda automáticamente.",
  },
  {
    q: "¿Los datos se guardan automáticamente?",
    a: "Sí, cada gasto que registrás se guarda inmediatamente en la base de datos. No hace falta confirmar ni guardar manualmente.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.logo}>
          mis<em>gastos</em>
        </span>
        <a href="/dashboard" className={styles.back}>
          ← Volver al dashboard
        </a>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <p className={styles.heroEyebrow}>Centro de ayuda</p>
          <h1 className={styles.heroTitle}>
            ¿En qué podemos <em>ayudarte?</em>
          </h1>
          <p className={styles.heroSub}>
            Encontrá información sobre cómo usar la aplicación, registrar
            gastos, administrar categorías y exportar tus datos.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Funcionalidades</h2>
          <div className={styles.grid}>
            {sections.map((s, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardIcon}>{s.icon}</div>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardDesc}>{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Preguntas frecuentes</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ""}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className={styles.faqChevron}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && <p className={styles.faqAnswer}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>

        <div className={styles.cta}>
          <p className={styles.ctaText}>¿Seguís con dudas?</p>
          <a href="/dashboard" className={styles.ctaBtn}>
            Ir al dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
