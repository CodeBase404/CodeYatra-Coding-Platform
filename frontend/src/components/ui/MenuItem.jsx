function MenuItem({ item, isActive, onClick, isCollapsed }) {
    
  const Icon = item.icon;
  return (
    <li className="select-none">
      <div
        onClick={onClick}
        className={`w-full flex items-center gap-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-500 group transition-all cursor-pointer ${
          isCollapsed ? 'p-2 justify-center' : 'px-4 py-2.5'
        } ${
          isActive
            ? "bg-blue-50 dark:bg-white/10 text-blue-700 shadow-sm dark:text-white"
            : "text-gray-700 dark:hover:text-white hover:text-gray-900"
        }`}
         title={isCollapsed ? item.label : undefined}
      >
        <Icon
          className={`w-5 h-5 flex-shrink-0 ${
            isActive
              ? "text-blue-600"
              : "text-gray-500 dark:group-hover:text-blue-700 group-hover:text-gray-700"
          }`}
        />
       {!isCollapsed && (
          <>
            <span className="font-medium truncate">{item.label}</span>
            {isActive && (
              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
            )}
          </>
        )}
      </div>
    </li>
  );
}

export default MenuItem;
