/**
 * Formas de los datos que viajan entre la API y la interfaz.
 * El proyecto es JavaScript, como la referencia; estos comentarios
 * dejan el contrato escrito para explicarlo en clase.
 *
 * @typedef {Object} Usuario
 * @property {number} idUsuario
 * @property {string} nombre
 * @property {string} email
 * @property {string} contrasena
 *
 * @typedef {Object} Materia
 * @property {number} idMateria
 * @property {string} nombreMateria
 * @property {number} prioridadMateria
 * @property {number} idUsuario
 *
 * @typedef {Object} Tarea
 * @property {number} idTarea
 * @property {string} titulo
 * @property {string} descripcion
 * @property {number} pesoTarea
 * @property {string} fechaEntrega
 * @property {string} estado
 * @property {number} idMateria
 * @property {Materia=} materia
 *
 * @typedef {Object} Subtarea
 * @property {number} idsubtarea
 * @property {string} descripcion
 * @property {number} idtarea
 */

export {};
