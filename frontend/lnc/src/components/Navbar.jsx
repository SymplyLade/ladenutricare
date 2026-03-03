import { Fragment, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';
import lncLogo from '../assets/lnc-logo.svg';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';
import { getPrimaryNavigation, getUserMenuLinks } from '../config/roleConfig';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const navItems = useMemo(() => (user ? getPrimaryNavigation(user.role) : [{ name: 'Home', href: '/' }]), [user]);
  const userMenuLinks = useMemo(() => getUserMenuLinks(user?.role), [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex min-w-0 items-center">
                <Link to="/" className="flex items-center gap-2">
                  <img src={lncLogo} alt="LNC logo" className="h-8 w-8 rounded-md" />
                  <span className="text-lg font-bold text-indigo-600">LNC</span>
                </Link>
                <div className="ml-6 hidden items-center space-x-8 sm:flex">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-900 hover:border-indigo-500 hover:text-gray-700"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden items-center sm:flex">
                {user ? (
                  <>
                    <NotificationBell />
                    <Menu as="div" className="relative ml-3">
                      <Menu.Button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-2 text-sm shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <UserAvatar
                          name={user.name}
                          imageUrl={user.profile_picture}
                          imageFailed={avatarLoadError}
                          onImageError={() => setAvatarLoadError(true)}
                          sizeClass="h-8 w-8"
                        />
                        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userMenuLinks.map((link) => (
                            <Menu.Item key={link.href}>
                              {({ active }) => (
                                <Link
                                  to={link.href}
                                  className={`${active ? 'bg-gray-100' : ''} block rounded-lg px-3 py-2 text-sm text-gray-700`}
                                >
                                  {link.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${active ? 'bg-red-50 text-red-700' : 'text-red-600'} block w-full rounded-lg px-3 py-2 text-left text-sm font-medium`}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  <div className="space-x-4">
                    <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-indigo-600">
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 border-t border-gray-200 pb-3 pt-2">
              {navItems.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-indigo-500 hover:bg-gray-50 hover:text-gray-800"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>

            {user ? (
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <UserAvatar
                    name={user.name}
                    imageUrl={user.profile_picture}
                    imageFailed={avatarLoadError}
                    onImageError={() => setAvatarLoadError(true)}
                    sizeClass="h-10 w-10"
                  />
                  <div className="ml-3 min-w-0">
                    <div className="truncate text-base font-medium text-gray-800">{user.name}</div>
                    <div className="truncate text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {userMenuLinks.map((link) => (
                    <Disclosure.Button
                      key={link.href}
                      as={Link}
                      to={link.href}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      {link.name}
                    </Disclosure.Button>
                  ))}
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Log in
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/register"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign up
                  </Disclosure.Button>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
