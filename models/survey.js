export default (sequelize, DataTypes) => {
  const Survey = sequelize.define('Survey', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    basicInfo: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'basic_info'
    },
    basicFilter: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'basic_filter'
    },
    weights: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'weights'
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted'),
      defaultValue: 'draft',
      field: 'status'
    },
    results: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'results'
    }
  }, {
    tableName: 'surveys',
    underscored: true
  });

  Survey.associate = (models) => {
    Survey.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Survey;
};