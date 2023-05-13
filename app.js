const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const mLandModel = require('./models/campGround.js')
const bindModel = require('./models/mysteryLandTitle.js')
const mLandMethod = require('./utility.js')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "连接失败："));
db.once("open", () => {
    console.log("成功连接！")
})

app.engine('ejs', ejsMate)
app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// app.get('/', (req, res) => {
//     // res.send("妈妈的");
//     res.render('home');
// })

// 添加随机字符
app.get('/addName', (req, res) => {
    res.render('add.ejs');
})

// 添加秘境随机字符
app.post('/sendInfoLoc', async (req, res) => {
    // console.log(req.body)
    // mLandMethod.deleteALlLand();

    console.log(req.body);
    mLandMethod.saveMysteryLand(Object.values(req.body), mLandMethod.createLocationName);

})
app.post('/sendInfoTitle', async (req, res) => {
    // console.log(req.body)
    // mLandMethod.deleteALlLand();

    console.log(req.body);
    mLandMethod.saveMysteryLand(Object.values(req.body), mLandMethod.createTitle);

})
app.post('/sendInfoDescript', async (req, res) => {
    // console.log(req.body)
    // mLandMethod.deleteALlLand();

    console.log(req.body);
    mLandMethod.saveMysteryLand(Object.values(req.body), mLandMethod.createDescript);

})

// 首页
app.get('/home', async (req, res) => {
    const mls = await mLandModel.find({});
    // console.log(mls)
    res.render('home', { mls });
})

// 到某个秘境的专属页面
app.get('/mysteryLand/:id', async (req, res) => {
    const { id } = req.params;
    const ml = await mLandModel.findById(id);
    res.render('details.ejs', { ml });
    // console.log(ml)
    // console.log(ml.image)
})

// 添加秘境
app.get('/addMLand', async (req, res) => {
    res.render('new.ejs');
})

app.post('/sendNewMLand', async (req, res) => {
    // console.log(req.body)
    // console.log()
    const dic = req.body
    // arr = [];
    // arr.push(dict.title === null ?  : dict.title)
    let tmp;
    if (Object.values(dic).length == 0) tmp = (await mLandMethod.createRandomML());
    else tmp = mLandMethod.createMysteryLand(Object.values(dic));
    // console.log(tmp);
    tmp.save();
    res.redirect('/mysteryLand/' + tmp._id);
})

// app.get('/justTrial', async (req, res) => {
//     // await mLandModel.deleteMany({});
//     for (let i = 0; i < 10; i++) {
//         (await mLandMethod.createRandomML()).save();
//     }
// })

app.get('/mysteryLand/:id/edit', async (req, res) => {
    const { id } = req.params;
    const ml = await mLandModel.findById(id);
    res.render('edit.ejs', { ml });
})

app.listen(3000, () => {
    console.log("This is on port 3000 by dirnot!");
})

app.put('/mysteryLand/:id', async (req, res) => {
    // res.send('it worked!');

    const { id } = req.params;
    const tmp = await mLandModel.findByIdAndUpdate(id, { ...req.body.ml })
    console.log(req.body.ml)
    res.redirect('/mysteryLand/' + tmp._id)



})

app.get('/index', async (req, res) => {
    const mls = await mLandModel.find({});
    // console.log(mls)
    res.render('index.ejs', { mls });
})

app.delete('/mysteryLand/:id', async (req, res) => {
    // res.send('it worked!');

    const { id } = req.params;
    await mLandModel.findByIdAndDelete(id);
    // console.log(req.body.ml)
    res.redirect('/home')

})