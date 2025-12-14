import React from "react";

export const GraphOne = () => {
  return (
    <svg className="floating-graph graph-1" viewBox="0 0 500 400">
      <defs>
        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4269d2" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#4269d2" stopOpacity="1" />
          <stop offset="100%" stopColor="#8ba8e8" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <path
        d="M 50 200 Q 150 100, 250 180 T 450 150"
        stroke="url(#lineGradient1)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <circle cx="50" cy="200" r="8" fill="#fff" opacity="0.8">
        <animate
          attributeName="r"
          values="8;12;8"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="200" r="5" fill="#4269d2">
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="250" cy="180" r="8" fill="#fff" opacity="0.8">
        <animate
          attributeName="r"
          values="8;12;8"
          dur="2s"
          begin="0.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="250" cy="180" r="5" fill="#4269d2">
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          begin="0.5s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="450" cy="150" r="8" fill="#fff" opacity="0.8">
        <animate
          attributeName="r"
          values="8;12;8"
          dur="2s"
          begin="1s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="450" cy="150" r="5" fill="#4269d2">
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          begin="1s"
          repeatCount="indefinite"
        />
      </circle>

      <g transform="translate(70, 170)">
        <rect
          x="0"
          y="0"
          width="70"
          height="30"
          rx="15"
          fill="#4269d2"
          opacity="0.9"
        >
          <animate
            attributeName="y"
            values="0;-5;0"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
        <text
          x="35"
          y="20"
          fill="white"
          fontSize="14"
          fontWeight="600"
          textAnchor="middle"
        >
          +12.5%
        </text>
      </g>
    </svg>
  );
};

export const GraphTwo = () => {
  return (
    <svg className="floating-graph graph-2" viewBox="0 0 500 400">
      <defs>
        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8ba8e8" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#4269d2" stopOpacity="1" />
          <stop offset="100%" stopColor="#4269d2" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <path
        d="M 50 250 Q 180 120, 300 200 Q 420 280, 450 180"
        stroke="url(#lineGradient2)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <circle cx="300" cy="200" r="8" fill="#fff" opacity="0.8">
        <animate
          attributeName="r"
          values="8;12;8"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="300" cy="200" r="5" fill="#4269d2" />

      <circle cx="450" cy="180" r="8" fill="#fff" opacity="0.8">
        <animate
          attributeName="r"
          values="8;12;8"
          dur="2.5s"
          begin="0.7s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="450" cy="180" r="5" fill="#4269d2" />

      <g transform="translate(380, 150)">
        <rect
          x="0"
          y="0"
          width="65"
          height="30"
          rx="15"
          fill="#4269d2"
          opacity="0.9"
        >
          <animate
            attributeName="y"
            values="0;-5;0"
            dur="3s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </rect>
        <text
          x="32"
          y="20"
          fill="white"
          fontSize="14"
          fontWeight="600"
          textAnchor="middle"
        >
          +8.2%
        </text>
      </g>
    </svg>
  );
};

export const GraphThree = () => {
  return (
    <svg className="floating-graph graph-3" viewBox="0 0 500 400">
      <path
        d="M 100 300 Q 200 200, 350 280"
        stroke="#4269d2"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      >
        <animate
          attributeName="d"
          values="M 100 300 Q 200 200, 350 280;
                  M 100 300 Q 200 220, 350 260;
                  M 100 300 Q 200 200, 350 280"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>

      <circle cx="350" cy="280" r="6" fill="#4269d2" opacity="0.8">
        <animate
          attributeName="cy"
          values="280;260;280"
          dur="5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};