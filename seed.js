const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
const bcrypt = require('bcryptjs');

const seedItems = [
    { title: "iPhone 15 Pro Max", desc: "Titanium blue, 256GB. Perfect condition.", category: "Electronics", condition: "Used", expected: "MacBook Air M2", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop" },
    { title: "Sony WH-1000XM5", desc: "Noise cancelling headphones in black.", category: "Electronics", condition: "Used", expected: "Nintendo Switch", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop" },
    { title: "Vintage Leather Jacket", desc: "Authentic brown leather, size L.", category: "Fashion", condition: "Used", expected: "Designer Watch", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop" },
    { title: "Think and Grow Rich", desc: "Hardcover edition, read once.", category: "Books", condition: "Used", expected: "Business Books", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
    { title: "Mid-Century Modern Chair", desc: "Beautiful wooden frame chair.", category: "Furniture", condition: "Used", expected: "Coffee Table", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop" },
    { title: "PlayStation 5 Console", desc: "Disc edition with 1 controller.", category: "Gaming", condition: "Used", expected: "Gaming PC parts", img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800&auto=format&fit=crop" },
    { title: "Samsung Galaxy S24 Ultra", desc: "Brand new in box, 512GB.", category: "Electronics", condition: "New", expected: "High-end Camera", img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop" },
    { title: "MacBook Pro 16-inch", desc: "M1 Max, 32GB RAM. Beast for editing.", category: "Electronics", condition: "Used", expected: "Electric Bike", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop" },
    { title: "Nike Air Jordan 1", desc: "Size 10, never worn. Original box.", category: "Fashion", condition: "New", expected: "Yeezy Boost 350", img: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=800&auto=format&fit=crop" },
    { title: "The Hobbit - First Edition", desc: "Rare collectible copy.", category: "Books", condition: "Used", expected: "Lord of the Rings Set", img: "https://images.unsplash.com/photo-1629196914538-4eabc8f40751?q=80&w=800&auto=format&fit=crop" },
    { title: "Ergonomic Office Desk", desc: "Standing desk, motorized.", category: "Furniture", condition: "Used", expected: "Herman Miller Chair", img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop" },
    { title: "Xbox Series X", desc: "Includes GamePass and 2 games.", category: "Gaming", condition: "Used", expected: "Steam Deck", img: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop" },
    { title: "iPad Air 5th Gen", desc: "Blue finish, 64GB with Apple Pencil.", category: "Electronics", condition: "Used", expected: "Android Tablet", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop" },
    { title: "Gucci Crossbody Bag", desc: "Authentic designer bag.", category: "Fashion", condition: "Used", expected: "Prada Backpack", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop" },
    { title: "Dune by Frank Herbert", desc: "Paperback. Great sci-fi read.", category: "Books", condition: "Used", expected: "Foundation Series", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" },
    { title: "Minimalist Bookshelf", desc: "Wood and metal frame, 5 tiers.", category: "Furniture", condition: "Used", expected: "Storage Cabinet", img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=800&auto=format&fit=crop" },
    { title: "Nintendo Switch OLED", desc: "White joy-cons. Excellent condition.", category: "Gaming", condition: "Used", expected: "VR Headset", img: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=800&auto=format&fit=crop" },
    { title: "Canon EOS R5", desc: "Professional mirrorless camera body.", category: "Electronics", condition: "Used", expected: "Sony A7S III", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" },
    { title: "Ray-Ban Aviators", desc: "Classic gold frame, green lenses.", category: "Fashion", condition: "Used", expected: "Designer Wallet", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop" },
    { title: "Oculus Quest 2", desc: "128GB VR headset.", category: "Gaming", condition: "Used", expected: "Drone", img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop" }
];

const seedDatabase = async () => {
    try {
        const adminEmail = 'admin@swapkart.com';
        let adminUser = await User.findOne({ email: adminEmail });
        
        if (!adminUser) {
            console.log('🤖 Creating Admin User for Seeding...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('secret123', salt);
            adminUser = new User({
                name: 'SwapKart System',
                email: adminEmail,
                password: hashedPassword,
                avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop'
            });
            await adminUser.save();
        }

        const count = await Item.countDocuments();
        if (count < 20) {
            console.log('🌱 Database looks empty. Seeding 20 items...');
            await Item.deleteMany({}); // clean before seeding just in case
            
            const insertPayload = seedItems.map(item => ({
                title: item.title,
                description: item.desc,
                category: item.category,
                condition: item.condition,
                expectedSwap: item.expected,
                image: item.img,
                owner: adminUser._id
            }));
            
            await Item.insertMany(insertPayload);
            console.log('✅ 20 Sample Items Seeded Successfully!');
        } else {
            console.log('✅ Database already populated with items.');
        }
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    }
};

module.exports = seedDatabase;
