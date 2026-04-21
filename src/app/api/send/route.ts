import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { nom, email, whatsapp, pays, ville } = await request.json();

    const data = await resend.emails.send({
      from: 'TechStraTix <onboarding@resend.dev>', 
      to: ['yannjason7@gmail.com'], // <--- REMPLACE PAR TON VRAI MAIL ICI
      subject: `🚀 Nouveau Lead : ${nom}`,
      html: `
        <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #003366;">Nouvelle inscription sur TechStraTix</h2>
          <p>Un nouvel utilisateur vient de rejoindre la liste d'attente :</p>
          <hr />
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>WhatsApp :</strong> ${whatsapp}</p>
          <p><strong>Email :</strong> ${email || 'Non renseigné'}</p>
          <p><strong>Localisation :</strong> ${ville}, ${pays}</p>
          <hr />
          <p style="font-size: 12px; color: #888;">Envoyé automatiquement depuis la Landing Page TechStraTix.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}