const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "data", "forum.json");
fs.mkdirSync(path.dirname(file), { recursive: true });

function empty() {
  return { users: [], categories: [], topics: [], posts: [], seq: { users: 1, categories: 1, topics: 1, posts: 1 } };
}
let data = empty();
if (fs.existsSync(file)) {
  try { data = JSON.parse(fs.readFileSync(file, "utf8")); } catch { data = empty(); }
}
function save() {
  fs.writeFileSync(file, JSON.stringify(data));
}
function next(key) {
  const id = data.seq[key];
  data.seq[key] += 1;
  return id;
}
function user(id) {
  return data.users.find((u) => u.id === Number(id));
}

const store = {
  userByNick(nick) {
    return data.users.find((u) => u.nick.toLowerCase() === String(nick).toLowerCase()) || null;
  },
  userById(id) {
    const u = user(id);
    return u ? { ...u } : null;
  },
  users() {
    return data.users.map((u) => ({ id: u.id, nick: u.nick, name: u.name, role: u.role, created_at: u.created_at }));
  },
  addUser(row) {
    const item = { id: next("users"), role: "uye", ...row };
    data.users.push(item);
    save();
    return item.id;
  },
  setPassword(id, password_hash) {
    const u = user(id);
    if (u) u.password_hash = password_hash;
    save();
  },
  categories() {
    return [...data.categories].sort((a, b) => a.position - b.position || a.id - b.id);
  },
  category(id) {
    return data.categories.find((c) => c.id === Number(id)) || null;
  },
  addCategory(title, description, position) {
    data.categories.push({ id: next("categories"), title, description, position });
    save();
  },
  countTopics(categoryId) {
    return data.topics.filter((t) => t.category_id === Number(categoryId)).length;
  },
  countPosts(categoryId) {
    const ids = new Set(data.topics.filter((t) => t.category_id === Number(categoryId)).map((t) => t.id));
    return data.posts.filter((p) => ids.has(p.topic_id)).length;
  },
  lastTopic(categoryId) {
    const list = data.topics.filter((t) => t.category_id === Number(categoryId)).sort((a, b) => b.updated_at - a.updated_at);
    if (!list[0]) return null;
    const u = user(list[0].user_id);
    return { id: list[0].id, title: list[0].title, updated_at: list[0].updated_at, name: u ? u.name : "" };
  },
  topicsIn(categoryId) {
    return data.topics
      .filter((t) => t.category_id === Number(categoryId))
      .sort((a, b) => b.pinned - a.pinned || b.updated_at - a.updated_at)
      .map((t) => ({ ...t, name: user(t.user_id)?.name || "" }));
  },
  recentTopics() {
    return [...data.topics]
      .sort((a, b) => b.updated_at - a.updated_at)
      .slice(0, 100)
      .map((t) => ({ ...t, name: user(t.user_id)?.name || "", category: store.category(t.category_id)?.title || "" }));
  },
  topic(id) {
    const t = data.topics.find((x) => x.id === Number(id));
    if (!t) return null;
    return { ...t, category: store.category(t.category_id)?.title || "" };
  },
  addTopic(row) {
    const item = { id: next("topics"), pinned: 0, locked: 0, views: 0, ...row };
    data.topics.push(item);
    save();
    return item.id;
  },
  bumpViews(id) {
    const t = data.topics.find((x) => x.id === Number(id));
    if (t) t.views += 1;
    save();
  },
  setTopic(id, patch) {
    const t = data.topics.find((x) => x.id === Number(id));
    if (t) Object.assign(t, patch);
    save();
  },
  deleteTopic(id) {
    data.topics = data.topics.filter((t) => t.id !== Number(id));
    data.posts = data.posts.filter((p) => p.topic_id !== Number(id));
    save();
  },
  posts(topicId) {
    return data.posts
      .filter((p) => p.topic_id === Number(topicId))
      .sort((a, b) => a.id - b.id)
      .map((p) => {
        const u = user(p.user_id) || {};
        return { ...p, name: u.name || "", nick: u.nick || "", role: u.role || "" };
      });
  },
  countReplies(topicId) {
    return data.posts.filter((p) => p.topic_id === Number(topicId)).length;
  },
  addPost(row) {
    data.posts.push({ id: next("posts"), ...row });
    save();
  },
  userTopics(userId) {
    return data.topics.filter((t) => t.user_id === Number(userId)).sort((a, b) => b.id - a.id).slice(0, 20);
  },
  search(q) {
    const n = q.toLowerCase();
    return data.topics
      .filter((t) => t.title.toLowerCase().includes(n) || data.posts.some((p) => p.topic_id === t.id && p.body.toLowerCase().includes(n)))
      .sort((a, b) => b.updated_at - a.updated_at)
      .slice(0, 50);
  }
};

module.exports = store;
