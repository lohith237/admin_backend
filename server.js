require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { authRoutes, userRoutes, CategoryRoutes,subCategoryRoutes,BannerRoutes,BrandsRoutes,ProductsRoutes,DisplayCategoryRoutes,StoreRoutes,InventoryRoutes } = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin-project',
      version: '1.0.0',
      description: 'API documentation for Admin-project backend',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/sub-category',subCategoryRoutes);
app.use('/api/banners',BannerRoutes);
app.use('/api/brands',BrandsRoutes);
app.use('/api/products',ProductsRoutes);
app.use('/api/display-categories', DisplayCategoryRoutes);
app.use('/api/store', StoreRoutes);
app.use('/api/inventroy', InventoryRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to Admin Backend!');
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
