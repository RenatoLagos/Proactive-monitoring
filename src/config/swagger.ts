import swaggerJSDoc from "swagger-jsdoc"
import { SwaggerUiOptions } from "swagger-ui-express"


const options : swaggerJSDoc.Options = {

    swaggerDefinition: {
        openapi: "3.0.2",
        tags: [
        { name: 'Robots',
            description: 'API operations related to Robots'
        }
        ],
        info: {
            title: "REST API Robots",
            version: "1.0.0",
            description: "API for managing robots"
        }
    },
    apis: ["./src/router.ts"]
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions : SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: url('https://interactivechaos.com/sites/default/files/2023-02/super_mario.png');
            height: 200px;
            width: auto;
      }
    `,
    customSiteTitle: "Robots API",
    customfavIcon: "https://interactivechaos.com/sites/default/files/2023-02/super_mario.png"
}

export default swaggerSpec
export { swaggerUiOptions }

 
    
