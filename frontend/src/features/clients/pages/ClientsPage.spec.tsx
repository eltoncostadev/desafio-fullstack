import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientsPage } from './ClientsPage';

const mockGet = vi.fn();

vi.mock('../../../shared/hooks/useApi', () => ({
  useApi: () => ({
    get: mockGet,
    post: vi.fn(),
    put: vi.fn(),
    remove: vi.fn(),
  }),
}));

describe('ClientsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while fetching clients', () => {
    mockGet.mockReturnValue(new Promise(() => {}));

    render(<ClientsPage />);

    const loadingStates = screen.getAllByText('Carregando clientes...');
    expect(loadingStates).toHaveLength(2);
  });

  it('renders clients when the API succeeds', async () => {
    mockGet.mockResolvedValue({
      items: [
        {
          id: '1',
          name: 'Client One',
          email: 'one@example.com',
          phone: '(11) 99999-0000',
          notes: 'VIP',
          accessCount: 3,
          createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
          updatedAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
        },
      ],
      total: 1,
      page: 1,
      limit: 16,
      totalPages: 1,
    });

    render(<ClientsPage />);

    expect(await screen.findByText('Client One')).toBeInTheDocument();
    expect(screen.getByText('one@example.com')).toBeInTheDocument();
    expect(screen.getByText('Acessos: 3')).toBeInTheDocument();
  });
});
