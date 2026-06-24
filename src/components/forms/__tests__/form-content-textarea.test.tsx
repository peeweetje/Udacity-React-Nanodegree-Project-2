import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import FormContentTextarea from '../form-content-textarea';

const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

type TestFormValues = {
  postContent: string;
};

const FormContentTextareaWrapper = ({ labelKey, placeholderKey }: { labelKey: string; placeholderKey: string }) => {
  const methods = useForm<TestFormValues>({
    defaultValues: { postContent: '' },
  });

  return (
    <FormProvider {...methods}>
      <FormContentTextarea
        control={methods.control as Control<TestFormValues>}
        name="postContent"
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

describe('FormContentTextarea Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the label and textarea', () => {
    renderWithProviders(
      <FormContentTextareaWrapper
        labelKey="editPost.label-content"
        placeholderKey="editPost.placeholder-textarea"
      />
    );
    expect(screen.getByText('editPost.label-content')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies the placeholder', () => {
    renderWithProviders(
      <FormContentTextareaWrapper
        labelKey="editPost.label-content"
        placeholderKey="editPost.placeholder-textarea"
      />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'editPost.placeholder-textarea');
  });

  it('allows typing in the textarea', () => {
    renderWithProviders(
      <FormContentTextareaWrapper
        labelKey="editPost.label-content"
        placeholderKey="editPost.placeholder-textarea"
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Some content' } });
    expect(textarea).toHaveValue('Some content');
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
            'label-content': 'Content',
            'placeholder-textarea': 'Write your content',
          },
        },
      },
    },
  });
});