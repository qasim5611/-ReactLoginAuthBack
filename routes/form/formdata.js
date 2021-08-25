const Form = require("../../Models/FormSchema");


const Forms = {
  create_form: async function (req, res) {
    try {
      let { name, phone, image } = req.body;
      // let image ;

      // if (req.file) image = `${req.file.fieldname}-${req.file.originalname}`;

      // The data is valid and new we can register the user
      let newUser = new Form({
        name,
        phone,
        image,
      });

      let result = await newUser.save();

      return res.json(result);
    } catch (err) {
      return res.status(err.status || 500).send(err.message);
    }
  },

  get_form: async function (req, res) {
    console.log("comming");
    try {
      const user = await Form.find();

      return res.json(user);
    } catch (error) {
      console.log(error);
    }
  },

  del_form: async function (req, res) {
    let find = await Form.findById(req.body.id);

    if (find) {
      await find.delete();
      // res.json("Gallery Deleted");
      return res.json(find);
    } else {
      throw new Error("Book not Found");
    }
  },


  gupdate_form: async function (req, res) {
    console.log("req.body.docId", req.body.id);
    let data = Object.assign({}, req.body);
    let user_id = req.body.id;
    let image;
    if (req.file) {
      image = `${req.file.fieldname}-${req.file.originalname}`;
      data.image = image;
    }

    let update = await Form.findOneAndUpdate({ _id: user_id }, data);
if (update) {
  return res.json("Successfully Updated");
}
  },

  // getFeaturedItems: async function (req, res) {
  //   try {
  //     const featuredItems = await Gallery.find({ isFeatured: true }).sort({
  //       created_at: -1,
  //     });

  //     return res.json(featuredItems);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  // getOneArticle: async function (req, res) {
  //   try {
  //     let data = Object.assign({}, req.body);
  //     const article = await Gallery.find({ _id: data.id });

  //     return res.json(article);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  // getCategoryArticles: async function (req, res) {
  //   try {
  //     let data = Object.assign({}, req.body);
  //     let articles = null;
  //     if (data.category_id) {
  //       articles = await Gallery.find({ category_id: data.category_id });
  //     }
  //     if (data.sub_category) {
  //       articles = await Gallery.find({ sub_category: data.sub_category });
  //     }
  //     return res.json(articles);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};

module.exports = Forms;
