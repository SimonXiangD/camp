const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const mLandModel = require('./models/campGround.js')
const bindModel = require('./models/mysteryLandTitle.js')
const mLandMethod = require('./utility.js')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const expressError = require('./expressError.js')
const catchAsync = require('./catchAsync.js')

const { mLandSchema } = require('./schemaValidation.js')



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

const validateMLand = (req, res, next) => {
    const { error } = mLandSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}


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
app.get('/mysteryLand/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const ml = await mLandModel.findById(id);
    console.log(ml)
    res.render('details.ejs', { ml });

}))

// 添加秘境
app.get('/addMLand', async (req, res) => {
    res.render('new.ejs');
})

// app.post('/sendNewMLand', async (req, res) => {
//     // console.log(req.body)
//     // console.log()
//     const dic = req.body
//     // arr = [];
//     // arr.push(dict.title === null ?  : dict.title)
//     let tmp;
//     if (Object.values(dic).length == 0) tmp = (await mLandMethod.createRandomML());
//     // console.log(Object.values(dic)[0])
//     else tmp = mLandMethod.createMysteryLand(Object.values(dic));
//     // console.log(tmp);
//     tmp.save();
//     res.redirect('/mysteryLand/' + tmp._id);
// })

// app.post('/mysteryLand', validateMLand, async (req, res) => {
app.post('/mysteryLand', async (req, res) => {

    // 这里可以加一个joi（object model）来验证post时各种属性必须要满足的条件，不满足就报错，但是我懒得搞了
    let tmp;
    if (Object.values(req.body).length == 0) tmp = (await mLandMethod.createRandomML());
    else tmp = new mLandModel(req.body.ml);
    await (tmp.save());
    res.redirect(`/mysteryLand/${tmp._id}`)
})

app.get('/justTrial', async (req, res) => {
    // await mLandModel.deleteMany({});
    // for (let i = 0; i < 10; i++) {
    //     (await mLandMethod.createRandomML()).save();
    // }
})



app.get('/mysteryLand/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const ml = await mLandModel.findById(id);
    res.render('edit.ejs', { ml });
}))

// 这里可以使用validateMLand， 但我觉得没有必要
app.put('/mysteryLand/:id', catchAsync(async (req, res) => {

    // app.put('/mysteryLand/:id', validateMLand, catchAsync(async (req, res) => {
    // res.send('it worked!');

    const { id } = req.params;
    const tmp = await mLandModel.findByIdAndUpdate(id, { ...req.body.ml })
    console.log(req.body.ml)
    res.redirect('/mysteryLand/' + tmp._id)



}))

app.get('/index', async (req, res) => {
    const mls = await mLandModel.find({});
    // console.log(mls)
    res.render('index.ejs', { mls });
})

app.delete('/mysteryLand/:id', catchAsync(async (req, res) => {
    // res.send('it worked!');

    const { id } = req.params;
    await mLandModel.findByIdAndDelete(id);
    // console.log(req.body.ml)
    res.redirect('/home')

}))

app.get('/nihao/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    if (id == '0') res.send("你好");
    else throw new expressError("lll", 114514)
}))

app.all("*", (req, res, next) => {
    next(new expressError('没有找到页面', 404))
})

app.use((err, req, res, next) => {
    let { status = 500, message = 'default error .*.' } = err;
    console.log(err.message)
    res.status(status);
    message = "afdlgfhag"
    res.render('partials/errorPage', { err })
    // res.send(message)
    // res.send("妈妈生的");
    // console.log(err)
})

app.listen(3000, () => {
    console.log("This is on port 3000 by dirnot!");
})


// console.log("你好")
