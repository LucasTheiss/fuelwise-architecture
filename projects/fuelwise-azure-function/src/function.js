import {app} from '@azure/functions';
import {handler} from './indicators.js';
app.http('indicators',{methods:['POST'],authLevel:'function',route:'indicators',handler});
