import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import FormTitleInput from '../form-title-input';

const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

type TestFormValues = {
  postTitle: string;
};

const FormTitleInputWrapper = ({ labelKey, placeholderKey }: { labelKey: string; placeholderKey: string }) => {
  const methods = useForm<TestFormValues>({
    defaultValues: { postTitle: '' },
  });

  return (
    <FormProvider {...methods}>
      <FormTitleInput
        control={methods.control as Control<TestFormValues>}
        name="postTitle"
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

describe('FormTitleInput Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the label and input', () => {
    renderWithProviders(
      <FormTitleInputWrapper
        labelKey="editPost.label-title"
        placeholderKey="editPost.label-title"
      />
    );

    expect(screen.getByText('editPost.label-title')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies the placeholder', () => {
    renderWithProviders(
      <FormTitleInputWrapper
        labelKey="editPost.label-title"
        placeholderKey="editPost.placeholder-title"
      />
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'editPost.placeholder-title');
  });

  it('allows typing in the input', () => {
    renderWithProviders(
      <FormTitleInputWrapper
        labelKey="editPost.label-title"
        placeholderKey="editPost.placeholder-title"
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Title' } });
    expect(input).toHaveValue('New Title');
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
            'label-title': 'Title',
            'placeholder-title': 'Enter title',
          },
        },
      },
    },
  });
});