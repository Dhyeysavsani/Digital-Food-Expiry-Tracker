import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Notification extends Model {}
  Notification.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      item_id: { type: DataTypes.INTEGER, allowNull: true },
      message: { type: DataTypes.STRING(255), allowNull: false },
      sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    { sequelize, modelName: 'Notification', tableName: 'notifications', underscored: true }
  );
  return Notification;
};