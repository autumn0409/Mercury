
export const checkEmailTaken = (db, email) => {
    return new Promise((resolve, reject) => {
        db.collection('users').find({ email: email }, async (err, result) => {
            if (err)
                throw err;
            else {
                let resultArray = await result.toArray();
                resolve(resultArray.length !== 0);
            }
        });
    })
}

export const checkUserExists = (db, author) => {
    return new Promise((resolve, reject) => {
        db.collection('users').find({ id: author }, async (err, result) => {
            if (err)
                throw err;
            else {
                let resultArray = await result.toArray();
                resolve(resultArray.length !== 0);
            }
        });
    })
}

export const checkPostExists = (db, post) => {
    return new Promise((resolve, reject) => {
        db.collection('posts').find({ $and: [{ id: post }, { published: true }] }, async (err, result) => {
            if (err)
                throw err;
            else {
                let resultArray = await result.toArray();
                resolve(resultArray.length !== 0);
            }
        });
    })
}