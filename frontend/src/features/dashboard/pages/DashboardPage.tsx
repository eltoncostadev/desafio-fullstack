import { useEffect, useMemo, useState } from 'react';
import { useApi } from '../../../shared/hooks/useApi';

type ClientSummary = {
  id: string;
  name: string;
  email: string;
  accessCount: number;
  createdAt: string;
};

type PaginatedClientsResponse = {
  items: ClientSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const DASHBOARD_CLIENT_LIMIT = 100;
const ACCESS_BAR_COLORS = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

export function DashboardPage() {
  const api = useApi();
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [leaderboardClients, setLeaderboardClients] = useState<ClientSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalClients, setTotalClients] = useState(0);

  useEffect(() => {
    let active = true;
    const loadClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [accessResponse, recentResponse] = await Promise.all([
          api.get<PaginatedClientsResponse>(
            `/clients?${new URLSearchParams({
              page: '1',
              limit: String(DASHBOARD_CLIENT_LIMIT),
              orderBy: 'accessCount',
            }).toString()}`,
          ),
          api.get<PaginatedClientsResponse>(
            `/clients?${new URLSearchParams({
              page: '1',
              limit: String(DASHBOARD_CLIENT_LIMIT),
              orderBy: 'createdAt',
            }).toString()}`,
          ),
        ]);
        if (active) {
          setLeaderboardClients(accessResponse.items);
          setClients(recentResponse.items);
          setTotalClients(recentResponse.total);
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

  const recentClients = useMemo(() => {
    return [...clients]
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [clients]);

  const accessLeaders = useMemo(() => {
    return leaderboardClients.slice(0, 5);
  }, [leaderboardClients]);
  const maxAccess = accessLeaders[0]?.accessCount ?? 1;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {error && (
        <div style={{ padding: '1rem', borderRadius: '0.5rem', background: '#fee2e2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <article style={{ background: '#e6e8ee', padding: '1.25rem', borderRadius: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>Total de Clientes</p>
          <strong style={{ fontSize: '2.5rem' }}>{isLoading ? '...' : totalClients}</strong>
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
          <h3 style={{ marginTop: 0 }}>Clientes Recentes</h3>
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
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Ranking de Acessos por Cliente</h3>
          {isLoading && <p>Carregando...</p>}
          {!isLoading && accessLeaders.length === 0 && <p>Aguardando atividade dos clientes.</p>}
          {!isLoading && accessLeaders.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {accessLeaders.map((client, index) => {
                const percentage = maxAccess > 0 ? Math.round((client.accessCount / maxAccess) * 100) : 0;
                const barColor = ACCESS_BAR_COLORS[index % ACCESS_BAR_COLORS.length];
                return (
                  <div key={client.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '120px', fontWeight: 600, color: '#0f172a' }}>{client.name}</div>
                    <div style={{ flex: 1, position: 'relative', background: '#cbd5f5', borderRadius: '999px', height: '1.25rem', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          background: barColor,
                          height: '100%',
                          borderRadius: '999px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                      <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#0f172a' }}>
                        {client.accessCount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
