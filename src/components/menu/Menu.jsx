import React, { useState, useEffect } from "react";
import SectionTitle from "../title/SectionTitle";
import MenuList from "./MenuList";
import MenuItem from "./MenuItem";
import { supabase } from "../../utils/supabase";

import "./menu.css";

const Menu = () => {
  const [dbMenu, setDbMenu] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [menuList, setMenuList] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenuData() {
      const { data, error } = await supabase.from("menu_items").select(`
          id, 
          title, 
          description, 
          price, 
          reviews, 
          stars, 
          img_url,
          categories ( name )
        `);

      if (error) {
        console.error("Error fetching menu:", error.message);
        setLoading(false);
        return;
      }

      if (data) {
        const formattedData = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          reviews: item.reviews,
          stars: item.stars,
          img: item.img_url,
          category: item.categories ? item.categories.name : "Uncategorized",
        }));

        setDbMenu(formattedData);
        setMenuItems(formattedData);

        const uniqueCategories = [
          "All",
          ...new Set(formattedData.map((item) => item.category)),
        ];
        setMenuList(uniqueCategories);
      }
      setLoading(false);
    }

    fetchMenuData();
  }, []);

  const filterItems = (category) => {
    if (category === "All") {
      setMenuItems(dbMenu);
      return;
    }

    const newMenuItems = dbMenu.filter((item) => item.category === category);
    setMenuItems(newMenuItems);
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "50px" }}>
        Loading delicious menu...
      </p>
    );
  }

  return (
    <section className="menu section">
      <div className="container">
        <div className="menu-header">
          <SectionTitle
            subtitle="Our Menu"
            title={
              <>
                Let's Check <span>Our Menu</span>
              </>
            }
          />

          <ul className="menu-list">
            <MenuList menuList={menuList} filterItems={filterItems} />
          </ul>
        </div>

        <div className="menu-container grid">
          <MenuItem menuItems={menuItems} />
        </div>
      </div>
    </section>
  );
};

export default Menu;
