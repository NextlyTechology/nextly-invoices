import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const body = await req.json();
    const { email, customer, amount } = body;

    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Invoice Reminder 💸",
            html: `
        <h2>Hello ${customer}</h2>
        <p>You have a pending invoice.</p>
        <p><strong>Amount:</strong> EGP ${amount}</p>
        <p>Please pay as soon as possible 🙏</p>
      `,
        });

        return Response.json({ success: true, data });
    } catch (error) {
        return Response.json({ success: false, error });
    }
}