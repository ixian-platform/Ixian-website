import ShineBorder from '@/components/ui/shine-border';
import { PropsWithChildren } from 'react';

export function MyShineBorder({ children }: PropsWithChildren) {
  return (
    <ShineBorder
      className="relative flex flex-col items-start gap-1 overflow-hidden rounded-lg border bg-background md:shadow-xl"
      color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
    >
      {children}
    </ShineBorder>
  );
}
