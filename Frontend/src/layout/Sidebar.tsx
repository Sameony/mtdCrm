import { Sidebar } from "flowbite-react";
import { BiBuoy } from "react-icons/bi";
import { HiArrowSmRight, HiChartPie, HiInbox, HiOutlineMinusSm, HiOutlinePlusSm, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

const NavSideBar = ({isSidebarOpen, setIsSidebarOpen}:any) => {
    
    return (
        <Sidebar aria-label="Sidebar" className={`${isSidebarOpen ? "" : "hidden"} h-[calc(100vh-4rem)] overflow-hidden w-screen sm:w-[18rem] sm:overflow-auto`}>
            {/* <div className="flex justify-end sm:hidden">
                <div className="p-2 text-xl cursor-pointer" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {!isSidebarOpen ? <MdMenu /> : <MdMenuOpen />}
                </div>
            </div> */}
            <Sidebar.Items className="text-xl">
                <Sidebar.ItemGroup>
                    <Sidebar.Item href="/" icon={HiChartPie}>
                        Dashboard
                    </Sidebar.Item>
                    <Sidebar.Collapse
                        icon={HiShoppingBag}
                        label="Orders"
                        renderChevronIcon={(theme, open) => {
                            const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;

                            return <IconComponent aria-hidden className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])} />;
                        }}
                    >
                        <Sidebar.Item href="/orders/">View Orders</Sidebar.Item>
                        <Sidebar.Item href="/orders/add">Create Order</Sidebar.Item>
                        <Sidebar.Item href="#">Refunds</Sidebar.Item>
                        <Sidebar.Item href="#">Shipping</Sidebar.Item>
                    </Sidebar.Collapse>
                   
                    <Sidebar.Collapse href="#" icon={HiUser} label="Users"
                     renderChevronIcon={(theme, open) => {
                            const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;

                            return <IconComponent aria-hidden className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])} />;
                        }}>
                        
                        <Sidebar.Item href="/users">View Users</Sidebar.Item>
                        <Sidebar.Item href="/users/add">Add Users</Sidebar.Item>
                    </Sidebar.Collapse>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <Sidebar.Item href="#" icon={BiBuoy}>
                        Help
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default NavSideBar