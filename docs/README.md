# Documentation

## Design

The `API` documentation (`design/openapi_doc.yaml` and `design/swagger_doc.yaml`) was made using [`OpenAPI`](https://swagger.io/), with the [`Swagger Editor`](https://swagger.io/tools/swagger-editor/) (note that `VSCode` has an extension to visualize both the `yaml` and `json` files) and the [`Swagger UI`](https://swagger.io/tools/swagger-ui/). 

The former lets you create the file that defines your `API` and its endpoints and the latter allows you to host a web application that serves your `API` specification. In our case we have use the `Docker` image provided for that purpose. 

It has also been used [`pikturr`](https://github.com/nrekretep/pikturr) to generate a diagram for our `API`'s endpoints (`design/api_uml.png`). This diagram has been generated from the file `design/swagger_doc.yaml` that uses `Swagger` instead of `OpenAPI`.

