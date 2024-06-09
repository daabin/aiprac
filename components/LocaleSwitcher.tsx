'use client';

import { Dropdown } from '@douyinfe/semi-ui';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { IconLanguage } from '@douyinfe/semi-icons';

import { languages, locales } from '@/i18n';

export default function LocaleSwitcher() {
  const { Link, usePathname } = createSharedPathnamesNavigation({ locales });
  const pathname = usePathname();

  return (
    <Dropdown
      trigger="hover"
      render={
        <Dropdown.Menu>
          {Object.entries(languages).map(([lang, setting]) => (
            <Dropdown.Item key={lang}>
              <Link href={pathname ?? '/'} locale={lang}>
                {setting.name}
              </Link>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      }
    >
      <div className="btn">
        <IconLanguage />
      </div>
    </Dropdown>
  );
}
