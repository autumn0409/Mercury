
export const checkEmailTaken = (db, email) => {
    return new Promise((resolve, reject) => {
        db.collection('users').findOne({ email: email }, (err, result) => {
            if (err)
                throw err;
            else
                resolve(result !== null);
        });
    })
}

export const checkUsernameTaken = (db, username) => {
    return new Promise((resolve, reject) => {
        db.collection('users').findOne({ username: username }, (err, result) => {
            if (err)
                throw err;
            else
                resolve(result !== null);
        });
    })
}

export const checkPostExists = (db, post) => {
    return new Promise((resolve, reject) => {
        db.collection('posts').findOne({ $and: [{ id: post }, { published: true }] }, (err, result) => {
            if (err)
                throw err;
            else
                resolve(result !== null);
        });
    })
}