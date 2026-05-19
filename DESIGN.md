
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FinTrack Dashboard</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Plus Jakarta Sans -->
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap" rel="stylesheet">

  <style>
    /* Custom CSS properties for Glassmorphism design system */
    :root {
      --glassmorphism-primary: oklch(56% 0.12 170);
      --glassmorphism-primary-hover: oklch(50% 0.12 170); /* Slightly darker for hover */
      --glassmorphism-success: oklch(40% 0.14 140); /* Green for income */
      --glassmorphism-danger: oklch(60% 0.18 15);    /* Red for expenses */
      --glassmorphism-text: oklch(18% 0.012 250);
      --glassmorphism-surface: oklch(100% 0 0); /* White */
      --glassmorphism-border: oklch(90% 0.006 240); /* Light gray for borders */
      --font-plus-jakarta-sans: 'Plus Jakarta Sans', sans-serif;
    }

    body {
      font-family: var(--font-plus-jakarta-sans);
      color: var(--glassmorphism-text);
      margin: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  </style>

  <!-- React, ReactDOM, and Babel for in-browser JSX compilation -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
  
  <!-- Lucide React icons (needs to be available in global scope for babel) -->
  <!-- This is the preferred way to get Lucide icons for in-browser Babel if it works -->
  <!-- <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.min.js"></script> -->
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    // Mock Lucide-react components if the direct CDN import of lucide-react.min.js
    // above is commented out or doesn't make them available globally for Babel.
    // In a real Next.js project, you would `import { IconName } from 'lucide-react';`
    const Plus = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
    const Wallet = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h12a2 2 0 0 1 0 4H5a2 2 0 0 0 0 4h12a2 2 0 0 0 2-2v-3"/><path d="M22 7H17a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5z"/></svg>;
    const Banknote = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>;
    const LayoutDashboard = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
    const History = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M12 7v5l4 2"/></svg>;
    const User = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>;

    const NavItem = ({ icon: Icon, label, isActive }) => (
      <a
        href="#"
        className={`flex items-center space-x-2 p-2 rounded-md transition-colors text-sm
          ${isActive
            ? 'bg-[var(--glassmorphism-primary)] text-white'
            : 'text-[var(--glassmorphism-text)] hover:bg-gray-100 hover:text-[var(--glassmorphism-primary)]'
          }`}
      >
        {Icon && <Icon size={20} />}
        <span className="hidden sm:inline">{label}</span>
      </a>
    );

    const AccountCard = ({ name, balance }) => (
      <div className="flex-none w-full sm:w-48 bg-[var(--glassmorphism-surface)] p-4 rounded-lg
                      border border-[var(--glassmorphism-border)] hover:border-[var(--glassmorphism-primary)]
                      transition-colors cursor-pointer flex flex-col justify-between">
        <h3 className="text-md font-semibold text-gray-800">{name}</h3>
        <p className="text-xl font-bold text-[var(--glassmorphism-text)] mt-2">{balance}</p>
      </div>
    );

    const TransactionRow = ({ date, description, category, account, amount, type }) => (
      <tr className="border-b border-[var(--glassmorphism-border)] hover:bg-gray-50 transition-colors">
        <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">{date}</td>
        <td className="py-3 px-4 text-sm text-[var(--glassmorphism-text)] font-medium">{description}</td>
        <td className="py-3 px-4 text-sm text-gray-600 hidden sm:table-cell">{category}</td>
        <td className="py-3 px-4 text-sm text-gray-600 hidden lg:table-cell">{account}</td>
        <td
          className={`py-3 px-4 text-sm font-semibold ${
            type === 'income' ? 'text-[var(--glassmorphism-success)]' : 'text-[var(--glassmorphism-danger)]'
          }`}
        >
          {amount}
        </td>
      </tr>
    );

    // --- Main Dashboard Component ---
    const Dashboard = () => {
      // Mock Data
      const totalNetWorth = '$123,456.78';
      const accounts = [
        { id: 1, name: 'KBank Savings', balance: '$50,000.00' },
        { id: 2, name: 'SCB Checking', balance: '$30,250.50' },
        { id: 3, name: 'Cash Wallet', balance: '$1,200.00' },
        { id: 4, name: 'Crypto Exchange', balance: '$42,000.00' },
        { id: 5, name: 'Investment Fund', balance: '$5,000.00' },
      ];
      const recentTransactions = [
        {
          id: 1,
          date: '2024-07-26',
          description: 'Groceries',
          category: 'Food',
          account: 'KBank Savings',
          amount: '-$75.20',
          type: 'expense',
        },
        {
          id: 2,
          date: '2024-07-25',
          description: 'Salary',
          category: 'Income',
          account: 'SCB Checking',
          amount: '+$4,500.00',
          type: 'income',
        },
        {
          id: 3,
          date: '2024-07-24',
          description: 'Online Subscription',
          category: 'Utilities',
          account: 'KBank Savings',
          amount: '-$12.99',
          type: 'expense',
        },
        {
          id: 4,
          date: '2024-07-24',
          description: 'Dinner with friends',
          category: 'Social',
          account: 'Cash Wallet',
          amount: '-$45.00',
          type: 'expense',
        },
        {
          id: 5,
          date: '2024-07-23',
          description: 'Freelance Payment',
          category: 'Income',
          account: 'SCB Checking',
          amount: '+$800.00',
          type: 'income',
        },
      ];

      return (
        <div
          className={`
            min-h-screen bg-gray-50 relative
          `}
        >
          {/* Header/Navigation */}
          <header className="bg-[var(--glassmorphism-surface)] border-b border-[var(--glassmorphism-border)] p-4 flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-[var(--glassmorphism-text)] tracking-tight">FinTrack</h1>
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <NavItem icon={LayoutDashboard} label="Dashboard" isActive={true} />
              <NavItem icon={History} label="Transactions" isActive={false} />
              <NavItem icon={Wallet} label="Wallets" isActive={false} />
            </nav>
            <div className="flex items-center space-x-4">
              {/* User profile avatar placeholder */}
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                <User size={20} />
              </div>
            </div>
          </header>

          <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Net Worth Overview */}
            <section className="bg-[var(--glassmorphism-surface)] p-6 rounded-lg border border-[var(--glassmorphism-border)]">
              <h2 className="text-lg font-medium text-gray-600">Total Net Worth</h2>
              <p className="text-5xl font-extrabold text-[var(--glassmorphism-text)] mt-2 tracking-tight">
                {totalNetWorth}
              </p>
            </section>

            {/* Bank Accounts Summary */}
            <section>
              <h2 className="text-2xl font-semibold text-[var(--glassmorphism-text)] mb-4">Your Accounts</h2>
              <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                {accounts.map((account) => (
                  <AccountCard key={account.id} {...account} />
                ))}
              </div>
            </section>

            {/* Recent Transactions */}
            <section className="bg-[var(--glassmorphism-surface)] p-6 rounded-lg border border-[var(--glassmorphism-border)]">
              <h2 className="text-2xl font-semibold text-[var(--glassmorphism-text)] mb-4">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--glassmorphism-border)]">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Date
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Category
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Account
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--glassmorphism-border)]">
                    {recentTransactions.map((transaction) => (
                      <TransactionRow key={transaction.id} {...transaction} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>

          {/* Floating Action Button / Primary Button */}
          <button className="fixed bottom-6 right-6 sm:static sm:float-right sm:mt-8
                             bg-[var(--glassmorphism-primary)] hover:bg-[var(--glassmorphism-primary-hover)] text-white
                             font-semibold py-3 px-6 rounded-full sm:rounded-lg
                             shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 z-20">
            <Plus size={20} />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        </div>
      );
    };

    // Render the Dashboard component
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<Dashboard />);
  </script>
</body>
</html>
