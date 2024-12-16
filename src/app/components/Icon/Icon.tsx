'use client';
import classes from './Icon.module.scss';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

interface IconProps {
  iconName: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  className?: string;
}

const Icon = ({ iconName, variant = 'primary', className }: IconProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return '--colors-icon-action';
      case 'secondary':
        return '--colors-icon-inverse';
      case 'tertiary':
        return '--colors-icon-01';
      case 'quaternary':
        return '--colors-icon-info';
      default:
        return '--colors-icon-action';
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const SvgIcon = require(
      `../../../../public/assets/icons/${iconName}.svg`
    ).default;

    // Fetch the SVG content dynamically from the `src` property
    fetch(SvgIcon.src)
      .then((response) => response.text())
      .then((data) => {
        const svgWithVariables = data.replace(
          /fill=".*?"/g,
          `fill="var(${getIconColor}, currentColor)"`
        );
        setSvgContent(svgWithVariables);
      })
      .catch((error) => console.error(`Error ${iconName} loading SVG:`, error));
  }, [iconName]);

  if (!svgContent) {
    return null; // Show a placeholder or nothing until the SVG is loaded
  }

  return (
    <span
      className={classNames(classes.icon, classes[variant], className)}
      dangerouslySetInnerHTML={{ __html: svgContent }} // Render the SVG as HTML
    />
  );
};

export default Icon;
