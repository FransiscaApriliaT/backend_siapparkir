require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const { sequelize } = require('./models');
const errorHandler  = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: "https://frontend-siapparkir.vercel.app", // Sesuaikan dengan port Vite Anda (biasanya 5173)
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/',      require('./routes/public.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/admin',   require('./routes/admin.routes'));
app.use('/petugas', require('./routes/petugas.routes'));

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'SiapParkir API' }));

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database terhubung');
    return sequelize.sync({ alter: false });
  })
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`🚀 API jalan di http://localhost:${PORT}`)))
  .catch(err => { console.error('❌ DB gagal:', err.message); process.exit(1); });
