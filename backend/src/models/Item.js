import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Item extends Model {}
  Item.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(191), allowNull: false },
      category: { type: DataTypes.STRING(100) },
      quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
      barcode: { type: DataTypes.STRING(64) },
      expiry_date: { type: DataTypes.DATEONLY, allowNull: false },
      status: { type: DataTypes.ENUM('safe', 'expiring', 'expired'), defaultValue: 'safe' }
    },
    { sequelize, modelName: 'Item', tableName: 'items', underscored: true }
  );
  return Item;
};