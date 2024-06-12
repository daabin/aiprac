'use client';

import { IconLanguage } from '@douyinfe/semi-icons';
import { Dropdown } from '@douyinfe/semi-ui';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

import { languages, locales } from '@/i18n';

export default function LocaleSwitcher() {
  const { Link, usePathname } = createSharedPathnamesNavigation({ locales });
  const pathname = usePathname();

  return (
    <Dropdown
      trigger="hover"
      render={
        // @ts-ignore
        <Dropdown.Menu>
          {Object.entries(languages).map(([lang, setting]) => (
            // @ts-ignore
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
        <IconLanguage
          size="large"
          style={{
            color: 'var(--semi-color-text-2)',
          }}
        />
      </div>
    </Dropdown>
  );
}
