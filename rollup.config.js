import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/quartermaster-dashboard.ts",
  output: {
    file: "dist/quartermaster-dashboard.js",
    format: "es",
  },
  plugins: [
    nodeResolve(),
    typescript({ include: ["src/**/*.ts"] }),
    terser({ format: { comments: false } }),
  ],
};
