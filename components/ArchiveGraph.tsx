"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export function ArchiveGraph() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear prev
    containerRef.current.innerHTML = "";

    const width = containerRef.current.clientWidth || 400;
    const height = 300;

    const nodes = [
      { id: "Core", group: 1, radius: 8 },
      { id: "Restraint", group: 2, radius: 5 },
      { id: "Sovereignty", group: 2, radius: 5 },
      { id: "Atmosphere", group: 2, radius: 5 },
      { id: "Audio Drones", group: 3, radius: 3 },
      { id: "Lookbook", group: 3, radius: 3 },
      { id: "Manifesto", group: 3, radius: 3 },
      { id: "Sanctum", group: 3, radius: 3 },
    ];

    const links = [
      { source: "Core", target: "Restraint" },
      { source: "Core", target: "Sovereignty" },
      { source: "Core", target: "Atmosphere" },
      { source: "Restraint", target: "Lookbook" },
      { source: "Sovereignty", target: "Manifesto" },
      { source: "Atmosphere", target: "Audio Drones" },
      { source: "Core", target: "Sanctum" },
    ];

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(60))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "rgba(220,197,123,0.3)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .attr("stroke", "#dcc57b")
      .attr("stroke-width", 1)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.group === 1 ? "#dcc57b" : "#0c0a09");

    const text = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", 8)
      .attr("font-family", "monospace")
      .attr("fill", "rgba(255,255,255,0.7)")
      .attr("dx", 12)
      .attr("dy", 3);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      text
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="w-full bg-[#0c0a09]/60 backdrop-blur-md border border-[#dcc57b]/20 p-4 rounded-lg relative overflow-hidden flex flex-col">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[#dcc57b] mb-2">Archive Boundaries (Data Graph)</div>
      <div ref={containerRef} className="w-full h-[300px]" />
    </div>
  );
}
