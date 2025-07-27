import {
  Home,
  Code,
  User,
  TrendingUp,
  LogOut,
  PanelLeftOpen,
  PanelRightOpen,
  Trophy,
  Heart
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAdminSelectedTab } from "../../features/ui/uiSlice";
import MenuItem from "../ui/MenuItem";

function UserSidebar({ onToggleCollapse, isMobile, toggleMobileSidebar }) {
  const { adminSelectedTab, isCollapsed } = useSelector((state) => state.ui);
  const {user} = useSelector(state=>state.auth)
  const dispatch = useDispatch();
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "problems", label: "Problems", icon: Code },
    { id: "favoriteProblems", label: "Favorite", icon: Heart },
    { id: "contest", label: "Contests", icon: Trophy },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <div
      className={`bg-white dark:bg-gray-600/10 border-r border-gray-200 dark:border-white/10 h-[94%] flex flex-col shadow-sm transition-all duration-300 ${
        isCollapsed && !isMobile ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`border-b border-gray-200 dark:border-white/10 ${
          isCollapsed && !isMobile ? "p-3" : "p-6"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 md:w-10 h-8 md:h-8 overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <img src={user?.profileImage?.secureUrl}  className="w-4 md:w-9 h-4 md:h-8 text-white"  alt="profile image" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="min-w-0">
              <h1 className="text-md font-bold text-gray-900 dark:text-white truncate">
                {user.firstName}
              </h1>
              <p className="text-[10px] md:text-xs text-gray-500 truncate">
                {user.emailId}
              </p>
            </div>
          )}
          <div
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200/50 text-gray-500/80 "
          >
            <PanelRightOpen className="w-5 h-5" />
          </div>
          {!isMobile && (
            <div
              onClick={onToggleCollapse}
              className={`${
                isCollapsed ? "hidden" : ""
              } p-2 rounded-lg hover:bg-gray-200/50 text-gray-500/80`}
            >
              <PanelRightOpen className="w-5 h-5" />
            </div>
          )}
        </div>
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className={`mt-4 w-full flex items-center justify-center p-2 hover:bg-gray-100 text-gray-500/80 rounded-lg transition-all ${
              isCollapsed ? "px-2" : "hidden"
            }`}
          >
            {isCollapsed && <PanelLeftOpen className="w-5 h-5" />}
          </button>
        )}
      </div>

      <nav
        className={`flex-1 overflow-y-auto ${
          isCollapsed && !isMobile ? "p-2" : "p-4"
        }`}
      >
        <ul className="space-y-3.5">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={adminSelectedTab === item.id}
              isCollapsed={isCollapsed && !isMobile}
              onClick={() => dispatch(setAdminSelectedTab(item.id))}
            />
          ))}
        </ul>
      </nav>

      <div
        className={`border-t border-gray-200 ${
          isCollapsed && !isMobile ? "p-2" : "p-4"
        }`}
      >
        <button
          className={`w-full flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all ${
            isCollapsed && !isMobile ? "p-2 justify-center" : "px-4 py-3"
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!isCollapsed || isMobile) && (
            <span className="font-medium">Sign Out</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default UserSidebar;
