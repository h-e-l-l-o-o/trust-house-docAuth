export function convert(amountInUsd, amountInIqd, usdToIqd) {
  if (amountInUsd == 0 && amountInIqd == 0) {
    throw new Error("At least one amount (USD or IQD) must be provided.");
  }

  if (amountInUsd != 0 && amountInIqd != 0) {
    return { amountInUsd, amountInIqd };
  }

  if (amountInUsd != 0 && amountInIqd == 0) {
    const calculatedIqd = amountInUsd * usdToIqd;
    return { amountInUsd, amountInIqd: calculatedIqd };
  }

  if (amountInUsd == 0 && amountInIqd != 0) {
    const calculatedUsd = amountInIqd / usdToIqd;
    return { amountInUsd: calculatedUsd, amountInIqd };
  }
}
