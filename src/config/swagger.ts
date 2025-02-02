import swaggerJSDoc from "swagger-jsdoc"


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
export default swaggerSpec

 
    
