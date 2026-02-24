// Comprehensive Nigerian Products Database - 150+ Products
const nigerianProducts = [
    // Grains & Legumes (Staples)
    { id: 1, name: "Rice (Long Grain) 50kg", category: "Grains & Legumes", price: 35000, description: "Premium long grain rice" },
    { id: 2, name: "Rice (Short Grain) 50kg", category: "Grains & Legumes", price: 32000, description: "Short grain rice" },
    { id: 3, name: "Ofada Rice 10kg", category: "Grains & Legumes", price: 8000, description: "Local Nigerian rice" },
    { id: 4, name: "Ofada Rice 50kg", category: "Grains & Legumes", price: 35000, description: "Bulk Ofada rice" },
    { id: 5, name: "Brown Rice 10kg", category: "Grains & Legumes", price: 12000, description: "Healthy brown rice" },
    { id: 6, name: "White Beans (Oloyin/Honey) 50kg", category: "Grains & Legumes", price: 28000, description: "Sweet white beans" },
    { id: 7, name: "White Beans (Drum) 50kg", category: "Grains & Legumes", price: 26000, description: "Drum white beans" },
    { id: 8, name: "Brown Beans (Patasco) 50kg", category: "Grains & Legumes", price: 30000, description: "Brown beans" },
    { id: 9, name: "Peeled Beans (Dry) 1kg", category: "Grains & Legumes", price: 800, description: "Convenient peeled beans" },
    { id: 10, name: "Peeled Beans (Dry) 5kg", category: "Grains & Legumes", price: 3500, description: "Bulk peeled beans" },
    { id: 11, name: "Maize (White) Bag", category: "Grains & Legumes", price: 15000, description: "White maize" },
    { id: 12, name: "Maize (Yellow) Bag", category: "Grains & Legumes", price: 16000, description: "Yellow maize" },
    { id: 13, name: "Millet Bag", category: "Grains & Legumes", price: 18000, description: "Millet grains" },
    { id: 14, name: "Guinea Corn Bag", category: "Grains & Legumes", price: 17000, description: "Guinea corn" },
    { id: 15, name: "Soybeans Bag", category: "Grains & Legumes", price: 25000, description: "Soybeans" },
    { id: 16, name: "Wheat (Grain) Bag", category: "Grains & Legumes", price: 20000, description: "Wheat grains" },
    
    // Flours & Processed Starches
    { id: 17, name: "Garri (White) 1 Painter", category: "Flours & Starches", price: 1500, description: "White garri" },
    { id: 18, name: "Garri (White) Bag", category: "Flours & Starches", price: 23000, description: "Bulk white garri" },
    { id: 19, name: "Garri (Yellow) 1 Painter", category: "Flours & Starches", price: 1600, description: "Yellow garri" },
    { id: 20, name: "Garri (Yellow) Bag", category: "Flours & Starches", price: 25000, description: "Bulk yellow garri" },
    { id: 21, name: "Ijebu Garri 1 Painter", category: "Flours & Starches", price: 1800, description: "Special Ijebu garri" },
    { id: 22, name: "Poundo Yam Flour 1kg", category: "Flours & Starches", price: 1200, description: "Yam flour" },
    { id: 23, name: "Poundo Yam Flour 2kg", category: "Flours & Starches", price: 2200, description: "Pack yam flour" },
    { id: 24, name: "Poundo Yam Flour 5kg", category: "Flours & Starches", price: 5000, description: "Bulk yam flour" },
    { id: 25, name: "Yam Flour (Elubo) 1kg", category: "Flours & Starches", price: 1000, description: "Traditional yam flour" },
    { id: 26, name: "Yam Flour (Elubo) 5kg", category: "Flours & Starches", price: 4500, description: "Bulk yam flour" },
    { id: 27, name: "Cassava Flour (Lafun) 1kg", category: "Flours & Starches", price: 800, description: "Cassava flour" },
    { id: 28, name: "Cassava Flour (Lafun) 5kg", category: "Flours & Starches", price: 3500, description: "Bulk cassava flour" },
    { id: 29, name: "Plantain Flour 1kg", category: "Flours & Starches", price: 1500, description: "Plantain flour" },
    { id: 30, name: "Plantain Flour 2kg", category: "Flours & Starches", price: 2800, description: "Pack plantain flour" },
    { id: 31, name: "Semolina (Semovita) 1kg", category: "Flours & Starches", price: 600, description: "Semolina" },
    { id: 32, name: "Semolina (Semovita) 5kg", category: "Flours & Starches", price: 2800, description: "Bulk semolina" },
    { id: 33, name: "Semolina (Semovita) 10kg", category: "Flours & Starches", price: 5000, description: "Large pack semolina" },
    { id: 34, name: "Wheat Flour (Baking) 1kg", category: "Flours & Starches", price: 500, description: "Baking flour" },
    { id: 35, name: "Wheat Flour (Baking) 50kg", category: "Flours & Starches", price: 22000, description: "Bulk baking flour" },
    { id: 36, name: "Corn Flour 1kg", category: "Flours & Starches", price: 700, description: "Corn flour" },
    { id: 37, name: "Rice Flour 1kg", category: "Flours & Starches", price: 800, description: "Rice flour" },
    { id: 38, name: "Cocoyam Powder 1kg", category: "Flours & Starches", price: 1200, description: "Cocoyam powder" },
    { id: 39, name: "Okpa Flour 1kg", category: "Flours & Starches", price: 1000, description: "Okpa flour" },
    { id: 40, name: "Fufu Flour 1kg", category: "Flours & Starches", price: 900, description: "Fufu flour" },
    
    // Oils & Fats
    { id: 41, name: "Palm Oil (Red Oil) 4L", category: "Oils & Fats", price: 3200, description: "Red palm oil" },
    { id: 42, name: "Palm Oil (Red Oil) 25L", category: "Oils & Fats", price: 18000, description: "Bulk palm oil" },
    { id: 43, name: "Groundnut Oil 1L", category: "Oils & Fats", price: 1500, description: "Groundnut oil" },
    { id: 44, name: "Groundnut Oil 4L", category: "Oils & Fats", price: 5500, description: "Pack groundnut oil" },
    { id: 45, name: "Groundnut Oil 25L", category: "Oils & Fats", price: 30000, description: "Bulk groundnut oil" },
    { id: 46, name: "Vegetable Oil (Refined) 1L", category: "Oils & Fats", price: 1200, description: "Refined vegetable oil" },
    { id: 47, name: "Vegetable Oil (Refined) 4L", category: "Oils & Fats", price: 4500, description: "Pack vegetable oil" },
    { id: 48, name: "Vegetable Oil (Refined) 25L", category: "Oils & Fats", price: 25000, description: "Bulk vegetable oil" },
    { id: 49, name: "Soya Oil 1L", category: "Oils & Fats", price: 1300, description: "Soya oil" },
    { id: 50, name: "Soya Oil 4L", category: "Oils & Fats", price: 4800, description: "Pack soya oil" },
    { id: 51, name: "Coconut Oil 1L", category: "Oils & Fats", price: 2500, description: "Coconut oil" },
    { id: 52, name: "Shea Butter 1kg", category: "Oils & Fats", price: 2000, description: "Pure shea butter" },
    { id: 53, name: "Butter/Margarine 250g", category: "Oils & Fats", price: 450, description: "Butter spread" },
    { id: 54, name: "Butter/Margarine 500g", category: "Oils & Fats", price: 850, description: "Large butter tin" },
    
    // Tubers & Produce (Fresh/Dried)
    { id: 55, name: "Yam Tubers (Per unit)", category: "Fresh Produce", price: 800, description: "Fresh yam" },
    { id: 56, name: "Sweet Potatoes Bag", category: "Fresh Produce", price: 3500, description: "Sweet potatoes" },
    { id: 57, name: "Irish Potatoes Bag", category: "Fresh Produce", price: 4000, description: "Irish potatoes" },
    { id: 58, name: "Cocoyam Bag", category: "Fresh Produce", price: 3000, description: "Cocoyam tubers" },
    { id: 59, name: "Onions (Red) Bag", category: "Fresh Produce", price: 4500, description: "Red onions" },
    { id: 60, name: "Onions (Dry/White) Bag", category: "Fresh Produce", price: 4000, description: "White onions" },
    { id: 61, name: "Fresh Tomatoes Basket", category: "Fresh Produce", price: 2500, description: "Fresh tomatoes" },
    { id: 62, name: "Tatashe (Bell Pepper) Basket", category: "Fresh Produce", price: 3000, description: "Bell peppers" },
    { id: 63, name: "Rodo (Scotch Bonnet) Rubber", category: "Fresh Produce", price: 1500, description: "Hot peppers" },
    { id: 64, name: "Rodo (Scotch Bonnet) Bag", category: "Fresh Produce", price: 6000, description: "Bulk hot peppers" },
    { id: 65, name: "Shombo (Cayenne Pepper) Rubber", category: "Fresh Produce", price: 1200, description: "Cayenne peppers" },
    { id: 66, name: "Bawa (Green Pepper) Rubber", category: "Fresh Produce", price: 1800, description: "Green peppers" },
    { id: 67, name: "Okro Heap", category: "Fresh Produce", price: 800, description: "Fresh okra" },
    { id: 68, name: "Ugu leaves (Fresh) Bunch", category: "Fresh Produce", price: 300, description: "Ugu vegetables" },
    { id: 69, name: "Scent leaves (Fresh) Bunch", category: "Fresh Produce", price: 250, description: "Scent leaves" },
    { id: 70, name: "Bitter leaf (Fresh) Bunch", category: "Fresh Produce", price: 350, description: "Bitter leaf" },
    { id: 71, name: "Waterleaf (Fresh) Bunch", category: "Fresh Produce", price: 200, description: "Waterleaf" },
    { id: 72, name: "Utazi leaves Bunch", category: "Fresh Produce", price: 400, description: "Utazi leaves" },
    { id: 73, name: "Ewedu Bunch", category: "Fresh Produce", price: 250, description: "Ewedu leaves" },
    { id: 74, name: "Carrots Bag", category: "Fresh Produce", price: 3500, description: "Fresh carrots" },
    { id: 75, name: "Cabbage Unit", category: "Fresh Produce", price: 600, description: "Fresh cabbage" },
    { id: 76, name: "Green Peas Kg", category: "Fresh Produce", price: 1200, description: "Green peas" },
    { id: 77, name: "Garden Eggs Rubber", category: "Fresh Produce", price: 1500, description: "Garden eggs" },
    { id: 78, name: "Plantain (Ripe) Bunch", category: "Fresh Produce", price: 2500, description: "Ripe plantains" },
    { id: 79, name: "Plantain (Unripe) Bunch", category: "Fresh Produce", price: 2000, description: "Unripe plantains" },,
    
    // Soups, Spices & Seasonings
    { id: 80, name: "Crayfish (Red/Oporo) Painter", category: "Soups & Spices", price: 2500, description: "Red crayfish" },
    { id: 81, name: "Crayfish (Tiny) Painter", category: "Soups & Spices", price: 1800, description: "Small crayfish" },
    { id: 82, name: "Stockfish Head Kg", category: "Soups & Spices", price: 3500, description: "Stockfish head" },
    { id: 83, name: "Stockfish Ear/Flesh Kg", category: "Soups & Spices", price: 4500, description: "Stockfish flesh" },
    { id: 84, name: "Dried Catfish Unit", category: "Soups & Spices", price: 800, description: "Dried catfish" },
    { id: 85, name: "Dried Catfish Pack", category: "Soups & Spices", price: 2500, description: "Pack dried catfish" },
    { id: 86, name: "Mangala Fish Unit", category: "Soups & Spices", price: 600, description: "Mangala fish" },
    { id: 87, name: "Smoked Titus Fish Unit", category: "Soups & Spices", price: 1200, description: "Smoked fish" },
    { id: 88, name: "Shawa Fish Unit", category: "Soups & Spices", price: 800, description: "Shawa fish" },
    { id: 89, name: "Bonga Fish Unit", category: "Soups & Spices", price: 500, description: "Bonga fish" },
    { id: 90, name: "Egusi (Shelled) Painter", category: "Soups & Spices", price: 3000, description: "Shelled egusi" },
    { id: 91, name: "Egusi (Unshelled) Painter", category: "Soups & Spices", price: 2200, description: "Unshelled egusi" },
    { id: 92, name: "Ogbono Painter", category: "Soups & Spices", price: 2800, description: "Ogbono seeds" },
    { id: 93, name: "Iru (Locust Beans) Wrap", category: "Soups & Spices", price: 150, description: "Locust beans" },
    { id: 94, name: "Iru (Locust Beans) Rubber", category: "Soups & Spices", price: 800, description: "Bulk locust beans" },
    { id: 95, name: "Ogiri Wrap", category: "Soups & Spices", price: 200, description: "Ogiri seasoning" },
    { id: 96, name: "Cameroon Pepper Rubber", category: "Soups & Spices", price: 1200, description: "Hot Cameroon pepper" },
    { id: 97, name: "Dry Pepper Rubber", category: "Soups & Spices", price: 800, description: "Dried pepper" },
    { id: 98, name: "Achi Rubber", category: "Soups & Spices", price: 600, description: "Achi thickener" },
    { id: 99, name: "Peppersoup Spice Sachet", category: "Soups & Spices", price: 100, description: "Peppersoup seasoning" },
    { id: 100, name: "Suya Spice (Yaji) Pack", category: "Soups & Spices", price: 200, description: "Suya spice mix" },
    { id: 101, name: "Curry Powder Roll", category: "Soups & Spices", price: 250, description: "Curry powder" },
    { id: 102, name: "Curry Powder Container", category: "Soups & Spices", price: 800, description: "Large curry powder" },
    { id: 103, name: "Thyme Roll", category: "Soups & Spices", price: 300, description: "Thyme spice" },
    { id: 104, name: "Thyme Container", category: "Soups & Spices", price: 1000, description: "Large thyme" },
    { id: 105, name: "Garlic Kg", category: "Soups & Spices", price: 1200, description: "Fresh garlic" },
    { id: 106, name: "Ginger Kg", category: "Soups & Spices", price: 1500, description: "Fresh ginger" },
    { id: 107, name: "Turmeric Kg", category: "Soups & Spices", price: 2000, description: "Turmeric root" },
    { id: 108, name: "Cloves Sachet", category: "Soups & Spices", price: 150, description: "Cloves spice" },
    { id: 109, name: "Nutmeg Unit", category: "Soups & Spices", price: 100, description: "Nutmeg seed" },
    { id: 110, name: "Seasoning Cubes (Maggi/Knorr) Carton", category: "Soups & Spices", price: 3500, description: "Bulk seasoning cubes" },
    { id: 111, name: "Seasoning Powder Packet", category: "Soups & Spices", price: 300, description: "Seasoning powder" },
    { id: 112, name: "Salt Bag", category: "Soups & Spices", price: 800, description: "Refined salt" },
    { id: 113, name: "Salt Pack", category: "Soups & Spices", price: 200, description: "Salt pack" },
    { id: 114, name: "Sugar Bag", category: "Soups & Spices", price: 1200, description: "Refined sugar" },
    { id: 115, name: "Sugar Pack", category: "Soups & Spices", price: 350, description: "Sugar pack" },
    { id: 116, name: "Tomato Paste (Sachets) Carton", category: "Soups & Spices", price: 4500, description: "Bulk tomato paste" },
    { id: 117, name: "Tomato Paste (Tins) Carton", category: "Soups & Spices", price: 5500, description: "Tinned tomato paste" },
    { id: 118, name: "Corned Beef Tin", category: "Soups & Spices", price: 800, description: "Corned beef" },
    { id: 119, name: "Sardines Carton", category: "Soups & Spices", price: 2800, description: "Sardines" },
    { id: 120, name: "Periwinkles (Shelled) Rubber", category: "Soups & Spices", price: 1500, description: "Shelled periwinkles" },
    { id: 121, name: "Snails Pack", category: "Soups & Spices", price: 2500, description: "Processed snails" },
    
    // Beverages & Breakfast
    { id: 122, name: "Milk (Powdered Sachets) Carton", category: "Beverages & Breakfast", price: 4500, description: "Powdered milk" },
    { id: 123, name: "Milk (Evaporated Tin) Carton", category: "Beverages & Breakfast", price: 5500, description: "Evaporated milk" },
    { id: 124, name: "Milo Small tin", category: "Beverages & Breakfast", price: 800, description: "Milo chocolate drink" },
    { id: 125, name: "Milo Big tin", category: "Beverages & Breakfast", price: 2000, description: "Large Milo" },
    { id: 126, name: "Bournvita Small tin", category: "Beverages & Breakfast", price: 750, description: "Bournvita drink" },
    { id: 127, name: "Bournvita Big tin", category: "Beverages & Breakfast", price: 1800, description: "Large Bournvita" },
    { id: 128, name: "Ovaltine Small tin", category: "Beverages & Breakfast", price: 850, description: "Ovaltine drink" },
    { id: 129, name: "Ovaltine Big tin", category: "Beverages & Breakfast", price: 2200, description: "Large Ovaltine" },
    { id: 130, name: "Coffee (Nescafe) Small sachet", category: "Beverages & Breakfast", price: 150, description: "Instant coffee" },
    { id: 131, name: "Coffee (Nescafe) Tin", category: "Beverages & Breakfast", price: 1200, description: "Coffee tin" },
    { id: 132, name: "Tea Bags (Lipton) Packet", category: "Beverages & Breakfast", price: 600, description: "Tea bags" },
    { id: 133, name: "Golden Morn Carton", category: "Beverages & Breakfast", price: 3500, description: "Golden Morn cereal" },
    { id: 134, name: "Cornflakes Packet", category: "Beverages & Breakfast", price: 1200, description: "Cornflakes" },
    { id: 135, name: "Custard Container", category: "Beverages & Breakfast", price: 1500, description: "Custard powder" },
    { id: 136, name: "Cocoa Powder Kg", category: "Beverages & Breakfast", price: 2500, description: "Cocoa powder" },
    
    // Noodles, Pasta & Snacks
    { id: 137, name: "Indomie Carton", category: "Noodles & Snacks", price: 2800, description: "Instant noodles" },
    { id: 138, name: "Spaghetti (Golden Penny) Carton", category: "Noodles & Snacks", price: 3500, description: "Spaghetti pasta" },
    { id: 139, name: "Spaghetti (Dangote) Carton", category: "Noodles & Snacks", price: 3200, description: "Dangote spaghetti" },
    { id: 140, name: "Macaroni Carton", category: "Noodles & Snacks", price: 3000, description: "Macaroni pasta" },
    { id: 141, name: "Noodles (Other brands) Carton", category: "Noodles & Snacks", price: 2500, description: "Other noodles" },
    { id: 142, name: "Groundnut (Roasted) Unit", category: "Noodles & Snacks", price: 50, description: "Roasted groundnut" },
    { id: 143, name: "Plantain Chips Pack", category: "Noodles & Snacks", price: 200, description: "Plantain chips" },
    { id: 144, name: "Potato Chips Pack", category: "Noodles & Snacks", price: 250, description: "Potato chips" },
    { id: 145, name: "Chin Chin Packet", category: "Noodles & Snacks", price: 500, description: "Chin chin snack" },
    { id: 146, name: "Kuli Kuli Unit", category: "Noodles & Snacks", price: 100, description: "Kuli kuli snack" },
    { id: 147, name: "Biscuits (Cabin) Roll", category: "Noodles & Snacks", price: 350, description: "Cabin biscuits" },
    { id: 148, name: "Biscuits (Digestive) Roll", category: "Noodles & Snacks", price: 400, description: "Digestive biscuits" },
    { id: 149, name: "Biscuits (Cabin) Carton", category: "Noodles & Snacks", price: 4500, description: "Bulk biscuits" },
    { id: 150, name: "Bread Unit", category: "Noodles & Snacks", price: 500, description: "Sliced bread" },
    
    // Household Essentials
    { id: 151, name: "Detergent (Soap Powder) Roll", category: "Household Essentials", price: 450, description: "Soap powder detergent" },
    { id: 152, name: "Detergent (Soap Powder) Carton", category: "Household Essentials", price: 5500, description: "Bulk detergent" },
    { id: 153, name: "Bar Soap Carton", category: "Household Essentials", price: 3500, description: "Bar soap pack" },
    { id: 154, name: "Liquid Soap Bottle", category: "Household Essentials", price: 800, description: "Liquid soap" },
    { id: 155, name: "Toilet Tissue Bale", category: "Household Essentials", price: 2500, description: "Toilet paper" },
    { id: 156, name: "Matches Packet", category: "Household Essentials", price: 100, description: "Match box" },
    { id: 157, name: "Candles Packet", category: "Household Essentials", price: 150, description: "Candles" },
    
    // Essential Medicines - Analgesics & Antipyretics
    { id: 158, name: "Paracetamol 500mg Tablet", category: "Pharmacy Medicines", price: 50, description: "Pain relief tablet" },
    { id: 159, name: "Paracetamol 500mg Pack", category: "Pharmacy Medicines", price: 500, description: "Paracetamol pack" },
    { id: 160, name: "Paracetamol Syrup 125mg/5ml Bottle", category: "Pharmacy Medicines", price: 300, description: "Children paracetamol" },
    { id: 161, name: "Ibuprofen 200mg Tablet", category: "Pharmacy Medicines", price: 80, description: "Ibuprofen tablet" },
    { id: 162, name: "Ibuprofen 200mg Pack", category: "Pharmacy Medicines", price: 800, description: "Ibuprofen pack" },
    { id: 163, name: "Ibuprofen 400mg Tablet", category: "Pharmacy Medicines", price: 120, description: "Strong ibuprofen" },
    { id: 164, name: "Ibuprofen 400mg Pack", category: "Pharmacy Medicines", price: 1200, description: "Strong ibuprofen pack" },
    { id: 165, name: "Aspirin Tablet", category: "Pharmacy Medicines", price: 30, description: "Aspirin tablet" },
    { id: 166, name: "Diclofenac 50mg Tablet", category: "Pharmacy Medicines", price: 100, description: "Diclofenac tablet" },
    { id: 167, name: "Diclofenac 50mg Pack", category: "Pharmacy Medicines", price: 1000, description: "Diclofenac pack" },
    { id: 168, name: "Felvin (Piroxicam) Capsule", category: "Pharmacy Medicines", price: 150, description: "Piroxicam capsule" },
    { id: 169, name: "Felvin (Piroxicam) Pack", category: "Pharmacy Medicines", price: 1500, description: "Piroxicam pack" },
    { id: 170, name: "Tramadol Capsule (Restricted)", category: "Pharmacy Medicines", price: 200, description: "Tramadol - restricted" },
    { id: 171, name: "Gelofene (Diclofenac) Tablet", category: "Pharmacy Medicines", price: 120, description: "Gelofene tablet" },
    
    // Antimalarials
    { id: 172, name: "Artemether/Lumefantrine (AL) Pack", category: "Pharmacy Medicines", price: 2500, description: "Antimalarial drugs" },
    { id: 173, name: "Artesunate/Amodiaquine Pack", category: "Pharmacy Medicines", price: 2000, description: "Antimalarial combo" },
    { id: 174, name: "Artesunate Injection Vial", category: "Pharmacy Medicines", price: 1500, description: "Artesunate injection" },
    { id: 175, name: "Sulphadoxine/Pyrimethamine (SP) Pack", category: "Pharmacy Medicines", price: 800, description: "Antimalarial SP" },
    
    // Antibiotics
    { id: 176, name: "Amoxicillin 500mg Capsule", category: "Pharmacy Medicines", price: 100, description: "Amoxicillin capsule" },
    { id: 177, name: "Amoxicillin 500mg Pack", category: "Pharmacy Medicines", price: 1000, description: "Amoxicillin pack" },
    { id: 178, name: "Amoxicillin/Clavulanic Acid Tablet", category: "Pharmacy Medicines", price: 200, description: "Co-amoxiclav tablet" },
    { id: 179, name: "Ampicillin/Cloxacillin Capsule", category: "Pharmacy Medicines", price: 150, description: "Ampiclox capsule" },
    { id: 180, name: "Ciprofloxacin 500mg Tablet", category: "Pharmacy Medicines", price: 120, description: "Ciprofloxacin tablet" },
    { id: 181, name: "Ciprofloxacin 500mg Pack", category: "Pharmacy Medicines", price: 1200, description: "Ciprofloxacin pack" },
    { id: 182, name: "Metronidazole 200mg Tablet", category: "Pharmacy Medicines", price: 80, description: "Metronidazole tablet" },
    { id: 183, name: "Metronidazole 400mg Tablet", category: "Pharmacy Medicines", price: 120, description: "Strong metronidazole" },
    { id: 184, name: "Metronidazole Suspension Bottle", category: "Pharmacy Medicines", price: 500, description: "Metronidazole liquid" },
    { id: 185, name: "Azithromycin 500mg Tablet", category: "Pharmacy Medicines", price: 300, description: "Azithromycin tablet" },
    { id: 186, name: "Azithromycin 500mg Pack", category: "Pharmacy Medicines", price: 3000, description: "Azithromycin pack" },
    { id: 187, name: "Cefuroxime Tablet", category: "Pharmacy Medicines", price: 250, description: "Cefuroxime tablet" },
    { id: 188, name: "Erythromycin Tablet", category: "Pharmacy Medicines", price: 150, description: "Erythromycin tablet" },
    { id: 189, name: "Tetracycline Capsule", category: "Pharmacy Medicines", price: 100, description: "Tetracycline capsule" },
    { id: 190, name: "Gentamicin Injection Ampoule", category: "Pharmacy Medicines", price: 800, description: "Gentamicin injection" },
    { id: 191, name: "Ceftriaxone Injection Vial", category: "Pharmacy Medicines", price: 1500, description: "Ceftriaxone injection" },
    
    // Antihistamines & Anti-allergy
    { id: 192, name: "Chlorpheniramine (Piriton) Tablet", category: "Pharmacy Medicines", price: 50, description: "Piriton tablet" },
    { id: 193, name: "Loratadine Tablet", category: "Pharmacy Medicines", price: 100, description: "Loratadine tablet" },
    { id: 194, name: "Cetirizine Tablet", category: "Pharmacy Medicines", price: 80, description: "Cetirizine tablet" },
    { id: 195, name: "Hydrocortisone Cream Tube", category: "Pharmacy Medicines", price: 300, description: "Hydrocortisone cream" },
    
    // Gastrointestinal Agents
    { id: 196, name: "Aluminium Hydroxide/Magnesium Hydroxide Liquid", category: "Pharmacy Medicines", price: 400, description: "Antacid liquid" },
    { id: 197, name: "Aluminium Hydroxide/Magnesium Hydroxide Tablet", category: "Pharmacy Medicines", price: 200, description: "Antacid tablet" },
    { id: 198, name: "Omeprazole 20mg Capsule", category: "Pharmacy Medicines", price: 150, description: "Omeprazole 20mg" },
    { id: 199, name: "Omeprazole 40mg Capsule", category: "Pharmacy Medicines", price: 250, description: "Omeprazole 40mg" },
    { id: 200, name: "Gestid Tablet", category: "Pharmacy Medicines", price: 100, description: "Gestid tablet" },
    { id: 201, name: "Loperamide Tablet", category: "Pharmacy Medicines", price: 120, description: "Anti-diarrheal" },
    { id: 202, name: "Bisacodyl Tablet", category: "Pharmacy Medicines", price: 80, description: "Laxative tablet" },
    { id: 203, name: "Oral Rehydration Salts (ORS) Sachet", category: "Pharmacy Medicines", price: 100, description: "ORS rehydration" },
    { id: 204, name: "Hyoscine Butylbromide Tablet", category: "Pharmacy Medicines", price: 150, description: "Stomach cramp relief" },
    
    // Cough & Cold
    { id: 205, name: "Benylin (Cough Syrup) Bottle", category: "Pharmacy Medicines", price: 800, description: "Benylin cough syrup" },
    { id: 206, name: "Codeine Cough Syrup (Restricted) Bottle", category: "Pharmacy Medicines", price: 1200, description: "Codeine syrup" },
    { id: 207, name: "Paracetamol/Pseudoephedrine Tablet", category: "Pharmacy Medicines", price: 150, description: "Cold tablet" },
    { id: 208, name: "Vitamin C 500mg Tablet", category: "Pharmacy Medicines", price: 50, description: "Vitamin C 500mg" },
    { id: 209, name: "Vitamin C 500mg Pack", category: "Pharmacy Medicines", price: 500, description: "Vitamin C pack" },
    { id: 210, name: "Vitamin C 1000mg Tablet", category: "Pharmacy Medicines", price: 80, description: "Vitamin C 1000mg" },
    { id: 211, name: "Vitamin C 1000mg Pack", category: "Pharmacy Medicines", price: 800, description: "Vitamin C 1000mg pack" },
    
    // Anticonvulsants/Central Nervous System
    { id: 212, name: "Diazepam Tablet (Restricted)", category: "Pharmacy Medicines", price: 100, description: "Diazepam tablet" },
    { id: 213, name: "Diazepam Injection (Restricted)", category: "Pharmacy Medicines", price: 500, description: "Diazepam injection" },
    { id: 214, name: "Phenobarbitone Tablet", category: "Pharmacy Medicines", price: 80, description: "Phenobarbitone tablet" },
    { id: 215, name: "Phenytoin Tablet", category: "Pharmacy Medicines", price: 120, description: "Phenytoin tablet" },
    
    // Vitamins & Minerals
    { id: 216, name: "Multivitamins Capsule", category: "Pharmacy Medicines", price: 150, description: "Multivitamin capsule" },
    { id: 217, name: "Multivitamins Tablet", category: "Pharmacy Medicines", price: 100, description: "Multivitamin tablet" },
    { id: 218, name: "Vitamin B Complex Tablet", category: "Pharmacy Medicines", price: 80, description: "Vitamin B complex" },
    { id: 219, name: "Ferrous Sulphate/Folic Acid Tablet", category: "Pharmacy Medicines", price: 100, description: "Iron + folic acid" },
    { id: 220, name: "Vitamin E Capsule", category: "Pharmacy Medicines", price: 120, description: "Vitamin E capsule" },
    { id: 221, name: "Calcium Supplement Tablet", category: "Pharmacy Medicines", price: 150, description: "Calcium tablet" },
    
    // Antihypertensives
    { id: 222, name: "Amlodipine 5mg Tablet", category: "Pharmacy Medicines", price: 100, description: "Amlodipine 5mg" },
    { id: 223, name: "Amlodipine 10mg Tablet", category: "Pharmacy Medicines", price: 150, description: "Amlodipine 10mg" },
    { id: 224, name: "Lisinopril Tablet", category: "Pharmacy Medicines", price: 120, description: "Lisinopril tablet" },
    { id: 225, name: "Bisoprolol Tablet", category: "Pharmacy Medicines", price: 150, description: "Bisoprolol tablet" },
    { id: 226, name: "Losartan Potassium Tablet", category: "Pharmacy Medicines", price: 200, description: "Losartan tablet" },
    
    // Other Essentials
    { id: 227, name: "Salbutamol Inhaler (Albuterol)", category: "Pharmacy Medicines", price: 1500, description: "Asthma inhaler" },
    { id: 228, name: "Antiseptic Liquid (Dettol/Savlon) Bottle", category: "Pharmacy Medicines", price: 800, description: "Antiseptic liquid" },
    { id: 229, name: "Spirit/Alcohol Bottle", category: "Pharmacy Medicines", price: 500, description: "Surgical spirit" },
    { id: 230, name: "Cotton Wool/Bandages Pack", category: "Pharmacy Medicines", price: 1000, description: "First aid pack" }
];

