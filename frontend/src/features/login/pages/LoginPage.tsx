import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/auth/auth-context';

type FormState = {
  email: string;
  password: string;
};

type FormErrors = Partial<FormState> & {
  server?: string;
};

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type LocationState = {
  from?: Location;
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((): FormErrors => {
    const validationErrors: FormErrors = {};

    if (!form.email.trim()) {
      validationErrors.email = 'Informe o e-mail.';
    } else if (!emailPattern.test(form.email)) {
      validationErrors.email = 'E-mail inválido.';
    }

    if (!form.password.trim()) {
      validationErrors.password = 'Informe a senha.';
    }

    return validationErrors;
  }, [form.email, form.password]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, server: undefined }));
  };

  const redirectPath = useMemo(
    () => (location.state as LocationState | null)?.from?.pathname ?? '/dashboard',
    [location.state],
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await login({ email: form.email, password: form.password });
    } catch (error) {
      setErrors({ server: 'Não foi possível autenticar. Verifique as credenciais.' });
      console.error('Login error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h2>Acessar o painel</h2>
      <p>Use as credenciais fornecidas pelo administrador para entrar.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '24rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          E-mail
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="nome@empresa.com"
            required
          />
          {errors.email && <span style={{ color: '#f87171', fontSize: '0.875rem' }}>{errors.email}</span>}
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Senha
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          {errors.password && <span style={{ color: '#f87171', fontSize: '0.875rem' }}>{errors.password}</span>}
        </label>

        {errors.server && <span style={{ color: '#f87171' }}>{errors.server}</span>}

        <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  );
}
