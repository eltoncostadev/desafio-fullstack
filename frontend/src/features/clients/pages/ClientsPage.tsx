import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useApi } from '../../../shared/hooks/useApi';

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

export function ClientsPage() {
  const api = useApi();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>(emptyFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
        setSelectedClient((current) => current ?? data[0] ?? null);
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

  const resetForm = useCallback(() => {
    setFormState(emptyFormState);
    setFormErrors({});
    setIsSubmitting(false);
    setEditingId(null);
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined, server: undefined }));
  };

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

  const selectClient = useCallback(
    async (client: Client) => {
      setDetailsLoading(true);
      setDetailsError(null);
      try {
        const freshClient = await api.get<Client>(`/clients/${client.id}`);
        setSelectedClient(freshClient);
        setClients((prev) => prev.map((item) => (item.id === freshClient.id ? freshClient : item)));
      } catch (error) {
        setDetailsError('Não foi possível carregar os detalhes.');
        console.error('Client details error', error);
      } finally {
        setDetailsLoading(false);
      }
    },
    [api],
  );

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

        setSelectedClient(savedClient);
        resetForm();
      } catch (error) {
        setFormErrors({ server: 'Não foi possível salvar o cliente.' });
        console.error('Client save error', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [api, editingId, formState.email, formState.name, formState.notes, formState.phone, resetForm, validateForm],
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
  };

  const handleDelete = async (client: Client) => {
    const shouldDelete = window.confirm(`Remover ${client.name}? Esta ação pode ser revertida mais tarde.`);
    if (!shouldDelete) {
      return;
    }

    try {
      await api.remove<void>(`/clients/${client.id}`);
      setClients((prev) => prev.filter((item) => item.id !== client.id));
      setSelectedClient((prev) => (prev?.id === client.id ? null : prev));
      if (editingId === client.id) {
        resetForm();
      }
    } catch (error) {
      setListError('Não foi possível remover o cliente.');
      console.error('Client delete error', error);
    }
  };

  const formTitle = useMemo(() => (editingId ? 'Editar cliente' : 'Novo cliente'), [editingId]);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2>Clientes</h2>
        <p>Gerencie cadastros, consulte detalhes e acompanhe a quantidade de acessos.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}
      >
        <article style={{ background: '#111827', padding: '1.5rem', borderRadius: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>{formTitle}</h3>
          <form onSubmit={upsertClient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              Nome
              <input name="name" value={formState.name} onChange={handleInputChange} placeholder="Cliente XPTO" />
              {formErrors.name && <span style={{ color: '#f87171', fontSize: '0.875rem' }}>{formErrors.name}</span>}
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              E-mail
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
                placeholder="cliente@empresa.com"
              />
              {formErrors.email && <span style={{ color: '#f87171', fontSize: '0.875rem' }}>{formErrors.email}</span>}
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              Telefone
              <input name="phone" value={formState.phone} onChange={handleInputChange} placeholder="(11) 99999-0000" />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                {isSubmitting ? 'Salvando...' : 'Salvar' }
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ padding: '0.75rem 1rem', background: 'transparent', border: '1px solid #f87171', color: '#f87171' }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </article>

        <article style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '1rem', minHeight: '20rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ marginTop: 0 }}>Lista</h3>
            {isLoading && <span>Carregando...</span>}
          </div>
          {listError && <p style={{ color: '#f87171' }}>{listError}</p>}
          {!isLoading && clients.length === 0 ? (
            <p>Nenhum cliente cadastrado ainda.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nome</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>E-mail</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Acessos</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} style={{ borderTop: '1px solid rgba(248, 250, 252, 0.1)' }}>
                      <td style={{ padding: '0.5rem' }}>{client.name}</td>
                      <td style={{ padding: '0.5rem' }}>{client.email}</td>
                      <td style={{ padding: '0.5rem' }}>{client.accessCount}</td>
                      <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => selectClient(client)} style={{ padding: '0.25rem 0.5rem' }}>
                          Ver detalhes
                        </button>
                        <button type="button" onClick={() => handleEdit(client)} style={{ padding: '0.25rem 0.5rem' }}>
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(client)}
                          style={{ padding: '0.25rem 0.5rem', background: '#ef4444', border: 'none', color: '#fff' }}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article style={{ background: '#111827', padding: '1.5rem', borderRadius: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Detalhes</h3>
          {detailsLoading && <p>Atualizando informações...</p>}
          {detailsError && <p style={{ color: '#f87171' }}>{detailsError}</p>}
          {!selectedClient && !detailsLoading && <p>Selecione um cliente para visualizar os dados.</p>}
          {selectedClient && !detailsLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>{selectedClient.name}</strong>
              <span>E-mail: {selectedClient.email}</span>
              {selectedClient.phone && <span>Telefone: {selectedClient.phone}</span>}
              <span>Acessos ao painel: {selectedClient.accessCount}</span>
              {selectedClient.notes && <span>Observações: {selectedClient.notes}</span>}
              <small>Atualizado em {new Date(selectedClient.updatedAt).toLocaleString()}</small>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
