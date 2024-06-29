import { Sidebar } from "flowbite-react";
import { BiBuoy } from "react-icons/bi";
import { BsFillClipboard2CheckFill } from "react-icons/bs";
import { FaRoute, FaShop } from "react-icons/fa6";
import { HiChartPie, HiOutlineMinusSm, HiOutlinePlusSm, HiShoppingBag, HiUser } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

const NavSideBar = ({ isSidebarOpen }: any) => {

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
                        label="Products"
                        renderChevronIcon={(theme, open) => {
                            const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;

                            return <IconComponent aria-hidden className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])} />;
                        }}
                    >
                        <Sidebar.Item href="/products/">View Products</Sidebar.Item>
                        <Sidebar.Item href="/products/add">Add Products</Sidebar.Item>

                    </Sidebar.Collapse>
                    <Sidebar.Collapse
                        icon={BsFillClipboard2CheckFill}
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

                    <Sidebar.Collapse icon={HiUser} label="Customers"
                        renderChevronIcon={(theme, open) => {
                            const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;

                            return <IconComponent aria-hidden className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])} />;
                        }}>

                        <Sidebar.Item href="/customers">View Customers</Sidebar.Item>
                        <Sidebar.Item href="/customers/add">Add Customers</Sidebar.Item>
                    </Sidebar.Collapse>

                    <Sidebar.Collapse
                        icon={FaShop}
                        label="Supplier"
                        renderChevronIcon={(theme, open) => {
                            const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;

                            return <IconComponent aria-hidden className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])} />;
                        }}
                    >
                        <Sidebar.Item href="/supplier/">View Suppliers</Sidebar.Item>
                        <Sidebar.Item href="/supplier/add">Add Supplier</Sidebar.Item>
                        <Sidebar.Item href="/supplier/orders">View Supplier Orders</Sidebar.Item>
                    </Sidebar.Collapse>
                    <Sidebar.Collapse
                        icon={FaRoute}
                        label="Routes"
                        renderChevronIcon={(theme, open) => {
                            const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;

                            return <IconComponent aria-hidden className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])} />;
                        }}
                    >
                        <Sidebar.Item href="/routes/">View Routes</Sidebar.Item>
                        <Sidebar.Item href="/routes/add">Add Route</Sidebar.Item>
                        {/* <Sidebar.Item href="/supplier/orders">View Supplier Orders</Sidebar.Item> */}
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