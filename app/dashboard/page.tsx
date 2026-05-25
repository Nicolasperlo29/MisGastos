"use client";

import { Expense } from "@prisma/client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./dashboard.module.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { signOut } from "next-auth/react";
import jsPDF from "jspdf";
import Link from "next/link";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  // const [chartData, setChartData] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState({ total: 0, count: 0, average: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [monthFilter, setMonthFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showConfig, setShowConfig] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [currentChart, setCurrentChart] = useState(0);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);

  function handleThemeToggle() {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.setAttribute(
        "data-theme",
        next ? "dark" : "light",
      );
      return next;
    });
  }

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#d97706",
    "#7c3aed",
    "#0891b2",
  ];

  async function loadExpenses() {
    const res = await fetch("/api/expenses");
    setExpenses(await res.json());
  }
  async function loadSummary() {
    const res = await fetch("/api/expenses/summary");
    setSummary(await res.json());
  }
  async function loadCategories() {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }
  // async function loadChartData() {
  //   const res = await fetch("/api/expenses/categories");
  //   setChartData(await res.json());
  // }

  async function deleteExpense(id: string) {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    loadExpenses();
    loadSummary();
    // loadChartData();
  }

  async function updateExpense(id: string) {
    await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        amount,
        category,
      }),
    });
    loadExpenses();
    loadSummary();
    // loadChartData();
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setCategory("");
  }

  function openDeleteModal(id: string) {
    setDeleteId(id);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    await fetch(`/api/expenses/${deleteId}`, {
      method: "DELETE",
    });

    setShowDeleteModal(false);
    setDeleteId(null);

    await Promise.all([loadExpenses(), loadSummary()]);
  }

  async function handleCreateCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === newCategory.trim().toLowerCase(),
      )
    ) {
      setError("La categoría ya existe");
      return;
    }

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newCategory,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setError("");
    setNewCategory("");

    await loadCategories();
  }

  async function deleteCategory(id: string) {
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    await loadCategories();
  }

  function openCategoriesModal() {
    setShowCategoriesModal(true);
  }

  function closeCategoriesModal() {
    setShowCategoriesModal(false);
  }

  function handleNextChart() {
    setCurrentChart((prev) => (prev === 1 ? 0 : 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (Number(amount) > 10000000) {
      alert("El monto no puede ser mayor a 10000000");
      return;
    }

    if (title.length > 25) {
      alert("La descripción no puede superar los 25 caracteres");
      return;
    }

    setIsSubmitting(true);

    const body = {
      title,
      amount: Number(amount),
      category: category || "Sin categoría",
    };

    if (editingId) {
      await fetch(`/api/expenses/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
          type: "expense",
        }),
      });
    }

    setTitle("");
    setAmount("");
    setCategory("");
    setEditingId(null);

    await Promise.all([loadExpenses(), loadSummary()]);

    setIsSubmitting(false);
  }

  function handleEdit(expense: Expense) {
    setEditingId(expense.id);

    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
  }

  function handleLogout() {
    signOut({
      callbackUrl: "/login",
    });
  }

  useEffect(() => {
    loadExpenses();
    loadSummary();
    loadCategories();
    // loadChartData();
  }, []);

  function handleConfigClick() {
    setShowConfig((prev) => !prev);
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            padding: "6px 12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ color: "#64748b", fontSize: 11, marginBottom: 2 }}>
            {payload[0].name}
          </p>
          <p style={{ color: "#0f172a", fontWeight: 600, fontSize: 14 }}>
            ${Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const catIcon: Record<string, string> = {
    Comida: "🍽",
    Transporte: "🚌",
    Salud: "💊",
    Entretenimiento: "🎬",
    Ropa: "👕",
    Hogar: "🏠",
    "Sin categoría": "📋",
  };
  function getIcon(cat: string) {
    return catIcon[cat] ?? "📋";
  }

  const filteredExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.createdAt);

    // filtro por mes
    if (monthFilter) {
      const expMonth = expDate.toISOString().slice(0, 7);

      if (expMonth !== monthFilter) {
        return false;
      }
    }

    // desde
    if (fromDate) {
      if (expDate < new Date(fromDate)) {
        return false;
      }
    }

    // hasta
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      if (expDate > end) {
        return false;
      }
    }

    return true;
  });

  const chartData = Object.values(
    filteredExpenses.reduce((acc: any, exp: any) => {
      const category = exp.category || "Sin categoría";

      if (!acc[category]) {
        acc[category] = {
          category,
          value: 0,
        };
      }

      acc[category].value += Number(exp.amount);

      return acc;
    }, {}),
  );

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    const total = expenses
      .filter((exp) => {
        const d = new Date(exp.createdAt);

        return d.getFullYear() === selectedYear && d.getMonth() === i;
      })
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      month: monthNames[i],
      total,
    };
  });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  function exportExpensesPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Gastos", 14, 20);

    let y = 40;

    filteredExpenses.forEach((exp: any, index: number) => {
      doc.setFontSize(12);

      doc.text(
        `${index + 1}. ${exp.title} | ${exp.category} | $${exp.amount}`,
        14,
        y,
      );

      y += 10;

      doc.text(new Date(exp.createdAt).toLocaleDateString("es-AR"), 14, y);

      y += 15;

      // nueva página
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("gastos.pdf");
  }

  const maxExpense = Math.max(...monthlyData.map((m) => m.total));

  return (
    <>
      <div className={styles["d-root"]}>
        <div className={styles["d-topbar"]}>
          {/* IZQUIERDA */}
          <span className={styles["d-topbar-logo"]}>
            mis<em>gastos</em>
          </span>

          {/* CENTRO */}
          <span className={styles["d-topbar-date"]}>
            {new Date().toLocaleDateString("es-AR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>

          {/* DERECHA */}
          <div className={styles["d-topbar-actions"]}>
            <Link href="/help" className={styles["d-help-icon"]} title="Ayuda">
              ?
            </Link>

            <div className={styles["d-config-wrap"]}>
              <button
                className={styles["d-config-btn"]}
                onClick={handleConfigClick}
              >
                ⚙️ Config
              </button>
              {showConfig && (
                <div className={styles["d-config-dropdown"]}>
                  <button
                    className={styles["d-config-item"]}
                    onClick={exportExpensesPDF}
                  >
                    Exportar gastos
                  </button>

                  <button
                    className={styles["d-config-item"]}
                    onClick={handleThemeToggle}
                  >
                    {isDark ? "☀️ Tema claro" : "🌙 Tema oscuro"}
                  </button>

                  <button
                    className={styles["d-config-item"]}
                    onClick={openCategoriesModal}
                  >
                    Categorías
                  </button>

                  <button className={styles["d-config-itemDanger"]}>
                    Reiniciar datos
                  </button>
                </div>
              )}
            </div>

            <button onClick={handleLogout} className={styles["d-logout-btn"]}>
              Salir
            </button>
          </div>
        </div>

        {showCategoriesModal && (
          <div className={styles["d-modal-overlay"]}>
            <div className={styles["d-modal"]}>
              <h3>Administrar categorías</h3>

              <div className={styles["d-categories-list"]}>
                {categories.map((cat: any) => (
                  <div key={cat.id} className={styles["d-category-row"]}>
                    <span>{cat.name}</span>

                    <button
                      className={styles["d-del"]}
                      onClick={() => deleteCategory(cat.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleCreateCategory}
                className={styles["d-form"]}
              >
                <input
                  className={styles["d-input"]}
                  placeholder="Nueva categoría"
                  value={newCategory}
                  maxLength={25}
                  onChange={(e) => setNewCategory(e.target.value)}
                />

                <button className={styles["d-btn"]}>Agregar categoría</button>

                <button
                  type="button"
                  className={styles["d-cancel-btn"]}
                  onClick={closeCategoriesModal}
                >
                  Cerrar
                </button>

                <p className={styles["d-error"]}>{error}</p>
              </form>
            </div>
          </div>
        )}

        <div className={styles["d-body"]}>
          <div className={styles["d-heading"]}>
            <h1>
              Resumen <em>financiero</em>
            </h1>

            <p>Control de gastos personales</p>
          </div>

          <div className={styles["d-summary"]}>
            <div className={styles["d-stat"]}>
              <span className={styles["d-stat-label"]}>Total gastado</span>

              <span className={`${styles["d-stat-value"]} ${styles["blue"]}`}>
                ${(summary.total || 0).toFixed(2)}
              </span>

              <span className={styles["d-stat-sub"]}>acumulado</span>
            </div>

            <div className={styles["d-stat"]}>
              <span className={styles["d-stat-label"]}>Transacciones</span>

              <span className={styles["d-stat-value"]}>{summary.count}</span>

              <span className={styles["d-stat-sub"]}>registradas</span>
            </div>

            <div className={styles["d-stat"]}>
              <span className={styles["d-stat-label"]}>Promedio</span>

              <span className={styles["d-stat-value"]}>
                ${(summary.average || 0).toFixed(2)}
              </span>

              <span className={styles["d-stat-sub"]}>por gasto</span>
            </div>
          </div>

          <div className={styles["d-cols"]}>
            {/* CHART */}
            <div className={styles["d-card"]}>
              <div className={styles["d-card-head"]}>
                <span className={styles["d-card-title"]}>
                  {currentChart === 0
                    ? "Distribución por categoría"
                    : "Gastos por mes"}
                </span>

                <button
                  className={styles["d-chart-btn"]}
                  onClick={handleNextChart}
                >
                  Siguiente gráfico
                </button>
              </div>

              <div className={styles["d-card-body"]}>
                {/* GRAFICO CIRCULAR */}
                {currentChart === 0 && (
                  <>
                    {chartData.length > 0 ? (
                      <div className={styles["d-chart-wrap"]}>
                        <ResponsiveContainer width={160} height={160}>
                          <PieChart>
                            <Pie
                              data={chartData}
                              dataKey="value"
                              nameKey="category"
                              cx="50%"
                              cy="50%"
                              innerRadius={44}
                              outerRadius={72}
                              strokeWidth={2}
                              stroke="#f8f7f4"
                            >
                              {chartData.map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={COLORS[i % COLORS.length]}
                                />
                              ))}
                            </Pie>

                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>

                        <div className={styles["d-legend"]}>
                          {chartData.map((item: any, i: number) => (
                            <div key={i} className={styles["d-legend-row"]}>
                              <span
                                className={styles["d-legend-dot"]}
                                style={{
                                  background: COLORS[i % COLORS.length],
                                }}
                              />

                              <span className={styles["d-legend-name"]}>
                                {item.category}
                              </span>

                              <span className={styles["d-legend-val"]}>
                                ${Number(item.value).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className={styles["d-empty"]}>Sin datos aún</div>
                    )}
                  </>
                )}

                {/* GRAFICO DE BARRAS */}
                {currentChart === 1 && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "1rem",
                      }}
                    >
                      <select
                        className={styles["d-input"]}
                        style={{
                          width: 110,
                          padding: "0.45rem 0.6rem",
                        }}
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(Number(e.target.value))
                        }
                      >
                        {[2024, 2025, 2026, 2027].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ width: "100%", height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyData}
                          margin={{
                            top: 20,
                            right: 10,
                            left: 10,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            stroke="#e2e8f0"
                          />

                          <XAxis
                            dataKey="month"
                            tick={{
                              fill: "#64748b",
                              fontSize: 12,
                            }}
                            tickLine={false}
                            axisLine={false}
                          />

                          <YAxis
                            tick={{
                              fill: "#94a3b8",
                              fontSize: 11,
                            }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                              `$${Number(value).toLocaleString()}`
                            }
                          />

                          <Tooltip
                            formatter={(value: any) =>
                              `$${Number(value).toLocaleString()}`
                            }
                            contentStyle={{
                              borderRadius: 10,
                              border: "1px solid #e2e8f0",
                              background: "#fff",
                            }}
                          />

                          <Bar
                            dataKey="total"
                            radius={[8, 8, 0, 0]}
                            animationDuration={800}
                          >
                            {monthlyData.map((entry, i) => (
                              <Cell
                                key={i}
                                fill={
                                  entry.total === maxExpense
                                    ? "#2563eb"
                                    : "#cbd5e1"
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* FORM */}
            <div className={styles["d-card"]}>
              <div className={styles["d-card-head"]}>
                <span className={styles["d-card-title"]}>Registrar gasto</span>
              </div>

              <div className={styles["d-card-body"]}>
                <form onSubmit={handleSubmit} className={styles["d-form"]}>
                  <div>
                    <label className={styles["d-field-label"]}>
                      Descripción
                    </label>

                    <input
                      className={styles["d-input"]}
                      placeholder="ej. almuerzo, nafta..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={25}
                      required
                    />
                  </div>

                  <div>
                    <label className={styles["d-field-label"]}>Categoría</label>

                    <select
                      className={styles["d-input"]}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Sin categoría</option>

                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={styles["d-field-label"]}>Monto ($)</label>

                    <input
                      className={styles["d-input"]}
                      placeholder="0.00"
                      type="number"
                      min="0"
                      max="10000000"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    className={styles["d-btn"]}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {editingId ? "Actualizar gasto" : "Agregar gasto"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className={styles["d-cancel-btn"]}
                      onClick={cancelEdit}
                    >
                      Cancelar
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className={styles["d-card"]}>
            <div className={styles["d-filters"]}>
              <div>
                <label className={styles["d-field-label"]}>Mes</label>

                <input
                  type="month"
                  className={styles["d-input"]}
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                />
              </div>

              <div>
                <label className={styles["d-field-label"]}>Desde</label>

                <input
                  type="date"
                  className={styles["d-input"]}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div>
                <label className={styles["d-field-label"]}>Hasta</label>

                <input
                  type="date"
                  className={styles["d-input"]}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <button
                className={styles["d-cancel-btn"]}
                onClick={() => {
                  setMonthFilter("");
                  setFromDate("");
                  setToDate("");
                }}
              >
                Limpiar
              </button>
            </div>
            <div className={styles["d-card-head"]}>
              <span className={styles["d-card-title"]}>Historial</span>

              <span className={styles["d-badge"]}>
                {filteredExpenses.length} gastos
              </span>
            </div>

            {filteredExpenses.length === 0 ? (
              <div className={styles["d-empty"]} style={{ padding: "3rem" }}>
                Todavía no hay gastos registrados
              </div>
            ) : (
              <div className={styles["d-list"]}>
                {filteredExpenses.map((exp: any, i: number) => (
                  <div
                    key={exp.id}
                    className={styles["d-list-item"]}
                    style={{
                      animationDelay: `${i * 25}ms`,
                    }}
                  >
                    <div className={styles["d-item-icon"]}>
                      {getIcon(exp.category)}
                    </div>

                    <div className={styles["d-item-info"]}>
                      <p className={styles["d-item-title"]}>{exp.title}</p>

                      <div className={styles["d-item-meta"]}>
                        <span className={styles["d-item-cat"]}>
                          {exp.category}
                        </span>

                        <span className={styles["d-item-sep"]}>·</span>

                        <span className={styles["d-item-date"]}>
                          {new Date(exp.createdAt).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <span className={styles["d-item-amount"]}>
                      ${Number(exp.amount).toFixed(2)}
                    </span>

                    <div className={styles["d-item-right"]}>
                      <button
                        className={styles["d-del"]}
                        onClick={() => handleEdit(exp)}
                      >
                        ✏️
                      </button>
                    </div>

                    <div className={styles["d-item-right"]}>
                      <button
                        className={styles["d-del"]}
                        onClick={() => openDeleteModal(exp.id)}
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showDeleteModal && (
          <div className={styles["d-modal-overlay"]}>
            <div className={styles["d-modal"]}>
              <h3>Eliminar gasto</h3>

              <p>¿Seguro que querés eliminar este gasto?</p>

              <div className={styles["d-modal-actions"]}>
                <button
                  className={styles["d-cancel-btn"]}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>

                <button
                  className={styles["d-confirm-btn"]}
                  onClick={confirmDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
