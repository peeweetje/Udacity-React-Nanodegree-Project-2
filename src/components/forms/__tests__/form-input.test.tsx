import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import FormInput from '../form-input';

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

describe('FormInput Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the label and input', () => {
    renderWithProviders(
      <FormInput
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
      <FormInput
        id="test-id"
        name="test-name"
        labelKey="test.label"
        value="Hello World"
        onChange={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toHaveValue('Hello World');
  });

  it('calls onChange when input changes', () => {
    const handleChange = vi.fn();
    renderWithProviders(
      <FormInput
        id="test-id"
        name="test-name"
        labelKey="test.label"
        value=""
        onChange={handleChange}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('associates the label with the input via htmlFor', () => {
    renderWithProviders(
      <FormInput
        id="author-input"
        name="commentAuthor"
        labelKey="editComment.label-author"
        value=""
        onChange={() => {}}
      />
    );
    const label = screen.getByText('editComment.label-author');
    expect(label).toHaveAttribute('for', 'author-input');
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
          editComment: { 'label-author': 'Author' },
        },
      },
    },
  });
});