import { useEffect, useMemo, useState } from 'react';
import { useApi } from '../../../shared/hooks/useApi';

type ClientSummary = {
  id: string;
  name: string;
  email: string;
  accessCount: number;
  createdAt: string;
};

export function DashboardPage() {
  const api = useApi();
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<ClientSummary[]>('/clients');
        if (active) {
          setClients(response);
        }
      } catch (err) {
        if (active) {
          setError('Não foi possível carregar os dados.');
          console.error('Dashboard clients error', err);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadClients();
    return () => {
      active = false;
    };
  }, [api]);

  const totalClients = clients.length;

  const recentClients = useMemo(() => {
    return [...clients]
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [clients]);

  const accessLeaders = useMemo(() => {
    return [...clients]
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 5);
  }, [clients]);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {error && (
        <div style={{ padding: '1rem', borderRadius: '0.5rem', background: '#fee2e2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <article style={{ background: '#e6e8ee', padding: '1.25rem', borderRadius: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>Total de clientes</p>
          <strong style={{ fontSize: '2.5rem' }}>{isLoading ? '...' : totalClients}</strong>
        </article>

        <article style={{ background: '#e6e8ee', padding: '1.25rem', borderRadius: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>Novos na última semana</p>
          <strong style={{ fontSize: '2.5rem' }}>
            {isLoading
              ? '...'
              : recentClients.filter((client) => {
                  const created = new Date(client.createdAt).getTime();
                  const aWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                  return created >= aWeekAgo;
                }).length}
          </strong>
        </article>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignItems: 'stretch',
        }}
      >
        <article style={{ background: '#e6e8ee', padding: '1.5rem', borderRadius: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Clientes recentes</h3>
          {isLoading && <p>Carregando...</p>}
          {!isLoading && recentClients.length === 0 && <p>Nenhum cliente cadastrado ainda.</p>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentClients.map((client) => (
              <li key={client.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', paddingBottom: '0.5rem' }}>
                <strong>{client.name}</strong>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{client.email}</div>
                <small style={{ color: '#94a3b8' }}>
                  Criado em {new Date(client.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </small>
              </li>
            ))}
          </ul>
        </article>

        <article style={{ background: '#e6e8ee', padding: '1.5rem', borderRadius: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Acessos ao painel</h3>
          {isLoading && <p>Carregando...</p>}
          {!isLoading && accessLeaders.length === 0 && <p>Aguardando atividade dos clientes.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {accessLeaders.map((client) => {
              const maxAccess = accessLeaders[0]?.accessCount ?? 1;
              const percentage = maxAccess > 0 ? Math.round((client.accessCount / maxAccess) * 100) : 0;
              return (
                <div key={client.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                    <span>{client.name}</span>
                    <span>{client.accessCount}</span>
                  </div>
                  <div style={{ height: '0.75rem', background: '#1f2937', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, #38bdf8, #6366f1)',
                        height: '100%',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
