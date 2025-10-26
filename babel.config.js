export default function (api) {
  // Cache the config for faster rebuilds
  api.cache(true);

  return {
    presets: [
      "@babel/preset-env",
      "@babel/preset-react"
    ],
    plugins: [
      ["babel-plugin-inferno", { imports: true }]
    ]
  };
}