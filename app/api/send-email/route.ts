import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const body = await req.json();

    try {
        // 🔥 نحول base64 → buffer
        const pdfBuffer = Buffer.from(
            body.pdf.split(",")[1],
            "base64"
        );

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: body.email,
            subject: "Invoice from Nextly",

            html: `
        <h2>Hello ${body.customer}</h2>
        <p>Your invoice amount is: ${body.amount} EGP</p>
      `,

            // 🔥 ده الصح
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                },
            ],
        });

        return Response.json({ success: true });
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}