// Shopping Cart Functionality
let cart = [];
let cartCount = 0;
let wishlist = [];
let messageCount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    setupEventListeners();
    updateCartUI();
    setupLoadingOverlay();
    initializeMobileSearch(); // Initialize mobile-friendly search
    
    // Initialize products page if on products.html
    if (window.location.pathname.includes('products.html') || window.location.href.includes('products.html')) {
        initializeProductsPage();
    }
});

// Products Page Functionality
function initializeProductsPage() {
    displayAllProducts();
    setupProductFilters();
    setupSearchFromURL();
}

function displayAllProducts(category = 'all') {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    let productsToShow = nigerianProducts;
    
    if (category !== 'all') {
        productsToShow = nigerianProducts.filter(product => product.category === category);
    }
    
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products-message">
                <i class="fas fa-box-open"></i>
                <h3>No products found</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Update page title based on category
    updatePageHeader(category);
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <div class="product-image">
            <img src="https://picsum.photos/seed/${product.name.replace(/[^a-zA-Z0-9]/g, '')}/300/300" alt="${product.name}">
            <span class="product-category-badge">${getCategoryIcon(product.category)} ${product.category}</span>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-meta">
                <span class="product-unit">${getUnitFromName(product.name)}</span>
            </div>
            <div class="price">
                <span class="current">₦${product.price.toLocaleString()}</span>
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="comment-btn" onclick="askAboutProduct(${product.id})">
                    <i class="fas fa-comment"></i>
                </button>
            </div>
        </div>
    `;
    return productCard;
}

function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products
            const category = this.getAttribute('data-category');
            displayAllProducts(category);
            
            // Smooth scroll to products grid on mobile
            if (window.innerWidth <= 768) {
                document.querySelector('.products-grid').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
}

function updatePageHeader(category) {
    const pageHeader = document.querySelector('.page-header');
    if (!pageHeader) return;
    
    let title = 'All Products';
    let description = 'Discover our complete collection of premium products';
    
    if (category !== 'all') {
        title = category;
        description = `Browse our selection of ${category.toLowerCase()} - ${nigerianProducts.filter(p => p.category === category).length} products available`;
    }
    
    pageHeader.querySelector('h1').textContent = title;
    pageHeader.querySelector('p').textContent = description;
}

function setupSearchFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    if (searchQuery) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchQuery;
            performSearch(searchQuery, true);
        }
        
        // Update page header for search results
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.querySelector('h1').textContent = `Search Results`;
            pageHeader.querySelector('p').textContent = `Showing results for "${searchQuery}"`;
        }
    }
}

function askAboutProduct(productId) {
    const product = nigerianProducts.find(p => p.id === productId);
    if (!product) return;
    
    const message = `Hi, I'm interested in ${product.name}. Is it available and what's the current price?`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/2348012345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function toggleWishlist(productId) {
    const product = nigerianProducts.find(p => p.id === productId);
    if (!product) return;
    
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast(`${product.name} removed from wishlist`);
    } else {
        wishlist.push(productId);
        showToast(`${product.name} added to wishlist`);
    }
    
    localStorage.setItem('chetachiWishlist', JSON.stringify(wishlist));
}

// Event Listeners
function setupEventListeners() {
    // Cart functionality
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCart) closeCart.addEventListener('click', closeCartSidebar);
    
    // Chat functionality
    const chatToggle = document.querySelector('.chat-toggle');
    const chatBox = document.querySelector('.chat-box');
    const minimizeChat = document.querySelector('.minimize-chat');
    const chatInput = document.querySelector('.chat-input input');
    const sendMessageBtn = document.querySelector('.chat-input button');
    
    if (chatToggle) chatToggle.addEventListener('click', toggleChat);
    if (minimizeChat) minimizeChat.addEventListener('click', minimizeChatBox);
    if (sendMessageBtn) sendMessageBtn.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    // Ask Amount functionality
    const askAmountBtn = document.getElementById('askAmountBtn');
    if (askAmountBtn) {
        askAmountBtn.addEventListener('click', openAmountModal);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    
    if (searchBtn) searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                performSearch(query, true);
            } else if (searchResults) {
                searchResults.classList.remove('active');
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch(searchInput.value);
        });
    }
    
    // Product actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId) || Math.floor(Math.random() * 20) + 1;
            addToCart(productId);
        }
        
        if (e.target.classList.contains('wishlist-btn')) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId) || Math.floor(Math.random() * 20) + 1;
            toggleWishlist(productId, e.target);
        }
        
        if (e.target.classList.contains('comment-btn')) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId) || Math.floor(Math.random() * 20) + 1;
            openComments(productId);
        }
    });
    
    // Scroll to top
    const scrollToTop = document.getElementById('scrollToTop');
    if (scrollToTop) {
        scrollToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTop.classList.add('visible');
            } else {
                scrollToTop.classList.remove('visible');
            }
        });
    }
}

// Cart Functions
function openCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) cartSidebar.classList.add('active');
}

function closeCartSidebar() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) cartSidebar.classList.remove('active');
}

function addToCart(productId) {
    const product = nigerianProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCartToStorage();
        }
    }
}

function updateCartUI() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const cartCountBadge = document.querySelector('.cart-count');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    cartCount = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartCount += item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₦${item.price.toLocaleString()}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    if (cartTotal) cartTotal.textContent = `₦${total.toLocaleString()}`;
    if (cartCountBadge) cartCountBadge.textContent = cartCount;
}

function saveCartToStorage() {
    localStorage.setItem('chetachiCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('chetachiCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Chat Functions
function toggleChat() {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) chatBox.classList.toggle('active');
}

function minimizeChatBox() {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) chatBox.classList.remove('active');
}

function sendMessage() {
    const chatInput = document.querySelector('.chat-input input');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (message) {
        addMessageToChat(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const responses = [
                'Thank you for your message! Our team will get back to you soon.',
                'How can I help you with your shopping today?',
                'Feel free to ask about our products or services!',
                'Is there anything specific you\'re looking for?'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessageToChat(randomResponse, 'bot');
        }, 1000);
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enhanced Search Function with Mobile-Friendly UI
function performSearch(query, showResults = false) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (!query || query.trim().length < 2) {
        searchResults.classList.remove('active');
        return;
    }
    
    const searchTerm = query.toLowerCase().trim();
    const filteredProducts = nigerianProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    // Group results by category for better organization
    const groupedResults = {};
    filteredProducts.forEach(product => {
        if (!groupedResults[product.category]) {
            groupedResults[product.category] = [];
        }
        groupedResults[product.category].push(product);
    });
    
    if (Object.keys(groupedResults).length > 0) {
        displaySearchResults(groupedResults, query, filteredProducts.length);
        if (!showResults) {
            showToast(`Found ${filteredProducts.length} products matching "${query}"`);
        }
    } else {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No products found for "${query}"</p>
                <small>Try searching for rice, beans, garri, paracetamol, etc.</small>
            </div>
        `;
        searchResults.classList.add('active');
        if (!showResults) {
            showToast(`No products found for "${query}"`);
        }
    }
}

