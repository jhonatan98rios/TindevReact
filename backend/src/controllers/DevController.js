const axios = require('axios');
const Dev = require('../models/Dev');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

module.exports = {
    async index(req, res){
        const { user } = req.headers;
        const loggedDev = await Dev.findById(user);
        
        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } }, /* Retorna todos que não são o usuario */
                { _id: { $nin: loggedDev.likes } }, /* Retorna todos que não estão na lista de likes */
                { _id: { $nin: loggedDev.dislikes } } /* Retorna todos que não estão na lista de dislikes */
            ]
        });

        return res.json(users);
        
    },

    async store(req, res) {

        const { username } = req.body; /* const username = req.body.username */

        const userExists = await Dev.findOne({ user: username }); /* Função monmgoose que busca um valor no BD e retorna um booleano */

        if(userExists){
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        const {name, bio, avatar_url} = response.data;

        const dev = await Dev.create({
            name:name,
            user: username,
            bio:bio,
            avatar:avatar_url
        })

        return res.json(dev);
    }
}