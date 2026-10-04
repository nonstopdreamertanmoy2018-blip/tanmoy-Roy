/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { QuickActionModal } from './components/common/QuickActionModal';

// Dashboard
import { DashboardOverview } from './components/dashboard/DashboardOverview';

// Master Admin Views
import { AllCompanies } from './components/modules/master/AllCompanies';
import { AllUsers } from './components/modules/master/AllUsers';
import { PermissionsMatrix } from './components/modules/master/PermissionsMatrix';
import { DatabaseBackup } from './components/modules/master/DatabaseBackup';
import { SystemSettings } from './components/modules/master/SystemSettings';
import { AuditLogView } from './components/modules/master/AuditLogView';

// Owner Admin Views
import { FarmOverview } from './components/modules/owner/FarmOverview';
import { PondsView } from './components/modules/owner/PondsView';
import { FishStockView } from './components/modules/owner/FishStockView';
import { FeedView } from './components/modules/owner/FeedView';
import { HarvestView } from './components/modules/owner/HarvestView';
import { SalesView } from './components/modules/owner/SalesView';
import { PurchasesView } from './components/modules/owner/PurchasesView';
import { ExpensesView } from './components/modules/owner/ExpensesView';
import { OperationalReports } from './components/modules/owner/OperationalReports';

// Accounting Views
import { ChartOfAccountsView } from './components/modules/accounting/ChartOfAccountsView';
import { JournalView } from './components/modules/accounting/JournalView';
import { LedgerView } from './components/modules/accounting/LedgerView';
import { CashBookView } from './components/modules/accounting/CashBookView';
import { BankBookView } from './components/modules/accounting/BankBookView';
import { TrialBalanceView } from './components/modules/accounting/TrialBalanceView';
import { ProfitLossView } from './components/modules/accounting/ProfitLossView';
import { BalanceSheetView } from './components/modules/accounting/BalanceSheetView';

// Employees View
import { EmployeeManagementView } from './components/modules/employees/EmployeeManagementView';

const MainAppContent: React.FC = () => {
  const { activeTab, currentUser } = useERP();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;

      // Master Admin
      case 'companies':
        return <AllCompanies />;
      case 'users':
        return <AllUsers />;
      case 'permissions':
        return <PermissionsMatrix />;
      case 'backup':
        return <DatabaseBackup />;
      case 'settings':
        return <SystemSettings />;
      case 'audit':
        return <AuditLogView />;

      // Owner Admin
      case 'farm':
        return <FarmOverview />;
      case 'ponds':
        return <PondsView />;
      case 'fish':
        return <FishStockView />;
      case 'feed':
        return <FeedView />;
      case 'harvest':
        return <HarvestView />;
      case 'sales':
        return <SalesView />;
      case 'purchases':
        return <PurchasesView />;
      case 'expenses':
        return <ExpensesView />;
      case 'reports':
        return <OperationalReports />;

      // Accounting
      case 'chart-of-accounts':
        return <ChartOfAccountsView />;
      case 'journal':
        return <JournalView />;
      case 'ledger':
        return <LedgerView />;
      case 'cash-book':
        return <CashBookView />;
      case 'bank-book':
        return <BankBookView />;
      case 'trialBalance':
      case 'trial-balance':
        return <TrialBalanceView />;
      case 'profit-loss':
        return <ProfitLossView />;
      case 'balance-sheet':
        return <BalanceSheetView />;

      // Employees
      case 'employees':
        return <EmployeeManagementView initialRoleFilter="all" />;
      case 'emp-manager':
        return <EmployeeManagementView initialRoleFilter="manager" />;
      case 'emp-accountant':
        return <EmployeeManagementView initialRoleFilter="accountant" />;
      case 'emp-sales':
        return <EmployeeManagementView initialRoleFilter="sales" />;
      case 'emp-store':
        return <EmployeeManagementView initialRoleFilter="store" />;
      case 'emp-viewer':
        return <EmployeeManagementView initialRoleFilter="viewer" />;

      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Hierarchical Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenQuickAction={() => setQuickActionOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Fast Record Modal */}
      <QuickActionModal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainAppContent />
    </ERPProvider>
  );
}