function displaySearchResults(groupedResults, query, totalResults) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    let resultsHTML = '';
    let resultCount = 0;
    const maxResultsPerCategory = 3;
    const maxTotalResults = 8;
    
    // Generate HTML for each category
    Object.keys(groupedResults).forEach(category => {
        if (resultCount >= maxTotalResults) return;
        
        const categoryProducts = groupedResults[category].slice(0, maxResultsPerCategory);
        resultCount += categoryProducts.length;
        
        resultsHTML += `
            <div class="search-category-section">
                <div class="search-category-header">
                    <span class="category-icon">${getCategoryIcon(category)}</span>
                    <span class="category-name">${category}</span>
                    <span class="category-count">${groupedResults[category].length}</span>
                </div>
                <div class="search-category-items">
                    ${categoryProducts.map(product => `
                        <div class="search-result-item mobile-friendly" onclick="addToCart(${product.id})">
                            <div class="search-result-info">
                                <h4>${highlightSearchTerm(product.name, query)}</h4>
                                <p class="search-result-price">₦${product.price.toLocaleString()}</p>
                                <span class="product-unit">${getUnitFromName(product.name)}</span>
                            </div>
                            <button class="quick-add-btn" title="Add to cart">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    searchResults.innerHTML = `
        <div class="search-results-header">
            <span><i class="fas fa-shopping-basket"></i> Chetachi Products</span>
            <small>${totalResults} results</small>
        </div>
        <div class="search-results-content">
            ${resultsHTML}
        </div>
        <div class="search-all-results">
            <a href="products.html?q=${encodeURIComponent(query)}" class="view-all-link">
                <i class="fas fa-th"></i>
                View all ${totalResults} results
            </a>
        </div>
        <div class="search-suggestions">
            <small>Popular searches: Rice, Beans, Garri, Paracetamol, Indomie</small>
        </div>
    `;
    
    searchResults.classList.add('active');
}

// Helper Functions for Enhanced Search
function getCategoryIcon(category) {
    const icons = {
        'Grains & Legumes': '🌾',
        'Flours & Starches': '🥘',
        'Oils & Fats': '🫒',
        'Fresh Produce': '🥬',
        'Soups & Spices': '🧄',
        'Beverages & Breakfast': '☕',
        'Noodles & Snacks': '🍜',
        'Household Essentials': '🧼',
        'Pharmacy Medicines': '💊'
    };
    return icons[category] || '📦';
}

function highlightSearchTerm(text, searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function getUnitFromName(productName) {
    const units = {
        'kg': 'kg',
        '50kg': '50kg',
        '10kg': '10kg',
        '5kg': '5kg',
        '1kg': '1kg',
        '2kg': '2kg',
        'L': 'L',
        '4L': '4L',
        '25L': '25L',
        '1L': '1L',
        'Painter': 'Painter',
        'Bag': 'Bag',
        'Carton': 'Carton',
        'Pack': 'Pack',
        'Unit': 'Unit',
        'Bunch': 'Bunch',
        'Rubber': 'Rubber',
        'Tin': 'Tin',
        'Bottle': 'Bottle',
        'Sachet': 'Sachet',
        'Tablet': 'Tablet',
        'Capsule': 'Capsule'
    };
    
    for (const [unit, display] of Object.entries(units)) {
        if (productName.toLowerCase().includes(unit.toLowerCase())) {
            return display;
        }
    }
    return '';
}

// Mobile Search Enhancement
function initializeMobileSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    // Add mobile-specific touch events
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value;
        
        // Debounce search for better performance on mobile
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
    
    // Add voice search support for mobile - check if already exists
    const existingVoiceBtn = searchInput.parentNode.querySelector('.voice-search-btn');
    if (!existingVoiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const voiceSearchBtn = document.createElement('button');
        voiceSearchBtn.className = 'voice-search-btn';
        voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceSearchBtn.title = 'Voice search';
        voiceSearchBtn.type = 'button';
        
        // Insert after search input but before search button
        const searchBtn = searchInput.parentNode.querySelector('#searchBtn');
        if (searchBtn) {
            searchInput.parentNode.insertBefore(voiceSearchBtn, searchBtn);
        } else {
            searchInput.parentNode.appendChild(voiceSearchBtn);
        }
        
        voiceSearchBtn.addEventListener('click', startVoiceSearch);
    }
}

function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        showToast('Voice search not supported on your device');
        return;
    }
    
    // Stop any existing recognition
    if (window.currentRecognition) {
        window.currentRecognition.stop();
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = function() {
        showToast('🎤 Listening... Speak now');
        // Update voice button to show it's recording
        const voiceBtn = document.querySelector('.voice-search-btn');
        if (voiceBtn) {
            voiceBtn.style.background = '#ff4757';
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        }
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = transcript;
            performSearch(transcript);
        }
    };
    
    recognition.onerror = function(event) {
        showToast('Voice search error: ' + event.error);
        // Reset voice button
        const voiceBtn = document.querySelector('.voice-search-btn');
        if (voiceBtn) {
            voiceBtn.style.background = '';
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    };
    
    recognition.onend = function() {
        // Reset voice button
        const voiceBtn = document.querySelector('.voice-search-btn');
        if (voiceBtn) {
            voiceBtn.style.background = '';
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
        window.currentRecognition = null;
    };
    
    window.currentRecognition = recognition;
    recognition.start();
}

// Utility Functions
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #0d3b2e;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function toggleWishlist(productId, button) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.style.color = '#667eea';
    } else {
        wishlist.push(productId);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.style.color = '#ff4757';
    }
}

