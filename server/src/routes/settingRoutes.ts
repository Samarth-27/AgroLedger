import { Router } from 'express';
import { settingController } from '../controllers/SettingController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', settingController.getAllSettings);
router.put('/:key', settingController.updateSetting);

export const settingRoutes = router;
