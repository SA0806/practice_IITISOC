import React, { useState, useEffect } from "react";
import ImageCard from "./ImageCard";

const Accordion = ({ selectedObjects, toggleObjectSelection }) => {
  const [groupedData, setGroupedData] = useState({
    Furniture: [],
    Decor: [],
    Architecture: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
        const data = await res.json();

        if (!Array.isArray(data)) {
  console.error("❌ Failed to fetch products: Data is not an array", data);
  return;
}

        console.log(data);

        // Group by category
        const grouped = data.reduce((acc, item) => {
          const cat = item.category || "Uncategorized";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item);
          return acc;
        }, {});

        setGroupedData(grouped);
      } catch (error) {
        console.error("❌ Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="accordion" id="accordionExample">
      {["Furniture", "Decor", "Architecture"].map((category, i) => (
        <div className="accordion-item" key={category}>
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-${i}`}
              aria-expanded="false"
              aria-controls={`collapse-${i}`}
            >
              {category}
            </button>
          </h2>
          <div
            id={`collapse-${i}`}
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body d-flex flex-wrap gap-3">
              {groupedData[category]?.map((item, index) => (
                <ImageCard
                  // id={`${item.name}-${index}`}
                   id={`${item.name}-${item.category}`}
                  key={`${category.toLowerCase()}-${index}`}
                  
                  name={item.name}
                  image={item.image}
                  // buyLink={item.buyLink}
                  price={item.price}
                  selected={selectedObjects.some((obj) => obj.name === item.name)}
                  onClick={() => toggleObjectSelection(item)}
                  category={item.category}
                  // compact={false}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
