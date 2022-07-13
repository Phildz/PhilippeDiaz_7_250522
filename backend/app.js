const express = require('express');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const publicationRoutes = require('./routes/publication');
const userRoutes = require('./routes/usercontrol');

const admin = require('./middleware/admin');
const auth = require('./middleware/auth');

require('dotenv').config({path: './config/.env'});
require('./config/db');

const cors = require('cors');
const multer = require('multer');


const app = express();

const corsOptions = {
  origin: true, // process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['Authorization', 'Content-Type'],  
  'methods': 'GET,PUT,POST,DELETE,OPTIONS'
  //'preflightContinue': false
}
app.use(cors(corsOptions));


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser());


// création middleware répondant aux req envoyées à /images
// et servant le dossier statique /images en utilisant express.static()
// chemin déterminé par la const path, utilisation méthode .join() avec
// dirnamme = nom dossier où on se trouve dans lequel on rajout images
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use(express.static('images'));

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif' : 'gif'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  /*filename: function (req, file, cb) {
    const extension = MIME_TYPES[file.mimetype];    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //Mentor
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension) //Mentor
  }*/
  filename: (req, file, callback) => {      
    //const name = file.originalname.split(' ').join('_');      
    const extension = MIME_TYPES[file.mimetype];      
    callback(null, file.fieldname + Date.now() + '.' + extension);
  }
});

const upload = multer({storage});
app.post("/api/upload", upload.single("image"), (req, res) => {
  try{
    return res.status(200).json(req.file)    
  }
  catch(err){
    console.log(err);
  }
})


// routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/publications', publicationRoutes);


module.exports = app;