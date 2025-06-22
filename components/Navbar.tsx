"use client";

import * as React from "react"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"
import {
  NavbarDemo,
  NavBody,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/ResizableNavbar";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu"
import { useState } from "react";


const Navbar = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full pb-10">
      <NavbarDemo>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavMenu />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Book a call</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <NavMenu />
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarDemo>

      {/* Navbar */}
    </div>
  );
}

const NavMenu = () => {
  return (
    <NavigationMenu viewport={false}>
      {/* NavMenu */}
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Track</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">
                     Add Transaction
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Create a new income or expense entry with category, date, and amount.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="View All">
                	See a full list of your financial activity in reverse chronological order.
              </ListItem>
              <ListItem href="/docs/installation" title="Filter by Date">
                	Narrow down transactions by specific days, weeks, or months.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Categories">
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
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Budgeting </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Set Budget</div>
                    <div className="text-muted-foreground">
                      Define spending limits
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">View Budgets</div>
                    <div className="text-muted-foreground">
                      See active budgets
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Alerts</div>
                    <div className="text-muted-foreground">
                      Budget notifications
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Accounts </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#">Linked Accounts</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">Add Account</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">Account Summary</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Settings </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleHelpIcon />
                    Profile
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleIcon />
                    Preferences
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
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
            <Link href="/docs">Help</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Monthly Summary",
    href: "/docs/primitives/alert-dialog",
    description:
      "View a detailed financial breakdown of your income and expenses by month.",
  },
  {
    title: "Yearly Summary",
    href: "/docs/primitives/hover-card",
    description:
      "High-level overview of your financial year with trends and key insights.",
  },
  {
    title: "Income Report",
    href: "/docs/primitives/progress",
    description:
      "See all income sources and patterns over time.",
  },
  {
    title: "Expense Report",
    href: "/docs/primitives/scroll-area",
    description: "Track where your money goes across categories.",
  },
  {
    title: "Chart View",
    href: "/docs/primitives/tabs",
    description:
      "Visualize income vs expenses, category pie charts, and trend lines.",
  },
  {
    title: "Export",
    href: "/docs/primitives/tooltip",
    description:
      "Download your report as a PDF or spreadsheet.",
  },
]

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
export default Navbar;