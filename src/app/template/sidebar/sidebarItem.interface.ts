export interface SidebarItem {
  label?: string;
  icon?: string;
  route?: string;
  children?: SidebarItem[];
  roles?: string[];
  
  // NOVO: Adicione 'isOpen' para o estado de colapsar/expandir da UI
  isOpen?: boolean;
}
