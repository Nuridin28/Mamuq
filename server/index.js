require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');

const { sequelize, User, Product } = require('./models');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');
const { setOnlineUsersMap } = require('./routes/analytics');

const app = express();
const server = http.createServer(app);

// ------- Middleware -------
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173'], credentials: true }));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// ------- Routes -------
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ------- WebSocket for online users -------
const onlineUsers = new Map(); // key: ws instance, value: { userId, sessionId, connectedAt }
setOnlineUsersMap(onlineUsers);

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  const sessionId = uuidv4();
  const connectionInfo = { userId: null, sessionId, connectedAt: new Date() };
  onlineUsers.set(ws, connectionInfo);

  // Broadcast updated count
  broadcastOnlineCount();

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'identify') {
        connectionInfo.userId = message.userId || null;
        connectionInfo.sessionId = message.sessionId || sessionId;
        onlineUsers.set(ws, connectionInfo);
        broadcastOnlineCount();
      }

      if (message.type === 'get_online_count') {
        ws.send(JSON.stringify({
          type: 'online_count',
          count: onlineUsers.size,
          users: getOnlineUsersList(),
        }));
      }
    } catch (err) {
      // Ignore malformed messages
    }
  });

  ws.on('close', () => {
    onlineUsers.delete(ws);
    broadcastOnlineCount();
  });

  ws.on('error', () => {
    onlineUsers.delete(ws);
    broadcastOnlineCount();
  });

  // Send initial count
  ws.send(JSON.stringify({
    type: 'online_count',
    count: onlineUsers.size,
    sessionId,
  }));
});

