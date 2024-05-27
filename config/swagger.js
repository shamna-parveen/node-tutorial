const swagger = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "NODE EXAMPLE API with Swagger",
      version: "0.1.0",
      description: "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "DiamondLease",
        url: "https://diamondlease.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT"
        },
      }
    },
    security: [{
      jwt: []
    }],
  },
  apis: ["./controllers/*.js"],
};
export default swagger;
