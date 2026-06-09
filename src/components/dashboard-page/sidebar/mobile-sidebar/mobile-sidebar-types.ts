
export interface Category {
  path: string;
  name: string;
}

export interface RootState {
  receiveCategories: Category[];
}

export interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  showNav?: boolean;
  showCategories?: boolean;
}