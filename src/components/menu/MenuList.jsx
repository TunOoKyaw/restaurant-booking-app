import React, { useState } from "react";

const MenuList = ({ menuList, filterItems }) => {
  const [active, setActive] = useState(0);
  return (
    <>
      {menuList.map((category, index) => (
        <li
          className={`${active === index ? "active-item" : ""} menu-list-item`}
          onClick={() => {
            setActive(index);
            filterItems(category);
          }}
          key={index}
        >
          {category}
        </li>
      ))}
    </>
  );
};

export default MenuList;
