'use client';

import * as React from 'react';
import { Props } from '@/types/transaction';
import Link from 'next/link';
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, LogOut, User } from 'lucide-react';
import {
  NavbarDemo,
  NavBody,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/ResizableNavbar';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/NavigationMenu';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useAuthWithModal } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import { useSimpleModal } from '@/hooks/useSimpleModal';

const Navbar: React.FC<Props> = ({ showAddTransaction, setShowAddTransaction }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, isAuthOpen, setIsAuthOpen } = useAuthWithModal();
  const { showModal, Modal } = useSimpleModal();
  const router = useRouter();

  // display name for different screen sizes
  const getDisplayName = (fullName: string, isSmallDesktop: boolean = false) => {
    if (!fullName) return '';
    if (isSmallDesktop && fullName.includes(' ')) {
      return fullName.split(' ')[0];
    }
    return fullName;
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="relative w-full pb-10 z-10">
        <NavbarDemo>
          <NavBody>
            <NavbarLogo />
            <div className="flex items-center gap-4">
              <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </NavBody>
        </NavbarDemo>
      </div>
    );
  }

  const handleModalClick = () => {
    showModal({
      title: 'Let’s Talk About Your Vision',
      message:
        'Imagine turning your financial dreams into reality! Ready to chat? Our team’s eager to help—book a call now and let’s kickstart your journey.\n  phone number copied to your clipboard!',
      buttonText: 'Book Call',
    });
  };
  return (
    <div className="relative w-full pb-10 z-50">
      <NavbarDemo>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo src="/whiteLogoLong.png" />
          {user ? (
            <NavMenu
              showAddTransaction={showAddTransaction}
              setShowAddTransaction={setShowAddTransaction}
            />
          ) : (
            <AboutUsMenu />
          )}
          <div className="flex items-center">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  <span className="hidden 2xl:block">
                    {user.displayName || user.email}
                  </span>
                  <span className="2xl:hidden">
                    {getDisplayName(user.displayName || user.email || '', true)}
                  </span>
                </div>
                <NavbarButton
                  variant="secondary"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </NavbarButton>
              </>
            ) : (
              <>
                <NavbarButton
                  variant="secondary"
                  onClick={() => {
                    setIsAuthOpen(true);
                  }}
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  variant="primary"
                  onClick={() => {
                    navigator.clipboard.writeText('+961 81 165 944');
                    handleModalClick();
                  }}
                >
                  Book a call{' '}
                </NavbarButton>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo src="/whiteLogo.png" />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="w-full">
              {user ? (
                <MobileNavMenuContent
                  showAddTransaction={showAddTransaction}
                  setShowAddTransaction={setShowAddTransaction}
                />
              ) : (
                <MobileAboutUsMenuContent />
              )}
            </div>
            <div className="flex w-full flex-col ">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-sm font-medium px-4 py-2  rounded">
                    <User className="h-4 w-4" />
                    {user.displayName || user.email}
                  </div>
                  <NavbarButton
                    onClick={handleSignOut}
                    variant="secondary"
                    className="w-full flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4 whitespace-nowrap" />
                    Sign Out
                  </NavbarButton>
                </>
              ) : (
                <>
                  <NavbarButton
                    onClick={() => setIsAuthOpen(true)}
                    variant="secondary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => {
                      navigator.clipboard.writeText('+961 81 165 944');
                      handleModalClick();
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Book a call
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarDemo>
      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      <Modal />
    </div>
  );
};

// Navigation menu for authenticated users
const NavMenu: React.FC<Props> = ({ showAddTransaction, setShowAddTransaction }) => {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Track</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => setShowAddTransaction(!showAddTransaction)}
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">Add Transaction</div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Create a new income or expense entry with category, date, and amount.
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
              <ListItem href="/dashboard/transactions" title="View All">
                See a full list of your financial activity in reverse chronological order.
              </ListItem>
              <ListItem href="/dashboard/transactions/filter" title="Filter by Date">
                Narrow down transactions by specific days, weeks, or months.
              </ListItem>
              <ListItem href="/dashboard/categories" title="Categories">
                Browse by categorized spending like Food, Rent, or Travel.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Budgeting</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard/budget/set">
                    <div className="font-medium">Set Budget</div>
                    <div className="text-muted-foreground">Define spending limits</div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard/budget/view">
                    <div className="font-medium">View Budgets</div>
                    <div className="text-muted-foreground">See active budgets</div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard/budget/alerts">
                    <div className="font-medium">Alerts</div>
                    <div className="text-muted-foreground">Budget notifications</div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Accounts</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard/accounts">Linked Accounts</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard/accounts/add">Add Account</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard/accounts/summary">Account Summary</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard/profile" className="flex-row items-center gap-2">
                    <CircleHelpIcon />
                    Profile
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard/preferences" className="flex-row items-center gap-2">
                    <CircleIcon />
                    Preferences
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard/security" className="flex-row items-center gap-2">
                    <CircleCheckIcon />
                    Security
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/help">Help</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const AboutUsMenu = () => {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/about"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">Our Story</div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Learn about our mission to help you take control of your finances.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="#features" title="Features">
                Discover all the powerful tools we offer for financial management.
              </ListItem>
              <ListItem href="/pricing" title="Pricing">
                Simple, transparent pricing for individuals and businesses.
              </ListItem>
              <ListItem href="/contact" title="Contact">
                Get in touch with our team for support or questions.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="#feature">Features</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/pricing">Pricing</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/contact">Contact</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/help">Help</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Monthly Summary',
    href: '/dashboard/reports/monthly',
    description: 'View a detailed financial breakdown of your income and expenses by month.',
  },
  {
    title: 'Yearly Summary',
    href: '/dashboard/reports/yearly',
    description: 'High-level overview of your financial year with trends and key insights.',
  },
  {
    title: 'Income Report',
    href: '/dashboard/reports/income',
    description: 'See all income sources and patterns over time.',
  },
  {
    title: 'Expense Report',
    href: '/dashboard/reports/expenses',
    description: 'Track where your money goes across categories.',
  },
  {
    title: 'Chart View',
    href: '/dashboard/reports/charts',
    description: 'Visualize income vs expenses, category pie charts, and trend lines.',
  },
  {
    title: 'Export',
    href: '/dashboard/reports/export',
    description: 'Download your report as a PDF or spreadsheet.',
  },
];

