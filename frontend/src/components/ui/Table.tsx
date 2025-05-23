export function Table({ children }: { children: React.ReactNode, dense?: boolean }) {
    return (
      <div className="overflow-hidden rounded-xl2 shadow-sm ring-1 ring-gray-700/10 dark:ring-gray-50/5">
        {/*
          Accessibility Note: For screen readers, ensure your table structure
          includes proper <th> elements with 'scope="col"' or 'scope="row"'.
          Consider adding a <caption> element for a table title if needed.

          Responsiveness Note: For small screens, consider implementing patterns
          like collapsing columns or transforming rows into card-like layouts
          to improve usability beyond simple horizontal scrolling.
        */}
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    );
  }  