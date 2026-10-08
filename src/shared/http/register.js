import { auth, role } from '../auth/guard.js';
import { asyncRoute } from './errors.js';
import { parse } from './validate.js';
/** HTTP boundary per vertical slice; business handlers receive validated input + injected ports. */
export function route(app, method, path, { publicRoute=false, roles=[], body, query, params, status=200, execute }, deps) {
  const middleware = publicRoute ? [] : [auth, ...(roles.length ? [role(...roles)] : [])];
  app[method](path, ...middleware, asyncRoute(async (req,res) => {
    const context = {
      actor: req.actor || null,
      body: body ? parse(body,req.body) : req.body,
      query: query ? parse(query,req.query) : req.query,
      params: params ? parse(params,req.params) : req.params,
      ip: req.ip
    };
    const output = await execute(context,deps);
    res.status(status).json(output ?? {});
  }));
}
