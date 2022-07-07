import plays from "./data/plays.json";
import invoices from "./data/invoices.json";

const amountFor = (aPerformance, aPlay) => {
  let result = 0;

  switch (aPlay.type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30)
        result += 1000 * (aPerformance.audience - 30);
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20)
        result += 10000 + 500 * (aPerformance.audience - 20);
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown type: ${aPlay.type}`);
  }
  return result;
};

const statement = (invoice, plays) => {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    let play = plays[perf.playID];
    let thisAmount = amountFor(perf, play);

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) thisAmount += 1000 * (perf.audience - 30);
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20)
          thisAmount += 10000 + 500 * (perf.audience - 20);
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);

    // add extra credit for every ten comedy attendees
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // print line for this order
    result += ` ${play.name}: ${thisAmount / 100} (${perf.audience} seats)\n`;

    totalAmount += thisAmount;
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;

  return result;
};

console.log(statement(invoices[0], plays));
