export default (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('UserProfile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'user_id'
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'nickname'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'avatar'
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'gender'
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'birthday'
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'location'
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'bio'
    },
    preferences: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'preferences'
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_active'
    }
  }, {
    tableName: 'user_profiles',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return UserProfile;
};