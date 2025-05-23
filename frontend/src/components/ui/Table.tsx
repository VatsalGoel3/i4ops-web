export function Table({ children }: { children: React.ReactNode }) {
    return (
      <div className="overflow-hidden rounded-xl2 shadow-sm ring-1 ring-gray-700/10 dark:ring-gray-50/5">
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    );
  }  