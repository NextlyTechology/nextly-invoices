import { Resend } from "resend";
import jsPDF from "jspdf";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const body = await req.json();

    try {
        // 🔥 نعمل PDF
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Nextly Invoice", 20, 20);

        doc.setFontSize(12);
        doc.text(`Customer: ${body.customer}`, 20, 40);
        doc.text(`Amount: EGP ${body.amount}`, 20, 50);
        doc.text(`Status: ${body.status}`, 20, 60);
        doc.text(`Due Date: ${body.due_date}`, 20, 70);

        const today = new Date().toLocaleDateString();
        doc.text(`Date: ${today}`, 20, 80);

        // 🔥 نحول لـ Buffer بدل base64
        const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: body.email,
            subject: "Invoice from Nextly",
            html: `
        <h2>Hello ${body.customer}</h2>
        <p>Your invoice amount is: ${body.amount} EGP</p>
        <p>📎 PDF attached</p>
      `,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer, // ✅ الحل هنا
                },
            ],
        });

        return Response.json({ success: true });
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}