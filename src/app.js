import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { pool } from './shared/db/pool.js';
import { errorHandler,asyncRoute } from './shared/http/errors.js';
import { config } from './shared/config.js';
import { makeGateway } from './shared/integrations/paymentGateway.js';
import { reservePayment,finalizePayment } from './slices/payments/pay/repository.js';
import { makeGpsProvider } from './shared/integrations/gpsProvider.js';
import { makeStationProvider } from './shared/integrations/stationProvider.js';
import { register as registerSignup } from './slices/auth/register-carrier/route.js';
import { register as registerLogin } from './slices/auth/login/route.js';
import { register as registerRefresh } from './slices/auth/refresh/route.js';
import { register as registerLogout } from './slices/auth/logout/route.js';
import { register as registerMe } from './slices/auth/me/route.js';
import { register as registerRequests } from './slices/carriers/list-pending/route.js';
import { register as registerCarrierDecision } from './slices/carriers/decide/route.js';
import { register as registerDriver } from './slices/drivers/create/route.js';
import { register as listDrivers } from './slices/drivers/list/route.js';
import { register as registerVehicle } from './slices/vehicles/create/route.js';
import { register as listVehicles } from './slices/vehicles/list/route.js';
import { register as locateVehicle } from './slices/vehicles/location/route.js';
import { register as startTrip } from './slices/trips/start/route.js';
import { register as listTrips } from './slices/trips/list/route.js';
import { register as finishTrip } from './slices/trips/finish/route.js';
import { register as createStation } from './slices/stations/create/route.js';
import { register as listStations } from './slices/stations/list/route.js';
import { register as externalStations } from './slices/stations/external/route.js';
import { register as stationDetail } from './slices/stations/detail/route.js';
import { register as listPrices } from './slices/stations/prices/route.js';
import { register as addPrice } from './slices/stations/add-price/route.js';
import { register as createFueling } from './slices/fuelings/create/route.js';
import { register as listFueling } from './slices/fuelings/list/route.js';
import { register as decideFueling } from './slices/fuelings/approve/route.js';
import { register as payFueling } from './slices/payments/pay/route.js';
import { register as getPayment } from './slices/payments/get/route.js';
import { register as reconcilePayment } from './slices/payments/reconcile/route.js';
import { register as reportFueling } from './slices/analytics/consumption/route.js';
import { register as auditPayments } from './slices/analytics/audit/route.js';
import { register as reportComplaint } from './slices/complaints/create/route.js';
import { register as listComplaints } from './slices/complaints/list/route.js';
import { register as moderateComplaint } from './slices/complaints/moderate/route.js';
import { register as listNotifications } from './slices/notifications/list/route.js';
import { register as registerDevice } from './slices/notifications/register-token/route.js';

/** Composition root: construct adapters once, inject into vertical slices. */
export function createApp(overrideDeps={}) {
  const deps={
    gateway:makeGateway(),paymentStore:{reserve:reservePayment,finalize:finalizePayment},gps:makeGpsProvider(),stations:makeStationProvider(),
    isPaymentMock:config.paymentProvider==='mock',...overrideDeps
  };
  const app=express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({origin:config.corsOrigin,methods:['GET','POST','PATCH','OPTIONS'],allowedHeaders:['Content-Type','Authorization']}));
  app.use(express.json({limit:'64kb'}));
  app.use((req,res,next)=>{
    const started=Date.now();
    res.on('finish',()=>console.log(JSON.stringify({level:'info',at:new Date().toISOString(),method:req.method,path:req.path,status:res.statusCode,durationMs:Date.now()-started})));
    next();
  });
  const sensitiveLimiter=rateLimit({windowMs:15*60*1000,limit:20,standardHeaders:'draft-7',legacyHeaders:false});
  app.use(['/api/v1/auth/login','/api/v1/auth/refresh','/api/v1/carriers/requests'],sensitiveLimiter);
  app.get('/health/live',(_req,res)=>res.json({status:'ok'}));
  app.get('/health/ready',asyncRoute(async(_req,res)=>{
    await pool.query('SELECT id FROM account LIMIT 1'); res.json({status:'ready'});
  }));
  [registerSignup,registerLogin,registerRefresh,registerLogout,registerMe,
    registerRequests,registerCarrierDecision,registerDriver,listDrivers,
    registerVehicle,listVehicles,locateVehicle,startTrip,listTrips,finishTrip,
    createStation,listStations,externalStations,stationDetail,listPrices,addPrice,
    createFueling,listFueling,decideFueling,payFueling,getPayment,reconcilePayment,
    reportFueling,auditPayments,reportComplaint,listComplaints,moderateComplaint,
    listNotifications,registerDevice].forEach(register => register(app,deps));
  app.use((_req,res)=>res.status(404).json({error:{code:'ROUTE_NOT_FOUND',message:'Rota não encontrada'}}));
  app.use(errorHandler);
  return app;
}
