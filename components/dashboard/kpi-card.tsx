import { Card } from '@/components/ui/card';

type KpiCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function KpiCard({ label, value, helper }: KpiCardProps) {
  return (
    <Card>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </Card>
  );
}
