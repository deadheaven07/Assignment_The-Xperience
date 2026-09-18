import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { store } from '../models/store';

const JWT_SECRET = process.env.JWT_SECRET || 'plancraft_super_secret_jwt_key_2025_xperience';

export class AuthController {
  public static login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = store.getUser();

    // Allow demo login or matching email
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: email || user.email,
        role: user.role,
      },
    });
  }

  public static demoLogin(req: Request, res: Response) {
    const user = store.getUser();
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }

  public static me(req: Request, res: Response) {
    const user = store.getUser();
    return res.json({
      success: true,
      user,
    });
  }
}
