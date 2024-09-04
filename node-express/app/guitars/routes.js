//Main file for our guitars module

// define our routes here, and export them to app.js this would be more clearner way instaed  of setting routes in app.js
import {Router} from 'express';
import { listGuitars, showGuitar } from './controller.js';

export const guitarRoutes = new Router();

guitarRoutes.get('/', listGuitars);
guitarRoutes.get('/:id', showGuitar);