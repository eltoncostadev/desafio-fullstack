import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/auth/auth-context';
import styles from './LoginPage.module.css';

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
    event.target.setCustomValidity('');
  };

  const translateValidity = (input: HTMLInputElement): void => {
    if (input.validity.valueMissing) {
      input.setCustomValidity('Este campo é obrigatório.');
      return;
    }
    if (input.type === 'email' && input.validity.typeMismatch) {
      input.setCustomValidity('Informe um e-mail válido.');
      return;
    }
    input.setCustomValidity('');
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
    <section
      style={{
        minHeight: '100vh',
        background: '#f5f5f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#fff',
          color: '#1a1a1a',
          borderRadius: '1.5rem',
          padding: '3rem',
          boxShadow: '0 35px 80px rgba(10, 10, 10, 0.2)',
        }}
      >
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#1c1917' }}>Olá, seja bem-vindo!</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <label
            className={styles.inputLabel}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            E-mail
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nome@empresa.com"
              required
              className={styles.inputField}
              onInvalid={(event) => translateValidity(event.currentTarget)}
              onInput={(event) => translateValidity(event.currentTarget)}
            />
            {errors.email && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errors.email}</span>}
          </label>

          <label
            className={styles.inputLabel}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            Senha
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className={styles.inputField}
              onInvalid={(event) => translateValidity(event.currentTarget)}
              onInput={(event) => translateValidity(event.currentTarget)}
            />
            {errors.password && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errors.password}</span>}
          </label>

          {errors.server && (
            <span style={{ color: '#dc2626', fontSize: '0.9rem' }}>{errors.server}</span>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '1rem 1.25rem',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              background: '#f97316',
              color: '#fff',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
              boxShadow: isSubmitting ? 'none' : '0 15px 30px rgba(249, 115, 22, 0.35)',
            }}
            onMouseEnter={(event) => {
              if (!isSubmitting) {
                event.currentTarget.style.transform = 'translateY(-2px)';
                event.currentTarget.style.background = '#ea580c';
              }
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = 'none';
              event.currentTarget.style.background = '#f97316';
            }}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </section>
  );
}
