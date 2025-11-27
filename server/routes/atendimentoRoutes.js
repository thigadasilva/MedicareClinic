const express = require('express')
const router = express.useRouter()
const atendimentoController = require('../controllers/atendimentoController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/api/atendimentos', atendimentoController.listar)
router.get('/api/atendimentos/:id', atendimentoController.buscarPorId)
router.get('/api/consultas/:id/atendimento', atendimentoController.buscarPorConsulta)
router.post('/api/atendimentos', atendimentoController.criar)
router.put('/api/atendimentos/:id', atendimentoController.atualizar)