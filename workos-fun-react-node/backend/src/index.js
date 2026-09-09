import { assertConfig, config } from './config.js'
import { registerAuthRoutes } from './auth/routes.js'
import { registerGymRoutes } from './gym/routes.js'
import { createRouter } from './http/router.js'
import { createApiServer } from './http/server.js'

assertConfig()

const router = createRouter()
registerAuthRoutes(router)
registerGymRoutes(router)

createApiServer(router).listen(config.apiPort, config.host, () => {
  console.log(`api listening on http://${config.host}:${config.apiPort}`)
  console.log(`bound to ${config.host} only, not reachable from the network`)
})
