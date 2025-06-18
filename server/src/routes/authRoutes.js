import express from 'express';

const router = express.Router();

router.post('/register', async(req, res) => {
    res.send('Regsiter endpoint');
})

router.post('/login', async(req, res) => {
    res.send('Login endpoint');
})

export default router;