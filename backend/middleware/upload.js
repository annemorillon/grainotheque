const multer = require('multer')
const path = require('path')

// On définit où et comment stocker les fichiers
const storage = multer.diskStorage({

  // Dossier de destination
  destination: (req, file, cb) => {
    cb(null, 'uploads/')   // null = pas d'erreur, 'uploads/' = le dossier
  },

  // Nom du fichier sur le disque
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname)  // ex: ".jpg"
    const nomUnique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, nomUnique + extension)  // ex: "1717432918273-847392841.jpg"
  }

})

// Filtre : on accepte uniquement les images
const fileFilter = (req, file, cb) => {
  const typesAcceptes = ['image/jpeg', 'image/png', 'image/webp']
  if (typesAcceptes.includes(file.mimetype)) {
    cb(null, true)   // accepté
  } else {
    cb(new Error('Format non supporté. Utilisez JPG, PNG ou WebP.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5 Mo max
})

module.exports = upload;