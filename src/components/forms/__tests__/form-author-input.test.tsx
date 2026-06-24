import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import FormAuthorInput from '../form-author-input';

const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

type TestFormValues = {
  postAuthor: string;
};

const FormAuthorInputWrapper = ({ labelKey, placeholderKey }: { labelKey: string; placeholderKey: string }) => {
  const methods = useForm<TestFormValues>({
    defaultValues: { postAuthor: '' },
  });

  return (
    <FormProvider {...methods}>
      <FormAuthorInput
        control={methods.control as Control<TestFormValues>}
        name="postAuthor"
        labelKey={labelKey}
        placeholderKey={placeholderKey}
      />
    </FormProvider>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {ui}
    </I18nextProvider>
  );
};

describe('FormAuthorInput Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the label and input', () => {
    renderWithProviders(
      <FormAuthorInputWrapper
        labelKey="editPost.label-author"
        placeholderKey="editPost.label-author"
      />
    );
    expect(screen.getByText('editPost.label-author')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies the placeholder', () => {
    renderWithProviders(
      <FormAuthorInputWrapper
        labelKey="editPost.label-author"
        placeholderKey="editPost.placeholder-author"
      />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'editPost.placeholder-author');
  });

  it('allows typing in the input', () => {
    renderWithProviders(
      <FormAuthorInputWrapper
        labelKey="editPost.label-author"
        placeholderKey="editPost.placeholder-author"
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Author' } });
    expect(input).toHaveValue('New Author');
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
          editPost: {
            'label-author': 'Author',
            'placeholder-author': 'Enter author',
          },
        },
      },
    },
  });
});