const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/categoryModel');
const connectDB = require('../config/db');

dotenv.config({ path: '../.env' });
connectDB();

const categories = [
    { name: 'Technical Workshop' },
    { name: 'Sports Tournament' },
    { name: 'Cultural Fest' },
    { name: 'NSS/Social Work' },
    { name: 'Hackathon' },
    { name: 'Research Publication' },
    { name: 'Internship' },
    { name: 'Online Course' },
    { name: 'Volunteering' },
    { name: 'College Club Event' },
    { name: 'Other' },
];

const importData = async () => {
    try {
        await Category.deleteMany();
        await Category.insertMany(categories);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();