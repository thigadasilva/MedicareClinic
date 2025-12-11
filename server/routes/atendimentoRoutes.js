const express = require('express')
const router = express.Router()
const atendimentoController = require('../controllers/atendimentoController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/', atendimentoController.listar)
router.get('/consultas/:id/atendimento', atendimentoController.buscarPorConsulta)
router.get('/:id', atendimentoController.buscarPorId)
router.post('/', atendimentoController.criar)
router.put('/:id', atendimentoController.atualizar)
router.delete('/:id', atendimentoController.deletar)

module.exports = router