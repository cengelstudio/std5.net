import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../config/auth';

const contactsFilePath = path.join(process.cwd(), 'data', 'contacts.json');

// Middleware to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await request.json();
    
    const data = await fs.readFile(contactsFilePath, 'utf8');
    const contacts = JSON.parse(data);

    const contactIndex = contacts.findIndex((contact: { id: string }) => contact.id === id);
    if (contactIndex === -1) {
      return NextResponse.json({ message: 'İletişim formu bulunamadı' }, { status: 404 });
    }

    contacts[contactIndex].status = status;
    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));

    return NextResponse.json(contacts[contactIndex]);
  } catch (error) {
    console.error('Contact status update error:', error);
    return NextResponse.json({ message: 'Durum güncelleme hatası' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await fs.readFile(contactsFilePath, 'utf8');
    const contacts = JSON.parse(data);

    const filteredContacts = contacts.filter((contact: { id: string }) => contact.id !== id);
    if (filteredContacts.length === contacts.length) {
      return NextResponse.json({ message: 'İletişim formu bulunamadı' }, { status: 404 });
    }

    await fs.writeFile(contactsFilePath, JSON.stringify(filteredContacts, null, 2));
    return NextResponse.json({ message: 'İletişim formu silindi' });
  } catch (error) {
    console.error('Contact deletion error:', error);
    return NextResponse.json({ message: 'Silme hatası' }, { status: 500 });
  }
} 