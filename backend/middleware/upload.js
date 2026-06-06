const multer = require('multer')
const path = require('path')

// En mémoire (pas sauvegardé sur disque)
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const typesAcceptes = ['image/jpeg', 'image/png', 'image/webp']
  if (typesAcceptes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format non supporté. Utilisez JPG, PNG ou WebP.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000 * 1024 }
})

module.exports = upload