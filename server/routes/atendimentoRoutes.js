const express = require('express')
const router = express.useRouter()
const atendimentoController = require('../controllers/atendimentoController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/', atendimentoController.listar)
router.get('/:id', atendimentoController.buscarPorId)
router.get('/consultas/:id/atendimento', atendimentoController.buscarPorConsulta)
router.post('/', atendimentoController.criar)
router.put('/:id', atendimentoController.atualizar)