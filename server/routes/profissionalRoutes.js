const express = require('express')
const router = express.Router()
const profissionalController = require('../controllers/profissionalController')
const authMiddleware = require('../middlewares/authMiddleware')
console.log('Controller carregado:', profissionalController)

console.log('Rotas de profissionais carregadas')

router.use(authMiddleware)

router.get('/', profissionalController.listar)
router.get('/medicos', profissionalController.listarMedicos)
router.get('/:id', profissionalController.buscarPorId)
router.post('/', profissionalController.criar)
router.put('/:id', profissionalController.atualizar)
router.delete('/:id', profissionalController.deletar)

module.exports = router
