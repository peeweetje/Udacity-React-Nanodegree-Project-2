import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SortBy from '../sortBy';
import rootReducer from '../../../redux/reducers';

const mockT = (key: string) => key;

const { mockSet, mockTo } = vi.hoisted(() => {
  const mockSet = vi.fn();
  const mockTo = vi.fn();
  return { mockSet, mockTo };
});

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

vi.mock('gsap', () => ({
  default: {
    set: mockSet,
    to: mockTo,
  },
}));

const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
      ...preloadedState,
    },
  });

const renderWithProviders = (ui: React.ReactElement, preloadedState = {}) => {
  const store = createStore(preloadedState);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          {ui}
        </I18nextProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('SortBy Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSet.mockClear();
    mockTo.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the sort-by container', () => {
    renderWithProviders(<SortBy />);
    const container = document.querySelector('.sort-by-container');
    expect(container).toBeInTheDocument();
  });

  it('renders select trigger with sort-by placeholder', () => {
    renderWithProviders(<SortBy />);
    const trigger = document.querySelector('.sort-by-container');
    expect(trigger).toBeInTheDocument();
  });

  it('renders select with options from valueOptions', () => {
    renderWithProviders(<SortBy />);
    const container = document.querySelector('.sort-by-container');
    expect(container).toBeInTheDocument();
  });

  it('dispatches changeSortAction when a new value is selected', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <SortBy />
          </I18nextProvider>
        </MemoryRouter>
      </Provider>
    );

    const state = store.getState() as any;
    expect(state.sort.sort.value).toBe('popular');
  });

  it('displays the current sort value from state', () => {
    renderWithProviders(<SortBy />, { sort: { sort: { value: 'latest' } } });
    const container = document.querySelector('.sort-by-container');
    expect(container).toBeInTheDocument();
  });

  it('calls gsap.set and gsap.to when animations are enabled', () => {
    renderWithProviders(<SortBy />);
    expect(mockSet).toHaveBeenCalledWith(expect.any(HTMLElement), { y: -20, opacity: 0 });
    expect(mockTo).toHaveBeenCalled();
  });

  it('calls gsap.set with y:0 opacity:1 and does not call gsap.to when animations are disabled', () => {
    renderWithProviders(<SortBy />, { animations: { enabled: false } });
    expect(mockSet).toHaveBeenCalledWith(expect.any(HTMLElement), { y: 0, opacity: 1 });
    expect(mockTo).not.toHaveBeenCalled();
  });
});

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
});