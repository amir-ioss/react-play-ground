function calculatePercentageChange(value1, value2) {
  if (value1 === 0) {
    console.error("Initial value (value1) cannot be zero.");
    return null;
  }
  const change = value2 - value1;
  const percentageChange = (change / value1) * 100;
  return percentageChange.toFixed(2); // Round to 2 decimal places
}
class Panes {
  constructor(initialPanes = []) {
    this.stack = initialPanes;
  }

  // Add a pane
  add(pane) {
    if (!this.has(pane)) {
      this.stack.push(pane);
    } else {
      console.log("Pane already exists");
    }
  }

  // Remove a pane
  remove(pane) {
    const index = this.stack.indexOf(pane);
    if (index > -1) {
      this.stack.splice(index, 1);
    } else {
      console.log("Pane not found");
    }
  }

  // Check if a pane exists
  has(pane) {
    return this.stack.includes(pane);
  }

  // Clear all panes
  clear() {
    this.stack = [];
  }

  // Reset panes to a new set
  reset(panes) {
    this.stack = panes;
  }

  // Get all panes
  getPanes() {
    return this.stack;
  }
}

export { calculatePercentageChange, Panes };
