import { NextRequest, NextResponse } from 'next/server';
import { adminCredentials, JWT_SECRET } from '../../../../config/auth';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === adminCredentials.username && password === adminCredentials.password) {
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return NextResponse.json({ token, success: true });
    } else {
      return NextResponse.json(
        { message: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
