import React, { useEffect, useState } from "react";
import { FiPlus, FiUpload, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { supabase } from "../utils/supabase";

import "../admin-global.css";
import "./MenuManagement.css";


const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- Add Form States ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // --- ⭐ Edit Mode States ---
  const [editingItem, setEditingItem] = useState(null); // ပြင်ဆင်နေသည့် item object သိမ်းရန်
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: catData } = await supabase.from("categories").select("*");
      if (catData) setCategories(catData);
      const { data: itemData } = await supabase.from("menu_items").select("*").order("id", { ascending: false });
      if (itemData) setMenuItems(itemData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // ================= ➕ ဟင်းပွဲအသစ် ထည့်သွင်းခြင်း =================
  const handleAddItem = async (e) => {
    e.preventDefault();

    // 🔐 RLS ဘက်က စိတ်ချရအောင် Session အရင်ရယူခြင်း
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("❌ Please Login first!");
      return;
    }

    setUploading(true);
    let finalImgUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `dishes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        alert("📷 ပုံတင်ရတာ မအောင်မြင်ပါ: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from("menu-images").getPublicUrl(filePath);
      finalImgUrl = publicUrl;
    }

    const { data, error } = await supabase.from("menu_items").insert([
      {
        title,
        description,
        price: parseFloat(price),
        img_url: finalImgUrl,
        category_id: categoryId ? parseInt(categoryId) : null,
        stars: 5.0,
        reviews: 0
      }
    ]).select();

    setUploading(false);

    if (error) {
      alert("ဟင်းပွဲထည့်ရတာ မအောင်မြင်ပါ: " + error.message);
    } else {
      alert("✅ ဟင်းပွဲအသစ်ကို ထည့်သွင်းပြီးပါပြီ!");
      setMenuItems([data[0], ...menuItems]);
      setTitle(""); setDescription(""); setPrice(""); setImageFile(null); setCategoryId("");
      setShowAddForm(false);
    }
  };

  // ================= ဟင်းပွဲ အချက်အလက် ပြင်ဆင်ခြင်း (UPDATE) =================
  const startEdit = (item) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description || "");
    setEditPrice(item.price);
    setEditCategoryId(item.category_id || "");
    setEditImageFile(null);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setUploading(true);

    let updatedImgUrl = editingItem.img_url;

    // ပုံအသစ် ရွေးချယ်ထားရင် ပုံအဟောင်းနေရာမှာ အသစ် ထပ်တင်မယ်
    if (editImageFile) {
      const fileExt = editImageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `dishes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(filePath, editImageFile);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from("menu-images").getPublicUrl(filePath);
        updatedImgUrl = publicUrl;
      }
    }

    const { data, error } = await supabase
      .from("menu_items")
      .update({
        title: editTitle,
        description: editDescription,
        price: parseFloat(editPrice),
        img_url: updatedImgUrl,
        category_id: editCategoryId ? parseInt(editCategoryId) : null
      })
      .eq("id", editingItem.id)
      .select();

    setUploading(false);

    if (error) {
      alert("❌ ပြင်ဆင်ခြင်း မအောင်မြင်ပါ: " + error.message);
    } else {
      alert("✅ ဟင်းပွဲအချက်အလက်များ ပြင်ဆင်ပြီးပါပြီ!");
      setMenuItems(menuItems.map(item => item.id === editingItem.id ? data[0] : item));
      setEditingItem(null);
    }
  };

  // =================  ဟင်းပွဲ ဖျက်သိမ်းခြင်း (DELETE) =================
  const handleDeleteItem = async (id, imgUrl) => {
    if (window.confirm("⚠️ ဤဟင်းပွဲကို စာရင်းထဲမှ အပြီးဖျက်လိုပါသလား?")) {
      
      // ၁။ Supabase Database ထဲက ဖျက်မယ်
      const { error } = await supabase.from("menu_items").delete().eq("id", id);

      if (error) {
        alert("❌ ဖျက်ရတာ မအောင်မြင်ပါ: " + error.message);
      } else {
        // ၂။ (Optional) ပုံရှိခဲ့ရင် Storage ထဲကပါ လှမ်းဖျက်ပေးခြင်းဖြင့် နေရာလွတ်သက်သာစေတယ်
        if (imgUrl) {
          try {
            const urlParts = imgUrl.split("/storage/v1/object/public/menu-images/");
            if (urlParts.length > 1) {
              const filePath = urlParts[1];
              await supabase.storage.from("menu-images").remove([filePath]);
            }
          } catch (err) {
            console.error("Storage image removal failed:", err);
          }
        }

        alert("🗑️ ဟင်းပွဲကို အောင်မြင်စွာ ဖျက်ပြီးပါပြီ။");
        setMenuItems(menuItems.filter(item => item.id !== id));
      }
    }
  };

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category_id === parseInt(selectedCategory));

  if (loading) return <div className="admin-loading">Loading Menu Data...</div>;

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div>
          <h2>🍔 Menu Management</h2>
          <p>အစားအသောက် မီနူးစာရင်းများနှင့် အမျိုးအစားအလိုက် ထိန်းချုပ်ခြင်း</p>
        </div>
        <button className="admin-add-btn" onClick={() => { setShowAddForm(!showAddForm); setEditingItem(null); }}>
          <FiPlus /> {showAddForm ? "Close Form" : "Add New Item"}
        </button>
      </div>

      {/* ================= 📝 ADD NEW ITEM FORM ================= */}
      {showAddForm && !editingItem && (
        <form onSubmit={handleAddItem} className="admin-add-form">
          <h3>➕ Add New Menu Item</h3>
          <div className="form-grid">
            <input type="text" placeholder="ဟင်းပွဲအမည် (Title)" value={title} onChange={e => setTitle(e.target.value)} required />
            <input type="number" step="0.01" placeholder="ဈေးနှုန်း (Price)" value={price} onChange={e => setPrice(e.target.value)} required />
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
              <option value="">-- အမျိုးအစား ရွေးချယ်ရန် --</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <div className="file-input-wrapper">
              <label htmlFor="file-upload" className="custom-file-upload">
                <FiUpload /> {imageFile ? imageFile.name : "Choose Dish Image"}
              </label>
              <input id="file-upload" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
            </div>
          </div>
          <textarea placeholder="ဟင်းပွဲအကြောင်း အကျဉ်းချုပ် (Description)" value={description} onChange={e => setDescription(e.target.value)} rows="3"></textarea>
          <button type="submit" className="form-submit-btn" disabled={uploading}>
            {uploading ? "Saving & Uploading Image..." : "Save Item"}
          </button>
        </form>
      )}

      {/* ================= 📝 ⭐ EDIT ITEM FORM (ပေါ်လာမည့်ပုံစံ) ================= */}
      {editingItem && (
        <form onSubmit={handleUpdateItem} className="admin-add-form edit-form-highlight" style={{ borderColor: "#f39c12" }}>
          <div style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
            <h3>✏️ Edit Menu Item: {editingItem.title}</h3>
            <button type="button" className="close-edit-btn" onClick={() => setEditingItem(null)} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: "1.2rem" }}><FiX /></button>
          </div>
          <div className="form-grid">
            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
            <input type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} required />
            <select value={editCategoryId} onChange={e => setEditCategoryId(e.target.value)} required>
              <option value="">-- အမျိုးအစား ရွေးချယ်ရန် --</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <div className="file-input-wrapper">
              <label htmlFor="edit-file-upload" className="custom-file-upload">
                <FiUpload /> {editImageFile ? editImageFile.name : "Change Image (Optional)"}
              </label>
              <input id="edit-file-upload" type="file" accept="image/*" onChange={e => setEditImageFile(e.target.files[0])} />
            </div>
          </div>
          <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows="3"></textarea>
          <button type="submit" className="form-submit-btn" style={{ background: "#f39c12" }} disabled={uploading}>
            {uploading ? "Updating Data..." : "Update Item"}
          </button>
        </form>
      )}

      <div className="category-filter-container">
        <button className={`filter-tab ${selectedCategory === "all" ? "active" : ""}`} onClick={() => setSelectedCategory("all")}>All Menu</button>
        {categories.map(cat => (
          <button key={cat.id} className={`filter-tab ${selectedCategory === String(cat.id) ? "active" : ""}`} onClick={() => setSelectedCategory(String(cat.id))}>{cat.name}</button>
        ))}
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Dish Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>ဤအမျိုးအစားထဲတွင် ဟင်းပွဲမရှိသေးပါဗျာ။</td></tr>
            ) : (
              filteredItems.map((item) => {
                const itemCat = categories.find(c => c.id === item.category_id);
                return (
                  <tr key={item.id}>
                    <td><img src={item.img_url || "https://placehold.co/50"} alt={item.title} className="admin-menu-img" /></td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{item.title}</span>
                        <span className="customer-email" style={{maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.description}</span>
                      </div>
                    </td>
                    <td><span className="badge-category">{itemCat ? itemCat.name : "Uncategorized"}</span></td>
                    <td><span className="text-price">{item.price} MMK</span></td>
                    <td>⭐ {item.stars || 0}<br/> {item.reviews || 0} reviews</td>
                    
                    {/* ⭐ Action Buttons (Edit & Delete ခလုတ်များ) */}
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="action-btn edit" onClick={() => startEdit(item)} style={{ background: "none", border: "none", color: "#f39c12", cursor: "pointer", fontSize: "1.1rem" }} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteItem(item.id, item.img_url)} style={{ background: "none", border: "none", color: "#e74c3c", cursor: "pointer", fontSize: "1.1rem" }} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManagement;