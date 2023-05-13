const mongoose = require('mongoose');

const mLand = require('./models/campGround.js')
const bundleModel = require('./models/mysteryLandTitle.js')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Mongoose Connected!'))
    .catch(e => {
        console.log("mongo seems to work wrongly...")
        console.log(e)
    });

function createMysteryLand(arr) {
    return new mLand({
        title: arr[0],
        price: arr[1],
        description: arr[2],
        location: arr[3],
    })
}

function createLocationName(arr) {
    return new bundleModel.locationModel({
        name: arr[0],
    })
}

function createTitle(arr) {
    return new bundleModel.titleModel({
        name: arr[0],
    });
}

function createDescript(arr) {
    return new bundleModel.descripModel({
        name: arr[0],
    });
}

async function saveMysteryLand(arr, fn) {
    let ml = fn(arr);
    await ml.save()
        .then(res => {
            console.log('秘境创建成功！');
            // console.log(res);
        })
        .catch(e => {
            console.log(e);
        })
}

async function deleteALlLand() {
    await mLand.deleteMany({});
}

async function createRandomML() {
    // let tmp = new mLand({
    //     title:
    // })

    // const tmp = mLand.aggregate([{ $sample: { size: 1 } }])
    let max = 10000
    // let tmp = await getRandomItem(bundleModel.titleModel);
    // console.log(tmp)
    // console.log(tmp.name)
    const ans = new mLand({
        title: (await getRandomItem(bundleModel.titleModel)).name,
        price: Math.floor(Math.random() * max),
        description: (await getRandomItem(bundleModel.descripModel)).name,
        location: (await getRandomItem(bundleModel.locationModel)).name,
        // image: (await getRandomItem(bundleModel.imageModel)).name,
        image: "https://source.unsplash.com/random/?mountain,sea,sky",
    });
    // console.log(ans);
    return ans;
}

async function getRandomItem(Item) {
    const numItems = await Item.estimatedDocumentCount()
    const rand = Math.floor(Math.random() * numItems)
    const randomItem = await Item.findOne().skip(rand)
    return randomItem
}


module.exports = {
    createMysteryLand, saveMysteryLand, createLocationName, deleteALlLand,
    createTitle, createDescript, createRandomML, getRandomItem
};