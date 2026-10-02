const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "data", "forum.json");
fs.mkdirSync(path.dirname(file), { recursive: true });

function empty() {
  return { users: [], categories: [], forums: [], topics: [], posts: [], seq: { users: 1, categories: 1, forums: 1, topics: 1, posts: 1 } };
}
let data = empty();
if (fs.existsSync(file)) {
  try { data = { ...empty(), ...JSON.parse(fs.readFileSync(file, "utf8")) }; } catch { data = empty(); }
}
if (!Array.isArray(data.forums) || !data.forums.length) {
  data.forums = (data.categories || []).map((c) => ({ id: c.id, category_id: c.id, parent_id: 0, title: c.title, description: c.description || "", position: c.position || c.id }));
  data.seq.forums = Math.max(data.seq.forums || 1, ...data.forums.map((f) => f.id), 0) + 1;
  (data.topics || []).forEach((t) => { if (!t.forum_id) t.forum_id = t.category_id; });
}
function save() { fs.writeFileSync(file, JSON.stringify(data)); }
function next(key) { const id = data.seq[key]; data.seq[key] += 1; return id; }
function user(id) { return data.users.find((u) => u.id === Number(id)); }
function forum(id) { return data.forums.find((f) => f.id === Number(id)); }

const store = {
  save,
  userByNick(nick) { return data.users.find((u) => u.nick.toLowerCase() === String(nick).toLowerCase()) || null; },
  userById(id) { const u = user(id); return u ? { ...u, posts: data.posts.filter((p) => p.user_id === u.id).length } : null; },
  users() { return data.users.map((u) => ({ ...u, posts: data.posts.filter((p) => p.user_id === u.id).length })); },
  addUser(row) { const item = { id: next("users"), role: "uye", ...row }; data.users.push(item); save(); return item.id; },
  setPassword(id, password_hash) { const u = user(id); if (u) u.password_hash = password_hash; save(); },
  categories() { return [...data.categories].sort((a, b) => a.position - b.position || a.id - b.id); },
  category(id) { return data.categories.find((c) => c.id === Number(id)) || null; },
  addCategory(title, description) { const item = { id: next("categories"), title, description, position: data.categories.length + 1 }; data.categories.push(item); save(); return item.id; },
  forums(categoryId) { return data.forums.filter((f) => f.category_id === Number(categoryId) && !f.parent_id).sort((a, b) => a.position - b.position || a.id - b.id); },
  subforums(parentId) { return data.forums.filter((f) => f.parent_id === Number(parentId)).sort((a, b) => a.position - b.position || a.id - b.id); },
  forum(id) { return forum(id) || null; },
  allForums() { return [...data.forums].sort((a, b) => a.position - b.position || a.id - b.id); },
  addForum(row) { const item = { id: next("forums"), parent_id: 0, position: data.forums.length + 1, description: "", ...row }; data.forums.push(item); save(); return item.id; },
  topicIds(forumId) {
    const ids = [Number(forumId), ...store.subforums(forumId).map((f) => f.id)];
    return data.topics.filter((t) => ids.includes(t.forum_id));
  },
  countTopics(forumId) { return store.topicIds(forumId).length; },
  countPosts(forumId) {
    const ids = new Set(store.topicIds(forumId).map((t) => t.id));
    return data.posts.filter((p) => ids.has(p.topic_id)).length;
  },
  lastPost(forumId) {
    const ids = new Set(store.topicIds(forumId).map((t) => t.id));
    const post = [...data.posts].reverse().find((p) => ids.has(p.topic_id));
    if (!post) return null;
    const t = data.topics.find((x) => x.id === post.topic_id);
    return { topic_id: t.id, title: t.title, created_at: post.created_at, name: user(post.user_id)?.name || "" };
  },
  topics(forumId, page, size) {
    const list = data.topics.filter((t) => t.forum_id === Number(forumId)).sort((a, b) => b.pinned - a.pinned || b.updated_at - a.updated_at);
    return { total: list.length, rows: list.slice((page - 1) * size, page * size).map((t) => ({ ...t, name: user(t.user_id)?.name || "", replies: Math.max(0, data.posts.filter((p) => p.topic_id === t.id).length - 1), last: store.lastInTopic(t.id) })) };
  },
  lastInTopic(topicId) {
    const post = [...data.posts].reverse().find((p) => p.topic_id === Number(topicId));
    return post ? { created_at: post.created_at, name: user(post.user_id)?.name || "" } : null;
  },
  topic(id) { const t = data.topics.find((x) => x.id === Number(id)); return t ? { ...t } : null; },
  addTopic(row) { const item = { id: next("topics"), pinned: 0, locked: 0, views: 0, ...row }; data.topics.push(item); save(); return item.id; },
  bumpViews(id) { const t = data.topics.find((x) => x.id === Number(id)); if (t) t.views += 1; save(); },
  setTopic(id, patch) { const t = data.topics.find((x) => x.id === Number(id)); if (t) Object.assign(t, patch); save(); },
  deleteTopic(id) { data.topics = data.topics.filter((t) => t.id !== Number(id)); data.posts = data.posts.filter((p) => p.topic_id !== Number(id)); save(); },
  posts(topicId, page, size) {
    const list = data.posts.filter((p) => p.topic_id === Number(topicId)).sort((a, b) => a.id - b.id);
    return { total: list.length, rows: list.slice((page - 1) * size, page * size).map((p, i) => ({ ...p, n: (page - 1) * size + i + 1, ...publicUser(p.user_id) })) };
  },
  post(id) { return data.posts.find((p) => p.id === Number(id)) || null; },
  addPost(row) { const item = { id: next("posts"), ...row }; data.posts.push(item); save(); return item.id; },
  setPost(id, body) { const p = data.posts.find((x) => x.id === Number(id)); if (p) p.body = body; save(); },
  userTopics(userId) { return data.topics.filter((t) => t.user_id === Number(userId)).sort((a, b) => b.id - a.id).slice(0, 20); },
  latest() { return [...data.topics].sort((a, b) => b.updated_at - a.updated_at).slice(0, 40); },
  search(q) {
    const n = q.toLowerCase();
    return data.topics.filter((t) => t.title.toLowerCase().includes(n) || data.posts.some((p) => p.topic_id === t.id && p.body.toLowerCase().includes(n))).sort((a, b) => b.updated_at - a.updated_at).slice(0, 50);
  },
  stats() {
    return { topics: data.topics.length, posts: data.posts.length, users: data.users.length, newest: [...data.users].sort((a, b) => b.id - a.id)[0] || null };
  }
};
function publicUser(id) {
  const u = user(id) || {};
  return { name: u.name || "", nick: u.nick || "", role: u.role || "", user_id: u.id || 0, joined: u.created_at || 0, post_count: data.posts.filter((p) => p.user_id === u.id).length };
}
module.exports = store;
