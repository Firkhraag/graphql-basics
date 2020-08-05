import { v4 as uuid } from 'uuid'

export default {
    createUser(parent, { data }, { db }, info) {
        const emailTaken = db.users.some((user) => user.email === data.email)
        if (emailTaken) {
            throw new Error('Email is taken')
        }

        const user = {
            id: uuid(),
            ...data,
        }

        db.users.push(user)
        return user
    },
    deleteUser(parent, { id }, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === id)
        if (!userIndex) {
            throw new Error('User not found')
        }

        db.posts = db.posts.filter((post) => {
            const isMatch = post.author === id

            if (isMatch) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }

            return !isMatch
        })

        db.comments = db.comments.filter((comment) => comment.author !== id)

        return db.users.splice(userIndex, 1)[0]
    },
    updateUser(parent, { id, data }, { db }, info) {
        const user = db.users.find((user) => user.id === id)
        if (!user) {
            throw new Error('User not found')
        }

        if (typeof data.email === 'string') {
            const isEmailTaken = db.users.some((user) => user.email === data.email)
            if (isEmailTaken) {
                throw new Error('Email taken')
            }

            user.email = data.email
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user
    },
    createPost(parent, { data }, { db, pubsub }, info) {

        if (!db.users.some((user) => user.id === data.author)) {
            throw new Error('Author not found')
        }

        const post = {
            id: uuid(),
            ...data,
        }

        db.posts.push(post)
        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post,
                }
            })
        }
        return post
    },
    deletePost(parent, { id }, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === id)
        if (!postIndex) {
            throw new Error('Post not found')
        }

        db.comments = db.comments.filter((comment) => comment.post !== id)

        const deletedPost = db.posts.splice(postIndex, 1)[0]
        if (deletedPost.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost,
                }
            })
        }

        return deletedPost
    },
    updatePost(parent, { id, data }, { db, pubsub }, info) {
        const post = db.posts.find((post) => post.id === id)
        const originalPost = { ...post }
        if (!post) {
            throw new Error('Post not found')
        }

        if (typeof data.title === 'string') {
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published

            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost,
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post,
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post,
                }
            })
        }

        return post
    },
    createComment(parent, { data }, { db, pubsub }, info) {

        if (!db.users.some((user) => user.id === data.author)) {
            throw new Error('Author not found')
        }

        if (!db.posts.some((post) => post.id === data.post)) {
            throw new Error('Post not found')
        }

        const comment = {
            id: uuid(),
            ...data,
        }

        db.comments.push(comment)
        pubsub.publish(`comment ${data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment,
            }
        })
        return comment
    },
    deleteComment(parent, { id }, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === id)
        if (!commentIndex) {
            throw new Error('Comment not found')
        }

        const deletedComment = db.comments.splice(commentIndex, 1)[0]
        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment,
            }
        })
        return deletedComment
    },
    updateComment(parent, { id, text }, { db, pubsub }, info) {
        const comment = db.comments.find((comment) => comment.id === id)
        if (!comment) {
            throw new Error('Comment not found')
        }

        comment.text = text

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment,
            }
        })

        return comment
    },
}