function openComments(productId) {
    showToast(`Comments feature coming soon for product ${productId}`);
}

// Loading Overlay
function setupLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) return;
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.visibility = 'hidden';
        }, 500);
    });
}

// Ask Amount Modal
function openAmountModal() {
    const modal = document.createElement('div');
    modal.className = 'amount-modal';
    modal.innerHTML = `
        <div class="amount-modal-content">
            <div class="amount-modal-header">
                <h3>Ask About Product Amount</h3>
                <button class="close-modal" onclick="closeAmountModal()">&times;</button>
            </div>
            <div class="amount-modal-body">
                <p>Enter product name to check available quantity and pricing:</p>
                <div class="amount-input-group">
                    <input type="text" id="amountProductInput" placeholder="Enter product name...">
                    <button onclick="checkProductAmount()">Check Amount</button>
                </div>
                <div id="amountResult" class="amount-result"></div>
            </div>
            <div class="amount-modal-footer">
                <button class="message-chetachi-btn" onclick="messageChetachi()">
                    <i class="fas fa-comments"></i>
                    Message Chetachi Directly
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);
}

function closeAmountModal() {
    const modal = document.querySelector('.amount-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => document.body.removeChild(modal), 300);
    }
}

function checkProductAmount() {
    const input = document.getElementById('amountProductInput');
    const result = document.getElementById('amountResult');
    
    if (!input || !result) return;
    
    const productName = input.value.trim().toLowerCase();
    const product = nigerianProducts.find(p => 
        p.name.toLowerCase().includes(productName) || 
        p.category.toLowerCase().includes(productName)
    );
    
    if (product) {
        result.innerHTML = `
            <div class="product-found">
                <h4>${product.name}</h4>
                <div class="product-details">
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Price:</strong> ₦${product.price.toLocaleString()}</p>
                    <p><strong>Description:</strong> ${product.description}</p>
                    <p><strong>Status:</strong> <span class="in-stock">In Stock</span></p>
                </div>
                <button class="add-to-cart-from-modal" onclick="addToCart(${product.id}); closeAmountModal();">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
    } else {
        result.innerHTML = `
            <div class="product-not-found">
                <i class="fas fa-exclamation-circle"></i>
                <p>Product "${productName}" not found in our inventory.</p>
                <p>Please check the spelling or try a different product name.</p>
            </div>
        `;
    }
}

