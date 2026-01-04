import sequelize from '../config/database';
import { Tenant, User, Team, TeamMember, Message } from '../models';

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    console.log('Creating tenants...');
    const tenant1 = await Tenant.create({ name: 'Acme Corp' });
    const tenant2 = await Tenant.create({ name: 'Tech Startup' });

    console.log('Creating users...');
    const user1 = await User.create({
      tenantId: tenant1.id,
      email: 'alice@acme.com',
      name: 'Alice Johnson',
    });

    const user2 = await User.create({
      tenantId: tenant1.id,
      email: 'bob@acme.com',
      name: 'Bob Smith',
    });

    const user3 = await User.create({
      tenantId: tenant1.id,
      email: 'charlie@acme.com',
      name: 'Charlie Brown',
    });

    const user4 = await User.create({
      tenantId: tenant2.id,
      email: 'diana@startup.com',
      name: 'Diana Prince',
    });

    const user5 = await User.create({
      tenantId: tenant2.id,
      email: 'eve@startup.com',
      name: 'Eve Wilson',
    });

    console.log('Creating teams...');
    const team1 = await Team.create({
      tenantId: tenant1.id,
      name: 'Engineering',
      description: 'Engineering team for Acme Corp',
    });

    const team2 = await Team.create({
      tenantId: tenant1.id,
      name: 'Marketing',
      description: 'Marketing team for Acme Corp',
    });

    const team3 = await Team.create({
      tenantId: tenant2.id,
      name: 'Product',
      description: 'Product team for Tech Startup',
    });

    console.log('Adding team members...');
    await TeamMember.create({ teamId: team1.id, userId: user1.id });
    await TeamMember.create({ teamId: team1.id, userId: user2.id });
    await TeamMember.create({ teamId: team1.id, userId: user3.id });

    await TeamMember.create({ teamId: team2.id, userId: user1.id });
    await TeamMember.create({ teamId: team2.id, userId: user3.id });

    await TeamMember.create({ teamId: team3.id, userId: user4.id });
    await TeamMember.create({ teamId: team3.id, userId: user5.id });

    console.log('Creating messages...');
    await Message.create({
      teamId: team1.id,
      userId: user1.id,
      content: 'Hey team, let\'s start the sprint planning!',
    });

    await Message.create({
      teamId: team1.id,
      userId: user2.id,
      content: 'Sure! I\'ll prepare the backlog items.',
    });

    await Message.create({
      teamId: team1.id,
      userId: user3.id,
      content: 'Looking forward to the discussion!',
    });

    await Message.create({
      teamId: team2.id,
      userId: user1.id,
      content: 'The campaign is going really well!',
    });

    await Message.create({
      teamId: team2.id,
      userId: user3.id,
      content: 'Great engagement on social media.',
    });

    await Message.create({
      teamId: team3.id,
      userId: user4.id,
      content: 'New feature release scheduled for next week.',
    });

    await Message.create({
      teamId: team3.id,
      userId: user5.id,
      content: 'Testing is on track, no blockers so far.',
    });

    console.log('✅ Database seeded successfully!');
    console.log('\nTest Users:');
    console.log('Tenant 1 (Acme Corp):');
    console.log('  - alice@acme.com (Alice Johnson)');
    console.log('  - bob@acme.com (Bob Smith)');
    console.log('  - charlie@acme.com (Charlie Brown)');
    console.log('Tenant 2 (Tech Startup):');
    console.log('  - diana@startup.com (Diana Prince)');
    console.log('  - eve@startup.com (Eve Wilson)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
