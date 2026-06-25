import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EditDeleteActions from '../edit-delete-actions';

const mockT = (key: string) => key;

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, asChild, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        {ui}
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe('EditDeleteActions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders edit and delete buttons', () => {
    const onDelete = vi.fn();
    renderWithProviders(<EditDeleteActions editLink="/editpost/123" onDelete={onDelete} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('renders edit link with correct href', () => {
    const onDelete = vi.fn();
    renderWithProviders(<EditDeleteActions editLink="/editpost/123" onDelete={onDelete} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/editpost/123');
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    renderWithProviders(<EditDeleteActions editLink="/editpost/123" onDelete={onDelete} />);
    const buttons = screen.getAllByRole('button');
    buttons[1].click();
    expect(onDelete).toHaveBeenCalled();
  });

  it('renders with custom labels', () => {
    const onDelete = vi.fn();
    renderWithProviders(
      <EditDeleteActions
        editLink="/editpost/123"
        onDelete={onDelete}
        editLabelFull="Edit Post"
        editLabelShort="Edit"
        deleteLabelFull="Delete Post"
        deleteLabelShort="Delete"
      />
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('applies custom container className', () => {
    const onDelete = vi.fn();
    const { container } = renderWithProviders(
      <EditDeleteActions
        editLink="/editpost/123"
        onDelete={onDelete}
        containerClassName="custom-class"
      />
    );
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass('custom-class');
  });
});

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
});