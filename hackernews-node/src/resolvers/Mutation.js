const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

function post(root, args, { prisma, request }) {
  const userId = getUserId(request);

  return prisma.createLink({
    ...args,
    postedBy: { connect: { id: userId }}
  });
}

function updateLink(root, { id, ...data }, { prisma }) {
  return prisma.updateLink({
    where: { id },
    data
  });
}

function deleteLink(root, args, { prisma }) {
  return prisma.deleteLink(args);
}

async function signup(root, { password, ...args }, { prisma }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.createUser({ ...args, password: hashedPassword });
  
  return authPayload(user);
}

async function login(root, { email, password }, { prisma }) {
  const user = await prisma.user({ email });

  if (!user)
    throw new Error('No such user found');

  const valid = await bcrypt.compare(password, user.password);

  if (!valid)
    throw new Error('Invalid password');

  return authPayload(user);
}

function authPayload(user) {
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return { token, user };
}

async function vote(root, args, { prisma, request }, info) {
  const userId = getUserId(request);
  const linkExists = await prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });

  if (linkExists)
    throw new Error(`Already voted for link ${args.linkId}`);

  return prisma.createVote({
    user: { connect: { id: userId }},
    link: { connect: { id: args.linkId } }
  });
}

module.exports = {
  post,
  updateLink,
  deleteLink,
  signup,
  login,
  vote
};
