'use client';

import React from 'react';
import Link from 'next/link';
import { coingeckoIxi, nonkycIxi } from '@utils/constants';
import Image from 'next/image';
import classes from './ExchangesImages.module.scss';
import useImages from '@utils/useImages';
import classNames from 'classnames';
import { ThemeMode } from '@/app/providers/ThemeProvider/ThemeProvider';

interface ExchangesImagesProps {
  className?: string;
  forceTheme?: ThemeMode;
}

const ExchangesImages = ({ forceTheme, className }: ExchangesImagesProps) => {
  const { coingecko, nonkyc } = useImages(forceTheme);

  return (
    <div className={classNames(classes.images, className)}>
      <Link href={coingeckoIxi} target={'_blank'}>
        <Image src={coingecko} alt={'coingecko'} />
      </Link>
      <Link href={nonkycIxi} target={'_blank'}>
        <Image src={nonkyc} alt={'nonkyc'} />
      </Link>
    </div>
  );
};

export default ExchangesImages;
