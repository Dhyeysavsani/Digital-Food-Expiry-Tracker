import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class User extends Model {}
  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(191), allowNull: false }
    },
    { sequelize, modelName: 'User', tableName: 'users', underscored: true }
  );
  return User;
};