function crosshairMove(chart, container, dataSeries) {
  const toolTipWidth = 100;
  const toolTipHeight = 100;
  const toolTipMargin = 15;

  // Create and style the tooltip html element
  const toolTip = document.createElement("div");
  toolTip.style = `width: 100px; height: 100px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
  toolTip.style.background = "white";
  toolTip.style.color = "black";
  toolTip.style.borderColor = "rgba( 38, 166, 154, 1)";
  container.appendChild(toolTip);

  // update tooltip
  chart.subscribeCrosshairMove((param) => {
    if (
      param.point === undefined ||
      !param.time ||
      param.point.x < 0 ||
      param.point.x > container.clientWidth ||
      param.point.y < 0 ||
      param.point.y > container.clientHeight
    ) {
      toolTip.style.display = "none";
    } else {
      // time will be in the same format that we supplied to setData.
      // thus it will be YYYY-MM-DD
      const dateStr = param.time;
      toolTip.style.display = "block";
      const data = param.seriesData.get(dataSeries);
      const price = data?.value !== undefined ? data.value : data?.close;
      if (!price) {
        return;
      }
      toolTip.innerHTML = `<div style="color: ${"#2962FF"}">Apple Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${"black"}">
${Math.round(100 * price) / 100}
</div><div style="color: ${"black"}">
${dateStr}
</div>`;

      const coordinate = dataSeries.priceToCoordinate(price);
      let shiftedCoordinate = param.point.x - 50;
      if (coordinate === null) {
        return;
      }
      shiftedCoordinate = Math.max(0, Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate));
      const coordinateY =
        coordinate - toolTipHeight - toolTipMargin > 0
          ? coordinate - toolTipHeight - toolTipMargin
          : Math.max(0, Math.min(container.clientHeight - toolTipHeight - toolTipMargin, coordinate + toolTipMargin));
      toolTip.style.left = shiftedCoordinate + "px";
      toolTip.style.top = coordinateY + "px";
    }
  });
}

export { crosshairMove };
