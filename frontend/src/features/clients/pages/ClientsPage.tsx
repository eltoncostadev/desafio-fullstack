import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useApi } from '../../../shared/hooks/useApi';
import styles from './ClientsPage.module.css';

type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormState, string>> & {
  server?: string;
};

const emptyFormState: FormState = {
  name: '',
  email: '',
  phone: '',
  notes: '',
};

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export function ClientsPage() {
  const api = useApi();
  const [clients, setClients] = useState<Client[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState<FormState>(emptyFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchClients = async () => {
      setIsLoading(true);
      setListError(null);
      try {
        const data = await api.get<Client[]>('/clients');
        if (!active) {
          return;
        }
        setClients(data);
      } catch (error) {
        if (active) {
          setListError('Não foi possível carregar os clientes.');
          console.error('Clients fetch error', error);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchClients();
    return () => {
      active = false;
    };
  }, [api]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined, server: undefined }));
  };

  const openCreatePanel = useCallback(() => {
    setEditingId(null);
    setFormState(emptyFormState);
    setFormErrors({});
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setEditingId(null);
    setFormState(emptyFormState);
    setFormErrors({});
    setIsPanelOpen(false);
  }, []);

  const validateForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};
    if (!formState.name.trim()) {
      errors.name = 'Informe o nome do cliente.';
    }
    if (!formState.email.trim()) {
      errors.email = 'Informe o e-mail.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formState.email)) {
      errors.email = 'E-mail inválido.';
    }
    return errors;
  }, [formState.email, formState.name]);

  const upsertClient = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      setFormErrors({});

      const payload = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim() || undefined,
        notes: formState.notes.trim() || undefined,
      };

      try {
        const savedClient = editingId
          ? await api.put<Client>(`/clients/${editingId}`, payload)
          : await api.post<Client>('/clients', payload);

        setClients((prev) => {
          if (editingId) {
            return prev.map((client) => (client.id === savedClient.id ? savedClient : client));
          }
          return [savedClient, ...prev];
        });

        closePanel();
      } catch (error) {
        setFormErrors({ server: 'Não foi possível salvar o cliente.' });
        console.error('Client save error', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [api, closePanel, editingId, formState.email, formState.name, formState.notes, formState.phone, validateForm],
  );

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setFormState({
      name: client.name,
      email: client.email,
      phone: client.phone ?? '',
      notes: client.notes ?? '',
    });
    setFormErrors({});
    setIsPanelOpen(true);
  };

  const handleDelete = async (client: Client) => {
    const shouldDelete = window.confirm(`Remover ${client.name}? Esta ação pode ser revertida mais tarde.`);
    if (!shouldDelete) {
      return;
    }

    try {
      await api.remove<void>(`/clients/${client.id}`);
      setClients((prev) => prev.filter((item) => item.id !== client.id));
      if (editingId === client.id) {
        closePanel();
      }
    } catch (error) {
      setListError('Não foi possível remover o cliente.');
      console.error('Client delete error', error);
    }
  };
  const headerCountLabel = isLoading ? 'Carregando clientes...' : `${clients.length} clientes encontrados`;

  return (
    <section className={styles.page}>
      <div className={styles.headline}>
        <div>
          <h2>Clientes</h2>
          <p className={styles.countLabel}>{headerCountLabel}</p>
        </div>
      </div>

      {listError && <div className={styles.errorBanner}>{listError}</div>}

      {isLoading ? (
        <div className={styles.emptyState}>Carregando clientes...</div>
      ) : clients.length === 0 ? (
        <div className={styles.emptyState}>
          Nenhum cliente cadastrado ainda. Clique em "Criar cliente" para adicionar o primeiro.
        </div>
      ) : (
        <div className={styles.grid}>
          {clients.map((client) => (
            <div key={client.id} className={styles.card}>
              <h3>{client.name}</h3>
              <p>{client.email}</p>
              <p>{client.phone || 'Telefone não informado'}</p>
              <span className={styles.accessTag}>Acessos: {client.accessCount}</span>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => handleEdit(client)}
                  aria-label={`Editar ${client.name}`}
                >
                  <PencilIcon />
                </button>
                <button
                  type="button"
                  className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                  onClick={() => handleDelete(client)}
                  aria-label={`Remover ${client.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button type="button" className={styles.createButton} onClick={openCreatePanel}>
        Criar cliente
      </button>

      {isPanelOpen && (
        <div className={styles.panelOverlay}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3>{editingId ? 'Editar cliente' : 'Novo cliente'}</h3>
              <button type="button" className={styles.closeButton} onClick={closePanel} aria-label="Fechar formulário">
                &times;
              </button>
            </div>
            <form className={styles.panelForm} onSubmit={upsertClient}>
              <label>
                Nome
                <input name="name" value={formState.name} onChange={handleInputChange} placeholder="Cliente XPTO" />
                {formErrors.name && <span style={{ color: '#f87171', fontSize: '0.85rem' }}>{formErrors.name}</span>}
              </label>

              <label>
                E-mail
                <input type="email" name="email" value={formState.email} onChange={handleInputChange} placeholder="cliente@empresa.com" />
                {formErrors.email && <span style={{ color: '#f87171', fontSize: '0.85rem' }}>{formErrors.email}</span>}
              </label>

              <label>
                Telefone
                <input name="phone" value={formState.phone} onChange={handleInputChange} placeholder="(11) 99999-0000" />
              </label>

              <label>
                Observações
                <textarea
                  name="notes"
                  value={formState.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Informações adicionais sobre o cliente"
                />
              </label>

              {formErrors.server && <span style={{ color: '#f87171' }}>{formErrors.server}</span>}

              <div className={styles.panelActions}>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={closePanel}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
