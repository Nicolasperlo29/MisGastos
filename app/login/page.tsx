"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
    setIsLoading(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          background: #f8f7f4;
          font-family: 'Instrument Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .auth-topbar {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 2rem;
          height: 56px;
          display: flex;
          align-items: center;
        }
        .auth-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 1.2rem;
          color: #0f172a;
          text-decoration: none;
        }
        .auth-logo em { font-style: italic; color: #2563eb; }

        .auth-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
        }

        .auth-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          width: 100%;
          max-width: 380px;
          overflow: hidden;
        }

        .auth-card-head {
          padding: 1.75rem 1.75rem 0;
        }
        .auth-card-head h1 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.75rem;
          font-weight: 400;
          color: #0f172a;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .auth-card-head h1 em { font-style: italic; color: #2563eb; }
        .auth-card-head p {
          font-size: 0.78rem;
          color: #94a3b8;
          margin-top: 0.3rem;
        }

        .auth-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 1.25rem 0 0;
        }

        .auth-form {
          padding: 1.5rem 1.75rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .auth-field { display: flex; flex-direction: column; gap: 0.3rem; }
        .auth-label {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #94a3b8;
        }
        .auth-input {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 0.65rem 0.75rem;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .auth-input:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px #dbeafe;
          background: #fff;
        }
        .auth-input::placeholder { color: #cbd5e1; }

        .auth-btn {
          width: 100%;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 0.7rem 1rem;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
          margin-top: 0.25rem;
        }
        .auth-btn:hover:not(:disabled) { background: #1d4ed8; }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-footer {
          padding: 1rem 1.75rem;
          border-top: 1px solid #f1f5f9;
          background: #fafafa;
          text-align: center;
          font-size: 0.78rem;
          color: #94a3b8;
        }
        .auth-footer a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-root">
        <div className="auth-topbar">
          <a href="/" className="auth-logo">
            mis<em>gastos</em>
          </a>
        </div>

        <div className="auth-body">
          <div className="auth-card">
            <div className="auth-card-head">
              <h1>
                Bienvenido <em>de nuevo</em>
              </h1>
              <p>Ingresá a tu cuenta para continuar</p>
              <div className="auth-divider" />
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Contraseña</label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button className="auth-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>

            <div className="auth-footer">
              ¿No tenés cuenta? <a href="/register">Registrate</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
