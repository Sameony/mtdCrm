import { Outlet, useNavigate } from 'react-router-dom';
import NavSideBar from './Sidebar';
import NavBar from './Nav';
import { useEffect, useState } from 'react';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const toggleSidebar = () =>{
    setIsSidebarOpen(!isSidebarOpen)
  }
  const navigate = useNavigate()
  useEffect(() => {
    if (!sessionStorage.getItem("user"))
      navigate("/login")
    if(window.innerWidth<700)
      {
        setIsSidebarOpen(false)
      }
  }, [])
  return (

    <>
      <div className='flex-1 relative z-10'>
        <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>
      <div className='flex items-start relative overflow-hidden sm:overflow-auto'>

        <NavSideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className='relative flex-1 h-[calc(100vh-5rem)] overflow-auto pt-5'>
          <div className='flex items-center sticky z-20 top-0'>
            {/* {!isSidebarOpen && <div className="p-2 text-xl cursor-pointer">
              <MdMenu onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>} */}

          </div>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Home