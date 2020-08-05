export default {
    users(parent, args, { db }, info) {
        if (args.query) {
            return db.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        }
        return db.users
    },
    posts(parent, args, { db }, info) {
        if (args.query) {
            return db.posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
            })
        }
        return db.posts
    },
    comments(parent, args, { db }, info) {
        return db.comments
    },
    me(parent, args, ctx, info) {
        return {
            id: '123098',
            name: 'John',
            email: 'John@mail.com'
        }
    },
    post(parent, args, ctx, info) {
        return {
            id: '5678',
            title: 'Test',
            body: 'Test',
            published: false
        }
    }
}