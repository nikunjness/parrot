import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Actions from './actions';
import Menu from './menu';
import sidebarMenu from '@/config/menu/sidebar-static';
import { useWorkspaces } from '@/hooks/data';
import { useWorkspace } from '@/providers/workspace';
import { Bars3Icon } from '@heroicons/react/24/outline';

const staticMenu = sidebarMenu();

const Sidebar = ({ menu }) => {
  const [showMenu, setMenuVisibility] = useState(false);
  const { data, isLoading } = useWorkspaces();
  const { workspace } = useWorkspace();

  const renderMenu = () => {
    return (
      workspace &&
      menu.map((item, index) => (
        <Menu
          key={index}
          data={item}
          isLoading={isLoading}
          showMenu={data?.workspaces.length > 0 || isLoading}
        />
      ))
    );
  };

  const renderStaticMenu = () => {
    return staticMenu.map((item, index) => (
      <Menu key={index} data={item} showMenu={true} />
    ));
  };

  const toggleMenu = () => setMenuVisibility(!showMenu);

  return (
    <aside className="sticky z-40 flex flex-col space-y-5 text-white bg-gray-800 dark:bg-gray-900 md:overflow-y-auto md:w-1/4 md:h-screen overscroll-contain">
      <div className="relative flex items-center justify-center p-5 text-center border-b border-b-gray-900">
        <Link href="/" className="flex-grow text-2xl font-bold">
           <Image
                src="/images/logo-white.png" // Path to your logo image
                alt="Intrvyu Logo"
                width={200} // Adjust width as needed
                height={50} // Adjust height as needed
                className="h-24 w-48" // Adjust classes as needed
              />
        </Link>
        <button className="absolute right-0 p-5 md:hidden" onClick={toggleMenu}>
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      <div
        className={[
          'flex-col space-y-5 md:flex md:relative md:top-0',
          showMenu
            ? 'absolute top-12 bg-gray-800 right-0 left-0 h-screen'
            : 'hidden',
        ].join(' ')}
      >
        <Actions />
        <div className="flex flex-col p-5 space-y-10">
          {renderStaticMenu()}
          {renderMenu()}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
