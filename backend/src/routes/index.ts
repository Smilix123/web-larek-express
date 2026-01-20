import { Router } from 'express'
import orderRoutes from './order'
import productRoutes from './product'

const router = Router()

router.use('/product', productRoutes)
router.use('/order', orderRoutes)

export default router
