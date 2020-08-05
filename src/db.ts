const users = [{
    id: '1',
    name: 'Test',
    email: 'test@mail.com',
    age: 24
}, {
    id: '2',
    name: 'Test2',
    email: 'test2@mail.com',
}, {
    id: '3',
    name: 'Test3',
    email: 'test3@mail.com',
    age: 40
}]

const posts = [{
    id: '1',
    title: 'Test',
    body: 'test@mail.com',
    published: false,
    author: '1',
}, {
    id: '2',
    title: 'Test2',
    body: 'test2@mail.com',
    published: false,
    author: '1',
}, {
    id: '3',
    title: 'Test3',
    body: 'test3@mail.com',
    published: true,
    author: '2',
}]

const comments = [{
    id: '1',
    text: 'Test',
    author: '1',
    post: '1',
}, {
    id: '2',
    text: 'Test2',
    author: '2',
    post: '2',
}, {
    id: '3',
    text: 'Test3',
    author: '2',
    post: '3',
}]

export default {
    users,
    posts,
    comments
}