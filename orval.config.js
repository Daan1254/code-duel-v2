module.exports = {
    codeDuel: {
      output: {
        mode: "tags-split",
        target: "src/api/endpoints/code-duel.ts",
        schemas: "src/api/models",
        client: "react-query",
        mock: false,
        override: {
          mutator: {
            path: "./src/api/custom-instance.ts",
            name: "customInstance",
          },
          query: {
            useQuery: true,
            useInfinite: true,
          },
        },
      },
      input: {
        target: "http://127.0.0.1:3000/api-json",
      },
    },
}