function broadcastOnlineCount() {
  const message = JSON.stringify({
    type: 'online_count',
    count: onlineUsers.size,
    users: getOnlineUsersList(),
  });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

function getOnlineUsersList() {
  const users = [];
  onlineUsers.forEach((info) => {
    users.push({
      userId: info.userId,
      sessionId: info.sessionId,
      connectedAt: info.connectedAt,
    });
  });
  return users;
}

// ------- Seed Admin -------
async function seedAdmin() {
  const existing = await User.findOne({ where: { email: 'admin@mamuq.com' } });
  if (existing) return;

  await User.create({
    email: 'admin@mamuq.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'Mamuq',
    role: 'admin',
    language: 'en',
  });
  console.log('Admin account seeded.');
}

// ------- Seed Data -------
async function seedProducts() {
  const count = await Product.count();
  if (count > 0) return;

  console.log('Seeding sample products...');

  const sampleProducts = [
    {
      nameEn: 'Adaptive Magnetic-Close Polo Shirt',
      nameRu: 'Адаптивная рубашка-поло с магнитной застежкой',
      nameKz: 'Магнитті тұйіндемесі бар адаптивті поло жейде',
      descriptionEn: 'Easy-wear polo with magnetic closures replacing traditional buttons. Designed for individuals with limited hand dexterity.',
      descriptionRu: 'Легко надеваемая рубашка-поло с магнитными застежками вместо обычных пуговиц. Разработана для людей с ограниченной моторикой рук.',
      descriptionKz: 'Дәстүрлі түймелерді ауыстыратын магнитті бекіткіштері бар оңай киюге болатын поло. Қол қимылы шектеулі адамдарға арналған.',
      category: 'tops',
      basePrice: 45.99,
      imageUrl: '/images/magnetic-polo.jpg',
      fastenerTypes: ['magnets'],
      neckWidth: 'standard',
      sleeveType: 'standard',
      hasSoftSeams: true,
      suitableForWheelchair: false,
      fabricType: 'organic cotton',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
    },
    {
      nameEn: 'Wheelchair-Friendly Side-Zip Pants',
      nameRu: 'Брюки с боковой молнией для инвалидной коляски',
      nameKz: 'Мүгедектер арбасына ыңғайлы бүйір жарғағы бар шалбар',
      descriptionEn: 'Full side-zip pants for easy dressing while seated. Features soft inner seams and elastic waistband.',
      descriptionRu: 'Брюки с полной боковой молнией для удобного одевания в сидячем положении. Мягкие внутренние швы и эластичный пояс.',
      descriptionKz: 'Отырып киюге ыңғайлы толық бүйірлік жарғағы бар шалбар. Жұмсақ ішкі тігістері мен серпімді белдігі бар.',
      category: 'bottoms',
      basePrice: 59.99,
      imageUrl: '/images/side-zip-pants.jpg',
      fastenerTypes: ['side-zipper'],
      neckWidth: 'standard',
      sleeveType: null,
      hasSoftSeams: true,
      suitableForWheelchair: true,
      fabricType: 'stretch cotton blend',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
    },
    {
      nameEn: 'Velcro-Front Adaptive Jacket',
      nameRu: 'Адаптивная куртка с застежкой-липучкой',
      nameKz: 'Жабысқақ алдыңғы адаптивті куртка',
      descriptionEn: 'Warm adaptive jacket with Velcro front closure. Raglan sleeves for easy arm movement. Suitable for wheelchair users.',
      descriptionRu: 'Теплая адаптивная куртка с застежкой-липучкой спереди. Рукава-реглан для свободного движения рук. Подходит для пользователей инвалидных колясок.',
      descriptionKz: 'Алдыңғы жабысқақ бекіткіші бар жылы адаптивті куртка. Қолды еркін қозғалтуға арналған реглан жеңдері. Мүгедектер арбасын пайдаланушыларға жарамды.',
      category: 'outerwear',
      basePrice: 89.99,
      imageUrl: '/images/velcro-jacket.jpg',
      fastenerTypes: ['velcro'],
      neckWidth: 'wide',
      sleeveType: 'raglan',
      hasSoftSeams: true,
      suitableForWheelchair: true,
      fabricType: 'fleece',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
    },
    {
      nameEn: 'Sensory-Friendly Bamboo T-Shirt',
      nameRu: 'Сенсорная бамбуковая футболка',
      nameKz: 'Сенсорлық бамбук футболка',
      descriptionEn: 'Ultra-soft bamboo fabric t-shirt with flat seams and tagless design. Ideal for those with sensory processing sensitivities.',
      descriptionRu: 'Сверхмягкая бамбуковая футболка с плоскими швами и без бирок. Идеальна для людей с сенсорной чувствительностью.',
      descriptionKz: 'Жалпақ тігістері мен белгісіз дизайны бар өте жұмсақ бамбук матасынан жасалған футболка. Сенсорлық сезімталдығы бар адамдарға өте қолайлы.',
      category: 'tops',
      basePrice: 34.99,
      imageUrl: '/images/bamboo-tshirt.jpg',
      fastenerTypes: [],
      neckWidth: 'wide',
      sleeveType: 'standard',
      hasSoftSeams: true,
      suitableForWheelchair: false,
      fabricType: 'bamboo',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
      inStock: true,
    },
    {
      nameEn: 'Easy-On Compression Socks',
      nameRu: 'Легко надеваемые компрессионные носки',
      nameKz: 'Оңай киюге болатын компрессиялық шұлықтар',
      descriptionEn: 'Compression socks with wide opening and assistive loop for easy donning. Graduated compression for circulation support.',
      descriptionRu: 'Компрессионные носки с широким раструбом и петлей для легкого надевания. Градуированная компрессия для поддержки кровообращения.',
      descriptionKz: 'Оңай киюге арналған кең ашылуы мен көмекші ілгегі бар компрессиялық шұлықтар. Қан айналымын қолдау үшін градуирленген компрессия.',
      category: 'accessories',
      basePrice: 24.99,
      imageUrl: '/images/compression-socks.jpg',
      fastenerTypes: [],
      neckWidth: 'standard',
      sleeveType: null,
      hasSoftSeams: true,
      suitableForWheelchair: true,
      fabricType: 'nylon blend',
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: true,
    },
    {
      nameEn: 'Front-Zip Adaptive Dress',
      nameRu: 'Адаптивное платье с передней молнией',
      nameKz: 'Алдыңғы жарғағы бар адаптивті көйлек',
      descriptionEn: 'Elegant dress with full front zipper for easy dressing. Features wide neck opening and soft seams throughout.',
      descriptionRu: 'Элегантное платье с полной передней молнией для удобного одевания. Широкая горловина и мягкие швы по всему изделию.',
      descriptionKz: 'Оңай киюге арналған толық алдыңғы жарғағы бар элегантты көйлек. Кең мойын ашылуы мен бүкіл бұйымдағы жұмсақ тігістер.',
      category: 'tops',
      basePrice: 69.99,
      imageUrl: '/images/front-zip-dress.jpg',
      fastenerTypes: ['front-zipper'],
      neckWidth: 'wide',
      sleeveType: 'standard',
      hasSoftSeams: true,
      suitableForWheelchair: true,
      fabricType: 'jersey knit',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
    },
    {
      nameEn: 'Adaptive Magnetic Underwear Set',
      nameRu: 'Адаптивный комплект нижнего белья с магнитами',
      nameKz: 'Магнитті адаптивті іш киім жиынтығы',
      descriptionEn: 'Soft cotton underwear with magnetic side closures. Designed for individuals who need assistance dressing. Flat seams prevent irritation.',
      descriptionRu: 'Мягкое хлопковое нижнее белье с магнитными боковыми застежками. Для людей, которым нужна помощь при одевании. Плоские швы предотвращают раздражение.',
      descriptionKz: 'Магнитті бүйір бекіткіштері бар жұмсақ мақта іш киім. Киюге көмек қажет адамдарға арналған. Жалпақ тігістер тітіркенуді болдырмайды.',
      category: 'underwear',
      basePrice: 29.99,
      imageUrl: '/images/magnetic-underwear.jpg',
      fastenerTypes: ['magnets'],
      neckWidth: 'standard',
      sleeveType: null,
      hasSoftSeams: true,
      suitableForWheelchair: true,
      fabricType: 'organic cotton',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
    },
    {
      nameEn: 'Wide-Neck Raglan Sweater',
      nameRu: 'Свитер-реглан с широкой горловиной',
      nameKz: 'Кең мойынды реглан свитер',
      descriptionEn: 'Cozy sweater with extra-wide neck for easy head passage. Raglan sleeves provide unrestricted arm movement. No irritating tags or seams.',
      descriptionRu: 'Уютный свитер с очень широкой горловиной для легкого надевания через голову. Рукава реглан обеспечивают свободу движения рук. Без раздражающих бирок и швов.',
      descriptionKz: 'Басты оңай өткізуге арналған өте кең мойыны бар жайлы свитер. Реглан жеңдері қолдың еркін қозғалуын қамтамасыз етеді. Тітіркендіргіш белгілер мен тігістер жоқ.',
      category: 'tops',
      basePrice: 54.99,
      imageUrl: '/images/raglan-sweater.jpg',
      fastenerTypes: [],
      neckWidth: 'extra-wide',
      sleeveType: 'raglan',
      hasSoftSeams: true,
      suitableForWheelchair: false,
      fabricType: 'merino wool blend',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
    },
    {
      nameEn: 'Seated-Fit Adaptive Shorts',
      nameRu: 'Адаптивные шорты для сидячего положения',
      nameKz: 'Отыруға бейімделген адаптивті шорттар',
      descriptionEn: 'Shorts specifically cut for seated position with higher back rise and lower front. Velcro side openings for easy changes.',
      descriptionRu: 'Шорты, специально скроенные для сидячего положения: высокая задняя часть и низкая передняя. Боковые застежки-липучки для легкой смены.',
      descriptionKz: 'Отыру позициясына арнайы пішілген шорттар: жоғары артқы және төмен алдыңғы бөлігі. Оңай ауыстыру үшін бүйірлік жабысқақ ашылулар.',
      category: 'bottoms',
      basePrice: 39.99,
      imageUrl: '/images/seated-shorts.jpg',
      fastenerTypes: ['velcro'],
      neckWidth: 'standard',
      sleeveType: null,
      hasSoftSeams: true,
      suitableForWheelchair: true,
      fabricType: 'cotton twill',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
    },
    {
      nameEn: 'Adaptive Rain Poncho',
      nameRu: 'Адаптивное дождевое пончо',
      nameKz: 'Адаптивті жаңбырлық пончо',
      descriptionEn: 'Waterproof poncho that covers wheelchair and user. Magnetic closures at sides, extra-wide head opening. Reflective strips for visibility.',
      descriptionRu: 'Водонепроницаемое пончо, покрывающее инвалидное кресло и пользователя. Магнитные застежки по бокам, очень широкое отверстие для головы. Светоотражающие полосы.',
      descriptionKz: 'Мүгедектер арбасы мен пайдаланушыны жабатын су өткізбейтін пончо. Бүйірлерінде магнитті бекіткіштер, өте кең бас ашылуы. Көрінуге арналған шағылыстырғыш жолақтар.',
      category: 'outerwear',
      basePrice: 49.99,
      imageUrl: '/images/rain-poncho.jpg',
      fastenerTypes: ['magnets'],
      neckWidth: 'extra-wide',
      sleeveType: null,
      hasSoftSeams: false,
      suitableForWheelchair: true,
      fabricType: 'waterproof nylon',
      sizes: ['One Size', 'Plus Size'],
      inStock: true,
    },
    {
      nameEn: 'Soft Seam Bra with Front Closure',
      nameRu: 'Бюстгальтер с мягкими швами и передней застежкой',
      nameKz: 'Жұмсақ тігісті алдыңғы бекіткіші бар бюстгальтер',
      descriptionEn: 'Comfort bra with front magnetic closure. Ultra-soft fabric with no underwire. Designed for those with limited reach behind the back.',
      descriptionRu: 'Комфортный бюстгальтер с передней магнитной застежкой. Сверхмягкая ткань без косточек. Разработан для людей с ограниченной подвижностью рук за спиной.',
      descriptionKz: 'Алдыңғы магнитті бекіткіші бар жайлы бюстгальтер. Сымсыз өте жұмсақ мата. Арқасына қолы жетпейтін адамдарға арналған.',
      category: 'underwear',
      basePrice: 35.99,
      imageUrl: '/images/front-close-bra.jpg',
      fastenerTypes: ['magnets'],
      neckWidth: 'standard',
      sleeveType: null,
      hasSoftSeams: true,
      suitableForWheelchair: true,
      fabricType: 'modal cotton',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
    },
    {
      nameEn: 'Adaptive Winter Gloves with Grip',
      nameRu: 'Адаптивные зимние перчатки с захватом',
      nameKz: 'Ұстағышы бар адаптивті қысқы қолғаптар',
      descriptionEn: 'Warm winter gloves with silicone grip pads. Easy pull-on design with wide opening. Compatible with wheelchair push rims.',
      descriptionRu: 'Теплые зимние перчатки с силиконовыми накладками для захвата. Легко надеваются благодаря широкому раструбу. Совместимы с обручами инвалидных колясок.',
      descriptionKz: 'Силикон ұстағыш төсемелері бар жылы қысқы қолғаптар. Кең ашылуы арқылы оңай киілетін дизайн. Мүгедектер арбасының итергіш сақиналарымен үйлесімді.',
      category: 'accessories',
      basePrice: 32.99,
      imageUrl: '/images/adaptive-gloves.jpg',
      fastenerTypes: ['velcro'],
      neckWidth: 'standard',
      sleeveType: null,
      hasSoftSeams: true,
      suitableForWheelchair: true,
      fabricType: 'thinsulate fleece',
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: true,
    },
  ];

  await Product.bulkCreate(sampleProducts);
  console.log(`Seeded ${sampleProducts.length} sample products.`);
}

// ------- Start Server -------
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    await seedAdmin();
    await seedProducts();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
