import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import FormTextarea from '../form-textarea';

const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {ui}
    </I18nextProvider>
  );
};

describe('FormTextarea Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the label and textarea', () => {
    renderWithProviders(
      <FormTextarea
        id="test-id"
        name="test-name"
        labelKey="test.label"
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByText('test.label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays the provided value', () => {
    renderWithProviders(
      <FormTextarea
        id="test-id"
        name="test-name"
        labelKey="test.label"
        value="Hello World"
        onChange={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toHaveValue('Hello World');
  });

  it('calls onChange when textarea changes', () => {
    const handleChange = vi.fn();
    renderWithProviders(
      <FormTextarea
        id="test-id"
        name="test-name"
        labelKey="test.label"
        value=""
        onChange={handleChange}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New Value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies the default rows attribute (6)', () => {
    renderWithProviders(
      <FormTextarea
        id="test-id"
        name="test-name"
        labelKey="test.label"
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
  });

  it('applies custom rows when provided', () => {
    renderWithProviders(
      <FormTextarea
        id="test-id"
        name="test-name"
        labelKey="test.label"
        value=""
        onChange={() => {}}
        rows={10}
      />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '10');
  });
});

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: {
          test: { label: 'Test Label' },
        },
      },
    },
  });
});