'use client';

import { useTheme } from '@/app/providers/ThemeProvider/ThemeProvider';
import spixiUcLight from '@assets/light/spixi-uc.png';
import spixiUcDark from '@assets/dark/spixi-uc.png';
import benchmarkLight from '@assets/partners/light/benchmarked-lm.svg';
import benchmarkDark from '@assets/partners/dark/benchmarked-dm.svg';
import evenLight from '@assets/partners/light/even-lm.svg';
import evenDark from '@assets/partners/dark/even-dm.svg';
import ixilabsLight from '@assets/partners/light/ixilabs-lm.svg';
import ixilabsDark from '@assets/partners/dark/ixilabs-dm.svg';
import vivatLight from '@assets/partners/light/vivat-lm.svg';
import vivatDark from '@assets/partners/dark/vivat-dm.svg';

import coingeckoD from '@assets/exchanges/dark/coingecko-dm.svg';
import coingeckoL from '@assets/exchanges/light/coingecko-lm.svg';
import nonkycL from '@assets/exchanges/light/nonkyc-lm.svg';
import nonkycD from '@assets/exchanges/dark/nonkyc-dm.svg';

const useImages = (forceTheme?: string) => {
  const { themeMode } = useTheme();

  if (forceTheme === 'dark') {
    return {
      spixiUc: spixiUcDark,
      benchmark: benchmarkDark,
      even: evenDark,
      ixilabs: ixilabsDark,
      vivat: vivatDark,
      coingecko: coingeckoD,
      nonkyc: nonkycD,
    };
  }

  return {
    spixiUc: themeMode === 'light' ? spixiUcLight : spixiUcDark,
    benchmark: themeMode === 'light' ? benchmarkLight : benchmarkDark,
    even: themeMode === 'light' ? evenLight : evenDark,
    ixilabs: themeMode === 'light' ? ixilabsLight : ixilabsDark,
    vivat: themeMode === 'light' ? vivatLight : vivatDark,
    coingecko: themeMode === 'light' ? coingeckoL : coingeckoD,
    nonkyc: themeMode === 'light' ? nonkycL : nonkycD,
  };
};

export default useImages;
