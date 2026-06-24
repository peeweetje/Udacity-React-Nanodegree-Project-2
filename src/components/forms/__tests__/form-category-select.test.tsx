import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import FormCategorySelect from '../form-category-select';

const mockT = (key: string) => key;

beforeAll(() => {
  Element.prototype.scrollIntoView = () => {};
});

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

type TestFormValues = {
  postCategory: string;
};

const FormCategorySelectWrapper = ({ labelKey, placeholderKey }: { labelKey: string; placeholderKey: string }) => {
  const methods = useForm<TestFormValues>({
    defaultValues: { postCategory: '' },
  });

  return (
    <FormProvider {...methods}>
      <FormCategorySelect
        control={methods.control as Control<TestFormValues>}
        name="postCategory"
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

describe('FormCategorySelect Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the label and select trigger', () => {
    renderWithProviders(
      <FormCategorySelectWrapper
        labelKey="editPost.category"
        placeholderKey="editPost.placeholder-category"
      />
    );
    expect(screen.getByText('editPost.category')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the placeholder text', () => {
    renderWithProviders(
      <FormCategorySelectWrapper
        labelKey="editPost.category"
        placeholderKey="editPost.placeholder-category"
      />
    );
    expect(screen.getByText('editPost.placeholder-category')).toBeInTheDocument();
  });

  it('allows selecting a category', async () => {
    renderWithProviders(
      <FormCategorySelectWrapper
        labelKey="editPost.category"
        placeholderKey="editPost.placeholder-category"
      />
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    await waitFor(() => {
      const reactOption = screen.getByText('React');
      expect(reactOption).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('React'));

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });
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
            category: 'Category',
            'placeholder-category': 'Select a category',
          },
        },
      },
    },
  });
});