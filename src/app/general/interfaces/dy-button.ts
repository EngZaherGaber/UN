export interface DyButton {
  permission?: string;
  isShow?: boolean;
  tooltip: string;
  icon?: string;
  class?: string;
  key?: string;
  severity?:
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | null;
  command?: (body: any) => void;
  showCommand?: (body: any) => boolean;
}
