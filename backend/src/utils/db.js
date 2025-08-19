import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from '../models/User.js';
import ItemModel from '../models/Item.js';
import NotificationModel from '../models/Notification.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'dfet',
  process.env.DB_USER || 'dfet',
  process.env.DB_PASS || 'dfetpass',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false
  }
);

const models = {};

export async function initializeDatabase() {
  models.User = UserModel(sequelize);
  models.Item = ItemModel(sequelize);
  models.Notification = NotificationModel(sequelize);

  models.User.hasMany(models.Item, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  models.Item.belongsTo(models.User, { foreignKey: 'user_id' });

  models.User.hasMany(models.Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  models.Notification.belongsTo(models.User, { foreignKey: 'user_id' });

  models.Item.hasMany(models.Notification, { foreignKey: 'item_id' });
  models.Notification.belongsTo(models.Item, { foreignKey: 'item_id' });

  await sequelize.authenticate();
  await sequelize.sync();
}

export { sequelize, models };