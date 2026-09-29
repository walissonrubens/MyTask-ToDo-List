import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      return "Preencha todos os campos obrigatórios.";
    }
    if (form.password.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres.";
    }
    if (form.password !== form.confirmPassword) {
      return "As senhas não coincidem.";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Não foi possível criar a conta. O e-mail já pode estar em uso."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>✅ MyTask</h1>
        <p className="subtitle">Crie sua conta gratuita</p>

        {error && <div className="error-msg">{error}</div>}
        {success && (
          <div className="error-msg" style={{ background: "#eaf7f4", color: "#0f9b8e", borderColor: "#0f9b8e" }}>
            Conta criada com sucesso! Redirecionando para o login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Seu nome completo" />
          </div>

          <div className="field">
            <label>E-mail</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="voce@exemplo.com" />
          </div>

          <div className="field">
            <label>Senha</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 8 caracteres" />
          </div>

          <div className="field">
            <label>Confirmar senha</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repita a senha"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <p className="auth-switch">
          Já tem conta? <Link to="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  );
}
