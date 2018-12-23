function info() {
  return 'This is the API of a Hackernews Clone';
}

async function feed(root, args, { prisma }) {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter }
    ]
  } : {};

  const [links, count] = await Promise.all([
    prisma.links({ 
      where,
      skip: args.skip,
      first: args.first,
      orderBy: args.orderBy
    }),

    prisma
      .linksConnection({ where })
      .aggregate()
      .count()
  ]);

  return { links, count };
}

function link(root, args, { prisma }) {
  return context.prisma.link(args);
}

module.exports = {
  info,
  feed,
  link
};
