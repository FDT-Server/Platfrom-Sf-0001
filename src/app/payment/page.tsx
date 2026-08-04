import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export default async function PaymentPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawPlan =
    typeof params.plan === "string"
      ? params.plan.toLowerCase()
      : typeof params.billing === "string"
        ? params.billing.toLowerCase()
        : "monthly";

  const selectedPlan = rawPlan === "yearly" ? "yearly" : "monthly";

  // Directly redirect to Checkout page with plan parameter
  redirect(`/checkout?plan=${selectedPlan}`);
}
