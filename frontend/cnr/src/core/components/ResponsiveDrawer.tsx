import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { MdDashboard, MdCalendarToday } from "react-icons/md";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaUserEdit } from "react-icons/fa";
import { SiAwsorganizations } from "react-icons/si";
import { useListUsers } from "../state/ListOfUsersContext";
import { User } from "../dtos/data";
import { useUser } from "../state/UserContext";
const ResponsiveDrawer: React.FC = () => {
  const { users } = useListUsers();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { userSaved } = useUser();

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);
  const navigate = useNavigate();
  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Page Layout */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow h-16 flex items-center px-4">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-ghost btn-square drawer-button lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <span
            className="ml-4 text-xl font-bold btn"
            onClick={() => {
              navigate("/home");
            }}
          >
            CNR-Payement
          </span>
        </header>

        {/* Push content below navbar */}
        <div className="h-16" />

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          className="drawer-overlay lg:hidden"
          aria-label="close sidebar"
        />
        <aside className="w-96 h-full bg-gray-100 pt-16 p-4">
          <ul className="menu space-y-2 text-base font-medium">
            <li>
              <Link to="/home" className="flex items-center gap-3">
                <MdDashboard className="text-xl" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/home/calender" className="flex items-center gap-3">
                <MdCalendarToday className="text-xl" />
                Calendrier
              </Link>
            </li>
            <li>
              <details className="group">
                <summary className="flex items-center gap-3 cursor-pointer">
                  <HiMiniUserGroup className="text-xl" />
                  Intervenants
                </summary>
                <ul className="pl-8 mt-2 space-y-2 max-h-64 overflow-y-auto pr-2">
                  {filteredUsers.length === 0 ? (
                    <p className="text-lg font-semibold text-gray-400">
                      Aucun utilisateur disponible
                    </p>
                  ) : (
                    filteredUsers
                      .filter(
                        (user) =>
                          user.id !== undefined &&
                          user.id !== userSaved.idInstituion
                      )
                      .map((user) => (
                        <li key={user.id}>
                          <Link to={`/home/peer/${user.id}`} className="block">
                            {user.username} – {user.workAt} / {user.wilaya}
                          </Link>
                        </li>
                      ))
                  )}
                </ul>
              </details>
            </li>
            <li>
              <details className="group">
                <summary className="flex items-center gap-3 cursor-pointer">
                  <SiAwsorganizations className="text-xl" />
                  Organisations
                </summary>
                <ul className="pl-8 mt-2 space-y-2">
                  <li>
                    <Link to="/peers/frontend" className="block">
                      CCR
                    </Link>
                  </li>
                  <li>
                    <Link to="/peers/backend" className="block">
                      Agences
                    </Link>
                  </li>
                  <li>
                    <Link to="/peers/design" className="block">
                      POSTS
                    </Link>
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <Link to="/profile" className="flex items-center gap-3">
                <FaUserEdit className="text-xl" />
                Profile
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default ResponsiveDrawer;
