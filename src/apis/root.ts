import type {Request, Response} from 'express';
import {Router} from 'express';

const onHome = async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') {
    res.send(`${req.t('IT_WORKS')}`);

    return;
  }

  res.redirect('https://dooboolab.com/docs/works/projects/dooboo');
};

const router = Router();
router.get('/', onHome);

export default router;