function messageChetachi() {
    closeAmountModal();
    
    // Redirect to messaging system (this would be backend integration)
    const messageModal = document.createElement('div');
    messageModal.className = 'message-modal';
    messageModal.innerHTML = `
        <div class="message-modal-content">
            <div class="message-modal-header">
                <h3>Message Chetachi</h3>
                <button class="close-modal" onclick="closeMessageModal()">&times;</button>
            </div>
            <div class="message-modal-body">
                <p>Send a message to Chetachi Super Market:</p>
                <textarea id="chetachiMessage" placeholder="Type your message here..." rows="4"></textarea>
                <div class="message-actions">
                    <button onclick="sendToChetachi()">Send Message</button>
                    <button onclick="closeMessageModal()">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(messageModal);
    setTimeout(() => messageModal.classList.add('active'), 100);
}

function closeMessageModal() {
    const modal = document.querySelector('.message-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => document.body.removeChild(modal), 300);
    }
}

function sendToChetachi() {
    const messageText = document.getElementById('chetachiMessage');
    if (messageText && messageText.value.trim()) {
        // This would connect to backend system
        showToast('Message sent to Chetachi! We will respond shortly.');
        console.log('Message to Chetachi:', messageText.value);
        closeMessageModal();
        
        // Store message for backend integration
        const messages = JSON.parse(localStorage.getItem('chetachiMessages') || '[]');
        messages.push({
            text: messageText.value,
            timestamp: new Date().toISOString(),
            status: 'sent'
        });
        localStorage.setItem('chetachiMessages', JSON.stringify(messages));
    }
}

// Close search results when clicking outside
document.addEventListener('click', function(e) {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchResults && searchBtn) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !searchBtn.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    }
});

console.log('Chetachi Super Market - Unified Website Loaded Successfully!');
