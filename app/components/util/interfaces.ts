export interface IError {
  title: string;
  children: React.ReactNode;
}

export interface IModal {
  children: React.ReactNode;
  onClose: () => void;
}
