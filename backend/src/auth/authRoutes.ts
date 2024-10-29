// // src/auth/authRoutes.ts

// import express from 'express';
// import { signUp, signIn, signOut } from './authController';

// const router = express.Router();

// router.post('/signup', async (req, res) => {
//     let data = await signUp(req, res);
//     res.json(data);
// });   // Kayıt rotası
// router.post('/signin', async (req, res) => {
//     let data = await signIn(req, res);
//     res.json(data);
// });   // Giriş rotası
// router.post('/signout', async (req, res) => {
//     let data = await signOut(req, res);
//     res.json(data);
// }); // Çıkış rotası

// export default router;
