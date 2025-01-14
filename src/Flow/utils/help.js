function calculatePercentageChange(value1, value2) {
  if (value1 === 0) {
    console.error("Initial value (value1) cannot be zero.");
    return null;
  }
  const change = value2 - value1;
  const percentageChange = (change / value1) * 100;
  return percentageChange.toFixed(2); // Round to 2 decimal places
}


export { calculatePercentageChange };
