import { getTranslations, getLocale } from 'next-intl/server';

export const getServerTranslations = async () => {
  const locale = (await getLocale()) ?? 'en'; // Fallback to 'en' if no locale is provided
  return await getTranslations({ locale });
};
