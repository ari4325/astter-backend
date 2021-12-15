const express = require('express');
const fetch = require('cross-fetch');
const User = require('../Db/User');
const router = express.Router();
const SocialItem = require('../Db/SocialItem');

router.post('/set', async (req, res) => {
    const {username, address, img } = req.query;

    var user = new User({
        username: username,
        address: address,
        img: img,
        items: []
    });

    try{
        user = await user.save();
        console.log(user);

        const options = {
            method: 'GET',
            headers: {
                "X-API-Key": "UAne0BxcE0SXi9D7v45d2Qxa47BelgdmpkRTjV8bXRjycLNRj5OTXegebmKJVgBn"
            },
        };

        await fetch('https://deep-index.moralis.io/api/v2/' + address + '/nft?chain=ropsten&format=decimal', options)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                nfts = data['result'];
                nfts.forEach(async (element) => {
                    console.log(element);

                    await fetch(element['token_uri'])
                        .then(response => response.json())
                        .then(async(data2) => {
                            console.log(data2);

                            let socialItem = new SocialItem({
                                owner_address: user['address'],
                                name: data2['name'],
                                owner: username,
                                img_url: data2['url']
                            });

                            await socialItem.save();
                            await user.updateOne({$push: {items: socialItem}});
                        });
                });
            });

        return res.status(200).json({"error": false, "response": "User created successfully", "user": user});
        
    }catch(e){
        console.log(e);
    }
    return res.status(200).send({"error": true, "response": "User could not be created successfully"});
    
});

router.get('/get', async(req, res) => {
    const { address } = req.query;
    console.log(address);
    const user = await User.findOne({address: address});

    if(!user) return res.status(200).send({"error": true, "response": "User could not be found"});

    return res.status(200).json({"error": false, "response": "User found successfully", "user": user});
})

router.get('/nfts', async(req, res) => {
    try{
        SocialItem.find({}, function(err, nfts) {
            if(err) return res.status(400).send({ "status" : 0, "response" : err });
            return res.status(200).json({"error": false, "response": "NFTs found successfully", "nfts": nfts});
        });
    }catch(err){
        console.log(err);
    }
})

router.put('/follow', async (req, res) => {
    const { user_id,  follower_id } = req.query;
    console.log(follower_id);
    try{
        let user = await User.findOne({_id: user_id, following: { $elemMatch: {_id: follower_id}}});
        if(user) return res.status(400).json({"error": true, "response": "Already following", "user": user});
        
        user = await User.findOne({_id: user_id});
        const follower = await User.findOne({_id: follower_id});

        await user.updateOne({$push: {following: follower._id}});
        await follower.updateOne({$push: {follower: user._id}});
        return res.status(200).json({"error": false, "response": "User Followed successfully", "user": user});
    }catch(e){
        console.log(e);
    }
    
})


module.exports = router;

