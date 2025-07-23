import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const contactsFilePath = path.join(process.cwd(), 'data', 'contacts.json');

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json();
    
    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
      return NextResponse.json(
        { message: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // Add timestamp and ID
    const newContact = {
      id: crypto.randomUUID(),
      ...contactData,
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    // Read existing contacts
    let contacts = [];
    try {
      const data = await fs.readFile(contactsFilePath, 'utf8');
      contacts = JSON.parse(data);
    } catch {
      // File doesn't exist or is empty, start with empty array
      contacts = [];
    }

    // Add new contact
    contacts.push(newContact);

    // Write back to file
    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));

    return NextResponse.json(
      { message: 'İletişim formu başarıyla gönderildi', contact: newContact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await fs.readFile(contactsFilePath, 'utf8');
    const contacts = JSON.parse(data);
    return NextResponse.json(contacts);
  } catch {
    // If file doesn't exist, return empty array
    return NextResponse.json([]);
  }
} 