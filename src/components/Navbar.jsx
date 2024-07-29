import React, { useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function NavList() {
  const [activeItem, setactiveItem] = useState({
    docs: true,
    blocks: false,
    account: false,
    pages: false,
  });
  const activeSelection = (item) => {
    setactiveItem({
      account: false,
      blocks: false,
      docs: false,
      pages: false,
      [item]: true,
    });
  };
  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="h5"
        color="blue-gray"
        className={`font-bold ${
          activeItem.pages
            ? "bg-pink-500 rounded-full text-white p-3 hover:text-white"
            : "hover:text-pink-500"
        } `}
      >
        <a
          onClick={() => {
            activeSelection("pages");
          }}
          href="#"
          className="flex items-center transition-colors"
        >
          Pages
        </a>
      </Typography>
      <Typography
        as="li"
        variant="h5"
        color="blue-gray"
        onClick={() => {
          activeSelection("account");
        }}
        className={`font-bold ${
          activeItem.account
            ? "bg-pink-500 rounded-full text-white p-3 hover:text-white"
            : "hover:text-pink-500"
        } `}
      >
        <a href="#" className="flex items-center transition-colors">
          Account
        </a>
      </Typography>
      <Typography
        as="li"
        variant="h5"
        color="blue-gray"
        className={`font-bold ${
          activeItem.blocks
            ? "bg-pink-500 rounded-full text-white p-3 hover:text-white"
            : "hover:text-pink-500"
        } `}
      >
        <a
          onClick={() => {
            activeSelection("blocks");
          }}
          href="#"
          className="flex items-center transition-colors"
        >
          Blocks
        </a>
      </Typography>
      {/* Please don't waste your time thanks. */}
      <Typography
        as="li"
        variant="h5"
        color="blue-gray"
        className={`font-bold ${
          activeItem.docs
            ? "bg-pink-500 rounded-full text-white p-3 hover:text-white"
            : "hover:text-pink-500"
        } `}
      >
        <a
          href="#"
          onClick={() => {
            activeSelection("docs");
          }}
          className="flex items-center transition-colors"
        >
          Docs
        </a>
      </Typography>
    </ul>
  );
}

export function NavbarSimple() {
  const [openNav, setOpenNav] = React.useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar className="px-6 py-3 bg-gradient-to-r from-pink-100">
      <div className="flex items-center justify-between text-blue-gray-900">
        <a href="/">
          <img src="logo.png" alt="logo" width="60px" height="60px" />
        </a>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}

export default Navbar;
