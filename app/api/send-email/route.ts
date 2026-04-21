import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: Request) {
    const body = await req.json();

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: body.email,
            subject: "Invoice from Nextly",

            html: `
        <h2>Hello ${body.customer}</h2>
        <p>Your invoice amount is: <b>${body.amount} EGP</b></p>
        <p>Please find your invoice attached.</p>
      `,

            // 🔥 PDF Attachment
            attachments: body.pdf
                ? [
                    {
                        filename: "invoice.pdf",
                        content: body.pdf.split(",")[1], // نشيل data:application/pdf;base64,
                    },
                ]
                : [],
        });

        return Response.json({ success: true });
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}