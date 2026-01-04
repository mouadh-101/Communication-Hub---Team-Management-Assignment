import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TeamMemberAttributes {
  id: string;
  teamId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TeamMemberCreationAttributes extends Optional<TeamMemberAttributes, 'id'> {}

class TeamMember extends Model<TeamMemberAttributes, TeamMemberCreationAttributes> implements TeamMemberAttributes {
  public id!: string;
  public teamId!: string;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TeamMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'team_members',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['teamId', 'userId'],
      },
    ],
  }
);

export default TeamMember;
