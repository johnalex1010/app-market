type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return <p className="text-sm font-medium text-red-700">{message}</p>;
}
