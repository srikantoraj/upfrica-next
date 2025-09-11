// src/app/api/b/[...path]/route.js
//add one file to bridge while you refactor, then remove this later:
export {
  GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
} from '../../[...path]/route';