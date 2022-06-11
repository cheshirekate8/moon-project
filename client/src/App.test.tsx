import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';
import { monify } from './App';

const mockResponse = [
  { "address": "6kXnRAqbndfpdEeHk7EbdpKKDor97StEhVm6TkWzxtFf", "lamports": 500000000000000000, "sol": 500000000, "usd": 135000000 },
  { "address": "HPFtRGtg5eVRAA9bNjDRokrEzK15qnUaLKXX2niGxnLH", "lamports": 1000000000000000, "sol": 1000000, "usd": 270000 },
  { "address": "6x8bjD58gYr4cuQkcxvxCS1JFwNr9SFEMzWTPmphr1JH", "lamports": 499426655000, "sol": 499.426655, "usd": 134.84519685 },
];

const server = setupServer(
  rest.get('/top20', (req, res, ctx) => {
    return res(ctx.json(mockResponse))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('App renders correctly', () => {
  it('renders loading text before data is returned', async () => {
    render(<App />);

    const logo = screen.getByRole('img');
    const header = screen.getByText('Top 20 Accounts')
    const loading = screen.getByText('Loading...')

    expect(logo).toBeVisible();
    expect(header).toBeVisible();
    expect(loading).toBeVisible();
  });

  it('renders initial data correctly', async () => {
    render(<App />);

    const loading = screen.getByText('Loading...')
    await waitFor(() => {
      expect(loading).not.toBeInTheDocument();
    });

    const list = screen.getByRole('list');
    const listItem = screen.getAllByRole('listitem');

    expect(list).toBeVisible();
    expect(listItem).toHaveLength(3);

    // screen.logTestingPlaygroundURL();
    mockResponse.forEach(mock => {
      expect(screen.getByText(`${mock.sol} SOL`)).toBeVisible();
      expect(screen.getByText(monify(mock.usd))).not.toBeVisible();
    })

  });

  it('converts SOL to USD', async () => {
    render(<App />);

    const loading = screen.getByText('Loading...')
    await waitFor(() => {
      expect(loading).not.toBeInTheDocument();
    });

    const checkbox = screen.getByRole("checkbox")

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    const list = screen.getByRole('list');
    const listItem = screen.getAllByRole('listitem');

    expect(list).toBeVisible();
    expect(listItem).toHaveLength(3);

    mockResponse.forEach(mock => {
      expect(screen.getByText(monify(mock.usd))).toBeVisible();
      expect(screen.getByText(`${mock.sol} SOL`)).not.toBeVisible();
    })
  });
});
