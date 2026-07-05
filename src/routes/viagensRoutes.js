const autenticarToken = require ('../middlewares/authMiddleware.js')
const {criarViagemController, listarViagensController, editarViagemController, deletarViagemController} = require ('../controllers/viagensController.js')

const router = require ('express').Router()
router.post('/', autenticarToken, criarViagemController)
router.get('/', autenticarToken, listarViagensController)
router.put('/:id_viagem', autenticarToken, editarViagemController)
router.delete('/:id_viagem', autenticarToken, deletarViagemController)

module.exports = router
