import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const body = await req.json();

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: body.email,
            subject: "Invoice from Nextly",
            html: `
        <h2>Hello ${body.customer}</h2>
        <p>Your invoice amount is: ${body.amount} EGP</p>
      `,
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error });
    }
}