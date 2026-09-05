import React from 'react';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({
  title,
  description,
  actions,
  sidebar,
  children,
  className = '',
}: PageLayoutProps) {
  return (
    <div className={`${styles.pageContainer} ${className}`}>
      {(title || description || actions) && (
        <div className={styles.header}>
          <div>
            {title && <h1 className={styles.headerTitle}>{title}</h1>}
            {description && <p className={styles.headerDescription}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}

      <div className={`${styles.contentWrapper} ${sidebar ? styles.hasSidebar : ''}`}>
        {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
