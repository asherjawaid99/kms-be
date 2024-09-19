const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "KMS BE API documentation",
    description:
      "Profile Image key: profileImage, meal images key: images, notification socket key: notification",
    version: "1.0.0",
  },
  host: "localhost:8001",
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [],
};

const outputFile = "./swagger_output.json"; // Generated Swagger file
const endpointsFiles = ["./src/router/index.js"]; // Path to the API routes files

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger file generated");
});
