import { Outlet } from 'react-router-dom';
import NavSideBar from './Sidebar';
import NavBar from './Nav';
import { useState } from 'react';
import { MdMenu } from 'react-icons/md';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  return (
    <div className='flex items-start'>
      <NavSideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className='relative flex-1'>
        <div className='flex items-center'>
          {!isSidebarOpen && <div className="p-2 text-xl cursor-pointer">
            <MdMenu onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>}
          <div className='flex-1'>
          <NavBar />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Home