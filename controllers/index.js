const otpControllers = require('./otpController');
const userController =require('./userController')
const loginUser=require("./LoginUser")
const Category=require("./CategoryController")
const SubCategory=require("./SubcategoryController")
const BannerController=require("./bannerController")
const BrandsController=require("./BrandsController")
const ProductsController=require("./ProductsController")
const DisplayCategoryController=require("./DisplaycategoryController")
const StoreController=require("./StoreController")
const InentoryController=require("./InentoryController")
module.exports = {
    otpControllers, 
    userController,
    loginUser,
    Category,
    SubCategory,
    BannerController,
    BrandsController,
    ProductsController,
    DisplayCategoryController,
    StoreController,
    InentoryController
  };