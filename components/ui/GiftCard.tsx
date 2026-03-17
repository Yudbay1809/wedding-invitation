"use client";

import { Button } from "./Button";

export function GiftCard({
  bankName,
  accountNumber,
  accountHolder,
  walletName,
  walletNumber
}: {
  bankName?: string | null;
  accountNumber?: string | null;
  accountHolder?: string | null;
  walletName?: string | null;
  walletNumber?: string | null;
}) {
  return (
    <div className="surface p-5 flex flex-col gap-3">
      <h4 className="text-lg font-semibold">Amplop Digital</h4>
      {bankName ? (
        <div>
          <p className="text-sm text-graphite">{bankName}</p>
          <p className="text-xl font-semibold">{accountNumber}</p>
          <p className="text-sm text-graphite">{accountHolder}</p>
        </div>
      ) : null}
      {walletName ? (
        <div>
          <p className="text-sm text-graphite">{walletName}</p>
          <p className="text-xl font-semibold">{walletNumber}</p>
        </div>
      ) : null}
      <Button type="button" variant="ghost" onClick={() => navigator.clipboard.writeText(accountNumber ?? walletNumber ?? "")}>Copy Nomor</Button>
    </div>
  );
}
