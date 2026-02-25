/**
 * TabNavigation Molecule
 * Responsive tab navigation with icons
 * Desktop: Horizontal pills, Mobile: Hamburger menu
 */

import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, HandCoins, Menu, Receipt, TrendingUp, Wallet, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: "spending", label: "Spending", icon: Wallet },
  { id: "loans", label: "Loans", icon: HandCoins },
  { id: "planned", label: "Planned", icon: CalendarClock },
  { id: "fixed", label: "Bills", icon: Receipt },
  { id: "income", label: "Income", icon: TrendingUp },
];

export function TabNavigation({ activeTab, onTabChange }: Omit<TabNavigationProps, "tabs">) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            Menu
          </span>
          <span className="text-sm text-muted-foreground">
            {tabs.find(t => t.id === activeTab)?.label}
          </span>
        </Button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden mb-4 bg-card rounded-lg border overflow-hidden"
          >
            <div className="p-2">
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      onClick={() => handleTabClick(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-lg transition-all
                        ${isActive 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'hover:bg-accent text-foreground'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Horizontal Pills */}
      <div className="hidden md:flex items-center gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-secondary/50 hover:bg-secondary text-foreground'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}