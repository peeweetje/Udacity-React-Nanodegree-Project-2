const clone = require('clone');

let db = {};

const defaultData = {
  '8xf0y6ziyjabvozdd253nd': {
    id: '8xf0y6ziyjabvozdd253nd',
    timestamp: 1678796500130,
    title: 'Udacity is the best place to learn React',
    body: 'Everyone says so after all.',
    author: 'thingtwo',
    category: 'react',
    voteScore: 6,
    deleted: false,
  },
  '6ni6ok3ym7mf1p33lnez': {
    id: '6ni6ok3ym7mf1p33lnez',
    timestamp: 1622636500170,
    title: 'Learn Redux in 10 minutes!',
    body: 'Just kidding. It takes more than 10 minutes to learn technology.',
    author: 'thingone',
    category: 'redux',
    voteScore: -5,
    deleted: false,
  },
  '4rj0m6ziyjartgzdd133nd': {
    id: '4rj0m6ziyjartgzdd133nd',
    timestamp: 1667391160645,
    title: 'Javascript is the best language to learn ',
    body: 'Learn it and you rule the world.',
    author: 'mememe',
    category: 'javascript',
    voteScore: 3,
    deleted: false,
  },
  '3xf0y7ziyjabvozdd253ea': {
    id: '3xf0y7ziyjabvozdd253ea',
    timestamp: 1767166872635,
    title: 'React is the best framework!',
    body: 'Not sure about that!',
    author: 'Petra Vos',
    category: 'react',
    voteScore: 10,
    deleted: false,
  },
  '8xf0y7ziyjabvozdd253kl': {
    id: '8xf0y7ziyjabvozdd253kl',
    timestamp: 1570166872635,
    title: 'Is redux still relevant???',
    body: 'Yes ofcourse it is!',
    author: 'Harry Potter',
    category: 'redux',
    voteScore: 5,
    deleted: false,
  },
};

function getData(token) {
  let data = db[token];
  if (data == null) {
    data = db[token] = clone(defaultData);
  }
  return data;
}

function getByCategory(token, category) {
  return new Promise((res) => {
    let posts = getData(token);
    let keys = Object.keys(posts);
    let filtered_keys = keys.filter(
      (key) => posts[key].category === category && !posts[key].deleted
    );
    res(filtered_keys.map((key) => posts[key]));
  });
}

function get(token, id) {
  return new Promise((res) => {
    const posts = getData(token);
    res(posts[id].deleted ? {} : posts[id]);
  });
}

function getAll(token) {
  return new Promise((res) => {
    const posts = getData(token);
    let keys = Object.keys(posts);
    let filtered_keys = keys.filter((key) => !posts.deleted);
    res(filtered_keys.map((key) => posts[key]));
  });
}

function add(token, post) {
  return new Promise((res) => {
    let posts = getData(token);

    posts[post.id] = {
      id: post.id,
      timestamp: post.timestamp,
      title: post.title,
      body: post.body,
      author: post.author,
      category: post.category,
      voteScore: 1,
      deleted: false,
    };

    res(posts[post.id]);
  });
}

function vote(token, id, option) {
  return new Promise((res) => {
    let posts = getData(token);
    post = posts[id];
    switch (option) {
      case 'upVote':
        post.voteScore = post.voteScore + 1;
        break;
      case 'downVote':
        post.voteScore = post.voteScore - 1;
        break;
      default:
        console.log(`posts.vote received incorrect parameter: ${option}`);
    }
    res(post);
  });
}

function disable(token, id) {
  return new Promise((res) => {
    let posts = getData(token);
    posts[id].deleted = true;
    res(posts[id]);
  });
}

function edit(token, id, post) {
  return new Promise((res) => {
    let posts = getData(token);
    for (prop in post) {
      posts[id][prop] = post[prop];
    }
    res(posts[id]);
  });
}

module.exports = {
  get,
  getAll,
  getByCategory,
  add,
  vote,
  disable,
  edit,
  getAll,
};
