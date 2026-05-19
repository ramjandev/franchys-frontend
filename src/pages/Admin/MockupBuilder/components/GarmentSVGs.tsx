import React from "react";

export const SHIRT_W = 420;
export const SHIRT_H = 500;

interface SVGProps {
  color: string;
  template: string;
}

export const TShirtSVG: React.FC<SVGProps> = ({ color, template }) => (
  <svg
    viewBox="0 0 290 345"
    width={SHIRT_W}
    height={SHIRT_H}
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", position: "absolute", top: 0, left: 0 }}
  >
    <defs>
      <filter id="shirtShadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
      </filter>
    </defs>
    {/* Shirt Body */}
    <path
      d="M72 8 L8 62 L42 82 L42 338 L248 338 L248 82 L282 62 L218 8 L183 32 Q145 52 107 32 Z"
      fill={color}
      stroke="rgba(0,0,0,0.12)"
      strokeWidth="1.5"
      filter="url(#shirtShadow)"
    />
    <path d="M107 32 Q145 52 183 32" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
    <path d="M72 8 L8 62 L42 82" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
    <path d="M218 8 L282 62 L248 82" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
    <path d="M42 82 L42 100" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
    <path d="M248 82 L248 100" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
    <path d="M42 100 L42 338" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.8" />
    <path d="M248 100 L248 338" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.8" />
    <path d="M42 334 L248 334" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
    {template.includes("Sleeve") && (
      <circle cx="145" cy="170" r="40" fill="rgba(0,0,0,0.05)" stroke="rgba(0,0,0,0.1)" strokeDasharray="3 3" />
    )}
  </svg>
);

export const HoodieSVG: React.FC<SVGProps> = ({ color, template }) => (
  <svg
    viewBox="0 0 290 345"
    width={SHIRT_W}
    height={SHIRT_H}
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", position: "absolute", top: 0, left: 0 }}
  >
    <defs>
      <filter id="hoodieShadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
      </filter>
    </defs>
    {/* Hoodie Body */}
    <path
      d="M72 32 L20 82 L48 102 L48 338 L242 338 L242 102 L270 82 L218 32 L180 50 C145 60 107 50 107 50 Z"
      fill={color}
      stroke="rgba(0,0,0,0.12)"
      strokeWidth="1.5"
      filter="url(#hoodieShadow)"
    />
    <path d="M107 50 C107 10 183 10 183 50 C183 50 145 65 107 50 Z" fill={color} opacity="0.9" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
    {template === "Front" && (
      <path d="M85 240 L205 240 L185 305 L105 305 Z" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
    )}
    <path d="M48 102 L48 120" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
    <path d="M242 102 L242 120" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
    <path d="M48 334 L242 334" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
  </svg>
);
