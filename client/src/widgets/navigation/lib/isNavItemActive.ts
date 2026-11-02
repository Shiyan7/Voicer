export const isNavItemActive = (href: string, pathname: string) =>
  pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
