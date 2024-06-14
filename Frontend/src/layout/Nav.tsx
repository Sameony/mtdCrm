import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi";
import { MdMenu, MdMenuOpen } from "react-icons/md";
import { useNavigate } from "react-router-dom";


export default function NavBar({toggleSidebar, isSidebarOpen}:any) {
  const navigate = useNavigate();
  return (
    <Navbar className="bg-gray-50 drop-shadow-sm" fluid rounded>
      <Navbar.Brand href="/">
        <img src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">MTD React</span>
      </Navbar.Brand>
      <div className=" flex items-center md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-base font-thin">Bonnie Green</span>
            <span className="block truncate text-sm">{sessionStorage.getItem("user")}</span>
          </Dropdown.Header>
          <Dropdown.Item href="/" icon={HiViewGrid}>Dashboard</Dropdown.Item>
          <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
          <Dropdown.Item icon={HiCurrencyDollar}>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item icon={HiLogout} onClick={()=>{
            sessionStorage.clear()
            navigate("/login");
          }}>Sign out</Dropdown.Item>
        </Dropdown>
        {isSidebarOpen?<MdMenuOpen className="text-2xl mx-2 lg:hidden" onClick={()=>toggleSidebar()} />:<MdMenu className="text-2xl mx-2 lg:hidden" onClick={()=>toggleSidebar()} />}
      </div>

    </Navbar>
  );
}
