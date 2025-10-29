import express from 'express';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';

const router = express.Router();

// POST /login
// Body: { usr: string (email), pdw: string (password) }
router.post('/login', async (req, res) => {
  try {
    const { usr, pdw } = req.body || {};

    if (!usr || !pdw) {
      return res.status(400).json({ error: 'usr y pdw son obligatorios' });
    }

    const user = await User.findOne({
      where: { email: usr },
      include: [{ model: Role, as: 'rol', attributes: ['id_rol', 'nombre'] }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const ok = await user.validatePassword(pdw);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const payload = {
      sub: user.id_usuario,
      name: user.nombre,
      email: user.email,
      role: {
        id: user.rol?.id_rol ?? user.id_rol,
        name: user.rol?.nombre ?? undefined,
      },
    };

    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    const token = jwt.sign(payload, secret, { expiresIn });

    return res.json({
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        id_rol: user.id_rol,
        rol: user.rol ? { id_rol: user.rol.id_rol, nombre: user.rol.nombre } : undefined,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;