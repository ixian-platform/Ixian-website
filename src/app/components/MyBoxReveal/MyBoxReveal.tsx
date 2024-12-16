import BoxReveal from '@/components/ui/box-reveal';
import { ReactNode } from 'react';

interface MyBoxRevealProps {
  title: string;
  description: string;
  buttonContainer: ReactNode;
  disableBox?: boolean;
}

export async function MyBoxReveal({
  title,
  description,
  buttonContainer,
  disableBox,
}: MyBoxRevealProps) {
  return (
    <div className="size-full max-w-lg flex flex-col items-start gap-4 overflow-hidden">
      <BoxReveal
        boxColor={'rgba(68,151,81,0.5)'}
        duration={0.4}
        disableBox={disableBox}
      >
        <p className="text-[2.5rem] font-semibold">{title}</p>
      </BoxReveal>

      <BoxReveal
        boxColor={'rgba(68,151,81,0.5)'}
        duration={0.5}
        disableBox={disableBox}
      >
        <div>
          <p>{description}</p>
        </div>
      </BoxReveal>

      <BoxReveal
        boxColor={'rgba(68,151,81,0.5)'}
        duration={0.5}
        disableBox={disableBox}
      >
        <>{buttonContainer}</>
      </BoxReveal>
    </div>
  );
}