const MobileNavMenuContent: React.FC<Props> = ({ showAddTransaction, setShowAddTransaction }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full space-y-2">
      <div className="w-full">
        <button
          onClick={() => toggleSection('track')}
          className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center justify-between"
        >
          Track
          <span className={`transition-transform ${openSection === 'track' ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {openSection === 'track' && (
          <div className="pl-4 space-y-1 mt-2">
            <button
              onClick={() => setShowAddTransaction(!showAddTransaction)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              Add Transaction
            </button>
            <Link href="/dashboard/transactions" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              View All
            </Link>
            <Link href="/dashboard/transactions/filter" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Filter by Date
            </Link>
            <Link href="/dashboard/categories" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Categories
            </Link>
          </div>
        )}
      </div>

      <div className="w-full">
        <button
          onClick={() => toggleSection('reports')}
          className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center justify-between"
        >
          Reports
          <span className={`transition-transform ${openSection === 'reports' ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {openSection === 'reports' && (
          <div className="pl-4 space-y-1 mt-2">
            {components.map((component) => (
              <Link
                key={component.title}
                href={component.href}
                className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                {component.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Budgeting Section */}
      <div className="w-full">
        <button
          onClick={() => toggleSection('budgeting')}
          className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center justify-between"
        >
          Budgeting
          <span className={`transition-transform ${openSection === 'budgeting' ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {openSection === 'budgeting' && (
          <div className="pl-4 space-y-1 mt-2">
            <Link href="/dashboard/budget/set" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Set Budget
            </Link>
            <Link href="/dashboard/budget/view" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              View Budgets
            </Link>
            <Link href="/dashboard/budget/alerts" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Alerts
            </Link>
          </div>
        )}
      </div>

      <div className="w-full">
        <button
          onClick={() => toggleSection('accounts')}
          className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center justify-between"
        >
          Accounts
          <span className={`transition-transform ${openSection === 'accounts' ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {openSection === 'accounts' && (
          <div className="pl-4 space-y-1 mt-2">
            <Link href="/dashboard/accounts" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Linked Accounts
            </Link>
            <Link href="/dashboard/accounts/add" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Add Account
            </Link>
            <Link href="/dashboard/accounts/summary" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Account Summary
            </Link>
          </div>
        )}
      </div>

      <div className="w-full">
        <button
          onClick={() => toggleSection('settings')}
          className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center justify-between"
        >
          Settings
          <span className={`transition-transform ${openSection === 'settings' ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {openSection === 'settings' && (
          <div className="pl-4 space-y-1 mt-2">
            <Link href="/dashboard/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Profile
            </Link>
            <Link href="/dashboard/preferences" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Preferences
            </Link>
            <Link href="/dashboard/security" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Security
            </Link>
          </div>
        )}
      </div>

      <Link href="/help" className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
        Help
      </Link>
    </div>
  );
};

const MobileAboutUsMenuContent = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full space-y-2">
      <div className="w-full">
        <button
          onClick={() => toggleSection('about')}
          className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center justify-between"
        >
          About Us
          <span className={`transition-transform ${openSection === 'about' ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {openSection === 'about' && (
          <div className="pl-4 space-y-1 mt-2">
            <Link href="/about" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Our Story
            </Link>
            <Link href="#features" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Features
            </Link>
            <Link href="/pricing" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Pricing
            </Link>
            <Link href="/contact" className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
              Contact
            </Link>
          </div>
        )}
      </div>

      <Link href="#feature" className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
        Features
      </Link>
      <Link href="/pricing" className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
        Pricing
      </Link>
      <Link href="/contact" className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
        Contact
      </Link>
      <Link href="/help" className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
        Help
      </Link>
    </div>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default Navbar;
