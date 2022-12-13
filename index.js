
require("dd-trace").init({
  logger: console,
  env: "local-dev",
  logLevel: "debug",
  version: "local-dev",
  service: "dd-trace-bug",
  logInjection: true,
  runtimeMetrics: false,
  sampleRate: 1
});

const PinoHttp = require("pino-http");
const Koa = require("koa");
const Router = require("koa-router");

// this is basically the implementation of koa-pino-logger
function createPinoMiddleware (...args) {
  const pinoHttp = PinoHttp(...args)
  function pinoHttpMiddleware (ctx, next) {
    pinoHttp(ctx.req, ctx.res)
    ctx.log = ctx.request.log = ctx.response.log = ctx.req.log
    return next().catch(function (err) {
      ctx.log.error({ err })
      throw err
    })
  }
  pinoHttpMiddleware.logger = pinoHttp.logger
  return pinoHttpMiddleware
}


const app = new Koa();

app.use(createPinoMiddleware());

const router = new Router();

router.get("/", async (ctx, next) => {
  ctx.body = "OK";
  ctx.status = 200;
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT ?? 8081;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
