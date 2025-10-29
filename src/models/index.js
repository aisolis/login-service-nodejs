import sequelize from '../config/database.js';
import Role from './Role.js';
import User from './User.js';

// Associations
User.belongsTo(Role, { foreignKey: 'id_rol', as: 'rol' });
Role.hasMany(User, { foreignKey: 'id_rol', as: 'usuarios' });

export { sequelize, Role, User };