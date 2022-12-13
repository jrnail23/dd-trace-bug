(On Node v18.12.1)

With DD agent running:
- `npm start`, then
- `curl http://localhost:8081`.

With `dd-trace@3.2+`, you should see the following output on every request:

```
TypeError: Cannot read property 'started' of undefined
    at PrioritySampler.sample (/my-project/node_modules/dd-trace/packages/dd-trace/src/priority_sampler.js:51:33)
    at DatadogTracer.inject (/my-project/node_modules/dd-trace/packages/dd-trace/src/opentracing/tracer.js:76:29)
    at /my-project/node_modules/dd-trace/packages/dd-trace/src/plugins/log_plugin.js:49:19
    at Subscription._handler (/my-project/node_modules/dd-trace/packages/dd-trace/src/plugins/plugin.js:14:9)
    at Channel.publish (diagnostics_channel.js:56:9)
    at mixinWithTrace (/my-project/node_modules/dd-trace/packages/datadog-instrumentations/src/pino.js:47:8)
    at Pino.write (/my-project/node_modules/pino/lib/proto.js:197:35)
    at Pino.LOG [as info] (/my-project/node_modules/pino/lib/tools.js:55:21)
    at onResFinished (/my-project/node_modules/pino-http/logger.js:125:15)
    at ServerResponse.onResponseComplete (/my-project/node_modules/pino-http/logger.js:174:14)
[17:49:39.262] INFO (13203): request completed
    req: {
      "id": 1,
      "method": "GET",
      "url": "/",
      "headers": {
        "host": "localhost:8081",
        "user-agent": "curl/7.79.1",
        "accept": "*/*"
      },
      "remoteAddress": "::ffff:127.0.0.1",
      "remotePort": 61378
    }
    res: {
      "statusCode": 200,
      "headers": {
        "content-type": "text/plain; charset=utf-8",
        "content-length": "2"
      }
    }
    responseTime: 5
```

With the fix from https://github.com/DataDog/dd-trace-js/pull/2641 applied, you'll see this (notice we've got log injection working now!):
```
[18:07:55.072] INFO (25006): request completed
    req: {
      "id": 1,
      "method": "GET",
      "url": "/",
      "headers": {
        "host": "localhost:8081",
        "user-agent": "curl/7.79.1",
        "accept": "*/*"
      },
      "remoteAddress": "::ffff:127.0.0.1",
      "remotePort": 61771
    }
    dd: {
      "trace_id": "2824073541491462043",
      "span_id": "2824073541491462043",
      "service": "dd-trace-bug",
      "version": "local-dev",
      "env": "local-dev"
    }
    res: {
      "statusCode": 200,
      "headers": {
        "content-type": "text/plain; charset=utf-8",
        "content-length": "2"
      }
    }
    responseTime: 6
```
